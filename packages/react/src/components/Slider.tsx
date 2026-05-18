import { useId, type ChangeEvent, type CSSProperties } from "react";
import "./Slider.css";

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label?: string;
  showValue?: boolean;
  onChange?: (value: number) => void;
  className?: string;
  style?: CSSProperties;
}

export function Slider({ value, defaultValue, min = 0, max = 100, step = 1, disabled, label, showValue, onChange, className, style }: SliderProps) {
  const id = useId();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => onChange?.(Number(e.target.value));

  return (
    <div
      className={["dd-slider-container", disabled && "dd-slider-container--disabled", className].filter(Boolean).join(" ")}
      style={style}
    >
      {label && <label className="dd-slider-label" htmlFor={id}>{label}</label>}
      <div className="dd-slider-row">
        <input
          id={id}
          type="range"
          className="dd-slider"
          value={value}
          defaultValue={defaultValue ?? min}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={handleChange}
        />
        {showValue && <span className="dd-slider-value">{value ?? defaultValue ?? min}</span>}
      </div>
    </div>
  );
}
