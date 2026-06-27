# richclay

`richclay` is a small, no-build rich text editor for Hyperclay-style malleable HTML. It wraps Squire for editing commands and undo/redo, uses DOMPurify for sanitization, and treats the editable element's live DOM as the document source of truth.

The generated toolbar, dialogs, live regions, runtime classes, and `contenteditable` state are editor chrome. They are added only while editing and stripped before Hyperclay serializes the page.

## Files

- `richclay.css` - default theme, exposed through CSS custom properties.
- `richclay.js` - classic-script global build. Loads as `window.RichClay`.
- `src/` - readable ESM source.
- `vendor/` - vendored Squire and DOMPurify files for offline use.
- `demo/index.html` - standalone editor, custom button, and simulated Hyperclay save round-trip.
- `tests/` - Node `node:test` + jsdom coverage for DOM behavior.

## Quick Start

Use this path for standalone HTML pages and Hyperclay apps. It needs no bundler, framework, or install step.

```html
<link rel="stylesheet" href="richclay.css">
<script src="vendor/purify.min.js"></script>
<script src="vendor/squire.js"></script>
<script src="richclay.js"></script>

<div data-richclay aria-label="Page body">
  <p>Edit this content.</p>
</div>

<script>
  RichClay.init();
</script>
```

For ESM source usage:

```js
import RichClay from "./src/richclay.js";

const editor = new RichClay(document.querySelector("[data-richclay]"), {
  toolbar: "standard",
  placeholder: "Write..."
});
```

Squire and DOMPurify must be available globally for normal browser use. Tests can inject a `Squire` class through options.

## Hyperclay Use

Mark persistent rich text regions with `data-richclay` or `richclay`:

```html
<div data-richclay aria-label="Article body">
  <h2>Saved content</h2>
  <p>This HTML is the document.</p>
</div>
```

In standalone pages, richclay activates by default. In Hyperclay mode, it activates only in edit mode unless `hyperclay: false` is passed. Edit mode is detected from, in order:

- `?editmode=true` or `?editmode=false`
- `window.__hyperclayEditMode`
- `window.hyperclay.isEditMode`
- `editmode=true` or `hyperclayEditMode=true` cookies

When `window.hyperclay.beforeSave` exists, richclay registers one cleanup hook for the page. The hook runs on Hyperclay's cloned document before serialization and:

- preserves the editor marker and semantic content HTML,
- removes toolbar, menu, dialog, and live-region DOM,
- changes `contenteditable` to `inert-contenteditable`,
- removes richclay runtime classes and runtime-only ARIA attributes,
- removes generated `no-undo`, `snapshot-remove`, `no-watch`, and known Squire artifacts.

On the next edit-mode load, `inert-contenteditable` is consumed back into `contenteditable` and Squire reattaches to the existing inner HTML. View-mode pages remain static and non-editable.

## API

```js
const editor = new RichClay(element, options);
const editors = RichClay.init("[data-richclay]", options);

editor.getHTML();
editor.setHTML("<p>Hello</p>");
editor.focus();
editor.destroy();
editor.registerButton(def);
editor.unregisterButton(id);
editor.squire;

RichClay.registerButton(def);
RichClay.unregisterButton(id);
RichClay.presets;
RichClay.selector;
RichClay.stripFromClone(document.documentElement);
```

Options:

| Option | Default | Notes |
| --- | --- | --- |
| `toolbar` | `"standard"` | Preset name or ordered array of built-in ids, separators, and custom definitions. |
| `toolbarContainer` | `null` | Element or selector. Defaults to inline above the editor. |
| `sanitize` | `{}` | DOMPurify config merged over the default allowlist. |
| `placeholder` | `""` | Visual placeholder plus screen-reader description while empty. |
| `readOnly` | `false` | Leaves the region inert, but `setHTML()` still sanitizes. |
| `hyperclay` | `"auto"` | `true`, `false`, or auto-detect. |
| `onChange` | `null` | Called with sanitized HTML on Squire input. |
| `Squire` | `null` | Optional constructor override, mainly for tests. |

`new RichClay(element)` is idempotent per element. Calling it again with the same element returns the existing instance.

## Toolbar

Presets:

- `minimal`: bold, italic, link, unordered list.
- `standard`: block menu, inline formatting, link, lists, quote, undo/redo, clear formatting.
- `full`: standard plus code, unlink, indent, and outdent.

Toolbar arrays are the extension surface. Include built-in ids, omit ids to remove buttons, change order to reorder, and use `{ type: "separator" }` for an explicit separator.

Built-in control ids are `blockMenu`, `bold`, `italic`, `underline`, `strikethrough`, `code`, `link`, `unlink`, `unorderedList`, `orderedList`, `quote`, `outdent`, `indent`, `undo`, `redo`, and `clearFormatting`.

```js
RichClay.registerButton({
  id: "timestamp",
  label: "Timestamp",
  ariaLabel: "Insert timestamp",
  icon: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 5v5l4 2-1 2-5-3V7h2Z"/></svg>',
  group: "insert",
  run(editor) {
    editor.squire.insertHTML(
      "<p><strong>Updated:</strong> " + new Date().toLocaleString() + "</p>"
    );
  }
});

new RichClay(document.querySelector("[data-richclay]"), {
  toolbar: ["bold", "italic", "link", { type: "separator" }, "timestamp"]
});
```

Button definitions support `id`, `label`, `ariaLabel`, `icon`, `run(editor)`, `isActive(editor)`, `isDisabled(editor)`, `shortcut`, and `group`. Menu controls use `type: "menu"` with an `options` array. Commands should call Squire APIs; do not use `document.execCommand`.

## Sanitization

DOMPurify is required. The default allowlist keeps semantic rich text: paragraphs, headings, lists, blockquotes, code/pre, inline emphasis, spans, and links. Scripts, event handlers, active embeds, forms, images, inline styles, and unsafe URL schemes are stripped by default.

Sanitization runs during activation, `setHTML()`, and Squire paste/insert paths through `sanitizeToDOMFragment`. Link dialog URLs also pass through `normalizeUrl()` before `squire.makeLink()`, so `javascript:`, `data:`, `vbscript:`, and control-character obfuscation are rejected.

Use additive DOMPurify options when possible:

```js
new RichClay(element, {
  sanitize: {
    ADD_TAGS: ["mark"],
    ADD_ATTR: ["data-id"]
  }
});
```

Passing `ALLOWED_TAGS` or `ALLOWED_ATTR` replaces the default list, matching DOMPurify semantics.

## Accessibility

The toolbar follows the ARIA toolbar pattern:

- `role="toolbar"` with an accessible label.
- Exactly one roving `tabindex="0"` control.
- Arrow keys move through controls; Home and End jump to the ends.
- Toggle buttons expose `aria-pressed`.
- Menus use `aria-haspopup`, `aria-expanded`, `role="menu"`, and `menuitemradio`.
- Escape closes menus and the link dialog, returning focus to the trigger/editor.

Toolbar pointer activation prevents focus theft and preserves the Squire selection. A polite live region announces command results such as `Bold on` or `Heading 2 applied`. The editor region gets native `contenteditable` behavior plus `role="textbox"` and `aria-multiline="true"` when those attributes were not provided by the author.

Keyboard shortcuts:

- Ctrl/Cmd+B - bold
- Ctrl/Cmd+I - italic
- Ctrl/Cmd+U - underline
- Ctrl/Cmd+K - link
- Ctrl/Cmd+Shift+8 - unordered list
- Ctrl/Cmd+Shift+9 - ordered list
- Ctrl/Cmd+Z - undo
- Ctrl/Cmd+Shift+Z - redo

Keyboard-only walkthrough:

1. Tab into the toolbar.
2. Use Arrow keys to move between controls.
3. Press Enter or Space to activate a button.
4. Open the block menu, choose with Arrow keys, then press Enter.
5. Press Escape to close menus or the link dialog.
6. Tab into the editor and type normally.

Screen-reader checklist:

- Give each editor an `aria-label` or `aria-labelledby`.
- Confirm the toolbar announces as a toolbar with named controls.
- Confirm pressed state is spoken for toggle buttons.
- Confirm menu expanded/collapsed state is spoken.
- Confirm live-region announcements do not move focus.
- Confirm placeholder text is exposed through `aria-describedby` while empty.

## Styling

The default CSS is intentionally small and themeable. Override custom properties on `:root` or a container:

```css
.my-editor-shell {
  --richclay-accent: #7c3aed;
  --richclay-focus: #111827;
  --richclay-radius: 4px;
}
```

The stylesheet includes dark-mode defaults, visible focus states, forced-colors support, and reduced-motion handling.

## Demo And Development

Open `demo/index.html` in a browser to exercise the standalone editor, a registered custom button, and a simulated Hyperclay save/rehydrate flow.

Development commands:

```sh
npm install
npm test
npm run build
```

`npm install` is for development only. The shipped library path works offline from checked-in files. `npm run build` regenerates the classic-script `richclay.js` from `src/browser-global.js`.
