import { type ReactNode, type CSSProperties } from "react";
import "./StatusBar.css";

export interface StatusBarSectionProps {
  children?: ReactNode;
  flex?: boolean;
  className?: string;
}

export function StatusBarSection({ children, flex, className }: StatusBarSectionProps) {
  return (
    <div
      className={[
        "dd-statusbar-section",
        flex && "dd-statusbar-section--flex",
        className,
      ].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
}

export interface StatusBarProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function StatusBar({ children, className, style }: StatusBarProps) {
  return (
    <div
      className={["dd-statusbar", className].filter(Boolean).join(" ")}
      style={style}
      role="status"
    >
      {children}
    </div>
  );
}
