import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react";
import { DialogProvider, useDialog } from "../components/Dialog";

function AlertButton({ onDone }: { onDone?: () => void } = {}) {
  const dialog = useDialog();
  return <button onClick={() => dialog.alert("Something happened").then(onDone)}>alert</button>;
}

function ConfirmButton({ onResult }: { onResult: (v: boolean) => void }) {
  const dialog = useDialog();
  return <button onClick={() => dialog.confirm("Are you sure?").then(onResult)}>confirm</button>;
}

function PromptButton({ onResult }: { onResult: (v: string | null) => void }) {
  const dialog = useDialog();
  return <button onClick={() => dialog.prompt("Enter name:", { defaultValue: "world" }).then(onResult)}>prompt</button>;
}

function wrap(ui: React.ReactNode) {
  return render(<DialogProvider>{ui}</DialogProvider>);
}

describe("DialogProvider — alert", () => {
  it("renders the alert message", async () => {
    wrap(<AlertButton />);
    await act(async () => { fireEvent.click(screen.getByText("alert")); });
    expect(screen.getByText("Something happened")).toBeInTheDocument();
  });

  it("resolves when OK is clicked", async () => {
    let resolved = false;
    wrap(<AlertButton onDone={() => { resolved = true; }} />);
    await act(async () => { fireEvent.click(screen.getByText("alert")); });
    await act(async () => { fireEvent.click(screen.getByText("OK")); });
    expect(resolved).toBe(true);
  });
});

describe("DialogProvider — confirm", () => {
  it("shows the message", async () => {
    wrap(<ConfirmButton onResult={() => {}} />);
    await act(async () => { fireEvent.click(screen.getByText("confirm")); });
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("resolves true when OK is clicked", async () => {
    let result: boolean | null = null;
    wrap(<ConfirmButton onResult={(v) => { result = v; }} />);
    await act(async () => { fireEvent.click(screen.getByText("confirm")); });
    await act(async () => { fireEvent.click(screen.getByText("OK")); });
    expect(result).toBe(true);
  });

  it("resolves false when Cancel is clicked", async () => {
    let result: boolean | null = null;
    wrap(<ConfirmButton onResult={(v) => { result = v; }} />);
    await act(async () => { fireEvent.click(screen.getByText("confirm")); });
    await act(async () => { fireEvent.click(screen.getByText("Cancel")); });
    expect(result).toBe(false);
  });
});

describe("DialogProvider — prompt", () => {
  it("pre-fills defaultValue", async () => {
    wrap(<PromptButton onResult={() => {}} />);
    await act(async () => { fireEvent.click(screen.getByText("prompt")); });
    expect(screen.getByRole("textbox")).toHaveValue("world");
  });

  it("resolves with input value when OK is clicked", async () => {
    let result: string | null = null;
    wrap(<PromptButton onResult={(v) => { result = v; }} />);
    await act(async () => { fireEvent.click(screen.getByText("prompt")); });
    await act(async () => { fireEvent.change(screen.getByRole("textbox"), { target: { value: "Claude" } }); });
    await act(async () => { fireEvent.click(screen.getByText("OK")); });
    expect(result).toBe("Claude");
  });

  it("resolves null when Cancel is clicked", async () => {
    let result: string | null = "initial";
    wrap(<PromptButton onResult={(v) => { result = v; }} />);
    await act(async () => { fireEvent.click(screen.getByText("prompt")); });
    await act(async () => { fireEvent.click(screen.getByText("Cancel")); });
    expect(result).toBeNull();
  });

  it("resolves with input value on Enter key", async () => {
    let result: string | null = null;
    wrap(<PromptButton onResult={(v) => { result = v; }} />);
    await act(async () => { fireEvent.click(screen.getByText("prompt")); });
    await act(async () => { fireEvent.change(screen.getByRole("textbox"), { target: { value: "Enter me" } }); });
    await act(async () => { fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" }); });
    expect(result).toBe("Enter me");
  });
});
