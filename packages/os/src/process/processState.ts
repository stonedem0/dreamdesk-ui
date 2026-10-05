import { useEffect, useState } from "react";

const PREFIX = "dreamdesk:proc-state:";
const storageKey = (pid: string, name: string) => `${PREFIX}${pid}:${name}`;

/**
 * Like useState, but kept across reloads for one process (or window): an
 * explorer's folder, a browser's page, a mail draft. Forget it when the
 * process ends (forgetProcessState), so the app starts fresh next time.
 *
 * `pid` is any stable id for the process; it doesn't need an <OSProvider>.
 * `restore` checks a saved value (it may be stale, or from an older version)
 * and returns it, or undefined to fall back to `initial`.
 */
export function useProcessState<T>(
  pid: string,
  name: string,
  initial: () => T,
  restore: (saved: unknown) => T | undefined,
) {
  const key = storageKey(pid, name);
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        const restored = restore(JSON.parse(raw));
        if (restored !== undefined) return restored;
      }
    } catch { /* unreadable: start fresh */ }
    return initial();
  });

  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch { /* storage unavailable: not remembered */ }
  }, [key, value]);

  return [value, setValue] as const;
}

function forget(prefix: string) {
  try {
    const keys = Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i)).filter(
      (k): k is string => k !== null && k.startsWith(prefix),
    );
    for (const k of keys) localStorage.removeItem(k);
  } catch { /* nothing saved to forget */ }
}

/** Forgets everything one process remembered; call when it ends. */
export const forgetProcessState = (pid: string) => forget(`${PREFIX}${pid}:`);

/** Forgets every process's state (e.g. a "reset desktop"). */
export const forgetAllProcessState = () => forget(PREFIX);
