window.addEventListener('load', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  document.dispatchEvent(new CustomEvent('dreamdesk-theme-changed', { 
    detail: { theme: currentTheme }
  }));
  document.body.style.background = 'var(--app-color)';
});

const toggle = document.querySelector('dreamdesk-toggle');
toggle.addEventListener('toggle-changed', (e) => {
  const checked = e.detail.checked;
  const theme = checked ? 'dark' : 'pastelcore';
  document.documentElement.setAttribute('data-theme', theme);
  document.dispatchEvent(new CustomEvent('dreamdesk-theme-changed', { 
    detail: { theme }
  }));
  if (theme === 'dark') {
    document.body.style.background = '#242426';
    document.body.style.color = '#3ff10b';
  } else {
    document.body.style.background = 'var(--app-color)';
    document.body.style.color = 'var(--black)';
  }
});


const bars = document.querySelectorAll("dreamdesk-progress-bar");

let progress = 0;
const interval = setInterval(() => {
  progress += Math.random() * 5;
  if (progress >= 100) {
    progress = 100;
    clearInterval(interval);
  }

  bars.forEach((bar) => bar.setAttribute("value", progress.toFixed(1)));
}, 200);
