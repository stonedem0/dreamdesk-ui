import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Slider } from "../components/Slider";

describe("Slider", () => {
  it("renders a range input", () => {
    render(<Slider />);
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<Slider label="Volume" />);
    expect(screen.getByText("Volume")).toBeInTheDocument();
  });

  it("associates label with input via htmlFor", () => {
    render(<Slider label="Volume" />);
    const input = screen.getByRole("slider");
    const label = screen.getByText("Volume");
    expect(label).toHaveAttribute("for", input.id);
  });

  it("applies min, max, step attributes", () => {
    render(<Slider min={10} max={50} step={5} />);
    const input = screen.getByRole("slider");
    expect(input).toHaveAttribute("min", "10");
    expect(input).toHaveAttribute("max", "50");
    expect(input).toHaveAttribute("step", "5");
  });

  it("fires onChange with numeric value", () => {
    const onChange = vi.fn();
    render(<Slider onChange={onChange} />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "42" } });
    expect(onChange).toHaveBeenCalledWith(42);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Slider disabled />);
    expect(screen.getByRole("slider")).toBeDisabled();
  });

  it("shows current value when showValue is true", () => {
    render(<Slider value={30} showValue onChange={() => {}} />);
    expect(screen.getByText("30")).toBeInTheDocument();
  });

  it("applies disabled container class when disabled", () => {
    const { container } = render(<Slider disabled />);
    expect(container.querySelector(".dd-slider-container--disabled")).toBeInTheDocument();
  });
});
