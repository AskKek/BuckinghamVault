'use client'

import { AnalyticsProvider } from "@/components/Analytics/analytics-provider"
import { SimpleErrorBoundary } from "@/components/simple-error-boundary"
import { SecureAuthProvider } from "@/hooks/use-secure-auth"
import { StoreProvider } from "@/components/providers/store-provider"

interface ClientLayoutWrapperProps {
  children: React.ReactNode
  includeAnalytics?: boolean
  includeAuth?: boolean
  includeStore?: boolean
}

export function ClientLayoutWrapper({ 
  children, 
  includeAnalytics = false,
  includeAuth = false,
  includeStore = false 
}: ClientLayoutWrapperProps) {
  let content = children

  // Wrap with store provider if needed
  if (includeStore) {
    content = <StoreProvider>{content}</StoreProvider>
  }

  // Wrap with auth provider if needed
  if (includeAuth) {
    content = <SecureAuthProvider>{content}</SecureAuthProvider>
  }

  // Wrap with analytics provider if needed
  if (includeAnalytics) {
    content = <AnalyticsProvider>{content}</AnalyticsProvider>
  }

  // Always wrap with error boundary for safety
  return (
    <SimpleErrorBoundary>
      {content}
    </SimpleErrorBoundary>
  )
} 