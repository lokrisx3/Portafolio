const storageKey = 'portfolio-theme'

export function getInitialTheme() {
  try {
    const saved = localStorage.getItem(storageKey)
    if (saved === 'light' || saved === 'dark') return saved
  } catch { /* The theme still works when storage is unavailable. */ }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
}

export function saveTheme(theme) {
  applyTheme(theme)
  try {
    localStorage.setItem(storageKey, theme)
  } catch { /* Keep the selection for the current visit. */ }
}
