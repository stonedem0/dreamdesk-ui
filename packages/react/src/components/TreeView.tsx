import {
  useState,
  useCallback,
  useRef,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { Icon } from "./Icon";
import "./TreeView.css";

export interface TreeNode {
  id: string;
  label: string;
  icon?: string;
  children?: TreeNode[];
}

export interface TreeViewProps {
  nodes: TreeNode[];
  selected?: string;
  defaultExpanded?: string[];
  onSelect?: (id: string) => void;
  onOpen?: (id: string) => void;
  className?: string;
  style?: CSSProperties;
}

function flattenVisible(nodes: TreeNode[], expanded: Set<string>): TreeNode[] {
  const result: TreeNode[] = [];
  for (const node of nodes) {
    result.push(node);
    if (node.children?.length && expanded.has(node.id)) {
      result.push(...flattenVisible(node.children, expanded));
    }
  }
  return result;
}

interface NodeRowProps {
  node: TreeNode;
  depth: number;
  isLast: boolean;
  expanded: Set<string>;
  selected: string | undefined;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
}

function NodeRow({ node, depth, isLast, expanded, selected, onToggle, onSelect, onOpen }: NodeRowProps) {
  const hasChildren = !!node.children?.length;
  const isExpanded = expanded.has(node.id);
  const isSelected = selected === node.id;
  const isImage = node.icon && (node.icon.startsWith("/") || node.icon.startsWith("http") || node.icon.startsWith("<svg"));

  return (
    <div
      className={["dd-tree-node", isSelected && "dd-tree-node--selected"].filter(Boolean).join(" ")}
      role="treeitem"
      aria-selected={isSelected}
      aria-expanded={hasChildren ? isExpanded : undefined}
      tabIndex={isSelected ? 0 : -1}
      onClick={() => onSelect(node.id)}
      onDoubleClick={() => onOpen(node.id)}
    >
      {/* Indent guides — one per ancestor depth */}
      {Array.from({ length: depth }, (_, i) => (
        <span key={i} className="dd-tree-indent" />
      ))}

      {/* Connector: horizontal line + optional [+/-] box */}
      <span className={["dd-tree-connector", isLast && "dd-tree-connector--last"].filter(Boolean).join(" ")}>
        {hasChildren && (
          <button
            className="dd-tree-expander"
            tabIndex={-1}
            onClick={e => { e.stopPropagation(); onToggle(node.id); }}
          >
            {isExpanded ? "−" : "+"}
          </button>
        )}
      </span>

      {/* Icon */}
      {node.icon && (
        <span className="dd-tree-node-icon">
          {isImage ? <Icon src={node.icon} size={16} /> : node.icon}
        </span>
      )}

      {/* Label */}
      <span className="dd-tree-node-label">{node.label}</span>
    </div>
  );
}

export function TreeView({ nodes, selected, defaultExpanded = [], onSelect, onOpen, className, style }: TreeViewProps) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(defaultExpanded));
  const rootRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback((id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const handleSelect = useCallback((id: string) => onSelect?.(id), [onSelect]);
  const handleOpen = useCallback((id: string) => onOpen?.(id), [onOpen]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!selected) return;
    const visible = flattenVisible(nodes, expanded);
    const idx = visible.findIndex(n => n.id === selected);
    if (idx === -1) return;
    const cur = visible[idx];

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (idx < visible.length - 1) onSelect?.(visible[idx + 1].id);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (idx > 0) onSelect?.(visible[idx - 1].id);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (cur.children?.length && !expanded.has(cur.id)) toggle(cur.id);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (expanded.has(cur.id)) toggle(cur.id);
    } else if (e.key === "Enter") {
      e.preventDefault();
      onOpen?.(cur.id);
    }
  };

  function renderNodes(nodeList: TreeNode[], depth: number) {
    return nodeList.map((node, i) => {
      const isLast = i === nodeList.length - 1;
      return (
        <div key={node.id} className={["dd-tree-subtree", isLast && "dd-tree-subtree--last"].filter(Boolean).join(" ")}>
          <NodeRow
            node={node}
            depth={depth}
            isLast={isLast}
            expanded={expanded}
            selected={selected}
            onToggle={toggle}
            onSelect={handleSelect}
            onOpen={handleOpen}
          />
          {node.children?.length && expanded.has(node.id) ? (
            <div role="group">{renderNodes(node.children, depth + 1)}</div>
          ) : null}
        </div>
      );
    });
  }

  return (
    <div
      ref={rootRef}
      className={["dd-treeview", className].filter(Boolean).join(" ")}
      style={style}
      role="tree"
      onKeyDown={handleKeyDown}
    >
      {renderNodes(nodes, 0)}
    </div>
  );
}
