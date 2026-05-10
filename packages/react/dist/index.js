import { jsx as d, jsxs as P } from "react/jsx-runtime";
import { createContext as G, useState as C, useEffect as S, useCallback as B, useContext as R, useMemo as dt, useRef as $, useId as J, Children as ut, isValidElement as ft } from "react";
const K = G(null);
function St({ children: e, defaultTheme: t = "pastelcore" }) {
  const [n, r] = C(t);
  S(() => {
    document.documentElement.setAttribute("data-theme", n);
  }, [n]);
  const s = B((o) => {
    r(o);
  }, []);
  return /* @__PURE__ */ d(K.Provider, { value: { theme: n, setTheme: s }, children: e });
}
const mt = {
  theme: "pastelcore",
  setTheme: () => {
  }
};
function pt() {
  return R(K) ?? mt;
}
function j(e) {
  var n;
  const t = ((n = e == null ? void 0 : e.getAnimations) == null ? void 0 : n.call(e)) ?? [];
  for (const r of t) r.cancel();
}
function ht(e) {
  j(e), e.style.transformOrigin = "50% 100%", e.animate(
    [{ transform: "scale(1)" }, { transform: "scale(0)" }],
    { duration: 300, easing: "ease-in", fill: "forwards" }
  );
}
function gt(e) {
  j(e), e.style.transformOrigin = "50% 100%", e.animate(
    [{ transform: "scale(0)" }, { transform: "scale(1)" }],
    { duration: 300, easing: "ease-out" }
  );
}
function yt(e, t) {
  j(e);
  const n = window.innerWidth, r = window.innerHeight, s = t.top - (window.scrollY || 0), o = t.left - (window.scrollX || 0), i = t.width, c = t.height;
  e.style.position = "fixed", e.style.top = "0", e.style.left = "0", e.style.width = "100vw", e.style.height = "100vh", e.style.setProperty("--ddw-w", "100vw"), e.style.setProperty("--ddw-h", "100vh"), e.style.zIndex = "9999";
  const a = i / n, f = c / r, m = o + i / 2 - n / 2, y = s + c / 2 - r / 2;
  e.animate(
    [
      { transform: `translate(${m}px, ${y}px) scale(${a}, ${f})` },
      { transform: "none" }
    ],
    { duration: 500, easing: "cubic-bezier(0.2, 0, 0, 1)" }
  );
}
function vt(e, t) {
  j(e);
  const n = window.innerWidth, r = window.innerHeight, s = t.width, o = t.height, i = t.top - (window.scrollY || 0), c = t.left - (window.scrollX || 0), a = s / n, f = o / r, m = c + s / 2 - n / 2, y = i + o / 2 - r / 2, l = e.animate(
    [
      { transform: "none" },
      { transform: `translate(${m}px, ${y}px) scale(${a}, ${f})` }
    ],
    { duration: 300, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" }
  ), u = () => {
    e.style.position = t.position || "absolute", e.style.top = `${Math.round(t.top)}px`, e.style.left = `${Math.round(t.left)}px`, e.style.width = "", e.style.height = "", e.style.setProperty("--ddw-w", `${Math.round(s)}px`), e.style.setProperty("--ddw-h", `${Math.round(o)}px`), t.zIndex ? e.style.zIndex = t.zIndex : e.style.removeProperty("z-index");
  };
  l.onfinish = () => {
    u(), e.getAnimations().forEach((w) => w.cancel());
  }, l.oncancel = u;
}
function wt(e, t) {
  e.animate(
    [{ opacity: "1", transform: "scale(1)" }, { opacity: "0", transform: "scale(0.95)" }],
    { duration: 300, easing: "ease", fill: "forwards" }
  ).onfinish = () => t == null ? void 0 : t();
}
function xt({ handle: e, host: t, container: n, signal: r, disabled: s, exclude: o, getBounds: i, onStart: c }) {
  let a = !1, f = 0, m = 0, y = 0, l = 0, u = 0, w = 0, x = null, _ = 0, p = 0;
  const k = () => {
    t.style.left = `${Math.max(0, Math.min(_ - u, y))}px`, t.style.top = `${Math.max(0, Math.min(p - w, l))}px`;
  }, M = (E) => {
    a && (_ = E.clientX - f, p = E.clientY - m, x && cancelAnimationFrame(x), x = requestAnimationFrame(() => {
      k(), x = null;
    }));
  }, z = () => {
    a = !1, document.removeEventListener("pointermove", M, { capture: !0 }), document.removeEventListener("pointerup", z, { capture: !0 }), x && (cancelAnimationFrame(x), x = null, k());
  }, b = (E) => {
    if (s != null && s() || E.target.closest(o)) return;
    j(t);
    const h = t.getBoundingClientRect(), L = n == null ? void 0 : n.getBoundingClientRect();
    u = (L == null ? void 0 : L.left) ?? 0, w = (L == null ? void 0 : L.top) ?? 0, f = E.clientX - h.left, m = E.clientY - h.top;
    const N = (i == null ? void 0 : i()) ?? {
      maxLeft: L ? L.width - h.width : Math.max(0, window.innerWidth - h.width),
      maxTop: L ? L.height - h.height : Math.max(0, window.innerHeight - h.height)
    };
    y = N.maxLeft, l = N.maxTop, c == null || c(h), a = !0, document.addEventListener("pointermove", M, { capture: !0 }), document.addEventListener("pointerup", z, { capture: !0 });
  }, I = r ? { signal: r } : {};
  return e.addEventListener("pointerdown", b, I), () => {
    e.removeEventListener("pointerdown", b), document.removeEventListener("pointermove", M, { capture: !0 }), document.removeEventListener("pointerup", z, { capture: !0 }), x && cancelAnimationFrame(x);
  };
}
function bt({ handle: e, host: t, signal: n, disabled: r, minWidth: s = 180, minHeight: o = 120, explicitAttr: i = "data-explicit" }) {
  let c = !1, a = 0, f = 0, m = 0, y = 0;
  const l = (_) => {
    c && (t.style.setProperty("--ddw-w", `${Math.max(s, m + _.clientX - a)}px`), t.style.setProperty("--ddw-h", `${Math.max(o, y + _.clientY - f)}px`), t.setAttribute(i, ""));
  }, u = () => {
    c = !1, document.removeEventListener("pointermove", l, { capture: !0 }), document.removeEventListener("pointerup", u, { capture: !0 });
  }, w = (_) => {
    if (r != null && r()) return;
    c = !0, a = _.clientX, f = _.clientY;
    const p = t.getBoundingClientRect();
    m = p.width, y = p.height, document.addEventListener("pointermove", l, { capture: !0 }), document.addEventListener("pointerup", u, { capture: !0 });
  }, x = n ? { signal: n } : {};
  return e.addEventListener("pointerdown", w, x), () => {
    e.removeEventListener("pointerdown", w), document.removeEventListener("pointermove", l, { capture: !0 }), document.removeEventListener("pointerup", u, { capture: !0 });
  };
}
const Lt = 1e3;
class Q {
  constructor() {
    this._registry = /* @__PURE__ */ new Map(), this._zStack = [], this._listeners = /* @__PURE__ */ new Set();
  }
  _notify() {
    this._listeners.forEach((t) => t());
  }
  _reassignZ() {
    this._zStack.forEach((t, n) => {
      const r = this._registry.get(t);
      r && (r.el.style.zIndex = String(Lt + n));
    });
  }
  register(t, n, r) {
    this._registry.set(t, { id: t, title: r, el: n, isMinimized: !1 }), this._zStack.includes(t) || this._zStack.push(t), this._reassignZ(), this._notify();
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
const _t = new Q();
function kt({ track: e, getValue: t, isBlocky: n, isGradient: r }) {
  let s = [], o = null, i = null, c = null;
  const a = 1, f = 10, m = f + a;
  function y() {
    const p = r(), k = getComputedStyle(e), M = e.getBoundingClientRect().width - (parseFloat(k.borderLeftWidth) || 0) - (parseFloat(k.borderRightWidth) || 0), z = Math.max(1, Math.round((M + a) / m)), b = (M - (z - 1) * a) / z, I = M;
    e.innerHTML = "", s = [];
    for (let E = 0; E < z; E++) {
      const h = document.createElement("div");
      h.className = "progress-segment", h.style.cssText = `width:${b}px;margin-right:${E < z - 1 ? a : 0}px`, p && (h.style.backgroundSize = `${I}px 100%`, h.style.backgroundPosition = `-${E * (b + a)}px 0`), e.appendChild(h), s.push(h);
    }
    l(t());
  }
  function l(p) {
    const k = Math.min(Math.max(p, 0), 100), M = Math.floor(k / 100 * s.length);
    s.forEach((z, b) => z.classList.toggle("progress-segment--active", b < M));
  }
  function u(p) {
    if (!o) return;
    const k = Math.min(Math.max(p, 0), 100), M = r();
    if (o.style.width = `${k}%`, !M) {
      const z = getComputedStyle(o).getPropertyValue("--dd-progress-enable-hue-rotate").trim();
      o.style.filter = z === "0" ? "none" : `hue-rotate(${k * 3.6}deg)`;
    }
    o.classList.toggle("progress-bar--complete", p >= 100);
  }
  function w() {
    const p = n(), k = r();
    e.classList.toggle("progress-track--gradient", p && k), p ? (i == null || i.disconnect(), y(), i = new ResizeObserver(() => {
      c && clearTimeout(c), c = setTimeout(y, 50);
    }), i.observe(e)) : (o = e.querySelector(".progress-bar"), u(t()));
  }
  function x(p) {
    n() ? l(p) : u(p);
  }
  function _() {
    i == null || i.disconnect(), c && clearTimeout(c);
  }
  return { update: x, rebuild: w, destroy: _ };
}
const F = G(null);
function It({ children: e, className: t, style: n }) {
  const r = dt(() => new Q(), []), s = $(null);
  return /* @__PURE__ */ d(F.Provider, { value: { wm: r, containerRef: s }, children: /* @__PURE__ */ d(
    "div",
    {
      ref: s,
      className: ["dd-desktop", t].filter(Boolean).join(" "),
      style: { position: "relative", overflow: "hidden", ...n },
      children: e
    }
  ) });
}
function zt() {
  var e;
  return ((e = R(F)) == null ? void 0 : e.wm) ?? _t;
}
function Et() {
  var e;
  return ((e = R(F)) == null ? void 0 : e.containerRef) ?? null;
}
function Mt(e) {
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
function Nt(e) {
  try {
    const n = new DOMParser().parseFromString(e, "image/svg+xml");
    if (n.querySelector("parsererror")) return "";
    const r = (s) => {
      var o;
      if (s.tagName.toLowerCase() === "script") {
        (o = s.parentNode) == null || o.removeChild(s);
        return;
      }
      for (const i of Array.from(s.attributes))
        (i.name.startsWith("on") || i.value.toLowerCase().includes("javascript:")) && s.removeAttribute(i.name);
      Array.from(s.children).forEach(r);
    };
    return r(n.documentElement), new XMLSerializer().serializeToString(n.documentElement);
  } catch {
    return "";
  }
}
function Y(e) {
  if (!e) return null;
  const t = e.trim();
  return t.startsWith("<svg") && Nt(t) || null;
}
function H({
  className: e,
  icon: t,
  disabled: n,
  tooltip: r,
  onClick: s,
  ariaLabel: o
}) {
  const i = n !== void 0 && n !== !1 && n !== "false" && n !== "0", c = typeof n == "string" && n !== "true" && n !== "1" ? n : r;
  return /* @__PURE__ */ d(
    "button",
    {
      className: e,
      "aria-label": o,
      "aria-disabled": i ? "true" : void 0,
      tabIndex: i ? -1 : void 0,
      "data-tooltip": i && c ? c : void 0,
      onClick: (f) => {
        if (i) {
          f.preventDefault();
          return;
        }
        s();
      },
      dangerouslySetInnerHTML: t ? { __html: t } : void 0
    }
  );
}
function Tt({
  title: e = "Window",
  size: t,
  resizable: n = !0,
  movable: r = !0,
  width: s,
  height: o,
  minimizeIcon: i,
  fullscreenIcon: c,
  closeIcon: a,
  disableMinimize: f,
  disableFullscreen: m,
  disableClose: y,
  fullscreenMode: l,
  bodyOverflow: u,
  scrollContent: w,
  onMinimize: x,
  onFullscreen: _,
  onClose: p,
  children: k,
  style: M,
  className: z
}) {
  const b = $(null), I = $(null), E = $(null), h = J(), L = zt(), N = Et(), [V, tt] = C(!1), [W, et] = C(!1), X = $(null), nt = !!(s || o), rt = {
    ...s ? { "--ddw-w": s } : {},
    ...o ? { "--ddw-h": o } : {},
    ...M
  };
  S(() => {
    const v = b.current;
    if (v)
      return L.register(h, v, e ?? "Window"), () => L.unregister(h);
  }, [h, e]);
  const D = B(() => {
    L.raise(h);
  }, [h]), st = B(() => {
    var T;
    const v = (T = b.current) == null ? void 0 : T.querySelector(".dd-win");
    if (!v) return;
    const g = !V;
    g ? (ht(v), L.minimize(h)) : (gt(v), L.restore(h)), tt(g), x == null || x(g);
  }, [V, x, h]), it = B(() => {
    const v = b.current;
    if (!v) return;
    const g = !W;
    g ? (X.current = Mt(v), v.setAttribute("data-explicit", ""), yt(v, X.current)) : X.current && vt(v, X.current);
    const T = g;
    et(T), _ == null || _(T);
  }, [W, _]), ot = B(() => {
    var g;
    const v = (g = b.current) == null ? void 0 : g.querySelector(".dd-win");
    v && wt(v, () => {
      b.current && (b.current.style.display = "none"), p == null || p();
    });
  }, [p]);
  S(() => {
    const v = I.current, g = b.current;
    if (!(!v || !g || !r))
      return xt({
        handle: v,
        host: g,
        container: N == null ? void 0 : N.current,
        exclude: ".dd-win-controls",
        disabled: () => W && l !== "expand",
        onStart: (T) => {
          var Z;
          g.hasAttribute("data-explicit") || (g.style.setProperty("--ddw-w", `${T.width}px`), g.style.setProperty("--ddw-h", `${T.height}px`), g.setAttribute("data-explicit", ""));
          const q = getComputedStyle(g).position;
          if (q === "static" || q === "relative") {
            const A = (Z = N == null ? void 0 : N.current) == null ? void 0 : Z.getBoundingClientRect();
            g.style.position = "absolute", g.style.left = `${T.left + (window.scrollX || 0) - ((A == null ? void 0 : A.left) ?? 0)}px`, g.style.top = `${T.top + (window.scrollY || 0) - ((A == null ? void 0 : A.top) ?? 0)}px`;
          }
          D();
        }
      });
  }, [r, W, l, D, N]), S(() => {
    const v = E.current, g = b.current;
    if (!(!v || !g || !n))
      return bt({
        handle: v,
        host: g,
        disabled: () => W
      });
  }, [n, W]);
  const at = Y(i), ct = Y(c), lt = Y(a);
  return /* @__PURE__ */ d(
    "div",
    {
      ref: b,
      className: ["dd-window", z].filter(Boolean).join(" "),
      "data-size": t,
      "data-explicit": nt ? "" : void 0,
      style: rt,
      onPointerDown: D,
      children: /* @__PURE__ */ P("div", { className: "dd-win", children: [
        /* @__PURE__ */ P(
          "div",
          {
            ref: I,
            className: ["dd-win-header", r ? "" : "dd-win-header--no-move"].filter(Boolean).join(" "),
            children: [
              /* @__PURE__ */ d("span", { className: "dd-win-title", children: e }),
              /* @__PURE__ */ P("div", { className: "dd-win-controls", children: [
                /* @__PURE__ */ d(
                  H,
                  {
                    className: "dd-btn--minimize",
                    icon: at,
                    disabled: f,
                    onClick: st,
                    ariaLabel: "minimize"
                  }
                ),
                /* @__PURE__ */ d(
                  H,
                  {
                    className: "dd-btn--fullscreen",
                    icon: ct,
                    disabled: m,
                    onClick: it,
                    ariaLabel: "fullscreen"
                  }
                ),
                /* @__PURE__ */ d(
                  H,
                  {
                    className: "dd-btn--close",
                    icon: lt,
                    disabled: y,
                    onClick: ot,
                    ariaLabel: "close"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ d(
          "div",
          {
            className: "dd-win-body",
            style: {
              ...u ? { "--dd-body-overflow": u } : {},
              ...w ? { "--dd-body-overflow": "hidden", padding: 0, display: "flex", flexDirection: "column", flex: "1 1 0", minHeight: 0 } : {}
            },
            children: w ? /* @__PURE__ */ d("div", { className: "dd-win-scroll-content", children: k }) : k
          }
        ),
        n && /* @__PURE__ */ d("div", { ref: E, className: "dd-win-resize-handle" })
      ] })
    }
  );
}
function Wt({
  variant: e = "primary",
  size: t,
  disabled: n = !1,
  action: r,
  minWidth: s,
  width: o,
  height: i,
  fontSize: c,
  px: a,
  py: f,
  onClick: m,
  children: y,
  className: l,
  style: u
}) {
  const w = {
    ...s ? { "--dd-btn-min-w": s } : {},
    ...o ? { "--dd-btn-w": o } : {},
    ...i ? { "--dd-btn-h": i } : {},
    ...c ? { "--dd-btn-fs": c } : {},
    ...a ? { "--dd-btn-px": a } : {},
    ...f ? { "--dd-btn-py": f } : {},
    ...u
  }, x = [
    "btn",
    `btn--${e}`,
    n ? "btn--disable" : "",
    t ? `btn--size-${t}` : "",
    l
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ d(
    "button",
    {
      className: x,
      style: w,
      disabled: n,
      "aria-disabled": n ? "true" : void 0,
      tabIndex: n ? -1 : void 0,
      "data-action": r,
      "aria-label": r,
      onClick: n ? void 0 : m,
      children: y
    }
  );
}
function At({ type: e = "notification", message: t, onClose: n }) {
  const [r, s] = C(!0), o = $(t);
  if (S(() => {
    t !== o.current && (o.current = t, s(!0));
  }, [t]), !r) return null;
  const i = () => {
    s(!1), n == null || n();
  };
  return /* @__PURE__ */ P("div", { className: `toast toast-${e}`, children: [
    /* @__PURE__ */ d("button", { className: "toast-btn--close", onClick: i, "aria-label": "close", children: "×" }),
    t
  ] });
}
function Bt({
  type: e = "text",
  label: t,
  layout: n = "block",
  id: r,
  value: s,
  defaultValue: o,
  placeholder: i,
  disabled: c,
  onChange: a,
  className: f,
  style: m
}) {
  const y = J(), l = r ?? y, u = n === "inline" ? { display: "flex", alignItems: "center", gap: "0.5rem" } : {};
  return /* @__PURE__ */ P("div", { className: ["input-grid", f].filter(Boolean).join(" "), style: { ...u, ...m }, children: [
    t && /* @__PURE__ */ d("label", { className: "input-label", htmlFor: l, children: t }),
    /* @__PURE__ */ d(
      "input",
      {
        type: e,
        id: l,
        className: "dreamdesk-input",
        ...s !== void 0 ? { value: s, onChange: a ? (w) => a(w.target.value, w) : void 0 } : { defaultValue: o, onChange: a ? (w) => a(w.target.value, w) : void 0 },
        placeholder: i,
        disabled: c
      }
    )
  ] });
}
function Ct({
  value: e = 0,
  blocky: t = !1,
  gradient: n = !1,
  className: r,
  style: s
}) {
  const o = $(null), i = $(null);
  S(() => {
    var f;
    const a = o.current;
    if (a)
      return (f = i.current) == null || f.destroy(), i.current = kt({
        track: a,
        getValue: () => e,
        isBlocky: () => t,
        isGradient: () => n
      }), i.current.rebuild(), () => {
        var m;
        (m = i.current) == null || m.destroy(), i.current = null;
      };
  }, [t, n]), S(() => {
    var a;
    (a = i.current) == null || a.update(e);
  }, [e]);
  const c = [
    "progress-track",
    t ? "progress-track--blocky" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ d("div", { ref: o, className: c, style: s, children: !t && /* @__PURE__ */ d("div", { className: ["progress-bar", n ? "progress-bar--gradient" : ""].filter(Boolean).join(" ") }) });
}
function O({ children: e, index: t = 0, active: n = !1, onClick: r }) {
  return /* @__PURE__ */ d(
    "dreamdesk-tab",
    {
      class: n ? "active" : void 0,
      "data-tab": "",
      "data-tab-index": String(t),
      onClick: () => r == null ? void 0 : r(t),
      children: e
    }
  );
}
function U({ children: e, active: t = !1, style: n }) {
  return /* @__PURE__ */ d(
    "dreamdesk-tab-panel",
    {
      class: t ? "active" : void 0,
      "data-panel": "",
      style: { display: t ? "block" : "none", ...n },
      children: e
    }
  );
}
function jt({
  defaultIndex: e = 0,
  activeIndex: t,
  onChange: n,
  children: r,
  className: s,
  style: o
}) {
  const [i, c] = C(e), a = t ?? i, f = (l) => {
    t === void 0 && c(l), n == null || n(l);
  }, m = [], y = [];
  return ut.forEach(r, (l) => {
    if (ft(l)) {
      if (l.type === O) {
        const u = m.length;
        m.push(
          /* @__PURE__ */ d(O, { index: u, active: u === a, onClick: f, children: l.props.children }, u)
        );
      } else if (l.type === U) {
        const u = y.length;
        y.push(
          /* @__PURE__ */ d(U, { active: u === a, style: l.props.style, children: l.props.children }, u)
        );
      }
    }
  }), /* @__PURE__ */ P("div", { className: ["tabs", s].filter(Boolean).join(" "), style: o, children: [
    /* @__PURE__ */ d("div", { className: "tab-list", children: m }),
    /* @__PURE__ */ d("div", { className: "tab-panels", children: y })
  ] });
}
function Xt({ checked: e, defaultChecked: t, onChange: n, style: r, className: s }) {
  const { theme: o } = pt(), i = e !== void 0, c = t ?? o === "dark";
  return /* @__PURE__ */ P("label", { className: ["toggle", s].filter(Boolean).join(" "), style: r, children: [
    /* @__PURE__ */ d(
      "input",
      {
        type: "checkbox",
        checked: i ? e : void 0,
        defaultChecked: i ? void 0 : c,
        onChange: (a) => n == null ? void 0 : n(a.target.checked)
      }
    ),
    /* @__PURE__ */ d("span", { className: "slider", children: /* @__PURE__ */ d("span", { className: "knob" }) })
  ] });
}
function Dt({ children: e, className: t, ...n }) {
  return /* @__PURE__ */ d(
    Tt,
    {
      ...n,
      className: ["terminal-window", t].filter(Boolean).join(" "),
      children: /* @__PURE__ */ d("div", { className: "terminal-win-body", children: e })
    }
  );
}
export {
  Wt as Button,
  It as Desktop,
  Bt as Input,
  Ct as ProgressBar,
  O as Tab,
  U as TabPanel,
  jt as Tabs,
  Dt as TerminalWindow,
  St as ThemeProvider,
  At as Toast,
  Xt as Toggle,
  Tt as Window,
  pt as useTheme,
  zt as useWindowManager
};
