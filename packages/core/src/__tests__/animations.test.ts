import { describe, it, expect, vi, beforeAll } from 'vitest';
import { open, close, minimize, unminimize, fullscreen, unfullscreen, unsnap, cancelRunningAnimations } from '../animations';

const PREV = { top: 50, left: 80, width: 400, height: 300, position: 'absolute', zIndex: '1002' };

function makeWin(): HTMLElement {
  const el = document.createElement('div');
  return el;
}

// happy-dom doesn't implement Web Animations API
beforeAll(() => {
  if (!HTMLElement.prototype.animate) {
    HTMLElement.prototype.animate = function (_keyframes, _opts) {
      const anim: any = {
        cancel: vi.fn(),
        onfinish: null,
        oncancel: null,
        getAnimations: () => [],
      };
      queueMicrotask(() => anim.onfinish?.());
      return anim;
    };
  }
  if (!HTMLElement.prototype.getAnimations) {
    HTMLElement.prototype.getAnimations = () => [];
  }
});

describe('open', () => {
  it('calls animate on the element', () => {
    const win = makeWin();
    const spy = vi.spyOn(win, 'animate');
    open(win);
    expect(spy).toHaveBeenCalledOnce();
  });

  it('sets transformOrigin before animating', () => {
    const win = makeWin();
    open(win);
    expect(win.style.transformOrigin).toBe('50% 50%');
  });
});

describe('minimize', () => {
  it('calls animate on the element', () => {
    const win = makeWin();
    const spy = vi.spyOn(win, 'animate');
    minimize(win);
    expect(spy).toHaveBeenCalledOnce();
  });

  it('sets transformOrigin to bottom-center', () => {
    const win = makeWin();
    minimize(win);
    expect(win.style.transformOrigin).toBe('50% 100%');
  });
});

describe('unminimize', () => {
  it('calls animate on the element', () => {
    const win = makeWin();
    const spy = vi.spyOn(win, 'animate');
    unminimize(win);
    expect(spy).toHaveBeenCalledOnce();
  });
});

describe('close', () => {
  it('calls animate on the element', () => {
    const win = makeWin();
    const spy = vi.spyOn(win, 'animate');
    close(win);
    expect(spy).toHaveBeenCalledOnce();
  });

  it('fires onfinish callback after animation completes', async () => {
    const win = makeWin();
    const onfinish = vi.fn();
    close(win, onfinish);
    await new Promise((r) => queueMicrotask(r as any));
    expect(onfinish).toHaveBeenCalledOnce();
  });

  it('works without an onfinish callback', async () => {
    const win = makeWin();
    await expect(
      new Promise<void>((resolve) => {
        close(win);
        queueMicrotask(resolve);
      })
    ).resolves.toBeUndefined();
  });
});

describe('fullscreen', () => {
  it('sets element to fixed positioning', () => {
    const win = makeWin();
    fullscreen(win, PREV);
    expect(win.style.position).toBe('fixed');
    expect(win.style.top).toBe('0px');
    expect(win.style.left).toBe('0px');
  });

  it('sets zIndex to 9999', () => {
    const win = makeWin();
    fullscreen(win, PREV);
    expect(win.style.zIndex).toBe('9999');
  });

  it('sets width and height to 100vw/100vh', () => {
    const win = makeWin();
    fullscreen(win, PREV);
    expect(win.style.width).toBe('100vw');
    expect(win.style.height).toBe('100vh');
  });

  it('calls animate', () => {
    const win = makeWin();
    const spy = vi.spyOn(win, 'animate');
    fullscreen(win, PREV);
    expect(spy).toHaveBeenCalledOnce();
  });
});

describe('unfullscreen', () => {
  it('restores position, top, and left after animation', async () => {
    const win = makeWin();
    unfullscreen(win, PREV);
    await new Promise((r) => queueMicrotask(r as any));
    expect(win.style.position).toBe('absolute');
    expect(win.style.top).toBe('50px');
    expect(win.style.left).toBe('80px');
  });

  it('restores zIndex after animation', async () => {
    const win = makeWin();
    unfullscreen(win, PREV);
    await new Promise((r) => queueMicrotask(r as any));
    expect(win.style.zIndex).toBe('1002');
  });

  it('sets CSS dimension vars after animation', async () => {
    const win = makeWin();
    unfullscreen(win, PREV);
    await new Promise((r) => queueMicrotask(r as any));
    expect(win.style.getPropertyValue('--ddw-w')).toBe('400px');
    expect(win.style.getPropertyValue('--ddw-h')).toBe('300px');
  });
});

describe('unsnap', () => {
  it('calls animate on the element', () => {
    const win = makeWin();
    const spy = vi.spyOn(win, 'animate');
    const fromRect = new DOMRect(0, 0, 400, 300);
    unsnap(win, fromRect);
    expect(spy).toHaveBeenCalledOnce();
  });
});

describe('cancelRunningAnimations', () => {
  it('calls cancel on each running animation', () => {
    const cancelA = vi.fn();
    const cancelB = vi.fn();
    const el = document.createElement('div');
    el.getAnimations = () => [{ cancel: cancelA }, { cancel: cancelB }] as any;
    cancelRunningAnimations(el);
    expect(cancelA).toHaveBeenCalledOnce();
    expect(cancelB).toHaveBeenCalledOnce();
  });

  it('does not throw when getAnimations is not available', () => {
    const el = {} as HTMLElement;
    expect(() => cancelRunningAnimations(el)).not.toThrow();
  });
});
