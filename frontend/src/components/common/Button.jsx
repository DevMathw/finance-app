/**
 * Button.jsx — Editorial Finance
 * Usa las clases globales del design system (.btn, .btn-primary, etc.)
 * CSS Modules solo para el spinner interno.
 */
import { forwardRef } from 'react'

const Button = forwardRef(({
  children,
  variant   = 'primary',  // primary | secondary | ghost | danger
  size      = 'md',       // sm | md | lg
  loading   = false,
  fullWidth = false,
  icon,
  iconRight,
  className = '',
  ...props
}, ref) => {
  const cls = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full' : '',
    loading   ? 'btn-loading' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button
      ref={ref}
      className={cls}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="btn-spinner" aria-hidden="true" />
      ) : (
        <>
          {icon      && <span aria-hidden="true" style={{ display:'flex', alignItems:'center' }}>{icon}</span>}
          <span>{children}</span>
          {iconRight && <span aria-hidden="true" style={{ display:'flex', alignItems:'center', opacity:0.75 }}>{iconRight}</span>}
        </>
      )}
    </button>
  )
})

Button.displayName = 'Button'
export default Button