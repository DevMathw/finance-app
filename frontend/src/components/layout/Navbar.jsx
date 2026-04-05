/**
 * Navbar.jsx — Editorial Finance
 * Logo en Fraunces itálica (marca editorial).
 * Fondo translúcido con blur.
 */
import { Bell, LogOut }  from 'lucide-react'
import { useAuth }       from '../../context/AuthContext'
import ThemeToggle       from '../common/ThemeToggle'
import styles            from './Navbar.module.css'

export default function Navbar() {
  const { user, logout } = useAuth()

  const hour  = new Date().getHours()
  const greet = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <header className={styles.bar}>
      {/* Marca — logo en Fraunces itálica */}
      <div className={styles.brand}>
        <span className={styles.logoMark}>◈</span>
        <span className={styles.logoName}>Finanzas</span>
      </div>

      {/* Acciones */}
      <div className={styles.right}>
        {user && (
          <span className={styles.greet}>
            {greet}, <strong>{user.name.split(' ')[0]}</strong>
          </span>
        )}

        <ThemeToggle />

        <button className={styles.iconBtn} aria-label="Notificaciones">
          <Bell size={15} strokeWidth={2} />
        </button>

        {user && (
          <button
            className={styles.iconBtn}
            onClick={logout}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <LogOut size={15} strokeWidth={2} />
          </button>
        )}
      </div>
    </header>
  )
}