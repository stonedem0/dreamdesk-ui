import { jsx as l, jsxs as D } from "react/jsx-runtime";
import { createContext as dt, useState as W, useCallback as M, useContext as at, useRef as b, useEffect as S } from "react";
const U = dt(null);
function gt({ children: t, defaultTheme: e = "pastelcore" }) {
  const [o, a] = W(e), f = M((u) => {
    a(u), document.documentElement.setAttribute("data-theme", u);
  }, []);
  return /* @__PURE__ */ l(U.Provider, { value: { theme: o, setTheme: f }, children: t });
}
function vt() {
  const t = at(U);
  if (!t) throw new Error("useTheme must be used inside <ThemeProvider>");
  return t;
}
function X(t) {
  var o;
  const e = ((o = t == null ? void 0 : t.getAnimations) == null ? void 0 : o.call(t)) ?? [];
  for (const a of e) a.cancel();
}
function lt(t) {
  t.style.transformOrigin = "50% 100%", t.animate(
    [{ transform: "scale(1)", offset: 0 }, { transform: "scale(0)", offset: 1 }],
    { duration: 600, easing: "ease-in-out", fill: "forwards" }
  );
}
function ut(t, e) {
  const o = t.animate(
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
  o.onfinish = () => {
    t.style.position = "fixed", t.style.top = "0px", t.style.left = "0px", t.style.width = "100vw", t.style.height = "100vh", t.style.zIndex = "9999";
  };
}
function ft(t, e) {
  X(t);
  const o = t.animate(
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
  o.onfinish = () => {
    t.style.position = e.position || "absolute", t.style.top = `${Math.round(e.top)}px`, t.style.left = `${Math.round(e.left)}px`, t.style.width = `${Math.round(e.width)}px`, t.style.height = `${Math.round(e.height)}px`, e.zIndex ? t.style.zIndex = e.zIndex : t.style.removeProperty("z-index"), X(t);
  };
}
function ht(t, e) {
  t.animate(
    [
      { opacity: 1, transform: "scale(1)" },
      { opacity: 0, transform: "scale(0.95)" }
    ],
    { duration: 300, easing: "ease", fill: "forwards" }
  ).onfinish = e;
}
let _ = 1e3;
function mt(t) {
  const e = t.getBoundingClientRect(), o = getComputedStyle(t);
  return {
    top: e.top + (window.scrollY || 0),
    left: e.left + (window.scrollX || 0),
    width: e.width,
    height: e.height,
    position: o.position || "relative",
    zIndex: o.zIndex === "auto" ? "" : o.zIndex
  };
}
function k(t) {
  if (!t) return null;
  const e = t.trim();
  return e.startsWith("<svg") ? e : null;
}
function B({
  className: t,
  icon: e,
  disabled: o,
  tooltip: a,
  onClick: f,
  ariaLabel: u
}) {
  const m = o !== void 0 && o !== !1 && o !== "false" && o !== "0", z = typeof o == "string" && o !== "true" && o !== "1" ? o : a;
  return /* @__PURE__ */ l(
    "button",
    {
      className: t,
      "aria-label": u,
      "aria-disabled": m ? "true" : void 0,
      tabIndex: m ? -1 : void 0,
      "data-tooltip": m && z ? z : void 0,
      onClick: (T) => {
        if (m) {
          T.preventDefault();
          return;
        }
        f();
      },
      dangerouslySetInnerHTML: e ? { __html: e } : void 0
    }
  );
}
function wt({
  title: t = "Window",
  size: e,
  resizable: o = !0,
  movable: a = !0,
  width: f,
  height: u,
  minimizeIcon: m,
  fullscreenIcon: z,
  closeIcon: Y,
  disableMinimize: T,
  disableFullscreen: O,
  disableClose: V,
  fullscreenMode: H,
  onMinimize: I,
  onFullscreen: $,
  onClose: C,
  children: G,
  style: J,
  className: K
}) {
  const c = b(null), j = b(null), q = b(null), [F, Q] = W(!1), [p, Z] = W(!1), P = b(null), tt = !!(f || u), et = {
    ...f ? { "--ddw-w": f } : {},
    ...u ? { "--ddw-h": u } : {},
    ...J
  }, N = M(() => {
    _ += 1, c.current && (c.current.style.zIndex = String(_));
  }, []), nt = M(() => {
    var r;
    const i = (r = c.current) == null ? void 0 : r.querySelector(".dd-win");
    if (!i) return;
    const n = !F;
    lt(i), Q(n), I == null || I(n);
  }, [F, I]), ot = M(() => {
    const i = c.current;
    if (!i) return;
    const n = !p;
    n ? (P.current = mt(i), ut(i, P.current)) : P.current && ft(i, P.current);
    const r = n;
    Z(r), $ == null || $(r);
  }, [p, $]), it = M(() => {
    var n;
    const i = (n = c.current) == null ? void 0 : n.querySelector(".dd-win");
    i && ht(i, () => {
      c.current && (c.current.style.display = "none"), C == null || C();
    });
  }, [C]);
  S(() => {
    const i = j.current, n = c.current;
    if (!i || !n || !a) return;
    let r = !1, y = 0, L = 0, x = null;
    const g = (d) => {
      if (!r) return;
      const v = d.clientX - y, h = d.clientY - L;
      x && cancelAnimationFrame(x), x = requestAnimationFrame(() => {
        const s = n.getBoundingClientRect(), w = Math.max(0, window.innerWidth - s.width), A = Math.max(0, window.innerHeight - s.height);
        getComputedStyle(n).position === "static" && (n.style.position = "absolute"), n.style.left = `${Math.max(0, Math.min(v, w))}px`, n.style.top = `${Math.max(0, Math.min(h, A))}px`;
      });
    }, E = () => {
      r = !1, document.removeEventListener("pointermove", g, { capture: !0 }), document.removeEventListener("pointerup", E, { capture: !0 });
    }, R = (d) => {
      if (d.target.closest(".dd-win-controls") || p && !(H === "expand")) return;
      X(n);
      const h = n.getBoundingClientRect();
      y = d.clientX - h.left, L = d.clientY - h.top;
      const s = getComputedStyle(n);
      n.setAttribute("data-explicit", ""), n.style.setProperty("--ddw-w", s.width), n.style.setProperty("--ddw-h", s.height), r = !0, N(), document.addEventListener("pointermove", g, { capture: !0 }), document.addEventListener("pointerup", E, { capture: !0 });
    };
    return i.addEventListener("pointerdown", R), () => {
      i.removeEventListener("pointerdown", R), document.removeEventListener("pointermove", g, { capture: !0 }), document.removeEventListener("pointerup", E, { capture: !0 });
    };
  }, [a, p, H, N]), S(() => {
    const i = q.current, n = c.current;
    if (!i || !n || !o) return;
    let r = !1, y = 0, L = 0, x = 0, g = 0;
    const E = 180, R = 120, d = (s) => {
      if (!r) return;
      const w = Math.max(E, x + (s.clientX - y)), A = Math.max(R, g + (s.clientY - L));
      n.style.setProperty("--ddw-w", `${w}px`), n.style.setProperty("--ddw-h", `${A}px`), n.setAttribute("data-explicit", "");
    }, v = () => {
      r = !1, document.removeEventListener("pointermove", d, { capture: !0 }), document.removeEventListener("pointerup", v, { capture: !0 });
    }, h = (s) => {
      if (p) return;
      r = !0, y = s.clientX, L = s.clientY;
      const w = n.getBoundingClientRect();
      x = w.width, g = w.height, document.addEventListener("pointermove", d, { capture: !0 }), document.addEventListener("pointerup", v, { capture: !0 });
    };
    return i.addEventListener("pointerdown", h), () => {
      i.removeEventListener("pointerdown", h), document.removeEventListener("pointermove", d, { capture: !0 }), document.removeEventListener("pointerup", v, { capture: !0 });
    };
  }, [o, p]);
  const rt = k(m), st = k(z), ct = k(Y);
  return /* @__PURE__ */ l(
    "div",
    {
      ref: c,
      className: ["dd-window", K].filter(Boolean).join(" "),
      "data-size": e,
      "data-explicit": tt ? "" : void 0,
      style: et,
      onPointerDown: N,
      children: /* @__PURE__ */ D("div", { className: "dd-win", children: [
        /* @__PURE__ */ D(
          "div",
          {
            ref: j,
            className: ["dd-win-header", a ? "" : "dd-win-header--no-move"].filter(Boolean).join(" "),
            children: [
              /* @__PURE__ */ l("span", { className: "dd-win-title", children: t }),
              /* @__PURE__ */ D("div", { className: "dd-win-controls", children: [
                /* @__PURE__ */ l(
                  B,
                  {
                    className: "dd-btn--minimize",
                    icon: rt,
                    disabled: T,
                    onClick: nt,
                    ariaLabel: "minimize"
                  }
                ),
                /* @__PURE__ */ l(
                  B,
                  {
                    className: "dd-btn--fullscreen",
                    icon: st,
                    disabled: O,
                    onClick: ot,
                    ariaLabel: "fullscreen"
                  }
                ),
                /* @__PURE__ */ l(
                  B,
                  {
                    className: "dd-btn--close",
                    icon: ct,
                    disabled: V,
                    onClick: it,
                    ariaLabel: "close"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ l("div", { className: "dd-win-body", children: G }),
        o && /* @__PURE__ */ l("div", { ref: q, className: "dd-win-resize-handle" })
      ] })
    }
  );
}
export {
  gt as ThemeProvider,
  wt as Window,
  vt as useTheme
};
