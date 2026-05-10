import { describe, it, expect } from "vitest";
import { sanitizeSvg, resolveIconHtml } from "../utils/svg";

describe("sanitizeSvg", () => {
  it("passes clean SVG through", () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><circle cx="8" cy="8" r="4"/></svg>`;
    const result = sanitizeSvg(svg);
    expect(result).toContain("<circle");
    expect(result).toContain("viewBox");
  });

  it("strips <script> tags", () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script><circle cx="8" cy="8" r="4"/></svg>`;
    expect(sanitizeSvg(svg)).not.toContain("script");
    expect(sanitizeSvg(svg)).not.toContain("alert");
  });

  it("strips on* event attributes", () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><circle onclick="evil()"/></svg>`;
    const result = sanitizeSvg(svg);
    expect(result).not.toContain("onload");
    expect(result).not.toContain("onclick");
    expect(result).not.toContain("evil");
  });

  it("strips javascript: attribute values", () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg"><a href="javascript:alert(1)">x</a></svg>`;
    const result = sanitizeSvg(svg);
    expect(result).not.toContain("javascript:");
  });

  it("returns empty string for invalid SVG", () => {
    expect(sanitizeSvg("not svg at all")).toBe("");
    expect(sanitizeSvg("<broken<>")).toBe("");
  });

  it("returns empty string for empty input", () => {
    expect(sanitizeSvg("")).toBe("");
  });
});

describe("resolveIconHtml", () => {
  it("returns null for undefined", () => {
    expect(resolveIconHtml(undefined)).toBeNull();
  });

  it("returns null for non-SVG strings", () => {
    expect(resolveIconHtml("https://example.com/icon.png")).toBeNull();
    expect(resolveIconHtml("icon.svg")).toBeNull();
  });

  it("returns sanitized SVG string for SVG input", () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="4"/></svg>`;
    const result = resolveIconHtml(svg);
    expect(result).not.toBeNull();
    expect(result).toContain("<circle");
  });

  it("returns null for SVG that fails sanitization", () => {
    expect(resolveIconHtml("<svg><broken")).toBeNull();
  });
});
