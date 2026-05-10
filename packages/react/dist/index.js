import { jsx as d, jsxs as T } from "react/jsx-runtime";
import { createContext as rt, useState as A, useEffect as P, useCallback as W, useContext as st, useRef as $, useId as V, Children as it, isValidElement as ot } from "react";
const q = rt(null);
function zt({ children: e, defaultTheme: t = "pastelcore" }) {
  const [n, r] = A(t);
  P(() => {
    document.documentElement.setAttribute("data-theme", n);
  }, [n]);
  const i = W((o) => {
    r(o);
  }, []);
  return /* @__PURE__ */ d(q.Provider, { value: { theme: n, setTheme: i }, children: e });
}
const at = {
  theme: "pastelcore",
  setTheme: () => {
  }
};
function ct() {
  return st(q) ?? at;
}
function B(e) {
  var n;
  const t = ((n = e == null ? void 0 : e.getAnimations) == null ? void 0 : n.call(e)) ?? [];
  for (const r of t) r.cancel();
}
function lt(e) {
  B(e), e.style.transformOrigin = "50% 100%", e.animate(
    [{ transform: "scale(1)" }, { transform: "scale(0)" }],
    { duration: 300, easing: "ease-in", fill: "forwards" }
  );
}
function dt(e) {
  B(e), e.style.transformOrigin = "50% 100%", e.animate(
    [{ transform: "scale(0)" }, { transform: "scale(1)" }],
    { duration: 300, easing: "ease-out" }
  );
}
function ut(e, t) {
  B(e);
  const n = window.innerWidth, r = window.innerHeight, i = t.top - (window.scrollY || 0), o = t.left - (window.scrollX || 0), s = t.width, l = t.height;
  e.style.position = "fixed", e.style.top = "0", e.style.left = "0", e.style.width = "100vw", e.style.height = "100vh", e.style.setProperty("--ddw-w", "100vw"), e.style.setProperty("--ddw-h", "100vh"), e.style.zIndex = "9999";
  const a = s / n, f = l / r, m = o + s / 2 - n / 2, g = i + l / 2 - r / 2;
  e.animate(
    [
      { transform: `translate(${m}px, ${g}px) scale(${a}, ${f})` },
      { transform: "none" }
    ],
    { duration: 500, easing: "cubic-bezier(0.2, 0, 0, 1)" }
  );
}
function ft(e, t) {
  B(e);
  const n = window.innerWidth, r = window.innerHeight, i = t.width, o = t.height, s = t.top - (window.scrollY || 0), l = t.left - (window.scrollX || 0), a = i / n, f = o / r, m = l + i / 2 - n / 2, g = s + o / 2 - r / 2, c = e.animate(
    [
      { transform: "none" },
      { transform: `translate(${m}px, ${g}px) scale(${a}, ${f})` }
    ],
    { duration: 300, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" }
  ), u = () => {
    e.style.position = t.position || "absolute", e.style.top = `${Math.round(t.top)}px`, e.style.left = `${Math.round(t.left)}px`, e.style.width = "", e.style.height = "", e.style.setProperty("--ddw-w", `${Math.round(i)}px`), e.style.setProperty("--ddw-h", `${Math.round(o)}px`), t.zIndex ? e.style.zIndex = t.zIndex : e.style.removeProperty("z-index");
  };
  c.onfinish = () => {
    u(), e.getAnimations().forEach((v) => v.cancel());
  }, c.oncancel = u;
}
function mt(e, t) {
  e.animate(
    [{ opacity: "1", transform: "scale(1)" }, { opacity: "0", transform: "scale(0.95)" }],
    { duration: 300, easing: "ease", fill: "forwards" }
  ).onfinish = () => t == null ? void 0 : t();
}
function pt({ handle: e, host: t, signal: n, disabled: r, exclude: i, getBounds: o, onStart: s }) {
  let l = !1, a = 0, f = 0, m = 0, g = 0, c = null, u = 0, v = 0;
  const z = () => {
    t.style.left = `${Math.max(0, Math.min(u, m))}px`, t.style.top = `${Math.max(0, Math.min(v, g))}px`;
  }, b = (w) => {
    l && (u = w.clientX - a, v = w.clientY - f, c && cancelAnimationFrame(c), c = requestAnimationFrame(() => {
      z(), c = null;
    }));
  }, p = () => {
    l = !1, document.removeEventListener("pointermove", b, { capture: !0 }), document.removeEventListener("pointerup", p, { capture: !0 }), c && (cancelAnimationFrame(c), c = null, z());
  }, L = (w) => {
    if (r != null && r() || w.target.closest(i)) return;
    B(t);
    const x = t.getBoundingClientRect();
    a = w.clientX - x.left, f = w.clientY - x.top;
    const N = (o == null ? void 0 : o()) ?? {
      maxLeft: Math.max(0, window.innerWidth - x.width),
      maxTop: Math.max(0, window.innerHeight - x.height)
    };
    m = N.maxLeft, g = N.maxTop, s == null || s(x), l = !0, document.addEventListener("pointermove", b, { capture: !0 }), document.addEventListener("pointerup", p, { capture: !0 });
  }, E = n ? { signal: n } : {};
  return e.addEventListener("pointerdown", L, E), () => {
    e.removeEventListener("pointerdown", L), document.removeEventListener("pointermove", b, { capture: !0 }), document.removeEventListener("pointerup", p, { capture: !0 }), c && cancelAnimationFrame(c);
  };
}
function ht({ handle: e, host: t, signal: n, disabled: r, minWidth: i = 180, minHeight: o = 120, explicitAttr: s = "data-explicit" }) {
  let l = !1, a = 0, f = 0, m = 0, g = 0;
  const c = (b) => {
    l && (t.style.setProperty("--ddw-w", `${Math.max(i, m + b.clientX - a)}px`), t.style.setProperty("--ddw-h", `${Math.max(o, g + b.clientY - f)}px`), t.setAttribute(s, ""));
  }, u = () => {
    l = !1, document.removeEventListener("pointermove", c, { capture: !0 }), document.removeEventListener("pointerup", u, { capture: !0 });
  }, v = (b) => {
    if (r != null && r()) return;
    l = !0, a = b.clientX, f = b.clientY;
    const p = t.getBoundingClientRect();
    m = p.width, g = p.height, document.addEventListener("pointermove", c, { capture: !0 }), document.addEventListener("pointerup", u, { capture: !0 });
  }, z = n ? { signal: n } : {};
  return e.addEventListener("pointerdown", v, z), () => {
    e.removeEventListener("pointerdown", v), document.removeEventListener("pointermove", c, { capture: !0 }), document.removeEventListener("pointerup", u, { capture: !0 });
  };
}
const gt = 1e3;
class yt {
  constructor() {
    this._registry = /* @__PURE__ */ new Map(), this._zStack = [], this._listeners = /* @__PURE__ */ new Set();
  }
  _notify() {
    this._listeners.forEach((t) => t());
  }
  _reassignZ() {
    this._zStack.forEach((t, n) => {
      const r = this._registry.get(t);
      r && (r.el.style.zIndex = String(gt + n));
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
const I = new yt();
function vt({ track: e, getValue: t, isBlocky: n, isGradient: r }) {
  let i = [], o = null, s = null, l = null;
  const a = 1, f = 10, m = f + a;
  function g() {
    const p = r(), L = getComputedStyle(e), E = e.getBoundingClientRect().width - (parseFloat(L.borderLeftWidth) || 0) - (parseFloat(L.borderRightWidth) || 0), w = Math.max(1, Math.round((E + a) / m)), x = (E - (w - 1) * a) / w, N = E;
    e.innerHTML = "", i = [];
    for (let M = 0; M < w; M++) {
      const _ = document.createElement("div");
      _.className = "progress-segment", _.style.cssText = `width:${x}px;margin-right:${M < w - 1 ? a : 0}px`, p && (_.style.backgroundSize = `${N}px 100%`, _.style.backgroundPosition = `-${M * (x + a)}px 0`), e.appendChild(_), i.push(_);
    }
    c(t());
  }
  function c(p) {
    const L = Math.min(Math.max(p, 0), 100), E = Math.floor(L / 100 * i.length);
    i.forEach((w, x) => w.classList.toggle("progress-segment--active", x < E));
  }
  function u(p) {
    if (!o) return;
    const L = Math.min(Math.max(p, 0), 100), E = r();
    if (o.style.width = `${L}%`, !E) {
      const w = getComputedStyle(o).getPropertyValue("--dd-progress-enable-hue-rotate").trim();
      o.style.filter = w === "0" ? "none" : `hue-rotate(${L * 3.6}deg)`;
    }
    o.classList.toggle("progress-bar--complete", p >= 100);
  }
  function v() {
    const p = n(), L = r();
    e.classList.toggle("progress-track--gradient", p && L), p ? (s == null || s.disconnect(), g(), s = new ResizeObserver(() => {
      l && clearTimeout(l), l = setTimeout(g, 50);
    }), s.observe(e)) : (o = e.querySelector(".progress-bar"), u(t()));
  }
  function z(p) {
    n() ? c(p) : u(p);
  }
  function b() {
    s == null || s.disconnect(), l && clearTimeout(l);
  }
  return { update: z, rebuild: v, destroy: b };
}
function xt(e) {
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
function wt(e) {
  try {
    const n = new DOMParser().parseFromString(e, "image/svg+xml");
    if (n.querySelector("parsererror")) return "";
    const r = (i) => {
      var o;
      if (i.tagName.toLowerCase() === "script") {
        (o = i.parentNode) == null || o.removeChild(i);
        return;
      }
      for (const s of Array.from(i.attributes))
        (s.name.startsWith("on") || s.value.toLowerCase().includes("javascript:")) && i.removeAttribute(s.name);
      Array.from(i.children).forEach(r);
    };
    return r(n.documentElement), new XMLSerializer().serializeToString(n.documentElement);
  } catch {
    return "";
  }
}
function X(e) {
  if (!e) return null;
  const t = e.trim();
  return t.startsWith("<svg") && wt(t) || null;
}
function j({
  className: e,
  icon: t,
  disabled: n,
  tooltip: r,
  onClick: i,
  ariaLabel: o
}) {
  const s = n !== void 0 && n !== !1 && n !== "false" && n !== "0", l = typeof n == "string" && n !== "true" && n !== "1" ? n : r;
  return /* @__PURE__ */ d(
    "button",
    {
      className: e,
      "aria-label": o,
      "aria-disabled": s ? "true" : void 0,
      tabIndex: s ? -1 : void 0,
      "data-tooltip": s && l ? l : void 0,
      onClick: (f) => {
        if (s) {
          f.preventDefault();
          return;
        }
        i();
      },
      dangerouslySetInnerHTML: t ? { __html: t } : void 0
    }
  );
}
function bt({
  title: e = "Window",
  size: t,
  resizable: n = !0,
  movable: r = !0,
  width: i,
  height: o,
  minimizeIcon: s,
  fullscreenIcon: l,
  closeIcon: a,
  disableMinimize: f,
  disableFullscreen: m,
  disableClose: g,
  fullscreenMode: c,
  bodyOverflow: u,
  scrollContent: v,
  onMinimize: z,
  onFullscreen: b,
  onClose: p,
  children: L,
  style: E,
  className: w
}) {
  const x = $(null), N = $(null), M = $(null), _ = V(), [Y, Z] = A(!1), [S, U] = A(!1), R = $(null), G = !!(i || o), O = {
    ...i ? { "--ddw-w": i } : {},
    ...o ? { "--ddw-h": o } : {},
    ...E
  };
  P(() => {
    const y = x.current;
    if (y)
      return I.register(_, y, e ?? "Window"), () => I.unregister(_);
  }, [_, e]);
  const C = W(() => {
    I.raise(_);
  }, [_]), J = W(() => {
    var k;
    const y = (k = x.current) == null ? void 0 : k.querySelector(".dd-win");
    if (!y) return;
    const h = !Y;
    h ? (lt(y), I.minimize(_)) : (dt(y), I.restore(_)), Z(h), z == null || z(h);
  }, [Y, z, _]), K = W(() => {
    const y = x.current;
    if (!y) return;
    const h = !S;
    h ? (R.current = xt(y), y.setAttribute("data-explicit", ""), ut(y, R.current)) : R.current && ft(y, R.current);
    const k = h;
    U(k), b == null || b(k);
  }, [S, b]), Q = W(() => {
    var h;
    const y = (h = x.current) == null ? void 0 : h.querySelector(".dd-win");
    y && mt(y, () => {
      x.current && (x.current.style.display = "none"), p == null || p();
    });
  }, [p]);
  P(() => {
    const y = N.current, h = x.current;
    if (!(!y || !h || !r))
      return pt({
        handle: y,
        host: h,
        exclude: ".dd-win-controls",
        disabled: () => S && c !== "expand",
        onStart: (k) => {
          h.hasAttribute("data-explicit") || (h.style.setProperty("--ddw-w", `${k.width}px`), h.style.setProperty("--ddw-h", `${k.height}px`), h.setAttribute("data-explicit", ""));
          const H = getComputedStyle(h).position;
          (H === "static" || H === "relative") && (h.style.position = "absolute", h.style.left = `${k.left + (window.scrollX || 0)}px`, h.style.top = `${k.top + (window.scrollY || 0)}px`), C();
        }
      });
  }, [r, S, c, C]), P(() => {
    const y = M.current, h = x.current;
    if (!(!y || !h || !n))
      return ht({
        handle: y,
        host: h,
        disabled: () => S
      });
  }, [n, S]);
  const tt = X(s), et = X(l), nt = X(a);
  return /* @__PURE__ */ d(
    "div",
    {
      ref: x,
      className: ["dd-window", w].filter(Boolean).join(" "),
      "data-size": t,
      "data-explicit": G ? "" : void 0,
      style: O,
      onPointerDown: C,
      children: /* @__PURE__ */ T("div", { className: "dd-win", children: [
        /* @__PURE__ */ T(
          "div",
          {
            ref: N,
            className: ["dd-win-header", r ? "" : "dd-win-header--no-move"].filter(Boolean).join(" "),
            children: [
              /* @__PURE__ */ d("span", { className: "dd-win-title", children: e }),
              /* @__PURE__ */ T("div", { className: "dd-win-controls", children: [
                /* @__PURE__ */ d(
                  j,
                  {
                    className: "dd-btn--minimize",
                    icon: tt,
                    disabled: f,
                    onClick: J,
                    ariaLabel: "minimize"
                  }
                ),
                /* @__PURE__ */ d(
                  j,
                  {
                    className: "dd-btn--fullscreen",
                    icon: et,
                    disabled: m,
                    onClick: K,
                    ariaLabel: "fullscreen"
                  }
                ),
                /* @__PURE__ */ d(
                  j,
                  {
                    className: "dd-btn--close",
                    icon: nt,
                    disabled: g,
                    onClick: Q,
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
              ...v ? { "--dd-body-overflow": "hidden", padding: 0, display: "flex", flexDirection: "column", flex: "1 1 0", minHeight: 0 } : {}
            },
            children: v ? /* @__PURE__ */ d("div", { className: "dd-win-scroll-content", children: L }) : L
          }
        ),
        n && /* @__PURE__ */ d("div", { ref: M, className: "dd-win-resize-handle" })
      ] })
    }
  );
}
function Et({
  variant: e = "primary",
  size: t,
  disabled: n = !1,
  action: r,
  minWidth: i,
  width: o,
  height: s,
  fontSize: l,
  px: a,
  py: f,
  onClick: m,
  children: g,
  className: c,
  style: u
}) {
  const v = {
    ...i ? { "--dd-btn-min-w": i } : {},
    ...o ? { "--dd-btn-w": o } : {},
    ...s ? { "--dd-btn-h": s } : {},
    ...l ? { "--dd-btn-fs": l } : {},
    ...a ? { "--dd-btn-px": a } : {},
    ...f ? { "--dd-btn-py": f } : {},
    ...u
  }, z = [
    "btn",
    `btn--${e}`,
    n ? "btn--disable" : "",
    t ? `btn--size-${t}` : "",
    c
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ d(
    "button",
    {
      className: z,
      style: v,
      disabled: n,
      "aria-disabled": n ? "true" : void 0,
      tabIndex: n ? -1 : void 0,
      "data-action": r,
      "aria-label": r,
      onClick: n ? void 0 : m,
      children: g
    }
  );
}
function kt({ type: e = "notification", message: t, onClose: n }) {
  const [r, i] = A(!0), o = $(t);
  if (P(() => {
    t !== o.current && (o.current = t, i(!0));
  }, [t]), !r) return null;
  const s = () => {
    i(!1), n == null || n();
  };
  return /* @__PURE__ */ T("div", { className: `toast toast-${e}`, children: [
    /* @__PURE__ */ d("button", { className: "toast-btn--close", onClick: s, "aria-label": "close", children: "×" }),
    t
  ] });
}
function Nt({
  type: e = "text",
  label: t,
  layout: n = "block",
  id: r,
  value: i,
  defaultValue: o,
  placeholder: s,
  disabled: l,
  onChange: a,
  className: f,
  style: m
}) {
  const g = V(), c = r ?? g, u = n === "inline" ? { display: "flex", alignItems: "center", gap: "0.5rem" } : {};
  return /* @__PURE__ */ T("div", { className: ["input-grid", f].filter(Boolean).join(" "), style: { ...u, ...m }, children: [
    t && /* @__PURE__ */ d("label", { className: "input-label", htmlFor: c, children: t }),
    /* @__PURE__ */ d(
      "input",
      {
        type: e,
        id: c,
        className: "dreamdesk-input",
        ...i !== void 0 ? { value: i, onChange: a ? (v) => a(v.target.value, v) : void 0 } : { defaultValue: o, onChange: a ? (v) => a(v.target.value, v) : void 0 },
        placeholder: s,
        disabled: l
      }
    )
  ] });
}
function Mt({
  value: e = 0,
  blocky: t = !1,
  gradient: n = !1,
  className: r,
  style: i
}) {
  const o = $(null), s = $(null);
  P(() => {
    var f;
    const a = o.current;
    if (a)
      return (f = s.current) == null || f.destroy(), s.current = vt({
        track: a,
        getValue: () => e,
        isBlocky: () => t,
        isGradient: () => n
      }), s.current.rebuild(), () => {
        var m;
        (m = s.current) == null || m.destroy(), s.current = null;
      };
  }, [t, n]), P(() => {
    var a;
    (a = s.current) == null || a.update(e);
  }, [e]);
  const l = [
    "progress-track",
    t ? "progress-track--blocky" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ d("div", { ref: o, className: l, style: i, children: !t && /* @__PURE__ */ d("div", { className: ["progress-bar", n ? "progress-bar--gradient" : ""].filter(Boolean).join(" ") }) });
}
function D({ children: e, index: t = 0, active: n = !1, onClick: r }) {
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
function F({ children: e, active: t = !1, style: n }) {
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
function $t({
  defaultIndex: e = 0,
  activeIndex: t,
  onChange: n,
  children: r,
  className: i,
  style: o
}) {
  const [s, l] = A(e), a = t ?? s, f = (c) => {
    t === void 0 && l(c), n == null || n(c);
  }, m = [], g = [];
  return it.forEach(r, (c) => {
    if (ot(c)) {
      if (c.type === D) {
        const u = m.length;
        m.push(
          /* @__PURE__ */ d(D, { index: u, active: u === a, onClick: f, children: c.props.children }, u)
        );
      } else if (c.type === F) {
        const u = g.length;
        g.push(
          /* @__PURE__ */ d(F, { active: u === a, style: c.props.style, children: c.props.children }, u)
        );
      }
    }
  }), /* @__PURE__ */ T("div", { className: ["tabs", i].filter(Boolean).join(" "), style: o, children: [
    /* @__PURE__ */ d("div", { className: "tab-list", children: m }),
    /* @__PURE__ */ d("div", { className: "tab-panels", children: g })
  ] });
}
function Tt({ checked: e, defaultChecked: t, onChange: n, style: r, className: i }) {
  const { theme: o } = ct(), s = e !== void 0, l = t ?? o === "dark";
  return /* @__PURE__ */ T("label", { className: ["toggle", i].filter(Boolean).join(" "), style: r, children: [
    /* @__PURE__ */ d(
      "input",
      {
        type: "checkbox",
        checked: s ? e : void 0,
        defaultChecked: s ? void 0 : l,
        onChange: (a) => n == null ? void 0 : n(a.target.checked)
      }
    ),
    /* @__PURE__ */ d("span", { className: "slider", children: /* @__PURE__ */ d("span", { className: "knob" }) })
  ] });
}
function Pt({ children: e, className: t, ...n }) {
  return /* @__PURE__ */ d(
    bt,
    {
      ...n,
      className: ["terminal-window", t].filter(Boolean).join(" "),
      children: /* @__PURE__ */ d("div", { className: "terminal-win-body", children: e })
    }
  );
}
export {
  Et as Button,
  Nt as Input,
  Mt as ProgressBar,
  D as Tab,
  F as TabPanel,
  $t as Tabs,
  Pt as TerminalWindow,
  zt as ThemeProvider,
  kt as Toast,
  Tt as Toggle,
  bt as Window,
  ct as useTheme
};
