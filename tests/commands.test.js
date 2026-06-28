import test from "node:test";
import assert from "node:assert/strict";
import { setupDom, FakeSquire } from "./helpers.js";
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

test("keyboard shortcuts register Ctrl-/Meta- bindings and run their command", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>x</p></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: "minimal"
  });

  const handlers = new Map(
    editor.squire.commands
      .filter(command => Array.isArray(command) && command[0] === "shortcut")
      .map(([, key, fn]) => [key, fn])
  );

  // Shortcuts come from the standard preset regardless of the visible toolbar, and
  // every Mod+ shortcut binds both the Windows/Linux (Ctrl) and macOS (Meta) key.
  assert.equal(handlers.has("Ctrl-b"), true);
  assert.equal(handlers.has("Meta-b"), true);

  handlers.get("Ctrl-b")(editor.squire, { preventDefault() {} });
  assert.equal(stringCommands(editor.squire).includes("bold"), true);
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
