import { useEffect, useMemo, useState } from "react";
import type { Story } from "@ladle/react";
import { Desktop } from "../components/Desktop";
import { Window } from "../components/Window";
import { Taskbar } from "../components/Taskbar";
import { StartMenu } from "../components/StartMenu";
import { Button } from "../components/Button";
import { Tag } from "../components/Tag";
import { ListView } from "../components/ListView";
import { appIcon, fileIcon, folderIcon } from "./icons";

/** The theme the page shows (set by the switcher above every story). */
const currentTheme = () => document.documentElement.getAttribute("data-theme") ?? "pastelcore";

function useCurrentTheme() {
  const [theme, setTheme] = useState(currentTheme);
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(currentTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

/** Every custom property the theme's own rule sets, in the order it sets them. */
function themeVariables(theme: string): [string, string][] {
  const found = new Map<string, string>();
  const selector = `html[data-theme="${theme}"]`;
  const visit = (rules: CSSRuleList) => {
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSStyleRule && rule.selectorText === selector) {
        for (const name of Array.from(rule.style)) {
          if (name.startsWith("--")) found.set(name, rule.style.getPropertyValue(name).trim());
        }
      } else if ("cssRules" in rule) {
        visit((rule as CSSGroupingRule).cssRules);
      }
    }
  };
  for (const sheet of Array.from(document.styleSheets)) {
    try { visit(sheet.cssRules); } catch { /* another origin's sheet */ }
  }
  return [...found];
}

/** "#ff00aa" or a colour the picker can show; null for gradients, shadows and the rest. */
function asHex(value: string): string | null {
  const v = value.trim();
  if (/^#[0-9a-f]{6}$/i.test(v)) return v;
  if (/^#[0-9a-f]{3}$/i.test(v)) return "#" + v.slice(1).split("").map((c) => c + c).join("");
  return null;
}

const ITEMS = [
  { id: "1", name: "Notes", icon: folderIcon, type: "Folder" },
  { id: "2", name: "readme.txt", icon: fileIcon, size: "1 KB", type: "Text Document" },
  { id: "3", name: "todo.txt", icon: fileIcon, size: "2 KB", type: "Text Document" },
];

/** What a theme looks like: the parts it styles most. */
function Preview() {
  return (
    <Desktop style={{ width: "100%", height: "460px" }}>
      <Window title="Preview" icon={appIcon} width="380px" height="300px" defaultOpen style={{ position: "absolute", left: 24, top: 20 }}>
        <div style={{ padding: 10, display: "grid", gap: 10 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Button variant="primary">Primary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="basic">Basic</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
          <div style={{ display: "flex", gap: 6 }}><Tag>React</Tag><Tag>Go</Tag><Tag iridescent>Iridescent</Tag></div>
          <input className="dreamdesk-input" placeholder="An input" />
          <div style={{ height: 110, border: "1px solid var(--color-border, #333)" }}>
            <ListView items={ITEMS} selected={["2"]} />
          </div>
        </div>
      </Window>
      <Window title="Behind" icon={folderIcon} width="240px" height="160px" defaultOpen style={{ position: "absolute", left: 440, top: 80 }}>
        <p style={{ padding: 10, margin: 0 }}>A second window, to see the inactive one.</p>
      </Window>
      <Taskbar startMenu={<StartMenu items={[{ id: "a", label: "Explorer", icon: folderIcon }]} onSelect={() => {}} buttonIcon={appIcon} />} />
    </Desktop>
  );
}

/**
 * Change the current theme's variables and see it live. Switch themes above.
 * "Copy changes" gives the CSS for what you changed, to paste into the theme.
 */
export const ThemeEditor: Story = () => {
  const theme = useCurrentTheme();
  const variables = useMemo(() => themeVariables(theme), [theme]);
  const [changes, setChanges] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState("");
  const [copied, setCopied] = useState(false);

  const root = document.documentElement;
  const clearAll = () => {
    Object.keys(changes).forEach((name) => root.style.removeProperty(name));
    setChanges({});
  };
  // A different theme starts clean; leaving the story too
  useEffect(() => () => { Object.keys(changes).forEach((name) => root.style.removeProperty(name)); }, [theme]); // eslint-disable-line react-hooks/exhaustive-deps
  const [changesFor, setChangesFor] = useState(theme);
  if (changesFor !== theme) {
    setChangesFor(theme);
    setChanges({});
  }

  const change = (name: string, value: string) => {
    root.style.setProperty(name, value);
    setChanges((c) => ({ ...c, [name]: value }));
  };
  const reset = (name: string) => {
    root.style.removeProperty(name);
    setChanges(({ [name]: _, ...rest }) => rest);
  };

  const css = `html[data-theme="${theme}"] {\n${Object.entries(changes).map(([n, v]) => `  ${n}: ${v};`).join("\n")}\n}`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(css); setCopied(true); setTimeout(() => setCopied(false), 1500); }
    catch { /* the CSS is shown below to copy by hand */ }
  };

  const shown = variables.filter(([name]) => name.includes(filter.trim().toLowerCase()));
  const count = Object.keys(changes).length;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 420px) 1fr", gap: 16, alignItems: "start", fontFamily: "system-ui, sans-serif", fontSize: 13 }}>
      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <input placeholder={`Filter ${variables.length} variables (e.g. header, button, scroll)`} value={filter} onChange={(e) => setFilter(e.target.value)} style={{ flex: 1, padding: 4 }} />
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button disabled={!count} onClick={() => void copy()}>{copied ? "Copied ✓" : `Copy changes (${count})`}</button>
          <button disabled={!count} onClick={clearAll}>Reset all</button>
        </div>
        <div style={{ maxHeight: 520, overflow: "auto", border: "1px solid #ccc", background: "#fff", color: "#222" }}>
          {shown.map(([name, original]) => {
            const value = changes[name] ?? original;
            const hex = asHex(value);
            const changed = name in changes;
            return (
              <div key={name} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 4, padding: "6px 8px", borderBottom: "1px solid #eee", background: changed ? "#fff7d6" : undefined }}>
                <code style={{ fontSize: 12 }}>{name}</code>
                {changed ? <button onClick={() => reset(name)} style={{ fontSize: 11 }}>reset</button> : <span />}
                <div style={{ gridColumn: "1 / -1", display: "flex", gap: 6, alignItems: "center" }}>
                  {hex && <input type="color" value={hex} onChange={(e) => change(name, e.target.value)} />}
                  <input value={value} onChange={(e) => change(name, e.target.value)} style={{ flex: 1, fontFamily: "monospace", fontSize: 12, padding: 3 }} />
                </div>
              </div>
            );
          })}
          {!shown.length && <p style={{ padding: 8, margin: 0 }}>No variables match.</p>}
        </div>
        {count > 0 && <pre style={{ margin: 0, padding: 8, background: "#f6f6f6", color: "#222", fontSize: 12, whiteSpace: "pre-wrap" }}>{css}</pre>}
      </div>
      <Preview />
    </div>
  );
};
