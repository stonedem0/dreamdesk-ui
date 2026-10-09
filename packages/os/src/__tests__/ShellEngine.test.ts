import { describe, it, expect } from "vitest";
import { VirtualFS } from "../fs/VirtualFS";
import { dosPrompt, executeCommand, resolveDosPath, toDosPath } from "../shell/ShellEngine";
import type { ShellContext } from "../shell/ShellEngine";

function makeCtx(cwd = "/", open?: ShellContext["open"]): ShellContext {
  const fs = new VirtualFS();
  fs.mkdir("/docs");
  fs.mkdir("/docs/Work Notes");
  fs.writeFile("/docs/readme.txt", "hello\nworld");
  fs.writeFile("/docs/todo.txt", "milk");
  fs.writeFile("/docs/photo.png", "");
  return { fs, cwd, open };
}

const run = (cmd: string, ctx: ShellContext) => executeCommand(cmd, ctx);
const fromEnd = (lines: string[], n: number) => lines[lines.length - n];

describe("DOS paths", () => {
  it("shows VirtualFS paths as C:\\ paths, long names and all", () => {
    expect(toDosPath("/")).toBe("C:\\");
    expect(toDosPath("/docs/Work Notes")).toBe("C:\\docs\\Work Notes");
    expect(dosPrompt("/docs")).toBe("C:\\docs>");
  });

  it("resolves what's typed, without regard to case, to names as stored", () => {
    const { fs } = makeCtx();
    expect(resolveDosPath("DOCS\\README.TXT", "/", fs)).toBe("/docs/readme.txt");
    expect(resolveDosPath("..\\docs", "/docs", fs)).toBe("/docs");
    expect(resolveDosPath("\\", "/docs", fs)).toBe("/");
    expect(resolveDosPath("C:\\docs\\.", "/", fs)).toBe("/docs");
    expect(resolveDosPath("work notes", "/docs", fs)).toBe("/docs/Work Notes");
  });

  it("keeps a new last name as typed, and refuses other drives and missing folders", () => {
    const { fs } = makeCtx();
    expect(resolveDosPath("New", "/docs", fs)).toBe("/docs/New");
    expect(resolveDosPath("D:\\docs", "/", fs)).toBeNull();
    expect(resolveDosPath("nope\\file.txt", "/", fs)).toBeNull();
    expect(resolveDosPath("readme.txt\\x", "/docs", fs)).toBeNull();
  });
});

describe("the prompt", () => {
  it("answers anything it doesn't know the DOS way, Unix commands included", () => {
    const ctx = makeCtx();
    for (const cmd of ["ls", "cat readme.txt", "pwd", "readme.txt", "constructor", "dirx"]) {
      expect(run(cmd, ctx).lines).toEqual(["Bad command or file name"]);
    }
  });

  it("takes commands in any case, and ignores blank lines", () => {
    const ctx = makeCtx("/docs");
    expect(run("TYPE todo.txt", ctx).lines).toEqual(["milk"]);
    expect(run("Type TODO.TXT", ctx).lines).toEqual(["milk"]);
    expect(run("   ", ctx).lines).toEqual([]);
  });

  it("only has drive C", () => {
    const ctx = makeCtx();
    expect(run("c:", ctx).lines).toEqual([]);
    expect(run("A:", ctx).lines).toEqual(["Invalid drive specification"]);
  });
});

describe("DIR", () => {
  it("lists folders and files with dates, sizes and long names, plus . and ..", () => {
    const lines = run("dir", makeCtx("/docs")).lines;
    expect(lines).toContain(" Directory of C:\\docs");
    expect(lines.some((l) => /<DIR>\s+\.$/.test(l))).toBe(true);
    expect(lines.some((l) => /<DIR>\s+Work Notes$/.test(l))).toBe(true);
    expect(lines.some((l) => /^\d\d-\d\d-\d\d {2}\d\d:\d\d[ap]\s+11 readme\.txt$/.test(l))).toBe(true);
    expect(fromEnd(lines, 2)).toMatch(/^\s+3 File\(s\)\s+15 bytes$/);
    expect(fromEnd(lines, 1)).toMatch(/^\s+3 Dir\(s\)$/);
  });

  it("has no . and .. at the root", () => {
    const lines = run("dir", makeCtx()).lines;
    expect(lines.some((l) => /<DIR>\s+\.\.?$/.test(l))).toBe(false);
    expect(fromEnd(lines, 1)).toMatch(/^\s+1 Dir\(s\)$/);
  });

  it("lists another folder, or files by wildcard", () => {
    const ctx = makeCtx();
    expect(run("dir docs", ctx).lines).toContain(" Directory of C:\\docs");
    const txt = run("dir docs\\*.TXT", ctx).lines;
    expect(txt.filter((l) => l.endsWith(".txt"))).toHaveLength(2);
    expect(txt.some((l) => l.endsWith("photo.png"))).toBe(false);
  });

  it("says when nothing matches, and refuses switches it doesn't have", () => {
    const ctx = makeCtx("/docs");
    expect(fromEnd(run("dir *.doc", ctx).lines, 1)).toBe("File not found");
    expect(run("dir /w", ctx).lines).toEqual(["Invalid switch - /w"]);
  });
});

describe("CD", () => {
  it("shows the current directory without an argument", () => {
    expect(run("cd", makeCtx("/docs")).lines).toEqual(["C:\\docs"]);
  });

  it("changes directory, the DOS ways included", () => {
    expect(run("cd docs", makeCtx()).newCwd).toBe("/docs");
    expect(run("cd..", makeCtx("/docs")).newCwd).toBe("/");
    expect(run("cd\\", makeCtx("/docs/Work Notes")).newCwd).toBe("/");
    expect(run("chdir C:\\DOCS", makeCtx()).newCwd).toBe("/docs");
  });

  it("takes names with spaces, quoted or not", () => {
    expect(run("cd Work Notes", makeCtx("/docs")).newCwd).toBe("/docs/Work Notes");
    expect(run('cd "work notes"', makeCtx("/docs")).newCwd).toBe("/docs/Work Notes");
  });

  it("refuses files and folders that don't exist", () => {
    expect(run("cd nope", makeCtx()).lines).toEqual(["Invalid directory"]);
    expect(run("cd readme.txt", makeCtx("/docs")).lines).toEqual(["Invalid directory"]);
  });
});

describe("TYPE", () => {
  it("shows a file line by line", () => {
    expect(run("type readme.txt", makeCtx("/docs")).lines).toEqual(["hello", "world"]);
  });

  it("refuses folders and missing files", () => {
    const ctx = makeCtx("/docs");
    expect(run("type nope.txt", ctx).lines).toEqual(["File not found - nope.txt"]);
    expect(run('type "Work Notes"', ctx).lines).toEqual(["Access denied"]);
    expect(run("type", ctx).lines).toEqual(["Required parameter missing"]);
  });
});

describe("MD and RD", () => {
  it("makes a directory, even with spaces in its name", () => {
    const ctx = makeCtx("/docs");
    expect(run("md Old Stuff", ctx).lines).toEqual([]);
    expect(ctx.fs.stat("/docs/Old Stuff").kind).toBe("dir");
  });

  it("won't make one that exists (in any case) or whose parent doesn't", () => {
    const ctx = makeCtx("/docs");
    expect(run("mkdir WORK NOTES", ctx).lines).toEqual(["Unable to create directory"]);
    expect(run("md nope\\new", ctx).lines).toEqual(["Unable to create directory"]);
  });

  it("removes only empty directories, and not the current one", () => {
    const ctx = makeCtx("/");
    expect(run("rd docs", ctx).lines).toEqual(["Invalid path, not directory,", "or directory not empty"]);
    expect(run("rd docs\\work notes", ctx).lines).toEqual([]);
    expect(ctx.fs.exists("/docs/Work Notes")).toBe(false);
    expect(run("rd .", makeCtx("/docs")).lines).toEqual(["Attempt to remove current directory"]);
  });
});

describe("DEL", () => {
  it("deletes a file, or files by wildcard", () => {
    const ctx = makeCtx("/docs");
    run("del README.TXT", ctx);
    expect(ctx.fs.exists("/docs/readme.txt")).toBe(false);
    run("erase *.txt", ctx);
    expect(ctx.fs.ls("/docs").map((n) => n.name)).toEqual(["Work Notes", "photo.png"]);
  });

  it("doesn't delete folders, or what isn't there", () => {
    const ctx = makeCtx("/docs");
    expect(run('del "Work Notes"', ctx).lines).toEqual(["Access denied"]);
    expect(run("del *.doc", ctx).lines).toEqual(["File not found"]);
  });
});

describe("REN", () => {
  it("renames, including just changing the case", () => {
    const ctx = makeCtx("/docs");
    run("ren todo.txt shopping.txt", ctx);
    expect(ctx.fs.readFile("/docs/shopping.txt")).toBe("milk");
    run("rename shopping.txt Shopping.txt", ctx);
    expect(ctx.fs.exists("/docs/Shopping.txt")).toBe(true);
  });

  it("won't take another file's name, rename into another folder, or find what isn't there", () => {
    const ctx = makeCtx("/docs");
    expect(run("ren todo.txt README.txt", ctx).lines).toEqual(["Duplicate file name or file not found"]);
    expect(run("ren nope.txt x.txt", ctx).lines).toEqual(["Duplicate file name or file not found"]);
    expect(run("ren todo.txt \\todo.txt", ctx).lines).toEqual(["Invalid parameter"]);
  });
});

describe("COPY and MOVE", () => {
  it("copies a file to a new name, or into a folder", () => {
    const ctx = makeCtx("/docs");
    expect(run("copy todo.txt list.txt", ctx).lines).toEqual(["        1 file(s) copied"]);
    expect(ctx.fs.readFile("/docs/list.txt")).toBe("milk");
    run('copy *.txt "work notes"', ctx);
    expect(ctx.fs.ls("/docs/Work Notes").map((n) => n.name)).toEqual(["readme.txt", "todo.txt", "list.txt"]);
  });

  it("won't copy a file onto itself, or what isn't there", () => {
    const ctx = makeCtx("/docs");
    expect(run("copy todo.txt TODO.TXT", ctx).lines[0]).toBe("File cannot be copied onto itself");
    expect(run("copy nope.txt x.txt", ctx).lines).toEqual(["File not found - nope.txt"]);
    expect(run("copy *.txt one.txt", ctx).lines).toEqual(["Invalid directory"]);
  });

  it("moves files into a folder", () => {
    const ctx = makeCtx("/docs");
    expect(run("move *.txt \\", ctx).lines).toEqual(["        2 file(s) moved"]);
    expect(ctx.fs.ls("/").map((n) => n.name)).toEqual(["docs", "readme.txt", "todo.txt"]);
    expect(ctx.fs.exists("/docs/todo.txt")).toBe(false);
  });
});

describe("START", () => {
  it("opens a file in its program", () => {
    const opened: string[] = [];
    const ctx = makeCtx("/docs", (path) => { opened.push(path); return true; });
    expect(run("start README.TXT", ctx).lines).toEqual([]);
    expect(opened).toEqual(["/docs/readme.txt"]);
  });

  it("says when nothing can open it, or it isn't there", () => {
    const ctx = makeCtx("/docs", () => false);
    expect(run("start photo.png", ctx).lines).toEqual(["No program is associated with 'photo.png'."]);
    expect(run("start nope.txt", ctx).lines[0]).toMatch(/^Cannot find the file 'nope.txt'/);
  });
});

describe("read-only paths", () => {
  it("can be listed and read, but not changed", () => {
    const ctx = { ...makeCtx("/docs"), readOnly: (p: string) => p.startsWith("/docs/Work Notes") || p === "/docs/Empty" };
    ctx.fs.writeFile("/docs/Work Notes/plan.txt", "x");
    ctx.fs.mkdir("/docs/Empty");
    expect(run('dir "Work Notes"', ctx).lines.some((l) => l.endsWith("plan.txt"))).toBe(true);
    expect(run('type "Work Notes\\plan.txt"', ctx).lines).toEqual(["x"]);
    for (const cmd of ['md "Work Notes\\new"', "rd Empty", 'del "Work Notes\\plan.txt"', 'ren "Work Notes" Old', 'copy todo.txt "Work Notes"', 'move "Work Notes\\plan.txt" .']) {
      expect(run(cmd, ctx).lines, cmd).toEqual(["Access denied"]);
    }
    expect(ctx.fs.ls("/docs/Work Notes").map((n) => n.name)).toEqual(["plan.txt"]);
  });
});

describe("other commands", () => {
  it("ECHO shows a message, its state, or an empty line", () => {
    const ctx = makeCtx();
    expect(run("echo Hello there", ctx).lines).toEqual(["Hello there"]);
    expect(run("echo", ctx).lines).toEqual(["ECHO is on"]);
    expect(run("echo.", ctx).lines).toEqual([""]);
  });

  it("CLS clears, EXIT closes", () => {
    const ctx = makeCtx();
    expect(run("cls", ctx).clear).toBe(true);
    expect(run("exit", ctx).exit).toBe(true);
  });

  it("VER, DATE, TIME and HELP answer", () => {
    const ctx = makeCtx();
    expect(run("ver", ctx).lines).toContain("DreamDesk DOS [Version 1.0]");
    expect(run("date", ctx).lines[0]).toMatch(/^Current date is \w{3} \d\d-\d\d-\d{4}$/);
    expect(run("time", ctx).lines[0]).toMatch(/^Current time is \d{1,2}:\d\d:\d\d\.\d\d[ap]$/);
    expect(run("help", ctx).lines.some((l) => l.startsWith("DIR"))).toBe(true);
  });
});
