"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { User } from '@/types/financial'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
  hasPermission: (action: string, resource: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function SecureAuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  // Simple fetch with CSRF support (inline implementation to avoid circular deps)
  const fetchWithAuth = useCallback(async (url: string, options: RequestInit = {}) => {
    // Get CSRF token from cookie
    const getCSRFToken = (): string | null => {
      if (typeof document === 'undefined') return null
      const cookies = document.cookie.split(';')
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=')
        if (name === 'csrf-token') return decodeURIComponent(value)
      }
      return null
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    const csrfToken = getCSRFToken()
    if (csrfToken && options.method && !['GET', 'HEAD', 'OPTIONS'].includes(options.method)) {
      (headers as Record<string, string>)['x-csrf-token'] = csrfToken
    }

    return fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    })
  }, [])

  // Fetch current user from secure endpoint
  const fetchUser = useCallback(async (): Promise<User | null> => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include', // Include HTTP-only cookies
      })

      if (response.ok) {
        const data = await response.json()
        return data.user
      }

      if (response.status === 401) {
        // Try to refresh token
        const refreshResponse = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        })

        if (refreshResponse.ok) {
          // Retry fetching user after refresh
          const retryResponse = await fetch('/api/auth/me', {
            method: 'GET',
            credentials: 'include',
          })

          if (retryResponse.ok) {
            const retryData = await retryResponse.json()
            return retryData.user
          }
        }
      }

      return null
    } catch (error) {
      console.error('Failed to fetch user:', error)
      return null
    }
  }, [])

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true)
      const userData = await fetchUser()
      setUser(userData)
      setIsLoading(false)
    }

    initAuth()
  }, [fetchUser])

  // Login function
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    
    try {
      const response = await fetchWithAuth('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setUser(data.user)
        setIsLoading(false)
        return { success: true }
      } else {
        setIsLoading(false)
        return { 
          success: false, 
          error: data.message || data.error || 'Login failed' 
        }
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Login error:', error)
      return { 
        success: false, 
        error: 'Network error. Please try again.' 
      }
    }
  }

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await fetchWithAuth('/api/auth/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
    }
  }

  // Refresh authentication
  const refreshAuth = async (): Promise<void> => {
    const userData = await fetchUser()
    setUser(userData)
  }

  // Check permissions
  const hasPermission = useCallback((action: string, resource: string): boolean => {
    if (!user) return false
    
    // Admin has all permissions
    if (user.role === 'admin') return true
    
    // Check specific permissions
    return user.permissions.some(permission => {
      const actionMatch = permission.action === '*' || permission.action === action
      const resourceMatch = permission.resource === '*' || permission.resource === resource
      
      // Check conditions if they exist
      if (permission.conditions && actionMatch && resourceMatch) {
        // For mandate-specific permissions
        if (permission.conditions.mandateId && user.mandateId !== permission.conditions.mandateId) {
          return false
        }
      }
      
      return actionMatch && resourceMatch
    })
  }, [user])

  // Auto-refresh token every 20 minutes
  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(async () => {
      try {
        await fetchWithAuth('/api/auth/refresh', {
          method: 'POST',
        })
      } catch (error) {
        console.error('Auto-refresh failed:', error)
      }
    }, 20 * 60 * 1000) // 20 minutes

    return () => clearInterval(interval)
  }, [isAuthenticated])

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated,
      login,
      logout,
      refreshAuth,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useSecureAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useSecureAuth must be used within a SecureAuthProvider')
  }
  return context
}

// Safe version that returns default values when no provider
export function useSecureAuthSafe() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    // Return default values for public pages
    return {
      user: null,
      isLoading: false,
      isAuthenticated: false,
      login: async () => ({ success: false, error: 'No auth provider' }),
      logout: async () => {},
      refreshAuth: async () => {},
      hasPermission: () => false
    }
  }
  return context
}

// Utility hook for API calls with authentication and CSRF protection
export function useAuthenticatedFetch() {
  const { refreshAuth } = useSecureAuth()

  return useCallback(async (url: string, options: RequestInit = {}) => {
    // Get CSRF token from cookie
    const getCSRFToken = (): string | null => {
      if (typeof document === 'undefined') return null
      const cookies = document.cookie.split(';')
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=')
        if (name === 'csrf-token') return decodeURIComponent(value)
      }
      return null
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    const csrfToken = getCSRFToken()
    if (csrfToken && options.method && !['GET', 'HEAD', 'OPTIONS'].includes(options.method)) {
      (headers as Record<string, string>)['x-csrf-token'] = csrfToken
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    })

    // If unauthorized, try to refresh and retry once
    if (response.status === 401) {
      const refreshHeaders: HeadersInit = {
        'Content-Type': 'application/json'
      }
      
      if (csrfToken) {
        (refreshHeaders as Record<string, string>)['x-csrf-token'] = csrfToken
      }

      const refreshResponse = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: refreshHeaders,
        credentials: 'include',
      })

      if (refreshResponse.ok) {
        await refreshAuth()
        
        // Retry original request
        return fetch(url, {
          ...options,
          headers,
          credentials: 'include',
        })
      }
    }

    return response
  }, [refreshAuth])
}