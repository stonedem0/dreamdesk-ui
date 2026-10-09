import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ListView } from "../components/ListView";

// Headings without the sort arrow
const headings = () => screen.getAllByRole("columnheader").map((h) => h.textContent!.replace(/ [▲▼]$/, ""));

const ITEMS = [
  { id: "b", name: "b.txt", type: "C:\\docs", date: "2026-10-02" },
  { id: "a", name: "a.txt", type: "C:\\", date: "2026-10-01" },
];

describe("ListView", () => {
  it("has Windows' column headings by default", () => {
    render(<ListView items={ITEMS} />);
    expect(headings()).toEqual(["Name", "Size", "Type", "Date Modified"]);
  });

  it("takes other headings, and still sorts by those columns", () => {
    render(<ListView items={ITEMS} columnLabels={{ type: "Original Location", date: "Date Deleted" }} />);
    expect(headings()).toEqual(["Name", "Size", "Original Location", "Date Deleted"]);
    fireEvent.click(screen.getByText("Date Deleted"));
    expect(screen.getAllByRole("row").slice(1).map((r) => r.textContent)).toEqual([expect.stringContaining("a.txt"), expect.stringContaining("b.txt")]);
  });
});
