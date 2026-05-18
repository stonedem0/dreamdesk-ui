import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Toolbar, ToolbarButton, ToolbarSeparator } from "../components/Toolbar";
import { StatusBar, StatusBarSection } from "../components/StatusBar";

describe("Toolbar", () => {
  it("renders label and icon", () => {
    render(<Toolbar><ToolbarButton icon="←" label="Back" /></Toolbar>);
    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.getByText("←")).toBeInTheDocument();
  });

  it("fires onClick when clicked", () => {
    const onClick = vi.fn();
    render(<Toolbar><ToolbarButton label="Save" onClick={onClick} /></Toolbar>);
    fireEvent.click(screen.getByText("Save"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not fire onClick when disabled", () => {
    const onClick = vi.fn();
    render(<Toolbar><ToolbarButton label="Save" disabled onClick={onClick} /></Toolbar>);
    fireEvent.click(screen.getByText("Save"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies active class when active", () => {
    render(<Toolbar><ToolbarButton label="History" active /></Toolbar>);
    expect(screen.getByText("History").closest("button")).toHaveClass("dd-toolbar-btn--active");
  });

  it("applies disabled class when disabled", () => {
    render(<Toolbar><ToolbarButton label="Back" disabled /></Toolbar>);
    expect(screen.getByText("Back").closest("button")).toHaveClass("dd-toolbar-btn--disabled");
  });

  it("renders separator", () => {
    const { container } = render(
      <Toolbar>
        <ToolbarButton label="A" />
        <ToolbarSeparator />
        <ToolbarButton label="B" />
      </Toolbar>
    );
    expect(container.querySelector(".dd-toolbar-sep")).toBeInTheDocument();
  });
});

describe("StatusBar", () => {
  it("renders section content", () => {
    render(
      <StatusBar>
        <StatusBarSection>Ready</StatusBarSection>
      </StatusBar>
    );
    expect(screen.getByText("Ready")).toBeInTheDocument();
  });

  it("applies flex class to flex section", () => {
    const { container } = render(
      <StatusBar>
        <StatusBarSection flex>Status</StatusBarSection>
      </StatusBar>
    );
    expect(container.querySelector(".dd-statusbar-section--flex")).toBeInTheDocument();
  });

  it("renders multiple sections", () => {
    render(
      <StatusBar>
        <StatusBarSection flex>Done</StatusBarSection>
        <StatusBarSection>Internet</StatusBarSection>
      </StatusBar>
    );
    expect(screen.getByText("Done")).toBeInTheDocument();
    expect(screen.getByText("Internet")).toBeInTheDocument();
  });
});
