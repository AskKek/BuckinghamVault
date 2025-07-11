'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

// Types for data management
export interface DataCache {
  [key: string]: {
    data: any
    timestamp: number
    ttl: number
  }
}

export interface DataProviderContextType {
  cache: DataCache
  setCache: (key: string, data: any, ttl?: number) => void
  getCache: (key: string) => any | null
  clearCache: (key?: string) => void
  isLoading: { [key: string]: boolean }
  setLoading: (key: string, loading: boolean) => void
  errors: { [key: string]: Error | null }
  setError: (key: string, error: Error | null) => void
}

const DataProviderContext = createContext<DataProviderContextType | undefined>(undefined)

export interface DataProviderProps {
  children: React.ReactNode
  defaultTTL?: number // Default time-to-live in milliseconds
}

export function DataProvider({ 
  children, 
  defaultTTL = 5 * 60 * 1000 // 5 minutes default
}: DataProviderProps) {
  const pathname = usePathname()
  const [cache, setDataCache] = useState<DataCache>({})
  const [isLoading, setLoadingStates] = useState<{ [key: string]: boolean }>({})
  const [errors, setErrors] = useState<{ [key: string]: Error | null }>({})

  // Clear expired cache entries
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setDataCache(prevCache => {
        const newCache = { ...prevCache }
        Object.keys(newCache).forEach(key => {
          if (newCache[key].timestamp + newCache[key].ttl < now) {
            delete newCache[key]
          }
        })
        return newCache
      })
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  // Clear route-specific cache on navigation
  useEffect(() => {
    // Optional: Clear specific cache keys on route change
    // This prevents stale data when navigating between pages
    const routeSpecificKeys = Object.keys(cache).filter(key => 
      key.startsWith(`route:${pathname}`)
    )
    
    if (routeSpecificKeys.length > 0) {
      // You can implement route-specific cache clearing logic here
    }
  }, [pathname])

  const setCache = (key: string, data: any, ttl: number = defaultTTL) => {
    setDataCache(prev => ({
      ...prev,
      [key]: {
        data,
        timestamp: Date.now(),
        ttl
      }
    }))
  }

  const getCache = (key: string): any | null => {
    const cached = cache[key]
    if (!cached) return null

    const now = Date.now()
    if (cached.timestamp + cached.ttl < now) {
      // Cache expired
      setDataCache(prev => {
        const newCache = { ...prev }
        delete newCache[key]
        return newCache
      })
      return null
    }

    return cached.data
  }

  const clearCache = (key?: string) => {
    if (key) {
      setDataCache(prev => {
        const newCache = { ...prev }
        delete newCache[key]
        return newCache
      })
    } else {
      setDataCache({})
    }
  }

  const setLoading = (key: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: loading
    }))
  }

  const setError = (key: string, error: Error | null) => {
    setErrors(prev => ({
      ...prev,
      [key]: error
    }))
  }

  const contextValue: DataProviderContextType = {
    cache,
    setCache,
    getCache,
    clearCache,
    isLoading,
    setLoading,
    errors,
    setError
  }

  return (
    <DataProviderContext.Provider value={contextValue}>
      {children}
    </DataProviderContext.Provider>
  )
}

// Hook to use the data provider
export function useDataProvider() {
  const context = useContext(DataProviderContext)
  if (!context) {
    throw new Error('useDataProvider must be used within a DataProvider')
  }
  return context
}

// Utility hook for data fetching with caching
export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: {
    ttl?: number
    refetchOnMount?: boolean
    refetchInterval?: number
  }
) {
  const { getCache, setCache, isLoading, setLoading, errors, setError } = useDataProvider()
  const [data, setData] = useState<T | null>(() => getCache(key))

  useEffect(() => {
    const fetchData = async () => {
      // Check cache first
      const cached = getCache(key)
      if (cached && !options?.refetchOnMount) {
        setData(cached)
        return
      }

      // Fetch new data
      setLoading(key, true)
      setError(key, null)

      try {
        const result = await fetcher()
        setData(result)
        setCache(key, result, options?.ttl)
      } catch (error) {
        setError(key, error as Error)
      } finally {
        setLoading(key, false)
      }
    }

    fetchData()

    // Set up refetch interval if specified
    if (options?.refetchInterval) {
      const interval = setInterval(fetchData, options.refetchInterval)
      return () => clearInterval(interval)
    }
  }, [key, options?.refetchOnMount])

  return {
    data,
    isLoading: isLoading[key] || false,
    error: errors[key] || null,
    refetch: async () => {
      setLoading(key, true)
      setError(key, null)
      try {
        const result = await fetcher()
        setData(result)
        setCache(key, result, options?.ttl)
        return result
      } catch (error) {
        setError(key, error as Error)
        throw error
      } finally {
        setLoading(key, false)
      }
    }
  }
}