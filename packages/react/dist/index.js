import { jsx as r, jsxs as y, Fragment as ct } from "react/jsx-runtime";
import { createContext as ne, useState as B, useEffect as $, useCallback as A, useContext as X, useRef as _, useId as Z, useMemo as dt, Children as He, isValidElement as Ke } from "react";
import { createPortal as Fe } from "react-dom";
const Oe = ne(null);
function Qt({ children: e, defaultTheme: t = "pastelcore" }) {
  const [n, i] = B(t);
  $(() => {
    document.documentElement.setAttribute("data-theme", n);
  }, [n]);
  const o = A((l) => {
    i(l);
  }, []);
  return /* @__PURE__ */ r(Oe.Provider, { value: { theme: n, setTheme: o }, children: e });
}
const ut = {
  theme: "pastelcore",
  setTheme: () => {
  }
};
function ht() {
  return X(Oe) ?? ut;
}
function J(e) {
  var n;
  const t = ((n = e == null ? void 0 : e.getAnimations) == null ? void 0 : n.call(e)) ?? [];
  for (const i of t) i.cancel();
}
function Be(e) {
  J(e), e.style.transformOrigin = "50% 50%", e.animate(
    [{ transform: "scale(0.85)", opacity: "0" }, { transform: "scale(1)", opacity: "1" }],
    { duration: 180, easing: "ease-out" }
  );
}
function ft(e) {
  J(e), e.style.transformOrigin = "50% 100%", e.animate(
    [{ transform: "scale(1)" }, { transform: "scale(0)" }],
    { duration: 300, easing: "ease-in", fill: "forwards" }
  );
}
function mt(e) {
  J(e), e.style.transformOrigin = "50% 100%", e.animate(
    [{ transform: "scale(0)" }, { transform: "scale(1)" }],
    { duration: 300, easing: "ease-out" }
  );
}
function pt(e, t) {
  J(e);
  const n = window.innerWidth, i = window.innerHeight, o = t.top - (window.scrollY || 0), l = t.left - (window.scrollX || 0), s = t.width, a = t.height;
  e.style.position = "fixed", e.style.top = "0", e.style.left = "0", e.style.width = "100vw", e.style.height = "100vh", e.style.setProperty("--ddw-w", "100vw"), e.style.setProperty("--ddw-h", "100vh"), e.style.zIndex = "9999";
  const c = s / n, d = a / i, m = l + s / 2 - n / 2, g = o + a / 2 - i / 2;
  e.animate(
    [
      { transform: `translate(${m}px, ${g}px) scale(${c}, ${d})` },
      { transform: "none" }
    ],
    { duration: 500, easing: "cubic-bezier(0.2, 0, 0, 1)" }
  );
}
function gt(e, t) {
  J(e);
  const n = window.innerWidth, i = window.innerHeight, o = t.width, l = t.height, s = t.top - (window.scrollY || 0), a = t.left - (window.scrollX || 0), c = o / n, d = l / i, m = a + o / 2 - n / 2, g = s + l / 2 - i / 2, u = e.animate(
    [
      { transform: "none" },
      { transform: `translate(${m}px, ${g}px) scale(${c}, ${d})` }
    ],
    { duration: 300, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" }
  ), w = () => {
    e.style.position = t.position || "absolute", e.style.top = `${Math.round(t.top)}px`, e.style.left = `${Math.round(t.left)}px`, e.style.width = "", e.style.height = "", e.style.setProperty("--ddw-w", `${Math.round(o)}px`), e.style.setProperty("--ddw-h", `${Math.round(l)}px`), t.zIndex ? e.style.zIndex = t.zIndex : e.style.removeProperty("z-index");
  };
  u.onfinish = () => {
    w(), e.getAnimations().forEach((x) => x.cancel());
  }, u.oncancel = w;
}
function yt(e, t) {
  J(e);
  const n = e.getBoundingClientRect(), i = t.width / (n.width || 1), o = t.height / (n.height || 1), l = t.left + t.width / 2 - (n.left + n.width / 2), s = t.top + t.height / 2 - (n.top + n.height / 2);
  e.animate(
    [
      { transform: `translate(${l}px, ${s}px) scale(${i}, ${o})` },
      { transform: "none" }
    ],
    { duration: 300, easing: "cubic-bezier(0.2, 0, 0, 1)" }
  );
}
function wt(e, t) {
  const n = e.animate(
    [{ opacity: "1", transform: "scale(1)" }, { opacity: "0", transform: "scale(0.95)" }],
    { duration: 300, easing: "ease", fill: "forwards" }
  );
  n.onfinish = () => {
    n.cancel(), t == null || t();
  };
}
const oe = 20, le = 80;
function bt(e, t, n, i) {
  const o = e <= oe, l = e >= n - oe, s = t <= oe, a = t >= i - oe;
  return s && e <= le ? "top-left" : s && e >= n - le ? "top-right" : a && e <= le ? "bottom-left" : a && e >= n - le ? "bottom-right" : s ? "top" : o ? "left" : l ? "right" : "none";
}
function Te(e, t, n) {
  const i = t, o = n;
  switch (e) {
    case "top":
      return { top: 0, left: 0, width: i, height: o };
    case "left":
      return { top: 0, left: 0, width: i / 2, height: o };
    case "right":
      return { top: 0, left: i / 2, width: i / 2, height: o };
    case "top-left":
      return { top: 0, left: 0, width: i / 2, height: o / 2 };
    case "top-right":
      return { top: 0, left: i / 2, width: i / 2, height: o / 2 };
    case "bottom-left":
      return { top: o / 2, left: 0, width: i / 2, height: o / 2 };
    case "bottom-right":
      return { top: o / 2, left: i / 2, width: i / 2, height: o / 2 };
    default:
      return null;
  }
}
function vt({ handle: e, host: t, container: n, reservedBottom: i = 0, signal: o, disabled: l, exclude: s, getBounds: a, onStart: c, onSnap: d, onSnapCommit: m, onEnd: g }) {
  let u = !1, w = 0, x = 0, b = 0, h = 0, p = 0, k = 0, N = null, C = 0, z = 0, P = "none";
  const F = () => {
    t.style.left = `${Math.max(0, Math.min(C - p, b))}px`, t.style.top = `${Math.max(0, Math.min(z - k, h))}px`;
  }, R = (K) => {
    u && (C = K.clientX - w, z = K.clientY - x, N && cancelAnimationFrame(N), N = requestAnimationFrame(() => {
      if (F(), N = null, d && n) {
        const D = n.getBoundingClientRect(), E = K.clientX - D.left, j = K.clientY - D.top, O = bt(E, j, D.width, D.height - i);
        O !== P && (P = O, d(O));
      }
    }));
  }, W = (K) => {
    u = !1, document.removeEventListener("pointermove", R, { capture: !0 }), document.removeEventListener("pointerup", W, { capture: !0 }), N && (cancelAnimationFrame(N), N = null, F()), m && P !== "none" && m(P), d && d("none"), P = "none", g == null || g();
  }, Y = (K) => {
    if (l != null && l() || K.target.closest(s)) return;
    J(t);
    const D = t.getBoundingClientRect(), E = n == null ? void 0 : n.getBoundingClientRect();
    p = (E == null ? void 0 : E.left) ?? 0, k = (E == null ? void 0 : E.top) ?? 0, w = K.clientX - D.left, x = K.clientY - D.top;
    const j = (a == null ? void 0 : a()) ?? {
      maxLeft: E ? E.width - D.width : Math.max(0, window.innerWidth - D.width),
      maxTop: E ? E.height - D.height - i : Math.max(0, window.innerHeight - D.height - i)
    };
    b = j.maxLeft, h = j.maxTop, c == null || c(D), u = !0, document.addEventListener("pointermove", R, { capture: !0 }), document.addEventListener("pointerup", W, { capture: !0 });
  }, I = o ? { signal: o } : {};
  return e.addEventListener("pointerdown", Y, I), () => {
    e.removeEventListener("pointerdown", Y), document.removeEventListener("pointermove", R, { capture: !0 }), document.removeEventListener("pointerup", W, { capture: !0 }), N && cancelAnimationFrame(N);
  };
}
function xt({ handle: e, host: t, signal: n, disabled: i, minWidth: o = 180, minHeight: l = 120, explicitAttr: s = "data-explicit", onEnd: a }) {
  let c = !1, d = 0, m = 0, g = 0, u = 0;
  const w = (p) => {
    c && (t.style.setProperty("--ddw-w", `${Math.max(o, g + p.clientX - d)}px`), t.style.setProperty("--ddw-h", `${Math.max(l, u + p.clientY - m)}px`), t.setAttribute(s, ""));
  }, x = () => {
    c = !1, document.removeEventListener("pointermove", w, { capture: !0 }), document.removeEventListener("pointerup", x, { capture: !0 }), a == null || a();
  }, b = (p) => {
    if (i != null && i()) return;
    c = !0, d = p.clientX, m = p.clientY;
    const k = t.getBoundingClientRect();
    g = k.width, u = k.height, document.addEventListener("pointermove", w, { capture: !0 }), document.addEventListener("pointerup", x, { capture: !0 });
  }, h = n ? { signal: n } : {};
  return e.addEventListener("pointerdown", b, h), () => {
    e.removeEventListener("pointerdown", b), document.removeEventListener("pointermove", w, { capture: !0 }), document.removeEventListener("pointerup", x, { capture: !0 });
  };
}
const Ve = "dreamdesk:win:";
function Le(e, t) {
  try {
    localStorage.setItem(Ve + e, JSON.stringify(t));
  } catch {
  }
}
function _e(e) {
  try {
    const t = localStorage.getItem(Ve + e);
    return t ? JSON.parse(t) : null;
  } catch {
    return null;
  }
}
const kt = 1e3, Ae = 24, Nt = 8;
class Xe {
  constructor() {
    this._registry = /* @__PURE__ */ new Map(), this._zStack = [], this._listeners = /* @__PURE__ */ new Set(), this._openRegistry = /* @__PURE__ */ new Map(), this._closeRegistry = /* @__PURE__ */ new Map(), this._cascadeCount = 0;
  }
  getCascadeOffset() {
    const t = this._cascadeCount % Nt;
    return this._cascadeCount++, { dx: t * Ae, dy: t * Ae };
  }
  _notify() {
    this._listeners.forEach((t) => t());
  }
  _reassignZ() {
    this._zStack.forEach((t, n) => {
      const i = this._registry.get(t);
      i && (i.el.style.zIndex = String(kt + n));
    });
  }
  register(t, n, i, o) {
    this._registry.set(t, { id: t, title: i, icon: o == null ? void 0 : o.icon, el: n, isMinimized: !1, toggle: (o == null ? void 0 : o.toggle) ?? (() => {
    }) }), this._zStack.includes(t) || this._zStack.push(t), this._reassignZ(), this._notify();
  }
  unregister(t) {
    if (!this._registry.has(t)) return;
    this._registry.delete(t);
    const n = this._zStack.indexOf(t);
    n !== -1 && this._zStack.splice(n, 1), this._reassignZ(), this._notify();
  }
  raise(t) {
    const n = this._zStack.indexOf(t);
    n !== -1 && this._zStack.splice(n, 1), this._zStack.push(t), this._reassignZ();
  }
  minimize(t) {
    const n = this._registry.get(t);
    n && (n.isMinimized = !0, this._notify());
  }
  restore(t) {
    const n = this._registry.get(t);
    n && (n.isMinimized = !1, this.raise(t), this._notify());
  }
  registerOpen(t, n) {
    this._openRegistry.set(t, n);
  }
  registerClose(t, n) {
    this._closeRegistry.set(t, n);
  }
  close(t) {
    var n;
    (n = this._closeRegistry.get(t)) == null || n();
  }
  open(t) {
    var i;
    const n = this._registry.get(t);
    if (n) {
      n.isMinimized ? n.toggle() : this.raise(t);
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
const Ct = new Xe();
function Et({ track: e, getValue: t, isBlocky: n, isGradient: i }) {
  let o = [], l = null, s = null, a = null;
  const c = 1, d = 10, m = d + c;
  function g() {
    const p = i(), k = getComputedStyle(e), N = e.getBoundingClientRect().width - (parseFloat(k.borderLeftWidth) || 0) - (parseFloat(k.borderRightWidth) || 0), C = Math.max(1, Math.round((N + c) / m)), z = (N - (C - 1) * c) / C, P = N;
    e.innerHTML = "", o = [];
    for (let F = 0; F < C; F++) {
      const R = document.createElement("div");
      R.className = "progress-segment", R.style.cssText = `width:${z}px;margin-right:${F < C - 1 ? c : 0}px`, p && (R.style.backgroundSize = `${P}px 100%`, R.style.backgroundPosition = `-${F * (z + c)}px 0`), e.appendChild(R), o.push(R);
    }
    u(t());
  }
  function u(p) {
    const k = Math.min(Math.max(p, 0), 100), N = Math.floor(k / 100 * o.length);
    o.forEach((C, z) => C.classList.toggle("progress-segment--active", z < N));
  }
  function w(p) {
    if (!l) return;
    const k = Math.min(Math.max(p, 0), 100), N = i();
    if (l.style.width = `${k}%`, !N) {
      const C = getComputedStyle(l).getPropertyValue("--dd-progress-enable-hue-rotate").trim();
      l.style.filter = C === "0" ? "none" : `hue-rotate(${k * 3.6}deg)`;
    }
    l.classList.toggle("progress-bar--complete", p >= 100);
  }
  function x() {
    const p = n(), k = i();
    e.classList.toggle("progress-track--gradient", p && k), p ? (s == null || s.disconnect(), g(), s = new ResizeObserver(() => {
      a && clearTimeout(a), a = setTimeout(g, 50);
    }), s.observe(e)) : (l = e.querySelector(".progress-bar"), w(t()));
  }
  function b(p) {
    n() ? u(p) : w(p);
  }
  function h() {
    s == null || s.disconnect(), a && clearTimeout(a);
  }
  return { update: b, rebuild: x, destroy: h };
}
let ce = [];
const xe = /* @__PURE__ */ new Set(), Ie = /* @__PURE__ */ new Map();
function Dt() {
  xe.forEach((e) => e([...ce]));
}
function Mt(e) {
  clearTimeout(Ie.get(e)), Ie.delete(e), ce = ce.filter((t) => t.id !== e), Dt();
}
function St(e) {
  return xe.add(e), e([...ce]), () => xe.delete(e);
}
function Ye(e) {
  try {
    const n = new DOMParser().parseFromString(e, "image/svg+xml");
    if (n.querySelector("parsererror")) return "";
    const i = (o) => {
      var l;
      if (o.tagName.toLowerCase() === "script") {
        (l = o.parentNode) == null || l.removeChild(o);
        return;
      }
      for (const s of Array.from(o.attributes))
        (s.name.startsWith("on") || s.value.toLowerCase().includes("javascript:")) && o.removeAttribute(s.name);
      Array.from(o.children).forEach(i);
    };
    return i(n.documentElement), new XMLSerializer().serializeToString(n.documentElement);
  } catch {
    return "";
  }
}
function Q({ src: e, size: t = 16, alt: n = "", className: i }) {
  if (!e) return null;
  const o = e.trim(), l = ["dd-icon", i].filter(Boolean).join(" ");
  if (o.startsWith("<svg")) {
    const s = Ye(o);
    return s ? /* @__PURE__ */ r(
      "span",
      {
        className: l,
        style: { width: t, height: t, display: "inline-flex", flexShrink: 0 },
        dangerouslySetInnerHTML: { __html: s },
        "aria-hidden": "true"
      }
    ) : null;
  }
  return /* @__PURE__ */ r(
    "img",
    {
      className: l,
      src: o,
      width: t,
      height: t,
      alt: n,
      style: { flexShrink: 0 }
    }
  );
}
function Bt(e) {
  const t = e.getBoundingClientRect(), n = getComputedStyle(e);
  return {
    top: t.top + (window.scrollY || 0),
    left: t.left + (window.scrollX || 0),
    width: t.width,
    height: t.height,
    position: n.position || "relative",
    zIndex: n.zIndex === "auto" ? "" : n.zIndex
  };
}
function be(e) {
  if (!e) return null;
  const t = e.trim();
  return t.startsWith("<svg") && Ye(t) || null;
}
function ve({
  className: e,
  icon: t,
  disabled: n,
  tooltip: i,
  onClick: o,
  ariaLabel: l
}) {
  const s = n !== void 0 && n !== !1 && n !== "false" && n !== "0", a = typeof n == "string" && n !== "true" && n !== "1" ? n : i;
  return /* @__PURE__ */ r(
    "button",
    {
      className: e,
      "aria-label": l,
      "aria-disabled": s ? "true" : void 0,
      tabIndex: s ? -1 : void 0,
      "data-tooltip": s && a ? a : void 0,
      onClick: (d) => {
        if (s) {
          d.preventDefault();
          return;
        }
        o();
      },
      dangerouslySetInnerHTML: t ? { __html: t } : void 0
    }
  );
}
function re({
  windowId: e,
  title: t = "Window",
  icon: n,
  size: i,
  resizable: o = !0,
  movable: l = !0,
  width: s,
  height: a,
  minimizeIcon: c,
  fullscreenIcon: d,
  closeIcon: m,
  disableMinimize: g,
  disableFullscreen: u,
  disableClose: w,
  fullscreenMode: x,
  bodyOverflow: b,
  scrollContent: h,
  onMinimize: p,
  onFullscreen: k,
  fullscreenAnimation: N,
  defaultOpen: C = !0,
  onClose: z,
  children: P,
  style: F,
  className: R
}) {
  const W = _(null), Y = _(null), I = _(null), K = Z(), D = e ?? K, E = qe(), j = It(), O = $t(), ue = e ? _e(e) : null, [se, et] = B((ue == null ? void 0 : ue.isMinimized) ?? !1), [q, tt] = B(!1), ie = _(null), ee = _(null), nt = !!(s || a), rt = {
    ...s ? { "--ddw-w": s } : {},
    ...a ? { "--ddw-h": a } : {},
    ...j ? { position: "absolute" } : {},
    ...F
  }, he = _(() => {
  }), De = _(() => {
  }), G = A((v = {}) => {
    if (!e) return;
    const f = W.current;
    f && Le(e, {
      left: f.style.left,
      top: f.style.top,
      width: f.style.getPropertyValue("--ddw-w"),
      height: f.style.getPropertyValue("--ddw-h"),
      isOpen: f.style.display !== "none",
      isMinimized: se,
      ...v
    });
  }, [e, se]);
  $(() => {
    const v = W.current;
    if (!v) return;
    const f = e ? _e(e) : null;
    f && (f.left && (v.style.left = f.left), f.top && (v.style.top = f.top), f.width && v.style.setProperty("--ddw-w", f.width), f.height && v.style.setProperty("--ddw-h", f.height), (f.width || f.height) && v.setAttribute("data-explicit", ""));
    const T = C || ((f == null ? void 0 : f.isOpen) ?? !1);
    if (T || (v.style.display = "none"), T) {
      const M = !!(f != null && f.left || f != null && f.top), U = !!(v.style.left || v.style.top);
      if (!M && !U) {
        const S = j == null ? void 0 : j.current;
        if (S) {
          const H = O, L = S.offsetWidth, me = S.offsetHeight - H, pe = v.offsetWidth, ge = v.offsetHeight, { dx: ye, dy: we } = E.getCascadeOffset();
          v.style.left = `${Math.max(8, (L - pe) / 2 + ye)}px`, v.style.top = `${Math.max(8, (me - ge) / 2 + we)}px`;
        }
      }
      if (!f || f.isOpen === !1) {
        const S = v.querySelector(".dd-win");
        S && Be(S);
      }
      if (f != null && f.isMinimized) {
        const S = v.querySelector(".dd-win");
        S && (S.style.transformOrigin = "50% 100%", S.style.transform = "scale(0)"), v.style.pointerEvents = "none";
      }
      E.register(D, v, t ?? "Window", { icon: n, toggle: () => he.current() }), f != null && f.isMinimized && E.minimize(D);
    }
    return E.registerClose(D, () => De.current()), E.registerOpen(D, () => {
      if (!v || !document.contains(v)) return;
      v.style.display = "";
      const M = !!(f != null && f.left || f != null && f.top), U = !!(v.style.left || v.style.top);
      if (!M && !U) {
        const H = j == null ? void 0 : j.current;
        if (H) {
          const L = O, me = H.offsetWidth, pe = H.offsetHeight - L, ge = v.offsetWidth, ye = v.offsetHeight, { dx: we, dy: at } = E.getCascadeOffset();
          v.style.left = `${Math.max(8, (me - ge) / 2 + we)}px`, v.style.top = `${Math.max(8, (pe - ye) / 2 + at)}px`;
        }
      }
      const S = v.querySelector(".dd-win");
      S && (S.getAnimations().forEach((H) => H.cancel()), S.style.transform = "", S.style.transformOrigin = "", Be(S)), E.register(D, v, t ?? "Window", { icon: n, toggle: () => he.current() }), E.raise(D), G({ isOpen: !0, isMinimized: !1 });
    }), () => E.unregister(D);
  }, [D, t, n, E]);
  const fe = A(() => {
    E.raise(D);
  }, [D]), Me = A(() => {
    var M;
    const v = (M = W.current) == null ? void 0 : M.querySelector(".dd-win"), f = W.current;
    if (!v || !f) return;
    const T = !se;
    T ? (ft(v), E.minimize(D), f.style.pointerEvents = "none") : (v.style.transform = "", v.style.transformOrigin = "", mt(v), E.restore(D), f.style.pointerEvents = ""), et(T), p == null || p(T), G({ isMinimized: T });
  }, [se, p, D, E, G]);
  he.current = Me;
  const st = A(() => {
    const v = W.current;
    if (!v) return;
    if (!q && ee.current) {
      const M = ee.current;
      ee.current = null;
      const U = v.getBoundingClientRect();
      v.style.left = M.left, v.style.top = M.top, v.style.setProperty("--ddw-w", M.width), v.style.setProperty("--ddw-h", M.height), yt(v, U);
      return;
    }
    const f = !q, T = () => {
      f ? (ie.current = Bt(v), v.setAttribute("data-explicit", ""), pt(v, ie.current)) : ie.current && gt(v, ie.current);
    };
    N ? N(v, { isFullscreen: f, defaultFn: T }) : T(), tt(f), k == null || k(f);
  }, [q, k, N]), Se = A(() => {
    var T;
    const v = (T = W.current) == null ? void 0 : T.querySelector(".dd-win"), f = W.current;
    !v || !f || wt(v, () => {
      f.style.display = "none", E.unregister(D), e && Le(e, { isOpen: !1 }), z == null || z();
    });
  }, [z, E, D, e]);
  De.current = Se, $(() => {
    const v = Y.current, f = W.current;
    if (!v || !f || !l) return;
    const T = (j == null ? void 0 : j.current) ?? null;
    let M = null;
    T && (M = document.createElement("div"), M.style.cssText = "position:absolute;pointer-events:none;background:rgba(100,150,255,0.18);border:2px solid rgba(100,150,255,0.45);border-radius:4px;z-index:9998;transition:top 0.08s,left 0.08s,width 0.08s,height 0.08s;display:none;box-sizing:border-box", T.appendChild(M));
    const U = vt({
      handle: v,
      host: f,
      container: T,
      reservedBottom: O,
      exclude: ".dd-win-controls",
      disabled: () => q && x !== "expand",
      onStart: (S) => {
        ee.current = null, f.hasAttribute("data-explicit") || (f.style.setProperty("--ddw-w", `${S.width}px`), f.style.setProperty("--ddw-h", `${S.height}px`), f.setAttribute("data-explicit", ""));
        const H = getComputedStyle(f).position;
        if (H === "static" || H === "relative") {
          const L = T == null ? void 0 : T.getBoundingClientRect();
          f.style.position = "absolute", f.style.left = `${S.left + (window.scrollX || 0) - ((L == null ? void 0 : L.left) ?? 0)}px`, f.style.top = `${S.top + (window.scrollY || 0) - ((L == null ? void 0 : L.top) ?? 0)}px`;
        }
        fe();
      },
      onSnap: (S) => {
        if (!M || !T) return;
        if (S === "none") {
          M.style.display = "none";
          return;
        }
        const H = T.getBoundingClientRect(), L = Te(S, H.width, H.height - O);
        if (!L) {
          M.style.display = "none";
          return;
        }
        M.style.display = "block", M.style.left = `${L.left}px`, M.style.top = `${L.top}px`, M.style.width = `${L.width}px`, M.style.height = `${L.height}px`;
      },
      onSnapCommit: (S) => {
        if (M && (M.style.display = "none"), !T) return;
        const H = T.getBoundingClientRect(), L = Te(S, H.width, H.height - O);
        L && (ee.current = {
          left: f.style.left,
          top: f.style.top,
          width: f.style.getPropertyValue("--ddw-w"),
          height: f.style.getPropertyValue("--ddw-h")
        }, f.style.left = `${L.left}px`, f.style.top = `${L.top}px`, f.style.setProperty("--ddw-w", `${L.width}px`), f.style.setProperty("--ddw-h", `${L.height}px`), f.setAttribute("data-explicit", ""));
      },
      onEnd: () => G()
    });
    return () => {
      U(), M == null || M.remove();
    };
  }, [l, q, x, fe, j, O, G]), $(() => {
    const v = I.current, f = W.current;
    if (!(!v || !f || !o))
      return xt({
        handle: v,
        host: f,
        disabled: () => q,
        onEnd: () => G()
      });
  }, [o, q, G]);
  const it = be(c), ot = be(d), lt = be(m);
  return /* @__PURE__ */ r(
    "div",
    {
      ref: W,
      className: ["dd-window", R].filter(Boolean).join(" "),
      "data-size": i,
      "data-explicit": nt ? "" : void 0,
      style: rt,
      onPointerDown: fe,
      children: /* @__PURE__ */ y("div", { className: "dd-win", children: [
        /* @__PURE__ */ y(
          "div",
          {
            ref: Y,
            className: ["dd-win-header", l ? "" : "dd-win-header--no-move"].filter(Boolean).join(" "),
            children: [
              /* @__PURE__ */ y("div", { className: "dd-win-title-group", children: [
                n && /* @__PURE__ */ r(Q, { src: n, size: 16, className: "dd-win-title-icon" }),
                /* @__PURE__ */ r("span", { className: "dd-win-title", children: t })
              ] }),
              /* @__PURE__ */ y("div", { className: "dd-win-controls", children: [
                /* @__PURE__ */ r(
                  ve,
                  {
                    className: "dd-btn--minimize",
                    icon: it,
                    disabled: g,
                    onClick: Me,
                    ariaLabel: "minimize"
                  }
                ),
                /* @__PURE__ */ r(
                  ve,
                  {
                    className: "dd-btn--fullscreen",
                    icon: ot,
                    disabled: u,
                    onClick: st,
                    ariaLabel: "fullscreen"
                  }
                ),
                /* @__PURE__ */ r(
                  ve,
                  {
                    className: "dd-btn--close",
                    icon: lt,
                    disabled: w,
                    onClick: Se,
                    ariaLabel: "close"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ r(
          "div",
          {
            className: "dd-win-body",
            style: {
              ...b ? { "--dd-body-overflow": b } : {},
              ...h ? { "--dd-body-overflow": "hidden", padding: 0, display: "flex", flexDirection: "column", flex: "1 1 0", minHeight: 0 } : {}
            },
            children: h ? /* @__PURE__ */ r("div", { className: "dd-win-scroll-content", children: P }) : P
          }
        ),
        o && /* @__PURE__ */ r("div", { ref: I, className: "dd-win-resize-handle" })
      ] })
    }
  );
}
function Tt({ x: e, y: t, items: n, onClose: i }) {
  const o = _(null);
  return $(() => {
    const l = o.current;
    if (!l) return;
    const { width: s, height: a } = l.getBoundingClientRect(), c = e + s > window.innerWidth ? window.innerWidth - s - 4 : e, d = t + a > window.innerHeight ? window.innerHeight - a - 4 : t;
    l.style.setProperty("--dd-cm-x", `${c}px`), l.style.setProperty("--dd-cm-y", `${d}px`);
  }, [e, t]), $(() => {
    const l = (c) => {
      c.key === "Escape" && i();
    }, s = () => i(), a = () => i();
    return window.addEventListener("keydown", l), window.addEventListener("mousedown", s), window.addEventListener("scroll", a, !0), () => {
      window.removeEventListener("keydown", l), window.removeEventListener("mousedown", s), window.removeEventListener("scroll", a, !0);
    };
  }, [i]), Fe(
    /* @__PURE__ */ r(
      "div",
      {
        ref: o,
        className: "dd-context-menu",
        style: { "--dd-cm-x": `${e}px`, "--dd-cm-y": `${t}px` },
        onMouseDown: (l) => l.stopPropagation(),
        children: n.map(
          (l, s) => l.type === "separator" ? /* @__PURE__ */ r("div", { className: "dd-cm-separator" }, s) : /* @__PURE__ */ y(
            "button",
            {
              className: "dd-cm-item",
              disabled: l.disabled,
              onClick: () => {
                l.disabled || (l.onClick(), i());
              },
              children: [
                l.icon !== void 0 && /* @__PURE__ */ r("span", { className: "dd-cm-icon", children: l.icon }),
                /* @__PURE__ */ r("span", { className: "dd-cm-label", children: l.label }),
                l.shortcut && /* @__PURE__ */ r("span", { className: "dd-cm-shortcut", children: l.shortcut })
              ]
            },
            s
          )
        )
      }
    ),
    document.body
  );
}
function Lt(e) {
  const [t, n] = B(null), i = A((l) => {
    l.preventDefault(), l.stopPropagation(), n({ x: l.clientX, y: l.clientY });
  }, []), o = t ? /* @__PURE__ */ r(Tt, { x: t.x, y: t.y, items: e, onClose: () => n(null) }) : null;
  return { onContextMenu: i, contextMenu: o };
}
const _t = 36, $e = 40, ze = 24, At = 10, de = ne(null);
function en({ children: e, className: t, style: n, taskbarHeight: i = _t, contextMenuItems: o = [] }) {
  const l = dt(() => new Xe(), []), s = _(null), { onContextMenu: a, contextMenu: c } = Lt(o), d = _(/* @__PURE__ */ new Map()), [m, g] = B([]), u = _(0), w = A((h) => {
    d.current.set(h.id, h);
  }, []), x = A((h) => {
    const p = d.current.get(h);
    if (!p) return null;
    const k = `${h}__${Math.random().toString(36).slice(2)}`, N = u.current % At, C = $e + N * ze, z = $e + N * ze;
    return u.current++, g((P) => [...P, { instanceId: k, def: p, top: C, left: z }]), k;
  }, []), b = A((h) => {
    g((p) => p.filter((k) => k.instanceId !== h));
  }, []);
  return /* @__PURE__ */ r(de.Provider, { value: { wm: l, containerRef: s, taskbarHeight: i, registerApp: w, launch: x, closeApp: b }, children: /* @__PURE__ */ y(
    "div",
    {
      ref: s,
      className: ["dd-desktop", t].filter(Boolean).join(" "),
      style: {
        "--dd-taskbar-h": `${i}px`,
        ...n
      },
      onContextMenu: a,
      children: [
        e,
        c,
        m.map(({ instanceId: h, def: p, top: k, left: N }) => /* @__PURE__ */ r(
          re,
          {
            title: p.title,
            icon: p.icon,
            width: p.defaultWidth,
            height: p.defaultHeight,
            style: { top: k, left: N },
            onClose: () => b(h),
            children: /* @__PURE__ */ r(p.component, {})
          },
          h
        ))
      ]
    }
  ) });
}
function qe() {
  var e;
  return ((e = X(de)) == null ? void 0 : e.wm) ?? Ct;
}
function It() {
  var e;
  return ((e = X(de)) == null ? void 0 : e.containerRef) ?? null;
}
function $t() {
  var e;
  return ((e = X(de)) == null ? void 0 : e.taskbarHeight) ?? 0;
}
const zt = 200;
function Pt() {
  const [e, t] = B(() => Pe(/* @__PURE__ */ new Date()));
  return $(() => {
    const n = setInterval(() => t(Pe(/* @__PURE__ */ new Date())), 1e3);
    return () => clearInterval(n);
  }, []), /* @__PURE__ */ r("div", { className: "dd-taskbar-clock", children: e });
}
function Pe(e) {
  return e.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function tn({ clock: e = !0, className: t, startMenu: n }) {
  const i = qe(), [o, l] = B(() => i.getWindows());
  return $(() => (l(i.getWindows()), i.subscribe(() => {
    const s = i.getWindows(), a = new Set(s.map((c) => c.id));
    l((c) => c.some((m) => !m.leaving && !a.has(m.id)) ? c.map((m) => a.has(m.id) ? m : { ...m, leaving: !0 }) : s);
  })), [i]), $(() => {
    if (o.filter((c) => c.leaving).length === 0) return;
    const a = setTimeout(() => l(i.getWindows()), zt);
    return () => clearTimeout(a);
  }, [o, i]), /* @__PURE__ */ y("div", { className: ["dd-taskbar", t].filter(Boolean).join(" "), children: [
    n,
    /* @__PURE__ */ r("div", { className: "dd-taskbar-windows", children: o.map((s) => /* @__PURE__ */ y(
      "button",
      {
        className: [
          "dd-taskbar-btn",
          s.leaving ? "dd-taskbar-btn--leaving" : s.isMinimized ? "dd-taskbar-btn--minimized" : "dd-taskbar-btn--active"
        ].join(" "),
        onClick: () => s.toggle(),
        title: s.title,
        children: [
          s.icon && /* @__PURE__ */ r(Q, { src: s.icon, size: 16 }),
          /* @__PURE__ */ r("span", { className: "dd-taskbar-btn-label", children: s.title })
        ]
      },
      s.id
    )) }),
    e && /* @__PURE__ */ r(Pt, {})
  ] });
}
function nn({ label: e = "DreamDesk", items: t, onSelect: n, buttonLabel: i = "Start", className: o }) {
  const [l, s] = B(!1), a = _(null), c = A(() => s(!1), []);
  return $(() => {
    if (!l) return;
    const d = (g) => {
      a.current && !a.current.contains(g.target) && c();
    }, m = (g) => {
      g.key === "Escape" && c();
    };
    return document.addEventListener("pointerdown", d), document.addEventListener("keydown", m), () => {
      document.removeEventListener("pointerdown", d), document.removeEventListener("keydown", m);
    };
  }, [l, c]), /* @__PURE__ */ y("div", { ref: a, className: ["dd-startmenu-wrap", o].filter(Boolean).join(" "), children: [
    l && /* @__PURE__ */ y("div", { className: "dd-startmenu", children: [
      /* @__PURE__ */ r("div", { className: "dd-startmenu-brand", children: e }),
      /* @__PURE__ */ r("ul", { className: "dd-startmenu-list", children: t.map(
        (d) => d.divider ? /* @__PURE__ */ r("li", { className: "dd-startmenu-divider", role: "separator" }, d.id) : /* @__PURE__ */ y(
          "li",
          {
            className: "dd-startmenu-item",
            role: "menuitem",
            onClick: () => {
              n(d.id), c();
            },
            children: [
              d.icon && /* @__PURE__ */ r(Q, { src: d.icon, size: 24, className: "dd-startmenu-icon" }),
              /* @__PURE__ */ r("span", { children: d.label })
            ]
          },
          d.id
        )
      ) })
    ] }),
    /* @__PURE__ */ r(
      "button",
      {
        className: ["dd-startmenu-btn", l ? "dd-startmenu-btn--active" : ""].filter(Boolean).join(" "),
        onClick: () => s((d) => !d),
        "aria-haspopup": "menu",
        "aria-expanded": l,
        children: i
      }
    )
  ] });
}
function rn({ src: e, gradient: t, color: n, tile: i = !1, tileSize: o = 64, className: l }) {
  const s = {};
  return e ? (s.backgroundImage = `url(${e})`, s.backgroundSize = i ? typeof o == "number" ? `${o}px` : o : "cover", s.backgroundRepeat = i ? "repeat" : "no-repeat", s.backgroundPosition = i ? "top left" : "center") : t ? (s.backgroundImage = t, s.backgroundSize = "cover") : n && (s.backgroundColor = n), /* @__PURE__ */ r("div", { className: ["dd-wallpaper", l].filter(Boolean).join(" "), style: s });
}
function Wt({ type: e = "notification", message: t, onClose: n }) {
  const [i, o] = B(!0), l = _(t);
  if ($(() => {
    t !== l.current && (l.current = t, o(!0));
  }, [t]), !i) return null;
  const s = () => {
    o(!1), n == null || n();
  };
  return /* @__PURE__ */ y("div", { className: `toast toast-${e}`, children: [
    /* @__PURE__ */ r("button", { className: "toast-btn--close", onClick: s, "aria-label": "close", children: "×" }),
    t
  ] });
}
function sn({ position: e = "bottom-right", maxStack: t = 5 }) {
  const [n, i] = B([]);
  $(() => St(i), []);
  const o = n.slice(-t);
  return /* @__PURE__ */ r("div", { className: `dd-toast-container dd-toast-container--${e}`, children: o.map((l) => /* @__PURE__ */ r(
    Wt,
    {
      type: l.type,
      message: l.message,
      onClose: () => Mt(l.id)
    },
    l.id
  )) });
}
function on({ label: e, icon: t, iconSize: n = 48, onClick: i, className: o, style: l }) {
  return /* @__PURE__ */ y(
    "button",
    {
      className: ["dd-desktop-icon", o].filter(Boolean).join(" "),
      onClick: i,
      style: l,
      title: e,
      children: [
        /* @__PURE__ */ r(Q, { src: t, size: n }),
        /* @__PURE__ */ r("span", { className: "dd-desktop-icon-label", children: e })
      ]
    }
  );
}
function Rt({
  variant: e = "primary",
  size: t,
  disabled: n = !1,
  action: i,
  minWidth: o,
  width: l,
  height: s,
  fontSize: a,
  px: c,
  py: d,
  onClick: m,
  children: g,
  className: u,
  style: w
}) {
  const x = {
    ...o ? { "--dd-btn-min-w": o } : {},
    ...l ? { "--dd-btn-w": l } : {},
    ...s ? { "--dd-btn-h": s } : {},
    ...a ? { "--dd-btn-fs": a } : {},
    ...c ? { "--dd-btn-px": c } : {},
    ...d ? { "--dd-btn-py": d } : {},
    ...w
  }, b = [
    "btn",
    `btn--${e}`,
    n ? "btn--disable" : "",
    t ? `btn--size-${t}` : "",
    u
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ r(
    "button",
    {
      className: b,
      style: x,
      disabled: n,
      "aria-disabled": n ? "true" : void 0,
      tabIndex: n ? -1 : void 0,
      "data-action": i,
      "aria-label": i,
      onClick: n ? void 0 : m,
      children: g
    }
  );
}
function ln({
  type: e = "text",
  label: t,
  layout: n = "block",
  id: i,
  value: o,
  defaultValue: l,
  placeholder: s,
  disabled: a,
  onChange: c,
  className: d,
  style: m
}) {
  const g = Z(), u = i ?? g, w = n === "inline" ? { display: "flex", alignItems: "center", gap: "0.5rem" } : {};
  return /* @__PURE__ */ y("div", { className: ["input-grid", d].filter(Boolean).join(" "), style: { ...w, ...m }, children: [
    t && /* @__PURE__ */ r("label", { className: "input-label", htmlFor: u, children: t }),
    /* @__PURE__ */ r(
      "input",
      {
        type: e,
        id: u,
        className: "dreamdesk-input",
        ...o !== void 0 ? { value: o, onChange: c ? (x) => c(x.target.value, x) : void 0 } : { defaultValue: l, onChange: c ? (x) => c(x.target.value, x) : void 0 },
        placeholder: s,
        disabled: a
      }
    )
  ] });
}
function an({
  value: e = 0,
  blocky: t = !1,
  gradient: n = !1,
  className: i,
  style: o
}) {
  const l = _(null), s = _(null);
  $(() => {
    var d;
    const c = l.current;
    if (c)
      return (d = s.current) == null || d.destroy(), s.current = Et({
        track: c,
        getValue: () => e,
        isBlocky: () => t,
        isGradient: () => n
      }), s.current.rebuild(), () => {
        var m;
        (m = s.current) == null || m.destroy(), s.current = null;
      };
  }, [t, n]), $(() => {
    var c;
    (c = s.current) == null || c.update(e);
  }, [e]);
  const a = [
    "progress-track",
    t ? "progress-track--blocky" : "",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ r("div", { ref: l, className: a, style: o, children: !t && /* @__PURE__ */ r("div", { className: ["progress-bar", n ? "progress-bar--gradient" : ""].filter(Boolean).join(" ") }) });
}
function We({ children: e, index: t = 0, active: n = !1, onClick: i }) {
  return /* @__PURE__ */ r(
    "dreamdesk-tab",
    {
      class: n ? "active" : void 0,
      "data-tab": "",
      "data-tab-index": String(t),
      onClick: () => i == null ? void 0 : i(t),
      children: e
    }
  );
}
function Re({ children: e, active: t = !1, style: n }) {
  return /* @__PURE__ */ r(
    "dreamdesk-tab-panel",
    {
      class: t ? "active" : void 0,
      "data-panel": "",
      style: { display: t ? "block" : "none", ...n },
      children: e
    }
  );
}
function cn({
  defaultIndex: e = 0,
  activeIndex: t,
  onChange: n,
  children: i,
  className: o,
  style: l
}) {
  const [s, a] = B(e), c = t ?? s, d = (u) => {
    t === void 0 && a(u), n == null || n(u);
  }, m = [], g = [];
  return He.forEach(i, (u) => {
    if (Ke(u)) {
      if (u.type === We) {
        const w = m.length;
        m.push(
          /* @__PURE__ */ r(We, { index: w, active: w === c, onClick: d, children: u.props.children }, w)
        );
      } else if (u.type === Re) {
        const w = g.length;
        g.push(
          /* @__PURE__ */ r(Re, { active: w === c, style: u.props.style, children: u.props.children }, w)
        );
      }
    }
  }), /* @__PURE__ */ y("div", { className: ["tabs", o].filter(Boolean).join(" "), style: l, children: [
    /* @__PURE__ */ r("div", { className: "tab-list", children: m }),
    /* @__PURE__ */ r("div", { className: "tab-panels", children: g })
  ] });
}
function dn({ checked: e, defaultChecked: t, onChange: n, style: i, className: o }) {
  const { theme: l } = ht(), s = e !== void 0, a = t ?? l === "dark";
  return /* @__PURE__ */ y("label", { className: ["toggle", o].filter(Boolean).join(" "), style: i, children: [
    /* @__PURE__ */ r(
      "input",
      {
        type: "checkbox",
        checked: s ? e : void 0,
        defaultChecked: s ? void 0 : a,
        onChange: (c) => n == null ? void 0 : n(c.target.checked)
      }
    ),
    /* @__PURE__ */ r("span", { className: "slider", children: /* @__PURE__ */ r("span", { className: "knob" }) })
  ] });
}
function un({ children: e, className: t, ...n }) {
  return /* @__PURE__ */ r(
    re,
    {
      ...n,
      className: ["terminal-window", t].filter(Boolean).join(" "),
      children: /* @__PURE__ */ r("div", { className: "terminal-win-body", children: e })
    }
  );
}
const Ce = ne({ openIndex: null, setOpenIndex: () => {
} });
function jt() {
  return /* @__PURE__ */ r("div", { className: "dd-menu-separator" });
}
function ae({ children: e, shortcut: t, checked: n, disabled: i, onClick: o }) {
  const { setOpenIndex: l } = X(Ce), s = () => {
    i || (o == null || o(), l(null));
  };
  return /* @__PURE__ */ y(
    "button",
    {
      className: "dd-menu-item",
      disabled: i,
      onClick: s,
      onKeyDown: (c) => {
        (c.key === "Enter" || c.key === " ") && (c.preventDefault(), s());
      },
      role: "menuitem",
      children: [
        n !== void 0 && /* @__PURE__ */ r("span", { className: "dd-menu-item-check", children: n ? "✓" : "" }),
        /* @__PURE__ */ r("span", { className: "dd-menu-item-label", children: e }),
        t && /* @__PURE__ */ r("span", { className: "dd-menu-item-shortcut", children: t })
      ]
    }
  );
}
function ke({ label: e, children: t, index: n = 0 }) {
  const { openIndex: i, setOpenIndex: o } = X(Ce), l = i === n, s = _(null), a = _(null), c = () => o(n), d = () => o(null);
  return /* @__PURE__ */ y("div", { style: { position: "relative" }, onMouseEnter: () => {
    i !== null && i !== n && o(n);
  }, children: [
    /* @__PURE__ */ r(
      "button",
      {
        ref: s,
        className: "dd-menu-trigger",
        "aria-haspopup": "menu",
        "aria-expanded": l,
        onClick: () => l ? d() : c(),
        onKeyDown: (x) => {
          (x.key === "ArrowDown" || x.key === "Enter" || x.key === " ") && (x.preventDefault(), c(), requestAnimationFrame(() => {
            var h;
            const b = (h = a.current) == null ? void 0 : h.querySelector(".dd-menu-item:not(:disabled)");
            b == null || b.focus();
          })), x.key === "Escape" && d();
        },
        children: e
      }
    ),
    l && /* @__PURE__ */ r(
      "div",
      {
        ref: a,
        className: "dd-menu-dropdown",
        role: "menu",
        onKeyDown: (x) => {
          var b, h;
          if (x.key === "Escape" && (d(), (b = s.current) == null || b.focus()), x.key === "ArrowDown" || x.key === "ArrowUp") {
            x.preventDefault();
            const p = Array.from(((h = a.current) == null ? void 0 : h.querySelectorAll(".dd-menu-item:not(:disabled)")) ?? []), k = document.activeElement, N = p.indexOf(k), C = x.key === "ArrowDown" ? p[(N + 1) % p.length] : p[(N - 1 + p.length) % p.length];
            C == null || C.focus();
          }
        },
        children: t
      }
    )
  ] });
}
function Ht({ children: e, className: t, style: n }) {
  const [i, o] = B(null), l = _(null), s = A((d) => o(d), []);
  $(() => {
    if (i === null) return;
    const d = (m) => {
      var g;
      (g = l.current) != null && g.contains(m.target) || o(null);
    };
    return window.addEventListener("mousedown", d), () => window.removeEventListener("mousedown", d);
  }, [i]);
  let a = 0;
  const c = He.map(e, (d) => Ke(d) && d.type === ke ? { ...d, props: { ...d.props, index: a++ } } : d);
  return /* @__PURE__ */ r(Ce.Provider, { value: { openIndex: i, setOpenIndex: s }, children: /* @__PURE__ */ r(
    "div",
    {
      ref: l,
      className: ["dd-menubar", t].filter(Boolean).join(" "),
      style: n,
      role: "menubar",
      children: c
    }
  ) });
}
function te({ children: e, flex: t, className: n }) {
  return /* @__PURE__ */ r(
    "div",
    {
      className: [
        "dd-statusbar-section",
        t && "dd-statusbar-section--flex",
        n
      ].filter(Boolean).join(" "),
      children: e
    }
  );
}
function Ee({ children: e, className: t, style: n }) {
  return /* @__PURE__ */ r(
    "div",
    {
      className: ["dd-statusbar", t].filter(Boolean).join(" "),
      style: n,
      role: "status",
      children: e
    }
  );
}
function Kt(e, t) {
  const n = e.slice(0, t).split(`
`);
  return { ln: n.length, col: n[n.length - 1].length + 1 };
}
function hn({ defaultValue: e = "", value: t, onChange: n, className: i, onClose: o, ...l }) {
  const s = t !== void 0, [a, c] = B(e), d = s ? t : a, [m, g] = B({ ln: 1, col: 1 }), u = A((b) => {
    s || c(b.target.value), n == null || n(b.target.value);
  }, [s, n]), w = A((b) => {
    const h = b.currentTarget;
    g(Kt(h.value, h.selectionStart ?? 0));
  }, []), x = A(() => {
    s || c(""), n == null || n("");
  }, [s, n]);
  return /* @__PURE__ */ y(
    re,
    {
      ...l,
      className: ["dd-notepad-window", i].filter(Boolean).join(" "),
      onClose: o,
      bodyOverflow: "hidden",
      children: [
        /* @__PURE__ */ y(Ht, { children: [
          /* @__PURE__ */ y(ke, { label: "File", children: [
            /* @__PURE__ */ r(ae, { onClick: x, children: "New" }),
            /* @__PURE__ */ r(jt, {}),
            /* @__PURE__ */ r(ae, { onClick: o, children: "Exit" })
          ] }),
          /* @__PURE__ */ y(ke, { label: "Edit", children: [
            /* @__PURE__ */ r(ae, { onClick: () => {
              var b;
              (b = navigator.clipboard) == null || b.writeText(d);
            }, children: "Copy All" }),
            /* @__PURE__ */ r(ae, { onClick: x, children: "Select All & Delete" })
          ] })
        ] }),
        /* @__PURE__ */ r("div", { style: { flex: 1, minHeight: 0, margin: "4px 6px", border: "var(--dd-border, var(--border, 1px solid #000))", display: "flex" }, children: /* @__PURE__ */ r(
          "textarea",
          {
            value: d,
            onChange: u,
            onSelect: w,
            onClick: w,
            onKeyUp: w,
            spellCheck: !1,
            style: {
              flex: 1,
              resize: "none",
              border: "none",
              outline: "none",
              padding: "4px",
              fontFamily: "var(--font-ui, monospace)",
              fontSize: "0.85rem",
              background: "var(--color-input-background, #fff)",
              color: "var(--color-text, #000)"
            }
          }
        ) }),
        /* @__PURE__ */ r(Ee, { children: /* @__PURE__ */ y(te, { children: [
          "Ln ",
          m.ln,
          ", Col ",
          m.col
        ] }) })
      ]
    }
  );
}
function Ge(e, t) {
  var i;
  const n = [];
  for (const o of e)
    n.push(o), (i = o.children) != null && i.length && t.has(o.id) && n.push(...Ge(o.children, t));
  return n;
}
function Ft({ node: e, depth: t, isLast: n, expanded: i, selected: o, onToggle: l, onSelect: s, onOpen: a }) {
  var u;
  const c = !!((u = e.children) != null && u.length), d = i.has(e.id), m = o === e.id, g = e.icon && (e.icon.startsWith("/") || e.icon.startsWith("http") || e.icon.startsWith("<svg"));
  return /* @__PURE__ */ y(
    "div",
    {
      className: ["dd-tree-node", m && "dd-tree-node--selected"].filter(Boolean).join(" "),
      role: "treeitem",
      "aria-selected": m,
      "aria-expanded": c ? d : void 0,
      tabIndex: m ? 0 : -1,
      onClick: () => s(e.id),
      onDoubleClick: () => a(e.id),
      children: [
        Array.from({ length: t }, (w, x) => /* @__PURE__ */ r("span", { className: "dd-tree-indent" }, x)),
        /* @__PURE__ */ r("span", { className: ["dd-tree-connector", n && "dd-tree-connector--last"].filter(Boolean).join(" "), children: c && /* @__PURE__ */ r(
          "button",
          {
            className: "dd-tree-expander",
            tabIndex: -1,
            onClick: (w) => {
              w.stopPropagation(), l(e.id);
            },
            children: d ? "−" : "+"
          }
        ) }),
        e.icon && /* @__PURE__ */ r("span", { className: "dd-tree-node-icon", children: g ? /* @__PURE__ */ r(Q, { src: e.icon, size: 16 }) : e.icon }),
        /* @__PURE__ */ r("span", { className: "dd-tree-node-label", children: e.label })
      ]
    }
  );
}
function Ot({ nodes: e, selected: t, defaultExpanded: n = [], onSelect: i, onOpen: o, className: l, style: s }) {
  const [a, c] = B(() => new Set(n)), d = _(null), m = A((b) => {
    c((h) => {
      const p = new Set(h);
      return p.has(b) ? p.delete(b) : p.add(b), p;
    });
  }, []), g = A((b) => i == null ? void 0 : i(b), [i]), u = A((b) => o == null ? void 0 : o(b), [o]), w = (b) => {
    var N;
    if (!t) return;
    const h = Ge(e, a), p = h.findIndex((C) => C.id === t);
    if (p === -1) return;
    const k = h[p];
    b.key === "ArrowDown" ? (b.preventDefault(), p < h.length - 1 && (i == null || i(h[p + 1].id))) : b.key === "ArrowUp" ? (b.preventDefault(), p > 0 && (i == null || i(h[p - 1].id))) : b.key === "ArrowRight" ? (b.preventDefault(), (N = k.children) != null && N.length && !a.has(k.id) && m(k.id)) : b.key === "ArrowLeft" ? (b.preventDefault(), a.has(k.id) && m(k.id)) : b.key === "Enter" && (b.preventDefault(), o == null || o(k.id));
  };
  function x(b, h) {
    return b.map((p, k) => {
      var C;
      const N = k === b.length - 1;
      return /* @__PURE__ */ y("div", { className: ["dd-tree-subtree", N && "dd-tree-subtree--last"].filter(Boolean).join(" "), children: [
        /* @__PURE__ */ r(
          Ft,
          {
            node: p,
            depth: h,
            isLast: N,
            expanded: a,
            selected: t,
            onToggle: m,
            onSelect: g,
            onOpen: u
          }
        ),
        (C = p.children) != null && C.length && a.has(p.id) ? /* @__PURE__ */ r("div", { role: "group", children: x(p.children, h + 1) }) : null
      ] }, p.id);
    });
  }
  return /* @__PURE__ */ r(
    "div",
    {
      ref: d,
      className: ["dd-treeview", l].filter(Boolean).join(" "),
      style: s,
      role: "tree",
      onKeyDown: w,
      children: x(e, 0)
    }
  );
}
function je({ icon: e, size: t }) {
  if (!e) return null;
  const n = e.startsWith("/") || e.startsWith("http") || e.startsWith("<svg");
  return /* @__PURE__ */ r("span", { className: "dd-listview-icon", children: n ? /* @__PURE__ */ r(Q, { src: e, size: t }) : /* @__PURE__ */ r("span", { style: { fontSize: t * 0.75 }, children: e }) });
}
function Vt({
  items: e,
  mode: t = "details",
  selected: n = [],
  multiSelect: i = !1,
  onSelect: o,
  onOpen: l,
  className: s,
  style: a
}) {
  const [c, d] = B("name"), [m, g] = B("asc"), u = (h) => {
    c === h ? g((p) => p === "asc" ? "desc" : "asc") : (d(h), g("asc"));
  }, w = [...e].sort((h, p) => {
    const k = (h[c] ?? "").toLowerCase(), N = (p[c] ?? "").toLowerCase(), C = k < N ? -1 : k > N ? 1 : 0;
    return m === "asc" ? C : -C;
  }), x = A((h, p) => {
    if (!i) {
      o == null || o([h]);
      return;
    }
    p.ctrlKey || p.metaKey ? o == null || o(n.includes(h) ? n.filter((k) => k !== h) : [...n, h]) : o == null || o([h]);
  }, [n, i, o]), b = ({ col: h }) => c === h ? /* @__PURE__ */ r("span", { className: "dd-listview-sort-arrow", children: m === "asc" ? " ▲" : " ▼" }) : null;
  return t === "icons" ? /* @__PURE__ */ r("div", { className: ["dd-listview dd-listview--icons", s].filter(Boolean).join(" "), style: a, role: "listbox", children: w.map((h) => /* @__PURE__ */ y(
    "div",
    {
      className: ["dd-listview-icon-item", n.includes(h.id) && "dd-listview-item--selected"].filter(Boolean).join(" "),
      role: "option",
      "aria-selected": n.includes(h.id),
      onClick: (p) => x(h.id, p),
      onDoubleClick: () => l == null ? void 0 : l(h.id),
      children: [
        /* @__PURE__ */ r(je, { icon: h.icon, size: 32 }),
        /* @__PURE__ */ r("span", { className: "dd-listview-icon-label", children: h.name })
      ]
    },
    h.id
  )) }) : /* @__PURE__ */ r("div", { className: ["dd-listview dd-listview--details", s].filter(Boolean).join(" "), style: a, children: /* @__PURE__ */ y("table", { className: "dd-listview-table", role: "grid", children: [
    /* @__PURE__ */ r("thead", { children: /* @__PURE__ */ y("tr", { children: [
      /* @__PURE__ */ y("th", { className: "dd-listview-th dd-listview-th--name", onClick: () => u("name"), children: [
        "Name",
        /* @__PURE__ */ r(b, { col: "name" })
      ] }),
      /* @__PURE__ */ y("th", { className: "dd-listview-th", onClick: () => u("size"), children: [
        "Size",
        /* @__PURE__ */ r(b, { col: "size" })
      ] }),
      /* @__PURE__ */ y("th", { className: "dd-listview-th", onClick: () => u("type"), children: [
        "Type",
        /* @__PURE__ */ r(b, { col: "type" })
      ] }),
      /* @__PURE__ */ y("th", { className: "dd-listview-th dd-listview-th--date", onClick: () => u("date"), children: [
        "Date Modified",
        /* @__PURE__ */ r(b, { col: "date" })
      ] })
    ] }) }),
    /* @__PURE__ */ r("tbody", { children: w.map((h) => /* @__PURE__ */ y(
      "tr",
      {
        className: ["dd-listview-row", n.includes(h.id) && "dd-listview-item--selected"].filter(Boolean).join(" "),
        role: "row",
        "aria-selected": n.includes(h.id),
        onClick: (p) => x(h.id, p),
        onDoubleClick: () => l == null ? void 0 : l(h.id),
        children: [
          /* @__PURE__ */ y("td", { className: "dd-listview-td dd-listview-td--name", children: [
            /* @__PURE__ */ r(je, { icon: h.icon, size: 16 }),
            /* @__PURE__ */ r("span", { children: h.name })
          ] }),
          /* @__PURE__ */ r("td", { className: "dd-listview-td", children: h.size ?? "" }),
          /* @__PURE__ */ r("td", { className: "dd-listview-td", children: h.type ?? "" }),
          /* @__PURE__ */ r("td", { className: "dd-listview-td", children: h.date ?? "" })
        ]
      },
      h.id
    )) })
  ] }) });
}
function V({ icon: e, label: t, disabled: n, active: i, onClick: o }) {
  const l = e && (e.startsWith("/") || e.startsWith("http") || e.startsWith("<svg"));
  return /* @__PURE__ */ y(
    "button",
    {
      className: [
        "dd-toolbar-btn",
        n && "dd-toolbar-btn--disabled",
        i && "dd-toolbar-btn--active"
      ].filter(Boolean).join(" "),
      onClick: n ? void 0 : o,
      tabIndex: n ? -1 : void 0,
      "aria-disabled": n,
      "aria-pressed": i,
      children: [
        e && /* @__PURE__ */ r("span", { className: "dd-toolbar-btn-icon", children: l ? /* @__PURE__ */ r(Q, { src: e, size: 20 }) : e }),
        t && /* @__PURE__ */ r("span", { className: "dd-toolbar-btn-label", children: t })
      ]
    }
  );
}
function Ne() {
  return /* @__PURE__ */ r("div", { className: "dd-toolbar-sep" });
}
function Ue({ children: e, className: t, style: n }) {
  return /* @__PURE__ */ r(
    "div",
    {
      className: ["dd-toolbar", t].filter(Boolean).join(" "),
      style: n,
      role: "toolbar",
      children: e
    }
  );
}
const Xt = '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="3" width="6" height="5"/><rect x="9" y="5" width="6" height="7"/><rect x="1" y="10" width="6" height="5"/></svg>', Yt = '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="2" width="14" height="2"/><rect x="1" y="7" width="14" height="2"/><rect x="1" y="12" width="14" height="2"/></svg>', qt = '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 3l5 6H3z"/></svg>';
function fn({
  nodes: e,
  items: t = [],
  selectedNode: n,
  onNodeSelect: i,
  onItemOpen: o,
  mode: l,
  className: s,
  ...a
}) {
  var b;
  const [c, d] = B(l ?? "details"), [m, g] = B(n ?? ((b = e[0]) == null ? void 0 : b.id) ?? ""), [u, w] = B([]), x = (h) => {
    g(h), w([]), i == null || i(h);
  };
  return /* @__PURE__ */ y(
    re,
    {
      ...a,
      className: ["dd-explorer-window", s].filter(Boolean).join(" "),
      bodyOverflow: "hidden",
      children: [
        /* @__PURE__ */ y(Ue, { children: [
          /* @__PURE__ */ r(V, { icon: qt, label: "Up", onClick: () => {
            const h = Ze(e, m);
            h && x(h);
          } }),
          /* @__PURE__ */ r(Ne, {}),
          /* @__PURE__ */ r(V, { icon: Xt, label: "Icons", active: c === "icons", onClick: () => d("icons") }),
          /* @__PURE__ */ r(V, { icon: Yt, label: "Details", active: c === "details", onClick: () => d("details") })
        ] }),
        /* @__PURE__ */ y("div", { style: { display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }, children: [
          /* @__PURE__ */ r("div", { style: { width: "180px", flexShrink: 0, borderRight: "var(--dd-border, var(--border, 1px solid #000))", overflow: "auto" }, children: /* @__PURE__ */ r(
            Ot,
            {
              nodes: e,
              selected: m,
              onSelect: x
            }
          ) }),
          /* @__PURE__ */ r("div", { style: { flex: 1, minWidth: 0, overflow: "auto" }, children: /* @__PURE__ */ r(
            Vt,
            {
              items: t,
              mode: c,
              selected: u,
              multiSelect: !0,
              onSelect: w,
              onOpen: o
            }
          ) })
        ] }),
        /* @__PURE__ */ y(Ee, { children: [
          /* @__PURE__ */ y(te, { children: [
            t.length,
            " item",
            t.length !== 1 ? "s" : ""
          ] }),
          u.length > 0 && /* @__PURE__ */ y(te, { children: [
            u.length,
            " selected"
          ] })
        ] })
      ]
    }
  );
}
function Ze(e, t, n) {
  for (const i of e) {
    if (i.id === t) return n;
    if (i.children) {
      const o = Ze(i.children, t, i.id);
      if (o !== void 0) return o;
    }
  }
}
function mn({
  url: e = "",
  canGoBack: t = !1,
  canGoForward: n = !1,
  status: i = "Done",
  history: o = [],
  onNavigate: l,
  onBack: s,
  onForward: a,
  onStop: c,
  onRefresh: d,
  onHome: m,
  backIcon: g = "←",
  forwardIcon: u = "→",
  stopIcon: w = "✕",
  refreshIcon: x = "↻",
  homeIcon: b = "⌂",
  historyIcon: h = "⊞",
  children: p,
  className: k,
  ...N
}) {
  const [C, z] = B(e), [P, F] = B(!1), R = _(null);
  $(() => {
    z(e);
  }, [e]), $(() => {
    if (!P) return;
    const I = (K) => {
      R.current && !R.current.contains(K.target) && F(!1);
    };
    return document.addEventListener("mousedown", I), () => document.removeEventListener("mousedown", I);
  }, [P]);
  const W = () => {
    const I = C.trim();
    I && (l == null || l(I));
  }, Y = (I) => {
    I.key === "Enter" && W();
  };
  return /* @__PURE__ */ r(
    re,
    {
      ...N,
      className: ["dd-browser-window", k].filter(Boolean).join(" "),
      bodyOverflow: "hidden",
      children: /* @__PURE__ */ y("div", { className: "dd-browser", children: [
        /* @__PURE__ */ y(Ue, { className: "dd-browser-toolbar", children: [
          /* @__PURE__ */ r(V, { icon: g, label: "Back", disabled: !t, onClick: s }),
          /* @__PURE__ */ r(V, { icon: u, label: "Forward", disabled: !n, onClick: a }),
          /* @__PURE__ */ r(Ne, {}),
          /* @__PURE__ */ r(V, { icon: w, label: "Stop", onClick: c }),
          /* @__PURE__ */ r(V, { icon: x, label: "Refresh", onClick: d }),
          /* @__PURE__ */ r(V, { icon: b, label: "Home", onClick: m }),
          /* @__PURE__ */ r(Ne, {}),
          /* @__PURE__ */ r(V, { icon: h, label: "History", active: P, onClick: () => F((I) => !I) }),
          P && o.length > 0 && /* @__PURE__ */ r("div", { ref: R, className: "dd-browser-history-dropdown", children: [...o].reverse().map((I, K) => /* @__PURE__ */ r(
            "button",
            {
              className: "dd-browser-history-item",
              onClick: () => {
                l == null || l(I), F(!1);
              },
              children: I
            },
            K
          )) })
        ] }),
        /* @__PURE__ */ y("div", { className: "dd-browser-addressbar", children: [
          /* @__PURE__ */ r("span", { className: "dd-browser-address-label", children: "Address" }),
          /* @__PURE__ */ y("div", { className: "dd-browser-address-input-wrap", children: [
            /* @__PURE__ */ r(
              "input",
              {
                className: "dd-browser-address-input",
                type: "text",
                value: C,
                onChange: (I) => z(I.target.value),
                onKeyDown: Y,
                spellCheck: !1
              }
            ),
            /* @__PURE__ */ r("button", { className: "dd-browser-address-dropdown", tabIndex: -1, children: "▾" })
          ] }),
          /* @__PURE__ */ r("button", { className: "dd-browser-go-btn", onClick: W, children: "Go" })
        ] }),
        /* @__PURE__ */ r("div", { className: "dd-browser-content dd-scrollable dd-scrollable--fill", children: p }),
        /* @__PURE__ */ y(Ee, { className: "dd-browser-statusbar", children: [
          /* @__PURE__ */ r(te, { flex: !0, children: i }),
          /* @__PURE__ */ y(te, { children: [
            /* @__PURE__ */ r("span", { className: "dd-browser-status-zone-icon", children: "🌐" }),
            " Internet"
          ] })
        ] })
      ] })
    }
  );
}
function pn({ url: e, onRefresh: t }) {
  return /* @__PURE__ */ y("div", { className: "dd-browser-error", children: [
    /* @__PURE__ */ y("div", { className: "dd-browser-error-title", children: [
      /* @__PURE__ */ r("span", { className: "dd-browser-error-icon", children: "🚫" }),
      /* @__PURE__ */ r("span", { children: "The page cannot be displayed" })
    ] }),
    /* @__PURE__ */ r("hr", { className: "dd-browser-error-hr" }),
    /* @__PURE__ */ r("p", { children: "The page you are looking for is currently unavailable. The Web site might be experiencing technical difficulties, or you may need to adjust your browser settings." }),
    /* @__PURE__ */ r("hr", { className: "dd-browser-error-hr" }),
    /* @__PURE__ */ r("p", { children: /* @__PURE__ */ r("strong", { children: "Please try the following:" }) }),
    /* @__PURE__ */ y("ul", { children: [
      /* @__PURE__ */ y("li", { children: [
        "Click the ",
        /* @__PURE__ */ r("button", { className: "dd-browser-error-link", onClick: t, children: /* @__PURE__ */ r("strong", { children: "Refresh" }) }),
        " button, or try again later."
      ] }),
      /* @__PURE__ */ r("li", { children: "If you typed the page address in the Address bar, make sure that it is spelled correctly." }),
      /* @__PURE__ */ y("li", { children: [
        "To check your connection settings, click the ",
        /* @__PURE__ */ r("strong", { children: "Tools" }),
        " menu, and then click ",
        /* @__PURE__ */ r("strong", { children: "Internet Options" }),
        ". On the ",
        /* @__PURE__ */ r("strong", { children: "Connections" }),
        " tab, click ",
        /* @__PURE__ */ r("strong", { children: "Settings" }),
        "."
      ] })
    ] }),
    e && /* @__PURE__ */ y("p", { className: "dd-browser-error-detail", children: [
      "Cannot display the webpage: ",
      /* @__PURE__ */ r("code", { children: e })
    ] }),
    /* @__PURE__ */ r("hr", { className: "dd-browser-error-hr" }),
    /* @__PURE__ */ r("p", { className: "dd-browser-error-code", children: "HTTP 403 — Forbidden: This page has refused to connect." })
  ] });
}
function Gt({
  title: e = "Dialog",
  isOpen: t,
  onClose: n,
  actions: i,
  children: o,
  size: l = "sm",
  closeOnBackdrop: s = !0,
  className: a
}) {
  const [c, d] = B(t), [m, g] = B(!1);
  return $(() => {
    t ? (d(!0), g(!1)) : c && g(!0);
  }, [t]), $(() => {
    if (!c) return;
    const u = (w) => {
      w.key === "Escape" && (n == null || n());
    };
    return window.addEventListener("keydown", u), () => window.removeEventListener("keydown", u);
  }, [c, n]), c ? Fe(
    /* @__PURE__ */ r(
      "div",
      {
        className: "dd-dialog-backdrop",
        onClick: s ? n : void 0,
        children: /* @__PURE__ */ r(
          "div",
          {
            className: ["dd-dialog", m ? "dd-dialog--closing" : "", l !== "sm" ? `dd-dialog--${l}` : "", a].filter(Boolean).join(" "),
            onClick: (u) => u.stopPropagation(),
            onAnimationEnd: () => {
              m && d(!1);
            },
            children: /* @__PURE__ */ y("div", { className: "dd-win", children: [
              /* @__PURE__ */ y("div", { className: "dd-win-header dd-win-header--no-move", children: [
                /* @__PURE__ */ r("div", { className: "dd-win-title-group", children: /* @__PURE__ */ r("span", { className: "dd-win-title", children: e }) }),
                /* @__PURE__ */ r("div", { className: "dd-win-controls", children: /* @__PURE__ */ r("button", { className: "dd-btn--close", "aria-label": "close", onClick: n }) })
              ] }),
              /* @__PURE__ */ r("div", { className: "dd-win-body", children: o }),
              i && i.length > 0 && /* @__PURE__ */ r("div", { className: "dd-dialog-actions", children: i.map((u, w) => /* @__PURE__ */ r(Rt, { variant: u.variant ?? "ghost", onClick: u.onClick, children: u.label }, w)) })
            ] })
          }
        )
      }
    ),
    document.body
  ) : null;
}
const Je = ne(null);
function gn() {
  const e = X(Je);
  if (!e) throw new Error("useDialog must be used inside <DialogProvider>");
  return e;
}
function yn({ children: e }) {
  const [t, n] = B(null), [i, o] = B(""), l = _(null);
  t && (l.current = t);
  const s = t ?? l.current, a = A((g) => {
    var u;
    (u = t == null ? void 0 : t.resolve) == null || u.call(t, g), n(null);
  }, [t]), c = {
    alert: (g, u = {}) => new Promise(
      (w) => n({ type: "alert", message: g, title: u.title ?? "Alert", resolve: w })
    ),
    confirm: (g, u = {}) => new Promise(
      (w) => n({ type: "confirm", message: g, title: u.title ?? "Confirm", ok: u.ok ?? "OK", cancel: u.cancel ?? "Cancel", resolve: w })
    ),
    prompt: (g, u = {}) => (o(u.defaultValue ?? ""), new Promise(
      (w) => n({ type: "prompt", message: g, title: u.title ?? "Input", ok: u.ok ?? "OK", cancel: u.cancel ?? "Cancel", placeholder: u.placeholder ?? "", defaultValue: u.defaultValue ?? "", resolve: w })
    ))
  }, d = [];
  (s == null ? void 0 : s.type) === "alert" ? d.push({ label: "OK", variant: "primary", onClick: () => a(void 0) }) : (s == null ? void 0 : s.type) === "confirm" ? (d.push({ label: s.cancel, variant: "ghost", onClick: () => a(!1) }), d.push({ label: s.ok, variant: "primary", onClick: () => a(!0) })) : (s == null ? void 0 : s.type) === "prompt" && (d.push({ label: s.cancel, variant: "ghost", onClick: () => a(null) }), d.push({ label: s.ok, variant: "primary", onClick: () => a(i) }));
  const m = (g) => {
    g.key === "Enter" && a(i);
  };
  return /* @__PURE__ */ y(Je.Provider, { value: c, children: [
    e,
    /* @__PURE__ */ r(
      Gt,
      {
        title: s == null ? void 0 : s.title,
        isOpen: !!t,
        onClose: () => {
          (t == null ? void 0 : t.type) === "confirm" ? a(!1) : (t == null ? void 0 : t.type) === "prompt" ? a(null) : a(void 0);
        },
        actions: d,
        closeOnBackdrop: !1,
        children: s && /* @__PURE__ */ y(ct, { children: [
          /* @__PURE__ */ r("p", { className: "dd-dialog-message", children: s.message }),
          s.type === "prompt" && /* @__PURE__ */ r("div", { style: { padding: "0 0.5rem 0.25rem" }, children: /* @__PURE__ */ r(
            "input",
            {
              className: "dreamdesk-input dd-dialog-prompt-input",
              type: "text",
              value: i,
              placeholder: s.placeholder,
              autoFocus: !0,
              onChange: (g) => o(g.target.value),
              onKeyDown: m
            }
          ) })
        ] })
      }
    )
  ] });
}
function wn({ checked: e, defaultChecked: t, indeterminate: n, disabled: i, label: o, onChange: l, className: s, style: a }) {
  const c = Z(), d = (m) => l == null ? void 0 : l(m.target.checked);
  return /* @__PURE__ */ y(
    "label",
    {
      className: ["dd-checkbox", i && "dd-checkbox--disabled", s].filter(Boolean).join(" "),
      htmlFor: c,
      style: a,
      children: [
        /* @__PURE__ */ y("span", { className: ["dd-checkbox-box", n && "dd-checkbox-box--indeterminate"].filter(Boolean).join(" "), children: [
          /* @__PURE__ */ r(
            "input",
            {
              id: c,
              type: "checkbox",
              className: "dd-checkbox-input",
              checked: e,
              defaultChecked: t,
              disabled: i,
              onChange: d,
              ref: (m) => {
                m && (m.indeterminate = !!n);
              }
            }
          ),
          /* @__PURE__ */ r("span", { className: "dd-checkbox-mark", "aria-hidden": "true" })
        ] }),
        o && /* @__PURE__ */ r("span", { className: "dd-checkbox-label", children: o })
      ]
    }
  );
}
const Qe = ne(null);
function bn({ name: e, value: t, disabled: n = !1, onChange: i, children: o, className: l, style: s }) {
  const a = Z();
  return /* @__PURE__ */ r(Qe.Provider, { value: { name: e ?? a, value: t, onChange: i ?? (() => {
  }), disabled: n }, children: /* @__PURE__ */ r("div", { className: ["dd-radio-group", l].filter(Boolean).join(" "), style: s, role: "radiogroup", children: o }) });
}
function vn({ value: e, label: t, disabled: n, className: i, style: o }) {
  const l = Z(), s = X(Qe), a = n || (s == null ? void 0 : s.disabled) || !1, c = (s == null ? void 0 : s.value) === e, d = (m) => {
    m.target.checked && (s == null || s.onChange(e));
  };
  return /* @__PURE__ */ y(
    "label",
    {
      className: ["dd-radio", a && "dd-radio--disabled", i].filter(Boolean).join(" "),
      htmlFor: l,
      style: o,
      children: [
        /* @__PURE__ */ y("span", { className: "dd-radio-circle", children: [
          /* @__PURE__ */ r(
            "input",
            {
              id: l,
              type: "radio",
              className: "dd-radio-input",
              name: s == null ? void 0 : s.name,
              value: e,
              checked: s ? c : void 0,
              disabled: a,
              onChange: d
            }
          ),
          /* @__PURE__ */ r("span", { className: "dd-radio-mark", "aria-hidden": "true" })
        ] }),
        t && /* @__PURE__ */ r("span", { className: "dd-radio-label", children: t })
      ]
    }
  );
}
function xn({ options: e, value: t, defaultValue: n, placeholder: i, disabled: o, label: l, layout: s = "block", onChange: a, className: c, style: d }) {
  const m = Z(), u = /* @__PURE__ */ y("div", { className: "dd-select-wrap", children: [
    /* @__PURE__ */ y(
      "select",
      {
        id: m,
        className: "dd-select",
        value: t,
        defaultValue: n,
        disabled: o,
        onChange: (w) => a == null ? void 0 : a(w.target.value),
        children: [
          i && /* @__PURE__ */ r("option", { value: "", disabled: !0, children: i }),
          e.map((w) => /* @__PURE__ */ r("option", { value: w.value, disabled: w.disabled, children: w.label }, w.value))
        ]
      }
    ),
    /* @__PURE__ */ r("span", { className: "dd-select-arrow", "aria-hidden": "true", children: "▾" })
  ] });
  return l ? /* @__PURE__ */ y(
    "div",
    {
      className: ["dd-select-container", s === "inline" && "dd-select-container--inline", o && "dd-select-container--disabled", c].filter(Boolean).join(" "),
      style: d,
      children: [
        /* @__PURE__ */ r("label", { className: "dd-select-label", htmlFor: m, children: l }),
        u
      ]
    }
  ) : /* @__PURE__ */ r("div", { className: ["dd-select-container", c].filter(Boolean).join(" "), style: d, children: u });
}
function kn({ value: e, defaultValue: t, min: n = 0, max: i = 100, step: o = 1, disabled: l, label: s, showValue: a, onChange: c, className: d, style: m }) {
  const g = Z(), u = (w) => c == null ? void 0 : c(Number(w.target.value));
  return /* @__PURE__ */ y(
    "div",
    {
      className: ["dd-slider-container", l && "dd-slider-container--disabled", d].filter(Boolean).join(" "),
      style: m,
      children: [
        s && /* @__PURE__ */ r("label", { className: "dd-slider-label", htmlFor: g, children: s }),
        /* @__PURE__ */ y("div", { className: "dd-slider-row", children: [
          /* @__PURE__ */ r(
            "input",
            {
              id: g,
              type: "range",
              className: "dd-slider",
              value: e,
              defaultValue: t ?? n,
              min: n,
              max: i,
              step: o,
              disabled: l,
              onChange: u
            }
          ),
          a && /* @__PURE__ */ r("span", { className: "dd-slider-value", children: e ?? t ?? n })
        ] })
      ]
    }
  );
}
export {
  pn as BrowserErrorPage,
  mn as BrowserWindow,
  Rt as Button,
  wn as Checkbox,
  Tt as ContextMenu,
  en as Desktop,
  on as DesktopIcon,
  Gt as Dialog,
  yn as DialogProvider,
  fn as ExplorerWindow,
  Q as Icon,
  ln as Input,
  Vt as ListView,
  ke as Menu,
  Ht as MenuBar,
  ae as MenuItem,
  jt as MenuSeparator,
  hn as NotepadWindow,
  an as ProgressBar,
  vn as Radio,
  bn as RadioGroup,
  xn as Select,
  kn as Slider,
  nn as StartMenu,
  Ee as StatusBar,
  te as StatusBarSection,
  We as Tab,
  Re as TabPanel,
  cn as Tabs,
  tn as Taskbar,
  un as TerminalWindow,
  Qt as ThemeProvider,
  Wt as Toast,
  sn as ToastContainer,
  dn as Toggle,
  Ue as Toolbar,
  V as ToolbarButton,
  Ne as ToolbarSeparator,
  Ot as TreeView,
  rn as Wallpaper,
  re as Window,
  Lt as useContextMenu,
  gn as useDialog,
  ht as useTheme,
  qe as useWindowManager
};
