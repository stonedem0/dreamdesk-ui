export interface FSFile {
  kind: "file";
  name: string;
  content: string;
  created: number;
  modified: number;
}

export interface FSDir {
  kind: "dir";
  name: string;
  children: Map<string, FSNode>;
  created: number;
  modified: number;
}

export type FSNode = FSFile | FSDir;

export type FSEvent =
  | { type: "created"; path: string; node: FSNode }
  | { type: "modified"; path: string }
  | { type: "deleted"; path: string }
  | { type: "moved"; from: string; to: string };

export type WatchCallback = (event: FSEvent) => void;

// ── Serialization types (Maps don't JSON-serialize directly) ──────────────────

interface SerializedFile {
  kind: "file";
  name: string;
  content: string;
  created: number;
  modified: number;
}

interface SerializedDir {
  kind: "dir";
  name: string;
  children: Record<string, SerializedNode>;
  created: number;
  modified: number;
}

type SerializedNode = SerializedFile | SerializedDir;

// ── VirtualFS ─────────────────────────────────────────────────────────────────

export class VirtualFS {
  private root: FSDir = {
    kind: "dir",
    name: "",
    children: new Map(),
    created: Date.now(),
    modified: Date.now(),
  };

  private watchers: Map<string, Set<WatchCallback>> = new Map();

  // ── Path helpers ────────────────────────────────────────────────────────────

  private parts(path: string): string[] {
    return path.split("/").filter(Boolean);
  }

  private normalize(path: string): string {
    return "/" + this.parts(path).join("/");
  }

  private parentPath(path: string): string {
    const p = this.parts(path);
    return p.length <= 1 ? "/" : "/" + p.slice(0, -1).join("/");
  }

  private basename(path: string): string {
    const p = this.parts(path);
    return p[p.length - 1] ?? "";
  }

  // ── Internal node lookup ────────────────────────────────────────────────────

  private getNode(path: string): FSNode | null {
    if (path === "/") return this.root;
    const p = this.parts(path);
    let cur: FSNode = this.root;
    for (const part of p) {
      if (cur.kind !== "dir") return null;
      const next = cur.children.get(part);
      if (!next) return null;
      cur = next;
    }
    return cur;
  }

  private getDir(path: string): FSDir {
    const node = this.getNode(path);
    if (!node) throw new Error(`Directory not found: ${path}`);
    if (node.kind !== "dir") throw new Error(`Not a directory: ${path}`);
    return node;
  }

  // ── Watcher helpers ─────────────────────────────────────────────────────────

  private emit(event: FSEvent) {
    const affected = new Set<WatchCallback>();

    // Exact path match
    const key = "type" in event && event.type === "moved" ? event.from : (event as { path: string }).path;
    const exact = this.watchers.get(key);
    if (exact) exact.forEach(cb => affected.add(cb));

    // Parent path match (directory watching children)
    const parent = this.parentPath(key);
    const parentWatchers = this.watchers.get(parent);
    if (parentWatchers) parentWatchers.forEach(cb => affected.add(cb));

    // Root catch-all
    const rootWatchers = this.watchers.get("/");
    if (rootWatchers) rootWatchers.forEach(cb => affected.add(cb));

    affected.forEach(cb => cb(event));
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  exists(path: string): boolean {
    return this.getNode(this.normalize(path)) !== null;
  }

  readFile(path: string): string {
    const node = this.getNode(this.normalize(path));
    if (!node) throw new Error(`File not found: ${path}`);
    if (node.kind !== "file") throw new Error(`Not a file: ${path}`);
    return node.content;
  }

  writeFile(path: string, content: string): void {
    const norm = this.normalize(path);
    const existing = this.getNode(norm);

    if (existing) {
      if (existing.kind !== "file") throw new Error(`Path is a directory: ${path}`);
      existing.content = content;
      existing.modified = Date.now();
      this.emit({ type: "modified", path: norm });
    } else {
      const parentDir = this.getDir(this.parentPath(norm));
      const name = this.basename(norm);
      const file: FSFile = { kind: "file", name, content, created: Date.now(), modified: Date.now() };
      parentDir.children.set(name, file);
      parentDir.modified = Date.now();
      this.emit({ type: "created", path: norm, node: file });
    }
  }

  mkdir(path: string): void {
    const norm = this.normalize(path);
    if (this.exists(norm)) return;
    const parentDir = this.getDir(this.parentPath(norm));
    const name = this.basename(norm);
    const dir: FSDir = { kind: "dir", name, children: new Map(), created: Date.now(), modified: Date.now() };
    parentDir.children.set(name, dir);
    parentDir.modified = Date.now();
    this.emit({ type: "created", path: norm, node: dir });
  }

  rm(path: string): void {
    const norm = this.normalize(path);
    if (!this.exists(norm)) throw new Error(`Path not found: ${path}`);
    if (norm === "/") throw new Error("Cannot remove root");
    const parentDir = this.getDir(this.parentPath(norm));
    parentDir.children.delete(this.basename(norm));
    parentDir.modified = Date.now();
    this.emit({ type: "deleted", path: norm });
  }

  mv(src: string, dest: string): void {
    const normSrc = this.normalize(src);
    const normDest = this.normalize(dest);
    const node = this.getNode(normSrc);
    if (!node) throw new Error(`Path not found: ${src}`);

    const destParent = this.getDir(this.parentPath(normDest));
    const srcParent = this.getDir(this.parentPath(normSrc));

    const destName = this.basename(normDest);
    srcParent.children.delete(this.basename(normSrc));
    destParent.children.set(destName, { ...node, name: destName } as FSNode);
    destParent.modified = Date.now();
    srcParent.modified = Date.now();

    this.emit({ type: "moved", from: normSrc, to: normDest });
  }

  ls(path: string = "/"): FSNode[] {
    const dir = this.getDir(this.normalize(path));
    return Array.from(dir.children.values());
  }

  stat(path: string): FSNode {
    const node = this.getNode(this.normalize(path));
    if (!node) throw new Error(`Path not found: ${path}`);
    return node;
  }

  watch(path: string, callback: WatchCallback): () => void {
    const norm = this.normalize(path);
    if (!this.watchers.has(norm)) this.watchers.set(norm, new Set());
    this.watchers.get(norm)!.add(callback);
    return () => this.watchers.get(norm)?.delete(callback);
  }

  // ── Persistence ─────────────────────────────────────────────────────────────

  serialize(): string {
    const serializeNode = (node: FSNode): SerializedNode => {
      if (node.kind === "file") return { ...node };
      return {
        kind: "dir",
        name: node.name,
        created: node.created,
        modified: node.modified,
        children: Object.fromEntries(
          Array.from(node.children.entries()).map(([k, v]) => [k, serializeNode(v)])
        ),
      };
    };
    return JSON.stringify(serializeNode(this.root));
  }

  notify(): void {
    this.emit({ type: "modified", path: "/" });
  }

  deserialize(data: string): void {
    const deserializeNode = (s: SerializedNode): FSNode => {
      if (s.kind === "file") return { ...s };
      return {
        kind: "dir",
        name: s.name,
        created: s.created,
        modified: s.modified,
        children: new Map(
          Object.entries(s.children).map(([k, v]) => [k, deserializeNode(v)])
        ),
      };
    };
    const parsed = JSON.parse(data) as SerializedNode;
    this.root = deserializeNode(parsed) as FSDir;
  }
}
