import { useEffect, useState, useRef } from "react";
import { type WindowEntry } from "@dreamdesk/core";
import { useWindowManager } from "./Desktop";
import { Icon } from "./Icon";
import "./Taskbar.css";

function Clock() {
  const [time, setTime] = useState(() => formatTime(new Date()));
  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);
  return <div className="dd-taskbar-clock">{time}</div>;
}

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export interface TaskbarProps {
  clock?: boolean;
  className?: string;
}

export function Taskbar({ clock = true, className }: TaskbarProps) {
  const wm = useWindowManager();
  const [windows, setWindows] = useState<WindowEntry[]>(() => wm.getWindows());

  useEffect(() => {
    setWindows(wm.getWindows());
    return wm.subscribe(() => setWindows([...wm.getWindows()]));
  }, [wm]);

  return (
    <div className={["dd-taskbar", className].filter(Boolean).join(" ")}>
      <div className="dd-taskbar-windows">
        {windows.map((w) => (
          <button
            key={w.id}
            className={["dd-taskbar-btn", w.isMinimized ? "dd-taskbar-btn--minimized" : "dd-taskbar-btn--active"].join(" ")}
            onClick={() => w.toggle()}
            title={w.title}
          >
            {w.icon && <Icon src={w.icon} size={16} />}
            <span className="dd-taskbar-btn-label">{w.title}</span>
          </button>
        ))}
      </div>
      {clock && <Clock />}
    </div>
  );
}
