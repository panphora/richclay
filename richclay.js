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
  var blocksOnly = (editor) => editor.blocksStayOut();
  var notInsideLink = (editor) => Boolean(editor.element.closest("a"));
  var presets = {
    minimal: ["bold", "italic", "link", "unorderedList"],
    inline: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "code",
      "link",
      "unlink",
      "undo",
      "redo",
      "clearFormatting"
    ],
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
  function isApplePlatform(win = globalThis) {
    const nav = win?.navigator;
    if (!nav) return false;
    return /Mac|iPhone|iPad|iPod/.test(nav.platform || nav.userAgent || "");
  }
  function formatShortcut(shortcut, win = globalThis) {
    if (!shortcut) return "";
    return shortcut.replace("Mod", isApplePlatform(win) ? "Cmd" : "Ctrl");
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
    // No shortcut. One keystroke turning a paragraph of prose into a code block is
    // a sharp edge in an editor whose DOM is the saved file, and Mod+D also shadows
    // the browser's own bookmark shortcut. The toolbar button stays.
    toggle(
      "code",
      "Code",
      icons.code,
      null,
      "inline",
      (editor) => editor.toggleCode(),
      (editor) => editor.selectionHasFormat("CODE") || editor.selectionHasFormat("PRE")
    ),
    {
      id: "link",
      label: "Link",
      ariaLabel: "Insert or edit link",
      icon: icons.link,
      group: "links",
      shortcut: "Mod+K",
      mutates: false,
      isDisabled: notInsideLink,
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
      (editor) => editor.pathHas("UL"),
      blocksOnly
    ),
    toggle(
      "orderedList",
      "Numbered list",
      icons.ol,
      "Mod+Shift+9",
      "lists",
      (editor) => editor.toggleList("OL"),
      (editor) => editor.pathHas("OL"),
      blocksOnly
    ),
    toggle("quote", "Quote", icons.quote, null, "blocks", (editor) => {
      if (editor.pathHas("BLOCKQUOTE")) return editor.squire.decreaseQuoteLevel();
      return editor.squire.increaseQuoteLevel();
    }, (editor) => editor.pathHas("BLOCKQUOTE"), blocksOnly),
    {
      id: "outdent",
      label: "Outdent",
      ariaLabel: "Decrease indent",
      icon: icons.outdent,
      group: "blocks",
      shortcut: "Mod+[",
      isDisabled: blocksOnly,
      run: (editor) => editor.outdent()
    },
    {
      id: "indent",
      label: "Indent",
      ariaLabel: "Increase indent",
      icon: icons.indent,
      group: "blocks",
      shortcut: "Mod+]",
      isDisabled: blocksOnly,
      run: (editor) => editor.indent()
    },
    {
      id: "undo",
      label: "Undo",
      ariaLabel: "Undo",
      icon: icons.undo,
      group: "history",
      shortcut: "Mod+Z",
      mutates: false,
      run: (editor) => editor.squire.undo()
    },
    {
      id: "redo",
      label: "Redo",
      ariaLabel: "Redo",
      icon: icons.redo,
      group: "history",
      shortcut: "Mod+Shift+Z",
      mutates: false,
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
      isDisabled: blocksOnly,
      options: [
        blockOption("Paragraph", "P"),
        blockOption("Heading 1", "H1"),
        blockOption("Heading 2", "H2"),
        blockOption("Heading 3", "H3"),
        {
          label: "Quote",
          value: "BLOCKQUOTE",
          isDisabled: blocksOnly,
          run: (editor) => editor.squire.increaseQuoteLevel(),
          isActive: (editor) => editor.pathHas("BLOCKQUOTE")
        },
        {
          label: "Code block",
          value: "PRE",
          isDisabled: blocksOnly,
          run: (editor) => editor.setBlockType("PRE"),
          isActive: (editor) => editor.pathHas("PRE")
        }
      ]
    }
  ];
  function toggle(id, label, icon, shortcut, group, run, isActive = (editor) => editor.selectionHasFormat(labelTag(id)), isDisabled) {
    return {
      id,
      label,
      ariaLabel: label,
      icon,
      group,
      shortcut,
      isDisabled,
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
      isDisabled: blocksOnly,
      run: (editor) => editor.setBlockType(tag),
      isActive: (editor) => editor.pathHas(tag)
    };
  }

  // src/normalize.js
  var INLINE_NODE_NAMES = /^(?:#text|A(?:BBR|CRONYM)?|B(?:R|D[IO])?|C(?:ITE|ODE)|D(?:ATA|EL|FN)|EM|FONT|HR|I(?:FRAME|MG|NPUT|NS)?|KBD|Q|R(?:P|T|UBY)|S(?:AMP|MALL|PAN|TR(?:IKE|ONG)|U[BP])?|TIME|U|VAR|WBR)$/;
  var NOT_WHITESPACE = /[^ \t\r\n]/;
  var ELEMENT_NODE = 1;
  var TEXT_NODE = 3;
  var COMMENT_NODE = 8;
  var LEAF_NODE_NAMES = /* @__PURE__ */ new Set(["BR", "HR", "IFRAME", "IMG", "INPUT", "WBR"]);
  var FOREIGN_INLINE_ROOTS = /* @__PURE__ */ new Set(["svg", "math"]);
  function isInlineNode(node) {
    const type = node.nodeType;
    if (type === TEXT_NODE || type === COMMENT_NODE) return true;
    if (type !== ELEMENT_NODE) return false;
    if (FOREIGN_INLINE_ROOTS.has(node.nodeName)) return true;
    if (!INLINE_NODE_NAMES.test(node.nodeName)) return false;
    return Array.from(node.childNodes).every(isInlineNode);
  }
  function isBlockContainer(element) {
    return Array.from(element.childNodes).some((node) => !isInlineNode(node));
  }
  var isBlockElement = (node) => node?.nodeType === ELEMENT_NODE && !FOREIGN_INLINE_ROOTS.has(node.nodeName) && !INLINE_NODE_NAMES.test(node.nodeName);
  function flattenBlocks(parent, createBoundary) {
    const children = Array.from(parent.childNodes);
    let removed = 0;
    children.forEach((child, index) => {
      if (child.nodeType !== ELEMENT_NODE || FOREIGN_INLINE_ROOTS.has(child.nodeName)) return;
      removed += flattenBlocks(child, createBoundary);
      if (!isBlockElement(child)) return;
      if (isBlockElement(children[index - 1])) parent.insertBefore(createBoundary(), child);
      while (child.firstChild) parent.insertBefore(child.firstChild, child);
      child.remove();
      removed += 1;
    });
    return removed;
  }
  var TABLE_STRUCTURE = /* @__PURE__ */ new Set(["TABLE", "THEAD", "TBODY", "TFOOT", "TR", "COLGROUP"]);
  function ejectsBlocks(root) {
    return Boolean(root.closest?.("p")) || TABLE_STRUCTURE.has(root.nodeName);
  }
  var TEXT_LINE_ROOTS = /* @__PURE__ */ new Set([
    "P",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "PRE",
    "LABEL",
    "LEGEND",
    "LI",
    "TD",
    "TH",
    "DT",
    "DD",
    "FIGCAPTION",
    "SUMMARY",
    "CAPTION"
  ]);
  function keepsTextShape(root) {
    return TEXT_LINE_ROOTS.has(root.nodeName) || isInlineTag(root);
  }
  var VOID_ROOTS = /* @__PURE__ */ new Set([
    "AREA",
    "BASE",
    "BR",
    "COL",
    "EMBED",
    "HR",
    "IMG",
    "INPUT",
    "LINK",
    "META",
    "PARAM",
    "SOURCE",
    "TRACK",
    "WBR"
  ]);
  var RAW_TEXT_ROOTS = /* @__PURE__ */ new Set(["SCRIPT", "STYLE", "TEXTAREA", "TITLE", "IFRAME", "NOSCRIPT", "XMP"]);
  var HTML_NS = "http://www.w3.org/1999/xhtml";
  function isUnsupportedRootTag(root) {
    return TABLE_STRUCTURE.has(root.nodeName) || VOID_ROOTS.has(root.nodeName) || RAW_TEXT_ROOTS.has(root.nodeName) || root.nodeName === "TEMPLATE" || Boolean(root.namespaceURI) && root.namespaceURI !== HTML_NS;
  }
  function unsupportedRootReason(root) {
    if (TABLE_STRUCTURE.has(root.nodeName)) {
      return "a table element cannot be an editable region. Move the editable attribute to a <td>, a <th>, or an element inside one.";
    }
    if (root.namespaceURI && root.namespaceURI !== HTML_NS) {
      return "an SVG or MathML element cannot be an editable region: an edit puts an HTML block inside it, and the next page load moves that text out of the graphic entirely. Put a <foreignObject> in the SVG and mark an HTML element inside it instead.";
    }
    if (VOID_ROOTS.has(root.nodeName)) {
      return "this element cannot contain anything, so there is nothing to edit. Move the editable attribute to an element that holds text.";
    }
    if (root.nodeName === "TEMPLATE") {
      return "a <template> keeps its content out of the document, so edits to it are never saved.";
    }
    return "this element treats its content as plain text, so any edit would be saved as visible markup rather than formatting.";
  }
  function isInlineTag(node) {
    return node.nodeType === ELEMENT_NODE && !FOREIGN_INLINE_ROOTS.has(node.nodeName) && INLINE_NODE_NAMES.test(node.nodeName);
  }
  function hasBlockDescendant(root) {
    return Array.from(root.querySelectorAll("*")).some(isBlockElement);
  }
  function normalizeEditorRoot(root, options = {}) {
    const {
      blockTag = "DIV",
      wrapBareRoot = false,
      onBareRootWrapped,
      blocksAllowed = !ejectsBlocks(root)
    } = options;
    dropFormattingWhitespace(root);
    if (blocksAllowed) {
      wrapStrayInlineChildren(root, blockTag, wrapBareRoot, onBareRootWrapped);
    }
    return root;
  }
  var needsWrapping = (node) => isInlineNode(node) && node.nodeType !== COMMENT_NODE;
  var isAuthorContent = (node) => node.nodeType !== COMMENT_NODE && !(node.nodeType === TEXT_NODE && !NOT_WHITESPACE.test(node.nodeValue));
  function editorRootNeedsNormalization(root, { wrapBareRoot = false, blocksAllowed = !ejectsBlocks(root) } = {}) {
    if (!blocksAllowed) return false;
    if (!isBlockContainer(root)) return wrapBareRoot;
    return Array.from(root.childNodes).some(needsWrapping) || hasNestedFormattingWhitespace(root);
  }
  function hasNestedFormattingWhitespace(element) {
    return Array.from(element.children).some((child) => {
      if (!isBlockContainer(child)) return false;
      const ownWhitespace = !preservesWhitespace(child) && Array.from(child.childNodes).some(
        (node) => node.nodeType === TEXT_NODE && !NOT_WHITESPACE.test(node.nodeValue)
      );
      return ownWhitespace || hasNestedFormattingWhitespace(child);
    });
  }
  function dropFormattingWhitespace(element) {
    if (!isBlockContainer(element)) return;
    if (!preservesWhitespace(element)) {
      Array.from(element.childNodes).forEach((child) => {
        if (child.nodeType === TEXT_NODE && !NOT_WHITESPACE.test(child.nodeValue)) child.remove();
      });
    }
    Array.from(element.children).forEach(dropFormattingWhitespace);
  }
  function wrapStrayInlineChildren(root, blockTag, wrapBareRoot, onBareRootWrapped) {
    if (!isBlockContainer(root)) {
      if (!wrapBareRoot) return;
      const wrapper = root.ownerDocument.createElement(blockTag);
      if (!Array.from(root.childNodes).some(isAuthorContent)) {
        wrapper.appendChild(root.ownerDocument.createElement("BR"));
        root.appendChild(wrapper);
        return;
      }
      while (root.firstChild) wrapper.appendChild(root.firstChild);
      root.appendChild(wrapper);
      onBareRootWrapped?.(root, wrapper);
      return;
    }
    let run = [];
    const flush = () => {
      const nodes = run;
      run = [];
      if (!nodes.some((node) => node.nodeType !== COMMENT_NODE)) return;
      const block = root.ownerDocument.createElement(blockTag);
      root.insertBefore(block, nodes[0]);
      nodes.forEach((node) => block.appendChild(node));
    };
    Array.from(root.childNodes).forEach((child) => {
      if (isInlineNode(child)) run.push(child);
      else flush();
    });
    flush();
  }
  function preservesWhitespace(element) {
    return element.nodeName === "PRE";
  }
  function captureRange(root, range) {
    return {
      start: captureBoundary(root, range.startContainer, range.startOffset),
      end: captureBoundary(root, range.endContainer, range.endOffset),
      collapsed: range.collapsed
    };
  }
  function restoreRange(root, range, saved) {
    applyBoundary(range, "setStart", root, saved.start);
    if (saved.collapsed) range.collapse(true);
    else applyBoundary(range, "setEnd", root, saved.end);
  }
  function captureBoundary(root, container, offset) {
    if (!root.contains(container)) return { scope: root, after: [], before: [] };
    if (container.nodeType === TEXT_NODE) {
      if (!isDroppedWhitespace(container)) return { container, offset };
      const scope = container.parentNode;
      return siblingAnchor(scope, Array.from(scope.childNodes).indexOf(container));
    }
    return {
      container,
      offset,
      childCount: container.childNodes.length,
      ...siblingAnchor(container, offset)
    };
  }
  function siblingAnchor(scope, index) {
    const children = Array.from(scope.childNodes);
    const at = Math.max(0, index);
    return { scope, after: children.slice(at), before: children.slice(0, at).reverse() };
  }
  function applyBoundary(range, method, root, boundary) {
    const { container, childCount } = boundary;
    if (container && root.contains(container)) {
      if (childCount === void 0 || childCount === container.childNodes.length) {
        range[method](container, Math.min(boundary.offset, nodeLength(container)));
        return;
      }
    }
    const after = boundary.after?.find((node) => root.contains(node));
    if (after) {
      range[method](caretEdge(after, true), 0);
      return;
    }
    const before = boundary.before?.find((node) => root.contains(node));
    if (before) {
      const edge = caretEdge(before, false);
      range[method](edge, nodeLength(edge));
      return;
    }
    const scope = boundary.scope && root.contains(boundary.scope) ? boundary.scope : root;
    range[method](scope, 0);
  }
  function isDroppedWhitespace(node) {
    return node.nodeType === TEXT_NODE && !NOT_WHITESPACE.test(node.nodeValue) && Boolean(node.parentNode) && node.parentNode.nodeType === ELEMENT_NODE && isBlockContainer(node.parentNode) && !preservesWhitespace(node.parentNode);
  }
  var isCaretHost = (node) => node.nodeType === ELEMENT_NODE || node.nodeType === TEXT_NODE;
  function caretEdge(node, first = true) {
    let current = node;
    while (current.nodeType === ELEMENT_NODE && !FOREIGN_INLINE_ROOTS.has(current.nodeName)) {
      const children = Array.from(current.childNodes).filter(isCaretHost);
      const next = first ? children[0] : children[children.length - 1];
      if (!next || LEAF_NODE_NAMES.has(next.nodeName)) break;
      current = next;
    }
    return current;
  }
  function nodeLength(node) {
    return node.nodeType === TEXT_NODE ? node.nodeValue.length : node.childNodes.length;
  }

  // src/hyperclay.js
  var RICHCLAY_SELECTOR = "[data-richclay], [richclay], [editable], [clay-editable]";
  var RICHCLAY_OPT_IN = "[data-richclay], [richclay], [clay-editable]";
  var EDITABLE_ATTRS = ["editable", "clay-editable"];
  var singleLineSelector = ':is([editable~="single-line"], [clay-editable~="single-line"])';
  function isRichClayHost(el) {
    if (!el || typeof el.matches !== "function") return false;
    if (!el.tagName.includes("-")) return true;
    return el.matches(RICHCLAY_OPT_IN);
  }
  var CHROME_SELECTOR = "[data-richclay-toolbar], [data-richclay-menu], [data-richclay-dialog], [data-richclay-live], [data-richclay-float]";
  var runtimeClasses = [
    "richclay-editor",
    "richclay-inline",
    "richclay-active",
    "richclay-empty",
    "richclay-focused"
  ];
  var installedWindows = /* @__PURE__ */ new WeakSet();
  var armedWindows = /* @__PURE__ */ new WeakSet();
  var PLATFORM_READY = ["clay:ready", "hyperclay:ready"];
  function platformReadyPromise(win) {
    return [win.clay?.ready, win.hyperclay?.ready].find(
      (ready) => ready && typeof ready.then === "function"
    ) || null;
  }
  function platformEditMode(win) {
    if (typeof win.clay?.isEditMode === "boolean") return win.clay.isEditMode;
    if (typeof win.hyperclay?.isEditMode === "boolean") return win.hyperclay.isEditMode;
    return null;
  }
  function hasPlatformLifecycle(win) {
    const modules = win.hyperclayModules;
    const legacyHyperclayLoader = win.__hyperclayNoAutoExport === false && modules && typeof modules === "object" && typeof modules.nodeType !== "number";
    return platformEditMode(win) !== null || Boolean(platformReadyPromise(win)) || Boolean(legacyHyperclayLoader);
  }
  function platformDocumentTransform(win) {
    return win.clay?.addDocumentTransform || win.hyperclay?.beforeSave || null;
  }
  var PRE_CONTAINMENT = {
    boxSizing: "border-box",
    minWidth: "100%",
    overflow: "auto",
    width: "0"
  };
  function shouldUseHyperclay(options = {}, win = window) {
    if (options.hyperclay === false) return false;
    if (options.hyperclay === true) return true;
    return Boolean(hasPlatformLifecycle(win) || hasEditmodeSignal(win));
  }
  function isHyperclayEditMode(win = window) {
    const fromQuery = readEditmodeParam(win);
    if (fromQuery !== null) return fromQuery;
    if (typeof win.__hyperclayEditMode === "boolean") {
      return win.__hyperclayEditMode;
    }
    const fromPlatform = platformEditMode(win);
    if (fromPlatform !== null) return fromPlatform;
    return readEditmodeCookie(win);
  }
  function shouldActivateEditor(options = {}, win = window) {
    if (options.readOnly) return false;
    if (!shouldUseHyperclay(options, win)) return true;
    return isHyperclayEditMode(win);
  }
  function parseEditableOptions(element) {
    const name = EDITABLE_ATTRS.find((attr) => element.hasAttribute(attr));
    if (!name) return null;
    const tokens = new Set(
      (element.getAttribute(name) || "").trim().split(/\s+/).filter(Boolean)
    );
    const options = {
      inline: true,
      singleLine: tokens.has("single-line"),
      toolbarOnSelect: tokens.has("toolbar-on-select")
    };
    if (tokens.has("no-toolbar")) options.toolbar = false;
    return options;
  }
  function installHyperclayBridge(win = window) {
    if (installedWindows.has(win)) return;
    const addDocumentTransform = platformDocumentTransform(win);
    if (typeof addDocumentTransform !== "function") {
      armBridgeRetry(win);
      return;
    }
    addDocumentTransform((docElem) => stripRichClayFromClone(docElem));
    installedWindows.add(win);
  }
  function armBridgeRetry(win) {
    if (armedWindows.has(win)) return;
    const doc = win.document;
    const ready = platformReadyPromise(win);
    if (!doc && !ready) return;
    armedWindows.add(win);
    const retry = () => {
      installHyperclayBridge(win);
      if (installedWindows.has(win)) disarm();
    };
    const disarm = () => {
      if (!doc) return;
      PLATFORM_READY.forEach((name) => doc.removeEventListener(name, retry));
    };
    if (doc) PLATFORM_READY.forEach((name) => doc.addEventListener(name, retry));
    if (ready) ready.then(retry, () => {
    });
  }
  function stripRichClayFromClone(docElem) {
    docElem.querySelectorAll?.(CHROME_SELECTOR).forEach((node) => node.remove());
    docElem.querySelectorAll?.(RICHCLAY_SELECTOR).forEach((region) => {
      if (region.getAttribute("data-richclay-active") !== "true") return;
      removeRuntimeState(region, "save");
      if (needsFlattening(region)) {
        const doc = region.ownerDocument;
        const singleLine = Boolean(region.matches?.(singleLineSelector));
        flattenBlocks(
          region,
          () => singleLine ? doc.createTextNode(" ") : doc.createElement("br")
        );
        region.querySelectorAll(region.localName).forEach((nested) => {
          while (nested.firstChild) nested.parentNode.insertBefore(nested.firstChild, nested);
          nested.remove();
        });
      }
      if (region.matches?.(singleLineSelector)) unwrapLoneSingleLineBlock(region);
      region.querySelectorAll("#squire-selection-start, #squire-selection-end").forEach((node) => {
        node.remove();
      });
      region.querySelectorAll(".squire-image-resize-container").forEach((node) => node.remove());
      stripZeroWidthArtifacts(region);
      const codeBlocks = (region.matches?.("pre") ? [region, ...region.querySelectorAll("pre")] : Array.from(region.querySelectorAll("pre"))).filter((pre) => pre.hasAttribute("data-richclay-pre"));
      codeBlocks.forEach((pre) => {
        Object.entries(PRE_CONTAINMENT).forEach(([property, value]) => {
          if (!pre.style[property]) pre.style[property] = value;
        });
        pre.removeAttribute("data-richclay-pre");
      });
    });
    docElem.querySelectorAll?.("#squire-selection-start, #squire-selection-end").forEach((node) => node.remove());
  }
  var BLOCK_SCOPE = "p, td, th, li, dl, dt, dd, table, blockquote, div, section, article, aside, main, header, footer, figure, figcaption";
  var MEASURE_ATTR = "data-richclay-measure";
  function ejectsOnReload(region) {
    const doc = region.ownerDocument;
    const scope = region.closest(BLOCK_SCOPE) || region;
    region.setAttribute(MEASURE_ATTR, "");
    const probe = doc.createElement("div");
    try {
      probe.innerHTML = scope.outerHTML;
    } finally {
      region.removeAttribute(MEASURE_ATTR);
    }
    const reparsed = probe.querySelector(`[${MEASURE_ATTR}]`);
    return !reparsed || reparsed.textContent !== region.textContent;
  }
  var selfNests = (region) => Boolean(region.querySelector(region.localName));
  var needsFlattening = (region) => Boolean(region.matches?.(singleLineSelector)) || (hasBlockDescendant(region) || selfNests(region)) && ejectsOnReload(region);
  function removeRuntimeState(region, mode) {
    const origin = region.getAttribute("data-richclay-runtime-contenteditable");
    if (region.hasAttribute("contenteditable")) {
      if (origin === "true") {
        region.removeAttribute("contenteditable");
      } else if (origin) {
        if (mode === "destroy") {
          region.setAttribute("contenteditable", origin);
        } else {
          region.setAttribute("inert-contenteditable", origin);
          region.removeAttribute("contenteditable");
        }
      } else if (mode === "save") {
        region.setAttribute("inert-contenteditable", region.getAttribute("contenteditable"));
        region.removeAttribute("contenteditable");
      }
    }
    runtimeClasses.forEach((className) => region.classList.remove(className));
    if (region.getAttribute("class") === "") region.removeAttribute("class");
    removeRuntimeAttribute(region, "role", "data-richclay-runtime-role");
    removeRuntimeAttribute(region, "aria-multiline", "data-richclay-runtime-aria-multiline");
    removeRuntimeAttribute(region, "no-undo", "data-richclay-runtime-no-undo");
    if (region.getAttribute("data-richclay-runtime-display") === "true") {
      region.style.removeProperty("display");
      if (region.getAttribute("style") === "") region.removeAttribute("style");
    }
    removeRuntimeDescribedBy(region);
    region.removeAttribute("data-richclay-active");
    region.removeAttribute("data-richclay-placeholder");
    region.removeAttribute("data-richclay-pre");
    region.removeAttribute("data-richclay-runtime-role");
    region.removeAttribute("data-richclay-runtime-aria-multiline");
    region.removeAttribute("data-richclay-runtime-no-undo");
    region.removeAttribute("data-richclay-runtime-describedby");
    region.removeAttribute("data-richclay-runtime-contenteditable");
    region.removeAttribute("data-richclay-runtime-display");
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
      if (el.children.length === 0 && (el.textContent || "") === "" && el.attributes.length === 0) {
        el.remove();
      }
    });
  }
  function unwrapLoneSingleLineBlock(region) {
    const meaningful = Array.from(region.childNodes).filter(
      (node) => node.nodeType !== 3 || (node.nodeValue || "").trim() !== ""
    );
    if (meaningful.length !== 1) return;
    const block = meaningful[0];
    if (block.nodeType !== 1 || block.nodeName !== "P" || block.attributes.length > 0) return;
    while (block.firstChild) region.insertBefore(block.firstChild, block);
    block.remove();
  }
  function consumeInertContenteditable(element) {
    if (!element.hasAttribute("inert-contenteditable")) return null;
    let value = element.getAttribute("inert-contenteditable");
    if (!["false", "plaintext-only"].includes(value)) value = "true";
    element.setAttribute("contenteditable", value);
    element.removeAttribute("inert-contenteditable");
    if (value === "true") {
      element.setAttribute("data-richclay-runtime-contenteditable", "true");
    }
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
      this.visibleControls().forEach((def, index) => {
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
    // A control disabled by the root is disabled for this editor's whole life, not
    // for this selection, so it is left out of the toolbar rather than rendered
    // greyed: a greyed button says "not right now" and invites clicking, an absent
    // one just gives a simpler toolbar. It stays disabled at dispatch as well,
    // because hiding a button stops neither its shortcut nor its menu item.
    visibleControls() {
      const kept = this.controls.filter(
        (def) => def.type === "separator" || !def.isDisabled?.(this.editor)
      );
      const trimmed = [];
      kept.forEach((def) => {
        const previous = trimmed[trimmed.length - 1];
        if (def.type === "separator" && (!previous || previous.type === "separator")) return;
        trimmed.push(def);
      });
      while (trimmed[trimmed.length - 1]?.type === "separator") trimmed.pop();
      return trimmed;
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
        const hadOpenMenu = Array.from(this.menus.values()).some((entry) => !entry.menu.hidden);
        this.closeMenus();
        if (hadOpenMenu) current.button.focus();
        else this.editor.focus();
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
    const shortcut = formatShortcut(def.shortcut, doc.defaultView);
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

  // src/toolbar-float.js
  var GAP = 16;
  var GAP_LADDER = [16, 8, 0];
  var VIEWPORT_INSET = 8;
  var PLACEMENT_SLACK = 4;
  function placeToolbar({ anchor, bar, rail, viewport, current = null }) {
    const slack = (mode) => current === mode ? PLACEMENT_SLACK : 0;
    if (anchor.bottom <= 0 || anchor.top >= viewport.height || anchor.right <= 0 || anchor.left >= viewport.width) {
      return { mode: "hidden", x: 0, y: 0 };
    }
    const clampX = (width) => Math.max(VIEWPORT_INSET, Math.min(anchor.left, viewport.width - width - VIEWPORT_INSET));
    const aboveY = anchor.top - GAP - bar.height;
    if (aboveY >= VIEWPORT_INSET - slack("above")) {
      return { mode: "above", x: clampX(bar.width), y: aboveY };
    }
    const belowY = anchor.bottom + GAP;
    if (belowY + bar.height <= viewport.height - VIEWPORT_INSET + slack("below")) {
      return { mode: "below", x: clampX(bar.width), y: belowY };
    }
    const rightSpace = viewport.width - anchor.right - VIEWPORT_INSET;
    const leftSpace = anchor.left - VIEWPORT_INSET;
    const sides = rightSpace >= leftSpace ? [["rail-right", rightSpace], ["rail-left", leftSpace]] : [["rail-left", leftSpace], ["rail-right", rightSpace]];
    for (const [mode, space] of sides) {
      for (const gap of GAP_LADDER) {
        if (rail.width + gap > space + slack(mode)) continue;
        const x = mode === "rail-right" ? Math.min(anchor.right + gap, viewport.width - rail.width - VIEWPORT_INSET) : Math.max(anchor.left - gap - rail.width, VIEWPORT_INSET);
        const maxY = Math.min(anchor.bottom, viewport.height - VIEWPORT_INSET) - rail.height;
        const y = Math.max(VIEWPORT_INSET, Math.min(Math.max(anchor.top, VIEWPORT_INSET), maxY));
        return { mode, x, y, gap };
      }
    }
    return { mode: "pinned", x: clampX(bar.width), y: VIEWPORT_INSET };
  }
  var FloatingToolbar = class {
    constructor(editor, controls) {
      this.editor = editor;
      this.mode = null;
      this.hidden = false;
      this.frame = 0;
      this.bar = { width: 0, height: 0 };
      this.rail = { width: 0, height: 0 };
      const doc = editor.element.ownerDocument;
      this.doc = doc;
      this.win = doc.defaultView || globalThis;
      this.root = doc.createElement("div");
      this.root.className = "richclay-float";
      this.root.setAttribute("data-richclay-float", "");
      this.root.setAttribute("save-remove", "");
      markChrome(this.root);
      doc.body.appendChild(this.root);
      this.toolbar = new Toolbar(editor, controls, { toolbarContainer: this.root });
      this.onScroll = () => this.schedule();
      this.onResize = () => {
        this.measure();
        this.schedule();
      };
      doc.addEventListener("scroll", this.onScroll, { capture: true, passive: true });
      this.win.addEventListener("resize", this.onResize, { passive: true });
      this.win.visualViewport?.addEventListener("resize", this.onResize, { passive: true });
      this.win.visualViewport?.addEventListener("scroll", this.onScroll, { passive: true });
      this.resizeObserver = typeof this.win.ResizeObserver === "function" ? new this.win.ResizeObserver(() => this.schedule()) : null;
      this.resizeObserver?.observe(editor.element);
      this.measure();
      this.reposition();
    }
    // Measure both orientations up front so the placement math can evaluate the
    // rail without first switching to it.
    measure() {
      const wasRail = this.root.classList.contains("richclay-float-rail");
      this.root.style.visibility = "hidden";
      this.root.classList.remove("richclay-float-rail");
      this.bar = { width: this.root.offsetWidth || 0, height: this.root.offsetHeight || 0 };
      this.root.classList.add("richclay-float-rail");
      this.rail = { width: this.root.offsetWidth || 0, height: this.root.offsetHeight || 0 };
      this.root.classList.toggle("richclay-float-rail", wasRail);
      this.root.style.visibility = "";
    }
    schedule() {
      if (!this.win.requestAnimationFrame) {
        this.reposition();
        return;
      }
      if (this.frame) return;
      this.frame = this.win.requestAnimationFrame(() => {
        this.frame = 0;
        this.reposition();
      });
    }
    setVisible(visible) {
      this.hidden = !visible;
      this.reposition();
    }
    reposition() {
      if (this.hidden) {
        this.root.style.display = "none";
        return;
      }
      const anchor = this.editor.element.getBoundingClientRect();
      const viewport = {
        width: this.win.visualViewport?.width ?? this.win.innerWidth,
        height: this.win.visualViewport?.height ?? this.win.innerHeight
      };
      const placement = placeToolbar({
        anchor,
        bar: this.bar,
        rail: this.rail,
        viewport,
        current: this.mode
      });
      this.mode = placement.mode;
      if (placement.mode === "hidden") {
        this.root.style.display = "none";
        return;
      }
      this.root.style.display = "";
      this.root.classList.toggle(
        "richclay-float-rail",
        placement.mode === "rail-left" || placement.mode === "rail-right"
      );
      this.root.classList.toggle("richclay-float-pinned", placement.mode === "pinned");
      this.root.style.transform = `translate(${Math.round(placement.x)}px, ${Math.round(placement.y)}px)`;
    }
    destroy() {
      if (this.frame) this.win.cancelAnimationFrame?.(this.frame);
      this.frame = 0;
      this.doc.removeEventListener("scroll", this.onScroll, { capture: true });
      this.win.removeEventListener("resize", this.onResize);
      this.win.visualViewport?.removeEventListener("resize", this.onResize);
      this.win.visualViewport?.removeEventListener("scroll", this.onScroll);
      this.resizeObserver?.disconnect();
      this.toolbar.destroy();
      this.root.remove();
    }
  };

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
  var INLINE_SANITIZE_EXTENSIONS = {
    ADD_TAGS: ["img"],
    ADD_ATTR: ["class", "id", "src", "alt", "width", "height"]
  };
  function inlineSanitizeConfig(config = {}) {
    return {
      ...config,
      ADD_TAGS: [.../* @__PURE__ */ new Set([...INLINE_SANITIZE_EXTENSIONS.ADD_TAGS, ...config.ADD_TAGS || []])],
      ADD_ATTR: [.../* @__PURE__ */ new Set([...INLINE_SANITIZE_EXTENSIONS.ADD_ATTR, ...config.ADD_ATTR || []])],
      ALLOW_DATA_ATTR: config.ALLOW_DATA_ATTR ?? true
    };
  }
  var FLATTEN_SELECTOR = "p, div, h1, h2, h3, h4, h5, h6, blockquote, pre, ul, ol, li, figure, figcaption, table, thead, tbody, tr, td, th";
  function flattenFragmentToSingleLine(fragment) {
    const doc = fragment.ownerDocument || document;
    fragment.querySelectorAll?.("br").forEach((br) => br.replaceWith(doc.createTextNode(" ")));
    let block = fragment.querySelector?.(FLATTEN_SELECTOR);
    while (block) {
      const parent = block.parentNode;
      parent.insertBefore(doc.createTextNode(" "), block);
      while (block.firstChild) parent.insertBefore(block.firstChild, block);
      parent.insertBefore(doc.createTextNode(" "), block);
      block.remove();
      block = fragment.querySelector(FLATTEN_SELECTOR);
    }
    collapseFragmentWhitespace(fragment, doc);
    return fragment;
  }
  function collapseFragmentWhitespace(fragment, doc) {
    fragment.normalize?.();
    const walker = doc.createTreeWalker(
      fragment,
      4
      /* NodeFilter.SHOW_TEXT */
    );
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      node.nodeValue = node.nodeValue.replace(/\s+/g, " ");
    });
    const first = fragment.firstChild;
    if (first?.nodeType === 3) first.nodeValue = first.nodeValue.replace(/^\s+/, "");
    const last = fragment.lastChild;
    if (last?.nodeType === 3) last.nodeValue = last.nodeValue.replace(/\s+$/, "");
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
  var autoInitWindows = /* @__PURE__ */ new WeakSet();
  var watchedWindows = /* @__PURE__ */ new WeakSet();
  var globalRegistry = createDefaultRegistry();
  var KEEP_FOCUS = Symbol("richclay-keep-focus");
  var ROOT_TRANSFER_EVENTS = ["cut", "paste", "drop"];
  var MODIFIER_ORDER = ["Alt", "Ctrl", "Meta", "Shift"];
  var dialogSeq = 0;
  var defaultOptions = {
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
  var RichClay = class _RichClay {
    static presets = presets;
    static selector = RICHCLAY_SELECTOR;
    constructor(element, options = {}) {
      if (!element) throw new Error("RichClay requires an element.");
      const existing = instances.get(element);
      if (existing) return existing;
      this.element = element;
      this.unsupported = conflictsWithExistingEditor(element) || refuseUnsupportedRoot(element);
      const derived = { ...parseEditableOptions(element), ...options };
      this.options = { ...defaultOptions, ...derived };
      if (this.options.singleLine && !("toolbar" in derived)) {
        this.options.toolbar = "inline";
      }
      this._blockTag = this.options.inline ? "DIV" : "P";
      this.registry = new Map(globalRegistry);
      this.toolbar = null;
      this.float = null;
      this._onToolbarKey = null;
      this._onFloatFocusOut = null;
      this._onDocPointerDown = null;
      this.liveRegion = null;
      this.description = null;
      this.dialog = null;
      this.savedSelection = null;
      this.path = "";
      this.active = false;
      this._squire = null;
      this._squireListeners = [];
      this._onBeforeInput = null;
      this._onRootBeforeInput = null;
      this._onRootKeydown = null;
      this._onRootTransfer = null;
      this._shortcutKeys = [];
      this._appleDeleteKeys = /* @__PURE__ */ new Set();
      this._authoredPres = /* @__PURE__ */ new WeakSet();
      this._warnedInlineBlock = false;
      this._onFocus = () => {
        this.element.classList.add("richclay-focused");
        if (this.options.inline) this.ensureFloatingToolbar();
      };
      this._onBlur = (event) => {
        this.element.classList.remove("richclay-focused");
        if (this.options.inline) this.scheduleFloatTeardown(event);
      };
      this.ensureMarker();
      this.hyperclay = shouldUseHyperclay(this.options, this.window);
      if (this.hyperclay) installHyperclayBridge(this.window);
      instances.set(element, this);
      this.sanitizeConfig = this.options.inline ? inlineSanitizeConfig(this.options.sanitize) : this.options.sanitize;
      this.sanitizer = createSanitizer(this.sanitizeConfig, this.element.ownerDocument);
      if (!this.options.inline) {
        sanitizeElement(this.element, this.sanitizeConfig);
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
      const guard = selector === RICHCLAY_SELECTOR ? isRichClayHost : () => true;
      const elements = resolveElements(selector).filter(guard).filter((element) => !conflictsWithExistingEditor(element));
      return elements.map((element) => new _RichClay(element, options));
    }
    static autoInit(win = typeof window !== "undefined" ? window : void 0) {
      if (!win || !win.document || autoInitWindows.has(win)) return;
      autoInitWindows.add(win);
      const run = () => {
        if (shouldUseHyperclay({}, win) && isHyperclayEditMode(win)) {
          _RichClay.init();
          _RichClay.watch(win);
        }
      };
      if (win.document.readyState === "loading") {
        win.document.addEventListener("DOMContentLoaded", run, { once: true });
      } else {
        run();
      }
    }
    static watch(win = typeof window !== "undefined" ? window : void 0, options = {}) {
      if (!win || !win.document || watchedWindows.has(win)) return;
      watchedWindows.add(win);
      const mount = (element) => {
        if (!isMountable(element)) return;
        if (!instances.has(element) && !conflictsWithExistingEditor(element)) new _RichClay(element, options);
      };
      const unmount = (element) => instances.get(element)?.destroy();
      const observer = new win.MutationObserver((records) => {
        records.forEach((record) => {
          if (record.type === "attributes") {
            const target = record.target;
            if (isMountable(target)) mount(target);
            else unmount(target);
            return;
          }
          record.addedNodes.forEach((node) => {
            if (node.nodeType !== 1) return;
            if (node.matches?.(RICHCLAY_SELECTOR)) mount(node);
            node.querySelectorAll?.(RICHCLAY_SELECTOR).forEach(mount);
          });
          record.removedNodes.forEach((node) => {
            if (node.nodeType !== 1) return;
            const teardown = (el) => {
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
        attributeFilter: ["editable", "clay-editable", "data-richclay", "richclay"]
      });
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
      if (this.unsupported) return;
      if (this.active) return;
      this.active = true;
      if (isInlineTag(this.element) && !this.element.style.display) {
        this.element.style.display = "inline-block";
        this.element.setAttribute("data-richclay-runtime-display", "true");
      }
      ensureStyles(this.element.ownerDocument);
      consumeInertContenteditable(this.element);
      const initialNodes = this.options.inline ? Array.from(this.element.childNodes) : null;
      const initialHTML = this.options.inline ? null : this.element.innerHTML;
      const Squire = this.options.Squire || this.window.Squire || globalThis.Squire;
      if (!Squire) {
        throw new Error("RichClay requires Squire. Load vendor/squire.js before richclay.js.");
      }
      this.setupEditorAttributes();
      this.liveRegion = createLiveRegion(this.element.ownerDocument);
      this._squire = new Squire(this.element, {
        blockTag: this._blockTag,
        sanitizeToDOMFragment: (html, editor) => {
          const fragment = this.sanitizer.sanitizeToDOMFragment(html, editor);
          return this.options.singleLine ? flattenFragmentToSingleLine(fragment) : fragment;
        },
        didError: (error) => {
          console.error("RichClay/Squire error", error);
        }
      });
      if (this.options.inline) {
        this.element.replaceChildren(...initialNodes);
        this.resetSquireUndoBaseline();
      } else {
        this._squire.setHTML(initialHTML);
      }
      this.bindSquire();
      if (this.options.singleLine) this.installSingleLineGuards();
      if (this.options.inline && !this.options.singleLine) this.installRootGuards();
      this.installAppleDeleteKeys();
      if (this.blocksStayOut()) this._squire._ensureBottomLine = () => {
      };
      this.maskSquireCodeShortcut();
      this.maskSquireBlockShortcuts();
      this.installShortcuts();
      if (this.options.inline) {
        this._onToolbarKey = (event) => {
          if (event.altKey && event.key === "F10") {
            event.preventDefault();
            this.ensureFloatingToolbar();
            this.float?.toolbar.focusFirst();
          }
        };
        this.element.addEventListener("keydown", this._onToolbarKey);
      }
      if (this.blocksStayOut()) {
        const willPaste = (event) => {
          const fragment = event.detail?.fragment;
          if (!fragment) return;
          const doc = this.element.ownerDocument;
          flattenBlocks(
            fragment,
            () => this.options.singleLine ? doc.createTextNode(" ") : doc.createElement("br")
          );
        };
        this._squire.addEventListener("willPaste", willPaste);
        this._squireListeners.push(["willPaste", willPaste]);
      }
      this.renderToolbar();
      this.updatePlaceholder();
      this.warnOnBlockInInlineRegion();
      this.element.querySelectorAll("pre").forEach((pre) => this._authoredPres.add(pre));
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
      this._shortcutKeys.forEach((key) => this._squire?.setKeyHandler?.(key, null));
      this._squireListeners.forEach(([type, listener]) => {
        this._squire?.removeEventListener?.(type, listener);
      });
      this._squireListeners = [];
      this._shortcutKeys = [];
      if (this._onBeforeInput) {
        this.element.ownerDocument.removeEventListener("beforeinput", this._onBeforeInput, true);
        this._onBeforeInput = null;
      }
      const doc = this.element.ownerDocument;
      if (this._onRootBeforeInput) {
        doc.removeEventListener("beforeinput", this._onRootBeforeInput, true);
        this._onRootBeforeInput = null;
      }
      if (this._onRootKeydown) {
        doc.removeEventListener("keydown", this._onRootKeydown, true);
        this._onRootKeydown = null;
      }
      if (this._onRootTransfer) {
        ROOT_TRANSFER_EVENTS.forEach((type) => doc.removeEventListener(type, this._onRootTransfer, true));
        this._onRootTransfer = null;
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
    // Squire's invariant is established on the first real edit rather than at
    // activation, so that opening a page in edit mode never rewrites it. These
    // listeners capture on the document, so the root is valid before Squire's own
    // handlers see the event. History inputs are skipped: repairing mid-undo would
    // fight the stack it is replaying.
    installRootGuards() {
      const doc = this.element.ownerDocument;
      const owns = (event) => this.element.contains(event.target);
      this._onRootBeforeInput = (event) => {
        if (!owns(event) || event.isComposing || /^history/.test(event.inputType || "")) return;
        this.ensureRootIsEditable();
      };
      this._onRootKeydown = (event) => {
        if (!owns(event) || event.defaultPrevented || event.isComposing) return;
        if (this.isEditingKey(event)) this.ensureRootIsEditable();
      };
      this._onRootTransfer = (event) => {
        if (owns(event)) this.ensureRootIsEditable();
      };
      doc.addEventListener("beforeinput", this._onRootBeforeInput, true);
      doc.addEventListener("keydown", this._onRootKeydown, true);
      ROOT_TRANSFER_EVENTS.forEach((type) => {
        doc.addEventListener(type, this._onRootTransfer, true);
      });
    }
    // Re-checked rather than latched, because Hyperclay's live sync morphs new DOM
    // into the region long after activation and can reintroduce a loose text node.
    ensureRootIsEditable() {
      if (!this._squire || this.options.singleLine) return;
      const wrapBareRoot = this.options.inline;
      const blocksAllowed = !this.blocksStayOut();
      if (!editorRootNeedsNormalization(this.element, { wrapBareRoot, blocksAllowed })) return;
      const range = getSquireSelection(this._squire);
      const saved = range ? captureRange(this.element, range) : null;
      const repair = () => {
        normalizeEditorRoot(this.element, {
          blockTag: this._blockTag,
          wrapBareRoot,
          blocksAllowed,
          onBareRootWrapped: (root, wrapper) => {
            console.warn(
              `richclay: wrapped this region's loose text in a <div> so multi-line editing works. Wrap the content in your own block element to keep the markup you wrote, or use editable="single-line" if it is meant to be one line.`,
              root,
              wrapper
            );
          }
        });
      };
      if (typeof this._squire.modifyDocument === "function") this._squire.modifyDocument(repair);
      else repair();
      if (saved) {
        restoreRange(this.element, range, saved);
        restoreSquireSelection(this._squire, range);
        this.savedSelection = cloneRange(range);
      }
    }
    // Only keys that will actually edit. Repairing is not free on a root that has
    // not been repaired yet, which is every freshly opened page, so a blanket
    // "any single-character key" made Cmd+C and Cmd+S rewrite an untouched region.
    // The only modified keys that do edit are the ones this editor rebound itself,
    // which is why the set is asked rather than Squire's dispatch mirrored.
    isEditingKey(event) {
      if (["Backspace", "Delete", "Enter"].includes(event.key)) return true;
      if (event.key === "Tab") return this.caretIsInList();
      if (event.key.length !== 1) return false;
      if (!event.ctrlKey && !event.metaKey && !event.altKey) return true;
      return event.ctrlKey && !event.metaKey && !event.altKey && this._appleDeleteKeys.has(event.key.toLowerCase());
    }
    caretIsInList() {
      const range = this._squire?.getSelection();
      const container = range?.startContainer;
      if (!container) return false;
      const element = container.nodeType === 1 ? container : container.parentElement;
      return Boolean(element && this.element.contains(element) && element.closest("ul, ol"));
    }
    runControl(def) {
      if (!this._squire || typeof def.run !== "function") return;
      if (def.isDisabled?.(this)) return;
      this.restoreSelection();
      if (def.mutates !== false) this.ensureRootIsEditable();
      const result = def.run(this);
      this.element.querySelectorAll("pre:not([data-richclay-pre])").forEach((pre) => {
        if (!this._authoredPres.has(pre)) pre.setAttribute("data-richclay-pre", "");
      });
      if (def.mutates !== false) {
        this.ensureRootIsEditable();
        this.anchorSelectionInBlock();
      }
      this.saveSelection();
      this.toolbar?.update();
      this.updatePlaceholder();
      this.announceControl(def);
      if (result !== KEEP_FOCUS) {
        this.focus();
      }
      this.warnOnBlockInInlineRegion();
    }
    // Squire's modifyBlocks leaves the caret anchored on the root itself, between
    // blocks. From there getStartBlockOfRange finds no block, so the next block
    // command is a silent no-op — the "it stopped working" the user hit. Push a
    // collapsed caret back inside the block it is sitting in front of.
    anchorSelectionInBlock() {
      const range = getSquireSelection(this._squire);
      if (!range?.collapsed || range.startContainer !== this.element) return;
      const children = Array.from(this.element.childNodes);
      const atEnd = range.startOffset >= children.length;
      const child = atEnd ? children.filter(isCaretHost).pop() : children.slice(range.startOffset).find(isCaretHost) || children.slice(0, range.startOffset).filter(isCaretHost).pop();
      if (!child) return;
      const edge = caretEdge(child, !atEnd);
      range.setStart(edge, atEnd ? nodeLength(edge) : 0);
      range.collapse(true);
      restoreSquireSelection(this._squire, range);
    }
    selectionHasFormat(tag) {
      if (!tag || !this._squire?.hasFormat) return false;
      try {
        return this._squire.hasFormat(tag);
      } catch {
        return false;
      }
    }
    // Squire sets its path to "(selection)" whenever the selection spans more than
    // one node, so asking the path answered "no" for every multi-block selection.
    // Both boundaries must land in the same matching element, or a selection that
    // merely starts in a list would report as being in one.
    pathHas(tag) {
      const range = getSquireSelection(this._squire);
      if (!range) return false;
      const selector = tag.toLowerCase();
      const start = matchAtBoundary(this.element, range.startContainer, range.startOffset, true, selector);
      return Boolean(start) && start === matchAtBoundary(this.element, range.endContainer, range.endOffset, false, selector);
    }
    // Blocks stay out of this region for either of two reasons, and both are fixed
    // for the editor's life, which is why the toolbar can leave the controls out
    // rather than grey them. Either the parser would eject a block on the next page
    // load, or the author wrote the region as a line of text and richclay does not
    // rewrite what they wrote.
    blocksStayOut() {
      return this.options.singleLine || ejectsBlocks(this.element) || keepsTextShape(this.element);
    }
    // Advisory only: the markup is stable and saves correctly, it just will not
    // validate. Checked when the editor mounts and after any command, which covers
    // the ways an author actually produces one. Paste is deliberately not covered:
    // nothing hooks paste any more, and a console note is not worth reinstating a
    // hook that took three rounds to get wrong.
    warnOnBlockInInlineRegion() {
      if (this._warnedInlineBlock || !isInlineTag(this.element)) return;
      if (!hasBlockDescendant(this.element)) return;
      this._warnedInlineBlock = true;
      const tag = this.element.nodeName.toLowerCase();
      console.warn(
        `richclay: a block element inside <${tag} editable> is not valid HTML. It stays where it is and saves correctly, but a validator will flag it. Put the editable attribute on a block element if you want blocks here.`,
        this.element
      );
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
      if (!isMountable(this.element)) {
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
      const pathChange = (event) => {
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
      this._onFloatFocusOut = (event) => this.scheduleFloatTeardown(event);
      this.float.root.addEventListener("focusout", this._onFloatFocusOut);
      this._onDocPointerDown = (event) => {
        if (this.ownsFocusTarget(event.target)) return;
        const doc = this.element.ownerDocument;
        if (doc.activeElement && this.ownsFocusTarget(doc.activeElement)) {
          doc.activeElement.blur?.();
        }
        this.teardownFloatingToolbar();
      };
      this.element.ownerDocument.addEventListener("pointerdown", this._onDocPointerDown, true);
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
      if (this._onDocPointerDown) {
        this.element.ownerDocument.removeEventListener("pointerdown", this._onDocPointerDown, true);
        this._onDocPointerDown = null;
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
      return node === this.element || this.element.contains(node) || Boolean(this.float?.root.contains(node)) || Boolean(this.dialog?.contains(node));
    }
    updateFloatVisibility() {
      if (!this.float) return;
      const range = this.savedSelection;
      this.float.setVisible(Boolean(range && !range.collapsed));
    }
    resolveToolbarControls(toolbar) {
      if (toolbar === false || toolbar === null || toolbar === "none") return [];
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
      const registryDefs = [...this.registry.values()].filter(
        (def) => !this.options.singleLine || presets.inline.includes(def.id)
      );
      const defs = [...this.resolveToolbarControls(this.options.toolbar), ...registryDefs];
      defs.forEach((def) => {
        if (def.type === "menu" || def.type === "separator") return;
        if (!def.shortcut || !def.id || seen.has(def.id)) return;
        if (def.isDisabled?.(this)) {
          const masked = shortcutKey(def.shortcut, this.window);
          this._squire.setKeyHandler(masked, null);
          this._shortcutKeys.push(masked);
          return;
        }
        seen.add(def.id);
        const key = shortcutKey(def.shortcut, this.window);
        this._squire.setKeyHandler(key, (squire, event) => {
          event.preventDefault();
          this.runControl(def);
        });
        this._shortcutKeys.push(key);
      });
    }
    // macOS sends Ctrl+D and Ctrl+H to the browser's own forward/backward delete,
    // which merges two blocks by wrapping the moved text in a computed-style
    // <span> — permanent junk in an editor whose DOM is the saved document. Point
    // them at Squire's own handlers so they behave exactly like Delete and
    // Backspace. Reads Squire's key handler table; no-ops for other engines.
    // Squire binds Code to the platform modifier itself, on _keyHandlers' prototype,
    // so dropping richclay's own shortcut is not enough to retire it. An own
    // property of null shadows the inherited handler and the key falls through.
    maskSquireCodeShortcut() {
      const key = `${isApplePlatform(this.window) ? "Meta" : "Ctrl"}-d`;
      this._squire.setKeyHandler(key, null);
      this._shortcutKeys.push(key);
    }
    // Squire binds these on _keyHandlers' prototype, and richclay has no definition
    // carrying some of them, so filtering richclay's own shortcuts cannot reach
    // them: Mod+] kept building a <blockquote> in a <p editable> through every
    // round. An own property of null shadows the inherited handler and the key
    // falls through. The prefix must match the one Squire computed, which is why
    // the test harness has to agree about the platform.
    maskSquireBlockShortcuts() {
      if (!this.blocksStayOut()) return;
      const mod = isApplePlatform(this.window) ? "Meta" : "Ctrl";
      [`${mod}-]`, `${mod}-[`, `${mod}-Shift-8`, `${mod}-Shift-9`].forEach((key) => {
        this._squire.setKeyHandler(key, null);
        this._shortcutKeys.push(key);
      });
    }
    // Squire's toggleCode() makes a block <pre> when the selection is collapsed,
    // which inside a heading or a paragraph root means a code block where no block
    // can legally go. Those regions get inline <code> instead.
    toggleCode() {
      if (!this.blocksStayOut()) return this._squire.toggleCode();
      if (this.selectionHasFormat("CODE")) return this._squire.changeFormat(null, { tag: "CODE" });
      return this._squire.changeFormat({ tag: "CODE" }, null);
    }
    installAppleDeleteKeys() {
      if (!isApplePlatform(this.window)) return;
      const handlers = this._squire._keyHandlers;
      if (!handlers) return;
      [["Ctrl-d", "Delete"], ["Ctrl-h", "Backspace"]].forEach(([key, native]) => {
        if (typeof handlers[native] !== "function") return;
        this._squire.setKeyHandler(key, handlers[native]);
        this._shortcutKeys.push(key);
        this._appleDeleteKeys.add(key.slice("Ctrl-".length));
      });
    }
    installSingleLineGuards() {
      ["Enter", "Shift-Enter"].forEach((key) => {
        this._squire.setKeyHandler(key, (squire, event) => event.preventDefault());
        this._shortcutKeys.push(key);
      });
      this._onBeforeInput = (event) => {
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
  };
  function resolveElements(selector) {
    if (typeof selector === "string") {
      return Array.from(document.querySelectorAll(selector));
    }
    if (selector?.nodeType === 1) return [selector];
    return Array.from(selector || []);
  }
  function matchAtBoundary(root, container, offset, first, selector) {
    let node = container;
    if (node === root) {
      const children = Array.from(root.childNodes).filter(isCaretHost);
      if (!children.length) return null;
      const index = first ? Math.min(offset, children.length - 1) : Math.min(Math.max(offset - 1, 0), children.length - 1);
      node = caretEdge(children[index], first);
    }
    const element = node?.nodeType === 1 ? node : node?.parentElement;
    const match = element?.closest?.(selector);
    return match && root.contains(match) && match !== root ? match : null;
  }
  function closestConflictingAncestor(element) {
    let node = element.parentElement;
    while (node) {
      if (instances.has(node) || isMountable(node)) return node;
      node = node.parentElement;
    }
    return null;
  }
  function isMountable(element) {
    return Boolean(element.matches?.(RICHCLAY_SELECTOR)) && isRichClayHost(element);
  }
  function conflictsWithExistingEditor(element) {
    const host = closestConflictingAncestor(element);
    const nested = Array.from(element.querySelectorAll?.(RICHCLAY_SELECTOR) || []).find(
      (node) => instances.has(node)
    );
    const other = host || nested;
    if (!other) return false;
    console.warn(
      "richclay: nested editable regions are not supported, so this one was skipped. Remove the editable attribute from either it or the other region.",
      element,
      other
    );
    return true;
  }
  function refuseUnsupportedRoot(element) {
    if (!isUnsupportedRootTag(element)) return false;
    console.warn(`richclay: ${unsupportedRootReason(element)} This region was skipped.`, element);
    return true;
  }
  function validateButton(def) {
    if (!def || !def.id) throw new Error("RichClay button definitions require an id.");
    if (def.type !== "menu" && typeof def.run !== "function") {
      throw new Error(`RichClay button "${def.id}" requires a run(editor) function.`);
    }
  }
  function shortcutKey(shortcut, win) {
    const parts = shortcut.split("+");
    const keyPart = parts[parts.length - 1];
    const modifiers = new Set(parts.slice(0, -1).map(normalizeModifier));
    if (modifiers.delete("Mod")) modifiers.add(isApplePlatform(win) ? "Meta" : "Ctrl");
    const key = keyPart.length === 1 ? modifiers.has("Shift") ? keyPart.toUpperCase() : keyPart.toLowerCase() : keyPart;
    const prefix = MODIFIER_ORDER.filter((modifier) => modifiers.has(modifier)).join("-");
    return `${prefix ? `${prefix}-` : ""}${key}`;
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

/* Inline editors ([editable]) inherit the page's own styling. richclay adds
   only a caret, a discoverability outline, and empty-state affordances. */
.richclay-inline {
  caret-color: currentColor;
}

.richclay-inline:hover {
  outline: 1px dashed var(--richclay-border);
  outline-offset: 2px;
}

.richclay-inline.richclay-focused,
.richclay-inline:focus-visible {
  outline: 2px dashed var(--richclay-focus);
  outline-offset: 2px;
}

.richclay-inline.richclay-empty {
  min-height: 1em;
  min-width: 1ch;
}

.richclay-inline.richclay-empty::before {
  color: var(--richclay-muted);
  content: attr(data-richclay-placeholder);
  pointer-events: none;
}

/* Floating toolbar shell for inline editors. Fixed-position and body-mounted:
   fixed elements never create scrollbars, and body mounting avoids transformed
   ancestors silently turning fixed into ancestor-relative. */
.richclay-float {
  left: 0;
  position: fixed;
  top: 0;
  will-change: transform;
  z-index: 99999;
}

.richclay-float .richclay-toolbar {
  box-shadow: var(--richclay-shadow);
  margin-block: 0;
}

.richclay-float .richclay-dialog {
  margin-block: 6px 0;
}

/* Compact vertical rail for narrow margins. */
.richclay-float-rail .richclay-toolbar {
  --richclay-control-size: 28px;
  flex-direction: column;
  flex-wrap: nowrap;
}

.richclay-float-rail .richclay-toolbar svg {
  height: 15px;
  width: 15px;
}

.richclay-float-rail .richclay-separator {
  align-self: stretch;
  height: 1px;
  margin: 4px 5px;
  width: auto;
}

.richclay-float-rail .richclay-menu {
  inset-block-start: 0;
  inset-inline-start: calc(100% + 4px);
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
   scrolling its own overflow. box-sizing keeps padding inside that 100%.
   Containment applies to inline editors too: \`white-space: pre\` never wraps, so
   without it one code block runs off the side of the page. Only the decoration
   below stays card-scoped, since inline mode keeps the page's own typography. */
.richclay-editor pre,
.richclay-inline pre {
  box-sizing: border-box;
  min-width: 100%;
  overflow: auto;
  width: 0;
}

.richclay-editor pre {
  background: var(--richclay-surface-alt);
  border-radius: 4px;
  padding: 10px;
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
