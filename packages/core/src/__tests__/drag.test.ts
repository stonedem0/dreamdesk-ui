import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setupDrag } from '../drag';

function makeElements() {
  const handle = document.createElement('div');
  const host = document.createElement('div');
  host.getBoundingClientRect = () => ({ left: 50, top: 50, width: 200, height: 100, right: 250, bottom: 150, x: 50, y: 50, toJSON: () => {} } as DOMRect);
  return { handle, host };
}

function fire(target: EventTarget, type: string, init: PointerEventInit = {}) {
  target.dispatchEvent(new PointerEvent(type, { bubbles: true, ...init }));
}

describe('setupDrag', () => {
  it('moves host on pointer drag', () => {
    const { handle, host } = makeElements();
    setupDrag({ handle, host });

    fire(handle, 'pointerdown', { clientX: 100, clientY: 100 });
    fire(document, 'pointermove', { clientX: 150, clientY: 130 });
    fire(document, 'pointerup');

    // offsetX = 100 - 50 = 50, desiredLeft = 150 - 50 = 100
    // offsetY = 100 - 50 = 50, desiredTop = 130 - 50 = 80
    expect(host.style.left).toBe('100px');
    expect(host.style.top).toBe('80px');
  });

  it('does not move when disabled', () => {
    const { handle, host } = makeElements();
    setupDrag({ handle, host, disabled: () => true });

    fire(handle, 'pointerdown', { clientX: 100, clientY: 100 });
    fire(document, 'pointermove', { clientX: 200, clientY: 200 });
    fire(document, 'pointerup');

    expect(host.style.left).toBe('');
    expect(host.style.top).toBe('');
  });

  it('clamps to bounds', () => {
    const { handle, host } = makeElements();
    setupDrag({ handle, host, getBounds: () => ({ maxLeft: 50, maxTop: 30 }) });

    fire(handle, 'pointerdown', { clientX: 100, clientY: 100 });
    fire(document, 'pointermove', { clientX: 999, clientY: 999 });
    fire(document, 'pointerup');

    expect(parseInt(host.style.left)).toBeLessThanOrEqual(50);
    expect(parseInt(host.style.top)).toBeLessThanOrEqual(30);
  });

  it('clamps to minimum 0', () => {
    const { handle, host } = makeElements();
    setupDrag({ handle, host, getBounds: () => ({ maxLeft: 500, maxTop: 500 }) });

    fire(handle, 'pointerdown', { clientX: 100, clientY: 100 });
    fire(document, 'pointermove', { clientX: -999, clientY: -999 });
    fire(document, 'pointerup');

    expect(parseInt(host.style.left)).toBe(0);
    expect(parseInt(host.style.top)).toBe(0);
  });

  it('calls onStart with host rect', () => {
    const { handle, host } = makeElements();
    const onStart = vi.fn();
    setupDrag({ handle, host, onStart });

    fire(handle, 'pointerdown', { clientX: 100, clientY: 100 });
    expect(onStart).toHaveBeenCalledWith(expect.objectContaining({ left: 50, top: 50 }));
    fire(document, 'pointerup');
  });

  it('excludes clicks on excluded selector', () => {
    const { handle, host } = makeElements();
    const inner = document.createElement('button');
    inner.className = 'controls';
    handle.appendChild(inner);
    setupDrag({ handle, host, exclude: '.controls' });

    fire(inner, 'pointerdown', { clientX: 100, clientY: 100 });
    fire(document, 'pointermove', { clientX: 200, clientY: 200 });
    fire(document, 'pointerup');

    expect(host.style.left).toBe('');
  });

  it('cleanup removes listeners', () => {
    const { handle, host } = makeElements();
    const cleanup = setupDrag({ handle, host });
    cleanup();

    fire(handle, 'pointerdown', { clientX: 100, clientY: 100 });
    fire(document, 'pointermove', { clientX: 200, clientY: 200 });
    fire(document, 'pointerup');

    expect(host.style.left).toBe('');
  });
});
