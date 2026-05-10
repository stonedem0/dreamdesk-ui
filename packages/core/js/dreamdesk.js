function C(i) {
  var e;
  const t = ((e = i == null ? void 0 : i.getAnimations) == null ? void 0 : e.call(i)) ?? [];
  for (const s of t) s.cancel();
}
function M(i) {
  C(i), i.style.transformOrigin = "50% 100%", i.animate(
    [{ transform: "scale(1)" }, { transform: "scale(0)" }],
    { duration: 300, easing: "ease-in", fill: "forwards" }
  );
}
function D(i) {
  C(i), i.style.transformOrigin = "50% 100%", i.animate(
    [{ transform: "scale(0)" }, { transform: "scale(1)" }],
    { duration: 300, easing: "ease-out" }
  );
}
function T(i, t) {
  C(i);
  const e = window.innerWidth, s = window.innerHeight, n = t.top - (window.scrollY || 0), r = t.left - (window.scrollX || 0), a = t.width, o = t.height;
  i.style.position = "fixed", i.style.top = "0", i.style.left = "0", i.style.width = "100vw", i.style.height = "100vh", i.style.setProperty("--ddw-w", "100vw"), i.style.setProperty("--ddw-h", "100vh"), i.style.zIndex = "9999";
  const l = a / e, u = o / s, m = r + a / 2 - e / 2, p = n + o / 2 - s / 2;
  i.animate(
    [
      { transform: `translate(${m}px, ${p}px) scale(${l}, ${u})` },
      { transform: "none" }
    ],
    { duration: 500, easing: "cubic-bezier(0.2, 0, 0, 1)" }
  );
}
function P(i, t) {
  C(i);
  const e = window.innerWidth, s = window.innerHeight, n = t.width, r = t.height, a = t.top - (window.scrollY || 0), o = t.left - (window.scrollX || 0), l = n / e, u = r / s, m = o + n / 2 - e / 2, p = a + r / 2 - s / 2, c = i.animate(
    [
      { transform: "none" },
      { transform: `translate(${m}px, ${p}px) scale(${l}, ${u})` }
    ],
    { duration: 300, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" }
  ), h = () => {
    i.style.position = t.position || "absolute", i.style.top = `${Math.round(t.top)}px`, i.style.left = `${Math.round(t.left)}px`, i.style.width = "", i.style.height = "", i.style.setProperty("--ddw-w", `${Math.round(n)}px`), i.style.setProperty("--ddw-h", `${Math.round(r)}px`), t.zIndex ? i.style.zIndex = t.zIndex : i.style.removeProperty("z-index");
  };
  c.onfinish = () => {
    h(), i.getAnimations().forEach((g) => g.cancel());
  }, c.oncancel = h;
}
function R(i, t) {
  i.animate(
    [{ opacity: "1", transform: "scale(1)" }, { opacity: "0", transform: "scale(0.95)" }],
    { duration: 300, easing: "ease", fill: "forwards" }
  ).onfinish = () => t == null ? void 0 : t();
}
const et = {
  current: "default",
  setTheme(i) {
    this.current = i, document.documentElement.setAttribute("data-theme", i), document.dispatchEvent(new CustomEvent("dreamdesk-theme-changed", { detail: { theme: i } }));
  },
  getTheme() {
    return this.current;
  }
};
function W({ handle: i, host: t, signal: e, disabled: s, exclude: n, getBounds: r, onStart: a }) {
  let o = !1, l = 0, u = 0, m = 0, p = 0, c = null, h = 0, g = 0;
  const z = () => {
    t.style.left = `${Math.max(0, Math.min(h, m))}px`, t.style.top = `${Math.max(0, Math.min(g, p))}px`;
  }, _ = (b) => {
    o && (h = b.clientX - l, g = b.clientY - u, c && cancelAnimationFrame(c), c = requestAnimationFrame(() => {
      z(), c = null;
    }));
  }, d = () => {
    o = !1, document.removeEventListener("pointermove", _, { capture: !0 }), document.removeEventListener("pointerup", d, { capture: !0 }), c && (cancelAnimationFrame(c), c = null, z());
  }, v = (b) => {
    if (s != null && s() || n && b.target.closest(n)) return;
    C(t);
    const y = t.getBoundingClientRect();
    l = b.clientX - y.left, u = b.clientY - y.top;
    const E = (r == null ? void 0 : r()) ?? {
      maxLeft: Math.max(0, window.innerWidth - y.width),
      maxTop: Math.max(0, window.innerHeight - y.height)
    };
    m = E.maxLeft, p = E.maxTop, a == null || a(y), o = !0, document.addEventListener("pointermove", _, { capture: !0 }), document.addEventListener("pointerup", d, { capture: !0 });
  }, w = e ? { signal: e } : {};
  return i.addEventListener("pointerdown", v, w), () => {
    i.removeEventListener("pointerdown", v), document.removeEventListener("pointermove", _, { capture: !0 }), document.removeEventListener("pointerup", d, { capture: !0 }), c && cancelAnimationFrame(c);
  };
}
function H({ handle: i, host: t, signal: e, disabled: s, minWidth: n = 180, minHeight: r = 120, explicitAttr: a = "data-explicit" }) {
  let o = !1, l = 0, u = 0, m = 0, p = 0;
  const c = (_) => {
    o && (t.style.setProperty("--ddw-w", `${Math.max(n, m + _.clientX - l)}px`), t.style.setProperty("--ddw-h", `${Math.max(r, p + _.clientY - u)}px`), t.setAttribute(a, ""));
  }, h = () => {
    o = !1, document.removeEventListener("pointermove", c, { capture: !0 }), document.removeEventListener("pointerup", h, { capture: !0 });
  }, g = (_) => {
    if (s != null && s()) return;
    o = !0, l = _.clientX, u = _.clientY;
    const d = t.getBoundingClientRect();
    m = d.width, p = d.height, document.addEventListener("pointermove", c, { capture: !0 }), document.addEventListener("pointerup", h, { capture: !0 });
  }, z = e ? { signal: e } : {};
  return i.addEventListener("pointerdown", g, z), () => {
    i.removeEventListener("pointerdown", g), document.removeEventListener("pointermove", c, { capture: !0 }), document.removeEventListener("pointerup", h, { capture: !0 });
  };
}
const B = 1e3;
class O {
  constructor() {
    this._registry = /* @__PURE__ */ new Map(), this._zStack = [], this._listeners = /* @__PURE__ */ new Set();
  }
  _notify() {
    this._listeners.forEach((t) => t());
  }
  _reassignZ() {
    this._zStack.forEach((t, e) => {
      const s = this._registry.get(t);
      s && (s.el.style.zIndex = String(B + e));
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
const L = new O();
function X({ track: i, getValue: t, isBlocky: e, isGradient: s }) {
  let n = [], r = null, a = null, o = null;
  const l = 1, u = 10, m = u + l;
  function p() {
    const d = s(), v = getComputedStyle(i), w = i.getBoundingClientRect().width - (parseFloat(v.borderLeftWidth) || 0) - (parseFloat(v.borderRightWidth) || 0), b = Math.max(1, Math.round((w + l) / m)), y = (w - (b - 1) * l) / b, E = w;
    i.innerHTML = "", n = [];
    for (let S = 0; S < b; S++) {
      const x = document.createElement("div");
      x.className = "progress-segment", x.style.cssText = `width:${y}px;margin-right:${S < b - 1 ? l : 0}px`, d && (x.style.backgroundSize = `${E}px 100%`, x.style.backgroundPosition = `-${S * (y + l)}px 0`), i.appendChild(x), n.push(x);
    }
    c(t());
  }
  function c(d) {
    const v = Math.min(Math.max(d, 0), 100), w = Math.floor(v / 100 * n.length);
    n.forEach((b, y) => b.classList.toggle("progress-segment--active", y < w));
  }
  function h(d) {
    if (!r) return;
    const v = Math.min(Math.max(d, 0), 100), w = s();
    if (r.style.width = `${v}%`, !w) {
      const b = getComputedStyle(r).getPropertyValue("--dd-progress-enable-hue-rotate").trim();
      r.style.filter = b === "0" ? "none" : `hue-rotate(${v * 3.6}deg)`;
    }
    r.classList.toggle("progress-bar--complete", d >= 100);
  }
  function g() {
    const d = e(), v = s();
    i.classList.toggle("progress-track--gradient", d && v), d ? (a == null || a.disconnect(), p(), a = new ResizeObserver(() => {
      o && clearTimeout(o), o = setTimeout(p, 50);
    }), a.observe(i)) : (r = i.querySelector(".progress-bar"), h(t()));
  }
  function z(d) {
    e() ? c(d) : h(d);
  }
  function _() {
    a == null || a.disconnect(), o && clearTimeout(o);
  }
  return { update: z, rebuild: g, destroy: _ };
}
const F = import.meta.url, Y = F.slice(0, F.lastIndexOf("/") + 1), j = `${Y}../css/`;
let Z = 0;
function I(i) {
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
function f(i) {
  return String(i).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
class A extends HTMLElement {
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
    t.rel = "stylesheet", t.href = `${j}base.css`, this.shadowRoot.appendChild(t);
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
class q extends A {
  constructor() {
    super(), this._resizeHandleBound = !1, this._dragController = null, this._observedScrollables = [], this.setAttribute("data-dd-role", "window"), this._winId = `dd-win-${++Z}`, this.widthAttr = this.getAttribute("width"), this.heightAttr = this.getAttribute("height");
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
          <span class="win-title">${f(this.getAttribute("title") || "Window")}</span>
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
    L.register(this._winId, this, this.getAttribute("title") ?? "Window"), this._syncSizeFromAttributes(), this._setupResizeObserver(), this._bindButtons(), this._setupResizeHandle(), this._setupDragging(), this._applyControlIcons(), this._applyControlsDisabled(), this._bindFocusRaise();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), L.unregister(this._winId), this._dragController && (this._dragController.abort(), this._dragController = null);
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
      this.state.isMinimized = !this.state.isMinimized, this.state.isMinimized ? this.setAttribute("minimized", "") : this.removeAttribute("minimized"), this.dispatchEvent(new CustomEvent("minimize", { detail: { isMinimized: this.state.isMinimized } }));
    };
    typeof s == "function" ? Promise.resolve(s(t, { defaultFns: { minimize: M, unminimize: D }, previousState: this.state.previousState })).then(n) : (!this.state.isMinimized ? M(t) : D(t), n());
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
    typeof n == "function" ? Promise.resolve(n(t, { previousState: this.state.previousState, isFullscreen: this.state.isFullscreen, defaultFns: { fullscreen: T, unfullscreen: P } })).then(r) : (e ? T(t, this.state.previousState) : P(t, this.state.previousState), r());
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
        var p, c;
        const u = (p = l.matches) != null && p.call(l, o) ? [l] : [], m = ((c = l.querySelectorAll) == null ? void 0 : c.call(l, o)) ?? [];
        [...u, ...Array.from(m)].forEach((h) => {
          h.classList.forEach((g) => {
            g.endsWith("-scroll") && h.classList.remove(g);
          }), t.observe(h), this._observedScrollables.push(h), this._checkOverflow(h);
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
    e || (e = document.createElement("div"), e.className = "win-resize-handle", t.appendChild(e)), !this._resizeHandleBound && (this._resizeHandleBound = !0, H({
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
      this._dragController || (this._dragController = new AbortController(), t.style.cursor = "move", W({
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
          (n === "static" || n === "relative") && (this.style.position = "absolute", this.style.left = `${s.left + (window.scrollX || 0)}px`, this.style.top = `${s.top + (window.scrollY || 0)}px`), L.raise(this._winId);
        }
      }));
    }
  }
  _bindFocusRaise() {
    var t, e;
    (e = this.shadowRoot.querySelector(".win")) == null || e.addEventListener("pointerdown", () => L.raise(this._winId), {
      signal: ((t = this._eventController) == null ? void 0 : t.signal) ?? void 0
    });
  }
  _applyControlIcons() {
    const t = this.shadowRoot, e = (s, n) => {
      var m;
      const r = t.querySelector(s);
      if (!r) return;
      const a = this.getAttribute(n);
      if (!a) return;
      const o = a.trim();
      let l = "";
      if (o.startsWith("<svg") ? l = I(o) : (m = window.DreamDeskIcons) != null && m[o] && (l = I(window.DreamDeskIcons[o])), !l) return;
      r.innerHTML = l, r.style.backgroundImage = "none";
      const u = r.querySelector("svg");
      u && (u.setAttribute("aria-hidden", "true"), u.setAttribute("focusable", "false"));
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
class N extends A {
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
    t && ((e = this._handle) == null || e.destroy(), this._handle = X({
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
class U extends A {
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
class G extends HTMLElement {
  connectedCallback() {
    this.setAttribute("slot", "tab"), this.setAttribute("data-tab", ""), this.setAttribute("data-tab-index", this.getAttribute("index") ?? "0");
  }
}
class J extends A {
  connectedCallback() {
    var t;
    super.connectedCallback(), this.setAttribute("slot", "panel"), this.setAttribute("data-panel", ""), (t = this.querySelector("p")) == null || t.classList.add("win-content");
  }
  template() {
    return "<style>:host{display:none}:host(.active){display:block}</style><slot></slot>";
  }
}
const k = class k extends A {
  static get observedAttributes() {
    return ["variant", "action", "size", "min-width", "width", "height", "font-size", "px", "py", "disabled"];
  }
  constructor() {
    super(), this.variant = this.getAttribute("variant") || "primary", this.action = this.getAttribute("action"), this.setAttribute("data-dd-role", "button");
  }
  template() {
    const t = this.action ? `data-action="${f(this.action)}"` : "", e = this.action ? `aria-label="${f(this.action)}"` : "", s = this.getAttribute("disabled"), n = s !== null && s !== "false" && s !== "0" ? 'disabled aria-disabled="true"' : "";
    return `<button class="btn btn--${f(this.variant)}" ${t} ${e} ${n}><slot></slot></button>`;
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
    const n = k.sizeVarMap[t];
    n && (s == null ? this.style.removeProperty(n) : this.style.setProperty(n, s));
  }
  _applyButtonSizeOverrides() {
    Object.entries(k.sizeVarMap).forEach(([t, e]) => {
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
k.sizeVarMap = {
  "min-width": "--dd-btn-min-w",
  width: "--dd-btn-w",
  height: "--dd-btn-h",
  "font-size": "--dd-btn-fs",
  px: "--dd-btn-px",
  py: "--dd-btn-py"
};
let $ = k;
class K extends A {
  static get observedAttributes() {
    return ["type", "message"];
  }
  constructor() {
    super(), this._type = this.getAttribute("type") || "notification", this._message = this.getAttribute("message") || "";
  }
  template() {
    return `<div class="toast toast-${f(this._type)}">
      <button class="toast-btn--close" data-action="close" aria-label="close">&times;</button>
      ${f(this._message)}
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
class Q extends A {
  static get observedAttributes() {
    return ["type", "label", "id", "value", "placeholder"];
  }
  constructor() {
    super(), this._type = this.getAttribute("type") || "text", this._label = this.getAttribute("label") || "", this._inputId = this.getAttribute("id") || "", this._value = this.getAttribute("value") || "", this._placeholder = this.getAttribute("placeholder") || "";
  }
  template() {
    return `<div style="${this._label ? "display:flex;align-items:center;gap:0.5rem" : ""}">
      ${this._label ? `<label class="input-label" for="${f(this._inputId)}">${f(this._label)}</label>` : ""}
      <input type="${f(this._type)}" id="${f(this._inputId)}" class="dreamdesk-input"
        value="${f(this._value)}" placeholder="${f(this._placeholder)}" />
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
class V extends A {
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
class tt extends q {
  template() {
    return `<div class="win terminal-win">
      <div class="win-header">
        <span class="win-title">${f(this.getAttribute("title") || "Terminal")}</span>
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
customElements.define("dreamdesk-tab", G);
customElements.define("dreamdesk-tab-panel", J);
customElements.define("dreamdesk-tabs", U);
customElements.define("dreamdesk-window", q);
customElements.define("dreamdesk-progress-bar", N);
customElements.define("dreamdesk-button", $);
customElements.define("dreamdesk-toast", K);
customElements.define("dreamdesk-input", Q);
customElements.define("dreamdesk-toggle", V);
customElements.define("dreamdesk-terminal-window", tt);
export {
  et as DreamDeskThemeManager,
  O as WindowManager,
  C as cancelRunningAnimations,
  R as close,
  L as defaultWindowManager,
  T as fullscreen,
  M as minimize,
  W as setupDrag,
  X as setupProgressBar,
  H as setupResize,
  P as unfullscreen,
  D as unminimize
};
