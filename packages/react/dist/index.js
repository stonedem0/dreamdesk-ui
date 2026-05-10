import { jsx as c, jsxs as I } from "react/jsx-runtime";
import { createContext as yt, useState as A, useEffect as B, useCallback as D, useContext as wt, useRef as S, useId as it, Children as bt, isValidElement as xt } from "react";
const at = yt(null);
function jt({ children: t, defaultTheme: e = "pastelcore" }) {
  const [n, r] = A(e);
  B(() => {
    document.documentElement.setAttribute("data-theme", n);
  }, [n]);
  const o = D((i) => {
    r(i);
  }, []);
  return /* @__PURE__ */ c(at.Provider, { value: { theme: n, setTheme: o }, children: t });
}
const kt = {
  theme: "pastelcore",
  setTheme: () => {
  }
};
function Et() {
  return wt(at) ?? kt;
}
function _(t) {
  var n;
  const e = ((n = t == null ? void 0 : t.getAnimations) == null ? void 0 : n.call(t)) ?? [];
  for (const r of e) r.cancel();
}
function Lt(t) {
  _(t), t.style.transformOrigin = "50% 100%", t.animate(
    [{ transform: "scale(1)" }, { transform: "scale(0)" }],
    { duration: 300, easing: "ease-in", fill: "forwards" }
  );
}
function Nt(t) {
  _(t), t.style.transformOrigin = "50% 100%", t.animate(
    [{ transform: "scale(0)" }, { transform: "scale(1)" }],
    { duration: 300, easing: "ease-out" }
  );
}
function $t(t, e) {
  _(t);
  const n = window.innerWidth, r = window.innerHeight, o = e.top - (window.scrollY || 0), i = e.left - (window.scrollX || 0), s = e.width, d = e.height;
  t.style.position = "fixed", t.style.top = "0", t.style.left = "0", t.style.width = "", t.style.height = "", t.style.setProperty("--ddw-w", "100vw"), t.style.setProperty("--ddw-h", "100vh"), t.style.zIndex = "9999";
  const f = s / n, h = d / r, v = i + s / 2 - n / 2, w = o + d / 2 - r / 2;
  t.animate(
    [
      { transform: `translate(${v}px, ${w}px) scale(${f}, ${h})` },
      { transform: "none" }
    ],
    { duration: 500, easing: "cubic-bezier(0.2, 0, 0, 1)" }
  );
}
function Tt(t, e) {
  _(t);
  const n = window.innerWidth, r = window.innerHeight, o = e.width, i = e.height, s = e.top - (window.scrollY || 0), d = e.left - (window.scrollX || 0), f = o / n, h = i / r, v = d + o / 2 - n / 2, w = s + i / 2 - r / 2, l = t.animate(
    [
      { transform: "none" },
      { transform: `translate(${v}px, ${w}px) scale(${f}, ${h})` }
    ],
    { duration: 300, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" }
  ), u = () => {
    t.style.position = e.position || "absolute", t.style.top = `${Math.round(e.top)}px`, t.style.left = `${Math.round(e.left)}px`, t.style.width = "", t.style.height = "", t.style.setProperty("--ddw-w", `${Math.round(o)}px`), t.style.setProperty("--ddw-h", `${Math.round(i)}px`), e.zIndex ? t.style.zIndex = e.zIndex : t.style.removeProperty("z-index");
  };
  l.onfinish = () => {
    u(), t.getAnimations().forEach((p) => p.cancel());
  }, l.oncancel = u;
}
function zt(t, e) {
  t.animate(
    [{ opacity: "1", transform: "scale(1)" }, { opacity: "0", transform: "scale(0.95)" }],
    { duration: 300, easing: "ease", fill: "forwards" }
  ).onfinish = () => e == null ? void 0 : e();
}
const It = 1e3, tt = /* @__PURE__ */ new Map(), N = [];
function et() {
  N.forEach((t, e) => {
    const n = tt.get(t);
    n && (n.style.zIndex = String(It + e));
  });
}
function Mt(t, e) {
  tt.set(t, e), N.includes(t) || N.push(t), et();
}
function Rt(t) {
  tt.delete(t);
  const e = N.indexOf(t);
  e !== -1 && N.splice(e, 1), et();
}
function Wt(t) {
  const e = N.indexOf(t);
  e !== -1 && N.splice(e, 1), N.push(t), et();
}
function Pt(t) {
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
function St(t) {
  try {
    const n = new DOMParser().parseFromString(t, "image/svg+xml");
    if (n.querySelector("parsererror")) return "";
    const r = (o) => {
      var i;
      if (o.tagName.toLowerCase() === "script") {
        (i = o.parentNode) == null || i.removeChild(o);
        return;
      }
      for (const s of Array.from(o.attributes))
        (s.name.startsWith("on") || s.value.toLowerCase().includes("javascript:")) && o.removeAttribute(s.name);
      Array.from(o.children).forEach(r);
    };
    return r(n.documentElement), new XMLSerializer().serializeToString(n.documentElement);
  } catch {
    return "";
  }
}
function K(t) {
  if (!t) return null;
  const e = t.trim();
  return e.startsWith("<svg") && St(e) || null;
}
function Q({
  className: t,
  icon: e,
  disabled: n,
  tooltip: r,
  onClick: o,
  ariaLabel: i
}) {
  const s = n !== void 0 && n !== !1 && n !== "false" && n !== "0", d = typeof n == "string" && n !== "true" && n !== "1" ? n : r;
  return /* @__PURE__ */ c(
    "button",
    {
      className: t,
      "aria-label": i,
      "aria-disabled": s ? "true" : void 0,
      tabIndex: s ? -1 : void 0,
      "data-tooltip": s && d ? d : void 0,
      onClick: (h) => {
        if (s) {
          h.preventDefault();
          return;
        }
        o();
      },
      dangerouslySetInnerHTML: e ? { __html: e } : void 0
    }
  );
}
function Bt({
  title: t = "Window",
  size: e,
  resizable: n = !0,
  movable: r = !0,
  width: o,
  height: i,
  minimizeIcon: s,
  fullscreenIcon: d,
  closeIcon: f,
  disableMinimize: h,
  disableFullscreen: v,
  disableClose: w,
  fullscreenMode: l,
  bodyOverflow: u,
  scrollContent: p,
  onMinimize: g,
  onFullscreen: k,
  onClose: M,
  children: V,
  style: U,
  className: Z
}) {
  const x = S(null), R = S(null), O = S(null), C = it(), [nt, ct] = A(!1), [W, lt] = A(!1), q = S(null), dt = !!(o || i), ut = {
    ...o ? { "--ddw-w": o } : {},
    ...i ? { "--ddw-h": i } : {},
    ...U
  };
  B(() => {
    const m = x.current;
    if (m)
      return Mt(C, m), () => Rt(C);
  }, [C]);
  const J = D(() => {
    Wt(C);
  }, [C]), ft = D(() => {
    var b;
    const m = (b = x.current) == null ? void 0 : b.querySelector(".dd-win");
    if (!m) return;
    const a = !nt;
    a ? Lt(m) : Nt(m), ct(a), g == null || g(a);
  }, [nt, g]), mt = D(() => {
    const m = x.current;
    if (!m) return;
    const a = !W;
    a ? (q.current = Pt(m), $t(m, q.current)) : q.current && Tt(m, q.current);
    const b = a;
    lt(b), k == null || k(b);
  }, [W, k]), pt = D(() => {
    var a;
    const m = (a = x.current) == null ? void 0 : a.querySelector(".dd-win");
    m && zt(m, () => {
      x.current && (x.current.style.display = "none"), M == null || M();
    });
  }, [M]);
  B(() => {
    const m = R.current, a = x.current;
    if (!m || !a || !r) return;
    let b = !1, X = 0, j = 0, H = 0, Y = 0, $ = null;
    const F = (E) => {
      if (!b) return;
      const L = E.clientX - X, y = E.clientY - j;
      $ && cancelAnimationFrame($), $ = requestAnimationFrame(() => {
        a.style.left = `${Math.max(0, Math.min(L, H))}px`, a.style.top = `${Math.max(0, Math.min(y, Y))}px`;
      });
    }, T = () => {
      b = !1, document.removeEventListener("pointermove", F, { capture: !0 }), document.removeEventListener("pointerup", T, { capture: !0 });
    }, P = (E) => {
      if (E.target.closest(".dd-win-controls") || W && !(l === "expand")) return;
      _(a);
      const y = a.getBoundingClientRect();
      X = E.clientX - y.left, j = E.clientY - y.top, H = Math.max(0, window.innerWidth - y.width), Y = Math.max(0, window.innerHeight - y.height), a.hasAttribute("data-explicit") || (a.style.setProperty("--ddw-w", `${y.width}px`), a.style.setProperty("--ddw-h", `${y.height}px`), a.setAttribute("data-explicit", ""));
      const G = getComputedStyle(a).position;
      (G === "static" || G === "relative") && (a.style.position = "absolute", a.style.left = `${y.left + (window.scrollX || 0)}px`, a.style.top = `${y.top + (window.scrollY || 0)}px`), b = !0, J(), document.addEventListener("pointermove", F, { capture: !0 }), document.addEventListener("pointerup", T, { capture: !0 });
    };
    return m.addEventListener("pointerdown", P), () => {
      m.removeEventListener("pointerdown", P), document.removeEventListener("pointermove", F, { capture: !0 }), document.removeEventListener("pointerup", T, { capture: !0 }), $ && cancelAnimationFrame($);
    };
  }, [r, W, l, J]), B(() => {
    const m = O.current, a = x.current;
    if (!m || !a || !n) return;
    let b = !1, X = 0, j = 0, H = 0, Y = 0;
    const $ = 180, F = 120, T = (L) => {
      if (!b) return;
      const y = Math.max($, H + (L.clientX - X)), G = Math.max(F, Y + (L.clientY - j));
      a.style.setProperty("--ddw-w", `${y}px`), a.style.setProperty("--ddw-h", `${G}px`), a.setAttribute("data-explicit", "");
    }, P = () => {
      b = !1, document.removeEventListener("pointermove", T, { capture: !0 }), document.removeEventListener("pointerup", P, { capture: !0 });
    }, E = (L) => {
      if (W) return;
      b = !0, X = L.clientX, j = L.clientY;
      const y = a.getBoundingClientRect();
      H = y.width, Y = y.height, document.addEventListener("pointermove", T, { capture: !0 }), document.addEventListener("pointerup", P, { capture: !0 });
    };
    return m.addEventListener("pointerdown", E), () => {
      m.removeEventListener("pointerdown", E), document.removeEventListener("pointermove", T, { capture: !0 }), document.removeEventListener("pointerup", P, { capture: !0 });
    };
  }, [n, W]);
  const ht = K(s), gt = K(d), vt = K(f);
  return /* @__PURE__ */ c(
    "div",
    {
      ref: x,
      className: ["dd-window", Z].filter(Boolean).join(" "),
      "data-size": e,
      "data-explicit": dt ? "" : void 0,
      style: ut,
      onPointerDown: J,
      children: /* @__PURE__ */ I("div", { className: "dd-win", children: [
        /* @__PURE__ */ I(
          "div",
          {
            ref: R,
            className: ["dd-win-header", r ? "" : "dd-win-header--no-move"].filter(Boolean).join(" "),
            children: [
              /* @__PURE__ */ c("span", { className: "dd-win-title", children: t }),
              /* @__PURE__ */ I("div", { className: "dd-win-controls", children: [
                /* @__PURE__ */ c(
                  Q,
                  {
                    className: "dd-btn--minimize",
                    icon: ht,
                    disabled: h,
                    onClick: ft,
                    ariaLabel: "minimize"
                  }
                ),
                /* @__PURE__ */ c(
                  Q,
                  {
                    className: "dd-btn--fullscreen",
                    icon: gt,
                    disabled: v,
                    onClick: mt,
                    ariaLabel: "fullscreen"
                  }
                ),
                /* @__PURE__ */ c(
                  Q,
                  {
                    className: "dd-btn--close",
                    icon: vt,
                    disabled: w,
                    onClick: pt,
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
              ...u ? { "--dd-body-overflow": u } : {},
              ...p ? { "--dd-body-overflow": "hidden", padding: 0, display: "flex", flexDirection: "column", flex: "1 1 0", minHeight: 0 } : {}
            },
            children: p ? /* @__PURE__ */ c("div", { className: "dd-win-scroll-content", children: V }) : V
          }
        ),
        n && /* @__PURE__ */ c("div", { ref: O, className: "dd-win-resize-handle" })
      ] })
    }
  );
}
function Ht({
  variant: t = "primary",
  size: e,
  disabled: n = !1,
  action: r,
  minWidth: o,
  width: i,
  height: s,
  fontSize: d,
  px: f,
  py: h,
  onClick: v,
  children: w,
  className: l,
  style: u
}) {
  const p = {
    ...o ? { "--dd-btn-min-w": o } : {},
    ...i ? { "--dd-btn-w": i } : {},
    ...s ? { "--dd-btn-h": s } : {},
    ...d ? { "--dd-btn-fs": d } : {},
    ...f ? { "--dd-btn-px": f } : {},
    ...h ? { "--dd-btn-py": h } : {},
    ...u
  }, g = [
    "btn",
    `btn--${t}`,
    n ? "btn--disable" : "",
    e ? `btn--size-${e}` : "",
    l
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ c(
    "button",
    {
      className: g,
      style: p,
      disabled: n,
      "aria-disabled": n ? "true" : void 0,
      tabIndex: n ? -1 : void 0,
      "data-action": r,
      "aria-label": r,
      onClick: n ? void 0 : v,
      children: w
    }
  );
}
function Yt({ type: t = "notification", message: e, onClose: n }) {
  const [r, o] = A(!0), i = S(e);
  if (B(() => {
    e !== i.current && (i.current = e, o(!0));
  }, [e]), !r) return null;
  const s = () => {
    o(!1), n == null || n();
  };
  return /* @__PURE__ */ I("div", { className: `toast toast-${t}`, children: [
    /* @__PURE__ */ c("button", { className: "toast-btn--close", onClick: s, "aria-label": "close", children: "×" }),
    e
  ] });
}
function Ft({
  type: t = "text",
  label: e,
  layout: n = "block",
  id: r,
  value: o,
  defaultValue: i,
  placeholder: s,
  disabled: d,
  onChange: f,
  className: h,
  style: v
}) {
  const w = it(), l = r ?? w, u = n === "inline" ? { display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "center", gap: "0.5rem" } : {};
  return /* @__PURE__ */ I("div", { className: ["input-grid", h].filter(Boolean).join(" "), style: { ...u, ...v }, children: [
    e && /* @__PURE__ */ c("label", { className: "input-label", htmlFor: l, children: e }),
    /* @__PURE__ */ c(
      "input",
      {
        type: t,
        id: l,
        className: "dreamdesk-input",
        ...o !== void 0 ? { value: o, onChange: f ? (p) => f(p.target.value, p) : void 0 } : { defaultValue: i, onChange: f ? (p) => f(p.target.value, p) : void 0 },
        placeholder: s,
        disabled: d
      }
    )
  ] });
}
const rt = 10, z = 1;
function At(t, e, n, r) {
  const [o, i] = A({ count: 0, segW: rt });
  B(() => {
    if (!r) return;
    const l = t.current;
    if (!l) return;
    const u = () => {
      const k = getComputedStyle(l), M = parseFloat(k.paddingLeft) || 0, V = parseFloat(k.paddingRight) || 0, U = parseFloat(k.borderLeftWidth) || 0, Z = parseFloat(k.borderRightWidth) || 0, x = l.getBoundingClientRect().width - M - V - U - Z, R = Math.max(1, Math.round((x + z) / (rt + z))), O = (x - (R - 1) * z) / R;
      i({ count: R, segW: O });
    };
    let p = null;
    const g = new ResizeObserver(() => {
      p && clearTimeout(p), p = setTimeout(u, 50);
    });
    return g.observe(l), u(), () => {
      g.disconnect(), p && clearTimeout(p);
    };
  }, [r, t]);
  const { count: s, segW: d } = o, f = Math.min(Math.max(e, 0), 100), h = Math.floor(f / 100 * s), v = s * (d + z) - z;
  return Array.from({ length: s }, (l, u) => {
    const p = u < h, g = {
      width: `${d}px`,
      height: "100%",
      marginRight: u < s - 1 ? `${z}px` : "0",
      opacity: p ? 1 : 0.2,
      flexShrink: 0,
      boxSizing: "border-box",
      transition: "opacity 0.3s ease, background 0.3s ease",
      border: "var(--color-window-border, var(--border))",
      boxShadow: "var(--progress-segment-shadow, none)"
    };
    return n ? (g.backgroundImage = "var(--color-progress-gradient, none)", g.backgroundSize = `${v}px 100%`, g.backgroundPosition = `-${u * (d + z)}px 0`, g.backgroundRepeat = "no-repeat", g.backgroundColor = "transparent") : (g.backgroundImage = "none", g.backgroundColor = p ? "var(--color-progress-segment, #a8edea)" : "transparent"), /* @__PURE__ */ c("div", { style: g }, u);
  });
}
function Dt({
  value: t = 0,
  blocky: e = !1,
  gradient: n = !1,
  className: r,
  style: o
}) {
  const i = S(null), s = At(i, t, n, e), d = Math.min(Math.max(t, 0), 100), f = [
    "progress-track",
    e ? "progress-track--blocky" : "",
    r
  ].filter(Boolean).join(" "), h = {
    width: `${d}%`,
    ...t >= 100 ? { borderRight: "none" } : {},
    ...n ? {} : { filter: `hue-rotate(${d * 3.6}deg)` }
  };
  return /* @__PURE__ */ c("div", { ref: i, className: f, style: o, children: e ? s : /* @__PURE__ */ c(
    "div",
    {
      className: ["progress-bar", n ? "progress-bar--gradient" : ""].filter(Boolean).join(" "),
      style: h
    }
  ) });
}
function ot({ children: t, index: e = 0, active: n = !1, onClick: r }) {
  return /* @__PURE__ */ c(
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
function st({ children: t, active: e = !1, style: n }) {
  return /* @__PURE__ */ c(
    "dreamdesk-tab-panel",
    {
      class: e ? "active" : void 0,
      "data-panel": "",
      style: { display: e ? "block" : "none", ...n },
      children: t
    }
  );
}
function _t({
  defaultIndex: t = 0,
  activeIndex: e,
  onChange: n,
  children: r,
  className: o,
  style: i
}) {
  const [s, d] = A(t), f = e ?? s, h = (l) => {
    e === void 0 && d(l), n == null || n(l);
  }, v = [], w = [];
  return bt.forEach(r, (l) => {
    if (xt(l)) {
      if (l.type === ot) {
        const u = v.length;
        v.push(
          /* @__PURE__ */ c(ot, { index: u, active: u === f, onClick: h, children: l.props.children }, u)
        );
      } else if (l.type === st) {
        const u = w.length;
        w.push(
          /* @__PURE__ */ c(st, { active: u === f, style: l.props.style, children: l.props.children }, u)
        );
      }
    }
  }), /* @__PURE__ */ I("div", { className: ["tabs", o].filter(Boolean).join(" "), style: i, children: [
    /* @__PURE__ */ c("div", { className: "tab-list", children: v }),
    /* @__PURE__ */ c("div", { className: "tab-panels", children: w })
  ] });
}
function Vt({ checked: t, defaultChecked: e, onChange: n, style: r, className: o }) {
  const { theme: i } = Et(), s = t !== void 0, d = e ?? i === "dark";
  return /* @__PURE__ */ I("label", { className: ["toggle", o].filter(Boolean).join(" "), style: r, children: [
    /* @__PURE__ */ c(
      "input",
      {
        type: "checkbox",
        checked: s ? t : void 0,
        defaultChecked: s ? void 0 : d,
        onChange: (f) => n == null ? void 0 : n(f.target.checked)
      }
    ),
    /* @__PURE__ */ c("span", { className: "slider", children: /* @__PURE__ */ c("span", { className: "knob" }) })
  ] });
}
function Ot({ children: t, className: e, ...n }) {
  return /* @__PURE__ */ c(
    Bt,
    {
      ...n,
      className: ["terminal-window", e].filter(Boolean).join(" "),
      children: /* @__PURE__ */ c("div", { className: "terminal-win-body", children: t })
    }
  );
}
export {
  Ht as Button,
  Ft as Input,
  Dt as ProgressBar,
  ot as Tab,
  st as TabPanel,
  _t as Tabs,
  Ot as TerminalWindow,
  jt as ThemeProvider,
  Yt as Toast,
  Vt as Toggle,
  Bt as Window,
  Et as useTheme
};
