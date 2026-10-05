import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProcessManager } from "../process/ProcessManager";
import { useProcesses } from "../process/useProcesses";

describe("ProcessManager — fixed ids", () => {
  it("starts a process under the id given", () => {
    const pm = new ProcessManager();
    expect(pm.spawn("explorer", { pid: "explorer", title: "Explorer" })).toBe("explorer");
    expect(pm.get("explorer")).toMatchObject({ appId: "explorer", title: "Explorer" });
  });

  it("brings a running one to the front instead of starting another", () => {
    const pm = new ProcessManager();
    pm.spawn("explorer", { pid: "explorer" });
    pm.spawn("notepad", { pid: "notepad" });
    pm.spawn("explorer", { pid: "explorer" });
    expect(pm.list().map((p) => p.pid)).toEqual(["explorer", "notepad"]);
    expect(pm.stackOrder()).toEqual(["notepad", "explorer"]);
  });
});

describe("ProcessManager — windows", () => {
  it("puts new processes in front", () => {
    const pm = new ProcessManager();
    const a = pm.spawn("notepad");
    const b = pm.spawn("viewer");
    expect(pm.stackOrder()).toEqual([a, b]);
  });

  it("brings a focused process to the front", () => {
    const pm = new ProcessManager();
    const a = pm.spawn("notepad");
    const b = pm.spawn("viewer");
    pm.focus(a);
    expect(pm.stackOrder()).toEqual([b, a]);
  });

  it("doesn't notify when focusing what's already in front, or moving to where it is", () => {
    const pm = new ProcessManager();
    const a = pm.spawn("notepad", { position: { x: 1, y: 2 } });
    const cb = vi.fn();
    pm.subscribe(cb);
    pm.focus(a);
    pm.move(a, { x: 1, y: 2 });
    pm.setTitle(a, "x");
    pm.setTitle(a, "x");
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("moves and renames, as new objects", () => {
    const pm = new ProcessManager();
    const a = pm.spawn("notepad", { title: "Untitled" });
    const before = pm.get(a);
    pm.move(a, { x: 10, y: 20 });
    pm.setTitle(a, "notes.txt");
    expect(pm.get(a)).toMatchObject({ position: { x: 10, y: 20 }, title: "notes.txt" });
    expect(pm.get(a)).not.toBe(before);
    expect(before).toMatchObject({ title: "Untitled" });
  });

  it("returns the same list until something changes", () => {
    const pm = new ProcessManager();
    pm.spawn("notepad");
    const list = pm.list();
    expect(pm.list()).toBe(list);
    pm.spawn("viewer");
    expect(pm.list()).not.toBe(list);
  });
});

describe("ProcessManager — saving and restoring", () => {
  it("restores processes with their ids, args, titles, positions and order", () => {
    const pm = new ProcessManager();
    const a = pm.spawn("notepad", { args: { filePath: "/a.txt" }, title: "a.txt", position: { x: 1, y: 2 } });
    pm.spawn("explorer", { pid: "explorer" });
    pm.focus(a);

    const next = new ProcessManager();
    expect(next.restore(pm.serialize())).toBe(true);
    expect(next.list().map(({ pid, appId, args, title, position }) => ({ pid, appId, args, title, position }))).toEqual([
      { pid: a, appId: "notepad", args: { filePath: "/a.txt" }, title: "a.txt", position: { x: 1, y: 2 } },
      { pid: "explorer", appId: "explorer", args: {}, title: undefined, position: undefined },
    ]);
    expect(next.stackOrder()).toEqual(["explorer", a]);
    expect(next.list().map((p) => p.z)).toEqual([2, 1]);
  });

  it("leaves out what `keep` rejects, both ways", () => {
    const pm = new ProcessManager();
    pm.spawn("dialog");
    pm.spawn("notepad");
    const saved = pm.serialize((p) => p.appId !== "dialog");
    const next = new ProcessManager();
    next.restore(saved, (p) => p.appId !== "notepad");
    expect(next.list()).toEqual([]);
    expect(JSON.parse(saved)).toHaveLength(1);
  });

  it("doesn't reuse a restored generated id", () => {
    const next = new ProcessManager();
    next.restore([{ pid: "notepad-7", appId: "notepad" }]);
    expect(next.spawn("notepad")).toBe("notepad-8");
  });

  it("reads entries saved without ids (as OSProvider used to save them)", () => {
    const next = new ProcessManager();
    next.restore(JSON.stringify([{ appId: "notepad", args: { filePath: "/a.txt" } }]));
    expect(next.list()).toMatchObject([{ appId: "notepad", args: { filePath: "/a.txt" } }]);
  });

  it("skips unreadable entries, and reports unreadable data", () => {
    const next = new ProcessManager();
    expect(next.restore("{not json")).toBe(false);
    expect(next.restore("{}")).toBe(false);
    expect(next.restore(JSON.stringify([null, 42, { pid: 3, appId: "x" }, { appId: "notepad", position: "nowhere" }]))).toBe(true);
    expect(next.list()).toMatchObject([{ appId: "notepad", position: undefined }]);
  });

  it("doesn't restore over a process that's already running", () => {
    const pm = new ProcessManager();
    pm.spawn("explorer", { pid: "explorer", title: "Now" });
    pm.restore([{ pid: "explorer", appId: "explorer", title: "Saved" }]);
    expect(pm.list()).toMatchObject([{ pid: "explorer", title: "Now" }]);
  });
});

describe("useProcesses", () => {
  it("re-renders with the running processes as they change", () => {
    const pm = new ProcessManager();
    const { result } = renderHook(() => useProcesses(pm));
    expect(result.current).toEqual([]);
    act(() => { pm.spawn("notepad", { pid: "notepad" }); });
    expect(result.current.map((p) => p.pid)).toEqual(["notepad"]);
    act(() => pm.move("notepad", { x: 5, y: 6 }));
    expect(result.current[0].position).toEqual({ x: 5, y: 6 });
    act(() => pm.kill("notepad"));
    expect(result.current).toEqual([]);
  });
});
