import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ProgressBar } from "../components/ProgressBar";

describe("ProgressBar", () => {
  it("renders a progress track", () => {
    const { container } = render(<ProgressBar />);
    expect(container.querySelector(".progress-track")).toBeInTheDocument();
  });

  it("renders the fill bar in default mode", () => {
    const { container } = render(<ProgressBar />);
    expect(container.querySelector(".progress-bar")).toBeInTheDocument();
  });

  it("applies blocky class when blocky is true", () => {
    const { container } = render(<ProgressBar blocky />);
    expect(container.querySelector(".progress-track--blocky")).toBeInTheDocument();
  });

  it("does not render fill bar in blocky mode", () => {
    const { container } = render(<ProgressBar blocky />);
    expect(container.querySelector(".progress-bar")).not.toBeInTheDocument();
  });

  it("applies gradient class to fill bar when gradient is true", () => {
    const { container } = render(<ProgressBar gradient />);
    expect(container.querySelector(".progress-bar--gradient")).toBeInTheDocument();
  });

  it("does not throw when value changes", () => {
    const { rerender } = render(<ProgressBar value={0} />);
    expect(() => rerender(<ProgressBar value={75} />)).not.toThrow();
  });
});
