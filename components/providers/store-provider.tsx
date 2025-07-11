"use client"

import { useEffect } from 'react'
import { useBuckinghamStore } from '@/lib/store'

interface StoreProviderProps {
  children: React.ReactNode
}

/**
 * Store Provider Component
 * Simplified to avoid hydration mismatches
 */
export function StoreProvider({ children }: StoreProviderProps) {
  useEffect(() => {
    // Simple client-side initialization without complex hydration
    if (typeof window !== 'undefined') {
      // Initialize security state on client-side only
      const store = useBuckinghamStore.getState()
      if (store.actions?.security?.initializeSecurity) {
        store.actions.security.initializeSecurity()
      }
    }
  }, [])

  return <>{children}</>
}