import test from "node:test";
import assert from "node:assert/strict";
import { setupRealSquire } from "./real-squire.js";
import RichClay from "../src/richclay.js";

// Every test here runs the real Squire engine: the guard sits in front of the engine's
// own root, and the property under test is what the browser action would have been.
// jsdom has neither a caret nor navigation, so a click it never sees canceled makes it
// queue a navigation it then refuses to perform, and the warning arrives from a timer
// with no event left to attribute it to.

const mount = (markup, options = {}) => {
  setupRealSquire(markup);
  const element = document.querySelector("[data-richclay], [editable], [clay-editable]");
  const editor = new RichClay(element, options);
  return { element, editor };
};

const card = html => `<div data-richclay>${html}</div>`;

// The observer is bound to the document, so it runs after the root's capture listener
// has already decided: what it records is the editor's own answer. It cancels only
// what is left, and only after recording, which keeps jsdom from queueing the
// navigation. This models the click; it does not claim a native pointer press would
// have placed a caret anywhere.
const dispatch = (target, type = "click", init = {}) => {
  const seen = { prevented: null, bubbled: false };
  const observer = event => {
    seen.prevented = event.defaultPrevented;
    seen.bubbled = true;
    if (!event.defaultPrevented) event.preventDefault();
  };
  document.addEventListener(type, observer);
  let cancels = 0;
  try {
    const event = new window.MouseEvent(type, { bubbles: true, cancelable: true, ...init });
    // Counted per event through an own property, so a second listener on the root
    // reads as two cancellations instead of one. When the editor cancels, the
    // observer above has nothing left to cancel and adds nothing to the count.
    const preventDefault = event.preventDefault;
    event.preventDefault = () => {
      cancels += 1;
      preventDefault.call(event);
    };
    target.dispatchEvent(event);
  } finally {
    document.removeEventListener(type, observer);
  }
  return { prevented: seen.prevented === true, bubbled: seen.bubbled, cancels };
};

test("an ordinary click on a formatted link child is canceled while the editor is active", () => {
  // Squire normalizes STRONG to B on its way in, which is why the formatted child
  // is spelled the way the engine keeps it.
  const { element, editor } = mount(
    card('<p>lead <a href="https://example.com/first"><b>first</b></a> tail</p>')
  );
  const bold = element.querySelector("b");
  const html = element.innerHTML;

  const result = dispatch(bold);

  assert.equal(editor.active, true);
  assert.equal(result.prevented, true);
  assert.equal(element.innerHTML, html);
  assert.equal(element.querySelector("a").getAttribute("href"), "https://example.com/first");
});

test("modifier clicks are canceled like plain ones", () => {
  const { element } = mount(card('<p><a href="/first">first</a></p>'));
  const anchor = element.querySelector("a");

  for (const init of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }]) {
    assert.equal(dispatch(anchor, "click", init).prevented, true);
  }
});

test("a middle-click is canceled before it opens a background tab", () => {
  const { element } = mount(card('<p><a href="/first">first</a></p>'));

  assert.equal(dispatch(element.querySelector("a"), "auxclick", { button: 1 }).prevented, true);
});

test("an inline editor cancels link clicks in the page's own markup", () => {
  const { element, editor } = mount("<article editable><p>lead <a href=\"/first\">first</a></p></article>", {
    toolbar: false,
    hyperclay: false
  });

  assert.equal(editor.options.inline, true);
  assert.equal(dispatch(element.querySelector("a")).prevented, true);
});

test("an editor with no toolbar cancels link clicks", () => {
  const { element, editor } = mount(card('<p><a href="/first">first</a></p>'), { toolbar: false });

  assert.equal(editor.toolbar, null);
  assert.equal(dispatch(element.querySelector("a")).prevented, true);
});

test("the guard survives a blur that leaves the editor active", () => {
  const { element, editor } = mount(card('<p><a href="/first">first</a></p>'));

  element.dispatchEvent(new window.FocusEvent("blur"));

  assert.equal(editor.active, true);
  assert.equal(dispatch(element.querySelector("a")).prevented, true);
});

// Live sync hands the element the incoming copy's state, contenteditable included,
// while the instance stays active and Squire stays bound. The guard has to hold in
// that window, so it does not read the attribute.
test("the guard does not depend on the contenteditable attribute", () => {
  const { element, editor } = mount(card('<p><a href="/first">first</a></p>'));

  element.removeAttribute("contenteditable");

  assert.equal(editor.active, true);
  assert.equal(dispatch(element.querySelector("a")).prevented, true);
});

test("a link inserted after activation is canceled too", () => {
  const { element } = mount(card("<p>lead</p>"));
  const paragraph = element.querySelector("p");
  const anchor = document.createElement("a");
  anchor.setAttribute("href", "/added");
  anchor.textContent = "added";
  paragraph.appendChild(anchor);

  assert.equal(dispatch(anchor.firstChild).prevented, true);
  assert.equal(dispatch(anchor).prevented, true);
});

test("a link wrapping the editing root is blocked for clicks that start inside it", () => {
  const { element } = mount('<a href="https://example.com/first"><div data-richclay><p>first</p></div></a>');

  assert.equal(dispatch(element.querySelector("p")).prevented, true);
});

test("a link outside the editor is left to the browser", () => {
  const { element } = mount(card("<p>inside</p>") + '<p><a id="outside" href="/elsewhere">elsewhere</a></p>');

  assert.equal(dispatch(document.getElementById("outside")).prevented, false);
  assert.equal(element.querySelector("a"), null);
});

test("clicks that are not on a link are not canceled", () => {
  const { element } = mount(card('<p>plain <i>text</i></p><p><a href="/first">first</a></p>'));

  assert.equal(dispatch(element.querySelector("i")).prevented, false);
  assert.equal(dispatch(element.querySelector("p")).prevented, false);
});

test("mousedown and pointerdown are not canceled", () => {
  const { element } = mount(card('<p><a href="/first">first</a></p>'));
  const anchor = element.querySelector("a");

  assert.equal(dispatch(anchor, "mousedown", { button: 0 }).prevented, false);
  assert.equal(dispatch(anchor, "pointerdown", { button: 0 }).prevented, false);
});

test("the canceled click still bubbles, and href, HTML and selection are untouched", () => {
  const { element } = mount(card('<p>lead <a href="/first">first</a> tail</p>'));
  const anchor = element.querySelector("a");
  const html = element.innerHTML;
  const range = document.createRange();
  range.setStart(anchor.firstChild, 2);
  range.collapse(true);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  const result = dispatch(anchor);

  assert.equal(result.prevented, true);
  assert.equal(result.bubbled, true);
  assert.equal(result.cancels, 1);
  assert.equal(element.innerHTML, html);
  assert.equal(anchor.getAttribute("href"), "/first");
  assert.equal(selection.rangeCount, 1);
  assert.equal(selection.getRangeAt(0).startContainer, anchor.firstChild);
  assert.equal(selection.getRangeAt(0).startOffset, 2);
});

// An inactive element carries no editor state, so the constructor never reaches
// setupEditorAttributes and the guard is never installed.
test("a read-only instance leaves links to the browser", () => {
  const { element, editor } = mount(card('<p><a href="/first">first</a></p>'), { readOnly: true });

  assert.equal(editor.active, false);
  assert.equal(element.getAttribute("contenteditable"), null);
  assert.equal(dispatch(element.querySelector("a")).prevented, false);
});

test("destroy removes the guard", () => {
  const { element, editor } = mount(card('<p><a href="/first">first</a></p>'));
  const anchor = element.querySelector("a");

  assert.equal(dispatch(anchor).prevented, true);

  editor.destroy();

  assert.equal(dispatch(anchor).prevented, false);
});

// reattach re-applies the attributes for an editor whose element came back from a
// live-sync frame stripped. The handler is the same reference each time, so the
// second install must not leave a second listener behind.
test("re-attaching the editor's attributes adds no second listener", () => {
  const { element, editor } = mount(card('<p><a href="/first">first</a></p>'));
  const anchor = element.querySelector("a");

  const initial = dispatch(anchor);
  assert.equal(initial.prevented, true);
  assert.equal(initial.cancels, 1);

  element.removeAttribute("contenteditable");
  assert.equal(editor.reattach(), true);

  const reattached = dispatch(anchor);
  assert.equal(reattached.prevented, true);
  assert.equal(reattached.cancels, 1);
});

test("nested editor controls cannot activate an anchor wrapping those controls", () => {
  const { element } = mount('<a href="/wrapper"><article editable><p>text</p></article></a>', {
    toolbar: false, hyperclay: false
  });
  const control = document.createElement("span");
  control.setAttribute("editor-ui", "");
  control.textContent = "resize";
  element.appendChild(control);
  assert.equal(dispatch(control).prevented, true);

  const anchor = document.createElement("a");
  anchor.setAttribute("href", "/inner");
  element.appendChild(anchor);
  anchor.appendChild(control);
  assert.equal(dispatch(control).prevented, true);
  element.removeAttribute("contenteditable");
  assert.equal(dispatch(control).prevented, true);
});

// Chrome nested inside the region keeps its own links: an inline editor sits inside a
// page whose toolbar and dialogs are ordinary markup, and a button there that happens
// to be a link is not the region's text.
test("links inside nested editor-ui regions stay interactive", () => {
  const { element } = mount(
    "<article editable><p>body <a id=\"body\" href=\"/body\">body</a></p>" +
      '<div editor-ui><a id="tools" href="/tools">tools</a></div>' +
      '<div clay="editor-ui"><a id="api" href="/api">api</a></div></article>',
    { toolbar: false, hyperclay: false }
  );

  assert.equal(dispatch(document.getElementById("tools")).prevented, false);
  assert.equal(dispatch(document.getElementById("api")).prevented, false);
  assert.equal(dispatch(document.getElementById("body")).prevented, true);
  assert.equal(element.contains(document.getElementById("tools")), true);
  assert.equal(element.contains(document.getElementById("api")), true);
});

// The exclusion is for chrome nested inside the region. An editor-ui ancestor that
// surrounds the whole region is outside the region's own text, so it does not exempt
// a link the region itself contains.
test("an editor-ui ancestor around the whole region does not exempt its own links", () => {
  const { element } = mount('<div editor-ui><article editable><p><a href="/body">body</a></p></article></div>', {
    toolbar: false,
    hyperclay: false
  });

  assert.equal(element.tagName, "ARTICLE");
  assert.equal(dispatch(element.querySelector("a")).prevented, true);
});
