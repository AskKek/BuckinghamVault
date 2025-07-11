"use client"

import { useSecureAuth } from '@/hooks/use-secure-auth'
import { UserRole } from '@/types/financial'
import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { motion } from 'framer-motion'
import { AlertCircle, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface SecureProtectedRouteProps {
  children: ReactNode
  requiredRoles?: UserRole[]
  requiredPermissions?: { action: string; resource: string }[]
  fallbackPath?: string
  showUnauthorizedMessage?: boolean
}

export function SecureProtectedRoute({ 
  children, 
  requiredRoles = [], 
  requiredPermissions = [],
  fallbackPath = '/login',
  showUnauthorizedMessage = true
}: SecureProtectedRouteProps) {
  const { user, isLoading, isAuthenticated, hasPermission, logout } = useSecureAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(fallbackPath)
      return
    }
  }, [isAuthenticated, isLoading, router, fallbackPath])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-navy-light to-navy">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 glass-morphism rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-gold" />
          </div>
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-white/70">Verifying authentication...</p>
        </motion.div>
      </div>
    )
  }

  // If not authenticated, return null (redirect will happen)
  if (!isAuthenticated || !user) {
    return null
  }

  // Check role requirements
  const hasRequiredRole = requiredRoles.length === 0 || requiredRoles.includes(user.role)
  
  // Check permission requirements
  const hasRequiredPermissions = requiredPermissions.length === 0 || 
    requiredPermissions.every(({ action, resource }) => hasPermission(action, resource))

  // If authorization failed
  if (!hasRequiredRole || !hasRequiredPermissions) {
    if (!showUnauthorizedMessage) {
      router.push('/unauthorized')
      return null
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-navy-light to-navy p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto"
        >
          <Card className="glass-morphism border-red-500/20">
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                className="w-16 h-16 mx-auto bg-red-500/20 rounded-2xl flex items-center justify-center"
              >
                <AlertCircle className="w-8 h-8 text-red-400" />
              </motion.div>
              <CardTitle className="text-2xl font-display text-white">
                Access Denied
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 text-center">
              <div className="space-y-2">
                <p className="text-white/90">
                  You don't have the required permissions to access this resource.
                </p>
                <div className="text-sm text-white/60">
                  {!hasRequiredRole && (
                    <p>Required role: {requiredRoles.join(', ')}</p>
                  )}
                  {!hasRequiredPermissions && (
                    <p>Missing required permissions for this action.</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => router.push('/vault')}
                  className="w-full bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-navy font-semibold"
                >
                  Return to Dashboard
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => logout()}
                  className="w-full border-white/20 text-white hover:bg-white/5"
                >
                  Switch Account
                </Button>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-white/50">
                  Contact your administrator if you believe this is an error.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return <>{children}</>
}