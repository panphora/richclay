// Squire assumes a container's children are all block-level. Its fixContainer()
// gathers any run of inline children into a fresh <div> and gives that <div> a
// <br>, so a formatting-whitespace text node left over from the page's source
// indentation becomes a *visible blank line* the first time a delete or a merge
// runs, and every later split copies it into another block. Card mode never sees
// this because Squire's setHTML() normalizes on ingress; inline mode skips
// setHTML() on purpose, so richclay has to establish that invariant itself.
//
// Only that invariant. setHTML() would also rewrite STRONG/EM/INS/STRIKE, turn
// styled spans into semantic tags, and unwrap every element outside Squire's
// block allowlist, which is exactly the author markup inline mode promises to
// leave alone.

// Mirrors Squire's node categories (source/node/Category.ts). Whitespace is
// content inside a block and formatting noise inside a container, so richclay
// has to draw that line where Squire draws it, not where CSS does.
const INLINE_NODE_NAMES =
  /^(?:#text|A(?:BBR|CRONYM)?|B(?:R|D[IO])?|C(?:ITE|ODE)|D(?:ATA|EL|FN)|EM|FONT|HR|I(?:FRAME|MG|NPUT|NS)?|KBD|Q|R(?:P|T|UBY)|S(?:AMP|MALL|PAN|TR(?:IKE|ONG)|U[BP])?|TIME|U|VAR|WBR)$/;
const NOT_WHITESPACE = /[^ \t\r\n]/;

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const COMMENT_NODE = 8;

const LEAF_NODE_NAMES = new Set(["BR", "HR", "IFRAME", "IMG", "INPUT", "WBR"]);

// SVG and MathML roots keep their lowercase nodeName, so they can never match
// INLINE_NODE_NAMES and would otherwise split a line of prose into three blocks
// around an inline icon. Their subtrees are foreign content, not HTML, so they
// are never walked. A deliberate divergence from Squire, which has no such case.
const FOREIGN_INLINE_ROOTS = new Set(["svg", "math"]);

export function isInlineNode(node) {
  const type = node.nodeType;
  if (type === TEXT_NODE || type === COMMENT_NODE) return true;
  if (type !== ELEMENT_NODE) return false;
  if (FOREIGN_INLINE_ROOTS.has(node.nodeName)) return true;
  if (!INLINE_NODE_NAMES.test(node.nodeName)) return false;
  return Array.from(node.childNodes).every(isInlineNode);
}

export function isBlockContainer(element) {
  return Array.from(element.childNodes).some(node => !isInlineNode(node));
}

const isBlockElement = node =>
  node?.nodeType === ELEMENT_NODE &&
  !FOREIGN_INLINE_ROOTS.has(node.nodeName) &&
  !INLINE_NODE_NAMES.test(node.nodeName);

// The exact inverse of Squire's fixContainer(), which gathers every run of inline
// children into a block. A root that cannot hold blocks needs that undone after an
// insert, because Squire runs fixContainer on the inserted fragment whatever the
// root is: pasting even a bare string into <p editable> lands a <div> inside the
// <p>, and the reload moves everything after the caret out of the region. Both
// sides read INLINE_NODE_NAMES, so the two stay symmetric by construction.
//
// Recursive rather than a querySelector loop because each level's boundary
// decision has to see its siblings as they were before that level was unwrapped.
// Flattening <div><p>A</p><p>B</p></div> outside-in loses the A/B boundary.
export function flattenBlocks(parent, createBoundary) {
  const children = Array.from(parent.childNodes);
  let removed = 0;
  children.forEach((child, index) => {
    if (child.nodeType !== ELEMENT_NODE || FOREIGN_INLINE_ROOTS.has(child.nodeName)) return;
    removed += flattenBlocks(child, createBoundary);
    if (!isBlockElement(child)) return;
    // Only between two blocks. A lone block is the pasted content merging with the
    // text around the caret, which is what a split would have produced, so a break
    // there would be a line the author never asked for.
    if (isBlockElement(children[index - 1])) parent.insertBefore(createBoundary(), child);
    while (child.firstChild) parent.insertBefore(child.firstChild, child);
    child.remove();
    removed += 1;
  });
  return removed;
}

// The two shapes a browser rearranges on reload, measured against the real parser
// in both jsdom and Chrome. A <p> ejects a block from any depth below it, so it is
// the ancestor that matters and not the region's own tag; the table structure
// foster-parents a stray block out before the table. Everything else keeps an
// invalid block exactly where it was put, which is all the file format needs.
//
// TD and TH are deliberately absent: they are ordinary flow containers.
const TABLE_STRUCTURE = new Set(["TABLE", "THEAD", "TBODY", "TFOOT", "TR", "COLGROUP"]);

export function ejectsBlocks(root) {
  return Boolean(root.closest?.("p")) || TABLE_STRUCTURE.has(root.nodeName);
}

// Elements an author writes as a single line of text, and whose shape richclay
// therefore leaves alone: <h2 editable>Hello</h2> should still say exactly that
// after an edit, not <h2 editable><div>Hello</div></h2>. A <div> or a <section> is
// a container and gets the full editor.
//
// Unlike the allowlist round 4 deleted, a wrong entry here costs a hidden toolbar
// button or a preserved line of markup, never content, so a short list is the
// right tool rather than a liability.
const TEXT_LINE_ROOTS = new Set(["P", "H1", "H2", "H3", "H4", "H5", "H6", "PRE", "LABEL", "LEGEND"]);

export function keepsTextShape(root) {
  return TEXT_LINE_ROOTS.has(root.nodeName) || isInlineTag(root);
}

export function isUnsupportedRootTag(root) {
  return TABLE_STRUCTURE.has(root.nodeName);
}

// Shallow tag test, unlike isInlineNode which also walks children. Drives two
// cosmetic things only: the runtime display fix and the validity warning.
export function isInlineTag(node) {
  return (
    node.nodeType === ELEMENT_NODE &&
    !FOREIGN_INLINE_ROOTS.has(node.nodeName) &&
    INLINE_NODE_NAMES.test(node.nodeName)
  );
}

export function hasBlockDescendant(root) {
  return Array.from(root.querySelectorAll("*")).some(isBlockElement);
}

export function normalizeEditorRoot(root, options = {}) {
  const {
    blockTag = "DIV",
    wrapBareRoot = false,
    onBareRootWrapped,
    blocksAllowed = !ejectsBlocks(root)
  } = options;
  dropFormattingWhitespace(root);
  if (blocksAllowed) {
    wrapStrayInlineChildren(root, blockTag, wrapBareRoot, onBareRootWrapped);
  }
  return root;
}

// A comments-only run is left alone by flush(), so counting a comment here would
// leave the predicate permanently true and re-run the whole pass, plus its
// selection round trip, on every keystroke. Whitespace-only text nodes still
// count: those are dropped, not skipped.
const needsWrapping = node => isInlineNode(node) && node.nodeType !== COMMENT_NODE;

// Comments (Hyperclay's region markers) and formatting whitespace are not
// content, so a region holding only those is empty, not authored.
const isAuthorContent = node =>
  node.nodeType !== COMMENT_NODE &&
  !(node.nodeType === TEXT_NODE && !NOT_WHITESPACE.test(node.nodeValue));

// True while the root still violates Squire's invariant, so the caller can skip
// the pass, and its selection round trip, on every edit after the first. Mirrors
// what normalizeEditorRoot actually does, including its walk into nested blocks.
export function editorRootNeedsNormalization(
  root,
  { wrapBareRoot = false, blocksAllowed = !ejectsBlocks(root) } = {}
) {
  if (!blocksAllowed) return false;
  if (!isBlockContainer(root)) return wrapBareRoot;
  return Array.from(root.childNodes).some(needsWrapping) || hasNestedFormattingWhitespace(root);
}

function hasNestedFormattingWhitespace(element) {
  return Array.from(element.children).some(child => {
    if (!isBlockContainer(child)) return false;
    const ownWhitespace =
      !preservesWhitespace(child) &&
      Array.from(child.childNodes).some(
        node => node.nodeType === TEXT_NODE && !NOT_WHITESPACE.test(node.nodeValue)
      );
    return ownWhitespace || hasNestedFormattingWhitespace(child);
  });
}

function dropFormattingWhitespace(element) {
  // A block's own whitespace is content ("a <b>b</b>"), and everything below a
  // block is inline, so there is nothing to walk into either.
  if (!isBlockContainer(element)) return;

  if (!preservesWhitespace(element)) {
    Array.from(element.childNodes).forEach(child => {
      if (child.nodeType === TEXT_NODE && !NOT_WHITESPACE.test(child.nodeValue)) child.remove();
    });
  }
  Array.from(element.children).forEach(dropFormattingWhitespace);
}

// A wholly inline root (<h1 editable>, a bare-text region) is a valid Squire
// block on its own, so a single-line region is left exactly as authored. A
// multi-line one is not editable in practice: Squire's Enter, Delete and
// Backspace all early-return when the caret's block is the root itself, so it
// gets one bare wrapper and the caller is told, in case the author would rather
// write their own.
function wrapStrayInlineChildren(root, blockTag, wrapBareRoot, onBareRootWrapped) {
  if (!isBlockContainer(root)) {
    if (!wrapBareRoot) return;
    const wrapper = root.ownerDocument.createElement(blockTag);
    // An empty region is the ordinary starting state, so it gets the placeholder
    // block beside whatever markers are there, and no warning.
    if (!Array.from(root.childNodes).some(isAuthorContent)) {
      wrapper.appendChild(root.ownerDocument.createElement("BR"));
      root.appendChild(wrapper);
      return;
    }
    while (root.firstChild) wrapper.appendChild(root.firstChild);
    root.appendChild(wrapper);
    onBareRootWrapped?.(root, wrapper);
    return;
  }

  let run = [];
  const flush = () => {
    const nodes = run;
    run = [];
    // A comments-only run has nothing to render; wrapping it would manufacture
    // the blank line this whole pass exists to prevent.
    if (!nodes.some(node => node.nodeType !== COMMENT_NODE)) return;
    const block = root.ownerDocument.createElement(blockTag);
    root.insertBefore(block, nodes[0]);
    nodes.forEach(node => block.appendChild(node));
  };

  Array.from(root.childNodes).forEach(child => {
    if (isInlineNode(child)) run.push(child);
    else flush();
  });
  flush();
}

// Squire decides this on the tag alone, and agreeing with Squire is the point.
// Reading computed style also cost a forced style resolution per block container
// on every keystroke, and made a `white-space: pre-wrap` root keep whitespace in
// the drop pass that the wrap pass then turned into visible blank paragraphs.
function preservesWhitespace(element) {
  return element.nodeName === "PRE";
}

// normalizeEditorRoot only drops whitespace-only text nodes and moves existing
// nodes into a new wrapper, so a range boundary inside a surviving node stays
// valid by itself. Two do not survive: one inside a dropped whitespace node, and
// one anchored on the root, whose child offsets shift when a wrapper is
// inserted. Both are recovered by remembering the root children on either side
// and re-anchoring to whichever is still there.
export function captureRange(root, range) {
  return {
    start: captureBoundary(root, range.startContainer, range.startOffset),
    end: captureBoundary(root, range.endContainer, range.endOffset),
    collapsed: range.collapsed
  };
}

export function restoreRange(root, range, saved) {
  applyBoundary(range, "setStart", root, saved.start);
  if (saved.collapsed) range.collapse(true);
  else applyBoundary(range, "setEnd", root, saved.end);
}

function captureBoundary(root, container, offset) {
  if (!root.contains(container)) return { scope: root, after: [], before: [] };

  // Text nodes are moved whole, never split, so a boundary inside a surviving one
  // stays valid by itself. Only a dropped whitespace node needs re-anchoring.
  if (container.nodeType === TEXT_NODE) {
    if (!isDroppedWhitespace(container)) return { container, offset };
    const scope = container.parentNode;
    return siblingAnchor(scope, Array.from(scope.childNodes).indexOf(container));
  }

  // Element container: its children may be dropped, or moved into a new wrapper.
  // Keep both the exact position and a node-based anchor and choose at restore
  // time, so a container whose children never changed keeps the caret exactly
  // where it was instead of being pushed inside its next child.
  return {
    container,
    offset,
    childCount: container.childNodes.length,
    ...siblingAnchor(container, offset)
  };
}

function siblingAnchor(scope, index) {
  const children = Array.from(scope.childNodes);
  const at = Math.max(0, index);
  return { scope, after: children.slice(at), before: children.slice(0, at).reverse() };
}

function applyBoundary(range, method, root, boundary) {
  const { container, childCount } = boundary;
  if (container && root.contains(container)) {
    if (childCount === undefined || childCount === container.childNodes.length) {
      range[method](container, Math.min(boundary.offset, nodeLength(container)));
      return;
    }
  }

  const after = boundary.after?.find(node => root.contains(node));
  if (after) {
    range[method](caretEdge(after, true), 0);
    return;
  }

  const before = boundary.before?.find(node => root.contains(node));
  if (before) {
    const edge = caretEdge(before, false);
    range[method](edge, nodeLength(edge));
    return;
  }

  const scope = boundary.scope && root.contains(boundary.scope) ? boundary.scope : root;
  range[method](scope, 0);
}

function isDroppedWhitespace(node) {
  return (
    node.nodeType === TEXT_NODE &&
    !NOT_WHITESPACE.test(node.nodeValue) &&
    Boolean(node.parentNode) &&
    node.parentNode.nodeType === ELEMENT_NODE &&
    isBlockContainer(node.parentNode) &&
    !preservesWhitespace(node.parentNode)
  );
}

export const isCaretHost = node =>
  node.nodeType === ELEMENT_NODE || node.nodeType === TEXT_NODE;

// Descends to the node a caret should actually live in: the first or last text
// node, or the element itself when its edge child is a void like the placeholder
// <br>. Comments are skipped rather than entered, and a foreign root such as
// <svg> is atomic: a caret does not belong inside either one.
export function caretEdge(node, first = true) {
  let current = node;
  while (current.nodeType === ELEMENT_NODE && !FOREIGN_INLINE_ROOTS.has(current.nodeName)) {
    const children = Array.from(current.childNodes).filter(isCaretHost);
    const next = first ? children[0] : children[children.length - 1];
    if (!next || LEAF_NODE_NAMES.has(next.nodeName)) break;
    current = next;
  }
  return current;
}

export function nodeLength(node) {
  return node.nodeType === TEXT_NODE ? node.nodeValue.length : node.childNodes.length;
}
