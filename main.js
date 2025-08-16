window.addEventListener('load', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  document.dispatchEvent(new CustomEvent('dreamdesk-theme-changed', { 
    detail: { theme: currentTheme }
  }));
  document.body.style.background = 'var(--app-color, #fff5fa)';

  const setupToggle = () => {
    const toggle = document.querySelector('dreamdesk-toggle');
    if (!toggle) return; 
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

window.DreamDeskAnimations = {
  customFullscreen(el, { isFullscreen, previousState }) {
    const rect = el.getBoundingClientRect();
    const fromW = rect.width;
    const fromH = rect.height;
    const toW = isFullscreen && previousState ? previousState.width : 400;
    const toH = isFullscreen && previousState ? previousState.height : 400;

    const anim = el.animate(
      [
        { width: `${fromW}px`, height: `${fromH}px` },
        { width: `${toW}px`, height: `${toH}px` }
      ],
      { duration: 300, easing: 'ease-in-out', fill: 'forwards' }
    );
    return anim.finished.then(() => {
      el.style.width = `${toW}px`;
      el.style.height = `${toH}px`;
    });
  },
};

// Use the same behavior when leaving fullscreen
window.DreamDeskAnimations.customUnfullscreen = window.DreamDeskAnimations.customFullscreen;

