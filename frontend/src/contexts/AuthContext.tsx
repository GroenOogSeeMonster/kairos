import React, { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../services/api'

interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  isOnboarded: boolean
  timezone: string
  preferences: Record<string, any>
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string) => Promise<void>
  register: (email: string, name: string) => Promise<void>
  logout: () => void
  googleLogin: (idToken: string) => Promise<void>
  updateUser: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authApi.getCurrentUser()
        .then((userData) => {
          setUser(userData.data.user)
        })
        .catch(() => {
          localStorage.removeItem('token')
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string) => {
    const response = await authApi.login(email)
    localStorage.setItem('token', response.data.token)
    setUser(response.data.user)
  }

  const register = async (email: string, name: string) => {
    const response = await authApi.register(email, name)
    localStorage.setItem('token', response.data.token)
    setUser(response.data.user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const googleLogin = async (idToken: string) => {
    const response = await authApi.googleLogin(idToken)
    localStorage.setItem('token', response.data.token)
    setUser(response.data.user)
  }

  const updateUser = async (data: Partial<User>) => {
    const updatedUser = await authApi.updateUser(data)
    setUser(updatedUser.data)
  }

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    googleLogin,
    updateUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 