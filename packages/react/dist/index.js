import { jsx as r, jsxs as x } from "react/jsx-runtime";
import { createContext as de, useState as $, useEffect as z, useCallback as B, useContext as O, useRef as M, useId as ue, useMemo as Te, Children as Ee, isValidElement as Ce } from "react";
const he = de(null);
function Ze({ children: t, defaultTheme: e = "pastelcore" }) {
  const [n, o] = $(e);
  z(() => {
    document.documentElement.setAttribute("data-theme", n);
  }, [n]);
  const s = B((i) => {
    o(i);
  }, []);
  return /* @__PURE__ */ r(he.Provider, { value: { theme: n, setTheme: s }, children: t });
}
const Se = {
  theme: "pastelcore",
  setTheme: () => {
  }
};
function Le() {
  return O(he) ?? Se;
}
function F(t) {
  var n;
  const e = ((n = t == null ? void 0 : t.getAnimations) == null ? void 0 : n.call(t)) ?? [];
  for (const o of e) o.cancel();
}
function Me(t) {
  F(t), t.style.transformOrigin = "50% 100%", t.animate(
    [{ transform: "scale(1)" }, { transform: "scale(0)" }],
    { duration: 300, easing: "ease-in", fill: "forwards" }
  );
}
function se(t) {
  F(t), t.style.transformOrigin = "50% 100%", t.animate(
    [{ transform: "scale(0)" }, { transform: "scale(1)" }],
    { duration: 300, easing: "ease-out" }
  );
}
function Ie(t, e) {
  F(t);
  const n = window.innerWidth, o = window.innerHeight, s = e.top - (window.scrollY || 0), i = e.left - (window.scrollX || 0), a = e.width, c = e.height;
  t.style.position = "fixed", t.style.top = "0", t.style.left = "0", t.style.width = "100vw", t.style.height = "100vh", t.style.setProperty("--ddw-w", "100vw"), t.style.setProperty("--ddw-h", "100vh"), t.style.zIndex = "9999";
  const l = a / n, u = c / o, g = i + a / 2 - n / 2, v = s + c / 2 - o / 2;
  t.animate(
    [
      { transform: `translate(${g}px, ${v}px) scale(${l}, ${u})` },
      { transform: "none" }
    ],
    { duration: 500, easing: "cubic-bezier(0.2, 0, 0, 1)" }
  );
}
function ze(t, e) {
  F(t);
  const n = window.innerWidth, o = window.innerHeight, s = e.width, i = e.height, a = e.top - (window.scrollY || 0), c = e.left - (window.scrollX || 0), l = s / n, u = i / o, g = c + s / 2 - n / 2, v = a + i / 2 - o / 2, f = t.animate(
    [
      { transform: "none" },
      { transform: `translate(${g}px, ${v}px) scale(${l}, ${u})` }
    ],
    { duration: 300, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" }
  ), d = () => {
    t.style.position = e.position || "absolute", t.style.top = `${Math.round(e.top)}px`, t.style.left = `${Math.round(e.left)}px`, t.style.width = "", t.style.height = "", t.style.setProperty("--ddw-w", `${Math.round(s)}px`), t.style.setProperty("--ddw-h", `${Math.round(i)}px`), e.zIndex ? t.style.zIndex = e.zIndex : t.style.removeProperty("z-index");
  };
  f.onfinish = () => {
    d(), t.getAnimations().forEach((m) => m.cancel());
  }, f.oncancel = d;
}
function Ae(t, e) {
  t.animate(
    [{ opacity: "1", transform: "scale(1)" }, { opacity: "0", transform: "scale(0.95)" }],
    { duration: 300, easing: "ease", fill: "forwards" }
  ).onfinish = () => e == null ? void 0 : e();
}
function $e({ handle: t, host: e, container: n, reservedBottom: o = 0, signal: s, disabled: i, exclude: a, getBounds: c, onStart: l }) {
  let u = !1, g = 0, v = 0, f = 0, d = 0, m = 0, N = 0, b = null, w = 0, h = 0;
  const _ = () => {
    e.style.left = `${Math.max(0, Math.min(w - m, f))}px`, e.style.top = `${Math.max(0, Math.min(h - N, d))}px`;
  }, T = (k) => {
    u && (w = k.clientX - g, h = k.clientY - v, b && cancelAnimationFrame(b), b = requestAnimationFrame(() => {
      _(), b = null;
    }));
  }, I = () => {
    u = !1, document.removeEventListener("pointermove", T, { capture: !0 }), document.removeEventListener("pointerup", I, { capture: !0 }), b && (cancelAnimationFrame(b), b = null, _());
  }, D = (k) => {
    if (i != null && i() || k.target.closest(a)) return;
    F(e);
    const A = e.getBoundingClientRect(), S = n == null ? void 0 : n.getBoundingClientRect();
    m = (S == null ? void 0 : S.left) ?? 0, N = (S == null ? void 0 : S.top) ?? 0, g = k.clientX - A.left, v = k.clientY - A.top;
    const X = (c == null ? void 0 : c()) ?? {
      maxLeft: S ? S.width - A.width : Math.max(0, window.innerWidth - A.width),
      maxTop: S ? S.height - A.height - o : Math.max(0, window.innerHeight - A.height - o)
    };
    f = X.maxLeft, d = X.maxTop, l == null || l(A), u = !0, document.addEventListener("pointermove", T, { capture: !0 }), document.addEventListener("pointerup", I, { capture: !0 });
  }, W = s ? { signal: s } : {};
  return t.addEventListener("pointerdown", D, W), () => {
    t.removeEventListener("pointerdown", D), document.removeEventListener("pointermove", T, { capture: !0 }), document.removeEventListener("pointerup", I, { capture: !0 }), b && cancelAnimationFrame(b);
  };
}
function We({ handle: t, host: e, signal: n, disabled: o, minWidth: s = 180, minHeight: i = 120, explicitAttr: a = "data-explicit" }) {
  let c = !1, l = 0, u = 0, g = 0, v = 0;
  const f = (b) => {
    c && (e.style.setProperty("--ddw-w", `${Math.max(s, g + b.clientX - l)}px`), e.style.setProperty("--ddw-h", `${Math.max(i, v + b.clientY - u)}px`), e.setAttribute(a, ""));
  }, d = () => {
    c = !1, document.removeEventListener("pointermove", f, { capture: !0 }), document.removeEventListener("pointerup", d, { capture: !0 });
  }, m = (b) => {
    if (o != null && o()) return;
    c = !0, l = b.clientX, u = b.clientY;
    const w = e.getBoundingClientRect();
    g = w.width, v = w.height, document.addEventListener("pointermove", f, { capture: !0 }), document.addEventListener("pointerup", d, { capture: !0 });
  }, N = n ? { signal: n } : {};
  return t.addEventListener("pointerdown", m, N), () => {
    t.removeEventListener("pointerdown", m), document.removeEventListener("pointermove", f, { capture: !0 }), document.removeEventListener("pointerup", d, { capture: !0 });
  };
}
const Pe = 1e3;
class fe {
  constructor() {
    this._registry = /* @__PURE__ */ new Map(), this._zStack = [], this._listeners = /* @__PURE__ */ new Set(), this._openRegistry = /* @__PURE__ */ new Map(), this._closeRegistry = /* @__PURE__ */ new Map();
  }
  _notify() {
    this._listeners.forEach((e) => e());
  }
  _reassignZ() {
    this._zStack.forEach((e, n) => {
      const o = this._registry.get(e);
      o && (o.el.style.zIndex = String(Pe + n));
    });
  }
  register(e, n, o, s) {
    this._registry.set(e, { id: e, title: o, icon: s == null ? void 0 : s.icon, el: n, isMinimized: !1, toggle: (s == null ? void 0 : s.toggle) ?? (() => {
    }) }), this._zStack.includes(e) || this._zStack.push(e), this._reassignZ(), this._notify();
  }
  unregister(e) {
    if (!this._registry.has(e)) return;
    this._registry.delete(e);
    const n = this._zStack.indexOf(e);
    n !== -1 && this._zStack.splice(n, 1), this._reassignZ(), this._notify();
  }
  raise(e) {
    const n = this._zStack.indexOf(e);
    n !== -1 && this._zStack.splice(n, 1), this._zStack.push(e), this._reassignZ();
  }
  minimize(e) {
    const n = this._registry.get(e);
    n && (n.isMinimized = !0, this._notify());
  }
  restore(e) {
    const n = this._registry.get(e);
    n && (n.isMinimized = !1, this.raise(e), this._notify());
  }
  registerOpen(e, n) {
    this._openRegistry.set(e, n);
  }
  registerClose(e, n) {
    this._closeRegistry.set(e, n);
  }
  close(e) {
    var n;
    (n = this._closeRegistry.get(e)) == null || n();
  }
  open(e) {
    var o;
    const n = this._registry.get(e);
    if (n) {
      n.isMinimized ? n.toggle() : this.raise(e);
      return;
    }
    (o = this._openRegistry.get(e)) == null || o();
  }
  getWindows() {
    return Array.from(this._registry.values());
  }
  subscribe(e) {
    return this._listeners.add(e), () => this._listeners.delete(e);
  }
}
const Be = new fe();
function De({ track: t, getValue: e, isBlocky: n, isGradient: o }) {
  let s = [], i = null, a = null, c = null;
  const l = 1, u = 10, g = u + l;
  function v() {
    const w = o(), h = getComputedStyle(t), _ = t.getBoundingClientRect().width - (parseFloat(h.borderLeftWidth) || 0) - (parseFloat(h.borderRightWidth) || 0), T = Math.max(1, Math.round((_ + l) / g)), I = (_ - (T - 1) * l) / T, D = _;
    t.innerHTML = "", s = [];
    for (let W = 0; W < T; W++) {
      const k = document.createElement("div");
      k.className = "progress-segment", k.style.cssText = `width:${I}px;margin-right:${W < T - 1 ? l : 0}px`, w && (k.style.backgroundSize = `${D}px 100%`, k.style.backgroundPosition = `-${W * (I + l)}px 0`), t.appendChild(k), s.push(k);
    }
    f(e());
  }
  function f(w) {
    const h = Math.min(Math.max(w, 0), 100), _ = Math.floor(h / 100 * s.length);
    s.forEach((T, I) => T.classList.toggle("progress-segment--active", I < _));
  }
  function d(w) {
    if (!i) return;
    const h = Math.min(Math.max(w, 0), 100), _ = o();
    if (i.style.width = `${h}%`, !_) {
      const T = getComputedStyle(i).getPropertyValue("--dd-progress-enable-hue-rotate").trim();
      i.style.filter = T === "0" ? "none" : `hue-rotate(${h * 3.6}deg)`;
    }
    i.classList.toggle("progress-bar--complete", w >= 100);
  }
  function m() {
    const w = n(), h = o();
    t.classList.toggle("progress-track--gradient", w && h), w ? (a == null || a.disconnect(), v(), a = new ResizeObserver(() => {
      c && clearTimeout(c), c = setTimeout(v, 50);
    }), a.observe(t)) : (i = t.querySelector(".progress-bar"), d(e()));
  }
  function N(w) {
    n() ? f(w) : d(w);
  }
  function b() {
    a == null || a.disconnect(), c && clearTimeout(c);
  }
  return { update: N, rebuild: m, destroy: b };
}
function me(t) {
  try {
    const n = new DOMParser().parseFromString(t, "image/svg+xml");
    if (n.querySelector("parsererror")) return "";
    const o = (s) => {
      var i;
      if (s.tagName.toLowerCase() === "script") {
        (i = s.parentNode) == null || i.removeChild(s);
        return;
      }
      for (const a of Array.from(s.attributes))
        (a.name.startsWith("on") || a.value.toLowerCase().includes("javascript:")) && s.removeAttribute(a.name);
      Array.from(s.children).forEach(o);
    };
    return o(n.documentElement), new XMLSerializer().serializeToString(n.documentElement);
  } catch {
    return "";
  }
}
function Re(t) {
  const e = t.getBoundingClientRect(), n = getComputedStyle(t);
  return {
    top: e.top + (window.scrollY || 0),
    left: e.left + (window.scrollX || 0),
    width: e.width,
    height: e.height,
    position: n.position || "relative",
    zIndex: n.zIndex === "auto" ? "" : n.zIndex
  };
}
function G(t) {
  if (!t) return null;
  const e = t.trim();
  return e.startsWith("<svg") && me(e) || null;
}
function U({
  className: t,
  icon: e,
  disabled: n,
  tooltip: o,
  onClick: s,
  ariaLabel: i
}) {
  const a = n !== void 0 && n !== !1 && n !== "false" && n !== "0", c = typeof n == "string" && n !== "true" && n !== "1" ? n : o;
  return /* @__PURE__ */ r(
    "button",
    {
      className: t,
      "aria-label": i,
      "aria-disabled": a ? "true" : void 0,
      tabIndex: a ? -1 : void 0,
      "data-tooltip": a && c ? c : void 0,
      onClick: (u) => {
        if (a) {
          u.preventDefault();
          return;
        }
        s();
      },
      dangerouslySetInnerHTML: e ? { __html: e } : void 0
    }
  );
}
function K({
  windowId: t,
  title: e = "Window",
  icon: n,
  size: o,
  resizable: s = !0,
  movable: i = !0,
  width: a,
  height: c,
  minimizeIcon: l,
  fullscreenIcon: u,
  closeIcon: g,
  disableMinimize: v,
  disableFullscreen: f,
  disableClose: d,
  fullscreenMode: m,
  bodyOverflow: N,
  scrollContent: b,
  onMinimize: w,
  onFullscreen: h,
  fullscreenAnimation: _,
  onClose: T,
  children: I,
  style: D,
  className: W
}) {
  const k = M(null), A = M(null), S = M(null), X = ue(), C = t ?? X, L = pe(), P = Fe(), J = Xe(), [Q, be] = $(!1), [R, we] = $(!1), Y = M(null), ye = !!(a || c), ve = {
    ...a ? { "--ddw-w": a } : {},
    ...c ? { "--ddw-h": c } : {},
    ...P ? { position: "absolute" } : {},
    ...D
  }, q = M(() => {
  }), ee = M(() => {
  });
  z(() => {
    const y = k.current;
    if (y)
      return L.register(C, y, e ?? "Window", { icon: n, toggle: () => q.current() }), L.registerClose(C, () => ee.current()), L.registerOpen(C, () => {
        if (!y || !document.contains(y)) return;
        y.style.display = "";
        const p = y.querySelector(".dd-win");
        p && (p.getAnimations().forEach((E) => E.cancel()), se(p)), L.register(C, y, e ?? "Window", { icon: n, toggle: () => q.current() }), L.raise(C);
      }), () => L.unregister(C);
  }, [C, e, n, L]);
  const Z = B(() => {
    L.raise(C);
  }, [C]), te = B(() => {
    var H;
    const y = (H = k.current) == null ? void 0 : H.querySelector(".dd-win"), p = k.current;
    if (!y || !p) return;
    const E = !Q;
    E ? (Me(y), L.minimize(C), p.style.pointerEvents = "none") : (se(y), L.restore(C), p.style.pointerEvents = ""), be(E), w == null || w(E);
  }, [Q, w, C, L]);
  q.current = te;
  const xe = B(() => {
    const y = k.current;
    if (!y) return;
    const p = !R, E = () => {
      p ? (Y.current = Re(y), y.setAttribute("data-explicit", ""), Ie(y, Y.current)) : Y.current && ze(y, Y.current);
    };
    _ ? _(y, { isFullscreen: p, defaultFn: E }) : E(), we(p), h == null || h(p);
  }, [R, h, _]), ne = B(() => {
    var E;
    const y = (E = k.current) == null ? void 0 : E.querySelector(".dd-win"), p = k.current;
    !y || !p || Ae(y, () => {
      p.style.display = "none", L.unregister(C), T == null || T();
    });
  }, [T, L, C]);
  ee.current = ne, z(() => {
    const y = A.current, p = k.current;
    if (!(!y || !p || !i))
      return $e({
        handle: y,
        host: p,
        container: P == null ? void 0 : P.current,
        reservedBottom: J,
        exclude: ".dd-win-controls",
        disabled: () => R && m !== "expand",
        onStart: (E) => {
          var re;
          p.hasAttribute("data-explicit") || (p.style.setProperty("--ddw-w", `${E.width}px`), p.style.setProperty("--ddw-h", `${E.height}px`), p.setAttribute("data-explicit", ""));
          const H = getComputedStyle(p).position;
          if (H === "static" || H === "relative") {
            const j = (re = P == null ? void 0 : P.current) == null ? void 0 : re.getBoundingClientRect();
            p.style.position = "absolute", p.style.left = `${E.left + (window.scrollX || 0) - ((j == null ? void 0 : j.left) ?? 0)}px`, p.style.top = `${E.top + (window.scrollY || 0) - ((j == null ? void 0 : j.top) ?? 0)}px`;
          }
          Z();
        }
      });
  }, [i, R, m, Z, P, J]), z(() => {
    const y = S.current, p = k.current;
    if (!(!y || !p || !s))
      return We({
        handle: y,
        host: p,
        disabled: () => R
      });
  }, [s, R]);
  const ke = G(l), Ne = G(u), _e = G(g);
  return /* @__PURE__ */ r(
    "div",
    {
      ref: k,
      className: ["dd-window", W].filter(Boolean).join(" "),
      "data-size": o,
      "data-explicit": ye ? "" : void 0,
      style: ve,
      onPointerDown: Z,
      children: /* @__PURE__ */ x("div", { className: "dd-win", children: [
        /* @__PURE__ */ x(
          "div",
          {
            ref: A,
            className: ["dd-win-header", i ? "" : "dd-win-header--no-move"].filter(Boolean).join(" "),
            children: [
              /* @__PURE__ */ r("span", { className: "dd-win-title", children: e }),
              /* @__PURE__ */ x("div", { className: "dd-win-controls", children: [
                /* @__PURE__ */ r(
                  U,
                  {
                    className: "dd-btn--minimize",
                    icon: ke,
                    disabled: v,
                    onClick: te,
                    ariaLabel: "minimize"
                  }
                ),
                /* @__PURE__ */ r(
                  U,
                  {
                    className: "dd-btn--fullscreen",
                    icon: Ne,
                    disabled: f,
                    onClick: xe,
                    ariaLabel: "fullscreen"
                  }
                ),
                /* @__PURE__ */ r(
                  U,
                  {
                    className: "dd-btn--close",
                    icon: _e,
                    disabled: d,
                    onClick: ne,
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
              ...N ? { "--dd-body-overflow": N } : {},
              ...b ? { "--dd-body-overflow": "hidden", padding: 0, display: "flex", flexDirection: "column", flex: "1 1 0", minHeight: 0 } : {}
            },
            children: b ? /* @__PURE__ */ r("div", { className: "dd-win-scroll-content", children: I }) : I
          }
        ),
        s && /* @__PURE__ */ r("div", { ref: S, className: "dd-win-resize-handle" })
      ] })
    }
  );
}
const je = 36, ie = 40, oe = 24, He = 10, V = de(null);
function Ge({ children: t, className: e, style: n, taskbarHeight: o = je }) {
  const s = Te(() => new fe(), []), i = M(null), a = M(/* @__PURE__ */ new Map()), [c, l] = $([]), u = M(0), g = B((d) => {
    a.current.set(d.id, d);
  }, []), v = B((d) => {
    const m = a.current.get(d);
    if (!m) return null;
    const N = `${d}__${Math.random().toString(36).slice(2)}`, b = u.current % He, w = ie + b * oe, h = ie + b * oe;
    return u.current++, l((_) => [..._, { instanceId: N, def: m, top: w, left: h }]), N;
  }, []), f = B((d) => {
    l((m) => m.filter((N) => N.instanceId !== d));
  }, []);
  return /* @__PURE__ */ r(V.Provider, { value: { wm: s, containerRef: i, taskbarHeight: o, registerApp: g, launch: v, closeApp: f }, children: /* @__PURE__ */ x(
    "div",
    {
      ref: i,
      className: ["dd-desktop", e].filter(Boolean).join(" "),
      style: {
        "--dd-taskbar-h": `${o}px`,
        ...n
      },
      children: [
        t,
        c.map(({ instanceId: d, def: m, top: N, left: b }) => /* @__PURE__ */ r(
          K,
          {
            title: m.title,
            icon: m.icon,
            width: m.defaultWidth,
            height: m.defaultHeight,
            style: { top: N, left: b },
            onClose: () => f(d),
            children: /* @__PURE__ */ r(m.component, {})
          },
          d
        ))
      ]
    }
  ) });
}
function pe() {
  var t;
  return ((t = O(V)) == null ? void 0 : t.wm) ?? Be;
}
function Fe() {
  var t;
  return ((t = O(V)) == null ? void 0 : t.containerRef) ?? null;
}
function Xe() {
  var t;
  return ((t = O(V)) == null ? void 0 : t.taskbarHeight) ?? 0;
}
function ge({ src: t, size: e = 16, alt: n = "", className: o }) {
  if (!t) return null;
  const s = t.trim(), i = ["dd-icon", o].filter(Boolean).join(" ");
  if (s.startsWith("<svg")) {
    const a = me(s);
    return a ? /* @__PURE__ */ r(
      "span",
      {
        className: i,
        style: { width: e, height: e, display: "inline-flex", flexShrink: 0 },
        dangerouslySetInnerHTML: { __html: a },
        "aria-hidden": "true"
      }
    ) : null;
  }
  return /* @__PURE__ */ r(
    "img",
    {
      className: i,
      src: s,
      width: e,
      height: e,
      alt: n,
      style: { flexShrink: 0 }
    }
  );
}
const Ye = 200;
function Oe() {
  const [t, e] = $(() => ae(/* @__PURE__ */ new Date()));
  return z(() => {
    const n = setInterval(() => e(ae(/* @__PURE__ */ new Date())), 1e3);
    return () => clearInterval(n);
  }, []), /* @__PURE__ */ r("div", { className: "dd-taskbar-clock", children: t });
}
function ae(t) {
  return t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function Ue({ clock: t = !0, className: e }) {
  const n = pe(), [o, s] = $(() => n.getWindows());
  return z(() => (s(n.getWindows()), n.subscribe(() => {
    const i = n.getWindows(), a = new Set(i.map((c) => c.id));
    s((c) => c.some((u) => !u.leaving && !a.has(u.id)) ? c.map((u) => a.has(u.id) ? u : { ...u, leaving: !0 }) : i);
  })), [n]), z(() => {
    if (o.filter((c) => c.leaving).length === 0) return;
    const a = setTimeout(() => s(n.getWindows()), Ye);
    return () => clearTimeout(a);
  }, [o, n]), /* @__PURE__ */ x("div", { className: ["dd-taskbar", e].filter(Boolean).join(" "), children: [
    /* @__PURE__ */ r("div", { className: "dd-taskbar-windows", children: o.map((i) => /* @__PURE__ */ x(
      "button",
      {
        className: [
          "dd-taskbar-btn",
          i.leaving ? "dd-taskbar-btn--leaving" : i.isMinimized ? "dd-taskbar-btn--minimized" : "dd-taskbar-btn--active"
        ].join(" "),
        onClick: () => i.toggle(),
        title: i.title,
        children: [
          i.icon && /* @__PURE__ */ r(ge, { src: i.icon, size: 16 }),
          /* @__PURE__ */ r("span", { className: "dd-taskbar-btn-label", children: i.title })
        ]
      },
      i.id
    )) }),
    t && /* @__PURE__ */ r(Oe, {})
  ] });
}
function Ke({ label: t, icon: e, iconSize: n = 48, onClick: o, className: s, style: i }) {
  return /* @__PURE__ */ x(
    "button",
    {
      className: ["dd-desktop-icon", s].filter(Boolean).join(" "),
      onClick: o,
      style: i,
      title: t,
      children: [
        /* @__PURE__ */ r(ge, { src: e, size: n }),
        /* @__PURE__ */ r("span", { className: "dd-desktop-icon-label", children: t })
      ]
    }
  );
}
function Je({
  variant: t = "primary",
  size: e,
  disabled: n = !1,
  action: o,
  minWidth: s,
  width: i,
  height: a,
  fontSize: c,
  px: l,
  py: u,
  onClick: g,
  children: v,
  className: f,
  style: d
}) {
  const m = {
    ...s ? { "--dd-btn-min-w": s } : {},
    ...i ? { "--dd-btn-w": i } : {},
    ...a ? { "--dd-btn-h": a } : {},
    ...c ? { "--dd-btn-fs": c } : {},
    ...l ? { "--dd-btn-px": l } : {},
    ...u ? { "--dd-btn-py": u } : {},
    ...d
  }, N = [
    "btn",
    `btn--${t}`,
    n ? "btn--disable" : "",
    e ? `btn--size-${e}` : "",
    f
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ r(
    "button",
    {
      className: N,
      style: m,
      disabled: n,
      "aria-disabled": n ? "true" : void 0,
      tabIndex: n ? -1 : void 0,
      "data-action": o,
      "aria-label": o,
      onClick: n ? void 0 : g,
      children: v
    }
  );
}
function Qe({ type: t = "notification", message: e, onClose: n }) {
  const [o, s] = $(!0), i = M(e);
  if (z(() => {
    e !== i.current && (i.current = e, s(!0));
  }, [e]), !o) return null;
  const a = () => {
    s(!1), n == null || n();
  };
  return /* @__PURE__ */ x("div", { className: `toast toast-${t}`, children: [
    /* @__PURE__ */ r("button", { className: "toast-btn--close", onClick: a, "aria-label": "close", children: "×" }),
    e
  ] });
}
function et({
  type: t = "text",
  label: e,
  layout: n = "block",
  id: o,
  value: s,
  defaultValue: i,
  placeholder: a,
  disabled: c,
  onChange: l,
  className: u,
  style: g
}) {
  const v = ue(), f = o ?? v, d = n === "inline" ? { display: "flex", alignItems: "center", gap: "0.5rem" } : {};
  return /* @__PURE__ */ x("div", { className: ["input-grid", u].filter(Boolean).join(" "), style: { ...d, ...g }, children: [
    e && /* @__PURE__ */ r("label", { className: "input-label", htmlFor: f, children: e }),
    /* @__PURE__ */ r(
      "input",
      {
        type: t,
        id: f,
        className: "dreamdesk-input",
        ...s !== void 0 ? { value: s, onChange: l ? (m) => l(m.target.value, m) : void 0 } : { defaultValue: i, onChange: l ? (m) => l(m.target.value, m) : void 0 },
        placeholder: a,
        disabled: c
      }
    )
  ] });
}
function tt({
  value: t = 0,
  blocky: e = !1,
  gradient: n = !1,
  className: o,
  style: s
}) {
  const i = M(null), a = M(null);
  z(() => {
    var u;
    const l = i.current;
    if (l)
      return (u = a.current) == null || u.destroy(), a.current = De({
        track: l,
        getValue: () => t,
        isBlocky: () => e,
        isGradient: () => n
      }), a.current.rebuild(), () => {
        var g;
        (g = a.current) == null || g.destroy(), a.current = null;
      };
  }, [e, n]), z(() => {
    var l;
    (l = a.current) == null || l.update(t);
  }, [t]);
  const c = [
    "progress-track",
    e ? "progress-track--blocky" : "",
    o
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ r("div", { ref: i, className: c, style: s, children: !e && /* @__PURE__ */ r("div", { className: ["progress-bar", n ? "progress-bar--gradient" : ""].filter(Boolean).join(" ") }) });
}
function ce({ children: t, index: e = 0, active: n = !1, onClick: o }) {
  return /* @__PURE__ */ r(
    "dreamdesk-tab",
    {
      class: n ? "active" : void 0,
      "data-tab": "",
      "data-tab-index": String(e),
      onClick: () => o == null ? void 0 : o(e),
      children: t
    }
  );
}
function le({ children: t, active: e = !1, style: n }) {
  return /* @__PURE__ */ r(
    "dreamdesk-tab-panel",
    {
      class: e ? "active" : void 0,
      "data-panel": "",
      style: { display: e ? "block" : "none", ...n },
      children: t
    }
  );
}
function nt({
  defaultIndex: t = 0,
  activeIndex: e,
  onChange: n,
  children: o,
  className: s,
  style: i
}) {
  const [a, c] = $(t), l = e ?? a, u = (f) => {
    e === void 0 && c(f), n == null || n(f);
  }, g = [], v = [];
  return Ee.forEach(o, (f) => {
    if (Ce(f)) {
      if (f.type === ce) {
        const d = g.length;
        g.push(
          /* @__PURE__ */ r(ce, { index: d, active: d === l, onClick: u, children: f.props.children }, d)
        );
      } else if (f.type === le) {
        const d = v.length;
        v.push(
          /* @__PURE__ */ r(le, { active: d === l, style: f.props.style, children: f.props.children }, d)
        );
      }
    }
  }), /* @__PURE__ */ x("div", { className: ["tabs", s].filter(Boolean).join(" "), style: i, children: [
    /* @__PURE__ */ r("div", { className: "tab-list", children: g }),
    /* @__PURE__ */ r("div", { className: "tab-panels", children: v })
  ] });
}
function rt({ checked: t, defaultChecked: e, onChange: n, style: o, className: s }) {
  const { theme: i } = Le(), a = t !== void 0, c = e ?? i === "dark";
  return /* @__PURE__ */ x("label", { className: ["toggle", s].filter(Boolean).join(" "), style: o, children: [
    /* @__PURE__ */ r(
      "input",
      {
        type: "checkbox",
        checked: a ? t : void 0,
        defaultChecked: a ? void 0 : c,
        onChange: (l) => n == null ? void 0 : n(l.target.checked)
      }
    ),
    /* @__PURE__ */ r("span", { className: "slider", children: /* @__PURE__ */ r("span", { className: "knob" }) })
  ] });
}
function st({ children: t, className: e, ...n }) {
  return /* @__PURE__ */ r(
    K,
    {
      ...n,
      className: ["terminal-window", e].filter(Boolean).join(" "),
      children: /* @__PURE__ */ r("div", { className: "terminal-win-body", children: t })
    }
  );
}
function it({
  url: t = "",
  canGoBack: e = !1,
  canGoForward: n = !1,
  status: o = "Done",
  onNavigate: s,
  onBack: i,
  onForward: a,
  onStop: c,
  onRefresh: l,
  onHome: u,
  children: g,
  className: v,
  ...f
}) {
  const [d, m] = $(t);
  z(() => {
    m(t);
  }, [t]);
  const N = () => {
    const h = d.trim();
    h && (s == null || s(h));
  }, b = (h) => {
    h.key === "Enter" && N();
  }, w = [
    { id: "back", label: "Back", icon: "←", arrow: !0, disabled: !e, onClick: i },
    { id: "forward", label: "Forward", icon: "→", arrow: !0, disabled: !n, onClick: a },
    "sep",
    { id: "stop", label: "Stop", icon: "✕", onClick: c },
    { id: "refresh", label: "Refresh", icon: "↻", onClick: l },
    { id: "home", label: "Home", icon: "⌂", onClick: u },
    "sep",
    { id: "search", label: "Search", icon: "⚲" },
    { id: "favorites", label: "Favorites", icon: "★" },
    { id: "history", label: "History", icon: "⊞" }
  ];
  return /* @__PURE__ */ r(
    K,
    {
      ...f,
      className: ["dd-browser-window", v].filter(Boolean).join(" "),
      bodyOverflow: "hidden",
      children: /* @__PURE__ */ x("div", { className: "dd-browser", children: [
        /* @__PURE__ */ r("div", { className: "dd-browser-toolbar", children: w.map(
          (h, _) => h === "sep" ? /* @__PURE__ */ r("div", { className: "dd-browser-sep" }, `sep-${_}`) : /* @__PURE__ */ x(
            "button",
            {
              className: ["dd-browser-btn", h.disabled ? "dd-browser-btn--disabled" : ""].filter(Boolean).join(" "),
              onClick: h.disabled ? void 0 : h.onClick,
              tabIndex: h.disabled ? -1 : void 0,
              "aria-disabled": h.disabled,
              children: [
                /* @__PURE__ */ r("span", { className: "dd-browser-btn-icon", children: h.icon }),
                /* @__PURE__ */ x("span", { className: "dd-browser-btn-label", children: [
                  h.label,
                  h.arrow && /* @__PURE__ */ r("span", { className: "dd-browser-btn-arrow", children: " ▾" })
                ] })
              ]
            },
            h.id
          )
        ) }),
        /* @__PURE__ */ x("div", { className: "dd-browser-addressbar", children: [
          /* @__PURE__ */ r("span", { className: "dd-browser-address-label", children: "Address" }),
          /* @__PURE__ */ x("div", { className: "dd-browser-address-input-wrap", children: [
            /* @__PURE__ */ r(
              "input",
              {
                className: "dd-browser-address-input",
                type: "text",
                value: d,
                onChange: (h) => m(h.target.value),
                onKeyDown: b,
                spellCheck: !1
              }
            ),
            /* @__PURE__ */ r("button", { className: "dd-browser-address-dropdown", tabIndex: -1, children: "▾" })
          ] }),
          /* @__PURE__ */ r("button", { className: "dd-browser-go-btn", onClick: N, children: "Go" })
        ] }),
        /* @__PURE__ */ r("div", { className: "dd-browser-content dd-scrollable dd-scrollable--fill", children: g }),
        /* @__PURE__ */ x("div", { className: "dd-browser-statusbar", children: [
          /* @__PURE__ */ r("span", { className: "dd-browser-status-text", children: o }),
          /* @__PURE__ */ x("div", { className: "dd-browser-status-zone", children: [
            /* @__PURE__ */ r("span", { className: "dd-browser-status-zone-icon", children: "🌐" }),
            /* @__PURE__ */ r("span", { children: "Internet" })
          ] })
        ] })
      ] })
    }
  );
}
function ot({ url: t, onRefresh: e }) {
  return /* @__PURE__ */ x("div", { className: "dd-browser-error", children: [
    /* @__PURE__ */ x("div", { className: "dd-browser-error-title", children: [
      /* @__PURE__ */ r("span", { className: "dd-browser-error-icon", children: "🚫" }),
      /* @__PURE__ */ r("span", { children: "The page cannot be displayed" })
    ] }),
    /* @__PURE__ */ r("hr", { className: "dd-browser-error-hr" }),
    /* @__PURE__ */ r("p", { children: "The page you are looking for is currently unavailable. The Web site might be experiencing technical difficulties, or you may need to adjust your browser settings." }),
    /* @__PURE__ */ r("hr", { className: "dd-browser-error-hr" }),
    /* @__PURE__ */ r("p", { children: /* @__PURE__ */ r("strong", { children: "Please try the following:" }) }),
    /* @__PURE__ */ x("ul", { children: [
      /* @__PURE__ */ x("li", { children: [
        "Click the ",
        /* @__PURE__ */ r("button", { className: "dd-browser-error-link", onClick: e, children: /* @__PURE__ */ r("strong", { children: "Refresh" }) }),
        " button, or try again later."
      ] }),
      /* @__PURE__ */ r("li", { children: "If you typed the page address in the Address bar, make sure that it is spelled correctly." }),
      /* @__PURE__ */ x("li", { children: [
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
    t && /* @__PURE__ */ x("p", { className: "dd-browser-error-detail", children: [
      "Cannot display the webpage: ",
      /* @__PURE__ */ r("code", { children: t })
    ] }),
    /* @__PURE__ */ r("hr", { className: "dd-browser-error-hr" }),
    /* @__PURE__ */ r("p", { className: "dd-browser-error-code", children: "HTTP 403 — Forbidden: This page has refused to connect." })
  ] });
}
export {
  ot as BrowserErrorPage,
  it as BrowserWindow,
  Je as Button,
  Ge as Desktop,
  Ke as DesktopIcon,
  ge as Icon,
  et as Input,
  tt as ProgressBar,
  ce as Tab,
  le as TabPanel,
  nt as Tabs,
  Ue as Taskbar,
  st as TerminalWindow,
  Ze as ThemeProvider,
  Qe as Toast,
  rt as Toggle,
  K as Window,
  Le as useTheme,
  pe as useWindowManager
};
