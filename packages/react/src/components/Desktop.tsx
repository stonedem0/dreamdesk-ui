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
import { useContextMenu, type ContextMenuItem } from "./ContextMenu";
import "./Desktop.css";

const TASKBAR_H_DEFAULT = 36;
const CASCADE_BASE = 40;
const CASCADE_STEP = 24;
const CASCADE_MAX = 10;

export interface ReactAppDef extends AppDef {
  component: ComponentType;
}

interface LaunchedApp {
  instanceId: string;
  def: ReactAppDef;
  top: number;
  left: number;
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
  contextMenuItems?: ContextMenuItem[];
}

export function Desktop({ children, className, style, taskbarHeight = TASKBAR_H_DEFAULT, contextMenuItems = [] }: DesktopProps) {
  const wm = useMemo(() => new WindowManager(), []);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onContextMenu, contextMenu } = useContextMenu(contextMenuItems);
  const appRegistry = useRef(new Map<string, ReactAppDef>());
  const [launchedApps, setLaunchedApps] = useState<LaunchedApp[]>([]);
  const cascadeCount = useRef(0);

  const registerApp = useCallback((def: ReactAppDef) => {
    appRegistry.current.set(def.id, def);
  }, []);

  const launch = useCallback((appId: string): string | null => {
    const def = appRegistry.current.get(appId);
    if (!def) return null;
    const instanceId = `${appId}__${Math.random().toString(36).slice(2)}`;
    const step = cascadeCount.current % CASCADE_MAX;
    const top = CASCADE_BASE + step * CASCADE_STEP;
    const left = CASCADE_BASE + step * CASCADE_STEP;
    cascadeCount.current++;
    setLaunchedApps((prev) => [...prev, { instanceId, def, top, left }]);
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
        onContextMenu={onContextMenu}
      >
        {children}
        {contextMenu}
        {launchedApps.map(({ instanceId, def, top, left }) => (
          <Window
            key={instanceId}
            title={def.title}
            icon={def.icon}
            width={def.defaultWidth}
            height={def.defaultHeight}
            style={{ top, left }}
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
