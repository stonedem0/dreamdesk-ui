const BASE_Z = 1000;

export interface WindowEntry {
  id: string;
  title: string;
  icon?: string;
  el: HTMLElement;
  isMinimized: boolean;
  toggle: () => void;
}

export class WindowManager {
  private _registry = new Map<string, WindowEntry>();
  private _zStack: string[] = [];
  private _listeners = new Set<() => void>();

  private _notify(): void {
    this._listeners.forEach(fn => fn());
  }

  private _reassignZ(): void {
    this._zStack.forEach((id, i) => {
      const entry = this._registry.get(id);
      if (entry) entry.el.style.zIndex = String(BASE_Z + i);
    });
  }

  register(id: string, el: HTMLElement, title: string, options?: { icon?: string; toggle?: () => void }): void {
    this._registry.set(id, { id, title, icon: options?.icon, el, isMinimized: false, toggle: options?.toggle ?? (() => {}) });
    if (!this._zStack.includes(id)) this._zStack.push(id);
    this._reassignZ();
    this._notify();
  }

  unregister(id: string): void {
    this._registry.delete(id);
    const idx = this._zStack.indexOf(id);
    if (idx !== -1) this._zStack.splice(idx, 1);
    this._reassignZ();
    this._notify();
  }

  raise(id: string): void {
    const idx = this._zStack.indexOf(id);
    if (idx !== -1) this._zStack.splice(idx, 1);
    this._zStack.push(id);
    this._reassignZ();
  }

  minimize(id: string): void {
    const entry = this._registry.get(id);
    if (entry) { entry.isMinimized = true; this._notify(); }
  }

  restore(id: string): void {
    const entry = this._registry.get(id);
    if (entry) { entry.isMinimized = false; this.raise(id); this._notify(); }
  }

  getWindows(): WindowEntry[] {
    return Array.from(this._registry.values());
  }

  subscribe(listener: () => void): () => void {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }
}

export const defaultWindowManager = new WindowManager();
