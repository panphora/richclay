import test from "node:test";
import assert from "node:assert/strict";
import { setupDom, FakeSquire } from "./helpers.js";
import RichClay from "../src/richclay.js";

const tick = ms => new Promise(resolve => setTimeout(resolve, ms));

test("the live region announces toggle state after a command", async () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>x</p></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: ["bold"]
  });

  const region = editor.liveRegion;
  assert.equal(region.getAttribute("aria-live"), "polite");
  assert.equal(region.getAttribute("aria-atomic"), "true");

  const bold = document.querySelector("[data-richclay-control='bold']");
  // announce() clears then re-sets the text on a short timer so a screen reader
  // re-reads an unchanged-looking message; wait past that 20ms window.
  bold.click();
  await tick(40);
  assert.equal(region.textContent, "Bold on");

  bold.click();
  await tick(40);
  assert.equal(region.textContent, "Bold off");
});

test("placeholder drives the empty-state class and an aria-describedby hint", () => {
  setupDom('<!doctype html><html><body><div data-richclay></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: "minimal",
    placeholder: "Write here"
  });

  assert.equal(editor.element.classList.contains("richclay-empty"), true);
  assert.equal(editor.description.textContent, "Write here");
  const describedBy = editor.element.getAttribute("aria-describedby") || "";
  assert.equal(describedBy.split(/\s+/).includes(editor.description.id), true);

  editor.setHTML("<p>Now it has content</p>");
  assert.equal(editor.element.classList.contains("richclay-empty"), false);
});

test("destroy restores an author's aria-describedby and drops only the runtime hint", () => {
  setupDom('<!doctype html><html><body><div data-richclay aria-describedby="author-help"></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: "minimal",
    placeholder: "Write here"
  });

  const merged = editor.element.getAttribute("aria-describedby").split(/\s+/);
  assert.equal(merged.includes("author-help"), true);
  assert.equal(merged.includes(editor.description.id), true);

  editor.destroy();

  assert.equal(editor.element.getAttribute("aria-describedby"), "author-help");
  assert.equal(editor.element.hasAttribute("data-richclay-runtime-describedby"), false);
});
