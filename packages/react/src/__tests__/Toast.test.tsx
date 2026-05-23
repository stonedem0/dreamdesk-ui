import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Toast } from "../components/Toast";
import { DesktopIcon } from "../components/DesktopIcon";

describe("Toast", () => {
  it("renders message", () => {
    render(<Toast message="Hello world" />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders a close button", () => {
    render(<Toast message="Hello" />);
    expect(screen.getByLabelText("close")).toBeInTheDocument();
  });

  it("hides content after close button click", () => {
    render(<Toast message="Bye" />);
    fireEvent.click(screen.getByLabelText("close"));
    expect(screen.queryByText("Bye")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(<Toast message="Hello" onClose={onClose} />);
    fireEvent.click(screen.getByLabelText("close"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("applies type class", () => {
    const { container } = render(<Toast type="warning" message="Warn" />);
    expect(container.querySelector(".toast-warning")).toBeInTheDocument();
  });

  it("defaults to notification type class", () => {
    const { container } = render(<Toast message="Info" />);
    expect(container.querySelector(".toast-notification")).toBeInTheDocument();
  });
});

describe("DesktopIcon", () => {
  it("renders label", () => {
    render(<DesktopIcon label="Notepad" />);
    expect(screen.getByText("Notepad")).toBeInTheDocument();
  });

  it("has title attribute matching label", () => {
    render(<DesktopIcon label="Paint" />);
    expect(screen.getByTitle("Paint")).toBeInTheDocument();
  });

  it("fires onClick when clicked", () => {
    const onClick = vi.fn();
    render(<DesktopIcon label="Notepad" onClick={onClick} />);
    fireEvent.click(screen.getByTitle("Notepad"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
