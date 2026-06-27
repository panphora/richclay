export const RICHCLAY_SELECTOR = "[data-richclay], [richclay]";
export const CHROME_SELECTOR =
  "[data-richclay-toolbar], [data-richclay-menu], [data-richclay-dialog], [data-richclay-live]";

const runtimeClasses = [
  "richclay-editor",
  "richclay-active",
  "richclay-empty",
  "richclay-focused"
];

const installedWindows = new WeakSet();

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
    if (region.hasAttribute("contenteditable")) {
      const originalValue = region.getAttribute("contenteditable");
      region.setAttribute("inert-contenteditable", originalValue);
      region.removeAttribute("contenteditable");
    }

    runtimeClasses.forEach(className => region.classList.remove(className));
    if (region.getAttribute("class") === "") region.removeAttribute("class");

    removeRuntimeAttribute(region, "role", "data-richclay-runtime-role");
    removeRuntimeAttribute(region, "aria-multiline", "data-richclay-runtime-aria-multiline");
    removeRuntimeAttribute(region, "no-undo", "data-richclay-runtime-no-undo");
    removeRuntimeDescribedBy(region);

    region.removeAttribute("data-richclay-active");
    region.removeAttribute("data-richclay-placeholder");
    region.removeAttribute("data-richclay-runtime-role");
    region.removeAttribute("data-richclay-runtime-aria-multiline");
    region.removeAttribute("data-richclay-runtime-no-undo");
    region.removeAttribute("data-richclay-runtime-describedby");
    region.removeAttribute("data-richclay-runtime-contenteditable");
    region.querySelectorAll("#squire-selection-start, #squire-selection-end").forEach(node => {
      node.remove();
    });
    region.querySelectorAll(".squire-image-resize-container").forEach(node => node.remove());
    stripZeroWidthArtifacts(region);
  });
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
    if (el.children.length === 0 && (el.textContent || "") === "") el.remove();
  });
}

export function consumeInertContenteditable(element) {
  if (!element.hasAttribute("inert-contenteditable")) return null;

  let value = element.getAttribute("inert-contenteditable");
  if (!["false", "plaintext-only"].includes(value)) value = "true";
  element.setAttribute("contenteditable", value);
  element.removeAttribute("inert-contenteditable");
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
