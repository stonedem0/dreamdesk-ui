import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "../components/Input";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<Input label="Name" />);
    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  it("associates label with input via htmlFor", () => {
    render(<Input label="Name" />);
    const input = screen.getByRole("textbox");
    const label = screen.getByText("Name");
    expect(label).toHaveAttribute("for", input.id);
  });

  it("renders with defaultValue", () => {
    render(<Input defaultValue="hello" />);
    expect(screen.getByRole("textbox")).toHaveValue("hello");
  });

  it("renders controlled value", () => {
    render(<Input value="controlled" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toHaveValue("controlled");
  });

  it("fires onChange with value string", () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "hello" } });
    expect(onChange).toHaveBeenCalledWith("hello", expect.any(Object));
  });

  it("renders placeholder", () => {
    render(<Input placeholder="Enter text…" />);
    expect(screen.getByPlaceholderText("Enter text…")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Input disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});
