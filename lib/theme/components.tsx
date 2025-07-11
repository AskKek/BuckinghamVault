/**
 * Theme-Aware Components
 * Reusable status-aware components with automatic color mapping
 */

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  getStatusColor,
  getStatusBadgeClasses,
  getStatusIconClasses,
  getNumericStatusColor,
  getCurrencyDisplayClasses,
  getProgressColors,
  type DealStatus,
  type DealType,
  type ForensicRating,
  type AssetType,
  type KycStatus,
  type RiskLevel
} from './utils'

// Status Badge Component
type StatusCategory = "assetType" | "forensicRating" | "deal" | "dealType" | "kyc" | "risk"

interface StatusBadgeProps {
  category: StatusCategory
  value: string
  variant?: 'solid' | 'outline' | 'subtle'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children?: React.ReactNode
}

export function StatusBadge({
  category,
  value,
  variant = 'subtle',
  size = 'md',
  className,
  children
}: StatusBadgeProps) {
  const badgeClasses = getStatusBadgeClasses(category, value, variant, size)
  
  return (
    <Badge className={cn(badgeClasses, className)}>
      {children || value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
    </Badge>
  )
}

// Deal Status Badge
interface DealStatusBadgeProps {
  status: DealStatus
  variant?: 'solid' | 'outline' | 'subtle'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function DealStatusBadge({ status, variant, size, className }: DealStatusBadgeProps) {
  const displayText = {
    submitted: 'Submitted',
    under_review: 'Under Review',
    matched: 'Matched',
    negotiating: 'Negotiating',
    due_diligence: 'Due Diligence',
    completed: 'Completed',
    cancelled: 'Cancelled'
  }[status]
  
  return (
    <StatusBadge 
      category="deal" 
      value={status} 
      variant={variant}
      size={size}
      className={className}
    >
      {displayText}
    </StatusBadge>
  )
}

// Deal Type Badge
interface DealTypeBadgeProps {
  type: DealType
  variant?: 'solid' | 'outline' | 'subtle'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function DealTypeBadge({ type, variant, size, className }: DealTypeBadgeProps) {
  const displayText = {
    buy: 'Buy',
    sell: 'Sell',
    acquisition: 'Acquisition',
    divestiture: 'Divestiture',
    merger: 'Merger',
    ipo: 'IPO',
    refinancing: 'Refinancing'
  }[type]
  
  return (
    <StatusBadge 
      category="dealType" 
      value={type}
      variant={variant}
      size={size}
      className={className}
    >
      {displayText}
    </StatusBadge>
  )
}

// Forensic Rating Badge
interface ForensicRatingBadgeProps {
  rating: ForensicRating
  variant?: 'solid' | 'outline' | 'subtle'
  size?: 'sm' | 'md' | 'lg'
  showStars?: boolean
  className?: string
}

export function ForensicRatingBadge({ 
  rating, 
  variant, 
  size, 
  showStars = false,
  className 
}: ForensicRatingBadgeProps) {
  const stars = rating === 'unrated' ? '—' : '★'.repeat({
    'AAA': 5,
    'AA': 4,
    'A': 3,
    'BBB': 2
  }[rating] || 0)
  
  return (
    <StatusBadge 
      category="forensicRating" 
      value={rating}
      variant={variant}
      size={size}
      className={className}
    >
      {showStars ? `${rating} ${stars}` : rating}
    </StatusBadge>
  )
}

// Asset Type Badge
interface AssetTypeBadgeProps {
  assetType: AssetType
  variant?: 'solid' | 'outline' | 'subtle'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function AssetTypeBadge({ assetType, variant, size, className }: AssetTypeBadgeProps) {
  return (
    <StatusBadge 
      category="assetType" 
      value={assetType}
      variant={variant}
      size={size}
      className={className}
    >
      {assetType}
    </StatusBadge>
  )
}

// KYC Status Badge
interface KycStatusBadgeProps {
  status: KycStatus
  variant?: 'solid' | 'outline' | 'subtle'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function KycStatusBadge({ status, variant, size, className }: KycStatusBadgeProps) {
  const displayText = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected'
  }[status]
  
  return (
    <StatusBadge 
      category="kyc" 
      value={status}
      variant={variant}
      size={size}
      className={className}
    >
      {displayText}
    </StatusBadge>
  )
}

// Risk Level Indicator
interface RiskLevelIndicatorProps {
  level: RiskLevel
  variant?: 'badge' | 'dot' | 'bar'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function RiskLevelIndicator({ 
  level, 
  variant = 'badge', 
  size = 'md',
  className 
}: RiskLevelIndicatorProps) {
  const colors = getStatusColor('risk', level)
  
  const displayText = {
    very_low: 'Very Low Risk',
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk'
  }[level]
  
  if (variant === 'dot') {
    const dotSizes = { sm: 'w-2 h-2', md: 'w-3 h-3', lg: 'w-4 h-4' }
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className={cn(
          'rounded-full',
          dotSizes[size],
          colors.text.replace('text-', 'bg-')
        )} />
        <span className="text-sm text-white/70">{displayText}</span>
      </div>
    )
  }
  
  if (variant === 'bar') {
    const riskValue = { very_low: 20, low: 40, medium: 70, high: 90 }[level]
    const progressColors = getProgressColors(riskValue, level === 'high' ? 'error' : level === 'medium' ? 'warning' : 'success')
    
    return (
      <div className={cn('space-y-1', className)}>
        <div className="flex justify-between text-xs">
          <span className="text-white/70">{displayText}</span>
          <span className={colors.text}>{riskValue}%</span>
        </div>
        <div className={cn('h-2 rounded-full', progressColors.background)}>
          <div 
            className={cn('h-full rounded-full transition-all duration-300', progressColors.fill)}
            style={{ width: `${riskValue}%` }}
          />
        </div>
      </div>
    )
  }
  
  return (
    <StatusBadge 
      category="risk" 
      value={level}
      variant="subtle"
      size={size}
      className={className}
    >
      {displayText}
    </StatusBadge>
  )
}

// Currency Display Component
interface CurrencyDisplayProps {
  amount: number
  currency?: string
  size?: 'sm' | 'md' | 'lg'
  threshold?: { positive?: number; negative?: number }
  showCurrency?: boolean
  className?: string
}

export function CurrencyDisplay({
  amount,
  currency = 'USD',
  size = 'md',
  threshold,
  showCurrency = true,
  className
}: CurrencyDisplayProps) {
  const { classes, formatted } = getCurrencyDisplayClasses(amount, threshold)
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }
  
  return (
    <span className={cn(classes, sizeClasses[size], className)}>
      {showCurrency ? formatted : formatted.replace(/[^\d,.-]/g, '')}
    </span>
  )
}

// Progress Ring Component
interface ProgressRingProps {
  percentage: number
  size?: number
  strokeWidth?: number
  type?: 'success' | 'warning' | 'error' | 'info'
  showText?: boolean
  className?: string
}

export function ProgressRing({
  percentage,
  size = 60,
  strokeWidth = 6,
  type = 'info',
  showText = true,
  className
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  
  const colors = {
    success: 'stroke-success-500',
    warning: 'stroke-warning-500',
    error: 'stroke-error-500',
    info: 'stroke-info-500'
  }
  
  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg 
        width={size} 
        height={size}
        className="transform -rotate-90"
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-navy-700"
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn(colors[type], 'transition-all duration-300')}
        />
      </svg>
      {showText && (
        <span className="absolute text-sm font-medium text-white">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  )
}

// Status Icon Component
interface StatusIconProps {
  category: StatusCategory
  value: string
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

export function StatusIcon({ 
  category, 
  value, 
  size = 'md', 
  icon: Icon,
  className 
}: StatusIconProps) {
  const iconClasses = getStatusIconClasses(category, value, size)
  
  if (Icon) {
    return <Icon className={cn(iconClasses, className)} />
  }
  
  // Default status indicators
  const defaultIcons = {
    completed: '✓',
    success: '✓',
    approved: '✓',
    cancelled: '✗',
    rejected: '✗',
    error: '✗',
    pending: '⏳',
    warning: '⚠',
    info: 'ℹ'
  }
  
  const icon = defaultIcons[value as keyof typeof defaultIcons] || '●'
  
  return (
    <span className={cn(iconClasses, 'font-bold', className)}>
      {icon}
    </span>
  )
}