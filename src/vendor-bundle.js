import Squire from "../vendor/squire.mjs";
import DOMPurify from "../vendor/purify.es.mjs";
import RichClay from "./richclay.js";
import css from "../richclay.css";
import { setRichClayStyles } from "./styles.js";

const g = typeof globalThis !== "undefined" ? globalThis : self;
if (g && !g.Squire) g.Squire = Squire;
if (g && !g.DOMPurify) g.DOMPurify = DOMPurify;

setRichClayStyles(css);
// A page with a real ClayJS core defers auto-init to the ClayJS richclay adapter,
// which owns its instances and the observer that mounts them. The handle stops
// whatever auto-init itself started, on the pages where it does start.
const stopAutoWatch = RichClay.autoInit();

export default RichClay;
export { RichClay, stopAutoWatch };
