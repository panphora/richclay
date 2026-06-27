import test from "node:test";
import assert from "node:assert/strict";
import { setupDom, FakeSquire } from "./helpers.js";
import RichClay from "../src/richclay.js";

test("standalone init preserves existing sanitized HTML", () => {
  setupDom(`
    <!doctype html><html><body>
      <div data-richclay><p>Hello <strong>DOM</strong></p><script>bad()</script></div>
    </body></html>
  `);

  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: "minimal"
  });

  assert.equal(editor.active, true);
  assert.equal(editor.getHTML(), "<p>Hello <strong>DOM</strong></p>");
  assert.equal(document.querySelector("[data-richclay-toolbar]") !== null, true);
});

test("setHTML/getHTML round trip through sanitizer", () => {
  setupDom('<!doctype html><html><body><div data-richclay></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: []
  });

  editor.setHTML('<p onclick="bad()">Safe <a href="javascript:bad()">link</a></p>');

  assert.equal(editor.getHTML(), "<p>Safe <a>link</a></p>");
});

test("destroy removes toolbar and runtime attrs but preserves marker and content", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>Keep</p></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: "minimal",
    placeholder: "Write"
  });

  editor.destroy();

  const element = document.querySelector("[data-richclay]");
  assert.equal(element.hasAttribute("data-richclay"), true);
  assert.equal(element.hasAttribute("contenteditable"), false);
  assert.equal(element.classList.contains("richclay-editor"), false);
  assert.equal(document.querySelector("[data-richclay-toolbar]"), null);
  assert.equal(element.innerHTML, "<p>Keep</p>");
});

test("global and instance custom button registration work", () => {
  setupDom('<!doctype html><html><body><div data-richclay></div></body></html>');
  RichClay.registerButton({
    id: "globalTest",
    label: "Global",
    run: editor => editor.squire.commands.push("global")
  });

  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: ["globalTest"]
  });
  document.querySelector("[aria-label='Global']").click();
  assert.equal(editor.squire.commands.includes("global"), true);

  editor.registerButton({
    id: "instanceTest",
    label: "Instance",
    run: rte => rte.squire.commands.push("instance")
  });
  editor.options.toolbar = ["instanceTest"];
  editor.renderToolbar();
  document.querySelector("[aria-label='Instance']").click();
  assert.equal(editor.squire.commands.includes("instance"), true);
});

test("unregisterButton removes a button (instance + global)", () => {
  setupDom('<!doctype html><html><body><div data-richclay></div></body></html>');
  RichClay.registerButton({ id: "gtmp", label: "G", run() {} });
  RichClay.unregisterButton("gtmp");

  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: "minimal"
  });
  assert.throws(() => editor.resolveToolbarControls(["gtmp"]));

  editor.registerButton({ id: "itmp", label: "I", run() {} });
  assert.doesNotThrow(() => editor.resolveToolbarControls(["itmp"]));
  editor.unregisterButton("itmp");
  assert.throws(() => editor.resolveToolbarControls(["itmp"]));
});

test("link dialog pre-fills the URL of the link under the selection", () => {
  setupDom('<!doctype html><html><body><div data-richclay></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: ["link"]
  });
  editor.setHTML('<p>Go <a href="https://example.com/x">here</a></p>');

  const anchor = editor.element.querySelector("a");
  const range = document.createRange();
  range.selectNodeContents(anchor);
  editor.squire.setSelection(range);

  assert.equal(editor.currentLinkHref(), "https://example.com/x");

  editor.openLinkDialog();
  const input = document.querySelector("[data-richclay-dialog] input");
  assert.equal(input.value, "https://example.com/x");
});

test("constructor validates its element and is idempotent per element", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>x</p></div></body></html>');
  assert.throws(() => new RichClay(null), /requires an element/);

  const element = document.querySelector("[data-richclay]");
  const first = new RichClay(element, { Squire: FakeSquire, toolbar: "minimal" });
  const second = new RichClay(element, { Squire: FakeSquire, toolbar: "full" });

  assert.equal(first, second);
  assert.equal(document.querySelectorAll("[data-richclay-toolbar]").length, 1);
});

test("readOnly stays inert: no activation, no toolbar, no contenteditable, but setHTML still sanitizes", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>keep</p></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    readOnly: true
  });

  assert.equal(editor.active, false);
  assert.equal(editor.element.hasAttribute("contenteditable"), false);
  assert.equal(document.querySelector("[data-richclay-toolbar]"), null);
  assert.equal(editor.getHTML(), "<p>keep</p>");

  editor.setHTML('<p>fresh<script>bad()</script></p>');
  assert.equal(editor.element.innerHTML, "<p>fresh</p>");
});

test("hostile initial content is sanitized in the live DOM even without activation", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>Keep<script>bad()</script></p><img src=x onerror="bad()"></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    readOnly: true
  });

  assert.equal(editor.active, false);
  assert.equal(editor.element.querySelector("script"), null);
  assert.equal(editor.element.querySelector("img"), null);
  assert.equal(editor.element.innerHTML, "<p>Keep</p>");
});

test("onChange fires with sanitized HTML when content changes", () => {
  setupDom('<!doctype html><html><body><div data-richclay></div></body></html>');
  const changes = [];
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: [],
    onChange: html => changes.push(html)
  });

  editor.setHTML('<p>Hi<script>x()</script></p>');
  assert.deepEqual(changes, ["<p>Hi</p>"]);
});

test("static init activates every matching region", () => {
  setupDom(
    '<!doctype html><html><body><div data-richclay><p>1</p></div><div data-richclay><p>2</p></div></body></html>'
  );

  const editors = RichClay.init(undefined, { Squire: FakeSquire, toolbar: "minimal" });

  assert.equal(editors.length, 2);
  assert.equal(editors.every(editor => editor.active), true);
  assert.equal(document.querySelectorAll("[data-richclay-toolbar]").length, 2);
});

test("the bare `richclay` attribute is honored without adding `data-richclay`", () => {
  setupDom('<!doctype html><html><body><div richclay><p>v</p></div></body></html>');
  const editor = new RichClay(document.querySelector("[richclay]"), {
    Squire: FakeSquire,
    toolbar: "minimal"
  });

  assert.equal(editor.active, true);
  assert.equal(editor.element.hasAttribute("richclay"), true);
  assert.equal(editor.element.hasAttribute("data-richclay"), false);
});

test("destroy is idempotent and unwires Squire listeners", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>Keep</p></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: "minimal"
  });

  const squire = editor.squire;
  editor.destroy();

  assert.deepEqual(squire.events.get("input"), []);
  assert.equal(editor.element.innerHTML, "<p>Keep</p>");
  assert.doesNotThrow(() => editor.destroy());
});
