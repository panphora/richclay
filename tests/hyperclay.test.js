import test from "node:test";
import assert from "node:assert/strict";
import { setupDom, FakeSquire } from "./helpers.js";
import RichClay from "../src/richclay.js";
import {
  stripRichClayFromClone,
  isHyperclayEditMode,
  consumeInertContenteditable
} from "../src/hyperclay.js";

test("beforeSave stripping removes chrome and runtime state while preserving content and marker", () => {
  setupDom(`
    <!doctype html><html><body>
      <div data-richclay class="richclay-editor richclay-active" contenteditable="true" role="textbox" data-richclay-runtime-role="true">
        <p>Hello <strong>world</strong></p>
      </div>
      <div data-richclay-toolbar role="toolbar" snapshot-remove>Toolbar</div>
      <div data-richclay-live snapshot-remove>Live</div>
    </body></html>
  `);

  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);

  const editor = clone.querySelector("[data-richclay]");
  assert.equal(editor.hasAttribute("data-richclay"), true);
  assert.equal(editor.hasAttribute("contenteditable"), false);
  assert.equal(editor.getAttribute("inert-contenteditable"), "true");
  assert.equal(editor.classList.contains("richclay-editor"), false);
  assert.equal(editor.hasAttribute("class"), false);
  assert.equal(editor.hasAttribute("role"), false);
  assert.equal(clone.querySelector("[data-richclay-toolbar]"), null);
  assert.match(editor.innerHTML, /<strong>world<\/strong>/);
});

test("save-strip removes zero-width caret artifacts and empties Squire left behind", () => {
  const zwsp = String.fromCharCode(0x200b);
  setupDom(`
    <!doctype html><html><body>
      <div data-richclay contenteditable="true">
        <p>Hello${zwsp} <strong>world</strong></p>
        <p><em></em>Tail</p>
      </div>
    </body></html>
  `);

  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);

  const editor = clone.querySelector("[data-richclay]");
  assert.equal(editor.textContent.includes(zwsp), false);
  // the empty <em> placeholder wrapper is gone, real content stays
  assert.equal(editor.querySelector("em"), null);
  assert.match(editor.innerHTML, /<strong>world<\/strong>/);
  assert.match(editor.innerHTML, /Tail/);
});

test("rehydration consumes inert-contenteditable in Hyperclay edit mode", () => {
  const callbacks = [];
  setupDom(`
    <!doctype html><html><body>
      <div data-richclay inert-contenteditable="true"><p>Saved</p></div>
    </body></html>
  `, "https://example.test/?editmode=true");
  window.hyperclay = {
    isEditMode: true,
    beforeSave(callback) {
      callbacks.push(callback);
    }
  };

  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: "minimal"
  });

  assert.equal(editor.element.hasAttribute("inert-contenteditable"), false);
  assert.equal(editor.element.getAttribute("contenteditable"), "true");
  assert.equal(callbacks.length, 1);
});

test("Hyperclay view mode leaves content untouched and skips toolbar", () => {
  setupDom(`
    <!doctype html><html><body>
      <div data-richclay><p>Static</p></div>
    </body></html>
  `, "https://example.test/?editmode=false");
  window.hyperclay = {
    isEditMode: false,
    beforeSave() {}
  };

  const element = document.querySelector("[data-richclay]");
  const editor = new RichClay(element, { Squire: FakeSquire });

  assert.equal(editor.active, false);
  assert.equal(element.innerHTML, "<p>Static</p>");
  assert.equal(document.querySelector("[data-richclay-toolbar]"), null);
});

test("active region carries no-undo so Hyperclay page-undo defers to Squire", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>Hi</p></div></body></html>');
  const element = document.querySelector("[data-richclay]");
  new RichClay(element, { Squire: FakeSquire, toolbar: "minimal" });

  assert.equal(element.getAttribute("no-undo"), "");
  assert.equal(element.hasAttribute("data-richclay-runtime-no-undo"), true);

  // no-undo is runtime-only: it must not survive into the saved file.
  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  const saved = clone.querySelector("[data-richclay]");
  assert.equal(saved.hasAttribute("no-undo"), false);
  assert.equal(saved.hasAttribute("data-richclay-runtime-no-undo"), false);
  assert.equal(saved.hasAttribute("data-richclay"), true);
});

test("generated chrome carries snapshot-remove and no-watch", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>Hi</p></div></body></html>');
  new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: "standard"
  });

  const toolbar = document.querySelector("[data-richclay-toolbar]");
  assert.equal(toolbar.hasAttribute("snapshot-remove"), true);
  assert.equal(toolbar.hasAttribute("no-watch"), true);
});

test("author-set no-undo is preserved through save (not treated as runtime)", () => {
  setupDom('<!doctype html><html><body><div data-richclay no-undo><p>Hi</p></div></body></html>');
  const element = document.querySelector("[data-richclay]");
  new RichClay(element, { Squire: FakeSquire, toolbar: "minimal" });

  // We never marked it as runtime, so the strip must leave the author's no-undo.
  assert.equal(element.hasAttribute("data-richclay-runtime-no-undo"), false);
  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  assert.equal(clone.querySelector("[data-richclay]").hasAttribute("no-undo"), true);
});

test("the beforeSave hook registers once even with multiple editors on the page", () => {
  const callbacks = [];
  setupDom(
    '<!doctype html><html><body><div data-richclay><p>1</p></div><div data-richclay><p>2</p></div></body></html>',
    "https://example.test/?editmode=true"
  );
  window.hyperclay = {
    isEditMode: true,
    beforeSave(callback) {
      callbacks.push(callback);
    }
  };

  const editors = RichClay.init(undefined, { Squire: FakeSquire, toolbar: "minimal" });

  assert.equal(editors.length, 2);
  assert.equal(editors.every(editor => editor.active), true);
  assert.equal(callbacks.length, 1);
});

test("a missing window.hyperclay.beforeSave is tolerated (no hook, still activates)", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>x</p></div></body></html>', "https://example.test/?editmode=true");
  window.hyperclay = { isEditMode: true };

  let editor;
  assert.doesNotThrow(() => {
    editor = new RichClay(document.querySelector("[data-richclay]"), { Squire: FakeSquire, toolbar: "minimal" });
  });
  assert.equal(editor.active, true);
});

test("isHyperclayEditMode resolves the edit-mode signal in priority order", () => {
  // URL param wins over an opposing window.hyperclay.isEditMode.
  assert.equal(
    isHyperclayEditMode({ location: { search: "?editmode=false" }, hyperclay: { isEditMode: true }, document: { cookie: "" } }),
    false
  );
  // Then the explicit window flag.
  assert.equal(isHyperclayEditMode({ location: { search: "" }, __hyperclayEditMode: true }), true);
  // Then the platform's isAdminOfCurrentResource cookie, when nothing higher-priority is present.
  assert.equal(isHyperclayEditMode({ location: { search: "" }, document: { cookie: "foo=1; isAdminOfCurrentResource=1" } }), true);
  // A non-owner (cookie absent) stays in view mode.
  assert.equal(isHyperclayEditMode({ location: { search: "" }, document: { cookie: "foo=1" } }), false);
  // An empty cookie value does not count as editing.
  assert.equal(isHyperclayEditMode({ location: { search: "" }, document: { cookie: "isAdminOfCurrentResource=" } }), false);
  // No signal anywhere means view mode.
  assert.equal(isHyperclayEditMode({ location: { search: "" }, document: { cookie: "" } }), false);
});

test("hyperclay:false forces standalone activation regardless of view mode", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>x</p></div></body></html>', "https://example.test/?editmode=false");
  window.hyperclay = { isEditMode: false, beforeSave() {} };

  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: "minimal",
    hyperclay: false
  });

  assert.equal(editor.active, true);
  assert.equal(document.querySelector("[data-richclay-toolbar]") !== null, true);
});

test("consumeInertContenteditable restores and normalizes the editable value", () => {
  setupDom();
  const make = value => {
    const element = document.createElement("div");
    if (value !== null) element.setAttribute("inert-contenteditable", value);
    return element;
  };

  const preserved = make("false");
  assert.equal(consumeInertContenteditable(preserved), "false");
  assert.equal(preserved.getAttribute("contenteditable"), "false");
  assert.equal(preserved.hasAttribute("inert-contenteditable"), false);
  assert.equal(preserved.hasAttribute("data-richclay-runtime-contenteditable"), false);

  const plaintext = make("plaintext-only");
  consumeInertContenteditable(plaintext);
  assert.equal(plaintext.getAttribute("contenteditable"), "plaintext-only");

  const coerced = make("garbage");
  consumeInertContenteditable(coerced);
  assert.equal(coerced.getAttribute("contenteditable"), "true");
  assert.equal(coerced.getAttribute("data-richclay-runtime-contenteditable"), "true");

  const none = make(null);
  assert.equal(consumeInertContenteditable(none), null);
  assert.equal(none.hasAttribute("contenteditable"), false);
});

test("full Hyperclay round-trip: edit, save-strip on a clone, rehydrate from the saved markup", () => {
  const captured = [];
  setupDom('<!doctype html><html><body><div data-richclay><p>Start</p></div></body></html>', "https://example.test/?editmode=true");
  window.hyperclay = {
    isEditMode: true,
    beforeSave(callback) {
      captured.push(callback);
    }
  };

  const live = new RichClay(document.querySelector("[data-richclay]"), { Squire: FakeSquire, toolbar: "standard" });
  live.setHTML("<p>Edited <strong>bold</strong></p>");

  // Hyperclay runs beforeSave against a clone of the document element.
  const clone = document.documentElement.cloneNode(true);
  captured[0](clone);

  const saved = clone.querySelector("[data-richclay]");
  assert.equal(saved.hasAttribute("data-richclay"), true);
  assert.equal(saved.hasAttribute("contenteditable"), false);
  assert.equal(saved.hasAttribute("inert-contenteditable"), false);
  assert.equal(saved.hasAttribute("data-richclay-runtime-contenteditable"), false);
  assert.equal(saved.hasAttribute("class"), false);
  assert.equal(clone.querySelector("[data-richclay-toolbar]"), null);
  assert.match(saved.innerHTML, /<strong>bold<\/strong>/);
  // The strip ran on the clone only; the live editor is still editable.
  assert.equal(live.element.hasAttribute("contenteditable"), true);

  // Reload: the saved markup hydrates into a fresh document and re-activates.
  const savedMarkup = saved.outerHTML;
  setupDom(`<!doctype html><html><body>${savedMarkup}</body></html>`, "https://example.test/?editmode=true");
  window.hyperclay = { isEditMode: true, beforeSave() {} };

  const rehydrated = new RichClay(document.querySelector("[data-richclay]"), { Squire: FakeSquire, toolbar: "standard" });
  assert.equal(rehydrated.active, true);
  assert.equal(rehydrated.element.getAttribute("contenteditable"), "true");
  assert.equal(rehydrated.element.hasAttribute("inert-contenteditable"), false);
  assert.match(rehydrated.getHTML(), /<strong>bold<\/strong>/);
  assert.equal(document.querySelector("[data-richclay-toolbar]") !== null, true);
});

test("richclay-added contenteditable is removed on save, and a legacy inert-contenteditable self-heals", () => {
  setupDom('<!doctype html><html><body><div data-richclay inert-contenteditable="true"><p>Old file</p></div></body></html>', "https://example.test/?editmode=true");
  window.hyperclay = { isEditMode: true, beforeSave() {} };
  new RichClay(document.querySelector("[data-richclay]"), { Squire: FakeSquire, toolbar: "minimal" });

  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  const saved = clone.querySelector("[data-richclay]");
  assert.equal(saved.hasAttribute("contenteditable"), false);
  assert.equal(saved.hasAttribute("inert-contenteditable"), false);
  assert.equal(saved.hasAttribute("data-richclay-runtime-contenteditable"), false);
});

test("author inert-contenteditable=false round-trips through activation and save", () => {
  setupDom('<!doctype html><html><body><div data-richclay inert-contenteditable="false"><p>x</p></div></body></html>', "https://example.test/?editmode=true");
  window.hyperclay = { isEditMode: true, beforeSave() {} };
  const editor = new RichClay(document.querySelector("[data-richclay]"), { Squire: FakeSquire, toolbar: "minimal" });
  assert.equal(editor.element.getAttribute("contenteditable"), "true");

  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  assert.equal(clone.querySelector("[data-richclay]").getAttribute("inert-contenteditable"), "false");
  assert.equal(clone.querySelector("[data-richclay]").hasAttribute("contenteditable"), false);
});

test("destroy leaves author-provided contenteditable in place", () => {
  setupDom('<!doctype html><html><body><div data-richclay contenteditable="true"><p>x</p></div></body></html>');
  const element = document.querySelector("[data-richclay]");
  const editor = new RichClay(element, { Squire: FakeSquire, toolbar: "minimal" });
  editor.destroy();
  assert.equal(element.getAttribute("contenteditable"), "true");
});

test("destroy restores the author's original non-true contenteditable value", () => {
  setupDom('<!doctype html><html><body><div data-richclay contenteditable="false"><p>x</p></div></body></html>');
  const element = document.querySelector("[data-richclay]");
  const editor = new RichClay(element, { Squire: FakeSquire, toolbar: "minimal" });
  assert.equal(element.getAttribute("contenteditable"), "true");
  editor.destroy();
  assert.equal(element.getAttribute("contenteditable"), "false");
});

test("save-strip keeps empty inline wrappers that carry attributes", () => {
  setupDom('<!doctype html><html><body><div data-richclay contenteditable="true"><p><span class="icon"></span>Text<em></em></p></div></body></html>');
  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  const editor = clone.querySelector("[data-richclay]");
  assert.equal(editor.querySelector("span.icon") !== null, true);
  assert.equal(editor.querySelector("em"), null);
});
