import { describe, it, expect } from 'vitest';
import { detectSnapZone, snapRect } from '../snap';

const W = 1000;
const H = 800;

describe('detectSnapZone', () => {
  it('returns none for center', () => {
    expect(detectSnapZone(500, 400, W, H)).toBe('none');
  });

  it('returns none just outside left threshold', () => {
    expect(detectSnapZone(21, 400, W, H)).toBe('none');
  });

  it('returns left at left edge', () => {
    expect(detectSnapZone(0, 400, W, H)).toBe('left');
  });

  it('returns left at exactly the threshold', () => {
    expect(detectSnapZone(20, 400, W, H)).toBe('left');
  });

  it('returns right at right edge', () => {
    expect(detectSnapZone(1000, 400, W, H)).toBe('right');
  });

  it('returns right at right threshold', () => {
    expect(detectSnapZone(980, 400, W, H)).toBe('right');
  });

  it('returns top at top edge', () => {
    expect(detectSnapZone(500, 0, W, H)).toBe('top');
  });

  it('returns top-left at top-left corner', () => {
    expect(detectSnapZone(0, 0, W, H)).toBe('top-left');
  });

  it('returns top-left within corner threshold', () => {
    expect(detectSnapZone(79, 0, W, H)).toBe('top-left');
  });

  it('returns top-right at top-right corner', () => {
    expect(detectSnapZone(1000, 0, W, H)).toBe('top-right');
  });

  it('returns top-right within corner threshold', () => {
    expect(detectSnapZone(921, 0, W, H)).toBe('top-right');
  });

  it('returns bottom-left at bottom-left corner', () => {
    expect(detectSnapZone(0, 800, W, H)).toBe('bottom-left');
  });

  it('returns bottom-right at bottom-right corner', () => {
    expect(detectSnapZone(1000, 800, W, H)).toBe('bottom-right');
  });

  it('corners take priority over top edge', () => {
    // x within corner threshold AND near top → corner wins
    expect(detectSnapZone(50, 0, W, H)).toBe('top-left');
    expect(detectSnapZone(950, 0, W, H)).toBe('top-right');
  });

  it('top edge wins when x is outside corner threshold', () => {
    expect(detectSnapZone(200, 0, W, H)).toBe('top');
  });
});

describe('snapRect', () => {
  it('top returns full width and height', () => {
    expect(snapRect('top', W, H)).toEqual({ top: 0, left: 0, width: W, height: H });
  });

  it('left returns left half', () => {
    expect(snapRect('left', W, H)).toEqual({ top: 0, left: 0, width: W / 2, height: H });
  });

  it('right returns right half', () => {
    expect(snapRect('right', W, H)).toEqual({ top: 0, left: W / 2, width: W / 2, height: H });
  });

  it('top-left returns top-left quarter', () => {
    expect(snapRect('top-left', W, H)).toEqual({ top: 0, left: 0, width: W / 2, height: H / 2 });
  });

  it('top-right returns top-right quarter', () => {
    expect(snapRect('top-right', W, H)).toEqual({ top: 0, left: W / 2, width: W / 2, height: H / 2 });
  });

  it('bottom-left returns bottom-left quarter', () => {
    expect(snapRect('bottom-left', W, H)).toEqual({ top: H / 2, left: 0, width: W / 2, height: H / 2 });
  });

  it('bottom-right returns bottom-right quarter', () => {
    expect(snapRect('bottom-right', W, H)).toEqual({ top: H / 2, left: W / 2, width: W / 2, height: H / 2 });
  });

  it('none returns null', () => {
    expect(snapRect('none', W, H)).toBeNull();
  });

  it('left + right rects tile without gap', () => {
    const left = snapRect('left', W, H)!;
    const right = snapRect('right', W, H)!;
    expect(left.left + left.width).toBe(right.left);
  });

  it('top-left + top-right + bottom-left + bottom-right cover full area', () => {
    const tl = snapRect('top-left', W, H)!;
    const tr = snapRect('top-right', W, H)!;
    const bl = snapRect('bottom-left', W, H)!;
    const br = snapRect('bottom-right', W, H)!;
    const totalArea = tl.width * tl.height + tr.width * tr.height + bl.width * bl.height + br.width * br.height;
    expect(totalArea).toBe(W * H);
  });
});
