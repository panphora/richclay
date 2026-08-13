import test from "node:test";
import assert from "node:assert/strict";
import { setupDom, FakeSquire } from "./helpers.js";
import RichClay from "../src/richclay.js";
import {
  captureRange,
  caretEdge,
  editorRootNeedsNormalization,
  ejectsBlocks,
  flattenBlocks,
  isInlineNode,
  keepsTextShape,
  normalizeEditorRoot,
  restoreRange
} from "../src/normalize.js";

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

// The inverse of fixContainer: the boundary belongs only between two blocks, so
// the text the pasted content merged with on either side keeps its own line.
test("flattenBlocks unwraps every block and marks only the boundary between two", () => {
  const element = region("Hello<p>A</p><p>B</p> world");
  const doc = element.ownerDocument;
  const removed = flattenBlocks(element, () => doc.createElement("br"));

  assert.equal(removed, 2);
  assert.equal(element.innerHTML, "HelloA<br>B world");
  assert.equal(element.querySelectorAll("br").length, 1);
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
  assert.equal(element.innerHTML, "<div><br></div><p>One</p><div>loose text</div><p>Two</p>");
});

test("a comment between blocks is not turned into a blank paragraph", () => {
  const element = region("<p>One</p>\n  <!-- note -->\n  <p>Two</p>");
  normalizeEditorRoot(element);
  assert.equal(element.innerHTML, "<p>One</p><!-- note --><p>Two</p>");
});

// flush() leaves a comments-only run alone, so counting the comment as work left
// to do kept the predicate true forever and re-ran the whole pass, plus its
// selection round trip, on every keystroke.
test("a comment between blocks leaves the root settled after one pass", () => {
  const element = region("<p>One</p>\n  <!-- note -->\n  <p>Two</p>");
  normalizeEditorRoot(element);

  assert.equal(editorRootNeedsNormalization(element), false);
  assert.equal(element.innerHTML, "<p>One</p><!-- note --><p>Two</p>");
});

// The premise the whole design rests on, measured rather than reasoned about:
// place a block in the region, serialize the page, reparse it, and ask whether the
// block is still inside. Only a <p> ancestor and the table structure move it, and
// ejectsBlocks has to answer exactly that and nothing wider.
test("ejectsBlocks says what the parser actually does to a block in each shape", () => {
  [
    ["<div><span editable>A</span></div>", "<div>X</div>", false],
    ["<p>lead <span editable>A</span> tail</p>", "<div>X</div>", true],
    ["<p>lead <em><b><span editable>A</span></b></em> tail</p>", "<div>X</div>", true],
    ["<div><p editable>A</p></div>", "<div>X</div>", true],
    ["<div><h2 editable>A</h2></div>", "<ul><li>X</li></ul>", false],
    ["<div><ul editable><li>A</li></ul></div>", "<div>X</div>", false],
    ["<table><tr><td editable>A</td></tr></table>", "<div>X</div>", false],
    ["<div><x-widget editable>A</x-widget></div>", "<p>X</p>", false],
    ["<p><x-widget editable>A</x-widget></p>", "<div>X</div>", true],
    ["<div><table editable><tr><td>A</td></tr></table></div>", "<div>X</div>", true]
  ].forEach(([shell, block, ejects]) => {
    setupDom(`<!doctype html><html><body>${shell}</body></html>`);
    const region = document.querySelector("[editable]");
    assert.equal(ejectsBlocks(region), ejects, shell);

    region.insertAdjacentHTML("beforeend", block);
    const placed = region.textContent.replace(/\s+/g, "");

    // The whole page round trips, not the region alone: a <td> or a <table> only
    // parses the same way with the markup around it.
    const reloaded = document.implementation.createHTMLDocument("");
    reloaded.body.innerHTML = document.body.innerHTML;
    const after = reloaded.querySelector("[editable]");
    const kept = after ? after.textContent.replace(/\s+/g, "") : "";

    assert.equal(kept === placed, !ejects, shell);
  });
});

// A <div> inside a <p> serializes fine and then reparses with the author's text
// outside their own editable element, so a root with a <p> above it is left alone.
// A heading is not: it keeps an invalid block exactly where it was put.
test("a root that ejects blocks is never given one", () => {
  [
    ["<p editable>Lead <b>in</b>\n  and more</p>", true],
    ["<p>Before <span editable>Lead <b>in</b>\n  and more</span> after</p>", true],
    ["<h2 editable>Lead <b>in</b>\n  and more</h2>", false],
    ["<div><span editable>Lead <b>in</b>\n  and more</span></div>", false]
  ].forEach(([markup, ejects]) => {
    setupDom(`<!doctype html><html><body>${markup}</body></html>`);
    const element = document.querySelector("[editable]");
    const before = element.innerHTML;

    assert.equal(ejectsBlocks(element), ejects, markup);
    assert.equal(editorRootNeedsNormalization(element, { wrapBareRoot: true }), !ejects, markup);
    normalizeEditorRoot(element, { wrapBareRoot: true });
    if (ejects) assert.equal(element.innerHTML, before, markup);
    else assert.equal(element.firstElementChild.nodeName, "DIV", markup);
  });
});

// Not what the parser does, unlike ejectsBlocks: what the author wrote. A line of
// text keeps the shape they gave it, a container gets the full editor. A wrong
// entry here costs a hidden toolbar button or a preserved line of markup, never
// content, which is why it is a short list.
test("keepsTextShape names the roots an author writes as a line of text", () => {
  const doc = region("<p>a</p>").ownerDocument;
  [
    "p", "h2", "pre", "span", "a",
    "li", "td", "th", "dt", "dd", "figcaption", "summary", "caption"
  ].forEach(tag => {
    assert.equal(keepsTextShape(doc.createElement(tag)), true, tag);
  });
  ["div", "section"].forEach(tag => {
    assert.equal(keepsTextShape(doc.createElement(tag)), false, tag);
  });
});

// <hr> is inline to Squire, so it gets wrapped. In a <p> the result reparses as
// <p></p><hr><p></p> and the block is gone, which is where round 1 failed.
test("an <hr> between blocks is wrapped in a div that survives an innerHTML round trip", () => {
  const element = region("<p>One</p><hr><p>Two</p>");
  normalizeEditorRoot(element);
  assert.equal(element.innerHTML, "<p>One</p><div><hr></div><p>Two</p>");

  const probe = element.ownerDocument.createElement("div");
  probe.innerHTML = element.innerHTML;
  assert.equal(probe.innerHTML, element.innerHTML);
});

// Hyperclay's region markers are comments, so a region holding only those is the
// ordinary empty starting state, not loose text the author needs warning about.
test("a region holding only comments or whitespace is empty, not authored", () => {
  [
    ["<!-- hyperclay -->", "<!-- hyperclay --><div><br></div>"],
    ["\n  ", "\n  <div><br></div>"]
  ].forEach(([source, expected]) => {
    const element = region(source);
    let wrapped = 0;
    normalizeEditorRoot(element, {
      wrapBareRoot: true,
      onBareRootWrapped: () => {
        wrapped += 1;
      }
    });

    assert.equal(element.innerHTML, expected, source);
    assert.equal(wrapped, 0, source);
  });
});

// A container whose children never changed needs no re-anchoring, and anchoring
// it anyway pushed a caret sitting before a <b> inside the bold.
test("a caret before an inline element stays put when its container is untouched", () => {
  const element = region("\n  <p>One <b>bold</b></p>\n  <p>Two</p>\n");
  const paragraph = element.querySelector("p");
  const range = element.ownerDocument.createRange();
  range.setStart(paragraph, 1);
  range.collapse(true);

  const saved = captureRange(element, range);
  normalizeEditorRoot(element);
  restoreRange(element, range, saved);

  assert.equal(range.startContainer, paragraph);
  assert.equal(range.startOffset, 1);
});

test("caretEdge skips a trailing comment and stops at every void", () => {
  const element = region("<p>Text<!-- note --></p><p>Tail<wbr></p>");
  const [withComment, withWbr] = element.querySelectorAll("p");

  assert.equal(caretEdge(withComment, false), withComment.firstChild);
  assert.equal(caretEdge(withWbr, false), withWbr);
});

test("an empty region gets a placeholder block and no warning", () => {
  const element = region("");
  assert.equal(editorRootNeedsNormalization(element, { wrapBareRoot: true }), true);

  let wrapped = 0;
  normalizeEditorRoot(element, {
    wrapBareRoot: true,
    onBareRootWrapped: () => {
      wrapped += 1;
    }
  });

  assert.equal(element.innerHTML, "<div><br></div>");
  assert.equal(wrapped, 0);
});

// Whitespace preservation follows the PRE tag, matching Squire. Reading computed
// style instead made a pre-wrap root keep the indentation in the drop pass, which
// the wrap pass then turned into visible blank blocks.
test("a white-space: pre-wrap root does not manufacture blank blocks", () => {
  const element = region("\n  <p>One</p>\n  <p>Two</p>\n");
  element.style.whiteSpace = "pre-wrap";
  normalizeEditorRoot(element);
  assert.equal(element.innerHTML, "<p>One</p><p>Two</p>");
});

// An <svg> keeps its lowercase nodeName, so it can never match Squire's inline
// name test and used to split one line of prose into three blocks.
test("an inline svg icon stays inside one block with its text", () => {
  const element = region(
    '<p>Intro</p>Click <svg viewBox="0 0 8 8"><circle cx="4" cy="4" r="3"></circle></svg> here'
  );
  normalizeEditorRoot(element);
  assert.equal(
    element.innerHTML,
    '<p>Intro</p><div>Click <svg viewBox="0 0 8 8"><circle cx="4" cy="4" r="3"></circle></svg> here</div>'
  );
});

// DOM Ranges are live: removing a whitespace child already decremented this
// boundary's offset, so re-applying the captured number moved the caret past the
// block it was sitting in front of.
test("a caret between nested blocks survives the repair", () => {
  const element = region('<div class="card">\n  <p>a</p>\n  <p>b</p>\n</div>');
  const card = element.querySelector(".card");
  const range = element.ownerDocument.createRange();
  range.setStart(card, 3);
  range.collapse(true);

  const saved = captureRange(element, range);
  normalizeEditorRoot(element);
  restoreRange(element, range, saved);

  assert.equal(range.startContainer, card.lastChild.firstChild);
  assert.equal(range.startOffset, 0);
});

test("caretEdge stops at a block whose only child is a leaf", () => {
  const element = region("<div><br></div>");
  const block = element.firstElementChild;
  assert.equal(caretEdge(block, true), block);
  assert.equal(caretEdge(block, false), block);
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

  // Inline mode's one block tag is DIV, so the heal wraps the orphan in one.
  assert.deepEqual(childKinds(element), ["DIV", "P"]);
  assert.equal(element.innerHTML, "<div>One</div><p>Two</p>");
});
