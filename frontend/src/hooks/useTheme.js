/**
 * useTheme.js
 * ─────────────────────────────────────────────────────────────
 * Maneja el modo claro/oscuro.
 * - Modo CLARO por defecto
 * - Lee preferencia guardada en localStorage
 * - Aplica data-theme="dark" al <html> cuando está en oscuro
 * - El CSS en tokens.css reacciona a ese atributo
 */

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'fz-theme'

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    // 1. Preferencia guardada por el usuario
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'dark' || saved === 'light') return saved

    // 2. Preferencia del sistema operativo
    // Si el sistema está en oscuro, arrancar en oscuro
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'

    // 3. Claro por defecto
    return 'light'
  })

  useEffect(() => {
    const root = document.documentElement

    if (theme === 'dark') {
      // Activa el selector [data-theme="dark"] en tokens.css
      root.setAttribute('data-theme', 'dark')
    } else {
      // Quita el atributo → vuelven las variables de :root (modo claro)
      root.removeAttribute('data-theme')
    }

    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return { theme, toggle, isDark: theme === 'dark' }
}