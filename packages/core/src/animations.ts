export interface PreviousState {
  top: number;
  left: number;
  width: number;
  height: number;
  position: string;
  zIndex: string;
}

export function cancelRunningAnimations(el: Element): void {
  const anims = el?.getAnimations?.() ?? [];
  for (const a of anims) a.cancel();
}

export function minimize(win: HTMLElement): void {
  win.style.transformOrigin = '50% 100%';
  win.animate(
    [{ transform: 'scale(1)', offset: 0 }, { transform: 'scale(0)', offset: 1 }],
    { duration: 600, easing: 'ease-in-out', fill: 'forwards' }
  );
}

export function fullscreen(win: HTMLElement, previousState: PreviousState): void {
  cancelRunningAnimations(win);
  const fsW = window.innerWidth;
  const fsH = window.innerHeight;
  const fromW = previousState.width;
  const fromH = previousState.height;
  const fromTop = previousState.top - (window.scrollY || 0);
  const fromLeft = previousState.left - (window.scrollX || 0);

  win.style.position = 'fixed';
  win.style.top = '0';
  win.style.left = '0';
  win.style.width = '100vw';
  win.style.height = '100vh';
  win.style.zIndex = '9999';

  const scaleX = fromW / fsW;
  const scaleY = fromH / fsH;
  const tx = (fromLeft + fromW / 2) - fsW / 2;
  const ty = (fromTop + fromH / 2) - fsH / 2;

  win.animate(
    [
      { transform: `translate(${tx}px, ${ty}px) scale(${scaleX}, ${scaleY})` },
      { transform: 'none' },
    ],
    { duration: 400, easing: 'ease-in-out' }
  );
}

export function unfullscreen(win: HTMLElement, previousState: PreviousState): void {
  cancelRunningAnimations(win);
  const fsW = window.innerWidth;
  const fsH = window.innerHeight;
  const toW = previousState.width;
  const toH = previousState.height;
  const toTop = previousState.top - (window.scrollY || 0);
  const toLeft = previousState.left - (window.scrollX || 0);

  win.style.position = previousState.position || 'absolute';
  win.style.top = `${Math.round(previousState.top)}px`;
  win.style.left = `${Math.round(previousState.left)}px`;
  win.style.width = `${Math.round(toW)}px`;
  win.style.height = `${Math.round(toH)}px`;
  if (previousState.zIndex) {
    win.style.zIndex = previousState.zIndex;
  } else {
    win.style.removeProperty('z-index');
  }

  const scaleX = fsW / toW;
  const scaleY = fsH / toH;
  const tx = fsW / 2 - (toLeft + toW / 2);
  const ty = fsH / 2 - (toTop + toH / 2);

  win.animate(
    [
      { transform: `translate(${tx}px, ${ty}px) scale(${scaleX}, ${scaleY})` },
      { transform: 'none' },
    ],
    { duration: 400, easing: 'ease-in-out' }
  );
}

export function close(win: HTMLElement, onfinish?: () => void): void {
  win.animate(
    [{ opacity: '1', transform: 'scale(1)' }, { opacity: '0', transform: 'scale(0.95)' }],
    { duration: 300, easing: 'ease', fill: 'forwards' }
  ).onfinish = () => onfinish?.();
}
