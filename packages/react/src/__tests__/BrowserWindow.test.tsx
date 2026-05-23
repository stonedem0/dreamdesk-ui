import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Desktop } from "../components/Desktop";
import { BrowserWindow, BrowserErrorPage } from "../components/BrowserWindow";

function setup(props: Partial<React.ComponentProps<typeof BrowserWindow>> = {}) {
  return render(
    <Desktop style={{ width: "800px", height: "600px" }}>
      <BrowserWindow title="Browser" width="600px" height="400px" defaultOpen {...props} />
    </Desktop>
  );
}

describe("BrowserWindow — address bar", () => {
  it("shows url in address bar", () => {
    setup({ url: "https://example.com" });
    expect(screen.getByDisplayValue("https://example.com")).toBeInTheDocument();
  });

  it("calls onNavigate when Go button is clicked", () => {
    const onNavigate = vi.fn();
    setup({ url: "https://example.com", onNavigate });
    fireEvent.click(screen.getByText("Go"));
    expect(onNavigate).toHaveBeenCalledWith("https://example.com");
  });

  it("calls onNavigate when Enter is pressed in address bar", () => {
    const onNavigate = vi.fn();
    setup({ url: "https://example.com", onNavigate });
    fireEvent.keyDown(screen.getByDisplayValue("https://example.com"), { key: "Enter" });
    expect(onNavigate).toHaveBeenCalledWith("https://example.com");
  });

  it("updates address bar when url prop changes", () => {
    const { rerender } = setup({ url: "https://a.com" });
    expect(screen.getByDisplayValue("https://a.com")).toBeInTheDocument();
    rerender(
      <Desktop style={{ width: "800px", height: "600px" }}>
        <BrowserWindow title="Browser" defaultOpen url="https://b.com" />
      </Desktop>
    );
    expect(screen.getByDisplayValue("https://b.com")).toBeInTheDocument();
  });
});

describe("BrowserWindow — toolbar buttons", () => {
  it("Back button is disabled when canGoBack is false", () => {
    setup({ canGoBack: false });
    expect(screen.getByText("Back").closest("button")).toHaveAttribute("aria-disabled", "true");
  });

  it("Forward button is disabled when canGoForward is false", () => {
    setup({ canGoForward: false });
    expect(screen.getByText("Forward").closest("button")).toHaveAttribute("aria-disabled", "true");
  });

  it("calls onBack when Back button is clicked", () => {
    const onBack = vi.fn();
    setup({ canGoBack: true, onBack });
    fireEvent.click(screen.getByText("Back").closest("button")!);
    expect(onBack).toHaveBeenCalledOnce();
  });

  it("calls onRefresh when Refresh button is clicked", () => {
    const onRefresh = vi.fn();
    setup({ onRefresh });
    fireEvent.click(screen.getByText("Refresh").closest("button")!);
    expect(onRefresh).toHaveBeenCalledOnce();
  });

  it("calls onHome when Home button is clicked", () => {
    const onHome = vi.fn();
    setup({ onHome });
    fireEvent.click(screen.getByText("Home").closest("button")!);
    expect(onHome).toHaveBeenCalledOnce();
  });
});

describe("BrowserWindow — history", () => {
  it("opens history dropdown when History button is clicked", () => {
    setup({ history: ["https://a.com", "https://b.com"] });
    fireEvent.click(screen.getByText("History").closest("button")!);
    expect(screen.getByText("https://a.com")).toBeInTheDocument();
  });

  it("calls onNavigate with history item url when clicked", () => {
    const onNavigate = vi.fn();
    setup({ history: ["https://a.com"], onNavigate });
    fireEvent.click(screen.getByText("History").closest("button")!);
    fireEvent.click(screen.getByText("https://a.com"));
    expect(onNavigate).toHaveBeenCalledWith("https://a.com");
  });

  it("closes history dropdown after selecting an item", () => {
    setup({ history: ["https://a.com"] });
    fireEvent.click(screen.getByText("History").closest("button")!);
    fireEvent.click(screen.getByText("https://a.com"));
    expect(screen.queryByText("https://a.com")).not.toBeInTheDocument();
  });
});

describe("BrowserWindow — status and content", () => {
  it("shows status text in status bar", () => {
    setup({ status: "Loading..." });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders children in content area", () => {
    render(
      <Desktop style={{ width: "800px", height: "600px" }}>
        <BrowserWindow title="Browser" defaultOpen><p>Page content</p></BrowserWindow>
      </Desktop>
    );
    expect(screen.getByText("Page content")).toBeInTheDocument();
  });
});

describe("BrowserErrorPage", () => {
  it("renders error title", () => {
    render(<BrowserErrorPage />);
    expect(screen.getByText("The page cannot be displayed")).toBeInTheDocument();
  });

  it("shows url when provided", () => {
    render(<BrowserErrorPage url="https://broken.com" />);
    expect(screen.getByText("https://broken.com")).toBeInTheDocument();
  });

  it("calls onRefresh when Refresh button is clicked", () => {
    const onRefresh = vi.fn();
    render(<BrowserErrorPage onRefresh={onRefresh} />);
    fireEvent.click(screen.getByText("Refresh"));
    expect(onRefresh).toHaveBeenCalledOnce();
  });
});
