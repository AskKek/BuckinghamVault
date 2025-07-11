"use client"

import { useState, useEffect, useCallback } from 'react'

interface CSRFState {
  token: string | null
  isLoading: boolean
  error: string | null
}

export function useCSRF() {
  const [state, setState] = useState<CSRFState>({
    token: null,
    isLoading: true,
    error: null
  })

  // Get CSRF token from cookies (client-side)
  const getTokenFromCookie = useCallback((): string | null => {
    if (typeof document === 'undefined') return null
    
    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name === 'csrf-token') {
        return decodeURIComponent(value)
      }
    }
    return null
  }, [])

  // Fetch CSRF token from server
  const fetchCSRFToken = useCallback(async (): Promise<string | null> => {
    try {
      const response = await fetch('/api/auth/csrf', {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        return data.csrfToken
      }

      console.error('Failed to fetch CSRF token:', response.status)
      return null
    } catch (error) {
      console.error('CSRF token fetch error:', error)
      return null
    }
  }, [])

  // Initialize CSRF token
  useEffect(() => {
    const initCSRF = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      // First, try to get token from cookie
      let token = getTokenFromCookie()

      // If no token in cookie, fetch from server
      if (!token) {
        token = await fetchCSRFToken()
      }

      if (token) {
        setState({
          token,
          isLoading: false,
          error: null
        })
      } else {
        setState({
          token: null,
          isLoading: false,
          error: 'Failed to obtain CSRF token'
        })
      }
    }

    initCSRF()
  }, [getTokenFromCookie, fetchCSRFToken])

  // Refresh CSRF token
  const refreshToken = useCallback(async (): Promise<string | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    const token = await fetchCSRFToken()

    if (token) {
      setState({
        token,
        isLoading: false,
        error: null
      })
    } else {
      setState({
        token: null,
        isLoading: false,
        error: 'Failed to refresh CSRF token'
      })
    }

    return token
  }, [fetchCSRFToken])

  // Create headers object with CSRF token
  const getHeaders = useCallback((additionalHeaders: HeadersInit = {}): HeadersInit => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...additionalHeaders
    }

    if (state.token) {
      (headers as Record<string, string>)['x-csrf-token'] = state.token
    }

    return headers
  }, [state.token])

  // Enhanced fetch function with CSRF protection
  const fetchWithCSRF = useCallback(async (
    url: string, 
    options: RequestInit = {}
  ): Promise<Response> => {
    const headers = getHeaders(options.headers)

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    })

    // If CSRF token is invalid, try to refresh and retry once
    if (response.status === 403) {
      const errorData = await response.json().catch(() => ({}))
      
      if (errorData.error?.includes('CSRF')) {
        const newToken = await refreshToken()
        
        if (newToken) {
          const newHeaders = getHeaders(options.headers)
          
          return fetch(url, {
            ...options,
            headers: newHeaders,
            credentials: 'include',
          })
        }
      }
    }

    return response
  }, [getHeaders, refreshToken])

  return {
    token: state.token,
    isLoading: state.isLoading,
    error: state.error,
    refreshToken,
    getHeaders,
    fetchWithCSRF
  }
}