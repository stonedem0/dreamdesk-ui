import { jsx as s, jsxs as I } from "react/jsx-runtime";
import { createContext as vt, useState as P, useEffect as U, useCallback as D, useContext as bt, useRef as X, useId as yt, Children as wt, isValidElement as kt } from "react";
const at = vt(null);
function Wt({ children: t, defaultTheme: e = "pastelcore" }) {
  const [n, o] = P(e);
  U(() => {
    document.documentElement.setAttribute("data-theme", n);
  }, [n]);
  const l = D((i) => {
    o(i);
  }, []);
  return /* @__PURE__ */ s(at.Provider, { value: { theme: n, setTheme: l }, children: t });
}
const $t = {
  theme: "pastelcore",
  setTheme: () => {
  }
};
function Et() {
  return bt(at) ?? $t;
}
function tt(t) {
  var n;
  const e = ((n = t == null ? void 0 : t.getAnimations) == null ? void 0 : n.call(t)) ?? [];
  for (const o of e) o.cancel();
}
function It(t) {
  t.style.transformOrigin = "50% 100%", t.animate(
    [{ transform: "scale(1)", offset: 0 }, { transform: "scale(0)", offset: 1 }],
    { duration: 600, easing: "ease-in-out", fill: "forwards" }
  );
}
function Mt(t, e) {
  const n = t.animate(
    [
      {
        position: "fixed",
        top: `${Math.round(e.top)}px`,
        left: `${Math.round(e.left)}px`,
        width: `${Math.round(e.width)}px`,
        height: `${Math.round(e.height)}px`,
        offset: 0,
        zIndex: "9999"
      },
      { position: "fixed", top: "0px", left: "0px", width: "100vw", height: "100vh", offset: 1, zIndex: "9999" }
    ],
    { duration: 400, easing: "ease-in-out", fill: "forwards" }
  );
  n.onfinish = () => {
    t.style.position = "fixed", t.style.top = "0px", t.style.left = "0px", t.style.width = "100vw", t.style.height = "100vh", t.style.zIndex = "9999";
  };
}
function Nt(t, e) {
  tt(t);
  const n = t.animate(
    [
      { position: "fixed", top: "0px", left: "0px", width: "100vw", height: "100vh", offset: 0 },
      {
        position: e.position,
        top: `${Math.round(e.top)}px`,
        left: `${Math.round(e.left)}px`,
        width: `${Math.round(e.width)}px`,
        height: `${Math.round(e.height)}px`,
        offset: 1
      }
    ],
    { duration: 400, easing: "ease-in-out", fill: "forwards" }
  );
  n.onfinish = () => {
    t.style.position = e.position || "absolute", t.style.top = `${Math.round(e.top)}px`, t.style.left = `${Math.round(e.left)}px`, t.style.width = `${Math.round(e.width)}px`, t.style.height = `${Math.round(e.height)}px`, e.zIndex ? t.style.zIndex = e.zIndex : t.style.removeProperty("z-index"), tt(t);
  };
}
function Lt(t, e) {
  t.animate(
    [
      { opacity: 1, transform: "scale(1)" },
      { opacity: 0, transform: "scale(0.95)" }
    ],
    { duration: 300, easing: "ease", fill: "forwards" }
  ).onfinish = e;
}
let ot = 1e3;
function Rt(t) {
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
function Q(t) {
  if (!t) return null;
  const e = t.trim();
  return e.startsWith("<svg") ? e : null;
}
function Z({
  className: t,
  icon: e,
  disabled: n,
  tooltip: o,
  onClick: l,
  ariaLabel: i
}) {
  const a = n !== void 0 && n !== !1 && n !== "false" && n !== "0", u = typeof n == "string" && n !== "true" && n !== "1" ? n : o;
  return /* @__PURE__ */ s(
    "button",
    {
      className: t,
      "aria-label": i,
      "aria-disabled": a ? "true" : void 0,
      tabIndex: a ? -1 : void 0,
      "data-tooltip": a && u ? u : void 0,
      onClick: (g) => {
        if (a) {
          g.preventDefault();
          return;
        }
        l();
      },
      dangerouslySetInnerHTML: e ? { __html: e } : void 0
    }
  );
}
function Tt({
  title: t = "Window",
  size: e,
  resizable: n = !0,
  movable: o = !0,
  width: l,
  height: i,
  minimizeIcon: a,
  fullscreenIcon: u,
  closeIcon: h,
  disableMinimize: g,
  disableFullscreen: y,
  disableClose: w,
  fullscreenMode: c,
  bodyOverflow: d,
  scrollContent: v,
  onMinimize: f,
  onFullscreen: M,
  onClose: N,
  children: Y,
  style: J,
  className: F
}) {
  const x = X(null), H = X(null), et = X(null), [nt, ct] = P(!1), [L, lt] = P(!1), _ = X(null), dt = !!(l || i), ut = {
    ...l ? { "--ddw-w": l } : {},
    ...i ? { "--ddw-h": i } : {},
    ...J
  }, K = D(() => {
    ot += 1, x.current && (x.current.style.zIndex = String(ot));
  }, []), ft = D(() => {
    var b;
    const p = (b = x.current) == null ? void 0 : b.querySelector(".dd-win");
    if (!p) return;
    const r = !nt;
    It(p), ct(r), f == null || f(r);
  }, [nt, f]), pt = D(() => {
    const p = x.current;
    if (!p) return;
    const r = !L;
    r ? (_.current = Rt(p), Mt(p, _.current)) : _.current && Nt(p, _.current);
    const b = r;
    lt(b), M == null || M(b);
  }, [L, M]), ht = D(() => {
    var r;
    const p = (r = x.current) == null ? void 0 : r.querySelector(".dd-win");
    p && Lt(p, () => {
      x.current && (x.current.style.display = "none"), N == null || N();
    });
  }, [N]);
  U(() => {
    const p = H.current, r = x.current;
    if (!p || !r || !o) return;
    let b = !1, R = !1, W = 0, C = 0, S = 0, V = 0, A = null;
    const T = 4, $ = (m) => {
      if (!b) return;
      if (!R) {
        const j = m.clientX - W, O = m.clientY - C;
        if (j * j + O * O < T * T) return;
        const z = r.getBoundingClientRect();
        r.style.setProperty("--ddw-w", `${z.width}px`), r.style.setProperty("--ddw-h", `${z.height}px`), r.setAttribute("data-explicit", ""), getComputedStyle(r).position === "static" && (r.style.position = "absolute"), r.style.left = `${z.left}px`, r.style.top = `${z.top}px`, R = !0;
      }
      const G = m.clientX - S, q = m.clientY - V;
      A && cancelAnimationFrame(A), A = requestAnimationFrame(() => {
        const j = r.getBoundingClientRect(), O = Math.max(0, window.innerWidth - j.width), z = Math.max(0, window.innerHeight - j.height);
        r.style.left = `${Math.max(0, Math.min(G, O))}px`, r.style.top = `${Math.max(0, Math.min(q, z))}px`;
      });
    }, B = () => {
      b = !1, R = !1, document.removeEventListener("pointermove", $, { capture: !0 }), document.removeEventListener("pointerup", B, { capture: !0 });
    }, k = (m) => {
      if (m.target.closest(".dd-win-controls") || L && !(c === "expand")) return;
      tt(r);
      const q = r.getBoundingClientRect();
      W = m.clientX, C = m.clientY, S = m.clientX - q.left, V = m.clientY - q.top, b = !0, K(), document.addEventListener("pointermove", $, { capture: !0 }), document.addEventListener("pointerup", B, { capture: !0 });
    };
    return p.addEventListener("pointerdown", k), () => {
      p.removeEventListener("pointerdown", k), document.removeEventListener("pointermove", $, { capture: !0 }), document.removeEventListener("pointerup", B, { capture: !0 });
    };
  }, [o, L, c, K]), U(() => {
    const p = et.current, r = x.current;
    if (!p || !r || !n) return;
    let b = !1, R = 0, W = 0, C = 0, S = 0;
    const V = 180, A = 120, T = (k) => {
      if (!b) return;
      const m = Math.max(V, C + (k.clientX - R)), G = Math.max(A, S + (k.clientY - W));
      r.style.setProperty("--ddw-w", `${m}px`), r.style.setProperty("--ddw-h", `${G}px`), r.setAttribute("data-explicit", "");
    }, $ = () => {
      b = !1, document.removeEventListener("pointermove", T, { capture: !0 }), document.removeEventListener("pointerup", $, { capture: !0 });
    }, B = (k) => {
      if (L) return;
      b = !0, R = k.clientX, W = k.clientY;
      const m = r.getBoundingClientRect();
      C = m.width, S = m.height, document.addEventListener("pointermove", T, { capture: !0 }), document.addEventListener("pointerup", $, { capture: !0 });
    };
    return p.addEventListener("pointerdown", B), () => {
      p.removeEventListener("pointerdown", B), document.removeEventListener("pointermove", T, { capture: !0 }), document.removeEventListener("pointerup", $, { capture: !0 });
    };
  }, [n, L]);
  const mt = Q(a), gt = Q(u), xt = Q(h);
  return /* @__PURE__ */ s(
    "div",
    {
      ref: x,
      className: ["dd-window", F].filter(Boolean).join(" "),
      "data-size": e,
      "data-explicit": dt ? "" : void 0,
      style: ut,
      onPointerDown: K,
      children: /* @__PURE__ */ I("div", { className: "dd-win", children: [
        /* @__PURE__ */ I(
          "div",
          {
            ref: H,
            className: ["dd-win-header", o ? "" : "dd-win-header--no-move"].filter(Boolean).join(" "),
            children: [
              /* @__PURE__ */ s("span", { className: "dd-win-title", children: t }),
              /* @__PURE__ */ I("div", { className: "dd-win-controls", children: [
                /* @__PURE__ */ s(
                  Z,
                  {
                    className: "dd-btn--minimize",
                    icon: mt,
                    disabled: g,
                    onClick: ft,
                    ariaLabel: "minimize"
                  }
                ),
                /* @__PURE__ */ s(
                  Z,
                  {
                    className: "dd-btn--fullscreen",
                    icon: gt,
                    disabled: y,
                    onClick: pt,
                    ariaLabel: "fullscreen"
                  }
                ),
                /* @__PURE__ */ s(
                  Z,
                  {
                    className: "dd-btn--close",
                    icon: xt,
                    disabled: w,
                    onClick: ht,
                    ariaLabel: "close"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ s(
          "div",
          {
            className: "dd-win-body",
            style: {
              ...d ? { "--dd-body-overflow": d } : {},
              ...v ? { "--dd-body-overflow": "hidden", padding: 0, display: "flex", flexDirection: "column", flex: "1 1 0", minHeight: 0 } : {}
            },
            children: v ? /* @__PURE__ */ s("div", { className: "dd-win-scroll-content", children: Y }) : Y
          }
        ),
        n && /* @__PURE__ */ s("div", { ref: et, className: "dd-win-resize-handle" })
      ] })
    }
  );
}
function Ct({
  variant: t = "primary",
  size: e,
  disabled: n = !1,
  action: o,
  minWidth: l,
  width: i,
  height: a,
  fontSize: u,
  px: h,
  py: g,
  onClick: y,
  children: w,
  className: c,
  style: d
}) {
  const v = {
    ...l ? { "--dd-btn-min-w": l } : {},
    ...i ? { "--dd-btn-w": i } : {},
    ...a ? { "--dd-btn-h": a } : {},
    ...u ? { "--dd-btn-fs": u } : {},
    ...h ? { "--dd-btn-px": h } : {},
    ...g ? { "--dd-btn-py": g } : {},
    ...d
  }, f = [
    "btn",
    `btn--${t}`,
    n ? "btn--disable" : "",
    e ? `btn--size-${e}` : "",
    c
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ s(
    "button",
    {
      className: f,
      style: v,
      disabled: n,
      "aria-disabled": n ? "true" : void 0,
      tabIndex: n ? -1 : void 0,
      "data-action": o,
      "aria-label": o,
      onClick: n ? void 0 : y,
      children: w
    }
  );
}
function St({ type: t = "notification", message: e, onClose: n }) {
  const [o, l] = P(!0);
  if (!o) return null;
  const i = () => {
    l(!1), n == null || n();
  };
  return /* @__PURE__ */ I("div", { className: `toast toast-${t}`, children: [
    /* @__PURE__ */ s("span", { className: "toast-btn--close", onClick: i, role: "button", "aria-label": "close", children: "×" }),
    e
  ] });
}
function At({
  type: t = "text",
  label: e,
  layout: n = "block",
  id: o,
  value: l,
  defaultValue: i,
  placeholder: a,
  disabled: u,
  onChange: h,
  className: g,
  style: y
}) {
  const w = yt(), c = o ?? w, d = n === "inline" ? { display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "center", gap: "0.5rem" } : {};
  return /* @__PURE__ */ I("div", { className: ["input-grid", g].filter(Boolean).join(" "), style: { ...d, ...y }, children: [
    e && /* @__PURE__ */ s("label", { className: "input-label", htmlFor: c, children: e }),
    /* @__PURE__ */ s(
      "input",
      {
        type: t,
        id: c,
        className: "dreamdesk-input",
        value: l,
        defaultValue: i,
        placeholder: a,
        disabled: u,
        onChange: h ? (v) => h(v.target.value, v) : void 0
      }
    )
  ] });
}
const rt = 10, E = 1;
function Bt(t, e, n, o) {
  const [l, i] = P({ count: 0, segW: rt });
  U(() => {
    if (!o) return;
    const c = t.current;
    if (!c) return;
    const d = () => {
      const f = getComputedStyle(c), M = parseFloat(f.paddingLeft) || 0, N = parseFloat(f.paddingRight) || 0, Y = parseFloat(f.borderLeftWidth) || 0, J = parseFloat(f.borderRightWidth) || 0, F = c.getBoundingClientRect().width - M - N - Y - J, x = Math.max(1, Math.round((F + E) / (rt + E))), H = (F - (x - 1) * E) / x;
      i({ count: x, segW: H });
    }, v = new ResizeObserver(d);
    return v.observe(c), d(), () => v.disconnect();
  }, [o, t]);
  const { count: a, segW: u } = l, h = Math.min(Math.max(e, 0), 100), g = Math.floor(h / 100 * a), y = a * (u + E) - E;
  return Array.from({ length: a }, (c, d) => {
    const v = d < g, f = {
      width: `${u}px`,
      height: "100%",
      marginRight: d < a - 1 ? `${E}px` : "0",
      opacity: v ? 1 : 0.2,
      flexShrink: 0,
      boxSizing: "border-box",
      transition: "opacity 0.3s ease, background 0.3s ease",
      border: "var(--color-window-border, var(--border))",
      boxShadow: "var(--progress-segment-shadow, none)"
    };
    return n ? (f.backgroundImage = "var(--color-progress-gradient, none)", f.backgroundSize = `${y}px 100%`, f.backgroundPosition = `-${d * (u + E)}px 0`, f.backgroundRepeat = "no-repeat", f.backgroundColor = "transparent") : (f.backgroundImage = "none", f.backgroundColor = v ? "var(--color-progress-segment, #a8edea)" : "transparent"), /* @__PURE__ */ s("div", { style: f }, d);
  });
}
function jt({
  value: t = 0,
  blocky: e = !1,
  gradient: n = !1,
  className: o,
  style: l
}) {
  const i = X(null), a = Bt(i, t, n, e), u = Math.min(Math.max(t, 0), 100), h = [
    "progress-track",
    e ? "progress-track--blocky" : "",
    o
  ].filter(Boolean).join(" "), g = {
    width: `${u}%`,
    ...t >= 100 ? { borderRight: "none" } : {},
    ...n ? {} : { filter: `hue-rotate(${u * 3.6}deg)` }
  };
  return /* @__PURE__ */ s("div", { ref: i, className: h, style: l, children: e ? a : /* @__PURE__ */ s(
    "div",
    {
      className: ["progress-bar", n ? "progress-bar--gradient" : ""].filter(Boolean).join(" "),
      style: g
    }
  ) });
}
function st({ children: t, index: e = 0, active: n = !1, onClick: o }) {
  return /* @__PURE__ */ s(
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
function it({ children: t, active: e = !1, style: n }) {
  return /* @__PURE__ */ s(
    "dreamdesk-tab-panel",
    {
      class: e ? "active" : void 0,
      "data-panel": "",
      style: { display: e ? "block" : "none", ...n },
      children: t
    }
  );
}
function Dt({
  defaultIndex: t = 0,
  activeIndex: e,
  onChange: n,
  children: o,
  className: l,
  style: i
}) {
  const [a, u] = P(t), h = e ?? a, g = (c) => {
    e === void 0 && u(c), n == null || n(c);
  }, y = [], w = [];
  return wt.forEach(o, (c) => {
    if (kt(c)) {
      if (c.type === st) {
        const d = y.length;
        y.push(
          /* @__PURE__ */ s(st, { index: d, active: d === h, onClick: g, children: c.props.children }, d)
        );
      } else if (c.type === it) {
        const d = w.length;
        w.push(
          /* @__PURE__ */ s(it, { active: d === h, style: c.props.style, children: c.props.children }, d)
        );
      }
    }
  }), /* @__PURE__ */ I("div", { className: ["tabs", l].filter(Boolean).join(" "), style: i, children: [
    /* @__PURE__ */ s("div", { className: "tab-list", children: y }),
    /* @__PURE__ */ s("div", { className: "tab-panels", children: w })
  ] });
}
function Xt({ checked: t, defaultChecked: e, onChange: n, style: o, className: l }) {
  const { theme: i } = Et(), a = t !== void 0, u = e ?? i === "dark";
  return /* @__PURE__ */ I("label", { className: ["toggle", l].filter(Boolean).join(" "), style: o, children: [
    /* @__PURE__ */ s(
      "input",
      {
        type: "checkbox",
        checked: a ? t : void 0,
        defaultChecked: a ? void 0 : u,
        onChange: (h) => n == null ? void 0 : n(h.target.checked)
      }
    ),
    /* @__PURE__ */ s("span", { className: "slider", children: /* @__PURE__ */ s("span", { className: "knob" }) })
  ] });
}
function Yt({ children: t, className: e, ...n }) {
  return /* @__PURE__ */ s(
    Tt,
    {
      ...n,
      className: ["terminal-window", e].filter(Boolean).join(" "),
      children: /* @__PURE__ */ s("div", { className: "terminal-win-body", children: t })
    }
  );
}
export {
  Ct as Button,
  At as Input,
  jt as ProgressBar,
  st as Tab,
  it as TabPanel,
  Dt as Tabs,
  Yt as TerminalWindow,
  Wt as ThemeProvider,
  St as Toast,
  Xt as Toggle,
  Tt as Window,
  Et as useTheme
};
