import type { VirtualFS, FSNode } from "../fs/VirtualFS";

/**
 * A DOS command prompt over a VirtualFS: DIR, CD, TYPE, COPY and friends,
 * C:\ paths with backslashes, names matched without regard to case, and DOS's
 * own messages ("Bad command or file name"). Long names are shown as they are.
 */

export interface ShellContext {
  fs: VirtualFS;
  /** Current directory, as a VirtualFS path ("/documents"). */
  cwd: string;
  /** Opens a file in its app, for START; returns false if nothing can open it. */
  open?: (path: string) => boolean;
}

export interface ShellResult {
  lines: string[];
  /** The new current directory (a VirtualFS path), after CD. */
  newCwd?: string;
  /** CLS: clear the screen. */
  clear?: boolean;
  /** EXIT: close the prompt. */
  exit?: boolean;
}

export const SHELL_NAME = "DreamDesk DOS";
export const SHELL_VERSION = "1.0";
/** What the prompt shows when it opens. */
export const SHELL_BANNER = [`${SHELL_NAME} [Version ${SHELL_VERSION}]`, "Type HELP for a list of commands.", ""];

// ── Paths ─────────────────────────────────────────────────────────────────────

/** A VirtualFS path as DOS shows it: "/documents/notes" → "C:\documents\notes". */
export function toDosPath(path: string): string {
  return "C:\\" + path.split("/").filter(Boolean).join("\\");
}

/** The prompt for a directory: "C:\documents>". */
export const dosPrompt = (cwd: string) => `${toDosPath(cwd)}>`;

const join = (dir: string, name: string) => `${dir === "/" ? "" : dir}/${name}`;
const parentOf = (path: string) => path.slice(0, path.lastIndexOf("/")) || "/";
const baseName = (path: string) => path.slice(path.lastIndexOf("/") + 1);
const isDir = (fs: VirtualFS, path: string) => fs.exists(path) && fs.stat(path).kind === "dir";

/** A child's name as stored, matched without regard to case; null if there's none. */
function findChild(fs: VirtualFS, dir: string, name: string): string | null {
  if (!isDir(fs, dir)) return null;
  const lower = name.toLowerCase();
  return fs.ls(dir).find((n) => n.name.toLowerCase() === lower)?.name ?? null;
}

/**
 * Resolves what was typed ("..\notes", "C:\documents", "\", "README.TXT")
 * against `cwd`, to a VirtualFS path with names as stored. A last name that
 * doesn't exist is kept as typed, so it can be created. Null for another drive,
 * or a path through folders that don't exist.
 */
export function resolveDosPath(input: string, cwd: string, fs: VirtualFS): string | null {
  let rest = input;
  const drive = rest.match(/^([a-z]):/i);
  if (drive) {
    if (drive[1].toUpperCase() !== "C") return null;
    rest = rest.slice(2);
  }
  let path = rest.startsWith("\\") ? "/" : cwd;
  const segments = rest.split("\\").filter(Boolean);
  for (const [i, seg] of segments.entries()) {
    if (seg === ".") continue;
    if (seg === "..") { path = parentOf(path); continue; }
    if (!isDir(fs, path)) return null;
    const found = findChild(fs, path, seg);
    if (!found && i < segments.length - 1) return null;
    path = join(path, found ?? seg);
  }
  return path;
}

// ── Wildcards ─────────────────────────────────────────────────────────────────

function wildcard(pattern: string): (name: string) => boolean {
  if (pattern === "*.*" || pattern === "*") return () => true;
  const re = new RegExp("^" + pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".") + "$", "i");
  return (name) => re.test(name);
}

/** What a name like "*.txt" (files only) or "readme.txt" (anything) names: its folder and names. */
function match(input: string, ctx: ShellContext): { dir: string; names: string[] } | null {
  const slash = input.lastIndexOf("\\");
  const last = input.slice(slash + 1);
  if (!/[*?]/.test(last)) {
    const path = resolveDosPath(input, ctx.cwd, ctx.fs);
    if (!path || !ctx.fs.exists(path)) return null;
    return { dir: parentOf(path), names: [baseName(path)] };
  }
  const dir = slash < 0 ? ctx.cwd : resolveDosPath(input.slice(0, slash + 1), ctx.cwd, ctx.fs);
  if (!dir || !isDir(ctx.fs, dir)) return null;
  const matches = wildcard(last);
  const names = ctx.fs.ls(dir).filter((n) => n.kind === "file" && matches(n.name)).map((n) => n.name);
  return names.length ? { dir, names } : null;
}

// ── Formatting ────────────────────────────────────────────────────────────────

const pad2 = (n: number) => String(n).padStart(2, "0");
const sizeOf = (node: FSNode) => (node.kind === "file" ? new TextEncoder().encode(node.content).length : 0);
const thousands = (n: number) => n.toLocaleString("en-US");

function stamp(time: number): string {
  const d = new Date(time);
  const ampm = d.getHours() < 12 ? "a" : "p";
  return `${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}-${pad2(d.getFullYear() % 100)}  ${pad2(d.getHours() % 12 || 12)}:${pad2(d.getMinutes())}${ampm}`;
}

const dirLine = (time: number, name: string) => `${stamp(time)}    <DIR>          ${name}`;
const fileLine = (time: number, size: number, name: string) => `${stamp(time)}    ${thousands(size).padStart(14)} ${name}`;

// ── Commands ──────────────────────────────────────────────────────────────────

const BAD_COMMAND = "Bad command or file name";
const FILE_NOT_FOUND = "File not found";
const REQUIRED_PARAMETER = "Required parameter missing";
const INVALID_DIRECTORY = "Invalid directory";

/** A command gets its arguments, and the rest of the line as typed (for names with spaces). */
type Command = (args: string[], ctx: ShellContext, line: string) => ShellResult;
const out = (...lines: string[]): ShellResult => ({ lines });
const unquote = (s: string) => s.trim().replace(/^"(.*)"$/, "$1").trim();

const dir: Command = (args, ctx) => {
  const switches = args.filter((a) => a.startsWith("/"));
  if (switches.length) return out(`Invalid switch - ${switches[0]}`);
  const target = args[0] ?? ".";

  let folder = resolveDosPath(target, ctx.cwd, ctx.fs);
  let entries: FSNode[];
  if (folder && isDir(ctx.fs, folder)) {
    entries = ctx.fs.ls(folder);
  } else {
    const found = match(target, ctx);
    if (!found) return out("", " Volume in drive C is DREAMDESK", "", FILE_NOT_FOUND);
    folder = found.dir;
    entries = found.names.map((n) => ctx.fs.stat(join(found.dir, n)));
  }

  const dots = folder === "/" ? [] : [
    dirLine(ctx.fs.stat(folder).modified, "."),
    dirLine(ctx.fs.stat(parentOf(folder)).modified, ".."),
  ];
  const files = entries.filter((n) => n.kind === "file");
  const dirCount = entries.length - files.length + dots.length;
  const total = files.reduce((sum, f) => sum + sizeOf(f), 0);
  return out(
    "",
    " Volume in drive C is DREAMDESK",
    ` Directory of ${toDosPath(folder)}`,
    "",
    ...dots,
    ...entries.map((n) => (n.kind === "dir" ? dirLine(n.modified, n.name) : fileLine(n.modified, sizeOf(n), n.name))),
    `${String(files.length).padStart(16)} File(s) ${thousands(total).padStart(14)} bytes`,
    `${String(dirCount).padStart(16)} Dir(s)`,
  );
};

const cd: Command = (_args, ctx, line) => {
  const target = unquote(line);
  if (!target) return out(toDosPath(ctx.cwd));
  const path = resolveDosPath(target, ctx.cwd, ctx.fs);
  if (!path || !isDir(ctx.fs, path)) return out(INVALID_DIRECTORY);
  return { lines: [], newCwd: path };
};

const md: Command = (_args, ctx, line) => {
  const name = unquote(line);
  if (!name) return out(REQUIRED_PARAMETER);
  const path = resolveDosPath(name, ctx.cwd, ctx.fs);
  if (!path || path === "/" || ctx.fs.exists(path)) return out("Unable to create directory");
  ctx.fs.mkdir(path);
  return out();
};

const rd: Command = (_args, ctx, line) => {
  const name = unquote(line);
  if (!name) return out(REQUIRED_PARAMETER);
  const path = resolveDosPath(name, ctx.cwd, ctx.fs);
  if (path && path === ctx.cwd) return out("Attempt to remove current directory");
  if (!path || path === "/" || !isDir(ctx.fs, path) || ctx.fs.ls(path).length > 0) {
    return out("Invalid path, not directory,", "or directory not empty");
  }
  ctx.fs.rm(path);
  return out();
};

const del: Command = (args, ctx) => {
  if (!args[0]) return out(REQUIRED_PARAMETER);
  const found = match(args[0], ctx);
  if (!found) return out(FILE_NOT_FOUND);
  const paths = found.names.map((n) => join(found.dir, n));
  if (paths.some((p) => isDir(ctx.fs, p))) return out("Access denied");
  paths.forEach((p) => ctx.fs.rm(p));
  return out();
};

const type: Command = (args, ctx) => {
  if (!args[0]) return out(REQUIRED_PARAMETER);
  const path = resolveDosPath(args[0], ctx.cwd, ctx.fs);
  if (!path || !ctx.fs.exists(path)) return out(`File not found - ${args[0]}`);
  if (isDir(ctx.fs, path)) return out("Access denied");
  return out(...ctx.fs.readFile(path).split(/\r?\n/));
};

const ren: Command = (args, ctx) => {
  if (args.length < 2) return out(REQUIRED_PARAMETER);
  if (/[\\:]/.test(args[1])) return out("Invalid parameter");
  const path = resolveDosPath(args[0], ctx.cwd, ctx.fs);
  if (!path || path === "/" || !ctx.fs.exists(path)) return out("Duplicate file name or file not found");
  // Changing only the case of a name is fine; taking another one's name isn't
  const taken = findChild(ctx.fs, parentOf(path), args[1]);
  if (taken && taken !== baseName(path)) return out("Duplicate file name or file not found");
  ctx.fs.mv(path, join(parentOf(path), args[1]));
  return out();
};

/** COPY and MOVE: one file, or several by wildcard, into a folder or to a new name. */
const transfer = (move: boolean): Command => (args, ctx) => {
  if (!args[0]) return out(REQUIRED_PARAMETER);
  const found = match(args[0], ctx);
  if (!found || found.names.some((n) => isDir(ctx.fs, join(found.dir, n)))) return out(`File not found - ${args[0]}`);
  const dest = resolveDosPath(args[1] ?? ".", ctx.cwd, ctx.fs);
  const intoFolder = !!dest && isDir(ctx.fs, dest);
  if (!dest || (!intoFolder && (found.names.length > 1 || !isDir(ctx.fs, parentOf(dest))))) return out(INVALID_DIRECTORY);

  let done = 0;
  for (const name of found.names) {
    const from = join(found.dir, name);
    const to = intoFolder ? join(dest, findChild(ctx.fs, dest, name) ?? name) : dest;
    if (to === from) return out("File cannot be copied onto itself", `${String(done).padStart(9)} file(s) ${move ? "moved" : "copied"}`);
    if (move) {
      if (ctx.fs.exists(to)) ctx.fs.rm(to);
      ctx.fs.mv(from, to);
    } else ctx.fs.writeFile(to, ctx.fs.readFile(from));
    done++;
  }
  return out(`${String(done).padStart(9)} file(s) ${move ? "moved" : "copied"}`);
};

const start: Command = (args, ctx) => {
  if (!args[0]) return out(REQUIRED_PARAMETER);
  const path = resolveDosPath(args[0], ctx.cwd, ctx.fs);
  if (!path || !ctx.fs.exists(path)) return out(`Cannot find the file '${args[0]}' (or one of its components).`);
  if (isDir(ctx.fs, path)) return out("Access denied");
  if (!ctx.open?.(path)) return out(`No program is associated with '${baseName(path)}'.`);
  return out();
};

const echo: Command = (_args, _ctx, line) => {
  if (line === "") return out("ECHO is on");
  // "ECHO." prints an empty line
  return out(line === "." ? "" : line);
};

const date: Command = () => {
  const d = new Date();
  const day = d.toLocaleDateString("en-US", { weekday: "short" });
  return out(`Current date is ${day} ${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}-${d.getFullYear()}`);
};

const time: Command = () => {
  const d = new Date();
  const ampm = d.getHours() < 12 ? "a" : "p";
  return out(`Current time is ${d.getHours() % 12 || 12}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}.${pad2(Math.floor(d.getMilliseconds() / 10))}${ampm}`);
};

const HELP = [
  "CD       Shows the current directory, or changes to another",
  "CLS      Clears the screen",
  "COPY     Copies files",
  "DATE     Shows the date",
  "DEL      Deletes files",
  "DIR      Lists the files and directories in a directory",
  "ECHO     Shows a message",
  "EXIT     Closes the prompt",
  "HELP     Lists these commands",
  "MD       Makes a directory",
  "MOVE     Moves files",
  "RD       Removes an empty directory",
  "REN      Renames a file or directory",
  "START    Opens a file in its program",
  "TIME     Shows the time",
  "TYPE     Shows what's in a text file",
  "VER      Shows the version",
];

const COMMANDS: Record<string, Command> = {
  dir,
  cd, chdir: cd,
  md, mkdir: md,
  rd, rmdir: rd,
  del, erase: del,
  type,
  ren, rename: ren,
  copy: transfer(false),
  move: transfer(true),
  start,
  echo,
  date,
  time,
  cls: () => ({ lines: [], clear: true }),
  ver: () => out("", `${SHELL_NAME} [Version ${SHELL_VERSION}]`, ""),
  help: () => out(...HELP),
  exit: () => ({ lines: [], exit: true }),
};

/** Arguments split on spaces; "quoted names" keep theirs. */
function splitArgs(s: string): string[] {
  return Array.from(s.matchAll(/"([^"]*)"|(\S+)/g), (m) => m[1] ?? m[2]);
}

/** Runs one line typed at the prompt. */
export function executeCommand(input: string, ctx: ShellContext): ShellResult {
  const line = input.trim();
  if (!line) return out();

  // Changing drive: C: is the only one
  const drive = line.match(/^([a-z]):$/i);
  if (drive) return drive[1].toUpperCase() === "C" ? out() : out("Invalid drive specification");

  // The name ends at a space, dot or slash, so "cd.." and "cd\" work as in DOS
  const m = line.match(/^([a-z]+)([\s.\\/].*)?$/i);
  const name = m?.[1].toLowerCase();
  const command = name && Object.prototype.hasOwnProperty.call(COMMANDS, name) ? COMMANDS[name] : undefined;
  if (!m || !command) return out(BAD_COMMAND);
  const rest = (m[2] ?? "").replace(/^\s/, "");
  return command(splitArgs(rest), ctx, rest.trim());
}
