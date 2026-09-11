import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const from = join(root, "node_modules", "squire-rte");
const FILES = ["squire.js", "squire.mjs"];

// Squire walks up from the selection to find an enclosing block or the outermost
// inline, and none of these three loops checks whether it has passed the editor's
// own root. With a block root they stop naturally. With an inline root, which is
// richclay's whole inline mode, they exit into the author's page: clear formatting
// moves every character out of the region, unlink deletes an <a> the region only
// sat inside, and a delete over the whole region removes the region element.
//
// `where` is the line in upstream's readable dist/squire-raw.js, so a bump that
// moves these can be re-derived from source rather than from the minified blob.
// Upstream: https://github.com/fastmail/Squire/issues/501
const PATCHES = [
  {
    id: "mutation-record-boundary",
    where: "squire-raw.js:2620, root MutationObserver",
    intent: "route real mutation records through a host-configurable boundary",
    find: "new MutationObserver(()=>this._docWasChanged())",
    replace: "new MutationObserver(e=>this._onMutations(e))"
  },
  {
    id: "mutation-boundary-method",
    where: "squire-raw.js:3127, immediately before _docWasChanged",
    intent: "let an editor host filter interface-only records without patching prototypes",
    find: "_docWasChanged(){",
    replace: "_onMutations(e){const t=this._config.onMutations;return t?t(e,this):this._docWasChanged()}_docWasChanged(){"
  },
  {
    id: "mutation-drain-boundary",
    where: "squire-raw.js:3094, modifyDocument pending-record drain",
    intent: "forward drained records through the same mutation boundary",
    find: "e.takeRecords().length&&this._docWasChanged(),e.disconnect()",
    replace: "(()=>{const t=e.takeRecords();t.length&&this._onMutations(t)})(),e.disconnect()"
  },
  {
    id: "serialize-root-hook",
    where: "squire-raw.js:3240, _getRawHTML",
    intent: "serialize through a detached content view when configured",
    find: "_getRawHTML(){return this._root.innerHTML}",
    replace: "_getRawHTML(){const e=this._config.serializeRoot;return e?e(this._root,this):this._root.innerHTML}"
  },
  {
    id: "replace-root-hook",
    where: "squire-raw.js:3243, _setRawHTML",
    intent: "replay history through retention-aware reconciliation when configured",
    find: "_setRawHTML(t){let e=this._root;e.innerHTML=t;",
    replace: "_setRawHTML(t){let e=this._root;if(this._config.replaceRoot)this._config.replaceRoot(e,t,this);else e.innerHTML=t;"
  },
  {
    id: "ensure-bottom-line-content-boundary",
    where: "squire-raw.js:3935, _ensureBottomLine",
    intent: "find the last authored block before trailing editor interface nodes",
    find: "_ensureBottomLine(){let t=this._root,e=t.lastElementChild;",
    replace: "_ensureBottomLine(){let t=this._root,e=t.lastElementChild,n=null;for(;e&&(e.matches('[editor-ui],[clay~=editor-ui]')||e.closest('[editor-ui],[clay~=editor-ui]')); )n=e,e=e.previousElementSibling;"
  },
  {
    id: "ensure-bottom-line-before-interface",
    where: "squire-raw.js:3938, bottom-line insertion",
    intent: "insert the repair block before trailing editor interface nodes",
    find: "&&t.appendChild(this.createDefaultBlock())}createDefaultBlock",
    replace: "&&t.insertBefore(this.createDefaultBlock(),n)}createDefaultBlock"
  },
  {
    id: "mutation-observer-old-attributes",
    where: "squire-raw.js:2620, root MutationObserver options",
    intent: "make marker transitions observable with their previous value",
    find: ".observe(t,{childList:!0,attributes:!0,characterData:!0,subtree:!0})",
    replace: ".observe(t,{childList:!0,attributes:!0,attributeOldValue:!0,characterData:!0,subtree:!0})"
  },
  {
    id: "mutation-drain-old-attributes",
    where: "squire-raw.js:3097, modifyDocument observer options",
    intent: "retain old marker values after reconnecting the observer",
    find: ".observe(this._root,{childList:!0,attributes:!0,characterData:!0,subtree:!0})",
    replace: ".observe(this._root,{childList:!0,attributes:!0,attributeOldValue:!0,characterData:!0,subtree:!0})"
  },
  {
    id: "resize-interface-marker",
    where: "squire-raw.js:2364, image resize container",
    intent: "identify Squire's image controls as editor interface",
    find: 'm("div",{class:"squire-image-resize-container",style:"position: absolute; pointer-events: none; z-index: 1000;"}',
    replace: 'm("div",{class:"squire-image-resize-container","editor-ui":"",style:"position: absolute; pointer-events: none; z-index: 1000;"}'
  },
  {
    id: "public-html-detached-read",
    where: "squire-raw.js:3267, getHTML",
    intent: "serialize public HTML without detaching and restoring live resize UI",
    find: 'getHTML(t){let e,n="";return this.modifyDocument(()=>{t&&(e=this.getSelection(),this._saveRangeToBookmark(e));let o=this._root.querySelector(".squire-image-resize-container");o&&o.remove(),n=this._getRawHTML().replace(/\\u200B/g,""),o&&this._root.appendChild(o),t&&this._getRangeAndRemoveBookmark(e)}),n}',
    replace: 'getHTML(t){if(this._config.serializeRoot)return this._config.serializeRoot(this._root,this,t?this.getSelection():null).replace(/\\u200B/g,"");let e,n="";return this.modifyDocument(()=>{t&&(e=this.getSelection(),this._saveRangeToBookmark(e)),n=this._getRawHTML().replace(/\\u200B/g,""),t&&this._getRangeAndRemoveBookmark(e)}),n}'
  },
  {
    id: "removeAllFormatting-root-guard",
    where: "squire-raw.js:4547, removeAllFormatting: while (stopNode && !isBlock(stopNode))",
    intent: "stop the ancestor walk at this._root",
    find: "let e=this._root,n=t.commonAncestorContainer;for(;n&&!q(n);)n=n.parentNode;",
    replace: "let e=this._root,n=t.commonAncestorContainer;for(;n&&n!==e&&!q(n);)n=n.parentNode;"
  },
  {
    id: "removeFormat-root-guard",
    where: "squire-raw.js:3681, _removeFormat: while (isInline(root))",
    intent: "stop the ancestor walk at this._root (the local is confusingly also called root)",
    find: "let r=n.commonAncestorContainer;for(;g(r);)r=r.parentNode;",
    replace: "let r=n.commonAncestorContainer;for(;r!==this._root&&g(r);)r=r.parentNode;"
  },
  {
    id: "removeEmptyInlines-root-guard",
    where: "squire-raw.js:1738, empty-inline cleanup after a delete",
    intent: "stop the ancestor walk at the editor root before removing an emptied inline",
    find: 'let n=e;for(;g(n)&&(!n.textContent||n.textContent==="\\u200B");)e=n,n=e.parentNode;',
    replace:
      'let n=e;for(;n!==i._root&&g(n)&&(!n.textContent||n.textContent==="\\u200B");)e=n,n=e.parentNode;'
  }
];

const sha = buffer => createHash("sha256").update(buffer).digest("hex");

function applyPatches(source, file) {
  return PATCHES.reduce((acc, patch) => {
    if (acc.includes(patch.replace)) return acc;
    const parts = acc.split(patch.find);
    if (parts.length !== 2) {
      console.error(
        `\nvendor-squire: "${patch.id}" matched ${parts.length - 1} times in ${file}, expected 1.` +
          `\n  what it does: ${patch.intent}` +
          `\n  upstream source: ${patch.where}` +
          "\n  Squire moved. Re-derive this pattern from node_modules/squire-rte/dist/squire-raw.js," +
          "\n  then find the same code in the minified dist file.\n"
      );
      process.exit(1);
    }
    return parts.join(patch.replace);
  }, source);
}

const version = JSON.parse(readFileSync(join(from, "package.json"), "utf8")).version;
const provenance = { package: "squire-rte", version, patches: PATCHES.map(p => p.id), files: {} };

for (const file of FILES) {
  const target = join(root, "vendor", file);
  copyFileSync(join(from, "dist", file), target);
  const upstream = readFileSync(target);
  const patched = Buffer.from(applyPatches(upstream.toString("utf8"), file), "utf8");
  writeFileSync(target, patched);
  provenance.files[file] = { upstream: sha(upstream), vendored: sha(patched) };
  console.log(`vendor-squire: ${file} <- squire-rte@${version}, ${PATCHES.length} patches applied`);
}

writeFileSync(
  join(root, "vendor", "squire.provenance.json"),
  JSON.stringify(provenance, null, 2) + "\n"
);
console.log("vendor-squire: wrote vendor/squire.provenance.json");
