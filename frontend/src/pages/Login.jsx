/**
 * Login.jsx — Obsidian Finance
 * Página de auth con fondo con rejilla sutil y card centrada.
 */
import { useState }                from 'react'
import { useNavigate }             from 'react-router-dom'
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react'
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
  const { login }   = useAuth()
  const navigate    = useNavigate()

  const set = (e) => { setForm((f) => ({ ...f, [e.target.name]: e.target.value })); setError(null) }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try 
    {
      const fn  = mode === 'login' ? loginUser : registerUser
      const res = await fn(form)
      login(res.user, res.token)
      navigate('/')
    } 
    catch (err) 
    {
      setError(err.response?.data?.error || 'Error al procesar la solicitud.')
    } 
    finally
    {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* Rejilla de fondo */}
      <div className={styles.grid} aria-hidden="true" />

      {/* Bolas de luz de fondo */}
      <div className={styles.orb1} aria-hidden="true" />
      <div className={styles.orb2} aria-hidden="true" />

      {/* Toggle tema */}
      <div className={styles.themeBtn}><ThemeToggle /></div>

      <div className={`${styles.card} animate-up`}>
        {/* Marca */}
        <div className={styles.brand}>
          <span className={styles.logo}>◈</span>
          <span className={`${styles.appName} heading`}>FinanceApp</span>
        </div>

        {/* Encabezado */}
        <div className={styles.head}>
          <h1 className={`${styles.title} heading`}>
            {mode === 'login' ? 'Bienvenido' : 'Crear cuenta'}
          </h1>
          <p className={styles.sub}>
            {mode === 'login'
              ? 'Ingresa para continuar gestionando tus finanzas'
              : 'Empieza a tomar control de tu dinero hoy'}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={submit} className={styles.form} noValidate>
          {mode === 'register' && (
            <div className={`field animate-up d-1`}>
              <label className="field-label" htmlFor="name">Nombre</label>
              <div className={styles.inputWrap}>
                <User size={15} className={styles.inputIcon} />
                <input
                  id="name" name="name" type="text"
                  className={`field-input ${styles.indented}`}
                  placeholder="Tu nombre completo"
                  value={form.name} onChange={set} required autoComplete="name"
                />
              </div>
            </div>
          )}

          <div className={`field animate-up d-2`}>
            <label className="field-label" htmlFor="email">Correo electrónico</label>
            <div className={styles.inputWrap}>
              <Mail size={15} className={styles.inputIcon} />
              <input
                id="email" name="email" type="email"
                className={`field-input ${styles.indented}`}
                placeholder="tu@correo.com"
                value={form.email} onChange={set} required autoComplete="email"
              />
            </div>
          </div>

          <div className={`field animate-up d-3`}>
            <label className="field-label" htmlFor="password">Contraseña</label>
            <div className={styles.inputWrap}>
              <Lock size={15} className={styles.inputIcon} />
              <input
                id="password" name="password"
                type={showPwd ? 'text' : 'password'}
                className={`field-input ${styles.indented} ${styles.withToggle}`}
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
            <div className="alert alert-error animate-in">
              {error}
            </div>
          )}

          <Button
            type="submit" fullWidth size="lg"
            loading={loading}
            className="animate-up d-4"
          >
            {mode === 'login' ? 'Iniciar sesión' : 'Crear mi cuenta'}
          </Button>
        </form>

        <div className={styles.divider}>
          <span>o</span>
        </div>

        <p className={styles.switch}>
          {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button
            type="button"
            className={styles.switchBtn}
            onClick={() => { setMode((m) => m === 'login' ? 'register' : 'login'); setForm(EMPTY); setError(null) }}
          >
            {mode === 'login' ? 'Regístrate gratis' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </div>
  )
}
