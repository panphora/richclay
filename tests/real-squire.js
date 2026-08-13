import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import DOMPurifyFactory from "../vendor/purify.es.mjs";
import { setPlatform } from "./helpers.js";

const squireSource = readFileSync(new URL("../vendor/squire.js", import.meta.url), "utf8");

// The vendored Squire runs in jsdom, which the suite never used: every command,
// key handler and undo path below is the real engine, not FakeSquire. Structural
// behavior is faithful here; Selection and layout are not, so keep browser-shaped
// assertions out of these tests.
export function setupRealSquire(bodyHtml = "", platform = "MacIntel") {
  const dom = new JSDOM(`<!doctype html><html><body>${bodyHtml}</body></html>`, {
    url: "https://example.test/",
    pretendToBeVisual: true,
    runScripts: "outside-only"
  });
  const { window } = dom;
  globalThis.window = window;
  globalThis.document = window.document;
  globalThis.Node = window.Node;
  globalThis.CustomEvent = window.CustomEvent;
  globalThis.KeyboardEvent = window.KeyboardEvent;
  // Squire reads navigator.userAgent once, at module-eval time, to pick its
  // Meta-/Ctrl- modifier prefix, so the platform has to be stamped before the
  // source runs or the engine and richclay spend the test on different keyboards.
  setPlatform(window, platform);
  // Squire's default sanitizer reads DOMPurify off its own global scope, which is
  // the jsdom window, not Node's globalThis.
  window.DOMPurify = DOMPurifyFactory(window);
  globalThis.DOMPurify = window.DOMPurify;
  window.eval(squireSource);
  return dom;
}
