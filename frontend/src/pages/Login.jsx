/**
 * Login.jsx — Editorial Finance
 * Fondo cálido con patrón de puntos. Card centrada.
 * Logo en Fraunces itálica.
 */
import { useState }                from 'react'
import { useNavigate }             from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { loginUser, registerUser } from '../api/authApi'
import { useAuth }                 from '../context/AuthContext'
import Button                      from '../components/common/Button'
import ThemeToggle                 from '../components/common/ThemeToggle'
import styles                      from './Login.module.css'

const EMPTY = { name: '', email: '', password: '' }

export default function Login() {
  const [mode,    setMode]    = useState('login')
  const [form,    setForm]    = useState(EMPTY)
  const [showPwd, setShowPwd] = useState(false)
  const [error,   setError]   = useState(null)
  const [loading, setLoading] = useState(false)
  const { login }  = useAuth()
  const navigate   = useNavigate()

  const set = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setError(null)
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const fn  = mode === 'login' ? loginUser : registerUser
      const res = await fn(form)
      login(res.user, res.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al procesar la solicitud.')
    } finally { setLoading(false) }
  }

  const switchMode = () => {
    setMode((m) => m === 'login' ? 'register' : 'login')
    setForm(EMPTY); setError(null)
  }

  return (
    <div className={styles.page}>
      {/* Patrón de puntos cálido */}
      <div className={styles.dots} aria-hidden="true" />

      {/* Toggle tema */}
      <div className={styles.themeBtn}><ThemeToggle /></div>

      <div className={`${styles.card} card animate-up`}>
        {/* Logo editorial */}
        <div className={styles.brand}>
          <span className={styles.logoMark}>◈</span>
          <span className={styles.logoName}>Finanzas</span>
        </div>

        {/* Encabezado */}
        <div className={styles.head}>
          <h1 className={`${styles.title} display-sm`}>
            {mode === 'login' ? 'Bienvenido' : 'Crear cuenta'}
          </h1>
          <p className={styles.sub}>
            {mode === 'login'
              ? 'Ingresa para gestionar tus finanzas'
              : 'Empieza a tomar control de tu dinero'}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={submit} className={styles.form} noValidate>
          {mode === 'register' && (
            <div className="field animate-up delay-1">
              <label className="field-label" htmlFor="name">Nombre</label>
              <div className="input-wrap">
                <User size={14} className="input-icon-left" />
                <input
                  id="name" name="name" type="text"
                  className="field-input has-icon-left"
                  placeholder="Tu nombre completo"
                  value={form.name} onChange={set} required autoComplete="name"
                />
              </div>
            </div>
          )}

          <div className="field animate-up delay-2">
            <label className="field-label" htmlFor="email">Correo electrónico</label>
            <div className="input-wrap">
              <Mail size={14} className="input-icon-left" />
              <input
                id="email" name="email" type="email"
                className="field-input has-icon-left"
                placeholder="tu@correo.com"
                value={form.email} onChange={set} required autoComplete="email"
              />
            </div>
          </div>

          <div className="field animate-up delay-3">
            <label className="field-label" htmlFor="password">Contraseña</label>
            <div className="input-wrap">
              <Lock size={14} className="input-icon-left" />
              <input
                id="password" name="password"
                type={showPwd ? 'text' : 'password'}
                className="field-input has-icon-left has-icon-right"
                placeholder="Mínimo 6 caracteres"
                value={form.password} onChange={set} required minLength={6}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPwd((v) => !v)}
                aria-label={showPwd ? 'Ocultar' : 'Mostrar'}
              >
                {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger animate-in">{error}</div>
          )}

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={loading}
            iconRight={!loading && <ArrowRight size={15} />}
            className="animate-up delay-4"
          >
            {mode === 'login' ? 'Iniciar sesión' : 'Crear mi cuenta'}
          </Button>
        </form>

        {/* Divisor */}
        <div className={styles.orDiv}><span>o</span></div>

        {/* Switch */}
        <p className={styles.switch}>
          {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button type="button" className={styles.switchBtn} onClick={switchMode}>
            {mode === 'login' ? 'Regístrate gratis →' : 'Inicia sesión →'}
          </button>
        </p>
      </div>
    </div>
  )
}
