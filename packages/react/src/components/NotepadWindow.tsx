import { useState, useCallback, useRef, type CSSProperties } from "react";
import { Window, type WindowProps } from "./Window";
import { MenuBar, Menu, MenuItem, MenuSeparator } from "./MenuBar";
import { StatusBar, StatusBarSection } from "./StatusBar";

export interface NotepadWindowProps extends Omit<WindowProps, "children" | "scrollContent" | "bodyOverflow"> {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  hideTabs?: boolean;
  style?: CSSProperties;
}

function getCaretInfo(text: string, pos: number) {
  const lines = text.slice(0, pos).split("\n");
  return { ln: lines.length, col: lines[lines.length - 1].length + 1 };
}

let _tid = 0;
function nextId() { return String(++_tid); }

interface NoteTab { id: string; title: string; text: string; }

export function NotepadWindow({ defaultValue = "", value, onChange, hideTabs = false, className, onClose, ...props }: NotepadWindowProps) {
  const controlled = value !== undefined;

  const [tabs, setTabs] = useState<NoteTab[]>(() => [{ id: nextId(), title: "Untitled", text: controlled ? value! : defaultValue }]);
  const [activeId, setActiveId] = useState(() => tabs[0].id);

  const activeTab = tabs.find((t) => t.id === activeId) ?? tabs[0];
  const text = controlled ? value! : activeTab.text;

  const [caret, setCaret] = useState({ ln: 1, col: 1 });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (!controlled) setTabs((ts) => ts.map((t) => t.id === activeId ? { ...t, text: val } : t));
    onChange?.(val);
  }, [controlled, onChange, activeId]);

  const handleSelect = useCallback((e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    setCaret(getCaretInfo(el.value, el.selectionStart ?? 0));
  }, []);

  const addTab = useCallback(() => {
    const id = nextId();
    setTabs((ts) => [...ts, { id, title: "Untitled", text: "" }]);
    setActiveId(id);
  }, []);

  const closeTab = useCallback((id: string) => {
    setTabs((ts) => {
      if (ts.length === 1) return ts;
      const idx = ts.findIndex((t) => t.id === id);
      const next = ts.filter((t) => t.id !== id);
      if (id === activeId) setActiveId(next[Math.max(0, idx - 1)].id);
      return next;
    });
  }, [activeId]);

  const renameActive = useCallback((title: string) => {
    setTabs((ts) => ts.map((t) => t.id === activeId ? { ...t, title } : t));
  }, [activeId]);

  // double-click tab label to rename
  const editingRef = useRef<string | null>(null);

  const surface = "var(--dd-menubar-bg, var(--color-surface, #d4d0c8))";
  const border = "var(--dd-border, var(--border, 1px solid #000))";

  return (
    <Window
      {...props}
      className={["dd-notepad-window", className].filter(Boolean).join(" ")}
      onClose={onClose}
      bodyOverflow="hidden"
    >
      <MenuBar>
        <Menu label="File">
          {!hideTabs && <MenuItem onClick={addTab}>New Tab</MenuItem>}
          {!hideTabs && <MenuSeparator />}
          <MenuItem onClick={onClose}>Exit</MenuItem>
        </Menu>
        <Menu label="Edit">
          <MenuItem onClick={() => { navigator.clipboard?.writeText(text); }}>Copy All</MenuItem>
          <MenuItem onClick={() => {
            if (!controlled) setTabs((ts) => ts.map((t) => t.id === activeId ? { ...t, text: "" } : t));
            onChange?.("");
          }}>Select All &amp; Delete</MenuItem>
        </Menu>
        <Menu label="Help">
          <MenuItem onClick={() => {}}>About Notepad</MenuItem>
        </Menu>
      </MenuBar>

      {/* tab strip */}
      {!hideTabs && <div style={{ display: "flex", alignItems: "stretch", background: surface, borderBottom: border, flexShrink: 0, fontSize: "0.875rem", userSelect: "none" }}>
        {tabs.map((tab) => {
          const active = tab.id === activeId;
          return (
            <div
              key={tab.id}
              onClick={() => setActiveId(tab.id)}
              onDoubleClick={() => {
                editingRef.current = tab.id;
                const title = prompt("Rename tab:", tab.title);
                if (title !== null && title.trim()) renameActive(title.trim());
                editingRef.current = null;
              }}
              style={{
                display: "flex", alignItems: "center", gap: "0.25rem",
                padding: "0.15rem 0.4rem 0.15rem 0.6rem",
                cursor: "pointer", whiteSpace: "nowrap",
                background: active ? "var(--color-input-background, #fff)" : "transparent",
                borderRight: border,
                borderBottom: active ? "1px solid var(--color-input-background, #fff)" : "none",
                marginBottom: active ? "-1px" : "0",
                fontWeight: active ? "bold" : "normal",
                position: "relative",
              }}
            >
              <span>{tab.title}</span>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "0 1px", font: "inherit", fontSize: "0.75rem", lineHeight: 1, opacity: 0.6 }}
                >×</button>
              )}
            </div>
          );
        })}
        <button
          onClick={addTab}
          style={{ background: "none", border: "none", borderRight: border, cursor: "pointer", padding: "0.15rem 0.5rem", font: "inherit", fontSize: "0.875rem", opacity: 0.7 }}
        >+</button>
      </div>}

      <div style={{ flex: 1, minHeight: 0, margin: "4px 6px", border, display: "flex" }}>
        <textarea
          key={activeId}
          value={text}
          onChange={handleChange}
          onSelect={handleSelect}
          onClick={handleSelect}
          onKeyUp={handleSelect}
          spellCheck={false}
          style={{
            flex: 1,
            resize: "none",
            border: "none",
            outline: "none",
            padding: "4px",
            fontFamily: "var(--font-ui, monospace)",
            fontSize: "0.85rem",
            background: "var(--color-input-background, #fff)",
            color: "var(--color-text, #000)",
          } as CSSProperties}
        />
      </div>
      <StatusBar>
        <StatusBarSection>Ln {caret.ln}, Col {caret.col}</StatusBarSection>
      </StatusBar>
    </Window>
  );
}
