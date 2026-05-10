import { useRef, useEffect, type CSSProperties } from "react";
import { setupProgressBar, type ProgressBarHandle } from "@dreamdesk/core";

export interface ProgressBarProps {
  value?: number;
  blocky?: boolean;
  gradient?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function ProgressBar({
  value = 0,
  blocky = false,
  gradient = false,
  className,
  style,
}: ProgressBarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<ProgressBarHandle | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    handleRef.current?.destroy();
    handleRef.current = setupProgressBar({
      track,
      getValue: () => value,
      isBlocky: () => blocky,
      isGradient: () => gradient,
    });
    handleRef.current.rebuild();
    return () => { handleRef.current?.destroy(); handleRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocky, gradient]);

  useEffect(() => {
    handleRef.current?.update(value);
  }, [value]);

  const trackClass = [
    "progress-track",
    blocky ? "progress-track--blocky" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div ref={trackRef} className={trackClass} style={style}>
      {!blocky && (
        <div className={["progress-bar", gradient ? "progress-bar--gradient" : ""].filter(Boolean).join(" ")} />
      )}
    </div>
  );
}
