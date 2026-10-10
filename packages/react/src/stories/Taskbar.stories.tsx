import type { Story } from "@ladle/react";
import { Desktop } from "../components/Desktop";
import { Window } from "../components/Window";
import { Taskbar } from "../components/Taskbar";
import { StartMenu, type StartMenuItemDef } from "../components/StartMenu";
import { appIcon, folderIcon, fileIcon } from "./icons";

const ITEMS: StartMenuItemDef[] = [
  { id: "explorer", label: "Explorer", icon: folderIcon },
  { id: "notepad", label: "Notepad", icon: fileIcon },
  { id: "d1", label: "", divider: true },
  { id: "reset", label: "Reset layout" },
];

/** The taskbar with Start, a clock, and a button per window. Minimize a window to see it go into its button. */
export const WithStartMenu: Story<{ clock: boolean; buttonLabel: string; buttonIconSize: number }> = ({ clock, buttonLabel, buttonIconSize }) => (
  <Desktop style={{ width: "100%", height: "420px" }}>
    <Window title="Explorer" icon={folderIcon} width="300px" height="180px" defaultOpen style={{ position: "absolute", left: 30, top: 30 }}>
      <p style={{ padding: 8, margin: 0 }}>Minimize me</p>
    </Window>
    <Window title="Notepad" icon={fileIcon} width="260px" height="160px" defaultOpen style={{ position: "absolute", left: 300, top: 90 }}>
      <p style={{ padding: 8, margin: 0 }}>And me</p>
    </Window>
    <Taskbar
      clock={clock}
      startMenu={<StartMenu items={ITEMS} onSelect={() => {}} buttonLabel={buttonLabel} buttonIcon={appIcon} buttonIconSize={buttonIconSize} />}
    />
  </Desktop>
);
WithStartMenu.args = { clock: true, buttonLabel: "Start", buttonIconSize: 16 };
