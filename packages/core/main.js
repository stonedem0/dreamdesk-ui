window.addEventListener('load', () => {
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    document.dispatchEvent(new CustomEvent('dreamdesk-theme-changed', { detail: { theme } }));
    document.body.style.background = theme === 'vista'
      ? 'var(--app-color, #eaf4ff)'
      : 'var(--app-color, #fff5fa)';
    document.body.style.color = theme === 'vista'
      ? 'var(--color-text, #0f1b2b)'
      : 'var(--black)';
  };

  // Dispatch initial theme so components initialise correctly
  applyTheme(document.documentElement.getAttribute('data-theme') || 'pastelcore');

  // Theme toggle (pastelcore ↔ vista)
  const setupThemeToggle = () => {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    toggle.addEventListener('toggle-changed', (e) => {
      applyTheme(e.detail?.checked ? 'vista' : 'pastelcore');
    });
  };

  // Demo toggle (standalone)
  const setupDemoToggle = () => {
    const toggle = document.getElementById('demo-toggle');
    if (!toggle) return;
    toggle.addEventListener('toggle-changed', () => {});
  };

  // Progress bars
  const setupProgressBars = () => {
    const bars = document.querySelectorAll('dreamdesk-progress-bar');
    if (!bars.length) return;
    let progress = 0;
    let rafId = null;
    const tick = () => {
      progress = Math.min(100, progress + Math.random() * 0.8);
      bars.forEach((bar) => bar.setAttribute('value', progress.toFixed(1)));
      if (progress < 100 && !document.hidden) rafId = requestAnimationFrame(tick);
    };
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { if (rafId) cancelAnimationFrame(rafId); }
      else if (progress < 100) rafId = requestAnimationFrame(tick);
    });
    rafId = requestAnimationFrame(tick);
  };

  if (customElements?.whenDefined) {
    customElements.whenDefined('dreamdesk-toggle').then(() => {
      setupThemeToggle();
      setupDemoToggle();
    });
  } else {
    setupThemeToggle();
    setupDemoToggle();
  }

  setupProgressBars();
});
