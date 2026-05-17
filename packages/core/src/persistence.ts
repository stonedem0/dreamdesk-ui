export interface PersistedWindowState {
  left?: string;
  top?: string;
  width?: string;
  height?: string;
  isOpen?: boolean;
  isMinimized?: boolean;
}

const PREFIX = 'dreamdesk:win:';

export function saveWindowState(id: string, state: PersistedWindowState): void {
  try {
    localStorage.setItem(PREFIX + id, JSON.stringify(state));
  } catch { /* quota exceeded or storage unavailable */ }
}

export function loadWindowState(id: string): PersistedWindowState | null {
  try {
    const raw = localStorage.getItem(PREFIX + id);
    return raw ? (JSON.parse(raw) as PersistedWindowState) : null;
  } catch { return null; }
}

export function clearWindowState(id: string): void {
  try { localStorage.removeItem(PREFIX + id); } catch { /* ignore */ }
}
