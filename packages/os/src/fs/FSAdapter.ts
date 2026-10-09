export interface FSAdapter {
  load(): Promise<string | null>;
  save(data: string): Promise<void>;
}

export class LocalStorageAdapter implements FSAdapter {
  private key: string;

  constructor(key = "dreamdesk-fs") {
    this.key = key;
  }

  async load(): Promise<string | null> {
    try { return localStorage.getItem(this.key); } catch { return null; }
  }

  async save(data: string): Promise<void> {
    try { localStorage.setItem(this.key, data); } catch { /* storage unavailable: not saved */ }
  }
}
