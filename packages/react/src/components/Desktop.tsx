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

interface DesktopContextValue {
  wm: WindowManager;
  containerRef: RefObject<HTMLDivElement | null>;
}

const DesktopContext = createContext<DesktopContextValue | null>(null);

export interface DesktopProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Desktop({ children, className, style }: DesktopProps) {
  const wm = useMemo(() => new WindowManager(), []);
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <DesktopContext.Provider value={{ wm, containerRef }}>
      <div
        ref={containerRef}
        className={["dd-desktop", className].filter(Boolean).join(" ")}
        style={{ position: "relative", overflow: "hidden", ...style }}
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
