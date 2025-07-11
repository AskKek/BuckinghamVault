/**
 * Buckingham Vault Theme System
 * Centralized exports for theme utilities, colors, and components
 */

// Core color system
export {
  BRAND_COLORS,
  STATUS_COLORS,
  PRIORITY_COLORS,
  type BrandColorShade,
  type StatusCategory,
  type PriorityLevel,
  type ColorConfig,
  type StatusColorConfig,
  type PriorityColorConfig
} from './colors'

// Theme utilities
export {
  getStatusColor,
  getPriorityColor,
  getDefaultColors,
  getStatusBadgeClasses,
  getStatusIconClasses,
  getStatusBackgroundClasses,
  getStatusBorderClasses,
  getStatusTextClasses,
  getNumericStatusColor,
  getCurrencyDisplayClasses,
  getProgressColors,
  getInteractionClasses,
  THEME_ANIMATIONS,
  THEME_PRESETS,
  // New regal utilities
  getGoldenTextGradient,
  getCrownLoadingClasses,
  getRegalCardHover,
  getGoldenShimmerClasses,
  getPremiumButtonClasses,
  getAnalyticsMetricClasses,
  type DealStatus,
  type DealType,
  type ForensicRating,
  type AssetType,
  type KycStatus,
  type RiskLevel
} from './utils'

// Theme-aware components
export {
  StatusBadge,
  DealStatusBadge,
  DealTypeBadge,
  ForensicRatingBadge,
  AssetTypeBadge,
  KycStatusBadge,
  RiskLevelIndicator,
  CurrencyDisplay,
  ProgressRing,
  StatusIcon
} from './components'

// Utility functions for common patterns
import { 
  getStatusColor as getStatusColorFromUtils,
  getStatusBadgeClasses as getStatusBadgeClassesFromUtils,
  getStatusIconClasses as getStatusIconClassesFromUtils
} from './utils'
type StatusCategory = "assetType" | "forensicRating" | "deal" | "dealType" | "kyc" | "risk"

export function createStatusMapper<T extends string>(
  category: StatusCategory,
  statusMap: Record<T, string>
) {
  return {
    getColor: (status: T) => getStatusColorFromUtils(category, statusMap[status]),
    getBadgeClasses: (status: T, variant?: 'solid' | 'outline' | 'subtle', size?: 'sm' | 'md' | 'lg') => 
      getStatusBadgeClassesFromUtils(category, statusMap[status], variant, size),
    getIconClasses: (status: T, size?: 'sm' | 'md' | 'lg') => 
      getStatusIconClassesFromUtils(category, statusMap[status], size)
  }
}

// Pre-configured mappers for common use cases
export const dealStatusMapper = createStatusMapper('deal', {
  submitted: 'submitted',
  under_review: 'under_review',
  matched: 'matched',
  negotiating: 'negotiating',
  due_diligence: 'due_diligence',
  completed: 'completed',
  cancelled: 'cancelled'
} as const)

export const dealTypeMapper = createStatusMapper('dealType', {
  buy: 'buy',
  sell: 'sell',
  acquisition: 'acquisition',
  divestiture: 'divestiture',
  merger: 'merger',
  ipo: 'ipo',
  refinancing: 'refinancing'
} as const)

export const forensicRatingMapper = createStatusMapper('forensicRating', {
  AAA: 'AAA',
  AA: 'AA',
  A: 'A',
  BBB: 'BBB',
  unrated: 'unrated'
} as const)

// Theme configuration for consistent component styling
export const THEME_CONFIG = {
  // Card variants with gold-primary theme
  cards: {
    default: 'bg-gold-100/10 border border-navy/20 backdrop-blur-lg',
    glass: 'bg-gold-50/20 border border-navy/10 backdrop-blur-xl',
    premium: 'bg-gradient-to-br from-gold-100/20 to-gold-200/20 border border-navy/30 shadow-2xl',
    minimal: 'bg-gold-50/10 border border-navy/5 backdrop-blur-sm',
    institutional: 'bg-gradient-to-br from-gold-100/15 via-gold-50/20 to-gold-100/15 border border-navy/40 shadow-2xl shadow-navy/10 backdrop-blur-xl',
    premium_institutional: 'bg-gradient-to-br from-gold-200/20 via-gold-100/25 to-gold-200/20 border-2 border-navy/50 shadow-2xl shadow-navy/20 backdrop-blur-xl'
  },
  
  // Button variants with gold-primary theme
  buttons: {
    primary: 'bg-navy-600 hover:bg-navy-700 text-gold-100 font-medium',
    secondary: 'bg-gold-200/20 hover:bg-gold-300/20 text-navy-900 border border-navy/20',
    ghost: 'hover:bg-navy/10 text-navy-800',
    danger: 'bg-error-600 hover:bg-error-700 text-white',
    institutional: 'bg-gradient-to-r from-navy-600 to-navy-700 hover:from-navy-700 hover:to-navy-800 text-gold-100 font-bold shadow-lg hover:shadow-xl',
    premium: 'bg-gradient-to-r from-navy-800 to-navy-900 hover:from-navy-900 hover:to-navy-950 text-gold-200 font-bold shadow-lg hover:shadow-navy/30'
  },
  
  // Input variants with gold-primary theme
  inputs: {
    default: 'bg-gold-50/10 border border-navy/20 text-navy-900 placeholder:text-navy-600/50 focus:border-navy',
    glass: 'bg-gold-100/20 border border-navy/10 text-navy-900 placeholder:text-navy-700/40 focus:border-navy/50 backdrop-blur-lg',
    institutional: 'bg-gold-100/30 border border-navy/30 text-navy-900 placeholder:text-navy-700/40 focus:border-navy/70 focus:ring-2 focus:ring-navy/20 backdrop-blur-xl'
  },
  
  // Animation presets with luxury options
  animations: {
    fast: 'transition-all duration-200',
    normal: 'transition-all duration-300', 
    slow: 'transition-all duration-500',
    spring: 'transition-all duration-300 ease-spring',
    luxury: 'transition-all duration-500 ease-out',
    royal: 'transition-all duration-700 ease-in-out'
  }
} as const

// Helper function to get theme-consistent classes
export function getThemeClasses(
  component: keyof typeof THEME_CONFIG,
  variant: string = 'default'
): string {
  const componentConfig = THEME_CONFIG[component] as Record<string, string>
  return componentConfig[variant] || componentConfig.default || ''
}

// CSS custom properties for gold-primary theme
export const CSS_VARIABLES = {
  '--color-gold-50': '#fffef5',
  '--color-gold-900': '#713f12',
  '--color-navy-600': '#475569',
  '--color-success-500': '#22c55e',
  '--color-warning-500': '#f59e0b',
  '--color-error-500': '#ef4444',
  '--color-info-500': '#3b82f6',
  
  // Semantic colors for gold-primary theme
  '--color-background': 'linear-gradient(135deg, #713f12, #854d0e, #713f12)',
  '--color-surface': 'rgba(234, 179, 8, 0.1)',
  '--color-accent': 'var(--color-navy-600)',
  '--color-text': '#0f172a',
  '--color-text-muted': 'rgba(15, 23, 42, 0.8)',
  '--color-border': 'rgba(71, 85, 105, 0.3)',
  
  // Shadows
  '--shadow-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  '--shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  '--shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  '--shadow-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  
  // Blur effects
  '--blur-sm': '4px',
  '--blur-md': '8px',
  '--blur-lg': '16px',
  '--blur-xl': '24px'
} as const

// Export re-used from utils for backward compatibility
