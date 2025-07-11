/**
 * FeatureCard Utility Functions and Presets
 * Common configurations and helpers for the unified FeatureCard component
 */

import React from "react"
import { LucideIcon } from "lucide-react"
import { 
  FileText, 
  Video, 
  File, 
  CheckSquare, 
  BookOpen, 
  Scale,
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calendar,
  User,
  Tag,
  Star,
  Shield,
  Download,
  Eye,
  Clock
} from "lucide-react"
import type { 
  FeatureCardProps, 
  FeatureCardBadge, 
  FeatureCardAction, 
  FeatureCardMetadata 
} from "@/components/shared/FeatureCard"

// Status color mappings for consistent theming
export const statusColors = {
  // Deal statuses
  completed: 'bg-green-500/20 text-green-300 border-green-500/30',
  matched: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  under_review: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  submitted: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  negotiating: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  due_diligence: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  cancelled: 'bg-red-500/20 text-red-300 border-red-500/30',
  
  // Knowledge categories
  legal: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  compliance: 'bg-red-500/20 text-red-300 border-red-500/30',
  technical: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  market_analysis: 'bg-green-500/20 text-green-300 border-green-500/30',
  training: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  templates: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  
  // Difficulty levels
  beginner: 'bg-green-500/20 text-green-300 border-green-500/30',
  intermediate: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  advanced: 'bg-red-500/20 text-red-300 border-red-500/30',
  
  // Forensic ratings
  AAA: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  AA: 'bg-green-500/20 text-green-300 border-green-500/30',
  A: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  BBB: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  
  // General statuses
  success: 'bg-green-500/20 text-green-300 border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  error: 'bg-red-500/20 text-red-300 border-red-500/30',
  info: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  default: 'bg-white/20 text-white border-white/30'
} as const

// Icon mappings for different content types
export const typeIcons: Record<string, LucideIcon> = {
  // Resource types
  document: FileText,
  video: Video,
  template: File,
  checklist: CheckSquare,
  guide: BookOpen,
  regulation: Scale,
  
  // Deal types
  buy: TrendingUp,
  sell: TrendingDown,
  
  // General icons
  currency: DollarSign,
  date: Calendar,
  user: User,
  tag: Tag,
  rating: Star,
  security: Shield,
  download: Download,
  view: Eye,
  time: Clock
}

// Preset configurations for common card types
export const cardPresets = {
  // Deal card preset
  deal: (overrides?: Partial<FeatureCardProps>): Partial<FeatureCardProps> => ({
    variant: 'glass',
    size: 'md',
    hoverAnimation: 'lift',
    showHoverGlow: true,
    ...overrides
  }),
  
  // Knowledge resource card preset
  resource: (overrides?: Partial<FeatureCardProps>): Partial<FeatureCardProps> => ({
    variant: 'glass',
    size: 'md',
    hoverAnimation: 'lift',
    showHoverGlow: true,
    showHoverContent: true,
    ...overrides
  }),
  
  // Dashboard stat card preset
  stat: (overrides?: Partial<FeatureCardProps>): Partial<FeatureCardProps> => ({
    variant: 'glass',
    size: 'sm',
    hoverAnimation: 'glow',
    showHoverGlow: false,
    ...overrides
  }),
  
  // Feature showcase card preset
  feature: (overrides?: Partial<FeatureCardProps>): Partial<FeatureCardProps> => ({
    variant: 'premium',
    size: 'lg',
    hoverAnimation: 'scale',
    showHoverGlow: true,
    ...overrides
  }),
  
  // Minimal info card preset
  info: (overrides?: Partial<FeatureCardProps>): Partial<FeatureCardProps> => ({
    variant: 'minimal',
    size: 'sm',
    hoverAnimation: 'none',
    showHoverGlow: false,
    ...overrides
  }),
  
  // Interactive action card preset
  action: (overrides?: Partial<FeatureCardProps>): Partial<FeatureCardProps> => ({
    variant: 'glass',
    size: 'md',
    hoverAnimation: 'lift',
    showHoverGlow: true,
    isInteractive: true,
    ...overrides
  })
}

// Helper functions for creating common card elements
export const createBadge = (
  label: string, 
  type: keyof typeof statusColors,
  variant: FeatureCardBadge['variant'] = 'outline'
): FeatureCardBadge => ({
  label: label.replace('_', ' '),
  variant,
  className: statusColors[type] || statusColors.default
})

export const createAction = (
  label: string,
  onClick: () => void,
  options?: {
    icon?: LucideIcon
    variant?: FeatureCardAction['variant']
    size?: FeatureCardAction['size']
    className?: string
    disabled?: boolean
  }
): FeatureCardAction => ({
  label,
  onClick,
  icon: options?.icon,
  variant: options?.variant || 'ghost',
  size: options?.size || 'sm',
  className: options?.className,
  disabled: options?.disabled
})

export const createMetadata = (
  label: string,
  value: string | number | Date,
  options?: {
    icon?: LucideIcon
    className?: string
    format?: 'currency' | 'date' | 'number' | 'text'
  }
): FeatureCardMetadata => {
  let formattedValue: string | number = value as string | number
  
  if (options?.format === 'currency' && typeof value === 'number') {
    formattedValue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  } else if (options?.format === 'date' && value instanceof Date) {
    formattedValue = value.toLocaleDateString()
  } else if (options?.format === 'number' && typeof value === 'number') {
    formattedValue = value.toLocaleString()
  } else if (value instanceof Date) {
    formattedValue = value.toLocaleDateString()
  }
  
  return {
    label,
    value: formattedValue,
    icon: options?.icon,
    className: options?.className
  }
}

// Star rating component for resources
export const createStarRating = (rating: number, maxStars: number = 5) => {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  
  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={i} className="w-3 h-3 fill-gold text-gold" />)
  }
  
  if (hasHalfStar && fullStars < maxStars) {
    stars.push(<Star key="half" className="w-3 h-3 text-gold" />)
  }
  
  // Add empty stars to reach maxStars
  for (let i = stars.length; i < maxStars; i++) {
    stars.push(<Star key={`empty-${i}`} className="w-3 h-3 text-white/20" />)
  }
  
  return stars
}

// Format utilities for common data types
export const formatters = {
  currency: (amount: number, currency: string = 'USD') => 
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount),
    
  largeNumber: (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  },
  
  percentage: (num: number, decimals: number = 1) => 
    `${num.toFixed(decimals)}%`,
    
  dateRelative: (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }
}

// Common card layouts and configurations
export const layouts = {
  // Two-column grid layout
  grid: (items: FeatureCardProps[], columns: number = 2) => ({
    className: `grid grid-cols-1 ${columns === 2 ? 'md:grid-cols-2' : columns === 3 ? 'lg:grid-cols-3' : `lg:grid-cols-${columns}`} gap-6`,
    items: items.map((item, index) => ({ ...item, index }))
  }),
  
  // Masonry-style layout
  masonry: (items: FeatureCardProps[]) => ({
    className: "columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6",
    items: items.map((item, index) => ({ 
      ...item, 
      index,
      className: `${item.className || ''} break-inside-avoid mb-6` 
    }))
  }),
  
  // Horizontal scroll layout
  scroll: (items: FeatureCardProps[]) => ({
    className: "flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory",
    items: items.map((item, index) => ({ 
      ...item, 
      index,
      className: `${item.className || ''} flex-shrink-0 w-80 snap-start` 
    }))
  })
}

// Validation helpers
export const validators = {
  validateBadges: (badges: FeatureCardBadge[]): boolean => {
    return badges.every(badge => 
      typeof badge.label === 'string' && badge.label.length > 0
    )
  },
  
  validateActions: (actions: FeatureCardAction[]): boolean => {
    return actions.every(action => 
      typeof action.label === 'string' && 
      typeof action.onClick === 'function'
    )
  },
  
  validateMetadata: (metadata: FeatureCardMetadata[]): boolean => {
    return metadata.every(item => 
      typeof item.label === 'string' && 
      (typeof item.value === 'string' || typeof item.value === 'number')
    )
  }
}

// Theme utilities for consistent styling
export const themes = {
  luxury: {
    iconColor: "text-gold",
    variant: "premium" as const,
    showHoverGlow: true,
    hoverAnimation: "lift" as const
  },
  
  modern: {
    iconColor: "text-blue-400",
    variant: "glass" as const,
    showHoverGlow: true,
    hoverAnimation: "scale" as const
  },
  
  minimal: {
    iconColor: "text-white",
    variant: "minimal" as const,
    showHoverGlow: false,
    hoverAnimation: "none" as const
  }
}

// Export commonly used combinations
export const commonCards = {
  dealSummary: (deal: any) => cardPresets.deal({
    title: deal.dealNumber,
    description: `${deal.type} • ${deal.assetType}`,
    icon: deal.type === 'buy' ? TrendingUp : TrendingDown,
    badges: [
      createBadge(deal.status, deal.status),
      ...(deal.forensicRating ? [createBadge(deal.forensicRating, deal.forensicRating)] : [])
    ],
    metadata: [
      createMetadata('Client', deal.clientName, { icon: User }),
      createMetadata('Amount', deal.totalValue, { format: 'currency', icon: DollarSign }),
      createMetadata('Submitted', deal.submittedAt, { format: 'date', icon: Calendar })
    ]
  }),
  
  resourceSummary: (resource: any) => cardPresets.resource({
    title: resource.title,
    description: resource.description,
    icon: typeIcons[resource.type] || FileText,
    badges: [
      createBadge(resource.category, resource.category),
      createBadge(resource.difficulty, resource.difficulty)
    ],
    metadata: [
      createMetadata('Author', resource.authorName, { icon: User }),
      createMetadata('Downloads', resource.downloadCount, { format: 'number', icon: Download }),
      createMetadata('Rating', `${resource.rating}/5`, { icon: Star })
    ]
  }),
  
  statCard: (title: string, value: string | number, icon: LucideIcon, color?: string) => 
    cardPresets.stat({
      title,
      icon,
      iconColor: color || "text-gold",
      metadata: [{ label: '', value, className: 'text-2xl font-bold text-white' }]
    })
}