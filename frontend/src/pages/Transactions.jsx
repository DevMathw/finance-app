/**
 * Transactions.jsx — Editorial Finance
 */
import { useState }                          from 'react'
import { Plus, Filter, Trash2, TrendingUp, TrendingDown, Calendar, Tag, FileText, DollarSign } from 'lucide-react'
import { useTransactions }                   from '../hooks/useTransactions'
import { formatCurrency, formatDateShort }   from '../utils/formatCurrency'
import Button                                from '../components/common/Button'
import styles                                from './Transactions.module.css'

const CATEGORIES = ['alimentación','transporte','vivienda','salud','entretenimiento','educación','ropa','otros']
const CAT_EMOJI  = { alimentación:'🛒', transporte:'🚗', vivienda:'🏠', salud:'💊', entretenimiento:'🎬', educación:'📚', ropa:'👕', otros:'📦' }
const EMPTY      = { type:'expense', description:'', amount:'', category:'alimentación', date:'', notes:'' }

export default function Transactions() {
  const { transactions, loading, error, addTransaction, removeTransaction } = useTransactions()
  const [form,       setForm]      = useState(EMPTY)
  const [saving,     setSaving]    = useState(false)
  const [formErr,    setFormErr]   = useState(null)
  const [success,    setSuccess]   = useState(false)
  const [filter,     setFilter]    = useState('all')
  const [deletingId, setDeleting]  = useState(null)

  const set = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setFormErr(null); setSuccess(false)
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true); setFormErr(null)
    try {
      await addTransaction({ ...form, amount: Number(form.amount) })
      setForm(EMPTY); setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setFormErr(err.response?.data?.error || 'Error al guardar.')
    } finally { setSaving(false) }
  }

  const del = async (id) => {
    setDeleting(id)
    try { await removeTransaction(id) } finally { setDeleting(null) }
  }

  const filtered = filter === 'all' ? transactions : transactions.filter((t) => t.type === filter)

  return (
    <div className={styles.page}>
      {/* Encabezado */}
      <div className={`${styles.header} animate-up`}>
        <div>
          <h1 className="h1">Transacciones</h1>
          <p className={styles.sub}>Registra y consulta todos tus movimientos</p>
        </div>
      </div>

      <div className={styles.layout}>
        {/* ── Formulario ───────────────────────────── */}
        <aside className={`${styles.formPanel} animate-up delay-1`}>
          <div className={styles.formHead}>
            <p className="label-md">Nueva transacción</p>
          </div>

          {/* Toggle tipo */}
          <div className={styles.typeRow}>
            <button
              type="button"
              className={`${styles.typeBtn} ${form.type === 'expense' ? styles.expActive : ''}`}
              onClick={() => setForm((f) => ({ ...f, type: 'expense' }))}
            >
              <TrendingDown size={14} /> Gasto
            </button>
            <button
              type="button"
              className={`${styles.typeBtn} ${form.type === 'income' ? styles.incActive : ''}`}
              onClick={() => setForm((f) => ({ ...f, type: 'income' }))}
            >
              <TrendingUp size={14} /> Ingreso
            </button>
          </div>

          <form onSubmit={submit} className={styles.form} noValidate>
            <div className="field">
              <label className="field-label" htmlFor="description">
                <FileText size={10} style={{ display:'inline', marginRight:3 }} />
                Descripción
              </label>
              <input id="description" name="description" type="text"
                className="field-input" placeholder="Ej: Mercado del sábado"
                value={form.description} onChange={set} required />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="amount">
                <DollarSign size={10} style={{ display:'inline', marginRight:3 }} />
                Monto
              </label>
              <input id="amount" name="amount" type="number"
                className="field-input" placeholder="0"
                min="1" value={form.amount} onChange={set} required />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="category">
                <Tag size={10} style={{ display:'inline', marginRight:3 }} />
                Categoría
              </label>
              <select id="category" name="category" className="field-input"
                value={form.category} onChange={set}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{CAT_EMOJI[c]} {c.charAt(0).toUpperCase()+c.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="field-group field-group-2">
              <div className="field">
                <label className="field-label" htmlFor="date">
                  <Calendar size={10} style={{ display:'inline', marginRight:3 }} />
                  Fecha
                </label>
                <input id="date" name="date" type="date" className="field-input"
                  value={form.date} onChange={set} />
              </div>
              <div className="field">
                <label className="field-label" htmlFor="notes">Notas</label>
                <input id="notes" name="notes" type="text" className="field-input"
                  placeholder="Opcional" value={form.notes} onChange={set} />
              </div>
            </div>

            {formErr  && <div className="alert alert-danger">{formErr}</div>}
            {success  && <div className="alert alert-accent">✓ Guardado correctamente</div>}

            <Button type="submit" fullWidth variant="primary" loading={saving} icon={<Plus size={14} />}>
              Guardar transacción
            </Button>
          </form>
        </aside>

        {/* ── Historial ──────────────────────────────── */}
        <section className={`${styles.listPanel} animate-up delay-2`}>
          <div className={styles.listHead}>
            <div className={styles.filterBar}>
              <Filter size={13} style={{ color:'var(--muted)' }} />
              {['all','expense','income'].map((v) => (
                <button
                  key={v}
                  className={`${styles.chip} ${filter === v ? styles.chipActive : ''}`}
                  onClick={() => setFilter(v)}
                >
                  {v === 'all' ? 'Todos' : v === 'expense' ? 'Gastos' : 'Ingresos'}
                  <span className={styles.chipCount}>
                    {v === 'all' ? transactions.length : transactions.filter((t) => t.type === v).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className={styles.skList}>
              {[1,2,3,4,5].map((i) => (
                <div key={i} className={styles.skRow}>
                  <div className={`skeleton ${styles.skI}`} />
                  <div style={{ flex:1, display:'flex', flexDirection:'column', gap:5 }}>
                    <div className={`skeleton ${styles.skA}`} />
                    <div className={`skeleton ${styles.skB}`} />
                  </div>
                  <div className={`skeleton ${styles.skC}`} />
                </div>
              ))}
            </div>
          )}
          {error && <div className="alert alert-danger">{error}</div>}
          {!loading && filtered.length === 0 && (
            <div className={styles.empty}>
              <p>Sin transacciones{filter !== 'all' ? ` de tipo "${filter}"` : ''}</p>
            </div>
          )}

          {!loading && (
            <ul className="tx-list">
              {filtered.map((t) => (
                <li key={t.id} className="tx-item">
                  {/* Ícono de tipo */}
                  <div className={`${styles.typeIcon} ${t.type === 'income' ? styles.iconInc : styles.iconExp}`}>
                    {t.type === 'income'
                      ? <TrendingUp size={14} />
                      : <TrendingDown size={14} />
                    }
                  </div>

                  <div className="tx-body">
                    <p className="tx-desc">{t.description}</p>
                    <div className="tx-meta">
                      <span className={`badge ${t.type === 'income' ? 'badge-accent' : 'badge-danger'}`}>
                        {t.type === 'income' ? 'Ingreso' : 'Gasto'}
                      </span>
                      <span>{CAT_EMOJI[t.category]} {t.category}</span>
                      {t.notes && <span style={{ fontStyle:'italic' }}>· {t.notes}</span>}
                      <span>{formatDateShort(t.date)}</span>
                    </div>
                  </div>

                  <span className={`tx-amount ${t.type === 'income' ? 'positive' : 'negative'}`}>
                    {t.type === 'income' ? '+' : '−'}{formatCurrency(t.amount)}
                  </span>

                  <button
                    className={styles.delBtn}
                    onClick={() => del(t.id)}
                    disabled={deletingId === t.id}
                    aria-label={`Eliminar ${t.description}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}