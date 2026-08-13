import { ejectsBlocks, flattenBlocks } from "./normalize.js";

export const RICHCLAY_SELECTOR = "[data-richclay], [richclay], [editable]";
export const CHROME_SELECTOR =
  "[data-richclay-toolbar], [data-richclay-menu], [data-richclay-dialog], [data-richclay-live], [data-richclay-float]";

const runtimeClasses = [
  "richclay-editor",
  "richclay-inline",
  "richclay-active",
  "richclay-empty",
  "richclay-focused"
];

const installedWindows = new WeakSet();

// richclay's stylesheet carries save-remove, so no rule in richclay.css reaches
// the saved file. A <pre> has `white-space: pre` and never wraps, so without
// containment one long line runs off the side of the published page. These four
// declarations are the only ones that have to outlive edit mode, so they ride the
// markup instead of the stylesheet.
const PRE_CONTAINMENT = {
  boxSizing: "border-box",
  minWidth: "100%",
  overflow: "auto",
  width: "0"
};

export function shouldUseHyperclay(options = {}, win = window) {
  if (options.hyperclay === false) return false;
  if (options.hyperclay === true) return true;
  return Boolean(win.hyperclay || hasEditmodeSignal(win));
}

export function isHyperclayEditMode(win = window) {
  const fromQuery = readEditmodeParam(win);
  if (fromQuery !== null) return fromQuery;

  if (typeof win.__hyperclayEditMode === "boolean") {
    return win.__hyperclayEditMode;
  }

  if (typeof win.hyperclay?.isEditMode === "boolean") {
    return win.hyperclay.isEditMode;
  }

  return readEditmodeCookie(win);
}

export function shouldActivateEditor(options = {}, win = window) {
  if (options.readOnly) return false;
  if (!shouldUseHyperclay(options, win)) return true;
  return isHyperclayEditMode(win);
}

// The editable attribute's value is a space-separated token list, like class.
// Unknown tokens are ignored for forward compatibility.
export function parseEditableOptions(element) {
  if (!element.hasAttribute("editable")) return null;
  const tokens = new Set(
    (element.getAttribute("editable") || "").trim().split(/\s+/).filter(Boolean)
  );
  const options = {
    inline: true,
    singleLine: tokens.has("single-line"),
    toolbarOnSelect: tokens.has("toolbar-on-select")
  };
  if (tokens.has("no-toolbar")) options.toolbar = false;
  return options;
}

export function installHyperclayBridge(win = window) {
  if (installedWindows.has(win)) return;
  const beforeSave = win.hyperclay?.beforeSave;
  if (typeof beforeSave !== "function") return;

  beforeSave(docElem => stripRichClayFromClone(docElem));
  installedWindows.add(win);
}

export function stripRichClayFromClone(docElem) {
  docElem.querySelectorAll?.(CHROME_SELECTOR).forEach(node => node.remove());

  docElem.querySelectorAll?.(RICHCLAY_SELECTOR).forEach(region => {
    removeRuntimeState(region, "save");
    // The only place this has to be right. Damage happens when markup reaches the
    // file, so a flatten here sits downstream of every Squire route: setHTML,
    // clear formatting, the image resizer, shortcuts, paste, and whatever a future
    // Squire adds. Three rounds of chasing entry points end here.
    //
    // It cannot destroy the author's own blocks, which is what round 3b's version
    // did: a block inside a region with a <p> ancestor cannot have come from their
    // file, because the parser would have ejected it before richclay ever saw it.
    // And it runs on a clone, so it cannot disturb the caret or the undo stack.
    if (needsFlattening(region)) {
      const doc = region.ownerDocument;
      const singleLine = Boolean(region.matches?.('[editable~="single-line"]'));
      flattenBlocks(region, () =>
        singleLine ? doc.createTextNode(" ") : doc.createElement("br")
      );
    }
    if (region.matches?.('[editable~="single-line"]')) unwrapLoneSingleLineBlock(region);
    region.querySelectorAll("#squire-selection-start, #squire-selection-end").forEach(node => {
      node.remove();
    });
    region.querySelectorAll(".squire-image-resize-container").forEach(node => node.remove());
    stripZeroWidthArtifacts(region);
    // The region itself may be the <pre>, and an author's own inline sizing wins:
    // this only supplies what is missing, because richclay's stylesheet is
    // stripped on save and something has to keep a long line from running off the
    // page.
    const codeBlocks = region.matches?.("pre")
      ? [region, ...region.querySelectorAll("pre")]
      : Array.from(region.querySelectorAll("pre"));
    codeBlocks.forEach(pre => {
      Object.entries(PRE_CONTAINMENT).forEach(([property, value]) => {
        if (!pre.style[property]) pre.style[property] = value;
      });
    });
  });
}

// ejectsBlocks is structural. A single-line region is a promise the author made
// instead, and it must not keep a block either.
//
// Structural only, deliberately not keepsTextShape. This hook exists to prevent
// damage, and a block inside a heading or a span is stable: it is not richclay's
// place to delete something a user pasted there on purpose. Keeping blocks out of
// those regions is a UX decision enforced at the toolbar, not a save-time one.
const needsFlattening = region =>
  ejectsBlocks(region) || Boolean(region.matches?.('[editable~="single-line"]'));

// Shared runtime-state removal used by both the save strip (on the cloned
// document) and destroy() (on the live element). The contenteditable marker
// records provenance: "true" means richclay added the attribute; any other
// value is the author's original non-"true" value; no marker with the
// attribute present means the author wrote contenteditable="true" themselves.
export function removeRuntimeState(region, mode) {
  const origin = region.getAttribute("data-richclay-runtime-contenteditable");

  if (region.hasAttribute("contenteditable")) {
    if (origin === "true") {
      region.removeAttribute("contenteditable");
    } else if (origin) {
      if (mode === "destroy") {
        region.setAttribute("contenteditable", origin);
      } else {
        region.setAttribute("inert-contenteditable", origin);
        region.removeAttribute("contenteditable");
      }
    } else if (mode === "save") {
      region.setAttribute("inert-contenteditable", region.getAttribute("contenteditable"));
      region.removeAttribute("contenteditable");
    }
    // destroy with no marker: the author wrote contenteditable; leave it.
  }

  runtimeClasses.forEach(className => region.classList.remove(className));
  if (region.getAttribute("class") === "") region.removeAttribute("class");

  removeRuntimeAttribute(region, "role", "data-richclay-runtime-role");
  removeRuntimeAttribute(region, "aria-multiline", "data-richclay-runtime-aria-multiline");
  removeRuntimeAttribute(region, "no-undo", "data-richclay-runtime-no-undo");
  if (region.getAttribute("data-richclay-runtime-display") === "true") {
    region.style.removeProperty("display");
    if (region.getAttribute("style") === "") region.removeAttribute("style");
  }
  removeRuntimeDescribedBy(region);

  region.removeAttribute("data-richclay-active");
  region.removeAttribute("data-richclay-placeholder");
  region.removeAttribute("data-richclay-runtime-role");
  region.removeAttribute("data-richclay-runtime-aria-multiline");
  region.removeAttribute("data-richclay-runtime-no-undo");
  region.removeAttribute("data-richclay-runtime-describedby");
  region.removeAttribute("data-richclay-runtime-contenteditable");
  region.removeAttribute("data-richclay-runtime-display");
}

function stripZeroWidthArtifacts(region) {
  const zwsp = String.fromCharCode(0x200b);
  const stack = [region];
  while (stack.length) {
    const node = stack.pop();
    node.childNodes.forEach(child => {
      if (child.nodeType === 3) {
        if (child.nodeValue.includes(zwsp)) {
          child.nodeValue = child.nodeValue.split(zwsp).join("");
        }
      } else if (child.nodeType === 1) {
        stack.push(child);
      }
    });
  }
  // Drop inline wrappers Squire left empty once the caret placeholder is gone.
  region.querySelectorAll("b, i, u, s, em, strong, code, sub, sup, span").forEach(el => {
    if (el.children.length === 0 && (el.textContent || "") === "" && el.attributes.length === 0) {
      el.remove();
    }
  });
}

// Safety net for single-line regions: with the fidelity-first attach Squire
// never wraps the content, but if a lone bare <P> wrapper ever appears, the
// saved file must not contain it.
function unwrapLoneSingleLineBlock(region) {
  const meaningful = Array.from(region.childNodes).filter(
    node => node.nodeType !== 3 || (node.nodeValue || "").trim() !== ""
  );
  if (meaningful.length !== 1) return;
  const block = meaningful[0];
  if (block.nodeType !== 1 || block.nodeName !== "P" || block.attributes.length > 0) return;
  while (block.firstChild) region.insertBefore(block.firstChild, block);
  block.remove();
}

export function consumeInertContenteditable(element) {
  if (!element.hasAttribute("inert-contenteditable")) return null;

  let value = element.getAttribute("inert-contenteditable");
  if (!["false", "plaintext-only"].includes(value)) value = "true";
  element.setAttribute("contenteditable", value);
  element.removeAttribute("inert-contenteditable");
  if (value === "true") {
    // Self-heal: a saved inert "true" is redundant with what activation
    // re-adds. Mark it runtime so the next save drops it from the file
    // instead of round-tripping it forever.
    element.setAttribute("data-richclay-runtime-contenteditable", "true");
  }
  return value;
}

export function markChrome(element) {
  // snapshot-remove drops it from every Hyperclay snapshot (save, live-sync, and
  // dirty comparison). no-watch additionally keeps the mutation observer from
  // walking this high-churn subtree at all. Both stay out of the saved file.
  element.setAttribute("snapshot-remove", "");
  element.setAttribute("no-watch", "");
  return element;
}

function readEditmodeParam(win) {
  try {
    const params = new URLSearchParams(win.location?.search || "");
    if (params.get("editmode") === "true") return true;
    if (params.get("editmode") === "false") return false;
  } catch {
    return null;
  }
  return null;
}

function hasEditmodeSignal(win) {
  return readEditmodeParam(win) !== null || typeof win.__hyperclayEditMode === "boolean";
}

function readEditmodeCookie(win) {
  // Hyperclay signals an owner's edit session with the isAdminOfCurrentResource
  // cookie (see hyperclayjs isAdminOfCurrentResource.js); any non-empty value
  // means the logged-in owner is editing. Read it directly so richclay stays
  // standalone and never imports hyperclayjs.
  const cookie = win.document?.cookie || "";
  const match = cookie.match(/(?:^|;\s*)isAdminOfCurrentResource=([^;]*)/);
  return Boolean(match && match[1] !== "");
}

function removeRuntimeAttribute(region, attribute, marker) {
  if (!region.hasAttribute(marker)) return;
  region.removeAttribute(attribute);
}

function removeRuntimeDescribedBy(region) {
  const id = region.getAttribute("data-richclay-runtime-describedby");
  if (!id) return;

  const ids = (region.getAttribute("aria-describedby") || "")
    .split(/\s+/)
    .filter(Boolean)
    .filter(value => value !== id);

  if (ids.length) {
    region.setAttribute("aria-describedby", ids.join(" "));
  } else {
    region.removeAttribute("aria-describedby");
  }
}
