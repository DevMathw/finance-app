import { createContext, useContext, useState } from 'react'

const Ctx = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user,  setUser]  = useState(() => { try { return JSON.parse(localStorage.getItem('fz_user')) } catch { return null } })
  const [token, setToken] = useState(() => localStorage.getItem('fz_token') || null)

  const login = (u, t) => {
    setUser(u); setToken(t)
    localStorage.setItem('fz_user',  JSON.stringify(u))
    localStorage.setItem('fz_token', t)
  }
  const logout = () => {
    setUser(null); setToken(null)
    localStorage.removeItem('fz_user')
    localStorage.removeItem('fz_token')
  }

  return <Ctx.Provider value={{ user, token, login, logout, isAuth: !!token }}>{children}</Ctx.Provider>
}

export const useAuth = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}