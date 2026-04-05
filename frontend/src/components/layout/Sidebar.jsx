/**
 * Sidebar.jsx — Editorial Finance
 * Fondo --bg (mismo cálido que la app), pill activo verde suave.
 * Expand al hover en desktop, drawer en móvil.
 */
import { useState }         from 'react'
import { NavLink }          from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, PieChart, Menu, X } from 'lucide-react'
import styles               from './Sidebar.module.css'

const NAV = [
  { to: '/',             icon: LayoutDashboard, label: 'Dashboard',     end: true },
  { to: '/transactions', icon: ArrowLeftRight,  label: 'Transacciones'            },
  { to: '/budget',       icon: PieChart,        label: 'Análisis'                 },
]

export default function Sidebar() {
  const [mobileOpen, setMobile] = useState(false)

  return (
    <>
      {/* Overlay móvil */}
      {mobileOpen && (
        <div className={styles.overlay} onClick={() => setMobile(false)} />
      )}

      {/* Botón móvil */}
      <button
        className={styles.menuBtn}
        onClick={() => setMobile((o) => !o)}
        aria-label="Menú"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ''}`}>
        {/* Sección nav */}
        <nav className={styles.nav}>
          <p className={styles.sectionLabel}>Menú</p>
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobile(false)}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.iconWrap}>
                <Icon size={17} strokeWidth={2} />
              </span>
              <span className={styles.label}>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className={styles.footer}>
          <span className={styles.ver}>v2.0 — Editorial Finance</span>
        </div>
      </aside>
    </>
  )
}