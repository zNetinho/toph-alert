'use client';

export function ThemeToggle() {
  function toggleTheme() {
    const html = document.documentElement;
    const current = html.classList.contains('light') ? 'light' : 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    html.classList.remove('dark', 'light');
    html.classList.add(next);
    localStorage.setItem('toph-theme', next);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="w-full rounded-lg border border-border px-3 py-2 font-body text-caption font-medium text-text-muted hover:border-accent hover:text-accent"
    >
      Toggle theme
    </button>
  );
}
