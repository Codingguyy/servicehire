import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User } from '../types'
import { authService } from '../services/authService'

interface AuthCtx {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role?: string) => Promise<void>
  logout: () => void
}

const AuthContext =createContext<AuthCtx | undefined>(undefined)

export const AuthProvider:React.FC<{children: React.ReactNode }> = ({children}) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
const logout=useCallback(() => {
    localStorage.removeItem('token')
    setUser(null)
  }, [])

  useEffect(() => {
    if (!localStorage.getItem('token')) { setIsLoading(false); return }
    authService.getMe()
      .then(r => { if (r.success && r.data) setUser(r.data); else logout() })
      .catch(logout)
      .finally(() => setIsLoading(false))
  }, [logout])

  const login =async (email:string,password:string) => {
    const r=await authService.login({email,password})
    if (!r.success) throw r   
    if (r.data) { localStorage.setItem('token', r.data.token); setUser(r.data.user) }
  }

  const register =async(name:string,email:string,password:string,role?:string) => {
    const r=await authService.register({name,email,password, role})
    if (!r.success) throw r
    if (r.data) {localStorage.setItem('token', r.data.token); setUser(r.data.user) }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth =() => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
