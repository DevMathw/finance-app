/**
 * Budget.jsx — Editorial Finance
 * Análisis financiero con motor de recomendaciones.
 * Números en Fraunces, barras con accent verde bosque.
 */
import { useMemo }            from 'react'
import { Lightbulb, AlertTriangle, CheckCircle, AlertCircle, Trophy } from 'lucide-react'
import { useTransactions }    from '../hooks/useTransactions'
import { formatCurrency }     from '../utils/formatCurrency'
import styles                 from './Budget.module.css'

const CAT_EMOJI = {
  alimentación:'🛒', transporte:'🚗', vivienda:'🏠', salud:'💊',
  entretenimiento:'🎬', educación:'📚', ropa:'👕', otros:'📦',
}

const getRecs = (summary, txCount) => {
  if (!summary) return []
  const { totalIncome, totalExpense, balance, byCategory } = summary
  const recs = []

  if (balance < 0) recs.push({
    level:'danger', Icon:AlertTriangle,
    title:'Déficit detectado',
    desc:`Estás gastando ${formatCurrency(Math.abs(balance))} más de lo que ingresas. Revisa tu categoría más alta.`,
  })

  if (totalIncome > 0) {
    const r = Math.round((balance / totalIncome) * 100)
    if      (r >= 30) recs.push({ level:'success', Icon:Trophy,       title:`Ahorro del ${r}% — excelente`, desc:'Superas el 20%. Considera invertir en un CDT o fondo indexado.' })
    else if (r >= 20) recs.push({ level:'success', Icon:CheckCircle,  title:`Ahorro del ${r}% — bien`,      desc:'Cumples la regla del 20%. Mantén la disciplina.' })
    else if (r >= 10) recs.push({ level:'warn',    Icon:Lightbulb,    title:`Ahorro del ${r}% — mejorable`, desc:`Necesitas reducir ${formatCurrency(totalExpense*0.10)} mensuales para llegar al 20%.` })
    else if (r >= 0)  recs.push({ level:'warn',    Icon:AlertCircle,  title:`Ahorro del ${r}% — bajo`,      desc:'Menos del 10% es riesgoso. Define un presupuesto estricto.' })
  }

  if (byCategory && Object.keys(byCategory).length) {
    const [cat, amt] = Object.entries(byCategory).sort((a,b) => b[1]-a[1])[0]
    const pct = totalExpense ? Math.round((amt/totalExpense)*100) : 0
    if (pct > 40) recs.push({
      level:'warn', Icon:AlertCircle,
      title:`${pct}% en "${cat}"`,
      desc:`Alta concentración. Evalúa si puedes redistribuir ${formatCurrency(amt*0.15)} de ese gasto.`,
    })
  }

  const ent = byCategory?.entretenimiento || 0
  if (totalExpense > 0 && ent/totalExpense > 0.25)
    recs.push({ level:'warn', Icon:Lightbulb, title:'Entretenimiento >25%', desc:'Revisa suscripciones. Cancelar dos servicios puede liberar presupuesto.' })

  if (totalIncome === 0 && totalExpense > 0)
    recs.push({ level:'info', Icon:AlertCircle, title:'Sin ingresos registrados', desc:'Registra tu salario para calcular tu balance real.' })

  if (txCount < 5)
    recs.push({ level:'info', Icon:Lightbulb, title:'Pocos datos', desc:`Con ${txCount} transacción(es) el análisis es limitado. Agrega al menos un mes de movimientos.` })

  if (!recs.length)
    recs.push({ level:'success', Icon:Trophy, title:'Finanzas saludables', desc:'Todo bien. Define metas de ahorro y considera un fondo de emergencia de 3–6 meses.' })

  return recs
}

const LEVEL = { success: styles.recSuccess, warn: styles.recWarn, danger: styles.recDanger, info: styles.recInfo }

export default function Budget() {
  const { transactions, summary, loading, error } = useTransactions()
  const { totalIncome=0, totalExpense=0, balance=0, byCategory={}, count=0 } = summary || {}

  const recs   = useMemo(() => getRecs(summary, transactions.length), [summary, transactions.length])
  const sorted = Object.entries(byCategory).sort((a,b) => b[1]-a[1])
  const top    = sorted[0]
  const rate   = totalIncome > 0 ? Math.round((balance/totalIncome)*100) : null

  if (error) return <div className="alert alert-danger mt-6">{error}</div>

  return (
    <div className={styles.page}>
      <div className={`${styles.header} animate-up`}>
        <h1 className="h1">Análisis financiero</h1>
        <p className={styles.sub}>Diagnóstico basado en tus movimientos reales</p>
      </div>

      {/* ── Hero categoría top ──────────────────── */}
      {top && !loading && (
        <div className={`${styles.topCard} animate-up delay-1 mb-6`}>
          <div className={styles.topLeft}>
            <span className={styles.topEmoji}>{CAT_EMOJI[top[0]] || '📦'}</span>
            <div>
              <p className="label">Mayor categoría de gasto</p>
              <p className={`${styles.topName} display-md`}>
                {top[0].charAt(0).toUpperCase() + top[0].slice(1)}
              </p>
              <p className={styles.topAmt}>
                {formatCurrency(top[1])}
                {totalExpense > 0 && (
                  <span className={styles.topPct}> — {Math.round((top[1]/totalExpense)*100)}% del total</span>
                )}
              </p>
            </div>
          </div>
          {rate !== null && (
            <div className={styles.topRight}>
              <p className="label">Tasa de ahorro</p>
              <p className={`${styles.rate} display-lg ${rate >= 20 ? styles.rateGood : rate >= 0 ? styles.rateOk : styles.rateBad}`}>
                {rate}%
              </p>
              <p className={styles.rateLabel}>
                {rate >= 30 ? 'Excelente' : rate >= 20 ? 'Bien' : rate >= 10 ? 'Mejorable' : rate >= 0 ? 'Bajo' : 'Déficit'}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="grid-2 mb-6">
        {/* ── Barras ──────────────────────────────── */}
        <div className="card card-md animate-up delay-2">
          <div className="card-header">
            <p className="label">Desglose de gastos</p>
            <span className={styles.totalChip}>{formatCurrency(totalExpense)}</span>
          </div>
          {loading ? (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {[1,2,3].map((i) => <div key={i} className="skeleton" style={{ height:32 }} />)}
            </div>
          ) : sorted.length === 0 ? (
            <p style={{ color:'var(--muted)', fontSize:'0.875rem' }}>Sin gastos registrados.</p>
          ) : (
            <ul className={styles.barList}>
              {sorted.map(([cat, amt], i) => {
                const pct = totalExpense ? Math.round((amt/totalExpense)*100) : 0
                return (
                  <li key={cat} className={`${styles.barRow} animate-up delay-${i+1}`}>
                    <div className={styles.barMeta}>
                      <span className={styles.barLabel}>{CAT_EMOJI[cat] || '📦'} {cat.charAt(0).toUpperCase()+cat.slice(1)}</span>
                      <div className={styles.barRight}>
                        <span className={styles.barAmt}>{formatCurrency(amt)}</span>
                        <span className={styles.barPct}>{pct}%</span>
                      </div>
                    </div>
                    <div className={styles.barBg}>
                      <div className={styles.barFill} style={{ width:`${pct}%` }}
                        role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} />
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* ── Resumen ─────────────────────────────── */}
        <div className="card card-md animate-up delay-3">
          <div className="card-header"><p className="label">Resumen financiero</p></div>
          <ul className={styles.sumList}>
            {[
              { l:'💚 Ingresos',    v: formatCurrency(totalIncome),  c: styles.vPos },
              { l:'🔴 Gastos',      v: formatCurrency(totalExpense), c: styles.vNeg },
              { l:'⚖️ Balance',     v: formatCurrency(balance),      c: balance >= 0 ? styles.vPos : styles.vNeg, bold:true },
              { l:'💾 Tasa ahorro', v: rate !== null ? `${rate}%` : '—', c:'' },
              { l:'📋 Movimientos', v: count, c:'' },
            ].map(({ l, v, c, bold }) => (
              <li key={l} className={`${styles.sumRow} ${bold ? styles.sumBold : ''}`}>
                <span className={styles.sumLabel}>{l}</span>
                <span className={`${styles.sumVal} ${c}`}>{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Recomendaciones ─────────────────────── */}
      <div className="card card-md animate-up delay-4">
        <div className="card-header">
          <p className="label">Recomendaciones personalizadas</p>
          <span className={styles.recCount}>{recs.length} sugerencia{recs.length !== 1 ? 's' : ''}</span>
        </div>
        <div className={styles.recGrid}>
          {recs.map((r, i) => (
            <div key={i} className={`${styles.rec} ${LEVEL[r.level]} animate-up delay-${i+1}`}>
              <div className={styles.recIcon}><r.Icon size={15} strokeWidth={2} /></div>
              <div>
                <p className={styles.recTitle}>{r.title}</p>
                <p className={styles.recDesc}>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}