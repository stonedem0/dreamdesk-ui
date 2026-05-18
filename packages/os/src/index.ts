// L3.1 — Virtual filesystem
export { VirtualFS } from "./fs/VirtualFS";
export type { FSNode, FSFile, FSDir, FSEvent, WatchCallback } from "./fs/VirtualFS";

// L3.2 — Process manager
export { ProcessManager } from "./process/ProcessManager";
export type { Process, ProcessStatus, ProcessArgs, SpawnOptions } from "./process/ProcessManager";

// React integration
export { OSProvider, useOS, useFS, useProcessManager } from "./hooks/OSProvider";
export type { OSProviderProps, AppDef } from "./hooks/OSProvider";
