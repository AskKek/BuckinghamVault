/**
 * Performance-optimized motion utilities for Buckingham Vault
 * Selective imports from Framer Motion to reduce bundle size
 * Device-aware animations that respect performance constraints
 */

// Import only the motion utilities we need to reduce bundle size
export { 
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
  useAnimation,
  useMotionValue,
  type Variants,
  type Transition,
  type MotionProps
} from 'framer-motion'

import { prefersReducedMotion } from './animation-utils'

// Performance-aware transition configurations
export const transitions = {
  // Ultra-fast for reduced motion users
  instant: {
    duration: 0,
    ease: 'linear' as const
  },
  
  // Quick transitions for mobile/low-end devices
  quick: {
    duration: 0.2,
    ease: 'easeOut' as const
  },
  
  // Standard premium animations
  smooth: {
    duration: 0.5,
    ease: 'easeOut' as const
  },
  
  // Luxury animations for high-end devices
  premium: {
    duration: 0.8,
    ease: [0.4, 0, 0.2, 1] as const
  },
  
  // Spring animations for interactive elements
  spring: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30
  },
  
  // Gentle spring for luxury feel
  luxurySpring: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 40
  }
} as const

// Device-aware animation variants
export const createResponsiveVariants = (
  isMobile: boolean = false,
  isLowEndDevice: boolean = false
): { [key: string]: Variants } => {
  const reducedMotion = prefersReducedMotion()
  
  // Skip animations entirely for reduced motion users
  if (reducedMotion) {
    return {
      fadeIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: transitions.instant }
      },
      slideUp: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: transitions.instant }
      },
      scaleIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: transitions.instant }
      }
    }
  }
  
  // Simplified animations for low-end devices
  if (isLowEndDevice) {
    return {
      fadeIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: transitions.quick }
      },
      slideUp: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: transitions.quick }
      },
      scaleIn: {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: transitions.quick }
      }
    }
  }
  
  // Mobile-optimized animations
  if (isMobile) {
    return {
      fadeIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: transitions.smooth }
      },
      slideUp: {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: transitions.smooth }
      },
      scaleIn: {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: transitions.spring }
      }
    }
  }
  
  // Full premium animations for desktop
  return {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: transitions.premium }
    },
    slideUp: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: transitions.premium }
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1, transition: transitions.luxurySpring }
    },
    slideInLeft: {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0, transition: transitions.premium }
    },
    slideInRight: {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0, transition: transitions.premium }
    }
  }
}

// Staggered animation helpers
export const createStaggerConfig = (
  childCount: number,
  isMobile: boolean = false,
  isLowEndDevice: boolean = false
) => {
  if (prefersReducedMotion() || isLowEndDevice) {
    return {
      staggerChildren: 0,
      delayChildren: 0
    }
  }
  
  const baseDelay = isMobile ? 0.05 : 0.1
  const maxStagger = isMobile ? 0.3 : 0.5
  
  return {
    staggerChildren: Math.min(baseDelay, maxStagger / childCount),
    delayChildren: isMobile ? 0.1 : 0.2
  }
}

// Hover animation helpers
export const createHoverVariants = (
  isMobile: boolean = false,
  isLowEndDevice: boolean = false
) => {
  if (prefersReducedMotion() || isLowEndDevice || isMobile) {
    return {
      rest: {},
      hover: {}
    }
  }
  
  return {
    rest: {
      scale: 1,
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
      transition: transitions.quick
    },
    hover: {
      scale: 1.02,
      boxShadow: '0 8px 32px rgba(244, 185, 66, 0.15)',
      transition: transitions.spring
    }
  }
}

// Performance-optimized scroll animations
export const createScrollConfig = (isLowEndDevice: boolean = false) => {
  return {
    offset: isLowEndDevice ? ['start end', 'end start'] : ['start 0.8', 'end 0.2']
  }
}

// Intersection observer options optimized for performance
export const intersectionConfig = {
  threshold: 0.1,
  rootMargin: '-50px',
  triggerOnce: true
}

// Animation disable flags for performance critical sections
export const shouldAnimate = (
  isMobile: boolean = false,
  isLowEndDevice: boolean = false,
  isCriticalPath: boolean = false
): boolean => {
  if (prefersReducedMotion()) return false
  if (isCriticalPath && (isLowEndDevice || isMobile)) return false
  return true
}