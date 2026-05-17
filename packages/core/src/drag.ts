import { cancelRunningAnimations } from './animations';
import { detectSnapZone, snapRect, type SnapZone } from './snap';

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

export function setupDrag({ handle, host, container, reservedBottom = 0, signal, disabled, exclude, getBounds, onStart, onSnap, onSnapCommit, onEnd }: DragOptions): () => void {
  let isDragging = false;
  let offsetX = 0, offsetY = 0;
  let maxLeft = 0, maxTop = 0;
  let containerOffsetLeft = 0, containerOffsetTop = 0;
  let rafId: number | null = null;
  let pendingLeft = 0, pendingTop = 0;
  let currentZone: SnapZone = 'none';

  const applyPosition = () => {
    host.style.left = `${Math.max(0, Math.min(pendingLeft - containerOffsetLeft, maxLeft))}px`;
    host.style.top = `${Math.max(0, Math.min(pendingTop - containerOffsetTop, maxTop))}px`;
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isDragging) return;
    pendingLeft = e.clientX - offsetX;
    pendingTop = e.clientY - offsetY;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      applyPosition();
      rafId = null;
      if (onSnap && container) {
        const containerRect = container.getBoundingClientRect();
        const cx = e.clientX - containerRect.left;
        const cy = e.clientY - containerRect.top;
        const zone = detectSnapZone(cx, cy, containerRect.width, containerRect.height - reservedBottom);
        if (zone !== currentZone) {
          currentZone = zone;
          onSnap(zone);
        }
      }
    });
  };

  const onPointerUp = (e: PointerEvent) => {
    isDragging = false;
    document.removeEventListener('pointermove', onPointerMove, { capture: true });
    document.removeEventListener('pointerup', onPointerUp, { capture: true });
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; applyPosition(); }
    if (onSnapCommit && currentZone !== 'none') {
      onSnapCommit(currentZone);
    }
    if (onSnap) onSnap('none');
    currentZone = 'none';
    onEnd?.();
  };

  const onPointerDown = (e: PointerEvent) => {
    if (disabled?.()) return;
    if (exclude && (e.target as Element).closest(exclude)) return;
    cancelRunningAnimations(host);
    const hostRect = host.getBoundingClientRect();
    const containerRect = container?.getBoundingClientRect();
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
    isDragging = true;
    document.addEventListener('pointermove', onPointerMove, { capture: true });
    document.addEventListener('pointerup', onPointerUp as EventListener, { capture: true });
  };

  const opts = signal ? { signal } : {};
  handle.addEventListener('pointerdown', onPointerDown, opts);

  return () => {
    handle.removeEventListener('pointerdown', onPointerDown);
    document.removeEventListener('pointermove', onPointerMove, { capture: true });
    document.removeEventListener('pointerup', onPointerUp as EventListener, { capture: true });
    if (rafId) cancelAnimationFrame(rafId);
  };
}
