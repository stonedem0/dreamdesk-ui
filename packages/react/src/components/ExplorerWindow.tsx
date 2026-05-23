import { useState, type CSSProperties } from "react";
import { Window, type WindowProps } from "./Window";
import { TreeView, type TreeNode } from "./TreeView";
import { ListView, type ListViewItem, type ListViewMode } from "./ListView";
import { Toolbar, ToolbarButton, ToolbarSeparator } from "./Toolbar";
import { StatusBar, StatusBarSection } from "./StatusBar";

export interface ExplorerWindowProps extends Omit<WindowProps, "children" | "bodyOverflow"> {
  nodes: TreeNode[];
  items?: ListViewItem[];
  selectedNode?: string;
  onNodeSelect?: (id: string) => void;
  onItemOpen?: (id: string) => void;
  mode?: ListViewMode;
  style?: CSSProperties;
}

const ICONS_SVG = `<svg viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="3" width="6" height="5"/><rect x="9" y="5" width="6" height="7"/><rect x="1" y="10" width="6" height="5"/></svg>`;
const DETAILS_SVG = `<svg viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="2" width="14" height="2"/><rect x="1" y="7" width="14" height="2"/><rect x="1" y="12" width="14" height="2"/></svg>`;
const UP_SVG = `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 3l5 6H3z"/></svg>`;

export function ExplorerWindow({
  nodes,
  items = [],
  selectedNode,
  onNodeSelect,
  onItemOpen,
  mode: modeProp,
  className,
  ...props
}: ExplorerWindowProps) {
  const [mode, setMode] = useState<ListViewMode>(modeProp ?? "details");
  const [treeSelected, setTreeSelected] = useState(selectedNode ?? nodes[0]?.id ?? "");
  const [listSelected, setListSelected] = useState<string[]>([]);

  const handleNodeSelect = (id: string) => {
    setTreeSelected(id);
    setListSelected([]);
    onNodeSelect?.(id);
  };

  return (
    <Window
      {...props}
      className={["dd-explorer-window", className].filter(Boolean).join(" ")}
      bodyOverflow="hidden"
    >
      <Toolbar>
        <ToolbarButton icon={UP_SVG} label="Up" onClick={() => {
          const parent = findParent(nodes, treeSelected);
          if (parent) handleNodeSelect(parent);
        }} />
        <ToolbarSeparator />
        <ToolbarButton icon={ICONS_SVG} label="Icons" active={mode === "icons"} onClick={() => setMode("icons")} />
        <ToolbarButton icon={DETAILS_SVG} label="Details" active={mode === "details"} onClick={() => setMode("details")} />
      </Toolbar>
      <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
        <div style={{ width: "180px", flexShrink: 0, borderRight: "var(--dd-border, var(--border, 1px solid #000))", overflow: "auto" }}>
          <TreeView
            nodes={nodes}
            selected={treeSelected}
            onSelect={handleNodeSelect}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0, overflow: "auto" }}>
          <ListView
            items={items}
            mode={mode}
            selected={listSelected}
            multiSelect
            onSelect={setListSelected}
            onOpen={onItemOpen}
          />
        </div>
      </div>
      <StatusBar>
        <StatusBarSection>{items.length} item{items.length !== 1 ? "s" : ""}</StatusBarSection>
        {listSelected.length > 0 && <StatusBarSection>{listSelected.length} selected</StatusBarSection>}
      </StatusBar>
    </Window>
  );
}

function findParent(nodes: TreeNode[], targetId: string, parentId?: string): string | undefined {
  for (const node of nodes) {
    if (node.id === targetId) return parentId;
    if (node.children) {
      const found = findParent(node.children, targetId, node.id);
      if (found !== undefined) return found;
    }
  }
  return undefined;
}
