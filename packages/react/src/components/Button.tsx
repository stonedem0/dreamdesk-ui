import { type ReactNode, type CSSProperties } from "react";

export interface ButtonProps {
  variant?: "primary" | "ghost" | "help" | "basic";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  action?: string;
  minWidth?: string;
  width?: string;
  height?: string;
  fontSize?: string;
  px?: string;
  py?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Button({
  variant = "primary",
  size,
  disabled = false,
  action,
  minWidth,
  width,
  height,
  fontSize,
  px,
  py,
  onClick,
  children,
  className,
  style,
}: ButtonProps) {
  const cssVars: CSSProperties = {
    ...(minWidth ? { "--dd-btn-min-w": minWidth } as CSSProperties : {}),
    ...(width    ? { "--dd-btn-w":     width    } as CSSProperties : {}),
    ...(height   ? { "--dd-btn-h":     height   } as CSSProperties : {}),
    ...(fontSize ? { "--dd-btn-fs":    fontSize } as CSSProperties : {}),
    ...(px       ? { "--dd-btn-px":    px       } as CSSProperties : {}),
    ...(py       ? { "--dd-btn-py":    py       } as CSSProperties : {}),
    ...style,
  };

  const classes = [
    "btn",
    `btn--${variant}`,
    disabled ? "btn--disable" : "",
    size ? `btn--size-${size}` : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <button
      className={classes}
      style={cssVars}
      disabled={disabled}
      aria-disabled={disabled ? "true" : undefined}
      tabIndex={disabled ? -1 : undefined}
      data-action={action}
      aria-label={action}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </button>
  );
}
