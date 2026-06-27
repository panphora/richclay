import { markChrome } from "./hyperclay.js";

let liveId = 0;

export function createLiveRegion(doc = document) {
  const region = doc.createElement("div");
  region.id = `richclay-live-${++liveId}`;
  region.className = "richclay-sr-only";
  region.setAttribute("aria-live", "polite");
  region.setAttribute("aria-atomic", "true");
  region.setAttribute("data-richclay-live", "");
  markChrome(region);
  doc.body.appendChild(region);
  return region;
}

export function announce(region, message) {
  if (!region || !message) return;
  region.textContent = "";
  region.ownerDocument.defaultView.setTimeout(() => {
    region.textContent = message;
  }, 20);
}

export function preservePointerSelection(event) {
  event.preventDefault();
}

export function cloneRange(range) {
  try {
    return range?.cloneRange?.() || null;
  } catch {
    return null;
  }
}

export function getSquireSelection(squire) {
  try {
    return cloneRange(squire?.getSelection?.());
  } catch {
    return null;
  }
}

export function restoreSquireSelection(squire, range) {
  if (!squire || !range) return false;
  try {
    squire.setSelection(range);
    return true;
  } catch {
    return false;
  }
}

export function setRuntimeAttribute(element, attribute, value, marker) {
  if (!element.hasAttribute(attribute)) {
    element.setAttribute(marker, "true");
  }
  element.setAttribute(attribute, value);
}

export function connectDescription(element, description) {
  const ids = new Set((element.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean));
  ids.add(description.id);
  element.setAttribute("aria-describedby", Array.from(ids).join(" "));
  element.setAttribute("data-richclay-runtime-describedby", description.id);
}
