import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { StartMenu } from "../components/StartMenu";

const ITEMS = [
  { id: "notepad", label: "Notepad" },
  { id: "sep", label: "", divider: true },
  { id: "paint", label: "Paint" },
];

function setup(onSelect = vi.fn()) {
  render(<StartMenu items={ITEMS} onSelect={onSelect} />);
  return { onSelect };
}

describe("StartMenu", () => {
  it("renders the start button", () => {
    setup();
    expect(screen.getByRole("button", { name: /start/i })).toBeInTheDocument();
  });

  it("panel is not visible initially", () => {
    setup();
    expect(screen.queryByText("Notepad")).not.toBeInTheDocument();
  });

  it("opens panel when button is clicked", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /start/i }));
    expect(screen.getByText("Notepad")).toBeInTheDocument();
  });

  it("closes panel when button is clicked again", () => {
    setup();
    const btn = screen.getByRole("button", { name: /start/i });
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(screen.queryByText("Notepad")).not.toBeInTheDocument();
  });

  it("calls onSelect and closes panel when item is clicked", () => {
    const { onSelect } = setup();
    fireEvent.click(screen.getByRole("button", { name: /start/i }));
    fireEvent.click(screen.getByText("Notepad"));
    expect(onSelect).toHaveBeenCalledWith("notepad");
    expect(screen.queryByText("Notepad")).not.toBeInTheDocument();
  });

  it("closes panel on Escape key", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /start/i }));
    expect(screen.getByText("Notepad")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByText("Notepad")).not.toBeInTheDocument();
  });

  it("closes panel on outside pointerdown", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /start/i }));
    expect(screen.getByText("Notepad")).toBeInTheDocument();
    fireEvent.pointerDown(document.body);
    expect(screen.queryByText("Notepad")).not.toBeInTheDocument();
  });

  it("renders divider separator", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /start/i }));
    expect(document.querySelector(".dd-startmenu-divider")).toBeInTheDocument();
  });

  it("renders brand label in panel", () => {
    render(<StartMenu items={ITEMS} onSelect={vi.fn()} label="MyOS" />);
    fireEvent.click(screen.getByRole("button", { name: /start/i }));
    expect(screen.getByText("MyOS")).toBeInTheDocument();
  });

  it("button aria-expanded is false when closed", () => {
    setup();
    expect(screen.getByRole("button", { name: /start/i })).toHaveAttribute("aria-expanded", "false");
  });

  it("button aria-expanded is true when open", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /start/i }));
    expect(screen.getByRole("button", { name: /start/i })).toHaveAttribute("aria-expanded", "true");
  });
});
