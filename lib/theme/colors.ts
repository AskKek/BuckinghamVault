/**
 * Centralized Theme Color System
 * Institutional-grade color mapping and status handling for Buckingham Vault
 */

// Core brand palette
export const BRAND_COLORS = {
  // Primary navy variations
  navy: {
    50: '#f8fafc',
    100: '#f1f5f9', 
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617'
  },
  
  // Gold accent variations with regal enhancements
  gold: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a', 
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
    950: '#422006'
  },

  // Enhanced luxury gold variations for regal design
  goldLight: {
    50: '#fffef5',
    100: '#fffce5',
    200: '#fff9cc',
    300: '#fff4a3',
    400: '#ffeb70',
    500: '#f5d633',
    600: '#e6c200',
    700: '#d79309', // Primary gold
    800: '#c4850a',
    900: '#a96f0b'
  },

  goldDark: {
    50: '#fdfcf0',
    100: '#f9f6d9',
    200: '#f2eab3',
    300: '#e8d883',
    400: '#d9c058',
    500: '#c8a43c',
    600: '#b5852f',
    700: '#996729',
    800: '#7d5328',
    900: '#694426'
  },

  // Platinum/Silver accents for premium touches
  platinum: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  },

  // Royal purple for sovereignty elements
  royal: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87'
  },
  
  // Extended palette for status and semantic colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d'
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f'
  },
  
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d'
  },
  
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a'
  }
} as const

// Financial status color mappings
export const STATUS_COLORS = {
  // Deal statuses
  deal: {
    submitted: {
      bg: 'bg-info-100/20',
      text: 'text-info-400',
      border: 'border-info-500/30',
      icon: 'text-info-500',
      badge: 'bg-info-500/20 text-info-400 border-info-500/30'
    },
    under_review: {
      bg: 'bg-warning-100/20',
      text: 'text-warning-400', 
      border: 'border-warning-500/30',
      icon: 'text-warning-500',
      badge: 'bg-warning-500/20 text-warning-400 border-warning-500/30'
    },
    matched: {
      bg: 'bg-gold-100/20',
      text: 'text-gold-400',
      border: 'border-gold-500/30',
      icon: 'text-gold-500',
      badge: 'bg-gold-500/20 text-gold-400 border-gold-500/30'
    },
    negotiating: {
      bg: 'bg-warning-100/20',
      text: 'text-warning-400',
      border: 'border-warning-500/30', 
      icon: 'text-warning-500',
      badge: 'bg-warning-500/20 text-warning-400 border-warning-500/30'
    },
    due_diligence: {
      bg: 'bg-info-100/20',
      text: 'text-info-400',
      border: 'border-info-500/30',
      icon: 'text-info-500',
      badge: 'bg-info-500/20 text-info-400 border-info-500/30'
    },
    completed: {
      bg: 'bg-success-100/20',
      text: 'text-success-400',
      border: 'border-success-500/30',
      icon: 'text-success-500',
      badge: 'bg-success-500/20 text-success-400 border-success-500/30'
    },
    cancelled: {
      bg: 'bg-error-100/20',
      text: 'text-error-400',
      border: 'border-error-500/30',
      icon: 'text-error-500',
      badge: 'bg-error-500/20 text-error-400 border-error-500/30'
    }
  },
  
  // Deal types
  dealType: {
    buy: {
      bg: 'bg-success-100/20',
      text: 'text-success-400',
      border: 'border-success-500/30',
      icon: 'text-success-500',
      badge: 'bg-success-500/20 text-success-400 border-success-500/30'
    },
    sell: {
      bg: 'bg-error-100/20',
      text: 'text-error-400',
      border: 'border-error-500/30',
      icon: 'text-error-500',
      badge: 'bg-error-500/20 text-error-400 border-error-500/30'
    },
    acquisition: {
      bg: 'bg-gold-100/20',
      text: 'text-gold-400',
      border: 'border-gold-500/30',
      icon: 'text-gold-500',
      badge: 'bg-gold-500/20 text-gold-400 border-gold-500/30'
    },
    divestiture: {
      bg: 'bg-info-100/20',
      text: 'text-info-400',
      border: 'border-info-500/30',
      icon: 'text-info-500',
      badge: 'bg-info-500/20 text-info-400 border-info-500/30'
    },
    merger: {
      bg: 'bg-warning-100/20',
      text: 'text-warning-400',
      border: 'border-warning-500/30',
      icon: 'text-warning-500',
      badge: 'bg-warning-500/20 text-warning-400 border-warning-500/30'
    },
    ipo: {
      bg: 'bg-gold-100/20',
      text: 'text-gold-400',
      border: 'border-gold-500/30',
      icon: 'text-gold-500',
      badge: 'bg-gold-500/20 text-gold-400 border-gold-500/30'
    },
    refinancing: {
      bg: 'bg-info-100/20',
      text: 'text-info-400',
      border: 'border-info-500/30',
      icon: 'text-info-500',
      badge: 'bg-info-500/20 text-info-400 border-info-500/30'
    }
  },
  
  // Forensic ratings
  forensicRating: {
    AAA: {
      bg: 'bg-success-100/20',
      text: 'text-success-400',
      border: 'border-success-500/30',
      icon: 'text-success-500',
      badge: 'bg-success-500/20 text-success-400 border-success-500/30'
    },
    AA: {
      bg: 'bg-success-100/20',
      text: 'text-success-400',
      border: 'border-success-500/30',
      icon: 'text-success-500',
      badge: 'bg-success-500/20 text-success-400 border-success-500/30'
    },
    A: {
      bg: 'bg-gold-100/20',
      text: 'text-gold-400',
      border: 'border-gold-500/30',
      icon: 'text-gold-500',
      badge: 'bg-gold-500/20 text-gold-400 border-gold-500/30'
    },
    BBB: {
      bg: 'bg-warning-100/20',
      text: 'text-warning-400',
      border: 'border-warning-500/30',
      icon: 'text-warning-500',
      badge: 'bg-warning-500/20 text-warning-400 border-warning-500/30'
    },
    unrated: {
      bg: 'bg-navy-100/20',
      text: 'text-navy-400',
      border: 'border-navy-500/30',
      icon: 'text-navy-500',
      badge: 'bg-navy-500/20 text-navy-400 border-navy-500/30'
    }
  },
  
  // Asset types
  assetType: {
    BTC: {
      bg: 'bg-warning-100/20',
      text: 'text-warning-400',
      border: 'border-warning-500/30',
      icon: 'text-warning-500',
      badge: 'bg-warning-500/20 text-warning-400 border-warning-500/30'
    },
    ETH: {
      bg: 'bg-info-100/20',
      text: 'text-info-400',
      border: 'border-info-500/30',
      icon: 'text-info-500',
      badge: 'bg-info-500/20 text-info-400 border-info-500/30'
    },
    USDT: {
      bg: 'bg-success-100/20',
      text: 'text-success-400',
      border: 'border-success-500/30',
      icon: 'text-success-500',
      badge: 'bg-success-500/20 text-success-400 border-success-500/30'
    },
    USDC: {
      bg: 'bg-info-100/20',
      text: 'text-info-400',
      border: 'border-info-500/30',
      icon: 'text-info-500',
      badge: 'bg-info-500/20 text-info-400 border-info-500/30'
    },
    other: {
      bg: 'bg-navy-100/20',
      text: 'text-navy-400',
      border: 'border-navy-500/30',
      icon: 'text-navy-500',
      badge: 'bg-navy-500/20 text-navy-400 border-navy-500/30'
    }
  },
  
  // KYC statuses
  kyc: {
    pending: {
      bg: 'bg-warning-100/20',
      text: 'text-warning-400',
      border: 'border-warning-500/30',
      icon: 'text-warning-500',
      badge: 'bg-warning-500/20 text-warning-400 border-warning-500/30'
    },
    approved: {
      bg: 'bg-success-100/20',
      text: 'text-success-400',
      border: 'border-success-500/30',
      icon: 'text-success-500',
      badge: 'bg-success-500/20 text-success-400 border-success-500/30'
    },
    rejected: {
      bg: 'bg-error-100/20',
      text: 'text-error-400',
      border: 'border-error-500/30',
      icon: 'text-error-500',
      badge: 'bg-error-500/20 text-error-400 border-error-500/30'
    }
  },
  
  // Risk levels
  risk: {
    very_low: {
      bg: 'bg-success-100/20',
      text: 'text-success-400',
      border: 'border-success-500/30',
      icon: 'text-success-500',
      badge: 'bg-success-500/20 text-success-400 border-success-500/30'
    },
    low: {
      bg: 'bg-success-100/20',
      text: 'text-success-400',
      border: 'border-success-500/30',
      icon: 'text-success-500',
      badge: 'bg-success-500/20 text-success-400 border-success-500/30'
    },
    medium: {
      bg: 'bg-warning-100/20',
      text: 'text-warning-400',
      border: 'border-warning-500/30',
      icon: 'text-warning-500',
      badge: 'bg-warning-500/20 text-warning-400 border-warning-500/30'
    },
    high: {
      bg: 'bg-error-100/20',
      text: 'text-error-400',
      border: 'border-error-500/30',
      icon: 'text-error-500',
      badge: 'bg-error-500/20 text-error-400 border-error-500/30'
    }
  }
} as const

// Priority mappings
export const PRIORITY_COLORS = {
  urgent: {
    bg: 'bg-error-100/20',
    text: 'text-error-400',
    border: 'border-error-500/30',
    icon: 'text-error-500',
    badge: 'bg-error-500/20 text-error-400 border-error-500/30'
  },
  high: {
    bg: 'bg-warning-100/20',
    text: 'text-warning-400',
    border: 'border-warning-500/30',
    icon: 'text-warning-500',
    badge: 'bg-warning-500/20 text-warning-400 border-warning-500/30'
  },
  medium: {
    bg: 'bg-gold-100/20',
    text: 'text-gold-400',
    border: 'border-gold-500/30',
    icon: 'text-gold-500',
    badge: 'bg-gold-500/20 text-gold-400 border-gold-500/30'
  },
  low: {
    bg: 'bg-info-100/20',
    text: 'text-info-400',
    border: 'border-info-500/30',
    icon: 'text-info-500',
    badge: 'bg-info-500/20 text-info-400 border-info-500/30'
  }
} as const

// Type definitions for better type safety
export type BrandColorShade = keyof typeof BRAND_COLORS.navy
export type StatusCategory = keyof typeof STATUS_COLORS
export type PriorityLevel = keyof typeof PRIORITY_COLORS

// Color configuration interface
export interface ColorConfig {
  bg: string
  text: string
  border: string
  icon: string
  badge: string
}

// Export type definitions for external use
export type StatusColorConfig = typeof STATUS_COLORS
export type PriorityColorConfig = typeof PRIORITY_COLORS