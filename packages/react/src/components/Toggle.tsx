import type { CSSProperties } from "react";
import { useTheme } from "../context/ThemeContext";

export interface ToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  style?: CSSProperties;
  className?: string;
}

export function Toggle({ checked, defaultChecked, onChange, style, className }: ToggleProps) {
  const { theme } = useTheme();
  const isControlled = checked !== undefined;
  const defaultVal = defaultChecked ?? theme === "dark";

  return (
    <label className={["toggle", className].filter(Boolean).join(" ")} style={style}>
      <input
        type="checkbox"
        checked={isControlled ? checked : undefined}
        defaultChecked={isControlled ? undefined : defaultVal}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className="slider">
        <span className="knob" />
      </span>
    </label>
  );
}
