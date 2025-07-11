'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { GoogleAnalytics, pageview } from '@/lib/analytics/google-analytics'
import { reportWebVitals } from '@/lib/analytics/web-vitals'

function AnalyticsTracking() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track page views
  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams.toString() ? '?' + searchParams.toString() : '')
      pageview(url)
    }
  }, [pathname, searchParams])

  return null
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  // Simplified initialization without complex performance monitoring
  useEffect(() => {
    // Simple Web Vitals reporting
    if (typeof window !== 'undefined') {
      reportWebVitals()
    }
  }, [])

  return (
    <>
      <GoogleAnalytics />
      <Suspense fallback={null}>
        <AnalyticsTracking />
      </Suspense>
      {children}
    </>
  )
}