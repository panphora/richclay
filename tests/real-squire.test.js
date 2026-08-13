import test from "node:test";
import assert from "node:assert/strict";
import { setupRealSquire } from "./real-squire.js";
import RichClay from "../src/richclay.js";
import { editorRootNeedsNormalization } from "../src/normalize.js";
import { stripRichClayFromClone } from "../src/hyperclay.js";

const SOURCE = "\n  <p>One</p>\n  <p>Two</p>\n";

const mount = (html = SOURCE) => mountMarkup(`<div editable>${html}</div>`);

const mountMarkup = (markup, platform = "MacIntel") => {
  setupRealSquire(markup, platform);
  const element = document.querySelector("[editable]");
  return { element, editor: new RichClay(element, {}) };
};

// The region's own markup, reparsed. A block inside a phrasing-only root
// serializes fine and then splits the region on the next page load, which is the
// failure no innerHTML assertion on the live DOM can see.
const reparse = element => {
  const probe = element.ownerDocument.createElement("div");
  probe.innerHTML = element.outerHTML;
  return probe;
};

// What actually reaches the file, which is the only place the residue shows: the
// live DOM can hold a manufactured block that the save strip flattens on its way
// out, leaving the <br> behind.
const savedRegion = element => {
  const clone = element.ownerDocument.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  return clone.querySelector("[editable]");
};

const captureWarnings = run => {
  const warnings = [];
  const original = console.warn;
  console.warn = (...args) => warnings.push(args[0]);
  try {
    run();
  } finally {
    console.warn = original;
  }
  return warnings;
};

const silenceWarnings = run => {
  const original = console.warn;
  console.warn = () => {};
  try {
    return run();
  } finally {
    console.warn = original;
  }
};

const caretAt = (editor, node, offset) => {
  const range = node.ownerDocument.createRange();
  range.setStart(node, offset);
  range.collapse(true);
  editor.squire.setSelection(range);
  editor.saveSelection();
};

const press = (target, key, init = {}) =>
  target.dispatchEvent(
    new window.KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init })
  );

// jsdom has no native contenteditable insertion, and Squire's insertPlainText is
// the paste route rather than the typing one: it builds a block per line, so it
// manufactures the very <div> a keystroke never would. Typing is the keydown,
// which is what fires richclay's root guard, plus the character the browser
// itself would have put in the text node.
const type = (editor, node, offset, character) => {
  press(editor.element, character);
  node.insertData(offset, character);
};

// A block whose whole text is whitespace is the visible blank line fixContainer
// manufactures out of source indentation.
const blankBlocks = element =>
  Array.from(element.children)
    .filter(child => !/\S/.test(child.textContent))
    .map(child => child.outerHTML);

// The old keydown guard ignored any key with a modifier, which skipped the repair
// for exactly the two keys installAppleDeleteKeys binds. Plain Delete already
// repaired, and is the control here.
test("Ctrl+D repairs the root before Squire's delete handler, exactly like Delete", () => {
  [["d", { ctrlKey: true }], ["Delete", {}]].forEach(([key, init]) => {
    const { element, editor } = mount();
    const paragraph = element.querySelector("p");
    caretAt(editor, paragraph.firstChild, 3);
    press(paragraph, key, init);

    assert.equal(editorRootNeedsNormalization(element, { wrapBareRoot: true }), false, key);
    assert.deepEqual(blankBlocks(element), [], key);
  });
});

// A toolbar click can be the first interaction with a page, so no root guard has
// fired: without the repair up front, the list command saw the indentation text
// nodes as block boundaries and built one <ul> per paragraph.
test("a toolbar block command repairs the root before it runs", () => {
  const { element, editor } = mount();
  const paragraphs = element.querySelectorAll("p");
  const range = element.ownerDocument.createRange();
  range.setStart(paragraphs[0].firstChild, 0);
  range.setEnd(paragraphs[1].firstChild, 3);
  editor.squire.setSelection(range);
  editor.saveSelection();

  editor.runControl(editor.registry.get("unorderedList"));

  assert.equal(element.querySelectorAll("ul").length, 1);
  assert.equal(element.querySelectorAll("li").length, 2);
});

// _ensureBottomLine appends a default block whenever the root's last element
// child is not blockTag. With blockTag "P" the repair's own <div> wrapper
// qualified, so the first delete left a permanent empty paragraph behind it.
test("_ensureBottomLine no longer appends a block after the repair's own wrapper", () => {
  const { element, editor } = mount("bare text here");
  const original = console.warn;
  console.warn = () => {};
  try {
    editor.ensureRootIsEditable();
  } finally {
    console.warn = original;
  }
  assert.equal(element.innerHTML, "<div>bare text here</div>");

  const wrapper = element.firstElementChild;
  const range = element.ownerDocument.createRange();
  range.setStart(wrapper.firstChild, 0);
  range.setEnd(wrapper.firstChild, 4);
  editor.squire.setSelection(range);
  editor.saveSelection();
  press(wrapper, "Backspace");

  assert.equal(element.children.length, 1);
  assert.equal(element.lastElementChild, wrapper);
});

// The repair runs inside modifyDocument, which suppresses change recording, so it
// folds into the first edit's diff instead of becoming an undo step of its own.
test("undo restores the byte-identical pre-repair source, indentation included", async () => {
  const { element, editor } = mount();
  assert.equal(element.innerHTML, SOURCE);

  const paragraph = element.querySelector("p");
  caretAt(editor, paragraph.firstChild, 3);
  press(paragraph, "x");
  editor.squire.insertPlainText("x", false);
  // Squire leaves its undo state from the MutationObserver, which jsdom delivers
  // on a later tick.
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.notEqual(element.innerHTML, SOURCE);

  editor.squire.undo();
  assert.equal(element.innerHTML, SOURCE);
});

// isDisabled was only read where the toolbar renders, so the shortcut and the
// menu item reached the block commands anyway and Indent quoted a <p editable>.
test("a block command refuses to run on a phrasing-only root", () => {
  const { element, editor } = mountMarkup("<p editable>Hello world</p>");
  const before = element.innerHTML;
  caretAt(editor, element.firstChild, 2);

  editor.runControl(editor.registry.get("indent"));

  assert.equal(element.innerHTML, before);
  assert.equal(element.querySelectorAll("blockquote").length, 0);
});

// The round 3 P0. installShortcuts skipped installing a disabled shortcut, and
// richclay's own binding was the only thing shadowing Squire's inherited Mod+],
// so the key kept building a <blockquote> in a <p editable>. Both platforms,
// because the mask only lands if richclay and Squire agree on the prefix.
test("Mod+] builds nothing in a region a <p> ejects blocks from", () => {
  [["MacIntel", { metaKey: true }], ["Win32", { ctrlKey: true }]].forEach(([platform, init]) => {
    ["<p editable>Hello world</p>", "<p>Lead <span editable>Hello world</span> tail</p>"].forEach(
      markup => {
        const label = `${platform} ${markup}`;
        const { element, editor } = mountMarkup(markup, platform);
        const before = element.innerHTML;
        caretAt(editor, element.firstChild, 5);

        press(element, "]", init);

        assert.equal(element.innerHTML, before, label);
        assert.equal(element.querySelectorAll("blockquote").length, 0, label);
        // The <p> is what the reload takes apart, so it is the <p> that reparses.
        assert.equal(reparse(element.closest("p")).childNodes.length, 1, label);
      }
    );
  });
});

// Nothing rearranges any of these on reload, so the parser is not what decides
// here. A container root stays forgiving: the list command runs and the region
// comes back from a reparse exactly as it was written. A root the author wrote as
// a line of text keeps the shape they gave it, so the command is never offered.
test("a bullet list is allowed in a container root and left off a text-line root", () => {
  [
    ["<div><x-widget editable>Hello world</x-widget></div>", true],
    ["<div><h2 editable>Hello world</h2></div>", false],
    ["<div><span editable>Hello world</span></div>", false]
  ].forEach(([markup, allowed]) => {
    const { element, editor } = mountMarkup(markup);
    const before = element.innerHTML;
    caretAt(editor, element.firstChild, 0);

    silenceWarnings(() => editor.runControl(editor.registry.get("unorderedList")));

    if (!allowed) {
      assert.equal(editor.registry.get("unorderedList").isDisabled(editor), true, markup);
      assert.equal(element.innerHTML, before, markup);
      return;
    }

    assert.equal(element.querySelectorAll("ul").length, 1, markup);
    assert.equal(element.querySelector("li").textContent, "Hello world", markup);

    const probe = reparse(element);
    assert.equal(probe.childNodes.length, 1, markup);
    assert.equal(probe.firstElementChild.innerHTML, element.innerHTML, markup);
  });
});

// Cmd+C, Cmd+S and Cmd+F edit nothing, so they must not trigger the repair: on a
// freshly opened page the repair is the whole rewrite, and a region nobody
// touched would be saved changed.
test("modified keys that do not edit leave a fresh region byte-identical", () => {
  const { element, editor } = mount();
  const paragraph = element.querySelector("p");
  caretAt(editor, paragraph.firstChild, 1);

  [["c", { metaKey: true }], ["s", { metaKey: true }], ["z", { metaKey: true }]].forEach(
    ([key, init]) => {
      press(element, key, init);
      assert.equal(element.innerHTML, SOURCE, key);
    }
  );

  // The narrowing must not undo round 2's fix: Ctrl+D is a key this editor
  // rebound to Squire's own Delete, so it still repairs.
  press(paragraph, "d", { ctrlKey: true });
  assert.equal(editorRootNeedsNormalization(element, { wrapBareRoot: true }), false);
  assert.equal(element.innerHTML, "<p>One</p><p>Two</p>");
});

// The control: a root that can hold blocks must keep the paragraphs it was
// handed.
test("pasting two paragraphs into a block-capable root keeps them as paragraphs", () => {
  const { element, editor } = mountMarkup("<div editable><p>Hello world</p></div>");
  const paragraph = element.querySelector("p");
  caretAt(editor, paragraph.firstChild, 5);

  editor.squire.insertHTML("<p>A</p><p>B</p>");

  assert.equal(element.innerHTML, "<p>HelloA</p><p>B world</p><div><br></div>");
  const probe = reparse(element);
  assert.equal(probe.firstElementChild.innerHTML, element.innerHTML);
});

// Select All anchors both boundaries on the root itself, where closest() has no
// ancestor to walk, so the list reported as absent and the button re-made it.
test("Select All over a lone list still turns the list off", () => {
  const { element, editor } = mount("<ul><li>One</li><li>Two</li></ul>");
  const range = element.ownerDocument.createRange();
  range.selectNodeContents(element);
  editor.squire.setSelection(range);
  editor.saveSelection();

  assert.equal(editor.pathHas("UL"), true);
  editor.runControl(editor.registry.get("unorderedList"));

  assert.equal(element.querySelectorAll("ul").length, 0);
  assert.equal(element.textContent.replace(/\s+/g, ""), "OneTwo");
});

// Squire's _ensureBottomLine appends a default block whenever the root's last
// element child is not its blockTag, and Backspace over a selection runs it. In a
// region that keeps no blocks that is a block nobody asked for, and the save hook
// cannot clean it up without leaving the <br> behind.
test("Backspace over a selection leaves no block and no stray <br>", () => {
  ["<p editable>Hello world</p>", '<h1 editable="single-line">Hello world</h1>'].forEach(markup => {
    const { element, editor } = mountMarkup(markup);
    const text = element.firstChild;
    const range = element.ownerDocument.createRange();
    range.setStart(text, 4);
    range.setEnd(text, 5);
    editor.squire.setSelection(range);
    editor.saveSelection();

    press(element, "Backspace");

    const saved = savedRegion(element);
    assert.equal(saved.innerHTML, "Hell world", markup);
    assert.equal(saved.querySelectorAll("br").length, 0, markup);
    assert.equal(saved.querySelectorAll("div").length, 0, markup);
  });
});

// The residue, over two sessions: the save hook flattens the manufactured block
// but its <br> stays, the reopened file gets another, and the region grows a
// blank line per edit. Only the file matters here, so each round starts from the
// markup the previous save produced.
test("the manufactured <br> does not accumulate across sessions", () => {
  let markup = "<p editable>Hello world</p>";
  [
    [4, "Hell world"],
    [3, "Hel world"]
  ].forEach(([offset, expected]) => {
    const { element, editor } = mountMarkup(markup);
    const text = element.firstChild;
    const range = element.ownerDocument.createRange();
    range.setStart(text, offset);
    range.setEnd(text, offset + 1);
    editor.squire.setSelection(range);
    editor.saveSelection();

    press(element, "Backspace");

    const saved = savedRegion(element);
    assert.equal(saved.innerHTML, expected);
    assert.equal(saved.querySelectorAll("br").length, 0);
    markup = saved.outerHTML;
  });
});

// The author wrote a heading as a line of text, so their file still says exactly
// that after an edit: no manufactured <div> around it, and no warning telling
// them off for writing a heading.
test("<h2 editable> keeps the shape the author wrote through a first edit", () => {
  const { element, editor } = mountMarkup("<div><h2 editable>Hello world</h2></div>");

  const warnings = captureWarnings(() => {
    caretAt(editor, element.firstChild, 5);
    type(editor, element.firstChild, 5, "x");
  });

  assert.deepEqual(warnings, []);
  const saved = savedRegion(element);
  assert.equal(saved.innerHTML, "Hellox world");
  assert.equal(saved.querySelectorAll("div").length, 0);
});

// Nothing rearranges a block inside a <span>, so the save hook leaves one alone
// and a manufactured wrapper would reach the file unopposed. The runtime display
// is the one thing richclay still adds, and it never gets saved.
test("<span editable> is unrewritten too, and still gets its runtime display", () => {
  const { element, editor } = mountMarkup("<div><span editable>Hello world</span></div>");
  assert.equal(element.style.display, "inline-block");

  const warnings = captureWarnings(() => {
    caretAt(editor, element.firstChild, 5);
    type(editor, element.firstChild, 5, "x");
  });

  assert.deepEqual(warnings, []);
  const saved = savedRegion(element);
  assert.equal(saved.innerHTML, "Hellox world");
  assert.equal(saved.querySelectorAll("div").length, 0);
  assert.equal(saved.hasAttribute("style"), false);
});

// The rule is scoped to roots written as a line of text, not to "has no blocks
// yet": a <div> is a container, so it still gets the wrapper Squire's Enter and
// Backspace need, and every block control with it.
test("<div editable> still gets the bare-root wrap and the block controls", () => {
  const { element, editor } = mountMarkup("<div editable>Hello</div>");

  assert.equal(editor.blocksStayOut(), false);
  assert.equal(editor.registry.get("unorderedList").isDisabled(editor), false);

  silenceWarnings(() => editor.ensureRootIsEditable());
  assert.equal(element.innerHTML, "<div>Hello</div>");
});
