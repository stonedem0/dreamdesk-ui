import { describe, it, expect, beforeEach, vi } from "vitest";
import { VirtualFS } from "../fs/VirtualFS";
import { RecycleBin } from "../fs/RecycleBin";

let fs: VirtualFS;
let bin: RecycleBin;

beforeEach(() => {
  fs = new VirtualFS();
  fs.mkdir("/docs");
  fs.mkdir("/docs/old");
  fs.writeFile("/docs/readme.txt", "hello");
  fs.writeFile("/docs/old/notes.txt", "x");
  bin = new RecycleBin(fs);
});

describe("RecycleBin", () => {
  it("moves a file into RECYCLED, remembering its name and where it came from", () => {
    vi.spyOn(Date, "now").mockReturnValue(1000);
    const item = bin.recycle("/docs/readme.txt");
    expect(item).toEqual({ id: "DC1.txt", name: "readme.txt", from: "/docs", deletedAt: 1000, kind: "file" });
    expect(fs.exists("/docs/readme.txt")).toBe(false);
    expect(fs.readFile("/RECYCLED/DC1.txt")).toBe("hello");
    expect(bin.list()).toEqual([item]);
    vi.restoreAllMocks();
  });

  it("recycles folders with everything in them", () => {
    const item = bin.recycle("/docs/old");
    expect(item).toMatchObject({ id: "DC1", name: "old", kind: "dir" });
    expect(fs.readFile("/RECYCLED/DC1/notes.txt")).toBe("x");
  });

  it("numbers items so they never clash", () => {
    fs.writeFile("/a.txt", "");
    fs.writeFile("/docs/a.txt", "");
    expect(bin.recycle("/a.txt").id).toBe("DC1.txt");
    expect(bin.recycle("/docs/a.txt").id).toBe("DC2.txt");
    bin.remove("DC1.txt");
    fs.writeFile("/b.txt", "");
    expect(bin.recycle("/b.txt").id).toBe("DC3.txt");
  });

  it("restores an item where it came from", () => {
    const item = bin.recycle("/docs/readme.txt");
    expect(bin.restore(item.id)).toBe("/docs/readme.txt");
    expect(fs.readFile("/docs/readme.txt")).toBe("hello");
    expect(bin.list()).toEqual([]);
  });

  it("recreates the folder it came from, and renames it if its name is taken", () => {
    const notes = bin.recycle("/docs/old/notes.txt");
    fs.rm("/docs/old");
    expect(bin.restore(notes.id)).toBe("/docs/old/notes.txt");

    const readme = bin.recycle("/docs/readme.txt");
    fs.writeFile("/docs/README.TXT", "new");
    expect(bin.restore(readme.id)).toBe("/docs/readme (2).txt");
    expect(fs.readFile("/docs/readme (2).txt")).toBe("hello");
  });

  it("deletes one item, or everything, for good", () => {
    const a = bin.recycle("/docs/readme.txt");
    bin.recycle("/docs/old");
    bin.remove(a.id);
    expect(fs.exists("/RECYCLED/DC1.txt")).toBe(false);
    expect(bin.list().map((i) => i.name)).toEqual(["old"]);
    bin.empty();
    expect(bin.list()).toEqual([]);
    expect(fs.ls("/RECYCLED").map((n) => n.name)).toEqual(["INFO2"]);
  });

  it("refuses the root, the bin itself, and what isn't there", () => {
    expect(() => bin.recycle("/")).toThrow();
    bin.recycle("/docs/readme.txt");
    expect(() => bin.recycle("/RECYCLED")).toThrow();
    expect(() => bin.recycle("/RECYCLED/DC1.txt")).toThrow();
    expect(() => bin.recycle("/nope")).toThrow();
    expect(() => bin.restore("DC9")).toThrow();
  });

  it("survives being saved and loaded with the filesystem", () => {
    bin.recycle("/docs/readme.txt");
    const copy = new VirtualFS();
    copy.deserialize(fs.serialize());
    const again = new RecycleBin(copy);
    expect(again.list().map((i) => i.name)).toEqual(["readme.txt"]);
    expect(again.restore("DC1.txt")).toBe("/docs/readme.txt");
  });

  it("ignores a broken index, and items that went missing", () => {
    bin.recycle("/docs/readme.txt");
    fs.rm("/RECYCLED/DC1.txt");
    expect(bin.list()).toEqual([]);
    fs.writeFile("/RECYCLED/INFO2", "{not json");
    expect(bin.list()).toEqual([]);
    expect(bin.contains("/RECYCLED/x")).toBe(true);
    expect(bin.contains("/RECYCLEDX")).toBe(false);
  });
});
