export type SnapZone =
  | "top"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "none";

export interface SnapRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const EDGE_THRESHOLD = 20;
const CORNER_THRESHOLD = 80;

export function detectSnapZone(
  x: number,
  y: number,
  containerWidth: number,
  containerHeight: number
): SnapZone {
  const nearLeft = x <= EDGE_THRESHOLD;
  const nearRight = x >= containerWidth - EDGE_THRESHOLD;
  const nearTop = y <= EDGE_THRESHOLD;
  const nearBottom = y >= containerHeight - EDGE_THRESHOLD;

  // Corners (tighter detection box uses CORNER_THRESHOLD on the cross-axis)
  if (nearTop && x <= CORNER_THRESHOLD) return "top-left";
  if (nearTop && x >= containerWidth - CORNER_THRESHOLD) return "top-right";
  if (nearBottom && x <= CORNER_THRESHOLD) return "bottom-left";
  if (nearBottom && x >= containerWidth - CORNER_THRESHOLD) return "bottom-right";

  // Edges
  if (nearTop) return "top";
  if (nearLeft) return "left";
  if (nearRight) return "right";

  return "none";
}

export function snapRect(zone: SnapZone, containerWidth: number, containerHeight: number): SnapRect | null {
  const w = containerWidth;
  const h = containerHeight;
  switch (zone) {
    case "top":          return { top: 0,   left: 0,     width: w,   height: h   };
    case "left":         return { top: 0,   left: 0,     width: w/2, height: h   };
    case "right":        return { top: 0,   left: w/2,   width: w/2, height: h   };
    case "top-left":     return { top: 0,   left: 0,     width: w/2, height: h/2 };
    case "top-right":    return { top: 0,   left: w/2,   width: w/2, height: h/2 };
    case "bottom-left":  return { top: h/2, left: 0,     width: w/2, height: h/2 };
    case "bottom-right": return { top: h/2, left: w/2,   width: w/2, height: h/2 };
    default:             return null;
  }
}
