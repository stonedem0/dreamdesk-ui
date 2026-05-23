import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useId,
  type ReactNode,
  type CSSProperties,
} from "react";
import {
  open as animOpen,
  minimize as animMinimize,
  unminimize as animUnminimize,
  fullscreen as animFullscreen,
  unfullscreen as animUnfullscreen,
  unsnap as animUnsnap,
  close as closeAnimation,
  setupDrag,
  setupResize,
  snapRect,
  saveWindowState,
  loadWindowState,
  type PreviousState,
} from "@dreamdesk/core";
import { useWindowManager, useDesktopContainer, useDesktopTaskbarHeight } from "./Desktop";
import { sanitizeSvg } from "../utils/svg";
import { Icon } from "./Icon";
import "./Window.css";

export interface WindowProps {
  windowId?: string;
  title?: string;
  icon?: string;
  size?: "sm" | "md" | "lg";
  resizable?: boolean;
  movable?: boolean;
  width?: string;
  height?: string;
  minimizeIcon?: string;
  fullscreenIcon?: string;
  closeIcon?: string;
  disableMinimize?: boolean | string;
  disableFullscreen?: boolean | string;
  disableClose?: boolean | string;
  fullscreenMode?: "expand";
  bodyOverflow?: "auto" | "hidden" | "scroll";
  scrollContent?: boolean;
  onMinimize?: (isMinimized: boolean) => void;
  onFullscreen?: (isFullscreen: boolean) => void;
  fullscreenAnimation?: (el: HTMLElement, opts: { isFullscreen: boolean; defaultFn: () => void }) => void;
  defaultOpen?: boolean;
  onClose?: () => void;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
}


function freezeState(el: HTMLElement): PreviousState {
  const rect = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  return {
    top: rect.top + (window.scrollY || 0),
    left: rect.left + (window.scrollX || 0),
    width: rect.width,
    height: rect.height,
    position: cs.position || "relative",
    zIndex: cs.zIndex === "auto" ? "" : cs.zIndex,
  };
}


function resolveIcon(iconProp?: string) {
  if (!iconProp) return null;
  const trimmed = iconProp.trim();
  if (trimmed.startsWith("<svg")) return sanitizeSvg(trimmed) || null;
  return null;
}

function ControlButton({
  className,
  icon,
  disabled,
  tooltip,
  onClick,
  ariaLabel,
}: {
  className: string;
  icon?: string | null;
  disabled?: boolean | string;
  tooltip?: string;
  onClick: () => void;
  ariaLabel: string;
}) {
  const isDisabled = disabled !== undefined && disabled !== false && disabled !== "false" && disabled !== "0";
  const tipText = typeof disabled === "string" && disabled !== "true" && disabled !== "1"
    ? disabled
    : tooltip;

  const handleClick = (e: React.MouseEvent) => {
    if (isDisabled) { e.preventDefault(); return; }
    onClick();
  };

  return (
    <button
      className={className}
      aria-label={ariaLabel}
      aria-disabled={isDisabled ? "true" : undefined}
      tabIndex={isDisabled ? -1 : undefined}
      data-tooltip={isDisabled && tipText ? tipText : undefined}
      onClick={handleClick}
      dangerouslySetInnerHTML={icon ? { __html: icon } : undefined}
    />
  );
}

export function Window({
  windowId: windowIdProp,
  title = "Window",
  icon,
  size,
  resizable = true,
  movable = true,
  width,
  height,
  minimizeIcon,
  fullscreenIcon,
  closeIcon,
  disableMinimize,
  disableFullscreen,
  disableClose,
  fullscreenMode,
  bodyOverflow,
  scrollContent,
  onMinimize,
  onFullscreen,
  fullscreenAnimation,
  defaultOpen = true,
  onClose,
  children,
  style,
  className,
}: WindowProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const windowId = windowIdProp ?? generatedId;
  const wm = useWindowManager();
  const desktopRef = useDesktopContainer();
  const taskbarHeight = useDesktopTaskbarHeight();

  const persisted = windowIdProp ? loadWindowState(windowIdProp) : null;
  const [isMinimized, setIsMinimized] = useState(persisted?.isMinimized ?? false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const previousStateRef = useRef<PreviousState | null>(null);
  const preSnapStateRef = useRef<{ left: string; top: string; width: string; height: string } | null>(null);

  // Explicit size from props
  const hasExplicitSize = !!(width || height);

  const cssVars: CSSProperties = {
    ...(width ? { "--ddw-w": width } as CSSProperties : {}),
    ...(height ? { "--ddw-h": height } as CSSProperties : {}),
    ...(desktopRef ? { position: "absolute" } : {}),
    ...style,
  };

  const toggleRef = useRef<() => void>(() => {});
  const closeRef = useRef<() => void>(() => {});

  const saveState = useCallback((overrides: { isOpen?: boolean; isMinimized?: boolean } = {}) => {
    if (!windowIdProp) return;
    const el = hostRef.current;
    if (!el) return;
    saveWindowState(windowIdProp, {
      left: el.style.left,
      top: el.style.top,
      width: el.style.getPropertyValue("--ddw-w"),
      height: el.style.getPropertyValue("--ddw-h"),
      isOpen: el.style.display !== "none",
      isMinimized,
      ...overrides,
    });
  }, [windowIdProp, isMinimized]);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    // Restore persisted position/size
    const saved = windowIdProp ? loadWindowState(windowIdProp) : null;
    if (saved) {
      if (saved.left) el.style.left = saved.left;
      if (saved.top) el.style.top = saved.top;
      if (saved.width) el.style.setProperty("--ddw-w", saved.width);
      if (saved.height) el.style.setProperty("--ddw-h", saved.height);
      if (saved.width || saved.height) el.setAttribute("data-explicit", "");
    }

    const shouldOpen = defaultOpen || (saved?.isOpen ?? false);
    if (!shouldOpen) el.style.display = "none";

    if (shouldOpen) {
      // Center on first open if no saved/explicit position
      const hasSavedPos = !!(saved?.left || saved?.top);
      const hasStylePos = !!(el.style.left || el.style.top);
      if (!hasSavedPos && !hasStylePos) {
        const container = desktopRef?.current;
        if (container) {
          const th = taskbarHeight;
          const cw = container.offsetWidth;
          const ch = container.offsetHeight - th;
          const ww = el.offsetWidth;
          const wh = el.offsetHeight;
          const { dx, dy } = wm.getCascadeOffset();
          el.style.left = `${Math.max(8, (cw - ww) / 2 + dx)}px`;
          el.style.top = `${Math.max(8, (ch - wh) / 2 + dy)}px`;
        }
      }
      // Play open animation unless this is a page-reload restoration (was already open)
      if (!saved || saved.isOpen === false) {
        const inner = el.querySelector<HTMLElement>(".dd-win");
        if (inner) animOpen(inner);
      }
      // Restore minimized visual state
      if (saved?.isMinimized) {
        const inner = el.querySelector<HTMLElement>(".dd-win");
        if (inner) {
          inner.style.transformOrigin = "50% 100%";
          inner.style.transform = "scale(0)";
        }
        el.style.pointerEvents = "none";
      }
      wm.register(windowId, el, title ?? "Window", { icon, toggle: () => toggleRef.current() });
      if (saved?.isMinimized) wm.minimize(windowId);
    }

    wm.registerClose(windowId, () => closeRef.current());
    wm.registerOpen(windowId, () => {
      if (!el || !document.contains(el)) return;
      el.style.display = "";
      const hasSavedPos = !!(saved?.left || saved?.top);
      const hasStylePos = !!(el.style.left || el.style.top);
      if (!hasSavedPos && !hasStylePos) {
        const container = desktopRef?.current;
        if (container) {
          const th = taskbarHeight;
          const cw = container.offsetWidth;
          const ch = container.offsetHeight - th;
          const ww = el.offsetWidth;
          const wh = el.offsetHeight;
          const { dx, dy } = wm.getCascadeOffset();
          el.style.left = `${Math.max(8, (cw - ww) / 2 + dx)}px`;
          el.style.top = `${Math.max(8, (ch - wh) / 2 + dy)}px`;
        }
      }
      const inner = el.querySelector<HTMLElement>(".dd-win");
      if (inner) {
        inner.getAnimations().forEach((a) => a.cancel());
        inner.style.transform = "";
        inner.style.transformOrigin = "";
        animOpen(inner);
      }
      wm.register(windowId, el, title ?? "Window", { icon, toggle: () => toggleRef.current() });
      wm.raise(windowId);
      saveState({ isOpen: true, isMinimized: false });
    });
    return () => wm.unregister(windowId);
  }, [windowId, title, icon, wm]);

  const raise = useCallback(() => {
    wm.raise(windowId);
  }, [windowId]);

  const handleMinimize = useCallback(() => {
    const win = hostRef.current?.querySelector<HTMLElement>(".dd-win");
    const host = hostRef.current;
    if (!win || !host) return;
    const next = !isMinimized;
    if (next) {
      animMinimize(win);
      wm.minimize(windowId);
      host.style.pointerEvents = "none";
    } else {
      win.style.transform = "";
      win.style.transformOrigin = "";
      animUnminimize(win);
      wm.restore(windowId);
      host.style.pointerEvents = "";
    }
    setIsMinimized(next);
    onMinimize?.(next);
    saveState({ isMinimized: next });
  }, [isMinimized, onMinimize, windowId, wm, saveState]);

  toggleRef.current = handleMinimize;

  const handleFullscreen = useCallback(() => {
    const host = hostRef.current;
    if (!host) return;
    // If window is currently snapped, restore to pre-snap position instead of toggling fullscreen
    if (!isFullscreen && preSnapStateRef.current) {
      const pre = preSnapStateRef.current;
      preSnapStateRef.current = null;
      const fromRect = host.getBoundingClientRect();
      host.style.left = pre.left;
      host.style.top = pre.top;
      host.style.setProperty("--ddw-w", pre.width);
      host.style.setProperty("--ddw-h", pre.height);
      animUnsnap(host, fromRect);
      return;
    }
    const goingFull = !isFullscreen;
    const defaultFn = () => {
      if (goingFull) {
        previousStateRef.current = freezeState(host);
        host.setAttribute("data-explicit", "");
        animFullscreen(host, previousStateRef.current);
      } else {
        if (previousStateRef.current) animUnfullscreen(host, previousStateRef.current);
      }
    };
    if (fullscreenAnimation) {
      fullscreenAnimation(host, { isFullscreen: goingFull, defaultFn });
    } else {
      defaultFn();
    }
    setIsFullscreen(goingFull);
    onFullscreen?.(goingFull);
  }, [isFullscreen, onFullscreen, fullscreenAnimation]);

  const handleClose = useCallback(() => {
    const win = hostRef.current?.querySelector<HTMLElement>(".dd-win");
    const host = hostRef.current;
    if (!win || !host) return;
    closeAnimation(win, () => {
      host.style.display = "none";
      wm.unregister(windowId);
      if (windowIdProp) saveWindowState(windowIdProp, { isOpen: false });
      onClose?.();
    });
  }, [onClose, wm, windowId, windowIdProp]);

  closeRef.current = handleClose;

  // Dragging
  useEffect(() => {
    const header = headerRef.current;
    const host = hostRef.current;
    if (!header || !host || !movable) return;

    const container = desktopRef?.current ?? null;

    let snapOverlay: HTMLElement | null = null;
    if (container) {
      snapOverlay = document.createElement("div");
      snapOverlay.style.cssText =
        "position:absolute;pointer-events:none;background:rgba(100,150,255,0.18);border:2px solid rgba(100,150,255,0.45);border-radius:4px;z-index:9998;transition:top 0.08s,left 0.08s,width 0.08s,height 0.08s;display:none;box-sizing:border-box";
      container.appendChild(snapOverlay);
    }

    const cleanup = setupDrag({
      handle: header,
      host,
      container,
      reservedBottom: taskbarHeight,
      exclude: ".dd-win-controls",
      disabled: () => isFullscreen && fullscreenMode !== "expand",
      onStart: (hostRect) => {
        preSnapStateRef.current = null;
        if (!host.hasAttribute("data-explicit")) {
          host.style.setProperty("--ddw-w", `${hostRect.width}px`);
          host.style.setProperty("--ddw-h", `${hostRect.height}px`);
          host.setAttribute("data-explicit", "");
        }
        const pos = getComputedStyle(host).position;
        if (pos === "static" || pos === "relative") {
          const containerRect = container?.getBoundingClientRect();
          host.style.position = "absolute";
          host.style.left = `${hostRect.left + (window.scrollX || 0) - (containerRect?.left ?? 0)}px`;
          host.style.top = `${hostRect.top + (window.scrollY || 0) - (containerRect?.top ?? 0)}px`;
        }
        raise();
      },
      onSnap: (zone) => {
        if (!snapOverlay || !container) return;
        if (zone === "none") { snapOverlay.style.display = "none"; return; }
        const cr = container.getBoundingClientRect();
        const rect = snapRect(zone, cr.width, cr.height - taskbarHeight);
        if (!rect) { snapOverlay.style.display = "none"; return; }
        snapOverlay.style.display = "block";
        snapOverlay.style.left = `${rect.left}px`;
        snapOverlay.style.top = `${rect.top}px`;
        snapOverlay.style.width = `${rect.width}px`;
        snapOverlay.style.height = `${rect.height}px`;
      },
      onSnapCommit: (zone) => {
        if (snapOverlay) snapOverlay.style.display = "none";
        if (!container) return;
        const cr = container.getBoundingClientRect();
        const rect = snapRect(zone, cr.width, cr.height - taskbarHeight);
        if (!rect) return;
        preSnapStateRef.current = {
          left: host.style.left,
          top: host.style.top,
          width: host.style.getPropertyValue("--ddw-w"),
          height: host.style.getPropertyValue("--ddw-h"),
        };
        host.style.left = `${rect.left}px`;
        host.style.top = `${rect.top}px`;
        host.style.setProperty("--ddw-w", `${rect.width}px`);
        host.style.setProperty("--ddw-h", `${rect.height}px`);
        host.setAttribute("data-explicit", "");
      },
      onEnd: () => saveState(),
    });

    return () => {
      cleanup();
      snapOverlay?.remove();
    };
  }, [movable, isFullscreen, fullscreenMode, raise, desktopRef, taskbarHeight, saveState]);

  // Resize
  useEffect(() => {
    const handle = handleRef.current;
    const host = hostRef.current;
    if (!handle || !host || !resizable) return;
    return setupResize({
      handle,
      host,
      disabled: () => isFullscreen,
      onEnd: () => saveState(),
    });
  }, [resizable, isFullscreen, saveState]);

  const minSvg = resolveIcon(minimizeIcon);
  const fsSvg = resolveIcon(fullscreenIcon);
  const closeSvg = resolveIcon(closeIcon);

  return (
    <div
      ref={hostRef}
      className={["dd-window", className].filter(Boolean).join(" ")}
      data-size={size}
      data-explicit={hasExplicitSize ? "" : undefined}
      style={cssVars}
      onPointerDown={raise}
    >
      <div className="dd-win">
        <div
          ref={headerRef}
          className={["dd-win-header", !movable ? "dd-win-header--no-move" : ""].filter(Boolean).join(" ")}
        >
          <div className="dd-win-title-group">
            {icon && <Icon src={icon} size={16} className="dd-win-title-icon" />}
            <span className="dd-win-title">{title}</span>
          </div>
          <div className="dd-win-controls">
            <ControlButton
              className="dd-btn--minimize"
              icon={minSvg}
              disabled={disableMinimize}
              onClick={handleMinimize}
              ariaLabel="minimize"
            />
            <ControlButton
              className="dd-btn--fullscreen"
              icon={fsSvg}
              disabled={disableFullscreen}
              onClick={handleFullscreen}
              ariaLabel="fullscreen"
            />
            <ControlButton
              className="dd-btn--close"
              icon={closeSvg}
              disabled={disableClose}
              onClick={handleClose}
              ariaLabel="close"
            />
          </div>
        </div>
        <div
          className="dd-win-body"
          style={{
            ...(bodyOverflow ? { "--dd-body-overflow": bodyOverflow } as React.CSSProperties : {}),
            ...(scrollContent ? { "--dd-body-overflow": "hidden", padding: 0, display: "flex", flexDirection: "column", flex: "1 1 0", minHeight: 0 } as React.CSSProperties : {}),
          }}
        >
          {scrollContent ? <div className="dd-win-scroll-content">{children}</div> : children}
        </div>
        {resizable && <div ref={handleRef} className="dd-win-resize-handle" />}
      </div>
    </div>
  );
}
