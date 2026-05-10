import { jsx as f, jsxs as L } from "react/jsx-runtime";
import { createContext as ot, useState as I, useEffect as M, useCallback as W, useContext as it, useRef as $, useId as Z, Children as at, isValidElement as ct } from "react";
const q = ot(null);
function Lt({ children: n, defaultTheme: t = "pastelcore" }) {
  const [e, r] = I(t);
  M(() => {
    document.documentElement.setAttribute("data-theme", e);
  }, [e]);
  const s = W((i) => {
    r(i);
  }, []);
  return /* @__PURE__ */ f(q.Provider, { value: { theme: e, setTheme: s }, children: n });
}
const lt = {
  theme: "pastelcore",
  setTheme: () => {
  }
};
function dt() {
  return it(q) ?? lt;
}
function P(n) {
  var e;
  const t = ((e = n == null ? void 0 : n.getAnimations) == null ? void 0 : e.call(n)) ?? [];
  for (const r of t) r.cancel();
}
function ut(n) {
  P(n), n.style.transformOrigin = "50% 100%", n.animate(
    [{ transform: "scale(1)" }, { transform: "scale(0)" }],
    { duration: 300, easing: "ease-in", fill: "forwards" }
  );
}
function ft(n) {
  P(n), n.style.transformOrigin = "50% 100%", n.animate(
    [{ transform: "scale(0)" }, { transform: "scale(1)" }],
    { duration: 300, easing: "ease-out" }
  );
}
function mt(n, t) {
  P(n);
  const e = window.innerWidth, r = window.innerHeight, s = t.top - (window.scrollY || 0), i = t.left - (window.scrollX || 0), o = t.width, c = t.height;
  n.style.position = "fixed", n.style.top = "0", n.style.left = "0", n.style.width = "100vw", n.style.height = "100vh", n.style.setProperty("--ddw-w", "100vw"), n.style.setProperty("--ddw-h", "100vh"), n.style.zIndex = "9999";
  const d = o / e, m = c / r, g = i + o / 2 - e / 2, v = s + c / 2 - r / 2;
  n.animate(
    [
      { transform: `translate(${g}px, ${v}px) scale(${d}, ${m})` },
      { transform: "none" }
    ],
    { duration: 500, easing: "cubic-bezier(0.2, 0, 0, 1)" }
  );
}
function pt(n, t) {
  P(n);
  const e = window.innerWidth, r = window.innerHeight, s = t.width, i = t.height, o = t.top - (window.scrollY || 0), c = t.left - (window.scrollX || 0), d = s / e, m = i / r, g = c + s / 2 - e / 2, v = o + i / 2 - r / 2, a = n.animate(
    [
      { transform: "none" },
      { transform: `translate(${g}px, ${v}px) scale(${d}, ${m})` }
    ],
    { duration: 300, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" }
  ), l = () => {
    n.style.position = t.position || "absolute", n.style.top = `${Math.round(t.top)}px`, n.style.left = `${Math.round(t.left)}px`, n.style.width = "", n.style.height = "", n.style.setProperty("--ddw-w", `${Math.round(s)}px`), n.style.setProperty("--ddw-h", `${Math.round(i)}px`), t.zIndex ? n.style.zIndex = t.zIndex : n.style.removeProperty("z-index");
  };
  a.onfinish = () => {
    l(), n.getAnimations().forEach((u) => u.cancel());
  }, a.oncancel = l;
}
function ht(n, t) {
  n.animate(
    [{ opacity: "1", transform: "scale(1)" }, { opacity: "0", transform: "scale(0.95)" }],
    { duration: 300, easing: "ease", fill: "forwards" }
  ).onfinish = () => t == null ? void 0 : t();
}
function gt({ handle: n, host: t, signal: e, disabled: r, exclude: s, getBounds: i, onStart: o }) {
  let c = !1, d = 0, m = 0, g = 0, v = 0, a = null;
  const l = (x) => {
    if (!c) return;
    const b = x.clientX - d, _ = x.clientY - m;
    a && cancelAnimationFrame(a), a = requestAnimationFrame(() => {
      t.style.left = `${Math.max(0, Math.min(b, g))}px`, t.style.top = `${Math.max(0, Math.min(_, v))}px`;
    });
  }, u = () => {
    c = !1, document.removeEventListener("pointermove", l, { capture: !0 }), document.removeEventListener("pointerup", u, { capture: !0 }), a && (cancelAnimationFrame(a), a = null);
  }, p = (x) => {
    if (r != null && r() || x.target.closest(s)) return;
    P(t);
    const b = t.getBoundingClientRect();
    d = x.clientX - b.left, m = x.clientY - b.top;
    const _ = (i == null ? void 0 : i()) ?? {
      maxLeft: Math.max(0, window.innerWidth - b.width),
      maxTop: Math.max(0, window.innerHeight - b.height)
    };
    g = _.maxLeft, v = _.maxTop, o == null || o(b), c = !0, document.addEventListener("pointermove", l, { capture: !0 }), document.addEventListener("pointerup", u, { capture: !0 });
  }, w = e ? { signal: e } : {};
  return n.addEventListener("pointerdown", p, w), () => {
    n.removeEventListener("pointerdown", p), document.removeEventListener("pointermove", l, { capture: !0 }), document.removeEventListener("pointerup", u, { capture: !0 }), a && cancelAnimationFrame(a);
  };
}
function yt({ handle: n, host: t, signal: e, disabled: r, minWidth: s = 180, minHeight: i = 120, explicitAttr: o = "data-explicit" }) {
  let c = !1, d = 0, m = 0, g = 0, v = 0;
  const a = (w) => {
    c && (t.style.setProperty("--ddw-w", `${Math.max(s, g + w.clientX - d)}px`), t.style.setProperty("--ddw-h", `${Math.max(i, v + w.clientY - m)}px`), t.setAttribute(o, ""));
  }, l = () => {
    c = !1, document.removeEventListener("pointermove", a, { capture: !0 }), document.removeEventListener("pointerup", l, { capture: !0 });
  }, u = (w) => {
    if (r != null && r()) return;
    c = !0, d = w.clientX, m = w.clientY;
    const x = t.getBoundingClientRect();
    g = x.width, v = x.height, document.addEventListener("pointermove", a, { capture: !0 }), document.addEventListener("pointerup", l, { capture: !0 });
  }, p = e ? { signal: e } : {};
  return n.addEventListener("pointerdown", u, p), () => {
    n.removeEventListener("pointerdown", u), document.removeEventListener("pointermove", a, { capture: !0 }), document.removeEventListener("pointerup", l, { capture: !0 });
  };
}
const vt = 1e3;
class wt {
  constructor() {
    this._registry = /* @__PURE__ */ new Map(), this._zStack = [], this._listeners = /* @__PURE__ */ new Set();
  }
  _notify() {
    this._listeners.forEach((t) => t());
  }
  _reassignZ() {
    this._zStack.forEach((t, e) => {
      const r = this._registry.get(t);
      r && (r.el.style.zIndex = String(vt + e));
    });
  }
  register(t, e, r) {
    this._registry.set(t, { id: t, title: r, el: e, isMinimized: !1 }), this._zStack.includes(t) || this._zStack.push(t), this._reassignZ(), this._notify();
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
const X = new wt();
function xt(n) {
  const t = n.getBoundingClientRect(), e = getComputedStyle(n);
  return {
    top: t.top + (window.scrollY || 0),
    left: t.left + (window.scrollX || 0),
    width: t.width,
    height: t.height,
    position: e.position || "relative",
    zIndex: e.zIndex === "auto" ? "" : e.zIndex
  };
}
function bt(n) {
  try {
    const e = new DOMParser().parseFromString(n, "image/svg+xml");
    if (e.querySelector("parsererror")) return "";
    const r = (s) => {
      var i;
      if (s.tagName.toLowerCase() === "script") {
        (i = s.parentNode) == null || i.removeChild(s);
        return;
      }
      for (const o of Array.from(s.attributes))
        (o.name.startsWith("on") || o.value.toLowerCase().includes("javascript:")) && s.removeAttribute(o.name);
      Array.from(s.children).forEach(r);
    };
    return r(e.documentElement), new XMLSerializer().serializeToString(e.documentElement);
  } catch {
    return "";
  }
}
function j(n) {
  if (!n) return null;
  const t = n.trim();
  return t.startsWith("<svg") && bt(t) || null;
}
function Y({
  className: n,
  icon: t,
  disabled: e,
  tooltip: r,
  onClick: s,
  ariaLabel: i
}) {
  const o = e !== void 0 && e !== !1 && e !== "false" && e !== "0", c = typeof e == "string" && e !== "true" && e !== "1" ? e : r;
  return /* @__PURE__ */ f(
    "button",
    {
      className: n,
      "aria-label": i,
      "aria-disabled": o ? "true" : void 0,
      tabIndex: o ? -1 : void 0,
      "data-tooltip": o && c ? c : void 0,
      onClick: (m) => {
        if (o) {
          m.preventDefault();
          return;
        }
        s();
      },
      dangerouslySetInnerHTML: t ? { __html: t } : void 0
    }
  );
}
function kt({
  title: n = "Window",
  size: t,
  resizable: e = !0,
  movable: r = !0,
  width: s,
  height: i,
  minimizeIcon: o,
  fullscreenIcon: c,
  closeIcon: d,
  disableMinimize: m,
  disableFullscreen: g,
  disableClose: v,
  fullscreenMode: a,
  bodyOverflow: l,
  scrollContent: u,
  onMinimize: p,
  onFullscreen: w,
  onClose: x,
  children: b,
  style: _,
  className: B
}) {
  const k = $(null), N = $(null), A = $(null), S = Z(), [F, G] = I(!1), [T, U] = I(!1), R = $(null), J = !!(s || i), K = {
    ...s ? { "--ddw-w": s } : {},
    ...i ? { "--ddw-h": i } : {},
    ..._
  };
  M(() => {
    const y = k.current;
    if (y)
      return X.register(S, y, n ?? "Window"), () => X.unregister(S);
  }, [S, n]);
  const C = W(() => {
    X.raise(S);
  }, [S]), Q = W(() => {
    var z;
    const y = (z = k.current) == null ? void 0 : z.querySelector(".dd-win");
    if (!y) return;
    const h = !F;
    h ? ut(y) : ft(y), G(h), p == null || p(h);
  }, [F, p]), tt = W(() => {
    const y = k.current;
    if (!y) return;
    const h = !T;
    h ? (R.current = xt(y), y.setAttribute("data-explicit", ""), mt(y, R.current)) : R.current && pt(y, R.current);
    const z = h;
    U(z), w == null || w(z);
  }, [T, w]), et = W(() => {
    var h;
    const y = (h = k.current) == null ? void 0 : h.querySelector(".dd-win");
    y && ht(y, () => {
      k.current && (k.current.style.display = "none"), x == null || x();
    });
  }, [x]);
  M(() => {
    const y = N.current, h = k.current;
    if (!(!y || !h || !r))
      return gt({
        handle: y,
        host: h,
        exclude: ".dd-win-controls",
        disabled: () => T && a !== "expand",
        onStart: (z) => {
          h.hasAttribute("data-explicit") || (h.style.setProperty("--ddw-w", `${z.width}px`), h.style.setProperty("--ddw-h", `${z.height}px`), h.setAttribute("data-explicit", ""));
          const H = getComputedStyle(h).position;
          (H === "static" || H === "relative") && (h.style.position = "absolute", h.style.left = `${z.left + (window.scrollX || 0)}px`, h.style.top = `${z.top + (window.scrollY || 0)}px`), C();
        }
      });
  }, [r, T, a, C]), M(() => {
    const y = A.current, h = k.current;
    if (!(!y || !h || !e))
      return yt({
        handle: y,
        host: h,
        disabled: () => T
      });
  }, [e, T]);
  const nt = j(o), rt = j(c), st = j(d);
  return /* @__PURE__ */ f(
    "div",
    {
      ref: k,
      className: ["dd-window", B].filter(Boolean).join(" "),
      "data-size": t,
      "data-explicit": J ? "" : void 0,
      style: K,
      onPointerDown: C,
      children: /* @__PURE__ */ L("div", { className: "dd-win", children: [
        /* @__PURE__ */ L(
          "div",
          {
            ref: N,
            className: ["dd-win-header", r ? "" : "dd-win-header--no-move"].filter(Boolean).join(" "),
            children: [
              /* @__PURE__ */ f("span", { className: "dd-win-title", children: n }),
              /* @__PURE__ */ L("div", { className: "dd-win-controls", children: [
                /* @__PURE__ */ f(
                  Y,
                  {
                    className: "dd-btn--minimize",
                    icon: nt,
                    disabled: m,
                    onClick: Q,
                    ariaLabel: "minimize"
                  }
                ),
                /* @__PURE__ */ f(
                  Y,
                  {
                    className: "dd-btn--fullscreen",
                    icon: rt,
                    disabled: g,
                    onClick: tt,
                    ariaLabel: "fullscreen"
                  }
                ),
                /* @__PURE__ */ f(
                  Y,
                  {
                    className: "dd-btn--close",
                    icon: st,
                    disabled: v,
                    onClick: et,
                    ariaLabel: "close"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ f(
          "div",
          {
            className: "dd-win-body",
            style: {
              ...l ? { "--dd-body-overflow": l } : {},
              ...u ? { "--dd-body-overflow": "hidden", padding: 0, display: "flex", flexDirection: "column", flex: "1 1 0", minHeight: 0 } : {}
            },
            children: u ? /* @__PURE__ */ f("div", { className: "dd-win-scroll-content", children: b }) : b
          }
        ),
        e && /* @__PURE__ */ f("div", { ref: A, className: "dd-win-resize-handle" })
      ] })
    }
  );
}
function Nt({
  variant: n = "primary",
  size: t,
  disabled: e = !1,
  action: r,
  minWidth: s,
  width: i,
  height: o,
  fontSize: c,
  px: d,
  py: m,
  onClick: g,
  children: v,
  className: a,
  style: l
}) {
  const u = {
    ...s ? { "--dd-btn-min-w": s } : {},
    ...i ? { "--dd-btn-w": i } : {},
    ...o ? { "--dd-btn-h": o } : {},
    ...c ? { "--dd-btn-fs": c } : {},
    ...d ? { "--dd-btn-px": d } : {},
    ...m ? { "--dd-btn-py": m } : {},
    ...l
  }, p = [
    "btn",
    `btn--${n}`,
    e ? "btn--disable" : "",
    t ? `btn--size-${t}` : "",
    a
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f(
    "button",
    {
      className: p,
      style: u,
      disabled: e,
      "aria-disabled": e ? "true" : void 0,
      tabIndex: e ? -1 : void 0,
      "data-action": r,
      "aria-label": r,
      onClick: e ? void 0 : g,
      children: v
    }
  );
}
function Tt({ type: n = "notification", message: t, onClose: e }) {
  const [r, s] = I(!0), i = $(t);
  if (M(() => {
    t !== i.current && (i.current = t, s(!0));
  }, [t]), !r) return null;
  const o = () => {
    s(!1), e == null || e();
  };
  return /* @__PURE__ */ L("div", { className: `toast toast-${n}`, children: [
    /* @__PURE__ */ f("button", { className: "toast-btn--close", onClick: o, "aria-label": "close", children: "×" }),
    t
  ] });
}
function $t({
  type: n = "text",
  label: t,
  layout: e = "block",
  id: r,
  value: s,
  defaultValue: i,
  placeholder: o,
  disabled: c,
  onChange: d,
  className: m,
  style: g
}) {
  const v = Z(), a = r ?? v, l = e === "inline" ? { display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "center", gap: "0.5rem" } : {};
  return /* @__PURE__ */ L("div", { className: ["input-grid", m].filter(Boolean).join(" "), style: { ...l, ...g }, children: [
    t && /* @__PURE__ */ f("label", { className: "input-label", htmlFor: a, children: t }),
    /* @__PURE__ */ f(
      "input",
      {
        type: n,
        id: a,
        className: "dreamdesk-input",
        ...s !== void 0 ? { value: s, onChange: d ? (u) => d(u.target.value, u) : void 0 } : { defaultValue: i, onChange: d ? (u) => d(u.target.value, u) : void 0 },
        placeholder: o,
        disabled: c
      }
    )
  ] });
}
const D = 10, E = 1;
function zt(n, t, e, r) {
  const [s, i] = I({ count: 0, segW: D });
  M(() => {
    if (!r) return;
    const a = n.current;
    if (!a) return;
    const l = () => {
      const w = getComputedStyle(a), x = parseFloat(w.paddingLeft) || 0, b = parseFloat(w.paddingRight) || 0, _ = parseFloat(w.borderLeftWidth) || 0, B = parseFloat(w.borderRightWidth) || 0, k = a.getBoundingClientRect().width - x - b - _ - B, N = Math.max(1, Math.round((k + E) / (D + E))), A = (k - (N - 1) * E) / N;
      i({ count: N, segW: A });
    };
    let u = null;
    const p = new ResizeObserver(() => {
      u && clearTimeout(u), u = setTimeout(l, 50);
    });
    return p.observe(a), l(), () => {
      p.disconnect(), u && clearTimeout(u);
    };
  }, [r, n]);
  const { count: o, segW: c } = s, d = Math.min(Math.max(t, 0), 100), m = Math.floor(d / 100 * o), g = o * (c + E) - E;
  return Array.from({ length: o }, (a, l) => {
    const u = l < m, p = {
      width: `${c}px`,
      height: "100%",
      marginRight: l < o - 1 ? `${E}px` : "0",
      opacity: u ? 1 : 0.2,
      flexShrink: 0,
      boxSizing: "border-box",
      transition: "opacity 0.3s ease, background 0.3s ease",
      border: "var(--color-window-border, var(--border))",
      boxShadow: "var(--progress-segment-shadow, none)"
    };
    return e ? (p.backgroundImage = "var(--color-progress-gradient, none)", p.backgroundSize = `${g}px 100%`, p.backgroundPosition = `-${l * (c + E)}px 0`, p.backgroundRepeat = "no-repeat", p.backgroundColor = "transparent") : (p.backgroundImage = "none", p.backgroundColor = u ? "var(--color-progress-segment, #a8edea)" : "transparent"), /* @__PURE__ */ f("div", { style: p }, l);
  });
}
function Mt({
  value: n = 0,
  blocky: t = !1,
  gradient: e = !1,
  className: r,
  style: s
}) {
  const i = $(null), o = zt(i, n, e, t), c = Math.min(Math.max(n, 0), 100), d = [
    "progress-track",
    t ? "progress-track--blocky" : "",
    r
  ].filter(Boolean).join(" "), m = {
    width: `${c}%`,
    ...n >= 100 ? { borderRight: "none" } : {},
    ...e ? {} : { filter: `hue-rotate(${c * 3.6}deg)` }
  };
  return /* @__PURE__ */ f("div", { ref: i, className: d, style: s, children: t ? o : /* @__PURE__ */ f(
    "div",
    {
      className: ["progress-bar", e ? "progress-bar--gradient" : ""].filter(Boolean).join(" "),
      style: m
    }
  ) });
}
function V({ children: n, index: t = 0, active: e = !1, onClick: r }) {
  return /* @__PURE__ */ f(
    "dreamdesk-tab",
    {
      class: e ? "active" : void 0,
      "data-tab": "",
      "data-tab-index": String(t),
      onClick: () => r == null ? void 0 : r(t),
      children: n
    }
  );
}
function O({ children: n, active: t = !1, style: e }) {
  return /* @__PURE__ */ f(
    "dreamdesk-tab-panel",
    {
      class: t ? "active" : void 0,
      "data-panel": "",
      style: { display: t ? "block" : "none", ...e },
      children: n
    }
  );
}
function It({
  defaultIndex: n = 0,
  activeIndex: t,
  onChange: e,
  children: r,
  className: s,
  style: i
}) {
  const [o, c] = I(n), d = t ?? o, m = (a) => {
    t === void 0 && c(a), e == null || e(a);
  }, g = [], v = [];
  return at.forEach(r, (a) => {
    if (ct(a)) {
      if (a.type === V) {
        const l = g.length;
        g.push(
          /* @__PURE__ */ f(V, { index: l, active: l === d, onClick: m, children: a.props.children }, l)
        );
      } else if (a.type === O) {
        const l = v.length;
        v.push(
          /* @__PURE__ */ f(O, { active: l === d, style: a.props.style, children: a.props.children }, l)
        );
      }
    }
  }), /* @__PURE__ */ L("div", { className: ["tabs", s].filter(Boolean).join(" "), style: i, children: [
    /* @__PURE__ */ f("div", { className: "tab-list", children: g }),
    /* @__PURE__ */ f("div", { className: "tab-panels", children: v })
  ] });
}
function St({ checked: n, defaultChecked: t, onChange: e, style: r, className: s }) {
  const { theme: i } = dt(), o = n !== void 0, c = t ?? i === "dark";
  return /* @__PURE__ */ L("label", { className: ["toggle", s].filter(Boolean).join(" "), style: r, children: [
    /* @__PURE__ */ f(
      "input",
      {
        type: "checkbox",
        checked: o ? n : void 0,
        defaultChecked: o ? void 0 : c,
        onChange: (d) => e == null ? void 0 : e(d.target.checked)
      }
    ),
    /* @__PURE__ */ f("span", { className: "slider", children: /* @__PURE__ */ f("span", { className: "knob" }) })
  ] });
}
function Wt({ children: n, className: t, ...e }) {
  return /* @__PURE__ */ f(
    kt,
    {
      ...e,
      className: ["terminal-window", t].filter(Boolean).join(" "),
      children: /* @__PURE__ */ f("div", { className: "terminal-win-body", children: n })
    }
  );
}
export {
  Nt as Button,
  $t as Input,
  Mt as ProgressBar,
  V as Tab,
  O as TabPanel,
  It as Tabs,
  Wt as TerminalWindow,
  Lt as ThemeProvider,
  Tt as Toast,
  St as Toggle,
  kt as Window,
  dt as useTheme
};
