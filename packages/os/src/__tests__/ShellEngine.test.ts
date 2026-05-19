import { describe, it, expect, beforeEach } from "vitest";
import { VirtualFS } from "../fs/VirtualFS";
import { ProcessManager } from "../process/ProcessManager";
import { executeCommand, resolvePath, toWinPath } from "../shell/ShellEngine";
import type { ShellContext } from "../shell/ShellEngine";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeCtx(cwd = "/"): ShellContext {
  const fs = new VirtualFS();
  fs.mkdir("/docs");
  fs.mkdir("/docs/work");
  fs.writeFile("/docs/readme.txt", "hello\nworld");
  fs.writeFile("/docs/work/report.txt", "q1");
  const pm = new ProcessManager();
  pm.registerExtension("txt", "notepad");
  return { fs, pm, cwd };
}

const run = (cmd: string, ctx: ShellContext) => executeCommand(cmd, ctx);

// ── resolvePath ───────────────────────────────────────────────────────────────

describe("resolvePath", () => {
  it("absolute path is returned as-is", () => {
    expect(resolvePath("/docs/work", "/")).toBe("/docs/work");
  });

  it("relative path joins with cwd", () => {
    expect(resolvePath("work", "/docs")).toBe("/docs/work");
  });

  it(".. goes up one level", () => {
    expect(resolvePath("..", "/docs/work")).toBe("/docs");
  });

  it(".. from root stays at root", () => {
    expect(resolvePath("..", "/")).toBe("/");
  });

  it(". stays in cwd", () => {
    expect(resolvePath(".", "/docs")).toBe("/docs");
  });

  it("empty string resolves to root", () => {
    expect(resolvePath("", "/docs")).toBe("/");
  });

  it("~ resolves to root", () => {
    expect(resolvePath("~", "/docs")).toBe("/");
  });

  it("multi-segment relative path", () => {
    expect(resolvePath("work/sub", "/docs")).toBe("/docs/work/sub");
  });

  it("normalizes double slashes", () => {
    expect(resolvePath("/docs//work", "/")).toBe("/docs/work");
  });
});

// ── toWinPath ─────────────────────────────────────────────────────────────────

describe("toWinPath", () => {
  it("root → C:\\", () => {
    expect(toWinPath("/")).toBe("C:\\");
  });

  it("unix path → windows path", () => {
    expect(toWinPath("/docs/work")).toBe("C:\\docs\\work");
  });
});

// ── ls ────────────────────────────────────────────────────────────────────────

describe("ls", () => {
  it("lists cwd by default", () => {
    const ctx = makeCtx("/docs");
    const { lines } = run("ls", ctx);
    expect(lines.join("\n")).toContain("readme.txt");
    expect(lines.join("\n")).toContain("<DIR>");
  });

  it("lists given path", () => {
    const ctx = makeCtx("/");
    const { lines } = run("ls /docs", ctx);
    expect(lines.join("\n")).toContain("readme.txt");
  });

  it("shows (empty) for empty dir", () => {
    const ctx = makeCtx("/");
    ctx.fs.mkdir("/empty");
    expect(run("ls /empty", ctx).lines).toContain("(empty)");
  });

  it("errors on missing path", () => {
    const { lines } = run("ls /nope", makeCtx());
    expect(lines[0]).toMatch(/No such directory/);
  });
});

// ── cd ────────────────────────────────────────────────────────────────────────

describe("cd", () => {
  it("changes cwd", () => {
    const result = run("cd /docs", makeCtx("/"));
    expect(result.newCwd).toBe("/docs");
    expect(result.lines).toEqual([]);
  });

  it("cd with no args goes to root", () => {
    expect(run("cd", makeCtx("/docs")).newCwd).toBe("/");
  });

  it("relative path", () => {
    expect(run("cd docs", makeCtx("/")).newCwd).toBe("/docs");
  });

  it("errors on missing path", () => {
    expect(run("cd /nope", makeCtx()).lines[0]).toMatch(/No such directory/);
  });

  it("errors on file path", () => {
    expect(run("cd /docs/readme.txt", makeCtx()).lines[0]).toMatch(/Not a directory/);
  });
});

// ── pwd ───────────────────────────────────────────────────────────────────────

describe("pwd", () => {
  it("prints cwd", () => {
    expect(run("pwd", makeCtx("/docs")).lines).toEqual(["/docs"]);
  });
});

// ── cat ───────────────────────────────────────────────────────────────────────

describe("cat", () => {
  it("prints file contents line by line", () => {
    const { lines } = run("cat /docs/readme.txt", makeCtx());
    expect(lines).toEqual(["hello", "world"]);
  });

  it("errors on missing file", () => {
    expect(run("cat /nope.txt", makeCtx()).lines[0]).toMatch(/No such file/);
  });

  it("errors with no args", () => {
    expect(run("cat", makeCtx()).lines[0]).toMatch(/Usage/);
  });
});

// ── touch ─────────────────────────────────────────────────────────────────────

describe("touch", () => {
  it("creates an empty file", () => {
    const ctx = makeCtx("/");
    run("touch /docs/new.txt", ctx);
    expect(ctx.fs.exists("/docs/new.txt")).toBe(true);
    expect(ctx.fs.readFile("/docs/new.txt")).toBe("");
  });

  it("is a no-op on existing file", () => {
    const ctx = makeCtx("/");
    expect(() => run("touch /docs/readme.txt", ctx)).not.toThrow();
  });

  it("errors with no args", () => {
    expect(run("touch", makeCtx()).lines[0]).toMatch(/Usage/);
  });
});

// ── mkdir ─────────────────────────────────────────────────────────────────────

describe("mkdir", () => {
  it("creates a directory", () => {
    const ctx = makeCtx("/");
    run("mkdir /docs/archive", ctx);
    expect(ctx.fs.exists("/docs/archive")).toBe(true);
  });

  it("errors with no args", () => {
    expect(run("mkdir", makeCtx()).lines[0]).toMatch(/Usage/);
  });
});

// ── rm ────────────────────────────────────────────────────────────────────────

describe("rm", () => {
  it("removes a file", () => {
    const ctx = makeCtx("/");
    run("rm /docs/readme.txt", ctx);
    expect(ctx.fs.exists("/docs/readme.txt")).toBe(false);
  });

  it("removes a directory", () => {
    const ctx = makeCtx("/");
    run("rm /docs/work", ctx);
    expect(ctx.fs.exists("/docs/work")).toBe(false);
  });

  it("errors on missing path", () => {
    expect(run("rm /nope", makeCtx()).lines[0]).toMatch(/rm:/);
  });

  it("errors with no args", () => {
    expect(run("rm", makeCtx()).lines[0]).toMatch(/Usage/);
  });
});

// ── mv ────────────────────────────────────────────────────────────────────────

describe("mv", () => {
  it("moves a file", () => {
    const ctx = makeCtx("/");
    run("mv /docs/readme.txt /docs/work/readme.txt", ctx);
    expect(ctx.fs.exists("/docs/readme.txt")).toBe(false);
    expect(ctx.fs.readFile("/docs/work/readme.txt")).toBe("hello\nworld");
  });

  it("renames a file", () => {
    const ctx = makeCtx("/");
    run("mv /docs/readme.txt /docs/README.md", ctx);
    expect(ctx.fs.exists("/docs/README.md")).toBe(true);
  });

  it("errors with one arg", () => {
    expect(run("mv /docs/readme.txt", makeCtx()).lines[0]).toMatch(/Usage/);
  });
});

// ── echo ──────────────────────────────────────────────────────────────────────

describe("echo", () => {
  it("prints the arguments", () => {
    expect(run("echo hello world", makeCtx()).lines).toEqual(["hello world"]);
  });

  it("empty echo returns empty string", () => {
    expect(run("echo", makeCtx()).lines).toEqual([""]);
  });
});

// ── ps / kill ─────────────────────────────────────────────────────────────────

describe("ps", () => {
  it("shows no processes when empty", () => {
    expect(run("ps", makeCtx()).lines[0]).toMatch(/no running processes/);
  });

  it("lists spawned processes", () => {
    const ctx = makeCtx();
    ctx.pm.spawn("notepad", { args: { filePath: "/docs/readme.txt" } });
    const { lines } = run("ps", ctx);
    expect(lines.join("\n")).toContain("notepad");
  });
});

describe("kill", () => {
  it("kills a running process", () => {
    const ctx = makeCtx();
    const pid = ctx.pm.spawn("notepad");
    run(`kill ${pid}`, ctx);
    expect(ctx.pm.get(pid)).toBeNull();
  });

  it("errors on unknown pid", () => {
    expect(run("kill ghost-99", makeCtx()).lines[0]).toMatch(/no process/);
  });

  it("errors with no args", () => {
    expect(run("kill", makeCtx()).lines[0]).toMatch(/Usage/);
  });
});

// ── clear / help / unknown ────────────────────────────────────────────────────

describe("clear", () => {
  it("returns clear flag", () => {
    expect(run("clear", makeCtx()).clear).toBe(true);
  });
});

describe("help", () => {
  it("lists available commands", () => {
    const { lines } = run("help", makeCtx());
    expect(lines.join("\n")).toContain("ls");
    expect(lines.join("\n")).toContain("cd");
    expect(lines.join("\n")).toContain("kill");
  });
});

describe("unknown command", () => {
  it("returns error message", () => {
    expect(run("foobar", makeCtx()).lines[0]).toMatch(/not recognized/);
  });
});

describe("empty input", () => {
  it("returns empty lines", () => {
    expect(run("", makeCtx()).lines).toEqual([]);
  });

  it("whitespace-only returns empty lines", () => {
    expect(run("   ", makeCtx()).lines).toEqual([]);
  });
});
