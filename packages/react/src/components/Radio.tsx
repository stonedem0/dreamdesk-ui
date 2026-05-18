import { useId, createContext, useContext, type ChangeEvent, type CSSProperties, type ReactNode } from "react";
import "./Radio.css";

// ── Context for RadioGroup ────────────────────────────────────────────────────

interface RadioGroupCtx {
  name: string;
  value: string | undefined;
  onChange: (value: string) => void;
  disabled: boolean;
}

const RadioGroupContext = createContext<RadioGroupCtx | null>(null);

// ── RadioGroup ────────────────────────────────────────────────────────────────

export interface RadioGroupProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function RadioGroup({ name, value, disabled = false, onChange, children, className, style }: RadioGroupProps) {
  const fallbackName = useId();
  return (
    <RadioGroupContext.Provider value={{ name: name ?? fallbackName, value, onChange: onChange ?? (() => {}), disabled }}>
      <div className={["dd-radio-group", className].filter(Boolean).join(" ")} style={style} role="radiogroup">
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

// ── Radio ─────────────────────────────────────────────────────────────────────

export interface RadioProps {
  value: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Radio({ value, label, disabled: ownDisabled, className, style }: RadioProps) {
  const id = useId();
  const ctx = useContext(RadioGroupContext);
  const disabled = ownDisabled || ctx?.disabled || false;
  const checked = ctx?.value === value;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) ctx?.onChange(value);
  };

  return (
    <label
      className={["dd-radio", disabled && "dd-radio--disabled", className].filter(Boolean).join(" ")}
      htmlFor={id}
      style={style}
    >
      <span className="dd-radio-circle">
        <input
          id={id}
          type="radio"
          className="dd-radio-input"
          name={ctx?.name}
          value={value}
          checked={ctx ? checked : undefined}
          disabled={disabled}
          onChange={handleChange}
        />
        <span className="dd-radio-mark" aria-hidden="true" />
      </span>
      {label && <span className="dd-radio-label">{label}</span>}
    </label>
  );
}
