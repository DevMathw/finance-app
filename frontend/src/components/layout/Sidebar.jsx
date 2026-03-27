/**
 * Sidebar.jsx
 * Sidebar tipo "icon rail" — angosto por defecto, se expande
 * al hover en desktop / botón en móvil.
 */
import { useState }         from 'react'
import { NavLink }          from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, PieChart, ChevronRight } from 'lucide-react'
import styles               from './Sidebar.module.css'

const NAV = [
  { to: '/',             icon: LayoutDashboard,  label: 'Dashboard',     end: true },
  { to: '/transactions', icon: ArrowLeftRight,   label: 'Transacciones'            },
  { to: '/budget',       icon: PieChart,         label: 'Análisis'                 },
]

export default function Sidebar() {
  const [expanded, setExpanded]   = useState(false)
  const [mobileOpen, setMobile]   = useState(false)

  return (
    <>
      {/* Overlay móvil */}
      {mobileOpen && (
        <div className={styles.overlay} onClick={() => setMobile(false)} />
      )}

      {/* Botón hamburguesa móvil */}
      <button
        className={styles.hamburger}
        onClick={() => setMobile((o) => !o)}
        aria-label="Menú"
      >
        <ChevronRight size={18} style={{ transform: mobileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      <aside
        className={`${styles.sidebar} ${expanded ? styles.exp : ''} ${mobileOpen ? styles.mobileOpen : ''}`}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <nav className={styles.nav}>
          <p className={styles.section}>Menu</p>
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobile(false)}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.iconWrap}><Icon size={18} strokeWidth={2} /></span>
              <span className={styles.linkLabel}>{label}</span>
              {/* Indicador activo */}
              <span className={styles.activeDot} />
            </NavLink>
          ))}
        </nav>

        {/* Footer versión */}
        <div className={styles.footer}>
          <span className={styles.ver}>v2.0</span>
        </div>
      </aside>
    </>
  )
}