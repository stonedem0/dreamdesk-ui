import { cancelRunningAnimations } from './animations';

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
}

export function setupDrag({ handle, host, container, reservedBottom = 0, signal, disabled, exclude, getBounds, onStart }: DragOptions): () => void {
  let isDragging = false;
  let offsetX = 0, offsetY = 0;
  let maxLeft = 0, maxTop = 0;
  let containerOffsetLeft = 0, containerOffsetTop = 0;
  let rafId: number | null = null;
  let pendingLeft = 0, pendingTop = 0;

  const applyPosition = () => {
    host.style.left = `${Math.max(0, Math.min(pendingLeft - containerOffsetLeft, maxLeft))}px`;
    host.style.top = `${Math.max(0, Math.min(pendingTop - containerOffsetTop, maxTop))}px`;
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isDragging) return;
    pendingLeft = e.clientX - offsetX;
    pendingTop = e.clientY - offsetY;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => { applyPosition(); rafId = null; });
  };

  const onPointerUp = () => {
    isDragging = false;
    document.removeEventListener('pointermove', onPointerMove, { capture: true });
    document.removeEventListener('pointerup', onPointerUp, { capture: true });
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; applyPosition(); }
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
    document.addEventListener('pointerup', onPointerUp, { capture: true });
  };

  const opts = signal ? { signal } : {};
  handle.addEventListener('pointerdown', onPointerDown, opts);

  return () => {
    handle.removeEventListener('pointerdown', onPointerDown);
    document.removeEventListener('pointermove', onPointerMove, { capture: true });
    document.removeEventListener('pointerup', onPointerUp, { capture: true });
    if (rafId) cancelAnimationFrame(rafId);
  };
}
