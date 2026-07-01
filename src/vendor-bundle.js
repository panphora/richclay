import Squire from "../vendor/squire.mjs";
import DOMPurify from "../vendor/purify.es.mjs";
import RichClay from "./richclay.js";
import css from "../richclay.css";
import { setRichClayStyles } from "./styles.js";

const g = typeof globalThis !== "undefined" ? globalThis : self;
if (g && !g.Squire) g.Squire = Squire;
if (g && !g.DOMPurify) g.DOMPurify = DOMPurify;

setRichClayStyles(css);
RichClay.autoInit();

export default RichClay;
export { RichClay };
