'use client'

import React, { useEffect, useState } from 'react'
import { SecureAuthProvider } from '@/hooks/use-secure-auth'

interface ClientAuthProviderProps {
  children: React.ReactNode
}

// This component ensures the auth provider only runs on the client
// preventing SSR/hydration issues
export function ClientAuthProvider({ children }: ClientAuthProviderProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // During SSR, render children without auth provider
  // This prevents the useContext error on the server
  if (!isClient) {
    return <>{children}</>
  }

  // On client, wrap with the actual auth provider
  return (
    <SecureAuthProvider>
      {children}
    </SecureAuthProvider>
  )
}