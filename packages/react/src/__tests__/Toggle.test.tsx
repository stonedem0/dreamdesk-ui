import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "../context/ThemeContext";
import { Toggle } from "../components/Toggle";

function wrap(ui: React.ReactNode) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("Toggle", () => {
  it("renders a checkbox input", () => {
    wrap(<Toggle />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("renders checked state when controlled", () => {
    wrap(<Toggle checked onChange={() => {}} />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("renders unchecked state when controlled", () => {
    wrap(<Toggle checked={false} onChange={() => {}} />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("fires onChange with true when toggled on", () => {
    const onChange = vi.fn();
    wrap(<Toggle defaultChecked={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("fires onChange with false when toggled off", () => {
    const onChange = vi.fn();
    wrap(<Toggle defaultChecked={true} onChange={onChange} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(false);
  });
});
