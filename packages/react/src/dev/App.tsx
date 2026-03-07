import { useState } from "react";
import { Window } from "../components/Window";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === "pastelcore" ? "dark" : "pastelcore")}
      style={{ margin: "1rem", fontFamily: "monospace", cursor: "pointer" }}
    >
      Theme: {theme}
    </button>
  );
}

export default function App() {
  const [log, setLog] = useState<string[]>([]);
  const push = (msg: string) => setLog((l) => [...l, msg]);

  return (
    <ThemeProvider defaultTheme="pastelcore">
      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-start" }}>
        <ThemeToggle />

        {/* Basic window */}
        <Window
          title="Basic Window"
          onMinimize={(v) => push(`minimize: ${v}`)}
          onFullscreen={(v) => push(`fullscreen: ${v}`)}
          onClose={() => push("close")}
        >
          <p className="win-content">Hello from React!</p>
        </Window>

        {/* Small window, not resizable */}
        <Window title="Error" size="sm" resizable={false}>
          <p className="win-content">Something went wrong.</p>
          <div className="win-actions">
            <button className="btn btn--primary">OK</button>
            <button className="btn btn--ghost">Cancel</button>
          </div>
        </Window>

        {/* Disabled controls with tooltips */}
        <Window
          title="Locked"
          size="sm"
          disableMinimize="Not available"
          disableFullscreen
          minimizeIcon='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="11" width="14" height="2"/></svg>'
          closeIcon='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/></svg>'
        >
          <p className="win-content">Minimize is disabled with tooltip.</p>
        </Window>

        {/* Event log */}
        {log.length > 0 && (
          <div style={{ fontFamily: "monospace", fontSize: "0.85rem", opacity: 0.7 }}>
            {log.map((l, i) => <div key={i}>{l}</div>)}
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}
