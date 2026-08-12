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
const PRESERVES_WHITESPACE = /^(?:pre|break-spaces)/;

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const COMMENT_NODE = 8;

export function isInlineNode(node) {
  const type = node.nodeType;
  if (type === TEXT_NODE || type === COMMENT_NODE) return true;
  if (type !== ELEMENT_NODE) return false;
  if (!INLINE_NODE_NAMES.test(node.nodeName)) return false;
  return Array.from(node.childNodes).every(isInlineNode);
}

export function isBlockContainer(element) {
  return Array.from(element.childNodes).some(node => !isInlineNode(node));
}

// A bare root is wrapped in a plain <div> rather than the block tag: <div> has
// no margins, so the page keeps the look the author gave it, and their file
// gains one neutral element instead of a paragraph they never wrote.
const BARE_ROOT_TAG = "DIV";

export function normalizeEditorRoot(root, options = {}) {
  const { blockTag = "P", wrapBareRoot = false, onBareRootWrapped } = options;
  dropFormattingWhitespace(root);
  wrapStrayInlineChildren(root, blockTag, wrapBareRoot, onBareRootWrapped);
  return root;
}

// True while the root still violates Squire's invariant, so the caller can skip
// the pass, and its selection round trip, on every edit after the first. Mirrors
// what normalizeEditorRoot actually does, including its walk into nested blocks.
export function editorRootNeedsNormalization(root, { wrapBareRoot = false } = {}) {
  if (!isBlockContainer(root)) return wrapBareRoot && Boolean(root.firstChild);
  return (
    Array.from(root.childNodes).some(isInlineNode) || hasNestedFormattingWhitespace(root)
  );
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
    if (!wrapBareRoot || !root.firstChild) return;
    const wrapper = root.ownerDocument.createElement(BARE_ROOT_TAG);
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

function preservesWhitespace(element) {
  if (element.nodeName === "PRE") return true;
  const view = element.ownerDocument.defaultView;
  const whiteSpace = view?.getComputedStyle?.(element)?.whiteSpace || "";
  return PRESERVES_WHITESPACE.test(whiteSpace);
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
  if (container !== root && root.contains(container) && !isDroppedWhitespace(container)) {
    return { container, offset };
  }

  const children = Array.from(root.childNodes);
  const index = container === root ? offset : children.indexOf(rootChildOf(root, container));
  const at = Math.max(0, index);
  return { after: children.slice(at), before: children.slice(0, at).reverse() };
}

function applyBoundary(range, method, root, boundary) {
  if (boundary.container && root.contains(boundary.container)) {
    range[method](boundary.container, Math.min(boundary.offset, nodeLength(boundary.container)));
    return;
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

  range[method](root, 0);
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

function rootChildOf(root, node) {
  let current = node;
  while (current && current.parentNode && current.parentNode !== root) current = current.parentNode;
  return current;
}

function caretEdge(node, first) {
  let current = node;
  while (current.nodeType === ELEMENT_NODE && current.firstChild && current.nodeName !== "BR") {
    current = first ? current.firstChild : current.lastChild;
  }
  return current;
}

function nodeLength(node) {
  return node.nodeType === TEXT_NODE ? node.nodeValue.length : node.childNodes.length;
}
