import test from "node:test";
import assert from "node:assert/strict";
import { setupDom, FakeSquire } from "./helpers.js";
import RichClay from "../src/richclay.js";
import {
  stripRichClayFromClone,
  shouldUseHyperclay,
  shouldActivateEditor,
  isHyperclayEditMode,
  consumeInertContenteditable
} from "../src/hyperclay.js";

test("beforeSave stripping removes chrome and runtime state while preserving content and marker", () => {
  setupDom(`
    <!doctype html><html><body>
      <div data-richclay data-richclay-active="true" class="richclay-editor richclay-active" contenteditable="true" role="textbox" data-richclay-runtime-role="true">
        <p>Hello <strong>world</strong></p>
      </div>
      <div data-richclay-toolbar role="toolbar" snapshot-remove>Toolbar</div>
      <div data-richclay-live snapshot-remove>Live</div>
    </body></html>
  `);

  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);

  const editor = clone.querySelector("[data-richclay]");
  assert.equal(editor.hasAttribute("data-richclay"), true);
  assert.equal(editor.hasAttribute("contenteditable"), false);
  assert.equal(editor.getAttribute("inert-contenteditable"), "true");
  assert.equal(editor.classList.contains("richclay-editor"), false);
  assert.equal(editor.hasAttribute("class"), false);
  assert.equal(editor.hasAttribute("role"), false);
  assert.equal(clone.querySelector("[data-richclay-toolbar]"), null);
  assert.match(editor.innerHTML, /<strong>world<\/strong>/);
});

test("save-strip removes zero-width caret artifacts and empties Squire left behind", () => {
  const zwsp = String.fromCharCode(0x200b);
  setupDom(`
    <!doctype html><html><body>
      <div data-richclay data-richclay-active="true" contenteditable="true">
        <p>Hello${zwsp} <strong>world</strong></p>
        <p><em></em>Tail</p>
      </div>
    </body></html>
  `);

  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);

  const editor = clone.querySelector("[data-richclay]");
  assert.equal(editor.textContent.includes(zwsp), false);
  // the empty <em> placeholder wrapper is gone, real content stays
  assert.equal(editor.querySelector("em"), null);
  assert.match(editor.innerHTML, /<strong>world<\/strong>/);
  assert.match(editor.innerHTML, /Tail/);
});

test("rehydration consumes inert-contenteditable in Hyperclay edit mode", () => {
  const callbacks = [];
  setupDom(`
    <!doctype html><html><body>
      <div data-richclay inert-contenteditable="true"><p>Saved</p></div>
    </body></html>
  `, "https://example.test/?editmode=true");
  window.hyperclay = {
    isEditMode: true,
    beforeSave(callback) {
      callbacks.push(callback);
    }
  };

  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: "minimal"
  });

  assert.equal(editor.element.hasAttribute("inert-contenteditable"), false);
  assert.equal(editor.element.getAttribute("contenteditable"), "true");
  assert.equal(callbacks.length, 1);
});

test("Hyperclay view mode leaves content untouched and skips toolbar", () => {
  setupDom(`
    <!doctype html><html><body>
      <div data-richclay><p>Static</p></div>
    </body></html>
  `, "https://example.test/?editmode=false");
  window.hyperclay = {
    isEditMode: false,
    beforeSave() {}
  };

  const element = document.querySelector("[data-richclay]");
  const editor = new RichClay(element, { Squire: FakeSquire });

  assert.equal(editor.active, false);
  assert.equal(element.innerHTML, "<p>Static</p>");
  assert.equal(document.querySelector("[data-richclay-toolbar]"), null);
});

test("active region carries no-undo so Hyperclay page-undo defers to Squire", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>Hi</p></div></body></html>');
  const element = document.querySelector("[data-richclay]");
  new RichClay(element, { Squire: FakeSquire, toolbar: "minimal" });

  assert.equal(element.getAttribute("no-undo"), "");
  assert.equal(element.hasAttribute("data-richclay-runtime-no-undo"), true);

  // no-undo is runtime-only: it must not survive into the saved file.
  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  const saved = clone.querySelector("[data-richclay]");
  assert.equal(saved.hasAttribute("no-undo"), false);
  assert.equal(saved.hasAttribute("data-richclay-runtime-no-undo"), false);
  assert.equal(saved.hasAttribute("data-richclay"), true);
});

test("generated chrome carries snapshot-remove and no-watch", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>Hi</p></div></body></html>');
  new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: "standard"
  });

  const toolbar = document.querySelector("[data-richclay-toolbar]");
  assert.equal(toolbar.hasAttribute("snapshot-remove"), true);
  assert.equal(toolbar.hasAttribute("no-watch"), true);
});

test("author-set no-undo is preserved through save (not treated as runtime)", () => {
  setupDom('<!doctype html><html><body><div data-richclay no-undo><p>Hi</p></div></body></html>');
  const element = document.querySelector("[data-richclay]");
  new RichClay(element, { Squire: FakeSquire, toolbar: "minimal" });

  // We never marked it as runtime, so the strip must leave the author's no-undo.
  assert.equal(element.hasAttribute("data-richclay-runtime-no-undo"), false);
  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  assert.equal(clone.querySelector("[data-richclay]").hasAttribute("no-undo"), true);
});

test("the beforeSave hook registers once even with multiple editors on the page", () => {
  const callbacks = [];
  setupDom(
    '<!doctype html><html><body><div data-richclay><p>1</p></div><div data-richclay><p>2</p></div></body></html>',
    "https://example.test/?editmode=true"
  );
  window.hyperclay = {
    isEditMode: true,
    beforeSave(callback) {
      callbacks.push(callback);
    }
  };

  const editors = RichClay.init(undefined, { Squire: FakeSquire, toolbar: "minimal" });

  assert.equal(editors.length, 2);
  assert.equal(editors.every(editor => editor.active), true);
  assert.equal(callbacks.length, 1);
});

test("a missing window.hyperclay.beforeSave is tolerated (no hook, still activates)", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>x</p></div></body></html>', "https://example.test/?editmode=true");
  window.hyperclay = { isEditMode: true };

  let editor;
  assert.doesNotThrow(() => {
    editor = new RichClay(document.querySelector("[data-richclay]"), { Squire: FakeSquire, toolbar: "minimal" });
  });
  assert.equal(editor.active, true);
});

test("isHyperclayEditMode resolves the edit-mode signal in priority order", () => {
  // URL param wins over an opposing window.hyperclay.isEditMode.
  assert.equal(
    isHyperclayEditMode({ location: { search: "?editmode=false" }, hyperclay: { isEditMode: true }, document: { cookie: "" } }),
    false
  );
  // Then the explicit window flag.
  assert.equal(isHyperclayEditMode({ location: { search: "" }, __hyperclayEditMode: true }), true);
  // Then the platform's isAdminOfCurrentResource cookie, when nothing higher-priority is present.
  assert.equal(isHyperclayEditMode({ location: { search: "" }, document: { cookie: "foo=1; isAdminOfCurrentResource=1" } }), true);
  // A non-owner (cookie absent) stays in view mode.
  assert.equal(isHyperclayEditMode({ location: { search: "" }, document: { cookie: "foo=1" } }), false);
  // An empty cookie value does not count as editing.
  assert.equal(isHyperclayEditMode({ location: { search: "" }, document: { cookie: "isAdminOfCurrentResource=" } }), false);
  // No signal anywhere means view mode.
  assert.equal(isHyperclayEditMode({ location: { search: "" }, document: { cookie: "" } }), false);
});

// A bare namespace object is not a platform. Every clayjs satellite creates
// window.clay for its own bookkeeping, and <div id="clay"> creates one through named
// window access, so treating truthiness as the verdict hands the page to a lifecycle
// that will never arrive: shouldActivateEditor stops returning true for a standalone
// file, and autoInit's gate never opens. What identifies a real core is its lifecycle
// contract, which is why clayjs publishes clay.ready and hyperclayjs now publishes
// hyperclay.ready.
test("a bare namespace object is not a platform, and neither is an element wearing the name", () => {
  const win = extra => ({ location: { search: "" }, document: { cookie: "" }, ...extra });

  assert.equal(shouldUseHyperclay({}, win({ clay: {} })), false);
  assert.equal(shouldUseHyperclay({}, win({ hyperclay: {} })), false);
  // <div id="clay"> reaches window.clay through named access.
  assert.equal(shouldUseHyperclay({}, win({ clay: { nodeType: 1, tagName: "DIV" } })), false);
  // and <div id="hyperclayModules"> is what the loader's module registry would be
  // mistaken for, so the legacy-loader arm rejects anything with a numeric nodeType.
  assert.equal(
    shouldUseHyperclay({}, win({
      __hyperclayNoAutoExport: false,
      hyperclayModules: { nodeType: 1, tagName: "DIV" }
    })),
    false
  );
});

test("a lifecycle contract is a platform, under either client's name", () => {
  const win = extra => ({ location: { search: "" }, document: { cookie: "" }, ...extra });
  const pending = () => new Promise(() => {});

  // Unresolved is the point: the promise exists from the moment the core evaluates,
  // long before it publishes isEditMode or any optional plugin.
  assert.equal(shouldUseHyperclay({}, win({ clay: { ready: pending() } })), true);
  assert.equal(shouldUseHyperclay({}, win({ hyperclay: { ready: pending() } })), true);
  // A published verdict is a lifecycle too, and it is what a core reaches eventually.
  assert.equal(shouldUseHyperclay({}, win({ clay: { isEditMode: true } })), true);
  assert.equal(shouldUseHyperclay({}, win({ hyperclay: { isEditMode: false } })), true);
  // The rollout window: a new richclay bundle against a published hyperclayjs whose
  // loader has no ready yet. export-to-window flipping the flag is the marker.
  assert.equal(
    shouldUseHyperclay({}, win({
      __hyperclayNoAutoExport: false,
      hyperclayModules: {},
      hyperclay: { Mutation: {} }
    })),
    true
  );
});

test("a platform in edit mode still activates the editors", () => {
  const win = {
    location: { search: "" },
    document: { cookie: "" },
    clay: { isEditMode: true, addDocumentTransform() {} }
  };

  assert.equal(shouldUseHyperclay({}, win), true);
  assert.equal(isHyperclayEditMode(win), true);
  assert.equal(shouldActivateEditor({}, win), true);
});

// The activation matrix, every page shape richclay can land on, in one table. Two
// consumers read the same pair of predicates with opposite polarity: a direct
// `new RichClay(...)` treats "no platform" as permission to edit (shouldActivateEditor
// returns true), while autoInit mounts nothing at all unless BOTH shouldUseHyperclay
// and isHyperclayEditMode are true. So a wrong verdict does not merely downgrade a
// page, it can take the owner's editors away entirely, and only a table that carries
// both columns can see that happen.
const PAGE_SHAPES = [
  // [label, win, shouldUse, isEditMode, direct new RichClay(...), autoInit mounts]
  ["bare HTML file, no client",
    {}, false, false, true, false],

  ["clayjs satellite only (window.clay = {})",
    { clay: {} }, false, false, true, false],

  ['<div id="clay"> named window access (element, not object)',
    { clay: { nodeType: 1, tagName: "DIV" } }, false, false, true, false],

  ["clayjs core, EDIT mode",
    { __hyperclayEditMode: true, clay: { isEditMode: true } }, true, true, true, true],

  ["clayjs core, VIEW mode",
    { __hyperclayEditMode: false, clay: { isEditMode: false } }, true, false, false, false],

  ["clayjs core evaluated, isEditMode not published yet, owner cookie present",
    { clay: { ready: "pending" }, cookie: "isAdminOfCurrentResource=1" }, true, true, true, true],

  ["hyperclayjs core evaluated, isEditMode not published yet, owner cookie present",
    { hyperclay: { ready: "pending", Mutation: {} }, cookie: "isAdminOfCurrentResource=1" },
    true, true, true, true],

  ["hyperclayjs VISITOR, richclay force-loaded, core evaluated",
    { hyperclay: { ready: "pending", Mutation: {} } }, true, false, false, false],

  ["rollout window: published hyperclayjs with no ready, owner cookie present",
    { __hyperclayNoAutoExport: false, hyperclayModules: {}, hyperclay: { Mutation: {} }, cookie: "isAdminOfCurrentResource=1" },
    true, true, true, true],

  ["rollout window: published hyperclayjs with no ready, VISITOR",
    { __hyperclayNoAutoExport: false, hyperclayModules: {}, hyperclay: { Mutation: {} } },
    true, false, false, false],

  ["htmlclay / self-saving file that opts in via __hyperclayEditMode = true",
    { __hyperclayEditMode: true }, true, true, true, true],

  ["?editmode=false beats everything",
    { search: "?editmode=false", hyperclay: { isEditMode: true }, cookie: "isAdminOfCurrentResource=1" },
    true, false, false, false],

  ["standalone file served from hyperclay.com while the owner cookie happens to be set",
    { cookie: "isAdminOfCurrentResource=1" }, false, true, true, false]
];

const buildPageShape = ({ search, cookie, ...rest }) => {
  const win = { location: { search: search || "" }, document: { cookie: cookie || "" }, ...rest };
  // A pending promise, spelled in the table as a string so the table stays readable.
  for (const namespace of [win.clay, win.hyperclay]) {
    if (namespace?.ready === "pending") namespace.ready = new Promise(() => {});
  }
  return win;
};

test("every page shape resolves to the intended activation", () => {
  PAGE_SHAPES.forEach(([label, shape, wantUse, wantEditMode, wantDirect, wantAutoInit]) => {
    const win = buildPageShape(shape);
    const use = shouldUseHyperclay({}, win);
    const editMode = isHyperclayEditMode(win);

    assert.equal(use, wantUse, `shouldUseHyperclay: ${label}`);
    assert.equal(editMode, wantEditMode, `isHyperclayEditMode: ${label}`);
    assert.equal(shouldActivateEditor({}, win), wantDirect, `new RichClay(...): ${label}`);
    assert.equal(use && editMode, wantAutoInit, `autoInit mounts: ${label}`);
  });
});

test("an explicit hyperclay option still overrides every page shape", () => {
  const win = buildPageShape({});
  assert.equal(shouldUseHyperclay({ hyperclay: true }, win), true);
  assert.equal(
    shouldUseHyperclay({ hyperclay: false }, buildPageShape({ clay: { isEditMode: true } })),
    false
  );
});

test("isHyperclayEditMode reads win.clay.isEditMode, and a false there outranks the cookie", () => {
  assert.equal(
    isHyperclayEditMode({ location: { search: "" }, clay: { isEditMode: true }, document: { cookie: "" } }),
    true
  );
  assert.equal(
    isHyperclayEditMode({
      location: { search: "" },
      clay: { isEditMode: false },
      document: { cookie: "isAdminOfCurrentResource=1" }
    }),
    false
  );
});

test("the bridge registers its strip through win.clay.addDocumentTransform", () => {
  const callbacks = [];
  setupDom(
    '<!doctype html><html><body><div data-richclay><p>x</p></div></body></html>',
    "https://example.test/?editmode=true"
  );
  window.clay = {
    isEditMode: true,
    addDocumentTransform(callback) {
      callbacks.push(callback);
    }
  };

  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: "minimal"
  });

  assert.equal(editor.active, true);
  assert.equal(callbacks.length, 1);
});

test("hyperclay:false forces standalone activation regardless of view mode", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>x</p></div></body></html>', "https://example.test/?editmode=false");
  window.hyperclay = { isEditMode: false, beforeSave() {} };

  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: "minimal",
    hyperclay: false
  });

  assert.equal(editor.active, true);
  assert.equal(document.querySelector("[data-richclay-toolbar]") !== null, true);
});

test("consumeInertContenteditable restores and normalizes the editable value", () => {
  setupDom();
  const make = value => {
    const element = document.createElement("div");
    if (value !== null) element.setAttribute("inert-contenteditable", value);
    return element;
  };

  const preserved = make("false");
  assert.equal(consumeInertContenteditable(preserved), "false");
  assert.equal(preserved.getAttribute("contenteditable"), "false");
  assert.equal(preserved.hasAttribute("inert-contenteditable"), false);
  assert.equal(preserved.hasAttribute("data-richclay-runtime-contenteditable"), false);

  const plaintext = make("plaintext-only");
  consumeInertContenteditable(plaintext);
  assert.equal(plaintext.getAttribute("contenteditable"), "plaintext-only");

  const coerced = make("garbage");
  consumeInertContenteditable(coerced);
  assert.equal(coerced.getAttribute("contenteditable"), "true");
  assert.equal(coerced.getAttribute("data-richclay-runtime-contenteditable"), "true");

  const none = make(null);
  assert.equal(consumeInertContenteditable(none), null);
  assert.equal(none.hasAttribute("contenteditable"), false);
});

test("full Hyperclay round-trip: edit, save-strip on a clone, rehydrate from the saved markup", () => {
  const captured = [];
  setupDom('<!doctype html><html><body><div data-richclay><p>Start</p></div></body></html>', "https://example.test/?editmode=true");
  window.hyperclay = {
    isEditMode: true,
    beforeSave(callback) {
      captured.push(callback);
    }
  };

  const live = new RichClay(document.querySelector("[data-richclay]"), { Squire: FakeSquire, toolbar: "standard" });
  live.setHTML("<p>Edited <strong>bold</strong></p>");

  // Hyperclay runs beforeSave against a clone of the document element.
  const clone = document.documentElement.cloneNode(true);
  captured[0](clone);

  const saved = clone.querySelector("[data-richclay]");
  assert.equal(saved.hasAttribute("data-richclay"), true);
  assert.equal(saved.hasAttribute("contenteditable"), false);
  assert.equal(saved.hasAttribute("inert-contenteditable"), false);
  assert.equal(saved.hasAttribute("data-richclay-runtime-contenteditable"), false);
  assert.equal(saved.hasAttribute("class"), false);
  assert.equal(clone.querySelector("[data-richclay-toolbar]"), null);
  assert.match(saved.innerHTML, /<strong>bold<\/strong>/);
  // The strip ran on the clone only; the live editor is still editable.
  assert.equal(live.element.hasAttribute("contenteditable"), true);

  // Reload: the saved markup hydrates into a fresh document and re-activates.
  const savedMarkup = saved.outerHTML;
  setupDom(`<!doctype html><html><body>${savedMarkup}</body></html>`, "https://example.test/?editmode=true");
  window.hyperclay = { isEditMode: true, beforeSave() {} };

  const rehydrated = new RichClay(document.querySelector("[data-richclay]"), { Squire: FakeSquire, toolbar: "standard" });
  assert.equal(rehydrated.active, true);
  assert.equal(rehydrated.element.getAttribute("contenteditable"), "true");
  assert.equal(rehydrated.element.hasAttribute("inert-contenteditable"), false);
  assert.match(rehydrated.getHTML(), /<strong>bold<\/strong>/);
  assert.equal(document.querySelector("[data-richclay-toolbar]") !== null, true);
});

test("richclay-added contenteditable is removed on save, and a legacy inert-contenteditable self-heals", () => {
  setupDom('<!doctype html><html><body><div data-richclay inert-contenteditable="true"><p>Old file</p></div></body></html>', "https://example.test/?editmode=true");
  window.hyperclay = { isEditMode: true, beforeSave() {} };
  new RichClay(document.querySelector("[data-richclay]"), { Squire: FakeSquire, toolbar: "minimal" });

  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  const saved = clone.querySelector("[data-richclay]");
  assert.equal(saved.hasAttribute("contenteditable"), false);
  assert.equal(saved.hasAttribute("inert-contenteditable"), false);
  assert.equal(saved.hasAttribute("data-richclay-runtime-contenteditable"), false);
});

test("author inert-contenteditable=false round-trips through activation and save", () => {
  setupDom('<!doctype html><html><body><div data-richclay inert-contenteditable="false"><p>x</p></div></body></html>', "https://example.test/?editmode=true");
  window.hyperclay = { isEditMode: true, beforeSave() {} };
  const editor = new RichClay(document.querySelector("[data-richclay]"), { Squire: FakeSquire, toolbar: "minimal" });
  assert.equal(editor.element.getAttribute("contenteditable"), "true");

  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  assert.equal(clone.querySelector("[data-richclay]").getAttribute("inert-contenteditable"), "false");
  assert.equal(clone.querySelector("[data-richclay]").hasAttribute("contenteditable"), false);
});

test("destroy leaves author-provided contenteditable in place", () => {
  setupDom('<!doctype html><html><body><div data-richclay contenteditable="true"><p>x</p></div></body></html>');
  const element = document.querySelector("[data-richclay]");
  const editor = new RichClay(element, { Squire: FakeSquire, toolbar: "minimal" });
  editor.destroy();
  assert.equal(element.getAttribute("contenteditable"), "true");
});

test("destroy restores the author's original non-true contenteditable value", () => {
  setupDom('<!doctype html><html><body><div data-richclay contenteditable="false"><p>x</p></div></body></html>');
  const element = document.querySelector("[data-richclay]");
  const editor = new RichClay(element, { Squire: FakeSquire, toolbar: "minimal" });
  assert.equal(element.getAttribute("contenteditable"), "true");
  editor.destroy();
  assert.equal(element.getAttribute("contenteditable"), "false");
});

// The premise, measured rather than predicted. Each shape puts MID between AAA and
// ZZZ, saves, and reloads the saved markup: whatever the parser would take apart
// has to be flattened on the way out, and whatever it leaves alone has to survive
// as the author wrote it. Built with DOM APIs so no Squire route is involved.
const measureShapes = [
  ["heading in heading", "<div><h2 editable></h2></div>", "h3", true],
  ["ul in heading", "<div><h2 editable></h2></div>", "ul", false],
  ["span under p", "<p>lead <span editable></span> tail</p>", "div", true],
  ["li in li", "<ul><li editable></li></ul>", "li", true],
  ["div in div", "<div><div editable></div></div>", "div", false],
  ["p in span in div", "<div><span editable></span></div>", "p", false]
];

const buildMeasureShape = (shell, tag) => {
  setupDom(`<!doctype html><html><body>${shell}</body></html>`);
  const region = document.querySelector("[editable]");
  region.setAttribute("data-richclay-active", "true");
  region.appendChild(document.createTextNode("AAA"));
  const mid = document.createElement(tag);
  mid.textContent = "MID";
  region.appendChild(mid);
  region.appendChild(document.createTextNode("ZZZ"));
  return region;
};

const reloadSaved = region => {
  const clone = region.ownerDocument.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  const reloaded = region.ownerDocument.implementation.createHTMLDocument("");
  reloaded.body.innerHTML = clone.querySelector("body").innerHTML;
  return { saved: clone.querySelector("[editable]"), reloaded: reloaded.querySelector("[editable]") };
};

test("the save hook measures each shape against the parser instead of predicting it", () => {
  measureShapes.forEach(([label, shell, tag, flattens]) => {
    const region = buildMeasureShape(shell, tag);
    const { saved, reloaded } = reloadSaved(region);

    assert.equal(saved.querySelectorAll(tag).length, flattens ? 0 : 1, label);
    assert.equal(reloaded.textContent, "AAAMIDZZZ", label);
  });
});

// The block ancestor is what reparses, not the region, so depth is irrelevant:
// three inline wrappers down, the <p> still takes the block apart.
test("a block below a <p> at depth 3 is still flattened", () => {
  setupDom(
    '<!doctype html><html><body><p>lead <em><b><span editable data-richclay-active="true">Hello</span></b></em> tail</p></body></html>'
  );
  const region = document.querySelector("[editable]");
  const block = document.createElement("div");
  block.textContent = "X";
  region.appendChild(block);

  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  assert.equal(clone.querySelector("[editable]").innerHTML, "HelloX");
});

// The reparse is the expensive half, so a region with nothing to flatten must not
// pay for it. The measurement stamps the region to find itself again, which is the
// one observable it cannot do without.
test("a region with no block descendant never reaches the reparse", () => {
  setupDom(
    '<!doctype html><html><body><p>lead <span editable data-richclay-active="true">Hello <b>world</b></span> tail</p></body></html>'
  );
  const clone = document.documentElement.cloneNode(true);
  const region = clone.querySelector("[editable]");
  const measured = [];
  const setAttribute = region.setAttribute.bind(region);
  region.setAttribute = (name, value) => {
    measured.push(name);
    setAttribute(name, value);
  };

  stripRichClayFromClone(clone);
  assert.equal(measured.includes("data-richclay-measure"), false);
});

// A promise the author made, not one the parser enforces: a single-line region
// keeps no block even when the block would reparse exactly where it is.
test("a single-line region is flattened even when nothing would eject the block", () => {
  setupDom(
    '<!doctype html><html><body><div><span editable="single-line" data-richclay-active="true">Hello</span></div></body></html>'
  );
  const region = document.querySelector("[editable]");
  const block = document.createElement("div");
  block.textContent = "X";
  region.appendChild(block);

  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  assert.equal(clone.querySelector("[editable]").innerHTML, "HelloX");
});

// The save hook is the one place this has to be right: it sits downstream of every
// Squire route, so whatever leaked into a region a <p> ejects blocks from is
// flattened before the markup reaches the file. Built with appendChild so the test
// depends on no Squire route at all.
test("the save strip flattens a block that leaked into a region under a <p>", () => {
  setupDom(
    '<!doctype html><html><body><p>Lead <span editable data-richclay-active="true">Hello world</span> tail</p></body></html>'
  );
  const region = document.querySelector("[editable]");
  const block = document.createElement("div");
  block.textContent = "X";
  region.appendChild(block);

  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);

  const saved = clone.querySelector("[editable]");
  assert.equal(saved.querySelectorAll("div").length, 0);
  assert.equal(saved.innerHTML, "Hello worldX");
});

// The author's own block, in a region nothing rearranges. Round 3b's whole-root
// flatten destroyed exactly this.
test("the save strip leaves a block alone in a region nothing ejects", () => {
  setupDom(
    '<!doctype html><html><body><div><span editable data-richclay-active="true">Hello world</span></div></body></html>'
  );
  const region = document.querySelector("[editable]");
  const block = document.createElement("div");
  block.textContent = "X";
  region.appendChild(block);

  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);

  assert.equal(clone.querySelector("[editable]").innerHTML, "Hello world<div>X</div>");
});

// A <div> inside a heading reparses exactly where it was put, so the measurement
// comes back clean. Keeping blocks out of a heading is a UX decision the toolbar
// enforces; deleting one a user pasted on purpose would be the hook destroying
// content.
test("the save strip leaves a block alone inside an <h2 editable>", () => {
  setupDom(
    '<!doctype html><html><body><div><h2 editable data-richclay-active="true">Hello world</h2></div></body></html>'
  );
  const region = document.querySelector("[editable]");
  const block = document.createElement("div");
  block.textContent = "X";
  region.appendChild(block);

  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);

  assert.equal(clone.querySelector("[editable]").innerHTML, "Hello world<div>X</div>");
});

// An <a> inside an <a> is the same implicitly-closes family as heading in heading,
// and the parser empties the region on reload. It reaches the measurement through
// selfNests rather than hasBlockDescendant, because a nested <a> has no block in
// it, and the unwrap pass repairs what flattenBlocks cannot.
test("the save strip repairs an <a> nested in an <a editable>", () => {
  const region = buildMeasureShape('<div><a href="/one" editable></a></div>', "a");
  const { saved, reloaded } = reloadSaved(region);

  assert.equal(saved.querySelectorAll("a").length, 0);
  assert.equal(saved.innerHTML, "AAAMIDZZZ");
  assert.equal(reloaded.textContent, "AAAMIDZZZ");
});

// The same shape one level down, which is how a paste actually delivers it: the
// nested <a> is not a child of the region but a grandchild, so the unwrap has to
// find it by query rather than by walking the region's own children.
test("the save strip repairs a nested <a> below the region's own children", () => {
  setupDom(
    '<!doctype html><html><body><div><a href="/one" editable data-richclay-active="true">Lead </a></div></body></html>'
  );
  const region = document.querySelector("[editable]");
  const wrapper = document.createElement("b");
  const nested = document.createElement("a");
  nested.setAttribute("href", "/two");
  nested.textContent = "inner";
  wrapper.appendChild(nested);
  region.appendChild(wrapper);
  region.appendChild(document.createTextNode(" tail"));

  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);

  const saved = clone.querySelector("[editable]");
  assert.equal(saved.querySelectorAll("a").length, 0);
  assert.equal(saved.innerHTML, "Lead <b>inner</b> tail");

  const reloaded = document.implementation.createHTMLDocument("");
  reloaded.body.innerHTML = saved.outerHTML;
  assert.equal(reloaded.querySelector("[editable]").textContent, "Lead inner tail");
});

// The unwrap must not fire on a region whose own tag appears in it harmlessly: a
// <div> in a <div editable> reparses exactly where it is, so the measurement comes
// back clean and nothing is touched.
test("a region's own tag nested harmlessly inside it is left alone", () => {
  const region = buildMeasureShape("<div><div editable></div></div>", "div");
  const { saved } = reloadSaved(region);
  assert.equal(saved.innerHTML, "AAA<div>MID</div>ZZZ");
});

// richclay only cleans up after itself. A root it refused, or one it never
// activated, is the author's markup and comes through the save byte for byte, on
// the first save and on every save after it.
test("a region richclay never took ownership of is byte-identical through two saves", () => {
  [
    "<table editable><thead><tr><th>One</th></tr></thead><tbody><tr><td>Two</td></tr></tbody></table>",
    '<svg editable viewBox="0 0 8 8"><text>Label</text></svg>',
    "<textarea editable>plain</textarea>",
    "<template editable><p>Hidden</p></template>",
    "<div editable><p>Never activated</p></div>",
    // the author's own contenteditable, which removeRuntimeState would otherwise
    // convert to inert-contenteditable on a region richclay never mounted
    '<div editable contenteditable="false"><p>Theirs</p></div>',
    // and their own empty inline wrapper, which the caret-artifact sweep deletes
    "<div editable><p>Hi <em></em></p></div>"
  ].forEach(markup => {
    setupDom(`<!doctype html><html><body>${markup}</body></html>`);
    const before = document.querySelector("[editable]").outerHTML;

    let source = document.body.innerHTML;
    for (let pass = 0; pass < 2; pass += 1) {
      const clone = document.documentElement.cloneNode(true);
      stripRichClayFromClone(clone);
      assert.equal(clone.querySelector("[editable]").outerHTML, before, `${markup} pass ${pass}`);
      setupDom(`<!doctype html><html><body>${source}</body></html>`);
      source = document.body.innerHTML;
    }
  });
});

// The marker check must not turn the hook off for the regions it is meant to
// clean: a mounted region still loses every runtime attribute it was given.
test("a mounted region is still stripped, so the marker check did not disable the hook", () => {
  setupDom('<!doctype html><html><body><div editable><p>Hi</p></div></body></html>');
  const element = document.querySelector("[editable]");
  new RichClay(element, { Squire: FakeSquire });
  assert.equal(element.getAttribute("data-richclay-active"), "true");

  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  const saved = clone.querySelector("[editable]");
  assert.equal(saved.hasAttribute("data-richclay-active"), false);
  assert.equal(saved.hasAttribute("contenteditable"), false);
  assert.equal(saved.hasAttribute("class"), false);
  assert.equal(saved.innerHTML, "<p>Hi</p>");
});

// Squire leaves its bookmarks wherever the command was operating, which the split
// cases put above the region, so the per-region sweep never saw them and two
// <input type="hidden"> elements reached the author's file.
test("a selection bookmark left outside a region is removed on save", () => {
  setupDom(
    '<!doctype html><html><body><div><input id="squire-selection-start" type="hidden">' +
      '<span editable data-richclay-active="true">Hi</span>' +
      '<input id="squire-selection-end" type="hidden"></div></body></html>'
  );
  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  assert.equal(clone.querySelectorAll("#squire-selection-start, #squire-selection-end").length, 0);
});

// A block inside an inline element renders as a run-on, so the box is changed for
// the edit session only. Whether the region survives a reload is decided by the
// parser before any CSS exists, so nothing about this reaches the file.
test("an inline region gets a runtime display that the save strip removes", () => {
  setupDom('<!doctype html><html><body><div><span editable>Hello</span></div></body></html>');
  const element = document.querySelector("[editable]");
  new RichClay(element, { Squire: FakeSquire });

  assert.equal(element.style.display, "inline-block");
  assert.equal(element.getAttribute("data-richclay-runtime-display"), "true");

  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);

  const saved = clone.querySelector("[editable]");
  assert.equal(saved.hasAttribute("style"), false);
  assert.equal(saved.hasAttribute("data-richclay-runtime-display"), false);
});

test("an author's own display on an inline region is never touched", () => {
  setupDom(
    '<!doctype html><html><body><div><span editable style="display: flex">Hello</span></div></body></html>'
  );
  const element = document.querySelector("[editable]");
  new RichClay(element, { Squire: FakeSquire });

  assert.equal(element.style.display, "flex");
  assert.equal(element.hasAttribute("data-richclay-runtime-display"), false);

  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  assert.equal(clone.querySelector("[editable]").style.display, "flex");
});

// richclay's stylesheet carries save-remove, so the containment a <pre> richclay
// created needs, to stop a long line running off the published page, has to ride
// the markup. The author's own <pre> is theirs and gets nothing.
test("save-strip contains the <pre> richclay created and leaves the author's alone", () => {
  setupDom(
    '<!doctype html><html><body><div data-richclay data-richclay-active="true" contenteditable="true"><pre data-richclay-pre>one</pre><p>x</p><pre>two</pre></div></body></html>'
  );
  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);

  const [made, authored] = clone.querySelectorAll("pre");
  assert.equal(made.style.boxSizing, "border-box");
  assert.equal(made.style.minWidth, "100%");
  assert.equal(made.style.overflow, "auto");
  assert.equal(made.style.width, "0px");
  // the marker is richclay's own bookkeeping and never reaches the file
  assert.equal(made.hasAttribute("data-richclay-pre"), false);
  assert.equal(authored.hasAttribute("style"), false);
  // the strip ran on the clone, so the live DOM is untouched
  assert.equal(document.querySelector("pre").hasAttribute("style"), false);
});

// Four inline styles including width: 0 written into an author's file for merely
// opening it is the byte-identical-on-open invariant broken, so a <pre> the author
// wrote is left exactly as written, region or not.
test("an author's own <pre> is byte-identical through a save, as a region or inside one", () => {
  const markup =
    '<pre editable data-richclay-active="true" contenteditable="true">code</pre>' +
    '<div data-richclay data-richclay-active="true" contenteditable="true"><pre>two</pre></div>';
  setupDom(`<!doctype html><html><body>${markup}</body></html>`);
  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);

  assert.equal(clone.querySelector("pre[editable]").hasAttribute("style"), false);
  assert.equal(clone.querySelector("[data-richclay] pre").hasAttribute("style"), false);
});

// Only what is missing is supplied, so sizing already on the element wins.
test("save-strip never overwrites sizing already on a contained <pre>", () => {
  setupDom(
    '<!doctype html><html><body><div data-richclay data-richclay-active="true" contenteditable="true"><pre data-richclay-pre style="width: 50%">two</pre></div></body></html>'
  );
  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);

  const pre = clone.querySelector("pre");
  assert.equal(pre.style.width, "50%");
  assert.equal(pre.style.boxSizing, "border-box");
});

test("save-strip keeps empty inline wrappers that carry attributes", () => {
  setupDom('<!doctype html><html><body><div data-richclay data-richclay-active="true" contenteditable="true"><p><span class="icon"></span>Text<em></em></p></div></body></html>');
  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  const editor = clone.querySelector("[data-richclay]");
  assert.equal(editor.querySelector("span.icon") !== null, true);
  assert.equal(editor.querySelector("em"), null);
});
