import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ContextMenu, useContextMenu } from "../components/ContextMenu";

function setup(onClose = vi.fn()) {
  const items = [
    { label: "Open", onClick: vi.fn() },
    { label: "Delete", disabled: true as const, onClick: vi.fn() },
    { type: "separator" as const },
    { label: "Rename", onClick: vi.fn() },
  ];
  render(<ContextMenu x={100} y={100} items={items} onClose={onClose} />);
  return { onClose, items };
}

describe("ContextMenu", () => {
  it("renders item labels", () => {
    setup();
    expect(screen.getByText("Open")).toBeInTheDocument();
    expect(screen.getByText("Rename")).toBeInTheDocument();
  });

  it("renders separator element", () => {
    setup();
    expect(document.querySelector(".dd-cm-separator")).toBeInTheDocument();
  });

  it("calls item onClick and onClose when item is clicked", () => {
    const onClose = vi.fn();
    const onClick = vi.fn();
    render(<ContextMenu x={0} y={0} items={[{ label: "Go", onClick }]} onClose={onClose} />);
    fireEvent.click(screen.getByText("Go"));
    expect(onClick).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not call item onClick when item is disabled", () => {
    const onClick = vi.fn();
    const onClose = vi.fn();
    render(<ContextMenu x={0} y={0} items={[{ label: "No", disabled: true, onClick }]} onClose={onClose} />);
    fireEvent.click(screen.getByText("No"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders shortcut label when provided", () => {
    render(
      <ContextMenu
        x={0} y={0}
        items={[{ label: "Copy", shortcut: "Ctrl+C", onClick: vi.fn() }]}
        onClose={vi.fn()}
      />
    );
    expect(screen.getByText("Ctrl+C")).toBeInTheDocument();
  });

  it("calls onClose on Escape key", () => {
    const { onClose } = setup();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose on outside mousedown", () => {
    const { onClose } = setup();
    fireEvent.mouseDown(document.body);
    expect(onClose).toHaveBeenCalledOnce();
  });
});

describe("useContextMenu", () => {
  function Host() {
    const { onContextMenu, contextMenu } = useContextMenu([
      { label: "Action", onClick: vi.fn() },
    ]);
    return <div onContextMenu={onContextMenu} data-testid="host">{contextMenu}</div>;
  }

  it("opens on contextmenu event", () => {
    render(<Host />);
    fireEvent.contextMenu(screen.getByTestId("host"), { clientX: 50, clientY: 50 });
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("closes on Escape after opening", () => {
    render(<Host />);
    fireEvent.contextMenu(screen.getByTestId("host"), { clientX: 50, clientY: 50 });
    expect(screen.getByText("Action")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByText("Action")).not.toBeInTheDocument();
  });
});
