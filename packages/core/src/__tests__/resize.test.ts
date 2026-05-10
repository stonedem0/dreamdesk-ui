import { describe, it, expect } from 'vitest';
import { setupResize } from '../resize';

function makeElements() {
  const handle = document.createElement('div');
  const host = document.createElement('div');
  host.getBoundingClientRect = () => ({ left: 0, top: 0, width: 300, height: 200, right: 300, bottom: 200, x: 0, y: 0, toJSON: () => {} } as DOMRect);
  return { handle, host };
}

function fire(target: EventTarget, type: string, init: PointerEventInit = {}) {
  target.dispatchEvent(new PointerEvent(type, { bubbles: true, ...init }));
}

describe('setupResize', () => {
  it('resizes host on drag', () => {
    const { handle, host } = makeElements();
    setupResize({ handle, host });

    fire(handle, 'pointerdown', { clientX: 300, clientY: 200 });
    fire(document, 'pointermove', { clientX: 350, clientY: 250 });
    fire(document, 'pointerup');

    expect(host.style.getPropertyValue('--ddw-w')).toBe('350px');
    expect(host.style.getPropertyValue('--ddw-h')).toBe('250px');
  });

  it('respects minWidth and minHeight', () => {
    const { handle, host } = makeElements();
    setupResize({ handle, host, minWidth: 200, minHeight: 150 });

    fire(handle, 'pointerdown', { clientX: 300, clientY: 200 });
    fire(document, 'pointermove', { clientX: 50, clientY: 50 });
    fire(document, 'pointerup');

    expect(host.style.getPropertyValue('--ddw-w')).toBe('200px');
    expect(host.style.getPropertyValue('--ddw-h')).toBe('150px');
  });

  it('does not resize when disabled', () => {
    const { handle, host } = makeElements();
    setupResize({ handle, host, disabled: () => true });

    fire(handle, 'pointerdown', { clientX: 300, clientY: 200 });
    fire(document, 'pointermove', { clientX: 400, clientY: 300 });
    fire(document, 'pointerup');

    expect(host.style.getPropertyValue('--ddw-w')).toBe('');
  });

  it('sets explicitAttr on resize', () => {
    const { handle, host } = makeElements();
    setupResize({ handle, host, explicitAttr: 'data-ddw-explicit' });

    fire(handle, 'pointerdown', { clientX: 300, clientY: 200 });
    fire(document, 'pointermove', { clientX: 350, clientY: 250 });
    fire(document, 'pointerup');

    expect(host.hasAttribute('data-ddw-explicit')).toBe(true);
  });

  it('cleanup removes listeners', () => {
    const { handle, host } = makeElements();
    const cleanup = setupResize({ handle, host });
    cleanup();

    fire(handle, 'pointerdown', { clientX: 300, clientY: 200 });
    fire(document, 'pointermove', { clientX: 400, clientY: 300 });
    fire(document, 'pointerup');

    expect(host.style.getPropertyValue('--ddw-w')).toBe('');
  });
});
