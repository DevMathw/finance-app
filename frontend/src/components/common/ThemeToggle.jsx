import { Sun, Moon }  from 'lucide-react'
import { useTheme }   from '../../hooks/useTheme'
import styles         from './ThemeToggle.module.css'

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme()
  return (
    <button
      className={`${styles.btn} ${isDark ? styles.dark : ''}`}
      onClick={toggle}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {isDark
        ? <Sun  size={15} strokeWidth={2} />
        : <Moon size={15} strokeWidth={2} />
      }
    </button>
  )
}