/**
 * Dashboard.jsx — Obsidian Finance
 * Hero con balance grande, 4 KPIs, gráficas y últimas tx.
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

  if (error) return <div className="alert alert-error mt-6">{error}</div>

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
      {/* ── Hero balance ──────────────────────────── */}
      <div className={`${styles.hero} animate-up`}>
        <div className={styles.heroLeft}>
          <p className="label-sm">Balance total</p>
          <p className={`${styles.heroValue} display ${balance >= 0 ? 'text-gradient' : 'text-red'}`}>
            {loading ? '—' : formatCurrency(balance)}
          </p>
          <p className={styles.heroSub}>
            Actualizado {new Date().toLocaleDateString('es-CO', { day:'numeric', month:'long' })}
          </p>
        </div>
        <div className={styles.heroRight}>
          <Link to="/transactions">
            <Button variant="lime" size="sm" icon={<Plus size={14} />}>
              Nueva transacción
            </Button>
          </Link>
        </div>
      </div>

      {/* ── KPIs ──────────────────────────────────── */}
      <div className={`grid-4 mb-8`}>
        <KpiCard
          label="Ingresos"
          value={formatCurrency(totalIncome)}
          subtext="Total registrado"
          icon={TrendingUp}
          variant="green"
          delay={0} loading={loading}
        />
        <KpiCard
          label="Gastos"
          value={formatCurrency(totalExpense)}
          subtext="Total registrado"
          icon={TrendingDown}
          variant="red"
          delay={1} loading={loading}
        />
        <KpiCard
          label="Balance"
          value={formatCurrency(balance)}
          subtext="Ingresos − Gastos"
          icon={Wallet}
          variant={balance >= 0 ? 'lime' : 'red'}
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

      {/* ── Gráficas ──────────────────────────────── */}
      <div className={`grid-2 mb-8`}>
        <div className={`card animate-up d-3`}>
          <div className="card-header">
            <p className="label-sm">Gastos por categoría</p>
          </div>
          <DonutChart data={byCategory} />
        </div>

        <div className={`card animate-up d-4`}>
          <div className="card-header">
            <p className="label-sm">Ingresos vs Gastos — 6 meses</p>
          </div>
          <BarChart transactions={transactions} />
        </div>
      </div>

      {/* ── Últimas transacciones ──────────────────── */}
      <div className={`card animate-up d-5`}>
        <div className="card-header">
          <p className="label-sm">Últimas transacciones</p>
          <Link to="/transactions" className={styles.viewAll}>
            Ver todas <ArrowUpRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className={styles.skList}>
            {[1,2,3,4].map((i) => (
              <div key={i} className={styles.skRow}>
                <div className={`skeleton ${styles.sk1}`} />
                <div className={`skeleton ${styles.sk2}`} />
                <div className={`skeleton ${styles.sk3}`} />
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className={styles.empty}>
            <p>Sin transacciones. <Link to="/transactions" className={styles.emptyLink}>Agrega la primera →</Link></p>
          </div>
        ) : (
          <ul className={styles.list}>
            {recent.map((t, i) => (
              <li key={t.id} className={`${styles.item} animate-up d-${(i % 6) + 1}`}>
                <span className={styles.emoji}>{CAT_EMOJI[t.category] || '📦'}</span>
                <div className={styles.info}>
                  <p className={styles.desc}>{t.description}</p>
                  <p className={styles.meta}>
                    <span className={`badge ${t.type === 'income' ? 'badge-green' : 'badge-red'}`}>
                      {t.type === 'income' ? 'Ingreso' : 'Gasto'}
                    </span>
                    {t.category} · {formatDateShort(t.date)}
                  </p>
                </div>
                <span className={`${styles.amount} ${t.type === 'income' ? styles.pos : styles.neg}`}>
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