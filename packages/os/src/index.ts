// L3.1 — Virtual filesystem
export { VirtualFS } from "./fs/VirtualFS";
export type { FSNode, FSFile, FSDir, FSEvent, WatchCallback } from "./fs/VirtualFS";

// L3.2 — Process manager
export { ProcessManager } from "./process/ProcessManager";
export type { Process, ProcessStatus, SpawnOptions } from "./process/ProcessManager";

// L3.3 — IPC bus
export { IPCBus } from "./ipc/IPCBus";
export type { IPCHandler } from "./ipc/IPCBus";

// React integration
export { OSProvider, useFS, useProcessManager, useIPC } from "./hooks/OSProvider";
