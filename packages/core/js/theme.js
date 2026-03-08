// Global theme configuration
const DreamDeskTheme = {
  current: 'default',
  setTheme(theme) {
    this.current = theme;
    document.documentElement.setAttribute('data-theme', theme);
    document.dispatchEvent(new CustomEvent('dreamdesk-theme-changed', {
      detail: { theme: this.current }
    }));
  },
  getTheme() {
    return this.current;
  }
};