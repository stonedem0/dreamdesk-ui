import { describe, it, expect, vi } from 'vitest';
import { WindowManager } from '../windowManager';

function makeEl() {
  return { style: { zIndex: '' } } as unknown as HTMLElement;
}

describe('WindowManager', () => {
  it('registers windows and assigns z-index', () => {
    const wm = new WindowManager();
    const el = makeEl();
    wm.register('a', el, 'Window A');
    expect(parseInt(el.style.zIndex)).toBeGreaterThanOrEqual(1000);
  });

  it('raises window to top of z-stack', () => {
    const wm = new WindowManager();
    const elA = makeEl(), elB = makeEl();
    wm.register('a', elA, 'A');
    wm.register('b', elB, 'B');
    wm.raise('a');
    expect(parseInt(elA.style.zIndex)).toBeGreaterThan(parseInt(elB.style.zIndex));
  });

  it('unregisters window and removes from stack', () => {
    const wm = new WindowManager();
    const el = makeEl();
    wm.register('a', el, 'A');
    wm.unregister('a');
    expect(wm.getWindows()).toHaveLength(0);
  });

  it('marks window as minimized', () => {
    const wm = new WindowManager();
    wm.register('a', makeEl(), 'A');
    wm.minimize('a');
    expect(wm.getWindows()[0].isMinimized).toBe(true);
  });

  it('restores minimized window and raises it', () => {
    const wm = new WindowManager();
    const elA = makeEl(), elB = makeEl();
    wm.register('a', elA, 'A');
    wm.register('b', elB, 'B');
    wm.minimize('a');
    wm.restore('a');
    expect(wm.getWindows().find(w => w.id === 'a')?.isMinimized).toBe(false);
    expect(parseInt(elA.style.zIndex)).toBeGreaterThan(parseInt(elB.style.zIndex));
  });

  it('notifies subscribers on register/unregister/minimize/restore', () => {
    const wm = new WindowManager();
    const listener = vi.fn();
    wm.subscribe(listener);
    wm.register('a', makeEl(), 'A');
    expect(listener).toHaveBeenCalledTimes(1);
    wm.minimize('a');
    expect(listener).toHaveBeenCalledTimes(2);
    wm.restore('a');
    expect(listener).toHaveBeenCalledTimes(3);
    wm.unregister('a');
    expect(listener).toHaveBeenCalledTimes(4);
  });

  it('unsubscribe stops notifications', () => {
    const wm = new WindowManager();
    const listener = vi.fn();
    const unsub = wm.subscribe(listener);
    unsub();
    wm.register('a', makeEl(), 'A');
    expect(listener).not.toHaveBeenCalled();
  });

  it('getWindows returns all registered entries', () => {
    const wm = new WindowManager();
    wm.register('a', makeEl(), 'A');
    wm.register('b', makeEl(), 'B');
    expect(wm.getWindows()).toHaveLength(2);
  });
});
