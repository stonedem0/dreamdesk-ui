import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tag } from "../components/Tag";
import { Button } from "../components/Button";

describe("Tag", () => {
  it("renders a plain tag by default", () => {
    render(<Tag>React</Tag>);
    const tag = screen.getByText("React");
    expect(tag).toHaveClass("dd-tag");
    expect(tag).not.toHaveClass("dd-tag--iridescent");
  });

  it("adds the iridescent surface on request, keeping custom classes", () => {
    render(<Tag iridescent className="mine">Go</Tag>);
    expect(screen.getByText("Go")).toHaveClass("dd-tag", "dd-tag--iridescent", "mine");
  });
});

describe("Button — iridescent", () => {
  it("uses the iridescent variant class", () => {
    render(<Button variant="iridescent">Open</Button>);
    expect(screen.getByText("Open")).toHaveClass("btn", "btn--iridescent");
  });
});
