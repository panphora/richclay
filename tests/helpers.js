import { JSDOM } from "jsdom";
import DOMPurify from "../vendor/purify.es.mjs";

export function setupDom(html = "<!doctype html><html><body></body></html>", url = "https://example.test/") {
  const dom = new JSDOM(html, { url, pretendToBeVisual: true });
  const { window } = dom;
  globalThis.window = window;
  globalThis.document = window.document;
  globalThis.Node = window.Node;
  globalThis.CustomEvent = window.CustomEvent;
  globalThis.FormData = window.FormData;
  globalThis.KeyboardEvent = window.KeyboardEvent;
  // Bind the vendored DOMPurify to the jsdom window so tests exercise the
  // exact sanitizer that ships in vendor/, not a separately installed copy.
  globalThis.DOMPurify = DOMPurify(window);
  return dom;
}

// jsdom reports an empty navigator.platform, so shortcut tests have to state which
// platform they mean instead of inheriting whatever the host looks like. Both
// values are stamped because the two engines read different ones: Squire takes its
// modifier prefix from userAgent at module-eval time, richclay from platform, and
// setting only platform put them in different keyboard modes for every test that
// touches a shortcut.
export function setPlatform(win, platform) {
  Object.defineProperty(win.navigator, "platform", { value: platform, configurable: true });
  const mac = platform.startsWith("Mac");
  const os = mac ? "Macintosh; Intel Mac OS X 10_15_7" : "Windows NT 10.0; Win64; x64";
  Object.defineProperty(win.navigator, "userAgent", {
    value: `Mozilla/5.0 (${os}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36`,
    configurable: true
  });
}

export class FakeSquire {
  constructor(root, config = {}) {
    this.root = root;
    this.config = config;
    this.events = new Map();
    this.commands = [];
    this.formats = new Set();
    this.path = "";
    this.focused = false;
    this.selection = root.ownerDocument.createRange();
    this.selection.setStart(root, 0);
    this.selection.collapse(true);
    // Squire exposes its built-in keydown handlers here; richclay repoints the
    // macOS Ctrl delete bindings at them.
    //
    // Squire builds this with Object.create so its defaults live on the
    // prototype; maskSquireCodeShortcut exists specifically to shadow an
    // inherited handler with an own null, which a plain object cannot exercise.
    this._keyHandlers = Object.create({
      Delete() {},
      Backspace() {},
      "Meta-d"() {},
      "Ctrl-d"() {}
    });
    root.setAttribute("contenteditable", "true");
    this.setHTML("");
  }

  addEventListener(type, listener) {
    const listeners = this.events.get(type) || [];
    listeners.push(listener);
    this.events.set(type, listeners);
    return this;
  }

  removeEventListener(type, listener) {
    if (!listener) {
      this.events.delete(type);
      return this;
    }
    this.events.set(
      type,
      (this.events.get(type) || []).filter(candidate => candidate !== listener)
    );
    return this;
  }

  fire(type, detail = {}) {
    (this.events.get(type) || []).forEach(listener => listener({ detail }));
  }

  setKeyHandler(key, fn) {
    this.commands.push(["shortcut", key, fn]);
    return this;
  }

  focus() {
    this.focused = true;
    this.root.focus();
    return this;
  }

  destroy() {}

  getRoot() {
    return this.root;
  }

  getSelection() {
    return this.selection.cloneRange();
  }

  setSelection(range) {
    this.selection = range.cloneRange();
    return this;
  }

  getPath() {
    return this.path;
  }

  getHTML() {
    return this.root.innerHTML;
  }

  setHTML(html) {
    this.root.textContent = "";
    const fragment = this.config.sanitizeToDOMFragment
      ? this.config.sanitizeToDOMFragment(html, this)
      : this.toFragment(html);
    this.root.appendChild(fragment);
    return this;
  }

  insertHTML(html) {
    return this.setHTML(this.getHTML() + html);
  }

  hasFormat(tag) {
    return this.formats.has(tag.toUpperCase());
  }

  bold() {
    this.formats.add("B");
    this.commands.push("bold");
    this.fire("pathChange", { path: this.path });
    return this;
  }

  removeBold() {
    this.formats.delete("B");
    this.commands.push("removeBold");
    this.fire("pathChange", { path: this.path });
    return this;
  }

  italic() {
    this.formats.add("I");
    this.commands.push("italic");
    return this;
  }

  removeItalic() {
    this.formats.delete("I");
    this.commands.push("removeItalic");
    return this;
  }

  underline() {
    this.formats.add("U");
    this.commands.push("underline");
    return this;
  }

  removeUnderline() {
    this.formats.delete("U");
    this.commands.push("removeUnderline");
    return this;
  }

  strikethrough() {
    this.formats.add("S");
    this.commands.push("strikethrough");
    return this;
  }

  removeStrikethrough() {
    this.formats.delete("S");
    this.commands.push("removeStrikethrough");
    return this;
  }

  makeLink(url) {
    this.commands.push(["makeLink", url]);
    this.formats.add("A");
    return this;
  }

  removeLink() {
    this.commands.push("removeLink");
    this.formats.delete("A");
    return this;
  }

  makeUnorderedList() {
    this.commands.push("makeUnorderedList");
    this.path = "UL>LI";
    return this;
  }

  makeOrderedList() {
    this.commands.push("makeOrderedList");
    this.path = "OL>LI";
    return this;
  }

  removeList() {
    this.commands.push("removeList");
    this.path = "P";
    return this;
  }

  increaseQuoteLevel() {
    this.commands.push("increaseQuoteLevel");
    this.path = "BLOCKQUOTE>P";
    return this;
  }

  decreaseQuoteLevel() {
    this.commands.push("decreaseQuoteLevel");
    this.path = "P";
    return this;
  }

  increaseListLevel() {
    this.commands.push("increaseListLevel");
    return this;
  }

  decreaseListLevel() {
    this.commands.push("decreaseListLevel");
    return this;
  }

  undo() {
    this.commands.push("undo");
    return this;
  }

  redo() {
    this.commands.push("redo");
    return this;
  }

  toggleCode() {
    this.commands.push("toggleCode");
    return this;
  }

  changeFormat(add, remove) {
    this.commands.push(["changeFormat", add?.tag || null, remove?.tag || null]);
    if (add?.tag) this.formats.add(add.tag.toUpperCase());
    if (remove?.tag) this.formats.delete(remove.tag.toUpperCase());
    return this;
  }

  removeAllFormatting() {
    this.commands.push("removeAllFormatting");
    return this;
  }

  modifyDocument(fn) {
    this.modifiedDocument = (this.modifiedDocument || 0) + 1;
    fn();
    return this;
  }

  modifyBlocks(fn) {
    const fragment = this.root.ownerDocument.createDocumentFragment();
    while (this.root.firstChild) fragment.appendChild(this.root.firstChild);
    this.root.appendChild(fn(fragment));
    this.commands.push("modifyBlocks");
    return this;
  }

  toFragment(html) {
    const template = this.root.ownerDocument.createElement("template");
    template.innerHTML = html;
    return template.content;
  }
}
