import { describe, it, expect, beforeEach } from "vitest";
import { VirtualFS } from "../fs/VirtualFS";
import { LocalStorageAdapter } from "../fs/FSAdapter";

beforeEach(() => localStorage.clear());

describe("LocalStorageAdapter — load / save", () => {
  it("load returns null when nothing stored", async () => {
    const adapter = new LocalStorageAdapter("test-fs");
    expect(await adapter.load()).toBeNull();
  });

  it("save then load returns the same string", async () => {
    const adapter = new LocalStorageAdapter("test-fs");
    await adapter.save("hello-world");
    expect(await adapter.load()).toBe("hello-world");
  });

  it("different keys are isolated", async () => {
    const a = new LocalStorageAdapter("key-a");
    const b = new LocalStorageAdapter("key-b");
    await a.save("aaa");
    expect(await b.load()).toBeNull();
  });
});

describe("LocalStorageAdapter — VirtualFS roundtrip", () => {
  it("persists and restores the filesystem", async () => {
    const adapter = new LocalStorageAdapter("test-fs");
    const fs = new VirtualFS();
    fs.mkdir("/docs");
    fs.writeFile("/docs/readme.txt", "hello");

    await adapter.save(fs.serialize());

    const fs2 = new VirtualFS();
    const data = await adapter.load();
    expect(data).not.toBeNull();
    fs2.deserialize(data!);

    expect(fs2.readFile("/docs/readme.txt")).toBe("hello");
    expect(fs2.exists("/docs")).toBe(true);
  });
});

describe("VirtualFS — notify", () => {
  it("triggers root watcher without a real mutation", () => {
    const fs = new VirtualFS();
    const cb = vi.fn();
    fs.watch("/", cb);
    fs.notify();
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("does not mutate the filesystem", () => {
    const fs = new VirtualFS();
    fs.mkdir("/docs");
    fs.notify();
    expect(fs.ls("/").map(n => n.name)).toEqual(["docs"]);
  });
});
