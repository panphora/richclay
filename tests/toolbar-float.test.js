import test from "node:test";
import assert from "node:assert/strict";
import { placeToolbar } from "../src/toolbar-float.js";

const viewport = { width: 1000, height: 800 };
const bar = { width: 400, height: 40 };
const rail = { width: 40, height: 300 };

const anchor = (top, bottom, left = 100, right = 700) => ({ top, bottom, left, right });

test("prefers above with a 16px gap when it fits", () => {
  const placement = placeToolbar({ anchor: anchor(200, 600), bar, rail, viewport });
  assert.equal(placement.mode, "above");
  assert.equal(placement.y, 200 - 16 - 40);
  assert.equal(placement.x, 100);
});

test("flips below when the space above is scrolled out of view", () => {
  const placement = placeToolbar({ anchor: anchor(30, 600), bar, rail, viewport });
  assert.equal(placement.mode, "below");
  assert.equal(placement.y, 600 + 16);
});

test("falls back to a side rail when the element spans the viewport", () => {
  const placement = placeToolbar({ anchor: anchor(-100, 900), bar, rail, viewport });
  assert.equal(placement.mode, "rail-right");
  assert.equal(placement.gap, 16);
  assert.equal(placement.x, 700 + 16);
  assert.equal(placement.y, 8);
});

test("rail picks the wider margin and shrinks the gap to fit", () => {
  // right margin is 45px: gap 16 (56) and 8 (48) overflow, 0 (40) fits
  const placement = placeToolbar({
    anchor: anchor(-100, 900, 8, 447),
    bar,
    rail,
    viewport: { width: 500, height: 800 }
  });
  assert.equal(placement.mode, "rail-right");
  assert.equal(placement.gap, 0);
});

test("rail follows the viewport within the element's visible span", () => {
  // element scrolled far past the top and running past the bottom: the rail
  // sticks to the viewport top instead of following the element's top edge
  const placement = placeToolbar({ anchor: anchor(-2000, 900), bar, rail, viewport });
  assert.equal(placement.mode.startsWith("rail"), true);
  assert.equal(placement.y, 8);
});

test("pins to the viewport top when no margin fits even at 0 gap", () => {
  const placement = placeToolbar({
    anchor: anchor(-100, 900, 10, 490),
    bar,
    rail,
    viewport: { width: 500, height: 800 }
  });
  assert.equal(placement.mode, "pinned");
  assert.equal(placement.y, 8);
});

test("hides when the element is fully outside the viewport", () => {
  assert.equal(placeToolbar({ anchor: anchor(-500, -10), bar, rail, viewport }).mode, "hidden");
  assert.equal(placeToolbar({ anchor: anchor(900, 1200), bar, rail, viewport }).mode, "hidden");
});

test("hysteresis keeps the current mode within the slack band", () => {
  // aboveY = 62 - 56 = 6, which is below the 8px inset but within 4px slack
  const borderline = anchor(62, 600);
  assert.equal(placeToolbar({ anchor: borderline, bar, rail, viewport, current: "above" }).mode, "above");
  assert.equal(placeToolbar({ anchor: borderline, bar, rail, viewport, current: null }).mode, "below");
});

test("clamps x to the viewport for wide toolbars", () => {
  const placement = placeToolbar({ anchor: anchor(200, 600, 800, 950), bar, rail, viewport });
  assert.equal(placement.mode, "above");
  assert.equal(placement.x, 1000 - 400 - 8);
});
