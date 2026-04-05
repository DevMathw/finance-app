/**
 * Dashboard.jsx — Editorial Finance
 * Balance en Fraunces hero, KPIs, gráficas y transacciones recientes.
 */
import { Link }                            from 'react-router-dom'
import { Wallet, TrendingUp, TrendingDown, Percent, ArrowUpRight, Plus } from 'lucide-react'
import { useTransactions }                 from '../hooks/useTransactions'
import { formatCurrency, formatDateShort } from '../utils/formatCurrency'
import KpiCard                             from '../components/common/KpiCard'
import DonutChart                          from '../components/charts/DonutChart'
import BarChart                            from '../components/charts/BarChart'
import Button                              from '../components/common/Button'
import styles                              from './Dashboard.module.css'

const CAT_EMOJI = {
  alimentación:'🛒', transporte:'🚗', vivienda:'🏠', salud:'💊',
  entretenimiento:'🎬', educación:'📚', ropa:'👕', otros:'📦',
}

export default function Dashboard() {
  const { transactions, summary, loading, error } = useTransactions()

  if (error) return <div className="alert alert-danger mt-6">{error}</div>

  const {
    totalIncome  = 0,
    totalExpense = 0,
    balance      = 0,
    byCategory   = {},
  } = summary || {}

  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : null
  const recent      = transactions.slice(0, 6)

  return (
    <div className={styles.page}>

      {/* ── Hero balance ─────────────────────────── */}
      <div className={`${styles.hero} animate-up`}>
        <div className={styles.heroLeft}>
          <p className="label">Balance total</p>
          <p className={`${styles.heroValue} display-lg ${balance >= 0 ? 'amount-positive' : 'amount-negative'}`}>
            {loading ? '—' : formatCurrency(balance)}
          </p>
          <p className={styles.heroDate}>
            Actualizado {new Date().toLocaleDateString('es-CO', { day:'numeric', month:'long' })}
          </p>
        </div>
        <div className={styles.heroRight}>
          <Link to="/transactions">
            <Button variant="primary" size="sm" icon={<Plus size={14} />}>
              Nueva transacción
            </Button>
          </Link>
        </div>
      </div>

      {/* ── KPIs ────────────────────────────────── */}
      <div className="grid-4 mb-6">
        <KpiCard
          label="Ingresos"
          value={formatCurrency(totalIncome)}
          subtext="Total registrado"
          icon={TrendingUp}
          variant="positive"
          delay={0} loading={loading}
        />
        <KpiCard
          label="Gastos"
          value={formatCurrency(totalExpense)}
          subtext="Total registrado"
          icon={TrendingDown}
          variant="negative"
          delay={1} loading={loading}
        />
        <KpiCard
          label="Balance"
          value={formatCurrency(balance)}
          subtext="Ingresos − Gastos"
          icon={Wallet}
          variant={balance >= 0 ? 'positive' : 'negative'}
          delay={2} loading={loading}
        />
        <KpiCard
          label="Tasa de ahorro"
          value={savingsRate !== null ? `${savingsRate}%` : '—'}
          subtext="Del total de ingresos"
          icon={Percent}
          variant="default"
          trend={savingsRate}
          delay={3} loading={loading}
        />
      </div>

      {/* ── Gráficas ────────────────────────────── */}
      <div className="grid-2 mb-6">
        <div className="card card-md animate-up delay-3">
          <div className="card-header">
            <p className="label">Gastos por categoría</p>
          </div>
          <DonutChart data={byCategory} />
        </div>

        <div className="card card-md animate-up delay-4">
          <div className="card-header">
            <p className="label">Ingresos vs Gastos — 6 meses</p>
          </div>
          <BarChart transactions={transactions} />
        </div>
      </div>

      {/* ── Últimas transacciones ────────────────── */}
      <div className="card card-md animate-up delay-5">
        <div className="card-header">
          <p className="label">Últimas transacciones</p>
          <Link to="/transactions" className={styles.viewAll}>
            Ver todas <ArrowUpRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className={styles.skList}>
            {[1,2,3,4].map((i) => (
              <div key={i} className={styles.skRow}>
                <div className={`skeleton ${styles.sk1}`} />
                <div style={{ flex:1, display:'flex', flexDirection:'column', gap:5 }}>
                  <div className={`skeleton ${styles.sk2}`} />
                  <div className={`skeleton ${styles.sk3}`} />
                </div>
                <div className={`skeleton ${styles.sk4}`} />
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className={styles.empty}>
            <p>Sin transacciones. <Link to="/transactions">Agrega la primera →</Link></p>
          </div>
        ) : (
          <ul className="tx-list">
            {recent.map((t) => (
              <li key={t.id} className="tx-item">
                <div className="tx-icon">{CAT_EMOJI[t.category] || '📦'}</div>
                <div className="tx-body">
                  <p className="tx-desc">{t.description}</p>
                  <div className="tx-meta">
                    <span className={`badge ${t.type === 'income' ? 'badge-accent' : 'badge-danger'}`}>
                      {t.type === 'income' ? 'Ingreso' : 'Gasto'}
                    </span>
                    <span>{t.category}</span>
                    <span>{formatDateShort(t.date)}</span>
                  </div>
                </div>
                <span className={`tx-amount ${t.type === 'income' ? 'positive' : 'negative'}`}>
                  {t.type === 'income' ? '+' : '−'}{formatCurrency(t.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}