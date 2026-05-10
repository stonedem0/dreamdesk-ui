import { type CSSProperties } from "react";
import { Icon } from "./Icon";

export interface DesktopIconProps {
  label: string;
  icon?: string;
  iconSize?: number;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

export function DesktopIcon({ label, icon, iconSize = 48, onClick, className, style }: DesktopIconProps) {
  return (
    <button
      className={["dd-desktop-icon", className].filter(Boolean).join(" ")}
      onClick={onClick}
      style={style}
      title={label}
    >
      <Icon src={icon} size={iconSize} />
      <span className="dd-desktop-icon-label">{label}</span>
    </button>
  );
}
