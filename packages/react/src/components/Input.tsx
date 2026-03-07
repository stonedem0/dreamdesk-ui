import { useId, type CSSProperties } from "react";

export interface InputProps {
  type?: "text" | "password" | "email" | "number" | "search";
  label?: string;
  id?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  style?: CSSProperties;
}

export function Input({
  type = "text",
  label,
  id: idProp,
  value,
  defaultValue,
  placeholder,
  disabled,
  onChange,
  className,
  style,
}: InputProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  return (
    <div className={["input-grid", className].filter(Boolean).join(" ")} style={style}>
      {label && (
        <label className="input-label" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        className="dreamdesk-input"
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange ? (e) => onChange(e.target.value, e) : undefined}
      />
    </div>
  );
}
