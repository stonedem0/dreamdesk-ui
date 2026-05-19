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
import { Checkbox } from "../components/Checkbox";
import { Radio, RadioGroup } from "../components/Radio";
import { Select } from "../components/Select";
import { Slider } from "../components/Slider";
import { useContextMenu } from "../components/ContextMenu";
import { OSProvider, useOS, type AppDef, type ProcessArgs } from "@dreamdesk/os";

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
          <MenuItem shortcut="Ctrl+S" onClick={save}>Save</MenuItem>
          <MenuSeparator />
          <MenuItem onClick={() => pm.kill(pid)}>Exit</MenuItem>
        </Menu>
      </MenuBar>
      <textarea
        value={content}
        onChange={e => { setContent(e.target.value); setDirty(true); }}
        onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); save(); } }}
        spellCheck={false}
        style={{ flex: 1, minHeight: 0, width: "100%", border: "none", outline: "none", resize: "none", padding: "4px 6px", fontFamily: "monospace", fontSize: "0.85rem", background: "var(--color-window-body, #fff)", color: "var(--color-text, #000)", boxSizing: "border-box", overflow: "auto" }}
      />
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
  },
};

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
      <DesktopIcon label="Explorer" icon="/icons/folder_open.png" onClick={() => focus("explorer")} />
    </div>
  );
}

// ── VirtualFS instance (singleton for the demo) ───────────────────────────────

import { VirtualFS } from "@dreamdesk/os";
import type { FSNode } from "@dreamdesk/os";

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

  useEffect(() => demoFS.watch("/", () => setTick(t => t + 1)), []);

  const treeNodes = fsToTreeNodes(demoFS);
  const isDir = demoFS.exists(selectedPath) && demoFS.stat(selectedPath).kind === "dir";
  const listItems = isDir ? fsToListItems(demoFS, selectedPath) : [];
  const breadcrumb = getTreePath(treeNodes, selectedPath) ?? [];

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
    try { demoFS.mkdir(`${selectedPath}/${name}`); } catch { dialog.alert(`Could not create "${name}"`); }
  };

  const newFile = async () => {
    const name = await dialog.prompt("File name:", { defaultValue: "New Text Document.txt" });
    if (!name) return;
    try { demoFS.writeFile(`${selectedPath}/${name}`, ""); } catch { dialog.alert(`Could not create "${name}"`); }
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

  const { onContextMenu: onListContext, contextMenu: listContextMenu } = useContextMenu([
    { label: "New Folder",         onClick: newFolder },
    { label: "New Text Document",  onClick: newFile },
    { type: "separator" },
    { label: "Open with…", disabled: !singleFile, onClick: openWithSelected },
    { label: "Delete", disabled: selectedList.length === 0, onClick: deleteSelected },
  ]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Path bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "2px", padding: "2px 6px", borderBottom: "1px solid var(--dd-border-color, #999)", background: "var(--color-surface, #d4d0c8)", fontSize: "0.78rem", flexShrink: 0 }}>
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

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Tree panel */}
        <div style={{ width: "180px", borderRight: "1px solid var(--dd-border-color, #999)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "2px 6px", background: "var(--color-surface, #d4d0c8)", borderBottom: "1px solid var(--dd-border-color, #999)", fontSize: "0.78rem", fontWeight: "bold", flexShrink: 0 }}>Folders</div>
          <div style={{ overflow: "auto", flex: 1, padding: "2px 0" }}>
            <TreeView
              nodes={treeNodes}
              selected={selectedPath}
              defaultExpanded={["/My Documents", "/Downloads"]}
              onSelect={handleTreeSelect}
            />
          </div>
        </div>

        {/* List panel */}
        <div
          style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}
          onContextMenu={onListContext}
        >
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
        <OSProvider fs={demoFS} apps={OS_APPS}>

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
          icon="/icons/folder_open.png"
          bodyOverflow="hidden">
          <ExplorerDemo />
        </Window>

        {/* Browser — center */}
        <BrowserWindowDemo />

        <DialogDemo />
        <Taskbar />
        </OSProvider>
      </Desktop>
      </DialogProvider>
    </ThemeProvider>
  );
}
