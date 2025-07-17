import { Variants } from "framer-motion"
import { useState, useEffect } from 'react'

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
  return false
}

// SSR-safe deterministic "random" number generator for animations
// This creates predictable but varied values to prevent hydration mismatches
export const deterministicRandom = (index: number, seed: number = 1) => {
  const x = Math.sin(seed * index * 12.9898) * 43758.5453123
  return x - Math.floor(x)
}

// Generate deterministic animation properties for particles/shapes
export const generateDeterministicParticles = (count: number, seed: number = 1) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: deterministicRandom(i, seed) * 100,
    top: deterministicRandom(i, seed + 1) * 100,
    delay: deterministicRandom(i, seed + 2) * 3,
    duration: 6 + deterministicRandom(i, seed + 3) * 4,
    size: 0.5 + deterministicRandom(i, seed + 4) * 1.5,
    opacity: 0.2 + deterministicRandom(i, seed + 5) * 0.6,
    scale: 0.5 + deterministicRandom(i, seed + 6) * 0.5
  }))
}

// Generate deterministic geometric shapes for complex animations
export const generateDeterministicShapes = (count: number, seed: number = 1) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: deterministicRandom(i, seed) * 100,
    top: deterministicRandom(i, seed + 1) * 100,
    delay: deterministicRandom(i, seed + 2) * 6,
    duration: 12 + deterministicRandom(i, seed + 3) * 8,
    scale: 0.5 + deterministicRandom(i, seed + 4) * 0.5
  }))
}

// Device detection utilities with SSR-safe hydration
export const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    isMobileOrTablet: false,
    isLowEndDevice: false
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const updateDeviceInfo = () => {
      const width = window.innerWidth
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      // Detect low-end devices based on various factors
      const isLowEndDevice = (() => {
        // Check hardware concurrency (CPU cores)
        const cores = navigator.hardwareConcurrency || 1
        if (cores <= 2) return true
        
        // Check memory (if available)
        const memory = (navigator as any).deviceMemory
        if (memory && memory <= 2) return true
        
        // Check user agent for known low-end devices
        const userAgent = navigator.userAgent.toLowerCase()
        const lowEndPatterns = [
          'android 4', 'android 5', 'android 6',
          'iphone os 9', 'iphone os 10', 'iphone os 11',
          'cpu os 9', 'cpu os 10', 'cpu os 11'
        ]
        if (lowEndPatterns.some(pattern => userAgent.includes(pattern))) return true
        
        // Small screen + touch usually indicates mobile device with limited resources
        if (width <= 480 && isTouchDevice) return true
        
        return false
      })()
      
      setDeviceInfo({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        isTouchDevice,
        isMobileOrTablet: width < 1024 || isTouchDevice,
        isLowEndDevice
      })
    }

    // Initial detection
    updateDeviceInfo()

    // Add resize listener
    window.addEventListener('resize', updateDeviceInfo)
    
    // Cleanup
    return () => window.removeEventListener('resize', updateDeviceInfo)
  }, [])

  return deviceInfo
}

// Standard animation variants for sections
export const sectionVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: prefersReducedMotion() ? 0 : 50 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: prefersReducedMotion() ? 0.1 : 0.8,
      ease: "easeOut"
    }
  }
}

export const staggerChildVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: prefersReducedMotion() ? 0 : 30 
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: prefersReducedMotion() ? 0.1 : 0.6,
      delay: prefersReducedMotion() ? 0 : 0.1 * index,
      ease: "easeOut"
    }
  })
}

export const cardHoverVariants: Variants = {
  rest: { 
    scale: 1,
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)"
  },
  hover: { 
    scale: prefersReducedMotion() ? 1 : 1.02,
    boxShadow: prefersReducedMotion() 
      ? "0 4px 16px rgba(0, 0, 0, 0.1)"
      : "0 8px 32px rgba(215, 147, 9, 0.2)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}

export const iconHoverVariants: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: prefersReducedMotion() ? 1 : 1.1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
}

// Performance-optimized background animations
export const createFloatingOrb = (
  size: number, 
  initialX: number, 
  initialY: number,
  color: string = "gold"
) => ({
  className: `absolute w-${size} h-${size} bg-gradient-to-r from-${color}/10 to-transparent rounded-full blur-3xl`,
  style: { left: `${initialX}%`, top: `${initialY}%` },
  animate: prefersReducedMotion() ? {} : {
    x: [0, 100, 0],
    y: [0, -50, 0],
    scale: [1, 1.2, 1],
  },
  transition: prefersReducedMotion() ? {} : {
    duration: 15 + Math.random() * 10,
    repeat: Number.POSITIVE_INFINITY,
    ease: "easeInOut",
    delay: Math.random() * 5
  }
})

// Optimized particle system for mobile
export const generateParticles = (count: number, isMobile: boolean = false) => {
  const particleCount = isMobile ? Math.min(count, 10) : count
  
  return Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 2,
    scale: isMobile ? 0.5 : 1
  }))
}

// Intersection Observer options for performance
export const intersectionOptions = {
  threshold: 0.1,
  rootMargin: "-50px",
  triggerOnce: true
}

// Text animation variants
export const textRevealVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: prefersReducedMotion() ? 0 : 30 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: prefersReducedMotion() ? 0.1 : 0.8,
      ease: "easeOut"
    }
  }
}

// Decorative line animation
export const decorativeLineVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: prefersReducedMotion() ? 0.1 : 1,
      ease: "easeOut"
    }
  }
}

// Optimized spring configuration
export const springConfig = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30
}

// Screen size breakpoints
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} 