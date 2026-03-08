import { ReactNode, CSSProperties } from 'react';
export interface WindowProps {
    title?: string;
    size?: "sm" | "md" | "lg";
    resizable?: boolean;
    movable?: boolean;
    width?: string;
    height?: string;
    minimizeIcon?: string;
    fullscreenIcon?: string;
    closeIcon?: string;
    disableMinimize?: boolean | string;
    disableFullscreen?: boolean | string;
    disableClose?: boolean | string;
    fullscreenMode?: "expand";
    onMinimize?: (isMinimized: boolean) => void;
    onFullscreen?: (isFullscreen: boolean) => void;
    onClose?: () => void;
    children?: ReactNode;
    style?: CSSProperties;
    className?: string;
}
export declare function Window({ title, size, resizable, movable, width, height, minimizeIcon, fullscreenIcon, closeIcon, disableMinimize, disableFullscreen, disableClose, fullscreenMode, onMinimize, onFullscreen, onClose, children, style, className, }: WindowProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Window.d.ts.map