function M(n) {
  var e;
  const t = ((e = n == null ? void 0 : n.getAnimations) == null ? void 0 : e.call(n)) ?? [];
  for (const s of t) s.cancel();
}
function P(n) {
  M(n), n.style.transformOrigin = "50% 100%", n.animate(
    [{ transform: "scale(1)" }, { transform: "scale(0)" }],
    { duration: 300, easing: "ease-in", fill: "forwards" }
  );
}
function R(n) {
  M(n), n.style.transformOrigin = "50% 100%", n.animate(
    [{ transform: "scale(0)" }, { transform: "scale(1)" }],
    { duration: 300, easing: "ease-out" }
  );
}
function I(n, t) {
  M(n);
  const e = window.innerWidth, s = window.innerHeight, i = t.top - (window.scrollY || 0), r = t.left - (window.scrollX || 0), o = t.width, a = t.height;
  n.style.position = "fixed", n.style.top = "0", n.style.left = "0", n.style.width = "100vw", n.style.height = "100vh", n.style.setProperty("--ddw-w", "100vw"), n.style.setProperty("--ddw-h", "100vh"), n.style.zIndex = "9999";
  const l = o / e, c = a / s, m = r + o / 2 - e / 2, p = i + a / 2 - s / 2;
  n.animate(
    [
      { transform: `translate(${m}px, ${p}px) scale(${l}, ${c})` },
      { transform: "none" }
    ],
    { duration: 500, easing: "cubic-bezier(0.2, 0, 0, 1)" }
  );
}
function F(n, t) {
  M(n);
  const e = window.innerWidth, s = window.innerHeight, i = t.width, r = t.height, o = t.top - (window.scrollY || 0), a = t.left - (window.scrollX || 0), l = i / e, c = r / s, m = a + i / 2 - e / 2, p = o + r / 2 - s / 2, b = n.animate(
    [
      { transform: "none" },
      { transform: `translate(${m}px, ${p}px) scale(${l}, ${c})` }
    ],
    { duration: 300, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" }
  ), d = () => {
    n.style.position = t.position || "absolute", n.style.top = `${Math.round(t.top)}px`, n.style.left = `${Math.round(t.left)}px`, n.style.width = "", n.style.height = "", n.style.setProperty("--ddw-w", `${Math.round(i)}px`), n.style.setProperty("--ddw-h", `${Math.round(r)}px`), t.zIndex ? n.style.zIndex = t.zIndex : n.style.removeProperty("z-index");
  };
  b.onfinish = () => {
    d(), n.getAnimations().forEach((v) => v.cancel());
  }, b.oncancel = d;
}
function q(n, t) {
  n.animate(
    [{ opacity: "1", transform: "scale(1)" }, { opacity: "0", transform: "scale(0.95)" }],
    { duration: 300, easing: "ease", fill: "forwards" }
  ).onfinish = () => t == null ? void 0 : t();
}
const nt = {
  current: "default",
  setTheme(n) {
    this.current = n, document.documentElement.setAttribute("data-theme", n), document.dispatchEvent(new CustomEvent("dreamdesk-theme-changed", { detail: { theme: n } }));
  },
  getTheme() {
    return this.current;
  }
};
function B({ handle: n, host: t, container: e, reservedBottom: s = 0, signal: i, disabled: r, exclude: o, getBounds: a, onStart: l }) {
  let c = !1, m = 0, p = 0, b = 0, d = 0, v = 0, C = 0, u = null, h = 0, _ = 0;
  const w = () => {
    t.style.left = `${Math.max(0, Math.min(h - v, b))}px`, t.style.top = `${Math.max(0, Math.min(_ - C, d))}px`;
  }, y = (f) => {
    c && (h = f.clientX - m, _ = f.clientY - p, u && cancelAnimationFrame(u), u = requestAnimationFrame(() => {
      w(), u = null;
    }));
  }, z = () => {
    c = !1, document.removeEventListener("pointermove", y, { capture: !0 }), document.removeEventListener("pointerup", z, { capture: !0 }), u && (cancelAnimationFrame(u), u = null, w());
  }, $ = (f) => {
    if (r != null && r() || o && f.target.closest(o)) return;
    M(t);
    const k = t.getBoundingClientRect(), A = e == null ? void 0 : e.getBoundingClientRect();
    v = (A == null ? void 0 : A.left) ?? 0, C = (A == null ? void 0 : A.top) ?? 0, m = f.clientX - k.left, p = f.clientY - k.top;
    const T = (a == null ? void 0 : a()) ?? {
      maxLeft: A ? A.width - k.width : Math.max(0, window.innerWidth - k.width),
      maxTop: A ? A.height - k.height - s : Math.max(0, window.innerHeight - k.height - s)
    };
    b = T.maxLeft, d = T.maxTop, l == null || l(k), c = !0, document.addEventListener("pointermove", y, { capture: !0 }), document.addEventListener("pointerup", z, { capture: !0 });
  }, E = i ? { signal: i } : {};
  return n.addEventListener("pointerdown", $, E), () => {
    n.removeEventListener("pointerdown", $), document.removeEventListener("pointermove", y, { capture: !0 }), document.removeEventListener("pointerup", z, { capture: !0 }), u && cancelAnimationFrame(u);
  };
}
function X({ handle: n, host: t, signal: e, disabled: s, minWidth: i = 180, minHeight: r = 120, explicitAttr: o = "data-explicit" }) {
  let a = !1, l = 0, c = 0, m = 0, p = 0;
  const b = (u) => {
    a && (t.style.setProperty("--ddw-w", `${Math.max(i, m + u.clientX - l)}px`), t.style.setProperty("--ddw-h", `${Math.max(r, p + u.clientY - c)}px`), t.setAttribute(o, ""));
  }, d = () => {
    a = !1, document.removeEventListener("pointermove", b, { capture: !0 }), document.removeEventListener("pointerup", d, { capture: !0 });
  }, v = (u) => {
    if (s != null && s()) return;
    a = !0, l = u.clientX, c = u.clientY;
    const h = t.getBoundingClientRect();
    m = h.width, p = h.height, document.addEventListener("pointermove", b, { capture: !0 }), document.addEventListener("pointerup", d, { capture: !0 });
  }, C = e ? { signal: e } : {};
  return n.addEventListener("pointerdown", v, C), () => {
    n.removeEventListener("pointerdown", v), document.removeEventListener("pointermove", b, { capture: !0 }), document.removeEventListener("pointerup", d, { capture: !0 });
  };
}
const Y = 1e3;
class j {
  constructor() {
    this._registry = /* @__PURE__ */ new Map(), this._zStack = [], this._listeners = /* @__PURE__ */ new Set(), this._openRegistry = /* @__PURE__ */ new Map();
  }
  _notify() {
    this._listeners.forEach((t) => t());
  }
  _reassignZ() {
    this._zStack.forEach((t, e) => {
      const s = this._registry.get(t);
      s && (s.el.style.zIndex = String(Y + e));
    });
  }
  register(t, e, s, i) {
    this._registry.set(t, { id: t, title: s, icon: i == null ? void 0 : i.icon, el: e, isMinimized: !1, toggle: (i == null ? void 0 : i.toggle) ?? (() => {
    }) }), this._zStack.includes(t) || this._zStack.push(t), this._reassignZ(), this._notify();
  }
  unregister(t) {
    if (!this._registry.has(t)) return;
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
  registerOpen(t, e) {
    this._openRegistry.set(t, e);
  }
  open(t) {
    var s;
    const e = this._registry.get(t);
    if (e) {
      e.isMinimized ? e.toggle() : this.raise(t);
      return;
    }
    (s = this._openRegistry.get(t)) == null || s();
  }
  getWindows() {
    return Array.from(this._registry.values());
  }
  subscribe(t) {
    return this._listeners.add(t), () => this._listeners.delete(t);
  }
}
const S = new j();
function Z({ track: n, getValue: t, isBlocky: e, isGradient: s }) {
  let i = [], r = null, o = null, a = null;
  const l = 1, c = 10, m = c + l;
  function p() {
    const h = s(), _ = getComputedStyle(n), w = n.getBoundingClientRect().width - (parseFloat(_.borderLeftWidth) || 0) - (parseFloat(_.borderRightWidth) || 0), y = Math.max(1, Math.round((w + l) / m)), z = (w - (y - 1) * l) / y, $ = w;
    n.innerHTML = "", i = [];
    for (let E = 0; E < y; E++) {
      const f = document.createElement("div");
      f.className = "progress-segment", f.style.cssText = `width:${z}px;margin-right:${E < y - 1 ? l : 0}px`, h && (f.style.backgroundSize = `${$}px 100%`, f.style.backgroundPosition = `-${E * (z + l)}px 0`), n.appendChild(f), i.push(f);
    }
    b(t());
  }
  function b(h) {
    const _ = Math.min(Math.max(h, 0), 100), w = Math.floor(_ / 100 * i.length);
    i.forEach((y, z) => y.classList.toggle("progress-segment--active", z < w));
  }
  function d(h) {
    if (!r) return;
    const _ = Math.min(Math.max(h, 0), 100), w = s();
    if (r.style.width = `${_}%`, !w) {
      const y = getComputedStyle(r).getPropertyValue("--dd-progress-enable-hue-rotate").trim();
      r.style.filter = y === "0" ? "none" : `hue-rotate(${_ * 3.6}deg)`;
    }
    r.classList.toggle("progress-bar--complete", h >= 100);
  }
  function v() {
    const h = e(), _ = s();
    n.classList.toggle("progress-track--gradient", h && _), h ? (o == null || o.disconnect(), p(), o = new ResizeObserver(() => {
      a && clearTimeout(a), a = setTimeout(p, 50);
    }), o.observe(n)) : (r = n.querySelector(".progress-bar"), d(t()));
  }
  function C(h) {
    e() ? b(h) : d(h);
  }
  function u() {
    o == null || o.disconnect(), a && clearTimeout(a);
  }
  return { update: C, rebuild: v, destroy: u };
}
const W = import.meta.url, N = W.slice(0, W.lastIndexOf("/") + 1), U = `${N}../css/`;
let G = 0;
function H(n) {
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
class x extends HTMLElement {
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
    t.rel = "stylesheet", t.href = `${U}base.css`, this.shadowRoot.appendChild(t);
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
class O extends x {
  constructor() {
    super(), this._resizeHandleBound = !1, this._dragController = null, this._observedScrollables = [], this.setAttribute("data-dd-role", "window"), this._winId = `dd-win-${++G}`, this.widthAttr = this.getAttribute("width"), this.heightAttr = this.getAttribute("height");
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
    S.register(this._winId, this, this.getAttribute("title") ?? "Window"), this._syncSizeFromAttributes(), this._setupResizeObserver(), this._bindButtons(), this._setupResizeHandle(), this._setupDragging(), this._applyControlIcons(), this._applyControlsDisabled(), this._bindFocusRaise();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), S.unregister(this._winId), this._dragController && (this._dragController.abort(), this._dragController = null);
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
      this.state.isMinimized = !this.state.isMinimized, this.state.isMinimized ? this.setAttribute("minimized", "") : this.removeAttribute("minimized"), this.state.isMinimized ? S.minimize(this._winId) : S.restore(this._winId), this.dispatchEvent(new CustomEvent("minimize", { detail: { isMinimized: this.state.isMinimized } }));
    };
    typeof s == "function" ? Promise.resolve(s(t, { defaultFns: { minimize: P, unminimize: R }, previousState: this.state.previousState })).then(i) : (!this.state.isMinimized ? P(t) : R(t), i());
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
    typeof i == "function" ? Promise.resolve(i(t, { previousState: this.state.previousState, isFullscreen: this.state.isFullscreen, defaultFns: { fullscreen: I, unfullscreen: F } })).then(r) : (e ? I(t, this.state.previousState) : F(t, this.state.previousState), r());
  }
  close() {
    var r;
    const t = this.shadowRoot.querySelector(".win"), e = this.getAttribute("close-animation"), s = e ? (r = window.DreamDeskAnimations) == null ? void 0 : r[e] : void 0, i = () => {
      this.style.display = "none", this.dispatchEvent(new CustomEvent("close"));
    };
    typeof s == "function" ? Promise.resolve(s(t, { defaultFns: { close: q } })).then(i) : q(t, i);
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
        var p, b;
        const c = (p = l.matches) != null && p.call(l, a) ? [l] : [], m = ((b = l.querySelectorAll) == null ? void 0 : b.call(l, a)) ?? [];
        [...c, ...Array.from(m)].forEach((d) => {
          d.classList.forEach((v) => {
            v.endsWith("-scroll") && d.classList.remove(v);
          }), t.observe(d), this._observedScrollables.push(d), this._checkOverflow(d);
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
    e || (e = document.createElement("div"), e.className = "win-resize-handle", t.appendChild(e)), !this._resizeHandleBound && (this._resizeHandleBound = !0, X({
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
      this._dragController || (this._dragController = new AbortController(), t.style.cursor = "move", B({
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
          (i === "static" || i === "relative") && (this.style.position = "absolute", this.style.left = `${s.left + (window.scrollX || 0)}px`, this.style.top = `${s.top + (window.scrollY || 0)}px`), S.raise(this._winId);
        }
      }));
    }
  }
  _bindFocusRaise() {
    var t, e;
    (e = this.shadowRoot.querySelector(".win")) == null || e.addEventListener("pointerdown", () => S.raise(this._winId), {
      signal: ((t = this._eventController) == null ? void 0 : t.signal) ?? void 0
    });
  }
  _applyControlIcons() {
    const t = this.shadowRoot, e = (s, i) => {
      var m;
      const r = t.querySelector(s);
      if (!r) return;
      const o = this.getAttribute(i);
      if (!o) return;
      const a = o.trim();
      let l = "";
      if (a.startsWith("<svg") ? l = H(a) : (m = window.DreamDeskIcons) != null && m[a] && (l = H(window.DreamDeskIcons[a])), !l) return;
      r.innerHTML = l, r.style.backgroundImage = "none";
      const c = r.querySelector("svg");
      c && (c.setAttribute("aria-hidden", "true"), c.setAttribute("focusable", "false"));
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
class J extends x {
  constructor() {
    super(), this._handle = null, this.setAttribute("data-dd-role", "progressbar"), this._value = parseFloat(this.getAttribute("value") ?? "0") || 0;
  }
  static get observedAttributes() {
    return ["value", "gradient", "blocky"];
  }
  template() {
    const t = ["progress-track", this.hasAttribute("blocky") ? "progress-track--blocky" : ""].filter(Boolean).join(" "), e = ["progress-bar", this.hasAttribute("gradient") ? "progress-bar--gradient" : ""].filter(Boolean).join(" ");
    return `<div class="${t}">${this.hasAttribute("blocky") ? "" : `<div class="${e}"></div>`}</div>`;
  }
  connectedCallback() {
    super.connectedCallback(), this._init();
  }
  attributeChangedCallback(t, e, s) {
    var i;
    e !== s && (t === "value" && (this._value = parseFloat(s ?? "0"), (i = this._handle) == null || i.update(this._value)), (t === "gradient" || t === "blocky") && (this._container.innerHTML = this.template(), this._init()));
  }
  themeChanged() {
    var t;
    (t = this._handle) == null || t.rebuild();
  }
  _init() {
    var e;
    const t = this.shadowRoot.querySelector(".progress-track");
    t && ((e = this._handle) == null || e.destroy(), this._handle = Z({
      track: t,
      getValue: () => this._value,
      isBlocky: () => this.hasAttribute("blocky"),
      isGradient: () => this.hasAttribute("gradient")
    }), this._handle.rebuild());
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._handle) == null || t.destroy(), this._handle = null;
  }
  get value() {
    return this._value;
  }
  set value(t) {
    this.setAttribute("value", String(t));
  }
}
class K extends x {
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
class Q extends HTMLElement {
  connectedCallback() {
    this.setAttribute("slot", "tab"), this.setAttribute("data-tab", ""), this.setAttribute("data-tab-index", this.getAttribute("index") ?? "0");
  }
}
class V extends x {
  connectedCallback() {
    var t;
    super.connectedCallback(), this.setAttribute("slot", "panel"), this.setAttribute("data-panel", ""), (t = this.querySelector("p")) == null || t.classList.add("win-content");
  }
  template() {
    return "<style>:host{display:none}:host(.active){display:block}</style><slot></slot>";
  }
}
const L = class L extends x {
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
    const i = L.sizeVarMap[t];
    i && (s == null ? this.style.removeProperty(i) : this.style.setProperty(i, s));
  }
  _applyButtonSizeOverrides() {
    Object.entries(L.sizeVarMap).forEach(([t, e]) => {
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
L.sizeVarMap = {
  "min-width": "--dd-btn-min-w",
  width: "--dd-btn-w",
  height: "--dd-btn-h",
  "font-size": "--dd-btn-fs",
  px: "--dd-btn-px",
  py: "--dd-btn-py"
};
let D = L;
class tt extends x {
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
class et extends x {
  static get observedAttributes() {
    return ["type", "label", "id", "value", "placeholder"];
  }
  constructor() {
    super(), this._type = this.getAttribute("type") || "text", this._label = this.getAttribute("label") || "", this._inputId = this.getAttribute("id") || "", this._value = this.getAttribute("value") || "", this._placeholder = this.getAttribute("placeholder") || "";
  }
  template() {
    return `<div style="${this._label ? "display:flex;align-items:center;gap:0.5rem" : ""}">
      ${this._label ? `<label class="input-label" for="${g(this._inputId)}">${g(this._label)}</label>` : ""}
      <input type="${g(this._type)}" id="${g(this._inputId)}" class="dreamdesk-input"
        value="${g(this._value)}" placeholder="${g(this._placeholder)}" />
    </div>`;
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
class st extends x {
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
class it extends O {
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
customElements.define("dreamdesk-tab", Q);
customElements.define("dreamdesk-tab-panel", V);
customElements.define("dreamdesk-tabs", K);
customElements.define("dreamdesk-window", O);
customElements.define("dreamdesk-progress-bar", J);
customElements.define("dreamdesk-button", D);
customElements.define("dreamdesk-toast", tt);
customElements.define("dreamdesk-input", et);
customElements.define("dreamdesk-toggle", st);
customElements.define("dreamdesk-terminal-window", it);
export {
  nt as DreamDeskThemeManager,
  j as WindowManager,
  M as cancelRunningAnimations,
  q as close,
  S as defaultWindowManager,
  I as fullscreen,
  P as minimize,
  B as setupDrag,
  Z as setupProgressBar,
  X as setupResize,
  F as unfullscreen,
  R as unminimize
};
