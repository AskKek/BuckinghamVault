"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/types/financial'
import { mockUsers } from '@/lib/mock-data'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (action: string, resource: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('buckingham-vault-user')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      } catch (error) {
        localStorage.removeItem('buckingham-vault-user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock authentication - find user by email
    const foundUser = mockUsers.find(u => u.email === email && u.isActive)
    
    if (foundUser) {
      // Update last login
      const userWithLogin = {
        ...foundUser,
        lastLogin: new Date()
      }
      
      setUser(userWithLogin)
      localStorage.setItem('buckingham-vault-user', JSON.stringify(userWithLogin))
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('buckingham-vault-user')
  }

  const hasPermission = (action: string, resource: string): boolean => {
    if (!user) return false
    
    // Admin has all permissions
    if (user.role === 'admin') return true
    
    // Check specific permissions
    return user.permissions.some(permission => {
      const actionMatch = permission.action === '*' || permission.action === action
      const resourceMatch = permission.resource === '*' || permission.resource === resource
      return actionMatch && resourceMatch
    })
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}