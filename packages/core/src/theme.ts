export type DreamDeskTheme = 'default' | 'pastelcore' | 'dark';

export const DreamDeskThemeManager = {
  current: 'default' as DreamDeskTheme,

  setTheme(theme: DreamDeskTheme): void {
    this.current = theme;
    document.documentElement.setAttribute('data-theme', theme);
    document.dispatchEvent(new CustomEvent('dreamdesk-theme-changed', { detail: { theme } }));
  },

  getTheme(): DreamDeskTheme {
    return this.current;
  },
};
