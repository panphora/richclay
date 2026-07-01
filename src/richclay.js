import {
  createDefaultRegistry,
  presets
} from "./buttons.js";
import { Toolbar } from "./toolbar.js";
import {
  createSanitizer,
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
const liveInstances = new Set();
const autoInitWindows = new WeakSet();
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
  Squire: null
};

export default class RichClay {
  static presets = presets;
  static selector = RICHCLAY_SELECTOR;

  constructor(element, options = {}) {
    if (!element) throw new Error("RichClay requires an element.");
    const existing = instances.get(element);
    if (existing) return existing;

    this.element = element;
    this.options = { ...defaultOptions, ...options };
    this.registry = new Map(globalRegistry);
    this.toolbar = null;
    this.liveRegion = null;
    this.description = null;
    this.dialog = null;
    this.savedSelection = null;
    this.path = "";
    this.active = false;
    this._squire = null;
    this._squireListeners = [];
    this._shortcutKeys = [];
    this._onFocus = () => this.element.classList.add("richclay-focused");
    this._onBlur = () => this.element.classList.remove("richclay-focused");

    this.ensureMarker();
    this.hyperclay = shouldUseHyperclay(this.options, this.window);
    if (this.hyperclay) installHyperclayBridge(this.window);

    instances.set(element, this);
    liveInstances.add(this);

    this.sanitizer = createSanitizer(this.options.sanitize, this.element.ownerDocument);
    sanitizeElementInPlace(this.element, this.options.sanitize);

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
      }
    };
    if (win.document.readyState === "loading") {
      win.document.addEventListener("DOMContentLoaded", run, { once: true });
    } else {
      run();
    }
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
      sanitizeToDOMFragment: (html, editor) => this.sanitizer.sanitizeToDOMFragment(html, editor),
      didError: error => {
        console.error("RichClay/Squire error", error);
      }
    });
    this._squire.setHTML(initialHTML);

    this.bindSquire();
    this.installShortcuts();
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
        this.options.sanitize,
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
    this.toolbar?.destroy();
    this.toolbar = null;
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

    this._squire?.destroy?.();
    this._squire = null;
    this.cleanupEditorAttributes();

    instances.delete(this.element);
    liveInstances.delete(this);
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
    if (!this.element.hasAttribute("data-richclay") && !this.element.hasAttribute("richclay")) {
      this.element.setAttribute("data-richclay", "");
    }
  }

  setupEditorAttributes() {
    this.element.classList.add("richclay-editor", "richclay-active");
    this.element.setAttribute("data-richclay-active", "true");

    if (!this.element.hasAttribute("contenteditable")) {
      this.element.setAttribute("data-richclay-runtime-contenteditable", "true");
    }
    this.element.setAttribute("contenteditable", "true");

    if (!this.element.hasAttribute("role")) {
      setRuntimeAttribute(this.element, "role", "textbox", "data-richclay-runtime-role");
    }
    if (!this.element.hasAttribute("aria-multiline")) {
      setRuntimeAttribute(
        this.element,
        "aria-multiline",
        "true",
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
    this.element.classList.remove(
      "richclay-editor",
      "richclay-active",
      "richclay-empty",
      "richclay-focused"
    );
    if (this.element.getAttribute("class") === "") this.element.removeAttribute("class");
    this.element.removeAttribute("contenteditable");
    this.element.removeAttribute("data-richclay-active");
    this.element.removeAttribute("data-richclay-placeholder");
    this.element.removeAttribute("data-richclay-runtime-contenteditable");

    if (this.element.hasAttribute("data-richclay-runtime-role")) {
      this.element.removeAttribute("role");
      this.element.removeAttribute("data-richclay-runtime-role");
    }
    if (this.element.hasAttribute("data-richclay-runtime-aria-multiline")) {
      this.element.removeAttribute("aria-multiline");
      this.element.removeAttribute("data-richclay-runtime-aria-multiline");
    }
    if (this.element.hasAttribute("data-richclay-runtime-no-undo")) {
      this.element.removeAttribute("no-undo");
      this.element.removeAttribute("data-richclay-runtime-no-undo");
    }
    if (this.element.hasAttribute("data-richclay-runtime-describedby")) {
      const id = this.element.getAttribute("data-richclay-runtime-describedby");
      const ids = (this.element.getAttribute("aria-describedby") || "")
        .split(/\s+/)
        .filter(Boolean)
        .filter(value => value !== id);
      if (ids.length) this.element.setAttribute("aria-describedby", ids.join(" "));
      else this.element.removeAttribute("aria-describedby");
      this.element.removeAttribute("data-richclay-runtime-describedby");
    }

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
    this.toolbar?.destroy();
    const controls = this.resolveToolbarControls(this.options.toolbar);
    this.toolbar = new Toolbar(this, controls, {
      toolbarContainer: this.options.toolbarContainer
    });
  }

  resolveToolbarControls(toolbar) {
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
    const seen = new Set();
    this.resolveToolbarControls("standard").forEach(def => {
      if (def.type === "menu" || !def.shortcut || seen.has(def.id)) return;
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
