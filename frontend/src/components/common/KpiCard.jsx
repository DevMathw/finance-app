/**
 * KpiCard.jsx — Editorial Finance
 * Tarjeta de KPI con número hero en Fraunces, ícono Lucide
 * y tendencia. Usa clases globales .card-kpi, .kpi-value, etc.
 */
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import styles from './KpiCard.module.css'

export default function KpiCard({
  label,
  value,
  subtext,
  trend,
  icon: Icon,
  variant = 'default', // default | positive | negative
  delay   = 0,
  loading = false,
}) {
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus
  const trendPos  = trend > 0

  if (loading) return (
    <div className={`card card-kpi ${styles.card}`}>
      <div className={`skeleton ${styles.skLabel}`} />
      <div className={`skeleton ${styles.skValue}`} />
      <div className={`skeleton ${styles.skSub}`} />
    </div>
  )

  return (
    <div className={`card card-kpi ${styles.card} animate-up delay-${delay + 1}`}>
      {/* Ícono */}
      {Icon && (
        <div className={`${styles.iconWrap} ${styles[`icon_${variant}`]}`}>
          <Icon size={16} strokeWidth={2} />
        </div>
      )}

      {/* Label */}
      <p className="kpi-label">{label}</p>

      {/* Valor — Fraunces para impacto visual */}
      <p className={`kpi-value ${variant === 'positive' ? 'amount-positive' : variant === 'negative' ? 'amount-negative' : ''}`}>
        {value}
      </p>

      {/* Footer */}
      <div className={styles.footer}>
        {subtext && <span className="kpi-sub">{subtext}</span>}
        {trend !== undefined && trend !== null && (
          <span className={`${styles.trend} ${trendPos ? styles.trendUp : styles.trendDown}`}>
            <TrendIcon size={11} strokeWidth={2.5} />
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  )
}