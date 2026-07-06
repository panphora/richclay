import test from "node:test";
import assert from "node:assert/strict";
import { setupDom, FakeSquire } from "./helpers.js";
import RichClay from "../src/richclay.js";
import { stripRichClayFromClone, parseEditableOptions } from "../src/hyperclay.js";

test("parseEditableOptions maps attribute tokens to options", () => {
  setupDom();
  const el = document.createElement("h1");
  assert.equal(parseEditableOptions(el), null);
  el.setAttribute("editable", "");
  assert.deepEqual(parseEditableOptions(el), { inline: true, singleLine: false, toolbarOnSelect: false });
  el.setAttribute("editable", "single-line toolbar-on-select");
  assert.deepEqual(parseEditableOptions(el), { inline: true, singleLine: true, toolbarOnSelect: true });
  el.setAttribute("editable", "single-line no-toolbar");
  assert.deepEqual(parseEditableOptions(el), { inline: true, singleLine: true, toolbarOnSelect: false, toolbar: false });
  el.setAttribute("editable", "bogus-token");
  assert.deepEqual(parseEditableOptions(el), { inline: true, singleLine: false, toolbarOnSelect: false });
});

test("inline activation does not mutate author content and adds no marker", () => {
  setupDom('<!doctype html><html><body><div editable><p class="lead" data-x="1">Hi <img src="a.png" alt=""> <span class="icon"></span><em>there</em></p></div></body></html>');
  const element = document.querySelector("[editable]");
  const before = element.innerHTML;
  const editor = new RichClay(element, { Squire: FakeSquire });
  assert.equal(editor.active, true);
  assert.equal(editor.options.inline, true);
  assert.equal(element.innerHTML, before);
  assert.equal(element.hasAttribute("data-richclay"), false);
  assert.equal(element.classList.contains("richclay-inline"), true);
  assert.equal(element.classList.contains("richclay-editor"), false);
});

test("inline editors mount a floating toolbar on focus and tear it down on blur", async () => {
  setupDom('<!doctype html><html><body><div editable><p>x</p></div></body></html>');
  const element = document.querySelector("[editable]");
  const editor = new RichClay(element, { Squire: FakeSquire });
  assert.equal(document.querySelector("[data-richclay-float]"), null);
  const shortcuts = editor.squire.commands.filter(c => Array.isArray(c) && c[0] === "shortcut");
  assert.equal(shortcuts.length > 0, true);

  element.dispatchEvent(new window.FocusEvent("focus"));
  const float = document.querySelector("[data-richclay-float]");
  assert.equal(float !== null, true);
  assert.equal(float.hasAttribute("snapshot-remove"), true);
  assert.equal(float.hasAttribute("save-remove"), true);
  assert.equal(float.querySelector("[data-richclay-toolbar]") !== null, true);

  element.dispatchEvent(new window.FocusEvent("blur"));
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(document.querySelector("[data-richclay-float]"), null);
});

test("single-line editors suppress Enter and set aria-multiline=false", () => {
  setupDom('<!doctype html><html><body><h1 editable="single-line">Title</h1></body></html>');
  const element = document.querySelector("[editable]");
  const editor = new RichClay(element, { Squire: FakeSquire });
  assert.equal(element.getAttribute("aria-multiline"), "false");
  const enterHandlers = editor.squire.commands.filter(
    c => Array.isArray(c) && c[0] === "shortcut" && (c[1] === "Enter" || c[1] === "Shift-Enter")
  );
  assert.equal(enterHandlers.length, 2);
  let prevented = false;
  enterHandlers[0][2](editor.squire, { preventDefault: () => { prevented = true; } });
  assert.equal(prevented, true);
});

test("single-line defaults to the inline toolbar preset", () => {
  setupDom('<!doctype html><html><body><h1 editable="single-line">T</h1></body></html>');
  const editor = new RichClay(document.querySelector("[editable]"), { Squire: FakeSquire });
  assert.equal(editor.options.toolbar, "inline");
  const controls = editor.resolveToolbarControls(editor.options.toolbar).map(def => def.id);
  assert.equal(controls.includes("bold"), true);
  assert.equal(controls.includes("blockMenu"), false);
  assert.equal(controls.includes("unorderedList"), false);
});

test("editable save round-trip keeps the attribute and leaves no runtime residue", () => {
  setupDom('<!doctype html><html><body><h1 editable="single-line">Title</h1></body></html>', "https://example.test/?editmode=true");
  window.hyperclay = { isEditMode: true, beforeSave() {} };
  new RichClay(document.querySelector("[editable]"), { Squire: FakeSquire });

  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  const saved = clone.querySelector("[editable]");
  assert.equal(saved.getAttribute("editable"), "single-line");
  assert.equal(saved.hasAttribute("contenteditable"), false);
  assert.equal(saved.hasAttribute("inert-contenteditable"), false);
  assert.equal(saved.hasAttribute("data-richclay"), false);
  assert.equal(saved.hasAttribute("class"), false);
  assert.equal(saved.textContent, "Title");
});

test("save-strip unwraps a lone attribute-less P inside a single-line region", () => {
  setupDom('<!doctype html><html><body><h1 editable="single-line"><p>Wrapped</p></h1></body></html>');
  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  const saved = clone.querySelector("[editable]");
  assert.equal(saved.querySelector("p"), null);
  assert.equal(saved.textContent, "Wrapped");
});

test("single-line paste ingress flattens blocks to one line", () => {
  setupDom('<!doctype html><html><body><h1 editable="single-line">T</h1></body></html>');
  const editor = new RichClay(document.querySelector("[editable]"), { Squire: FakeSquire });
  const fragment = editor.squire.config.sanitizeToDOMFragment("<p>One</p><p>Two <strong>bold</strong></p><br>Three", editor.squire);
  const probe = document.createElement("div");
  probe.appendChild(fragment);
  assert.equal(probe.querySelector("p"), null);
  assert.equal(probe.querySelector("br"), null);
  assert.match(probe.textContent.replace(/\s+/g, " ").trim(), /^One Two bold Three$/);
  assert.equal(probe.querySelector("strong") !== null, true);
});

test("inline ingress keeps class, id, data attributes and images", () => {
  setupDom('<!doctype html><html><body><div editable><p>x</p></div></body></html>');
  const editor = new RichClay(document.querySelector("[editable]"), { Squire: FakeSquire });
  const fragment = editor.squire.config.sanitizeToDOMFragment(
    '<p class="lead" id="p1" data-x="1">Hello <img src="a.png" alt="a"> <script>evil()</script></p>',
    editor.squire
  );
  const probe = document.createElement("div");
  probe.appendChild(fragment);
  const p = probe.querySelector("p");
  assert.equal(p.getAttribute("class"), "lead");
  assert.equal(p.getAttribute("id"), "p1");
  assert.equal(p.getAttribute("data-x"), "1");
  assert.equal(probe.querySelector("img") !== null, true);
  assert.equal(probe.querySelector("script"), null);
});

test("watch() mounts dynamically added editable elements", async () => {
  setupDom('<!doctype html><html><body></body></html>', "https://example.test/?editmode=true");
  window.hyperclay = { isEditMode: true, beforeSave() {} };
  RichClay.watch(window, { Squire: FakeSquire });

  const el = document.createElement("div");
  el.setAttribute("editable", "");
  el.innerHTML = "<p>New</p>";
  document.body.appendChild(el);
  await new Promise(resolve => setTimeout(resolve, 0));

  assert.equal(el.getAttribute("contenteditable"), "true");
  assert.equal(el.classList.contains("richclay-inline"), true);

  el.removeAttribute("editable");
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(el.hasAttribute("contenteditable"), false);
  assert.equal(el.classList.contains("richclay-inline"), false);
});

test("toolbar-on-select hides the floating toolbar until text is selected", () => {
  setupDom('<!doctype html><html><body><div editable="toolbar-on-select"><p>Some text</p></div></body></html>');
  const element = document.querySelector("[editable]");
  element.getBoundingClientRect = () => ({ top: 100, bottom: 140, left: 50, right: 400 });
  const editor = new RichClay(element, { Squire: FakeSquire });

  element.dispatchEvent(new window.FocusEvent("focus"));
  const float = document.querySelector("[data-richclay-float]");
  assert.equal(float.style.display, "none");

  const range = document.createRange();
  const text = element.querySelector("p").firstChild;
  range.setStart(text, 0);
  range.setEnd(text, 4);
  editor.squire.selection = range;
  editor.squire.fire("select");
  assert.equal(float.style.display === "none", false);

  editor.squire.selection.collapse(true);
  editor.squire.fire("cursor");
  assert.equal(float.style.display, "none");
});

test("Alt+F10 opens and focuses the floating toolbar", () => {
  setupDom('<!doctype html><html><body><div editable><p>x</p></div></body></html>');
  const element = document.querySelector("[editable]");
  new RichClay(element, { Squire: FakeSquire });

  element.dispatchEvent(new window.KeyboardEvent("keydown", { key: "F10", altKey: true }));
  const float = document.querySelector("[data-richclay-float]");
  assert.equal(float !== null, true);
  assert.equal(document.activeElement?.classList.contains("richclay-button"), true);
});

test("the floating toolbar is stripped from saves", () => {
  setupDom('<!doctype html><html><body><div editable><p>x</p></div></body></html>', "https://example.test/?editmode=true");
  window.hyperclay = { isEditMode: true, beforeSave() {} };
  const element = document.querySelector("[editable]");
  new RichClay(element, { Squire: FakeSquire });
  element.dispatchEvent(new window.FocusEvent("focus"));
  assert.equal(document.querySelector("[data-richclay-float]") !== null, true);

  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  assert.equal(clone.querySelector("[data-richclay-float]"), null);
  assert.equal(clone.querySelector("[data-richclay-toolbar]"), null);
});

test("single-line editors do not bind block-command shortcuts", () => {
  setupDom('<!doctype html><html><body><h1 editable="single-line">T</h1></body></html>');
  const editor = new RichClay(document.querySelector("[editable]"), { Squire: FakeSquire });
  const keys = editor.squire.commands
    .filter(c => Array.isArray(c) && c[0] === "shortcut")
    .map(c => c[1]);
  assert.equal(keys.includes("Ctrl-b"), true);
  assert.equal(keys.includes("Ctrl-Shift-8"), false);
  assert.equal(keys.includes("Ctrl-Shift-9"), false);
  assert.equal(keys.includes("Ctrl-]"), false);
});

test("registerButton on a focused inline editor rebuilds the floating toolbar", () => {
  setupDom('<!doctype html><html><body><div editable><p>x</p></div></body></html>');
  const element = document.querySelector("[editable]");
  const editor = new RichClay(element, { Squire: FakeSquire });
  element.dispatchEvent(new window.FocusEvent("focus"));
  assert.equal(document.querySelector("[data-richclay-float]") !== null, true);

  // registerButton triggers one rebuild; pointing the toolbar at the new id
  // (the documented pattern) triggers another. Neither may orphan the shell.
  editor.registerButton({ id: "zap", label: "Zap", run: () => {} });
  assert.equal(document.querySelector("[data-richclay-float]") !== null, true);
  assert.equal(editor.float !== null, true);
  assert.equal(editor.toolbar !== null, true);

  editor.options.toolbar = ["bold", "zap"];
  editor.renderToolbar();
  const float = document.querySelector("[data-richclay-float]");
  assert.equal(float !== null, true);
  assert.equal(float.querySelector('[data-richclay-control="zap"]') !== null, true);
  assert.equal(editor.float !== null, true);
  assert.equal(editor.toolbar !== null, true);
});

test("the float tears down when focus leaves via the toolbar", async () => {
  setupDom('<!doctype html><html><body><div editable><p>x</p></div><input id="outside"></body></html>');
  const element = document.querySelector("[editable]");
  new RichClay(element, { Squire: FakeSquire });
  element.dispatchEvent(new window.KeyboardEvent("keydown", { key: "F10", altKey: true }));
  const float = document.querySelector("[data-richclay-float]");
  assert.equal(float !== null, true);
  assert.equal(document.activeElement?.classList.contains("richclay-button"), true);

  document.getElementById("outside").focus();
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(document.querySelector("[data-richclay-float]"), null);
});

test("watch() keeps an editor alive when its element is moved, not removed", async () => {
  setupDom('<!doctype html><html><body><section id="a"></section><section id="b"></section></body></html>', "https://example.test/?editmode=true");
  window.hyperclay = { isEditMode: true, beforeSave() {} };
  RichClay.watch(window, { Squire: FakeSquire });

  const el = document.createElement("div");
  el.setAttribute("editable", "");
  el.innerHTML = "<p>Move me</p>";
  document.getElementById("a").appendChild(el);
  await new Promise(resolve => setTimeout(resolve, 0));
  const editorBefore = new RichClay(el, { Squire: FakeSquire });

  document.getElementById("b").appendChild(el);
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(el.getAttribute("contenteditable"), "true");
  const editorAfter = new RichClay(el, { Squire: FakeSquire });
  assert.equal(editorAfter, editorBefore);
});

test("a bare author contenteditable attribute round-trips like contenteditable=true", () => {
  setupDom('<!doctype html><html><body><div data-richclay contenteditable><p>x</p></div></body></html>');
  const element = document.querySelector("[data-richclay]");
  const editor = new RichClay(element, { Squire: FakeSquire, toolbar: "minimal" });
  assert.equal(element.hasAttribute("data-richclay-runtime-contenteditable"), false);

  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  assert.equal(clone.querySelector("[data-richclay]").getAttribute("inert-contenteditable"), "true");

  editor.destroy();
  assert.equal(element.hasAttribute("contenteditable"), true);
});
