import { jsx as d, jsxs as z } from "react/jsx-runtime";
import { createContext as ht, useState as P, useCallback as C, useContext as pt, useRef as S, useEffect as H, useId as mt, Children as gt, isValidElement as vt } from "react";
const Q = ht(null);
function $t({ children: t, defaultTheme: e = "pastelcore" }) {
  const [n, r] = P(e), i = C((c) => {
    r(c), document.documentElement.setAttribute("data-theme", c);
  }, []);
  return /* @__PURE__ */ d(Q.Provider, { value: { theme: n, setTheme: i }, children: t });
}
function Lt() {
  const t = pt(Q);
  if (!t) throw new Error("useTheme must be used inside <ThemeProvider>");
  return t;
}
function V(t) {
  var n;
  const e = ((n = t == null ? void 0 : t.getAnimations) == null ? void 0 : n.call(t)) ?? [];
  for (const r of e) r.cancel();
}
function xt(t) {
  t.style.transformOrigin = "50% 100%", t.animate(
    [{ transform: "scale(1)", offset: 0 }, { transform: "scale(0)", offset: 1 }],
    { duration: 600, easing: "ease-in-out", fill: "forwards" }
  );
}
function bt(t, e) {
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
function wt(t, e) {
  V(t);
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
    t.style.position = e.position || "absolute", t.style.top = `${Math.round(e.top)}px`, t.style.left = `${Math.round(e.left)}px`, t.style.width = `${Math.round(e.width)}px`, t.style.height = `${Math.round(e.height)}px`, e.zIndex ? t.style.zIndex = e.zIndex : t.style.removeProperty("z-index"), V(t);
  };
}
function yt(t, e) {
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
function _({
  className: t,
  icon: e,
  disabled: n,
  tooltip: r,
  onClick: i,
  ariaLabel: c
}) {
  const f = n !== void 0 && n !== !1 && n !== "false" && n !== "0", h = typeof n == "string" && n !== "true" && n !== "1" ? n : r;
  return /* @__PURE__ */ d(
    "button",
    {
      className: t,
      "aria-label": c,
      "aria-disabled": f ? "true" : void 0,
      tabIndex: f ? -1 : void 0,
      "data-tooltip": f && h ? h : void 0,
      onClick: (g) => {
        if (f) {
          g.preventDefault();
          return;
        }
        i();
      },
      dangerouslySetInnerHTML: e ? { __html: e } : void 0
    }
  );
}
function Nt({
  title: t = "Window",
  size: e,
  resizable: n = !0,
  movable: r = !0,
  width: i,
  height: c,
  minimizeIcon: f,
  fullscreenIcon: h,
  closeIcon: p,
  disableMinimize: g,
  disableFullscreen: m,
  disableClose: l,
  fullscreenMode: a,
  onMinimize: s,
  onFullscreen: E,
  onClose: k,
  children: tt,
  style: et,
  className: nt
}) {
  const b = S(null), q = S(null), G = S(null), [U, rt] = P(!1), [I, ot] = P(!1), A = S(null), st = !!(i || c), it = {
    ...i ? { "--ddw-w": i } : {},
    ...c ? { "--ddw-h": c } : {},
    ...et
  }, D = C(() => {
    O += 1, b.current && (b.current.style.zIndex = String(O));
  }, []), at = C(() => {
    var v;
    const u = (v = b.current) == null ? void 0 : v.querySelector(".dd-win");
    if (!u) return;
    const o = !U;
    xt(u), rt(o), s == null || s(o);
  }, [U, s]), ct = C(() => {
    const u = b.current;
    if (!u) return;
    const o = !I;
    o ? (A.current = Et(u), bt(u, A.current)) : A.current && wt(u, A.current);
    const v = o;
    ot(v), E == null || E(v);
  }, [I, E]), dt = C(() => {
    var o;
    const u = (o = b.current) == null ? void 0 : o.querySelector(".dd-win");
    u && yt(u, () => {
      b.current && (b.current.style.display = "none"), k == null || k();
    });
  }, [k]);
  H(() => {
    const u = q.current, o = b.current;
    if (!u || !o || !r) return;
    let v = !1, R = 0, B = 0, M = null;
    const $ = (w) => {
      if (!v) return;
      const L = w.clientX - R, y = w.clientY - B;
      M && cancelAnimationFrame(M), M = requestAnimationFrame(() => {
        const x = o.getBoundingClientRect(), N = Math.max(0, window.innerWidth - x.width), X = Math.max(0, window.innerHeight - x.height);
        getComputedStyle(o).position === "static" && (o.style.position = "absolute"), o.style.left = `${Math.max(0, Math.min(L, N))}px`, o.style.top = `${Math.max(0, Math.min(y, X))}px`;
      });
    }, T = () => {
      v = !1, document.removeEventListener("pointermove", $, { capture: !0 }), document.removeEventListener("pointerup", T, { capture: !0 });
    }, j = (w) => {
      if (w.target.closest(".dd-win-controls") || I && !(a === "expand")) return;
      V(o);
      const y = o.getBoundingClientRect();
      R = w.clientX - y.left, B = w.clientY - y.top;
      const x = getComputedStyle(o);
      o.setAttribute("data-explicit", ""), o.style.setProperty("--ddw-w", x.width), o.style.setProperty("--ddw-h", x.height), v = !0, D(), document.addEventListener("pointermove", $, { capture: !0 }), document.addEventListener("pointerup", T, { capture: !0 });
    };
    return u.addEventListener("pointerdown", j), () => {
      u.removeEventListener("pointerdown", j), document.removeEventListener("pointermove", $, { capture: !0 }), document.removeEventListener("pointerup", T, { capture: !0 });
    };
  }, [r, I, a, D]), H(() => {
    const u = G.current, o = b.current;
    if (!u || !o || !n) return;
    let v = !1, R = 0, B = 0, M = 0, $ = 0;
    const T = 180, j = 120, w = (x) => {
      if (!v) return;
      const N = Math.max(T, M + (x.clientX - R)), X = Math.max(j, $ + (x.clientY - B));
      o.style.setProperty("--ddw-w", `${N}px`), o.style.setProperty("--ddw-h", `${X}px`), o.setAttribute("data-explicit", "");
    }, L = () => {
      v = !1, document.removeEventListener("pointermove", w, { capture: !0 }), document.removeEventListener("pointerup", L, { capture: !0 });
    }, y = (x) => {
      if (I) return;
      v = !0, R = x.clientX, B = x.clientY;
      const N = o.getBoundingClientRect();
      M = N.width, $ = N.height, document.addEventListener("pointermove", w, { capture: !0 }), document.addEventListener("pointerup", L, { capture: !0 });
    };
    return u.addEventListener("pointerdown", y), () => {
      u.removeEventListener("pointerdown", y), document.removeEventListener("pointermove", w, { capture: !0 }), document.removeEventListener("pointerup", L, { capture: !0 });
    };
  }, [n, I]);
  const lt = Y(f), ut = Y(h), ft = Y(p);
  return /* @__PURE__ */ d(
    "div",
    {
      ref: b,
      className: ["dd-window", nt].filter(Boolean).join(" "),
      "data-size": e,
      "data-explicit": st ? "" : void 0,
      style: it,
      onPointerDown: D,
      children: /* @__PURE__ */ z("div", { className: "dd-win", children: [
        /* @__PURE__ */ z(
          "div",
          {
            ref: q,
            className: ["dd-win-header", r ? "" : "dd-win-header--no-move"].filter(Boolean).join(" "),
            children: [
              /* @__PURE__ */ d("span", { className: "dd-win-title", children: t }),
              /* @__PURE__ */ z("div", { className: "dd-win-controls", children: [
                /* @__PURE__ */ d(
                  _,
                  {
                    className: "dd-btn--minimize",
                    icon: lt,
                    disabled: g,
                    onClick: at,
                    ariaLabel: "minimize"
                  }
                ),
                /* @__PURE__ */ d(
                  _,
                  {
                    className: "dd-btn--fullscreen",
                    icon: ut,
                    disabled: m,
                    onClick: ct,
                    ariaLabel: "fullscreen"
                  }
                ),
                /* @__PURE__ */ d(
                  _,
                  {
                    className: "dd-btn--close",
                    icon: ft,
                    disabled: l,
                    onClick: dt,
                    ariaLabel: "close"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ d("div", { className: "dd-win-body", children: tt }),
        n && /* @__PURE__ */ d("div", { ref: G, className: "dd-win-resize-handle" })
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
  width: c,
  height: f,
  fontSize: h,
  px: p,
  py: g,
  onClick: m,
  children: l,
  className: a,
  style: s
}) {
  const E = {
    ...i ? { "--dd-btn-min-w": i } : {},
    ...c ? { "--dd-btn-w": c } : {},
    ...f ? { "--dd-btn-h": f } : {},
    ...h ? { "--dd-btn-fs": h } : {},
    ...p ? { "--dd-btn-px": p } : {},
    ...g ? { "--dd-btn-py": g } : {},
    ...s
  }, k = [
    "btn",
    `btn--${t}`,
    n ? "btn--disable" : "",
    e ? `btn--size-${e}` : "",
    a
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ d(
    "button",
    {
      className: k,
      style: E,
      disabled: n,
      "aria-disabled": n ? "true" : void 0,
      tabIndex: n ? -1 : void 0,
      "data-action": r,
      "aria-label": r,
      onClick: n ? void 0 : m,
      children: l
    }
  );
}
function Pt({ type: t = "notification", message: e, onClose: n }) {
  const [r, i] = P(!0);
  if (!r) return null;
  const c = () => {
    i(!1), n == null || n();
  };
  return /* @__PURE__ */ z("div", { className: `toast toast-${t}`, children: [
    /* @__PURE__ */ d("span", { className: "toast-btn--close", onClick: c, role: "button", "aria-label": "close", children: "×" }),
    e
  ] });
}
function Rt({
  type: t = "text",
  label: e,
  id: n,
  value: r,
  defaultValue: i,
  placeholder: c,
  disabled: f,
  onChange: h,
  className: p,
  style: g
}) {
  const m = mt(), l = n ?? m;
  return /* @__PURE__ */ z("div", { className: ["input-grid", p].filter(Boolean).join(" "), style: g, children: [
    e && /* @__PURE__ */ d("label", { className: "input-label", htmlFor: l, children: e }),
    /* @__PURE__ */ d(
      "input",
      {
        type: t,
        id: l,
        className: "dreamdesk-input",
        value: r,
        defaultValue: i,
        placeholder: c,
        disabled: f,
        onChange: h ? (a) => h(a.target.value, a) : void 0
      }
    )
  ] });
}
const W = 1, Z = 10, F = Z + W;
function kt(t, e, n, r) {
  const [i, c] = P(0);
  H(() => {
    if (!r) return;
    const m = t.current;
    if (!m) return;
    const l = () => {
      const s = m.getBoundingClientRect().width;
      c(Math.floor((s + W) / F));
    }, a = new ResizeObserver(l);
    return a.observe(m), l(), () => a.disconnect();
  }, [r, t]);
  const f = Math.min(Math.max(e, 0), 100), h = Math.floor(f / 100 * i), p = i * F - W;
  return Array.from({ length: i }, (m, l) => {
    const a = l < h, s = {
      width: `${Z}px`,
      height: "100%",
      marginRight: l < i - 1 ? `${W}px` : "0",
      opacity: a ? 1 : 0.2,
      flexShrink: 0,
      boxSizing: "border-box",
      transition: "opacity 0.3s ease, background 0.3s ease",
      border: "var(--color-window-border, var(--border))",
      boxShadow: "var(--progress-segment-shadow, none)"
    };
    return n ? (s.backgroundImage = "var(--color-progress-gradient, none)", s.backgroundSize = `${p}px 100%`, s.backgroundPosition = `-${l * F}px 0`, s.backgroundRepeat = "no-repeat", s.backgroundColor = "transparent") : (s.backgroundImage = "none", s.backgroundColor = a ? "var(--color-progress-segment, #a8edea)" : "transparent"), /* @__PURE__ */ d("div", { style: s }, l);
  });
}
function Bt({
  value: t = 0,
  blocky: e = !1,
  gradient: n = !1,
  className: r,
  style: i
}) {
  const c = S(null), f = kt(c, t, n, e), h = Math.min(Math.max(t, 0), 100), p = [
    "progress-track",
    e ? "progress-track--blocky" : "",
    r
  ].filter(Boolean).join(" "), g = {
    width: `${h}%`,
    ...t >= 100 ? { borderRight: "none" } : {},
    ...n ? {} : { filter: `hue-rotate(${h * 3.6}deg)` }
  };
  return /* @__PURE__ */ d("div", { ref: c, className: p, style: i, children: e ? f : /* @__PURE__ */ d(
    "div",
    {
      className: ["progress-bar", n ? "progress-bar--gradient" : ""].filter(Boolean).join(" "),
      style: g
    }
  ) });
}
function J({ children: t, index: e = 0, active: n = !1, onClick: r }) {
  return /* @__PURE__ */ d(
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
  return /* @__PURE__ */ d(
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
  style: c
}) {
  const [f, h] = P(t), p = e ?? f, g = (a) => {
    e === void 0 && h(a), n == null || n(a);
  }, m = [], l = [];
  return gt.forEach(r, (a) => {
    if (vt(a)) {
      if (a.type === J) {
        const s = m.length;
        m.push(
          /* @__PURE__ */ d(J, { index: s, active: s === p, onClick: g, children: a.props.children }, s)
        );
      } else if (a.type === K) {
        const s = l.length;
        l.push(
          /* @__PURE__ */ d(K, { active: s === p, style: a.props.style, children: a.props.children }, s)
        );
      }
    }
  }), /* @__PURE__ */ z("div", { className: ["tabs", i].filter(Boolean).join(" "), style: c, children: [
    /* @__PURE__ */ d("div", { className: "tab-list", children: m }),
    /* @__PURE__ */ d("div", { className: "tab-panels", children: l })
  ] });
}
export {
  zt as Button,
  Rt as Input,
  Bt as ProgressBar,
  J as Tab,
  K as TabPanel,
  Tt as Tabs,
  $t as ThemeProvider,
  Pt as Toast,
  Nt as Window,
  Lt as useTheme
};
