/**
 * Budget.jsx — Obsidian Finance
 * Análisis financiero con motor de recomendaciones inteligente.
 */
import { useMemo }                     from 'react'
import { Lightbulb, AlertTriangle, CheckCircle, AlertCircle, Trophy } from 'lucide-react'
import { useTransactions }             from '../hooks/useTransactions'
import { formatCurrency }              from '../utils/formatCurrency'
import styles                          from './Budget.module.css'

const CAT_EMOJI = {
  alimentación:'🛒', transporte:'🚗', vivienda:'🏠', salud:'💊',
  entretenimiento:'🎬', educación:'📚', ropa:'👕', otros:'📦',
}

/** Motor de recomendaciones basado en datos reales */
const getRecommendations = (summary, txCount) => {
  if (!summary) return []
  const { totalIncome, totalExpense, balance, byCategory } = summary
  const recs = []

  // 1. Déficit
  if (balance < 0) recs.push({
    level: 'danger',
    Icon:  AlertTriangle,
    title: 'Déficit detectado',
    desc:  `Estás gastando ${formatCurrency(Math.abs(balance))} más de lo que ingresas. Revisa tu categoría de gasto más alta primero.`,
  })

  // 2. Tasa de ahorro
  if (totalIncome > 0) {
    const r = Math.round((balance / totalIncome) * 100)
    if (r >= 30) recs.push({ level:'success', Icon:Trophy,       title:`Ahorro del ${r}% — excelente`, desc:'Superas la regla del 20%. Considera invertir ese excedente en un CDT o fondo indexado.' })
    else if (r >= 20) recs.push({ level:'success', Icon:CheckCircle, title:`Ahorro del ${r}% — bien`,      desc:'Cumples la regla del 20%. Mantén la disciplina y busca incrementarlo al 30%.' })
    else if (r >= 10) recs.push({ level:'warning', Icon:Lightbulb,   title:`Ahorro del ${r}% — mejorable`, desc:`Necesitas reducir ${formatCurrency(totalExpense * 0.10)} mensuales para llegar al 20%.` })
    else if (r >= 0)  recs.push({ level:'warning', Icon:AlertCircle, title:`Ahorro del ${r}% — bajo`,       desc:'Menos del 10% es riesgoso ante imprevistos. Define un presupuesto estricto esta semana.' })
  }

  // 3. Categoría dominante >40%
  if (byCategory && Object.keys(byCategory).length > 0) {
    const [cat, amt] = Object.entries(byCategory).sort((a,b) => b[1]-a[1])[0]
    const pct = totalExpense ? Math.round((amt/totalExpense)*100) : 0
    if (pct > 40) recs.push({
      level: 'warning', Icon: AlertCircle,
      title: `${pct}% en "${cat}"`,
      desc:  `Alta concentración. Evalúa si puedes redistribuir ${formatCurrency(amt * 0.15)} de ese gasto a ahorro.`,
    })
  }

  // 4. Entretenimiento >25%
  const ent = byCategory?.entretenimiento || 0
  if (totalExpense > 0 && ent / totalExpense > 0.25)
    recs.push({ level:'warning', Icon:Lightbulb, title:'Entretenimiento >25%', desc:'Revisa suscripciones activas. Cancelar o compartir dos servicios puede liberar dinero.' })

  // 5. Sin ingresos
  if (totalIncome === 0 && totalExpense > 0)
    recs.push({ level:'info', Icon:AlertCircle, title:'Sin ingresos registrados', desc:'Registra tu salario para calcular tu balance real y obtener análisis completos.' })

  // 6. Pocos datos
  if (txCount < 5)
    recs.push({ level:'info', Icon:Lightbulb, title:'Datos insuficientes', desc:`Solo ${txCount} transacción(es). Con al menos un mes de datos las recomendaciones serán más precisas.` })

  if (!recs.length)
    recs.push({ level:'success', Icon:Trophy, title:'Finanzas en buen estado', desc:'Todo bien. Define metas de ahorro y considera abrir un fondo de emergencia de 3–6 meses.' })

  return recs
}

const LEVEL_CLS = { success:'recSuccess', warning:'recWarning', danger:'recDanger', info:'recInfo' }

export default function Budget() {
  const { transactions, summary, loading, error } = useTransactions()

  const {
    totalIncome  = 0,
    totalExpense = 0,
    balance      = 0,
    byCategory   = {},
    count        = 0,
  } = summary || {}

  const recs   = useMemo(() => getRecommendations(summary, transactions.length), [summary, transactions.length])
  const sorted = Object.entries(byCategory).sort((a,b) => b[1]-a[1])
  const top    = sorted[0]
  const rate   = totalIncome > 0 ? Math.round((balance/totalIncome)*100) : null

  if (error) return <div className="alert alert-error mt-6">{error}</div>

  return (
    <div className={styles.page}>
      {/* Encabezado */}
      <div className={`${styles.header} animate-up`}>
        <div>
          <h1 className={`${styles.title} heading`}>Análisis financiero</h1>
          <p className={styles.sub}>Diagnóstico basado en tus movimientos reales</p>
        </div>
      </div>

      {/* ── Hero categoría top ──────────────────────── */}
      {top && !loading && (
        <div className={`${styles.topHero} animate-up d-1 mb-6`}>
          <div className={styles.topLeft}>
            <span className={styles.topEmoji}>{CAT_EMOJI[top[0]] || '📦'}</span>
            <div>
              <p className="label-sm">Categoría con mayor gasto</p>
              <p className={`${styles.topName} heading`}>{top[0].charAt(0).toUpperCase() + top[0].slice(1)}</p>
              <p className={styles.topAmt}>
                {formatCurrency(top[1])}
                {totalExpense > 0 && (
                  <span className={styles.topPct}> — {Math.round((top[1]/totalExpense)*100)}% del gasto total</span>
                )}
              </p>
            </div>
          </div>
          {rate !== null && (
            <div className={styles.topRight}>
              <p className="label-sm">Tasa de ahorro</p>
              <p className={`${styles.rate} display ${rate >= 20 ? styles.rateGood : rate >= 0 ? styles.rateOk : styles.rateBad}`}>
                {rate}%
              </p>
              <p className={styles.rateLabel}>
                {rate >= 30 ? 'Excelente 🏆' : rate >= 20 ? 'Bien ✓' : rate >= 10 ? 'Mejorable' : rate >= 0 ? 'Bajo' : 'Déficit'}
              </p>
            </div>
          )}
        </div>
      )}

      <div className={`grid-2 mb-6`}>
        {/* ── Barras de categoría ────────────────────── */}
        <div className={`card animate-up d-2`}>
          <div className="card-header">
            <p className="label-sm">Desglose de gastos</p>
            <span className={styles.totalChip}>{formatCurrency(totalExpense)}</span>
          </div>

          {loading ? (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {[1,2,3].map((i) => <div key={i} className="skeleton" style={{ height:36 }} />)}
            </div>
          ) : sorted.length === 0 ? (
            <p style={{ color:'var(--text-3)', fontSize:'0.875rem' }}>Sin gastos registrados.</p>
          ) : (
            <ul className={styles.barList}>
              {sorted.map(([cat, amt], i) => {
                const pct = totalExpense ? Math.round((amt/totalExpense)*100) : 0
                return (
                  <li key={cat} className={`${styles.barRow} animate-up d-${i+1}`}>
                    <div className={styles.barTop}>
                      <span className={styles.barLabel}>{CAT_EMOJI[cat] || '📦'} {cat.charAt(0).toUpperCase()+cat.slice(1)}</span>
                      <div className={styles.barRight}>
                        <span className={styles.barAmt}>{formatCurrency(amt)}</span>
                        <span className={styles.barPct}>{pct}%</span>
                      </div>
                    </div>
                    <div className={styles.barBg}>
                      <div
                        className={styles.barFill}
                        style={{ width:`${pct}%` }}
                        role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* ── Resumen ────────────────────────────────── */}
        <div className={`card animate-up d-3`}>
          <div className="card-header">
            <p className="label-sm">Resumen financiero</p>
          </div>
          <ul className={styles.sumList}>
            {[
              { l:'💚 Ingresos',    v: formatCurrency(totalIncome),  c: styles.vPos  },
              { l:'🔴 Gastos',      v: formatCurrency(totalExpense), c: styles.vNeg  },
              { l:'⚖️ Balance',     v: formatCurrency(balance),      c: balance >= 0 ? styles.vPos : styles.vNeg, bold:true },
              { l:'💾 Tasa ahorro', v: rate !== null ? `${rate}%` : '—', c:'' },
              { l:'📋 Movimientos', v: count, c:'' },
            ].map(({ l, v, c, bold }) => (
              <li key={l} className={`${styles.sumRow} ${bold ? styles.sumBold : ''}`}>
                <span className={styles.sumLabel}>{l}</span>
                <span className={`${styles.sumValue} ${c}`}>{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Recomendaciones ────────────────────────── */}
      <div className={`card animate-up d-4`}>
        <div className="card-header">
          <p className="label-sm">Recomendaciones personalizadas</p>
          <span className={styles.recBadge}>{recs.length} sugerencia{recs.length !== 1 ? 's' : ''}</span>
        </div>
        <div className={styles.recGrid}>
          {recs.map((r, i) => (
            <div key={i} className={`${styles.rec} ${styles[LEVEL_CLS[r.level]]} animate-up d-${i+1}`}>
              <div className={styles.recIconWrap}><r.Icon size={16} strokeWidth={2} /></div>
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