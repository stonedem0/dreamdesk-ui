window.addEventListener('load', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  document.dispatchEvent(new CustomEvent('dreamdesk-theme-changed', { 
    detail: { theme: currentTheme }
  }));
  document.body.style.background = 'var(--app-color, #fff5fa)';

  // Setup toggle safely after DOM and custom elements are ready
  const setupToggle = () => {
    const toggle = document.querySelector('dreamdesk-toggle');
    if (!toggle) return; // not present on this page
    toggle.addEventListener('toggle-changed', (e) => {
      const checked = e.detail?.checked;
      const theme = checked ? 'dark' : 'pastelcore';
      document.documentElement.setAttribute('data-theme', theme);
      document.dispatchEvent(new CustomEvent('dreamdesk-theme-changed', { detail: { theme } }));
      if (theme === 'dark') {
        document.body.style.background = '#242426';
        document.body.style.color = '#3ff10b';
      } else {
        document.body.style.background = 'var(--app-color, #fff5fa)';
        document.body.style.color = 'var(--black)';
      }
    }, { once: false });
  };

  if (customElements?.whenDefined) {
    customElements.whenDefined('dreamdesk-toggle').then(setupToggle).catch(setupToggle);
  } else {
    setupToggle();
  }

  // Progress bars demo: rAF loop with page visibility pause
  const bars = document.querySelectorAll('dreamdesk-progress-bar');
  if (bars.length) {
    let progress = 0;
    let rafId = null;

    const tick = () => {
      progress = Math.min(100, progress + Math.random() * 0.8);
      bars.forEach((bar) => bar.setAttribute('value', progress.toFixed(1)));
      if (progress < 100 && !document.hidden) rafId = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      if (document.hidden) {
        if (rafId) cancelAnimationFrame(rafId);
      } else if (progress < 100) {
        rafId = requestAnimationFrame(tick);
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    rafId = requestAnimationFrame(tick);
  }
});
