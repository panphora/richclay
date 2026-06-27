const iconAttrs = 'viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"';

const icons = {
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

export const presets = {
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
