/**
 * KpiCard.jsx
 * Tarjeta de KPI con número hero en degradado, ícono Lucide
 * y barra de tendencia animada.
 */
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import styles from './KpiCard.module.css'

export default function KpiCard({
  label,
  value,
  subtext,
  trend,       // número positivo/negativo/null
  icon: Icon,  // componente Lucide
  variant = 'default', // default | lime | green | red
  delay   = 0,
  loading = false,
}) {
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus
  const trendCls  = trend > 0 ? styles.up : trend < 0 ? styles.down : styles.flat

  if (loading) return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <div className={`skeleton ${styles.skIcon}`} />
      <div className={`skeleton ${styles.skLabel}`} />
      <div className={`skeleton ${styles.skValue}`} />
    </div>
  )

  return (
    <div className={`${styles.card} ${styles[variant]} animate-up d-${delay + 1}`}>
      {/* Ícono */}
      {Icon && (
        <div className={`${styles.iconWrap} ${styles[`icon_${variant}`]}`}>
          <Icon size={18} strokeWidth={2} />
        </div>
      )}

      {/* Label */}
      <p className={`label-xs ${styles.label}`}>{label}</p>

      {/* Valor hero */}
      <p className={`display ${styles.value} ${variant === 'lime' ? 'text-gradient' : ''}`}>
        {value}
      </p>

      {/* Footer */}
      <div className={styles.footer}>
        {subtext && <span className={styles.subtext}>{subtext}</span>}
        {trend !== undefined && trend !== null && (
          <span className={`${styles.trend} ${trendCls}`}>
            <TrendIcon size={12} strokeWidth={2.5} />
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  )
}