import {
  useRef,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
  type CSSProperties,
} from "react";
import {
  minimize as animMinimize,
  fullscreen as animFullscreen,
  unfullscreen as animUnfullscreen,
  closeAnimation,
  cancelRunningAnimations,
  type PreviousState,
} from "../animations";
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
  onMinimize?: (isMinimized: boolean) => void;
  onFullscreen?: (isFullscreen: boolean) => void;
  onClose?: () => void;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
}

let _z = 1000;

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
  if (trimmed.startsWith("<svg")) return trimmed;
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

  // Raise z-index on click
  const raise = useCallback(() => {
    _z += 1;
    if (hostRef.current) hostRef.current.style.zIndex = String(_z);
  }, []);

  const handleMinimize = useCallback(() => {
    const win = hostRef.current?.querySelector<HTMLElement>(".dd-win");
    if (!win) return;
    const next = !isMinimized;
    animMinimize(win);
    setIsMinimized(next);
    onMinimize?.(next);
  }, [isMinimized, onMinimize]);

  const handleFullscreen = useCallback(() => {
    const host = hostRef.current;
    if (!host) return;
    const goingFull = !isFullscreen;
    if (goingFull) {
      previousStateRef.current = freezeState(host);
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

    let isDragging = false;
    let explicitSet = false;
    let startX = 0;
    let startY = 0;
    let offsetX = 0;
    let offsetY = 0;
    let rafId: number | null = null;
    const DRAG_THRESHOLD = 4;

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      if (!explicitSet) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (dx * dx + dy * dy < DRAG_THRESHOLD * DRAG_THRESHOLD) return;
        const rect = host.getBoundingClientRect();
        host.style.setProperty("--ddw-w", `${rect.width}px`);
        host.style.setProperty("--ddw-h", `${rect.height}px`);
        host.setAttribute("data-explicit", "");
        if (getComputedStyle(host).position === "static") host.style.position = "absolute";
        host.style.left = `${rect.left}px`;
        host.style.top = `${rect.top}px`;
        explicitSet = true;
      }
      const desiredLeft = e.clientX - offsetX;
      const desiredTop = e.clientY - offsetY;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = host.getBoundingClientRect();
        const maxLeft = Math.max(0, window.innerWidth - rect.width);
        const maxTop = Math.max(0, window.innerHeight - rect.height);
        host.style.left = `${Math.max(0, Math.min(desiredLeft, maxLeft))}px`;
        host.style.top = `${Math.max(0, Math.min(desiredTop, maxTop))}px`;
      });
    };

    const onPointerUp = () => {
      isDragging = false;
      explicitSet = false;
      document.removeEventListener("pointermove", onPointerMove, { capture: true });
      document.removeEventListener("pointerup", onPointerUp, { capture: true });
    };

    const onPointerDown = (e: PointerEvent) => {
      if ((e.target as Element).closest(".dd-win-controls")) return;
      const allowFSDrag = fullscreenMode === "expand";
      if (isFullscreen && !allowFSDrag) return;
      cancelRunningAnimations(host);
      const hostRect = host.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      offsetX = e.clientX - hostRect.left;
      offsetY = e.clientY - hostRect.top;
      isDragging = true;
      raise();
      document.addEventListener("pointermove", onPointerMove, { capture: true });
      document.addEventListener("pointerup", onPointerUp, { capture: true });
    };

    header.addEventListener("pointerdown", onPointerDown);
    return () => {
      header.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointermove", onPointerMove, { capture: true });
      document.removeEventListener("pointerup", onPointerUp, { capture: true });
    };
  }, [movable, isFullscreen, fullscreenMode, raise]);

  // Resize
  useEffect(() => {
    const handle = handleRef.current;
    const host = hostRef.current;
    if (!handle || !host || !resizable) return;

    let isResizing = false;
    let startX = 0, startY = 0, startWidth = 0, startHeight = 0;
    const minWidth = 180, minHeight = 120;

    const onPointerMove = (e: PointerEvent) => {
      if (!isResizing) return;
      const newWidth = Math.max(minWidth, startWidth + (e.clientX - startX));
      const newHeight = Math.max(minHeight, startHeight + (e.clientY - startY));
      host.style.setProperty("--ddw-w", `${newWidth}px`);
      host.style.setProperty("--ddw-h", `${newHeight}px`);
      host.setAttribute("data-explicit", "");
    };

    const onPointerUp = () => {
      isResizing = false;
      document.removeEventListener("pointermove", onPointerMove, { capture: true });
      document.removeEventListener("pointerup", onPointerUp, { capture: true });
    };

    const onPointerDown = (e: PointerEvent) => {
      if (isFullscreen) return;
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = host.getBoundingClientRect();
      startWidth = rect.width;
      startHeight = rect.height;
      document.addEventListener("pointermove", onPointerMove, { capture: true });
      document.addEventListener("pointerup", onPointerUp, { capture: true });
    };

    handle.addEventListener("pointerdown", onPointerDown);
    return () => {
      handle.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointermove", onPointerMove, { capture: true });
      document.removeEventListener("pointerup", onPointerUp, { capture: true });
    };
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
          style={bodyOverflow ? { "--dd-body-overflow": bodyOverflow } as React.CSSProperties : undefined}
        >{children}</div>
        {resizable && <div ref={handleRef} className="dd-win-resize-handle" />}
      </div>
    </div>
  );
}
