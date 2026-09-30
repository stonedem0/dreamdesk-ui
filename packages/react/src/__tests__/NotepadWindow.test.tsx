import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { NotepadWindow } from "../components/NotepadWindow";

describe("NotepadWindow — save", () => {
  it("has no Save item without onSave", () => {
    render(<NotepadWindow title="Notepad" defaultOpen defaultValue="hi" />);
    fireEvent.click(screen.getByText("File"));
    expect(screen.queryByText("Save")).not.toBeInTheDocument();
  });

  it("File > Save calls onSave with the current text", () => {
    const onSave = vi.fn();
    render(<NotepadWindow title="Notepad" defaultOpen defaultValue="hi" onSave={onSave} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "hello" } });
    fireEvent.click(screen.getByText("File"));
    fireEvent.click(screen.getByText("Save"));
    expect(onSave).toHaveBeenCalledWith("hello");
  });

  it("Ctrl+S and Cmd+S call onSave", () => {
    const onSave = vi.fn();
    render(<NotepadWindow title="Notepad" defaultOpen defaultValue="hi" onSave={onSave} />);
    const box = screen.getByRole("textbox");
    fireEvent.keyDown(box, { key: "s", ctrlKey: true });
    fireEvent.keyDown(box, { key: "s", metaKey: true });
    fireEvent.keyDown(box, { key: "s" });
    expect(onSave).toHaveBeenCalledTimes(2);
    expect(onSave).toHaveBeenCalledWith("hi");
  });
});

describe("NotepadWindow — exit", () => {
  it("File > Exit asks onBeforeClose first", async () => {
    const onClose = vi.fn();
    let allow = false;
    render(<NotepadWindow title="Notepad" defaultOpen onBeforeClose={async () => allow} onClose={onClose} />);
    fireEvent.click(screen.getByText("File"));
    await act(async () => { fireEvent.click(screen.getByText("Exit")); });
    expect(onClose).not.toHaveBeenCalled();

    allow = true;
    fireEvent.click(screen.getByText("File"));
    await act(async () => { fireEvent.click(screen.getByText("Exit")); });
    expect(onClose).toHaveBeenCalledOnce();
  });
});
