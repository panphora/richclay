import test from "node:test";
import assert from "node:assert/strict";
import { setupDom, FakeSquire } from "./helpers.js";
import RichClay from "../src/richclay.js";
import { setRichClayStyles } from "../src/styles.js";

test("activate injects the themed stylesheet with save-remove/save-ignore markers", () => {
  setupDom('<!doctype html><html><body><div data-richclay></div></body></html>');
  setRichClayStyles(".richclay-editor{color:red}");
  try {
    new RichClay(document.querySelector("[data-richclay]"), { Squire: FakeSquire });
    const style = document.getElementById("richclay-styles");
    assert.ok(style, "style element injected");
    assert.equal(style.tagName, "STYLE");
    assert.ok(style.hasAttribute("save-remove"), "save-remove keeps it out of saved HTML");
    assert.ok(style.hasAttribute("save-ignore"), "save-ignore survives a live-sync morph");
    assert.match(style.textContent, /richclay-editor/);
  } finally {
    setRichClayStyles("");
  }
});

test("stylesheet injects once per document across multiple editors", () => {
  setupDom(
    '<!doctype html><html><body><div data-richclay id="a"></div><div data-richclay id="b"></div></body></html>'
  );
  setRichClayStyles(".richclay-editor{color:red}");
  try {
    new RichClay(document.getElementById("a"), { Squire: FakeSquire });
    new RichClay(document.getElementById("b"), { Squire: FakeSquire });
    assert.equal(document.querySelectorAll("#richclay-styles").length, 1);
  } finally {
    setRichClayStyles("");
  }
});

test("no stylesheet is injected when no CSS was baked into the build", () => {
  setupDom('<!doctype html><html><body><div data-richclay></div></body></html>');
  setRichClayStyles("");
  new RichClay(document.querySelector("[data-richclay]"), { Squire: FakeSquire });
  assert.equal(document.getElementById("richclay-styles"), null);
});

test("autoInit does not mount editors outside Hyperclay edit mode", () => {
  setupDom('<!doctype html><html><body><div data-richclay></div></body></html>');
  globalThis.Squire = FakeSquire;
  try {
    RichClay.autoInit(window);
    assert.equal(document.querySelector("[data-richclay-toolbar]"), null);
    assert.equal(
      document.querySelector("[data-richclay]").hasAttribute("data-richclay-active"),
      false
    );
  } finally {
    delete globalThis.Squire;
  }
});

test("autoInit mounts [data-richclay] regions in Hyperclay edit mode", async () => {
  setupDom('<!doctype html><html><body><div data-richclay></div></body></html>');
  window.hyperclay = {};
  window.__hyperclayEditMode = true;
  globalThis.Squire = FakeSquire;
  try {
    RichClay.autoInit(window);
    // The doc parses as "loading" in jsdom, so autoInit defers the mount to
    // DOMContentLoaded (it ran first, so its listener fires before this one).
    if (document.readyState === "loading") {
      await new Promise(resolve =>
        window.addEventListener("DOMContentLoaded", resolve, { once: true })
      );
    }
    assert.ok(
      document.querySelector("[data-richclay-toolbar]"),
      "toolbar rendered after auto-mount"
    );
  } finally {
    delete globalThis.Squire;
  }
});
