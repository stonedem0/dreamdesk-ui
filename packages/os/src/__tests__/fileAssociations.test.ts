import { describe, expect, it } from "vitest";
import { appsForFile, fileExtension } from "../process/fileAssociations";

describe("fileExtension", () => {
  it("is the lowercased part after the last dot of the name", () => {
    expect(fileExtension("/docs/readme.TXT")).toBe("txt");
    expect(fileExtension("archive.tar.gz")).toBe("gz");
  });

  it("is empty for names without one, dotfiles and dots in folder names", () => {
    expect(fileExtension("/docs/todo")).toBe("");
    expect(fileExtension(".profile")).toBe("");
    expect(fileExtension("/my.folder/todo")).toBe("");
  });
});

describe("appsForFile", () => {
  const apps = {
    notepad: { extensions: ["txt", "md"] },
    browser: { extensions: ["url", "html"] },
    editor: { extensions: ["MD"] },
    player: {},
  };

  it("lists the apps for the file's extension, default first", () => {
    expect(appsForFile(apps, "/a/notes.md")).toEqual(["notepad", "editor"]);
    expect(appsForFile(apps, "/a/site.URL")).toEqual(["browser"]);
  });

  it("is empty when nothing opens it", () => {
    expect(appsForFile(apps, "/a/song.mp3")).toEqual([]);
    expect(appsForFile(apps, "/a/todo")).toEqual([]);
  });
});
