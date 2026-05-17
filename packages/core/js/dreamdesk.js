function M(n) {
  var e;
  const t = ((e = n == null ? void 0 : n.getAnimations) == null ? void 0 : e.call(n)) ?? [];
  for (const s of t) s.cancel();
}
function H(n) {
  M(n), n.style.transformOrigin = "50% 100%", n.animate(
    [{ transform: "scale(1)" }, { transform: "scale(0)" }],
    { duration: 300, easing: "ease-in", fill: "forwards" }
  );
}
function B(n) {
  M(n), n.style.transformOrigin = "50% 100%", n.animate(
    [{ transform: "scale(0)" }, { transform: "scale(1)" }],
    { duration: 300, easing: "ease-out" }
  );
}
function X(n, t) {
  M(n);
  const e = window.innerWidth, s = window.innerHeight, i = t.top - (window.scrollY || 0), r = t.left - (window.scrollX || 0), o = t.width, a = t.height;
  n.style.position = "fixed", n.style.top = "0", n.style.left = "0", n.style.width = "100vw", n.style.height = "100vh", n.style.setProperty("--ddw-w", "100vw"), n.style.setProperty("--ddw-h", "100vh"), n.style.zIndex = "9999";
  const l = o / e, c = a / s, p = r + o / 2 - e / 2, m = i + a / 2 - s / 2;
  n.animate(
    [
      { transform: `translate(${p}px, ${m}px) scale(${l}, ${c})` },
      { transform: "none" }
    ],
    { duration: 500, easing: "cubic-bezier(0.2, 0, 0, 1)" }
  );
}
function Y(n, t) {
  M(n);
  const e = window.innerWidth, s = window.innerHeight, i = t.width, r = t.height, o = t.top - (window.scrollY || 0), a = t.left - (window.scrollX || 0), l = i / e, c = r / s, p = a + i / 2 - e / 2, m = o + r / 2 - s / 2, g = n.animate(
    [
      { transform: "none" },
      { transform: `translate(${p}px, ${m}px) scale(${l}, ${c})` }
    ],
    { duration: 300, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" }
  ), d = () => {
    n.style.position = t.position || "absolute", n.style.top = `${Math.round(t.top)}px`, n.style.left = `${Math.round(t.left)}px`, n.style.width = "", n.style.height = "", n.style.setProperty("--ddw-w", `${Math.round(i)}px`), n.style.setProperty("--ddw-h", `${Math.round(r)}px`), t.zIndex ? n.style.zIndex = t.zIndex : n.style.removeProperty("z-index");
  };
  g.onfinish = () => {
    d(), n.getAnimations().forEach((f) => f.cancel());
  }, g.oncancel = d;
}
function Q(n, t) {
  M(n);
  const e = n.getBoundingClientRect(), s = t.width / (e.width || 1), i = t.height / (e.height || 1), r = t.left + t.width / 2 - (e.left + e.width / 2), o = t.top + t.height / 2 - (e.top + e.height / 2);
  n.animate(
    [
      { transform: `translate(${r}px, ${o}px) scale(${s}, ${i})` },
      { transform: "none" }
    ],
    { duration: 300, easing: "cubic-bezier(0.2, 0, 0, 1)" }
  );
}
function N(n, t) {
  const e = n.animate(
    [{ opacity: "1", transform: "scale(1)" }, { opacity: "0", transform: "scale(0.95)" }],
    { duration: 300, easing: "ease", fill: "forwards" }
  );
  e.onfinish = () => {
    e.cancel(), t == null || t();
  };
}
const ft = {
  current: "default",
  setTheme(n) {
    this.current = n, document.documentElement.setAttribute("data-theme", n), document.dispatchEvent(new CustomEvent("dreamdesk-theme-changed", { detail: { theme: n } }));
  },
  getTheme() {
    return this.current;
  }
}, T = 20, P = 80;
function V(n, t, e, s) {
  const i = n <= T, r = n >= e - T, o = t <= T, a = t >= s - T;
  return o && n <= P ? "top-left" : o && n >= e - P ? "top-right" : a && n <= P ? "bottom-left" : a && n >= e - P ? "bottom-right" : o ? "top" : i ? "left" : r ? "right" : "none";
}
function Z(n, t, e) {
  const s = t, i = e;
  switch (n) {
    case "top":
      return { top: 0, left: 0, width: s, height: i };
    case "left":
      return { top: 0, left: 0, width: s / 2, height: i };
    case "right":
      return { top: 0, left: s / 2, width: s / 2, height: i };
    case "top-left":
      return { top: 0, left: 0, width: s / 2, height: i / 2 };
    case "top-right":
      return { top: 0, left: s / 2, width: s / 2, height: i / 2 };
    case "bottom-left":
      return { top: i / 2, left: 0, width: s / 2, height: i / 2 };
    case "bottom-right":
      return { top: i / 2, left: s / 2, width: s / 2, height: i / 2 };
    default:
      return null;
  }
}
function tt({ handle: n, host: t, container: e, reservedBottom: s = 0, signal: i, disabled: r, exclude: o, getBounds: a, onStart: l, onSnap: c, onSnapCommit: p, onEnd: m }) {
  let g = !1, d = 0, f = 0, C = 0, L = 0, h = 0, b = 0, u = null, w = 0, S = 0, k = "none";
  const E = () => {
    t.style.left = `${Math.max(0, Math.min(w - h, C))}px`, t.style.top = `${Math.max(0, Math.min(S - b, L))}px`;
  }, A = (z) => {
    g && (w = z.clientX - d, S = z.clientY - f, u && cancelAnimationFrame(u), u = requestAnimationFrame(() => {
      if (E(), u = null, c && e) {
        const v = e.getBoundingClientRect(), _ = z.clientX - v.left, R = z.clientY - v.top, O = V(_, R, v.width, v.height - s);
        O !== k && (k = O, c(O));
      }
    }));
  }, I = (z) => {
    g = !1, document.removeEventListener("pointermove", A, { capture: !0 }), document.removeEventListener("pointerup", I, { capture: !0 }), u && (cancelAnimationFrame(u), u = null, E()), p && k !== "none" && p(k), c && c("none"), k = "none", m == null || m();
  }, W = (z) => {
    if (r != null && r() || o && z.target.closest(o)) return;
    M(t);
    const v = t.getBoundingClientRect(), _ = e == null ? void 0 : e.getBoundingClientRect();
    h = (_ == null ? void 0 : _.left) ?? 0, b = (_ == null ? void 0 : _.top) ?? 0, d = z.clientX - v.left, f = z.clientY - v.top;
    const R = (a == null ? void 0 : a()) ?? {
      maxLeft: _ ? _.width - v.width : Math.max(0, window.innerWidth - v.width),
      maxTop: _ ? _.height - v.height - s : Math.max(0, window.innerHeight - v.height - s)
    };
    C = R.maxLeft, L = R.maxTop, l == null || l(v), g = !0, document.addEventListener("pointermove", A, { capture: !0 }), document.addEventListener("pointerup", I, { capture: !0 });
  }, K = i ? { signal: i } : {};
  return n.addEventListener("pointerdown", W, K), () => {
    n.removeEventListener("pointerdown", W), document.removeEventListener("pointermove", A, { capture: !0 }), document.removeEventListener("pointerup", I, { capture: !0 }), u && cancelAnimationFrame(u);
  };
}
function et({ handle: n, host: t, signal: e, disabled: s, minWidth: i = 180, minHeight: r = 120, explicitAttr: o = "data-explicit", onEnd: a }) {
  let l = !1, c = 0, p = 0, m = 0, g = 0;
  const d = (h) => {
    l && (t.style.setProperty("--ddw-w", `${Math.max(i, m + h.clientX - c)}px`), t.style.setProperty("--ddw-h", `${Math.max(r, g + h.clientY - p)}px`), t.setAttribute(o, ""));
  }, f = () => {
    l = !1, document.removeEventListener("pointermove", d, { capture: !0 }), document.removeEventListener("pointerup", f, { capture: !0 }), a == null || a();
  }, C = (h) => {
    if (s != null && s()) return;
    l = !0, c = h.clientX, p = h.clientY;
    const b = t.getBoundingClientRect();
    m = b.width, g = b.height, document.addEventListener("pointermove", d, { capture: !0 }), document.addEventListener("pointerup", f, { capture: !0 });
  }, L = e ? { signal: e } : {};
  return n.addEventListener("pointerdown", C, L), () => {
    n.removeEventListener("pointerdown", C), document.removeEventListener("pointermove", d, { capture: !0 }), document.removeEventListener("pointerup", f, { capture: !0 });
  };
}
const q = "dreamdesk:win:";
function yt(n, t) {
  try {
    localStorage.setItem(q + n, JSON.stringify(t));
  } catch {
  }
}
function vt(n) {
  try {
    const t = localStorage.getItem(q + n);
    return t ? JSON.parse(t) : null;
  } catch {
    return null;
  }
}
function _t(n) {
  try {
    localStorage.removeItem(q + n);
  } catch {
  }
}
const st = 1e3, j = 24, it = 8;
class nt {
  constructor() {
    this._registry = /* @__PURE__ */ new Map(), this._zStack = [], this._listeners = /* @__PURE__ */ new Set(), this._openRegistry = /* @__PURE__ */ new Map(), this._closeRegistry = /* @__PURE__ */ new Map(), this._cascadeCount = 0;
  }
  getCascadeOffset() {
    const t = this._cascadeCount % it;
    return this._cascadeCount++, { dx: t * j, dy: t * j };
  }
  _notify() {
    this._listeners.forEach((t) => t());
  }
  _reassignZ() {
    this._zStack.forEach((t, e) => {
      const s = this._registry.get(t);
      s && (s.el.style.zIndex = String(st + e));
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
  registerClose(t, e) {
    this._closeRegistry.set(t, e);
  }
  close(t) {
    var e;
    (e = this._closeRegistry.get(t)) == null || e();
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
const $ = new nt();
function rt({ track: n, getValue: t, isBlocky: e, isGradient: s }) {
  let i = [], r = null, o = null, a = null;
  const l = 1, c = 10, p = c + l;
  function m() {
    const h = s(), b = getComputedStyle(n), u = n.getBoundingClientRect().width - (parseFloat(b.borderLeftWidth) || 0) - (parseFloat(b.borderRightWidth) || 0), w = Math.max(1, Math.round((u + l) / p)), S = (u - (w - 1) * l) / w, k = u;
    n.innerHTML = "", i = [];
    for (let E = 0; E < w; E++) {
      const A = document.createElement("div");
      A.className = "progress-segment", A.style.cssText = `width:${S}px;margin-right:${E < w - 1 ? l : 0}px`, h && (A.style.backgroundSize = `${k}px 100%`, A.style.backgroundPosition = `-${E * (S + l)}px 0`), n.appendChild(A), i.push(A);
    }
    g(t());
  }
  function g(h) {
    const b = Math.min(Math.max(h, 0), 100), u = Math.floor(b / 100 * i.length);
    i.forEach((w, S) => w.classList.toggle("progress-segment--active", S < u));
  }
  function d(h) {
    if (!r) return;
    const b = Math.min(Math.max(h, 0), 100), u = s();
    if (r.style.width = `${b}%`, !u) {
      const w = getComputedStyle(r).getPropertyValue("--dd-progress-enable-hue-rotate").trim();
      r.style.filter = w === "0" ? "none" : `hue-rotate(${b * 3.6}deg)`;
    }
    r.classList.toggle("progress-bar--complete", h >= 100);
  }
  function f() {
    const h = e(), b = s();
    n.classList.toggle("progress-track--gradient", h && b), h ? (o == null || o.disconnect(), m(), o = new ResizeObserver(() => {
      a && clearTimeout(a), a = setTimeout(m, 50);
    }), o.observe(n)) : (r = n.querySelector(".progress-bar"), d(t()));
  }
  function C(h) {
    e() ? g(h) : d(h);
  }
  function L() {
    o == null || o.disconnect(), a && clearTimeout(a);
  }
  return { update: C, rebuild: f, destroy: L };
}
const U = import.meta.url, ot = U.slice(0, U.lastIndexOf("/") + 1), at = `${ot}../css/`;
let lt = 0;
function G(n) {
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
function y(n) {
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
    t.rel = "stylesheet", t.href = `${at}base.css`, this.shadowRoot.appendChild(t);
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
class J extends x {
  constructor() {
    super(), this._resizeHandleBound = !1, this._dragController = null, this._observedScrollables = [], this._snapOverlay = null, this._preSnapState = null, this.setAttribute("data-dd-role", "window"), this._winId = `dd-win-${++lt}`, this.widthAttr = this.getAttribute("width"), this.heightAttr = this.getAttribute("height");
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
    $.register(this._winId, this, this.getAttribute("title") ?? "Window"), this._syncSizeFromAttributes(), this._setupResizeObserver(), this._bindButtons(), this._setupResizeHandle(), this._setupDragging(), this._applyControlIcons(), this._applyControlsDisabled(), this._bindFocusRaise();
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), $.unregister(this._winId), this._dragController && (this._dragController.abort(), this._dragController = null), (t = this._snapOverlay) == null || t.remove(), this._snapOverlay = null;
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
      this.state.isMinimized = !this.state.isMinimized, this.state.isMinimized ? this.setAttribute("minimized", "") : this.removeAttribute("minimized"), this.state.isMinimized ? $.minimize(this._winId) : $.restore(this._winId), this.dispatchEvent(new CustomEvent("minimize", { detail: { isMinimized: this.state.isMinimized } }));
    };
    typeof s == "function" ? Promise.resolve(s(t, { defaultFns: { minimize: H, unminimize: B }, previousState: this.state.previousState })).then(i) : (!this.state.isMinimized ? H(t) : B(t), i());
  }
  fullscreen() {
    var o, a;
    const t = this;
    if (!this.state.isFullscreen && this._preSnapState) {
      const l = this._preSnapState;
      this._preSnapState = null;
      const c = this.getBoundingClientRect();
      this.style.left = l.left, this.style.top = l.top, this.style.setProperty("--ddw-w", l.width), this.style.setProperty("--ddw-h", l.height), Q(this, c);
      return;
    }
    const e = !this.state.isFullscreen;
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
    typeof i == "function" ? Promise.resolve(i(t, { previousState: this.state.previousState, isFullscreen: this.state.isFullscreen, defaultFns: { fullscreen: X, unfullscreen: Y } })).then(r) : (e ? X(t, this.state.previousState) : Y(t, this.state.previousState), r());
  }
  close() {
    var r;
    const t = this.shadowRoot.querySelector(".win"), e = this.getAttribute("close-animation"), s = e ? (r = window.DreamDeskAnimations) == null ? void 0 : r[e] : void 0, i = () => {
      this.style.display = "none", this.dispatchEvent(new CustomEvent("close"));
    };
    typeof s == "function" ? Promise.resolve(s(t, { defaultFns: { close: N } })).then(i) : N(t, i);
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
        var m, g;
        const c = (m = l.matches) != null && m.call(l, a) ? [l] : [], p = ((g = l.querySelectorAll) == null ? void 0 : g.call(l, a)) ?? [];
        [...c, ...Array.from(p)].forEach((d) => {
          d.classList.forEach((f) => {
            f.endsWith("-scroll") && d.classList.remove(f);
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
    e || (e = document.createElement("div"), e.className = "win-resize-handle", t.appendChild(e)), !this._resizeHandleBound && (this._resizeHandleBound = !0, et({
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
    var s;
    const t = this.shadowRoot.querySelector(".win-header");
    if (!t) return;
    if (!this._movable) {
      t.style.cursor = "default", (s = this._dragController) == null || s.abort(), this._dragController = null;
      return;
    }
    if (this._dragController) return;
    this._dragController = new AbortController(), t.style.cursor = "move";
    const e = this.parentElement;
    !this._snapOverlay && e && (this._snapOverlay = this._createSnapOverlay(), e.appendChild(this._snapOverlay)), tt({
      handle: t,
      host: this,
      container: e,
      signal: this._dragController.signal,
      exclude: ".win-controls",
      disabled: () => {
        var i;
        return !this._movable || !!((i = this.state) != null && i.isFullscreen) && this.getAttribute("fullscreen-mode") !== "expand";
      },
      onStart: (i) => {
        this._preSnapState = null, this.setAttribute("data-ddw-explicit", ""), this.style.setProperty("--ddw-w", `${i.width}px`), this.style.setProperty("--ddw-h", `${i.height}px`);
        const r = getComputedStyle(this).position;
        (r === "static" || r === "relative") && (this.style.position = "absolute", this.style.left = `${i.left + (window.scrollX || 0)}px`, this.style.top = `${i.top + (window.scrollY || 0)}px`), $.raise(this._winId);
      },
      onSnap: (i) => {
        const r = this._snapOverlay;
        if (!r || !e) return;
        if (i === "none") {
          r.style.display = "none";
          return;
        }
        const o = e.getBoundingClientRect(), a = Z(i, o.width, o.height);
        if (!a) {
          r.style.display = "none";
          return;
        }
        r.style.display = "block", r.style.left = `${a.left}px`, r.style.top = `${a.top}px`, r.style.width = `${a.width}px`, r.style.height = `${a.height}px`;
      },
      onSnapCommit: (i) => {
        if (this._snapOverlay && (this._snapOverlay.style.display = "none"), !e) return;
        const r = e.getBoundingClientRect(), o = Z(i, r.width, r.height);
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
    (e = this.shadowRoot.querySelector(".win")) == null || e.addEventListener("pointerdown", () => $.raise(this._winId), {
      signal: ((t = this._eventController) == null ? void 0 : t.signal) ?? void 0
    });
  }
  _applyControlIcons() {
    const t = this.shadowRoot, e = (s, i) => {
      var p;
      const r = t.querySelector(s);
      if (!r) return;
      const o = this.getAttribute(i);
      if (!o) return;
      const a = o.trim();
      let l = "";
      if (a.startsWith("<svg") ? l = G(a) : (p = window.DreamDeskIcons) != null && p[a] && (l = G(window.DreamDeskIcons[a])), !l) return;
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
class ct extends x {
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
    t && ((e = this._handle) == null || e.destroy(), this._handle = rt({
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
class ht extends x {
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
class dt extends HTMLElement {
  connectedCallback() {
    this.setAttribute("slot", "tab"), this.setAttribute("data-tab", ""), this.setAttribute("data-tab-index", this.getAttribute("index") ?? "0");
  }
}
class ut extends x {
  connectedCallback() {
    var t;
    super.connectedCallback(), this.setAttribute("slot", "panel"), this.setAttribute("data-panel", ""), (t = this.querySelector("p")) == null || t.classList.add("win-content");
  }
  template() {
    return "<style>:host{display:none}:host(.active){display:block}</style><slot></slot>";
  }
}
const D = class D extends x {
  static get observedAttributes() {
    return ["variant", "action", "size", "min-width", "width", "height", "font-size", "px", "py", "disabled"];
  }
  constructor() {
    super(), this.variant = this.getAttribute("variant") || "primary", this.action = this.getAttribute("action"), this.setAttribute("data-dd-role", "button");
  }
  template() {
    const t = this.action ? `data-action="${y(this.action)}"` : "", e = this.action ? `aria-label="${y(this.action)}"` : "", s = this.getAttribute("disabled"), i = s !== null && s !== "false" && s !== "0" ? 'disabled aria-disabled="true"' : "";
    return `<button class="btn btn--${y(this.variant)}" ${t} ${e} ${i}><slot></slot></button>`;
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
    const i = D.sizeVarMap[t];
    i && (s == null ? this.style.removeProperty(i) : this.style.setProperty(i, s));
  }
  _applyButtonSizeOverrides() {
    Object.entries(D.sizeVarMap).forEach(([t, e]) => {
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
D.sizeVarMap = {
  "min-width": "--dd-btn-min-w",
  width: "--dd-btn-w",
  height: "--dd-btn-h",
  "font-size": "--dd-btn-fs",
  px: "--dd-btn-px",
  py: "--dd-btn-py"
};
let F = D;
class pt extends x {
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
class mt extends x {
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
    var s;
    this._value = t;
    const e = (s = this.shadowRoot) == null ? void 0 : s.querySelector("input");
    e && (e.value = t);
  }
}
class gt extends x {
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
class bt extends J {
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
customElements.define("dreamdesk-tab", dt);
customElements.define("dreamdesk-tab-panel", ut);
customElements.define("dreamdesk-tabs", ht);
customElements.define("dreamdesk-window", J);
customElements.define("dreamdesk-progress-bar", ct);
customElements.define("dreamdesk-button", F);
customElements.define("dreamdesk-toast", pt);
customElements.define("dreamdesk-input", mt);
customElements.define("dreamdesk-toggle", gt);
customElements.define("dreamdesk-terminal-window", bt);
export {
  ft as DreamDeskThemeManager,
  nt as WindowManager,
  M as cancelRunningAnimations,
  _t as clearWindowState,
  N as close,
  $ as defaultWindowManager,
  V as detectSnapZone,
  X as fullscreen,
  vt as loadWindowState,
  H as minimize,
  yt as saveWindowState,
  tt as setupDrag,
  rt as setupProgressBar,
  et as setupResize,
  Z as snapRect,
  Y as unfullscreen,
  B as unminimize,
  Q as unsnap
};
