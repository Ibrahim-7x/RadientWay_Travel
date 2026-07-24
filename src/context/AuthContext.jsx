import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { api, getToken, setToken, clearToken } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On boot, validate any stored token against /auth/me.
  useEffect(() => {
    let alive = true
    async function boot() {
      if (!getToken()) {
        setLoading(false)
        return
      }
      try {
        const me = await api.get('/auth/me')
        if (alive) setUser(me)
      } catch {
        clearToken()
      } finally {
        if (alive) setLoading(false)
      }
    }
    boot()
    return () => {
      alive = false
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const { token, user: u } = await api.post('/auth/login', { email, password }, { auth: false })
    setToken(token)
    setUser(u)
    return u
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthed: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
