import { cancelRunningAnimations } from './animations';

export interface DragOptions {
  handle: HTMLElement;
  host: HTMLElement;
  signal?: AbortSignal;
  disabled?: () => boolean;
  exclude?: string;
  getBounds?: () => { maxLeft: number; maxTop: number };
  onStart?: (hostRect: DOMRect) => void;
}

export function setupDrag({ handle, host, signal, disabled, exclude, getBounds, onStart }: DragOptions): () => void {
  let isDragging = false;
  let offsetX = 0, offsetY = 0;
  let maxLeft = 0, maxTop = 0;
  let rafId: number | null = null;

  const onPointerMove = (e: PointerEvent) => {
    if (!isDragging) return;
    const desiredLeft = e.clientX - offsetX;
    const desiredTop = e.clientY - offsetY;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      host.style.left = `${Math.max(0, Math.min(desiredLeft, maxLeft))}px`;
      host.style.top = `${Math.max(0, Math.min(desiredTop, maxTop))}px`;
    });
  };

  const onPointerUp = () => {
    isDragging = false;
    document.removeEventListener('pointermove', onPointerMove, { capture: true });
    document.removeEventListener('pointerup', onPointerUp, { capture: true });
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  };

  const onPointerDown = (e: PointerEvent) => {
    if (disabled?.()) return;
    if (exclude && (e.target as Element).closest(exclude)) return;
    cancelRunningAnimations(host);
    const hostRect = host.getBoundingClientRect();
    offsetX = e.clientX - hostRect.left;
    offsetY = e.clientY - hostRect.top;
    const b = getBounds?.() ?? {
      maxLeft: Math.max(0, window.innerWidth - hostRect.width),
      maxTop: Math.max(0, window.innerHeight - hostRect.height),
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
