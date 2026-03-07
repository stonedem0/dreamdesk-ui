import { jsx as s, jsxs as k } from "react/jsx-runtime";
import { createContext as ht, useState as B, useCallback as C, useContext as pt, useRef as S, useEffect as F, useId as mt, Children as gt, isValidElement as vt } from "react";
const Q = ht(null);
function Lt({ children: t, defaultTheme: e = "pastelcore" }) {
  const [n, r] = B(e), i = C((a) => {
    r(a), document.documentElement.setAttribute("data-theme", a);
  }, []);
  return /* @__PURE__ */ s(Q.Provider, { value: { theme: n, setTheme: i }, children: t });
}
function xt() {
  const t = pt(Q);
  if (!t) throw new Error("useTheme must be used inside <ThemeProvider>");
  return t;
}
function H(t) {
  var n;
  const e = ((n = t == null ? void 0 : t.getAnimations) == null ? void 0 : n.call(t)) ?? [];
  for (const r of e) r.cancel();
}
function bt(t) {
  t.style.transformOrigin = "50% 100%", t.animate(
    [{ transform: "scale(1)", offset: 0 }, { transform: "scale(0)", offset: 1 }],
    { duration: 600, easing: "ease-in-out", fill: "forwards" }
  );
}
function wt(t, e) {
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
function yt(t, e) {
  H(t);
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
    t.style.position = e.position || "absolute", t.style.top = `${Math.round(e.top)}px`, t.style.left = `${Math.round(e.left)}px`, t.style.width = `${Math.round(e.width)}px`, t.style.height = `${Math.round(e.height)}px`, e.zIndex ? t.style.zIndex = e.zIndex : t.style.removeProperty("z-index"), H(t);
  };
}
function kt(t, e) {
  t.animate(
    [
      { opacity: 1, transform: "scale(1)" },
      { opacity: 0, transform: "scale(0.95)" }
    ],
    { duration: 300, easing: "ease", fill: "forwards" }
  ).onfinish = e;
}
let O = 1e3;
function Et(t) {
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
function Y(t) {
  if (!t) return null;
  const e = t.trim();
  return e.startsWith("<svg") ? e : null;
}
function V({
  className: t,
  icon: e,
  disabled: n,
  tooltip: r,
  onClick: i,
  ariaLabel: a
}) {
  const l = n !== void 0 && n !== !1 && n !== "false" && n !== "0", u = typeof n == "string" && n !== "true" && n !== "1" ? n : r;
  return /* @__PURE__ */ s(
    "button",
    {
      className: t,
      "aria-label": a,
      "aria-disabled": l ? "true" : void 0,
      tabIndex: l ? -1 : void 0,
      "data-tooltip": l && u ? u : void 0,
      onClick: (g) => {
        if (l) {
          g.preventDefault();
          return;
        }
        i();
      },
      dangerouslySetInnerHTML: e ? { __html: e } : void 0
    }
  );
}
function It({
  title: t = "Window",
  size: e,
  resizable: n = !0,
  movable: r = !0,
  width: i,
  height: a,
  minimizeIcon: l,
  fullscreenIcon: u,
  closeIcon: p,
  disableMinimize: g,
  disableFullscreen: m,
  disableClose: f,
  fullscreenMode: d,
  onMinimize: c,
  onFullscreen: E,
  onClose: I,
  children: tt,
  style: et,
  className: nt
}) {
  const b = S(null), q = S(null), G = S(null), [U, rt] = B(!1), [M, ot] = B(!1), j = S(null), st = !!(i || a), it = {
    ...i ? { "--ddw-w": i } : {},
    ...a ? { "--ddw-h": a } : {},
    ...et
  }, D = C(() => {
    O += 1, b.current && (b.current.style.zIndex = String(O));
  }, []), at = C(() => {
    var v;
    const h = (v = b.current) == null ? void 0 : v.querySelector(".dd-win");
    if (!h) return;
    const o = !U;
    bt(h), rt(o), c == null || c(o);
  }, [U, c]), ct = C(() => {
    const h = b.current;
    if (!h) return;
    const o = !M;
    o ? (j.current = Et(h), wt(h, j.current)) : j.current && yt(h, j.current);
    const v = o;
    ot(v), E == null || E(v);
  }, [M, E]), dt = C(() => {
    var o;
    const h = (o = b.current) == null ? void 0 : o.querySelector(".dd-win");
    h && kt(h, () => {
      b.current && (b.current.style.display = "none"), I == null || I();
    });
  }, [I]);
  F(() => {
    const h = q.current, o = b.current;
    if (!h || !o || !r) return;
    let v = !1, P = 0, R = 0, N = null;
    const $ = (w) => {
      if (!v) return;
      const L = w.clientX - P, y = w.clientY - R;
      N && cancelAnimationFrame(N), N = requestAnimationFrame(() => {
        const x = o.getBoundingClientRect(), z = Math.max(0, window.innerWidth - x.width), X = Math.max(0, window.innerHeight - x.height);
        getComputedStyle(o).position === "static" && (o.style.position = "absolute"), o.style.left = `${Math.max(0, Math.min(L, z))}px`, o.style.top = `${Math.max(0, Math.min(y, X))}px`;
      });
    }, T = () => {
      v = !1, document.removeEventListener("pointermove", $, { capture: !0 }), document.removeEventListener("pointerup", T, { capture: !0 });
    }, A = (w) => {
      if (w.target.closest(".dd-win-controls") || M && !(d === "expand")) return;
      H(o);
      const y = o.getBoundingClientRect();
      P = w.clientX - y.left, R = w.clientY - y.top;
      const x = getComputedStyle(o);
      o.setAttribute("data-explicit", ""), o.style.setProperty("--ddw-w", x.width), o.style.setProperty("--ddw-h", x.height), v = !0, D(), document.addEventListener("pointermove", $, { capture: !0 }), document.addEventListener("pointerup", T, { capture: !0 });
    };
    return h.addEventListener("pointerdown", A), () => {
      h.removeEventListener("pointerdown", A), document.removeEventListener("pointermove", $, { capture: !0 }), document.removeEventListener("pointerup", T, { capture: !0 });
    };
  }, [r, M, d, D]), F(() => {
    const h = G.current, o = b.current;
    if (!h || !o || !n) return;
    let v = !1, P = 0, R = 0, N = 0, $ = 0;
    const T = 180, A = 120, w = (x) => {
      if (!v) return;
      const z = Math.max(T, N + (x.clientX - P)), X = Math.max(A, $ + (x.clientY - R));
      o.style.setProperty("--ddw-w", `${z}px`), o.style.setProperty("--ddw-h", `${X}px`), o.setAttribute("data-explicit", "");
    }, L = () => {
      v = !1, document.removeEventListener("pointermove", w, { capture: !0 }), document.removeEventListener("pointerup", L, { capture: !0 });
    }, y = (x) => {
      if (M) return;
      v = !0, P = x.clientX, R = x.clientY;
      const z = o.getBoundingClientRect();
      N = z.width, $ = z.height, document.addEventListener("pointermove", w, { capture: !0 }), document.addEventListener("pointerup", L, { capture: !0 });
    };
    return h.addEventListener("pointerdown", y), () => {
      h.removeEventListener("pointerdown", y), document.removeEventListener("pointermove", w, { capture: !0 }), document.removeEventListener("pointerup", L, { capture: !0 });
    };
  }, [n, M]);
  const lt = Y(l), ut = Y(u), ft = Y(p);
  return /* @__PURE__ */ s(
    "div",
    {
      ref: b,
      className: ["dd-window", nt].filter(Boolean).join(" "),
      "data-size": e,
      "data-explicit": st ? "" : void 0,
      style: it,
      onPointerDown: D,
      children: /* @__PURE__ */ k("div", { className: "dd-win", children: [
        /* @__PURE__ */ k(
          "div",
          {
            ref: q,
            className: ["dd-win-header", r ? "" : "dd-win-header--no-move"].filter(Boolean).join(" "),
            children: [
              /* @__PURE__ */ s("span", { className: "dd-win-title", children: t }),
              /* @__PURE__ */ k("div", { className: "dd-win-controls", children: [
                /* @__PURE__ */ s(
                  V,
                  {
                    className: "dd-btn--minimize",
                    icon: lt,
                    disabled: g,
                    onClick: at,
                    ariaLabel: "minimize"
                  }
                ),
                /* @__PURE__ */ s(
                  V,
                  {
                    className: "dd-btn--fullscreen",
                    icon: ut,
                    disabled: m,
                    onClick: ct,
                    ariaLabel: "fullscreen"
                  }
                ),
                /* @__PURE__ */ s(
                  V,
                  {
                    className: "dd-btn--close",
                    icon: ft,
                    disabled: f,
                    onClick: dt,
                    ariaLabel: "close"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ s("div", { className: "dd-win-body", children: tt }),
        n && /* @__PURE__ */ s("div", { ref: G, className: "dd-win-resize-handle" })
      ] })
    }
  );
}
function zt({
  variant: t = "primary",
  size: e,
  disabled: n = !1,
  action: r,
  minWidth: i,
  width: a,
  height: l,
  fontSize: u,
  px: p,
  py: g,
  onClick: m,
  children: f,
  className: d,
  style: c
}) {
  const E = {
    ...i ? { "--dd-btn-min-w": i } : {},
    ...a ? { "--dd-btn-w": a } : {},
    ...l ? { "--dd-btn-h": l } : {},
    ...u ? { "--dd-btn-fs": u } : {},
    ...p ? { "--dd-btn-px": p } : {},
    ...g ? { "--dd-btn-py": g } : {},
    ...c
  }, I = [
    "btn",
    `btn--${t}`,
    n ? "btn--disable" : "",
    e ? `btn--size-${e}` : "",
    d
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ s(
    "button",
    {
      className: I,
      style: E,
      disabled: n,
      "aria-disabled": n ? "true" : void 0,
      tabIndex: n ? -1 : void 0,
      "data-action": r,
      "aria-label": r,
      onClick: n ? void 0 : m,
      children: f
    }
  );
}
function Bt({ type: t = "notification", message: e, onClose: n }) {
  const [r, i] = B(!0);
  if (!r) return null;
  const a = () => {
    i(!1), n == null || n();
  };
  return /* @__PURE__ */ k("div", { className: `toast toast-${t}`, children: [
    /* @__PURE__ */ s("span", { className: "toast-btn--close", onClick: a, role: "button", "aria-label": "close", children: "×" }),
    e
  ] });
}
function Pt({
  type: t = "text",
  label: e,
  id: n,
  value: r,
  defaultValue: i,
  placeholder: a,
  disabled: l,
  onChange: u,
  className: p,
  style: g
}) {
  const m = mt(), f = n ?? m;
  return /* @__PURE__ */ k("div", { className: ["input-grid", p].filter(Boolean).join(" "), style: g, children: [
    e && /* @__PURE__ */ s("label", { className: "input-label", htmlFor: f, children: e }),
    /* @__PURE__ */ s(
      "input",
      {
        type: t,
        id: f,
        className: "dreamdesk-input",
        value: r,
        defaultValue: i,
        placeholder: a,
        disabled: l,
        onChange: u ? (d) => u(d.target.value, d) : void 0
      }
    )
  ] });
}
const W = 1, Z = 10, _ = Z + W;
function Mt(t, e, n, r) {
  const [i, a] = B(0);
  F(() => {
    if (!r) return;
    const m = t.current;
    if (!m) return;
    const f = () => {
      const c = m.getBoundingClientRect().width;
      a(Math.floor((c + W) / _));
    }, d = new ResizeObserver(f);
    return d.observe(m), f(), () => d.disconnect();
  }, [r, t]);
  const l = Math.min(Math.max(e, 0), 100), u = Math.floor(l / 100 * i), p = i * _ - W;
  return Array.from({ length: i }, (m, f) => {
    const d = f < u, c = {
      width: `${Z}px`,
      height: "100%",
      marginRight: f < i - 1 ? `${W}px` : "0",
      opacity: d ? 1 : 0.2,
      flexShrink: 0,
      boxSizing: "border-box",
      transition: "opacity 0.3s ease, background 0.3s ease",
      border: "var(--color-window-border, var(--border))",
      boxShadow: "var(--progress-segment-shadow, none)"
    };
    return n ? (c.backgroundImage = "var(--color-progress-gradient, none)", c.backgroundSize = `${p}px 100%`, c.backgroundPosition = `-${f * _}px 0`, c.backgroundRepeat = "no-repeat", c.backgroundColor = "transparent") : (c.backgroundImage = "none", c.backgroundColor = d ? "var(--color-progress-segment, #a8edea)" : "transparent"), /* @__PURE__ */ s("div", { style: c }, f);
  });
}
function Rt({
  value: t = 0,
  blocky: e = !1,
  gradient: n = !1,
  className: r,
  style: i
}) {
  const a = S(null), l = Mt(a, t, n, e), u = Math.min(Math.max(t, 0), 100), p = [
    "progress-track",
    e ? "progress-track--blocky" : "",
    r
  ].filter(Boolean).join(" "), g = {
    width: `${u}%`,
    ...t >= 100 ? { borderRight: "none" } : {},
    ...n ? {} : { filter: `hue-rotate(${u * 3.6}deg)` }
  };
  return /* @__PURE__ */ s("div", { ref: a, className: p, style: i, children: e ? l : /* @__PURE__ */ s(
    "div",
    {
      className: ["progress-bar", n ? "progress-bar--gradient" : ""].filter(Boolean).join(" "),
      style: g
    }
  ) });
}
function J({ children: t, index: e = 0, active: n = !1, onClick: r }) {
  return /* @__PURE__ */ s(
    "dreamdesk-tab",
    {
      class: n ? "active" : void 0,
      "data-tab": "",
      "data-tab-index": String(e),
      onClick: () => r == null ? void 0 : r(e),
      children: t
    }
  );
}
function K({ children: t, active: e = !1, style: n }) {
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
function Tt({
  defaultIndex: t = 0,
  activeIndex: e,
  onChange: n,
  children: r,
  className: i,
  style: a
}) {
  const [l, u] = B(t), p = e ?? l, g = (d) => {
    e === void 0 && u(d), n == null || n(d);
  }, m = [], f = [];
  return gt.forEach(r, (d) => {
    if (vt(d)) {
      if (d.type === J) {
        const c = m.length;
        m.push(
          /* @__PURE__ */ s(J, { index: c, active: c === p, onClick: g, children: d.props.children }, c)
        );
      } else if (d.type === K) {
        const c = f.length;
        f.push(
          /* @__PURE__ */ s(K, { active: c === p, style: d.props.style, children: d.props.children }, c)
        );
      }
    }
  }), /* @__PURE__ */ k("div", { className: ["tabs", i].filter(Boolean).join(" "), style: a, children: [
    /* @__PURE__ */ s("div", { className: "tab-list", children: m }),
    /* @__PURE__ */ s("div", { className: "tab-panels", children: f })
  ] });
}
function Ct({ checked: t, defaultChecked: e, onChange: n, style: r, className: i }) {
  const { theme: a } = xt(), l = t !== void 0, u = e ?? a === "dark";
  return /* @__PURE__ */ k("label", { className: ["toggle", i].filter(Boolean).join(" "), style: r, children: [
    /* @__PURE__ */ s(
      "input",
      {
        type: "checkbox",
        checked: l ? t : void 0,
        defaultChecked: l ? void 0 : u,
        onChange: (p) => n == null ? void 0 : n(p.target.checked)
      }
    ),
    /* @__PURE__ */ s("span", { className: "slider", children: /* @__PURE__ */ s("span", { className: "knob" }) })
  ] });
}
function St({ children: t, className: e, ...n }) {
  return /* @__PURE__ */ s(
    It,
    {
      ...n,
      className: ["terminal-window", e].filter(Boolean).join(" "),
      children: /* @__PURE__ */ s("div", { className: "terminal-win-body", children: t })
    }
  );
}
export {
  zt as Button,
  Pt as Input,
  Rt as ProgressBar,
  J as Tab,
  K as TabPanel,
  Tt as Tabs,
  St as TerminalWindow,
  Lt as ThemeProvider,
  Bt as Toast,
  Ct as Toggle,
  It as Window,
  xt as useTheme
};
