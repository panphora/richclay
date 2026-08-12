import test from "node:test";
import assert from "node:assert/strict";
import { setupDom, FakeSquire, setPlatform } from "./helpers.js";
import RichClay from "../src/richclay.js";

const stringCommands = squire => squire.commands.filter(command => typeof command === "string");

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
  assert.equal(list.getAttribute("aria-pressed"), "true");
  list.click();
  assert.equal(list.getAttribute("aria-pressed"), "false");

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

  editor.squire.path = "UL>LI";
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
