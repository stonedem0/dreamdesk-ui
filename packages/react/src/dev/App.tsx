import { useState, useEffect } from "react";
import { Window } from "../components/Window";
import { Button } from "../components/Button";
import { ProgressBar } from "../components/ProgressBar";
import { Tabs, Tab, TabPanel } from "../components/Tabs";
import { Toggle } from "../components/Toggle";
import { TerminalWindow } from "../components/TerminalWindow";
import { BrowserWindow, BrowserErrorPage } from "../components/BrowserWindow";
import { Input } from "../components/Input";
import { Toast } from "../components/Toast";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { Desktop, useWindowManager } from "../components/Desktop";
import { DialogProvider, useDialog } from "../components/Dialog";
import { Taskbar } from "../components/Taskbar";
import { DesktopIcon } from "../components/DesktopIcon";

// ── Browser demo ─────────────────────────────────────────────────────────────

const HOME = "https://en.m.wikipedia.org/wiki/Main_Page";

function BrowserWindowDemo() {
  const [src, setSrc] = useState(HOME);
  const [refreshKey, setRefreshKey] = useState(0);
  const [navHistory, setNavHistory] = useState<string[]>([HOME]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = (url: string) => {
    const trimmed = url.startsWith("http") ? url : `https://${url}`;
    const next = navHistory.slice(0, historyIndex + 1);
    next.push(trimmed);
    setNavHistory(next);
    setHistoryIndex(next.length - 1);
    setError(false);
    setLoading(true);
    setSrc(trimmed);
  };

  const goBack = () => {
    if (historyIndex <= 0) return;
    const idx = historyIndex - 1;
    setHistoryIndex(idx);
    setError(false);
    setLoading(true);
    setSrc(navHistory[idx]);
  };

  const goForward = () => {
    if (historyIndex >= navHistory.length - 1) return;
    const idx = historyIndex + 1;
    setHistoryIndex(idx);
    setError(false);
    setLoading(true);
    setSrc(navHistory[idx]);
  };

  const refresh = () => { setError(false); setLoading(true); setRefreshKey(k => k + 1); };
  const stop = () => setLoading(false);

  return (
    <BrowserWindow
      windowId="browser"
      title="Internet Explorer"
      icon="/icons/world.png"
      defaultOpen={false}
      url={src}
      width="640px"
      height="480px"
      style={{ top: "80px", left: "calc(50vw - 320px)" }}
      canGoBack={historyIndex > 0}
      canGoForward={historyIndex < navHistory.length - 1}
      onNavigate={navigate}
      onBack={goBack}
      onForward={goForward}
      onRefresh={refresh}
      onStop={stop}
      onHome={() => navigate(HOME)}
      homeIcon="/icons/world.png"
      historyIcon="/icons/clock.png"
      history={navHistory}
      status={loading ? `Opening page: ${src}…` : error ? "Page cannot be displayed" : "Done"}
    >
      {error ? (
        <BrowserErrorPage url={src} onRefresh={refresh} />
      ) : (
        <>
          {loading && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", zIndex: 1, fontSize: "0.85rem", color: "#555" }}>
              Opening page…
            </div>
          )}
          <iframe
            key={`${src}-${refreshKey}`}
            src={src}
            style={{ width: "100%", height: "2000px", border: "none", display: "block" }}
            scrolling="no"
            title="browser-content"
            onLoad={() => setLoading(false)}
            onError={() => { setLoading(false); setError(true); }}
          />
        </>
      )}
    </BrowserWindow>
  );
}

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

function DialogDemo() {
  const dialog = useDialog();
  return (
    <div style={{ position: "absolute", bottom: "48px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "0.5rem" }}>
      <button onClick={() => dialog.alert("File saved successfully!")}>Alert</button>
      <button onClick={async () => { const ok = await dialog.confirm("Delete this file?"); console.log("confirm:", ok); }}>Confirm</button>
      <button onClick={async () => { const val = await dialog.prompt("Enter new name:", { defaultValue: "file.txt" }); console.log("prompt:", val); }}>Prompt</button>
    </div>
  );
}

function WindowShortcuts() {
  const wm = useWindowManager();
  const focus = (id: string) => wm.open(id);
  return (
    <div style={{ position: "absolute", top: "16px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "1.5rem" }}>
      <DesktopIcon label="Notes" icon="/icons/notepad.png" onClick={() => focus("notes")} />
      <DesktopIcon label="Login" icon="/icons/password_manager.png" onClick={() => focus("login")} />
      <DesktopIcon label="Terminal" icon="/icons/script_file.png" onClick={() => focus("terminal")} />
      <DesktopIcon label="Components" icon="/icons/tools.png" onClick={() => focus("components")} />
      <DesktopIcon label="Browser" icon="/icons/world.png" onClick={() => focus("browser")} />
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
      <DialogProvider>
      <Desktop style={{ width: "100vw", height: "100vh" }}>

        <WindowShortcuts />

        {/* Notes — tabbed scrollable window, top-left */}
        <Window windowId="notes" title="Notes" scrollContent width="560px" height="430px" defaultOpen={false}
          style={{ top: "16px", left: "16px" }}
          icon="/icons/notepad.png">
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
        <Window windowId="login" title="Login" size="sm" resizable={false} bodyOverflow="hidden" defaultOpen={false}
          style={{ top: "462px", left: "16px" }}
          icon="/icons/password_manager.png">
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
        <Window windowId="components" title="Components" width="620px" height="560px" scrollContent defaultOpen={false}
          style={{ top: "16px", left: "calc(100vw - 636px)" }}
          icon="/icons/tools.png">
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
        <TerminalWindow windowId="terminal" title="Terminal" width="500px" height="220px" defaultOpen={false}
          style={{ top: "460px", left: "calc(100vw - 516px)" }}
          icon="/icons/script_file.png">
          <p>$ hello world</p>
          <p>$ _</p>
        </TerminalWindow>

        {/* Browser — center */}
        <BrowserWindowDemo />

        <DialogDemo />
        <Taskbar />
      </Desktop>
      </DialogProvider>
    </ThemeProvider>
  );
}
