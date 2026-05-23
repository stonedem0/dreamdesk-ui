import { useState, useCallback, type CSSProperties } from "react";
import { Icon } from "./Icon";
import "./ListView.css";

export type ListViewMode = "icons" | "details";

export interface ListViewItem {
  id: string;
  name: string;
  icon?: string;
  size?: string;
  type?: string;
  date?: string;
}

type SortKey = "name" | "size" | "type" | "date";
type SortDir = "asc" | "desc";

export interface ListViewProps {
  items: ListViewItem[];
  mode?: ListViewMode;
  selected?: string[];
  multiSelect?: boolean;
  onSelect?: (ids: string[]) => void;
  onOpen?: (id: string) => void;
  className?: string;
  style?: CSSProperties;
}

function ItemIcon({ icon, size }: { icon?: string; size: number }) {
  if (!icon) return null;
  const isImage = icon.startsWith("/") || icon.startsWith("http") || icon.startsWith("<svg");
  return (
    <span className="dd-listview-icon">
      {isImage ? <Icon src={icon} size={size} /> : <span style={{ fontSize: size * 0.75 }}>{icon}</span>}
    </span>
  );
}

export function ListView({
  items,
  mode = "details",
  selected = [],
  multiSelect = false,
  onSelect,
  onOpen,
  className,
  style,
}: ListViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleHeaderClick = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const sorted = [...items].sort((a, b) => {
    const av = (a[sortKey] ?? "").toLowerCase();
    const bv = (b[sortKey] ?? "").toLowerCase();
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const handleSelect = useCallback((id: string, e: React.MouseEvent) => {
    if (!multiSelect) { onSelect?.([id]); return; }
    if (e.ctrlKey || e.metaKey) {
      onSelect?.(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
    } else {
      onSelect?.([id]);
    }
  }, [selected, multiSelect, onSelect]);

  const SortIndicator = ({ col }: { col: SortKey }) =>
    sortKey === col ? <span className="dd-listview-sort-arrow">{sortDir === "asc" ? " ▲" : " ▼"}</span> : null;

  if (mode === "icons") {
    return (
      <div className={["dd-listview dd-listview--icons", className].filter(Boolean).join(" ")} style={style} role="listbox">
        {sorted.map(item => (
          <div
            key={item.id}
            className={["dd-listview-icon-item", selected.includes(item.id) && "dd-listview-item--selected"].filter(Boolean).join(" ")}
            role="option"
            aria-selected={selected.includes(item.id)}
            onClick={e => handleSelect(item.id, e)}
            onDoubleClick={() => onOpen?.(item.id)}
          >
            <ItemIcon icon={item.icon} size={32} />
            <span className="dd-listview-icon-label">{item.name}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={["dd-listview dd-listview--details", className].filter(Boolean).join(" ")} style={style}>
      <table className="dd-listview-table" role="grid">
        <thead>
          <tr>
            <th className="dd-listview-th dd-listview-th--name" onClick={() => handleHeaderClick("name")}>
              Name<SortIndicator col="name" />
            </th>
            <th className="dd-listview-th" onClick={() => handleHeaderClick("size")}>
              Size<SortIndicator col="size" />
            </th>
            <th className="dd-listview-th" onClick={() => handleHeaderClick("type")}>
              Type<SortIndicator col="type" />
            </th>
            <th className="dd-listview-th dd-listview-th--date" onClick={() => handleHeaderClick("date")}>
              Date Modified<SortIndicator col="date" />
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(item => (
            <tr
              key={item.id}
              className={["dd-listview-row", selected.includes(item.id) && "dd-listview-item--selected"].filter(Boolean).join(" ")}
              role="row"
              aria-selected={selected.includes(item.id)}
              onClick={e => handleSelect(item.id, e)}
              onDoubleClick={() => onOpen?.(item.id)}
            >
              <td className="dd-listview-td dd-listview-td--name">
                <ItemIcon icon={item.icon} size={16} />
                <span>{item.name}</span>
              </td>
              <td className="dd-listview-td">{item.size ?? ""}</td>
              <td className="dd-listview-td">{item.type ?? ""}</td>
              <td className="dd-listview-td">{item.date ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
