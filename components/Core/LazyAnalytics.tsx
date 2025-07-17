"use client"

import { lazy, Suspense } from 'react'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useDeviceDetection } from '@/lib/animation-utils'

// Lazy load analytics components only when needed
const PlotlyBitcoinCorrelationChart = lazy(() => 
  import('@/components/Analytics/PlotlyBitcoinCorrelationChart')
)

// Lightweight loading skeleton for analytics
const AnalyticsLoadingSkeleton = () => (
  <div className="w-full bg-navy/20 rounded-xl p-8 animate-pulse">
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 bg-gold/30 rounded w-48" />
          <div className="h-4 bg-white/20 rounded w-32" />
        </div>
        <div className="flex space-x-2">
          <div className="h-8 bg-white/10 rounded w-16" />
          <div className="h-8 bg-white/10 rounded w-16" />
          <div className="h-8 bg-white/10 rounded w-16" />
        </div>
      </div>
      
      {/* Chart area skeleton */}
      <div className="h-96 bg-navy/30 rounded-lg border border-gold/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-gold font-medium">Loading Analytics...</div>
        </div>
      </div>
      
      {/* Metrics skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-navy/40 rounded-lg p-4 space-y-2">
            <div className="h-4 bg-white/20 rounded w-20" />
            <div className="h-6 bg-gold/30 rounded w-24" />
            <div className="h-3 bg-white/15 rounded w-16" />
          </div>
        ))}
      </div>
    </div>
  </div>
)

interface LazyAnalyticsProps {
  className?: string
  priority?: boolean
}

/**
 * Performance-optimized analytics component with smart loading
 * Only loads heavy analytics when user scrolls to them or on mobile when visible
 */
export function LazyAnalytics({ className, priority = false }: LazyAnalyticsProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { 
    once: true, 
    margin: '200px' // Start loading 200px before component enters view
  })
  const { isMobileOrTablet, isLowEndDevice } = useDeviceDetection()
  
  // Determine when to load analytics
  const shouldLoadAnalytics = () => {
    // Always load if priority is set
    if (priority) return true
    
    // On low-end devices, only load when in view
    if (isLowEndDevice) return isInView
    
    // On mobile, load when in view to save bandwidth
    if (isMobileOrTablet) return isInView
    
    // On desktop, load proactively when in view
    return isInView
  }
  
  return (
    <div ref={ref} className={className}>
      {shouldLoadAnalytics() ? (
        <Suspense fallback={<AnalyticsLoadingSkeleton />}>
          <PlotlyBitcoinCorrelationChart />
        </Suspense>
      ) : (
        <AnalyticsLoadingSkeleton />
      )}
    </div>
  )
}

/**
 * Lightweight analytics preview for above-the-fold sections
 * Shows key metrics without heavy chart rendering
 */
export function AnalyticsPreview() {
  const currentData = {
    price: 117755,
    priceChange: 0.44,
    volume: 131400000000,
    correlation: -0.73
  }
  
  const formatPrice = (price: number) => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0 
    }).format(price)
  
  const formatVolume = (volume: number) => {
    if (volume >= 1e12) return `$${(volume / 1e12).toFixed(2)}T`
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`
    return `$${(volume / 1e6).toFixed(2)}M`
  }
  
  return (
    <div className="bg-navy/40 rounded-xl p-6 border border-gold/20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-sm text-white/60 mb-1">Bitcoin Price</div>
          <div className="text-xl font-bold text-gold">{formatPrice(currentData.price)}</div>
          <div className={`text-sm ${currentData.priceChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {currentData.priceChange > 0 ? '+' : ''}{currentData.priceChange.toFixed(2)}%
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-white/60 mb-1">24h Volume</div>
          <div className="text-xl font-bold text-white">{formatVolume(currentData.volume)}</div>
          <div className="text-sm text-white/40">Market Cap</div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-white/60 mb-1">Exchange Flow</div>
          <div className="text-xl font-bold text-red-400">{currentData.correlation.toFixed(2)}</div>
          <div className="text-sm text-white/40">Correlation</div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-white/60 mb-1">Market Status</div>
          <div className="text-xl font-bold text-green-400">Active</div>
          <div className="text-sm text-white/40">Real-time</div>
        </div>
      </div>
    </div>
  )
}