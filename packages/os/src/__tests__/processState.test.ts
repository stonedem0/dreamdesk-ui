import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { forgetAllProcessState, forgetProcessState, useProcessState } from "../process/processState";

const asString = (v: unknown) => (typeof v === "string" ? v : undefined);
const useFolder = () => useProcessState("explorer", "folder", () => "/documents", asString);

describe("useProcessState", () => {
  beforeEach(() => localStorage.clear());

  it("starts from the initial value, and keeps changes across a reload", () => {
    const first = renderHook(useFolder);
    expect(first.result.current[0]).toBe("/documents");
    act(() => first.result.current[1]("/documents/notes"));
    first.unmount();

    expect(renderHook(useFolder).result.current[0]).toBe("/documents/notes");
  });

  it("falls back to the initial value when the saved one doesn't pass the check", () => {
    localStorage.setItem("dreamdesk:proc-state:explorer:folder", "42");
    expect(renderHook(useFolder).result.current[0]).toBe("/documents");
    localStorage.setItem("dreamdesk:proc-state:explorer:folder", "{not json");
    expect(renderHook(useFolder).result.current[0]).toBe("/documents");
  });

  it("forgets one process's state, or everyone's", () => {
    localStorage.setItem("dreamdesk:proc-state:explorer:folder", '"/x"');
    localStorage.setItem("dreamdesk:proc-state:explorer:view", '"icons"');
    localStorage.setItem("dreamdesk:proc-state:mail:draft", "{}");
    localStorage.setItem("dreamdesk:processes", "[]");

    forgetProcessState("explorer");
    expect(localStorage.getItem("dreamdesk:proc-state:explorer:folder")).toBeNull();
    expect(localStorage.getItem("dreamdesk:proc-state:explorer:view")).toBeNull();
    expect(localStorage.getItem("dreamdesk:proc-state:mail:draft")).toBe("{}");

    forgetAllProcessState();
    expect(localStorage.getItem("dreamdesk:proc-state:mail:draft")).toBeNull();
    expect(localStorage.getItem("dreamdesk:processes")).toBe("[]");
  });
});
