import test from "node:test";
import assert from "node:assert/strict";
import { setupRealSquire } from "./real-squire.js";
import RichClay from "../src/richclay.js";

// Every test here runs the real Squire engine. The formatting commands have to be
// the engine's own, because the link form's Remove path calls removeLink() on a
// range that selects the anchor node, and only the real command proves that the
// text and the inline formatting inside it survive.

const mount = (markup, options = {}) => {
  setupRealSquire(`<div data-richclay>${markup}</div>`);
  const element = document.querySelector("[data-richclay]");
  const editor = new RichClay(element, { toolbar: ["link"], ...options });
  editor.squire.focus();
  return { element, editor };
};

const linkButton = () => document.querySelector("[data-richclay-control='link']");
const pressed = () => linkButton().getAttribute("aria-pressed");
const dialog = () => document.querySelector("[data-richclay-dialog]");

// jsdom cannot move a caret with a native ArrowRight, so a test that wants Squire
// to notice a moved selection has to model the range and then emit the event
// Squire itself listens for. document "selectionchange" reaches Squire, which
// re-reads its selection and fires the cursor/select notifications the toolbar
// follows, so no test here calls toolbar.update() itself. This is a modelled
// selection move, not proof that a native keystroke works.
const emitSelection = (editor, range) => {
  editor.squire.setSelection(range);
  document.dispatchEvent(new window.Event("selectionchange"));
};

const caretIn = (editor, node, offset) => {
  const range = document.createRange();
  range.setStart(node, offset);
  range.collapse(true);
  emitSelection(editor, range);
};

const selectBetween = (editor, startNode, startOffset, endNode, endOffset) => {
  const range = document.createRange();
  range.setStart(startNode, startOffset);
  range.setEnd(endNode, endOffset);
  emitSelection(editor, range);
};

test("the link control follows a caret in and out of a link", () => {
  const { element, editor } = mount('<p>lead <a href="/one">one</a> tail</p>');
  const anchor = element.querySelector("a");
  const tail = anchor.nextSibling;

  assert.equal(pressed(), "false");
  caretIn(editor, anchor.firstChild, 1);
  assert.equal(pressed(), "true");
  caretIn(editor, tail, 2);
  assert.equal(pressed(), "false");
});

// Both partial overlaps count, and a selection that covers the whole anchor
// counts too. The direction of the boundary comparison is what these pin down:
// start-only means the selection runs from inside the link to after it,
// end-only means it runs from before the link to inside it.
test("a selection that only partly covers a link presses the link control", () => {
  const { element, editor } = mount('<p>lead <a href="/one">one</a> tail</p>');
  const anchor = element.querySelector("a");
  const lead = anchor.previousSibling;
  const tail = anchor.nextSibling;

  selectBetween(editor, anchor.firstChild, 1, tail, 2);
  assert.equal(pressed(), "true");

  selectBetween(editor, lead, 2, anchor.firstChild, 2);
  assert.equal(pressed(), "true");

  selectBetween(editor, anchor.firstChild, 0, anchor.firstChild, 3);
  assert.equal(pressed(), "true");

  selectBetween(editor, lead, 2, tail, 2);
  assert.equal(pressed(), "true");
  assert.equal(editor.currentLinkElement(), anchor);
});

// Touching a link's text boundary is not covering it: a selection that ends where
// the link starts, or begins where it ends, leaves the control unpressed.
test("a selection that only touches a link's text boundary does not press the link control", () => {
  const { element, editor } = mount('<p>lead <a href="/one">one</a> tail</p>');
  const anchor = element.querySelector("a");
  const lead = anchor.previousSibling;
  const tail = anchor.nextSibling;

  caretIn(editor, lead, lead.length);
  assert.equal(pressed(), "false");

  selectBetween(editor, lead, 0, anchor.firstChild, 0);
  assert.equal(pressed(), "false");

  selectBetween(editor, anchor.firstChild, 3, tail, 3);
  assert.equal(pressed(), "false");
});

test("the link control is pressed from inline formatting nested inside a link", () => {
  const { element, editor } = mount('<p><a href="/x"><b>bold</b> rest</a></p>');
  const bold = element.querySelector("b");

  caretIn(editor, bold.firstChild, 1);
  assert.equal(pressed(), "true");
  assert.equal(editor.currentLinkElement().getAttribute("href"), "/x");

  selectBetween(editor, bold.firstChild, 0, bold.firstChild, 4);
  assert.equal(pressed(), "true");
});

test("a selection over several links reports and previews the first one in document order", () => {
  const { element, editor } = mount('<p>lead <a href="/one">one</a> mid <a href="/two">two</a> tail</p>');
  const [one] = element.querySelectorAll("a");
  const two = element.querySelectorAll("a")[1];

  selectBetween(editor, one.firstChild, 0, two.firstChild, 3);
  assert.equal(editor.currentLinkElement(), one);
  assert.equal(editor.currentLinkHref(), "/one");
  assert.equal(pressed(), "true");

  editor.openLinkDialog();
  assert.equal(dialog().querySelector("input").value, "/one");
});

// An author can wrap a region in their own link. That link is outside the editor's
// content, so the caret must never report it.
test("a region inside an author's <a> does not report that outer link", () => {
  setupRealSquire('<div id="host"><a href="/keep">Lead <span editable>Hello world</span> tail</a></div>');
  const element = document.querySelector("[editable]");
  const editor = new RichClay(element, { toolbar: ["link"] });
  editor.squire.focus();
  const text = element.firstChild;
  assert.equal(text.nodeType, 3);

  caretIn(editor, text, 3);
  assert.equal(editor.currentLinkElement(), null);

  selectBetween(editor, text, 0, text, text.length);
  assert.equal(editor.currentLinkElement(), null);
});

test("the form on an existing link prefills the URL and offers Remove link", () => {
  const { element, editor } = mount('<p>lead <a href="/one">one</a> tail</p>');
  const anchor = element.querySelector("a");

  caretIn(editor, anchor.firstChild, 1);
  editor.openLinkDialog();

  const form = dialog();
  assert.equal(form.querySelector("input").value, "/one");
  assert.equal(form.querySelector(".richclay-dialog-title").textContent, "Edit link");
  const remove = form.querySelector("[data-richclay-remove-link]");
  assert.equal(Boolean(remove), true);
  assert.equal(remove.type, "button");
  assert.equal(remove.className, "richclay-secondary");
});

test("the form for a new link has no Remove link button", () => {
  const { element, editor } = mount("<p>lead tail</p>");

  caretIn(editor, element.querySelector("p").firstChild, 2);
  editor.openLinkDialog();

  const form = dialog();
  assert.equal(form.querySelector(".richclay-dialog-title").textContent, "Insert link");
  assert.equal(form.querySelector("[data-richclay-remove-link]"), null);
});

test("Remove link keeps the text and inline formatting, closes, refocuses and announces", async () => {
  const { element, editor } = mount('<p>lead <a href="/one"><b>one</b> <i>two</i></a> tail</p>');
  const anchor = element.querySelector("a");

  caretIn(editor, anchor.querySelector("b").firstChild, 1);
  assert.equal(pressed(), "true");

  editor.openLinkDialog();
  dialog().querySelector("[data-richclay-remove-link]").click();

  assert.equal(element.querySelectorAll("a").length, 0);
  assert.equal(element.textContent, "lead one two tail");
  assert.equal(element.innerHTML, "<p>lead <b>one</b> <i>two</i> tail</p>");
  assert.equal(dialog(), null);
  assert.equal(document.activeElement, element);
  assert.equal(editor.currentLinkElement(), null);
  assert.equal(pressed(), "false");

  assert.equal(editor.liveRegion.textContent, "");
  await new Promise(resolve => setTimeout(resolve, 30));
  assert.equal(editor.liveRegion.textContent, "Link removed");
});

test("the form orders URL, Remove link, Cancel and Apply and wraps Tab at both ends", () => {
  const { element, editor } = mount('<p>lead <a href="/one">one</a> tail</p>');

  caretIn(editor, element.querySelector("a").firstChild, 1);
  editor.openLinkDialog();

  const form = dialog();
  const order = Array.from(form.querySelectorAll("input, .richclay-dialog-actions button")).map(
    node => (node.tagName === "INPUT" ? "url" : node.textContent.trim())
  );
  assert.deepEqual(order, ["url", "Remove link", "Cancel", "Apply"]);

  const first = form.querySelector("input");
  const last = form.querySelector(".richclay-dialog-actions button:last-child");
  assert.equal(document.activeElement, first);

  first.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true, cancelable: true }));
  assert.equal(document.activeElement, last);

  last.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }));
  assert.equal(document.activeElement, first);
});

test("Remove link from a mixed selection removes only the first overlapping link", () => {
  const { element, editor } = mount('<p>lead <a href="/one">one</a> mid <a href="/two">two</a> tail</p>');
  const [one, two] = element.querySelectorAll("a");
  selectBetween(editor, one.previousSibling, 1, two.nextSibling, 2);
  editor.openLinkDialog();
  assert.equal(dialog().querySelector("input").value, "/one");
  dialog().querySelector("[data-richclay-remove-link]").click();
  assert.equal(element.textContent, "lead one mid two tail");
  assert.equal(element.querySelectorAll("a").length, 1);
  assert.equal(element.querySelector("a").getAttribute("href"), "/two");
});

test("an explicit unlink toolbar removes a real anchor and keeps its text", () => {
  const { element, editor } = mount('<p>lead <a href="/one">one</a> tail</p>', { toolbar: ["unlink"] });
  const anchor = element.querySelector("a");
  selectBetween(editor, anchor.firstChild, 0, anchor.firstChild, 3);
  const unlink = document.querySelector('[data-richclay-control="unlink"]');
  assert.ok(unlink);
  unlink.click();
  assert.equal(element.querySelector("a"), null);
  assert.equal(element.textContent, "lead one tail");
});

// The dialog's submit path runs in the page, where FormData is the window's own
// constructor. Node's FormData cannot wrap a jsdom form, so the window class has to
// be installed for the dispatch and the previous global put back afterwards.
const submitForm = (form, url) => {
  form.querySelector("input").value = url;
  const previous = globalThis.FormData;
  globalThis.FormData = window.FormData;
  try {
    form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
  } finally {
    globalThis.FormData = previous;
  }
};

// Squire delivers its construction-time root replacement to the observer on a
// later task, the same gap a browser has before the user can edit. Without it the
// engine's _ignoreChange flag swallows the first real mutation and the href edit
// produces no input, onChange or undo state.
const settle = () => new Promise(resolve => setTimeout(resolve, 0));

// The editor's own link path once wrapped the whole anchor again, which for mixed
// formatting could drag the following text and the next link inside the new anchor.
// Apply on an existing link now rewrites only its href, so the surrounding text and
// every other link must be byte-identical. Squire's MutationObserver delivers the
// href edit as input on a later tick, so onChange, undo and redo are read after it.
test("Apply on a partly selected formatted link edits only that link", async () => {
  const changes = [];
  const { element, editor } = mount(
    '<p>lead <a href="/one"><b>one</b> first</a> mid <a href="/two">two</a> tail</p>',
    { onChange: html => changes.push(html) }
  );
  await settle();
  const paragraph = element.querySelector("p");
  const [one, two] = element.querySelectorAll("a");
  const bold = element.querySelector("b");
  const originalHtml = element.innerHTML;

  selectBetween(editor, paragraph.firstChild, 1, bold.firstChild, 2);
  editor.openLinkDialog();
  const form = dialog();
  assert.equal(form.querySelector("input").value, "/one");
  assert.equal(form.querySelector(".richclay-dialog-title").textContent, "Edit link");
  submitForm(form, "/changed");

  await new Promise(resolve => setTimeout(resolve, 30));
  const changedHtml =
    '<p>lead <a href="/changed"><b>one</b> first</a> mid <a href="/two">two</a> tail</p>';
  assert.equal(element.innerHTML, changedHtml);
  assert.equal(element.querySelectorAll("a").length, 2);
  assert.equal(element.querySelectorAll("a a").length, 0);
  assert.equal(one.getAttribute("href"), "/changed");
  assert.equal(two.getAttribute("href"), "/two");
  assert.equal(element.querySelector("a"), one);
  assert.equal(element.querySelector("b"), bold);
  assert.equal(changes.at(-1), changedHtml);

  editor.squire.undo();
  assert.equal(element.innerHTML, originalHtml);
  editor.squire.redo();
  assert.equal(element.innerHTML, changedHtml);
});

test("Apply with a caret inside a formatted link edits only that link", async () => {
  const changes = [];
  const { element, editor } = mount(
    '<p>lead <a href="/one"><b>one</b> first</a> mid <a href="/two">two</a> tail</p>',
    { onChange: html => changes.push(html) }
  );
  await settle();
  const [one, two] = element.querySelectorAll("a");
  const bold = element.querySelector("b");
  const originalHtml = element.innerHTML;

  caretIn(editor, bold.firstChild, 1);
  assert.equal(pressed(), "true");
  editor.openLinkDialog();
  const form = dialog();
  assert.equal(form.querySelector("input").value, "/one");
  submitForm(form, "/changed");

  await new Promise(resolve => setTimeout(resolve, 30));
  const changedHtml =
    '<p>lead <a href="/changed"><b>one</b> first</a> mid <a href="/two">two</a> tail</p>';
  assert.equal(element.innerHTML, changedHtml);
  assert.equal(element.querySelector("a"), one);
  assert.equal(element.querySelector("b"), bold);
  assert.equal(one.getAttribute("href"), "/changed");
  assert.equal(two.getAttribute("href"), "/two");
  assert.equal(changes.at(-1), changedHtml);

  editor.squire.undo();
  assert.equal(element.innerHTML, originalHtml);
  editor.squire.redo();
  assert.equal(element.innerHTML, changedHtml);
});

test("Apply on a selection over two links edits only the first link", async () => {
  const changes = [];
  const { element, editor } = mount(
    '<p>lead <a href="/one">one</a> mid <a href="/two">two</a> tail</p>',
    { onChange: html => changes.push(html) }
  );
  await settle();
  const [one, two] = element.querySelectorAll("a");
  const originalHtml = element.innerHTML;

  selectBetween(editor, one.previousSibling, 1, two.nextSibling, 2);
  editor.openLinkDialog();
  const form = dialog();
  assert.equal(form.querySelector("input").value, "/one");
  submitForm(form, "/changed");

  await new Promise(resolve => setTimeout(resolve, 30));
  const changedHtml = '<p>lead <a href="/changed">one</a> mid <a href="/two">two</a> tail</p>';
  assert.equal(element.innerHTML, changedHtml);
  assert.equal(element.querySelector("a"), one);
  assert.equal(one.getAttribute("href"), "/changed");
  assert.equal(two.getAttribute("href"), "/two");
  assert.equal(changes.at(-1), changedHtml);

  editor.squire.undo();
  assert.equal(element.innerHTML, originalHtml);
  editor.squire.redo();
  assert.equal(element.innerHTML, changedHtml);
});

// The sanitizer keeps href="", so an author-drawn link can carry an empty URL. The
// anchor is still an existing link: the form has to offer Remove for it instead of
// reading the empty string as a request to insert one.
test("an empty-href link opens Edit link and Remove keeps its text", () => {
  const { element, editor } = mount('<p>lead <a href="">one</a> tail</p>');
  const anchor = element.querySelector("a");

  caretIn(editor, anchor.firstChild, 1);
  assert.equal(pressed(), "true");
  editor.openLinkDialog();

  const form = dialog();
  assert.equal(form.querySelector(".richclay-dialog-title").textContent, "Edit link");
  assert.equal(form.querySelector("input").value, "");
  const remove = form.querySelector("[data-richclay-remove-link]");
  assert.equal(Boolean(remove), true);

  remove.click();
  assert.equal(element.innerHTML, "<p>lead one tail</p>");
  assert.equal(dialog(), null);
});
