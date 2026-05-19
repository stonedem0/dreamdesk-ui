// L3.1 — Virtual filesystem
export { VirtualFS } from "./fs/VirtualFS";
export type { FSNode, FSFile, FSDir, FSEvent, WatchCallback } from "./fs/VirtualFS";
export { LocalStorageAdapter } from "./fs/FSAdapter";
export type { FSAdapter } from "./fs/FSAdapter";

// L3.2 — Process manager
export { ProcessManager } from "./process/ProcessManager";
export type { Process, ProcessStatus, ProcessArgs, SpawnOptions } from "./process/ProcessManager";

// L3.3 — Shell engine
export { executeCommand, resolvePath, toWinPath } from "./shell/ShellEngine";
export type { ShellContext, ShellResult } from "./shell/ShellEngine";

// React integration
export { OSProvider, useOS, useFS, useProcessManager } from "./hooks/OSProvider";
export type { OSProviderProps, AppDef } from "./hooks/OSProvider";
