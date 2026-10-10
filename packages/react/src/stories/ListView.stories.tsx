import { useState } from "react";
import type { Story } from "@ladle/react";
import { ListView, type ListViewItem, type ListViewMode } from "../components/ListView";
import { fileIcon, folderIcon } from "./icons";

const ITEMS: ListViewItem[] = [
  { id: "1", name: "Notes", icon: folderIcon, type: "Folder", date: "2026-10-01" },
  { id: "2", name: "Projects", icon: folderIcon, type: "Folder", date: "2026-09-12" },
  { id: "3", name: "readme.txt", icon: fileIcon, size: "1 KB", type: "Text Document", date: "2026-05-23" },
  { id: "4", name: "todo.txt", icon: fileIcon, size: "2 KB", type: "Text Document", date: "2026-10-09" },
];

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: 520, height: 240, border: "1px solid #333", background: "var(--color-input-background, #fff)" }}>{children}</div>
);

/** Click to select (Ctrl/⌘ for several), click a heading to sort. */
export const Details: Story<{ mode: ListViewMode }> = ({ mode }) => {
  const [selected, setSelected] = useState<string[]>([]);
  return <Frame><ListView items={ITEMS} mode={mode} selected={selected} onSelect={setSelected} multiSelect /></Frame>;
};
Details.argTypes = { mode: { options: ["details", "icons"], control: { type: "radio" }, defaultValue: "details" } };

/** Other column headings, e.g. a recycle bin's. */
export const CustomColumns: Story = () => (
  <Frame>
    <ListView
      items={ITEMS.map((i) => ({ ...i, type: "C:\\documents", date: `${i.date} 18:41` }))}
      columnLabels={{ type: "Original Location", date: "Date Deleted" }}
    />
  </Frame>
);
