import test from "node:test";
import assert from "node:assert/strict";
import { setupDom, FakeSquire } from "./helpers.js";
import RichClay from "../src/richclay.js";
import { stripRichClayFromClone, installHyperclayBridge } from "../src/hyperclay.js";

// Binding richclay to an element that carries none of its four selectors stamps
// data-richclay on it so the watcher re-adopts the region after a node
// replacement. Nothing used to take that stamp back off, so one editing session
// permanently changed the author's file and the element stayed independently
// editable on every later load. data-richclay-runtime-marker records which
// stamps are ours, exactly as data-richclay-runtime-contenteditable already does
// for contenteditable.

function saveClone() {
  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  return clone;
}

test("richclay marks the data-richclay it invents on a bare element", () => {
  setupDom(`<!doctype html><html><body><h1 class="t">Hello</h1></body></html>`);
  const el = document.querySelector(".t");
  assert.equal(el.hasAttribute("data-richclay"), false, "guard: the element starts bare");

  new RichClay(el, { Squire: FakeSquire, toolbar: [] });

  assert.equal(el.getAttribute("data-richclay"), "");
  assert.equal(el.getAttribute("data-richclay-runtime-marker"), "true");
});

test("a data-richclay richclay invented never reaches the save clone", () => {
  setupDom(`<!doctype html><html><body><h1 class="t">Hello <em>world</em></h1></body></html>`);
  new RichClay(document.querySelector(".t"), { Squire: FakeSquire, toolbar: [] });

  const saved = saveClone().querySelector(".t");

  assert.equal(saved.hasAttribute("data-richclay"), false, "the invented marker must come off");
  assert.equal(saved.hasAttribute("data-richclay-runtime-marker"), false, "and so must its provenance");
  assert.equal(saved.hasAttribute("contenteditable"), false);
  assert.equal(saved.outerHTML, '<h1 class="t">Hello <em>world</em></h1>', "byte for byte the authored markup");
});

test("a data-richclay the AUTHOR wrote survives the save clone", () => {
  setupDom(`<!doctype html><html><body><h1 class="t" data-richclay>Hello</h1></body></html>`);
  new RichClay(document.querySelector(".t"), { Squire: FakeSquire, toolbar: [] });

  const saved = saveClone().querySelector(".t");

  assert.equal(saved.hasAttribute("data-richclay"), true, "an authored marker is the author's markup");
  assert.equal(saved.hasAttribute("data-richclay-runtime-marker"), false);
});

test("destroy() takes the invented marker back off the live element", () => {
  setupDom(`<!doctype html><html><body><h1 class="t">Hello</h1></body></html>`);
  const el = document.querySelector(".t");
  const editor = new RichClay(el, { Squire: FakeSquire, toolbar: [] });
  assert.equal(el.hasAttribute("data-richclay"), true, "guard: it was stamped");

  editor.destroy();

  assert.equal(el.hasAttribute("data-richclay"), false, "otherwise the watcher re-adopts it forever");
  assert.equal(el.hasAttribute("data-richclay-runtime-marker"), false);
});

test("destroy() leaves an authored marker alone", () => {
  setupDom(`<!doctype html><html><body><h1 class="t" data-richclay>Hello</h1></body></html>`);
  const el = document.querySelector(".t");
  new RichClay(el, { Squire: FakeSquire, toolbar: [] }).destroy();
  assert.equal(el.hasAttribute("data-richclay"), true);
});

// The bridge used to register only on the save-only document transform, so a
// live-sync frame carried the whole runtime set to every other browser.
test("the bridge prefers the snapshot hook, which runs for live sync too", () => {
  setupDom();
  const calls = [];
  window.clay = {
    onSnapshot: () => calls.push("onSnapshot"),
    addDocumentTransform: () => calls.push("addDocumentTransform"),
  };
  installHyperclayBridge(window);
  assert.deepEqual(calls, ["onSnapshot"], "a save-only hook leaves sync frames dirty");
});

test("the bridge still falls back for a client with no snapshot hook", () => {
  setupDom();
  const calls = [];
  window.clay = { addDocumentTransform: () => calls.push("addDocumentTransform") };
  installHyperclayBridge(window);
  assert.deepEqual(calls, ["addDocumentTransform"]);
});
