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

/** Where a window goes when minimized: its taskbar button, if it has one. */
export type MinimizeTarget = Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>;

/** The transform that lays `win` over `target`, shrunk to its size. */
function into(win: HTMLElement, target: MinimizeTarget): string {
  const r = win.getBoundingClientRect();
  const tx = (target.left + target.width / 2) - (r.left + r.width / 2);
  const ty = (target.top + target.height / 2) - (r.top + r.height / 2);
  return `translate(${tx}px, ${ty}px) scale(${target.width / (r.width || 1)}, ${target.height / (r.height || 1)})`;
}

/**
 * Shrinks the window away: into its taskbar button when given its rect, as
 * Windows does, otherwise down to its bottom edge.
 */
export function minimize(win: HTMLElement, target?: MinimizeTarget | null): void {
  cancelRunningAnimations(win);
  win.style.transformOrigin = target ? '50% 50%' : '50% 100%';
  const keyframes = target
    ? [{ transform: 'none', opacity: 1 }, { transform: into(win, target), opacity: 0 }]
    : [{ transform: 'scale(1)' }, { transform: 'scale(0)' }];
  win.animate(keyframes, { duration: ms(DURATION.minimize), easing: EASE_SMOOTH, fill: 'forwards' });
}

/** Brings the window back: out of its taskbar button when given its rect. */
export function unminimize(win: HTMLElement, target?: MinimizeTarget | null): void {
  cancelRunningAnimations(win);
  win.style.transformOrigin = target ? '50% 50%' : '50% 100%';
  const keyframes = target
    ? [{ transform: into(win, target), opacity: 0 }, { transform: 'none', opacity: 1 }]
    : [{ transform: 'scale(0)' }, { transform: 'scale(1)' }];
  win.animate(keyframes, { duration: ms(DURATION.unminimize), easing: EASE_IN_PLACE });
}

// ── Fullscreen ──────────────────────────────────────────────────────────────
// Where the browser has View Transitions, the window changes size at once and
// the browser animates between snapshots of before and after: each shown at
// its real size, pinned top-left, in a frame that grows or shrinks between
// the two (see ::view-transition-*(dd-window) in base.css). It looks like the
// window resizing, without scaling or squashing its content. Elsewhere, the
// window itself is scaled from one rect to the other.

interface ViewTransition { finished: Promise<void> }
type StartViewTransition = (update: () => void) => ViewTransition;

/** Runs `update` as a view transition of `win`; false if the browser can't. */
function viewTransition(win: HTMLElement, duration: number, easing: string, update: () => void): boolean {
  const start = (document as Document & { startViewTransition?: StartViewTransition }).startViewTransition;
  if (typeof start !== 'function' || reducedMotion()) return false;
  const root = document.documentElement;
  root.style.setProperty('--dd-vt-duration', `${duration}ms`);
  root.style.setProperty('--dd-vt-easing', easing);
  win.style.setProperty('view-transition-name', 'dd-window');
  const done = () => win.style.removeProperty('view-transition-name');
  try {
    start.call(document, update).finished.then(done, done);
  } catch {
    // e.g. another transition in the way: just change, no animation
    done();
    update();
  }
  return true;
}

function applyFullscreen(win: HTMLElement): void {
  win.style.position = 'fixed';
  win.style.top = '0';
  win.style.left = '0';
  win.style.width = '100vw';
  win.style.height = '100vh';
  win.style.setProperty('--ddw-w', '100vw');
  win.style.setProperty('--ddw-h', '100vh');
  win.style.zIndex = '9999';
}

function applyWindowed(win: HTMLElement, previousState: PreviousState): void {
  win.style.position = previousState.position || 'absolute';
  win.style.top = `${Math.round(previousState.top)}px`;
  win.style.left = `${Math.round(previousState.left)}px`;
  win.style.width = '';
  win.style.height = '';
  win.style.setProperty('--ddw-w', `${Math.round(previousState.width)}px`);
  win.style.setProperty('--ddw-h', `${Math.round(previousState.height)}px`);
  if (previousState.zIndex) {
    win.style.zIndex = previousState.zIndex;
  } else {
    win.style.removeProperty('z-index');
  }
}

/** The transform that puts a fullscreen window over `rect` (for the fallback). */
function fromFullscreenTo(rect: { top: number; left: number; width: number; height: number }): string {
  const fsW = window.innerWidth;
  const fsH = window.innerHeight;
  const top = rect.top - (window.scrollY || 0);
  const left = rect.left - (window.scrollX || 0);
  const tx = (left + rect.width / 2) - fsW / 2;
  const ty = (top + rect.height / 2) - fsH / 2;
  return `translate(${tx}px, ${ty}px) scale(${rect.width / fsW}, ${rect.height / fsH})`;
}

export function fullscreen(win: HTMLElement, previousState: PreviousState): void {
  cancelRunningAnimations(win);
  if (viewTransition(win, DURATION.fullscreen, EASE_IN_PLACE, () => applyFullscreen(win))) return;

  applyFullscreen(win);
  win.animate(
    [{ transform: fromFullscreenTo(previousState) }, { transform: 'none' }],
    { duration: ms(DURATION.fullscreen), easing: EASE_IN_PLACE }
  );
}

export function unfullscreen(win: HTMLElement, previousState: PreviousState): void {
  cancelRunningAnimations(win);
  if (viewTransition(win, DURATION.unfullscreen, EASE_SMOOTH, () => applyWindowed(win, previousState))) return;

  // Animate from fullscreen to the window's rect, then put it there
  const animation = win.animate(
    [{ transform: 'none' }, { transform: fromFullscreenTo(previousState) }],
    { duration: ms(DURATION.unfullscreen), easing: EASE_SMOOTH, fill: 'forwards' }
  );
  const applyFinal = () => applyWindowed(win, previousState);
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
    // The mirror of open()
    [{ opacity: '1', transform: 'scale(1)' }, { opacity: '0', transform: 'scale(0.9)' }],
    { duration: ms(DURATION.close), easing: EASE_SMOOTH, fill: 'forwards' }
  );
  anim.onfinish = () => {
    anim.cancel(); // clear fill effect so re-opening the window works correctly
    onfinish?.();
  };
}
