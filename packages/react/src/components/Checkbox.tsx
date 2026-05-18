import { useId, type ChangeEvent, type CSSProperties } from "react";
import "./Checkbox.css";

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  label?: string;
  onChange?: (checked: boolean) => void;
  className?: string;
  style?: CSSProperties;
}

export function Checkbox({ checked, defaultChecked, indeterminate, disabled, label, onChange, className, style }: CheckboxProps) {
  const id = useId();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => onChange?.(e.target.checked);

  return (
    <label
      className={["dd-checkbox", disabled && "dd-checkbox--disabled", className].filter(Boolean).join(" ")}
      htmlFor={id}
      style={style}
    >
      <span className={["dd-checkbox-box", indeterminate && "dd-checkbox-box--indeterminate"].filter(Boolean).join(" ")}>
        <input
          id={id}
          type="checkbox"
          className="dd-checkbox-input"
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={handleChange}
          ref={el => { if (el) el.indeterminate = !!indeterminate; }}
        />
        <span className="dd-checkbox-mark" aria-hidden="true" />
      </span>
      {label && <span className="dd-checkbox-label">{label}</span>}
    </label>
  );
}
