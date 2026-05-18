export type ProcessArgs = Record<string, string>;
export type ProcessStatus = "running" | "closed";

export interface Process {
  pid: string;
  appId: string;
  args: ProcessArgs;
  status: ProcessStatus;
}

export interface SpawnOptions {
  args?: ProcessArgs;
}

export class ProcessManager {
  private processes: Map<string, Process> = new Map();
  private extensions: Map<string, string> = new Map(); // ext → appId
  private listeners: Set<() => void> = new Set();
  private counter = 0;

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
    const pid = `${appId}-${++this.counter}`;
    this.processes.set(pid, { pid, appId, args: options.args ?? {}, status: "running" });
    this.notify();
    return pid;
  }

  kill(pid: string): void {
    const proc = this.processes.get(pid);
    if (!proc) return;
    proc.status = "closed";
    this.processes.delete(pid);
    this.notify();
  }

  get(pid: string): Process | null {
    return this.processes.get(pid) ?? null;
  }

  list(): Process[] {
    return Array.from(this.processes.values()).filter(p => p.status === "running");
  }

  // ── Open by file path ────────────────────────────────────────────────────────

  // Returns the appId that would handle this file, or null if none registered.
  // The React layer decides whether to spawn directly or show an "Open with" dialog.
  resolveApp(filePath: string): string | null {
    const ext = filePath.split(".").pop()?.toLowerCase() ?? "";
    return this.defaultAppFor(ext);
  }

  // ── Subscriptions (for React integration) ───────────────────────────────────

  subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify(): void {
    this.listeners.forEach(cb => cb());
  }
}
