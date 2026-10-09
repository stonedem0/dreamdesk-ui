// L3.1 — Virtual filesystem
export { VirtualFS } from "./fs/VirtualFS";
export type { FSNode, FSFile, FSDir, FSEvent, WatchCallback } from "./fs/VirtualFS";
export { LocalStorageAdapter } from "./fs/FSAdapter";
export type { FSAdapter } from "./fs/FSAdapter";
export { useFSVersion } from "./fs/useFSVersion";
export { RecycleBin } from "./fs/RecycleBin";
export type { BinItem } from "./fs/RecycleBin";

// L3.2 — Process manager
export { ProcessManager } from "./process/ProcessManager";
export type { Process, ProcessStatus, ProcessArgs, SpawnOptions, SavedProcess, WindowPosition } from "./process/ProcessManager";
export { useProcesses } from "./process/useProcesses";
export { appsForFile, fileExtension } from "./process/fileAssociations";
export { useProcessState, forgetProcessState, forgetAllProcessState } from "./process/processState";

// L3.3 — Shell engine
export { executeCommand, resolveDosPath, toDosPath, dosPrompt, SHELL_BANNER, SHELL_NAME, SHELL_VERSION } from "./shell/ShellEngine";
export type { ShellContext, ShellResult } from "./shell/ShellEngine";

// React integration
export { OSProvider, useOS, useFS, useProcessManager } from "./hooks/OSProvider";
export type { OSProviderProps, AppDef } from "./hooks/OSProvider";
