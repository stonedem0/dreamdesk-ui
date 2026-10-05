import { type CSSProperties, type ReactNode } from "react";
import "./Tag.css";

export interface TagProps {
  children: ReactNode;
  /** The theme's iridescent surface (a thin-film shimmer in Pastelcore). */
  iridescent?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** A small label, e.g. for a list of technologies or categories. */
export function Tag({ children, iridescent = false, className, style }: TagProps) {
  return (
    <span className={["dd-tag", iridescent && "dd-tag--iridescent", className].filter(Boolean).join(" ")} style={style}>
      {children}
    </span>
  );
}
