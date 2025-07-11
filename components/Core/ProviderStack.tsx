'use client'

import React from 'react'
import { ThemeProvider } from '../theme-provider'
import { PerformanceOptimizer } from '../performance-optimizer'
import { ClientAuthProvider } from './ClientAuthProvider'
import { DataProvider } from './DataProvider'
import { AnalyticsProvider } from '../Analytics/analytics-provider'
import { StoreProvider } from '../providers/store-provider'

interface ProviderStackProps {
  children: React.ReactNode
  variant: 'root' | 'auth' | 'public'
  enableAnalytics?: boolean
  enableStore?: boolean
}

export function ProviderStack({ 
  children, 
  variant,
  enableAnalytics = true,
  enableStore = true
}: ProviderStackProps) {
  // Root providers - always needed
  let content = (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <PerformanceOptimizer />
      <DataProvider>
        {children}
      </DataProvider>
    </ThemeProvider>
  )

  // Auth variant - add auth and optional providers
  if (variant === 'auth') {
    content = (
      <ThemeProvider defaultTheme="dark" attribute="class">
        <PerformanceOptimizer />
        <ClientAuthProvider>
          <DataProvider>
            {enableStore ? (
              <StoreProvider>
                {enableAnalytics ? (
                  <AnalyticsProvider>
                    {children}
                  </AnalyticsProvider>
                ) : children}
              </StoreProvider>
            ) : (
              enableAnalytics ? (
                <AnalyticsProvider>
                  {children}
                </AnalyticsProvider>
              ) : children
            )}
          </DataProvider>
        </ClientAuthProvider>
      </ThemeProvider>
    )
  }

  // Public variant - minimal providers
  if (variant === 'public') {
    content = (
      <ThemeProvider defaultTheme="dark" attribute="class">
        <PerformanceOptimizer />
        <DataProvider>
          {enableAnalytics ? (
            <AnalyticsProvider>
              {children}
            </AnalyticsProvider>
          ) : children}
        </DataProvider>
      </ThemeProvider>
    )
  }

  return content
}