import { fileExtension } from "./fileAssociations";

export type ProcessArgs = Record<string, string>;
export type ProcessStatus = "running" | "closed";

export interface WindowPosition {
  x: number;
  y: number;
}

/** A running app. Replaced, never changed in place, so a changed process is a new object. */
export interface Process {
  pid: string;
  appId: string;
  args: ProcessArgs;
  status: ProcessStatus;
  /** Its window's title. */
  title?: string;
  /** Where its window is, once placed. */
  position?: WindowPosition;
  /** Stacking order: higher is in front. */
  z: number;
}

export interface SpawnOptions {
  args?: ProcessArgs;
  /**
   * A fixed id instead of a generated one. Spawning an id that's already
   * running brings that process to the front instead of starting another:
   * one Explorer, one window per document, and so on.
   */
  pid?: string;
  title?: string;
  position?: WindowPosition;
}

/** A process as serialize() saves it, and restore() reads it back. */
export interface SavedProcess {
  pid?: string;
  appId: string;
  args?: ProcessArgs;
  title?: string;
  position?: WindowPosition;
  z?: number;
}

const isPosition = (p: unknown): p is WindowPosition =>
  typeof p === "object" && p !== null &&
  typeof (p as WindowPosition).x === "number" && typeof (p as WindowPosition).y === "number";

export class ProcessManager {
  private processes: Map<string, Process> = new Map();
  private extensions: Map<string, string> = new Map(); // ext → appId
  private listeners: Set<() => void> = new Set();
  private counter = 0;
  // What list() returns until something changes, so it can be a React snapshot
  private snapshot: Process[] = [];

  // ── App / extension registration ────────────────────────────────────────────

  registerExtension(ext: string, appId: string): void {
    this.extensions.set(ext.toLowerCase(), appId);
  }

  defaultAppFor(ext: string): string | null {
    return this.extensions.get(ext.toLowerCase()) ?? null;
  }

  registeredExtensions(): string[] {
    return Array.from(this.extensions.keys());
  }

  // ── Process lifecycle ────────────────────────────────────────────────────────

  spawn(appId: string, options: SpawnOptions = {}): string {
    if (options.pid !== undefined && this.processes.has(options.pid)) {
      this.focus(options.pid);
      return options.pid;
    }
    const pid = options.pid ?? `${appId}-${++this.counter}`;
    this.processes.set(pid, {
      pid, appId, args: options.args ?? {}, status: "running",
      title: options.title, position: options.position, z: this.topZ() + 1,
    });
    this.notify();
    return pid;
  }

  kill(pid: string): void {
    if (!this.processes.delete(pid)) return;
    this.notify();
  }

  get(pid: string): Process | null {
    return this.processes.get(pid) ?? null;
  }

  /** Running processes, in the order they started. The same array until something changes. */
  list(): Process[] {
    return this.snapshot;
  }

  // ── Windows ──────────────────────────────────────────────────────────────────

  /** Brings a process's window to the front. */
  focus(pid: string): void {
    const proc = this.processes.get(pid);
    if (!proc) return;
    const top = this.topZ();
    const alreadyInFront = proc.z === top && this.snapshot.filter((p) => p.z === top).length === 1;
    if (alreadyInFront) return;
    this.update(pid, { z: top + 1 });
  }

  move(pid: string, position: WindowPosition): void {
    const proc = this.processes.get(pid);
    if (!proc || (proc.position?.x === position.x && proc.position?.y === position.y)) return;
    this.update(pid, { position: { x: position.x, y: position.y } });
  }

  setTitle(pid: string, title: string): void {
    if (!this.processes.has(pid) || this.processes.get(pid)?.title === title) return;
    this.update(pid, { title });
  }

  /** Process ids from back to front. */
  stackOrder(): string[] {
    return [...this.snapshot].sort((a, b) => a.z - b.z).map((p) => p.pid);
  }

  // ── Saving and restoring (e.g. across a page reload) ─────────────────────────

  /** The running processes, as JSON for restore(); `keep` leaves some out. */
  serialize(keep: (p: Process) => boolean = () => true): string {
    const saved: SavedProcess[] = this.snapshot.filter(keep).map(({ pid, appId, args, title, position, z }) =>
      ({ pid, appId, args, title, position, z }));
    return JSON.stringify(saved);
  }

  /**
   * Starts the processes serialize() saved, in front of any already running,
   * keeping their stacking order. `keep` skips some (e.g. apps that no longer
   * exist). Unreadable entries are skipped; returns false when the data can't
   * be read at all.
   */
  restore(data: string | SavedProcess[], keep: (p: SavedProcess) => boolean = () => true): boolean {
    let saved: unknown;
    try { saved = typeof data === "string" ? JSON.parse(data) : data; }
    catch { return false; }
    if (!Array.isArray(saved)) return false;

    const valid = (saved as unknown[]).filter((p): p is SavedProcess =>
      typeof p === "object" && p !== null &&
      typeof (p as SavedProcess).appId === "string" &&
      ((p as SavedProcess).pid === undefined || typeof (p as SavedProcess).pid === "string") &&
      !this.processes.has((p as SavedProcess).pid ?? "") &&
      keep(p as SavedProcess));
    // Same order as saved, renumbered from just above what's running
    const order = [...valid].sort((a, b) => (typeof a.z === "number" ? a.z : 0) - (typeof b.z === "number" ? b.z : 0));
    const base = this.topZ();
    for (const p of valid) {
      // Generated ids carry on from the restored ones rather than clashing
      const n = p.pid?.match(/-(\d+)$/);
      if (n) this.counter = Math.max(this.counter, Number(n[1]));
    }
    for (const p of valid) {
      const pid = p.pid ?? `${p.appId}-${++this.counter}`;
      if (this.processes.has(pid)) continue;
      this.processes.set(pid, {
        pid, appId: p.appId, status: "running",
        args: typeof p.args === "object" && p.args !== null ? p.args : {},
        title: typeof p.title === "string" ? p.title : undefined,
        position: isPosition(p.position) ? { x: p.position.x, y: p.position.y } : undefined,
        z: base + order.indexOf(p) + 1,
      });
    }
    if (valid.length) this.notify();
    return true;
  }

  // ── Open by file path ────────────────────────────────────────────────────────

  // Returns the appId that would handle this file, or null if none registered.
  // The React layer decides whether to spawn directly or show an "Open with" dialog.
  resolveApp(filePath: string): string | null {
    const ext = fileExtension(filePath);
    return ext ? this.defaultAppFor(ext) : null;
  }

  // ── Subscriptions (for React integration) ───────────────────────────────────

  subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private topZ(): number {
    return Math.max(0, ...this.snapshot.map((p) => p.z));
  }

  private update(pid: string, changes: Partial<Process>): void {
    const proc = this.processes.get(pid);
    if (!proc) return;
    this.processes.set(pid, { ...proc, ...changes });
    this.notify();
  }

  private notify(): void {
    this.snapshot = Array.from(this.processes.values());
    this.listeners.forEach(cb => cb());
  }
}
