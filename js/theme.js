(function () {
  const STORAGE_KEY = 'theme';
  const saved = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(initial);

  // Cuando el DOM está listo
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('themeToggle');
    if (btn) {
      updateToggleLabel();
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
        updateToggleLabel();
      });
    }
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    // Cambia la navbar
    document.querySelectorAll('.navbar').forEach(nav => {
      nav.classList.remove('navbar-dark','bg-dark','navbar-light','bg-light');
      if (theme === 'dark') {
        nav.classList.add('navbar-dark','bg-dark');
      } else {
        nav.classList.add('navbar-light','bg-light');
      }
    });
  }

  function updateToggleLabel(){
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    const dark = theme === 'dark';
    btn.textContent = dark ? '🌙' : '☀️';
    btn.classList.remove('btn-outline-light','btn-outline-dark');
    btn.classList.add(dark ? 'btn-outline-light' : 'btn-outline-dark');
    btn.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  }
})();