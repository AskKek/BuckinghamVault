"use client"

import { useEffect } from 'react'
import { useDeviceDetection } from '@/lib/animation-utils'

interface CriticalImage {
  src: string
  type: 'webp' | 'avif' | 'png'
  sizes: string[]
  priority: number // 1 = highest priority
}

// Critical images that need preloading for optimal LCP
const CRITICAL_IMAGES: CriticalImage[] = [
  {
    src: 'home-page-vault',
    type: 'webp',
    sizes: ['sm', 'md', 'lg'],
    priority: 1
  },
  {
    src: 'our-mission',
    type: 'webp', 
    sizes: ['sm', 'md', 'lg'],
    priority: 2
  }
]

/**
 * Intelligent image preloader for critical above-the-fold assets
 * Prioritizes based on device capabilities and connection speed
 */
export function ImagePreloader() {
  const { isMobileOrTablet, isLowEndDevice } = useDeviceDetection()
  
  useEffect(() => {
    // Skip preloading on low-end devices to preserve resources
    if (isLowEndDevice) return
    
    // Check connection quality (if available)
    const connection = (navigator as any).connection
    const isSlowConnection = connection && (
      connection.effectiveType === 'slow-2g' || 
      connection.effectiveType === '2g' ||
      connection.saveData
    )
    
    // Skip preloading on slow connections
    if (isSlowConnection) return
    
    const preloadImage = (image: CriticalImage) => {
      // Determine which size to preload based on device
      const sizeToPreload = isMobileOrTablet ? 'sm' : 'lg'
      
      // Preload AVIF first (best compression), fallback to WebP
      const formats = ['avif', 'webp']
      
      formats.forEach((format, index) => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'image'
        link.href = `/images/optimized/${image.src}-${sizeToPreload}.${format}`
        link.type = `image/${format}`
        
        // Add sizes attribute for responsive images
        if (!isMobileOrTablet) {
          link.setAttribute('imagesizes', '(max-width: 1024px) 80vw, 1200px')
        }
        
        // Higher priority images get loaded first
        if (image.priority === 1 && index === 0) {
          link.fetchPriority = 'high'
        }
        
        document.head.appendChild(link)
      })
    }
    
    // Sort by priority and preload
    CRITICAL_IMAGES
      .sort((a, b) => a.priority - b.priority)
      .forEach(preloadImage)
    
    // Cleanup function
    return () => {
      // Remove preload links after component unmounts
      const preloadLinks = document.querySelectorAll('link[rel="preload"][as="image"]')
      preloadLinks.forEach(link => {
        if (link.getAttribute('href')?.includes('/images/optimized/')) {
          link.remove()
        }
      })
    }
  }, [isMobileOrTablet, isLowEndDevice])
  
  return null // This component doesn't render anything
}

/**
 * DNS and resource preloading for external dependencies
 */
export function ResourcePreloader() {
  useEffect(() => {
    const preloadResources = [
      // Preconnect to external domains
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      
      // Prefetch critical CSS
      { rel: 'prefetch', href: '/css/critical.css', as: 'style' },
    ]
    
    preloadResources.forEach(resource => {
      const link = document.createElement('link')
      Object.entries(resource).forEach(([key, value]) => {
        if (key === 'crossOrigin') {
          link.crossOrigin = value as string
        } else {
          link.setAttribute(key, value as string)
        }
      })
      document.head.appendChild(link)
    })
    
    return () => {
      // Cleanup on unmount
      preloadResources.forEach(resource => {
        const link = document.querySelector(`link[href="${resource.href}"]`)
        if (link) link.remove()
      })
    }
  }, [])
  
  return null
}

/**
 * Combined preloader component for all critical resources
 */
export function CriticalResourcePreloader() {
  return (
    <>
      <ImagePreloader />
      <ResourcePreloader />
    </>
  )
}