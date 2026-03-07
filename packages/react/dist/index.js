import { jsx as d, jsxs as T } from "react/jsx-runtime";
import { createContext as ut, useState as S, useCallback as R, useContext as ft, useRef as B, useEffect as H, useId as ht } from "react";
const J = ut(null);
function Mt({ children: t, defaultTheme: e = "pastelcore" }) {
  const [n, r] = S(e), i = R((s) => {
    r(s), document.documentElement.setAttribute("data-theme", s);
  }, []);
  return /* @__PURE__ */ d(J.Provider, { value: { theme: n, setTheme: i }, children: t });
}
function Et() {
  const t = ft(J);
  if (!t) throw new Error("useTheme must be used inside <ThemeProvider>");
  return t;
}
function V(t) {
  var n;
  const e = ((n = t == null ? void 0 : t.getAnimations) == null ? void 0 : n.call(t)) ?? [];
  for (const r of e) r.cancel();
}
function mt(t) {
  t.style.transformOrigin = "50% 100%", t.animate(
    [{ transform: "scale(1)", offset: 0 }, { transform: "scale(0)", offset: 1 }],
    { duration: 600, easing: "ease-in-out", fill: "forwards" }
  );
}
function pt(t, e) {
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
function gt(t, e) {
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
function xt(t, e) {
  t.animate(
    [
      { opacity: 1, transform: "scale(1)" },
      { opacity: 0, transform: "scale(0.95)" }
    ],
    { duration: 300, easing: "ease", fill: "forwards" }
  ).onfinish = e;
}
let O = 1e3;
function vt(t) {
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
  ariaLabel: s
}) {
  const l = n !== void 0 && n !== !1 && n !== "false" && n !== "0", u = typeof n == "string" && n !== "true" && n !== "1" ? n : r;
  return /* @__PURE__ */ d(
    "button",
    {
      className: t,
      "aria-label": s,
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
function $t({
  title: t = "Window",
  size: e,
  resizable: n = !0,
  movable: r = !0,
  width: i,
  height: s,
  minimizeIcon: l,
  fullscreenIcon: u,
  closeIcon: p,
  disableMinimize: g,
  disableFullscreen: v,
  disableClose: f,
  fullscreenMode: h,
  onMinimize: c,
  onFullscreen: M,
  onClose: E,
  children: Q,
  style: Z,
  className: tt
}) {
  const w = B(null), q = B(null), G = B(null), [U, et] = S(!1), [$, nt] = S(!1), A = B(null), ot = !!(i || s), rt = {
    ...i ? { "--ddw-w": i } : {},
    ...s ? { "--ddw-h": s } : {},
    ...Z
  }, D = R(() => {
    O += 1, w.current && (w.current.style.zIndex = String(O));
  }, []), it = R(() => {
    var m;
    const a = (m = w.current) == null ? void 0 : m.querySelector(".dd-win");
    if (!a) return;
    const o = !U;
    mt(a), et(o), c == null || c(o);
  }, [U, c]), st = R(() => {
    const a = w.current;
    if (!a) return;
    const o = !$;
    o ? (A.current = vt(a), pt(a, A.current)) : A.current && gt(a, A.current);
    const m = o;
    nt(m), M == null || M(m);
  }, [$, M]), at = R(() => {
    var o;
    const a = (o = w.current) == null ? void 0 : o.querySelector(".dd-win");
    a && xt(a, () => {
      w.current && (w.current.style.display = "none"), E == null || E();
    });
  }, [E]);
  H(() => {
    const a = q.current, o = w.current;
    if (!a || !o || !r) return;
    let m = !1, C = 0, N = 0, k = null;
    const L = (b) => {
      if (!m) return;
      const I = b.clientX - C, y = b.clientY - N;
      k && cancelAnimationFrame(k), k = requestAnimationFrame(() => {
        const x = o.getBoundingClientRect(), z = Math.max(0, window.innerWidth - x.width), X = Math.max(0, window.innerHeight - x.height);
        getComputedStyle(o).position === "static" && (o.style.position = "absolute"), o.style.left = `${Math.max(0, Math.min(I, z))}px`, o.style.top = `${Math.max(0, Math.min(y, X))}px`;
      });
    }, P = () => {
      m = !1, document.removeEventListener("pointermove", L, { capture: !0 }), document.removeEventListener("pointerup", P, { capture: !0 });
    }, W = (b) => {
      if (b.target.closest(".dd-win-controls") || $ && !(h === "expand")) return;
      V(o);
      const y = o.getBoundingClientRect();
      C = b.clientX - y.left, N = b.clientY - y.top;
      const x = getComputedStyle(o);
      o.setAttribute("data-explicit", ""), o.style.setProperty("--ddw-w", x.width), o.style.setProperty("--ddw-h", x.height), m = !0, D(), document.addEventListener("pointermove", L, { capture: !0 }), document.addEventListener("pointerup", P, { capture: !0 });
    };
    return a.addEventListener("pointerdown", W), () => {
      a.removeEventListener("pointerdown", W), document.removeEventListener("pointermove", L, { capture: !0 }), document.removeEventListener("pointerup", P, { capture: !0 });
    };
  }, [r, $, h, D]), H(() => {
    const a = G.current, o = w.current;
    if (!a || !o || !n) return;
    let m = !1, C = 0, N = 0, k = 0, L = 0;
    const P = 180, W = 120, b = (x) => {
      if (!m) return;
      const z = Math.max(P, k + (x.clientX - C)), X = Math.max(W, L + (x.clientY - N));
      o.style.setProperty("--ddw-w", `${z}px`), o.style.setProperty("--ddw-h", `${X}px`), o.setAttribute("data-explicit", "");
    }, I = () => {
      m = !1, document.removeEventListener("pointermove", b, { capture: !0 }), document.removeEventListener("pointerup", I, { capture: !0 });
    }, y = (x) => {
      if ($) return;
      m = !0, C = x.clientX, N = x.clientY;
      const z = o.getBoundingClientRect();
      k = z.width, L = z.height, document.addEventListener("pointermove", b, { capture: !0 }), document.addEventListener("pointerup", I, { capture: !0 });
    };
    return a.addEventListener("pointerdown", y), () => {
      a.removeEventListener("pointerdown", y), document.removeEventListener("pointermove", b, { capture: !0 }), document.removeEventListener("pointerup", I, { capture: !0 });
    };
  }, [n, $]);
  const ct = Y(l), dt = Y(u), lt = Y(p);
  return /* @__PURE__ */ d(
    "div",
    {
      ref: w,
      className: ["dd-window", tt].filter(Boolean).join(" "),
      "data-size": e,
      "data-explicit": ot ? "" : void 0,
      style: rt,
      onPointerDown: D,
      children: /* @__PURE__ */ T("div", { className: "dd-win", children: [
        /* @__PURE__ */ T(
          "div",
          {
            ref: q,
            className: ["dd-win-header", r ? "" : "dd-win-header--no-move"].filter(Boolean).join(" "),
            children: [
              /* @__PURE__ */ d("span", { className: "dd-win-title", children: t }),
              /* @__PURE__ */ T("div", { className: "dd-win-controls", children: [
                /* @__PURE__ */ d(
                  _,
                  {
                    className: "dd-btn--minimize",
                    icon: ct,
                    disabled: g,
                    onClick: it,
                    ariaLabel: "minimize"
                  }
                ),
                /* @__PURE__ */ d(
                  _,
                  {
                    className: "dd-btn--fullscreen",
                    icon: dt,
                    disabled: v,
                    onClick: st,
                    ariaLabel: "fullscreen"
                  }
                ),
                /* @__PURE__ */ d(
                  _,
                  {
                    className: "dd-btn--close",
                    icon: lt,
                    disabled: f,
                    onClick: at,
                    ariaLabel: "close"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ d("div", { className: "dd-win-body", children: Q }),
        n && /* @__PURE__ */ d("div", { ref: G, className: "dd-win-resize-handle" })
      ] })
    }
  );
}
function kt({
  variant: t = "primary",
  size: e,
  disabled: n = !1,
  action: r,
  minWidth: i,
  width: s,
  height: l,
  fontSize: u,
  px: p,
  py: g,
  onClick: v,
  children: f,
  className: h,
  style: c
}) {
  const M = {
    ...i ? { "--dd-btn-min-w": i } : {},
    ...s ? { "--dd-btn-w": s } : {},
    ...l ? { "--dd-btn-h": l } : {},
    ...u ? { "--dd-btn-fs": u } : {},
    ...p ? { "--dd-btn-px": p } : {},
    ...g ? { "--dd-btn-py": g } : {},
    ...c
  }, E = [
    "btn",
    `btn--${t}`,
    n ? "btn--disable" : "",
    e ? `btn--size-${e}` : "",
    h
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ d(
    "button",
    {
      className: E,
      style: M,
      disabled: n,
      "aria-disabled": n ? "true" : void 0,
      tabIndex: n ? -1 : void 0,
      "data-action": r,
      "aria-label": r,
      onClick: n ? void 0 : v,
      children: f
    }
  );
}
function Lt({ type: t = "notification", message: e, onClose: n }) {
  const [r, i] = S(!0);
  if (!r) return null;
  const s = () => {
    i(!1), n == null || n();
  };
  return /* @__PURE__ */ T("div", { className: `toast toast-${t}`, children: [
    /* @__PURE__ */ d("span", { className: "toast-btn--close", onClick: s, role: "button", "aria-label": "close", children: "×" }),
    e
  ] });
}
function It({
  type: t = "text",
  label: e,
  id: n,
  value: r,
  defaultValue: i,
  placeholder: s,
  disabled: l,
  onChange: u,
  className: p,
  style: g
}) {
  const v = ht(), f = n ?? v;
  return /* @__PURE__ */ T("div", { className: ["input-grid", p].filter(Boolean).join(" "), style: g, children: [
    e && /* @__PURE__ */ d("label", { className: "input-label", htmlFor: f, children: e }),
    /* @__PURE__ */ d(
      "input",
      {
        type: t,
        id: f,
        className: "dreamdesk-input",
        value: r,
        defaultValue: i,
        placeholder: s,
        disabled: l,
        onChange: u ? (h) => u(h.target.value, h) : void 0
      }
    )
  ] });
}
const j = 1, K = 10, F = K + j;
function wt(t, e, n, r) {
  const [i, s] = S(0);
  H(() => {
    if (!r) return;
    const v = t.current;
    if (!v) return;
    const f = () => {
      const c = v.getBoundingClientRect().width;
      s(Math.floor((c + j) / F));
    }, h = new ResizeObserver(f);
    return h.observe(v), f(), () => h.disconnect();
  }, [r, t]);
  const l = Math.min(Math.max(e, 0), 100), u = Math.floor(l / 100 * i), p = i * F - j;
  return Array.from({ length: i }, (v, f) => {
    const h = f < u, c = {
      width: `${K}px`,
      height: "100%",
      marginRight: f < i - 1 ? `${j}px` : "0",
      opacity: h ? 1 : 0.2,
      flexShrink: 0,
      boxSizing: "border-box",
      transition: "opacity 0.3s ease, background 0.3s ease",
      border: "var(--color-window-border, var(--border))",
      boxShadow: "var(--progress-segment-shadow, none)"
    };
    return n ? (c.backgroundImage = "var(--color-progress-gradient, none)", c.backgroundSize = `${p}px 100%`, c.backgroundPosition = `-${f * F}px 0`, c.backgroundRepeat = "no-repeat", c.backgroundColor = "transparent") : (c.backgroundImage = "none", c.backgroundColor = h ? "var(--color-progress-segment, #a8edea)" : "transparent"), /* @__PURE__ */ d("div", { style: c }, f);
  });
}
function zt({
  value: t = 0,
  blocky: e = !1,
  gradient: n = !1,
  className: r,
  style: i
}) {
  const s = B(null), l = wt(s, t, n, e), u = Math.min(Math.max(t, 0), 100), p = [
    "progress-track",
    e ? "progress-track--blocky" : "",
    r
  ].filter(Boolean).join(" "), g = {
    width: `${u}%`,
    ...t >= 100 ? { borderRight: "none" } : {},
    ...n ? {} : { filter: `hue-rotate(${u * 3.6}deg)` }
  };
  return /* @__PURE__ */ d("div", { ref: s, className: p, style: i, children: e ? l : /* @__PURE__ */ d(
    "div",
    {
      className: ["progress-bar", n ? "progress-bar--gradient" : ""].filter(Boolean).join(" "),
      style: g
    }
  ) });
}
export {
  kt as Button,
  It as Input,
  zt as ProgressBar,
  Mt as ThemeProvider,
  Lt as Toast,
  $t as Window,
  Et as useTheme
};
