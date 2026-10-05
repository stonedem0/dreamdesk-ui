import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VirtualFS } from "../fs/VirtualFS";
import { useFSVersion } from "../fs/useFSVersion";

describe("useFSVersion", () => {
  it("re-renders on every change, with a higher version", () => {
    const fs = new VirtualFS();
    const { result } = renderHook(() => ({ version: useFSVersion(fs), names: fs.ls("/").map((n) => n.name) }));
    expect(result.current.names).toEqual([]);

    act(() => fs.mkdir("/docs"));
    const after = result.current.version;
    expect(result.current.names).toEqual(["docs"]);

    act(() => fs.writeFile("/docs/a.txt", "hi"));
    expect(result.current.version).toBeGreaterThan(after);
  });

  it("only watches the given folder", () => {
    const fs = new VirtualFS();
    fs.mkdir("/a");
    fs.mkdir("/b");
    let renders = 0;
    renderHook(() => { renders++; return useFSVersion(fs, "/a"); });
    const before = renders;

    act(() => fs.writeFile("/b/x.txt", ""));
    expect(renders).toBe(before);
    act(() => fs.writeFile("/a/x.txt", ""));
    expect(renders).toBe(before + 1);
  });

  it("stops listening once unmounted", () => {
    const fs = new VirtualFS();
    let renders = 0;
    const { unmount } = renderHook(() => { renders++; return useFSVersion(fs); });
    unmount();
    const before = renders;
    fs.mkdir("/docs");
    expect(renders).toBe(before);
  });
});
