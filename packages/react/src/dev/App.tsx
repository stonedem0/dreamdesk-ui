import { useState, useEffect, useRef } from "react";
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
import { Checkbox } from "../components/Checkbox";
import { Radio, RadioGroup } from "../components/Radio";
import { Select } from "../components/Select";
import { Slider } from "../components/Slider";
import { useContextMenu } from "../components/ContextMenu";
import { OSProvider, useOS, type AppDef, type ProcessArgs, executeCommand, toWinPath } from "@dreamdesk/os";

// ── Notepad app ───────────────────────────────────────────────────────────────

function NotepadApp({ pid, args }: { pid: string; args: ProcessArgs }) {
  const { fs, pm } = useOS();
  const filePath = args.filePath ?? "";
  const [content, setContent] = useState(() => {
    try { return fs.readFile(filePath); } catch { return ""; }
  });
  const [dirty, setDirty] = useState(false);

  const save = () => {
    if (filePath) { fs.writeFile(filePath, content); setDirty(false); }
  };

  const fileName = filePath.split("/").pop() ?? "Untitled";

  return (
    <Window
      windowId="notepad"
      title={`${dirty ? "* " : ""}${fileName} — Notepad`}
      icon="/icons/notepad.png"
      width="480px"
      height="320px"
      scrollContent
      defaultOpen
      onClose={() => pm.kill(pid)}
    >
      <MenuBar>
        <Menu label="File">
          <MenuItem shortcut="Ctrl+N" onClick={() => {}}>New</MenuItem>
          <MenuItem shortcut="Ctrl+O" onClick={() => {}}>Open…</MenuItem>
          <MenuItem shortcut="Ctrl+S" onClick={save}>Save</MenuItem>
          <MenuSeparator />
          <MenuItem onClick={() => pm.kill(pid)}>Exit</MenuItem>
        </Menu>
        <Menu label="Edit">
          <MenuItem shortcut="Ctrl+Z" disabled>Undo</MenuItem>
          <MenuSeparator />
          <MenuItem shortcut="Ctrl+X" onClick={() => {}}>Cut</MenuItem>
          <MenuItem shortcut="Ctrl+C" onClick={() => {}}>Copy</MenuItem>
          <MenuItem shortcut="Ctrl+V" onClick={() => {}}>Paste</MenuItem>
        </Menu>
        <Menu label="Help">
          <MenuItem onClick={() => {}}>About Notepad</MenuItem>
        </Menu>
      </MenuBar>
      <div style={{ flex: 1, minHeight: 0, margin: "4px 6px", border: "var(--border, 1px solid #151820)", display: "flex" }}>
        <textarea
          value={content}
          onChange={e => { setContent(e.target.value); setDirty(true); }}
          onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); save(); } }}
          spellCheck={false}
          className="pc-scroll"
          style={{ flex: 1, minHeight: 0, width: "100%", border: "none", outline: "none", resize: "none", padding: "4px 6px", fontFamily: "monospace", fontSize: "0.85rem", background: "var(--color-input-background, #fff)", color: "var(--color-text, #000)", boxSizing: "border-box", overflow: "auto" }}
        />
      </div>
    </Window>
  );
}

// ── Open With dialog ──────────────────────────────────────────────────────────

function OpenWithDialog({ pid, args }: { pid: string; args: ProcessArgs }) {
  const { pm, apps, openWith } = useOS();
  const filePath = args.filePath ?? "";
  const fileName = filePath.split("/").pop() ?? filePath;
  const ext = filePath.split(".").pop()?.toLowerCase() ?? "";

  const available = Object.entries(apps)
    .filter(([id, def]) => id !== "openwith" && (def.extensions?.includes(ext) ?? false))
    .map(([appId, def]) => ({ appId, def }));

  const allApps = Object.entries(apps)
    .filter(([id]) => id !== "openwith")
    .map(([appId, def]) => ({ appId, def }));

  const listed = available.length > 0 ? available : allApps;
  const [chosen, setChosen] = useState<string | null>(listed[0]?.appId ?? null);

  const launch = (appId: string) => { openWith(appId, { filePath }); pm.kill(pid); };

  return (
    <Window
      title="Open With"
      icon="/icons/tools.png"
      width="320px"
      height="260px"
      resizable={false}
      defaultOpen
      onClose={() => pm.kill(pid)}
    >
      <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "8px", height: "100%", boxSizing: "border-box" }}>
        <div style={{ fontSize: "0.8rem" }}>
          Choose the program to open <strong>{fileName}</strong>:
        </div>
        <div style={{ flex: 1, border: "2px inset var(--dd-border-shadow, #888)", background: "var(--color-window-body, #fff)", overflow: "auto" }}>
          {listed.map(({ appId, def }) => (
            <div
              key={appId}
              onClick={() => setChosen(appId)}
              onDoubleClick={() => launch(appId)}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "3px 8px", cursor: "default", fontSize: "0.82rem", userSelect: "none",
                background: chosen === appId ? "var(--color-selection, #0078d7)" : "none",
                color: chosen === appId ? "#fff" : "inherit",
              }}
            >
              {def.icon && <img src={def.icon} alt="" width={16} height={16} style={{ imageRendering: "pixelated" }} />}
              {def.title}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "4px", justifyContent: "flex-end" }}>
          <Button variant="primary" onClick={() => { if (chosen) launch(chosen); }}>OK</Button>
          <Button variant="ghost" onClick={() => pm.kill(pid)}>Cancel</Button>
        </div>
      </div>
    </Window>
  );
}

// ── Terminal app ──────────────────────────────────────────────────────────────

const BANNER = ["DreamDesk Terminal", "Type 'help' for available commands.", ""];

function TerminalApp({ pid }: { pid: string; args: ProcessArgs }) {
  const { fs, pm } = useOS();
  const [cwd, setCwd] = useState("/");
  const [lines, setLines] = useState<string[]>(BANNER);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const prompt = `${toWinPath(cwd)}>`;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lines]);

  const run = (cmd: string) => {
    const result = executeCommand(cmd, { fs, pm, cwd });
    if (result.clear) {
      setLines([]);
    } else {
      setLines(prev => [...prev, `${prompt} ${cmd}`, ...result.lines]);
    }
    if (result.newCwd) setCwd(result.newCwd);
    if (cmd.trim()) setHistory(prev => [cmd, ...prev]);
    setHistIdx(-1);
    setInput("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { run(input); return; }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx] ?? "");
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = histIdx - 1;
      if (idx < 0) { setHistIdx(-1); setInput(""); }
      else { setHistIdx(idx); setInput(history[idx] ?? ""); }
    }
  };

  return (
    <TerminalWindow
      windowId="terminal"
      title="Terminal"
      icon="/icons/script_file.png"
      width="560px"
      height="340px"
      defaultOpen
      onClose={() => pm.kill(pid)}
    >
      <div
        style={{ display: "flex", flexDirection: "column", height: "100%", cursor: "text" }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Output */}
        <div style={{ flex: 1, overflow: "auto", padding: "6px 10px", fontFamily: "var(--font-mono, monospace)", fontSize: "0.82rem", lineHeight: 1.5 }}>
          {lines.map((line, i) => (
            <div key={i} style={{ whiteSpace: "pre-wrap", minHeight: "1.2em" }}>{line}</div>
          ))}
          <div ref={bottomRef} />
        </div>
        {/* Input row */}
        <div style={{ display: "flex", alignItems: "center", padding: "2px 10px 6px", fontFamily: "var(--font-mono, monospace)", fontSize: "0.82rem", flexShrink: 0 }}>
          <span style={{ userSelect: "none", marginRight: "4px" }}>{prompt}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoFocus
            spellCheck={false}
            style={{ flex: 1, background: "none", border: "none", outline: "none", color: "inherit", fontFamily: "inherit", fontSize: "inherit" }}
          />
        </div>
      </div>
    </TerminalWindow>
  );
}

// ── Task Manager app ──────────────────────────────────────────────────────────

function TaskManagerApp({ pid }: { pid: string; args: ProcessArgs }) {
  const { pm, apps } = useOS();
  const [procs, setProcs] = useState(() => pm.list().filter(p => apps[p.appId]?.persistent !== false));
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => pm.subscribe(() => {
    const list = pm.list().filter(p => apps[p.appId]?.persistent !== false);
    setProcs(list);
    setSelected(s => list.find(p => p.pid === s) ? s : null);
  }), [pm, apps]);

  const endProcess = () => {
    if (!selected || selected === pid) return;
    pm.kill(selected);
  };

  const thStyle: React.CSSProperties = { textAlign: "left", padding: "2px 8px", borderBottom: "var(--border, 1px solid #151820)", borderRight: "var(--border, 1px solid #151820)", fontWeight: "bold", fontSize: "0.75rem", userSelect: "none" };
  const tdStyle: React.CSSProperties = { padding: "2px 8px", fontSize: "0.78rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };

  return (
    <Window
      windowId="taskmanager"
      title="Task Manager"
      icon="/icons/tools.png"
      width="400px"
      height="280px"
      defaultOpen
      scrollContent
      onClose={() => pm.kill(pid)}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "6px", boxSizing: "border-box" }}>
        <div className="pc-scroll" style={{ flex: 1, overflow: "auto", border: "var(--border, 1px solid #151820)", background: "var(--color-input-background, #fff)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "45%" }} />
              <col style={{ width: "33%" }} />
              <col style={{ width: "22%" }} />
            </colgroup>
            <thead>
              <tr style={{ background: "var(--color-surface, #d4d0c8)" }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>PID</th>
                <th style={{ ...thStyle, borderRight: "none" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {procs.length === 0 && (
                <tr><td colSpan={3} style={{ ...tdStyle, color: "var(--color-text-muted, #888)", textAlign: "center", padding: "12px" }}>No running processes</td></tr>
              )}
              {procs.map(proc => {
                const def = apps[proc.appId];
                const isSelf = proc.pid === pid;
                const isSelected = proc.pid === selected;
                return (
                  <tr
                    key={proc.pid}
                    onClick={() => setSelected(proc.pid)}
                    style={{ background: isSelected ? "var(--color-active, var(--pastelcore-cyan, #a7fcfb))" : "transparent", color: isSelected ? "#000" : "inherit", cursor: "default" }}
                  >
                    <td style={{ ...tdStyle, display: "flex", alignItems: "center", gap: "6px" }}>
                      {def?.icon && <img src={def.icon} alt="" width={14} height={14} style={{ imageRendering: "pixelated", flexShrink: 0 }} />}
                      {def?.title ?? proc.appId}{isSelf ? " (this)" : ""}
                    </td>
                    <td style={tdStyle}>{proc.pid}</td>
                    <td style={tdStyle}>{proc.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "6px" }}>
          <Button variant="ghost" size="md" onClick={endProcess} disabled={!selected || selected === pid}>
            End Process
          </Button>
        </div>
      </div>
    </Window>
  );
}

const OS_APPS: Record<string, AppDef> = {
  notepad: {
    component: NotepadApp,
    title: "Notepad",
    icon: "/icons/notepad.png",
    extensions: ["txt", "doc", "md"],
  },
  openwith: {
    component: OpenWithDialog,
    title: "Open With",
    icon: "/icons/tools.png",
    persistent: false,
  },
  terminal: {
    component: TerminalApp,
    title: "Terminal",
    icon: "/icons/script_file.png",
  },
  taskmanager: {
    component: TaskManagerApp,
    title: "Task Manager",
    icon: "/icons/tools.png",
  },
  explorer: {
    component: ExplorerApp,
    title: "My Documents",
    icon: "/icons/folder_open.png",
  },
  browser: {
    component: BrowserApp,
    title: "Internet Explorer",
    icon: "/icons/world.png",
  },
};

// ── Browser demo ─────────────────────────────────────────────────────────────

const HOME = "https://en.m.wikipedia.org/wiki/Main_Page";

function BrowserApp({ pid }: { pid: string; args: ProcessArgs }) {
  const { pm } = useOS();
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
      defaultOpen
      onClose={() => pm.kill(pid)}
      url={src}
      width="640px"
      height="480px"
      style={{ top: "80px", left: "calc(50vw - 320px)" }}
      canGoBack={historyIndex > 0}
      canGoForward={historyIndex < navHistory.length - 1}
      onNavigate={navigate}
      onBack={goBack}
      backIcon="/icons/back.png"
      onForward={goForward}
      forwardIcon="/icons/forward.png"
      onRefresh={refresh}
      refreshIcon="/icons/refresh.png"
      onStop={stop}
      stopIcon="/icons/stop.png"
      onHome={() => navigate(HOME)}
      homeIcon="/icons/home.png"
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


// ── Explorer app ──────────────────────────────────────────────────────────────

function ExplorerApp({ pid }: { pid: string; args: ProcessArgs }) {
  const { pm } = useOS();
  return (
    <Window windowId="explorer" title="My Documents" width="600px" height="400px" defaultOpen
      style={{ top: "80px", left: "calc(50vw - 300px)" }}
      icon="/icons/folder_open.png"
      bodyOverflow="hidden"
      onClose={() => pm.kill(pid)}>
      <ExplorerDemo />
    </Window>
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
  const os = useOS();
  const focus = (id: string) => wm.open(id);
  const openSingleton = (appId: string, windowId: string) => {
    if (!os.pm.list().find(p => p.appId === appId)) os.openWith(appId);
    else wm.open(windowId);
  };
  return (
    <div style={{ position: "absolute", top: "16px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "1.5rem" }}>
      <DesktopIcon label="Notepad" icon="/icons/notepad.png" onClick={() => { if (!os.pm.list().find(p => p.appId === "notepad" && !p.args?.filePath)) os.openWith("notepad"); }} />
      <DesktopIcon label="Login" icon="/icons/password_manager.png" onClick={() => focus("login")} />
      <DesktopIcon label="Terminal" icon="/icons/script_file.png" onClick={() => { if (!os.pm.list().find(p => p.appId === "terminal")) os.openWith("terminal"); }} />
      <DesktopIcon label="Task Manager" icon="/icons/tools.png" onClick={() => { if (!os.pm.list().find(p => p.appId === "taskmanager")) os.openWith("taskmanager"); }} />
      <DesktopIcon label="Components" icon="/icons/tools.png" onClick={() => focus("components")} />
      <DesktopIcon label="Browser" icon="/icons/world.png" onClick={() => openSingleton("browser", "browser")} />
      <DesktopIcon label="Explorer" icon="/icons/folder_open.png" onClick={() => openSingleton("explorer", "explorer")} />
    </div>
  );
}

// ── VirtualFS instance (singleton for the demo) ───────────────────────────────

import { VirtualFS, LocalStorageAdapter } from "@dreamdesk/os";
import type { FSNode } from "@dreamdesk/os";

const fsAdapter = new LocalStorageAdapter("dreamdesk-demo-fs");

const demoFS = new VirtualFS();
demoFS.mkdir("/Desktop");
demoFS.mkdir("/My Documents");
demoFS.mkdir("/My Documents/Work");
demoFS.mkdir("/Downloads");
demoFS.writeFile("/My Documents/readme.txt", "Welcome to DreamDesk!\n\nThis file is stored in a VirtualFS instance running in your browser.");
demoFS.writeFile("/My Documents/notes.txt", "TODO:\n- Finish Level 3\n- Build Notepad\n- Wire up IPC");
demoFS.writeFile("/My Documents/Work/report.doc", "Q1 Report\n\nRevenue: $0\nExpenses: $0\nProfit: priceless");
demoFS.writeFile("/My Documents/Work/budget.xls", "Month,Income,Expenses\nJan,0,0\nFeb,0,0");
demoFS.writeFile("/Downloads/setup.exe", "MZ\x90\x00 (this is a fake binary)");
demoFS.writeFile("/Downloads/archive.zip", "PK (this is a fake zip)");
demoFS.writeFile("/Desktop/shortcut.lnk", "[InternetShortcut]\nURL=https://github.com");

// ── Explorer helpers ──────────────────────────────────────────────────────────

function extIcon(name: string, isDir: boolean): string {
  if (isDir) return "/icons/folder_closed.png";
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "txt" || ext === "doc") return "/icons/text_file.png";
  if (ext === "xls") return "/icons/spreadsheet_file.png";
  if (ext === "png" || ext === "jpg") return "/icons/image_file.png";
  if (ext === "mp3") return "/icons/audio_file.png";
  if (ext === "zip") return "/icons/3d_graphics_file.png";
  if (ext === "exe") return "/icons/script_file.png";
  if (ext === "lnk") return "/icons/webpage_file.png";
  return "/icons/text_file_2.png";
}

function extType(name: string, isDir: boolean): string {
  if (isDir) return "File Folder";
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "txt") return "Text Document";
  if (ext === "doc") return "Word Document";
  if (ext === "xls") return "Spreadsheet";
  if (ext === "png") return "PNG Image";
  if (ext === "mp3") return "MP3 Audio";
  if (ext === "zip") return "ZIP Archive";
  if (ext === "exe") return "Application";
  if (ext === "lnk") return "Shortcut";
  return "File";
}

function fsToTreeNodes(fs: VirtualFS, path: string = "/"): TreeNode[] {
  return fs.ls(path)
    .filter(node => node.kind === "dir")
    .map(node => {
      const id = path === "/" ? `/${node.name}` : `${path}/${node.name}`;
      return {
        id,
        label: node.name,
        icon: extIcon(node.name, true),
        children: fsToTreeNodes(fs, id),
      };
    });
}

function fsToListItems(fs: VirtualFS, path: string): ListViewItem[] {
  return fs.ls(path).map((node) => ({
    id: path === "/" ? `/${node.name}` : `${path}/${node.name}`,
    name: node.name,
    icon: extIcon(node.name, node.kind === "dir"),
    type: extType(node.name, node.kind === "dir"),
    size: node.kind === "file" ? `${node.content.length} B` : "",
    date: new Date(node.modified).toLocaleDateString(),
  }));
}

function findTreeNode(nodes: TreeNode[], id: string): TreeNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) { const f = findTreeNode(n.children, id); if (f) return f; }
  }
  return null;
}

function getTreePath(nodes: TreeNode[], id: string, path: TreeNode[] = []): TreeNode[] | null {
  for (const n of nodes) {
    const next = [...path, n];
    if (n.id === id) return next;
    if (n.children) { const f = getTreePath(n.children, id, next); if (f) return f; }
  }
  return null;
}

function ExplorerDemo() {
  const [selectedPath, setSelectedPath] = useState<string>("/My Documents");
  const [selectedList, setSelectedList] = useState<string[]>([]);
  const [listMode, setListMode] = useState<"icons" | "details">("details");
  const [, setTick] = useState(0);
  const dialog = useDialog();
  const os = useOS();

  useEffect(() => demoFS.watch("/", () => {
    setTick(t => t + 1);
    // Reset selection if the selected path was deleted or never existed in the loaded FS
    setSelectedPath(p => demoFS.exists(p) ? p : "/");
    setSelectedList(prev => prev.filter(p => demoFS.exists(p)));
  }), []);

  const treeNodes = fsToTreeNodes(demoFS);
  const isDir = demoFS.exists(selectedPath) && demoFS.stat(selectedPath).kind === "dir";
  const listItems = isDir ? fsToListItems(demoFS, selectedPath) : [];
  const breadcrumb = getTreePath(treeNodes, selectedPath) ?? [];

  // The effective folder to create things in — fall back to "/" if selectedPath is gone
  const cwdForCreate = isDir ? selectedPath : "/";

  const handleTreeSelect = (id: string) => { setSelectedPath(id); setSelectedList([]); };
  const handleListOpen = (id: string) => {
    if (!demoFS.exists(id)) return;
    const stat = demoFS.stat(id);
    if (stat.kind === "dir") { handleTreeSelect(id); return; }
    const pid = os.open(id);
    if (!pid) os.openWith("openwith", { filePath: id });
  };

  const newFolder = async () => {
    const name = await dialog.prompt("Folder name:", { defaultValue: "New Folder" });
    if (!name) return;
    try { demoFS.mkdir(`${cwdForCreate}/${name}`); } catch { dialog.alert(`Could not create "${name}"`); }
  };

  const newFile = async () => {
    const name = await dialog.prompt("File name:", { defaultValue: "New Text Document.txt" });
    if (!name) return;
    try { demoFS.writeFile(`${cwdForCreate}/${name}`, ""); } catch { dialog.alert(`Could not create "${name}"`); }
  };

  const deleteSelected = async () => {
    if (!selectedList.length) return;
    const ok = await dialog.confirm(`Delete ${selectedList.length} item(s)?`);
    if (!ok) return;
    selectedList.forEach(p => { try { demoFS.rm(p); } catch {} });
    setSelectedList([]);
  };

  const singleFile = selectedList.length === 1 &&
    demoFS.exists(selectedList[0]) &&
    demoFS.stat(selectedList[0]).kind === "file";

  const openWithSelected = () => {
    if (!singleFile) return;
    os.openWith("openwith", { filePath: selectedList[0] });
  };

  const deleteFolder = async () => {
    if (selectedPath === "/") return;
    const ok = await dialog.confirm(`Delete "${selectedPath.split("/").pop()}"?`);
    if (!ok) return;
    try {
      demoFS.rm(selectedPath);
      setSelectedPath("/");
    } catch { dialog.alert("Could not delete folder."); }
  };

  const { onContextMenu: onTreeContext, contextMenu: treeContextMenu } = useContextMenu([
    { label: "New Folder",  onClick: newFolder },
    { type: "separator" },
    { label: "Delete", disabled: selectedPath === "/", onClick: deleteFolder },
  ]);

  const { onContextMenu: onListContext, contextMenu: listContextMenu } = useContextMenu([
    { label: "New Folder",         onClick: newFolder },
    { label: "New Text Document",  onClick: newFile },
    { type: "separator" },
    { label: "Open with…", disabled: !singleFile, onClick: openWithSelected },
    { label: "Delete", disabled: selectedList.length === 0, onClick: deleteSelected },
  ]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", padding: "4px 6px", gap: "4px", boxSizing: "border-box" }}>
      {/* Address bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "2px", padding: "1px 6px", border: "var(--border, 1px solid #151820)", background: "var(--color-input-background, #fff)", fontSize: "0.78rem", flexShrink: 0 }}>
        <span style={{ opacity: 0.6, marginRight: "2px" }}>Address:</span>
        {breadcrumb.map((n, i) => (
          <span key={n.id} style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            {i > 0 && <span style={{ opacity: 0.4 }}>›</span>}
            <button onClick={() => handleTreeSelect(n.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 2px", font: "inherit", fontSize: "0.78rem", color: "var(--color-text, #000)" }}>
              {n.label}
            </button>
          </span>
        ))}
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", gap: "4px" }}>
        {/* Tree panel */}
        <div
          style={{ width: "180px", border: "var(--border, 1px solid #151820)", display: "flex", flexDirection: "column", flexShrink: 0, background: "var(--color-input-background, #fff)", overflow: "hidden" }}
          onContextMenu={onTreeContext}
        >
          <div style={{ padding: "2px 6px", background: "var(--color-surface, #d4d0c8)", borderBottom: "var(--border, 1px solid #151820)", fontSize: "0.78rem", fontWeight: "bold", flexShrink: 0 }}>Folders</div>
          <div className="pc-scroll" style={{ overflow: "auto", flex: 1, padding: "2px 0" }}>
            <TreeView
              nodes={treeNodes}
              selected={selectedPath}
              defaultExpanded={["/My Documents", "/Downloads"]}
              onSelect={handleTreeSelect}
            />
          </div>
          {treeContextMenu}
        </div>

        {/* List panel */}
        <div
          style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", border: "var(--border, 1px solid #151820)", background: "var(--color-input-background, #fff)" }}
          onContextMenu={onListContext}
        >
          <div style={{ display: "flex", gap: "1px", padding: "0 2px", borderBottom: "var(--border, 1px solid #151820)", background: "var(--color-surface, #d4d0c8)", flexShrink: 0 }}>
            <button onClick={() => setListMode("details")} style={{ fontWeight: listMode === "details" ? "bold" : "normal", fontFamily: "inherit", fontSize: "0.65rem", padding: "0 3px", lineHeight: "1.6", background: "none", border: "1px solid transparent", cursor: "pointer" }}>Details</button>
            <button onClick={() => setListMode("icons")} style={{ fontWeight: listMode === "icons" ? "bold" : "normal", fontFamily: "inherit", fontSize: "0.65rem", padding: "0 3px", lineHeight: "1.6", background: "none", border: "1px solid transparent", cursor: "pointer" }}>Icons</button>
          </div>
          <ListView
            items={listItems}
            mode={listMode}
            selected={selectedList}
            multiSelect
            onSelect={setSelectedList}
            onOpen={handleListOpen}
            className="pc-scroll"
            style={{ flex: 1, background: "var(--color-input-background, #fff)" }}
          />
          {listContextMenu}
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
        <OSProvider fs={demoFS} apps={OS_APPS} adapter={fsAdapter}>

        <WindowShortcuts />

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
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <Checkbox label="Enable notifications" defaultChecked />
              <Checkbox label="Show in taskbar" />
              <Checkbox label="Indeterminate state" indeterminate />
              <Checkbox label="Disabled" disabled />
            </div>
            <RadioGroup value="b" onChange={() => {}}>
              <Radio value="a" label="Option A" />
              <Radio value="b" label="Option B" />
              <Radio value="c" label="Option C" />
              <Radio value="d" label="Disabled" disabled />
            </RadioGroup>
            <Select
              options={[
                { value: "xp", label: "Windows XP" },
                { value: "98", label: "Windows 98" },
                { value: "vista", label: "Windows Vista" },
                { value: "7", label: "Windows 7" },
              ]}
              defaultValue="xp"
              label="Theme:"
              layout="inline"
            />
            <Slider label="Volume:" defaultValue={60} showValue />
            <Slider label="Brightness:" defaultValue={80} showValue />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                <Button variant="primary" size="sm">Primary sm</Button>
                <Button variant="primary" size="md">Primary md</Button>
                <Button variant="primary" size="lg">Primary lg</Button>
              </div>
              <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                <Button variant="ghost" size="sm">Ghost sm</Button>
                <Button variant="ghost" size="md">Ghost md</Button>
                <Button variant="ghost" size="lg">Ghost lg</Button>
              </div>
              <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                <Button variant="help" size="sm">Help sm</Button>
                <Button variant="help" size="md">Help md</Button>
                <Button variant="help" size="lg">Help lg</Button>
              </div>
              <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                <Button variant="primary" size="sm" disabled>Disabled sm</Button>
                <Button variant="primary" size="md" disabled>Disabled md</Button>
                <Button variant="primary" size="lg" disabled>Disabled lg</Button>
              </div>
            </div>
          </div>
        </Window>


        <Taskbar />
        </OSProvider>
      </Desktop>
      </DialogProvider>
    </ThemeProvider>
  );
}
