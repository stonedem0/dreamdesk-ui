import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TreeView, type TreeNode } from "../components/TreeView";
import { ListView, type ListViewItem } from "../components/ListView";

const NODES: TreeNode[] = [
  { id: "root", label: "Root", children: [
    { id: "docs", label: "Documents", children: [
      { id: "file1", label: "readme.txt" },
      { id: "file2", label: "notes.txt" },
    ]},
    { id: "downloads", label: "Downloads" },
  ]},
];

const ITEMS: ListViewItem[] = [
  { id: "a", name: "Alpha", icon: "📄", size: "1 KB", type: "Text", date: "5/1/2026" },
  { id: "b", name: "Beta",  icon: "📄", size: "2 KB", type: "Text", date: "5/2/2026" },
  { id: "c", name: "Gamma", icon: "📁", type: "Folder", date: "5/3/2026" },
];

// ── TreeView ──────────────────────────────────────────────────────────────────

describe("TreeView", () => {
  it("renders root nodes", () => {
    render(<TreeView nodes={NODES} />);
    expect(screen.getByText("Root")).toBeInTheDocument();
  });

  it("hides children when collapsed", () => {
    render(<TreeView nodes={NODES} />);
    expect(screen.queryByText("Documents")).not.toBeInTheDocument();
  });

  it("shows children when node is in defaultExpanded", () => {
    render(<TreeView nodes={NODES} defaultExpanded={["root"]} />);
    expect(screen.getByText("Documents")).toBeInTheDocument();
    expect(screen.getByText("Downloads")).toBeInTheDocument();
  });

  it("expands node on [+] click", () => {
    render(<TreeView nodes={NODES} />);
    fireEvent.click(screen.getByText("+"));
    expect(screen.getByText("Documents")).toBeInTheDocument();
  });

  it("collapses node on [-] click", () => {
    render(<TreeView nodes={NODES} defaultExpanded={["root"]} />);
    fireEvent.click(screen.getByText("−"));
    expect(screen.queryByText("Documents")).not.toBeInTheDocument();
  });

  it("calls onSelect when node is clicked", () => {
    const onSelect = vi.fn();
    render(<TreeView nodes={NODES} defaultExpanded={["root"]} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Documents"));
    expect(onSelect).toHaveBeenCalledWith("docs");
  });

  it("marks selected node with selected class", () => {
    render(<TreeView nodes={NODES} defaultExpanded={["root"]} selected="docs" />);
    expect(screen.getByText("Documents").closest(".dd-tree-node")).toHaveClass("dd-tree-node--selected");
  });

  it("calls onOpen on double-click", () => {
    const onOpen = vi.fn();
    render(<TreeView nodes={NODES} defaultExpanded={["root"]} onOpen={onOpen} />);
    fireEvent.dblClick(screen.getByText("Downloads"));
    expect(onOpen).toHaveBeenCalledWith("downloads");
  });

  it("navigates down with ArrowDown", () => {
    const onSelect = vi.fn();
    render(<TreeView nodes={NODES} defaultExpanded={["root"]} selected="root" onSelect={onSelect} />);
    fireEvent.keyDown(screen.getByRole("tree"), { key: "ArrowDown" });
    expect(onSelect).toHaveBeenCalledWith("docs");
  });

  it("expands with ArrowRight and collapses with ArrowLeft", () => {
    const onSelect = vi.fn();
    render(<TreeView nodes={NODES} selected="root" onSelect={onSelect} />);
    expect(screen.queryByText("Documents")).not.toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole("tree"), { key: "ArrowRight" });
    expect(screen.getByText("Documents")).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole("tree"), { key: "ArrowLeft" });
    expect(screen.queryByText("Documents")).not.toBeInTheDocument();
  });
});

// ── ListView ──────────────────────────────────────────────────────────────────

describe("ListView (details)", () => {
  it("renders all items", () => {
    render(<ListView items={ITEMS} />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByText("Gamma")).toBeInTheDocument();
  });

  it("calls onSelect when row clicked", () => {
    const onSelect = vi.fn();
    render(<ListView items={ITEMS} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Alpha"));
    expect(onSelect).toHaveBeenCalledWith(["a"]);
  });

  it("calls onOpen on double-click", () => {
    const onOpen = vi.fn();
    render(<ListView items={ITEMS} onOpen={onOpen} />);
    fireEvent.dblClick(screen.getByText("Beta"));
    expect(onOpen).toHaveBeenCalledWith("b");
  });

  it("marks selected rows", () => {
    render(<ListView items={ITEMS} selected={["b"]} />);
    expect(screen.getByText("Beta").closest("tr")).toHaveClass("dd-listview-item--selected");
  });

  it("sorts by name descending on header click", () => {
    render(<ListView items={ITEMS} />);
    fireEvent.click(screen.getByText("Name")); // default is asc → one click = desc
    const cells = screen.getAllByRole("row").slice(1).map(r =>
      r.querySelector(".dd-listview-td--name > span:last-child")?.textContent
    );
    expect(cells[0]).toBe("Gamma");
  });
});

describe("ListView (icons)", () => {
  it("renders items in icon mode", () => {
    render(<ListView items={ITEMS} mode="icons" />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
  });

  it("calls onSelect in icon mode", () => {
    const onSelect = vi.fn();
    render(<ListView items={ITEMS} mode="icons" onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Alpha"));
    expect(onSelect).toHaveBeenCalledWith(["a"]);
  });
});
