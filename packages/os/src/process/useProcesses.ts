import { useCallback, useSyncExternalStore } from "react";
import type { Process, ProcessManager } from "./ProcessManager";

/**
 * The running processes, re-rendering when they change (started, ended,
 * focused, moved, renamed). Works with any ProcessManager, inside an
 * <OSProvider> or not.
 */
export function useProcesses(pm: ProcessManager): Process[] {
  const subscribe = useCallback((onChange: () => void) => pm.subscribe(onChange), [pm]);
  return useSyncExternalStore(subscribe, () => pm.list());
}
