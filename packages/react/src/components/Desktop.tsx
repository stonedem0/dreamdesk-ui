import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
  type CSSProperties,
  type RefObject,
} from "react";
import { WindowManager, defaultWindowManager, AppDef } from "@dreamdesk/core";
import { Window } from "./Window";
import "./Desktop.css";

const TASKBAR_H_DEFAULT = 36;

export interface ReactAppDef extends AppDef {
  component: ComponentType;
}

interface LaunchedApp {
  instanceId: string;
  def: ReactAppDef;
}

interface DesktopContextValue {
  wm: WindowManager;
  containerRef: RefObject<HTMLDivElement | null>;
  taskbarHeight: number;
  registerApp: (def: ReactAppDef) => void;
  launch: (appId: string) => string | null;
  closeApp: (instanceId: string) => void;
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
  const appRegistry = useRef(new Map<string, ReactAppDef>());
  const [launchedApps, setLaunchedApps] = useState<LaunchedApp[]>([]);

  const registerApp = useCallback((def: ReactAppDef) => {
    appRegistry.current.set(def.id, def);
  }, []);

  const launch = useCallback((appId: string): string | null => {
    const def = appRegistry.current.get(appId);
    if (!def) return null;
    const instanceId = `${appId}__${Math.random().toString(36).slice(2)}`;
    setLaunchedApps((prev) => [...prev, { instanceId, def }]);
    return instanceId;
  }, []);

  const closeApp = useCallback((instanceId: string) => {
    setLaunchedApps((prev) => prev.filter((a) => a.instanceId !== instanceId));
  }, []);

  return (
    <DesktopContext.Provider value={{ wm, containerRef, taskbarHeight, registerApp, launch, closeApp }}>
      <div
        ref={containerRef}
        className={["dd-desktop", className].filter(Boolean).join(" ")}
        style={{
          "--dd-taskbar-h": `${taskbarHeight}px`,
          ...style,
        } as CSSProperties}
      >
        {children}
        {launchedApps.map(({ instanceId, def }) => (
          <Window
            key={instanceId}
            title={def.title}
            icon={def.icon}
            width={def.defaultWidth}
            height={def.defaultHeight}
            onClose={() => closeApp(instanceId)}
          >
            <def.component />
          </Window>
        ))}
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

export function useDesktop() {
  const ctx = useContext(DesktopContext);
  if (!ctx) throw new Error("useDesktop must be used inside <Desktop>");
  return { launch: ctx.launch, registerApp: ctx.registerApp, closeApp: ctx.closeApp };
}
