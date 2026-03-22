import { useRef, useEffect, useState, type CSSProperties } from "react";

export interface ProgressBarProps {
  value?: number;
  blocky?: boolean;
  gradient?: boolean;
  className?: string;
  style?: CSSProperties;
}

const TARGET_SEG_W = 10;
const GAP = 1;

function useBlockySegments(
  trackRef: React.RefObject<HTMLDivElement | null>,
  value: number,
  gradient: boolean,
  enabled: boolean
) {
  const [layout, setLayout] = useState({ count: 0, segW: TARGET_SEG_W });

  useEffect(() => {
    if (!enabled) return;
    const track = trackRef.current;
    if (!track) return;

    const rebuild = () => {
      const cs = getComputedStyle(track);
      const pl = parseFloat(cs.paddingLeft) || 0;
      const pr = parseFloat(cs.paddingRight) || 0;
      const bl = parseFloat(cs.borderLeftWidth) || 0;
      const br = parseFloat(cs.borderRightWidth) || 0;
      const innerWidth = track.getBoundingClientRect().width - pl - pr - bl - br;
      const count = Math.max(1, Math.round((innerWidth + GAP) / (TARGET_SEG_W + GAP)));
      const segW = (innerWidth - (count - 1) * GAP) / count;
      setLayout({ count, segW });
    };

    const ro = new ResizeObserver(rebuild);
    ro.observe(track);
    rebuild();
    return () => ro.disconnect();
  }, [enabled, trackRef]);

  const { count: segments, segW } = layout;
  const percent = Math.min(Math.max(value, 0), 100);
  const activeCount = Math.floor((percent / 100) * segments);
  const fullVisualWidth = segments * (segW + GAP) - GAP;

  const segmentEls = Array.from({ length: segments }, (_, i) => {
    const active = i < activeCount;
    const style: CSSProperties = {
      width: `${segW}px`,
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
      style.backgroundPosition = `-${i * (segW + GAP)}px 0`;
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
