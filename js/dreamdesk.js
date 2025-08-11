import { minimize, fullscreen, unfullscreen, close } from "./animations.js";

class DreamDeskComponent extends HTMLElement {
  constructor() {
    super();
    this._theme =
      document.documentElement.getAttribute("data-theme") || "default";
    this._prefix = this._getThemePrefix(this._theme);
    this.attachShadow({ mode: "open" });

    this._container = document.createElement("div");
    this._container.classList.add("component-root");

    this._styleLinks = [];

    // Only inject shared base once per component (avoid missing files)
    this._injectBaseStyles();
    this.shadowRoot.appendChild(this._container);

    document.addEventListener("dreamdesk-theme-changed", () => {
      this._theme =
        document.documentElement.getAttribute("data-theme") || "default";

      this._prefix = this._getThemePrefix(this._theme);
      this._updateThemeStyles(() => {
        this.themeChanged?.();
      });
    });
  }

  connectedCallback() {
    if (this._initialized) return;
    this._updateThemeStyles(() => {
      this._container.innerHTML = this.template();
      this.setup?.();
    });
    this._initialized = true;
  }

  _getAssetPath(file, directory = 'css', extension = 'css') {
    // Get the current script's URL to determine the base path
    const scriptUrl = new URL(import.meta.url);
    const scriptPath = scriptUrl.pathname;
    const scriptDir = scriptPath.substring(0, scriptPath.lastIndexOf('/'));
    const assetPath = `${scriptDir}/../${directory}/${file}.${extension}`;
    const baseUrl = new URL('.', window.location.href);
    const fullUrl = new URL(assetPath, baseUrl);
    
    return fullUrl.pathname;
  }

  _injectBaseStyles() {
    const base = ["base"]; // load only existing base.css
    base.forEach((file) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = this._getAssetPath(file, 'css', 'css');
      this.shadowRoot.appendChild(link);
    });
  }

  _updateThemeStyles(callback) {
    // Variables propagate into shadow root; no theme stylesheet injection needed
    if (callback) callback();
  }

  template() {
    return "";
  }

  _getThemePrefix(theme) {
    switch (theme) {
      case "pastelcore":
        return "pc";
      case "dark":
        return "bl";
      default:
        return "";
    }
  }

  get theme() {
    return this._theme;
  }

  get prefix() {
    return this._prefix;
  }
}

class DreamDeskWindow extends DreamDeskComponent {
  static get observedAttributes() {
    return ["title", "width", "height"];
  }

  constructor() {
    super();
    this.title = this.getAttribute("title") || "Window";
    this.width = parseInt(this.getAttribute("width")) || "auto";
    this.height = parseInt(this.getAttribute("height")) || "auto";
    this.state = {
      isMinimized: false,
      isFullscreen: false,
      previousState: null,
    };
  }

  template() {
    const prefix = this.prefix ? `${this.prefix}-` : "";
    return `
      <div class="win" style="width:${this.width}px;height:${this.height}px">
        <div class="win-header">
          <span class="win-title">${this.title}</span>
          <div class="win-controls">
            <button class="btn--minimize" data-action="minimize" aria-label="minimize"></button>
            <button class="btn--fullscreen" data-action="fullscreen" aria-label="fullscreen"></button>
            <button class="btn--close" data-action="close" aria-label="close"></button>
          </div>
        </div>
        <div class="win-body">
          <slot></slot>
        </div>
      </div>
    `;
  }

  setup() {
    this._setupResizeObserver();
    this._bindButtons();
  }

  _bindButtons() {
    const root = this.shadowRoot;
    root
      .querySelector('[data-action="minimize"]')
      ?.addEventListener("click", () => this.minimize());
    root
      .querySelector('[data-action="fullscreen"]')
      ?.addEventListener("click", () => this.fullscreen());
    root
      .querySelector('[data-action="close"]')
      ?.addEventListener("click", () => this.close());
  }

  minimize() {
    const win = this.shadowRoot.querySelector(".win");
    this.state.isMinimized = !this.state.isMinimized;
    this.setAttribute("minimized", "");
    minimize(win);
    this.dispatchEvent(
      new CustomEvent("minimize", {
        detail: { isMinimized: this.state.isMinimized },
      })
    );
  }

  fullscreen() {
    const win = this.shadowRoot.querySelector(".win");
    if (!this.state.isFullscreen) {
      this._freezeWindowState();
      fullscreen(win, this.state.previousState);
    } else {
      unfullscreen(win, this.state.previousState);
    }
    this.state.isFullscreen = !this.state.isFullscreen;
    this.dispatchEvent(
      new CustomEvent("fullscreen", {
        detail: { isFullscreen: this.state.isFullscreen },
      })
    );
  }

  close() {
    const win = this.shadowRoot.querySelector(".win");
    close(win, () => {
      this.style.display = "none";
      this.dispatchEvent(new CustomEvent("close"));
    });
  }

  _freezeWindowState() {
    const rect = this.getBoundingClientRect();
    const scrollTop = scrollY || document.documentElement.scrollTop;
    const scrollLeft = scrollX || document.documentElement.scrollLeft;
    this.state.previousState = {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft,
      width: this.width,
      height: this.height,
      position: getComputedStyle(this).position || "static",
    };
  }

  _setupResizeObserver() {
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        this._checkOverflow(entry.target);
      });
    });

    const slot = this.shadowRoot.querySelector("slot");
    const assignedElements = slot?.assignedElements({ flatten: true }) ?? [];

    const setupScrollableElements = () => {
      assignedElements.forEach((node) => {
        const paragraphs = node.querySelectorAll?.("p.scrollable") ?? [];
        paragraphs.forEach((p) => {
          // Clear previous themed scroll class
          p.classList.forEach((className) => {
            if (className.endsWith("-scroll")) {
              p.classList.remove(className);
            }
          });
          // Re-apply theme specific scroll class so global theme rules match
          if (this._theme !== "default" && this.prefix) {
            p.classList.add(`${this.prefix}-scroll`);
          }
          observer.observe(p);
          this._checkOverflow(p);
        });
      });
    };

    setupScrollableElements();

    document.addEventListener("dreamdesk-theme-changed", () => {
      this._theme =
        document.documentElement.getAttribute("data-theme") || "default";
      this._prefix = this._getThemePrefix(this._theme);
      setupScrollableElements();
    });

    this._resizeObserver = observer;
  }
  _checkOverflow(message) {
    const isOverflowing = message.scrollHeight > message.clientHeight;
    message.classList.toggle("overflowing", isOverflowing);
  }
}

class DreamDeskProgressBar extends DreamDeskComponent {
  static get observedAttributes() {
    return ["value", "gradient", "blocky"];
  }

  constructor() {
    super();
    this._value = parseFloat(this.getAttribute("value")) || 0;
    this._segments = [];
  }

  template() {
    const trackClass = [
      "progress-track",
      this.hasAttribute("blocky") ? "progress-track--blocky" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const barClass = [
      "progress-bar",
      this.hasAttribute("gradient") ? "progress-bar--gradient" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return `
      <div class="${trackClass}">
        ${this.hasAttribute("blocky") ? "" : `<div class="${barClass}"></div>`}
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this._afterRender();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    if (name === "value") {
      this._value = parseFloat(newVal);
      this._updateProgress();
    }
    if (name === "gradient" || name === "blocky") {
      this._container.innerHTML = this.template();
      this._afterRender();
    }
  }

  themeChanged() {
    this._updateThemeStyles(() => {
      this._afterRender();
    });
  }

  _afterRender() {
    const track = this.shadowRoot.querySelector(".progress-track");
    const isBlocky = this.hasAttribute("blocky");
    const isGradient = this.hasAttribute("gradient");

    if (isBlocky) {
      requestAnimationFrame(() => {
        const gap = 1;
        const segmentWidth = 10;
        const segmentHeight = 20;
        const fullSegment = segmentWidth + gap;
        const trackWidth = track.getBoundingClientRect().width;
        const segments = Math.floor((trackWidth + gap) / fullSegment);
        const fullVisualWidth = segments * fullSegment - gap;

        track.innerHTML = "";
        this._segments = [];

        for (let i = 0; i < segments; i++) {
          const seg = document.createElement("div");
          seg.className = "progress-segment";
          seg.style.width = `${segmentWidth}px`;
          seg.style.height = `${segmentHeight}px`;
          seg.style.marginRight = i < segments - 1 ? `${gap}px` : "0";

          if (isGradient) {
            seg.style.backgroundImage = "var(--color-progress-gradient, none)";
            seg.style.backgroundSize = `${fullVisualWidth}px 100%`;
            seg.style.backgroundPosition = `-${i * fullSegment}px 0`;
            seg.style.backgroundRepeat = "no-repeat";
          }

          track.appendChild(seg);
          this._segments.push(seg);
        }

        this._updateProgress();
      });
    } else {
      this._bar = this.shadowRoot.querySelector(".progress-bar");
      this._updateProgress();
    }
  }

  _updateProgress() {
    const percent = Math.min(Math.max(this._value, 0), 100);
    const isGradient = this.hasAttribute("gradient");

    if (this.hasAttribute("blocky")) {
      const activeCount = Math.floor((percent / 100) * this._segments.length);
      this._segments.forEach((seg, i) => {
        const active = i < activeCount;
        seg.style.opacity = active ? "1" : "0.2";
        if (!isGradient) {
          seg.style.filter = active ? `hue-rotate(${percent * 3.6}deg)` : "none";
        } else {
          seg.style.filter = "none";
        }
      });
    } else if (this._bar) {
      this._bar.style.width = `${percent}%`;
      if (!isGradient) {
        this._bar.style.filter = `hue-rotate(${percent * 3.6}deg)`;
      }
      if (this._value >= 100) {
        this._bar.style.borderRight = "none";
      }
    }
  }

  get value() {
    return this._value;
  }

  set value(val) {
    this.setAttribute("value", val);
  }
}

class DreamDeskTabs extends DreamDeskComponent {
  constructor() {
    super();
    this.tabs = [];
    this.panels = [];
    this.activeIndex = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this._initializeSlots();
  }

  _initializeSlots() {
    const slotTabs = this.shadowRoot.querySelector('slot[name="tab"]');
    const slotPanels = this.shadowRoot.querySelector('slot[name="panel"]');

    if (slotTabs && slotPanels) {
      this.tabs = slotTabs.assignedElements() ?? [];
      this.panels = slotPanels.assignedElements() ?? [];
      this._activateTab(this.activeIndex);
      this.setupEventListeners();
    } else {
      setTimeout(() => this._initializeSlots(), 0);
    }
  }

  template() {
    return `
      <div class="tabs">
        <div class="tab-list">
          <slot name="tab"></slot>
        </div>
        <div class="tab-panels">
          <slot name="panel"></slot>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    this.addEventListener("click", (e) => {
      const tab = e.target.closest("[data-tab-index]");
      if (tab) {
        const index = parseInt(tab.getAttribute("data-tab-index"), 10);
        this._activateTab(index);
      }
    });
  }

  _activateTab(index) {
    this.tabs.forEach((tab, i) => {
      tab.classList.toggle("active", i === index);
    });
    this.panels.forEach((panel, i) => {
      panel.classList.toggle("active", i === index);
    });
    this.activeIndex = index;
  }
}

class DreamDeskTab extends HTMLElement {
  connectedCallback() {
    this.setAttribute("slot", "tab");
    this.setAttribute("data-tab", "");
    this.setAttribute("data-tab-index", this.getAttribute("index") || "0");
  }
}

class DreamDeskTabPanel extends DreamDeskComponent {
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("slot", "panel");
    this.setAttribute("data-panel", "");
    this.querySelector("p")?.classList.add("win-message");
  }

  template() {
    return `
      <style>
        :host { display: none; }
        :host(.active) { display: block; }
      </style>
      <slot></slot>
    `;
  }
}

class DreamDeskButton extends DreamDeskComponent {
  static get observedAttributes() {
    return ["variant", "action"];
  }

  constructor() {
    super();
    this.variant = this.getAttribute("variant") || "primary";
    this.action = this.getAttribute("action");
  }

  template() {
    const actionAttr = this.action ? `data-action="${this.action}"` : "";
    const ariaLabel = this.action ? `aria-label="${this.action}"` : "";
    return `
      <button class="btn btn--${this.variant}" ${actionAttr} ${ariaLabel}>
        <slot></slot>
      </button>
    `;
  }
}

class DreamDeskToast extends DreamDeskComponent {
  static get observedAttributes() {
    return ["type", "message"];
  }

  constructor() {
    super();
    this._type = this.getAttribute("type") || "notification";
    this._message = this.getAttribute("message") || "";
  }

  template() {
    return `
      <div class="toast toast-${this._type}">
        <span class="toast-btn--close" data-action="close">&times;</span>
        ${this._message}
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.setup();
  }

  setup() {
    this._setupEventListeners();
  }

  _setupEventListeners() {
    const closeBtn = this.shadowRoot.querySelector('[data-action="close"]');
    closeBtn?.addEventListener("click", () => {
      this.style.display = "none";
    });
  }

  show() { this.style.display = "block"; }
  hide() { this.style.display = "none"; }
}

class DreamDeskInput extends DreamDeskComponent {
  static get observedAttributes() {
    return ["type", "label", "id", "value", "placeholder"];
  }

  constructor() {
    super();
    this._type = this.getAttribute("type") || "text";
    this._label = this.getAttribute("label") || "";
    this._id = this.getAttribute("id") || "";
    this._value = this.getAttribute("value") || "";
    this._placeholder = this.getAttribute("placeholder") || "";
  }

  template() {
    return `
      ${
        this._label
          ? `<label class="input-label" for="${this._id}">${this._label}</label>`
          : ""
      }
      <input 
        type="${this._type}" 
        id="${this._id}" 
        class="dreamdesk-input" 
        value="${this._value}"
        placeholder="${this._placeholder}"
      />
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this._setupEventListeners();
  }

  _setupEventListeners() {
    const input = this.shadowRoot.querySelector("input");
    input?.addEventListener("input", (e) => {
      this._value = e.target.value;
      this.dispatchEvent(
        new CustomEvent("input", {
          detail: { value: this._value },
        })
      );
    });
  }

  get value() { return this._value; }
  set value(val) {
    this._value = val;
    const input = this.shadowRoot.querySelector("input");
    if (input) { input.value = val; }
  }
}

class DreamDeskToggle extends DreamDeskComponent {
  template() {
    const checked = this.theme === "dark" ? "checked" : "";
    return `
      <label class="toggle">
        <input type="checkbox" ${checked}>
        <span class="slider">
          <span class="knob"></span>
        </span>
      </label>
    `;
  }

  setup() {
    this.shadowRoot
      .querySelector('input[type="checkbox"]')
      .addEventListener("change", (e) => {
        this.dispatchEvent(
          new CustomEvent("toggle-changed", {
            detail: { checked: e.target.checked },
          })
        );
      });
  }
}

class DreamDeskTerminalWindow extends DreamDeskWindow {
  constructor() { super(); }
  template() {
    const width = this.width !== "auto" ? `width:${this.width}px;` : "";
    const height = this.height !== "auto" ? `height:${this.height}px;` : "";
    return `
      <div class="win terminal-win" style="${width}${height}">
        <div class="win-header">
          <span class="win-title">${this.title}</span>
          <div class="win-controls">
            <button class="btn--minimize" data-action="minimize" aria-label="minimize"></button>
            <button class="btn--fullscreen" data-action="fullscreen" aria-label="fullscreen"></button>
            <button class="btn--close" data-action="close" aria-label="close"></button>
          </div>
        </div>
        <div class="win-body terminal-win-body">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

customElements.define("dreamdesk-tab", DreamDeskTab);
customElements.define("dreamdesk-tab-panel", DreamDeskTabPanel);
customElements.define("dreamdesk-tabs", DreamDeskTabs);
customElements.define("dreamdesk-window", DreamDeskWindow);
customElements.define("dreamdesk-progress-bar", DreamDeskProgressBar);
customElements.define("dreamdesk-button", DreamDeskButton);
customElements.define("dreamdesk-toast", DreamDeskToast);
customElements.define("dreamdesk-input", DreamDeskInput);
customElements.define("dreamdesk-toggle", DreamDeskToggle);
customElements.define("dreamdesk-terminal-window", DreamDeskTerminalWindow);
