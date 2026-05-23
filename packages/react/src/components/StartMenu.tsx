import { useEffect, useRef, useState, useCallback } from "react";
import { Icon } from "./Icon";
import "./StartMenu.css";

export interface StartMenuItemDef {
  id: string;
  label: string;
  icon?: string;
  divider?: boolean;
}

export interface StartMenuProps {
  label?: string;
  items: StartMenuItemDef[];
  onSelect: (id: string) => void;
  buttonLabel?: string;
  className?: string;
}

export function StartMenu({ label = "DreamDesk", items, onSelect, buttonLabel = "Start", className }: StartMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return (
    <div ref={wrapRef} className={["dd-startmenu-wrap", className].filter(Boolean).join(" ")}>
      {open && (
        <div className="dd-startmenu">
          <div className="dd-startmenu-brand">{label}</div>
          <ul className="dd-startmenu-list">
            {items.map((item) =>
              item.divider ? (
                <li key={item.id} className="dd-startmenu-divider" role="separator" />
              ) : (
                <li
                  key={item.id}
                  className="dd-startmenu-item"
                  role="menuitem"
                  onClick={() => {
                    onSelect(item.id);
                    close();
                  }}
                >
                  {item.icon && <Icon src={item.icon} size={24} className="dd-startmenu-icon" />}
                  <span>{item.label}</span>
                </li>
              )
            )}
          </ul>
        </div>
      )}
      <button
        className={["dd-startmenu-btn", open ? "dd-startmenu-btn--active" : ""].filter(Boolean).join(" ")}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
