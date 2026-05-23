import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Desktop } from "../components/Desktop";
import { TerminalWindow } from "../components/TerminalWindow";

function setup(props: Partial<React.ComponentProps<typeof TerminalWindow>> = {}) {
  return render(
    <Desktop style={{ width: "800px", height: "600px" }}>
      <TerminalWindow title="Terminal" width="500px" height="300px" defaultOpen {...props} />
    </Desktop>
  );
}

describe("TerminalWindow", () => {
  it("renders title", () => {
    setup();
    expect(screen.getByText("Terminal")).toBeInTheDocument();
  });

  it("renders children inside terminal body", () => {
    setup({ children: <span>$ echo hello</span> });
    expect(screen.getByText("$ echo hello")).toBeInTheDocument();
  });

  it("applies terminal-window class to the window element", () => {
    setup();
    expect(document.querySelector(".terminal-window")).toBeInTheDocument();
  });

  it("wraps children in terminal-win-body", () => {
    setup({ children: <span>output</span> });
    const body = document.querySelector(".terminal-win-body");
    expect(body).toBeInTheDocument();
    expect(body).toHaveTextContent("output");
  });
});
