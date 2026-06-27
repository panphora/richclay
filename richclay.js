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
  var iconAttrs = 'viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"';
  var icons = {
    bold: `<svg ${iconAttrs}><path fill="currentColor" d="M7 4h6.2c2.9 0 4.7 1.5 4.7 3.8 0 1.5-.8 2.7-2.1 3.3 1.7.5 2.7 1.9 2.7 3.8 0 3-2.2 5.1-5.5 5.1H7V4Zm3 6h3c1.2 0 1.9-.6 1.9-1.6S14.2 7 13 7h-3v3Zm0 7h3.3c1.4 0 2.2-.8 2.2-2s-.8-2-2.2-2H10v4Z"/></svg>`,
    italic: `<svg ${iconAttrs}><path fill="currentColor" d="M10 4h9v3h-3.2l-3.5 10H15v3H6v-3h3.2l3.5-10H10V4Z"/></svg>`,
    underline: `<svg ${iconAttrs}><path fill="currentColor" d="M7 4h3v7.2c0 2 1 3.1 3 3.1s3-1.1 3-3.1V4h3v7.3c0 3.7-2.4 6-6 6s-6-2.3-6-6V4Zm0 15h12v2H7v-2Z"/></svg>`,
    strike: `<svg ${iconAttrs}><path fill="currentColor" d="M6 11h12v2H6v-2Zm6.2-7c2.2 0 3.9.7 5.1 2.1l-2 2c-.8-.8-1.8-1.2-3.1-1.2-1.4 0-2.2.5-2.2 1.4 0 .6.3 1 1 1.3H7.7c-.4-.6-.6-1.3-.6-2.1C7.1 5.4 9.1 4 12.2 4Zm4.7 10.8c.2.5.3 1 .3 1.6 0 2.3-2 3.8-5.1 3.8-2.5 0-4.5-.8-5.9-2.4l2.1-2c1 1 2.2 1.5 3.8 1.5 1.4 0 2.2-.5 2.2-1.4 0-.4-.2-.8-.6-1.1h3.2Z"/></svg>`,
    link: `<svg ${iconAttrs}><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1M14 11a5 5 0 0 0-7.1 0l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1"/></svg>`,
    unlink: `<svg ${iconAttrs}><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M15 7h1a4 4 0 0 1 0 8h-2M9 17H8a4 4 0 0 1 0-8h2M8 2l8 20M9.5 12h5"/></svg>`,
    ul: `<svg ${iconAttrs}><path fill="currentColor" d="M5 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm4-2h11v2H9V5Zm-4 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm4-2h11v2H9v-2Zm-4 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm4-2h11v2H9v-2Z"/></svg>`,
    ol: `<svg ${iconAttrs}><path fill="currentColor" d="M4 4h2v5H4V7H3V5h1V4Zm5 1h11v2H9V5Zm-6 6h4v2H5v1h2v2H3v-3h2v-1H3v-1Zm6 1h11v2H9v-2Zm-6 6h4v2H3v-2Zm6 0h11v2H9v-2Z"/></svg>`,
    quote: `<svg ${iconAttrs}><path fill="currentColor" d="M7 6h5v5H9.5c0 2 1 3.6 3 4.8L11 18c-3-1.7-4.5-4.1-4.5-7.2V6H7Zm9 0h5v5h-2.5c0 2 1 3.6 3 4.8L20 18c-3-1.7-4.5-4.1-4.5-7.2V6h.5Z"/></svg>`,
    undo: `<svg ${iconAttrs}><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7H4v5m.5-4.5A8 8 0 1 1 4 16"/></svg>`,
    redo: `<svg ${iconAttrs}><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7h5v5m-.5-4.5A8 8 0 1 0 20 16"/></svg>`,
    clear: `<svg ${iconAttrs}><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7h16M9 7V5h6v2m-8 0 1 13h8l1-13M10 11l4 4m0-4-4 4"/></svg>`,
    code: `<svg ${iconAttrs}><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8 9-4 3 4 3m8-6 4 3-4 3m-2-8-4 10"/></svg>`,
    indent: `<svg ${iconAttrs}><path fill="currentColor" d="M4 5h16v2H4V5Zm8 4h8v2h-8V9Zm0 4h8v2h-8v-2ZM4 17h16v2H4v-2Zm0-8 4 3-4 3V9Z"/></svg>`,
    outdent: `<svg ${iconAttrs}><path fill="currentColor" d="M4 5h16v2H4V5Zm8 4h8v2h-8V9Zm0 4h8v2h-8v-2ZM4 17h16v2H4v-2Zm4-8v6l-4-3 4-3Z"/></svg>`,
    blocks: `<svg ${iconAttrs}><path fill="currentColor" d="M4 4h16v3H4V4Zm0 6h11v3H4v-3Zm0 6h16v3H4v-3Z"/></svg>`
  };
  var presets = {
    minimal: ["bold", "italic", "link", "unorderedList"],
    standard: [
      "blockMenu",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "link",
      "unorderedList",
      "orderedList",
      "quote",
      "undo",
      "redo",
      "clearFormatting"
    ],
    full: [
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

  // src/richclay.js
  var instances = /* @__PURE__ */ new WeakMap();
  var liveInstances = /* @__PURE__ */ new Set();
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
      const path = this._squire?.getPath?.() || this.path || "";
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
      this.resolveToolbarControls("full").forEach((def) => {
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

  // src/browser-global.js
  var browser_global_default = RichClay;
  return __toCommonJS(browser_global_exports);
})();
window.RichClay = RichClayBundle.default;
