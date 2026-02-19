import { createContext, useContext, useState, useEffect } from 'react'
import { setAdminToken } from '../services/api'

const AuthContext = createContext(null)

// Default admin credentials
const DEFAULT_USERNAME = 'admin'
const DEFAULT_PASSWORD = 'covreform2026'

const STORAGE_KEY = 'covreform_admin_user'
const PASSWORD_KEY = 'covreform_admin_password'

function getStoredPassword() {
  return localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setUser(JSON.parse(stored))
        setAdminToken(getStoredPassword())
      }
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  const login = (username, password) => {
    const currentPassword = getStoredPassword()
    if (username === DEFAULT_USERNAME && password === currentPassword) {
      const userData = { displayName: 'Admin', email: username }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
      setUser(userData)
      setAdminToken(password)
      return true
    }
    return false
  }

  const changePassword = (currentPassword, newPassword) => {
    const storedPassword = getStoredPassword()
    if (currentPassword !== storedPassword) {
      return { success: false, error: 'Current password is incorrect' }
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters' }
    }
    localStorage.setItem(PASSWORD_KEY, newPassword)
    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
    setAdminToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
