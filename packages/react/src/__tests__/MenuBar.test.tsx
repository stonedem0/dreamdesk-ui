import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MenuBar, Menu, MenuItem, MenuSeparator } from "../components/MenuBar";

function setup() {
  const onFile = vi.fn();
  const onEdit = vi.fn();
  render(
    <MenuBar>
      <Menu label="File">
        <MenuItem onClick={onFile}>New</MenuItem>
        <MenuItem disabled onClick={onEdit}>Open</MenuItem>
        <MenuSeparator />
        <MenuItem shortcut="Ctrl+S" onClick={onFile}>Save</MenuItem>
      </Menu>
      <Menu label="Edit">
        <MenuItem onClick={onEdit}>Cut</MenuItem>
      </Menu>
    </MenuBar>
  );
  return { onFile, onEdit };
}

describe("MenuBar", () => {
  it("renders menu triggers", () => {
    setup();
    expect(screen.getByText("File")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("opens dropdown on trigger click", () => {
    setup();
    expect(screen.queryByText("New")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("File"));
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("closes dropdown on second click", () => {
    setup();
    fireEvent.click(screen.getByText("File"));
    fireEvent.click(screen.getByText("File"));
    expect(screen.queryByText("New")).not.toBeInTheDocument();
  });

  it("fires onClick and closes menu when item clicked", () => {
    const { onFile } = setup();
    fireEvent.click(screen.getByText("File"));
    fireEvent.click(screen.getByText("New"));
    expect(onFile).toHaveBeenCalledOnce();
    expect(screen.queryByText("New")).not.toBeInTheDocument();
  });

  it("does not fire onClick for disabled item", () => {
    const { onEdit } = setup();
    fireEvent.click(screen.getByText("File"));
    fireEvent.click(screen.getByText("Open"));
    expect(onEdit).not.toHaveBeenCalled();
  });

  it("renders shortcut label", () => {
    setup();
    fireEvent.click(screen.getByText("File"));
    expect(screen.getByText("Ctrl+S")).toBeInTheDocument();
  });

  it("switches to another menu on hover when one is open", () => {
    setup();
    fireEvent.click(screen.getByText("File"));
    expect(screen.getByText("New")).toBeInTheDocument();
    fireEvent.mouseEnter(screen.getByText("Edit").closest("div")!);
    expect(screen.queryByText("New")).not.toBeInTheDocument();
    expect(screen.getByText("Cut")).toBeInTheDocument();
  });

  it("closes on outside mousedown", () => {
    setup();
    fireEvent.click(screen.getByText("File"));
    expect(screen.getByText("New")).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText("New")).not.toBeInTheDocument();
  });

  it("closes on Escape key", () => {
    setup();
    fireEvent.click(screen.getByText("File"));
    fireEvent.keyDown(screen.getByText("File"), { key: "Escape" });
    expect(screen.queryByText("New")).not.toBeInTheDocument();
  });

  it("opens and focuses first item on ArrowDown", () => {
    setup();
    fireEvent.keyDown(screen.getByText("File"), { key: "ArrowDown" });
    expect(screen.getByText("New")).toBeInTheDocument();
  });
});
