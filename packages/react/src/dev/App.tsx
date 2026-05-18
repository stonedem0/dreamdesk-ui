import { useState, useEffect } from "react";
import { Window } from "../components/Window";
import { Button } from "../components/Button";
import { ProgressBar } from "../components/ProgressBar";
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
import { MenuBar, Menu, MenuItem, MenuSeparator } from "../components/MenuBar";
import { TreeView, type TreeNode } from "../components/TreeView";
import { ListView, type ListViewItem } from "../components/ListView";

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
      <DesktopIcon label="Explorer" icon="/icons/folder.png" onClick={() => focus("explorer")} />
    </div>
  );
}

// ── Explorer demo ─────────────────────────────────────────────────────────────

const TREE_NODES: TreeNode[] = [
  { id: "desktop", label: "Desktop", icon: "🖥️", children: [
    { id: "shortcut1", label: "My Computer", icon: "💻" },
    { id: "shortcut2", label: "Recycle Bin", icon: "🗑️" },
  ]},
  { id: "docs", label: "My Documents", icon: "📁", children: [
    { id: "work", label: "Work", icon: "📁", children: [
      { id: "report", label: "report.doc", icon: "📄" },
      { id: "budget", label: "budget.xls", icon: "📊" },
    ]},
    { id: "readme",  label: "readme.txt",  icon: "📄" },
    { id: "photo",   label: "photo.png",   icon: "🖼️" },
    { id: "music",   label: "music.mp3",   icon: "🎵" },
  ]},
  { id: "downloads", label: "Downloads", icon: "📁", children: [
    { id: "setup",   label: "setup.exe",   icon: "⚙️" },
    { id: "archive", label: "archive.zip", icon: "📦" },
  ]},
];

const FILE_META: Record<string, Partial<ListViewItem>> = {
  shortcut1: { type: "Shortcut" },
  shortcut2: { type: "Shortcut" },
  work:      { type: "File Folder",   date: "5/10/2026" },
  readme:    { type: "Text Document", size: "2 KB",   date: "5/12/2026" },
  photo:     { type: "PNG Image",     size: "1.2 MB", date: "5/14/2026" },
  music:     { type: "MP3 Audio",     size: "4.8 MB", date: "5/1/2026"  },
  setup:     { type: "Application",   size: "3.4 MB", date: "4/20/2026" },
  archive:   { type: "ZIP Archive",   size: "18 MB",  date: "4/28/2026" },
  report:    { type: "Word Document", size: "48 KB",  date: "5/8/2026"  },
  budget:    { type: "Spreadsheet",   size: "12 KB",  date: "5/9/2026"  },
};

function findNode(nodes: TreeNode[], id: string): TreeNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) { const f = findNode(n.children, id); if (f) return f; }
  }
  return null;
}

function getPath(nodes: TreeNode[], id: string, path: TreeNode[] = []): TreeNode[] | null {
  for (const n of nodes) {
    const next = [...path, n];
    if (n.id === id) return next;
    if (n.children) { const f = getPath(n.children, id, next); if (f) return f; }
  }
  return null;
}

function nodeToListItem(n: TreeNode): ListViewItem {
  return { id: n.id, name: n.label, icon: n.icon, ...FILE_META[n.id] };
}

function ExplorerDemo() {
  const [selectedTree, setSelectedTree] = useState<string>("docs");
  const [selectedList, setSelectedList] = useState<string[]>([]);
  const [listMode, setListMode] = useState<"icons" | "details">("details");

  const node = findNode(TREE_NODES, selectedTree);
  const listItems: ListViewItem[] = node?.children?.map(nodeToListItem) ?? [];
  const path = getPath(TREE_NODES, selectedTree) ?? [];

  const handleTreeSelect = (id: string) => {
    setSelectedTree(id);
    setSelectedList([]);
  };

  const handleListOpen = (id: string) => {
    const target = findNode(TREE_NODES, id);
    if (target?.children) handleTreeSelect(id);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Path bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "2px", padding: "2px 6px", borderBottom: "1px solid var(--dd-border-color, #999)", background: "var(--color-surface, #d4d0c8)", fontSize: "0.78rem", flexShrink: 0 }}>
        <span style={{ opacity: 0.6, marginRight: "2px" }}>Address:</span>
        {path.map((n, i) => (
          <span key={n.id} style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            {i > 0 && <span style={{ opacity: 0.4 }}>›</span>}
            <button
              onClick={() => handleTreeSelect(n.id)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "0 2px", font: "inherit", fontSize: "0.78rem", color: "var(--color-text, #000)" }}
            >
              {n.label}
            </button>
          </span>
        ))}
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Tree panel */}
        <div style={{ width: "180px", borderRight: "1px solid var(--dd-border-color, #999)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "2px 6px", background: "var(--color-surface, #d4d0c8)", borderBottom: "1px solid var(--dd-border-color, #999)", fontSize: "0.78rem", fontWeight: "bold", flexShrink: 0 }}>Folders</div>
          <div style={{ overflow: "auto", flex: 1, padding: "2px 0" }}>
          <TreeView
            nodes={TREE_NODES}
            selected={selectedTree}
            defaultExpanded={["docs", "downloads"]}
            onSelect={handleTreeSelect}
          />
          </div>
        </div>

        {/* List panel */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: "4px", padding: "3px 4px", borderBottom: "1px solid var(--dd-border-color, #999)", background: "var(--color-surface, #d4d0c8)", flexShrink: 0 }}>
            <button onClick={() => setListMode("details")} style={{ fontWeight: listMode === "details" ? "bold" : "normal", fontSize: "0.75rem", padding: "1px 6px", background: "none", border: "1px solid transparent", cursor: "pointer", font: "inherit" }}>Details</button>
            <button onClick={() => setListMode("icons")} style={{ fontWeight: listMode === "icons" ? "bold" : "normal", fontSize: "0.75rem", padding: "1px 6px", background: "none", border: "1px solid transparent", cursor: "pointer", font: "inherit" }}>Icons</button>
          </div>
          <ListView
            items={listItems}
            mode={listMode}
            selected={selectedList}
            multiSelect
            onSelect={setSelectedList}
            onOpen={handleListOpen}
            style={{ flex: 1 }}
          />
        </div>
      </div>
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
      <Desktop style={{ width: "100vw", height: "100vh" }} contextMenuItems={[
          { label: "Refresh", shortcut: "F5", onClick: () => window.location.reload() },
          { type: "separator" },
          { label: "Arrange Icons", disabled: true, onClick: () => {} },
          { label: "Properties", disabled: true, onClick: () => {} },
        ]}>

        <WindowShortcuts />

        {/* Notes — tabbed scrollable window, top-left */}
        <Window windowId="notes" title="Notes" scrollContent width="560px" height="430px" defaultOpen={false}
          style={{ top: "16px", left: "16px" }}
          icon="/icons/notepad.png">
          <MenuBar>
            <Menu label="File">
              <MenuItem shortcut="Ctrl+N" onClick={() => {}}>New</MenuItem>
              <MenuItem shortcut="Ctrl+O" onClick={() => {}}>Open…</MenuItem>
              <MenuItem shortcut="Ctrl+S" onClick={() => {}}>Save</MenuItem>
              <MenuSeparator />
              <MenuItem onClick={() => {}}>Exit</MenuItem>
            </Menu>
            <Menu label="Edit">
              <MenuItem shortcut="Ctrl+Z" disabled>Undo</MenuItem>
              <MenuSeparator />
              <MenuItem shortcut="Ctrl+X" onClick={() => {}}>Cut</MenuItem>
              <MenuItem shortcut="Ctrl+C" onClick={() => {}}>Copy</MenuItem>
              <MenuItem shortcut="Ctrl+V" onClick={() => {}}>Paste</MenuItem>
            </Menu>
            <Menu label="Help">
              <MenuItem onClick={() => {}}>About Notes</MenuItem>
            </Menu>
          </MenuBar>
          <p className="win-content dd-scrollable dd-scrollable--fill">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Contrary to popular belief,
            Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin
            literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin
            professor at Hampden-Sydney College in Virginia, looked up one of the more obscure
            Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of
            the word in classical literature, discovered the undoubtable source.
          </p>
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

        {/* Explorer — center */}
        <Window windowId="explorer" title="My Documents" width="600px" height="400px" defaultOpen={false}
          style={{ top: "80px", left: "calc(50vw - 300px)" }}
          icon="/icons/folder.png"
          bodyOverflow="hidden">
          <ExplorerDemo />
        </Window>

        {/* Browser — center */}
        <BrowserWindowDemo />

        <DialogDemo />
        <Taskbar />
      </Desktop>
      </DialogProvider>
    </ThemeProvider>
  );
}
