// Toolbar icons in the OverType / Quill style (18×18, stroke-based). OverType's
// set covers bold, italic, code, link, lists and quote verbatim; underline,
// strikethrough and clear-formatting come from Quill (its upstream source) with
// the ql-stroke/ql-fill classes inlined. Neither ships undo/redo, so those are
// drawn here in the same stroke style with proper chevron arrowheads.
const S = 'stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"';
const STHIN = 'stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"';
const F = 'fill="currentColor"';

const svg = (inner, viewBox = "0 0 18 18") =>
  `<svg viewBox="${viewBox}" width="18" height="18" aria-hidden="true" focusable="false">${inner}</svg>`;

const linkInner = `<line ${S} x1="7" x2="11" y1="7" y2="11"/><path ${S} d="M8.9,4.577a3.476,3.476,0,0,1,.36,4.679A3.476,3.476,0,0,1,4.577,8.9C3.185,7.5,2.035,6.4,4.217,4.217S7.5,3.185,8.9,4.577Z"/><path ${S} d="M13.423,9.1a3.476,3.476,0,0,0-4.679-.36,3.476,3.476,0,0,0,.36,4.679c1.392,1.392,2.5,2.542,4.679.36S14.815,10.5,13.423,9.1Z"/>`;

const icons = {
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

export const presets = {
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

export function createDefaultRegistry() {
  return new Map(defaultButtons.map(button => [button.id, button]));
}

export function formatShortcut(shortcut) {
  if (!shortcut) return "";
  const platform = globalThis.navigator?.platform || "";
  const mod = /Mac|iPhone|iPad|iPod/.test(platform) ? "Cmd" : "Ctrl";
  return shortcut.replace("Mod", mod);
}

export const defaultButtons = [
  toggle("bold", "Bold", icons.bold, "Mod+B", "inline", editor => editor.toggleFormat("B", "bold", "removeBold")),
  toggle("italic", "Italic", icons.italic, "Mod+I", "inline", editor =>
    editor.toggleFormat("I", "italic", "removeItalic")
  ),
  toggle("underline", "Underline", icons.underline, "Mod+U", "inline", editor =>
    editor.toggleFormat("U", "underline", "removeUnderline")
  ),
  toggle("strikethrough", "Strikethrough", icons.strike, "Mod+Shift+7", "inline", editor =>
    editor.toggleFormat("S", "strikethrough", "removeStrikethrough")
  ),
  toggle("code", "Code", icons.code, "Mod+D", "inline", editor => editor.squire.toggleCode(), editor =>
    editor.selectionHasFormat("CODE") || editor.selectionHasFormat("PRE")
  ),
  {
    id: "link",
    label: "Link",
    ariaLabel: "Insert or edit link",
    icon: icons.link,
    group: "links",
    shortcut: "Mod+K",
    run: editor => editor.openLinkDialog(),
    isActive: editor => editor.selectionHasFormat("A")
  },
  {
    id: "unlink",
    label: "Remove link",
    ariaLabel: "Remove link",
    icon: icons.unlink,
    group: "links",
    run: editor => editor.squire.removeLink()
  },
  toggle("unorderedList", "Bulleted list", icons.ul, "Mod+Shift+8", "lists",
    editor => editor.toggleList("UL"),
    editor => editor.pathHas("UL")
  ),
  toggle("orderedList", "Numbered list", icons.ol, "Mod+Shift+9", "lists",
    editor => editor.toggleList("OL"),
    editor => editor.pathHas("OL")
  ),
  toggle("quote", "Quote", icons.quote, null, "blocks", editor => {
    if (editor.pathHas("BLOCKQUOTE")) return editor.squire.decreaseQuoteLevel();
    return editor.squire.increaseQuoteLevel();
  }, editor => editor.pathHas("BLOCKQUOTE")),
  {
    id: "outdent",
    label: "Outdent",
    ariaLabel: "Decrease indent",
    icon: icons.outdent,
    group: "blocks",
    shortcut: "Mod+[",
    run: editor => editor.outdent()
  },
  {
    id: "indent",
    label: "Indent",
    ariaLabel: "Increase indent",
    icon: icons.indent,
    group: "blocks",
    shortcut: "Mod+]",
    run: editor => editor.indent()
  },
  {
    id: "undo",
    label: "Undo",
    ariaLabel: "Undo",
    icon: icons.undo,
    group: "history",
    shortcut: "Mod+Z",
    run: editor => editor.squire.undo()
  },
  {
    id: "redo",
    label: "Redo",
    ariaLabel: "Redo",
    icon: icons.redo,
    group: "history",
    shortcut: "Mod+Shift+Z",
    run: editor => editor.squire.redo()
  },
  {
    id: "clearFormatting",
    label: "Clear formatting",
    ariaLabel: "Clear formatting",
    icon: icons.clear,
    group: "cleanup",
    run: editor => editor.squire.removeAllFormatting()
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
        run: editor => editor.squire.increaseQuoteLevel(),
        isActive: editor => editor.pathHas("BLOCKQUOTE")
      },
      {
        label: "Code block",
        value: "PRE",
        run: editor => editor.setBlockType("PRE"),
        isActive: editor => editor.pathHas("PRE")
      }
    ]
  }
];

function toggle(id, label, icon, shortcut, group, run, isActive = editor => editor.selectionHasFormat(labelTag(id))) {
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
    run: editor => editor.setBlockType(tag),
    isActive: editor => editor.pathHas(tag)
  };
}
