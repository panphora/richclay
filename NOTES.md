# Implementation Notes

These notes cover the non-obvious implementation decisions behind `richclay`. The public usage documentation lives in `README.md`.

## Architecture

- The editor DOM is the document. `getHTML()` reads Squire's current HTML, and inactive/read-only mode reads `element.innerHTML`. There is no separate document model.
- Squire is the editing engine. Formatting, list, quote, link, block, undo, and redo operations go through Squire APIs.
- DOMPurify is the sanitizer. Squire 2.x does not implicitly wire DOMPurify, so richclay passes `sanitizeToDOMFragment` into the Squire config.
- Activation sanitizes the region in place, captures its existing `innerHTML`, constructs Squire on the same element, then restores that HTML through Squire's sanitized `setHTML()`.
- Placeholder state is class-driven instead of `:empty`, because Squire seeds an empty editor with a default block.
- `richclay.js` is generated from `src/browser-global.js`; edit `src/` and run `npm run build` when the global file needs to change.

## Source Map

- `src/richclay.js` - public class, lifecycle, Squire wiring, shortcuts, link dialog, toolbar resolution.
- `src/buttons.js` - built-in button definitions, icons, toolbar presets, shortcut labels.
- `src/toolbar.js` - toolbar DOM, roving tabindex, menu keyboard behavior, separators.
- `src/hyperclay.js` - edit-mode detection, marker selector, beforeSave cleanup, chrome marking.
- `src/sanitize.js` - DOMPurify defaults, HTML/fragment sanitization, URL normalization.
- `src/a11y.js` - live region, selection preservation helpers, runtime ARIA helpers.

## Hyperclay Round-Trip

Hyperclay calls `beforeSave` with a cloned document element before serialization. richclay registers one hook per window and strips only that clone, so the live editor remains active.

The saved region keeps:

- semantic content HTML,
- `data-richclay` or `richclay`,
- author-provided attributes that were not marked as richclay runtime state,
- `inert-contenteditable` when the live editor had `contenteditable`.

The saved region loses:

- toolbar/menu/dialog/live-region DOM,
- `contenteditable`,
- richclay runtime classes,
- runtime-only `role`, `aria-multiline`, `aria-describedby`, and `no-undo`,
- Squire selection/image-resize artifacts.

`snapshot-remove` and `no-watch` are added to generated chrome so Hyperclay ignores high-churn editor UI during snapshots and mutation watching. Those nodes are removed before save.

## Undo Interop

Squire owns the editor undo stack. While active, richclay adds a runtime `no-undo` marker so Hyperclay's optional page-level undo can defer to Squire for that region. The marker is removed during save if richclay added it. An author-provided `no-undo` is preserved.

## Sanitization Boundaries

Ingress is sanitized on hydration, `setHTML()`, and Squire paste/insert paths. The Hyperclay save hook is intentionally structural only; it should not run DOMPurify repeatedly during dirty comparison or live-save snapshotting.

The link dialog has a separate URL guard because `squire.makeLink()` writes an `href` directly. `normalizeUrl()` rejects unsafe schemes and control-character obfuscation, normalizes bare domains to `https://`, and normalizes bare email addresses to `mailto:`.

Client-side sanitization protects the static-page editing flow. If content is sent to a server or rendered in another security context, sanitize again at that boundary.

## Accessibility Details

The toolbar has one tab stop and uses Arrow/Home/End navigation. Menus are rendered as `role="menu"` with `menuitemradio` choices and `aria-checked`. Pointer activation calls `preventDefault()` on `mousedown` so the editor selection does not collapse before a command runs.

Commands save and restore Squire's selection with `getSelection()` and `setSelection()`. After a command, focus returns to the editor unless the command deliberately keeps focus, as the link dialog does.

Runtime ARIA attributes are only removed on destroy/save when richclay marked that it added them. Author-provided `role`, `aria-multiline`, and `aria-describedby` are left intact.

## Verification

`npm test` runs Node `node:test` files against jsdom and a fake Squire seam. The tests cover:

- init, destroy, idempotent construction, and static `init()`,
- `getHTML()` / `setHTML()` sanitization,
- toolbar commands, `aria-pressed`, roving tabindex, disabled controls, separators, and menus,
- custom global and instance buttons,
- live-region announcements and placeholder descriptions,
- Hyperclay beforeSave cleanup, edit-mode gating, inert contenteditable consumption, and rehydration,
- hostile HTML and URL sanitization.

Squire-dependent browser behavior needs real browser verification because jsdom lacks complete `Selection`, `Range`, and `contenteditable` behavior. Use `demo/index.html` for the manual pass: activate editors, format selected text, simulate save, inspect clean HTML, rehydrate, exercise the link dialog, and navigate the toolbar by keyboard.

### Real-browser pass (2026-06-26)

Ran `demo/index.html` against real Squire + DOMPurify (loaded the page, drove the live instances and toolbar). Confirmed working:

- bold/italic toggle, bullet + numbered lists, blockquote, link, and clear all produce correct semantic HTML,
- real toolbar clicks run commands and reflect `aria-pressed`, focus returns to the editor,
- real typing into `contenteditable` and a real Cmd+Z undo,
- `setHTML` and the paste (`insertHTML`) path strip `<script>`/`onerror` with no execution,
- the link dialog normalizes a bare domain to `https://` and applies the anchor,
- the Hyperclay save round-trip strips toolbar/`contenteditable`/`snapshot-remove`/runtime `no-undo`/`aria-multiline` while keeping content, `data-richclay`, and `inert-contenteditable`; rehydrate re-activates,
- placeholder (`richclay-empty`) toggles with content, edit-mode gating, and idempotent `destroy`,
- toolbar roving tabindex (single tab stop, Arrow/Home/End) and the block-style menu (mouse + keyboard).

Found and fixed one a11y bug: arrow keys inside an open toolbar menu bubbled to the toolbar's roving handler and stole focus to a sibling control (e.g. ArrowDown jumped from the menu onto Bold). Root cause was a missing `event.stopPropagation()` in `Toolbar.handleMenuKeydown`. Fixed there; regression test is "menu arrow keys stay in the menu and don't drive toolbar roving" in `tests/toolbar.test.js`.

### Hyperclay Local integration pass (2026-06-26)

Ran richclay inside a real Hyperclay Local app (`LOCAL_APPS/richclay-test/app.html` on `localhost:4321`, hyperclayjs loaded from local source so the unpublished hyper-morph `snapshot-remove` fix is in play). Confirmed against the file on disk:

- richclay activates in a hyperclay edit-mode page (`?editmode=true`); the beforeSave bridge attaches,
- editing + autosave persist to the file, and the saved HTML is clean: toolbar (`snapshot-remove`) stripped, `contenteditable` → `inert-contenteditable`, content kept, no `richclay-*` runtime classes,
- reload rehydrates the editor from `inert-contenteditable`,
- **two-tab live-sync**: edit + save in tab A propagates to tab B via SSE + hyper-morph; tab B's content syncs to match A AND tab B's local richclay toolbar survives the morph (the `snapshot-remove` preservation fix, proven end-to-end).

Gotcha discovered: the `autosave` and `live-sync` modules are NOT in the `smooth-sailing` preset ("everything, without gotchas"). A malleable app that wants either must opt in, e.g. `?preset=smooth-sailing&features=autosave,live-sync`.
