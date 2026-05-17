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
  cancelRunningAnimations(win);
  win.style.transformOrigin = '50% 100%';
  win.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(0)' }],
    { duration: 300, easing: 'ease-in', fill: 'forwards' }
  );
}

export function unminimize(win: HTMLElement): void {
  cancelRunningAnimations(win);
  win.style.transformOrigin = '50% 100%';
  win.animate(
    [{ transform: 'scale(0)' }, { transform: 'scale(1)' }],
    { duration: 300, easing: 'ease-out' }
  );
}

export function fullscreen(win: HTMLElement, previousState: PreviousState): void {
  cancelRunningAnimations(win);
  const fsW = window.innerWidth;
  const fsH = window.innerHeight;
  const fromTop = previousState.top - (window.scrollY || 0);
  const fromLeft = previousState.left - (window.scrollX || 0);
  const fromW = previousState.width;
  const fromH = previousState.height;

  win.style.position = 'fixed';
  win.style.top = '0';
  win.style.left = '0';
  win.style.width = '100vw';
  win.style.height = '100vh';
  win.style.setProperty('--ddw-w', '100vw');
  win.style.setProperty('--ddw-h', '100vh');
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
    { duration: 500, easing: 'cubic-bezier(0.2, 0, 0, 1)' }
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

  // Animate from fullscreen → target size/position, then apply final state
  const scaleX = toW / fsW;
  const scaleY = toH / fsH;
  const tx = (toLeft + toW / 2) - fsW / 2;
  const ty = (toTop + toH / 2) - fsH / 2;

  const animation = win.animate(
    [
      { transform: 'none' },
      { transform: `translate(${tx}px, ${ty}px) scale(${scaleX}, ${scaleY})` },
    ],
    { duration: 300, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' }
  );

  const applyFinal = () => {
    win.style.position = previousState.position || 'absolute';
    win.style.top = `${Math.round(previousState.top)}px`;
    win.style.left = `${Math.round(previousState.left)}px`;
    win.style.width = '';
    win.style.height = '';
    win.style.setProperty('--ddw-w', `${Math.round(toW)}px`);
    win.style.setProperty('--ddw-h', `${Math.round(toH)}px`);
    if (previousState.zIndex) {
      win.style.zIndex = previousState.zIndex;
    } else {
      win.style.removeProperty('z-index');
    }
  };

  animation.onfinish = () => { applyFinal(); win.getAnimations().forEach(a => a.cancel()); };
  animation.oncancel = applyFinal;
}

export function unsnap(win: HTMLElement, fromRect: DOMRect): void {
  cancelRunningAnimations(win);
  const toRect = win.getBoundingClientRect();
  const scaleX = fromRect.width / (toRect.width || 1);
  const scaleY = fromRect.height / (toRect.height || 1);
  const tx = (fromRect.left + fromRect.width / 2) - (toRect.left + toRect.width / 2);
  const ty = (fromRect.top + fromRect.height / 2) - (toRect.top + toRect.height / 2);
  win.animate(
    [
      { transform: `translate(${tx}px, ${ty}px) scale(${scaleX}, ${scaleY})` },
      { transform: 'none' },
    ],
    { duration: 300, easing: 'cubic-bezier(0.2, 0, 0, 1)' }
  );
}

export function close(win: HTMLElement, onfinish?: () => void): void {
  const anim = win.animate(
    [{ opacity: '1', transform: 'scale(1)' }, { opacity: '0', transform: 'scale(0.95)' }],
    { duration: 300, easing: 'ease', fill: 'forwards' }
  );
  anim.onfinish = () => {
    anim.cancel(); // clear fill effect so re-opening the window works correctly
    onfinish?.();
  };
}
