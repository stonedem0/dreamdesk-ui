import { type ReactNode, type CSSProperties } from "react";
import { Window, type WindowProps } from "./Window";

export interface TerminalWindowProps extends Omit<WindowProps, "children"> {
  children?: ReactNode;
  style?: CSSProperties;
}

export function TerminalWindow({ children, className, ...props }: TerminalWindowProps) {
  return (
    <Window
      {...props}
      className={["terminal-window", className].filter(Boolean).join(" ")}
    >
      <div className="terminal-win-body">{children}</div>
    </Window>
  );
}
