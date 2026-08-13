import test from "node:test";
import assert from "node:assert/strict";
import { setupDom, FakeSquire, setPlatform } from "./helpers.js";
import RichClay from "../src/richclay.js";

const stringCommands = squire => squire.commands.filter(command => typeof command === "string");

// pathHas reads the DOM rather than Squire's path string, so a test that wants a
// command to see itself inside a list has to put the list, and the selection,
// really there.
const selectContents = (editor, node) => {
  const range = node.ownerDocument.createRange();
  range.selectNodeContents(node);
  editor.squire.setSelection(range);
  editor.saveSelection();
};

test("toggling an active format runs the remove command and clears aria-pressed", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>x</p></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: ["bold"]
  });

  const bold = document.querySelector("[data-richclay-control='bold']");
  bold.click();
  assert.equal(bold.getAttribute("aria-pressed"), "true");

  bold.click();
  assert.equal(bold.getAttribute("aria-pressed"), "false");
  assert.deepEqual(stringCommands(editor.squire), ["bold", "removeBold"]);
});

test("block menu applies a block type by rewriting the block element", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>Title</p></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: ["blockMenu"]
  });

  document.querySelector("[data-richclay-control='blockMenu']").click();
  const headingItem = Array.from(document.querySelectorAll(".richclay-menu-item")).find(
    item => item.textContent === "Heading 2"
  );
  headingItem.click();

  assert.equal(editor.getHTML(), "<h2>Title</h2>");
  assert.equal(document.querySelector("[role='menu']").hidden, true);
});

test("list button toggles the list on and off by path", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>x</p></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: ["unorderedList"]
  });

  const list = document.querySelector("[data-richclay-control='unorderedList']");
  list.click();

  editor.element.innerHTML = "<ul><li>x</li></ul>";
  selectContents(editor, editor.element.querySelector("li"));
  editor.toolbar.update();
  assert.equal(list.getAttribute("aria-pressed"), "true");

  list.click();
  assert.deepEqual(stringCommands(editor.squire), ["makeUnorderedList", "removeList"]);
});

test("indent/outdent target list level inside a list and quote level otherwise", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>x</p></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: []
  });

  editor.indent();
  editor.outdent();
  assert.deepEqual(stringCommands(editor.squire), ["increaseQuoteLevel", "decreaseQuoteLevel"]);

  editor.element.innerHTML = "<ul><li>x</li></ul>";
  selectContents(editor, editor.element.querySelector("li"));
  editor.squire.commands.length = 0;
  editor.indent();
  editor.outdent();
  assert.deepEqual(stringCommands(editor.squire), ["increaseListLevel", "decreaseListLevel"]);
});

const shortcutHandlers = editor =>
  new Map(
    editor.squire.commands
      .filter(command => Array.isArray(command) && command[0] === "shortcut")
      .map(([, key, fn]) => [key, fn])
  );

test("keyboard shortcuts bind Ctrl on non-Apple platforms and run their command", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>x</p></div></body></html>');
  setPlatform(window, "Win32");
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: "minimal"
  });

  // Shortcuts come from the standard preset regardless of the visible toolbar.
  const handlers = shortcutHandlers(editor);
  assert.equal(handlers.has("Ctrl-b"), true);
  assert.equal(handlers.has("Meta-b"), false);

  handlers.get("Ctrl-b")(editor.squire, { preventDefault() {} });
  assert.equal(stringCommands(editor.squire).includes("bold"), true);
});

// The bug this guards: aliasing every Mod+ shortcut to Ctrl as well as Meta made
// richclay swallow the macOS Emacs bindings that work in every other text field.
// Ctrl+D ran "code" (wrapping the block in <pre>) instead of deleting forward,
// and Ctrl+K opened the link dialog instead of killing to end of line.
test("keyboard shortcuts leave the macOS Ctrl bindings alone on Apple platforms", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>x</p></div></body></html>');
  setPlatform(window, "MacIntel");
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: "standard"
  });

  const handlers = shortcutHandlers(editor);
  assert.equal(handlers.has("Meta-b"), true);
  ["Ctrl-b", "Ctrl-k", "Ctrl-i", "Ctrl-u", "Ctrl-z"].forEach(key => {
    assert.equal(handlers.has(key), false, `${key} must stay with the platform`);
  });
  // Ctrl+D is the one macOS binding richclay keeps, and it is delete forward,
  // not the code command it used to run.
  assert.equal(handlers.get("Ctrl-d"), editor.squire._keyHandlers.Delete);
});

// Left native, Ctrl+D on macOS reaches Chrome's own forward delete, which merges
// two blocks by wrapping the moved text in a computed-style <span>. Squire's
// handler merges cleanly, so the macOS delete keys are pointed at it.
test("macOS Ctrl delete keys are routed to Squire's own delete handlers", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>x</p></div></body></html>');
  setPlatform(window, "MacIntel");
  const editor = new RichClay(document.querySelector("[data-richclay]"), { Squire: FakeSquire });

  const handlers = shortcutHandlers(editor);
  assert.equal(handlers.get("Ctrl-d"), editor.squire._keyHandlers.Delete);
  assert.equal(handlers.get("Ctrl-h"), editor.squire._keyHandlers.Backspace);
});

test("non-Apple platforms never bind Ctrl+H and retire Squire's own Ctrl+D", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>x</p></div></body></html>');
  setPlatform(window, "Win32");
  const editor = new RichClay(document.querySelector("[data-richclay]"), { Squire: FakeSquire });

  const handlers = shortcutHandlers(editor);
  assert.equal(handlers.has("Ctrl-h"), false);
  // Code has no shortcut, and Squire's own inherited binding is masked with null
  // so the key falls through instead of toggling a code block.
  assert.equal(handlers.get("Ctrl-d"), null);
});

test("single-line Code applies inline <code>, never a <pre> block", () => {
  setupDom('<!doctype html><html><body><h1 editable="single-line">Title</h1></body></html>');
  const editor = new RichClay(document.querySelector("[editable]"), { Squire: FakeSquire });

  editor.toggleCode();
  const formats = editor.squire.commands.filter(c => Array.isArray(c) && c[0] === "changeFormat");
  assert.deepEqual(formats, [["changeFormat", "CODE", null]]);
  assert.equal(stringCommands(editor.squire).includes("toggleCode"), false);
});

test("multi-line Code still uses Squire's block toggle", () => {
  setupDom('<!doctype html><html><body><div editable><p>x</p></div></body></html>');
  const editor = new RichClay(document.querySelector("[editable]"), { Squire: FakeSquire });

  editor.toggleCode();
  assert.equal(stringCommands(editor.squire).includes("toggleCode"), true);
});

// Squire's modifyBlocks re-anchors the caret on the root itself, between blocks,
// where getStartBlockOfRange finds nothing and every later block command is a
// silent no-op.
test("a caret left on the root is pushed back inside a block", () => {
  setupDom('<!doctype html><html><body><div editable><p>One</p><p>Two</p></div></body></html>');
  const element = document.querySelector("[editable]");
  const editor = new RichClay(element, { Squire: FakeSquire, toolbar: false });

  editor.runControl({
    id: "stray",
    label: "Stray",
    run: () => {
      const range = element.ownerDocument.createRange();
      range.setStart(element, 1);
      range.collapse(true);
      editor.squire.setSelection(range);
    }
  });

  const range = editor.squire.getSelection();
  assert.equal(range.startContainer, element.lastChild.firstChild);
  assert.equal(range.startOffset, 0);
});

// Squire's modifyBlocks leaves the caret on the root past the last block. Sent
// back to the start of the block it was sitting after, typing landed in front of
// the text instead of behind it.
test("a caret at the end of the region lands at the end of the last block", () => {
  setupDom(
    '<!doctype html><html><body><div editable><p>One</p><p>Two</p><!-- note --></div></body></html>'
  );
  const element = document.querySelector("[editable]");
  const editor = new RichClay(element, { Squire: FakeSquire, toolbar: false });

  const range = element.ownerDocument.createRange();
  range.setStart(element, element.childNodes.length);
  range.collapse(true);
  editor.squire.setSelection(range);
  editor.anchorSelectionInBlock();

  const caret = editor.squire.getSelection();
  assert.equal(caret.startContainer, element.querySelectorAll("p")[1].firstChild);
  assert.equal(caret.startOffset, 3);
});

// Squire reports "(selection)" for any selection spanning more than one node, so
// asking its path answered "no" for every multi-block selection: the list button
// re-made the list instead of removing it, and Indent quoted it.
test("pathHas reads the DOM, so a selection across two list items still finds its list", () => {
  setupDom(
    '<!doctype html><html><body><div editable><ul><li>One</li><li>Two</li></ul></div></body></html>'
  );
  const element = document.querySelector("[editable]");
  const editor = new RichClay(element, { Squire: FakeSquire, toolbar: false });

  const items = element.querySelectorAll("li");
  const range = element.ownerDocument.createRange();
  range.setStart(items[0].firstChild, 0);
  range.setEnd(items[1].firstChild, 3);
  editor.squire.setSelection(range);
  editor.squire.path = "(selection)";

  assert.equal(editor.pathHas("UL"), true);
  editor.toggleList("UL");
  editor.indent();
  assert.deepEqual(stringCommands(editor.squire), ["removeList", "increaseListLevel"]);
});

// Two Squire instances mutating one subtree is undefined: the outer editor's
// repair restructures the inner one's content behind its back.
test("nested editable regions are skipped with a warning", () => {
  setupDom(
    '<!doctype html><html><body><div editable><p>One</p><div editable><p>Inner</p></div></div></body></html>'
  );

  const warnings = [];
  const original = console.warn;
  console.warn = (...args) => warnings.push(args[0]);
  let editors;
  try {
    editors = RichClay.init(undefined, { Squire: FakeSquire, toolbar: false });
  } finally {
    console.warn = original;
  }

  assert.equal(editors.length, 1);
  assert.equal(editors[0].element, document.querySelector("[editable]"));
  assert.equal(warnings.length, 1);
  assert.equal(/nested editable regions/.test(warnings[0]), true);
});

// The upward-only check passed the outer region when the inner editor was built
// first, leaving two Squire instances mutating one subtree.
test("nesting is refused in both directions, inner editor first", () => {
  setupDom(
    '<!doctype html><html><body><div editable id="outer"><p>One</p><div editable id="inner"><p>Inner</p></div></div></body></html>'
  );

  const warnings = [];
  const original = console.warn;
  console.warn = (...args) => warnings.push(args[0]);
  let outer;
  try {
    new RichClay(document.querySelector("#inner"), { Squire: FakeSquire, toolbar: false });
    outer = new RichClay(document.querySelector("#outer"), { Squire: FakeSquire, toolbar: false });
  } finally {
    console.warn = original;
  }

  assert.equal(outer.unsupported, true);
  assert.equal(outer.active, false);
  assert.equal(warnings.length, 2);
  assert.equal(/nested editable regions/.test(warnings[1]), true);
});

// A block written into the table structure is foster-parented out of the table
// entirely on the next load, so there is no version of a <table editable> that
// works. A <td> is an ordinary flow container and mounts like any other region.
test("a table root is refused with a warning while a <td editable> mounts normally", () => {
  setupDom(
    '<!doctype html><html><body><table editable><tr><td>one</td></tr></table></body></html>'
  );
  const warnings = [];
  const original = console.warn;
  console.warn = (...args) => warnings.push(args[0]);
  let table;
  try {
    table = new RichClay(document.querySelector("[editable]"), { Squire: FakeSquire });
  } finally {
    console.warn = original;
  }

  assert.equal(table.unsupported, true);
  assert.equal(table.active, false);
  assert.equal(table.element.hasAttribute("contenteditable"), false);
  assert.equal(warnings.length, 1);
  assert.equal(/table element cannot be an editable region/.test(warnings[0]), true);

  setupDom(
    '<!doctype html><html><body><table><tr><td editable>one</td></tr></table></body></html>'
  );
  const cell = new RichClay(document.querySelector("[editable]"), { Squire: FakeSquire });
  assert.equal(cell.unsupported, false);
  assert.equal(cell.active, true);
  assert.equal(cell.blocksStayOut(), false);
});

// Menu items dispatch through runControl just like shortcuts do, so gating only
// the menu button left every block style reachable from the keyboard.
test("the block menu and its block styles are disabled on a phrasing-only root", () => {
  setupDom('<!doctype html><html><body><p editable>Lead <b>in</b></p></body></html>');
  const element = document.querySelector("[editable]");
  const editor = new RichClay(element, { Squire: FakeSquire });

  const menu = editor.registry.get("blockMenu");
  assert.equal(menu.isDisabled(editor), true);
  ["P", "H1", "H2", "H3"].forEach(value => {
    const option = menu.options.find(candidate => candidate.value === value);
    assert.equal(option.isDisabled(editor), true, value);
  });

  const before = element.innerHTML;
  const heading = menu.options.find(candidate => candidate.value === "H2");
  editor.runControl({ ...heading, id: "blockMenu:H2", ariaLabel: heading.label });

  assert.equal(element.innerHTML, before);
  assert.equal(stringCommands(editor.squire).includes("modifyBlocks"), false);
});

test("block controls are disabled on a phrasing-only root while Code stays inline", () => {
  setupDom('<!doctype html><html><body><p editable>Lead</p></body></html>');
  const editor = new RichClay(document.querySelector("[editable]"), { Squire: FakeSquire });

  assert.equal(editor.blocksStayOut(), true);
  ["unorderedList", "orderedList", "quote", "indent", "outdent"].forEach(id => {
    assert.equal(editor.registry.get(id).isDisabled(editor), true, id);
  });
  assert.equal(editor.registry.get("code").isDisabled, undefined);

  editor.toggleCode();
  const formats = editor.squire.commands.filter(c => Array.isArray(c) && c[0] === "changeFormat");
  assert.deepEqual(formats, [["changeFormat", "CODE", null]]);
  assert.equal(stringCommands(editor.squire).includes("toggleCode"), false);
});

test("shortcut keys are built in Squire's modifier order", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>x</p></div></body></html>');
  setPlatform(window, "MacIntel");
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: ["bold", { id: "zap", label: "Zap", shortcut: "Mod+Alt+Shift+e", run: () => {} }]
  });

  const handlers = shortcutHandlers(editor);
  assert.equal(handlers.has("Meta-Shift-Z"), true);
  assert.equal(handlers.has("Alt-Meta-Shift-E"), true);
});

test("link dialog submit normalizes the URL and applies the link", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>x</p></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: ["link"]
  });

  editor.openLinkDialog();
  const dialog = document.querySelector("[data-richclay-dialog]");
  dialog.querySelector("input").value = "example.com/path";
  dialog.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));

  const links = editor.squire.commands.filter(command => Array.isArray(command) && command[0] === "makeLink");
  assert.deepEqual(links, [["makeLink", "https://example.com/path"]]);
  assert.equal(document.querySelector("[data-richclay-dialog]"), null);
});

test("link dialog rejects an unsafe URL and stays open without inserting a link", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>x</p></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: ["link"]
  });

  editor.openLinkDialog();
  const dialog = document.querySelector("[data-richclay-dialog]");
  dialog.querySelector("input").value = "javascript:alert(1)";
  dialog.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));

  const links = editor.squire.commands.filter(command => Array.isArray(command) && command[0] === "makeLink");
  assert.equal(links.length, 0);
  assert.equal(document.querySelector("[data-richclay-dialog]") !== null, true);
});

test("link dialog closes on Escape and returns focus to the editor", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>x</p></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: ["link"]
  });

  editor.openLinkDialog();
  const dialog = document.querySelector("[data-richclay-dialog]");
  dialog.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

  assert.equal(document.querySelector("[data-richclay-dialog]"), null);
  assert.equal(editor.squire.focused, true);
});
