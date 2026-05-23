import { describe, it, expect, vi, beforeAll } from 'vitest';
import { open, close, minimize, unminimize, cancelRunningAnimations } from '../animations';

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
