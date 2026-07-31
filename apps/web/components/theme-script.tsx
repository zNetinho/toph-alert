const THEME_INIT_SCRIPT = `(function(){
  try {
    var stored = localStorage.getItem('toph-theme');
    var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    var theme = stored || (prefersLight ? 'light' : 'dark');
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  } catch (_) {
    document.documentElement.classList.add('dark');
  }
})();`;

/** Inline before paint — avoids flash; persists via localStorage `toph-theme`. */
export function ThemeScript() {
  return (
    <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} suppressHydrationWarning />
  );
}
