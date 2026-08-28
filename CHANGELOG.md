# Changelog

## [0.4.0] - 2026-08-27

### Changed
- **A custom element carrying a bare `editable` attribute is no longer mounted as an editor.** `editable` is a common boolean property name on web components (Lit reflects `@property({ type: Boolean }) editable` straight to this attribute), where it means whatever that component decided and never rich text. Mounting an editor on one made its rendered output typeable and wrote that output into the author's saved file, damage they could not see until opening the file. The rule is exact: a custom element's tag name always contains a hyphen. Passing an explicit selector to `RichClay.init()` is unaffected, since a caller who names its own hosts means them.

### Added
- `clay-editable` is accepted everywhere `editable` is, down to the option tokens: `clay-editable="single-line no-toolbar toolbar-on-select"` behaves exactly as the bare spelling does, mounts the same inline editor, and is followed by the runtime watcher in both directions. On a custom element it is how one opts back in. On any other element it is a plain alias, left out of the documentation on purpose, so a file written today has a spelling to fall back to if the bare name ever stops being available. An alias that behaved differently from the name it aliases would be worse than none, since the page reaching for it is already in trouble.

### Fixed
- The recognition marker richclay stamps on an element it adopted now asks whether the watcher would adopt that element again, rather than whether it merely matches the selector. Those are different questions for a custom element mounted through an explicit selector: it matches by its bare `editable` and is still refused by the host guard, so without a marker its editor died on the first node replacement, which is what every live-sync morph does, and never came back.
- A custom element the host guard skipped no longer blocks a genuine editable inside it. The nesting check walked ancestors with the unguarded selector, so `<my-grid editable>` wrapping an `<h2 editable>` left the page with no editors at all.
- Removing the opt-in attribute from a custom element tears its editor down. The watcher decided by the selector alone, which such an element still matched through its bare `editable`, so it stayed mounted and its classes, `contenteditable`, ARIA state and provenance attributes were serialized into the author's file.

### Internal
- `scripts/propagate.js` no longer lists hyperclay-actual-website as a destination.



## [0.2.3] - 2026-08-21

### Changed
- Update richclay
- License: relicensed to MIT-0 (MIT No Attribution). Same rights, attribution no longer required for our code; vendored third-party files keep their original licenses (see THIRD-PARTY-NOTICES.md). This shipped in 0.2.3 and was recorded here later; it was previously stranded under an `[Unreleased]` heading between two released versions.

## [0.2.2] - 2026-08-15

### Added
- Update richclay



## [0.2.1] - 2026-08-14

### Changed
- Update richclay



## [0.2.0] - 2026-08-12

### Added
- Squire vendoring patches

### Changed
- Expanded editable root support
- Declare kind, status, and url in the hyper key
- Update richclay


