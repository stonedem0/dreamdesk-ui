import { useRef, useEffect, useState, type CSSProperties } from "react";

export interface ProgressBarProps {
  value?: number;
  blocky?: boolean;
  gradient?: boolean;
  className?: string;
  style?: CSSProperties;
}

const GAP = 1;
const SEG_W = 10;
const FULL_SEG = SEG_W + GAP;

function useBlockySegments(
  trackRef: React.RefObject<HTMLDivElement | null>,
  value: number,
  gradient: boolean,
  enabled: boolean
) {
  const [segments, setSegments] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const track = trackRef.current;
    if (!track) return;

    const rebuild = () => {
      const trackWidth = track.getBoundingClientRect().width;
      setSegments(Math.floor((trackWidth + GAP) / FULL_SEG));
    };

    const ro = new ResizeObserver(rebuild);
    ro.observe(track);
    rebuild();
    return () => ro.disconnect();
  }, [enabled, trackRef]);

  const percent = Math.min(Math.max(value, 0), 100);
  const activeCount = Math.floor((percent / 100) * segments);
  const fullVisualWidth = segments * FULL_SEG - GAP;

  const segmentEls = Array.from({ length: segments }, (_, i) => {
    const active = i < activeCount;
    const style: CSSProperties = {
      width: `${SEG_W}px`,
      height: "100%",
      marginRight: i < segments - 1 ? `${GAP}px` : "0",
      opacity: active ? 1 : 0.2,
      flexShrink: 0,
      boxSizing: "border-box",
      transition: "opacity 0.3s ease, background 0.3s ease",
      border: "var(--color-window-border, var(--border))",
      boxShadow: "var(--progress-segment-shadow, none)",
    };

    if (gradient) {
      style.backgroundImage = "var(--color-progress-gradient, none)";
      style.backgroundSize = `${fullVisualWidth}px 100%`;
      style.backgroundPosition = `-${i * FULL_SEG}px 0`;
      style.backgroundRepeat = "no-repeat";
      style.backgroundColor = "transparent";
    } else {
      style.backgroundImage = "none";
      style.backgroundColor = active
        ? "var(--color-progress-segment, #a8edea)"
        : "transparent";
    }

    return <div key={i} style={style} />;
  });

  return segmentEls;
}

export function ProgressBar({
  value = 0,
  blocky = false,
  gradient = false,
  className,
  style,
}: ProgressBarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const segmentEls = useBlockySegments(trackRef, value, gradient, blocky);

  const percent = Math.min(Math.max(value, 0), 100);

  const trackClass = [
    "progress-track",
    blocky ? "progress-track--blocky" : "",
    className,
  ].filter(Boolean).join(" ");

  const barStyle: CSSProperties = {
    width: `${percent}%`,
    ...(value >= 100 ? { borderRight: "none" } : {}),
    ...(!gradient ? { filter: `hue-rotate(${percent * 3.6}deg)` } : {}),
  };

  return (
    <div ref={trackRef} className={trackClass} style={style}>
      {blocky ? (
        segmentEls
      ) : (
        <div
          className={["progress-bar", gradient ? "progress-bar--gradient" : ""].filter(Boolean).join(" ")}
          style={barStyle}
        />
      )}
    </div>
  );
}
