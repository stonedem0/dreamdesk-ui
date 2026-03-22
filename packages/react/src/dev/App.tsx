import { useState, useEffect, type CSSProperties } from "react";
import { Window } from "../components/Window";
import { Button } from "../components/Button";
import { ProgressBar } from "../components/ProgressBar";
import { Tabs, Tab, TabPanel } from "../components/Tabs";
import { Toggle } from "../components/Toggle";
import { TerminalWindow } from "../components/TerminalWindow";
import { Input } from "../components/Input";
import { Toast } from "../components/Toast";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isVista = theme === "vista";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "monospace" }}>
      <span>pastelcore</span>
      <Toggle
        checked={isVista}
        onChange={(v) => setTheme(v ? "vista" : "pastelcore")}
      />
      <span>vista</span>
    </div>
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

        {/* Main demo window: tabs + scrollable content */}
        <Window
          title="Custom scroll"
          onMinimize={(v) => push(`minimize: ${v}`)}
          onFullscreen={(v) => push(`fullscreen: ${v}`)}
          onClose={() => push("close")}
          bodyOverflow="hidden"
          width="567px"
          height="500px"
        >
          <Tabs>
            <Tab>General</Tab>
            <Tab>Appearance</Tab>
            <Tab>Advanced</Tab>
            <Tab>Settings</Tab>
            <TabPanel>
              <p className="win-content dd-scrollable" style={{ "--dd-scrollable-max-h": "23rem" } as CSSProperties}>
                Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of
                classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a
                Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin
                words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in
                classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32
                and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero,
                written in 45 BC. This book is a treatise on the theory of ethics, very popular during the
                Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line
                in section 1.10.32.
              </p>
            </TabPanel>
            <TabPanel>
              <p className="win-content" style={{ padding: "0.5rem" }}>Appearance panel.</p>
            </TabPanel>
            <TabPanel>
              <p className="win-content" style={{ padding: "0.5rem" }}>Advanced settings panel.</p>
            </TabPanel>
            <TabPanel>
              <p className="win-content" style={{ padding: "0.5rem" }}>Configure your preferences here.</p>
            </TabPanel>
          </Tabs>
        </Window>

        {/* Login window */}
        <Window title="Hello" size="sm" resizable={false} bodyOverflow="hidden">
          <div className="win-content" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Input type="text" label="Username:" placeholder="" layout="inline" />
            <Input type="password" label="Password:" placeholder="" layout="inline" />
          </div>
          <div className="win-actions">
            <Button variant="primary">Ok</Button>
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

        {/* Toggle */}
        <Toggle onChange={(v) => push(`toggle: ${v}`)} />

        {/* Terminal */}
        <TerminalWindow title="terminal" width="28rem" height="12rem">
          <p>$ hello world</p>
          <p>$ _</p>
        </TerminalWindow>

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
