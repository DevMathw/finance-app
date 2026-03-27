/**
 * Navbar.jsx — barra superior compacta con saludo + acciones.
 */
import { Bell, LogOut }  from 'lucide-react'
import { useAuth }       from '../../context/AuthContext'
import ThemeToggle       from '../common/ThemeToggle'
import styles            from './Navbar.module.css'

export default function Navbar() {
  const { user, logout } = useAuth()

  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <header className={styles.bar}>
      {/* Izquierda: marca */}
      <div className={styles.brand}>
        <span className={styles.logo}>◈</span>
        <span className={`${styles.name} heading`}>Finanzas</span>
      </div>

      {/* Derecha: acciones */}
      <div className={styles.right}>
        {user && (
          <span className={styles.greet}>
            {greet}, <strong>{user.name.split(' ')[0]}</strong>
          </span>
        )}

        <ThemeToggle />

        <button className={styles.iconBtn} aria-label="Notificaciones">
          <Bell size={16} strokeWidth={2} />
          <span className={styles.dot} />
        </button>

        {user && (
          <button className={styles.iconBtn} onClick={logout} aria-label="Cerrar sesión" title="Cerrar sesión">
            <LogOut size={16} strokeWidth={2} />
          </button>
        )}
      </div>
    </header>
  )
}