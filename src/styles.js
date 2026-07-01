const STYLE_ID = "richclay-styles";
const styledDocs = new WeakSet();
let cssText = "";

export function setRichClayStyles(text) {
  cssText = text || "";
}

export function ensureStyles(doc = document) {
  if (!doc || styledDocs.has(doc)) return;
  if (doc.getElementById(STYLE_ID)) {
    styledDocs.add(doc);
    return;
  }
  if (!cssText) return;
  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.setAttribute("save-remove", "");
  style.setAttribute("save-ignore", "");
  style.textContent = cssText;
  (doc.head || doc.documentElement).appendChild(style);
  styledDocs.add(doc);
}
