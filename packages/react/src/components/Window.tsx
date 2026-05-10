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
  minimize as animMinimize,
  unminimize as animUnminimize,
  fullscreen as animFullscreen,
  unfullscreen as animUnfullscreen,
  close as closeAnimation,
  setupDrag,
  setupResize,
  defaultWindowManager,
  type PreviousState,
} from "@dreamdesk/core";
import "./Window.css";

export interface WindowProps {
  title?: string;
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

function sanitizeSvg(raw: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(raw, "image/svg+xml");
    if (doc.querySelector("parsererror")) return "";
    const walk = (node: Element) => {
      if (node.tagName.toLowerCase() === "script") {
        node.parentNode?.removeChild(node);
        return;
      }
      for (const attr of Array.from(node.attributes)) {
        if (attr.name.startsWith("on") || attr.value.toLowerCase().includes("javascript:")) {
          node.removeAttribute(attr.name);
        }
      }
      Array.from(node.children).forEach(walk);
    };
    walk(doc.documentElement);
    return new XMLSerializer().serializeToString(doc.documentElement);
  } catch {
    return "";
  }
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
  title = "Window",
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
  onClose,
  children,
  style,
  className,
}: WindowProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const windowId = useId();

  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const previousStateRef = useRef<PreviousState | null>(null);

  // Explicit size from props
  const hasExplicitSize = !!(width || height);

  const cssVars: CSSProperties = {
    ...(width ? { "--ddw-w": width } as CSSProperties : {}),
    ...(height ? { "--ddw-h": height } as CSSProperties : {}),
    ...style,
  };

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    defaultWindowManager.register(windowId, el, title ?? "Window");
    return () => defaultWindowManager.unregister(windowId);
  }, [windowId, title]);

  const raise = useCallback(() => {
    defaultWindowManager.raise(windowId);
  }, [windowId]);

  const handleMinimize = useCallback(() => {
    const win = hostRef.current?.querySelector<HTMLElement>(".dd-win");
    if (!win) return;
    const next = !isMinimized;
    if (next) {
      animMinimize(win);
      defaultWindowManager.minimize(windowId);
    } else {
      animUnminimize(win);
      defaultWindowManager.restore(windowId);
    }
    setIsMinimized(next);
    onMinimize?.(next);
  }, [isMinimized, onMinimize, windowId]);

  const handleFullscreen = useCallback(() => {
    const host = hostRef.current;
    if (!host) return;
    const goingFull = !isFullscreen;
    if (goingFull) {
      previousStateRef.current = freezeState(host);
      host.setAttribute("data-explicit", "");
      animFullscreen(host, previousStateRef.current);
    } else {
      if (previousStateRef.current) animUnfullscreen(host, previousStateRef.current);
    }
    const next = goingFull;
    setIsFullscreen(next);
    onFullscreen?.(next);
  }, [isFullscreen, onFullscreen]);

  const handleClose = useCallback(() => {
    const win = hostRef.current?.querySelector<HTMLElement>(".dd-win");
    if (!win) return;
    closeAnimation(win, () => {
      if (hostRef.current) hostRef.current.style.display = "none";
      onClose?.();
    });
  }, [onClose]);

  // Dragging
  useEffect(() => {
    const header = headerRef.current;
    const host = hostRef.current;
    if (!header || !host || !movable) return;
    return setupDrag({
      handle: header,
      host,
      exclude: ".dd-win-controls",
      disabled: () => isFullscreen && fullscreenMode !== "expand",
      onStart: (hostRect) => {
        if (!host.hasAttribute("data-explicit")) {
          host.style.setProperty("--ddw-w", `${hostRect.width}px`);
          host.style.setProperty("--ddw-h", `${hostRect.height}px`);
          host.setAttribute("data-explicit", "");
        }
        const pos = getComputedStyle(host).position;
        if (pos === "static" || pos === "relative") {
          host.style.position = "absolute";
          host.style.left = `${hostRect.left + (window.scrollX || 0)}px`;
          host.style.top = `${hostRect.top + (window.scrollY || 0)}px`;
        }
        raise();
      },
    });
  }, [movable, isFullscreen, fullscreenMode, raise]);

  // Resize
  useEffect(() => {
    const handle = handleRef.current;
    const host = hostRef.current;
    if (!handle || !host || !resizable) return;
    return setupResize({
      handle,
      host,
      disabled: () => isFullscreen,
    });
  }, [resizable, isFullscreen]);

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
          <span className="dd-win-title">{title}</span>
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
