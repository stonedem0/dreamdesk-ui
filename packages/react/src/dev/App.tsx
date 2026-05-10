import { useState, useEffect } from "react";
import { Window } from "../components/Window";
import { Button } from "../components/Button";
import { ProgressBar } from "../components/ProgressBar";
import { Tabs, Tab, TabPanel } from "../components/Tabs";
import { Toggle } from "../components/Toggle";
import { TerminalWindow } from "../components/TerminalWindow";
import { Input } from "../components/Input";
import { Toast } from "../components/Toast";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { Desktop, useWindowManager } from "../components/Desktop";
import { Taskbar } from "../components/Taskbar";
import { DesktopIcon } from "../components/DesktopIcon";

// ── Theme toggle ──────────────────────────────────────────────────────────────

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isVista = theme === "vista";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span>pastelcore</span>
      <Toggle checked={isVista} onChange={(v) => setTheme(v ? "vista" : "pastelcore")} />
      <span>vista</span>
    </div>
  );
}

// ── App registrar + desktop icons ─────────────────────────────────────────────

function WindowShortcuts() {
  const wm = useWindowManager();
  const focus = (id: string) => wm.open(id);
  return (
    <div style={{ position: "absolute", top: "16px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "1.5rem" }}>
      <DesktopIcon label="Notes" onClick={() => focus("notes")} />
      <DesktopIcon label="Login" onClick={() => focus("login")} />
      <DesktopIcon label="Terminal" onClick={() => focus("terminal")} />
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function App() {
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
      <Desktop style={{ width: "100vw", height: "100vh" }}>

        <WindowShortcuts />

        {/* Notes — tabbed scrollable window, top-left */}
        <Window windowId="notes" title="Notes" scrollContent width="560px" height="430px"
          style={{ top: "16px", left: "16px" }}>
          <Tabs>
            <Tab>General</Tab>
            <Tab>Appearance</Tab>
            <Tab>Advanced</Tab>
            <TabPanel>
              <p className="win-content dd-scrollable dd-scrollable--fill">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Contrary to popular belief,
                Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin
                literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin
                professor at Hampden-Sydney College in Virginia, looked up one of the more obscure
                Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of
                the word in classical literature, discovered the undoubtable source.
              </p>
            </TabPanel>
            <TabPanel>
              <p className="win-content" style={{ padding: "0.5rem" }}>Appearance settings.</p>
            </TabPanel>
            <TabPanel>
              <p className="win-content" style={{ padding: "0.5rem" }}>Advanced settings.</p>
            </TabPanel>
          </Tabs>
        </Window>

        {/* Login — below Notes, left */}
        <Window windowId="login" title="Login" size="sm" resizable={false} bodyOverflow="hidden"
          style={{ top: "462px", left: "16px" }}>
          <div className="win-content" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Input type="text" label="Username:" placeholder="" layout="inline" />
            <Input type="password" label="Password:" placeholder="" layout="inline" />
          </div>
          <div className="win-actions">
            <Button variant="primary">Ok</Button>
            <Button variant="ghost">Cancel</Button>
          </div>
        </Window>

        {/* Components — top-right */}
        <Window title="Components" width="620px" height="560px" scrollContent
          style={{ top: "16px", left: "calc(100vw - 636px)" }}>
          <div className="win-content dd-scrollable dd-scrollable--fill" style={{ display: "flex", flexDirection: "column", gap: "0.75rem", padding: "0.5rem" }}>
            <ThemeToggle />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <ProgressBar value={progress} />
              <ProgressBar value={progress} blocky />
              <ProgressBar value={progress} gradient />
              <ProgressBar value={progress} gradient blocky />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <Toast type="alert" message="This is an alert." />
              <Toast type="notification" message="This is a notification." />
              <Toast type="warning" message="This is a warning." />
            </div>
          </div>
        </Window>

        {/* Terminal — bottom-right */}
        <TerminalWindow windowId="terminal" title="Terminal" width="500px" height="220px"
          style={{ top: "460px", left: "calc(100vw - 516px)" }}>
          <p>$ hello world</p>
          <p>$ _</p>
        </TerminalWindow>

        <Taskbar />
      </Desktop>
    </ThemeProvider>
  );
}
