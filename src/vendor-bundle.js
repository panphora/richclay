import Squire from "../vendor/squire.mjs";
import DOMPurify from "../vendor/purify.es.mjs";
import RichClay from "./richclay.js";

const g = typeof globalThis !== "undefined" ? globalThis : self;
if (g && !g.Squire) g.Squire = Squire;
if (g && !g.DOMPurify) g.DOMPurify = DOMPurify;

export default RichClay;
export { RichClay };
