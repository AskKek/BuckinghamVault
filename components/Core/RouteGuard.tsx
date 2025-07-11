'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSecureAuthSafe } from '@/hooks/use-secure-auth'
import { UserRole } from '@/types/financial'

// Permission string format: 'action:resource'
export type PermissionString = string
import { Shield, Lock, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { BuckinghamVaultIcon } from '../Custom-UI/buckingham-vault-icon'

export interface RouteGuardProps {
  requiredRoles?: UserRole[]
  requiredPermissions?: PermissionString[]
  requireAuth?: boolean
  fallbackUrl?: string
  showUnauthorized?: boolean
  children: React.ReactNode
}

const LoadingState = () => (
  <div className="min-h-screen bg-navy-900 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <BuckinghamVaultIcon className="w-16 h-16 animate-pulse" />
      <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
      <p className="text-gold-400 text-sm">Verifying access...</p>
    </div>
  </div>
)

const UnauthorizedState = ({ onBack }: { onBack: () => void }) => (
  <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
    <div className="max-w-md w-full">
      <div className="bg-navy-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gold-500/20">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <Shield className="w-16 h-16 text-gold-500" />
            <Lock className="w-6 h-6 text-red-500 absolute -bottom-1 -right-1" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Access Restricted
            </h2>
            <p className="text-gray-400">
              You don't have the required permissions to access this area. 
              Please contact your administrator or switch to an authorized account.
            </p>
          </div>

          <div className="flex gap-4 w-full">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1 border-gold-500/20 hover:border-gold-500/40"
            >
              Go Back
            </Button>
            <Button
              onClick={() => window.location.href = '/auth/login'}
              className="flex-1 bg-gold-600 hover:bg-gold-700"
            >
              Switch Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export function RouteGuard({
  requiredRoles = [],
  requiredPermissions = [],
  requireAuth = true,
  fallbackUrl = '/login',
  showUnauthorized = true,
  children
}: RouteGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading, isAuthenticated, hasPermission } = useSecureAuthSafe()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Skip check during SSR and initial loading
    if (!isClient || isLoading) {
      setIsAuthorized(null)
      return
    }

    // Check authentication requirement
    if (requireAuth && !isAuthenticated) {
      router.push(`${fallbackUrl}?redirect=${encodeURIComponent(pathname || '/')}`)
      return
    }

    // If no specific requirements, user is authorized
    if (requiredRoles.length === 0 && requiredPermissions.length === 0) {
      setIsAuthorized(true)
      return
    }

    // Check role-based access
    const hasRequiredRole = requiredRoles.length === 0 || 
      (user && requiredRoles.includes(user.role))

    // Check permission-based access
    const hasRequiredPermissions = requiredPermissions.length === 0 ||
      requiredPermissions.every(permission => {
        const [action, resource] = permission.split(':') as [string, string]
        return hasPermission(action, resource)
      })

    const authorized = hasRequiredRole && hasRequiredPermissions
    setIsAuthorized(authorized)

    // Redirect if not authorized and not showing unauthorized page
    if (!authorized && !showUnauthorized) {
      router.push(fallbackUrl)
    }
  }, [
    isClient, // Add isClient to dependencies
    isLoading, 
    isAuthenticated, 
    user, 
    requiredRoles, 
    requiredPermissions, 
    hasPermission,
    router, 
    fallbackUrl, 
    pathname,
    showUnauthorized
  ])

  // Show loading state during SSR and initial client render
  if (!isClient || isLoading || isAuthorized === null) {
    return <LoadingState />
  }

  // Show unauthorized state
  if (!isAuthorized && showUnauthorized) {
    return <UnauthorizedState onBack={() => router.back()} />
  }

  // User is authorized
  return <>{children}</>
}

// Utility hook for checking permissions in components
export function useRouteGuard(
  requiredRoles: UserRole[] = [],
  requiredPermissions: PermissionString[] = []
) {
  const { user, isAuthenticated, hasPermission } = useSecureAuthSafe()

  const hasRequiredRole = requiredRoles.length === 0 || 
    (user && requiredRoles.includes(user.role))

  const hasRequiredPermissions = requiredPermissions.length === 0 ||
    requiredPermissions.every(permission => {
      const [action, resource] = permission.split(':') as [string, string]
      return hasPermission(action, resource)
    })

  return {
    isAuthorized: isAuthenticated && hasRequiredRole && hasRequiredPermissions,
    isLoading: false,
    user
  }
}