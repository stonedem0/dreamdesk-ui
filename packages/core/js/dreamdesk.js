function z(n) {
  var e;
  const t = ((e = n == null ? void 0 : n.getAnimations) == null ? void 0 : e.call(n)) ?? [];
  for (const s of t) s.cancel();
}
function C(n) {
  z(n), n.style.transformOrigin = "50% 100%", n.animate(
    [{ transform: "scale(1)" }, { transform: "scale(0)" }],
    { duration: 300, easing: "ease-in", fill: "forwards" }
  );
}
function E(n) {
  z(n), n.style.transformOrigin = "50% 100%", n.animate(
    [{ transform: "scale(0)" }, { transform: "scale(1)" }],
    { duration: 300, easing: "ease-out" }
  );
}
function S(n, t) {
  z(n);
  const e = window.innerWidth, s = window.innerHeight, i = t.top - (window.scrollY || 0), r = t.left - (window.scrollX || 0), o = t.width, a = t.height;
  n.style.position = "fixed", n.style.top = "0", n.style.left = "0", n.style.width = "100vw", n.style.height = "100vh", n.style.setProperty("--ddw-w", "100vw"), n.style.setProperty("--ddw-h", "100vh"), n.style.zIndex = "9999";
  const l = o / e, d = a / s, u = r + o / 2 - e / 2, b = i + a / 2 - s / 2;
  n.animate(
    [
      { transform: `translate(${u}px, ${b}px) scale(${l}, ${d})` },
      { transform: "none" }
    ],
    { duration: 500, easing: "cubic-bezier(0.2, 0, 0, 1)" }
  );
}
function L(n, t) {
  z(n);
  const e = window.innerWidth, s = window.innerHeight, i = t.width, r = t.height, o = t.top - (window.scrollY || 0), a = t.left - (window.scrollX || 0), l = i / e, d = r / s, u = a + i / 2 - e / 2, b = o + r / 2 - s / 2, c = n.animate(
    [
      { transform: "none" },
      { transform: `translate(${u}px, ${b}px) scale(${l}, ${d})` }
    ],
    { duration: 300, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" }
  ), h = () => {
    n.style.position = t.position || "absolute", n.style.top = `${Math.round(t.top)}px`, n.style.left = `${Math.round(t.left)}px`, n.style.width = "", n.style.height = "", n.style.setProperty("--ddw-w", `${Math.round(i)}px`), n.style.setProperty("--ddw-h", `${Math.round(r)}px`), t.zIndex ? n.style.zIndex = t.zIndex : n.style.removeProperty("z-index");
  };
  c.onfinish = () => {
    h(), n.getAnimations().forEach((m) => m.cancel());
  }, c.oncancel = h;
}
function $(n, t) {
  n.animate(
    [{ opacity: "1", transform: "scale(1)" }, { opacity: "0", transform: "scale(0.95)" }],
    { duration: 300, easing: "ease", fill: "forwards" }
  ).onfinish = () => t == null ? void 0 : t();
}
const U = {
  current: "default",
  setTheme(n) {
    this.current = n, document.documentElement.setAttribute("data-theme", n), document.dispatchEvent(new CustomEvent("dreamdesk-theme-changed", { detail: { theme: n } }));
  },
  getTheme() {
    return this.current;
  }
};
function T({ handle: n, host: t, signal: e, disabled: s, exclude: i, getBounds: r, onStart: o }) {
  let a = !1, l = 0, d = 0, u = 0, b = 0, c = null;
  const h = (f) => {
    if (!a) return;
    const y = f.clientX - l, A = f.clientY - d;
    c && cancelAnimationFrame(c), c = requestAnimationFrame(() => {
      t.style.left = `${Math.max(0, Math.min(y, u))}px`, t.style.top = `${Math.max(0, Math.min(A, b))}px`;
    });
  }, m = () => {
    a = !1, document.removeEventListener("pointermove", h, { capture: !0 }), document.removeEventListener("pointerup", m, { capture: !0 }), c && (cancelAnimationFrame(c), c = null);
  }, p = (f) => {
    if (s != null && s() || i && f.target.closest(i)) return;
    z(t);
    const y = t.getBoundingClientRect();
    l = f.clientX - y.left, d = f.clientY - y.top;
    const A = (r == null ? void 0 : r()) ?? {
      maxLeft: Math.max(0, window.innerWidth - y.width),
      maxTop: Math.max(0, window.innerHeight - y.height)
    };
    u = A.maxLeft, b = A.maxTop, o == null || o(y), a = !0, document.addEventListener("pointermove", h, { capture: !0 }), document.addEventListener("pointerup", m, { capture: !0 });
  }, _ = e ? { signal: e } : {};
  return n.addEventListener("pointerdown", p, _), () => {
    n.removeEventListener("pointerdown", p), document.removeEventListener("pointermove", h, { capture: !0 }), document.removeEventListener("pointerup", m, { capture: !0 }), c && cancelAnimationFrame(c);
  };
}
function P({ handle: n, host: t, signal: e, disabled: s, minWidth: i = 180, minHeight: r = 120, explicitAttr: o = "data-explicit" }) {
  let a = !1, l = 0, d = 0, u = 0, b = 0;
  const c = (_) => {
    a && (t.style.setProperty("--ddw-w", `${Math.max(i, u + _.clientX - l)}px`), t.style.setProperty("--ddw-h", `${Math.max(r, b + _.clientY - d)}px`), t.setAttribute(o, ""));
  }, h = () => {
    a = !1, document.removeEventListener("pointermove", c, { capture: !0 }), document.removeEventListener("pointerup", h, { capture: !0 });
  }, m = (_) => {
    if (s != null && s()) return;
    a = !0, l = _.clientX, d = _.clientY;
    const f = t.getBoundingClientRect();
    u = f.width, b = f.height, document.addEventListener("pointermove", c, { capture: !0 }), document.addEventListener("pointerup", h, { capture: !0 });
  }, p = e ? { signal: e } : {};
  return n.addEventListener("pointerdown", m, p), () => {
    n.removeEventListener("pointerdown", m), document.removeEventListener("pointermove", c, { capture: !0 }), document.removeEventListener("pointerup", h, { capture: !0 });
  };
}
const I = 1e3;
class F {
  constructor() {
    this._registry = /* @__PURE__ */ new Map(), this._zStack = [], this._listeners = /* @__PURE__ */ new Set();
  }
  _notify() {
    this._listeners.forEach((t) => t());
  }
  _reassignZ() {
    this._zStack.forEach((t, e) => {
      const s = this._registry.get(t);
      s && (s.el.style.zIndex = String(I + e));
    });
  }
  register(t, e, s) {
    this._registry.set(t, { id: t, title: s, el: e, isMinimized: !1 }), this._zStack.includes(t) || this._zStack.push(t), this._reassignZ(), this._notify();
  }
  unregister(t) {
    this._registry.delete(t);
    const e = this._zStack.indexOf(t);
    e !== -1 && this._zStack.splice(e, 1), this._reassignZ(), this._notify();
  }
  raise(t) {
    const e = this._zStack.indexOf(t);
    e !== -1 && this._zStack.splice(e, 1), this._zStack.push(t), this._reassignZ();
  }
  minimize(t) {
    const e = this._registry.get(t);
    e && (e.isMinimized = !0, this._notify());
  }
  restore(t) {
    const e = this._registry.get(t);
    e && (e.isMinimized = !1, this.raise(t), this._notify());
  }
  getWindows() {
    return Array.from(this._registry.values());
  }
  subscribe(t) {
    return this._listeners.add(t), () => this._listeners.delete(t);
  }
}
const k = new F(), R = import.meta.url, q = R.slice(0, R.lastIndexOf("/") + 1), W = `${q}../css/`;
let O = 0;
function D(n) {
  try {
    const e = new DOMParser().parseFromString(n, "image/svg+xml");
    if (e.querySelector("parsererror")) return "";
    const s = (i) => {
      var r;
      if (i.tagName.toLowerCase() === "script") {
        (r = i.parentNode) == null || r.removeChild(i);
        return;
      }
      for (const o of Array.from(i.attributes))
        (o.name.startsWith("on") || o.value.toLowerCase().includes("javascript:")) && i.removeAttribute(o.name);
      Array.from(i.children).forEach(s);
    };
    return s(e.documentElement), new XMLSerializer().serializeToString(e.documentElement);
  } catch {
    return "";
  }
}
function g(n) {
  return String(n).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
class v extends HTMLElement {
  constructor() {
    super(), this._initialized = !1, this._resizeObserver = null, this._theme = document.documentElement.getAttribute("data-theme") || "default", this._prefix = this._getThemePrefix(this._theme), this.attachShadow({ mode: "open" }), this._container = document.createElement("div"), this._container.classList.add("component-root"), this._eventController = new AbortController(), this._injectBaseStyles(), this.shadowRoot.appendChild(this._container), this._onThemeChange = () => {
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
    t.rel = "stylesheet", t.href = `${W}base.css`, this.shadowRoot.appendChild(t);
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
class M extends v {
  constructor() {
    super(), this._resizeHandleBound = !1, this._dragController = null, this._observedScrollables = [], this.setAttribute("data-dd-role", "window"), this._winId = `dd-win-${++O}`, this.widthAttr = this.getAttribute("width"), this.heightAttr = this.getAttribute("height");
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
          <span class="win-title">${g(this.getAttribute("title") || "Window")}</span>
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
    k.register(this._winId, this, this.getAttribute("title") ?? "Window"), this._syncSizeFromAttributes(), this._setupResizeObserver(), this._bindButtons(), this._setupResizeHandle(), this._setupDragging(), this._applyControlIcons(), this._applyControlsDisabled(), this._bindFocusRaise();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), k.unregister(this._winId), this._dragController && (this._dragController.abort(), this._dragController = null);
  }
  _syncSizeFromAttributes() {
    const t = this.widthAttr, e = this.heightAttr;
    (t || e) && this.setAttribute("data-ddw-explicit", ""), t && this.style.setProperty("--ddw-w", t), e && this.style.setProperty("--ddw-h", e);
  }
  _bindButtons() {
    var s, i, r;
    const t = this.shadowRoot, e = (o) => (a) => {
      const l = a.currentTarget;
      if ((l == null ? void 0 : l.getAttribute("aria-disabled")) === "true") {
        a.preventDefault(), a.stopPropagation();
        return;
      }
      o();
    };
    (s = t.querySelector('[data-action="minimize"]')) == null || s.addEventListener("click", e(() => this.minimize())), (i = t.querySelector('[data-action="fullscreen"]')) == null || i.addEventListener("click", e(() => this.fullscreen())), (r = t.querySelector('[data-action="close"]')) == null || r.addEventListener("click", e(() => this.close()));
  }
  minimize() {
    var r;
    const t = this.shadowRoot.querySelector(".win"), e = this.getAttribute("minimize-animation"), s = e ? (r = window.DreamDeskAnimations) == null ? void 0 : r[e] : void 0, i = () => {
      this.state.isMinimized = !this.state.isMinimized, this.state.isMinimized ? this.setAttribute("minimized", "") : this.removeAttribute("minimized"), this.dispatchEvent(new CustomEvent("minimize", { detail: { isMinimized: this.state.isMinimized } }));
    };
    typeof s == "function" ? Promise.resolve(s(t, { defaultFns: { minimize: C, unminimize: E }, previousState: this.state.previousState })).then(i) : (!this.state.isMinimized ? C(t) : E(t), i());
  }
  fullscreen() {
    var o, a;
    const t = this, e = !this.state.isFullscreen;
    e && (this._freezeWindowState(), this.setAttribute("data-ddw-explicit", ""));
    const s = this.getAttribute(e ? "fullscreen-animation" : "unfullscreen-animation");
    let i = s ? (o = window.DreamDeskAnimations) == null ? void 0 : o[s] : void 0;
    if (!e && typeof i != "function") {
      const l = this.getAttribute("fullscreen-animation");
      i = l ? (a = window.DreamDeskAnimations) == null ? void 0 : a[l] : void 0;
    }
    const r = () => {
      this.state.isFullscreen = !this.state.isFullscreen, this.dispatchEvent(new CustomEvent("fullscreen", { detail: { isFullscreen: this.state.isFullscreen } }));
    };
    typeof i == "function" ? Promise.resolve(i(t, { previousState: this.state.previousState, isFullscreen: this.state.isFullscreen, defaultFns: { fullscreen: S, unfullscreen: L } })).then(r) : (e ? S(t, this.state.previousState) : L(t, this.state.previousState), r());
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
    var r, o;
    const t = new ResizeObserver((a) => {
      a.forEach((l) => this._checkOverflow(l.target));
    }), e = this.shadowRoot.querySelector("slot"), s = (e == null ? void 0 : e.assignedElements({ flatten: !0 })) ?? [], i = () => {
      const a = ".win-content[scrollable], [scrollable], p.scrollable, .scrollable";
      this._observedScrollables.forEach((l) => t.unobserve(l)), this._observedScrollables = [], s.forEach((l) => {
        var b, c;
        const d = (b = l.matches) != null && b.call(l, a) ? [l] : [], u = ((c = l.querySelectorAll) == null ? void 0 : c.call(l, a)) ?? [];
        [...d, ...Array.from(u)].forEach((h) => {
          h.classList.forEach((m) => {
            m.endsWith("-scroll") && h.classList.remove(m);
          }), t.observe(h), this._observedScrollables.push(h), this._checkOverflow(h);
        });
      });
    };
    i(), document.addEventListener("dreamdesk-theme-changed", () => {
      this._theme = document.documentElement.getAttribute("data-theme") || "default", this._prefix = this._getThemePrefix(this._theme), i();
    }, { signal: ((r = this._eventController) == null ? void 0 : r.signal) ?? void 0 }), e == null || e.addEventListener("slotchange", i, { signal: ((o = this._eventController) == null ? void 0 : o.signal) ?? void 0 }), this._resizeObserver = t;
  }
  _checkOverflow(t) {
    t.classList.toggle("overflowing", t.scrollHeight > t.clientHeight || t.scrollWidth > t.clientWidth);
  }
  _setupResizeHandle() {
    var s;
    const t = this.shadowRoot.querySelector(".win");
    if (!t) return;
    let e = t.querySelector(".win-resize-handle");
    if (!this._resizable) {
      e == null || e.remove(), this._resizeHandleBound = !1;
      return;
    }
    e || (e = document.createElement("div"), e.className = "win-resize-handle", t.appendChild(e)), !this._resizeHandleBound && (this._resizeHandleBound = !0, P({
      handle: e,
      host: this,
      signal: (s = this._eventController) == null ? void 0 : s.signal,
      disabled: () => {
        var i;
        return !!((i = this.state) != null && i.isFullscreen);
      },
      explicitAttr: "data-ddw-explicit"
    }));
  }
  _setupDragging() {
    var e;
    const t = this.shadowRoot.querySelector(".win-header");
    if (t) {
      if (!this._movable) {
        t.style.cursor = "default", (e = this._dragController) == null || e.abort(), this._dragController = null;
        return;
      }
      this._dragController || (this._dragController = new AbortController(), t.style.cursor = "move", T({
        handle: t,
        host: this,
        signal: this._dragController.signal,
        exclude: ".win-controls",
        disabled: () => {
          var s;
          return !this._movable || !!((s = this.state) != null && s.isFullscreen) && this.getAttribute("fullscreen-mode") !== "expand";
        },
        onStart: (s) => {
          this.setAttribute("data-ddw-explicit", ""), this.style.setProperty("--ddw-w", `${s.width}px`), this.style.setProperty("--ddw-h", `${s.height}px`);
          const i = getComputedStyle(this).position;
          (i === "static" || i === "relative") && (this.style.position = "absolute", this.style.left = `${s.left + (window.scrollX || 0)}px`, this.style.top = `${s.top + (window.scrollY || 0)}px`), k.raise(this._winId);
        }
      }));
    }
  }
  _bindFocusRaise() {
    var t, e;
    (e = this.shadowRoot.querySelector(".win")) == null || e.addEventListener("pointerdown", () => k.raise(this._winId), {
      signal: ((t = this._eventController) == null ? void 0 : t.signal) ?? void 0
    });
  }
  _applyControlIcons() {
    const t = this.shadowRoot, e = (s, i) => {
      var u;
      const r = t.querySelector(s);
      if (!r) return;
      const o = this.getAttribute(i);
      if (!o) return;
      const a = o.trim();
      let l = "";
      if (a.startsWith("<svg") ? l = D(a) : (u = window.DreamDeskIcons) != null && u[a] && (l = D(window.DreamDeskIcons[a])), !l) return;
      r.innerHTML = l, r.style.backgroundImage = "none";
      const d = r.querySelector("svg");
      d && (d.setAttribute("aria-hidden", "true"), d.setAttribute("focusable", "false"));
    };
    e(".btn--minimize", "minimize-icon"), e(".btn--fullscreen", "fullscreen-icon"), e(".btn--close", "close-icon");
  }
  _applyControlsDisabled() {
    const t = this.shadowRoot, e = (s, i) => {
      const r = t.querySelector(s);
      if (!r) return;
      const o = this.getAttribute(i), a = o !== null && o !== "false" && o !== "0";
      if (r.setAttribute("aria-disabled", String(a)), a) {
        r.setAttribute("tabindex", "-1");
        const l = o && o !== "true" && o !== "1" ? o : this.getAttribute(`${i}-tooltip`);
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
class H extends v {
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
      this._segments.forEach((o, a) => {
        const { width: l, marginRight: d } = getComputedStyle(o), u = parseFloat(l) + (parseFloat(d) || 0);
        s ? (o.style.backgroundImage = "var(--color-progress-gradient, none)", o.style.backgroundSize = `${r}px 100%`, o.style.backgroundPosition = `-${a * u}px 0`, o.style.backgroundRepeat = "no-repeat", o.style.backgroundColor = "transparent") : (o.style.backgroundImage = "none", o.style.backgroundColor = "var(--color-progress-segment, #a8edea)");
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
        const b = t.getBoundingClientRect().width, c = Math.floor((b + 1) / 11), h = c * 11 - 1;
        t.innerHTML = "", this._segments = [];
        for (let m = 0; m < c; m++) {
          const p = document.createElement("div");
          p.className = "progress-segment", p.style.cssText = `width:10px;height:20px;margin-right:${m < c - 1 ? 1 : 0}px`, s && (p.style.backgroundImage = "var(--color-progress-gradient, none)", p.style.backgroundSize = `${h}px 100%`, p.style.backgroundPosition = `-${m * 11}px 0`, p.style.backgroundRepeat = "no-repeat"), t.appendChild(p), this._segments.push(p);
        }
        this._updateProgress();
      };
      requestAnimationFrame(r), (i = this._progressResizeObserver) == null || i.disconnect();
      let o = null;
      this._progressResizeObserver = new ResizeObserver(() => {
        o && clearTimeout(o), o = setTimeout(r, 50);
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
const w = class w extends v {
  static get observedAttributes() {
    return ["variant", "action", "size", "min-width", "width", "height", "font-size", "px", "py", "disabled"];
  }
  constructor() {
    super(), this.variant = this.getAttribute("variant") || "primary", this.action = this.getAttribute("action"), this.setAttribute("data-dd-role", "button");
  }
  template() {
    const t = this.action ? `data-action="${g(this.action)}"` : "", e = this.action ? `aria-label="${g(this.action)}"` : "", s = this.getAttribute("disabled"), i = s !== null && s !== "false" && s !== "0" ? 'disabled aria-disabled="true"' : "";
    return `<button class="btn btn--${g(this.variant)}" ${t} ${e} ${i}><slot></slot></button>`;
  }
  connectedCallback() {
    super.connectedCallback(), this._applyButtonSizeOverrides(), this._syncDisabled();
  }
  attributeChangedCallback(t, e, s) {
    var r, o;
    if (e === s || t === "size") return;
    if (t === "disabled") {
      this._syncDisabled();
      return;
    }
    if (t === "variant") {
      this.variant = s ?? "primary";
      const a = (r = this.shadowRoot) == null ? void 0 : r.querySelector("button");
      a && (a.className = `btn btn--${this.variant}`);
      return;
    }
    if (t === "action") {
      this.action = s;
      const a = (o = this.shadowRoot) == null ? void 0 : o.querySelector("button");
      a && (s ? (a.setAttribute("data-action", s), a.setAttribute("aria-label", s)) : (a.removeAttribute("data-action"), a.removeAttribute("aria-label")));
      return;
    }
    const i = w.sizeVarMap[t];
    i && (s == null ? this.style.removeProperty(i) : this.style.setProperty(i, s));
  }
  _applyButtonSizeOverrides() {
    Object.entries(w.sizeVarMap).forEach(([t, e]) => {
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
w.sizeVarMap = {
  "min-width": "--dd-btn-min-w",
  width: "--dd-btn-w",
  height: "--dd-btn-h",
  "font-size": "--dd-btn-fs",
  px: "--dd-btn-px",
  py: "--dd-btn-py"
};
let x = w;
class j extends v {
  static get observedAttributes() {
    return ["type", "message"];
  }
  constructor() {
    super(), this._type = this.getAttribute("type") || "notification", this._message = this.getAttribute("message") || "";
  }
  template() {
    return `<div class="toast toast-${g(this._type)}">
      <button class="toast-btn--close" data-action="close" aria-label="close">&times;</button>
      ${g(this._message)}
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
class Z extends v {
  static get observedAttributes() {
    return ["type", "label", "id", "value", "placeholder"];
  }
  constructor() {
    super(), this._type = this.getAttribute("type") || "text", this._label = this.getAttribute("label") || "", this._inputId = this.getAttribute("id") || "", this._value = this.getAttribute("value") || "", this._placeholder = this.getAttribute("placeholder") || "";
  }
  template() {
    return `${this._label ? `<label class="input-label" for="${g(this._inputId)}">${g(this._label)}</label>` : ""}
      <input type="${g(this._type)}" id="${g(this._inputId)}" class="dreamdesk-input"
        value="${g(this._value)}" placeholder="${g(this._placeholder)}" />`;
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
class N extends v {
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
class G extends M {
  template() {
    return `<div class="win terminal-win">
      <div class="win-header">
        <span class="win-title">${g(this.getAttribute("title") || "Terminal")}</span>
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
customElements.define("dreamdesk-window", M);
customElements.define("dreamdesk-progress-bar", H);
customElements.define("dreamdesk-button", x);
customElements.define("dreamdesk-toast", j);
customElements.define("dreamdesk-input", Z);
customElements.define("dreamdesk-toggle", N);
customElements.define("dreamdesk-terminal-window", G);
export {
  U as DreamDeskThemeManager,
  F as WindowManager,
  z as cancelRunningAnimations,
  $ as close,
  k as defaultWindowManager,
  S as fullscreen,
  C as minimize,
  T as setupDrag,
  P as setupResize,
  L as unfullscreen,
  E as unminimize
};
