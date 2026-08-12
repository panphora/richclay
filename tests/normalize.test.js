import test from "node:test";
import assert from "node:assert/strict";
import { setupDom, FakeSquire } from "./helpers.js";
import RichClay from "../src/richclay.js";
import { isInlineNode, normalizeEditorRoot } from "../src/normalize.js";

const region = html => {
  setupDom(`<!doctype html><html><body><div editable>${html}</div></body></html>`);
  return document.querySelector("[editable]");
};

const childKinds = element =>
  Array.from(element.childNodes).map(node => (node.nodeType === 3 ? "#text" : node.nodeName));

test("isInlineNode agrees with Squire: a container is not inline", () => {
  const element = region("<p>a</p>");
  const doc = element.ownerDocument;
  assert.equal(isInlineNode(doc.createTextNode(" ")), true);
  assert.equal(isInlineNode(doc.createComment("x")), true);
  assert.equal(isInlineNode(doc.createElement("span")), true);
  assert.equal(isInlineNode(doc.createElement("br")), true);
  assert.equal(isInlineNode(doc.createElement("p")), false);

  const span = doc.createElement("span");
  span.appendChild(doc.createElement("p"));
  assert.equal(isInlineNode(span), false);
});

// The bug: Squire's fixContainer() wraps a run of inline children in a <div> and
// gives it a <br>, so source indentation between blocks turns into visible blank
// lines the first time Backspace or Delete runs, and every later Enter copies the
// whitespace into another block.
test("formatting whitespace between blocks is dropped", () => {
  const element = region("\n  <p>One</p>\n  <p>Two</p>\n");
  normalizeEditorRoot(element);
  assert.deepEqual(childKinds(element), ["P", "P"]);
  assert.equal(element.innerHTML, "<p>One</p><p>Two</p>");
});

test("whitespace that is content is kept", () => {
  const element = region("<p>a <b>b</b> c</p>");
  const before = element.innerHTML;
  normalizeEditorRoot(element);
  assert.equal(element.innerHTML, before);
});

test("whitespace inside a pre is kept", () => {
  const element = region("<pre>one\n  two\n</pre>\n<p>after</p>");
  normalizeEditorRoot(element);
  assert.equal(element.querySelector("pre").textContent, "one\n  two\n");
  assert.deepEqual(childKinds(element), ["PRE", "P"]);
});

test("nested containers are normalized too", () => {
  const element = region('<div class="card">\n  <p>a</p>\n  <p>b</p>\n</div>');
  normalizeEditorRoot(element);
  const card = element.querySelector(".card");
  assert.deepEqual(childKinds(card), ["P", "P"]);
  assert.equal(card.className, "card");
});

test("a wholly inline root is left exactly as authored", () => {
  const element = region('Bare text with <span class="badge">a span</span> and a<br>break.');
  const before = element.innerHTML;
  normalizeEditorRoot(element);
  assert.equal(element.innerHTML, before);
});

// Squire's removeCode() splices an emptied <pre> out of the root, leaving a bare
// <br> outside any block. A caret parked there makes getStartBlockOfRange()
// return null, which turns every later block command into a silent no-op.
test("stray inline content on a mixed root is wrapped in a block", () => {
  const element = region("<br><p>One</p>loose text<p>Two</p>");
  normalizeEditorRoot(element);
  assert.equal(element.innerHTML, "<p><br></p><p>One</p><p>loose text</p><p>Two</p>");
});

test("a comment between blocks is not turned into a blank paragraph", () => {
  const element = region("<p>One</p>\n  <!-- note -->\n  <p>Two</p>");
  normalizeEditorRoot(element);
  assert.equal(element.innerHTML, "<p>One</p><!-- note --><p>Two</p>");
});

test("author markup survives normalization untouched", () => {
  const element = region(
    '\n  <p id="lead" class="lead" data-x="1">Hi <img src="a.png" alt=""> <span class="icon"></span><em>there</em></p>\n'
  );
  normalizeEditorRoot(element);
  assert.equal(
    element.innerHTML,
    '<p id="lead" class="lead" data-x="1">Hi <img src="a.png" alt=""> <span class="icon"></span><em>there</em></p>'
  );
});

test("inline activation leaves the region byte-identical", () => {
  // Opening a page in edit mode must not change it. A Hyperclay page with
  // autosave on would otherwise write itself to disk for being looked at.
  const source = '\n  <p class="a">One</p>\n  <h2>Two</h2>\n  <p><strong>Three</strong></p>\n';
  const element = region(source);
  new RichClay(element, { Squire: FakeSquire });
  assert.equal(element.innerHTML, source);
});

test("the first edit normalizes the root without rewriting the blocks", () => {
  const element = region(
    '\n  <p class="a">One</p>\n  <h2>Two</h2>\n  <p><strong>Three</strong></p>\n'
  );
  const editor = new RichClay(element, { Squire: FakeSquire });
  editor.ensureRootIsEditable();

  assert.deepEqual(childKinds(element), ["P", "H2", "P"]);
  assert.equal(
    element.innerHTML,
    '<p class="a">One</p><h2>Two</h2><p><strong>Three</strong></p>'
  );
});

test("a multi-line region of bare text gets one plain div on first edit", () => {
  const element = region("bare <span class=\"badge\">text</span> here");
  const editor = new RichClay(element, { Squire: FakeSquire });
  assert.equal(element.innerHTML, 'bare <span class="badge">text</span> here');

  const warnings = [];
  const original = console.warn;
  console.warn = (...args) => warnings.push(args[0]);
  try {
    editor.ensureRootIsEditable();
  } finally {
    console.warn = original;
  }

  // <div>, not <p>: no margins, so the author's page looks the same.
  assert.equal(element.innerHTML, '<div>bare <span class="badge">text</span> here</div>');
  assert.equal(warnings.length, 1);
  assert.equal(/wrapped this region/.test(warnings[0]), true);
});

test("a single-line region is never wrapped", () => {
  const element = document.createElement("h1");
  element.setAttribute("editable", "single-line");
  element.textContent = "Title";
  document.body.appendChild(element);
  const editor = new RichClay(element, { Squire: FakeSquire });
  editor.ensureRootIsEditable();
  assert.equal(element.innerHTML, "Title");
});

test("inline activation restores the original nodes, not a reserialized copy", () => {
  const element = region("<p>One</p>");
  const paragraph = element.firstChild;
  new RichClay(element, { Squire: FakeSquire });
  assert.equal(element.firstChild, paragraph);
});

test("a command that orphans inline content on the root is healed", () => {
  const element = region("<p>One</p><p>Two</p>");
  const editor = new RichClay(element, { Squire: FakeSquire, toolbar: false });

  editor.runControl({
    id: "orphan",
    label: "Orphan",
    run: () => {
      const first = element.firstChild;
      first.replaceWith(...first.childNodes);
    }
  });

  assert.deepEqual(childKinds(element), ["P", "P"]);
  assert.equal(element.innerHTML, "<p>One</p><p>Two</p>");
});
