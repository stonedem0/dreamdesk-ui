import { useCallback, useRef, useSyncExternalStore } from "react";
import type { VirtualFS } from "./VirtualFS";

/**
 * Re-renders the component when anything at or directly under `path` changes
 * ("/" for any change), and returns a number that goes up with each change, to
 * use as a dependency for values derived from the filesystem.
 * Works with any VirtualFS, inside an <OSProvider> or not.
 */
export function useFSVersion(fs: VirtualFS, path = "/"): number {
  const version = useRef(0);
  const subscribe = useCallback(
    (onChange: () => void) => fs.watch(path, () => { version.current++; onChange(); }),
    [fs, path],
  );
  return useSyncExternalStore(subscribe, () => version.current);
}
