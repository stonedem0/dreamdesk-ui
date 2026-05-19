import { describe, it, expect, vi } from "vitest";
import { ProcessManager } from "../process/ProcessManager";

function make() {
  const pm = new ProcessManager();
  pm.registerExtension("txt", "notepad");
  pm.registerExtension("md", "notepad");
  pm.registerExtension("png", "viewer");
  return pm;
}

describe("ProcessManager — extension registry", () => {
  it("resolves registered extension", () => {
    expect(make().defaultAppFor("txt")).toBe("notepad");
  });

  it("is case-insensitive", () => {
    expect(make().defaultAppFor("TXT")).toBe("notepad");
  });

  it("returns null for unknown extension", () => {
    expect(make().defaultAppFor("xyz")).toBeNull();
  });

  it("resolveApp extracts extension from path", () => {
    expect(make().resolveApp("/docs/readme.txt")).toBe("notepad");
  });

  it("resolveApp returns null for unregistered extension", () => {
    expect(make().resolveApp("/docs/archive.zip")).toBeNull();
  });

  it("lists registered extensions", () => {
    const exts = make().registeredExtensions();
    expect(exts).toContain("txt");
    expect(exts).toContain("md");
    expect(exts).toContain("png");
  });
});

describe("ProcessManager — spawn / kill / list", () => {
  it("spawn returns a pid", () => {
    const pid = make().spawn("notepad");
    expect(pid).toMatch(/^notepad-\d+$/);
  });

  it("spawned process appears in list", () => {
    const pm = make();
    const pid = pm.spawn("notepad");
    expect(pm.list().map(p => p.pid)).toContain(pid);
  });

  it("spawn stores args", () => {
    const pm = make();
    const pid = pm.spawn("notepad", { args: { filePath: "/docs/readme.txt" } });
    expect(pm.get(pid)?.args.filePath).toBe("/docs/readme.txt");
  });

  it("kill removes process from list", () => {
    const pm = make();
    const pid = pm.spawn("notepad");
    pm.kill(pid);
    expect(pm.list().map(p => p.pid)).not.toContain(pid);
  });

  it("kill is a no-op for unknown pid", () => {
    expect(() => make().kill("ghost-99")).not.toThrow();
  });

  it("get returns null after kill", () => {
    const pm = make();
    const pid = pm.spawn("notepad");
    pm.kill(pid);
    expect(pm.get(pid)).toBeNull();
  });

  it("list returns only running processes", () => {
    const pm = make();
    const a = pm.spawn("notepad");
    const b = pm.spawn("viewer");
    pm.kill(a);
    const pids = pm.list().map(p => p.pid);
    expect(pids).not.toContain(a);
    expect(pids).toContain(b);
  });

  it("pids are unique across multiple spawns", () => {
    const pm = make();
    const pids = Array.from({ length: 5 }, () => pm.spawn("notepad"));
    expect(new Set(pids).size).toBe(5);
  });
});

describe("ProcessManager — subscribe", () => {
  it("notifies subscriber on spawn", () => {
    const pm = make();
    const cb = vi.fn();
    pm.subscribe(cb);
    pm.spawn("notepad");
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("notifies subscriber on kill", () => {
    const pm = make();
    const cb = vi.fn();
    const pid = pm.spawn("notepad");
    pm.subscribe(cb);
    pm.kill(pid);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("unsubscribe stops notifications", () => {
    const pm = make();
    const cb = vi.fn();
    const unsub = pm.subscribe(cb);
    unsub();
    pm.spawn("notepad");
    expect(cb).not.toHaveBeenCalled();
  });
});
