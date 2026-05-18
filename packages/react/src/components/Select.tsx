import { useId, type ChangeEvent, type CSSProperties } from "react";
import "./Select.css";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  layout?: "block" | "inline";
  onChange?: (value: string) => void;
  className?: string;
  style?: CSSProperties;
}

export function Select({ options, value, defaultValue, placeholder, disabled, label, layout = "block", onChange, className, style }: SelectProps) {
  const id = useId();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => onChange?.(e.target.value);

  const select = (
    <div className="dd-select-wrap">
      <select
        id={id}
        className="dd-select"
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        onChange={handleChange}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="dd-select-arrow" aria-hidden="true">▾</span>
    </div>
  );

  if (!label) return <div className={["dd-select-container", className].filter(Boolean).join(" ")} style={style}>{select}</div>;

  return (
    <div
      className={["dd-select-container", layout === "inline" && "dd-select-container--inline", disabled && "dd-select-container--disabled", className].filter(Boolean).join(" ")}
      style={style}
    >
      <label className="dd-select-label" htmlFor={id}>{label}</label>
      {select}
    </div>
  );
}
