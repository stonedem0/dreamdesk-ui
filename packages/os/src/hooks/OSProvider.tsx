import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
  type ComponentType,
} from "react";
import { VirtualFS } from "../fs/VirtualFS";
import { ProcessManager, type ProcessArgs } from "../process/ProcessManager";
import type { FSAdapter } from "../fs/FSAdapter";

// ── App registry ──────────────────────────────────────────────────────────────

export interface AppDef {
  component: ComponentType<{ pid: string; args: ProcessArgs }>;
  title: string;
  icon?: string;
  extensions?: string[];
  // false = don't restore this app after reload (e.g. transient dialogs)
  persistent?: boolean;
}

// ── Context ───────────────────────────────────────────────────────────────────

interface OSCtx {
  fs: VirtualFS;
  pm: ProcessManager;
  apps: Record<string, AppDef>;
  // Open a file — spawns the registered app or returns null if unknown
  open: (filePath: string) => string | null;
  // Open with a specific app
  openWith: (appId: string, args?: ProcessArgs) => string;
  // All apps that can open a given extension
  appsFor: (ext: string) => Array<{ appId: string; def: AppDef }>;
}

const OSContext = createContext<OSCtx | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export interface OSProviderProps {
  fs?: VirtualFS;
  apps: Record<string, AppDef>;
  adapter?: FSAdapter;
  children?: ReactNode;
}

export function OSProvider({ fs: fsProp, apps, adapter, children }: OSProviderProps) {
  const [fs] = useState(() => fsProp ?? new VirtualFS());
  const [pm] = useState(() => {
    const manager = new ProcessManager();
    // Register extensions from app definitions
    Object.entries(apps).forEach(([appId, def]) => {
      def.extensions?.forEach(ext => manager.registerExtension(ext, appId));
    });
    return manager;
  });

  const [, setTick] = useState(0);
  useEffect(() => pm.subscribe(() => setTick(t => t + 1)), [pm]);

  // Load persisted FS on mount, then save on every change
  useEffect(() => {
    if (!adapter) return;
    adapter.load().then(data => {
      if (data) { fs.deserialize(data); fs.notify(); }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!adapter) return;
    return fs.watch("/", () => adapter.save(fs.serialize()));
  }, [fs, adapter]);

  // Restore running processes on mount, save on every change
  const restoredRef = useRef(false);
  const PROC_KEY = "dreamdesk:processes";
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    try {
      const raw = localStorage.getItem(PROC_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Array<{ appId: string; args: ProcessArgs }>;
      saved.forEach(({ appId, args }) => {
        if (apps[appId] && apps[appId].persistent !== false) pm.spawn(appId, { args });
      });
    } catch {}
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return pm.subscribe(() => {
      const snapshot = pm.list()
        .filter(p => apps[p.appId]?.persistent !== false)
        .map(p => ({ appId: p.appId, args: p.args }));
      try { localStorage.setItem(PROC_KEY, JSON.stringify(snapshot)); } catch {}
    });
  }, [pm, apps]);

  const open = useCallback((filePath: string): string | null => {
    const appId = pm.resolveApp(filePath);
    if (!appId) return null;
    return pm.spawn(appId, { args: { filePath } });
  }, [pm]);

  const openWith = useCallback((appId: string, args?: ProcessArgs): string => {
    return pm.spawn(appId, { args });
  }, [pm]);

  const appsFor = useCallback((ext: string) => {
    return Object.entries(apps)
      .filter(([, def]) => def.extensions?.includes(ext.toLowerCase()))
      .map(([appId, def]) => ({ appId, def }));
  }, [apps]);

  const running = pm.list();

  return (
    <OSContext.Provider value={{ fs, pm, apps, open, openWith, appsFor }}>
      {children}
      {/* Render all running processes */}
      {running.map(proc => {
        const def = apps[proc.appId];
        if (!def) return null;
        const Component = def.component;
        return <Component key={proc.pid} pid={proc.pid} args={proc.args} />;
      })}
    </OSContext.Provider>
  );
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useOS(): OSCtx {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error("useOS must be used inside <OSProvider>");
  return ctx;
}

export function useFS(): VirtualFS {
  return useOS().fs;
}

export function useProcessManager(): ProcessManager {
  return useOS().pm;
}
