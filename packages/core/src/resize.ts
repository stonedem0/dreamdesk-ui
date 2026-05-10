export interface ResizeOptions {
  handle: HTMLElement;
  host: HTMLElement;
  signal?: AbortSignal;
  disabled?: () => boolean;
  minWidth?: number;
  minHeight?: number;
  explicitAttr?: string;
}

export function setupResize({ handle, host, signal, disabled, minWidth = 180, minHeight = 120, explicitAttr = 'data-explicit' }: ResizeOptions): () => void {
  let isResizing = false;
  let startX = 0, startY = 0, startWidth = 0, startHeight = 0;

  const onPointerMove = (e: PointerEvent) => {
    if (!isResizing) return;
    host.style.setProperty('--ddw-w', `${Math.max(minWidth, startWidth + e.clientX - startX)}px`);
    host.style.setProperty('--ddw-h', `${Math.max(minHeight, startHeight + e.clientY - startY)}px`);
    host.setAttribute(explicitAttr, '');
  };

  const onPointerUp = () => {
    isResizing = false;
    document.removeEventListener('pointermove', onPointerMove, { capture: true });
    document.removeEventListener('pointerup', onPointerUp, { capture: true });
  };

  const onPointerDown = (e: PointerEvent) => {
    if (disabled?.()) return;
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    const rect = host.getBoundingClientRect();
    startWidth = rect.width;
    startHeight = rect.height;
    document.addEventListener('pointermove', onPointerMove, { capture: true });
    document.addEventListener('pointerup', onPointerUp, { capture: true });
  };

  const opts = signal ? { signal } : {};
  handle.addEventListener('pointerdown', onPointerDown, opts);

  return () => {
    handle.removeEventListener('pointerdown', onPointerDown);
    document.removeEventListener('pointermove', onPointerMove, { capture: true });
    document.removeEventListener('pointerup', onPointerUp, { capture: true });
  };
}
