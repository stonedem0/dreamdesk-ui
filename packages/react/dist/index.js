import { jsx as o, jsxs as C, Fragment as Xe } from "react/jsx-runtime";
import { createContext as Ne, useState as O, useEffect as D, useCallback as F, useContext as te, useRef as B, useId as Ce, useMemo as Fe, Children as Ve, isValidElement as Ye } from "react";
const _e = Ne(null);
function yt({ children: e, defaultTheme: t = "pastelcore" }) {
  const [n, s] = O(t);
  D(() => {
    document.documentElement.setAttribute("data-theme", n);
  }, [n]);
  const r = F((i) => {
    s(i);
  }, []);
  return /* @__PURE__ */ o(_e.Provider, { value: { theme: n, setTheme: r }, children: e });
}
const qe = {
  theme: "pastelcore",
  setTheme: () => {
  }
};
function Ze() {
  return te(_e) ?? qe;
}
function Z(e) {
  var n;
  const t = ((n = e == null ? void 0 : e.getAnimations) == null ? void 0 : n.call(e)) ?? [];
  for (const s of t) s.cancel();
}
function Ge(e) {
  Z(e), e.style.transformOrigin = "50% 100%", e.animate(
    [{ transform: "scale(1)" }, { transform: "scale(0)" }],
    { duration: 300, easing: "ease-in", fill: "forwards" }
  );
}
function pe(e) {
  Z(e), e.style.transformOrigin = "50% 100%", e.animate(
    [{ transform: "scale(0)" }, { transform: "scale(1)" }],
    { duration: 300, easing: "ease-out" }
  );
}
function Ue(e, t) {
  Z(e);
  const n = window.innerWidth, s = window.innerHeight, r = t.top - (window.scrollY || 0), i = t.left - (window.scrollX || 0), l = t.width, d = t.height;
  e.style.position = "fixed", e.style.top = "0", e.style.left = "0", e.style.width = "100vw", e.style.height = "100vh", e.style.setProperty("--ddw-w", "100vw"), e.style.setProperty("--ddw-h", "100vh"), e.style.zIndex = "9999";
  const u = l / n, h = d / s, v = i + l / 2 - n / 2, k = r + d / 2 - s / 2;
  e.animate(
    [
      { transform: `translate(${v}px, ${k}px) scale(${u}, ${h})` },
      { transform: "none" }
    ],
    { duration: 500, easing: "cubic-bezier(0.2, 0, 0, 1)" }
  );
}
function Ke(e, t) {
  Z(e);
  const n = window.innerWidth, s = window.innerHeight, r = t.width, i = t.height, l = t.top - (window.scrollY || 0), d = t.left - (window.scrollX || 0), u = r / n, h = i / s, v = d + r / 2 - n / 2, k = l + i / 2 - s / 2, m = e.animate(
    [
      { transform: "none" },
      { transform: `translate(${v}px, ${k}px) scale(${u}, ${h})` }
    ],
    { duration: 300, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" }
  ), f = () => {
    e.style.position = t.position || "absolute", e.style.top = `${Math.round(t.top)}px`, e.style.left = `${Math.round(t.left)}px`, e.style.width = "", e.style.height = "", e.style.setProperty("--ddw-w", `${Math.round(r)}px`), e.style.setProperty("--ddw-h", `${Math.round(i)}px`), t.zIndex ? e.style.zIndex = t.zIndex : e.style.removeProperty("z-index");
  };
  m.onfinish = () => {
    f(), e.getAnimations().forEach((g) => g.cancel());
  }, m.oncancel = f;
}
function Je(e, t) {
  Z(e);
  const n = e.getBoundingClientRect(), s = t.width / (n.width || 1), r = t.height / (n.height || 1), i = t.left + t.width / 2 - (n.left + n.width / 2), l = t.top + t.height / 2 - (n.top + n.height / 2);
  e.animate(
    [
      { transform: `translate(${i}px, ${l}px) scale(${s}, ${r})` },
      { transform: "none" }
    ],
    { duration: 300, easing: "cubic-bezier(0.2, 0, 0, 1)" }
  );
}
function Qe(e, t) {
  const n = e.animate(
    [{ opacity: "1", transform: "scale(1)" }, { opacity: "0", transform: "scale(0.95)" }],
    { duration: 300, easing: "ease", fill: "forwards" }
  );
  n.onfinish = () => {
    n.cancel(), t == null || t();
  };
}
const Q = 20, ee = 80;
function et(e, t, n, s) {
  const r = e <= Q, i = e >= n - Q, l = t <= Q, d = t >= s - Q;
  return l && e <= ee ? "top-left" : l && e >= n - ee ? "top-right" : d && e <= ee ? "bottom-left" : d && e >= n - ee ? "bottom-right" : l ? "top" : r ? "left" : i ? "right" : "none";
}
function me(e, t, n) {
  const s = t, r = n;
  switch (e) {
    case "top":
      return { top: 0, left: 0, width: s, height: r };
    case "left":
      return { top: 0, left: 0, width: s / 2, height: r };
    case "right":
      return { top: 0, left: s / 2, width: s / 2, height: r };
    case "top-left":
      return { top: 0, left: 0, width: s / 2, height: r / 2 };
    case "top-right":
      return { top: 0, left: s / 2, width: s / 2, height: r / 2 };
    case "bottom-left":
      return { top: r / 2, left: 0, width: s / 2, height: r / 2 };
    case "bottom-right":
      return { top: r / 2, left: s / 2, width: s / 2, height: r / 2 };
    default:
      return null;
  }
}
function tt({ handle: e, host: t, container: n, reservedBottom: s = 0, signal: r, disabled: i, exclude: l, getBounds: d, onStart: u, onSnap: h, onSnapCommit: v, onEnd: k }) {
  let m = !1, f = 0, g = 0, T = 0, M = 0, w = 0, _ = 0, N = null, z = 0, A = 0, R = "none";
  const P = () => {
    t.style.left = `${Math.max(0, Math.min(z - w, T))}px`, t.style.top = `${Math.max(0, Math.min(A - _, M))}px`;
  }, L = (p) => {
    m && (z = p.clientX - f, A = p.clientY - g, N && cancelAnimationFrame(N), N = requestAnimationFrame(() => {
      if (P(), N = null, h && n) {
        const y = n.getBoundingClientRect(), x = p.clientX - y.left, I = p.clientY - y.top, j = et(x, I, y.width, y.height - s);
        j !== R && (R = j, h(j));
      }
    }));
  }, $ = (p) => {
    m = !1, document.removeEventListener("pointermove", L, { capture: !0 }), document.removeEventListener("pointerup", $, { capture: !0 }), N && (cancelAnimationFrame(N), N = null, P()), v && R !== "none" && v(R), h && h("none"), R = "none", k == null || k();
  }, V = (p) => {
    if (i != null && i() || p.target.closest(l)) return;
    Z(t);
    const y = t.getBoundingClientRect(), x = n == null ? void 0 : n.getBoundingClientRect();
    w = (x == null ? void 0 : x.left) ?? 0, _ = (x == null ? void 0 : x.top) ?? 0, f = p.clientX - y.left, g = p.clientY - y.top;
    const I = (d == null ? void 0 : d()) ?? {
      maxLeft: x ? x.width - y.width : Math.max(0, window.innerWidth - y.width),
      maxTop: x ? x.height - y.height - s : Math.max(0, window.innerHeight - y.height - s)
    };
    T = I.maxLeft, M = I.maxTop, u == null || u(y), m = !0, document.addEventListener("pointermove", L, { capture: !0 }), document.addEventListener("pointerup", $, { capture: !0 });
  }, q = r ? { signal: r } : {};
  return e.addEventListener("pointerdown", V, q), () => {
    e.removeEventListener("pointerdown", V), document.removeEventListener("pointermove", L, { capture: !0 }), document.removeEventListener("pointerup", $, { capture: !0 }), N && cancelAnimationFrame(N);
  };
}
function nt({ handle: e, host: t, signal: n, disabled: s, minWidth: r = 180, minHeight: i = 120, explicitAttr: l = "data-explicit", onEnd: d }) {
  let u = !1, h = 0, v = 0, k = 0, m = 0;
  const f = (w) => {
    u && (t.style.setProperty("--ddw-w", `${Math.max(r, k + w.clientX - h)}px`), t.style.setProperty("--ddw-h", `${Math.max(i, m + w.clientY - v)}px`), t.setAttribute(l, ""));
  }, g = () => {
    u = !1, document.removeEventListener("pointermove", f, { capture: !0 }), document.removeEventListener("pointerup", g, { capture: !0 }), d == null || d();
  }, T = (w) => {
    if (s != null && s()) return;
    u = !0, h = w.clientX, v = w.clientY;
    const _ = t.getBoundingClientRect();
    k = _.width, m = _.height, document.addEventListener("pointermove", f, { capture: !0 }), document.addEventListener("pointerup", g, { capture: !0 });
  }, M = n ? { signal: n } : {};
  return e.addEventListener("pointerdown", T, M), () => {
    e.removeEventListener("pointerdown", T), document.removeEventListener("pointermove", f, { capture: !0 }), document.removeEventListener("pointerup", g, { capture: !0 });
  };
}
const Se = "dreamdesk:win:";
function le(e, t) {
  try {
    localStorage.setItem(Se + e, JSON.stringify(t));
  } catch {
  }
}
function ge(e) {
  try {
    const t = localStorage.getItem(Se + e);
    return t ? JSON.parse(t) : null;
  } catch {
    return null;
  }
}
const st = 1e3, ye = 24, rt = 8;
class Te {
  constructor() {
    this._registry = /* @__PURE__ */ new Map(), this._zStack = [], this._listeners = /* @__PURE__ */ new Set(), this._openRegistry = /* @__PURE__ */ new Map(), this._closeRegistry = /* @__PURE__ */ new Map(), this._cascadeCount = 0;
  }
  getCascadeOffset() {
    const t = this._cascadeCount % rt;
    return this._cascadeCount++, { dx: t * ye, dy: t * ye };
  }
  _notify() {
    this._listeners.forEach((t) => t());
  }
  _reassignZ() {
    this._zStack.forEach((t, n) => {
      const s = this._registry.get(t);
      s && (s.el.style.zIndex = String(st + n));
    });
  }
  register(t, n, s, r) {
    this._registry.set(t, { id: t, title: s, icon: r == null ? void 0 : r.icon, el: n, isMinimized: !1, toggle: (r == null ? void 0 : r.toggle) ?? (() => {
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
    var s;
    const n = this._registry.get(t);
    if (n) {
      n.isMinimized ? n.toggle() : this.raise(t);
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
const it = new Te();
function ot({ track: e, getValue: t, isBlocky: n, isGradient: s }) {
  let r = [], i = null, l = null, d = null;
  const u = 1, h = 10, v = h + u;
  function k() {
    const w = s(), _ = getComputedStyle(e), N = e.getBoundingClientRect().width - (parseFloat(_.borderLeftWidth) || 0) - (parseFloat(_.borderRightWidth) || 0), z = Math.max(1, Math.round((N + u) / v)), A = (N - (z - 1) * u) / z, R = N;
    e.innerHTML = "", r = [];
    for (let P = 0; P < z; P++) {
      const L = document.createElement("div");
      L.className = "progress-segment", L.style.cssText = `width:${A}px;margin-right:${P < z - 1 ? u : 0}px`, w && (L.style.backgroundSize = `${R}px 100%`, L.style.backgroundPosition = `-${P * (A + u)}px 0`), e.appendChild(L), r.push(L);
    }
    m(t());
  }
  function m(w) {
    const _ = Math.min(Math.max(w, 0), 100), N = Math.floor(_ / 100 * r.length);
    r.forEach((z, A) => z.classList.toggle("progress-segment--active", A < N));
  }
  function f(w) {
    if (!i) return;
    const _ = Math.min(Math.max(w, 0), 100), N = s();
    if (i.style.width = `${_}%`, !N) {
      const z = getComputedStyle(i).getPropertyValue("--dd-progress-enable-hue-rotate").trim();
      i.style.filter = z === "0" ? "none" : `hue-rotate(${_ * 3.6}deg)`;
    }
    i.classList.toggle("progress-bar--complete", w >= 100);
  }
  function g() {
    const w = n(), _ = s();
    e.classList.toggle("progress-track--gradient", w && _), w ? (l == null || l.disconnect(), k(), l = new ResizeObserver(() => {
      d && clearTimeout(d), d = setTimeout(k, 50);
    }), l.observe(e)) : (i = e.querySelector(".progress-bar"), f(t()));
  }
  function T(w) {
    n() ? m(w) : f(w);
  }
  function M() {
    l == null || l.disconnect(), d && clearTimeout(d);
  }
  return { update: T, rebuild: g, destroy: M };
}
function Ee(e) {
  try {
    const n = new DOMParser().parseFromString(e, "image/svg+xml");
    if (n.querySelector("parsererror")) return "";
    const s = (r) => {
      var i;
      if (r.tagName.toLowerCase() === "script") {
        (i = r.parentNode) == null || i.removeChild(r);
        return;
      }
      for (const l of Array.from(r.attributes))
        (l.name.startsWith("on") || l.value.toLowerCase().includes("javascript:")) && r.removeAttribute(l.name);
      Array.from(r.children).forEach(s);
    };
    return s(n.documentElement), new XMLSerializer().serializeToString(n.documentElement);
  } catch {
    return "";
  }
}
function ne({ src: e, size: t = 16, alt: n = "", className: s }) {
  if (!e) return null;
  const r = e.trim(), i = ["dd-icon", s].filter(Boolean).join(" ");
  if (r.startsWith("<svg")) {
    const l = Ee(r);
    return l ? /* @__PURE__ */ o(
      "span",
      {
        className: i,
        style: { width: t, height: t, display: "inline-flex", flexShrink: 0 },
        dangerouslySetInnerHTML: { __html: l },
        "aria-hidden": "true"
      }
    ) : null;
  }
  return /* @__PURE__ */ o(
    "img",
    {
      className: i,
      src: r,
      width: t,
      height: t,
      alt: n,
      style: { flexShrink: 0 }
    }
  );
}
function lt(e) {
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
function ce(e) {
  if (!e) return null;
  const t = e.trim();
  return t.startsWith("<svg") && Ee(t) || null;
}
function ae({
  className: e,
  icon: t,
  disabled: n,
  tooltip: s,
  onClick: r,
  ariaLabel: i
}) {
  const l = n !== void 0 && n !== !1 && n !== "false" && n !== "0", d = typeof n == "string" && n !== "true" && n !== "1" ? n : s;
  return /* @__PURE__ */ o(
    "button",
    {
      className: e,
      "aria-label": i,
      "aria-disabled": l ? "true" : void 0,
      tabIndex: l ? -1 : void 0,
      "data-tooltip": l && d ? d : void 0,
      onClick: (h) => {
        if (l) {
          h.preventDefault();
          return;
        }
        r();
      },
      dangerouslySetInnerHTML: t ? { __html: t } : void 0
    }
  );
}
function de({
  windowId: e,
  title: t = "Window",
  icon: n,
  size: s,
  resizable: r = !0,
  movable: i = !0,
  width: l,
  height: d,
  minimizeIcon: u,
  fullscreenIcon: h,
  closeIcon: v,
  disableMinimize: k,
  disableFullscreen: m,
  disableClose: f,
  fullscreenMode: g,
  bodyOverflow: T,
  scrollContent: M,
  onMinimize: w,
  onFullscreen: _,
  fullscreenAnimation: N,
  defaultOpen: z = !0,
  onClose: A,
  children: R,
  style: P,
  className: L
}) {
  const $ = B(null), V = B(null), q = B(null), p = Ce(), y = e ?? p, x = $e(), I = dt(), j = ut(), re = e ? ge(e) : null, [K, Me] = O((re == null ? void 0 : re.isMinimized) ?? !1), [Y, ze] = O(!1), J = B(null), G = B(null), Le = !!(l || d), Ae = {
    ...l ? { "--ddw-w": l } : {},
    ...d ? { "--ddw-h": d } : {},
    ...I ? { position: "absolute" } : {},
    ...P
  }, ie = B(() => {
  }), ue = B(() => {
  }), U = F((a = {}) => {
    if (!e) return;
    const c = $.current;
    c && le(e, {
      left: c.style.left,
      top: c.style.top,
      width: c.style.getPropertyValue("--ddw-w"),
      height: c.style.getPropertyValue("--ddw-h"),
      isOpen: c.style.display !== "none",
      isMinimized: K,
      ...a
    });
  }, [e, K]);
  D(() => {
    const a = $.current;
    if (!a) return;
    const c = e ? ge(e) : null;
    c && (c.left && (a.style.left = c.left), c.top && (a.style.top = c.top), c.width && a.style.setProperty("--ddw-w", c.width), c.height && a.style.setProperty("--ddw-h", c.height), (c.width || c.height) && a.setAttribute("data-explicit", ""));
    const S = (c == null ? void 0 : c.isOpen) ?? z;
    if (S || (a.style.display = "none"), S) {
      if (c != null && c.isMinimized) {
        const b = a.querySelector(".dd-win");
        b && (b.style.transformOrigin = "50% 100%", b.style.transform = "scale(0)"), a.style.pointerEvents = "none";
      }
      x.register(y, a, t ?? "Window", { icon: n, toggle: () => ie.current() }), c != null && c.isMinimized && x.minimize(y);
    }
    return x.registerClose(y, () => ue.current()), x.registerOpen(y, () => {
      if (!a || !document.contains(a)) return;
      if (a.style.display = "", !!!(c != null && c.left || c != null && c.top)) {
        const W = I == null ? void 0 : I.current;
        if (W) {
          const H = j, E = W.offsetWidth, Ie = W.offsetHeight - H, De = a.offsetWidth, He = a.offsetHeight, { dx: Oe, dy: je } = x.getCascadeOffset();
          a.style.left = `${Math.max(8, (E - De) / 2 + Oe)}px`, a.style.top = `${Math.max(8, (Ie - He) / 2 + je)}px`;
        }
      }
      const X = a.querySelector(".dd-win");
      X && (X.getAnimations().forEach((W) => W.cancel()), X.style.transform = "", X.style.transformOrigin = "", pe(X)), x.register(y, a, t ?? "Window", { icon: n, toggle: () => ie.current() }), x.raise(y), e && le(e, { left: a.style.left, top: a.style.top, width: a.style.getPropertyValue("--ddw-w"), height: a.style.getPropertyValue("--ddw-h"), isOpen: !0, isMinimized: !1 });
    }), () => x.unregister(y);
  }, [y, t, n, x]);
  const oe = F(() => {
    x.raise(y);
  }, [y]), he = F(() => {
    var b;
    const a = (b = $.current) == null ? void 0 : b.querySelector(".dd-win"), c = $.current;
    if (!a || !c) return;
    const S = !K;
    S ? (Ge(a), x.minimize(y), c.style.pointerEvents = "none") : (a.style.transform = "", a.style.transformOrigin = "", pe(a), x.restore(y), c.style.pointerEvents = ""), Me(S), w == null || w(S), U({ isMinimized: S });
  }, [K, w, y, x, U]);
  ie.current = he;
  const We = F(() => {
    const a = $.current;
    if (!a) return;
    if (!Y && G.current) {
      const b = G.current;
      G.current = null;
      const X = a.getBoundingClientRect();
      a.style.left = b.left, a.style.top = b.top, a.style.setProperty("--ddw-w", b.width), a.style.setProperty("--ddw-h", b.height), Je(a, X);
      return;
    }
    const c = !Y, S = () => {
      c ? (J.current = lt(a), a.setAttribute("data-explicit", ""), Ue(a, J.current)) : J.current && Ke(a, J.current);
    };
    N ? N(a, { isFullscreen: c, defaultFn: S }) : S(), ze(c), _ == null || _(c);
  }, [Y, _, N]), fe = F(() => {
    var S;
    const a = (S = $.current) == null ? void 0 : S.querySelector(".dd-win"), c = $.current;
    !a || !c || Qe(a, () => {
      c.style.display = "none", x.unregister(y), e && le(e, { isOpen: !1 }), A == null || A();
    });
  }, [A, x, y, e]);
  ue.current = fe, D(() => {
    const a = V.current, c = $.current;
    if (!a || !c || !i) return;
    const S = (I == null ? void 0 : I.current) ?? null;
    let b = null;
    S && (b = document.createElement("div"), b.style.cssText = "position:absolute;pointer-events:none;background:rgba(100,150,255,0.18);border:2px solid rgba(100,150,255,0.45);border-radius:4px;z-index:9998;transition:top 0.08s,left 0.08s,width 0.08s,height 0.08s;display:none;box-sizing:border-box", S.appendChild(b));
    const X = tt({
      handle: a,
      host: c,
      container: S,
      reservedBottom: j,
      exclude: ".dd-win-controls",
      disabled: () => Y && g !== "expand",
      onStart: (W) => {
        G.current = null, c.hasAttribute("data-explicit") || (c.style.setProperty("--ddw-w", `${W.width}px`), c.style.setProperty("--ddw-h", `${W.height}px`), c.setAttribute("data-explicit", ""));
        const H = getComputedStyle(c).position;
        if (H === "static" || H === "relative") {
          const E = S == null ? void 0 : S.getBoundingClientRect();
          c.style.position = "absolute", c.style.left = `${W.left + (window.scrollX || 0) - ((E == null ? void 0 : E.left) ?? 0)}px`, c.style.top = `${W.top + (window.scrollY || 0) - ((E == null ? void 0 : E.top) ?? 0)}px`;
        }
        oe();
      },
      onSnap: (W) => {
        if (!b || !S) return;
        if (W === "none") {
          b.style.display = "none";
          return;
        }
        const H = S.getBoundingClientRect(), E = me(W, H.width, H.height - j);
        if (!E) {
          b.style.display = "none";
          return;
        }
        b.style.display = "block", b.style.left = `${E.left}px`, b.style.top = `${E.top}px`, b.style.width = `${E.width}px`, b.style.height = `${E.height}px`;
      },
      onSnapCommit: (W) => {
        if (b && (b.style.display = "none"), !S) return;
        const H = S.getBoundingClientRect(), E = me(W, H.width, H.height - j);
        E && (G.current = {
          left: c.style.left,
          top: c.style.top,
          width: c.style.getPropertyValue("--ddw-w"),
          height: c.style.getPropertyValue("--ddw-h")
        }, c.style.left = `${E.left}px`, c.style.top = `${E.top}px`, c.style.setProperty("--ddw-w", `${E.width}px`), c.style.setProperty("--ddw-h", `${E.height}px`), c.setAttribute("data-explicit", ""));
      },
      onEnd: () => U()
    });
    return () => {
      X(), b == null || b.remove();
    };
  }, [i, Y, g, oe, I, j]), D(() => {
    const a = q.current, c = $.current;
    if (!(!a || !c || !r))
      return nt({
        handle: a,
        host: c,
        disabled: () => Y,
        onEnd: () => U()
      });
  }, [r, Y, U]);
  const Re = ce(u), Be = ce(h), Pe = ce(v);
  return /* @__PURE__ */ o(
    "div",
    {
      ref: $,
      className: ["dd-window", L].filter(Boolean).join(" "),
      "data-size": s,
      "data-explicit": Le ? "" : void 0,
      style: Ae,
      onPointerDown: oe,
      children: /* @__PURE__ */ C("div", { className: "dd-win", children: [
        /* @__PURE__ */ C(
          "div",
          {
            ref: V,
            className: ["dd-win-header", i ? "" : "dd-win-header--no-move"].filter(Boolean).join(" "),
            children: [
              /* @__PURE__ */ C("div", { className: "dd-win-title-group", children: [
                n && /* @__PURE__ */ o(ne, { src: n, size: 16, className: "dd-win-title-icon" }),
                /* @__PURE__ */ o("span", { className: "dd-win-title", children: t })
              ] }),
              /* @__PURE__ */ C("div", { className: "dd-win-controls", children: [
                /* @__PURE__ */ o(
                  ae,
                  {
                    className: "dd-btn--minimize",
                    icon: Re,
                    disabled: k,
                    onClick: he,
                    ariaLabel: "minimize"
                  }
                ),
                /* @__PURE__ */ o(
                  ae,
                  {
                    className: "dd-btn--fullscreen",
                    icon: Be,
                    disabled: m,
                    onClick: We,
                    ariaLabel: "fullscreen"
                  }
                ),
                /* @__PURE__ */ o(
                  ae,
                  {
                    className: "dd-btn--close",
                    icon: Pe,
                    disabled: f,
                    onClick: fe,
                    ariaLabel: "close"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ o(
          "div",
          {
            className: "dd-win-body",
            style: {
              ...T ? { "--dd-body-overflow": T } : {},
              ...M ? { "--dd-body-overflow": "hidden", padding: 0, display: "flex", flexDirection: "column", flex: "1 1 0", minHeight: 0 } : {}
            },
            children: M ? /* @__PURE__ */ o("div", { className: "dd-win-scroll-content", children: R }) : R
          }
        ),
        r && /* @__PURE__ */ o("div", { ref: q, className: "dd-win-resize-handle" })
      ] })
    }
  );
}
const ct = 36, we = 40, be = 24, at = 10, se = Ne(null);
function wt({ children: e, className: t, style: n, taskbarHeight: s = ct }) {
  const r = Fe(() => new Te(), []), i = B(null), l = B(/* @__PURE__ */ new Map()), [d, u] = O([]), h = B(0), v = F((f) => {
    l.current.set(f.id, f);
  }, []), k = F((f) => {
    const g = l.current.get(f);
    if (!g) return null;
    const T = `${f}__${Math.random().toString(36).slice(2)}`, M = h.current % at, w = we + M * be, _ = we + M * be;
    return h.current++, u((N) => [...N, { instanceId: T, def: g, top: w, left: _ }]), T;
  }, []), m = F((f) => {
    u((g) => g.filter((T) => T.instanceId !== f));
  }, []);
  return /* @__PURE__ */ o(se.Provider, { value: { wm: r, containerRef: i, taskbarHeight: s, registerApp: v, launch: k, closeApp: m }, children: /* @__PURE__ */ C(
    "div",
    {
      ref: i,
      className: ["dd-desktop", t].filter(Boolean).join(" "),
      style: {
        "--dd-taskbar-h": `${s}px`,
        ...n
      },
      children: [
        e,
        d.map(({ instanceId: f, def: g, top: T, left: M }) => /* @__PURE__ */ o(
          de,
          {
            title: g.title,
            icon: g.icon,
            width: g.defaultWidth,
            height: g.defaultHeight,
            style: { top: T, left: M },
            onClose: () => m(f),
            children: /* @__PURE__ */ o(g.component, {})
          },
          f
        ))
      ]
    }
  ) });
}
function $e() {
  var e;
  return ((e = te(se)) == null ? void 0 : e.wm) ?? it;
}
function dt() {
  var e;
  return ((e = te(se)) == null ? void 0 : e.containerRef) ?? null;
}
function ut() {
  var e;
  return ((e = te(se)) == null ? void 0 : e.taskbarHeight) ?? 0;
}
const ht = 200;
function ft() {
  const [e, t] = O(() => ve(/* @__PURE__ */ new Date()));
  return D(() => {
    const n = setInterval(() => t(ve(/* @__PURE__ */ new Date())), 1e3);
    return () => clearInterval(n);
  }, []), /* @__PURE__ */ o("div", { className: "dd-taskbar-clock", children: e });
}
function ve(e) {
  return e.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function bt({ clock: e = !0, className: t }) {
  const n = $e(), [s, r] = O(() => n.getWindows());
  return D(() => (r(n.getWindows()), n.subscribe(() => {
    const i = n.getWindows(), l = new Set(i.map((d) => d.id));
    r((d) => d.some((h) => !h.leaving && !l.has(h.id)) ? d.map((h) => l.has(h.id) ? h : { ...h, leaving: !0 }) : i);
  })), [n]), D(() => {
    if (s.filter((d) => d.leaving).length === 0) return;
    const l = setTimeout(() => r(n.getWindows()), ht);
    return () => clearTimeout(l);
  }, [s, n]), /* @__PURE__ */ C("div", { className: ["dd-taskbar", t].filter(Boolean).join(" "), children: [
    /* @__PURE__ */ o("div", { className: "dd-taskbar-windows", children: s.map((i) => /* @__PURE__ */ C(
      "button",
      {
        className: [
          "dd-taskbar-btn",
          i.leaving ? "dd-taskbar-btn--leaving" : i.isMinimized ? "dd-taskbar-btn--minimized" : "dd-taskbar-btn--active"
        ].join(" "),
        onClick: () => i.toggle(),
        title: i.title,
        children: [
          i.icon && /* @__PURE__ */ o(ne, { src: i.icon, size: 16 }),
          /* @__PURE__ */ o("span", { className: "dd-taskbar-btn-label", children: i.title })
        ]
      },
      i.id
    )) }),
    e && /* @__PURE__ */ o(ft, {})
  ] });
}
function vt({ label: e, icon: t, iconSize: n = 48, onClick: s, className: r, style: i }) {
  return /* @__PURE__ */ C(
    "button",
    {
      className: ["dd-desktop-icon", r].filter(Boolean).join(" "),
      onClick: s,
      style: i,
      title: e,
      children: [
        /* @__PURE__ */ o(ne, { src: t, size: n }),
        /* @__PURE__ */ o("span", { className: "dd-desktop-icon-label", children: e })
      ]
    }
  );
}
function xt({
  variant: e = "primary",
  size: t,
  disabled: n = !1,
  action: s,
  minWidth: r,
  width: i,
  height: l,
  fontSize: d,
  px: u,
  py: h,
  onClick: v,
  children: k,
  className: m,
  style: f
}) {
  const g = {
    ...r ? { "--dd-btn-min-w": r } : {},
    ...i ? { "--dd-btn-w": i } : {},
    ...l ? { "--dd-btn-h": l } : {},
    ...d ? { "--dd-btn-fs": d } : {},
    ...u ? { "--dd-btn-px": u } : {},
    ...h ? { "--dd-btn-py": h } : {},
    ...f
  }, T = [
    "btn",
    `btn--${e}`,
    n ? "btn--disable" : "",
    t ? `btn--size-${t}` : "",
    m
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o(
    "button",
    {
      className: T,
      style: g,
      disabled: n,
      "aria-disabled": n ? "true" : void 0,
      tabIndex: n ? -1 : void 0,
      "data-action": s,
      "aria-label": s,
      onClick: n ? void 0 : v,
      children: k
    }
  );
}
function kt({ type: e = "notification", message: t, onClose: n }) {
  const [s, r] = O(!0), i = B(t);
  if (D(() => {
    t !== i.current && (i.current = t, r(!0));
  }, [t]), !s) return null;
  const l = () => {
    r(!1), n == null || n();
  };
  return /* @__PURE__ */ C("div", { className: `toast toast-${e}`, children: [
    /* @__PURE__ */ o("button", { className: "toast-btn--close", onClick: l, "aria-label": "close", children: "×" }),
    t
  ] });
}
function Nt({
  type: e = "text",
  label: t,
  layout: n = "block",
  id: s,
  value: r,
  defaultValue: i,
  placeholder: l,
  disabled: d,
  onChange: u,
  className: h,
  style: v
}) {
  const k = Ce(), m = s ?? k, f = n === "inline" ? { display: "flex", alignItems: "center", gap: "0.5rem" } : {};
  return /* @__PURE__ */ C("div", { className: ["input-grid", h].filter(Boolean).join(" "), style: { ...f, ...v }, children: [
    t && /* @__PURE__ */ o("label", { className: "input-label", htmlFor: m, children: t }),
    /* @__PURE__ */ o(
      "input",
      {
        type: e,
        id: m,
        className: "dreamdesk-input",
        ...r !== void 0 ? { value: r, onChange: u ? (g) => u(g.target.value, g) : void 0 } : { defaultValue: i, onChange: u ? (g) => u(g.target.value, g) : void 0 },
        placeholder: l,
        disabled: d
      }
    )
  ] });
}
function Ct({
  value: e = 0,
  blocky: t = !1,
  gradient: n = !1,
  className: s,
  style: r
}) {
  const i = B(null), l = B(null);
  D(() => {
    var h;
    const u = i.current;
    if (u)
      return (h = l.current) == null || h.destroy(), l.current = ot({
        track: u,
        getValue: () => e,
        isBlocky: () => t,
        isGradient: () => n
      }), l.current.rebuild(), () => {
        var v;
        (v = l.current) == null || v.destroy(), l.current = null;
      };
  }, [t, n]), D(() => {
    var u;
    (u = l.current) == null || u.update(e);
  }, [e]);
  const d = [
    "progress-track",
    t ? "progress-track--blocky" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o("div", { ref: i, className: d, style: r, children: !t && /* @__PURE__ */ o("div", { className: ["progress-bar", n ? "progress-bar--gradient" : ""].filter(Boolean).join(" ") }) });
}
function xe({ children: e, index: t = 0, active: n = !1, onClick: s }) {
  return /* @__PURE__ */ o(
    "dreamdesk-tab",
    {
      class: n ? "active" : void 0,
      "data-tab": "",
      "data-tab-index": String(t),
      onClick: () => s == null ? void 0 : s(t),
      children: e
    }
  );
}
function ke({ children: e, active: t = !1, style: n }) {
  return /* @__PURE__ */ o(
    "dreamdesk-tab-panel",
    {
      class: t ? "active" : void 0,
      "data-panel": "",
      style: { display: t ? "block" : "none", ...n },
      children: e
    }
  );
}
function _t({
  defaultIndex: e = 0,
  activeIndex: t,
  onChange: n,
  children: s,
  className: r,
  style: i
}) {
  const [l, d] = O(e), u = t ?? l, h = (m) => {
    t === void 0 && d(m), n == null || n(m);
  }, v = [], k = [];
  return Ve.forEach(s, (m) => {
    if (Ye(m)) {
      if (m.type === xe) {
        const f = v.length;
        v.push(
          /* @__PURE__ */ o(xe, { index: f, active: f === u, onClick: h, children: m.props.children }, f)
        );
      } else if (m.type === ke) {
        const f = k.length;
        k.push(
          /* @__PURE__ */ o(ke, { active: f === u, style: m.props.style, children: m.props.children }, f)
        );
      }
    }
  }), /* @__PURE__ */ C("div", { className: ["tabs", r].filter(Boolean).join(" "), style: i, children: [
    /* @__PURE__ */ o("div", { className: "tab-list", children: v }),
    /* @__PURE__ */ o("div", { className: "tab-panels", children: k })
  ] });
}
function St({ checked: e, defaultChecked: t, onChange: n, style: s, className: r }) {
  const { theme: i } = Ze(), l = e !== void 0, d = t ?? i === "dark";
  return /* @__PURE__ */ C("label", { className: ["toggle", r].filter(Boolean).join(" "), style: s, children: [
    /* @__PURE__ */ o(
      "input",
      {
        type: "checkbox",
        checked: l ? e : void 0,
        defaultChecked: l ? void 0 : d,
        onChange: (u) => n == null ? void 0 : n(u.target.checked)
      }
    ),
    /* @__PURE__ */ o("span", { className: "slider", children: /* @__PURE__ */ o("span", { className: "knob" }) })
  ] });
}
function Tt({ children: e, className: t, ...n }) {
  return /* @__PURE__ */ o(
    de,
    {
      ...n,
      className: ["terminal-window", t].filter(Boolean).join(" "),
      children: /* @__PURE__ */ o("div", { className: "terminal-win-body", children: e })
    }
  );
}
function pt({ src: e }) {
  return e.startsWith("/") || e.startsWith("http") || e.startsWith("<svg") ? /* @__PURE__ */ o(ne, { src: e, size: 20 }) : /* @__PURE__ */ o(Xe, { children: e });
}
function Et({
  url: e = "",
  canGoBack: t = !1,
  canGoForward: n = !1,
  status: s = "Done",
  history: r = [],
  onNavigate: i,
  onBack: l,
  onForward: d,
  onStop: u,
  onRefresh: h,
  onHome: v,
  backIcon: k = "←",
  forwardIcon: m = "→",
  stopIcon: f = "✕",
  refreshIcon: g = "↻",
  homeIcon: T = "⌂",
  historyIcon: M = "⊞",
  children: w,
  className: _,
  ...N
}) {
  const [z, A] = O(e), [R, P] = O(!1), L = B(null);
  D(() => {
    A(e);
  }, [e]), D(() => {
    if (!R) return;
    const p = (y) => {
      L.current && !L.current.contains(y.target) && P(!1);
    };
    return document.addEventListener("mousedown", p), () => document.removeEventListener("mousedown", p);
  }, [R]);
  const $ = () => {
    const p = z.trim();
    p && (i == null || i(p));
  }, V = (p) => {
    p.key === "Enter" && $();
  }, q = [
    { id: "back", label: "Back", icon: k, disabled: !t, onClick: l },
    { id: "forward", label: "Forward", icon: m, disabled: !n, onClick: d },
    "sep",
    { id: "stop", label: "Stop", icon: f, onClick: u },
    { id: "refresh", label: "Refresh", icon: g, onClick: h },
    { id: "home", label: "Home", icon: T, onClick: v },
    "sep",
    { id: "history", label: "History", icon: M, onClick: () => P((p) => !p) }
  ];
  return /* @__PURE__ */ o(
    de,
    {
      ...N,
      className: ["dd-browser-window", _].filter(Boolean).join(" "),
      bodyOverflow: "hidden",
      children: /* @__PURE__ */ C("div", { className: "dd-browser", children: [
        /* @__PURE__ */ C("div", { className: "dd-browser-toolbar", children: [
          q.map(
            (p, y) => p === "sep" ? /* @__PURE__ */ o("div", { className: "dd-browser-sep" }, `sep-${y}`) : /* @__PURE__ */ C(
              "button",
              {
                className: ["dd-browser-btn", p.disabled ? "dd-browser-btn--disabled" : ""].filter(Boolean).join(" "),
                onClick: p.disabled ? void 0 : p.onClick,
                tabIndex: p.disabled ? -1 : void 0,
                "aria-disabled": p.disabled,
                children: [
                  /* @__PURE__ */ o("span", { className: "dd-browser-btn-icon", children: p.icon && /* @__PURE__ */ o(pt, { src: p.icon }) }),
                  /* @__PURE__ */ o("span", { className: "dd-browser-btn-label", children: p.label })
                ]
              },
              p.id
            )
          ),
          R && r.length > 0 && /* @__PURE__ */ o("div", { ref: L, className: "dd-browser-history-dropdown", children: [...r].reverse().map((p, y) => /* @__PURE__ */ o(
            "button",
            {
              className: "dd-browser-history-item",
              onClick: () => {
                i == null || i(p), P(!1);
              },
              children: p
            },
            y
          )) })
        ] }),
        /* @__PURE__ */ C("div", { className: "dd-browser-addressbar", children: [
          /* @__PURE__ */ o("span", { className: "dd-browser-address-label", children: "Address" }),
          /* @__PURE__ */ C("div", { className: "dd-browser-address-input-wrap", children: [
            /* @__PURE__ */ o(
              "input",
              {
                className: "dd-browser-address-input",
                type: "text",
                value: z,
                onChange: (p) => A(p.target.value),
                onKeyDown: V,
                spellCheck: !1
              }
            ),
            /* @__PURE__ */ o("button", { className: "dd-browser-address-dropdown", tabIndex: -1, children: "▾" })
          ] }),
          /* @__PURE__ */ o("button", { className: "dd-browser-go-btn", onClick: $, children: "Go" })
        ] }),
        /* @__PURE__ */ o("div", { className: "dd-browser-content dd-scrollable dd-scrollable--fill", children: w }),
        /* @__PURE__ */ C("div", { className: "dd-browser-statusbar", children: [
          /* @__PURE__ */ o("span", { className: "dd-browser-status-text", children: s }),
          /* @__PURE__ */ C("div", { className: "dd-browser-status-zone", children: [
            /* @__PURE__ */ o("span", { className: "dd-browser-status-zone-icon", children: "🌐" }),
            /* @__PURE__ */ o("span", { children: "Internet" })
          ] })
        ] })
      ] })
    }
  );
}
function $t({ url: e, onRefresh: t }) {
  return /* @__PURE__ */ C("div", { className: "dd-browser-error", children: [
    /* @__PURE__ */ C("div", { className: "dd-browser-error-title", children: [
      /* @__PURE__ */ o("span", { className: "dd-browser-error-icon", children: "🚫" }),
      /* @__PURE__ */ o("span", { children: "The page cannot be displayed" })
    ] }),
    /* @__PURE__ */ o("hr", { className: "dd-browser-error-hr" }),
    /* @__PURE__ */ o("p", { children: "The page you are looking for is currently unavailable. The Web site might be experiencing technical difficulties, or you may need to adjust your browser settings." }),
    /* @__PURE__ */ o("hr", { className: "dd-browser-error-hr" }),
    /* @__PURE__ */ o("p", { children: /* @__PURE__ */ o("strong", { children: "Please try the following:" }) }),
    /* @__PURE__ */ C("ul", { children: [
      /* @__PURE__ */ C("li", { children: [
        "Click the ",
        /* @__PURE__ */ o("button", { className: "dd-browser-error-link", onClick: t, children: /* @__PURE__ */ o("strong", { children: "Refresh" }) }),
        " button, or try again later."
      ] }),
      /* @__PURE__ */ o("li", { children: "If you typed the page address in the Address bar, make sure that it is spelled correctly." }),
      /* @__PURE__ */ C("li", { children: [
        "To check your connection settings, click the ",
        /* @__PURE__ */ o("strong", { children: "Tools" }),
        " menu, and then click ",
        /* @__PURE__ */ o("strong", { children: "Internet Options" }),
        ". On the ",
        /* @__PURE__ */ o("strong", { children: "Connections" }),
        " tab, click ",
        /* @__PURE__ */ o("strong", { children: "Settings" }),
        "."
      ] })
    ] }),
    e && /* @__PURE__ */ C("p", { className: "dd-browser-error-detail", children: [
      "Cannot display the webpage: ",
      /* @__PURE__ */ o("code", { children: e })
    ] }),
    /* @__PURE__ */ o("hr", { className: "dd-browser-error-hr" }),
    /* @__PURE__ */ o("p", { className: "dd-browser-error-code", children: "HTTP 403 — Forbidden: This page has refused to connect." })
  ] });
}
export {
  $t as BrowserErrorPage,
  Et as BrowserWindow,
  xt as Button,
  wt as Desktop,
  vt as DesktopIcon,
  ne as Icon,
  Nt as Input,
  Ct as ProgressBar,
  xe as Tab,
  ke as TabPanel,
  _t as Tabs,
  bt as Taskbar,
  Tt as TerminalWindow,
  yt as ThemeProvider,
  kt as Toast,
  St as Toggle,
  de as Window,
  Ze as useTheme,
  $e as useWindowManager
};
