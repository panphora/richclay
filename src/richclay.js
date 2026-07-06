import {
  createDefaultRegistry,
  presets
} from "./buttons.js";
import { Toolbar } from "./toolbar.js";
import { FloatingToolbar } from "./toolbar-float.js";
import {
  createSanitizer,
  flattenFragmentToSingleLine,
  inlineSanitizeConfig,
  normalizeUrl,
  sanitizeHTML as sanitizeHTMLString,
  sanitizeElement as sanitizeElementInPlace
} from "./sanitize.js";
import {
  RICHCLAY_SELECTOR,
  consumeInertContenteditable,
  installHyperclayBridge,
  isHyperclayEditMode,
  markChrome,
  parseEditableOptions,
  removeRuntimeState,
  shouldActivateEditor,
  shouldUseHyperclay,
  stripRichClayFromClone
} from "./hyperclay.js";
import { ensureStyles } from "./styles.js";
import {
  announce,
  cloneRange,
  connectDescription,
  createLiveRegion,
  getSquireSelection,
  restoreSquireSelection,
  setRuntimeAttribute
} from "./a11y.js";

const instances = new WeakMap();
const autoInitWindows = new WeakSet();
const watchedWindows = new WeakSet();
const globalRegistry = createDefaultRegistry();
const KEEP_FOCUS = Symbol("richclay-keep-focus");
let dialogSeq = 0;

const defaultOptions = {
  toolbar: "standard",
  toolbarContainer: null,
  sanitize: {},
  placeholder: "",
  readOnly: false,
  hyperclay: "auto",
  onChange: null,
  Squire: null,
  inline: false,
  singleLine: false,
  toolbarOnSelect: false
};

export default class RichClay {
  static presets = presets;
  static selector = RICHCLAY_SELECTOR;

  constructor(element, options = {}) {
    if (!element) throw new Error("RichClay requires an element.");
    const existing = instances.get(element);
    if (existing) return existing;

    this.element = element;
    const derived = { ...parseEditableOptions(element), ...options };
    this.options = { ...defaultOptions, ...derived };
    if (this.options.singleLine && !("toolbar" in derived)) {
      this.options.toolbar = "inline";
    }
    this.registry = new Map(globalRegistry);
    this.toolbar = null;
    this.float = null;
    this._onToolbarKey = null;
    this._onFloatFocusOut = null;
    this.liveRegion = null;
    this.description = null;
    this.dialog = null;
    this.savedSelection = null;
    this.path = "";
    this.active = false;
    this._squire = null;
    this._squireListeners = [];
    this._onBeforeInput = null;
    this._shortcutKeys = [];
    this._onFocus = () => {
      this.element.classList.add("richclay-focused");
      if (this.options.inline) this.ensureFloatingToolbar();
    };
    this._onBlur = event => {
      this.element.classList.remove("richclay-focused");
      if (this.options.inline) this.scheduleFloatTeardown(event);
    };

    this.ensureMarker();
    this.hyperclay = shouldUseHyperclay(this.options, this.window);
    if (this.hyperclay) installHyperclayBridge(this.window);

    instances.set(element, this);

    this.sanitizeConfig = this.options.inline
      ? inlineSanitizeConfig(this.options.sanitize)
      : this.options.sanitize;
    this.sanitizer = createSanitizer(this.sanitizeConfig, this.element.ownerDocument);
    if (!this.options.inline) {
      // Card editors sanitize their region up front. Inline editors must not:
      // the content is the page's own live DOM, and rewriting it on activation
      // would destroy author markup (classes, images, data attributes).
      sanitizeElementInPlace(this.element, this.sanitizeConfig);
    }

    if (shouldActivateEditor(this.options, this.window)) {
      this.activate();
    }
  }

  get squire() {
    return this._squire;
  }

  get window() {
    return this.element.ownerDocument.defaultView || window;
  }

  static init(selector = RICHCLAY_SELECTOR, options = {}) {
    const elements = resolveElements(selector);
    return elements.map(element => new RichClay(element, options));
  }

  static autoInit(win = typeof window !== "undefined" ? window : undefined) {
    if (!win || !win.document || autoInitWindows.has(win)) return;
    autoInitWindows.add(win);
    const run = () => {
      if (shouldUseHyperclay({}, win) && isHyperclayEditMode(win)) {
        RichClay.init();
        RichClay.watch(win);
      }
    };
    if (win.document.readyState === "loading") {
      win.document.addEventListener("DOMContentLoaded", run, { once: true });
    } else {
      run();
    }
  }

  static watch(win = typeof window !== "undefined" ? window : undefined, options = {}) {
    if (!win || !win.document || watchedWindows.has(win)) return;
    watchedWindows.add(win);

    const mount = element => {
      if (!instances.has(element)) new RichClay(element, options);
    };
    const unmount = element => instances.get(element)?.destroy();

    const observer = new win.MutationObserver(records => {
      records.forEach(record => {
        if (record.type === "attributes") {
          const target = record.target;
          if (target.matches?.(RICHCLAY_SELECTOR)) mount(target);
          else unmount(target);
          return;
        }
        record.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          if (node.matches?.(RICHCLAY_SELECTOR)) mount(node);
          node.querySelectorAll?.(RICHCLAY_SELECTOR).forEach(mount);
        });
        record.removedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          // A node that is still connected was moved, not removed; keep its
          // editor alive.
          const teardown = el => {
            if (!el.isConnected) instances.get(el)?.destroy();
          };
          if (node.matches?.(RICHCLAY_SELECTOR)) teardown(node);
          node.querySelectorAll?.(RICHCLAY_SELECTOR).forEach(teardown);
        });
      });
    });

    observer.observe(win.document.documentElement || win.document, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["editable", "data-richclay", "richclay"]
    });
  }

  static registerButton(def) {
    validateButton(def);
    globalRegistry.set(def.id, def);
    return RichClay;
  }

  static unregisterButton(id) {
    globalRegistry.delete(id);
    return RichClay;
  }

  static stripFromClone(docElem) {
    stripRichClayFromClone(docElem);
  }

  registerButton(def) {
    validateButton(def);
    this.registry.set(def.id, def);
    if (this.active) this.renderToolbar();
    return this;
  }

  unregisterButton(id) {
    this.registry.delete(id);
    if (this.active) this.renderToolbar();
    return this;
  }

  activate() {
    if (this.active) return;

    this.active = true;
    ensureStyles(this.element.ownerDocument);
    consumeInertContenteditable(this.element);

    const initialHTML = this.element.innerHTML;
    const Squire = this.options.Squire || this.window.Squire || globalThis.Squire;
    if (!Squire) {
      throw new Error("RichClay requires Squire. Load vendor/squire.js before richclay.js.");
    }

    this.setupEditorAttributes();
    this.liveRegion = createLiveRegion(this.element.ownerDocument);

    this._squire = new Squire(this.element, {
      blockTag: "P",
      sanitizeToDOMFragment: (html, editor) => {
        const fragment = this.sanitizer.sanitizeToDOMFragment(html, editor);
        return this.options.singleLine ? flattenFragmentToSingleLine(fragment) : fragment;
      },
      didError: error => {
        console.error("RichClay/Squire error", error);
      }
    });
    if (this.options.inline) {
      // Fidelity-first: Squire's constructor wiped the root; put the captured
      // markup back verbatim. Running it through setHTML would sanitize and
      // re-wrap the page's own content into blocks on mere activation.
      this.element.innerHTML = initialHTML;
      this.resetSquireUndoBaseline();
    } else {
      this._squire.setHTML(initialHTML);
    }

    this.bindSquire();
    if (this.options.singleLine) this.installSingleLineGuards();
    this.installShortcuts();
    if (this.options.inline) {
      this._onToolbarKey = event => {
        if (event.altKey && event.key === "F10") {
          event.preventDefault();
          this.ensureFloatingToolbar();
          this.float?.toolbar.focusFirst();
        }
      };
      this.element.addEventListener("keydown", this._onToolbarKey);
    }
    this.renderToolbar();
    this.updatePlaceholder();
  }

  getHTML() {
    return this._squire ? this._squire.getHTML() : this.element.innerHTML;
  }

  setHTML(html) {
    if (this._squire) {
      this._squire.setHTML(String(html || ""));
    } else {
      this.element.innerHTML = sanitizeHTMLString(
        html,
        this.sanitizeConfig,
        this.element.ownerDocument
      );
    }
    this.updatePlaceholder();
    this.toolbar?.update();
    this.options.onChange?.(this.getHTML());
    return this;
  }

  focus() {
    if (this._squire) this._squire.focus();
    else this.element.focus();
    return this;
  }

  destroy() {
    this.closeLinkDialog();
    this.teardownFloatingToolbar();
    this.toolbar?.destroy();
    this.toolbar = null;
    if (this._onToolbarKey) {
      this.element.removeEventListener("keydown", this._onToolbarKey);
      this._onToolbarKey = null;
    }
    this.liveRegion?.remove();
    this.liveRegion = null;
    this.description?.remove();
    this.description = null;

    this._shortcutKeys.forEach(key => this._squire?.setKeyHandler?.(key, null));
    this._squireListeners.forEach(([type, listener]) => {
      this._squire?.removeEventListener?.(type, listener);
    });
    this._squireListeners = [];
    this._shortcutKeys = [];

    if (this._onBeforeInput) {
      this.element.ownerDocument.removeEventListener("beforeinput", this._onBeforeInput, true);
      this._onBeforeInput = null;
    }

    this._squire?.destroy?.();
    this._squire = null;
    this.cleanupEditorAttributes();

    instances.delete(this.element);
  }

  saveSelection() {
    this.savedSelection = getSquireSelection(this._squire) || this.savedSelection;
    return this.savedSelection;
  }

  restoreSelection() {
    return restoreSquireSelection(this._squire, this.savedSelection);
  }

  runControl(def) {
    if (!this._squire || typeof def.run !== "function") return;
    this.restoreSelection();
    const result = def.run(this);
    this.saveSelection();
    this.toolbar?.update();
    this.updatePlaceholder();
    this.announceControl(def);

    if (result !== KEEP_FOCUS) {
      this.focus();
    }
  }

  selectionHasFormat(tag) {
    if (!tag || !this._squire?.hasFormat) return false;
    try {
      return this._squire.hasFormat(tag);
    } catch {
      return false;
    }
  }

  pathHas(tag) {
    const path = this._squire?.getPath?.() ?? this.path ?? "";
    return new RegExp(`(?:^|>)${tag}(?:[.#\\[]|>|$)`, "i").test(path);
  }

  toggleFormat(tag, addMethod, removeMethod) {
    if (this.selectionHasFormat(tag)) return this._squire[removeMethod]();
    return this._squire[addMethod]();
  }

  toggleList(tag) {
    if (this.pathHas(tag)) return this._squire.removeList();
    return tag === "UL" ? this._squire.makeUnorderedList() : this._squire.makeOrderedList();
  }

  indent() {
    if (this.pathHas("UL") || this.pathHas("OL")) return this._squire.increaseListLevel();
    return this._squire.increaseQuoteLevel();
  }

  outdent() {
    if (this.pathHas("UL") || this.pathHas("OL")) return this._squire.decreaseListLevel();
    return this._squire.decreaseQuoteLevel();
  }

  setBlockType(tag) {
    const target = tag.toUpperCase();
    if (target === "BLOCKQUOTE") return this._squire.increaseQuoteLevel();

    return this._squire.modifyBlocks(fragment => {
      const doc = this.element.ownerDocument;
      const output = doc.createDocumentFragment();

      Array.from(fragment.childNodes).forEach(node => {
        if (node.nodeType !== 1) {
          output.appendChild(node);
          return;
        }

        if (node.nodeName === target) {
          output.appendChild(node);
          return;
        }

        const replacement = doc.createElement(target);
        while (node.firstChild) replacement.appendChild(node.firstChild);
        output.appendChild(replacement);
      });

      return output;
    });
  }

  openLinkDialog() {
    this.saveSelection();
    this.closeLinkDialog();

    const doc = this.element.ownerDocument;
    const existing = this.currentLinkHref();
    const dialog = doc.createElement("form");
    const labelId = `richclay-link-label-${++dialogSeq}`;
    dialog.className = "richclay-dialog";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", labelId);
    dialog.setAttribute("data-richclay-dialog", "");
    markChrome(dialog);
    dialog.innerHTML = `
      <div class="richclay-dialog-title" id="${labelId}">${existing ? "Edit link" : "Insert link"}</div>
      <label class="richclay-field">
        <span>URL</span>
        <input class="richclay-input" name="url" type="text" inputmode="url" autocomplete="url" placeholder="https://example.com">
      </label>
      <div class="richclay-dialog-actions">
        <button type="button" class="richclay-secondary" data-richclay-cancel>Cancel</button>
        <button type="submit" class="richclay-primary">Apply</button>
      </div>
    `;

    const close = () => {
      this.closeLinkDialog();
      this.toolbar?.update();
      this.focus();
    };

    dialog.addEventListener("submit", event => {
      event.preventDefault();
      const data = new FormData(dialog);
      const href = normalizeUrl(data.get("url"));
      if (!href) {
        announce(this.liveRegion, "Enter a valid URL");
        return;
      }
      this.restoreSelection();
      const anchor = this.currentLinkElement();
      if (anchor) this.selectElement(anchor);
      this._squire.makeLink(href);
      announce(this.liveRegion, "Link applied");
      close();
    });
    dialog.querySelector("[data-richclay-cancel]").addEventListener("click", close);
    dialog.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "Tab") {
        trapTab(event, dialog);
      }
    });

    const mount = this.toolbar?.root || this.element;
    mount.insertAdjacentElement("afterend", dialog);
    this.dialog = dialog;

    const input = dialog.querySelector("input");
    input.value = existing;
    input.focus();
    input.select();
    return KEEP_FOCUS;
  }

  currentLinkElement() {
    const range = getSquireSelection(this._squire);
    let node = range?.commonAncestorContainer || null;
    if (node && node.nodeType !== 1) node = node.parentElement;
    return node?.closest?.("a[href]") || null;
  }

  currentLinkHref() {
    const anchor = this.currentLinkElement();
    return anchor ? anchor.getAttribute("href") || "" : "";
  }

  selectElement(node) {
    const range = node.ownerDocument.createRange();
    range.selectNode(node);
    this._squire.setSelection(range);
    this.saveSelection();
    return range;
  }

  closeLinkDialog() {
    this.dialog?.remove();
    this.dialog = null;
  }

  ensureMarker() {
    if (
      !this.element.hasAttribute("data-richclay") &&
      !this.element.hasAttribute("richclay") &&
      !this.element.hasAttribute("editable")
    ) {
      this.element.setAttribute("data-richclay", "");
    }
  }

  setupEditorAttributes() {
    this.element.classList.add(
      this.options.inline ? "richclay-inline" : "richclay-editor",
      "richclay-active"
    );
    this.element.setAttribute("data-richclay-active", "true");

    if (!this.element.hasAttribute("data-richclay-runtime-contenteditable")) {
      const original = this.element.getAttribute("contenteditable");
      if (original === null) {
        this.element.setAttribute("data-richclay-runtime-contenteditable", "true");
      } else if (original !== "true" && original !== "") {
        // A bare contenteditable attribute is the "true" state; only meaningful
        // non-default values are recorded for restore.
        this.element.setAttribute("data-richclay-runtime-contenteditable", original);
      }
    }
    this.element.setAttribute("contenteditable", "true");

    if (!this.element.hasAttribute("role")) {
      setRuntimeAttribute(this.element, "role", "textbox", "data-richclay-runtime-role");
    }
    if (!this.element.hasAttribute("aria-multiline")) {
      setRuntimeAttribute(
        this.element,
        "aria-multiline",
        this.options.singleLine ? "false" : "true",
        "data-richclay-runtime-aria-multiline"
      );
    }

    // Squire owns this region's undo stack. Mark the region so Hyperclay's
    // optional page-level undo (hyper-undo) defers to Squire instead of fighting
    // it. Runtime-only: stripped on save, re-applied on the next edit-mode load.
    if (!this.element.hasAttribute("no-undo")) {
      setRuntimeAttribute(this.element, "no-undo", "", "data-richclay-runtime-no-undo");
    }

    if (this.options.placeholder) {
      this.element.setAttribute("data-richclay-placeholder", this.options.placeholder);
      this.description = this.element.ownerDocument.createElement("div");
      this.description.id = `richclay-placeholder-${++dialogSeq}`;
      this.description.className = "richclay-sr-only";
      this.description.textContent = this.options.placeholder;
      this.description.setAttribute("data-richclay-live", "");
      markChrome(this.description);
      this.element.insertAdjacentElement("afterend", this.description);
      connectDescription(this.element, this.description);
    }

    this.element.addEventListener("focus", this._onFocus);
    this.element.addEventListener("blur", this._onBlur);
  }

  cleanupEditorAttributes() {
    removeRuntimeState(this.element, "destroy");
    this.element.removeEventListener("focus", this._onFocus);
    this.element.removeEventListener("blur", this._onBlur);
  }

  bindSquire() {
    const input = () => {
      this.saveSelection();
      this.updatePlaceholder();
      this.options.onChange?.(this.getHTML());
      this.toolbar?.update();
    };
    const pathChange = event => {
      this.path = event.detail?.path || this._squire.getPath?.() || "";
      this.saveSelection();
      this.toolbar?.update();
    };
    const selection = () => {
      this.saveSelection();
      this.toolbar?.update();
      if (this.options.toolbarOnSelect) this.updateFloatVisibility();
    };
    const undoState = () => this.toolbar?.update();

    [
      ["input", input],
      ["pathChange", pathChange],
      ["select", selection],
      ["cursor", selection],
      ["undoStateChange", undoState]
    ].forEach(([type, listener]) => {
      this._squire.addEventListener(type, listener);
      this._squireListeners.push([type, listener]);
    });
  }

  renderToolbar() {
    if (!this.active || this.options.readOnly) return;
    if (this.options.inline) {
      // Inline toolbars are floating and focus-scoped; if one is open, rebuild
      // it so registry changes show up immediately.
      if (this.float) {
        this.teardownFloatingToolbar();
        this.ensureFloatingToolbar();
      }
      return;
    }
    this.toolbar?.destroy();
    this.toolbar = null;
    const controls = this.resolveToolbarControls(this.options.toolbar);
    if (!controls.length) return;
    this.toolbar = new Toolbar(this, controls, {
      toolbarContainer: this.options.toolbarContainer
    });
  }

  ensureFloatingToolbar() {
    if (this.float || !this.active || this.options.readOnly) return;
    const controls = this.resolveToolbarControls(this.options.toolbar);
    if (!controls.length) return;
    this.float = new FloatingToolbar(this, controls);
    // Blur on the editor doesn't fire when focus later leaves the toolbar or
    // link dialog directly (Alt+F10 then Tab away), so the shell watches its
    // own focusout too.
    this._onFloatFocusOut = event => this.scheduleFloatTeardown(event);
    this.float.root.addEventListener("focusout", this._onFloatFocusOut);
    this.toolbar = this.float.toolbar;
    this.toolbar.update();
    if (this.options.toolbarOnSelect) this.updateFloatVisibility();
  }

  teardownFloatingToolbar() {
    if (!this.float) return;
    if (this._onFloatFocusOut) {
      this.float.root.removeEventListener("focusout", this._onFloatFocusOut);
      this._onFloatFocusOut = null;
    }
    this.float.destroy();
    this.float = null;
    this.toolbar = null;
  }

  scheduleFloatTeardown(event) {
    const next = event?.relatedTarget;
    if (next && this.ownsFocusTarget(next)) return;
    const doc = this.element.ownerDocument;
    const win = doc.defaultView || globalThis;
    win.setTimeout(() => {
      const active = doc.activeElement;
      if (active && this.ownsFocusTarget(active)) return;
      this.teardownFloatingToolbar();
    }, 0);
  }

  ownsFocusTarget(node) {
    return (
      node === this.element ||
      this.element.contains(node) ||
      Boolean(this.float?.root.contains(node)) ||
      Boolean(this.dialog?.contains(node))
    );
  }

  updateFloatVisibility() {
    if (!this.float) return;
    const range = this.savedSelection;
    this.float.setVisible(Boolean(range && !range.collapsed));
  }

  resolveToolbarControls(toolbar) {
    if (toolbar === false || toolbar === null || toolbar === "none") return [];
    const requested = Array.isArray(toolbar) ? toolbar : presets[toolbar] || presets.standard;

    return requested.map(item => {
      if (typeof item === "string") {
        const def = this.registry.get(item);
        if (!def) throw new Error(`Unknown RichClay toolbar control: ${item}`);
        return def;
      }
      if (item?.type === "separator") return item;
      validateButton(item);
      return item;
    });
  }

  installShortcuts() {
    // Shortcuts are a capability of the registry plus this instance's toolbar
    // definitions, not of the visible toolbar: toolbar:false keeps shortcuts,
    // and inline toolbar defs win over registry defs with the same id.
    const seen = new Set();
    // Single-line editors must never gain block commands: registry defaults are
    // filtered to the inline preset (explicit toolbar defs still always bind).
    const registryDefs = [...this.registry.values()].filter(
      def => !this.options.singleLine || presets.inline.includes(def.id)
    );
    const defs = [...this.resolveToolbarControls(this.options.toolbar), ...registryDefs];
    defs.forEach(def => {
      if (def.type === "menu" || def.type === "separator") return;
      if (!def.shortcut || !def.id || seen.has(def.id)) return;
      seen.add(def.id);
      shortcutKeys(def.shortcut).forEach(key => {
        this._squire.setKeyHandler(key, (squire, event) => {
          event.preventDefault();
          this.runControl(def);
        });
        this._shortcutKeys.push(key);
      });
    });
  }

  installSingleLineGuards() {
    ["Enter", "Shift-Enter"].forEach(key => {
      this._squire.setKeyHandler(key, (squire, event) => event.preventDefault());
      this._shortcutKeys.push(key);
    });
    // Belt for input paths that bypass keydown (IME confirm, mobile keyboards):
    // cancel paragraph/line-break insertions before Squire's own handler runs.
    this._onBeforeInput = event => {
      if (!this.element.contains(event.target)) return;
      if (event.inputType === "insertParagraph" || event.inputType === "insertLineBreak") {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    this.element.ownerDocument.addEventListener("beforeinput", this._onBeforeInput, true);
  }

  // The fidelity restore bypasses setHTML, so Squire's undo baseline is still
  // the empty document its constructor recorded; the first undo could wipe the
  // region. Rebase the stack on the restored content. This touches Squire
  // internals (property names survive its esbuild minify) and no-ops for other
  // engines, like the tests' FakeSquire.
  resetSquireUndoBaseline() {
    const squire = this._squire;
    if (!squire || !Array.isArray(squire._undoStack) || typeof squire.saveUndoState !== "function") {
      return;
    }
    squire._undoStack.length = 0;
    squire._undoStackLength = 0;
    squire._undoIndex = -1;
    squire._isInUndoState = false;
    squire.saveUndoState();
  }

  updatePlaceholder() {
    const text = (this.element.textContent || "").replace(/\u200B/g, "").trim();
    const hasMeaningfulElement = this.element.querySelector("img, video, audio, iframe, table");
    const isEmpty = !text && !hasMeaningfulElement;
    this.element.classList.toggle("richclay-empty", isEmpty);
  }

  announceControl(def) {
    if (!this.liveRegion) return;
    const label = def.ariaLabel || def.label;
    if (!label) return;

    if (typeof def.isActive === "function") {
      announce(this.liveRegion, `${label} ${def.isActive(this) ? "on" : "off"}`);
    } else {
      announce(this.liveRegion, `${label} applied`);
    }
  }
}

export { presets };

function resolveElements(selector) {
  if (typeof selector === "string") {
    return Array.from(document.querySelectorAll(selector));
  }
  if (selector?.nodeType === 1) return [selector];
  return Array.from(selector || []);
}

function validateButton(def) {
  if (!def || !def.id) throw new Error("RichClay button definitions require an id.");
  if (def.type !== "menu" && typeof def.run !== "function") {
    throw new Error(`RichClay button "${def.id}" requires a run(editor) function.`);
  }
}

function shortcutKeys(shortcut) {
  const parts = shortcut.split("+");
  const hasMod = parts.includes("Mod");
  const modifiers = parts.filter(part => part !== "Mod");
  const key = modifiers.pop();
  const hasShift = modifiers.includes("Shift");
  const normalizedKey = key.length === 1 ? (hasShift ? key.toUpperCase() : key.toLowerCase()) : key;
  const prefix = modifiers.map(normalizeModifier).join("-");
  const suffix = `${prefix ? `${prefix}-` : ""}${normalizedKey}`;
  if (!hasMod) return [suffix];
  return [`Ctrl-${suffix}`, `Meta-${suffix}`];
}

function normalizeModifier(modifier) {
  return modifier === "Cmd" ? "Meta" : modifier;
}

function trapTab(event, container) {
  const focusables = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = container.ownerDocument.activeElement;
  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}
