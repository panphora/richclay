import { announce, preservePointerSelection } from "./a11y.js";
import { markChrome } from "./hyperclay.js";
import { formatShortcut } from "./buttons.js";

let toolbarId = 0;

export class Toolbar {
  constructor(editor, controls, options = {}) {
    this.editor = editor;
    this.controls = controls;
    this.options = options;
    this.id = ++toolbarId;
    this.items = [];
    this.menus = new Map();
    this.activeIndex = 0;
    this.root = this.createRoot();
    this.onRootKeydown = event => this.handleRootKeydown(event);
    this.onRootClick = event => this.handleRootClick(event);
    this.onRootPointerDown = event => this.handleRootPointerDown(event);
    this.onDocumentPointerDown = event => this.handleDocumentPointerDown(event);

    this.render();
    this.root.addEventListener("keydown", this.onRootKeydown);
    this.root.addEventListener("click", this.onRootClick);
    this.root.addEventListener("mousedown", this.onRootPointerDown);
    this.root.ownerDocument.addEventListener("mousedown", this.onDocumentPointerDown);
  }

  destroy() {
    this.closeMenus();
    this.root.removeEventListener("keydown", this.onRootKeydown);
    this.root.removeEventListener("click", this.onRootClick);
    this.root.removeEventListener("mousedown", this.onRootPointerDown);
    this.root.ownerDocument.removeEventListener("mousedown", this.onDocumentPointerDown);
    this.root.remove();
  }

  update() {
    this.items.forEach(item => {
      const { def, button } = item;
      if (typeof def.isActive === "function") {
        const active = Boolean(def.isActive(this.editor));
        button.setAttribute("aria-pressed", active ? "true" : "false");
        button.classList.toggle("is-active", active);
      }

      if (typeof def.isDisabled === "function") {
        button.disabled = Boolean(def.isDisabled(this.editor));
      }
    });
    this.ensureSingleTabStop();
  }

  focusFirst() {
    this.activeIndex = 0;
    this.ensureSingleTabStop();
    this.items[0]?.button.focus();
  }

  createRoot() {
    const doc = this.editor.element.ownerDocument;
    const root = doc.createElement("div");
    root.className = "richclay-toolbar";
    root.setAttribute("role", "toolbar");
    root.setAttribute("aria-label", this.options.ariaLabel || "Rich text formatting");
    root.setAttribute("data-richclay-toolbar", "");
    markChrome(root);

    const container = resolveContainer(this.options.toolbarContainer, doc);
    if (container) {
      container.appendChild(root);
    } else {
      this.editor.element.insertAdjacentElement("beforebegin", root);
    }
    return root;
  }

  render() {
    this.root.textContent = "";
    this.items = [];
    this.menus.clear();

    let lastGroup = null;
    this.controls.forEach((def, index) => {
      if (def.type === "separator") {
        this.root.appendChild(createSeparator(this.root.ownerDocument));
        lastGroup = null;
        return;
      }

      if (lastGroup && def.group && def.group !== lastGroup) {
        this.root.appendChild(createSeparator(this.root.ownerDocument));
      }
      lastGroup = def.group || lastGroup;

      if (def.type === "menu") {
        this.renderMenu(def, index);
      } else {
        this.renderButton(def, index);
      }
    });

    this.ensureSingleTabStop();
    this.update();
  }

  renderButton(def, index) {
    const button = createToolbarButton(this.root.ownerDocument, def);
    button.dataset.richclayControl = def.id;
    button.dataset.richclayIndex = String(index);
    if (typeof def.isActive === "function") {
      button.setAttribute("aria-pressed", "false");
    }
    this.root.appendChild(button);
    this.items.push({ def, button, type: "button" });
  }

  renderMenu(def, index) {
    const doc = this.root.ownerDocument;
    const button = createToolbarButton(doc, def);
    const menuId = `richclay-menu-${this.id}-${def.id}`;
    button.dataset.richclayControl = def.id;
    button.dataset.richclayIndex = String(index);
    button.setAttribute("aria-haspopup", "menu");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", menuId);

    const menu = doc.createElement("div");
    menu.id = menuId;
    menu.className = "richclay-menu";
    menu.hidden = true;
    menu.setAttribute("role", "menu");
    menu.setAttribute("data-richclay-menu", "");
    markChrome(menu);

    def.options.forEach((option, optionIndex) => {
      const item = doc.createElement("button");
      item.type = "button";
      item.className = "richclay-menu-item";
      item.setAttribute("role", "menuitemradio");
      item.setAttribute("tabindex", "-1");
      item.dataset.richclayMenuItem = def.id;
      item.dataset.richclayOptionIndex = String(optionIndex);
      item.textContent = option.label;
      item.addEventListener("mousedown", preservePointerSelection);
      item.addEventListener("click", event => {
        event.preventDefault();
        this.chooseMenuItem(def, option, button);
      });
      item.addEventListener("keydown", event => this.handleMenuKeydown(event, def, button));
      menu.appendChild(item);
    });

    const wrap = doc.createElement("span");
    wrap.className = "richclay-menu-wrap";
    wrap.append(button, menu);
    this.root.appendChild(wrap);
    this.items.push({ def, button, type: "menu", menu });
    this.menus.set(def.id, { def, button, menu });
  }

  handleRootPointerDown(event) {
    const control = event.target.closest?.("[data-richclay-control]");
    if (!control || !this.root.contains(control)) return;
    preservePointerSelection(event);
    this.editor.saveSelection();
  }

  handleRootClick(event) {
    const button = event.target.closest?.("[data-richclay-control]");
    if (!button || !this.root.contains(button)) return;
    event.preventDefault();

    const item = this.items.find(candidate => candidate.button === button);
    if (!item || button.disabled) return;

    this.activeIndex = this.items.indexOf(item);
    this.ensureSingleTabStop();

    if (item.type === "menu") {
      this.toggleMenu(item.def.id);
      return;
    }

    this.closeMenus();
    this.editor.runControl(item.def);
  }

  handleRootKeydown(event) {
    const key = event.key;
    const navigation = {
      ArrowRight: 1,
      ArrowDown: 1,
      ArrowLeft: -1,
      ArrowUp: -1
    };

    if (key in navigation) {
      event.preventDefault();
      this.moveFocus(navigation[key]);
      return;
    }

    if (key === "Home") {
      event.preventDefault();
      this.setFocusIndex(0);
      return;
    }

    if (key === "End") {
      event.preventDefault();
      this.setFocusIndex(this.items.length - 1);
      return;
    }

    const current = this.items[this.activeIndex];
    if (!current) return;

    if ((key === "Enter" || key === " ") && current.type === "menu") {
      event.preventDefault();
      this.openMenu(current.def.id, "first");
    }

    if (key === "Escape") {
      this.closeMenus();
      current.button.focus();
    }
  }

  handleMenuKeydown(event, def, trigger) {
    // The menu owns keys that originate on its items. Without this, every key
    // bubbles to the toolbar root's roving handler and steals focus to a
    // sibling control (e.g. ArrowDown jumps out of the menu onto Bold).
    event.stopPropagation();
    const menu = this.menus.get(def.id)?.menu;
    const items = Array.from(menu.querySelectorAll(".richclay-menu-item"));
    const index = items.indexOf(event.currentTarget);
    let next = index;

    if (event.key === "ArrowDown") next = (index + 1) % items.length;
    if (event.key === "ArrowUp") next = (index - 1 + items.length) % items.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = items.length - 1;

    if (next !== index) {
      event.preventDefault();
      items[next].focus();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      this.closeMenus();
      trigger.focus();
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const option = def.options[index];
      this.chooseMenuItem(def, option, trigger);
    }
  }

  handleDocumentPointerDown(event) {
    if (this.root.contains(event.target)) return;
    this.closeMenus();
  }

  chooseMenuItem(def, option, trigger) {
    this.closeMenus();
    this.editor.runControl({
      ...option,
      id: `${def.id}:${option.value}`,
      ariaLabel: option.label
    });
    trigger.focus();
  }

  toggleMenu(id) {
    const menu = this.menus.get(id);
    if (!menu) return;
    if (menu.menu.hidden) this.openMenu(id, "first");
    else this.closeMenus();
  }

  openMenu(id, focus = "first") {
    this.closeMenus(id);
    const entry = this.menus.get(id);
    if (!entry) return;
    entry.menu.hidden = false;
    entry.button.setAttribute("aria-expanded", "true");
    this.updateMenuState(entry);

    const items = Array.from(entry.menu.querySelectorAll(".richclay-menu-item"));
    const active = items.find(item => item.getAttribute("aria-checked") === "true");
    const target = focus === "active" ? active || items[0] : items[0];
    target?.focus();
  }

  closeMenus(exceptId = null) {
    this.menus.forEach((entry, id) => {
      if (id === exceptId) return;
      entry.menu.hidden = true;
      entry.button.setAttribute("aria-expanded", "false");
    });
  }

  updateMenuState(entry) {
    const items = Array.from(entry.menu.querySelectorAll(".richclay-menu-item"));
    items.forEach((item, index) => {
      const option = entry.def.options[index];
      const active = Boolean(option.isActive?.(this.editor));
      item.setAttribute("aria-checked", active ? "true" : "false");
      item.classList.toggle("is-active", active);
    });
  }

  moveFocus(delta) {
    if (!this.items.length) return;
    let next = this.activeIndex;
    do {
      next = (next + delta + this.items.length) % this.items.length;
    } while (this.items[next].button.disabled && next !== this.activeIndex);
    this.setFocusIndex(next);
  }

  setFocusIndex(index) {
    this.activeIndex = Math.max(0, Math.min(index, this.items.length - 1));
    this.ensureSingleTabStop();
    this.items[this.activeIndex]?.button.focus();
  }

  ensureSingleTabStop() {
    const enabled = this.items.filter(item => !item.button.disabled);
    if (!enabled.length) return;

    if (!enabled.includes(this.items[this.activeIndex])) {
      this.activeIndex = this.items.indexOf(enabled[0]);
    }

    this.items.forEach((item, index) => {
      item.button.tabIndex = index === this.activeIndex ? 0 : -1;
    });
  }
}

function createToolbarButton(doc, def) {
  const button = doc.createElement("button");
  button.type = "button";
  button.className = "richclay-button";
  const shortcut = formatShortcut(def.shortcut);
  const label = shortcut ? `${def.ariaLabel || def.label} (${shortcut})` : def.ariaLabel || def.label;
  button.setAttribute("aria-label", label);
  button.title = label;
  button.innerHTML = `${def.icon || ""}<span class="richclay-sr-only">${def.label}</span>`;
  return button;
}

function createSeparator(doc) {
  const separator = doc.createElement("span");
  separator.className = "richclay-separator";
  separator.setAttribute("role", "separator");
  separator.setAttribute("aria-orientation", "vertical");
  return separator;
}

function resolveContainer(container, doc) {
  if (!container) return null;
  if (typeof container === "string") return doc.querySelector(container);
  return container;
}
