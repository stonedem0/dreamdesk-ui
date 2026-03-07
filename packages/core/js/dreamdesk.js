import { minimize, fullscreen, unfullscreen, close, cancelRunningAnimations } from "./animations.js";

class DreamDeskComponent extends HTMLElement {
  constructor() {
    super();
    this.setAttribute('data-dd-role', 'window');
    this._theme =
      document.documentElement.getAttribute("data-theme") || "default";
    this._prefix = this._getThemePrefix(this._theme);
    this.attachShadow({ mode: "open" });

    this._container = document.createElement("div");
    this._container.classList.add("component-root");

    this._styleLinks = [];

    this._eventController = new AbortController();

    this._injectBaseStyles();
    this.shadowRoot.appendChild(this._container);

    this._onThemeChange = () => {
      this._theme =
        document.documentElement.getAttribute("data-theme") || "default";

      this._prefix = this._getThemePrefix(this._theme);
      this._updateThemeStyles(() => {
        this.themeChanged?.();
      });
    };
    document.addEventListener(
      "dreamdesk-theme-changed",
      this._onThemeChange,
      { signal: this._eventController.signal }
    );
  }

  connectedCallback() {
    if (!this._eventController) {
      this._eventController = new AbortController();
      if (this._onThemeChange) {
        document.addEventListener(
          "dreamdesk-theme-changed",
          this._onThemeChange,
          { signal: this._eventController.signal }
        );
      }
    }
    if (this._initialized) return;
    this._updateThemeStyles(() => {
      this._container.innerHTML = this.template();
      this.setup?.();
    });
    this._initialized = true;
  }

  disconnectedCallback() {
    if (this._eventController) {
      this._eventController.abort();
      this._eventController = null;
    }
    if (this._resizeObserver) {
      try { this._resizeObserver.disconnect(); } catch (_) {}
      this._resizeObserver = null;
    }
  }

  _getAssetPath(file, directory = 'css', extension = 'css') {
    // Resolve asset relative to this module file so it works locally and on CDNs
    const fullUrl = new URL(`../${directory}/${file}.${extension}`, import.meta.url);
    return fullUrl.href;
  }

  _injectBaseStyles() {
    const base = ["base"]; 
    base.forEach((file) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = this._getAssetPath(file, 'css', 'css');
      this.shadowRoot.appendChild(link);
    });
  }

  _updateThemeStyles(callback) {
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
    return [
      "title",
      "width",
      "height",
      "resizable",
      "movable",
      // optional custom SVG icon hooks
      "minimize-icon",
      "fullscreen-icon",
      "close-icon",
      // disable specific controls
      "disable-minimize",
      "disable-fullscreen",
      "disable-close",
    ];
  }

  constructor() {
    super();
    this.title = this.getAttribute("title") || "Window";
    this.widthAttr = this.getAttribute("width");
    this.heightAttr = this.getAttribute("height");
    const resizableAttr = this.getAttribute("resizable");
    this._resizable =
      resizableAttr === null ||
      resizableAttr === "" ||
      resizableAttr === "true" ||
      resizableAttr === "1";
    const movableAttr = this.getAttribute("movable");
    this._movable =
      movableAttr === null ||
      movableAttr === "" ||
      movableAttr === "true" ||
      movableAttr === "1";
    this.state = {
      isMinimized: false,
      isFullscreen: false,
      previousState: null,
    };
  }

  template() {
    const prefix = this.prefix ? `${this.prefix}-` : "";
    return `
      <div class="win">
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
    this._syncSizeFromAttributes();
    this._setupResizeObserver();
    this._bindButtons();
    this._setupResizeHandle();
    this._setupDragging();
    this._applyControlIcons();
    this._applyControlsDisabled();
    this._bindFocusRaise();
  }

  _syncSizeFromAttributes() {
    const w = this.widthAttr;
    const h = this.heightAttr;
    if (w || h) this.setAttribute('data-ddw-explicit', '');
    if (w) this.style.setProperty('--ddw-w', w);
    if (h) this.style.setProperty('--ddw-h', h);
  }

  _bindButtons() {
    const root = this.shadowRoot;
    const onClick = (actionFn) => (e) => {
      const target = e.currentTarget;
      if (target?.getAttribute?.('aria-disabled') === 'true') {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      actionFn();
    };
    root
      .querySelector('[data-action="minimize"]')
      ?.addEventListener("click", onClick(() => this.minimize()));
    root
      .querySelector('[data-action="fullscreen"]')
      ?.addEventListener("click", onClick(() => this.fullscreen()));
    root
      .querySelector('[data-action="close"]')
      ?.addEventListener("click", onClick(() => this.close()));
  }

  minimize() {
    const win = this.shadowRoot.querySelector(".win");
    const customId = this.getAttribute('minimize-animation');
    const customFn = window.DreamDeskAnimations?.[customId];
    const done = () => {
      this.state.isMinimized = !this.state.isMinimized;
      this.setAttribute("minimized", "");
      this.dispatchEvent(
        new CustomEvent("minimize", { detail: { isMinimized: this.state.isMinimized } })
      );
    };
    if (typeof customFn === 'function') {
      const res = customFn(win, { defaultFns: { minimize }, previousState: this.state.previousState });
      Promise.resolve(res).then(done);
    } else {
      minimize(win);
      done();
    }
  }

  fullscreen() {
    const win = this; // animate the host to avoid inner/outer offset drift
    const goingFull = !this.state.isFullscreen;
    if (goingFull) this._freezeWindowState();
    const customId = this.getAttribute(goingFull ? 'fullscreen-animation' : 'unfullscreen-animation');
    let customFn = window.DreamDeskAnimations?.[customId];
    // If no explicit unfullscreen handler, fall back to fullscreen-animation
    if (!goingFull && typeof customFn !== 'function') {
      const fallbackId = this.getAttribute('fullscreen-animation');
      customFn = window.DreamDeskAnimations?.[fallbackId];
    }
    const after = () => {
      this.state.isFullscreen = !this.state.isFullscreen;
      this.dispatchEvent(new CustomEvent("fullscreen", { detail: { isFullscreen: this.state.isFullscreen } }));
    };
    if (typeof customFn === 'function') {
      const res = customFn(win, { previousState: this.state.previousState, isFullscreen: this.state.isFullscreen, defaultFns: { fullscreen, unfullscreen } });
      Promise.resolve(res).then(after);
    } else {
      if (goingFull) {
        fullscreen(win, this.state.previousState);
      } else {
        unfullscreen(win, this.state.previousState);
      }
      after();
    }
  }

  close() {
    const win = this.shadowRoot.querySelector(".win");
    const customId = this.getAttribute('close-animation');
    const customFn = window.DreamDeskAnimations?.[customId];
    const finalize = () => {
      this.style.display = "none";
      this.dispatchEvent(new CustomEvent("close"));
    };
    if (typeof customFn === 'function') {
      const res = customFn(win, { defaultFns: { close } });
      Promise.resolve(res).then(finalize);
    } else {
      close(win, finalize);
    }
  }

  _freezeWindowState() {
    const winEl = this; // capture host rect for fullscreen round-trip
    const rect = winEl.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft || 0;
    const cs = getComputedStyle(winEl);
    const pos = cs.position || 'relative';
    const z = cs.zIndex === 'auto' ? '' : cs.zIndex;
    this.state.previousState = {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft,
      width: rect.width,
      height: rect.height,
      position: pos,
      zIndex: z,
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
      const selector = ".win-content[scrollable], [scrollable], p.scrollable, .scrollable";
      let hasScrollable = false;
      assignedElements.forEach((node) => {
        const selfMatches = node.matches?.(selector) ? [node] : [];
        const descendants = node.querySelectorAll?.(selector) ?? [];
        const candidates = [...selfMatches, ...descendants];

        candidates.forEach((el) => {
          hasScrollable = true;
          el.classList.forEach((className) => {
            if (className.endsWith("-scroll")) {
              el.classList.remove(className);
            }
          });
          observer.observe(el);
          this._checkOverflow(el);
        });
      });
    };

    setupScrollableElements();
    document.addEventListener(
      "dreamdesk-theme-changed",
      () => {
        this._theme =
          document.documentElement.getAttribute("data-theme") || "default";
        this._prefix = this._getThemePrefix(this._theme);
        setupScrollableElements();
      },
      { signal: this._eventController?.signal }
    );

    slot?.addEventListener("slotchange", setupScrollableElements, {
      signal: this._eventController?.signal,
    });

    this._resizeObserver = observer;
  }
  _checkOverflow(message) {
    // Force a reflow to ensure measurements are up-to-date, then compute overflow
    // Use clientHeight/Width vs scrollHeight/Width for both axes
    const isOverflowing = (message.scrollHeight > message.clientHeight) || (message.scrollWidth > message.clientWidth);
    message.classList.toggle("overflowing", isOverflowing);
  }

  _setupResizeHandle() {
    const win = this.shadowRoot.querySelector('.win');
    if (!win) return;

    let handle = win.querySelector('.win-resize-handle');
    if (!this._resizable) {
      if (handle) handle.remove();
      return;
    }
    if (!handle) {
      handle = document.createElement('div');
      handle.className = 'win-resize-handle';
      win.appendChild(handle);
    }

    let isResizing = false;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;

    const minWidth = 180;
    const minHeight = 120;

    const onPointerMove = (e) => {
      if (!isResizing) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const newWidth = Math.max(minWidth, startWidth + deltaX);
      const newHeight = Math.max(minHeight, startHeight + deltaY);
      this.style.setProperty('--ddw-w', `${newWidth}px`);
      this.style.setProperty('--ddw-h', `${newHeight}px`);
      this.setAttribute('data-ddw-explicit', '');
    };

    const stop = () => {
      if (!isResizing) return;
      isResizing = false;
      document.removeEventListener('pointermove', onPointerMove, { capture: true });
      document.removeEventListener('pointerup', stop, { capture: true });
    };

    handle.addEventListener('pointerdown', (e) => {
      if (this.state?.isFullscreen) return;
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = win.getBoundingClientRect();
      startWidth = rect.width;
      startHeight = rect.height;
      document.addEventListener('pointermove', onPointerMove, { capture: true, signal: this._eventController?.signal });
      document.addEventListener('pointerup', stop, { capture: true, signal: this._eventController?.signal });
    }, { signal: this._eventController?.signal });
  }

  _setupDragging() {
    const header = this.shadowRoot.querySelector('.win-header');
    if (!header) return;

    if (!this._movable) {
      header.style.cursor = 'default';
      return;
    }
    header.style.cursor = 'move';

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    let rafId = null;

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const desiredLeft = e.clientX - offsetX;
      const desiredTop = e.clientY - offsetY;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = this.getBoundingClientRect();
        const maxLeft = Math.max(0, window.innerWidth - rect.width);
        const maxTop = Math.max(0, window.innerHeight - rect.height);

        const computed = getComputedStyle(this);
        if (computed.position === 'static') {
          this.style.position = 'absolute';
        }

        const clampedLeft = Math.max(0, Math.min(desiredLeft, maxLeft));
        const clampedTop = Math.max(0, Math.min(desiredTop, maxTop));
        this.style.left = `${clampedLeft}px`;
        this.style.top = `${clampedTop}px`;
      });
    };

    const onPointerUp = () => {
      isDragging = false;
      document.removeEventListener('pointermove', onPointerMove, { capture: true });
      document.removeEventListener('pointerup', onPointerUp, { capture: true });
    };

    header.addEventListener('pointerdown', (e) => {
      if (!this._movable) return;
      const allowFSDrag = this.getAttribute('fullscreen-mode') === 'expand';
      if (this.state?.isFullscreen && !allowFSDrag) return;
      if (e.target.closest('.win-controls')) return;

      // Kill any lingering animations that may be applying an animation style layer
      cancelRunningAnimations(this);

      const hostRect = this.getBoundingClientRect();
      offsetX = e.clientX - hostRect.left;
      offsetY = e.clientY - hostRect.top;
      isDragging = true;

      // Freeze current size to prevent layout-driven expansion during drag
      const computed = getComputedStyle(this);
      const currentW = computed.width;
      const currentH = computed.height;
      this.setAttribute('data-ddw-explicit', '');
      this.style.setProperty('--ddw-w', currentW);
      this.style.setProperty('--ddw-h', currentH);

      DreamDeskWindow._z = (DreamDeskWindow._z || 1000) + 1;
      this.style.zIndex = String(DreamDeskWindow._z);

      document.addEventListener('pointermove', onPointerMove, { capture: true, signal: this._eventController?.signal });
      document.addEventListener('pointerup', onPointerUp, { capture: true, signal: this._eventController?.signal });
    }, { signal: this._eventController?.signal });
  }

  _bindFocusRaise() {
    const winRoot = this.shadowRoot.querySelector('.win');
    if (!winRoot) return;
    const raise = () => {
      DreamDeskWindow._z = (DreamDeskWindow._z || 1000) + 1;
      this.style.zIndex = String(DreamDeskWindow._z);
    };
    winRoot.addEventListener('pointerdown', raise, { signal: this._eventController?.signal });
  }

  _applyControlIcons() {
    const root = this.shadowRoot;
    const apply = (selector, attrName) => {
      const btn = root.querySelector(selector);
      if (!btn) return;

      const iconIdOrSvg = this.getAttribute(attrName);
      // If nothing specified, do nothing (CSS background-image may apply)
      if (!iconIdOrSvg) return;

      let svgMarkup = "";
      const trimmed = iconIdOrSvg.trim();
      if (trimmed.startsWith("<svg")) {
        svgMarkup = trimmed;
      } else if (window.DreamDeskIcons && typeof window.DreamDeskIcons[trimmed] === "string") {
        svgMarkup = window.DreamDeskIcons[trimmed];
      } else {
        // Not a known key or inline SVG; ignore gracefully
        return;
      }

      // Clear existing content and inject SVG
      btn.innerHTML = svgMarkup;
      // Ensure background-image (CSS var) doesn't clash visually
      btn.style.backgroundImage = "none";
      // Make SVG non-interactive inside the button
      const svgEl = btn.querySelector("svg");
      if (svgEl) {
        svgEl.setAttribute("aria-hidden", "true");
        svgEl.setAttribute("focusable", "false");
      }
    };

    apply('.btn--minimize', 'minimize-icon');
    apply('.btn--fullscreen', 'fullscreen-icon');
    apply('.btn--close', 'close-icon');
  }

  _applyControlsDisabled() {
    const root = this.shadowRoot;
    const setDisabled = (selector, attrName) => {
      const btn = root.querySelector(selector);
      if (!btn) return;
      const v = this.getAttribute(attrName);
      const isDisabled = v !== null && v !== 'false' && v !== '0';
      btn.setAttribute('aria-disabled', String(isDisabled));
      if (isDisabled) {
        // keep focus out for disabled controls
        btn.setAttribute('tabindex', '-1');
        // Tooltip: if the disable-* attribute has a non-boolean string value, use it.
        // Otherwise, look for a dedicated tooltip attribute like disable-minimize-tooltip.
        let tooltip = null;
        if (v && v !== 'true' && v !== '1') {
          tooltip = v;
        } else {
          const tipAttr = `${attrName}-tooltip`;
          const tipVal = this.getAttribute(tipAttr);
          if (tipVal) tooltip = tipVal;
        }
        if (tooltip) {
          btn.setAttribute('data-tooltip', tooltip);
          btn.removeAttribute('title');
        } else {
          btn.removeAttribute('data-tooltip');
          btn.removeAttribute('title');
        }
      } else {
        btn.removeAttribute('tabindex');
        btn.removeAttribute('title');
        btn.removeAttribute('data-tooltip');
      }
    };
    setDisabled('.btn--minimize', 'disable-minimize');
    setDisabled('.btn--fullscreen', 'disable-fullscreen');
    setDisabled('.btn--close', 'disable-close');
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    if (name === 'resizable') {
      const isTrue =
        newVal === null || newVal === '' || newVal === 'true' || newVal === '1';
      this._resizable = isTrue;
      if (this._initialized) {
        this._setupResizeHandle();
      }
    }
    if (name === 'movable') {
      const isTrue =
        newVal === null || newVal === '' || newVal === 'true' || newVal === '1';
      this._movable = isTrue;
      if (this._initialized) {
        this._setupDragging();
      }
    }
    if (name === 'width') {
      this.widthAttr = newVal;
      if (this._initialized) this._syncSizeFromAttributes();
    }
    if (name === 'height') {
      this.heightAttr = newVal;
      if (this._initialized) this._syncSizeFromAttributes();
    }
    if (name === 'minimize-icon' || name === 'fullscreen-icon' || name === 'close-icon') {
      // Re-apply icons when attributes change
      this._applyControlIcons();
    }
    if (name === 'disable-minimize' || name === 'disable-fullscreen' || name === 'disable-close') {
      this._applyControlsDisabled();
    }
  }
}

class DreamDeskProgressBar extends DreamDeskComponent {
  static get observedAttributes() {
    return ["value", "gradient", "blocky"];
  }

  constructor() {
    super();
    this.setAttribute('data-dd-role', 'progressbar');
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
    // Do not rebuild markup on theme change; just restyle existing nodes
    const track = this.shadowRoot?.querySelector?.('.progress-track');
    const isBlocky = this.hasAttribute('blocky');
    const isGradient = this.hasAttribute('gradient');

    if (isBlocky && track && this._segments?.length) {
      // Update gradient related styles for existing segments
      const trackWidth = track.getBoundingClientRect().width;
      this._segments.forEach((seg, i) => {
        const segRect = seg.getBoundingClientRect();
        const segStyles = getComputedStyle(seg);
        const mr = parseFloat(segStyles.marginRight || '0') || 0;
        const fullSegment = segRect.width + mr;
        if (isGradient) {
          seg.style.backgroundImage = 'var(--color-progress-gradient, none)';
          seg.style.backgroundSize = `${trackWidth}px 100%`;
          seg.style.backgroundPosition = `-${i * fullSegment}px 0`;
          seg.style.backgroundRepeat = 'no-repeat';
          seg.style.backgroundColor = 'transparent';
        } else {
          seg.style.backgroundImage = 'none';
          seg.style.backgroundColor = 'var(--color-progress-segment, #a8edea)';
        }
      });
      // Keep current value styling
      this._updateProgress();
    } else if (!isBlocky && this._bar) {
      // Non-blocky bar only needs filter/gradient updated
      if (isGradient) {
        this._bar.classList.add('progress-bar--gradient');
      } else {
        this._bar.classList.remove('progress-bar--gradient');
      }
      this._updateProgress();
    } else {
      // If segments/bar are not ready yet (first paint), fall back to current render flow
      this._afterRender();
    }
  }

  _afterRender() {
    const track = this.shadowRoot.querySelector(".progress-track");
    const isBlocky = this.hasAttribute("blocky");
    const isGradient = this.hasAttribute("gradient");

    if (isBlocky) {
      const rebuild = () => {
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
      };

      // Build now and observe for container resizes to keep it responsive
      requestAnimationFrame(rebuild);
      if (this._progressResizeObserver) {
        try { this._progressResizeObserver.disconnect(); } catch(_) {}
      }
      this._progressResizeObserver = new ResizeObserver(() => rebuild());
      this._progressResizeObserver.observe(track);
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
        if (isGradient) {
          // keep gradient image and no solid color
          seg.style.backgroundColor = "transparent";
          seg.style.filter = "none";
        } else {
          seg.style.backgroundImage = "none";
          seg.style.backgroundColor = active ? "var(--color-progress-segment, #a8edea)" : "transparent";
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

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._progressResizeObserver) {
      try { this._progressResizeObserver.disconnect(); } catch (_) {}
      this._progressResizeObserver = null;
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
    this.querySelector("p")?.classList.add("win-content");
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
    return ["variant", "action", "size", "min-width", "width", "height", "font-size", "px", "py", "disabled"];
  }

  static sizeVarMap = {
    'min-width': '--dd-btn-min-w',
    'width': '--dd-btn-w',
    'height': '--dd-btn-h',
    'font-size': '--dd-btn-fs',
    'px': '--dd-btn-px',
    'py': '--dd-btn-py',
  };

  constructor() {
    super();
    this.variant = this.getAttribute("variant") || "primary";
    this.action = this.getAttribute("action");
    this.setAttribute('data-dd-role', 'button');
  }

  template() {
    const actionAttr = this.action ? `data-action="${this.action}"` : "";
    const ariaLabel = this.action ? `aria-label="${this.action}"` : "";
    const disabledAttr = this.hasAttribute("disabled") && this.getAttribute("disabled") !== "false" && this.getAttribute("disabled") !== "0" ? "disabled aria-disabled=\"true\"" : "";
    return `
      <button class="btn btn--${this.variant}" ${actionAttr} ${ariaLabel} ${disabledAttr}>
        <slot></slot>
      </button>
    `;
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    if (name === 'size') {
      // size tokens handled via CSS :host selectors
      return;
    }
    if (name === 'disabled') {
      this._syncDisabled();
      return;
    }
    const varName = DreamDeskButton.sizeVarMap[name];
    if (varName) {
      if (newVal == null) {
        this.style.removeProperty(varName);
      } else {
        this.style.setProperty(varName, newVal);
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._applyButtonSizeOverrides();
    this._syncDisabled();
  }

  _applyButtonSizeOverrides() {
    Object.entries(DreamDeskButton.sizeVarMap).forEach(([attr, cssVar]) => {
      const val = this.getAttribute(attr);
      if (val != null) this.style.setProperty(cssVar, val);
    });
  }

  _syncDisabled() {
    const btn = this.shadowRoot?.querySelector('button');
    if (!btn) return;
    const isDisabled = this.hasAttribute('disabled') && this.getAttribute('disabled') !== 'false' && this.getAttribute('disabled') !== '0';
    btn.disabled = isDisabled;
    btn.setAttribute('aria-disabled', String(isDisabled));
    btn.classList.toggle('btn--disable', isDisabled);
    if (isDisabled) {
      btn.setAttribute('tabindex', '-1');
    } else {
      btn.removeAttribute('tabindex');
    }
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
    return `
      <div class="win terminal-win">
        <div class="win-header">
          <span class="win-title">${this.title}</span>
          <div class="win-controls">
            <button class="btn--minimize" data-action="minimize"></button>
            <button class="btn--fullscreen" data-action="fullscreen"></button>
            <button class="btn--close" data-action="close"></button>
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
