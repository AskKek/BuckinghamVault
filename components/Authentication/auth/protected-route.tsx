"use client"

import { useSecureAuth } from '@/hooks/use-secure-auth'
import { UserRole } from '@/types/financial'
import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRoles?: UserRole[]
  requiredPermissions?: { action: string; resource: string }[]
  fallbackPath?: string
}

export function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  requiredPermissions = [],
  fallbackPath = '/login'
}: ProtectedRouteProps) {
  const { user, isLoading, hasPermission } = useSecureAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(fallbackPath)
      return
    }

    if (!isLoading && user) {
      // Check role requirements
      if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
        router.push('/unauthorized')
        return
      }

      // Check permission requirements
      if (requiredPermissions.length > 0) {
        const hasAllPermissions = requiredPermissions.every(({ action, resource }) =>
          hasPermission(action, resource)
        )
        
        if (!hasAllPermissions) {
          router.push('/unauthorized')
          return
        }
      }
    }
  }, [user, isLoading, requiredRoles, requiredPermissions, router, fallbackPath, hasPermission])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Check role requirements
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return null
  }

  // Check permission requirements
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(({ action, resource }) =>
      hasPermission(action, resource)
    )
    
    if (!hasAllPermissions) {
      return null
    }
  }

  return <>{children}</>
}