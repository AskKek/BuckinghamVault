import { Variants } from "framer-motion"

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
  return false
}

// Device detection utilities
export const useDeviceDetection = () => {
  if (typeof window === 'undefined') return { isMobile: false, isTablet: false, isDesktop: true }
  
  const width = window.innerWidth
  const userAgent = navigator.userAgent.toLowerCase()
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  
  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    isTouchDevice,
    isMobileOrTablet: width < 1024 || isTouchDevice
  }
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