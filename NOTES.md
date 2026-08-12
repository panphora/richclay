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
- `inert-contenteditable` only when the author provided `contenteditable`. richclay-added `contenteditable` is removed outright, and a legacy saved `inert-contenteditable="true"` self-heals: consumption marks it runtime, so the next save drops it.

The saved region loses:

- toolbar/menu/dialog/live-region DOM,
- `contenteditable`,
- richclay runtime classes,
- runtime-only `role`, `aria-multiline`, `aria-describedby`, and `no-undo`,
- Squire selection/image-resize artifacts.

`snapshot-remove` and `no-watch` are added to generated chrome so Hyperclay ignores high-churn editor UI during snapshots and mutation watching. Those nodes are removed before save.

## Keyboard Shortcuts

`Mod` resolves to one binding, not two: `Meta-` on Apple platforms and `Ctrl-` elsewhere, matching Squire's own `ctrlKey`. Binding both swallowed the macOS Emacs bindings that work in every other text field — Ctrl+D ran the code command and wrapped the block in `<pre>`, Ctrl+K opened the link dialog instead of killing to end of line. `shortcutKey()` also assembles modifiers in Squire's canonical `Alt-Ctrl-Meta-Shift-` order, since that is the string `_onKey` looks up.

On Apple platforms, `Ctrl-d` and `Ctrl-h` are pointed at Squire's own `Delete` and `Backspace` handlers (`installAppleDeleteKeys`). Left native, Chrome merges two blocks by wrapping the moved text in a computed-style `<span>`, which is permanent markup in a DOM-is-the-document editor. Author-declared `Ctrl+` shortcuts still win, because `installShortcuts` runs after.

## Undo Interop

Squire owns the editor undo stack. While active, richclay adds a runtime `no-undo` marker so Hyperclay's optional page-level undo can defer to Squire for that region. The marker is removed during save if richclay added it. An author-provided `no-undo` is preserved.

## Inline Mode (`editable`)

- `editable` value tokens parse in `parseEditableOptions` (src/hyperclay.js). The constructor derives options from the attribute; explicit constructor options win over tokens.
- Fidelity-first attach: Squire's constructor wipes the root with `setHTML("")`, so inline activation re-appends the captured child *nodes* instead of calling `setHTML()`. That skips the sanitize pass and block re-wrapping that would rewrite author markup on mere activation, and keeping the nodes (rather than an `innerHTML` string) means activation cannot lose node identity or live form state. Consequence to verify in real browsers: Squire records its first undo state lazily on the first edit, so undo-to-initial must restore the original content, not the empty constructor state.
- Root invariant: skipping `setHTML()` skips the one piece of normalization Squire genuinely depends on, so `normalizeEditorRoot` (src/normalize.js) supplies it. See "Inline Root Normalization" below.
- Single-line is imposed at the edges, since Squire has no single-line mode: `setKeyHandler` no-ops for Enter and Shift-Enter, a capture-phase document `beforeinput` listener cancels `insertParagraph`/`insertLineBreak` (IME and mobile paths that bypass keydown), the sanitize hook flattens pasted blocks, and the save strip unwraps a lone bare `<P>` as a safety net.
- The floating toolbar is focus-scoped: created on editor focus, destroyed on blur, with a focus-target check so moving into the toolbar or link dialog keeps it alive. At most one floating toolbar exists at a time, and idle pages carry no toolbar DOM.
- Placement is a pure function (`placeToolbar` in src/toolbar-float.js): above with a 16px gap, then below, then a side rail (gap ladder 16/8/0, wider margin first, following the viewport within the element's visible span), then pinned to the viewport top; hidden when the element leaves the viewport entirely. `PLACEMENT_SLACK` gives the current mode 4px of hysteresis against flip-flapping. The shell is `position: fixed` and body-mounted: fixed elements cannot create scrollbars, and body mounting dodges transformed ancestors that would silently re-anchor `fixed`.
- Inline ingress sanitize extends the card allowlist with `class`, `id`, `data-*`, and `img[src alt width height]` (`inlineSanitizeConfig` in src/sanitize.js); scripts, `on*` handlers, and `javascript:` URLs stay stripped.
- Known limitation: placement math uses the layout viewport (getBoundingClientRect and position: fixed coordinate space). Under pinch-zoom, `visualViewport.offsetTop/offsetLeft` are not compensated, so the toolbar can sit outside the visible region until zoom resets. Revisit if mobile editing becomes a priority.

## Inline Root Normalization

Squire assumes a container's children are all block-level. `fixContainer()` enforces that by gathering any run of inline children into a fresh `<div>` and giving that `<div>` a `<br>`, and it runs from `Backspace`, `Delete`, `cleanupBRs`, and `mergeContainers`. So on a normally indented source file, where the root's children are `"\n  ", <p>, "\n  ", <p>, …`, the first Backspace converts every indentation text node into a **visible blank line**, and every later Enter clones the whitespace into another block. Bare inline content on the root has a second failure mode: `getStartBlockOfRange()` returns null for a caret parked there, and `Delete`, `Backspace`, and `splitBlock` all early-return, so commands silently stop working.

`normalizeEditorRoot(root, blockTag)` (src/normalize.js) supplies exactly that invariant and nothing else:

- whitespace-only text nodes are dropped **only** where they sit between block-level siblings, which is where they render as nothing. Inside a block (`<p>a <b>b</b></p>`) and anywhere white-space is preserved, they are content and are kept.
- runs of stray inline content on a root that already mixes blocks with inline nodes are wrapped in one `blockTag` element. That is the case the browser already renders as an anonymous block. A comments-only run is left alone rather than turned into a blank paragraph.
- a wholly inline root is left byte-identical in a single-line region, which has no block structure by design. In a multi-line one it gets a single bare `<div>` wrapper, because Squire's Enter, Delete, and Backspace all early-return when the caret's block is the root itself. `<div>` rather than `blockTag` so the page keeps the look the author gave it: a `<p>` would add margins to a region that had none. `onBareRootWrapped` fires when this happens and richclay logs a console warning, so an author who would rather write their own wrapper knows to.

### When it runs

**Not at activation.** Merely opening a page in edit mode has to leave it byte-identical: a Hyperclay page with autosave on would otherwise write itself to disk for being looked at, and on live-synced `LOCAL_APPS` that is a write to production for doing nothing.

`installRootGuards()` instead listens on the document, in the capture phase, for `beforeinput`, `keydown`, `cut`, `paste`, and `drop`, so `ensureRootIsEditable()` has repaired the root before Squire's own handlers see the first edit. History input types are skipped, since repairing mid-undo would fight the stack being replayed. `runControl` calls it too, because Squire's `removeCode()` splices an emptied `<pre>` out of the root and leaves the `<br>` behind.

The check is `editorRootNeedsNormalization()` on every edit rather than a latch, because Hyperclay's live sync morphs new DOM into the region long after activation and can reintroduce a loose text node.

The repair runs inside `squire.modifyDocument()` so it lands in the undo history rather than behind the user's back, and `captureRange`/`restoreRange` carry the caret across it: a boundary inside a surviving node stays valid by itself, and the two that do not (one inside a dropped whitespace node, one anchored on the root whose child offsets shift) are re-anchored by remembering the root children on either side. `anchorSelectionInBlock()` follows a command: `modifyBlocks` re-anchors the caret on the root itself, which is the same dead position.

The one visible cost is that the first edit strips the region's source indentation, so a saved file's editable regions serialize on one line from then on. That is a whitespace-only diff with no rendered effect, and the alternative is Squire converting the same whitespace into blank lines the user has to delete.

`normalizeEditorRoot` mirrors Squire's own inline/block/container categories rather than CSS `display`, because agreeing with Squire is the whole point.

### Upstream Squire bug this works around

`removeCode()` calls `fixContainer(pre, root)` to repair the root it is about to splice the `<pre>` out of, but that call returns immediately: `fixContainer`'s guard regex `/^(?:TABLE|TBODY|TR|TH|TD|P)/` has no end anchor, so `"PRE"` matches on the `P`. The repair never happens, and the `<pre>`'s children land directly on the root. Present on Squire's current master as well as the vendored 2.4.8. richclay works around it from its own side rather than patching `vendor/squire.js`, so the vendored file stays a clean drop-in.

## Keyboard Shortcuts

`Mod+` resolves to exactly one key per platform, `Meta-` on Apple and `Ctrl-` elsewhere, matching Squire's own `ctrlKey`. Binding both hijacked the macOS system text bindings: Ctrl+D forward-delete ran Code and turned the caret's paragraph into a `<pre>`, Ctrl+K opened the link dialog, Ctrl+B toggled bold. `isApplePlatform()` lives next to `formatShortcut` in src/buttons.js so a button's label and the key that fires it cannot drift.

Unbinding is not enough on its own. Left to Chrome's native handler, a forward delete across a paragraph boundary merges the blocks by welding in a computed-style `<span style="caret-color: …; font-family: …">`, permanently, in an editor whose DOM is the saved file. `installAppleDeleteKeys()` therefore points `Ctrl-d` and `Ctrl-h` at Squire's own `Delete` and `Backspace` handlers, which merge cleanly. It runs before `installShortcuts`, so an author-declared `Ctrl+` shortcut still wins.

Code has no shortcut at all. One keystroke turning a paragraph of prose into a code block is a sharp edge, and `Mod+D` also shadows the browser's bookmark shortcut. Squire binds Code itself, on `_keyHandlers`'s **prototype**, so dropping richclay's binding is not enough: `maskSquireCodeShortcut()` sets an own property of `null` to shadow the inherited handler. In a single-line region `toggleCode()` applies inline `<code>` via `changeFormat`, because Squire's block toggle would put a `<pre>` inside the heading.

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
