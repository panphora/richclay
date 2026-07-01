/* richclay global build. Source lives in src/. Run npm run build to regenerate. */
var RichClayBundle = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/browser-global.js
  var browser_global_exports = {};
  __export(browser_global_exports, {
    default: () => browser_global_default
  });

  // src/buttons.js
  var S = 'stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"';
  var STHIN = 'stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"';
  var F = 'fill="currentColor"';
  var svg = (inner, viewBox = "0 0 18 18") => `<svg viewBox="${viewBox}" width="18" height="18" aria-hidden="true" focusable="false">${inner}</svg>`;
  var linkInner = `<line ${S} x1="7" x2="11" y1="7" y2="11"/><path ${S} d="M8.9,4.577a3.476,3.476,0,0,1,.36,4.679A3.476,3.476,0,0,1,4.577,8.9C3.185,7.5,2.035,6.4,4.217,4.217S7.5,3.185,8.9,4.577Z"/><path ${S} d="M13.423,9.1a3.476,3.476,0,0,0-4.679-.36,3.476,3.476,0,0,0,.36,4.679c1.392,1.392,2.5,2.542,4.679.36S14.815,10.5,13.423,9.1Z"/>`;
  var icons = {
    bold: svg(`<path ${S} d="M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z"/><path ${S} d="M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z"/>`),
    italic: svg(`<line ${S} x1="7" x2="13" y1="4" y2="4"/><line ${S} x1="5" x2="11" y1="14" y2="14"/><line ${S} x1="8" x2="10" y1="14" y2="4"/>`),
    underline: svg(`<path ${S} d="M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3"/><rect ${F} height="1" rx="0.5" ry="0.5" width="12" x="3" y="15"/>`),
    strike: svg(`<path ${F} d="M9.007,8C6.542,7.791,6,7.519,6,6.5,6,5.792,7.283,5,9,5c1.571,0,2.765.679,2.969,1.309a1,1,0,0,0,1.9-.617C13.356,4.106,11.354,3,9,3,6.2,3,4,4.538,4,6.5a3.2,3.2,0,0,0,.5,1.843Z"/><path ${F} d="M8.984,10C11.457,10.208,12,10.479,12,11.5c0,0.708-1.283,1.5-3,1.5-1.571,0-2.765-.679-2.969-1.309a1,1,0,1,0-1.9.617C4.644,13.894,6.646,15,9,15c2.8,0,5-1.538,5-3.5a3.2,3.2,0,0,0-.5-1.843Z"/><line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" fill="none" stroke-linecap="round" stroke-width="1.5"/>`),
    link: svg(linkInner),
    unlink: svg(`${linkInner}<line class="richclay-cut" x1="2.5" y1="15.5" x2="15.5" y2="2.5" stroke-linecap="round" stroke-width="3.5"/><line x1="4.06" y1="13.94" x2="13.94" y2="4.06" stroke="currentColor" fill="none" stroke-linecap="round" stroke-width="1.5"/>`),
    ul: svg(`<line ${S} x1="6" x2="15" y1="4" y2="4"/><line ${S} x1="6" x2="15" y1="9" y2="9"/><line ${S} x1="6" x2="15" y1="14" y2="14"/><line ${S} x1="3" x2="3" y1="4" y2="4"/><line ${S} x1="3" x2="3" y1="9" y2="9"/><line ${S} x1="3" x2="3" y1="14" y2="14"/>`),
    ol: svg(`<line ${S} x1="7" x2="15" y1="4" y2="4"/><line ${S} x1="7" x2="15" y1="9" y2="9"/><line ${S} x1="7" x2="15" y1="14" y2="14"/><line ${STHIN} x1="2.5" x2="4.5" y1="5.5" y2="5.5"/><path ${F} d="M3.5,6A0.5,0.5,0,0,1,3,5.5V3.085l-0.276.138A0.5,0.5,0,0,1,2.053,3c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,4,2.5v3A0.5,0.5,0,0,1,3.5,6Z"/><path ${STHIN} d="M4.5,10.5h-2c0-.234,1.85-1.076,1.85-2.234A0.959,0.959,0,0,0,2.5,8.156"/><path ${STHIN} d="M2.5,14.846a0.959,0.959,0,0,0,1.85-.109A0.7,0.7,0,0,0,3.75,14a0.688,0.688,0,0,0,.6-0.736,0.959,0.959,0,0,0-1.85-.109"/>`),
    quote: svg(`<path ${S} d="M10 10.8182L9 10.8182C8.80222 10.8182 8.60888 10.7649 8.44443 10.665C8.27998 10.5651 8.15181 10.4231 8.07612 10.257C8.00043 10.0909 7.98063 9.90808 8.01922 9.73174C8.0578 9.55539 8.15304 9.39341 8.29289 9.26627C8.43275 9.13913 8.61093 9.05255 8.80491 9.01747C8.99889 8.98239 9.19996 9.00039 9.38268 9.0692C9.56541 9.13801 9.72159 9.25453 9.83147 9.40403C9.94135 9.55353 10 9.72929 10 9.90909L10 12.1818C10 12.664 9.78929 13.1265 9.41421 13.4675C9.03914 13.8084 8.53043 14 8 14"/><path ${S} d="M16 10.8182L15 10.8182C14.8022 10.8182 14.6089 10.7649 14.4444 10.665C14.28 10.5651 14.1518 10.4231 14.0761 10.257C14.0004 10.0909 13.9806 9.90808 14.0192 9.73174C14.0578 9.55539 14.153 9.39341 14.2929 9.26627C14.4327 9.13913 14.6109 9.05255 14.8049 9.01747C14.9989 8.98239 15.2 9.00039 15.3827 9.0692C15.5654 9.13801 15.7216 9.25453 15.8315 9.40403C15.9414 9.55353 16 9.72929 16 9.90909L16 12.1818C16 12.664 15.7893 13.1265 15.4142 13.4675C15.0391 13.8084 14.5304 14 14 14"/>`, "2 2 20 20"),
    undo: svg(`<polyline ${S} points="6.5 4 3.5 7 6.5 10"/><path ${S} d="M3.5 7H10a3.5 3.5 0 0 1 0 7H7"/>`),
    redo: svg(`<polyline ${S} points="11.5 4 14.5 7 11.5 10"/><path ${S} d="M14.5 7H8a3.5 3.5 0 0 0 0 7h3"/>`),
    clear: svg(`<line ${S} x1="5" x2="13" y1="3" y2="3"/><line ${S} x1="6" x2="9.35" y1="12" y2="3"/><line ${S} x1="11" x2="15" y1="11" y2="15"/><line ${S} x1="15" x2="11" y1="11" y2="15"/><rect ${F} height="1" rx="0.5" ry="0.5" width="7" x="2" y="14"/>`),
    code: svg(`<polyline ${S} points="5 7 3 9 5 11"/><polyline ${S} points="13 7 15 9 13 11"/><line ${S} x1="10" x2="8" y1="5" y2="13"/>`),
    indent: svg(`<line ${S} x1="3" x2="15" y1="4" y2="4"/><line ${S} x1="8" x2="15" y1="9" y2="9"/><line ${S} x1="3" x2="15" y1="14" y2="14"/><polyline ${S} points="3 7 5.5 9 3 11"/>`),
    outdent: svg(`<line ${S} x1="3" x2="15" y1="4" y2="4"/><line ${S} x1="8" x2="15" y1="9" y2="9"/><line ${S} x1="3" x2="15" y1="14" y2="14"/><polyline ${S} points="5.5 7 3 9 5.5 11"/>`),
    blocks: svg(`<line ${S} x1="3" x2="15" y1="4" y2="4"/><line ${S} x1="3" x2="15" y1="9" y2="9"/><line ${S} x1="3" x2="10" y1="14" y2="14"/>`)
  };
  var presets = {
    minimal: ["bold", "italic", "link", "unorderedList"],
    standard: [
      "blockMenu",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "code",
      "link",
      "unlink",
      "unorderedList",
      "orderedList",
      "quote",
      "outdent",
      "indent",
      "undo",
      "redo",
      "clearFormatting"
    ]
  };
  function createDefaultRegistry() {
    return new Map(defaultButtons.map((button) => [button.id, button]));
  }
  function formatShortcut(shortcut) {
    if (!shortcut) return "";
    const platform = globalThis.navigator?.platform || "";
    const mod = /Mac|iPhone|iPad|iPod/.test(platform) ? "Cmd" : "Ctrl";
    return shortcut.replace("Mod", mod);
  }
  var defaultButtons = [
    toggle("bold", "Bold", icons.bold, "Mod+B", "inline", (editor) => editor.toggleFormat("B", "bold", "removeBold")),
    toggle(
      "italic",
      "Italic",
      icons.italic,
      "Mod+I",
      "inline",
      (editor) => editor.toggleFormat("I", "italic", "removeItalic")
    ),
    toggle(
      "underline",
      "Underline",
      icons.underline,
      "Mod+U",
      "inline",
      (editor) => editor.toggleFormat("U", "underline", "removeUnderline")
    ),
    toggle(
      "strikethrough",
      "Strikethrough",
      icons.strike,
      "Mod+Shift+7",
      "inline",
      (editor) => editor.toggleFormat("S", "strikethrough", "removeStrikethrough")
    ),
    toggle(
      "code",
      "Code",
      icons.code,
      "Mod+D",
      "inline",
      (editor) => editor.squire.toggleCode(),
      (editor) => editor.selectionHasFormat("CODE") || editor.selectionHasFormat("PRE")
    ),
    {
      id: "link",
      label: "Link",
      ariaLabel: "Insert or edit link",
      icon: icons.link,
      group: "links",
      shortcut: "Mod+K",
      run: (editor) => editor.openLinkDialog(),
      isActive: (editor) => editor.selectionHasFormat("A")
    },
    {
      id: "unlink",
      label: "Remove link",
      ariaLabel: "Remove link",
      icon: icons.unlink,
      group: "links",
      run: (editor) => editor.squire.removeLink()
    },
    toggle(
      "unorderedList",
      "Bulleted list",
      icons.ul,
      "Mod+Shift+8",
      "lists",
      (editor) => editor.toggleList("UL"),
      (editor) => editor.pathHas("UL")
    ),
    toggle(
      "orderedList",
      "Numbered list",
      icons.ol,
      "Mod+Shift+9",
      "lists",
      (editor) => editor.toggleList("OL"),
      (editor) => editor.pathHas("OL")
    ),
    toggle("quote", "Quote", icons.quote, null, "blocks", (editor) => {
      if (editor.pathHas("BLOCKQUOTE")) return editor.squire.decreaseQuoteLevel();
      return editor.squire.increaseQuoteLevel();
    }, (editor) => editor.pathHas("BLOCKQUOTE")),
    {
      id: "outdent",
      label: "Outdent",
      ariaLabel: "Decrease indent",
      icon: icons.outdent,
      group: "blocks",
      shortcut: "Mod+[",
      run: (editor) => editor.outdent()
    },
    {
      id: "indent",
      label: "Indent",
      ariaLabel: "Increase indent",
      icon: icons.indent,
      group: "blocks",
      shortcut: "Mod+]",
      run: (editor) => editor.indent()
    },
    {
      id: "undo",
      label: "Undo",
      ariaLabel: "Undo",
      icon: icons.undo,
      group: "history",
      shortcut: "Mod+Z",
      run: (editor) => editor.squire.undo()
    },
    {
      id: "redo",
      label: "Redo",
      ariaLabel: "Redo",
      icon: icons.redo,
      group: "history",
      shortcut: "Mod+Shift+Z",
      run: (editor) => editor.squire.redo()
    },
    {
      id: "clearFormatting",
      label: "Clear formatting",
      ariaLabel: "Clear formatting",
      icon: icons.clear,
      group: "cleanup",
      run: (editor) => editor.squire.removeAllFormatting()
    },
    {
      id: "blockMenu",
      type: "menu",
      label: "Block style",
      ariaLabel: "Choose block style",
      icon: icons.blocks,
      group: "blocks",
      options: [
        blockOption("Paragraph", "P"),
        blockOption("Heading 1", "H1"),
        blockOption("Heading 2", "H2"),
        blockOption("Heading 3", "H3"),
        {
          label: "Quote",
          value: "BLOCKQUOTE",
          run: (editor) => editor.squire.increaseQuoteLevel(),
          isActive: (editor) => editor.pathHas("BLOCKQUOTE")
        },
        {
          label: "Code block",
          value: "PRE",
          run: (editor) => editor.setBlockType("PRE"),
          isActive: (editor) => editor.pathHas("PRE")
        }
      ]
    }
  ];
  function toggle(id, label, icon, shortcut, group, run, isActive = (editor) => editor.selectionHasFormat(labelTag(id))) {
    return {
      id,
      label,
      ariaLabel: label,
      icon,
      group,
      shortcut,
      run,
      isActive
    };
  }
  function labelTag(id) {
    return {
      bold: "B",
      italic: "I",
      underline: "U",
      strikethrough: "S"
    }[id];
  }
  function blockOption(label, tag) {
    return {
      label,
      value: tag,
      run: (editor) => editor.setBlockType(tag),
      isActive: (editor) => editor.pathHas(tag)
    };
  }

  // src/hyperclay.js
  var RICHCLAY_SELECTOR = "[data-richclay], [richclay]";
  var CHROME_SELECTOR = "[data-richclay-toolbar], [data-richclay-menu], [data-richclay-dialog], [data-richclay-live]";
  var runtimeClasses = [
    "richclay-editor",
    "richclay-active",
    "richclay-empty",
    "richclay-focused"
  ];
  var installedWindows = /* @__PURE__ */ new WeakSet();
  function shouldUseHyperclay(options = {}, win = window) {
    if (options.hyperclay === false) return false;
    if (options.hyperclay === true) return true;
    return Boolean(win.hyperclay || hasEditmodeSignal(win));
  }
  function isHyperclayEditMode(win = window) {
    const fromQuery = readEditmodeParam(win);
    if (fromQuery !== null) return fromQuery;
    if (typeof win.__hyperclayEditMode === "boolean") {
      return win.__hyperclayEditMode;
    }
    if (typeof win.hyperclay?.isEditMode === "boolean") {
      return win.hyperclay.isEditMode;
    }
    return readEditmodeCookie(win);
  }
  function shouldActivateEditor(options = {}, win = window) {
    if (options.readOnly) return false;
    if (!shouldUseHyperclay(options, win)) return true;
    return isHyperclayEditMode(win);
  }
  function installHyperclayBridge(win = window) {
    if (installedWindows.has(win)) return;
    const beforeSave = win.hyperclay?.beforeSave;
    if (typeof beforeSave !== "function") return;
    beforeSave((docElem) => stripRichClayFromClone(docElem));
    installedWindows.add(win);
  }
  function stripRichClayFromClone(docElem) {
    docElem.querySelectorAll?.(CHROME_SELECTOR).forEach((node) => node.remove());
    docElem.querySelectorAll?.(RICHCLAY_SELECTOR).forEach((region) => {
      if (region.hasAttribute("contenteditable")) {
        const originalValue = region.getAttribute("contenteditable");
        region.setAttribute("inert-contenteditable", originalValue);
        region.removeAttribute("contenteditable");
      }
      runtimeClasses.forEach((className) => region.classList.remove(className));
      if (region.getAttribute("class") === "") region.removeAttribute("class");
      removeRuntimeAttribute(region, "role", "data-richclay-runtime-role");
      removeRuntimeAttribute(region, "aria-multiline", "data-richclay-runtime-aria-multiline");
      removeRuntimeAttribute(region, "no-undo", "data-richclay-runtime-no-undo");
      removeRuntimeDescribedBy(region);
      region.removeAttribute("data-richclay-active");
      region.removeAttribute("data-richclay-placeholder");
      region.removeAttribute("data-richclay-runtime-role");
      region.removeAttribute("data-richclay-runtime-aria-multiline");
      region.removeAttribute("data-richclay-runtime-no-undo");
      region.removeAttribute("data-richclay-runtime-describedby");
      region.removeAttribute("data-richclay-runtime-contenteditable");
      region.querySelectorAll("#squire-selection-start, #squire-selection-end").forEach((node) => {
        node.remove();
      });
      region.querySelectorAll(".squire-image-resize-container").forEach((node) => node.remove());
      stripZeroWidthArtifacts(region);
    });
  }
  function stripZeroWidthArtifacts(region) {
    const zwsp = String.fromCharCode(8203);
    const stack = [region];
    while (stack.length) {
      const node = stack.pop();
      node.childNodes.forEach((child) => {
        if (child.nodeType === 3) {
          if (child.nodeValue.includes(zwsp)) {
            child.nodeValue = child.nodeValue.split(zwsp).join("");
          }
        } else if (child.nodeType === 1) {
          stack.push(child);
        }
      });
    }
    region.querySelectorAll("b, i, u, s, em, strong, code, sub, sup, span").forEach((el) => {
      if (el.children.length === 0 && (el.textContent || "") === "") el.remove();
    });
  }
  function consumeInertContenteditable(element) {
    if (!element.hasAttribute("inert-contenteditable")) return null;
    let value = element.getAttribute("inert-contenteditable");
    if (!["false", "plaintext-only"].includes(value)) value = "true";
    element.setAttribute("contenteditable", value);
    element.removeAttribute("inert-contenteditable");
    return value;
  }
  function markChrome(element) {
    element.setAttribute("snapshot-remove", "");
    element.setAttribute("no-watch", "");
    return element;
  }
  function readEditmodeParam(win) {
    try {
      const params = new URLSearchParams(win.location?.search || "");
      if (params.get("editmode") === "true") return true;
      if (params.get("editmode") === "false") return false;
    } catch {
      return null;
    }
    return null;
  }
  function hasEditmodeSignal(win) {
    return readEditmodeParam(win) !== null || typeof win.__hyperclayEditMode === "boolean";
  }
  function readEditmodeCookie(win) {
    const cookie = win.document?.cookie || "";
    const match = cookie.match(/(?:^|;\s*)isAdminOfCurrentResource=([^;]*)/);
    return Boolean(match && match[1] !== "");
  }
  function removeRuntimeAttribute(region, attribute, marker) {
    if (!region.hasAttribute(marker)) return;
    region.removeAttribute(attribute);
  }
  function removeRuntimeDescribedBy(region) {
    const id = region.getAttribute("data-richclay-runtime-describedby");
    if (!id) return;
    const ids = (region.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean).filter((value) => value !== id);
    if (ids.length) {
      region.setAttribute("aria-describedby", ids.join(" "));
    } else {
      region.removeAttribute("aria-describedby");
    }
  }

  // src/a11y.js
  var liveId = 0;
  function createLiveRegion(doc = document) {
    const region = doc.createElement("div");
    region.id = `richclay-live-${++liveId}`;
    region.className = "richclay-sr-only";
    region.setAttribute("aria-live", "polite");
    region.setAttribute("aria-atomic", "true");
    region.setAttribute("data-richclay-live", "");
    markChrome(region);
    doc.body.appendChild(region);
    return region;
  }
  function announce(region, message) {
    if (!region || !message) return;
    region.textContent = "";
    region.ownerDocument.defaultView.setTimeout(() => {
      region.textContent = message;
    }, 20);
  }
  function preservePointerSelection(event) {
    event.preventDefault();
  }
  function cloneRange(range) {
    try {
      return range?.cloneRange?.() || null;
    } catch {
      return null;
    }
  }
  function getSquireSelection(squire) {
    try {
      return cloneRange(squire?.getSelection?.());
    } catch {
      return null;
    }
  }
  function restoreSquireSelection(squire, range) {
    if (!squire || !range) return false;
    try {
      squire.setSelection(range);
      return true;
    } catch {
      return false;
    }
  }
  function setRuntimeAttribute(element, attribute, value, marker) {
    if (!element.hasAttribute(attribute)) {
      element.setAttribute(marker, "true");
    }
    element.setAttribute(attribute, value);
  }
  function connectDescription(element, description) {
    const ids = new Set((element.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean));
    ids.add(description.id);
    element.setAttribute("aria-describedby", Array.from(ids).join(" "));
    element.setAttribute("data-richclay-runtime-describedby", description.id);
  }

  // src/toolbar.js
  var toolbarId = 0;
  var Toolbar = class {
    constructor(editor, controls, options = {}) {
      this.editor = editor;
      this.controls = controls;
      this.options = options;
      this.id = ++toolbarId;
      this.items = [];
      this.menus = /* @__PURE__ */ new Map();
      this.activeIndex = 0;
      this.root = this.createRoot();
      this.onRootKeydown = (event) => this.handleRootKeydown(event);
      this.onRootClick = (event) => this.handleRootClick(event);
      this.onRootPointerDown = (event) => this.handleRootPointerDown(event);
      this.onDocumentPointerDown = (event) => this.handleDocumentPointerDown(event);
      this.render();
      this.root.addEventListener("keydown", this.onRootKeydown);
      this.root.addEventListener("click", this.onRootClick);
      this.root.addEventListener("mousedown", this.onRootPointerDown);
      this.root.ownerDocument.addEventListener("mousedown", this.onDocumentPointerDown);
    }
    destroy() {
      this.closeMenus();
      this.root.removeEventListener("keydown", this.onRootKeydown);
      this.root.removeEventListener("click", this.onRootClick);
      this.root.removeEventListener("mousedown", this.onRootPointerDown);
      this.root.ownerDocument.removeEventListener("mousedown", this.onDocumentPointerDown);
      this.root.remove();
    }
    update() {
      this.items.forEach((item) => {
        const { def, button } = item;
        if (typeof def.isActive === "function") {
          const active = Boolean(def.isActive(this.editor));
          button.setAttribute("aria-pressed", active ? "true" : "false");
          button.classList.toggle("is-active", active);
        }
        if (typeof def.isDisabled === "function") {
          button.disabled = Boolean(def.isDisabled(this.editor));
        }
      });
      this.ensureSingleTabStop();
    }
    focusFirst() {
      this.activeIndex = 0;
      this.ensureSingleTabStop();
      this.items[0]?.button.focus();
    }
    createRoot() {
      const doc = this.editor.element.ownerDocument;
      const root = doc.createElement("div");
      root.className = "richclay-toolbar";
      root.setAttribute("role", "toolbar");
      root.setAttribute("aria-label", this.options.ariaLabel || "Rich text formatting");
      root.setAttribute("data-richclay-toolbar", "");
      markChrome(root);
      const container = resolveContainer(this.options.toolbarContainer, doc);
      if (container) {
        container.appendChild(root);
      } else {
        this.editor.element.insertAdjacentElement("beforebegin", root);
      }
      return root;
    }
    render() {
      this.root.textContent = "";
      this.items = [];
      this.menus.clear();
      let lastGroup = null;
      this.controls.forEach((def, index) => {
        if (def.type === "separator") {
          this.root.appendChild(createSeparator(this.root.ownerDocument));
          lastGroup = null;
          return;
        }
        if (lastGroup && def.group && def.group !== lastGroup) {
          this.root.appendChild(createSeparator(this.root.ownerDocument));
        }
        lastGroup = def.group || lastGroup;
        if (def.type === "menu") {
          this.renderMenu(def, index);
        } else {
          this.renderButton(def, index);
        }
      });
      this.ensureSingleTabStop();
      this.update();
    }
    renderButton(def, index) {
      const button = createToolbarButton(this.root.ownerDocument, def);
      button.dataset.richclayControl = def.id;
      button.dataset.richclayIndex = String(index);
      if (typeof def.isActive === "function") {
        button.setAttribute("aria-pressed", "false");
      }
      this.root.appendChild(button);
      this.items.push({ def, button, type: "button" });
    }
    renderMenu(def, index) {
      const doc = this.root.ownerDocument;
      const button = createToolbarButton(doc, def);
      const menuId = `richclay-menu-${this.id}-${def.id}`;
      button.dataset.richclayControl = def.id;
      button.dataset.richclayIndex = String(index);
      button.setAttribute("aria-haspopup", "menu");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", menuId);
      const menu = doc.createElement("div");
      menu.id = menuId;
      menu.className = "richclay-menu";
      menu.hidden = true;
      menu.setAttribute("role", "menu");
      menu.setAttribute("data-richclay-menu", "");
      markChrome(menu);
      def.options.forEach((option, optionIndex) => {
        const item = doc.createElement("button");
        item.type = "button";
        item.className = "richclay-menu-item";
        item.setAttribute("role", "menuitemradio");
        item.setAttribute("tabindex", "-1");
        item.dataset.richclayMenuItem = def.id;
        item.dataset.richclayOptionIndex = String(optionIndex);
        item.textContent = option.label;
        item.addEventListener("mousedown", preservePointerSelection);
        item.addEventListener("click", (event) => {
          event.preventDefault();
          this.chooseMenuItem(def, option, button);
        });
        item.addEventListener("keydown", (event) => this.handleMenuKeydown(event, def, button));
        menu.appendChild(item);
      });
      const wrap = doc.createElement("span");
      wrap.className = "richclay-menu-wrap";
      wrap.append(button, menu);
      this.root.appendChild(wrap);
      this.items.push({ def, button, type: "menu", menu });
      this.menus.set(def.id, { def, button, menu });
    }
    handleRootPointerDown(event) {
      const control = event.target.closest?.("[data-richclay-control]");
      if (!control || !this.root.contains(control)) return;
      preservePointerSelection(event);
      this.editor.saveSelection();
    }
    handleRootClick(event) {
      const button = event.target.closest?.("[data-richclay-control]");
      if (!button || !this.root.contains(button)) return;
      event.preventDefault();
      const item = this.items.find((candidate) => candidate.button === button);
      if (!item || button.disabled) return;
      this.activeIndex = this.items.indexOf(item);
      this.ensureSingleTabStop();
      if (item.type === "menu") {
        this.toggleMenu(item.def.id);
        return;
      }
      this.closeMenus();
      this.editor.runControl(item.def);
    }
    handleRootKeydown(event) {
      const key = event.key;
      const navigation = {
        ArrowRight: 1,
        ArrowDown: 1,
        ArrowLeft: -1,
        ArrowUp: -1
      };
      if (key in navigation) {
        event.preventDefault();
        this.moveFocus(navigation[key]);
        return;
      }
      if (key === "Home") {
        event.preventDefault();
        this.setFocusIndex(0);
        return;
      }
      if (key === "End") {
        event.preventDefault();
        this.setFocusIndex(this.items.length - 1);
        return;
      }
      const current = this.items[this.activeIndex];
      if (!current) return;
      if ((key === "Enter" || key === " ") && current.type === "menu") {
        event.preventDefault();
        this.openMenu(current.def.id, "first");
      }
      if (key === "Escape") {
        this.closeMenus();
        current.button.focus();
      }
    }
    handleMenuKeydown(event, def, trigger) {
      event.stopPropagation();
      const menu = this.menus.get(def.id)?.menu;
      const items = Array.from(menu.querySelectorAll(".richclay-menu-item"));
      const index = items.indexOf(event.currentTarget);
      let next = index;
      if (event.key === "ArrowDown") next = (index + 1) % items.length;
      if (event.key === "ArrowUp") next = (index - 1 + items.length) % items.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = items.length - 1;
      if (next !== index) {
        event.preventDefault();
        items[next].focus();
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        this.closeMenus();
        trigger.focus();
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const option = def.options[index];
        this.chooseMenuItem(def, option, trigger);
      }
    }
    handleDocumentPointerDown(event) {
      if (this.root.contains(event.target)) return;
      this.closeMenus();
    }
    chooseMenuItem(def, option, trigger) {
      this.closeMenus();
      this.editor.runControl({
        ...option,
        id: `${def.id}:${option.value}`,
        ariaLabel: option.label
      });
      trigger.focus();
    }
    toggleMenu(id) {
      const menu = this.menus.get(id);
      if (!menu) return;
      if (menu.menu.hidden) this.openMenu(id, "first");
      else this.closeMenus();
    }
    openMenu(id, focus = "first") {
      this.closeMenus(id);
      const entry = this.menus.get(id);
      if (!entry) return;
      entry.menu.hidden = false;
      entry.button.setAttribute("aria-expanded", "true");
      this.updateMenuState(entry);
      const items = Array.from(entry.menu.querySelectorAll(".richclay-menu-item"));
      const active = items.find((item) => item.getAttribute("aria-checked") === "true");
      const target = focus === "active" ? active || items[0] : items[0];
      target?.focus();
    }
    closeMenus(exceptId = null) {
      this.menus.forEach((entry, id) => {
        if (id === exceptId) return;
        entry.menu.hidden = true;
        entry.button.setAttribute("aria-expanded", "false");
      });
    }
    updateMenuState(entry) {
      const items = Array.from(entry.menu.querySelectorAll(".richclay-menu-item"));
      items.forEach((item, index) => {
        const option = entry.def.options[index];
        const active = Boolean(option.isActive?.(this.editor));
        item.setAttribute("aria-checked", active ? "true" : "false");
        item.classList.toggle("is-active", active);
      });
    }
    moveFocus(delta) {
      if (!this.items.length) return;
      let next = this.activeIndex;
      do {
        next = (next + delta + this.items.length) % this.items.length;
      } while (this.items[next].button.disabled && next !== this.activeIndex);
      this.setFocusIndex(next);
    }
    setFocusIndex(index) {
      this.activeIndex = Math.max(0, Math.min(index, this.items.length - 1));
      this.ensureSingleTabStop();
      this.items[this.activeIndex]?.button.focus();
    }
    ensureSingleTabStop() {
      const enabled = this.items.filter((item) => !item.button.disabled);
      if (!enabled.length) return;
      if (!enabled.includes(this.items[this.activeIndex])) {
        this.activeIndex = this.items.indexOf(enabled[0]);
      }
      this.items.forEach((item, index) => {
        item.button.tabIndex = index === this.activeIndex ? 0 : -1;
      });
    }
  };
  function createToolbarButton(doc, def) {
    const button = doc.createElement("button");
    button.type = "button";
    button.className = "richclay-button";
    const shortcut = formatShortcut(def.shortcut);
    const label = shortcut ? `${def.ariaLabel || def.label} (${shortcut})` : def.ariaLabel || def.label;
    button.setAttribute("aria-label", label);
    button.title = label;
    button.innerHTML = `${def.icon || ""}<span class="richclay-sr-only">${def.label}</span>`;
    return button;
  }
  function createSeparator(doc) {
    const separator = doc.createElement("span");
    separator.className = "richclay-separator";
    separator.setAttribute("role", "separator");
    separator.setAttribute("aria-orientation", "vertical");
    return separator;
  }
  function resolveContainer(container, doc) {
    if (!container) return null;
    if (typeof container === "string") return doc.querySelector(container);
    return container;
  }

  // src/sanitize.js
  var DEFAULT_SANITIZE_CONFIG = {
    ALLOWED_TAGS: [
      "a",
      "b",
      "blockquote",
      "br",
      "code",
      "div",
      "em",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "i",
      "li",
      "ol",
      "p",
      "pre",
      "s",
      "span",
      "strong",
      "sub",
      "sup",
      "u",
      "ul"
    ],
    ALLOWED_ATTR: ["aria-label", "href", "rel", "target", "title"],
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: true,
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form", "input"],
    FORBID_ATTR: ["style", "srcset", "onerror", "onclick", "onload"]
  };
  function createSanitizer(config = {}, doc = document) {
    const purify = resolveDOMPurify(doc);
    return {
      sanitizeHTML(html) {
        return sanitizeHTML(html, config, doc, purify);
      },
      sanitizeElement(element) {
        return sanitizeElement(element, config, purify);
      },
      sanitizeToDOMFragment(html, editor) {
        const ownerDocument = editor?.getRoot?.().ownerDocument || doc;
        return sanitizeToDOMFragment(html, config, ownerDocument, purify);
      }
    };
  }
  function sanitizeHTML(html, config = {}, doc = document, purify = resolveDOMPurify(doc)) {
    const template = doc.createElement("template");
    template.innerHTML = purify.sanitize(String(html || ""), mergeConfig(config));
    normalizeLinks(template.content);
    return template.innerHTML;
  }
  function sanitizeElement(element, config = {}, purify = resolveDOMPurify(element.ownerDocument)) {
    const doc = element.ownerDocument;
    const wrapper = doc.createElement("div");
    while (element.firstChild) wrapper.appendChild(element.firstChild);
    purify.sanitize(wrapper, {
      ...mergeConfig(config),
      IN_PLACE: true
    });
    normalizeLinks(wrapper);
    while (wrapper.firstChild) element.appendChild(wrapper.firstChild);
    return element;
  }
  function sanitizeToDOMFragment(html, config = {}, doc = document, purify = resolveDOMPurify(doc)) {
    const fragment = purify.sanitize(String(html || ""), {
      ...mergeConfig(config),
      RETURN_DOM_FRAGMENT: true
    });
    const clean = fragment?.ownerDocument === doc ? fragment : doc.importNode(fragment, true);
    normalizeLinks(clean);
    return clean || doc.createDocumentFragment();
  }
  function mergeConfig(config) {
    return { ...DEFAULT_SANITIZE_CONFIG, ...config };
  }
  var SAFE_URL_SCHEMES = /* @__PURE__ */ new Set(["http", "https", "mailto", "tel"]);
  var URL_CONTROL_CHARS = new RegExp("[\\u0000-\\u0020\\u007F-\\u009F]", "g");
  function isSafeUrl(url) {
    const stripped = String(url == null ? "" : url).replace(URL_CONTROL_CHARS, "");
    const scheme = (stripped.match(/^([a-z][a-z0-9+.\-]*):/i) || [])[1];
    return !scheme || SAFE_URL_SCHEMES.has(scheme.toLowerCase());
  }
  function normalizeUrl(value) {
    const raw = String(value == null ? "" : value).trim();
    if (!raw || !isSafeUrl(raw)) return "";
    if (/^(?:https?:|mailto:|tel:)/i.test(raw)) return raw;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) return `mailto:${raw}`;
    if (/^(?:[#?]|\/|\.{1,2}\/)/.test(raw)) return raw;
    return `https://${raw}`;
  }
  function resolveDOMPurify(doc) {
    const supplied = globalThis.DOMPurify;
    if (supplied?.sanitize) return supplied;
    if (typeof supplied === "function") return supplied(doc.defaultView || globalThis);
    throw new Error(
      "RichClay requires DOMPurify. Load vendor/purify.min.js before richclay.js or provide globalThis.DOMPurify."
    );
  }
  function normalizeLinks(root) {
    root.querySelectorAll?.("a[href]").forEach((link) => {
      const href = link.getAttribute("href") || "";
      if (/^\s*javascript:/i.test(href)) {
        link.removeAttribute("href");
      }
      if (link.getAttribute("target") === "_blank") {
        const rel = new Set((link.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
        rel.add("noopener");
        rel.add("noreferrer");
        link.setAttribute("rel", Array.from(rel).join(" "));
      }
    });
  }

  // src/styles.js
  var STYLE_ID = "richclay-styles";
  var styledDocs = /* @__PURE__ */ new WeakSet();
  var cssText = "";
  function setRichClayStyles(text) {
    cssText = text || "";
  }
  function ensureStyles(doc = document) {
    if (!doc || styledDocs.has(doc)) return;
    if (doc.getElementById(STYLE_ID)) {
      styledDocs.add(doc);
      return;
    }
    if (!cssText) return;
    const style = doc.createElement("style");
    style.id = STYLE_ID;
    style.setAttribute("save-remove", "");
    style.setAttribute("save-ignore", "");
    style.textContent = cssText;
    (doc.head || doc.documentElement).appendChild(style);
    styledDocs.add(doc);
  }

  // src/richclay.js
  var instances = /* @__PURE__ */ new WeakMap();
  var liveInstances = /* @__PURE__ */ new Set();
  var autoInitWindows = /* @__PURE__ */ new WeakSet();
  var globalRegistry = createDefaultRegistry();
  var KEEP_FOCUS = Symbol("richclay-keep-focus");
  var dialogSeq = 0;
  var defaultOptions = {
    toolbar: "standard",
    toolbarContainer: null,
    sanitize: {},
    placeholder: "",
    readOnly: false,
    hyperclay: "auto",
    onChange: null,
    Squire: null
  };
  var RichClay = class _RichClay {
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
      sanitizeElement(this.element, this.options.sanitize);
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
      return elements.map((element) => new _RichClay(element, options));
    }
    static autoInit(win = typeof window !== "undefined" ? window : void 0) {
      if (!win || !win.document || autoInitWindows.has(win)) return;
      autoInitWindows.add(win);
      const run = () => {
        if (shouldUseHyperclay({}, win) && isHyperclayEditMode(win)) {
          _RichClay.init();
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
      return _RichClay;
    }
    static unregisterButton(id) {
      globalRegistry.delete(id);
      return _RichClay;
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
        didError: (error) => {
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
        this.element.innerHTML = sanitizeHTML(
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
      this._shortcutKeys.forEach((key) => this._squire?.setKeyHandler?.(key, null));
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
      return this._squire.modifyBlocks((fragment) => {
        const doc = this.element.ownerDocument;
        const output = doc.createDocumentFragment();
        Array.from(fragment.childNodes).forEach((node) => {
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
      dialog.addEventListener("submit", (event) => {
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
      dialog.addEventListener("keydown", (event) => {
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
        const ids = (this.element.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean).filter((value) => value !== id);
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
      const pathChange = (event) => {
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
      return requested.map((item) => {
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
      const seen = /* @__PURE__ */ new Set();
      this.resolveToolbarControls("standard").forEach((def) => {
        if (def.type === "menu" || !def.shortcut || seen.has(def.id)) return;
        seen.add(def.id);
        shortcutKeys(def.shortcut).forEach((key) => {
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
  };
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
    const modifiers = parts.filter((part) => part !== "Mod");
    const key = modifiers.pop();
    const hasShift = modifiers.includes("Shift");
    const normalizedKey = key.length === 1 ? hasShift ? key.toUpperCase() : key.toLowerCase() : key;
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

  // richclay.css
  var richclay_default = `:root {
  --richclay-surface: #ffffff;
  --richclay-surface-alt: #f6f7f9;
  --richclay-text: #0b0e14;
  --richclay-muted: #667085;
  --richclay-border: #c9ced8;
  --richclay-accent: #0f766e;
  --richclay-accent-ink: #ffffff;
  --richclay-focus: #2563eb;
  --richclay-danger: #b42318;
  --richclay-radius: 6px;
  --richclay-control-size: 34px;
  --richclay-shadow: 0 10px 24px rgb(15 23 42 / 0.16);
}

@media (prefers-color-scheme: dark) {
  :root {
    --richclay-surface: #16181d;
    --richclay-surface-alt: #22252c;
    --richclay-text: #ffffff;
    --richclay-muted: #a3aab8;
    --richclay-border: #4a5260;
    --richclay-accent: #2dd4bf;
    --richclay-accent-ink: #05201d;
    --richclay-focus: #93c5fd;
    --richclay-shadow: 0 12px 28px rgb(0 0 0 / 0.35);
  }
}

.richclay-toolbar {
  align-items: center;
  background: var(--richclay-surface-alt);
  border: 1px solid var(--richclay-border);
  border-radius: var(--richclay-radius);
  color: var(--richclay-text);
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  margin-block: 0 6px;
  padding: 4px;
}

/* Seamless card: in the default layout the toolbar sits directly above the
   editor. Fuse them into a single bordered card with one divider \u2014 the
   toolbar's bottom border \u2014 instead of two stacked, separated boxes. */
.richclay-toolbar:has(+ .richclay-editor) {
  margin-block-end: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.richclay-toolbar + .richclay-editor {
  border-top: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

/* In a fused card, draw the focus ring inside the body so it never crosses
   the toolbar divider. */
.richclay-toolbar + .richclay-editor:focus-visible {
  outline-offset: -3px;
}

.richclay-button {
  align-items: center;
  appearance: none;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 5px;
  color: currentColor;
  display: inline-flex;
  height: var(--richclay-control-size);
  justify-content: center;
  margin: 0;
  min-width: var(--richclay-control-size);
  padding: 0;
  position: relative;
}

.richclay-button:hover,
.richclay-button[aria-expanded="true"],
.richclay-menu-item:hover {
  background: var(--richclay-surface);
  border-color: var(--richclay-border);
}

.richclay-button.is-active,
.richclay-button[aria-pressed="true"],
.richclay-menu-item.is-active {
  background: rgb(0 0 0 / 0.13);
  border-color: rgb(0 0 0 / 0.22);
  color: var(--richclay-text);
  box-shadow: inset 0 1px 3px rgb(0 0 0 / 0.26);
}

.richclay-button:focus-visible,
.richclay-menu-item:focus-visible,
.richclay-editor:focus-visible,
.richclay-input:focus-visible,
.richclay-primary:focus-visible,
.richclay-secondary:focus-visible {
  outline: 3px solid var(--richclay-focus);
  outline-offset: 2px;
}

.richclay-button:disabled {
  color: var(--richclay-muted);
  cursor: not-allowed;
  opacity: 0.55;
}

/* Remove-link icon: the standard link glyph with a diagonal cut painted in the
   button's own background colour, so the chain reads as severed in every state.
   The cut tracks the background the button shows: the toolbar surface at rest,
   the raised surface on hover. */
.richclay-cut {
  stroke: var(--richclay-surface-alt);
}

.richclay-button:hover .richclay-cut,
.richclay-button[aria-expanded="true"] .richclay-cut {
  stroke: var(--richclay-surface);
}

.richclay-separator {
  align-self: stretch;
  background: var(--richclay-border);
  display: inline-block;
  margin: 5px 4px;
  width: 1px;
}

.richclay-menu-wrap {
  display: inline-flex;
  position: relative;
}

.richclay-menu {
  background: var(--richclay-surface);
  border: 1px solid var(--richclay-border);
  border-radius: var(--richclay-radius);
  box-shadow: var(--richclay-shadow);
  color: var(--richclay-text);
  display: grid;
  gap: 2px;
  inset-block-start: calc(100% + 4px);
  inset-inline-start: 0;
  min-width: 160px;
  padding: 4px;
  position: absolute;
  z-index: 1000;
}

.richclay-menu[hidden] {
  display: none;
}

.richclay-menu-item {
  appearance: none;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  color: inherit;
  font: inherit;
  min-height: 32px;
  padding: 5px 9px;
  text-align: start;
}

.richclay-editor {
  background: var(--richclay-surface);
  border: 1px solid var(--richclay-border);
  border-radius: var(--richclay-radius);
  color: var(--richclay-text);
  min-height: 9rem;
  /* Break a long unbreakable string (e.g. a bare URL) in prose rather than let
     it widen the editor. \`anywhere\` also lowers min-content, so the editor can't
     grow even as a flex/grid item. Inert on the code <pre> (white-space: pre). */
  overflow-wrap: anywhere;
  padding: 12px;
  position: relative;
}

.richclay-editor.richclay-empty::before {
  color: var(--richclay-muted);
  content: attr(data-richclay-placeholder);
  inset-block-start: 12px;
  inset-inline-start: 12px;
  pointer-events: none;
  position: absolute;
}

.richclay-editor p,
.richclay-editor h1,
.richclay-editor h2,
.richclay-editor h3,
.richclay-editor h4,
.richclay-editor h5,
.richclay-editor h6,
.richclay-editor blockquote,
.richclay-editor pre,
.richclay-editor ul,
.richclay-editor ol {
  margin-block: 0 0.75em;
}

.richclay-editor > :last-child {
  margin-block-end: 0;
}

.richclay-editor blockquote {
  border-inline-start: 3px solid var(--richclay-border);
  color: var(--richclay-muted);
  margin-inline: 0;
  padding-inline-start: 12px;
}

/* Code blocks scroll horizontally inside the editor instead of widening it.
   \`width: 0; min-width: 100%\` zeroes the pre's intrinsic-width contribution so a
   long unbreakable line can't push an intrinsically-sized ancestor (flex/grid
   item, inline-block, table cell) wider, while still filling the editor and
   scrolling its own overflow. box-sizing keeps padding inside that 100%. */
.richclay-editor pre {
  background: var(--richclay-surface-alt);
  border-radius: 4px;
  box-sizing: border-box;
  min-width: 100%;
  overflow: auto;
  padding: 10px;
  width: 0;
}

.richclay-dialog {
  background: var(--richclay-surface);
  border: 1px solid var(--richclay-border);
  border-radius: var(--richclay-radius);
  box-shadow: var(--richclay-shadow);
  color: var(--richclay-text);
  display: grid;
  gap: 10px;
  margin-block: 6px;
  max-width: 420px;
  padding: 12px;
}

.richclay-dialog-title {
  font-weight: 650;
}

.richclay-field {
  display: grid;
  gap: 4px;
}

.richclay-field span {
  color: var(--richclay-muted);
  font-size: 0.875rem;
}

.richclay-input {
  background: var(--richclay-surface);
  border: 1px solid var(--richclay-border);
  border-radius: 4px;
  color: var(--richclay-text);
  font: inherit;
  min-height: 36px;
  padding: 6px 8px;
}

.richclay-dialog-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.richclay-primary,
.richclay-secondary {
  appearance: none;
  border: 1px solid var(--richclay-border);
  border-radius: 4px;
  font: inherit;
  min-height: 34px;
  padding: 5px 10px;
}

.richclay-primary {
  background: var(--richclay-accent);
  border-color: var(--richclay-accent);
  color: var(--richclay-accent-ink);
}

.richclay-secondary {
  background: var(--richclay-surface-alt);
  color: var(--richclay-text);
}

.richclay-sr-only {
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

@media (forced-colors: active) {
  .richclay-toolbar,
  .richclay-editor,
  .richclay-menu,
  .richclay-dialog,
  .richclay-input {
    border-color: CanvasText;
  }

  .richclay-button.is-active,
  .richclay-button[aria-pressed="true"],
  .richclay-menu-item.is-active,
  .richclay-primary {
    background: Highlight;
    color: HighlightText;
  }

  .richclay-button:focus-visible,
  .richclay-menu-item:focus-visible,
  .richclay-editor:focus-visible,
  .richclay-input:focus-visible {
    outline-color: Highlight;
  }

  .richclay-cut {
    stroke: Canvas;
  }
}
`;

  // src/browser-global.js
  setRichClayStyles(richclay_default);
  var browser_global_default = RichClay;
  return __toCommonJS(browser_global_exports);
})();
window.RichClay = RichClayBundle.default;
