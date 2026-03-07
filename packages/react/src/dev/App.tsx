import { useState, useEffect } from "react";
import { Window } from "../components/Window";
import { Button } from "../components/Button";
import { ProgressBar } from "../components/ProgressBar";
import { Tabs, Tab, TabPanel } from "../components/Tabs";
import { Input } from "../components/Input";
import { Toast } from "../components/Toast";
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

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let val = 0;
    let rafId: number;
    const tick = () => {
      val = Math.min(100, val + Math.random() * 0.8);
      setProgress(parseFloat(val.toFixed(1)));
      if (val < 100) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

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

        {/* Tabs */}
        <Window title="Tabs" onMinimize={(v) => push(`minimize: ${v}`)}>
          <Tabs>
            <Tab>General</Tab>
            <Tab>Appearance</Tab>
            <Tab>Advanced</Tab>
            <TabPanel>
              <p className="win-content" style={{ padding: "0.5rem" }}>General settings panel.</p>
            </TabPanel>
            <TabPanel>
              <p className="win-content" style={{ padding: "0.5rem" }}>Appearance panel.</p>
            </TabPanel>
            <TabPanel>
              <p className="win-content" style={{ padding: "0.5rem" }}>Advanced settings panel.</p>
            </TabPanel>
          </Tabs>
        </Window>

        {/* Buttons */}
        <Window title="Buttons" size="sm" resizable={false}>
          <div className="win-content" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <Button variant="primary">Primary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="help">Help</Button>
            <Button variant="primary" disabled>Disabled</Button>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="lg">Large</Button>
            <Button variant="primary" px="1rem" py="0.4rem" fontSize="1.05rem">Custom</Button>
          </div>
        </Window>

        {/* Inputs */}
        <Window title="Login" size="sm" resizable={false}>
          <div className="win-content input-grid pc-input-grid">
            <Input type="text" label="Username:" placeholder="enter username" />
            <Input type="password" label="Password:" placeholder="••••••••" />
          </div>
          <div className="win-actions">
            <Button variant="primary">OK</Button>
            <Button variant="ghost">Cancel</Button>
          </div>
        </Window>

        {/* Progress bars */}
        <div className="progress-bar-container" style={{ width: "24rem" }}>
          <ProgressBar value={progress} />
          <ProgressBar value={progress} blocky />
          <ProgressBar value={progress} gradient />
          <ProgressBar value={progress} gradient blocky />
        </div>

        {/* Toasts */}
        <div className="toast-container">
          <Toast type="alert" message="This is an alert." />
          <Toast type="notification" message="This is a notification." />
          <Toast type="warning" message="This is a warning." />
        </div>

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
