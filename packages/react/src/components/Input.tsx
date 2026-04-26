import { useId, type CSSProperties } from "react";

export interface InputProps {
  type?: "text" | "password" | "email" | "number" | "search";
  label?: string;
  layout?: "block" | "inline";
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
  layout = "block",
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

  const gridStyle: CSSProperties = layout === "inline"
    ? { display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "center", gap: "0.5rem" }
    : {};

  return (
    <div className={["input-grid", className].filter(Boolean).join(" ")} style={{ ...gridStyle, ...style }}>
      {label && (
        <label className="input-label" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        className="dreamdesk-input"
        {...(value !== undefined
          ? { value, onChange: onChange ? (e) => onChange(e.target.value, e) : undefined }
          : { defaultValue, onChange: onChange ? (e) => onChange(e.target.value, e) : undefined }
        )}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}
