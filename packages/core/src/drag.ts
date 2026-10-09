import { cancelRunningAnimations } from './animations';
import { detectSnapZone, type SnapZone } from './snap';

export interface DragOptions {
  handle: HTMLElement;
  host: HTMLElement;
  container?: HTMLElement | null;
  reservedBottom?: number;
  signal?: AbortSignal;
  disabled?: () => boolean;
  exclude?: string;
  getBounds?: () => { maxLeft: number; maxTop: number };
  onStart?: (hostRect: DOMRect) => void;
  onSnap?: (zone: SnapZone) => void;
  onSnapCommit?: (zone: SnapZone) => void;
  onEnd?: () => void;
}

/*
 * While dragging, the window moves with a transform (the browser just shifts
 * an already-painted layer) and its left/top are written once, on release:
 * moving left/top every frame re-lays out and repaints the whole window,
 * which heavy windows (iframes, canvases, long lists) make janky. The pointer
 * is captured, so moving over an iframe (whose page would otherwise take the
 * events) doesn't freeze the drag or leave the window stuck to the cursor.
 */
export function setupDrag({ handle, host, container, reservedBottom = 0, signal, disabled, exclude, getBounds, onStart, onSnap, onSnapCommit, onEnd }: DragOptions): () => void {
  let isDragging = false;
  let pointerId: number | null = null;
  let offsetX = 0, offsetY = 0;
  let maxLeft = 0, maxTop = 0;
  let containerOffsetLeft = 0, containerOffsetTop = 0;
  // The desktop doesn't move during a drag: measured once, not every frame
  let containerRect: DOMRect | null = null;
  // Where the window was when the drag started (its left/top)
  let baseLeft = 0, baseTop = 0;
  let rafId: number | null = null;
  let pendingLeft = 0, pendingTop = 0;
  let pointerX = 0, pointerY = 0;
  let currentZone: SnapZone = 'none';

  const target = () => ({
    left: Math.max(0, Math.min(pendingLeft - containerOffsetLeft, maxLeft)),
    top: Math.max(0, Math.min(pendingTop - containerOffsetTop, maxTop)),
  });

  const showPosition = () => {
    const { left, top } = target();
    host.style.transform = `translate(${left - baseLeft}px, ${top - baseTop}px)`;
  };

  /** Writes the final left/top and drops the transform. */
  const commitPosition = () => {
    const { left, top } = target();
    host.style.transform = '';
    host.style.left = `${left}px`;
    host.style.top = `${top}px`;
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isDragging || (pointerId !== null && e.pointerId !== pointerId)) return;
    pendingLeft = e.clientX - offsetX;
    pendingTop = e.clientY - offsetY;
    pointerX = e.clientX;
    pointerY = e.clientY;
    // One update per frame, with the latest position
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      showPosition();
      if (onSnap && containerRect) {
        const zone = detectSnapZone(pointerX - containerRect.left, pointerY - containerRect.top, containerRect.width, containerRect.height - reservedBottom);
        if (zone !== currentZone) {
          currentZone = zone;
          onSnap(zone);
        }
      }
    });
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!isDragging || (pointerId !== null && e.pointerId !== pointerId)) return;
    isDragging = false;
    document.removeEventListener('pointermove', onPointerMove, { capture: true });
    document.removeEventListener('pointerup', onPointerUp, { capture: true });
    document.removeEventListener('pointercancel', onPointerUp, { capture: true });
    if (pointerId !== null) {
      try { handle.releasePointerCapture(pointerId); } catch { /* already released */ }
      pointerId = null;
    }
    document.documentElement.style.removeProperty('user-select');
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    commitPosition();
    if (onSnapCommit && currentZone !== 'none') {
      onSnapCommit(currentZone);
    }
    if (onSnap) onSnap('none');
    currentZone = 'none';
    onEnd?.();
  };

  const onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0 || disabled?.()) return;
    if (exclude && (e.target as Element).closest(exclude)) return;
    cancelRunningAnimations(host);
    const hostRect = host.getBoundingClientRect();
    containerRect = container?.getBoundingClientRect() ?? null;
    containerOffsetLeft = containerRect?.left ?? 0;
    containerOffsetTop = containerRect?.top ?? 0;
    offsetX = e.clientX - hostRect.left;
    offsetY = e.clientY - hostRect.top;
    const b = getBounds?.() ?? {
      maxLeft: containerRect
        ? containerRect.width - hostRect.width
        : Math.max(0, window.innerWidth - hostRect.width),
      maxTop: containerRect
        ? containerRect.height - hostRect.height - reservedBottom
        : Math.max(0, window.innerHeight - hostRect.height - reservedBottom),
    };
    maxLeft = b.maxLeft;
    maxTop = b.maxTop;
    onStart?.(hostRect);
    // Where it is now (after onStart, which may have placed it): the transform
    // is relative to this, and the target it moves to uses the same reference
    baseLeft = hostRect.left - containerOffsetLeft;
    baseTop = hostRect.top - containerOffsetTop;
    const styleLeft = parseFloat(host.style.left), styleTop = parseFloat(host.style.top);
    if (Number.isFinite(styleLeft)) baseLeft = styleLeft;
    if (Number.isFinite(styleTop)) baseTop = styleTop;
    pendingLeft = baseLeft + containerOffsetLeft;
    pendingTop = baseTop + containerOffsetTop;
    isDragging = true;
    pointerId = e.pointerId;
    try { handle.setPointerCapture(e.pointerId); } catch { /* not supported: document listeners still work */ }
    // No text selection while dragging across windows
    document.documentElement.style.setProperty('user-select', 'none');
    document.addEventListener('pointermove', onPointerMove, { capture: true });
    document.addEventListener('pointerup', onPointerUp as EventListener, { capture: true });
    document.addEventListener('pointercancel', onPointerUp as EventListener, { capture: true });
  };

  const opts = signal ? { signal } : {};
  handle.addEventListener('pointerdown', onPointerDown, opts);

  return () => {
    handle.removeEventListener('pointerdown', onPointerDown);
    document.removeEventListener('pointermove', onPointerMove, { capture: true });
    document.removeEventListener('pointerup', onPointerUp as EventListener, { capture: true });
    document.removeEventListener('pointercancel', onPointerUp as EventListener, { capture: true });
    if (rafId !== null) cancelAnimationFrame(rafId);
    if (isDragging) {
      host.style.transform = '';
      document.documentElement.style.removeProperty('user-select');
    }
  };
}
