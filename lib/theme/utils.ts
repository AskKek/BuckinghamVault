/**
 * Theme Utility Functions
 * Advanced color mapping and status handling for Buckingham Vault
 */

import { 
  STATUS_COLORS, 
  PRIORITY_COLORS, 
  BRAND_COLORS,
  type ColorConfig,
  type StatusCategory,
  type PriorityLevel
} from './colors'
import { cn } from '@/lib/utils'

// Status value types for type safety
export type DealStatus = 'submitted' | 'under_review' | 'matched' | 'negotiating' | 'due_diligence' | 'completed' | 'cancelled'
export type DealType = 'buy' | 'sell' | 'acquisition' | 'divestiture' | 'merger' | 'ipo' | 'refinancing'
export type ForensicRating = 'AAA' | 'AA' | 'A' | 'BBB' | 'unrated'
export type AssetType = 'BTC' | 'ETH' | 'USDT' | 'USDC' | 'other'
export type KycStatus = 'pending' | 'approved' | 'rejected'
export type RiskLevel = 'very_low' | 'low' | 'medium' | 'high'

/**
 * Get color configuration for any status value
 */
export function getStatusColor(
  category: StatusCategory,
  value: string,
  fallback?: ColorConfig
): ColorConfig {
  const categoryColors = STATUS_COLORS[category]
  
  if (!categoryColors) {
    console.warn(`Unknown status category: ${category}`)
    return fallback || getDefaultColors()
  }
  
  const colors = categoryColors[value as keyof typeof categoryColors]
  
  if (!colors) {
    console.warn(`Unknown status value "${value}" for category "${category}"`)
    return fallback || getDefaultColors()
  }
  
  return colors
}

/**
 * Get priority color configuration
 */
export function getPriorityColor(priority: PriorityLevel): ColorConfig {
  return PRIORITY_COLORS[priority] || PRIORITY_COLORS.medium
}

/**
 * Get default neutral colors
 */
export function getDefaultColors(): ColorConfig {
  return {
    bg: 'bg-navy-100/20',
    text: 'text-navy-400',
    border: 'border-navy-500/30',
    icon: 'text-navy-500',
    badge: 'bg-navy-500/20 text-navy-400 border-navy-500/30'
  }
}

/**
 * Generate status badge classes
 */
export function getStatusBadgeClasses(
  category: StatusCategory,
  value: string,
  variant: 'solid' | 'outline' | 'subtle' = 'subtle',
  size: 'sm' | 'md' | 'lg' = 'md'
): string {
  const colors = getStatusColor(category, value)
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base'
  }
  
  const baseClasses = cn(
    'inline-flex items-center font-medium rounded-full transition-colors',
    sizeClasses[size]
  )
  
  switch (variant) {
    case 'solid':
      return cn(baseClasses, colors.text.replace('text-', 'bg-'), 'text-white')
    case 'outline':
      return cn(baseClasses, 'bg-transparent', colors.text, colors.border, 'border')
    case 'subtle':
    default:
      return cn(baseClasses, colors.badge)
  }
}

/**
 * Generate status icon classes
 */
export function getStatusIconClasses(
  category: StatusCategory,
  value: string,
  size: 'sm' | 'md' | 'lg' = 'md'
): string {
  const colors = getStatusColor(category, value)
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  
  return cn(colors.icon, sizeClasses[size])
}

/**
 * Generate background color classes for status
 */
export function getStatusBackgroundClasses(
  category: StatusCategory,
  value: string,
  opacity: 'light' | 'medium' | 'dark' = 'light'
): string {
  const colors = getStatusColor(category, value)
  
  switch (opacity) {
    case 'dark':
      return colors.bg.replace('/20', '/40')
    case 'medium':
      return colors.bg.replace('/20', '/30')
    case 'light':
    default:
      return colors.bg
  }
}

/**
 * Generate border color classes for status
 */
export function getStatusBorderClasses(
  category: StatusCategory,
  value: string,
  opacity: 'light' | 'medium' | 'dark' = 'medium'
): string {
  const colors = getStatusColor(category, value)
  
  switch (opacity) {
    case 'dark':
      return colors.border.replace('/30', '/50')
    case 'light':
      return colors.border.replace('/30', '/20')
    case 'medium':
    default:
      return colors.border
  }
}

/**
 * Generate text color classes for status
 */
export function getStatusTextClasses(
  category: StatusCategory,
  value: string,
  opacity: 'light' | 'medium' | 'dark' = 'medium'
): string {
  const colors = getStatusColor(category, value)
  
  switch (opacity) {
    case 'dark':
      return colors.text.replace('-400', '-300')
    case 'light':
      return colors.text.replace('-400', '-500')
    case 'medium':
    default:
      return colors.text
  }
}

/**
 * Get semantic color for numeric values (ratings, scores, etc.)
 */
export function getNumericStatusColor(
  value: number,
  min: number = 0,
  max: number = 100,
  invert: boolean = false
): ColorConfig {
  const percentage = ((value - min) / (max - min)) * 100
  const normalizedPercentage = invert ? 100 - percentage : percentage
  
  if (normalizedPercentage >= 80) {
    return getStatusColor('risk', 'very_low')
  } else if (normalizedPercentage >= 60) {
    return getStatusColor('risk', 'low')
  } else if (normalizedPercentage >= 40) {
    return getStatusColor('risk', 'medium')
  } else {
    return getStatusColor('risk', 'high')
  }
}

/**
 * Format and style currency values
 */
export function getCurrencyDisplayClasses(
  amount: number,
  threshold: { positive?: number; negative?: number } = {}
): { classes: string; formatted: string } {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
  
  let classes = 'font-medium'
  
  if (threshold.positive && amount >= threshold.positive) {
    classes = cn(classes, getStatusColor('deal', 'completed').text)
  } else if (threshold.negative && amount <= threshold.negative) {
    classes = cn(classes, getStatusColor('deal', 'cancelled').text)
  } else if (amount > 0) {
    classes = cn(classes, 'text-white')
  } else if (amount < 0) {
    classes = cn(classes, getStatusColor('risk', 'high').text)
  } else {
    classes = cn(classes, 'text-white/60')
  }
  
  return { classes, formatted }
}

/**
 * Get progress bar colors based on percentage
 */
export function getProgressColors(
  percentage: number,
  type: 'success' | 'warning' | 'error' | 'info' = 'info'
): { background: string; fill: string } {
  const colors = {
    success: { bg: 'bg-success-200/20', fill: 'bg-success-500' },
    warning: { bg: 'bg-warning-200/20', fill: 'bg-warning-500' },
    error: { bg: 'bg-error-200/20', fill: 'bg-error-500' },
    info: { bg: 'bg-info-200/20', fill: 'bg-info-500' }
  }
  
  return {
    background: colors[type].bg,
    fill: colors[type].fill
  }
}

/**
 * Theme-aware animation variants with regal enhancements
 */
export const THEME_ANIMATIONS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  
  slideInFromRight: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
    transition: { duration: 0.4, ease: 'easeOut' }
  },

  // Regal luxury animations
  goldenShimmer: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      boxShadow: [
        "0 0 0 rgba(215, 147, 9, 0)",
        "0 0 20px rgba(215, 147, 9, 0.3)",
        "0 0 0 rgba(215, 147, 9, 0)"
      ] as string[]
    },
    transition: { duration: 0.6, ease: 'easeOut' }
  },

  royalLift: {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    whileHover: { y: -4, scale: 1.02 },
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },

  crownRotation: {
    animate: { rotate: [0, 360] as number[] },
    transition: { duration: 2, repeat: Infinity, ease: 'linear' }
  },

  goldPulse: {
    animate: {
      opacity: [0.5, 1, 0.5] as number[],
      scale: [1, 1.05, 1] as number[]
    },
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
  },

  luxuryHover: {
    whileHover: {
      scale: 1.02,
      y: -2,
      boxShadow: "0 20px 40px rgba(215, 147, 9, 0.2)"
    },
    transition: { type: 'spring', stiffness: 400, damping: 25 }
  }
} as const

/**
 * Generate consistent hover and focus states
 */
export function getInteractionClasses(
  category: StatusCategory,
  value: string,
  type: 'button' | 'card' | 'input' = 'button'
): string {
  const colors = getStatusColor(category, value)
  
  switch (type) {
    case 'button':
      return cn(
        'transition-all duration-200',
        'hover:scale-105 hover:shadow-lg',
        `hover:${colors.bg.replace('/20', '/30')}`,
        'focus:outline-none focus:ring-2 focus:ring-gold-500/50',
        'active:scale-95'
      )
    
    case 'card':
      return cn(
        'transition-all duration-300',
        'hover:shadow-xl hover:shadow-black/20',
        `hover:${colors.border.replace('/30', '/50')}`,
        'hover:-translate-y-1'
      )
    
    case 'input':
      return cn(
        'transition-all duration-200',
        'focus:ring-2 focus:ring-gold-500/50',
        `focus:${colors.border.replace('/30', '/60')}`,
        'focus:outline-none'
      )
    
    default:
      return 'transition-all duration-200'
  }
}

/**
 * Export commonly used color combinations with regal enhancements
 */
export const THEME_PRESETS = {
  primary: {
    background: 'bg-gradient-to-br from-gold-900 via-gold-800 to-gold-900',
    surface: 'bg-gradient-to-br from-gold-800/90 via-gold-700/90 to-gold-800/90',
    accent: 'bg-navy-600',
    text: 'text-navy-900',
    textMuted: 'text-navy-800/80',
    border: 'border-navy/30'
  },
  
  glass: {
    background: 'bg-navy-900/80 backdrop-blur-xl',
    surface: 'bg-navy-800/60 backdrop-blur-lg', 
    accent: 'bg-gold-500/80',
    text: 'text-white',
    textMuted: 'text-white/60',
    border: 'border-white/10'
  },

  regal: {
    background: 'bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900',
    surface: 'bg-gradient-to-br from-navy-800/90 via-navy-900/95 to-navy-800/90 backdrop-blur-xl',
    accent: 'bg-gradient-to-r from-gold-500 to-gold-600',
    text: 'text-white',
    textMuted: 'text-white/70',
    border: 'border-gold/30'
  },

  sovereign: {
    background: 'bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900',
    surface: 'bg-gradient-to-br from-navy-900/95 via-navy-800/90 to-navy-900/95 backdrop-blur-xl border-2 border-gold/40',
    accent: 'bg-gradient-to-r from-gold-600 to-gold-700',
    text: 'text-white',
    textMuted: 'text-white/80',
    border: 'border-gold/50'
  }
} as const

/**
 * Regal utility functions for Analytics Renaissance
 */

/**
 * Get golden gradient text classes
 */
export function getGoldenTextGradient(intensity: 'subtle' | 'normal' | 'bold' = 'normal'): string {
  switch (intensity) {
    case 'subtle':
      return 'bg-gradient-to-r from-gold-400 to-gold-500 bg-clip-text text-transparent'
    case 'bold':
      return 'bg-gradient-to-r from-gold-300 to-gold-600 bg-clip-text text-transparent'
    case 'normal':
    default:
      return 'bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent'
  }
}

/**
 * Get crown-themed loading animation classes
 */
export function getCrownLoadingClasses(size: 'sm' | 'md' | 'lg' = 'md'): string {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }
  
  return `${sizeClasses[size]} text-gold animate-spin`
}

/**
 * Get regal card hover effects
 */
export function getRegalCardHover(): string {
  return 'hover:shadow-2xl hover:shadow-gold/20 hover:border-gold/50 hover:scale-[1.01] transition-all duration-500 ease-out'
}

/**
 * Get golden shimmer effect classes
 */
export function getGoldenShimmerClasses(): string {
  return 'relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-gold/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000'
}

/**
 * Get premium button with crown icon styling
 */
export function getPremiumButtonClasses(variant: 'golden' | 'royal' | 'sovereign' = 'golden'): string {
  const variants = {
    golden: 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-900 font-bold shadow-lg hover:shadow-xl hover:scale-105',
    royal: 'bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-800 text-white font-bold shadow-lg hover:shadow-gold/30 hover:scale-105',
    sovereign: 'bg-gradient-to-r from-gold-700 to-gold-800 hover:from-gold-800 hover:to-gold-900 text-white font-bold shadow-xl hover:shadow-gold/40 border border-gold/30 hover:scale-105'
  }
  
  return `${variants[variant]} transition-all duration-300 ease-out`
}

/**
 * Get analytical metrics styling with golden accents
 */
export function getAnalyticsMetricClasses(isPositive?: boolean): string {
  const baseClasses = 'font-display font-bold text-2xl transition-all duration-300'
  
  if (isPositive === true) {
    return `${baseClasses} text-green-400`
  } else if (isPositive === false) {
    return `${baseClasses} text-red-400`
  } else {
    return `${baseClasses} ${getGoldenTextGradient('normal')}`
  }
}