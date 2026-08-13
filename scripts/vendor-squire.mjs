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
