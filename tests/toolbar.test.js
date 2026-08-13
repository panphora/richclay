import test from "node:test";
import assert from "node:assert/strict";
import { setupDom, FakeSquire, setPlatform } from "./helpers.js";
import RichClay from "../src/richclay.js";

// An inline region's toolbar is the floating one, which is built on focus.
const mountToolbar = markup => {
  setupDom(`<!doctype html><html><body>${markup}</body></html>`);
  const element = document.querySelector("[editable]");
  new RichClay(element, { Squire: FakeSquire });
  element.dispatchEvent(new window.FocusEvent("focus"));
  const root = document.querySelector("[data-richclay-toolbar]");
  return {
    root,
    controls: Array.from(root.querySelectorAll("[data-richclay-control]")).map(
      button => button.dataset.richclayControl
    )
  };
};

const strandedSeparators = root => {
  const children = Array.from(root.children);
  const isSeparator = node => node?.getAttribute("role") === "separator";
  return children.filter(
    (child, index) =>
      isSeparator(child) &&
      (index === 0 || index === children.length - 1 || isSeparator(children[index - 1]))
  );
};

test("toolbar command calls Squire and reflects aria-pressed", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>Text</p></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: ["bold"]
  });

  const bold = document.querySelector("[data-richclay-control='bold']");
  assert.equal(bold.getAttribute("aria-pressed"), "false");
  bold.click();

  assert.equal(editor.squire.commands.includes("bold"), true);
  assert.equal(bold.getAttribute("aria-pressed"), "true");
  assert.equal(editor.squire.focused, true);
});

test("roving tabindex handles arrows and Home/End with one tab stop", () => {
  setupDom('<!doctype html><html><body><div data-richclay></div></body></html>');
  new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: ["bold", "italic", "underline"]
  });

  const controls = () => Array.from(document.querySelectorAll("[data-richclay-control]"));
  assert.deepEqual(controls().map(button => button.tabIndex), [0, -1, -1]);

  controls()[0].dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
  assert.deepEqual(controls().map(button => button.tabIndex), [-1, 0, -1]);

  controls()[1].dispatchEvent(new window.KeyboardEvent("keydown", { key: "End", bubbles: true }));
  assert.deepEqual(controls().map(button => button.tabIndex), [-1, -1, 0]);

  controls()[2].dispatchEvent(new window.KeyboardEvent("keydown", { key: "Home", bubbles: true }));
  assert.deepEqual(controls().map(button => button.tabIndex), [0, -1, -1]);
});

test("menu opens with keyboard, tracks active item, and closes on Escape", () => {
  setupDom('<!doctype html><html><body><div data-richclay><h2>Title</h2></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: ["blockMenu"]
  });
  // pathHas reads the DOM, so the caret has to sit in the heading it reports.
  const heading = document.querySelector("h2");
  const range = document.createRange();
  range.selectNodeContents(heading);
  editor.squire.setSelection(range);

  const trigger = document.querySelector("[data-richclay-control='blockMenu']");
  trigger.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

  const menu = document.querySelector("[role='menu']");
  assert.equal(menu.hidden, false);
  assert.equal(trigger.getAttribute("aria-expanded"), "true");
  assert.equal(menu.querySelectorAll("[aria-checked='true']").length, 1);

  const first = menu.querySelector(".richclay-menu-item");
  first.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

  assert.equal(menu.hidden, true);
  assert.equal(trigger.getAttribute("aria-expanded"), "false");
});

test("menu arrow keys stay in the menu and don't drive toolbar roving", () => {
  setupDom('<!doctype html><html><body><div data-richclay><h2>Title</h2></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: ["blockMenu", "bold"]
  });
  editor.squire.path = "H2";

  const trigger = document.querySelector("[data-richclay-control='blockMenu']");
  const bold = document.querySelector("[data-richclay-control='bold']");
  trigger.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

  const menu = document.querySelector("[role='menu']");
  const items = Array.from(menu.querySelectorAll(".richclay-menu-item"));
  assert.ok(items.length >= 2);

  items[0].focus();
  items[0].dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

  // ArrowDown advances within the menu, not out to the Bold toolbar control.
  assert.equal(document.activeElement, items[1]);
  assert.equal(bold.tabIndex, -1);
  assert.equal(trigger.tabIndex, 0);
});

test("pointer activation preserves the selection (mousedown is prevented and the range saved)", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>Text</p></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: ["bold"]
  });
  editor.savedSelection = null;

  const event = new window.MouseEvent("mousedown", { bubbles: true, cancelable: true });
  document.querySelector("[data-richclay-control='bold']").dispatchEvent(event);

  // preventDefault keeps the editor from collapsing its selection on toolbar press.
  assert.equal(event.defaultPrevented, true);
  assert.equal(editor.savedSelection !== null, true);
});

// A control the root disables is left out of the toolbar entirely, so the one that
// renders and then greys out is the selection-dependent kind.
test("a disabled control is skipped by the tab stop and arrow navigation", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>x</p></div></body></html>');
  let unavailable = false;
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: [
      "bold",
      { id: "dis", label: "Disabled", run() {}, isDisabled: () => unavailable },
      "italic"
    ]
  });
  unavailable = true;
  editor.toolbar.update();

  const controls = () => Array.from(document.querySelectorAll("[data-richclay-control]"));
  assert.equal(controls()[1].disabled, true);
  assert.deepEqual(controls().map(button => button.tabIndex), [0, -1, -1]);

  controls()[0].dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
  // ArrowRight jumps over the disabled control to the next enabled one.
  assert.deepEqual(controls().map(button => button.tabIndex), [-1, -1, 0]);
});

// Whether a region can hold blocks never changes for its whole life, so a greyed
// button would say "not right now" and invite clicking. The controls are left out
// instead, and the separators around them collapse rather than stranding.
test("the toolbar leaves out the block controls a <p editable> can never use", () => {
  const blockControls = ["blockMenu", "unorderedList", "orderedList", "quote", "outdent", "indent"];

  const ejecting = mountToolbar("<p editable>Hello</p>");
  blockControls.forEach(id => assert.equal(ejecting.controls.includes(id), false, id));
  assert.equal(ejecting.controls.includes("bold"), true);
  assert.deepEqual(strandedSeparators(ejecting.root), []);

  const allowed = mountToolbar("<div editable><p>Hello</p></div>");
  blockControls.forEach(id => assert.equal(allowed.controls.includes(id), true, id));
  assert.deepEqual(strandedSeparators(allowed.root), []);
});

test("separators render as explicit items and at group boundaries", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>x</p></div></body></html>');
  new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: ["bold", { type: "separator" }, "italic"]
  });

  const separators = document.querySelectorAll("[role='separator']");
  assert.equal(separators.length, 1);
  assert.equal(separators[0].getAttribute("aria-orientation"), "vertical");

  setupDom('<!doctype html><html><body><div data-richclay><p>x</p></div></body></html>');
  new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: ["bold", "quote"]
  });
  // bold is in the "inline" group and quote in "blocks", so a divider is auto-inserted.
  assert.equal(document.querySelectorAll("[role='separator']").length, 1);
});

test("button aria-label exposes the keyboard shortcut", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>x</p></div></body></html>');
  new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: ["bold"]
  });

  const bold = document.querySelector("[data-richclay-control='bold']");
  assert.match(bold.getAttribute("aria-label"), /^Bold \((Ctrl|Cmd)\+B\)$/);
  assert.equal(bold.title, bold.getAttribute("aria-label"));
});

test("toolbar:false renders no toolbar and keeps shortcuts active", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>x</p></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), { Squire: FakeSquire, toolbar: false });
  assert.equal(editor.active, true);
  assert.equal(document.querySelector("[data-richclay-toolbar]"), null);
  const shortcuts = editor.squire.commands.filter(c => Array.isArray(c) && c[0] === "shortcut");
  assert.equal(shortcuts.length > 0, true);
});

test("an inline custom toolbar definition's shortcut is installed", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>x</p></div></body></html>');
  setPlatform(window, "Win32");
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: ["bold", { id: "zap", label: "Zap", shortcut: "Mod+E", run: () => {} }]
  });
  const keys = editor.squire.commands
    .filter(c => Array.isArray(c) && c[0] === "shortcut")
    .map(c => c[1]);
  assert.equal(keys.includes("Ctrl-e"), true);
});
