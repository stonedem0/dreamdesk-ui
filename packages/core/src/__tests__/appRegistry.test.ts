import { describe, it, expect } from 'vitest';
import { AppRegistry } from '../appRegistry';

describe('AppRegistry', () => {
  it('registers and retrieves an app by id', () => {
    const reg = new AppRegistry();
    reg.register({ id: 'notepad', title: 'Notepad' });
    expect(reg.get('notepad')).toEqual({ id: 'notepad', title: 'Notepad' });
  });

  it('returns undefined for unknown id', () => {
    const reg = new AppRegistry();
    expect(reg.get('ghost')).toBeUndefined();
  });

  it('getAll returns all registered apps', () => {
    const reg = new AppRegistry();
    reg.register({ id: 'a', title: 'App A' });
    reg.register({ id: 'b', title: 'App B' });
    const all = reg.getAll();
    expect(all).toHaveLength(2);
    expect(all.map((a) => a.id)).toEqual(expect.arrayContaining(['a', 'b']));
  });

  it('getAll returns empty array when nothing registered', () => {
    const reg = new AppRegistry();
    expect(reg.getAll()).toEqual([]);
  });

  it('overwriting an id replaces the previous entry', () => {
    const reg = new AppRegistry();
    reg.register({ id: 'notepad', title: 'Notepad v1' });
    reg.register({ id: 'notepad', title: 'Notepad v2' });
    expect(reg.get('notepad')?.title).toBe('Notepad v2');
    expect(reg.getAll()).toHaveLength(1);
  });

  it('stores optional fields', () => {
    const reg = new AppRegistry();
    reg.register({ id: 'paint', title: 'Paint', icon: 'paint.svg', defaultWidth: '800px', defaultHeight: '600px' });
    const app = reg.get('paint');
    expect(app?.icon).toBe('paint.svg');
    expect(app?.defaultWidth).toBe('800px');
    expect(app?.defaultHeight).toBe('600px');
  });
});
