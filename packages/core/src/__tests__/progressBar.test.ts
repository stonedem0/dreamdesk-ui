import { describe, it, expect } from 'vitest';
import { setupProgressBar } from '../progressBar';

function makeTrack(width = 220) {
  const track = document.createElement('div');
  Object.defineProperty(track, 'getBoundingClientRect', {
    value: () => ({ width, left: 0, top: 0, right: width, bottom: 20, height: 20, x: 0, y: 0, toJSON: () => {} }),
  });
  return track;
}

describe('setupProgressBar', () => {
  describe('blocky mode', () => {
    it('builds segments filling the track', () => {
      const track = makeTrack(220);
      let value = 0;
      const handle = setupProgressBar({
        track,
        getValue: () => value,
        isBlocky: () => true,
        isGradient: () => false,
      });
      handle.rebuild();

      const segments = track.querySelectorAll('.progress-segment');
      expect(segments.length).toBeGreaterThan(0);
    });

    it('toggles progress-segment--active based on value', () => {
      const track = makeTrack(220);
      let value = 50;
      const handle = setupProgressBar({
        track,
        getValue: () => value,
        isBlocky: () => true,
        isGradient: () => false,
      });
      handle.rebuild();

      const segments = Array.from(track.querySelectorAll('.progress-segment'));
      const activeCount = segments.filter(s => s.classList.contains('progress-segment--active')).length;
      expect(activeCount).toBe(Math.floor(0.5 * segments.length));
    });

    it('update() changes active segments', () => {
      const track = makeTrack(220);
      let value = 0;
      const handle = setupProgressBar({
        track,
        getValue: () => value,
        isBlocky: () => true,
        isGradient: () => false,
      });
      handle.rebuild();

      handle.update(100);
      const segments = Array.from(track.querySelectorAll('.progress-segment'));
      const allActive = segments.every(s => s.classList.contains('progress-segment--active'));
      expect(allActive).toBe(true);
    });

    it('adds progress-track--gradient class for gradient blocky', () => {
      const track = makeTrack(220);
      const handle = setupProgressBar({
        track,
        getValue: () => 0,
        isBlocky: () => true,
        isGradient: () => true,
      });
      handle.rebuild();
      expect(track.classList.contains('progress-track--gradient')).toBe(true);
    });
  });

  describe('continuous mode', () => {
    it('sets bar width from value', () => {
      const track = makeTrack(220);
      track.innerHTML = '<div class="progress-bar"></div>';
      const handle = setupProgressBar({
        track,
        getValue: () => 75,
        isBlocky: () => false,
        isGradient: () => false,
      });
      handle.rebuild();

      const bar = track.querySelector<HTMLElement>('.progress-bar')!;
      expect(bar.style.width).toBe('75%');
    });

    it('adds progress-bar--complete at 100', () => {
      const track = makeTrack(220);
      track.innerHTML = '<div class="progress-bar"></div>';
      const handle = setupProgressBar({
        track,
        getValue: () => 100,
        isBlocky: () => false,
        isGradient: () => false,
      });
      handle.rebuild();

      const bar = track.querySelector<HTMLElement>('.progress-bar')!;
      expect(bar.classList.contains('progress-bar--complete')).toBe(true);
    });

    it('clamps value between 0 and 100', () => {
      const track = makeTrack(220);
      track.innerHTML = '<div class="progress-bar"></div>';
      const handle = setupProgressBar({
        track,
        getValue: () => 0,
        isBlocky: () => false,
        isGradient: () => false,
      });
      handle.rebuild();

      handle.update(-50);
      expect(track.querySelector<HTMLElement>('.progress-bar')!.style.width).toBe('0%');

      handle.update(150);
      expect(track.querySelector<HTMLElement>('.progress-bar')!.style.width).toBe('100%');
    });
  });

  it('destroy disconnects resize observer without throwing', () => {
    const track = makeTrack(220);
    const handle = setupProgressBar({
      track,
      getValue: () => 0,
      isBlocky: () => true,
      isGradient: () => false,
    });
    handle.rebuild();
    expect(() => handle.destroy()).not.toThrow();
  });
});
