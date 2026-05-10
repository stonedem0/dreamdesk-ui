import { jsx as c, jsxs as $ } from "react/jsx-runtime";
import { createContext as et, useState as B, useEffect as P, useCallback as j, useContext as X, useMemo as yt, useRef as W, useId as nt, Children as vt, isValidElement as wt } from "react";
const rt = et(null);
function Ht({ children: e, defaultTheme: t = "pastelcore" }) {
  const [n, s] = B(t);
  P(() => {
    document.documentElement.setAttribute("data-theme", n);
  }, [n]);
  const r = j((i) => {
    s(i);
  }, []);
  return /* @__PURE__ */ c(rt.Provider, { value: { theme: n, setTheme: r }, children: e });
}
const xt = {
  theme: "pastelcore",
  setTheme: () => {
  }
};
function bt() {
  return X(rt) ?? xt;
}
function D(e) {
  var n;
  const t = ((n = e == null ? void 0 : e.getAnimations) == null ? void 0 : n.call(e)) ?? [];
  for (const s of t) s.cancel();
}
function kt(e) {
  D(e), e.style.transformOrigin = "50% 100%", e.animate(
    [{ transform: "scale(1)" }, { transform: "scale(0)" }],
    { duration: 300, easing: "ease-in", fill: "forwards" }
  );
}
function Lt(e) {
  D(e), e.style.transformOrigin = "50% 100%", e.animate(
    [{ transform: "scale(0)" }, { transform: "scale(1)" }],
    { duration: 300, easing: "ease-out" }
  );
}
function Nt(e, t) {
  D(e);
  const n = window.innerWidth, s = window.innerHeight, r = t.top - (window.scrollY || 0), i = t.left - (window.scrollX || 0), o = t.width, l = t.height;
  e.style.position = "fixed", e.style.top = "0", e.style.left = "0", e.style.width = "100vw", e.style.height = "100vh", e.style.setProperty("--ddw-w", "100vw"), e.style.setProperty("--ddw-h", "100vh"), e.style.zIndex = "9999";
  const a = o / n, u = l / s, m = i + o / 2 - n / 2, g = r + l / 2 - s / 2;
  e.animate(
    [
      { transform: `translate(${m}px, ${g}px) scale(${a}, ${u})` },
      { transform: "none" }
    ],
    { duration: 500, easing: "cubic-bezier(0.2, 0, 0, 1)" }
  );
}
function _t(e, t) {
  D(e);
  const n = window.innerWidth, s = window.innerHeight, r = t.width, i = t.height, o = t.top - (window.scrollY || 0), l = t.left - (window.scrollX || 0), a = r / n, u = i / s, m = l + r / 2 - n / 2, g = o + i / 2 - s / 2, d = e.animate(
    [
      { transform: "none" },
      { transform: `translate(${m}px, ${g}px) scale(${a}, ${u})` }
    ],
    { duration: 300, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" }
  ), f = () => {
    e.style.position = t.position || "absolute", e.style.top = `${Math.round(t.top)}px`, e.style.left = `${Math.round(t.left)}px`, e.style.width = "", e.style.height = "", e.style.setProperty("--ddw-w", `${Math.round(r)}px`), e.style.setProperty("--ddw-h", `${Math.round(i)}px`), t.zIndex ? e.style.zIndex = t.zIndex : e.style.removeProperty("z-index");
  };
  d.onfinish = () => {
    f(), e.getAnimations().forEach((w) => w.cancel());
  }, d.oncancel = f;
}
function Tt(e, t) {
  e.animate(
    [{ opacity: "1", transform: "scale(1)" }, { opacity: "0", transform: "scale(0.95)" }],
    { duration: 300, easing: "ease", fill: "forwards" }
  ).onfinish = () => t == null ? void 0 : t();
}
function zt({ handle: e, host: t, container: n, reservedBottom: s = 0, signal: r, disabled: i, exclude: o, getBounds: l, onStart: a }) {
  let u = !1, m = 0, g = 0, d = 0, f = 0, w = 0, z = 0, y = null, p = 0, x = 0;
  const T = () => {
    t.style.left = `${Math.max(0, Math.min(p - w, d))}px`, t.style.top = `${Math.max(0, Math.min(x - z, f))}px`;
  }, N = (k) => {
    u && (p = k.clientX - m, x = k.clientY - g, y && cancelAnimationFrame(y), y = requestAnimationFrame(() => {
      T(), y = null;
    }));
  }, E = () => {
    u = !1, document.removeEventListener("pointermove", N, { capture: !0 }), document.removeEventListener("pointerup", E, { capture: !0 }), y && (cancelAnimationFrame(y), y = null, T());
  }, _ = (k) => {
    if (i != null && i() || k.target.closest(o)) return;
    D(t);
    const L = t.getBoundingClientRect(), b = n == null ? void 0 : n.getBoundingClientRect();
    w = (b == null ? void 0 : b.left) ?? 0, z = (b == null ? void 0 : b.top) ?? 0, m = k.clientX - L.left, g = k.clientY - L.top;
    const M = (l == null ? void 0 : l()) ?? {
      maxLeft: b ? b.width - L.width : Math.max(0, window.innerWidth - L.width),
      maxTop: b ? b.height - L.height - s : Math.max(0, window.innerHeight - L.height - s)
    };
    d = M.maxLeft, f = M.maxTop, a == null || a(L), u = !0, document.addEventListener("pointermove", N, { capture: !0 }), document.addEventListener("pointerup", E, { capture: !0 });
  }, I = r ? { signal: r } : {};
  return e.addEventListener("pointerdown", _, I), () => {
    e.removeEventListener("pointerdown", _), document.removeEventListener("pointermove", N, { capture: !0 }), document.removeEventListener("pointerup", E, { capture: !0 }), y && cancelAnimationFrame(y);
  };
}
function Et({ handle: e, host: t, signal: n, disabled: s, minWidth: r = 180, minHeight: i = 120, explicitAttr: o = "data-explicit" }) {
  let l = !1, a = 0, u = 0, m = 0, g = 0;
  const d = (y) => {
    l && (t.style.setProperty("--ddw-w", `${Math.max(r, m + y.clientX - a)}px`), t.style.setProperty("--ddw-h", `${Math.max(i, g + y.clientY - u)}px`), t.setAttribute(o, ""));
  }, f = () => {
    l = !1, document.removeEventListener("pointermove", d, { capture: !0 }), document.removeEventListener("pointerup", f, { capture: !0 });
  }, w = (y) => {
    if (s != null && s()) return;
    l = !0, a = y.clientX, u = y.clientY;
    const p = t.getBoundingClientRect();
    m = p.width, g = p.height, document.addEventListener("pointermove", d, { capture: !0 }), document.addEventListener("pointerup", f, { capture: !0 });
  }, z = n ? { signal: n } : {};
  return e.addEventListener("pointerdown", w, z), () => {
    e.removeEventListener("pointerdown", w), document.removeEventListener("pointermove", d, { capture: !0 }), document.removeEventListener("pointerup", f, { capture: !0 });
  };
}
const Mt = 1e3;
class st {
  constructor() {
    this._registry = /* @__PURE__ */ new Map(), this._zStack = [], this._listeners = /* @__PURE__ */ new Set();
  }
  _notify() {
    this._listeners.forEach((t) => t());
  }
  _reassignZ() {
    this._zStack.forEach((t, n) => {
      const s = this._registry.get(t);
      s && (s.el.style.zIndex = String(Mt + n));
    });
  }
  register(t, n, s, r) {
    this._registry.set(t, { id: t, title: s, icon: r == null ? void 0 : r.icon, el: n, isMinimized: !1, toggle: (r == null ? void 0 : r.toggle) ?? (() => {
    }) }), this._zStack.includes(t) || this._zStack.push(t), this._reassignZ(), this._notify();
  }
  unregister(t) {
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
  getWindows() {
    return Array.from(this._registry.values());
  }
  subscribe(t) {
    return this._listeners.add(t), () => this._listeners.delete(t);
  }
}
const St = new st();
function $t({ track: e, getValue: t, isBlocky: n, isGradient: s }) {
  let r = [], i = null, o = null, l = null;
  const a = 1, u = 10, m = u + a;
  function g() {
    const p = s(), x = getComputedStyle(e), T = e.getBoundingClientRect().width - (parseFloat(x.borderLeftWidth) || 0) - (parseFloat(x.borderRightWidth) || 0), N = Math.max(1, Math.round((T + a) / m)), E = (T - (N - 1) * a) / N, _ = T;
    e.innerHTML = "", r = [];
    for (let I = 0; I < N; I++) {
      const k = document.createElement("div");
      k.className = "progress-segment", k.style.cssText = `width:${E}px;margin-right:${I < N - 1 ? a : 0}px`, p && (k.style.backgroundSize = `${_}px 100%`, k.style.backgroundPosition = `-${I * (E + a)}px 0`), e.appendChild(k), r.push(k);
    }
    d(t());
  }
  function d(p) {
    const x = Math.min(Math.max(p, 0), 100), T = Math.floor(x / 100 * r.length);
    r.forEach((N, E) => N.classList.toggle("progress-segment--active", E < T));
  }
  function f(p) {
    if (!i) return;
    const x = Math.min(Math.max(p, 0), 100), T = s();
    if (i.style.width = `${x}%`, !T) {
      const N = getComputedStyle(i).getPropertyValue("--dd-progress-enable-hue-rotate").trim();
      i.style.filter = N === "0" ? "none" : `hue-rotate(${x * 3.6}deg)`;
    }
    i.classList.toggle("progress-bar--complete", p >= 100);
  }
  function w() {
    const p = n(), x = s();
    e.classList.toggle("progress-track--gradient", p && x), p ? (o == null || o.disconnect(), g(), o = new ResizeObserver(() => {
      l && clearTimeout(l), l = setTimeout(g, 50);
    }), o.observe(e)) : (i = e.querySelector(".progress-bar"), f(t()));
  }
  function z(p) {
    n() ? d(p) : f(p);
  }
  function y() {
    o == null || o.disconnect(), l && clearTimeout(l);
  }
  return { update: z, rebuild: w, destroy: y };
}
const It = 36, R = et(null);
function Xt({ children: e, className: t, style: n, taskbarHeight: s = It }) {
  const r = yt(() => new st(), []), i = W(null);
  return /* @__PURE__ */ c(R.Provider, { value: { wm: r, containerRef: i, taskbarHeight: s }, children: /* @__PURE__ */ c(
    "div",
    {
      ref: i,
      className: ["dd-desktop", t].filter(Boolean).join(" "),
      style: {
        "--dd-taskbar-h": `${s}px`,
        ...n
      },
      children: e
    }
  ) });
}
function it() {
  var e;
  return ((e = X(R)) == null ? void 0 : e.wm) ?? St;
}
function Wt() {
  var e;
  return ((e = X(R)) == null ? void 0 : e.containerRef) ?? null;
}
function Pt() {
  var e;
  return ((e = X(R)) == null ? void 0 : e.taskbarHeight) ?? 0;
}
function ot(e) {
  try {
    const n = new DOMParser().parseFromString(e, "image/svg+xml");
    if (n.querySelector("parsererror")) return "";
    const s = (r) => {
      var i;
      if (r.tagName.toLowerCase() === "script") {
        (i = r.parentNode) == null || i.removeChild(r);
        return;
      }
      for (const o of Array.from(r.attributes))
        (o.name.startsWith("on") || o.value.toLowerCase().includes("javascript:")) && r.removeAttribute(o.name);
      Array.from(r.children).forEach(s);
    };
    return s(n.documentElement), new XMLSerializer().serializeToString(n.documentElement);
  } catch {
    return "";
  }
}
function at({ src: e, size: t = 16, alt: n = "", className: s }) {
  if (!e) return null;
  const r = e.trim(), i = ["dd-icon", s].filter(Boolean).join(" ");
  if (r.startsWith("<svg")) {
    const o = ot(r);
    return o ? /* @__PURE__ */ c(
      "span",
      {
        className: i,
        style: { width: t, height: t, display: "inline-flex", flexShrink: 0 },
        dangerouslySetInnerHTML: { __html: o },
        "aria-hidden": "true"
      }
    ) : null;
  }
  return /* @__PURE__ */ c(
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
function Bt() {
  const [e, t] = B(() => J(/* @__PURE__ */ new Date()));
  return P(() => {
    const n = setInterval(() => t(J(/* @__PURE__ */ new Date())), 1e3);
    return () => clearInterval(n);
  }, []), /* @__PURE__ */ c("div", { className: "dd-taskbar-clock", children: e });
}
function J(e) {
  return e.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function Rt({ clock: e = !0, className: t }) {
  const n = it(), [s, r] = B(() => n.getWindows());
  return P(() => (r(n.getWindows()), n.subscribe(() => r([...n.getWindows()]))), [n]), /* @__PURE__ */ $("div", { className: ["dd-taskbar", t].filter(Boolean).join(" "), children: [
    /* @__PURE__ */ c("div", { className: "dd-taskbar-windows", children: s.map((i) => /* @__PURE__ */ $(
      "button",
      {
        className: ["dd-taskbar-btn", i.isMinimized ? "dd-taskbar-btn--minimized" : "dd-taskbar-btn--active"].join(" "),
        onClick: () => i.toggle(),
        title: i.title,
        children: [
          i.icon && /* @__PURE__ */ c(at, { src: i.icon, size: 16 }),
          /* @__PURE__ */ c("span", { className: "dd-taskbar-btn-label", children: i.title })
        ]
      },
      i.id
    )) }),
    e && /* @__PURE__ */ c(Bt, {})
  ] });
}
function Yt({ label: e, icon: t, iconSize: n = 48, onClick: s, className: r, style: i }) {
  return /* @__PURE__ */ $(
    "button",
    {
      className: ["dd-desktop-icon", r].filter(Boolean).join(" "),
      onClick: s,
      style: i,
      title: e,
      children: [
        /* @__PURE__ */ c(at, { src: t, size: n }),
        /* @__PURE__ */ c("span", { className: "dd-desktop-icon-label", children: e })
      ]
    }
  );
}
function At(e) {
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
function F(e) {
  if (!e) return null;
  const t = e.trim();
  return t.startsWith("<svg") && ot(t) || null;
}
function V({
  className: e,
  icon: t,
  disabled: n,
  tooltip: s,
  onClick: r,
  ariaLabel: i
}) {
  const o = n !== void 0 && n !== !1 && n !== "false" && n !== "0", l = typeof n == "string" && n !== "true" && n !== "1" ? n : s;
  return /* @__PURE__ */ c(
    "button",
    {
      className: e,
      "aria-label": i,
      "aria-disabled": o ? "true" : void 0,
      tabIndex: o ? -1 : void 0,
      "data-tooltip": o && l ? l : void 0,
      onClick: (u) => {
        if (o) {
          u.preventDefault();
          return;
        }
        r();
      },
      dangerouslySetInnerHTML: t ? { __html: t } : void 0
    }
  );
}
function Ct({
  title: e = "Window",
  icon: t,
  size: n,
  resizable: s = !0,
  movable: r = !0,
  width: i,
  height: o,
  minimizeIcon: l,
  fullscreenIcon: a,
  closeIcon: u,
  disableMinimize: m,
  disableFullscreen: g,
  disableClose: d,
  fullscreenMode: f,
  bodyOverflow: w,
  scrollContent: z,
  onMinimize: y,
  onFullscreen: p,
  onClose: x,
  children: T,
  style: N,
  className: E
}) {
  const _ = W(null), I = W(null), k = W(null), L = nt(), b = it(), M = Wt(), q = Pt(), [Z, ct] = B(!1), [A, lt] = B(!1), H = W(null), dt = !!(i || o), ut = {
    ...i ? { "--ddw-w": i } : {},
    ...o ? { "--ddw-h": o } : {},
    ...N
  }, O = W(() => {
  });
  P(() => {
    const v = _.current;
    if (v)
      return b.register(L, v, e ?? "Window", { icon: t, toggle: () => O.current() }), () => b.unregister(L);
  }, [L, e, t, b]);
  const Y = j(() => {
    b.raise(L);
  }, [L]), U = j(() => {
    var S;
    const v = (S = _.current) == null ? void 0 : S.querySelector(".dd-win");
    if (!v) return;
    const h = !Z;
    h ? (kt(v), b.minimize(L)) : (Lt(v), b.restore(L)), ct(h), y == null || y(h);
  }, [Z, y, L]);
  O.current = U;
  const ft = j(() => {
    const v = _.current;
    if (!v) return;
    const h = !A;
    h ? (H.current = At(v), v.setAttribute("data-explicit", ""), Nt(v, H.current)) : H.current && _t(v, H.current);
    const S = h;
    lt(S), p == null || p(S);
  }, [A, p]), mt = j(() => {
    var h;
    const v = (h = _.current) == null ? void 0 : h.querySelector(".dd-win");
    v && Tt(v, () => {
      _.current && (_.current.style.display = "none"), x == null || x();
    });
  }, [x]);
  P(() => {
    const v = I.current, h = _.current;
    if (!(!v || !h || !r))
      return zt({
        handle: v,
        host: h,
        container: M == null ? void 0 : M.current,
        reservedBottom: q,
        exclude: ".dd-win-controls",
        disabled: () => A && f !== "expand",
        onStart: (S) => {
          var K;
          h.hasAttribute("data-explicit") || (h.style.setProperty("--ddw-w", `${S.width}px`), h.style.setProperty("--ddw-h", `${S.height}px`), h.setAttribute("data-explicit", ""));
          const G = getComputedStyle(h).position;
          if (G === "static" || G === "relative") {
            const C = (K = M == null ? void 0 : M.current) == null ? void 0 : K.getBoundingClientRect();
            h.style.position = "absolute", h.style.left = `${S.left + (window.scrollX || 0) - ((C == null ? void 0 : C.left) ?? 0)}px`, h.style.top = `${S.top + (window.scrollY || 0) - ((C == null ? void 0 : C.top) ?? 0)}px`;
          }
          Y();
        }
      });
  }, [r, A, f, Y, M, q]), P(() => {
    const v = k.current, h = _.current;
    if (!(!v || !h || !s))
      return Et({
        handle: v,
        host: h,
        disabled: () => A
      });
  }, [s, A]);
  const pt = F(l), ht = F(a), gt = F(u);
  return /* @__PURE__ */ c(
    "div",
    {
      ref: _,
      className: ["dd-window", E].filter(Boolean).join(" "),
      "data-size": n,
      "data-explicit": dt ? "" : void 0,
      style: ut,
      onPointerDown: Y,
      children: /* @__PURE__ */ $("div", { className: "dd-win", children: [
        /* @__PURE__ */ $(
          "div",
          {
            ref: I,
            className: ["dd-win-header", r ? "" : "dd-win-header--no-move"].filter(Boolean).join(" "),
            children: [
              /* @__PURE__ */ c("span", { className: "dd-win-title", children: e }),
              /* @__PURE__ */ $("div", { className: "dd-win-controls", children: [
                /* @__PURE__ */ c(
                  V,
                  {
                    className: "dd-btn--minimize",
                    icon: pt,
                    disabled: m,
                    onClick: U,
                    ariaLabel: "minimize"
                  }
                ),
                /* @__PURE__ */ c(
                  V,
                  {
                    className: "dd-btn--fullscreen",
                    icon: ht,
                    disabled: g,
                    onClick: ft,
                    ariaLabel: "fullscreen"
                  }
                ),
                /* @__PURE__ */ c(
                  V,
                  {
                    className: "dd-btn--close",
                    icon: gt,
                    disabled: d,
                    onClick: mt,
                    ariaLabel: "close"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ c(
          "div",
          {
            className: "dd-win-body",
            style: {
              ...w ? { "--dd-body-overflow": w } : {},
              ...z ? { "--dd-body-overflow": "hidden", padding: 0, display: "flex", flexDirection: "column", flex: "1 1 0", minHeight: 0 } : {}
            },
            children: z ? /* @__PURE__ */ c("div", { className: "dd-win-scroll-content", children: T }) : T
          }
        ),
        s && /* @__PURE__ */ c("div", { ref: k, className: "dd-win-resize-handle" })
      ] })
    }
  );
}
function Ft({
  variant: e = "primary",
  size: t,
  disabled: n = !1,
  action: s,
  minWidth: r,
  width: i,
  height: o,
  fontSize: l,
  px: a,
  py: u,
  onClick: m,
  children: g,
  className: d,
  style: f
}) {
  const w = {
    ...r ? { "--dd-btn-min-w": r } : {},
    ...i ? { "--dd-btn-w": i } : {},
    ...o ? { "--dd-btn-h": o } : {},
    ...l ? { "--dd-btn-fs": l } : {},
    ...a ? { "--dd-btn-px": a } : {},
    ...u ? { "--dd-btn-py": u } : {},
    ...f
  }, z = [
    "btn",
    `btn--${e}`,
    n ? "btn--disable" : "",
    t ? `btn--size-${t}` : "",
    d
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ c(
    "button",
    {
      className: z,
      style: w,
      disabled: n,
      "aria-disabled": n ? "true" : void 0,
      tabIndex: n ? -1 : void 0,
      "data-action": s,
      "aria-label": s,
      onClick: n ? void 0 : m,
      children: g
    }
  );
}
function Vt({ type: e = "notification", message: t, onClose: n }) {
  const [s, r] = B(!0), i = W(t);
  if (P(() => {
    t !== i.current && (i.current = t, r(!0));
  }, [t]), !s) return null;
  const o = () => {
    r(!1), n == null || n();
  };
  return /* @__PURE__ */ $("div", { className: `toast toast-${e}`, children: [
    /* @__PURE__ */ c("button", { className: "toast-btn--close", onClick: o, "aria-label": "close", children: "×" }),
    t
  ] });
}
function qt({
  type: e = "text",
  label: t,
  layout: n = "block",
  id: s,
  value: r,
  defaultValue: i,
  placeholder: o,
  disabled: l,
  onChange: a,
  className: u,
  style: m
}) {
  const g = nt(), d = s ?? g, f = n === "inline" ? { display: "flex", alignItems: "center", gap: "0.5rem" } : {};
  return /* @__PURE__ */ $("div", { className: ["input-grid", u].filter(Boolean).join(" "), style: { ...f, ...m }, children: [
    t && /* @__PURE__ */ c("label", { className: "input-label", htmlFor: d, children: t }),
    /* @__PURE__ */ c(
      "input",
      {
        type: e,
        id: d,
        className: "dreamdesk-input",
        ...r !== void 0 ? { value: r, onChange: a ? (w) => a(w.target.value, w) : void 0 } : { defaultValue: i, onChange: a ? (w) => a(w.target.value, w) : void 0 },
        placeholder: o,
        disabled: l
      }
    )
  ] });
}
function Zt({
  value: e = 0,
  blocky: t = !1,
  gradient: n = !1,
  className: s,
  style: r
}) {
  const i = W(null), o = W(null);
  P(() => {
    var u;
    const a = i.current;
    if (a)
      return (u = o.current) == null || u.destroy(), o.current = $t({
        track: a,
        getValue: () => e,
        isBlocky: () => t,
        isGradient: () => n
      }), o.current.rebuild(), () => {
        var m;
        (m = o.current) == null || m.destroy(), o.current = null;
      };
  }, [t, n]), P(() => {
    var a;
    (a = o.current) == null || a.update(e);
  }, [e]);
  const l = [
    "progress-track",
    t ? "progress-track--blocky" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ c("div", { ref: i, className: l, style: r, children: !t && /* @__PURE__ */ c("div", { className: ["progress-bar", n ? "progress-bar--gradient" : ""].filter(Boolean).join(" ") }) });
}
function Q({ children: e, index: t = 0, active: n = !1, onClick: s }) {
  return /* @__PURE__ */ c(
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
function tt({ children: e, active: t = !1, style: n }) {
  return /* @__PURE__ */ c(
    "dreamdesk-tab-panel",
    {
      class: t ? "active" : void 0,
      "data-panel": "",
      style: { display: t ? "block" : "none", ...n },
      children: e
    }
  );
}
function Ot({
  defaultIndex: e = 0,
  activeIndex: t,
  onChange: n,
  children: s,
  className: r,
  style: i
}) {
  const [o, l] = B(e), a = t ?? o, u = (d) => {
    t === void 0 && l(d), n == null || n(d);
  }, m = [], g = [];
  return vt.forEach(s, (d) => {
    if (wt(d)) {
      if (d.type === Q) {
        const f = m.length;
        m.push(
          /* @__PURE__ */ c(Q, { index: f, active: f === a, onClick: u, children: d.props.children }, f)
        );
      } else if (d.type === tt) {
        const f = g.length;
        g.push(
          /* @__PURE__ */ c(tt, { active: f === a, style: d.props.style, children: d.props.children }, f)
        );
      }
    }
  }), /* @__PURE__ */ $("div", { className: ["tabs", r].filter(Boolean).join(" "), style: i, children: [
    /* @__PURE__ */ c("div", { className: "tab-list", children: m }),
    /* @__PURE__ */ c("div", { className: "tab-panels", children: g })
  ] });
}
function Ut({ checked: e, defaultChecked: t, onChange: n, style: s, className: r }) {
  const { theme: i } = bt(), o = e !== void 0, l = t ?? i === "dark";
  return /* @__PURE__ */ $("label", { className: ["toggle", r].filter(Boolean).join(" "), style: s, children: [
    /* @__PURE__ */ c(
      "input",
      {
        type: "checkbox",
        checked: o ? e : void 0,
        defaultChecked: o ? void 0 : l,
        onChange: (a) => n == null ? void 0 : n(a.target.checked)
      }
    ),
    /* @__PURE__ */ c("span", { className: "slider", children: /* @__PURE__ */ c("span", { className: "knob" }) })
  ] });
}
function Gt({ children: e, className: t, ...n }) {
  return /* @__PURE__ */ c(
    Ct,
    {
      ...n,
      className: ["terminal-window", t].filter(Boolean).join(" "),
      children: /* @__PURE__ */ c("div", { className: "terminal-win-body", children: e })
    }
  );
}
export {
  Ft as Button,
  Xt as Desktop,
  Yt as DesktopIcon,
  at as Icon,
  qt as Input,
  Zt as ProgressBar,
  Q as Tab,
  tt as TabPanel,
  Ot as Tabs,
  Rt as Taskbar,
  Gt as TerminalWindow,
  Ht as ThemeProvider,
  Vt as Toast,
  Ut as Toggle,
  Ct as Window,
  bt as useTheme,
  it as useWindowManager
};
