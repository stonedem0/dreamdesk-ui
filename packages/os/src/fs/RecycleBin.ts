import type { VirtualFS } from "./VirtualFS";

/** Something in the bin: what it was called, where it came from, and when. */
export interface BinItem {
  /** Its name inside the bin folder ("DC1.txt"). */
  id: string;
  /** Its name before it was deleted. */
  name: string;
  /** The folder it was deleted from. */
  from: string;
  /** When it was deleted (ms since 1970). */
  deletedAt: number;
  kind: "file" | "dir";
}

const parentOf = (path: string) => path.slice(0, path.lastIndexOf("/")) || "/";
const baseName = (path: string) => path.slice(path.lastIndexOf("/") + 1);
const join = (dir: string, name: string) => `${dir === "/" ? "" : dir}/${name}`;
const extension = (name: string) => {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot) : "";
};

const isItem = (v: unknown): v is BinItem => {
  const i = v as BinItem;
  return typeof i === "object" && i !== null && typeof i.id === "string" && typeof i.name === "string" &&
    typeof i.from === "string" && typeof i.deletedAt === "number" && (i.kind === "file" || i.kind === "dir");
};

/**
 * A recycle bin on a VirtualFS, as Windows 98 did it: deleted files and
 * folders move into a RECYCLED folder under new names (DC1.txt, DC2, …), and
 * an INFO2 file in it remembers what each was called and where it came from.
 * Everything lives in the filesystem, so it's saved and restored with it.
 */
export class RecycleBin {
  private fs: VirtualFS;
  /** Where deleted things go. */
  readonly folder: string;
  private readonly index: string;

  constructor(fs: VirtualFS, folder = "/RECYCLED") {
    this.fs = fs;
    this.folder = folder;
    this.index = join(folder, "INFO2");
  }

  /** Whether a path is the bin's folder or inside it. */
  contains(path: string): boolean {
    return path === this.folder || path.startsWith(this.folder + "/");
  }

  /** What's in the bin, oldest first. */
  list(): BinItem[] {
    let saved: unknown;
    try { saved = JSON.parse(this.fs.readFile(this.index)); }
    catch { return []; }
    if (!Array.isArray(saved)) return [];
    // Only what's really there, in case the folder was changed by hand
    return saved.filter((i): i is BinItem => isItem(i) && this.fs.exists(join(this.folder, i.id)));
  }

  /** Moves a file or folder into the bin. */
  recycle(path: string): BinItem {
    if (!this.fs.exists(path)) throw new Error(`Path not found: ${path}`);
    if (path === "/" || this.contains(path)) throw new Error(`Can't recycle ${path}`);
    if (!this.fs.exists(this.folder)) this.fs.mkdir(this.folder);

    const items = this.list();
    const used = new Set(this.fs.ls(this.folder).map((n) => n.name.toLowerCase()));
    let n = items.length + 1;
    const kind = this.fs.stat(path).kind;
    const idFor = (k: number) => `DC${k}${kind === "file" ? extension(baseName(path)) : ""}`;
    while (used.has(idFor(n).toLowerCase())) n++;

    const item: BinItem = { id: idFor(n), name: baseName(path), from: parentOf(path), deletedAt: Date.now(), kind };
    this.fs.mv(path, join(this.folder, item.id));
    this.save([...items, item]);
    return item;
  }

  /**
   * Puts an item back where it came from, recreating that folder if it's gone;
   * if its name is taken there, it gets a numbered one. Returns its new path.
   */
  restore(id: string): string {
    const items = this.list();
    const item = items.find((i) => i.id === id);
    if (!item) throw new Error(`Not in the bin: ${id}`);
    this.mkdirs(item.from);
    const to = join(item.from, this.freeName(item.from, item.name));
    this.fs.mv(join(this.folder, item.id), to);
    this.save(items.filter((i) => i !== item));
    return to;
  }

  /** Deletes one item for good. */
  remove(id: string): void {
    const items = this.list();
    const item = items.find((i) => i.id === id);
    if (!item) return;
    this.fs.rm(join(this.folder, item.id));
    this.save(items.filter((i) => i !== item));
  }

  /** Deletes everything in the bin for good. */
  empty(): void {
    if (!this.fs.exists(this.folder)) return;
    for (const node of this.fs.ls(this.folder)) {
      if (node.name !== baseName(this.index)) this.fs.rm(join(this.folder, node.name));
    }
    this.save([]);
  }

  private save(items: BinItem[]): void {
    if (!this.fs.exists(this.folder)) this.fs.mkdir(this.folder);
    this.fs.writeFile(this.index, JSON.stringify(items));
  }

  private mkdirs(path: string): void {
    let at = "";
    for (const part of path.split("/").filter(Boolean)) {
      at += "/" + part;
      if (!this.fs.exists(at)) this.fs.mkdir(at);
    }
  }

  /** `name`, or "name (2).ext" and so on if something in `dir` already has it. */
  private freeName(dir: string, name: string): string {
    const taken = new Set(this.fs.ls(dir).map((n) => n.name.toLowerCase()));
    if (!taken.has(name.toLowerCase())) return name;
    const ext = extension(name);
    const base = name.slice(0, name.length - ext.length);
    for (let n = 2; ; n++) {
      const candidate = `${base} (${n})${ext}`;
      if (!taken.has(candidate.toLowerCase())) return candidate;
    }
  }
}
