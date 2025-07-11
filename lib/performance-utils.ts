/**
 * Performance utilities for device detection and optimization
 * Provides hooks and utilities for responsive design and performance optimization
 */

import { useState, useEffect } from 'react'

export interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isTouchDevice: boolean
  devicePixelRatio: number
  connectionType: string | null
  reducedMotion: boolean
}

/**
 * Hook to detect device information and capabilities
 * @returns DeviceInfo object with device characteristics
 */
export function useDeviceInfo(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    devicePixelRatio: 1,
    connectionType: null,
    reducedMotion: false
  })

  useEffect(() => {
    const updateDeviceInfo = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      const isTabletDevice = /ipad|android(?!.*mobile)|tablet/i.test(userAgent)
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isSmallScreen = window.innerWidth < 768
      const isMediumScreen = window.innerWidth >= 768 && window.innerWidth < 1024
      
      const nav = navigator as any
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection
      
      setDeviceInfo({
        isMobile: isMobileDevice || isSmallScreen,
        isTablet: isTabletDevice || isMediumScreen,
        isDesktop: !isMobileDevice && !isTabletDevice && window.innerWidth >= 1024,
        isTouchDevice,
        devicePixelRatio: window.devicePixelRatio || 1,
        connectionType: connection?.effectiveType || null,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      })
    }

    updateDeviceInfo()
    window.addEventListener('resize', updateDeviceInfo)
    
    return () => window.removeEventListener('resize', updateDeviceInfo)
  }, [])

  return deviceInfo
}

/**
 * Hook for performance-aware animations
 * @returns Object with animation settings based on device capabilities
 */
export function usePerformanceAwareAnimations() {
  const deviceInfo = useDeviceInfo()
  
  return {
    shouldAnimate: !deviceInfo.reducedMotion && (deviceInfo.isDesktop || !deviceInfo.isMobile),
    duration: deviceInfo.isMobile ? 0.2 : 0.5,
    complexity: deviceInfo.isDesktop ? 'high' : deviceInfo.isTablet ? 'medium' : 'low',
    particleCount: deviceInfo.isDesktop ? 50 : deviceInfo.isTablet ? 25 : 10
  }
}

/**
 * Utility to determine if expensive effects should be enabled
 * @returns boolean indicating if device can handle premium effects
 */
export function shouldEnablePremiumEffects(): boolean {
  if (typeof window === 'undefined') return false
  
  // Simplified version without hooks to avoid build errors
  const isDesktop = window.innerWidth >= 1024
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  return isDesktop && !prefersReducedMotion
}

/**
 * Utility for conditional rendering based on device capabilities
 */
export const DeviceConditional = {
  isHighPerformance: () => {
    if (typeof window === 'undefined') return false
    return window.innerWidth >= 1024 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },
  
  isMobileOptimized: () => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 768 || 'ontouchstart' in window
  },
  
  supportsAdvancedFeatures: () => {
    if (typeof window === 'undefined') return false
    return window.WebGLRenderingContext && window.IntersectionObserver
  }
}

// Performance monitoring utilities removed - use createPerformanceMonitor() from @/lib/analytics/performance-monitor instead 