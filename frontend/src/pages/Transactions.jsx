/**
 * Transactions.jsx — Obsidian Finance
 * Formulario lateral + historial filtrable con acciones inline.
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

  const [form,      setForm]      = useState(EMPTY)
  const [saving,    setSaving]    = useState(false)
  const [formErr,   setFormErr]   = useState(null)
  const [success,   setSuccess]   = useState(false)
  const [filter,    setFilter]    = useState('all')   // all | income | expense
  const [deletingId,setDeleting]  = useState(null)

  const set = (e) => { setForm((f) => ({ ...f, [e.target.name]: e.target.value })); setFormErr(null); setSuccess(false) }

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
      {/* ── Encabezado ─────────────────────────────── */}
      <div className={`${styles.header} animate-up`}>
        <div>
          <h1 className={`${styles.title} heading`}>Transacciones</h1>
          <p className={styles.sub}>Registra y consulta todos tus movimientos</p>
        </div>
      </div>

      <div className={styles.layout}>
        {/* ── Panel formulario ───────────────────────── */}
        <aside className={`${styles.formPanel} animate-up d-1`}>
          <div className={styles.formHeader}>
            <p className="label-sm">Nueva transacción</p>
          </div>

          {/* Toggle tipo */}
          <div className={styles.typeRow}>
            <button
              type="button"
              className={`${styles.typeBtn} ${form.type === 'expense' ? styles.expenseActive : ''}`}
              onClick={() => setForm((f) => ({ ...f, type: 'expense' }))}
              aria-pressed={form.type === 'expense'}
            >
              <TrendingDown size={15} />
              Gasto
            </button>
            <button
              type="button"
              className={`${styles.typeBtn} ${form.type === 'income' ? styles.incomeActive : ''}`}
              onClick={() => setForm((f) => ({ ...f, type: 'income' }))}
              aria-pressed={form.type === 'income'}
            >
              <TrendingUp size={15} />
              Ingreso
            </button>
          </div>

          <form onSubmit={submit} className={styles.form} noValidate>
            {/* Descripción */}
            <div className="field">
              <label className="field-label" htmlFor="description">
                <FileText size={11} style={{ display:'inline', marginRight:4 }} />
                Descripción
              </label>
              <input
                id="description" name="description" type="text"
                className="field-input"
                placeholder="Ej: Mercado del sábado"
                value={form.description} onChange={set} required
              />
            </div>

            {/* Monto */}
            <div className="field">
              <label className="field-label" htmlFor="amount">
                <DollarSign size={11} style={{ display:'inline', marginRight:4 }} />
                Monto
              </label>
              <input
                id="amount" name="amount" type="number"
                className="field-input"
                placeholder="0"
                min="1" value={form.amount} onChange={set} required
              />
            </div>

            {/* Categoría */}
            <div className="field">
              <label className="field-label" htmlFor="category">
                <Tag size={11} style={{ display:'inline', marginRight:4 }} />
                Categoría
              </label>
              <select id="category" name="category" className="field-input" value={form.category} onChange={set}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{CAT_EMOJI[c]} {c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Fecha + Notas */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div className="field">
                <label className="field-label" htmlFor="date">
                  <Calendar size={11} style={{ display:'inline', marginRight:4 }} />
                  Fecha
                </label>
                <input id="date" name="date" type="date" className="field-input" value={form.date} onChange={set} />
              </div>
              <div className="field">
                <label className="field-label" htmlFor="notes">Notas</label>
                <input id="notes" name="notes" type="text" className="field-input" placeholder="Opcional" value={form.notes} onChange={set} />
              </div>
            </div>

            {formErr  && <div className="alert alert-error">{formErr}</div>}
            {success  && <div className="alert alert-success">✓ Guardado correctamente</div>}

            <Button type="submit" fullWidth variant="primary" loading={saving} icon={<Plus size={15} />}>
              Guardar transacción
            </Button>
          </form>
        </aside>

        {/* ── Historial ──────────────────────────────── */}
        <section className={`${styles.listPanel} animate-up d-2`}>
          {/* Barra filtros */}
          <div className={styles.listHeader}>
            <div className={styles.filterBar} role="group">
              <Filter size={13} style={{ color:'var(--text-3)' }} />
              {['all','expense','income'].map((v) => (
                <button
                  key={v}
                  className={`${styles.filterChip} ${filter === v ? styles.chipActive : ''}`}
                  onClick={() => setFilter(v)}
                  aria-pressed={filter === v}
                >
                  {v === 'all' ? 'Todos' : v === 'expense' ? 'Gastos' : 'Ingresos'}
                  <span className={styles.chipCount}>
                    {v === 'all' ? transactions.length : transactions.filter((t) => t.type === v).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Estados */}
          {loading && (
            <div className={styles.skList}>
              {[1,2,3,4,5].map((i) => (
                <div key={i} className={styles.skRow}>
                  <div className={`skeleton ${styles.sk1}`} />
                  <div style={{ flex:1, display:'flex', flexDirection:'column', gap:6 }}>
                    <div className={`skeleton ${styles.sk2}`} />
                    <div className={`skeleton ${styles.sk3}`} />
                  </div>
                  <div className={`skeleton ${styles.sk4}`} />
                </div>
              ))}
            </div>
          )}

          {error && <div className="alert alert-error">{error}</div>}

          {!loading && filtered.length === 0 && (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>📭</span>
              <p>Sin transacciones{filter !== 'all' ? ` de tipo "${filter}"` : ''}</p>
            </div>
          )}

          {/* Lista */}
          {!loading && (
            <ul className={styles.list}>
              {filtered.map((t) => (
                <li key={t.id} className={styles.item}>
                  <div className={`${styles.itemIcon} ${t.type === 'income' ? styles.iconIncome : styles.iconExpense}`}>
                    {t.type === 'income'
                      ? <TrendingUp size={15} />
                      : <TrendingDown size={15} />
                    }
                  </div>

                  <div className={styles.itemBody}>
                    <p className={styles.itemDesc}>{t.description}</p>
                    <div className={styles.itemMeta}>
                      <span className={`badge ${t.type === 'income' ? 'badge-green' : 'badge-red'}`}>
                        {t.type === 'income' ? 'Ingreso' : 'Gasto'}
                      </span>
                      <span>{CAT_EMOJI[t.category]} {t.category}</span>
                      {t.notes && <span className={styles.note}>· {t.notes}</span>}
                      <span>{formatDateShort(t.date)}</span>
                    </div>
                  </div>

                  <span className={`${styles.itemAmt} ${t.type === 'income' ? styles.pos : styles.neg}`}>
                    {t.type === 'income' ? '+' : '−'}{formatCurrency(t.amount)}
                  </span>

                  <button
                    className={styles.delBtn}
                    onClick={() => del(t.id)}
                    disabled={deletingId === t.id}
                    aria-label={`Eliminar ${t.description}`}
                  >
                    <Trash2 size={14} />
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