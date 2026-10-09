export interface PreviousState {
  top: number;
  left: number;
  width: number;
  height: number;
  position: string;
  zIndex: string;
}

// ── Motion ──────────────────────────────────────────────────────────────────
// One feel for every window animation: a gentle start and a soft landing.
// Opening and growing take a little longer than closing and shrinking.

/** Growing in: starts briskly, settles softly. */
export const EASE_IN_PLACE = 'cubic-bezier(0.2, 0, 0, 1)';
/** Moving or shrinking: eases in and out, never snaps at the end. */
export const EASE_SMOOTH = 'cubic-bezier(0.4, 0, 0.2, 1)';

export const DURATION = {
  open: 260,
  close: 240,
  minimize: 340,
  unminimize: 340,
  fullscreen: 450,
  unfullscreen: 400,
  unsnap: 360,
} as const;

/** Near-instant for people who ask their system for less motion. */
const reducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const ms = (duration: number) => (reducedMotion() ? 1 : duration);

export function cancelRunningAnimations(el: Element): void {
  const anims = el?.getAnimations?.() ?? [];
  for (const a of anims) {
    // Cancelling rejects `finished` with an AbortError. Browsers mark that
    // rejection as handled (per the Web Animations spec); some environments,
    // like happy-dom in tests, don't, and report it as an unhandled error.
    a.finished?.catch(() => {});
    a.cancel();
  }
}

export function open(win: HTMLElement): void {
  cancelRunningAnimations(win);
  win.style.transformOrigin = '50% 50%';
  win.animate(
    [{ transform: 'scale(0.9)', opacity: '0' }, { transform: 'scale(1)', opacity: '1' }],
    { duration: ms(DURATION.open), easing: EASE_IN_PLACE }
  );
}

export function minimize(win: HTMLElement): void {
  cancelRunningAnimations(win);
  win.style.transformOrigin = '50% 100%';
  win.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(0)' }],
    { duration: ms(DURATION.minimize), easing: EASE_SMOOTH, fill: 'forwards' }
  );
}

export function unminimize(win: HTMLElement): void {
  cancelRunningAnimations(win);
  win.style.transformOrigin = '50% 100%';
  win.animate(
    [{ transform: 'scale(0)' }, { transform: 'scale(1)' }],
    { duration: ms(DURATION.unminimize), easing: EASE_IN_PLACE }
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
    { duration: ms(DURATION.fullscreen), easing: EASE_IN_PLACE }
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
    { duration: ms(DURATION.unfullscreen), easing: EASE_SMOOTH, fill: 'forwards' }
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
    { duration: ms(DURATION.unsnap), easing: EASE_SMOOTH }
  );
}

export function close(win: HTMLElement, onfinish?: () => void): void {
  const anim = win.animate(
    [{ opacity: '1', transform: 'scale(1)' }, { opacity: '0', transform: 'scale(0.95)' }],
    { duration: ms(DURATION.close), easing: EASE_SMOOTH, fill: 'forwards' }
  );
  anim.onfinish = () => {
    anim.cancel(); // clear fill effect so re-opening the window works correctly
    onfinish?.();
  };
}
