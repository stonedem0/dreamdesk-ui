function y(n) {
  var e;
  const t = ((e = n == null ? void 0 : n.getAnimations) == null ? void 0 : e.call(n)) ?? [];
  for (const s of t) s.cancel();
}
function x(n) {
  y(n), n.style.transformOrigin = "50% 100%", n.animate(
    [{ transform: "scale(1)" }, { transform: "scale(0)" }],
    { duration: 300, easing: "ease-in", fill: "forwards" }
  );
}
function E(n) {
  y(n), n.style.transformOrigin = "50% 100%", n.animate(
    [{ transform: "scale(0)" }, { transform: "scale(1)" }],
    { duration: 300, easing: "ease-out" }
  );
}
function S(n, t) {
  y(n);
  const e = window.innerWidth, s = window.innerHeight, i = t.top - (window.scrollY || 0), r = t.left - (window.scrollX || 0), a = t.width, o = t.height;
  n.style.position = "fixed", n.style.top = "0", n.style.left = "0", n.style.width = "100vw", n.style.height = "100vh", n.style.zIndex = "9999";
  const l = a / e, h = o / s, u = r + a / 2 - e / 2, m = i + o / 2 - s / 2;
  n.animate(
    [
      { transform: `translate(${u}px, ${m}px) scale(${l}, ${h})` },
      { transform: "none" }
    ],
    { duration: 500, easing: "cubic-bezier(0.2, 0, 0, 1)" }
  );
}
function R(n, t) {
  y(n);
  const e = window.innerWidth, s = window.innerHeight, i = t.width, r = t.height, a = t.top - (window.scrollY || 0), o = t.left - (window.scrollX || 0), l = i / e, h = r / s, u = o + i / 2 - e / 2, m = a + r / 2 - s / 2, d = n.animate(
    [
      { transform: "none" },
      { transform: `translate(${u}px, ${m}px) scale(${l}, ${h})` }
    ],
    { duration: 300, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" }
  ), c = () => {
    n.style.position = t.position || "absolute", n.style.top = `${Math.round(t.top)}px`, n.style.left = `${Math.round(t.left)}px`, n.style.width = `${Math.round(i)}px`, n.style.height = `${Math.round(r)}px`, t.zIndex ? n.style.zIndex = t.zIndex : n.style.removeProperty("z-index");
  };
  d.onfinish = () => {
    c(), n.getAnimations().forEach((b) => b.cancel());
  }, d.oncancel = c;
}
function $(n, t) {
  n.animate(
    [{ opacity: "1", transform: "scale(1)" }, { opacity: "0", transform: "scale(0.95)" }],
    { duration: 300, easing: "ease", fill: "forwards" }
  ).onfinish = () => t == null ? void 0 : t();
}
const Z = {
  current: "default",
  setTheme(n) {
    this.current = n, document.documentElement.setAttribute("data-theme", n), document.dispatchEvent(new CustomEvent("dreamdesk-theme-changed", { detail: { theme: n } }));
  },
  getTheme() {
    return this.current;
  }
}, L = import.meta.url, I = L.slice(0, L.lastIndexOf("/") + 1), P = `${I}../css/`, F = 1e3, A = /* @__PURE__ */ new Map(), f = [];
function z() {
  f.forEach((n, t) => {
    const e = A.get(n);
    e && (e.style.zIndex = String(F + t));
  });
}
function q(n, t) {
  A.set(n, t), f.includes(n) || f.push(n), z();
}
function H(n) {
  A.delete(n);
  const t = f.indexOf(n);
  t !== -1 && f.splice(t, 1), z();
}
function D(n) {
  const t = f.indexOf(n);
  t !== -1 && f.splice(t, 1), f.push(n), z();
}
let O = 0;
function M(n) {
  try {
    const e = new DOMParser().parseFromString(n, "image/svg+xml");
    if (e.querySelector("parsererror")) return "";
    const s = (i) => {
      var r;
      if (i.tagName.toLowerCase() === "script") {
        (r = i.parentNode) == null || r.removeChild(i);
        return;
      }
      for (const a of Array.from(i.attributes))
        (a.name.startsWith("on") || a.value.toLowerCase().includes("javascript:")) && i.removeAttribute(a.name);
      Array.from(i.children).forEach(s);
    };
    return s(e.documentElement), new XMLSerializer().serializeToString(e.documentElement);
  } catch {
    return "";
  }
}
function p(n) {
  return String(n).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
class v extends HTMLElement {
  constructor() {
    super(), this._initialized = !1, this._resizeObserver = null, this.setAttribute("data-dd-role", "window"), this._theme = document.documentElement.getAttribute("data-theme") || "default", this._prefix = this._getThemePrefix(this._theme), this.attachShadow({ mode: "open" }), this._container = document.createElement("div"), this._container.classList.add("component-root"), this._eventController = new AbortController(), this._injectBaseStyles(), this.shadowRoot.appendChild(this._container), this._onThemeChange = () => {
      this._theme = document.documentElement.getAttribute("data-theme") || "default", this._prefix = this._getThemePrefix(this._theme), this._updateThemeStyles(() => {
        var t;
        (t = this.themeChanged) == null || t.call(this);
      });
    }, document.addEventListener("dreamdesk-theme-changed", this._onThemeChange, {
      signal: this._eventController.signal
    });
  }
  connectedCallback() {
    this._eventController || (this._eventController = new AbortController(), document.addEventListener("dreamdesk-theme-changed", this._onThemeChange, {
      signal: this._eventController.signal
    })), !this._initialized && (this._updateThemeStyles(() => {
      var t;
      this._container.innerHTML = this.template(), (t = this.setup) == null || t.call(this);
    }), this._initialized = !0);
  }
  disconnectedCallback() {
    if (this._eventController && (this._eventController.abort(), this._eventController = null), this._resizeObserver) {
      try {
        this._resizeObserver.disconnect();
      } catch {
      }
      this._resizeObserver = null;
    }
  }
  _injectBaseStyles() {
    const t = document.createElement("link");
    t.rel = "stylesheet", t.href = `${P}base.css`, this.shadowRoot.appendChild(t);
  }
  _updateThemeStyles(t) {
    t == null || t();
  }
  template() {
    return "";
  }
  _getThemePrefix(t) {
    switch (t) {
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
class T extends v {
  constructor() {
    super(), this._resizeHandleBound = !1, this._dragController = null, this._observedScrollables = [], this._winId = `dd-win-${++O}`, this.widthAttr = this.getAttribute("width"), this.heightAttr = this.getAttribute("height");
    const t = this.getAttribute("resizable");
    this._resizable = t === null || t === "" || t === "true" || t === "1";
    const e = this.getAttribute("movable");
    this._movable = e === null || e === "" || e === "true" || e === "1", this.state = { isMinimized: !1, isFullscreen: !1, previousState: null };
  }
  static get observedAttributes() {
    return [
      "title",
      "width",
      "height",
      "resizable",
      "movable",
      "minimize-icon",
      "fullscreen-icon",
      "close-icon",
      "disable-minimize",
      "disable-fullscreen",
      "disable-close"
    ];
  }
  template() {
    return `
      <div class="win">
        <div class="win-header">
          <span class="win-title">${p(this.getAttribute("title") || "Window")}</span>
          <div class="win-controls">
            <button class="btn--minimize" data-action="minimize" aria-label="minimize"></button>
            <button class="btn--fullscreen" data-action="fullscreen" aria-label="fullscreen"></button>
            <button class="btn--close" data-action="close" aria-label="close"></button>
          </div>
        </div>
        <div class="win-body"><slot></slot></div>
      </div>`;
  }
  setup() {
    q(this._winId, this), this._syncSizeFromAttributes(), this._setupResizeObserver(), this._bindButtons(), this._setupResizeHandle(), this._setupDragging(), this._applyControlIcons(), this._applyControlsDisabled(), this._bindFocusRaise();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), H(this._winId), this._dragController && (this._dragController.abort(), this._dragController = null);
  }
  _syncSizeFromAttributes() {
    const t = this.widthAttr, e = this.heightAttr;
    (t || e) && this.setAttribute("data-ddw-explicit", ""), t && this.style.setProperty("--ddw-w", t), e && this.style.setProperty("--ddw-h", e);
  }
  _bindButtons() {
    var s, i, r;
    const t = this.shadowRoot, e = (a) => (o) => {
      const l = o.currentTarget;
      if ((l == null ? void 0 : l.getAttribute("aria-disabled")) === "true") {
        o.preventDefault(), o.stopPropagation();
        return;
      }
      a();
    };
    (s = t.querySelector('[data-action="minimize"]')) == null || s.addEventListener("click", e(() => this.minimize())), (i = t.querySelector('[data-action="fullscreen"]')) == null || i.addEventListener("click", e(() => this.fullscreen())), (r = t.querySelector('[data-action="close"]')) == null || r.addEventListener("click", e(() => this.close()));
  }
  minimize() {
    var r;
    const t = this.shadowRoot.querySelector(".win"), e = this.getAttribute("minimize-animation"), s = e ? (r = window.DreamDeskAnimations) == null ? void 0 : r[e] : void 0, i = () => {
      this.state.isMinimized = !this.state.isMinimized, this.state.isMinimized ? this.setAttribute("minimized", "") : this.removeAttribute("minimized"), this.dispatchEvent(new CustomEvent("minimize", { detail: { isMinimized: this.state.isMinimized } }));
    };
    typeof s == "function" ? Promise.resolve(s(t, { defaultFns: { minimize: x, unminimize: E }, previousState: this.state.previousState })).then(i) : (!this.state.isMinimized ? x(t) : E(t), i());
  }
  fullscreen() {
    var a, o;
    const t = this, e = !this.state.isFullscreen;
    e && this._freezeWindowState();
    const s = this.getAttribute(e ? "fullscreen-animation" : "unfullscreen-animation");
    let i = s ? (a = window.DreamDeskAnimations) == null ? void 0 : a[s] : void 0;
    if (!e && typeof i != "function") {
      const l = this.getAttribute("fullscreen-animation");
      i = l ? (o = window.DreamDeskAnimations) == null ? void 0 : o[l] : void 0;
    }
    const r = () => {
      this.state.isFullscreen = !this.state.isFullscreen, this.dispatchEvent(new CustomEvent("fullscreen", { detail: { isFullscreen: this.state.isFullscreen } }));
    };
    typeof i == "function" ? Promise.resolve(i(t, { previousState: this.state.previousState, isFullscreen: this.state.isFullscreen, defaultFns: { fullscreen: S, unfullscreen: R } })).then(r) : (e ? S(t, this.state.previousState) : R(t, this.state.previousState), r());
  }
  close() {
    var r;
    const t = this.shadowRoot.querySelector(".win"), e = this.getAttribute("close-animation"), s = e ? (r = window.DreamDeskAnimations) == null ? void 0 : r[e] : void 0, i = () => {
      this.style.display = "none", this.dispatchEvent(new CustomEvent("close"));
    };
    typeof s == "function" ? Promise.resolve(s(t, { defaultFns: { close: $ } })).then(i) : $(t, i);
  }
  _freezeWindowState() {
    const t = this.getBoundingClientRect(), e = window.scrollY || 0, s = window.scrollX || 0, i = getComputedStyle(this);
    this.state.previousState = {
      top: t.top + e,
      left: t.left + s,
      width: t.width,
      height: t.height,
      position: i.position || "relative",
      zIndex: i.zIndex === "auto" ? "" : i.zIndex
    };
  }
  _setupResizeObserver() {
    var r, a;
    const t = new ResizeObserver((o) => {
      o.forEach((l) => this._checkOverflow(l.target));
    }), e = this.shadowRoot.querySelector("slot"), s = (e == null ? void 0 : e.assignedElements({ flatten: !0 })) ?? [], i = () => {
      const o = ".win-content[scrollable], [scrollable], p.scrollable, .scrollable";
      this._observedScrollables.forEach((l) => t.unobserve(l)), this._observedScrollables = [], s.forEach((l) => {
        var m, d;
        const h = (m = l.matches) != null && m.call(l, o) ? [l] : [], u = ((d = l.querySelectorAll) == null ? void 0 : d.call(l, o)) ?? [];
        [...h, ...Array.from(u)].forEach((c) => {
          c.classList.forEach((b) => {
            b.endsWith("-scroll") && c.classList.remove(b);
          }), t.observe(c), this._observedScrollables.push(c), this._checkOverflow(c);
        });
      });
    };
    i(), document.addEventListener("dreamdesk-theme-changed", () => {
      this._theme = document.documentElement.getAttribute("data-theme") || "default", this._prefix = this._getThemePrefix(this._theme), i();
    }, { signal: ((r = this._eventController) == null ? void 0 : r.signal) ?? void 0 }), e == null || e.addEventListener("slotchange", i, { signal: ((a = this._eventController) == null ? void 0 : a.signal) ?? void 0 }), this._resizeObserver = t;
  }
  _checkOverflow(t) {
    t.classList.toggle("overflowing", t.scrollHeight > t.clientHeight || t.scrollWidth > t.clientWidth);
  }
  _setupResizeHandle() {
    var d;
    const t = this.shadowRoot.querySelector(".win");
    if (!t) return;
    let e = t.querySelector(".win-resize-handle");
    if (!this._resizable) {
      e == null || e.remove(), this._resizeHandleBound = !1;
      return;
    }
    if (e || (e = document.createElement("div"), e.className = "win-resize-handle", t.appendChild(e)), this._resizeHandleBound) return;
    this._resizeHandleBound = !0;
    let s = !1, i = 0, r = 0, a = 0, o = 0;
    const l = 180, h = 120, u = (c) => {
      s && (this.style.setProperty("--ddw-w", `${Math.max(l, a + c.clientX - i)}px`), this.style.setProperty("--ddw-h", `${Math.max(h, o + c.clientY - r)}px`), this.setAttribute("data-ddw-explicit", ""));
    }, m = () => {
      s = !1, document.removeEventListener("pointermove", u, { capture: !0 }), document.removeEventListener("pointerup", m, { capture: !0 });
    };
    e.addEventListener("pointerdown", (c) => {
      var g, k, C;
      if ((g = this.state) != null && g.isFullscreen) return;
      s = !0, i = c.clientX, r = c.clientY;
      const b = t.getBoundingClientRect();
      a = b.width, o = b.height, document.addEventListener("pointermove", u, { capture: !0, signal: ((k = this._eventController) == null ? void 0 : k.signal) ?? void 0 }), document.addEventListener("pointerup", m, { capture: !0, signal: ((C = this._eventController) == null ? void 0 : C.signal) ?? void 0 });
    }, { signal: ((d = this._eventController) == null ? void 0 : d.signal) ?? void 0 });
  }
  _setupDragging() {
    var m;
    const t = this.shadowRoot.querySelector(".win-header");
    if (!t) return;
    if (!this._movable) {
      t.style.cursor = "default", (m = this._dragController) == null || m.abort(), this._dragController = null;
      return;
    }
    if (this._dragController) return;
    this._dragController = new AbortController();
    const { signal: e } = this._dragController;
    t.style.cursor = "move";
    let s = !1, i = 0, r = 0, a = null, o = 0, l = 0;
    const h = (d) => {
      if (!s) return;
      const c = d.clientX - i, b = d.clientY - r;
      a && cancelAnimationFrame(a), a = requestAnimationFrame(() => {
        this.style.left = `${Math.max(0, Math.min(c, o))}px`, this.style.top = `${Math.max(0, Math.min(b, l))}px`;
      });
    }, u = () => {
      s = !1, document.removeEventListener("pointermove", h, { capture: !0 }), document.removeEventListener("pointerup", u, { capture: !0 });
    };
    t.addEventListener("pointerdown", (d) => {
      var b;
      if (!this._movable || (b = this.state) != null && b.isFullscreen && this.getAttribute("fullscreen-mode") !== "expand" || d.target.closest(".win-controls")) return;
      y(this);
      const c = this.getBoundingClientRect();
      i = d.clientX - c.left, r = d.clientY - c.top, o = Math.max(0, window.innerWidth - c.width), l = Math.max(0, window.innerHeight - c.height), s = !0, this.setAttribute("data-ddw-explicit", ""), this.style.setProperty("--ddw-w", `${c.width}px`), this.style.setProperty("--ddw-h", `${c.height}px`), getComputedStyle(this).position === "static" && (this.style.position = "absolute"), D(this._winId), document.addEventListener("pointermove", h, { capture: !0, signal: e }), document.addEventListener("pointerup", u, { capture: !0, signal: e });
    }, { signal: e });
  }
  _bindFocusRaise() {
    var t, e;
    (e = this.shadowRoot.querySelector(".win")) == null || e.addEventListener("pointerdown", () => D(this._winId), {
      signal: ((t = this._eventController) == null ? void 0 : t.signal) ?? void 0
    });
  }
  _applyControlIcons() {
    const t = this.shadowRoot, e = (s, i) => {
      var u;
      const r = t.querySelector(s);
      if (!r) return;
      const a = this.getAttribute(i);
      if (!a) return;
      const o = a.trim();
      let l = "";
      if (o.startsWith("<svg") ? l = M(o) : (u = window.DreamDeskIcons) != null && u[o] && (l = M(window.DreamDeskIcons[o])), !l) return;
      r.innerHTML = l, r.style.backgroundImage = "none";
      const h = r.querySelector("svg");
      h && (h.setAttribute("aria-hidden", "true"), h.setAttribute("focusable", "false"));
    };
    e(".btn--minimize", "minimize-icon"), e(".btn--fullscreen", "fullscreen-icon"), e(".btn--close", "close-icon");
  }
  _applyControlsDisabled() {
    const t = this.shadowRoot, e = (s, i) => {
      const r = t.querySelector(s);
      if (!r) return;
      const a = this.getAttribute(i), o = a !== null && a !== "false" && a !== "0";
      if (r.setAttribute("aria-disabled", String(o)), o) {
        r.setAttribute("tabindex", "-1");
        const l = a && a !== "true" && a !== "1" ? a : this.getAttribute(`${i}-tooltip`);
        l ? r.setAttribute("data-tooltip", l) : r.removeAttribute("data-tooltip");
      } else
        r.removeAttribute("tabindex"), r.removeAttribute("data-tooltip");
    };
    e(".btn--minimize", "disable-minimize"), e(".btn--fullscreen", "disable-fullscreen"), e(".btn--close", "disable-close");
  }
  attributeChangedCallback(t, e, s) {
    if (e === s) return;
    const i = (r) => r === null || r === "" || r === "true" || r === "1";
    t === "resizable" && (this._resizable = i(s), this._initialized && this._setupResizeHandle()), t === "movable" && (this._movable = i(s), this._initialized && this._setupDragging()), t === "width" && (this.widthAttr = s, this._initialized && this._syncSizeFromAttributes()), t === "height" && (this.heightAttr = s, this._initialized && this._syncSizeFromAttributes()), ["minimize-icon", "fullscreen-icon", "close-icon"].includes(t) && this._applyControlIcons(), ["disable-minimize", "disable-fullscreen", "disable-close"].includes(t) && this._applyControlsDisabled();
  }
}
class W extends v {
  constructor() {
    super(), this._segments = [], this._bar = null, this._progressResizeObserver = null, this.setAttribute("data-dd-role", "progressbar"), this._value = parseFloat(this.getAttribute("value") ?? "0") || 0;
  }
  static get observedAttributes() {
    return ["value", "gradient", "blocky"];
  }
  template() {
    const t = ["progress-track", this.hasAttribute("blocky") ? "progress-track--blocky" : ""].filter(Boolean).join(" "), e = ["progress-bar", this.hasAttribute("gradient") ? "progress-bar--gradient" : ""].filter(Boolean).join(" ");
    return `<div class="${t}">${this.hasAttribute("blocky") ? "" : `<div class="${e}"></div>`}</div>`;
  }
  connectedCallback() {
    super.connectedCallback(), this._afterRender();
  }
  attributeChangedCallback(t, e, s) {
    e !== s && (t === "value" && (this._value = parseFloat(s ?? "0"), this._updateProgress()), (t === "gradient" || t === "blocky") && (this._container.innerHTML = this.template(), this._afterRender()));
  }
  themeChanged() {
    var i;
    const t = (i = this.shadowRoot) == null ? void 0 : i.querySelector(".progress-track"), e = this.hasAttribute("blocky"), s = this.hasAttribute("gradient");
    if (e && t && this._segments.length) {
      const r = t.getBoundingClientRect().width;
      this._segments.forEach((a, o) => {
        const { width: l, marginRight: h } = getComputedStyle(a), u = parseFloat(l) + (parseFloat(h) || 0);
        s ? (a.style.backgroundImage = "var(--color-progress-gradient, none)", a.style.backgroundSize = `${r}px 100%`, a.style.backgroundPosition = `-${o * u}px 0`, a.style.backgroundRepeat = "no-repeat", a.style.backgroundColor = "transparent") : (a.style.backgroundImage = "none", a.style.backgroundColor = "var(--color-progress-segment, #a8edea)");
      }), this._updateProgress();
    } else
      this._afterRender();
  }
  _afterRender() {
    var i;
    const t = this.shadowRoot.querySelector(".progress-track");
    if (!t) return;
    const e = this.hasAttribute("blocky"), s = this.hasAttribute("gradient");
    if (e) {
      const r = () => {
        const m = t.getBoundingClientRect().width, d = Math.floor((m + 1) / 11), c = d * 11 - 1;
        t.innerHTML = "", this._segments = [];
        for (let b = 0; b < d; b++) {
          const g = document.createElement("div");
          g.className = "progress-segment", g.style.cssText = `width:10px;height:20px;margin-right:${b < d - 1 ? 1 : 0}px`, s && (g.style.backgroundImage = "var(--color-progress-gradient, none)", g.style.backgroundSize = `${c}px 100%`, g.style.backgroundPosition = `-${b * 11}px 0`, g.style.backgroundRepeat = "no-repeat"), t.appendChild(g), this._segments.push(g);
        }
        this._updateProgress();
      };
      requestAnimationFrame(r), (i = this._progressResizeObserver) == null || i.disconnect();
      let a = null;
      this._progressResizeObserver = new ResizeObserver(() => {
        a && clearTimeout(a), a = setTimeout(r, 50);
      }), this._progressResizeObserver.observe(t);
    } else
      this._bar = this.shadowRoot.querySelector(".progress-bar"), this._updateProgress();
  }
  _updateProgress() {
    const t = Math.min(Math.max(this._value, 0), 100), e = this.hasAttribute("gradient");
    if (this.hasAttribute("blocky")) {
      const s = Math.floor(t / 100 * this._segments.length);
      this._segments.forEach((i, r) => {
        i.style.opacity = r < s ? "1" : "0.2", e ? (i.style.backgroundColor = "transparent", i.style.filter = "none") : (i.style.backgroundImage = "none", i.style.backgroundColor = r < s ? "var(--color-progress-segment, #a8edea)" : "transparent", i.style.filter = "none");
      });
    } else if (this._bar) {
      if (this._bar.style.width = `${t}%`, !e)
        try {
          const s = getComputedStyle(this._bar).getPropertyValue("--dd-progress-enable-hue-rotate").trim();
          this._bar.style.filter = s === "0" ? "none" : `hue-rotate(${t * 3.6}deg)`;
        } catch {
          this._bar.style.filter = `hue-rotate(${t * 3.6}deg)`;
        }
      this._value >= 100 && (this._bar.style.borderRight = "none");
    }
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._progressResizeObserver) == null || t.disconnect(), this._progressResizeObserver = null;
  }
  get value() {
    return this._value;
  }
  set value(t) {
    this.setAttribute("value", String(t));
  }
}
class B extends v {
  constructor() {
    super(...arguments), this.tabs = [], this.panels = [], this.activeIndex = 0, this._tabListenerBound = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this._initializeSlots();
  }
  _initializeSlots() {
    const t = this.shadowRoot.querySelector('slot[name="tab"]'), e = this.shadowRoot.querySelector('slot[name="panel"]');
    t && e ? (this.tabs = t.assignedElements() ?? [], this.panels = e.assignedElements() ?? [], this._activateTab(this.activeIndex), this._setupEventListeners()) : setTimeout(() => this._initializeSlots(), 0);
  }
  template() {
    return '<div class="tabs"><div class="tab-list"><slot name="tab"></slot></div><div class="tab-panels"><slot name="panel"></slot></div></div>';
  }
  _setupEventListeners() {
    var t;
    this._tabListenerBound || (this._tabListenerBound = !0, this.addEventListener("click", (e) => {
      const s = e.target.closest("[data-tab-index]");
      s && this._activateTab(parseInt(s.getAttribute("data-tab-index") ?? "0", 10));
    }, { signal: ((t = this._eventController) == null ? void 0 : t.signal) ?? void 0 }));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._tabListenerBound = !1;
  }
  _activateTab(t) {
    this.tabs.forEach((e, s) => e.classList.toggle("active", s === t)), this.panels.forEach((e, s) => e.classList.toggle("active", s === t)), this.activeIndex = t;
  }
}
class X extends HTMLElement {
  connectedCallback() {
    this.setAttribute("slot", "tab"), this.setAttribute("data-tab", ""), this.setAttribute("data-tab-index", this.getAttribute("index") ?? "0");
  }
}
class Y extends v {
  connectedCallback() {
    var t;
    super.connectedCallback(), this.setAttribute("slot", "panel"), this.setAttribute("data-panel", ""), (t = this.querySelector("p")) == null || t.classList.add("win-content");
  }
  template() {
    return "<style>:host{display:none}:host(.active){display:block}</style><slot></slot>";
  }
}
const _ = class _ extends v {
  static get observedAttributes() {
    return ["variant", "action", "size", "min-width", "width", "height", "font-size", "px", "py", "disabled"];
  }
  constructor() {
    super(), this.variant = this.getAttribute("variant") || "primary", this.action = this.getAttribute("action"), this.setAttribute("data-dd-role", "button");
  }
  template() {
    const t = this.action ? `data-action="${p(this.action)}"` : "", e = this.action ? `aria-label="${p(this.action)}"` : "", s = this.getAttribute("disabled"), i = s !== null && s !== "false" && s !== "0" ? 'disabled aria-disabled="true"' : "";
    return `<button class="btn btn--${p(this.variant)}" ${t} ${e} ${i}><slot></slot></button>`;
  }
  connectedCallback() {
    super.connectedCallback(), this._applyButtonSizeOverrides(), this._syncDisabled();
  }
  attributeChangedCallback(t, e, s) {
    var r, a;
    if (e === s || t === "size") return;
    if (t === "disabled") {
      this._syncDisabled();
      return;
    }
    if (t === "variant") {
      this.variant = s ?? "primary";
      const o = (r = this.shadowRoot) == null ? void 0 : r.querySelector("button");
      o && (o.className = `btn btn--${this.variant}`);
      return;
    }
    if (t === "action") {
      this.action = s;
      const o = (a = this.shadowRoot) == null ? void 0 : a.querySelector("button");
      o && (s ? (o.setAttribute("data-action", s), o.setAttribute("aria-label", s)) : (o.removeAttribute("data-action"), o.removeAttribute("aria-label")));
      return;
    }
    const i = _.sizeVarMap[t];
    i && (s == null ? this.style.removeProperty(i) : this.style.setProperty(i, s));
  }
  _applyButtonSizeOverrides() {
    Object.entries(_.sizeVarMap).forEach(([t, e]) => {
      const s = this.getAttribute(t);
      s != null && this.style.setProperty(e, s);
    });
  }
  _syncDisabled() {
    var s;
    const t = (s = this.shadowRoot) == null ? void 0 : s.querySelector("button");
    if (!t) return;
    const e = this.hasAttribute("disabled") && this.getAttribute("disabled") !== "false" && this.getAttribute("disabled") !== "0";
    t.disabled = e, t.setAttribute("aria-disabled", String(e)), t.classList.toggle("btn--disable", e), e ? t.setAttribute("tabindex", "-1") : t.removeAttribute("tabindex");
  }
};
_.sizeVarMap = {
  "min-width": "--dd-btn-min-w",
  width: "--dd-btn-w",
  height: "--dd-btn-h",
  "font-size": "--dd-btn-fs",
  px: "--dd-btn-px",
  py: "--dd-btn-py"
};
let w = _;
class j extends v {
  static get observedAttributes() {
    return ["type", "message"];
  }
  constructor() {
    super(), this._type = this.getAttribute("type") || "notification", this._message = this.getAttribute("message") || "";
  }
  template() {
    return `<div class="toast toast-${p(this._type)}">
      <button class="toast-btn--close" data-action="close" aria-label="close">&times;</button>
      ${p(this._message)}
    </div>`;
  }
  setup() {
    var t;
    (t = this.shadowRoot.querySelector('[data-action="close"]')) == null || t.addEventListener("click", () => {
      this.style.display = "none";
    });
  }
  show() {
    this.style.display = "block";
  }
  hide() {
    this.style.display = "none";
  }
}
class N extends v {
  static get observedAttributes() {
    return ["type", "label", "id", "value", "placeholder"];
  }
  constructor() {
    super(), this._type = this.getAttribute("type") || "text", this._label = this.getAttribute("label") || "", this._inputId = this.getAttribute("id") || "", this._value = this.getAttribute("value") || "", this._placeholder = this.getAttribute("placeholder") || "";
  }
  template() {
    return `${this._label ? `<label class="input-label" for="${p(this._inputId)}">${p(this._label)}</label>` : ""}
      <input type="${p(this._type)}" id="${p(this._inputId)}" class="dreamdesk-input"
        value="${p(this._value)}" placeholder="${p(this._placeholder)}" />`;
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this.shadowRoot.querySelector("input")) == null || t.addEventListener("input", (e) => {
      this._value = e.target.value, this.dispatchEvent(new CustomEvent("input", { detail: { value: this._value } }));
    });
  }
  get value() {
    return this._value;
  }
  set value(t) {
    var s;
    this._value = t;
    const e = (s = this.shadowRoot) == null ? void 0 : s.querySelector("input");
    e && (e.value = t);
  }
}
class G extends v {
  template() {
    return `<label class="toggle">
      <input type="checkbox" ${this.theme === "dark" ? "checked" : ""}>
      <span class="slider"><span class="knob"></span></span>
    </label>`;
  }
  setup() {
    var t;
    (t = this.shadowRoot.querySelector('input[type="checkbox"]')) == null || t.addEventListener("change", (e) => {
      this.dispatchEvent(new CustomEvent("toggle-changed", {
        detail: { checked: e.target.checked }
      }));
    });
  }
}
class U extends T {
  template() {
    return `<div class="win terminal-win">
      <div class="win-header">
        <span class="win-title">${p(this.getAttribute("title") || "Terminal")}</span>
        <div class="win-controls">
          <button class="btn--minimize" data-action="minimize"></button>
          <button class="btn--fullscreen" data-action="fullscreen"></button>
          <button class="btn--close" data-action="close"></button>
        </div>
      </div>
      <div class="win-body terminal-win-body"><slot></slot></div>
    </div>`;
  }
}
customElements.define("dreamdesk-tab", X);
customElements.define("dreamdesk-tab-panel", Y);
customElements.define("dreamdesk-tabs", B);
customElements.define("dreamdesk-window", T);
customElements.define("dreamdesk-progress-bar", W);
customElements.define("dreamdesk-button", w);
customElements.define("dreamdesk-toast", j);
customElements.define("dreamdesk-input", N);
customElements.define("dreamdesk-toggle", G);
customElements.define("dreamdesk-terminal-window", U);
export {
  Z as DreamDeskThemeManager,
  y as cancelRunningAnimations,
  $ as close,
  S as fullscreen,
  x as minimize,
  R as unfullscreen,
  E as unminimize
};
