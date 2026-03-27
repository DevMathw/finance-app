/**
 * Button.jsx — Obsidian Finance
 * Botón premium con 5 variantes, ícono, loading y ripple effect.
 */
import { forwardRef } from 'react'
import styles from './Button.module.css'

const Button = forwardRef(({
  children,
  variant   = 'primary',  // primary | secondary | ghost | danger | lime
  size      = 'md',       // sm | md | lg
  loading   = false,
  fullWidth = false,
  icon,                   // ReactNode — ícono a la izquierda
  iconRight,              // ReactNode — ícono a la derecha
  className = '',
  ...props
}, ref) => {
  const cls = [
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth ? styles.full : '',
    loading   ? styles.loading : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button ref={ref} className={cls} disabled={loading || props.disabled} {...props}>
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        <>
          {icon      && <span className={styles.iconL} aria-hidden="true">{icon}</span>}
          <span>{children}</span>
          {iconRight && <span className={styles.iconR} aria-hidden="true">{iconRight}</span>}
        </>
      )}
    </button>
  )
})

Button.displayName = 'Button'
export default Button