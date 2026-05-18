import { type ReactNode, type CSSProperties } from "react";
import { Icon } from "./Icon";
import "./Toolbar.css";

export interface ToolbarButtonProps {
  icon?: string;
  label?: string;
  disabled?: boolean;
  active?: boolean;
  onClick?: () => void;
}

export function ToolbarButton({ icon, label, disabled, active, onClick }: ToolbarButtonProps) {
  const isImage = icon && (icon.startsWith("/") || icon.startsWith("http") || icon.startsWith("<svg"));
  return (
    <button
      className={[
        "dd-toolbar-btn",
        disabled && "dd-toolbar-btn--disabled",
        active && "dd-toolbar-btn--active",
      ].filter(Boolean).join(" ")}
      onClick={disabled ? undefined : onClick}
      tabIndex={disabled ? -1 : undefined}
      aria-disabled={disabled}
      aria-pressed={active}
    >
      {icon && (
        <span className="dd-toolbar-btn-icon">
          {isImage ? <Icon src={icon} size={20} /> : icon}
        </span>
      )}
      {label && <span className="dd-toolbar-btn-label">{label}</span>}
    </button>
  );
}

export function ToolbarSeparator() {
  return <div className="dd-toolbar-sep" />;
}

export interface ToolbarProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Toolbar({ children, className, style }: ToolbarProps) {
  return (
    <div
      className={["dd-toolbar", className].filter(Boolean).join(" ")}
      style={style}
      role="toolbar"
    >
      {children}
    </div>
  );
}
