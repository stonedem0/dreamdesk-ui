import type { VirtualFS } from "../fs/VirtualFS";
import type { ProcessManager } from "../process/ProcessManager";

export interface ShellContext {
  fs: VirtualFS;
  pm: ProcessManager;
  cwd: string;
}

export interface ShellResult {
  lines: string[];
  newCwd?: string;
  clear?: boolean;
}

// ── Path helpers ──────────────────────────────────────────────────────────────

export function resolvePath(p: string, cwd: string): string {
  if (!p || p === "~") return "/";
  if (p.startsWith("/")) return normalizePath(p);
  const parts = cwd === "/" ? [] : cwd.split("/").filter(Boolean);
  for (const seg of p.split("/")) {
    if (seg === "." || seg === "") continue;
    if (seg === "..") { parts.pop(); continue; }
    parts.push(seg);
  }
  return "/" + parts.join("/");
}

function normalizePath(p: string): string {
  const parts = p.split("/").filter(Boolean);
  const out: string[] = [];
  for (const seg of parts) {
    if (seg === "..") out.pop();
    else if (seg !== ".") out.push(seg);
  }
  return "/" + out.join("/");
}

// ── Display helpers ───────────────────────────────────────────────────────────

export function toWinPath(unixPath: string): string {
  if (unixPath === "/") return "C:\\";
  return "C:" + unixPath.replace(/\//g, "\\");
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// ── Command handlers ──────────────────────────────────────────────────────────

function cmdLs(args: string[], ctx: ShellContext): string[] {
  const path = args[0] ? resolvePath(args[0], ctx.cwd) : ctx.cwd;
  try {
    const nodes = ctx.fs.ls(path);
    if (nodes.length === 0) return ["(empty)"];
    const dirs = nodes.filter(n => n.kind === "dir").map(n => `  <DIR>  ${n.name}`);
    const files = nodes.filter(n => n.kind === "file").map(n => {
      const size = formatSize(n.content.length).padStart(10);
      return `${size}  ${n.name}`;
    });
    return [...dirs, ...files, "", `  ${dirs.length} dir(s)  ${files.length} file(s)`];
  } catch {
    return [`ls: cannot access '${path}': No such directory`];
  }
}

function cmdCd(args: string[], ctx: ShellContext): ShellResult {
  const target = args[0] ? resolvePath(args[0], ctx.cwd) : "/";
  if (!ctx.fs.exists(target)) return { lines: [`cd: '${target}': No such directory`] };
  if (ctx.fs.stat(target).kind !== "dir") return { lines: [`cd: '${target}': Not a directory`] };
  return { lines: [], newCwd: target };
}

function cmdCat(args: string[], ctx: ShellContext): string[] {
  if (!args[0]) return ["Usage: cat <file>"];
  const path = resolvePath(args[0], ctx.cwd);
  try {
    return ctx.fs.readFile(path).split("\n");
  } catch {
    return [`cat: '${path}': No such file`];
  }
}

function cmdMkdir(args: string[], ctx: ShellContext): string[] {
  if (!args[0]) return ["Usage: mkdir <dir>"];
  const path = resolvePath(args[0], ctx.cwd);
  try { ctx.fs.mkdir(path); return []; }
  catch (e) { return [`mkdir: ${(e as Error).message}`]; }
}

function cmdRm(args: string[], ctx: ShellContext): string[] {
  if (!args[0]) return ["Usage: rm <path>"];
  const path = resolvePath(args[0], ctx.cwd);
  try { ctx.fs.rm(path); return []; }
  catch (e) { return [`rm: ${(e as Error).message}`]; }
}

function cmdMv(args: string[], ctx: ShellContext): string[] {
  if (args.length < 2) return ["Usage: mv <source> <dest>"];
  const src = resolvePath(args[0], ctx.cwd);
  const dest = resolvePath(args[1], ctx.cwd);
  try { ctx.fs.mv(src, dest); return []; }
  catch (e) { return [`mv: ${(e as Error).message}`]; }
}

function cmdTouch(args: string[], ctx: ShellContext): string[] {
  if (!args[0]) return ["Usage: touch <file>"];
  const path = resolvePath(args[0], ctx.cwd);
  try {
    if (!ctx.fs.exists(path)) ctx.fs.writeFile(path, "");
    return [];
  } catch (e) { return [`touch: ${(e as Error).message}`]; }
}

function cmdPs(ctx: ShellContext): string[] {
  const procs = ctx.pm.list();
  if (procs.length === 0) return ["  (no running processes)"];
  const header = "  PID              APP       STATUS";
  const rows = procs.map(p => `  ${p.pid.padEnd(16)} ${p.appId.padEnd(10)}${p.status}`);
  return [header, ...rows];
}

function cmdKill(args: string[], ctx: ShellContext): string[] {
  if (!args[0]) return ["Usage: kill <pid>"];
  const pid = args[0];
  if (!ctx.pm.get(pid)) return [`kill: no process with pid '${pid}'`];
  ctx.pm.kill(pid);
  return [`Terminated: ${pid}`];
}

const HELP_LINES = [
  "  ls [path]        List directory contents",
  "  cd [path]        Change directory",
  "  pwd              Print working directory",
  "  cat <file>       Print file contents",
  "  touch <file>     Create empty file",
  "  mkdir <dir>      Create directory",
  "  rm <path>        Remove file or directory",
  "  mv <src> <dest>  Move or rename",
  "  echo <text>      Print text",
  "  ps               List running processes",
  "  kill <pid>       Terminate a process",
  "  clear            Clear the screen",
  "  help             Show this help",
];

// ── Main entry ────────────────────────────────────────────────────────────────

export function executeCommand(input: string, ctx: ShellContext): ShellResult {
  const trimmed = input.trim();
  if (!trimmed) return { lines: [] };

  const [cmd, ...args] = trimmed.split(/\s+/);

  switch (cmd.toLowerCase()) {
    case "ls":    return { lines: cmdLs(args, ctx) };
    case "cd":    return cmdCd(args, ctx);
    case "pwd":   return { lines: [ctx.cwd] };
    case "cat":   return { lines: cmdCat(args, ctx) };
    case "touch": return { lines: cmdTouch(args, ctx) };
    case "mkdir": return { lines: cmdMkdir(args, ctx) };
    case "rm":    return { lines: cmdRm(args, ctx) };
    case "mv":    return { lines: cmdMv(args, ctx) };
    case "echo":  return { lines: [args.join(" ")] };
    case "ps":    return { lines: cmdPs(ctx) };
    case "kill":  return { lines: cmdKill(args, ctx) };
    case "clear": return { lines: [], clear: true };
    case "help":  return { lines: HELP_LINES };
    default:      return { lines: [`'${cmd}' is not recognized. Type 'help' for commands.`] };
  }
}
