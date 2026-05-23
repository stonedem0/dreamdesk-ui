import "./Wallpaper.css";

export interface WallpaperProps {
  src?: string;
  gradient?: string;
  color?: string;
  tile?: boolean;
  tileSize?: number | string;
  className?: string;
}

export function Wallpaper({ src, gradient, color, tile = false, tileSize = 64, className }: WallpaperProps) {
  const style: React.CSSProperties = {};

  if (src) {
    style.backgroundImage = `url(${src})`;
    style.backgroundSize = tile ? (typeof tileSize === "number" ? `${tileSize}px` : tileSize) : "cover";
    style.backgroundRepeat = tile ? "repeat" : "no-repeat";
    style.backgroundPosition = tile ? "top left" : "center";
  } else if (gradient) {
    style.backgroundImage = gradient;
    style.backgroundSize = "cover";
  } else if (color) {
    style.backgroundColor = color;
  }

  return <div className={["dd-wallpaper", className].filter(Boolean).join(" ")} style={style} />;
}
