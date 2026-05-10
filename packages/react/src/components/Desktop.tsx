import {
  createContext,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
  type CSSProperties,
  type RefObject,
} from "react";
import { WindowManager, defaultWindowManager } from "@dreamdesk/core";
import "./Desktop.css";

const TASKBAR_H_DEFAULT = 36;

interface DesktopContextValue {
  wm: WindowManager;
  containerRef: RefObject<HTMLDivElement | null>;
  taskbarHeight: number;
}

const DesktopContext = createContext<DesktopContextValue | null>(null);

export interface DesktopProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  taskbarHeight?: number;
}

export function Desktop({ children, className, style, taskbarHeight = TASKBAR_H_DEFAULT }: DesktopProps) {
  const wm = useMemo(() => new WindowManager(), []);
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <DesktopContext.Provider value={{ wm, containerRef, taskbarHeight }}>
      <div
        ref={containerRef}
        className={["dd-desktop", className].filter(Boolean).join(" ")}
        style={{
          "--dd-taskbar-h": `${taskbarHeight}px`,
          ...style,
        } as CSSProperties}
      >
        {children}
      </div>
    </DesktopContext.Provider>
  );
}

export function useWindowManager(): WindowManager {
  return useContext(DesktopContext)?.wm ?? defaultWindowManager;
}

export function useDesktopContainer(): RefObject<HTMLDivElement | null> | null {
  return useContext(DesktopContext)?.containerRef ?? null;
}

export function useDesktopTaskbarHeight(): number {
  return useContext(DesktopContext)?.taskbarHeight ?? 0;
}
