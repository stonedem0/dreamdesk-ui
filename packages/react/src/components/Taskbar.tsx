import { useEffect, useState, type ReactNode } from "react";
import { type WindowEntry } from "@dreamdesk/core";
import { useWindowManager } from "./Desktop";
import { Icon } from "./Icon";
import "./Taskbar.css";

const EXIT_MS = 200;

type DisplayEntry = WindowEntry & { leaving?: boolean };

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
  startMenu?: ReactNode;
}

export function Taskbar({ clock = true, className, startMenu }: TaskbarProps) {
  const wm = useWindowManager();
  const [displayed, setDisplayed] = useState<DisplayEntry[]>(() => wm.getWindows());

  useEffect(() => {
    setDisplayed(wm.getWindows());
    return wm.subscribe(() => {
      const current = wm.getWindows();
      const currentIds = new Set(current.map((w) => w.id));
      setDisplayed((prev) => {
        const hasRemovals = prev.some((w) => !w.leaving && !currentIds.has(w.id));
        if (!hasRemovals) return current;
        return prev.map((w) => (currentIds.has(w.id) ? w : { ...w, leaving: true }));
      });
    });
  }, [wm]);

  useEffect(() => {
    const leaving = displayed.filter((w) => w.leaving);
    if (leaving.length === 0) return;
    const id = setTimeout(() => setDisplayed(wm.getWindows()), EXIT_MS);
    return () => clearTimeout(id);
  }, [displayed, wm]);

  return (
    <div className={["dd-taskbar", className].filter(Boolean).join(" ")}>
      {startMenu}
      <div className="dd-taskbar-windows">
        {displayed.map((w) => (
          <button
            key={w.id}
            className={[
              "dd-taskbar-btn",
              w.leaving ? "dd-taskbar-btn--leaving" : w.isMinimized ? "dd-taskbar-btn--minimized" : "dd-taskbar-btn--active",
            ].join(" ")}
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
