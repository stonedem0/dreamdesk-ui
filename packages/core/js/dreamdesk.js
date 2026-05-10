function L(i) {
  var e;
  const t = ((e = i == null ? void 0 : i.getAnimations) == null ? void 0 : e.call(i)) ?? [];
  for (const s of t) s.cancel();
}
function T(i) {
  L(i), i.style.transformOrigin = "50% 100%", i.animate(
    [{ transform: "scale(1)" }, { transform: "scale(0)" }],
    { duration: 300, easing: "ease-in", fill: "forwards" }
  );
}
function P(i) {
  L(i), i.style.transformOrigin = "50% 100%", i.animate(
    [{ transform: "scale(0)" }, { transform: "scale(1)" }],
    { duration: 300, easing: "ease-out" }
  );
}
function I(i, t) {
  L(i);
  const e = window.innerWidth, s = window.innerHeight, n = t.top - (window.scrollY || 0), r = t.left - (window.scrollX || 0), a = t.width, o = t.height;
  i.style.position = "fixed", i.style.top = "0", i.style.left = "0", i.style.width = "100vw", i.style.height = "100vh", i.style.setProperty("--ddw-w", "100vw"), i.style.setProperty("--ddw-h", "100vh"), i.style.zIndex = "9999";
  const l = a / e, h = o / s, u = r + a / 2 - e / 2, m = n + o / 2 - s / 2;
  i.animate(
    [
      { transform: `translate(${u}px, ${m}px) scale(${l}, ${h})` },
      { transform: "none" }
    ],
    { duration: 500, easing: "cubic-bezier(0.2, 0, 0, 1)" }
  );
}
function F(i, t) {
  L(i);
  const e = window.innerWidth, s = window.innerHeight, n = t.width, r = t.height, a = t.top - (window.scrollY || 0), o = t.left - (window.scrollX || 0), l = n / e, h = r / s, u = o + n / 2 - e / 2, m = a + r / 2 - s / 2, p = i.animate(
    [
      { transform: "none" },
      { transform: `translate(${u}px, ${m}px) scale(${l}, ${h})` }
    ],
    { duration: 300, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" }
  ), c = () => {
    i.style.position = t.position || "absolute", i.style.top = `${Math.round(t.top)}px`, i.style.left = `${Math.round(t.left)}px`, i.style.width = "", i.style.height = "", i.style.setProperty("--ddw-w", `${Math.round(n)}px`), i.style.setProperty("--ddw-h", `${Math.round(r)}px`), t.zIndex ? i.style.zIndex = t.zIndex : i.style.removeProperty("z-index");
  };
  p.onfinish = () => {
    c(), i.getAnimations().forEach((v) => v.cancel());
  }, p.oncancel = c;
}
function R(i, t) {
  i.animate(
    [{ opacity: "1", transform: "scale(1)" }, { opacity: "0", transform: "scale(0.95)" }],
    { duration: 300, easing: "ease", fill: "forwards" }
  ).onfinish = () => t == null ? void 0 : t();
}
const it = {
  current: "default",
  setTheme(i) {
    this.current = i, document.documentElement.setAttribute("data-theme", i), document.dispatchEvent(new CustomEvent("dreamdesk-theme-changed", { detail: { theme: i } }));
  },
  getTheme() {
    return this.current;
  }
};
function B({ handle: i, host: t, container: e, signal: s, disabled: n, exclude: r, getBounds: a, onStart: o }) {
  let l = !1, h = 0, u = 0, m = 0, p = 0, c = 0, v = 0, f = null, z = 0, d = 0;
  const _ = () => {
    t.style.left = `${Math.max(0, Math.min(z - c, m))}px`, t.style.top = `${Math.max(0, Math.min(d - v, p))}px`;
  }, w = (A) => {
    l && (z = A.clientX - h, d = A.clientY - u, f && cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      _(), f = null;
    }));
  }, y = () => {
    l = !1, document.removeEventListener("pointermove", w, { capture: !0 }), document.removeEventListener("pointerup", y, { capture: !0 }), f && (cancelAnimationFrame(f), f = null, _());
  }, C = (A) => {
    if (n != null && n() || r && A.target.closest(r)) return;
    L(t);
    const b = t.getBoundingClientRect(), x = e == null ? void 0 : e.getBoundingClientRect();
    c = (x == null ? void 0 : x.left) ?? 0, v = (x == null ? void 0 : x.top) ?? 0, h = A.clientX - b.left, u = A.clientY - b.top;
    const D = (a == null ? void 0 : a()) ?? {
      maxLeft: x ? x.width - b.width : Math.max(0, window.innerWidth - b.width),
      maxTop: x ? x.height - b.height : Math.max(0, window.innerHeight - b.height)
    };
    m = D.maxLeft, p = D.maxTop, o == null || o(b), l = !0, document.addEventListener("pointermove", w, { capture: !0 }), document.addEventListener("pointerup", y, { capture: !0 });
  }, $ = s ? { signal: s } : {};
  return i.addEventListener("pointerdown", C, $), () => {
    i.removeEventListener("pointerdown", C), document.removeEventListener("pointermove", w, { capture: !0 }), document.removeEventListener("pointerup", y, { capture: !0 }), f && cancelAnimationFrame(f);
  };
}
function O({ handle: i, host: t, signal: e, disabled: s, minWidth: n = 180, minHeight: r = 120, explicitAttr: a = "data-explicit" }) {
  let o = !1, l = 0, h = 0, u = 0, m = 0;
  const p = (z) => {
    o && (t.style.setProperty("--ddw-w", `${Math.max(n, u + z.clientX - l)}px`), t.style.setProperty("--ddw-h", `${Math.max(r, m + z.clientY - h)}px`), t.setAttribute(a, ""));
  }, c = () => {
    o = !1, document.removeEventListener("pointermove", p, { capture: !0 }), document.removeEventListener("pointerup", c, { capture: !0 });
  }, v = (z) => {
    if (s != null && s()) return;
    o = !0, l = z.clientX, h = z.clientY;
    const d = t.getBoundingClientRect();
    u = d.width, m = d.height, document.addEventListener("pointermove", p, { capture: !0 }), document.addEventListener("pointerup", c, { capture: !0 });
  }, f = e ? { signal: e } : {};
  return i.addEventListener("pointerdown", v, f), () => {
    i.removeEventListener("pointerdown", v), document.removeEventListener("pointermove", p, { capture: !0 }), document.removeEventListener("pointerup", c, { capture: !0 });
  };
}
const X = 1e3;
class Y {
  constructor() {
    this._registry = /* @__PURE__ */ new Map(), this._zStack = [], this._listeners = /* @__PURE__ */ new Set();
  }
  _notify() {
    this._listeners.forEach((t) => t());
  }
  _reassignZ() {
    this._zStack.forEach((t, e) => {
      const s = this._registry.get(t);
      s && (s.el.style.zIndex = String(X + e));
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
const E = new Y();
function j({ track: i, getValue: t, isBlocky: e, isGradient: s }) {
  let n = [], r = null, a = null, o = null;
  const l = 1, h = 10, u = h + l;
  function m() {
    const d = s(), _ = getComputedStyle(i), w = i.getBoundingClientRect().width - (parseFloat(_.borderLeftWidth) || 0) - (parseFloat(_.borderRightWidth) || 0), y = Math.max(1, Math.round((w + l) / u)), C = (w - (y - 1) * l) / y, $ = w;
    i.innerHTML = "", n = [];
    for (let A = 0; A < y; A++) {
      const b = document.createElement("div");
      b.className = "progress-segment", b.style.cssText = `width:${C}px;margin-right:${A < y - 1 ? l : 0}px`, d && (b.style.backgroundSize = `${$}px 100%`, b.style.backgroundPosition = `-${A * (C + l)}px 0`), i.appendChild(b), n.push(b);
    }
    p(t());
  }
  function p(d) {
    const _ = Math.min(Math.max(d, 0), 100), w = Math.floor(_ / 100 * n.length);
    n.forEach((y, C) => y.classList.toggle("progress-segment--active", C < w));
  }
  function c(d) {
    if (!r) return;
    const _ = Math.min(Math.max(d, 0), 100), w = s();
    if (r.style.width = `${_}%`, !w) {
      const y = getComputedStyle(r).getPropertyValue("--dd-progress-enable-hue-rotate").trim();
      r.style.filter = y === "0" ? "none" : `hue-rotate(${_ * 3.6}deg)`;
    }
    r.classList.toggle("progress-bar--complete", d >= 100);
  }
  function v() {
    const d = e(), _ = s();
    i.classList.toggle("progress-track--gradient", d && _), d ? (a == null || a.disconnect(), m(), a = new ResizeObserver(() => {
      o && clearTimeout(o), o = setTimeout(m, 50);
    }), a.observe(i)) : (r = i.querySelector(".progress-bar"), c(t()));
  }
  function f(d) {
    e() ? p(d) : c(d);
  }
  function z() {
    a == null || a.disconnect(), o && clearTimeout(o);
  }
  return { update: f, rebuild: v, destroy: z };
}
const q = import.meta.url, Z = q.slice(0, q.lastIndexOf("/") + 1), N = `${Z}../css/`;
let U = 0;
function W(i) {
  try {
    const e = new DOMParser().parseFromString(i, "image/svg+xml");
    if (e.querySelector("parsererror")) return "";
    const s = (n) => {
      var r;
      if (n.tagName.toLowerCase() === "script") {
        (r = n.parentNode) == null || r.removeChild(n);
        return;
      }
      for (const a of Array.from(n.attributes))
        (a.name.startsWith("on") || a.value.toLowerCase().includes("javascript:")) && n.removeAttribute(a.name);
      Array.from(n.children).forEach(s);
    };
    return s(e.documentElement), new XMLSerializer().serializeToString(e.documentElement);
  } catch {
    return "";
  }
}
function g(i) {
  return String(i).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
class k extends HTMLElement {
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
    t.rel = "stylesheet", t.href = `${N}base.css`, this.shadowRoot.appendChild(t);
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
class H extends k {
  constructor() {
    super(), this._resizeHandleBound = !1, this._dragController = null, this._observedScrollables = [], this.setAttribute("data-dd-role", "window"), this._winId = `dd-win-${++U}`, this.widthAttr = this.getAttribute("width"), this.heightAttr = this.getAttribute("height");
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
    E.register(this._winId, this, this.getAttribute("title") ?? "Window"), this._syncSizeFromAttributes(), this._setupResizeObserver(), this._bindButtons(), this._setupResizeHandle(), this._setupDragging(), this._applyControlIcons(), this._applyControlsDisabled(), this._bindFocusRaise();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), E.unregister(this._winId), this._dragController && (this._dragController.abort(), this._dragController = null);
  }
  _syncSizeFromAttributes() {
    const t = this.widthAttr, e = this.heightAttr;
    (t || e) && this.setAttribute("data-ddw-explicit", ""), t && this.style.setProperty("--ddw-w", t), e && this.style.setProperty("--ddw-h", e);
  }
  _bindButtons() {
    var s, n, r;
    const t = this.shadowRoot, e = (a) => (o) => {
      const l = o.currentTarget;
      if ((l == null ? void 0 : l.getAttribute("aria-disabled")) === "true") {
        o.preventDefault(), o.stopPropagation();
        return;
      }
      a();
    };
    (s = t.querySelector('[data-action="minimize"]')) == null || s.addEventListener("click", e(() => this.minimize())), (n = t.querySelector('[data-action="fullscreen"]')) == null || n.addEventListener("click", e(() => this.fullscreen())), (r = t.querySelector('[data-action="close"]')) == null || r.addEventListener("click", e(() => this.close()));
  }
  minimize() {
    var r;
    const t = this.shadowRoot.querySelector(".win"), e = this.getAttribute("minimize-animation"), s = e ? (r = window.DreamDeskAnimations) == null ? void 0 : r[e] : void 0, n = () => {
      this.state.isMinimized = !this.state.isMinimized, this.state.isMinimized ? this.setAttribute("minimized", "") : this.removeAttribute("minimized"), this.state.isMinimized ? E.minimize(this._winId) : E.restore(this._winId), this.dispatchEvent(new CustomEvent("minimize", { detail: { isMinimized: this.state.isMinimized } }));
    };
    typeof s == "function" ? Promise.resolve(s(t, { defaultFns: { minimize: T, unminimize: P }, previousState: this.state.previousState })).then(n) : (!this.state.isMinimized ? T(t) : P(t), n());
  }
  fullscreen() {
    var a, o;
    const t = this, e = !this.state.isFullscreen;
    e && (this._freezeWindowState(), this.setAttribute("data-ddw-explicit", ""));
    const s = this.getAttribute(e ? "fullscreen-animation" : "unfullscreen-animation");
    let n = s ? (a = window.DreamDeskAnimations) == null ? void 0 : a[s] : void 0;
    if (!e && typeof n != "function") {
      const l = this.getAttribute("fullscreen-animation");
      n = l ? (o = window.DreamDeskAnimations) == null ? void 0 : o[l] : void 0;
    }
    const r = () => {
      this.state.isFullscreen = !this.state.isFullscreen, this.dispatchEvent(new CustomEvent("fullscreen", { detail: { isFullscreen: this.state.isFullscreen } }));
    };
    typeof n == "function" ? Promise.resolve(n(t, { previousState: this.state.previousState, isFullscreen: this.state.isFullscreen, defaultFns: { fullscreen: I, unfullscreen: F } })).then(r) : (e ? I(t, this.state.previousState) : F(t, this.state.previousState), r());
  }
  close() {
    var r;
    const t = this.shadowRoot.querySelector(".win"), e = this.getAttribute("close-animation"), s = e ? (r = window.DreamDeskAnimations) == null ? void 0 : r[e] : void 0, n = () => {
      this.style.display = "none", this.dispatchEvent(new CustomEvent("close"));
    };
    typeof s == "function" ? Promise.resolve(s(t, { defaultFns: { close: R } })).then(n) : R(t, n);
  }
  _freezeWindowState() {
    const t = this.getBoundingClientRect(), e = window.scrollY || 0, s = window.scrollX || 0, n = getComputedStyle(this);
    this.state.previousState = {
      top: t.top + e,
      left: t.left + s,
      width: t.width,
      height: t.height,
      position: n.position || "relative",
      zIndex: n.zIndex === "auto" ? "" : n.zIndex
    };
  }
  _setupResizeObserver() {
    var r, a;
    const t = new ResizeObserver((o) => {
      o.forEach((l) => this._checkOverflow(l.target));
    }), e = this.shadowRoot.querySelector("slot"), s = (e == null ? void 0 : e.assignedElements({ flatten: !0 })) ?? [], n = () => {
      const o = ".win-content[scrollable], [scrollable], p.scrollable, .scrollable";
      this._observedScrollables.forEach((l) => t.unobserve(l)), this._observedScrollables = [], s.forEach((l) => {
        var m, p;
        const h = (m = l.matches) != null && m.call(l, o) ? [l] : [], u = ((p = l.querySelectorAll) == null ? void 0 : p.call(l, o)) ?? [];
        [...h, ...Array.from(u)].forEach((c) => {
          c.classList.forEach((v) => {
            v.endsWith("-scroll") && c.classList.remove(v);
          }), t.observe(c), this._observedScrollables.push(c), this._checkOverflow(c);
        });
      });
    };
    n(), document.addEventListener("dreamdesk-theme-changed", () => {
      this._theme = document.documentElement.getAttribute("data-theme") || "default", this._prefix = this._getThemePrefix(this._theme), n();
    }, { signal: ((r = this._eventController) == null ? void 0 : r.signal) ?? void 0 }), e == null || e.addEventListener("slotchange", n, { signal: ((a = this._eventController) == null ? void 0 : a.signal) ?? void 0 }), this._resizeObserver = t;
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
    e || (e = document.createElement("div"), e.className = "win-resize-handle", t.appendChild(e)), !this._resizeHandleBound && (this._resizeHandleBound = !0, O({
      handle: e,
      host: this,
      signal: (s = this._eventController) == null ? void 0 : s.signal,
      disabled: () => {
        var n;
        return !!((n = this.state) != null && n.isFullscreen);
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
          const n = getComputedStyle(this).position;
          (n === "static" || n === "relative") && (this.style.position = "absolute", this.style.left = `${s.left + (window.scrollX || 0)}px`, this.style.top = `${s.top + (window.scrollY || 0)}px`), E.raise(this._winId);
        }
      }));
    }
  }
  _bindFocusRaise() {
    var t, e;
    (e = this.shadowRoot.querySelector(".win")) == null || e.addEventListener("pointerdown", () => E.raise(this._winId), {
      signal: ((t = this._eventController) == null ? void 0 : t.signal) ?? void 0
    });
  }
  _applyControlIcons() {
    const t = this.shadowRoot, e = (s, n) => {
      var u;
      const r = t.querySelector(s);
      if (!r) return;
      const a = this.getAttribute(n);
      if (!a) return;
      const o = a.trim();
      let l = "";
      if (o.startsWith("<svg") ? l = W(o) : (u = window.DreamDeskIcons) != null && u[o] && (l = W(window.DreamDeskIcons[o])), !l) return;
      r.innerHTML = l, r.style.backgroundImage = "none";
      const h = r.querySelector("svg");
      h && (h.setAttribute("aria-hidden", "true"), h.setAttribute("focusable", "false"));
    };
    e(".btn--minimize", "minimize-icon"), e(".btn--fullscreen", "fullscreen-icon"), e(".btn--close", "close-icon");
  }
  _applyControlsDisabled() {
    const t = this.shadowRoot, e = (s, n) => {
      const r = t.querySelector(s);
      if (!r) return;
      const a = this.getAttribute(n), o = a !== null && a !== "false" && a !== "0";
      if (r.setAttribute("aria-disabled", String(o)), o) {
        r.setAttribute("tabindex", "-1");
        const l = a && a !== "true" && a !== "1" ? a : this.getAttribute(`${n}-tooltip`);
        l ? r.setAttribute("data-tooltip", l) : r.removeAttribute("data-tooltip");
      } else
        r.removeAttribute("tabindex"), r.removeAttribute("data-tooltip");
    };
    e(".btn--minimize", "disable-minimize"), e(".btn--fullscreen", "disable-fullscreen"), e(".btn--close", "disable-close");
  }
  attributeChangedCallback(t, e, s) {
    if (e === s) return;
    const n = (r) => r === null || r === "" || r === "true" || r === "1";
    t === "resizable" && (this._resizable = n(s), this._initialized && this._setupResizeHandle()), t === "movable" && (this._movable = n(s), this._initialized && this._setupDragging()), t === "width" && (this.widthAttr = s, this._initialized && this._syncSizeFromAttributes()), t === "height" && (this.heightAttr = s, this._initialized && this._syncSizeFromAttributes()), ["minimize-icon", "fullscreen-icon", "close-icon"].includes(t) && this._applyControlIcons(), ["disable-minimize", "disable-fullscreen", "disable-close"].includes(t) && this._applyControlsDisabled();
  }
}
class G extends k {
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
    var n;
    e !== s && (t === "value" && (this._value = parseFloat(s ?? "0"), (n = this._handle) == null || n.update(this._value)), (t === "gradient" || t === "blocky") && (this._container.innerHTML = this.template(), this._init()));
  }
  themeChanged() {
    var t;
    (t = this._handle) == null || t.rebuild();
  }
  _init() {
    var e;
    const t = this.shadowRoot.querySelector(".progress-track");
    t && ((e = this._handle) == null || e.destroy(), this._handle = j({
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
class J extends k {
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
class K extends HTMLElement {
  connectedCallback() {
    this.setAttribute("slot", "tab"), this.setAttribute("data-tab", ""), this.setAttribute("data-tab-index", this.getAttribute("index") ?? "0");
  }
}
class Q extends k {
  connectedCallback() {
    var t;
    super.connectedCallback(), this.setAttribute("slot", "panel"), this.setAttribute("data-panel", ""), (t = this.querySelector("p")) == null || t.classList.add("win-content");
  }
  template() {
    return "<style>:host{display:none}:host(.active){display:block}</style><slot></slot>";
  }
}
const S = class S extends k {
  static get observedAttributes() {
    return ["variant", "action", "size", "min-width", "width", "height", "font-size", "px", "py", "disabled"];
  }
  constructor() {
    super(), this.variant = this.getAttribute("variant") || "primary", this.action = this.getAttribute("action"), this.setAttribute("data-dd-role", "button");
  }
  template() {
    const t = this.action ? `data-action="${g(this.action)}"` : "", e = this.action ? `aria-label="${g(this.action)}"` : "", s = this.getAttribute("disabled"), n = s !== null && s !== "false" && s !== "0" ? 'disabled aria-disabled="true"' : "";
    return `<button class="btn btn--${g(this.variant)}" ${t} ${e} ${n}><slot></slot></button>`;
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
    const n = S.sizeVarMap[t];
    n && (s == null ? this.style.removeProperty(n) : this.style.setProperty(n, s));
  }
  _applyButtonSizeOverrides() {
    Object.entries(S.sizeVarMap).forEach(([t, e]) => {
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
S.sizeVarMap = {
  "min-width": "--dd-btn-min-w",
  width: "--dd-btn-w",
  height: "--dd-btn-h",
  "font-size": "--dd-btn-fs",
  px: "--dd-btn-px",
  py: "--dd-btn-py"
};
let M = S;
class V extends k {
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
class tt extends k {
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
class et extends k {
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
class st extends H {
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
customElements.define("dreamdesk-tab", K);
customElements.define("dreamdesk-tab-panel", Q);
customElements.define("dreamdesk-tabs", J);
customElements.define("dreamdesk-window", H);
customElements.define("dreamdesk-progress-bar", G);
customElements.define("dreamdesk-button", M);
customElements.define("dreamdesk-toast", V);
customElements.define("dreamdesk-input", tt);
customElements.define("dreamdesk-toggle", et);
customElements.define("dreamdesk-terminal-window", st);
export {
  it as DreamDeskThemeManager,
  Y as WindowManager,
  L as cancelRunningAnimations,
  R as close,
  E as defaultWindowManager,
  I as fullscreen,
  T as minimize,
  B as setupDrag,
  j as setupProgressBar,
  O as setupResize,
  F as unfullscreen,
  P as unminimize
};
