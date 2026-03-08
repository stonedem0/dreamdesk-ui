export declare function cancelRunningAnimations(el: Element): void;
export declare function minimize(win: HTMLElement): void;
export declare function fullscreen(win: HTMLElement, previousState: PreviousState): void;
export declare function unfullscreen(win: HTMLElement, previousState: PreviousState): void;
export declare function closeAnimation(win: HTMLElement, onfinish: () => void): void;
export interface PreviousState {
    top: number;
    left: number;
    width: number;
    height: number;
    position: string;
    zIndex: string;
}
//# sourceMappingURL=animations.d.ts.map