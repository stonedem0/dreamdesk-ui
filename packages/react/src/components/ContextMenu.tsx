import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type CSSProperties,
  type ReactNode,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import "./ContextMenu.css";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ContextMenuItem =
  | { type?: "item"; label: string; icon?: ReactNode; shortcut?: string; disabled?: boolean; onClick: () => void }
  | { type: "separator" };

export interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

// ── ContextMenu ───────────────────────────────────────────────────────────────

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Clamp to viewport after mount
  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const cx = x + width > window.innerWidth ? window.innerWidth - width - 4 : x;
    const cy = y + height > window.innerHeight ? window.innerHeight - height - 4 : y;
    el.style.setProperty("--dd-cm-x", `${cx}px`);
    el.style.setProperty("--dd-cm-y", `${cy}px`);
  }, [x, y]);

  // Close on outside mousedown, Escape, or scroll
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const onDown = () => onClose();
    const onScroll = () => onClose();
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [onClose]);

  return createPortal(
    <div
      ref={menuRef}
      className="dd-context-menu"
      style={{ "--dd-cm-x": `${x}px`, "--dd-cm-y": `${y}px` } as CSSProperties}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {items.map((item, i) =>
        item.type === "separator" ? (
          <div key={i} className="dd-cm-separator" />
        ) : (
          <button
            key={i}
            className="dd-cm-item"
            disabled={item.disabled}
            onClick={() => { if (!item.disabled) { item.onClick(); onClose(); } }}
          >
            {item.icon !== undefined && <span className="dd-cm-icon">{item.icon}</span>}
            <span className="dd-cm-label">{item.label}</span>
            {item.shortcut && <span className="dd-cm-shortcut">{item.shortcut}</span>}
          </button>
        )
      )}
    </div>,
    document.body
  );
}

// ── useContextMenu hook ───────────────────────────────────────────────────────

export function useContextMenu(items: ContextMenuItem[]) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const onContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPos({ x: e.clientX, y: e.clientY });
  }, []);

  const contextMenu = pos ? (
    <ContextMenu x={pos.x} y={pos.y} items={items} onClose={() => setPos(null)} />
  ) : null;

  return { onContextMenu, contextMenu };
}
