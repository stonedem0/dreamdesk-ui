import type { Story } from "@ladle/react";
import { Desktop } from "../components/Desktop";
import { Window } from "../components/Window";
import { Taskbar } from "../components/Taskbar";
import { appIcon } from "./icons";

const desktop = { width: "100%", height: "520px" };

/** A window on a desktop: drag it, resize it, minimize it into the taskbar, go fullscreen. */
export const Basic: Story<{ title: string; width: string; height: string; resizable: boolean; movable: boolean }> = (args) => (
  <Desktop style={desktop}>
    <Window {...args} icon={appIcon} defaultOpen style={{ position: "absolute", left: 40, top: 30 }}>
      <p style={{ padding: 8, margin: 0 }}>Window content. Drag the title bar, or the corner to resize.</p>
    </Window>
    <Taskbar clock={false} />
  </Desktop>
);
Basic.args = { title: "Untitled", width: "360px", height: "240px", resizable: true, movable: true };

/** Long content scrolls inside the window with the theme's scrollbars. */
export const Scrolling: Story = () => (
  <Desktop style={desktop}>
    <Window title="Long text" icon={appIcon} width="320px" height="260px" scrollContent defaultOpen style={{ position: "absolute", left: 40, top: 30 }}>
      <div style={{ padding: 8 }}>
        {Array.from({ length: 40 }, (_, i) => <p key={i} style={{ margin: "0 0 8px" }}>Line {i + 1} of some long content.</p>)}
      </div>
    </Window>
    <Taskbar clock={false} />
  </Desktop>
);

/** Several windows: click to bring one forward, watch the taskbar follow. */
export const Stacking: Story = () => (
  <Desktop style={desktop}>
    {["First", "Second", "Third"].map((title, i) => (
      <Window key={title} title={title} icon={appIcon} width="280px" height="180px" defaultOpen style={{ position: "absolute", left: 40 + i * 60, top: 30 + i * 50 }}>
        <p style={{ padding: 8, margin: 0 }}>{title} window</p>
      </Window>
    ))}
    <Taskbar clock={false} />
  </Desktop>
);
