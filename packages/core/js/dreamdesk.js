const N = "cubic-bezier(0.2, 0, 0, 1)", H = "cubic-bezier(0.4, 0, 0.2, 1)", $ = {
  open: 260,
  close: 240,
  minimize: 340,
  unminimize: 340,
  fullscreen: 450,
  unfullscreen: 400,
  unsnap: 360
}, ot = () => {
  var s;
  return typeof window < "u" && !!((s = window.matchMedia) != null && s.call(window, "(prefers-reduced-motion: reduce)").matches);
}, M = (s) => ot() ? 1 : s;
function T(s) {
  var e, i;
  const t = ((e = s == null ? void 0 : s.getAnimations) == null ? void 0 : e.call(s)) ?? [];
  for (const n of t)
    (i = n.finished) == null || i.catch(() => {
    }), n.cancel();
}
function Et(s) {
  T(s), s.style.transformOrigin = "50% 50%", s.animate(
    [{ transform: "scale(0.9)", opacity: "0" }, { transform: "scale(1)", opacity: "1" }],
    { duration: M($.open), easing: N }
  );
}
function G(s) {
  T(s), s.style.transformOrigin = "50% 100%", s.animate(
    [{ transform: "scale(1)" }, { transform: "scale(0)" }],
    { duration: M($.minimize), easing: H, fill: "forwards" }
  );
}
function J(s) {
  T(s), s.style.transformOrigin = "50% 100%", s.animate(
    [{ transform: "scale(0)" }, { transform: "scale(1)" }],
    { duration: M($.unminimize), easing: N }
  );
}
function K(s, t) {
  T(s);
  const e = window.innerWidth, i = window.innerHeight, n = t.top - (window.scrollY || 0), r = t.left - (window.scrollX || 0), o = t.width, a = t.height;
  s.style.position = "fixed", s.style.top = "0", s.style.left = "0", s.style.width = "100vw", s.style.height = "100vh", s.style.setProperty("--ddw-w", "100vw"), s.style.setProperty("--ddw-h", "100vh"), s.style.zIndex = "9999";
  const l = o / e, c = a / i, p = r + o / 2 - e / 2, m = n + a / 2 - i / 2;
  s.animate(
    [
      { transform: `translate(${p}px, ${m}px) scale(${l}, ${c})` },
      { transform: "none" }
    ],
    { duration: M($.fullscreen), easing: N }
  );
}
function Q(s, t) {
  T(s);
  const e = window.innerWidth, i = window.innerHeight, n = t.width, r = t.height, o = t.top - (window.scrollY || 0), a = t.left - (window.scrollX || 0), l = n / e, c = r / i, p = a + n / 2 - e / 2, m = o + r / 2 - i / 2, f = s.animate(
    [
      { transform: "none" },
      { transform: `translate(${p}px, ${m}px) scale(${l}, ${c})` }
    ],
    { duration: M($.unfullscreen), easing: H, fill: "forwards" }
  ), h = () => {
    s.style.position = t.position || "absolute", s.style.top = `${Math.round(t.top)}px`, s.style.left = `${Math.round(t.left)}px`, s.style.width = "", s.style.height = "", s.style.setProperty("--ddw-w", `${Math.round(n)}px`), s.style.setProperty("--ddw-h", `${Math.round(r)}px`), t.zIndex ? s.style.zIndex = t.zIndex : s.style.removeProperty("z-index");
  };
  f.onfinish = () => {
    h(), s.getAnimations().forEach((b) => b.cancel());
  }, f.oncancel = h;
}
function at(s, t) {
  T(s);
  const e = s.getBoundingClientRect(), i = t.width / (e.width || 1), n = t.height / (e.height || 1), r = t.left + t.width / 2 - (e.left + e.width / 2), o = t.top + t.height / 2 - (e.top + e.height / 2);
  s.animate(
    [
      { transform: `translate(${r}px, ${o}px) scale(${i}, ${n})` },
      { transform: "none" }
    ],
    { duration: M($.unsnap), easing: H }
  );
}
function V(s, t) {
  const e = s.animate(
    [{ opacity: "1", transform: "scale(1)" }, { opacity: "0", transform: "scale(0.95)" }],
    { duration: M($.close), easing: H, fill: "forwards" }
  );
  e.onfinish = () => {
    e.cancel(), t == null || t();
  };
}
const Lt = {
  current: "default",
  setTheme(s) {
    this.current = s, document.documentElement.setAttribute("data-theme", s), document.dispatchEvent(new CustomEvent("dreamdesk-theme-changed", { detail: { theme: s } }));
  },
  getTheme() {
    return this.current;
  }
}, F = 20, q = 80;
function lt(s, t, e, i) {
  const n = s <= F, r = s >= e - F, o = t <= F, a = t >= i - F;
  return o && s <= q ? "top-left" : o && s >= e - q ? "top-right" : a && s <= q ? "bottom-left" : a && s >= e - q ? "bottom-right" : o ? "top" : n ? "left" : r ? "right" : "none";
}
function tt(s, t, e) {
  const i = t, n = e;
  switch (s) {
    case "top":
      return { top: 0, left: 0, width: i, height: n };
    case "left":
      return { top: 0, left: 0, width: i / 2, height: n };
    case "right":
      return { top: 0, left: i / 2, width: i / 2, height: n };
    case "top-left":
      return { top: 0, left: 0, width: i / 2, height: n / 2 };
    case "top-right":
      return { top: 0, left: i / 2, width: i / 2, height: n / 2 };
    case "bottom-left":
      return { top: n / 2, left: 0, width: i / 2, height: n / 2 };
    case "bottom-right":
      return { top: n / 2, left: i / 2, width: i / 2, height: n / 2 };
    default:
      return null;
  }
}
function ct({ handle: s, host: t, container: e, reservedBottom: i = 0, signal: n, disabled: r, exclude: o, getBounds: a, onStart: l, onSnap: c, onSnapCommit: p, onEnd: m }) {
  let f = !1, h = 0, b = 0, C = 0, D = 0, d = 0, g = 0, u = null, w = 0, S = 0, k = "none";
  const E = () => {
    t.style.left = `${Math.max(0, Math.min(w - d, C))}px`, t.style.top = `${Math.max(0, Math.min(S - g, D))}px`;
  }, A = (z) => {
    f && (w = z.clientX - h, S = z.clientY - b, u && cancelAnimationFrame(u), u = requestAnimationFrame(() => {
      if (E(), u = null, c && e) {
        const _ = e.getBoundingClientRect(), v = z.clientX - _.left, I = z.clientY - _.top, B = lt(v, I, _.width, _.height - i);
        B !== k && (k = B, c(B));
      }
    }));
  }, W = () => {
    f = !1, document.removeEventListener("pointermove", A, { capture: !0 }), document.removeEventListener("pointerup", W, { capture: !0 }), u && (cancelAnimationFrame(u), u = null, E()), p && k !== "none" && p(k), c && c("none"), k = "none", m == null || m();
  }, U = (z) => {
    if (r != null && r() || o && z.target.closest(o)) return;
    T(t);
    const _ = t.getBoundingClientRect(), v = e == null ? void 0 : e.getBoundingClientRect();
    d = (v == null ? void 0 : v.left) ?? 0, g = (v == null ? void 0 : v.top) ?? 0, h = z.clientX - _.left, b = z.clientY - _.top;
    const I = (a == null ? void 0 : a()) ?? {
      maxLeft: v ? v.width - _.width : Math.max(0, window.innerWidth - _.width),
      maxTop: v ? v.height - _.height - i : Math.max(0, window.innerHeight - _.height - i)
    };
    C = I.maxLeft, D = I.maxTop, l == null || l(_), f = !0, document.addEventListener("pointermove", A, { capture: !0 }), document.addEventListener("pointerup", W, { capture: !0 });
  }, rt = n ? { signal: n } : {};
  return s.addEventListener("pointerdown", U, rt), () => {
    s.removeEventListener("pointerdown", U), document.removeEventListener("pointermove", A, { capture: !0 }), document.removeEventListener("pointerup", W, { capture: !0 }), u && cancelAnimationFrame(u);
  };
}
function dt({ handle: s, host: t, signal: e, disabled: i, minWidth: n = 180, minHeight: r = 120, explicitAttr: o = "data-explicit", onEnd: a }) {
  let l = !1, c = 0, p = 0, m = 0, f = 0;
  const h = (d) => {
    l && (t.style.setProperty("--ddw-w", `${Math.max(n, m + d.clientX - c)}px`), t.style.setProperty("--ddw-h", `${Math.max(r, f + d.clientY - p)}px`), t.setAttribute(o, ""));
  }, b = () => {
    l = !1, document.removeEventListener("pointermove", h, { capture: !0 }), document.removeEventListener("pointerup", b, { capture: !0 }), a == null || a();
  }, C = (d) => {
    if (i != null && i()) return;
    l = !0, c = d.clientX, p = d.clientY;
    const g = t.getBoundingClientRect();
    m = g.width, f = g.height, document.addEventListener("pointermove", h, { capture: !0 }), document.addEventListener("pointerup", b, { capture: !0 });
  }, D = e ? { signal: e } : {};
  return s.addEventListener("pointerdown", C, D), () => {
    s.removeEventListener("pointerdown", C), document.removeEventListener("pointermove", h, { capture: !0 }), document.removeEventListener("pointerup", b, { capture: !0 });
  };
}
const Z = "dreamdesk:win:";
function $t(s, t) {
  try {
    localStorage.setItem(Z + s, JSON.stringify(t));
  } catch {
  }
}
function Mt(s) {
  try {
    const t = localStorage.getItem(Z + s);
    return t ? JSON.parse(t) : null;
  } catch {
    return null;
  }
}
function Tt(s) {
  try {
    localStorage.removeItem(Z + s);
  } catch {
  }
}
const ht = 1e3, et = 24, ut = 8;
class pt {
  constructor() {
    this._registry = /* @__PURE__ */ new Map(), this._zStack = [], this._listeners = /* @__PURE__ */ new Set(), this._openRegistry = /* @__PURE__ */ new Map(), this._closeRegistry = /* @__PURE__ */ new Map(), this._cascadeCount = 0;
  }
  getCascadeOffset() {
    const t = this._cascadeCount % ut;
    return this._cascadeCount++, { dx: t * et, dy: t * et };
  }
  _notify() {
    this._listeners.forEach((t) => t());
  }
  _reassignZ() {
    this._zStack.forEach((t, e) => {
      const i = this._registry.get(t);
      i && (i.el.style.zIndex = String(ht + e));
    });
  }
  register(t, e, i, n) {
    this._registry.set(t, { id: t, title: i, icon: n == null ? void 0 : n.icon, el: e, isMinimized: !1, toggle: (n == null ? void 0 : n.toggle) ?? (() => {
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
  registerClose(t, e) {
    this._closeRegistry.set(t, e);
  }
  close(t) {
    var e;
    (e = this._closeRegistry.get(t)) == null || e();
  }
  open(t) {
    var i;
    const e = this._registry.get(t);
    if (e) {
      e.isMinimized ? e.toggle() : this.raise(t);
      return;
    }
    (i = this._openRegistry.get(t)) == null || i();
  }
  getWindows() {
    return Array.from(this._registry.values());
  }
  subscribe(t) {
    return this._listeners.add(t), () => this._listeners.delete(t);
  }
}
const R = new pt();
function mt({ track: s, getValue: t, isBlocky: e, isGradient: i }) {
  let n = [], r = null, o = null, a = null;
  const l = 1, c = 10, p = c + l;
  function m() {
    const d = i(), g = getComputedStyle(s), u = s.getBoundingClientRect().width - (parseFloat(g.borderLeftWidth) || 0) - (parseFloat(g.borderRightWidth) || 0), w = Math.max(1, Math.round((u + l) / p)), S = (u - (w - 1) * l) / w, k = u;
    s.innerHTML = "", n = [];
    for (let E = 0; E < w; E++) {
      const A = document.createElement("div");
      A.className = "progress-segment", A.style.cssText = `width:${S}px;margin-right:${E < w - 1 ? l : 0}px`, d && (A.style.backgroundSize = `${k}px 100%`, A.style.backgroundPosition = `-${E * (S + l)}px 0`), s.appendChild(A), n.push(A);
    }
    f(t());
  }
  function f(d) {
    const g = Math.min(Math.max(d, 0), 100), u = Math.floor(g / 100 * n.length);
    n.forEach((w, S) => w.classList.toggle("progress-segment--active", S < u));
  }
  function h(d) {
    if (!r) return;
    const g = Math.min(Math.max(d, 0), 100), u = i();
    if (r.style.width = `${g}%`, !u) {
      const w = getComputedStyle(r).getPropertyValue("--dd-progress-enable-hue-rotate").trim();
      r.style.filter = w === "0" ? "none" : `hue-rotate(${g * 3.6}deg)`;
    }
    r.classList.toggle("progress-bar--complete", d >= 100);
  }
  function b() {
    const d = e(), g = i();
    s.classList.toggle("progress-track--gradient", d && g), d ? (o == null || o.disconnect(), m(), o = new ResizeObserver(() => {
      a && clearTimeout(a), a = setTimeout(m, 50);
    }), o.observe(s)) : (r = s.querySelector(".progress-bar"), h(t()));
  }
  function C(d) {
    e() ? f(d) : h(d);
  }
  function D() {
    o == null || o.disconnect(), a && clearTimeout(a);
  }
  return { update: C, rebuild: b, destroy: D };
}
let L = [], ft = 0;
const X = /* @__PURE__ */ new Set(), O = /* @__PURE__ */ new Map();
function j() {
  X.forEach((s) => s([...L]));
}
function Dt(s) {
  const { message: t, type: e = "notification", duration: i = 4e3, persistent: n = !1 } = s, r = `notif-${++ft}`, o = { id: r, message: t, type: e, duration: i, persistent: n };
  if (L = [...L, o], j(), !n) {
    const a = setTimeout(() => gt(r), i);
    O.set(r, a);
  }
  return r;
}
function gt(s) {
  clearTimeout(O.get(s)), O.delete(s), L = L.filter((t) => t.id !== s), j();
}
function Rt() {
  O.forEach((s) => clearTimeout(s)), O.clear(), L = [], j();
}
function Pt(s) {
  return X.add(s), s([...L]), () => X.delete(s);
}
const st = import.meta.url, bt = st.slice(0, st.lastIndexOf("/") + 1), yt = `${bt}../css/`;
let _t = 0;
function it(s) {
  try {
    const e = new DOMParser().parseFromString(s, "image/svg+xml");
    if (e.querySelector("parsererror")) return "";
    const i = (n) => {
      var r;
      if (n.tagName.toLowerCase() === "script") {
        (r = n.parentNode) == null || r.removeChild(n);
        return;
      }
      for (const o of Array.from(n.attributes))
        (o.name.startsWith("on") || o.value.toLowerCase().includes("javascript:")) && n.removeAttribute(o.name);
      Array.from(n.children).forEach(i);
    };
    return i(e.documentElement), new XMLSerializer().serializeToString(e.documentElement);
  } catch {
    return "";
  }
}
function y(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
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
    t.rel = "stylesheet", t.href = `${yt}base.css`, this.shadowRoot.appendChild(t);
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
class nt extends x {
  constructor() {
    super(), this._resizeHandleBound = !1, this._dragController = null, this._observedScrollables = [], this._snapOverlay = null, this._preSnapState = null, this.setAttribute("data-dd-role", "window"), this._winId = `dd-win-${++_t}`, this.widthAttr = this.getAttribute("width"), this.heightAttr = this.getAttribute("height");
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
          <span class="win-title">${y(this.getAttribute("title") || "Window")}</span>
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
    R.register(this._winId, this, this.getAttribute("title") ?? "Window"), this._syncSizeFromAttributes(), this._setupResizeObserver(), this._bindButtons(), this._setupResizeHandle(), this._setupDragging(), this._applyControlIcons(), this._applyControlsDisabled(), this._bindFocusRaise();
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), R.unregister(this._winId), this._dragController && (this._dragController.abort(), this._dragController = null), (t = this._snapOverlay) == null || t.remove(), this._snapOverlay = null;
  }
  _syncSizeFromAttributes() {
    const t = this.widthAttr, e = this.heightAttr;
    (t || e) && this.setAttribute("data-ddw-explicit", ""), t && this.style.setProperty("--ddw-w", t), e && this.style.setProperty("--ddw-h", e);
  }
  _bindButtons() {
    var i, n, r;
    const t = this.shadowRoot, e = (o) => (a) => {
      const l = a.currentTarget;
      if ((l == null ? void 0 : l.getAttribute("aria-disabled")) === "true") {
        a.preventDefault(), a.stopPropagation();
        return;
      }
      o();
    };
    (i = t.querySelector('[data-action="minimize"]')) == null || i.addEventListener("click", e(() => this.minimize())), (n = t.querySelector('[data-action="fullscreen"]')) == null || n.addEventListener("click", e(() => this.fullscreen())), (r = t.querySelector('[data-action="close"]')) == null || r.addEventListener("click", e(() => this.close()));
  }
  minimize() {
    var r;
    const t = this.shadowRoot.querySelector(".win"), e = this.getAttribute("minimize-animation"), i = e ? (r = window.DreamDeskAnimations) == null ? void 0 : r[e] : void 0, n = () => {
      this.state.isMinimized = !this.state.isMinimized, this.state.isMinimized ? this.setAttribute("minimized", "") : this.removeAttribute("minimized"), this.state.isMinimized ? R.minimize(this._winId) : R.restore(this._winId), this.dispatchEvent(new CustomEvent("minimize", { detail: { isMinimized: this.state.isMinimized } }));
    };
    typeof i == "function" ? Promise.resolve(i(t, { defaultFns: { minimize: G, unminimize: J }, previousState: this.state.previousState })).then(n) : (!this.state.isMinimized ? G(t) : J(t), n());
  }
  fullscreen() {
    var o, a;
    const t = this;
    if (!this.state.isFullscreen && this._preSnapState) {
      const l = this._preSnapState;
      this._preSnapState = null;
      const c = this.getBoundingClientRect();
      this.style.left = l.left, this.style.top = l.top, this.style.setProperty("--ddw-w", l.width), this.style.setProperty("--ddw-h", l.height), at(this, c);
      return;
    }
    const e = !this.state.isFullscreen;
    e && (this._freezeWindowState(), this.setAttribute("data-ddw-explicit", ""));
    const i = this.getAttribute(e ? "fullscreen-animation" : "unfullscreen-animation");
    let n = i ? (o = window.DreamDeskAnimations) == null ? void 0 : o[i] : void 0;
    if (!e && typeof n != "function") {
      const l = this.getAttribute("fullscreen-animation");
      n = l ? (a = window.DreamDeskAnimations) == null ? void 0 : a[l] : void 0;
    }
    const r = () => {
      this.state.isFullscreen = !this.state.isFullscreen, this.dispatchEvent(new CustomEvent("fullscreen", { detail: { isFullscreen: this.state.isFullscreen } }));
    };
    typeof n == "function" ? Promise.resolve(n(t, { previousState: this.state.previousState, isFullscreen: this.state.isFullscreen, defaultFns: { fullscreen: K, unfullscreen: Q } })).then(r) : (e ? K(t, this.state.previousState) : Q(t, this.state.previousState), r());
  }
  close() {
    var r;
    const t = this.shadowRoot.querySelector(".win"), e = this.getAttribute("close-animation"), i = e ? (r = window.DreamDeskAnimations) == null ? void 0 : r[e] : void 0, n = () => {
      this.style.display = "none", this.dispatchEvent(new CustomEvent("close"));
    };
    typeof i == "function" ? Promise.resolve(i(t, { defaultFns: { close: V } })).then(n) : V(t, n);
  }
  _freezeWindowState() {
    const t = this.getBoundingClientRect(), e = window.scrollY || 0, i = window.scrollX || 0, n = getComputedStyle(this);
    this.state.previousState = {
      top: t.top + e,
      left: t.left + i,
      width: t.width,
      height: t.height,
      position: n.position || "relative",
      zIndex: n.zIndex === "auto" ? "" : n.zIndex
    };
  }
  _setupResizeObserver() {
    var r, o;
    const t = new ResizeObserver((a) => {
      a.forEach((l) => this._checkOverflow(l.target));
    }), e = this.shadowRoot.querySelector("slot"), i = (e == null ? void 0 : e.assignedElements({ flatten: !0 })) ?? [], n = () => {
      const a = ".win-content[scrollable], [scrollable], p.scrollable, .scrollable";
      this._observedScrollables.forEach((l) => t.unobserve(l)), this._observedScrollables = [], i.forEach((l) => {
        var m, f;
        const c = (m = l.matches) != null && m.call(l, a) ? [l] : [], p = ((f = l.querySelectorAll) == null ? void 0 : f.call(l, a)) ?? [];
        [...c, ...Array.from(p)].forEach((h) => {
          h.classList.forEach((b) => {
            b.endsWith("-scroll") && h.classList.remove(b);
          }), t.observe(h), this._observedScrollables.push(h), this._checkOverflow(h);
        });
      });
    };
    n(), document.addEventListener("dreamdesk-theme-changed", () => {
      this._theme = document.documentElement.getAttribute("data-theme") || "default", this._prefix = this._getThemePrefix(this._theme), n();
    }, { signal: ((r = this._eventController) == null ? void 0 : r.signal) ?? void 0 }), e == null || e.addEventListener("slotchange", n, { signal: ((o = this._eventController) == null ? void 0 : o.signal) ?? void 0 }), this._resizeObserver = t;
  }
  _checkOverflow(t) {
    t.classList.toggle("overflowing", t.scrollHeight > t.clientHeight || t.scrollWidth > t.clientWidth);
  }
  _setupResizeHandle() {
    var i;
    const t = this.shadowRoot.querySelector(".win");
    if (!t) return;
    let e = t.querySelector(".win-resize-handle");
    if (!this._resizable) {
      e == null || e.remove(), this._resizeHandleBound = !1;
      return;
    }
    e || (e = document.createElement("div"), e.className = "win-resize-handle", t.appendChild(e)), !this._resizeHandleBound && (this._resizeHandleBound = !0, dt({
      handle: e,
      host: this,
      signal: (i = this._eventController) == null ? void 0 : i.signal,
      disabled: () => {
        var n;
        return !!((n = this.state) != null && n.isFullscreen);
      },
      explicitAttr: "data-ddw-explicit"
    }));
  }
  _setupDragging() {
    var i;
    const t = this.shadowRoot.querySelector(".win-header");
    if (!t) return;
    if (!this._movable) {
      t.style.cursor = "default", (i = this._dragController) == null || i.abort(), this._dragController = null;
      return;
    }
    if (this._dragController) return;
    this._dragController = new AbortController(), t.style.cursor = "move";
    const e = this.parentElement;
    !this._snapOverlay && e && (this._snapOverlay = this._createSnapOverlay(), e.appendChild(this._snapOverlay)), ct({
      handle: t,
      host: this,
      container: e,
      signal: this._dragController.signal,
      exclude: ".win-controls",
      disabled: () => {
        var n;
        return !this._movable || !!((n = this.state) != null && n.isFullscreen) && this.getAttribute("fullscreen-mode") !== "expand";
      },
      onStart: (n) => {
        this._preSnapState = null, this.setAttribute("data-ddw-explicit", ""), this.style.setProperty("--ddw-w", `${n.width}px`), this.style.setProperty("--ddw-h", `${n.height}px`);
        const r = getComputedStyle(this).position;
        (r === "static" || r === "relative") && (this.style.position = "absolute", this.style.left = `${n.left + (window.scrollX || 0)}px`, this.style.top = `${n.top + (window.scrollY || 0)}px`), R.raise(this._winId);
      },
      onSnap: (n) => {
        const r = this._snapOverlay;
        if (!r || !e) return;
        if (n === "none") {
          r.style.display = "none";
          return;
        }
        const o = e.getBoundingClientRect(), a = tt(n, o.width, o.height);
        if (!a) {
          r.style.display = "none";
          return;
        }
        r.style.display = "block", r.style.left = `${a.left}px`, r.style.top = `${a.top}px`, r.style.width = `${a.width}px`, r.style.height = `${a.height}px`;
      },
      onSnapCommit: (n) => {
        if (this._snapOverlay && (this._snapOverlay.style.display = "none"), !e) return;
        const r = e.getBoundingClientRect(), o = tt(n, r.width, r.height);
        o && (this._preSnapState = {
          left: this.style.left || `${this.getBoundingClientRect().left}px`,
          top: this.style.top || `${this.getBoundingClientRect().top}px`,
          width: this.style.getPropertyValue("--ddw-w"),
          height: this.style.getPropertyValue("--ddw-h")
        }, this.style.left = `${o.left}px`, this.style.top = `${o.top}px`, this.style.setProperty("--ddw-w", `${o.width}px`), this.style.setProperty("--ddw-h", `${o.height}px`));
      }
    });
  }
  _createSnapOverlay() {
    const t = document.createElement("div");
    return t.style.cssText = "position:absolute;pointer-events:none;background:rgba(100,150,255,0.18);border:2px solid rgba(100,150,255,0.45);border-radius:4px;z-index:9998;transition:top 0.08s,left 0.08s,width 0.08s,height 0.08s;display:none;box-sizing:border-box", t;
  }
  _bindFocusRaise() {
    var t, e;
    (e = this.shadowRoot.querySelector(".win")) == null || e.addEventListener("pointerdown", () => R.raise(this._winId), {
      signal: ((t = this._eventController) == null ? void 0 : t.signal) ?? void 0
    });
  }
  _applyControlIcons() {
    const t = this.shadowRoot, e = (i, n) => {
      var p;
      const r = t.querySelector(i);
      if (!r) return;
      const o = this.getAttribute(n);
      if (!o) return;
      const a = o.trim();
      let l = "";
      if (a.startsWith("<svg") ? l = it(a) : (p = window.DreamDeskIcons) != null && p[a] && (l = it(window.DreamDeskIcons[a])), !l) return;
      r.innerHTML = l, r.style.backgroundImage = "none";
      const c = r.querySelector("svg");
      c && (c.setAttribute("aria-hidden", "true"), c.setAttribute("focusable", "false"));
    };
    e(".btn--minimize", "minimize-icon"), e(".btn--fullscreen", "fullscreen-icon"), e(".btn--close", "close-icon");
  }
  _applyControlsDisabled() {
    const t = this.shadowRoot, e = (i, n) => {
      const r = t.querySelector(i);
      if (!r) return;
      const o = this.getAttribute(n), a = o !== null && o !== "false" && o !== "0";
      if (r.setAttribute("aria-disabled", String(a)), a) {
        r.setAttribute("tabindex", "-1");
        const l = o && o !== "true" && o !== "1" ? o : this.getAttribute(`${n}-tooltip`);
        l ? r.setAttribute("data-tooltip", l) : r.removeAttribute("data-tooltip");
      } else
        r.removeAttribute("tabindex"), r.removeAttribute("data-tooltip");
    };
    e(".btn--minimize", "disable-minimize"), e(".btn--fullscreen", "disable-fullscreen"), e(".btn--close", "disable-close");
  }
  attributeChangedCallback(t, e, i) {
    if (e === i) return;
    const n = (r) => r === null || r === "" || r === "true" || r === "1";
    t === "resizable" && (this._resizable = n(i), this._initialized && this._setupResizeHandle()), t === "movable" && (this._movable = n(i), this._initialized && this._setupDragging()), t === "width" && (this.widthAttr = i, this._initialized && this._syncSizeFromAttributes()), t === "height" && (this.heightAttr = i, this._initialized && this._syncSizeFromAttributes()), ["minimize-icon", "fullscreen-icon", "close-icon"].includes(t) && this._applyControlIcons(), ["disable-minimize", "disable-fullscreen", "disable-close"].includes(t) && this._applyControlsDisabled();
  }
}
class vt extends x {
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
  attributeChangedCallback(t, e, i) {
    var n;
    e !== i && (t === "value" && (this._value = parseFloat(i ?? "0"), (n = this._handle) == null || n.update(this._value)), (t === "gradient" || t === "blocky") && (this._container.innerHTML = this.template(), this._init()));
  }
  themeChanged() {
    var t;
    (t = this._handle) == null || t.rebuild();
  }
  _init() {
    var e;
    const t = this.shadowRoot.querySelector(".progress-track");
    t && ((e = this._handle) == null || e.destroy(), this._handle = mt({
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
class wt extends x {
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
      const i = e.target.closest("[data-tab-index]");
      i && this._activateTab(parseInt(i.getAttribute("data-tab-index") ?? "0", 10));
    }, { signal: ((t = this._eventController) == null ? void 0 : t.signal) ?? void 0 }));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._tabListenerBound = !1;
  }
  _activateTab(t) {
    this.tabs.forEach((e, i) => e.classList.toggle("active", i === t)), this.panels.forEach((e, i) => e.classList.toggle("active", i === t)), this.activeIndex = t;
  }
}
class At extends HTMLElement {
  connectedCallback() {
    this.setAttribute("slot", "tab"), this.setAttribute("data-tab", ""), this.setAttribute("data-tab-index", this.getAttribute("index") ?? "0");
  }
}
class zt extends x {
  connectedCallback() {
    var t;
    super.connectedCallback(), this.setAttribute("slot", "panel"), this.setAttribute("data-panel", ""), (t = this.querySelector("p")) == null || t.classList.add("win-content");
  }
  template() {
    return "<style>:host{display:none}:host(.active){display:block}</style><slot></slot>";
  }
}
const P = class P extends x {
  static get observedAttributes() {
    return ["variant", "action", "size", "min-width", "width", "height", "font-size", "px", "py", "disabled"];
  }
  constructor() {
    super(), this.variant = this.getAttribute("variant") || "primary", this.action = this.getAttribute("action"), this.setAttribute("data-dd-role", "button");
  }
  template() {
    const t = this.action ? `data-action="${y(this.action)}"` : "", e = this.action ? `aria-label="${y(this.action)}"` : "", i = this.getAttribute("disabled"), n = i !== null && i !== "false" && i !== "0" ? 'disabled aria-disabled="true"' : "";
    return `<button class="btn btn--${y(this.variant)}" ${t} ${e} ${n}><slot></slot></button>`;
  }
  connectedCallback() {
    super.connectedCallback(), this._applyButtonSizeOverrides(), this._syncDisabled();
  }
  attributeChangedCallback(t, e, i) {
    var r, o;
    if (e === i || t === "size") return;
    if (t === "disabled") {
      this._syncDisabled();
      return;
    }
    if (t === "variant") {
      this.variant = i ?? "primary";
      const a = (r = this.shadowRoot) == null ? void 0 : r.querySelector("button");
      a && (a.className = `btn btn--${this.variant}`);
      return;
    }
    if (t === "action") {
      this.action = i;
      const a = (o = this.shadowRoot) == null ? void 0 : o.querySelector("button");
      a && (i ? (a.setAttribute("data-action", i), a.setAttribute("aria-label", i)) : (a.removeAttribute("data-action"), a.removeAttribute("aria-label")));
      return;
    }
    const n = P.sizeVarMap[t];
    n && (i == null ? this.style.removeProperty(n) : this.style.setProperty(n, i));
  }
  _applyButtonSizeOverrides() {
    Object.entries(P.sizeVarMap).forEach(([t, e]) => {
      const i = this.getAttribute(t);
      i != null && this.style.setProperty(e, i);
    });
  }
  _syncDisabled() {
    var i;
    const t = (i = this.shadowRoot) == null ? void 0 : i.querySelector("button");
    if (!t) return;
    const e = this.hasAttribute("disabled") && this.getAttribute("disabled") !== "false" && this.getAttribute("disabled") !== "0";
    t.disabled = e, t.setAttribute("aria-disabled", String(e)), t.classList.toggle("btn--disable", e), e ? t.setAttribute("tabindex", "-1") : t.removeAttribute("tabindex");
  }
};
P.sizeVarMap = {
  "min-width": "--dd-btn-min-w",
  width: "--dd-btn-w",
  height: "--dd-btn-h",
  "font-size": "--dd-btn-fs",
  px: "--dd-btn-px",
  py: "--dd-btn-py"
};
let Y = P;
class xt extends x {
  static get observedAttributes() {
    return ["type", "message"];
  }
  constructor() {
    super(), this._type = this.getAttribute("type") || "notification", this._message = this.getAttribute("message") || "";
  }
  template() {
    return `<div class="toast toast-${y(this._type)}">
      <button class="toast-btn--close" data-action="close" aria-label="close">&times;</button>
      ${y(this._message)}
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
class Ct extends x {
  static get observedAttributes() {
    return ["type", "label", "id", "value", "placeholder"];
  }
  constructor() {
    super(), this._type = this.getAttribute("type") || "text", this._label = this.getAttribute("label") || "", this._inputId = this.getAttribute("id") || "", this._value = this.getAttribute("value") || "", this._placeholder = this.getAttribute("placeholder") || "";
  }
  template() {
    return `<div style="${this._label ? "display:flex;align-items:center;gap:0.5rem" : ""}">
      ${this._label ? `<label class="input-label" for="${y(this._inputId)}">${y(this._label)}</label>` : ""}
      <input type="${y(this._type)}" id="${y(this._inputId)}" class="dreamdesk-input"
        value="${y(this._value)}" placeholder="${y(this._placeholder)}" />
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
    var i;
    this._value = t;
    const e = (i = this.shadowRoot) == null ? void 0 : i.querySelector("input");
    e && (e.value = t);
  }
}
class St extends x {
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
class kt extends nt {
  template() {
    return `<div class="win terminal-win">
      <div class="win-header">
        <span class="win-title">${y(this.getAttribute("title") || "Terminal")}</span>
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
customElements.define("dreamdesk-tab", At);
customElements.define("dreamdesk-tab-panel", zt);
customElements.define("dreamdesk-tabs", wt);
customElements.define("dreamdesk-window", nt);
customElements.define("dreamdesk-progress-bar", vt);
customElements.define("dreamdesk-button", Y);
customElements.define("dreamdesk-toast", xt);
customElements.define("dreamdesk-input", Ct);
customElements.define("dreamdesk-toggle", St);
customElements.define("dreamdesk-terminal-window", kt);
export {
  $ as DURATION,
  Lt as DreamDeskThemeManager,
  N as EASE_IN_PLACE,
  H as EASE_SMOOTH,
  pt as WindowManager,
  T as cancelRunningAnimations,
  Tt as clearWindowState,
  V as close,
  R as defaultWindowManager,
  lt as detectSnapZone,
  gt as dismiss,
  Rt as dismissAll,
  K as fullscreen,
  Mt as loadWindowState,
  G as minimize,
  Dt as notify,
  Et as open,
  $t as saveWindowState,
  ct as setupDrag,
  mt as setupProgressBar,
  dt as setupResize,
  tt as snapRect,
  Pt as subscribeNotifications,
  Q as unfullscreen,
  J as unminimize,
  at as unsnap
};
