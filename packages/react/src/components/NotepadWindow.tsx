import { useState, useCallback, type CSSProperties } from "react";
import { Window, type WindowProps } from "./Window";
import { MenuBar, Menu, MenuItem, MenuSeparator } from "./MenuBar";
import { StatusBar, StatusBarSection } from "./StatusBar";

export interface NotepadWindowProps extends Omit<WindowProps, "children" | "scrollContent" | "bodyOverflow"> {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  style?: CSSProperties;
}

function getCaretInfo(text: string, pos: number) {
  const lines = text.slice(0, pos).split("\n");
  return { ln: lines.length, col: lines[lines.length - 1].length + 1 };
}

export function NotepadWindow({ defaultValue = "", value, onChange, className, onClose, ...props }: NotepadWindowProps) {
  const controlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const text = controlled ? value! : internal;

  const [caret, setCaret] = useState({ ln: 1, col: 1 });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!controlled) setInternal(e.target.value);
    onChange?.(e.target.value);
  }, [controlled, onChange]);

  const handleSelect = useCallback((e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    setCaret(getCaretInfo(el.value, el.selectionStart ?? 0));
  }, []);

  const clear = useCallback(() => {
    if (!controlled) setInternal("");
    onChange?.("");
  }, [controlled, onChange]);

  return (
    <Window
      {...props}
      className={["dd-notepad-window", className].filter(Boolean).join(" ")}
      onClose={onClose}
      bodyOverflow="hidden"
    >
      <MenuBar>
        <Menu label="File">
          <MenuItem onClick={clear}>New</MenuItem>
          <MenuSeparator />
          <MenuItem onClick={onClose}>Exit</MenuItem>
        </Menu>
        <Menu label="Edit">
          <MenuItem onClick={() => { navigator.clipboard?.writeText(text); }}>Copy All</MenuItem>
          <MenuItem onClick={clear}>Select All &amp; Delete</MenuItem>
        </Menu>
      </MenuBar>
      <div style={{ flex: 1, minHeight: 0, margin: "4px 6px", border: "var(--dd-border, var(--border, 1px solid #000))", display: "flex" }}>
        <textarea
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
