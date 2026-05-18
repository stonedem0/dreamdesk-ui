import { describe, it, expect, vi } from "vitest";
import { VirtualFS } from "../fs/VirtualFS";

function make() {
  const fs = new VirtualFS();
  fs.mkdir("/docs");
  fs.mkdir("/docs/work");
  fs.writeFile("/docs/readme.txt", "hello");
  return fs;
}

describe("VirtualFS — exists / stat", () => {
  it("root always exists", () => {
    expect(new VirtualFS().exists("/")).toBe(true);
  });

  it("detects created file", () => {
    const fs = make();
    expect(fs.exists("/docs/readme.txt")).toBe(true);
  });

  it("returns false for missing path", () => {
    expect(make().exists("/nope")).toBe(false);
  });

  it("stat returns correct kind", () => {
    const fs = make();
    expect(fs.stat("/docs").kind).toBe("dir");
    expect(fs.stat("/docs/readme.txt").kind).toBe("file");
  });

  it("stat throws for missing path", () => {
    expect(() => make().stat("/nope")).toThrow();
  });
});

describe("VirtualFS — readFile / writeFile", () => {
  it("reads written content", () => {
    expect(make().readFile("/docs/readme.txt")).toBe("hello");
  });

  it("overwrites existing file", () => {
    const fs = make();
    fs.writeFile("/docs/readme.txt", "world");
    expect(fs.readFile("/docs/readme.txt")).toBe("world");
  });

  it("creates file in existing dir", () => {
    const fs = make();
    fs.writeFile("/docs/work/notes.txt", "todo");
    expect(fs.readFile("/docs/work/notes.txt")).toBe("todo");
  });

  it("throws reading a directory", () => {
    expect(() => make().readFile("/docs")).toThrow();
  });

  it("throws writing into non-existent parent", () => {
    expect(() => make().writeFile("/missing/file.txt", "x")).toThrow();
  });
});

describe("VirtualFS — mkdir", () => {
  it("creates nested directory", () => {
    const fs = make();
    fs.mkdir("/docs/archive");
    expect(fs.exists("/docs/archive")).toBe(true);
  });

  it("is idempotent — no error if dir exists", () => {
    const fs = make();
    expect(() => fs.mkdir("/docs")).not.toThrow();
  });
});

describe("VirtualFS — rm", () => {
  it("removes a file", () => {
    const fs = make();
    fs.rm("/docs/readme.txt");
    expect(fs.exists("/docs/readme.txt")).toBe(false);
  });

  it("removes a directory", () => {
    const fs = make();
    fs.rm("/docs/work");
    expect(fs.exists("/docs/work")).toBe(false);
  });

  it("throws for missing path", () => {
    expect(() => make().rm("/nope")).toThrow();
  });

  it("throws when removing root", () => {
    expect(() => make().rm("/")).toThrow();
  });
});

describe("VirtualFS — mv", () => {
  it("moves a file", () => {
    const fs = make();
    fs.mv("/docs/readme.txt", "/docs/work/readme.txt");
    expect(fs.exists("/docs/readme.txt")).toBe(false);
    expect(fs.readFile("/docs/work/readme.txt")).toBe("hello");
  });

  it("renames a file", () => {
    const fs = make();
    fs.mv("/docs/readme.txt", "/docs/README.md");
    expect(fs.exists("/docs/readme.txt")).toBe(false);
    expect(fs.exists("/docs/README.md")).toBe(true);
  });

  it("throws when source missing", () => {
    expect(() => make().mv("/nope", "/docs/nope")).toThrow();
  });
});

describe("VirtualFS — ls", () => {
  it("lists root children", () => {
    const fs = make();
    const names = fs.ls("/").map(n => n.name);
    expect(names).toContain("docs");
  });

  it("lists directory children", () => {
    const fs = make();
    const names = fs.ls("/docs").map(n => n.name);
    expect(names).toContain("readme.txt");
    expect(names).toContain("work");
  });

  it("throws for missing directory", () => {
    expect(() => make().ls("/nope")).toThrow();
  });
});

describe("VirtualFS — watch", () => {
  it("fires on writeFile (create)", () => {
    const fs = make();
    const cb = vi.fn();
    fs.watch("/docs", cb);
    fs.writeFile("/docs/new.txt", "x");
    expect(cb).toHaveBeenCalledWith(expect.objectContaining({ type: "created", path: "/docs/new.txt" }));
  });

  it("fires on writeFile (modify)", () => {
    const fs = make();
    const cb = vi.fn();
    fs.watch("/docs/readme.txt", cb);
    fs.writeFile("/docs/readme.txt", "updated");
    expect(cb).toHaveBeenCalledWith(expect.objectContaining({ type: "modified", path: "/docs/readme.txt" }));
  });

  it("fires on rm", () => {
    const fs = make();
    const cb = vi.fn();
    fs.watch("/docs", cb);
    fs.rm("/docs/readme.txt");
    expect(cb).toHaveBeenCalledWith(expect.objectContaining({ type: "deleted" }));
  });

  it("fires on mv", () => {
    const fs = make();
    const cb = vi.fn();
    fs.watch("/", cb);
    fs.mv("/docs/readme.txt", "/docs/work/readme.txt");
    expect(cb).toHaveBeenCalledWith(expect.objectContaining({ type: "moved" }));
  });

  it("unsubscribe stops events", () => {
    const fs = make();
    const cb = vi.fn();
    const unsub = fs.watch("/docs", cb);
    unsub();
    fs.writeFile("/docs/new.txt", "x");
    expect(cb).not.toHaveBeenCalled();
  });
});

describe("VirtualFS — serialize / deserialize", () => {
  it("round-trips the filesystem", () => {
    const fs = make();
    const json = fs.serialize();
    const fs2 = new VirtualFS();
    fs2.deserialize(json);
    expect(fs2.readFile("/docs/readme.txt")).toBe("hello");
    expect(fs2.exists("/docs/work")).toBe(true);
  });

  it("serialized output is valid JSON", () => {
    expect(() => JSON.parse(make().serialize())).not.toThrow();
  });
});
