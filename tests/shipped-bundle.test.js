import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { setPlatform } from "./helpers.js";

// dist/richclay.min.js is what propagate.js copies into clayjs and hyperclayjs, so
// it is what actually reaches a page. It bundles vendor/squire.mjs, which is a
// different file from the vendor/squire.js the rest of the suite evaluates: a fix
// applied to one and not the other leaves every other test green and ships the bug.
// These assert behaviour rather than the text of a patch, so upstream fixing this
// in Squire keeps them passing and lets the local patch be dropped.
const bundle = readFileSync(new URL("../dist/richclay.min.js", import.meta.url), "utf8");

// The bundle is an IIFE that installs Squire and DOMPurify on the page and exposes
// itself as `richclay`. Nothing here imports from src/, on purpose.
const mountBundle = (bodyHtml, options = {}) => {
  const dom = new JSDOM(`<!doctype html><html><body>${bodyHtml}</body></html>`, {
    url: "https://example.test/",
    pretendToBeVisual: true,
    runScripts: "outside-only"
  });
  const { window } = dom;
  setPlatform(window, "MacIntel");
  window.eval(bundle);

  const RichClay = window.RichClay || window.richclay.default;
  const element = window.document.querySelector("[editable]");
  return { window, RichClay, element, editor: new RichClay(element, options) };
};

const savedBody = (window, RichClay) => {
  const clone = window.document.documentElement.cloneNode(true);
  RichClay.stripFromClone(clone);
  return clone.querySelector("body");
};

const selectAll = (window, editor, node) => {
  const range = window.document.createRange();
  range.selectNodeContents(node);
  editor.squire.setSelection(range);
  editor.saveSelection();
};

// Unpatched this saves <span editable></span>Hello world<span editable></span>:
// every character outside the region, and two empty copies of it left behind.
test("the shipped bundle keeps clear formatting inside an inline region", () => {
  const { window, RichClay, element, editor } = mountBundle(
    "<div><span editable>Hello world</span></div>"
  );
  selectAll(window, editor, element);
  editor.runControl(editor.registry.get("clearFormatting"));

  const body = savedBody(window, RichClay);
  assert.equal(body.querySelectorAll("[editable]").length, 1);
  assert.equal(body.querySelector("[editable]").textContent, "Hello world");
  assert.equal(body.innerHTML, '<div><span editable="">Hello world</span></div>');
});

// Unpatched the walk climbs past the region and deletes the author's own <a>.
test("the shipped bundle leaves an author's <a> alone when unlinking inside it", () => {
  const { window, RichClay, element, editor } = mountBundle(
    '<div><a href="/keep">Lead <span editable>Hello world</span> tail</a></div>'
  );
  selectAll(window, editor, element);
  editor.runControl(editor.registry.get("unlink"));

  const body = savedBody(window, RichClay);
  assert.equal(body.querySelectorAll('a[href="/keep"]').length, 1);
  assert.equal(body.querySelector('a[href="/keep"]').textContent, "Lead Hello world tail");
});

// Unpatched the region element itself is removed from the author's page. The
// <div editable> control is what proves this is about inline roots: a block root
// always survived, which is why nobody found this for four rounds.
test("the shipped bundle keeps the region element through select all then Backspace", () => {
  [
    ["<div><span editable id='r'>Hello world</span></div>", "span"],
    ["<div><div editable id='r'>Hello world</div></div>", "div (control)"]
  ].forEach(([markup, label]) => {
    const { window, element, editor } = mountBundle(markup);
    selectAll(window, editor, element);

    element.dispatchEvent(
      new window.KeyboardEvent("keydown", { key: "Backspace", bubbles: true, cancelable: true })
    );

    assert.equal(window.document.getElementById("r"), element, label);
    assert.equal(window.document.querySelectorAll("[editable]").length, 1, label);
  });
});
