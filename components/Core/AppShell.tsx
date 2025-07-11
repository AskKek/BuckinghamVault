'use client'

import React, { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { SimpleErrorBoundary } from '../simple-error-boundary'
import { ElegantSidebar } from '../Navigation/elegant-sidebar'
import { PageLayout } from '../page-layout'
import { BuckinghamVaultIcon } from '../Custom-UI/buckingham-vault-icon'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'

export interface AppShellProps {
  variant: 'public' | 'auth' | 'client' | 'mandate'
  children: React.ReactNode
  showSidebar?: boolean
  className?: string
}

const LoadingFallback = () => (
  <div className="min-h-screen bg-navy-900 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <BuckinghamVaultIcon className="w-16 h-16 animate-pulse" />
      <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
      <p className="text-gold-400 text-sm">Loading...</p>
    </div>
  </div>
)

export function AppShell({ 
  variant, 
  children, 
  showSidebar = true,
  className 
}: AppShellProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  
  // Determine if we should show navigation based on variant and route
  const shouldShowNavigation = showSidebar && (
    variant === 'public' || 
    (variant === 'auth' && !pathname?.includes('/onboarding'))
  )

  // Public variant doesn't need PageLayout wrapper
  if (variant === 'public') {
    return (
      <SimpleErrorBoundary>
        <div className={cn('min-h-screen bg-navy-900', className)}>
          <Suspense fallback={<LoadingFallback />}>
            {children}
          </Suspense>
          {shouldShowNavigation && (
            <ElegantSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          )}
        </div>
      </SimpleErrorBoundary>
    )
  }

  // Auth variants use PageLayout for consistent authenticated experience
  const getPageTitle = () => {
    switch (variant) {
      case 'client':
        return 'Client Portal'
      case 'mandate':
        return 'Mandate Portal'
      default:
        return 'Buckingham Vault'
    }
  }

  const getPageSubtitle = () => {
    switch (variant) {
      case 'client':
        return 'Institutional Trading Services'
      case 'mandate':
        return 'Deal Management System'
      default:
        return 'Digital Asset Management'
    }
  }

  return (
    <SimpleErrorBoundary>
      <PageLayout
        title={getPageTitle()}
        subtitle={getPageSubtitle()}
        showBackButton={pathname !== '/vault/dashboard'}
      >
        <Suspense fallback={<LoadingFallback />}>
          <div className={cn('relative', className)}>
            {children}
          </div>
        </Suspense>
      </PageLayout>
    </SimpleErrorBoundary>
  )
}

// Export loading component for reuse
export { LoadingFallback }