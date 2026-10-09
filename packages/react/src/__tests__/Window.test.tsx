import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Desktop } from "../components/Desktop";
import { Window } from "../components/Window";

function setup(props: Partial<React.ComponentProps<typeof Window>> = {}) {
  return render(
    <Desktop style={{ width: "800px", height: "600px" }}>
      <Window title="Test Window" width="400px" height="300px" defaultOpen {...props}>
        <p>Window content</p>
      </Window>
    </Desktop>
  );
}

function getHost(title = "Test Window") {
  return screen.getByText(title).closest(".dd-window") as HTMLElement;
}

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); });

describe("Window — open/close", () => {
  it("renders title and content when defaultOpen", () => {
    setup();
    expect(screen.getByText("Test Window")).toBeInTheDocument();
    expect(screen.getByText("Window content")).toBeInTheDocument();
  });

  it("is hidden when defaultOpen is false", () => {
    render(
      <Desktop style={{ width: "800px", height: "600px" }}>
        <Window title="Hidden Window" width="400px" height="300px" defaultOpen={false}>
          <p>Hidden content</p>
        </Window>
      </Desktop>
    );
    // host element is hidden via display:none — find it via container
    const host = document.querySelector(".dd-window") as HTMLElement;
    expect(host.style.display).toBe("none");
  });

  it("calls onClose when close button is clicked", async () => {
    const onClose = vi.fn();
    setup({ onClose });
    fireEvent.click(screen.getByLabelText("close"));
    await act(async () => {});
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("stays open when onBeforeClose resolves false", async () => {
    const onClose = vi.fn();
    setup({ onClose, onBeforeClose: async () => false });
    const host = getHost();
    fireEvent.click(screen.getByLabelText("close"));
    await act(async () => {});
    expect(onClose).not.toHaveBeenCalled();
    expect(host.style.display).not.toBe("none");
  });

  it("closes when onBeforeClose resolves true", async () => {
    const onClose = vi.fn();
    setup({ onClose, onBeforeClose: () => true });
    fireEvent.click(screen.getByLabelText("close"));
    await act(async () => {});
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("hides the host when close button is clicked", async () => {
    setup();
    const host = getHost();
    fireEvent.click(screen.getByLabelText("close"));
    await act(async () => {});
    expect(host.style.display).toBe("none");
  });

  it("close button is disabled when disableClose is true", () => {
    setup({ disableClose: true });
    expect(screen.getByLabelText("close")).toHaveAttribute("aria-disabled", "true");
  });
});

describe("Window — minimize", () => {
  it("calls onMinimize with true when minimize button is clicked", () => {
    const onMinimize = vi.fn();
    setup({ onMinimize });
    fireEvent.click(screen.getByLabelText("minimize"));
    expect(onMinimize).toHaveBeenCalledWith(true);
  });

  it("minimize button is disabled when disableMinimize is true", () => {
    setup({ disableMinimize: true });
    expect(screen.getByLabelText("minimize")).toHaveAttribute("aria-disabled", "true");
  });
});

describe("Window — title", () => {
  it("renders the window title", () => {
    setup({ title: "My App" });
    expect(screen.getByText("My App")).toBeInTheDocument();
  });

  it("updates when title prop changes", () => {
    const { rerender } = render(
      <Desktop style={{ width: "800px", height: "600px" }}>
        <Window title="Original">content</Window>
      </Desktop>
    );
    expect(screen.getByText("Original")).toBeInTheDocument();
    rerender(
      <Desktop style={{ width: "800px", height: "600px" }}>
        <Window title="Updated">content</Window>
      </Desktop>
    );
    expect(screen.getByText("Updated")).toBeInTheDocument();
    expect(screen.queryByText("Original")).not.toBeInTheDocument();
  });
});

describe("Window — onMove", () => {
  it("calls onMove with the left/top the drag set, not the on-screen rect", () => {
    const onMove = vi.fn();
    setup({ onMove });

    const host = getHost();
    const header = host.querySelector(".dd-win-header") as HTMLElement;

    // On screen the window sits 14px right/down of its CSS position (e.g. a margin)
    host.getBoundingClientRect = () =>
      ({ left: 134, top: 94, width: 400, height: 300, right: 534, bottom: 394, x: 134, y: 94, toJSON: () => {} } as DOMRect);

    header.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: 150, clientY: 100 }));
    document.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientX: 200, clientY: 140 }));
    document.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));

    const left = parseFloat(host.style.left), top = parseFloat(host.style.top);
    expect(Number.isFinite(left) && Number.isFinite(top)).toBe(true);
    expect(onMove).toHaveBeenCalledWith(left, top);
    expect(onMove).not.toHaveBeenCalledWith(134, 94);
  });

  it("does not call onMove if prop is not provided", () => {
    setup();
    const host = getHost();
    const header = host.querySelector(".dd-win-header") as HTMLElement;

    header.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: 150, clientY: 100 }));
    document.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientX: 200, clientY: 140 }));
    document.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
    // no error thrown — onMove is optional
  });
});

describe("Window — re-open", () => {
  it("re-shows host after close when display is cleared", async () => {
    setup();
    const host = getHost();
    fireEvent.click(screen.getByLabelText("close"));
    await act(async () => {});
    expect(host.style.display).toBe("none");
    act(() => { host.style.display = ""; });
    expect(host.style.display).toBe("");
  });
});

describe("Window — defaultFullscreen", () => {
  it("starts fullscreen when it has a fullscreenAnimation, so the next toggle leaves it", () => {
    const onFullscreen = vi.fn();
    const fullscreenAnimation = vi.fn();
    setup({ defaultFullscreen: true, fullscreenAnimation, onFullscreen, fullscreenMode: "expand" });
    fireEvent.click(screen.getByLabelText("fullscreen"));
    expect(onFullscreen).toHaveBeenCalledWith(false);
    expect(fullscreenAnimation).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ isFullscreen: false }));
  });

  it("is ignored without a fullscreenAnimation", () => {
    const onFullscreen = vi.fn();
    setup({ defaultFullscreen: true, onFullscreen });
    fireEvent.click(screen.getByLabelText("fullscreen"));
    expect(onFullscreen).toHaveBeenCalledWith(true);
  });
});

describe("Window — compact desktop", () => {
  function compactSetup(props: Partial<React.ComponentProps<typeof Window>> = {}) {
    return render(
      <Desktop compact style={{ width: "400px", height: "700px" }}>
        <Window title="Test Window" width="400px" height="300px" defaultOpen {...props}>
          <p>Window content</p>
        </Window>
      </Desktop>
    );
  }

  it("marks the desktop and its windows as compact/maximized", () => {
    compactSetup();
    expect(document.querySelector(".dd-desktop")!.classList.contains("dd-desktop--compact")).toBe(true);
    expect(getHost().classList.contains("dd-window--maximized")).toBe(true);
  });

  it("can't be dragged or resized", () => {
    const onMove = vi.fn();
    compactSetup({ onMove });
    const host = getHost();
    const header = host.querySelector(".dd-win-header") as HTMLElement;
    expect(header.classList.contains("dd-win-header--no-move")).toBe(true);
    header.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: 150, clientY: 100 }));
    document.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientX: 200, clientY: 140 }));
    document.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
    expect(onMove).not.toHaveBeenCalled();
    expect(host.querySelector(".dd-win-resize-handle")).toBeNull();
  });

  it('keeps its own size, centred, with compactLayout="fit"', () => {
    const onMove = vi.fn();
    compactSetup({ compactLayout: "fit", onMove });
    const host = getHost();
    expect(host.classList.contains("dd-window--fit")).toBe(true);
    expect(host.classList.contains("dd-window--maximized")).toBe(false);
    const header = host.querySelector(".dd-win-header") as HTMLElement;
    header.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: 150, clientY: 100 }));
    document.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientX: 200, clientY: 140 }));
    document.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
    expect(onMove).not.toHaveBeenCalled();
  });

  it("ignores compactLayout on a regular desktop", () => {
    setup({ compactLayout: "fit" });
    expect(getHost().classList.contains("dd-window--fit")).toBe(false);
  });

  it("is a normal window on a regular desktop", () => {
    setup();
    expect(getHost().classList.contains("dd-window--maximized")).toBe(false);
    expect(getHost().querySelector(".dd-win-resize-handle")).not.toBeNull();
  });
});

describe("Window — keeps itself on screen when it grows", () => {
  // happy-dom doesn't lay out, so sizes are faked and resizes triggered by hand
  let resized: (() => void) | null = null;
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", class {
      constructor(cb: () => void) { resized = cb; }
      observe() {}
      disconnect() { resized = null; }
    });
  });
  afterEach(() => { vi.unstubAllGlobals(); resized = null; });

  function size(el: Element, w: number, h: number) {
    Object.defineProperty(el, "offsetWidth", { configurable: true, value: w });
    Object.defineProperty(el, "offsetHeight", { configurable: true, value: h });
  }
  function place(props: Partial<React.ComponentProps<typeof Window>>, at: { left: number; top: number }) {
    const onMove = vi.fn();
    setup({ onMove, ...props });
    const host = getHost();
    const desktop = host.closest(".dd-desktop")!;
    Object.defineProperty(desktop, "clientWidth", { configurable: true, value: 800 });
    Object.defineProperty(desktop, "clientHeight", { configurable: true, value: 600 });
    host.style.left = `${at.left}px`;
    host.style.top = `${at.top}px`;
    return { host, onMove };
  }
  const grow = (host: HTMLElement, w: number, h: number) => { size(host, w, h); act(() => resized?.()); };

  it("moves up when it grows past the bottom, and reports where to", () => {
    const { host, onMove } = place({}, { left: 50, top: 400 });
    grow(host, 300, 150);
    grow(host, 300, 350);
    const top = parseFloat(host.style.top);
    expect(top).toBeLessThan(400);
    expect(top + 350).toBeLessThanOrEqual(600);
    expect(onMove).toHaveBeenLastCalledWith(50, top);
  });

  it("moves left when it grows past the right edge", () => {
    const { host, onMove } = place({}, { left: 600, top: 20 });
    grow(host, 100, 100);
    grow(host, 300, 100);
    expect(host.style.left).toBe("500px");
    expect(onMove).toHaveBeenLastCalledWith(500, 20);
  });

  it("goes to the top when it's taller than the desktop", () => {
    const { host } = place({}, { left: 0, top: 100 });
    grow(host, 100, 100);
    grow(host, 100, 900);
    expect(host.style.top).toBe("0px");
  });

  it("leaves it alone when it still fits", () => {
    const fits = place({}, { left: 10, top: 10 });
    grow(fits.host, 100, 100);
    grow(fits.host, 200, 200);
    expect(fits.onMove).not.toHaveBeenCalled();
  });

  it("can be turned off", () => {
    const { host, onMove } = place({ keepOnScreen: false }, { left: 50, top: 500 });
    grow(host, 300, 300);
    expect(resized).toBeNull();
    expect(host.style.top).toBe("500px");
    expect(onMove).not.toHaveBeenCalled();
  });
});
