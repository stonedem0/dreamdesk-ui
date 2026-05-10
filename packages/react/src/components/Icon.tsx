import { sanitizeSvg } from "../utils/svg";

export interface IconProps {
  src?: string;
  size?: number;
  alt?: string;
  className?: string;
}

export function Icon({ src, size = 16, alt = "", className }: IconProps) {
  if (!src) return null;
  const trimmed = src.trim();
  const cls = ["dd-icon", className].filter(Boolean).join(" ");

  if (trimmed.startsWith("<svg")) {
    const clean = sanitizeSvg(trimmed);
    if (!clean) return null;
    return (
      <span
        className={cls}
        style={{ width: size, height: size, display: "inline-flex", flexShrink: 0 }}
        dangerouslySetInnerHTML={{ __html: clean }}
        aria-hidden="true"
      />
    );
  }

  return (
    <img
      className={cls}
      src={trimmed}
      width={size}
      height={size}
      alt={alt}
      style={{ flexShrink: 0 }}
    />
  );
}
