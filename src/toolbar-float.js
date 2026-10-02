import { Toolbar } from "./toolbar.js";
import { markChrome } from "./hyperclay.js";

export const GAP = 16;
export const GAP_LADDER = [16, 8, 0];
export const VIEWPORT_INSET = 8;
export const PLACEMENT_SLACK = 4;

// Pure placement ladder: above -> below -> side rail -> pinned to viewport top.
// All coords are viewport-relative (the shell is position: fixed). `current`
// gets PLACEMENT_SLACK of hysteresis so the mode doesn't flip-flop at exact
// boundaries.
export function placeToolbar({ anchor, bar, rail, viewport, current = null }) {
  const slack = mode => (current === mode ? PLACEMENT_SLACK : 0);

  if (
    anchor.bottom <= 0 ||
    anchor.top >= viewport.height ||
    anchor.right <= 0 ||
    anchor.left >= viewport.width
  ) {
    return { mode: "hidden", x: 0, y: 0 };
  }

  const clampX = width =>
    Math.max(VIEWPORT_INSET, Math.min(anchor.left, viewport.width - width - VIEWPORT_INSET));

  const aboveY = anchor.top - GAP - bar.height;
  if (aboveY >= VIEWPORT_INSET - slack("above")) {
    return { mode: "above", x: clampX(bar.width), y: aboveY };
  }

  const belowY = anchor.bottom + GAP;
  if (belowY + bar.height <= viewport.height - VIEWPORT_INSET + slack("below")) {
    return { mode: "below", x: clampX(bar.width), y: belowY };
  }

  const rightSpace = viewport.width - anchor.right - VIEWPORT_INSET;
  const leftSpace = anchor.left - VIEWPORT_INSET;
  const sides =
    rightSpace >= leftSpace
      ? [["rail-right", rightSpace], ["rail-left", leftSpace]]
      : [["rail-left", leftSpace], ["rail-right", rightSpace]];

  for (const [mode, space] of sides) {
    for (const gap of GAP_LADDER) {
      if (rail.width + gap > space + slack(mode)) continue;
      const x =
        mode === "rail-right"
          ? Math.min(anchor.right + gap, viewport.width - rail.width - VIEWPORT_INSET)
          : Math.max(anchor.left - gap - rail.width, VIEWPORT_INSET);
      const maxY = Math.min(anchor.bottom, viewport.height - VIEWPORT_INSET) - rail.height;
      const y = Math.max(VIEWPORT_INSET, Math.min(Math.max(anchor.top, VIEWPORT_INSET), maxY));
      return { mode, x, y, gap };
    }
  }

  return { mode: "pinned", x: clampX(bar.width), y: VIEWPORT_INSET };
}

// Where a popover sits beside an anchor rect: below by default, above when only
// above fits, clamped inside the viewport. `arrow` is the anchor's center measured
// from the popover's left edge, kept off the corners, for skins that draw a pointer.
export const POPOVER_GAP = 10;
export const POPOVER_ARROW_INSET = 28;

export function placePopover({ anchor, box, viewport, gap = POPOVER_GAP }) {
  const spaceBelow = viewport.height - VIEWPORT_INSET - anchor.bottom - gap;
  const spaceAbove = anchor.top - gap - VIEWPORT_INSET;
  const side = spaceBelow >= box.height || spaceBelow >= spaceAbove ? "below" : "above";
  const rawY = side === "below" ? anchor.bottom + gap : anchor.top - gap - box.height;
  const y = Math.max(VIEWPORT_INSET, Math.min(rawY, viewport.height - VIEWPORT_INSET - box.height));
  const center = (anchor.left + anchor.right) / 2;
  const x = Math.max(VIEWPORT_INSET, Math.min(center - POPOVER_ARROW_INSET, viewport.width - VIEWPORT_INSET - box.width));
  const arrow = Math.max(14, Math.min(center - x, box.width - 14));
  return { side, x, y, arrow };
}

// The float's placement is inline and !important: a host page's
// `div { display: block !important }` or `* { transform: none !important }` beats a
// plain inline style, and would show a hidden toolbar or pin it to the corner.
export function pin(el, prop, value) {
  el.style.setProperty(prop, value, "important");
}

export class FloatingToolbar {
  constructor(editor, controls) {
    this.editor = editor;
    this.mode = null;
    this.hidden = false;
    this.frame = 0;
    this.bar = { width: 0, height: 0 };
    this.rail = { width: 0, height: 0 };

    const doc = editor.element.ownerDocument;
    this.doc = doc;
    this.win = doc.defaultView || globalThis;

    this.root = doc.createElement("div");
    this.root.className = "richclay-float";
    this.root.setAttribute("data-richclay-float", "");
    this.root.setAttribute("save-remove", "");
    markChrome(this.root);
    doc.body.appendChild(this.root);

    this.toolbar = new Toolbar(editor, controls, { toolbarContainer: this.root });

    this.onScroll = () => this.schedule();
    this.onResize = () => {
      this.measure();
      this.schedule();
    };
    doc.addEventListener("scroll", this.onScroll, { capture: true, passive: true });
    this.win.addEventListener("resize", this.onResize, { passive: true });
    this.win.visualViewport?.addEventListener("resize", this.onResize, { passive: true });
    this.win.visualViewport?.addEventListener("scroll", this.onScroll, { passive: true });
    this.resizeObserver =
      typeof this.win.ResizeObserver === "function"
        ? new this.win.ResizeObserver(() => this.schedule())
        : null;
    this.resizeObserver?.observe(editor.element);

    this.measure();
    this.reposition();
  }

  // Measure both orientations up front so the placement math can evaluate the
  // rail without first switching to it.
  measure() {
    const wasRail = this.root.classList.contains("richclay-float-rail");
    pin(this.root, "visibility", "hidden");
    this.root.classList.remove("richclay-float-rail");
    this.bar = { width: this.root.offsetWidth || 0, height: this.root.offsetHeight || 0 };
    this.root.classList.add("richclay-float-rail");
    this.rail = { width: this.root.offsetWidth || 0, height: this.root.offsetHeight || 0 };
    this.root.classList.toggle("richclay-float-rail", wasRail);
    this.root.style.removeProperty("visibility");
  }

  schedule() {
    if (!this.win.requestAnimationFrame) {
      this.reposition();
      return;
    }
    if (this.frame) return;
    this.frame = this.win.requestAnimationFrame(() => {
      this.frame = 0;
      this.reposition();
    });
  }

  setVisible(visible) {
    this.hidden = !visible;
    this.reposition();
  }

  reposition() {
    if (this.hidden) {
      pin(this.root, "display", "none");
      return;
    }
    const anchor = this.editor.element.getBoundingClientRect();
    const viewport = {
      width: this.win.visualViewport?.width ?? this.win.innerWidth,
      height: this.win.visualViewport?.height ?? this.win.innerHeight
    };
    const placement = placeToolbar({
      anchor,
      bar: this.bar,
      rail: this.rail,
      viewport,
      current: this.mode
    });
    this.mode = placement.mode;

    if (placement.mode === "hidden") {
      pin(this.root, "display", "none");
      return;
    }
    this.root.style.removeProperty("display");
    this.root.classList.toggle(
      "richclay-float-rail",
      placement.mode === "rail-left" || placement.mode === "rail-right"
    );
    this.root.classList.toggle("richclay-float-pinned", placement.mode === "pinned");
    pin(this.root, "transform", `translate(${Math.round(placement.x)}px, ${Math.round(placement.y)}px)`);
  }

  destroy() {
    if (this.frame) this.win.cancelAnimationFrame?.(this.frame);
    this.frame = 0;
    this.doc.removeEventListener("scroll", this.onScroll, { capture: true });
    this.win.removeEventListener("resize", this.onResize);
    this.win.visualViewport?.removeEventListener("resize", this.onResize);
    this.win.visualViewport?.removeEventListener("scroll", this.onScroll);
    this.resizeObserver?.disconnect();
    this.toolbar.destroy();
    this.root.remove();
  }
}
