import { useEffect, useState } from "react";
import type { GlobalProvider } from "@ladle/react";
import "../../core/css/globals.css";
import "../../core/css/base.css";
import "../../core/css/pastelcore.css";
import "../../core/css/dark.css";
import "../../core/css/vista.css";
import "../../core/css/xp.css";
import "../src/style.css";

const THEMES = ["pastelcore", "vista", "dark", "xp"] as const;
type Theme = (typeof THEMES)[number];
const KEY = "dreamdesk-ladle-theme";

/** Every story gets the themes, and a switcher above it to compare them. */
export const Provider: GlobalProvider = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(KEY);
    return (THEMES as readonly string[]).includes(saved ?? "") ? (saved as Theme) : "pastelcore";
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(KEY, theme);
  }, [theme]);

  return (
    <>
      <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 16, fontSize: 13 }}>
        theme:
        {THEMES.map((t) => (
          <button key={t} onClick={() => setTheme(t)} style={{ fontWeight: t === theme ? "bold" : "normal", textDecoration: t === theme ? "underline" : "none" }}>
            {t}
          </button>
        ))}
      </div>
      {children}
    </>
  );
};
