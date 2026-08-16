'use client'

import { createContext, useContext, useMemo, useCallback, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export interface User {
  id?: string
  name?: string
  email?: string
  role?: string
  [key: string]: unknown
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (userData: User, token?: string) => void
  logout: () => Promise<void>
}

interface AuthProviderProps {
  children: ReactNode
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  const user = session?.user ?? null

  const login = useCallback((userData: User, token?: string) => {
    if (token) localStorage.setItem('token', token)
    if (userData) localStorage.setItem('user', JSON.stringify(userData))
  }, [])

  const logout = useCallback(async () => {
    try {
      await authClient.signOut()
    } catch (error) {
      console.error('Logout error:', error)
    }

    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }, [router])

  const value = useMemo<AuthContextType>(() => ({
    user,
    loading: isPending,
    login,
    logout,
  }), [user, isPending, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)

  if (!context) {
    const fallback: AuthContextType = {
      user: null,
      loading: false,
      login: () => undefined,
      logout: async () => undefined,
    }

    return fallback
  }

  return context
}