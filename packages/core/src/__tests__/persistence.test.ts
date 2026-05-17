import { describe, it, expect, beforeEach } from 'vitest';
import { saveWindowState, loadWindowState, clearWindowState } from '../persistence';

beforeEach(() => {
  localStorage.clear();
});

describe('saveWindowState / loadWindowState', () => {
  it('returns null when nothing saved', () => {
    expect(loadWindowState('win-1')).toBeNull();
  });

  it('round-trips a full state object', () => {
    const state = { left: '120px', top: '80px', width: '400px', height: '300px', isOpen: true, isMinimized: false };
    saveWindowState('win-1', state);
    expect(loadWindowState('win-1')).toEqual(state);
  });

  it('round-trips a partial state object', () => {
    saveWindowState('win-1', { isOpen: false });
    expect(loadWindowState('win-1')).toEqual({ isOpen: false });
  });

  it('isolates state by window id', () => {
    saveWindowState('win-a', { left: '10px' });
    saveWindowState('win-b', { left: '99px' });
    expect(loadWindowState('win-a')?.left).toBe('10px');
    expect(loadWindowState('win-b')?.left).toBe('99px');
  });

  it('overwrites previous state for the same id', () => {
    saveWindowState('win-1', { left: '10px', isOpen: true });
    saveWindowState('win-1', { left: '50px', isOpen: false });
    const state = loadWindowState('win-1');
    expect(state?.left).toBe('50px');
    expect(state?.isOpen).toBe(false);
  });

  it('preserves boolean false values', () => {
    saveWindowState('win-1', { isOpen: false, isMinimized: false });
    const state = loadWindowState('win-1');
    expect(state?.isOpen).toBe(false);
    expect(state?.isMinimized).toBe(false);
  });
});

describe('clearWindowState', () => {
  it('removes saved state for the given id', () => {
    saveWindowState('win-1', { isOpen: true });
    clearWindowState('win-1');
    expect(loadWindowState('win-1')).toBeNull();
  });

  it('does not affect other windows', () => {
    saveWindowState('win-a', { isOpen: true });
    saveWindowState('win-b', { isOpen: false });
    clearWindowState('win-a');
    expect(loadWindowState('win-a')).toBeNull();
    expect(loadWindowState('win-b')).not.toBeNull();
  });

  it('is a no-op when nothing is saved', () => {
    expect(() => clearWindowState('nonexistent')).not.toThrow();
  });
});
