import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { useEffect } from "react";
import { WindowManager } from "@dreamdesk/core";
import { Desktop } from "../components/Desktop";
import { Taskbar } from "../components/Taskbar";
import { useWindowManager } from "../components/Desktop";

const EXIT_MS = 200;

function WMCapture({ onCapture }: { onCapture: (wm: WindowManager) => void }) {
  const wm = useWindowManager();
  useEffect(() => { onCapture(wm); }, [wm, onCapture]);
  return null;
}

function makeEl(): HTMLElement {
  const el = document.createElement("div");
  document.body.appendChild(el);
  return el;
}

function setup() {
  let wm!: WindowManager;
  render(
    <Desktop style={{ width: "800px", height: "600px" }}>
      <WMCapture onCapture={(w) => { wm = w; }} />
      <Taskbar clock={false} />
    </Desktop>
  );
  return { wm };
}

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); });

describe("Taskbar", () => {
  it("renders a button for each registered window", () => {
    const { wm } = setup();
    const el1 = makeEl();
    const el2 = makeEl();
    act(() => {
      wm.register("a", el1, "Alpha", { toggle: () => {} });
      wm.register("b", el2, "Beta", { toggle: () => {} });
    });
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("calls toggle when a button is clicked", () => {
    const { wm } = setup();
    const toggle = vi.fn();
    act(() => {
      wm.register("a", makeEl(), "Alpha", { toggle });
    });
    fireEvent.click(screen.getByText("Alpha"));
    expect(toggle).toHaveBeenCalledOnce();
  });

  it("applies leaving class immediately when window is unregistered", () => {
    const { wm } = setup();
    act(() => {
      wm.register("a", makeEl(), "Alpha", { toggle: () => {} });
    });
    act(() => { wm.unregister("a"); });
    const btn = screen.getByText("Alpha").closest("button");
    expect(btn).toHaveClass("dd-taskbar-btn--leaving");
  });

  it("removes the button after EXIT_MS", () => {
    const { wm } = setup();
    act(() => {
      wm.register("a", makeEl(), "Alpha", { toggle: () => {} });
    });
    act(() => { wm.unregister("a"); });
    act(() => { vi.advanceTimersByTime(EXIT_MS); });
    expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
  });

  it("removes immediately-unregistered window without leaving others", () => {
    const { wm } = setup();
    act(() => {
      wm.register("a", makeEl(), "Alpha", { toggle: () => {} });
      wm.register("b", makeEl(), "Beta", { toggle: () => {} });
    });
    act(() => { wm.unregister("a"); });
    act(() => { vi.advanceTimersByTime(EXIT_MS); });
    expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });
});
