'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export function PerformanceOptimizer() {
  useEffect(() => {
    // Simple resource preloading without complex cache management
    if (typeof window !== 'undefined') {
      preloadCriticalResources()
    }
  }, [])

  return (
    <>
      {/* Resource Hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      
      {/* Preload critical fonts */}
      <link
        rel="preload"
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Lato:wght@300;400&display=swap"
        as="style"
      />
      
      {/* Intersection Observer Polyfill for older browsers */}
      <Script
        src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver"
        strategy="beforeInteractive"
      />
    </>
  )
}

// Simplified helper functions
function preloadCriticalResources() {
  // Preload critical images
  const criticalImages = [
    '/images/buckingham-vault-icon.png',
    '/images/home-page-vault.png',
  ]

  criticalImages.forEach(src => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    document.head.appendChild(link)
  })
}