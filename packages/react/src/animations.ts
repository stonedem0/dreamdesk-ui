export function cancelRunningAnimations(el: Element) {
  const anims = el?.getAnimations?.() ?? [];
  for (const a of anims) a.cancel();
}

export function minimize(win: HTMLElement) {
  win.style.transformOrigin = "50% 100%";
  win.animate(
    [{ transform: "scale(1)", offset: 0 }, { transform: "scale(0)", offset: 1 }],
    { duration: 600, easing: "ease-in-out", fill: "forwards" }
  );
}

export function fullscreen(win: HTMLElement, previousState: PreviousState) {
  const animation = win.animate(
    [
      {
        position: "fixed",
        top: `${Math.round(previousState.top)}px`,
        left: `${Math.round(previousState.left)}px`,
        width: `${Math.round(previousState.width)}px`,
        height: `${Math.round(previousState.height)}px`,
        offset: 0,
        zIndex: "9999",
      },
      { position: "fixed", top: "0px", left: "0px", width: "100vw", height: "100vh", offset: 1, zIndex: "9999" },
    ],
    { duration: 400, easing: "ease-in-out", fill: "forwards" }
  );
  animation.onfinish = () => {
    win.style.position = "fixed";
    win.style.top = "0px";
    win.style.left = "0px";
    win.style.width = "100vw";
    win.style.height = "100vh";
    win.style.zIndex = "9999";
  };
}

export function unfullscreen(win: HTMLElement, previousState: PreviousState) {
  cancelRunningAnimations(win);
  const animation = win.animate(
    [
      { position: "fixed", top: "0px", left: "0px", width: "100vw", height: "100vh", offset: 0 },
      {
        position: previousState.position,
        top: `${Math.round(previousState.top)}px`,
        left: `${Math.round(previousState.left)}px`,
        width: `${Math.round(previousState.width)}px`,
        height: `${Math.round(previousState.height)}px`,
        offset: 1,
      },
    ],
    { duration: 400, easing: "ease-in-out", fill: "forwards" }
  );
  animation.onfinish = () => {
    win.style.position = previousState.position || "absolute";
    win.style.top = `${Math.round(previousState.top)}px`;
    win.style.left = `${Math.round(previousState.left)}px`;
    win.style.width = `${Math.round(previousState.width)}px`;
    win.style.height = `${Math.round(previousState.height)}px`;
    if (previousState.zIndex) {
      win.style.zIndex = previousState.zIndex;
    } else {
      win.style.removeProperty("z-index");
    }
    cancelRunningAnimations(win);
  };
}

export function closeAnimation(win: HTMLElement, onfinish: () => void) {
  win.animate(
    [
      { opacity: 1, transform: "scale(1)" },
      { opacity: 0, transform: "scale(0.95)" },
    ],
    { duration: 300, easing: "ease", fill: "forwards" }
  ).onfinish = onfinish;
}

export interface PreviousState {
  top: number;
  left: number;
  width: number;
  height: number;
  position: string;
  zIndex: string;
}
