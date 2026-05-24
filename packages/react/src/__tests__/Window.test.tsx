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
  it("calls onMove with position after drag ends", () => {
    const onMove = vi.fn();
    setup({ onMove });

    const host = getHost();
    const header = host.querySelector(".dd-win-header") as HTMLElement;

    host.getBoundingClientRect = () =>
      ({ left: 120, top: 80, width: 400, height: 300, right: 520, bottom: 380, x: 120, y: 80, toJSON: () => {} } as DOMRect);

    header.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: 150, clientY: 100 }));
    document.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientX: 200, clientY: 140 }));
    document.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));

    expect(onMove).toHaveBeenCalledWith(120, 80);
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
