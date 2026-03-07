import { jsx as d, jsxs as k } from "react/jsx-runtime";
import { createContext as ct, useState as X, useCallback as T, useContext as dt, useRef as D, useEffect as S, useId as lt } from "react";
const O = ct(null);
function gt({ children: t, defaultTheme: e = "pastelcore" }) {
  const [n, r] = X(e), a = T((s) => {
    r(s), document.documentElement.setAttribute("data-theme", s);
  }, []);
  return /* @__PURE__ */ d(O.Provider, { value: { theme: n, setTheme: a }, children: t });
}
function wt() {
  const t = dt(O);
  if (!t) throw new Error("useTheme must be used inside <ThemeProvider>");
  return t;
}
function F(t) {
  var n;
  const e = ((n = t == null ? void 0 : t.getAnimations) == null ? void 0 : n.call(t)) ?? [];
  for (const r of e) r.cancel();
}
function ut(t) {
  t.style.transformOrigin = "50% 100%", t.animate(
    [{ transform: "scale(1)", offset: 0 }, { transform: "scale(0)", offset: 1 }],
    { duration: 600, easing: "ease-in-out", fill: "forwards" }
  );
}
function ft(t, e) {
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
function ht(t, e) {
  F(t);
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
    t.style.position = e.position || "absolute", t.style.top = `${Math.round(e.top)}px`, t.style.left = `${Math.round(e.left)}px`, t.style.width = `${Math.round(e.width)}px`, t.style.height = `${Math.round(e.height)}px`, e.zIndex ? t.style.zIndex = e.zIndex : t.style.removeProperty("z-index"), F(t);
  };
}
function mt(t, e) {
  t.animate(
    [
      { opacity: 1, transform: "scale(1)" },
      { opacity: 0, transform: "scale(0.95)" }
    ],
    { duration: 300, easing: "ease", fill: "forwards" }
  ).onfinish = e;
}
let U = 1e3;
function pt(t) {
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
function W(t) {
  if (!t) return null;
  const e = t.trim();
  return e.startsWith("<svg") ? e : null;
}
function H({
  className: t,
  icon: e,
  disabled: n,
  tooltip: r,
  onClick: a,
  ariaLabel: s
}) {
  const l = n !== void 0 && n !== !1 && n !== "false" && n !== "0", f = typeof n == "string" && n !== "true" && n !== "1" ? n : r;
  return /* @__PURE__ */ d(
    "button",
    {
      className: t,
      "aria-label": s,
      "aria-disabled": l ? "true" : void 0,
      tabIndex: l ? -1 : void 0,
      "data-tooltip": l && f ? f : void 0,
      onClick: (p) => {
        if (l) {
          p.preventDefault();
          return;
        }
        a();
      },
      dangerouslySetInnerHTML: e ? { __html: e } : void 0
    }
  );
}
function yt({
  title: t = "Window",
  size: e,
  resizable: n = !0,
  movable: r = !0,
  width: a,
  height: s,
  minimizeIcon: l,
  fullscreenIcon: f,
  closeIcon: x,
  disableMinimize: p,
  disableFullscreen: z,
  disableClose: w,
  fullscreenMode: v,
  onMinimize: y,
  onFullscreen: b,
  onClose: L,
  children: G,
  style: J,
  className: K
}) {
  const h = D(null), q = D(null), V = D(null), [_, Q] = X(!1), [E, Z] = X(!1), B = D(null), tt = !!(a || s), et = {
    ...a ? { "--ddw-w": a } : {},
    ...s ? { "--ddw-h": s } : {},
    ...J
  }, Y = T(() => {
    U += 1, h.current && (h.current.style.zIndex = String(U));
  }, []), nt = T(() => {
    var c;
    const i = (c = h.current) == null ? void 0 : c.querySelector(".dd-win");
    if (!i) return;
    const o = !_;
    ut(i), Q(o), y == null || y(o);
  }, [_, y]), ot = T(() => {
    const i = h.current;
    if (!i) return;
    const o = !E;
    o ? (B.current = pt(i), ft(i, B.current)) : B.current && ht(i, B.current);
    const c = o;
    Z(c), b == null || b(c);
  }, [E, b]), it = T(() => {
    var o;
    const i = (o = h.current) == null ? void 0 : o.querySelector(".dd-win");
    i && mt(i, () => {
      h.current && (h.current.style.display = "none"), L == null || L();
    });
  }, [L]);
  S(() => {
    const i = q.current, o = h.current;
    if (!i || !o || !r) return;
    let c = !1, P = 0, C = 0, I = null;
    const M = (m) => {
      if (!c) return;
      const $ = m.clientX - P, g = m.clientY - C;
      I && cancelAnimationFrame(I), I = requestAnimationFrame(() => {
        const u = o.getBoundingClientRect(), N = Math.max(0, window.innerWidth - u.width), j = Math.max(0, window.innerHeight - u.height);
        getComputedStyle(o).position === "static" && (o.style.position = "absolute"), o.style.left = `${Math.max(0, Math.min($, N))}px`, o.style.top = `${Math.max(0, Math.min(g, j))}px`;
      });
    }, R = () => {
      c = !1, document.removeEventListener("pointermove", M, { capture: !0 }), document.removeEventListener("pointerup", R, { capture: !0 });
    }, A = (m) => {
      if (m.target.closest(".dd-win-controls") || E && !(v === "expand")) return;
      F(o);
      const g = o.getBoundingClientRect();
      P = m.clientX - g.left, C = m.clientY - g.top;
      const u = getComputedStyle(o);
      o.setAttribute("data-explicit", ""), o.style.setProperty("--ddw-w", u.width), o.style.setProperty("--ddw-h", u.height), c = !0, Y(), document.addEventListener("pointermove", M, { capture: !0 }), document.addEventListener("pointerup", R, { capture: !0 });
    };
    return i.addEventListener("pointerdown", A), () => {
      i.removeEventListener("pointerdown", A), document.removeEventListener("pointermove", M, { capture: !0 }), document.removeEventListener("pointerup", R, { capture: !0 });
    };
  }, [r, E, v, Y]), S(() => {
    const i = V.current, o = h.current;
    if (!i || !o || !n) return;
    let c = !1, P = 0, C = 0, I = 0, M = 0;
    const R = 180, A = 120, m = (u) => {
      if (!c) return;
      const N = Math.max(R, I + (u.clientX - P)), j = Math.max(A, M + (u.clientY - C));
      o.style.setProperty("--ddw-w", `${N}px`), o.style.setProperty("--ddw-h", `${j}px`), o.setAttribute("data-explicit", "");
    }, $ = () => {
      c = !1, document.removeEventListener("pointermove", m, { capture: !0 }), document.removeEventListener("pointerup", $, { capture: !0 });
    }, g = (u) => {
      if (E) return;
      c = !0, P = u.clientX, C = u.clientY;
      const N = o.getBoundingClientRect();
      I = N.width, M = N.height, document.addEventListener("pointermove", m, { capture: !0 }), document.addEventListener("pointerup", $, { capture: !0 });
    };
    return i.addEventListener("pointerdown", g), () => {
      i.removeEventListener("pointerdown", g), document.removeEventListener("pointermove", m, { capture: !0 }), document.removeEventListener("pointerup", $, { capture: !0 });
    };
  }, [n, E]);
  const rt = W(l), st = W(f), at = W(x);
  return /* @__PURE__ */ d(
    "div",
    {
      ref: h,
      className: ["dd-window", K].filter(Boolean).join(" "),
      "data-size": e,
      "data-explicit": tt ? "" : void 0,
      style: et,
      onPointerDown: Y,
      children: /* @__PURE__ */ k("div", { className: "dd-win", children: [
        /* @__PURE__ */ k(
          "div",
          {
            ref: q,
            className: ["dd-win-header", r ? "" : "dd-win-header--no-move"].filter(Boolean).join(" "),
            children: [
              /* @__PURE__ */ d("span", { className: "dd-win-title", children: t }),
              /* @__PURE__ */ k("div", { className: "dd-win-controls", children: [
                /* @__PURE__ */ d(
                  H,
                  {
                    className: "dd-btn--minimize",
                    icon: rt,
                    disabled: p,
                    onClick: nt,
                    ariaLabel: "minimize"
                  }
                ),
                /* @__PURE__ */ d(
                  H,
                  {
                    className: "dd-btn--fullscreen",
                    icon: st,
                    disabled: z,
                    onClick: ot,
                    ariaLabel: "fullscreen"
                  }
                ),
                /* @__PURE__ */ d(
                  H,
                  {
                    className: "dd-btn--close",
                    icon: at,
                    disabled: w,
                    onClick: it,
                    ariaLabel: "close"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ d("div", { className: "dd-win-body", children: G }),
        n && /* @__PURE__ */ d("div", { ref: V, className: "dd-win-resize-handle" })
      ] })
    }
  );
}
function bt({
  variant: t = "primary",
  size: e,
  disabled: n = !1,
  action: r,
  minWidth: a,
  width: s,
  height: l,
  fontSize: f,
  px: x,
  py: p,
  onClick: z,
  children: w,
  className: v,
  style: y
}) {
  const b = {
    ...a ? { "--dd-btn-min-w": a } : {},
    ...s ? { "--dd-btn-w": s } : {},
    ...l ? { "--dd-btn-h": l } : {},
    ...f ? { "--dd-btn-fs": f } : {},
    ...x ? { "--dd-btn-px": x } : {},
    ...p ? { "--dd-btn-py": p } : {},
    ...y
  }, L = [
    "btn",
    `btn--${t}`,
    n ? "btn--disable" : "",
    e ? `btn--size-${e}` : "",
    v
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ d(
    "button",
    {
      className: L,
      style: b,
      disabled: n,
      "aria-disabled": n ? "true" : void 0,
      tabIndex: n ? -1 : void 0,
      "data-action": r,
      "aria-label": r,
      onClick: n ? void 0 : z,
      children: w
    }
  );
}
function Lt({ type: t = "notification", message: e, onClose: n }) {
  const [r, a] = X(!0);
  if (!r) return null;
  const s = () => {
    a(!1), n == null || n();
  };
  return /* @__PURE__ */ k("div", { className: `toast toast-${t}`, children: [
    /* @__PURE__ */ d("span", { className: "toast-btn--close", onClick: s, role: "button", "aria-label": "close", children: "×" }),
    e
  ] });
}
function Et({
  type: t = "text",
  label: e,
  id: n,
  value: r,
  defaultValue: a,
  placeholder: s,
  disabled: l,
  onChange: f,
  className: x,
  style: p
}) {
  const z = lt(), w = n ?? z;
  return /* @__PURE__ */ k("div", { className: ["input-grid", x].filter(Boolean).join(" "), style: p, children: [
    e && /* @__PURE__ */ d("label", { className: "input-label", htmlFor: w, children: e }),
    /* @__PURE__ */ d(
      "input",
      {
        type: t,
        id: w,
        className: "dreamdesk-input",
        value: r,
        defaultValue: a,
        placeholder: s,
        disabled: l,
        onChange: f ? (v) => f(v.target.value, v) : void 0
      }
    )
  ] });
}
export {
  bt as Button,
  Et as Input,
  gt as ThemeProvider,
  Lt as Toast,
  yt as Window,
  wt as useTheme
};
