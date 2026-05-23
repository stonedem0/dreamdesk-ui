import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Tabs, Tab, TabPanel } from "../components/Tabs";

function setup(defaultIndex = 0) {
  render(
    <Tabs defaultIndex={defaultIndex}>
      <Tab>First</Tab>
      <Tab>Second</Tab>
      <Tab>Third</Tab>
      <TabPanel>Panel One</TabPanel>
      <TabPanel>Panel Two</TabPanel>
      <TabPanel>Panel Three</TabPanel>
    </Tabs>
  );
}

const cls = (text: string) => screen.getByText(text).getAttribute("class") ?? "";

describe("Tabs", () => {
  it("renders all tab labels", () => {
    setup();
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
    expect(screen.getByText("Third")).toBeInTheDocument();
  });

  it("active tab has 'active' class on mount", () => {
    setup(0);
    expect(cls("First")).toContain("active");
  });

  it("inactive tabs do not have 'active' class on mount", () => {
    setup(0);
    expect(cls("Second")).not.toContain("active");
    expect(cls("Third")).not.toContain("active");
  });

  it("active panel has 'active' class on mount", () => {
    setup(0);
    expect(cls("Panel One")).toContain("active");
  });

  it("inactive panels do not have 'active' class on mount", () => {
    setup(0);
    expect(cls("Panel Two")).not.toContain("active");
    expect(cls("Panel Three")).not.toContain("active");
  });

  it("shows the correct panel for non-zero defaultIndex", () => {
    setup(1);
    expect(cls("Panel Two")).toContain("active");
    expect(cls("Panel One")).not.toContain("active");
  });

  it("switches active panel when a tab is clicked", () => {
    setup(0);
    fireEvent.click(screen.getByText("Second"));
    expect(cls("Panel Two")).toContain("active");
    expect(cls("Panel One")).not.toContain("active");
  });

  it("updates active tab class after clicking", () => {
    setup(0);
    fireEvent.click(screen.getByText("Third"));
    expect(cls("Third")).toContain("active");
    expect(cls("First")).not.toContain("active");
  });
});
