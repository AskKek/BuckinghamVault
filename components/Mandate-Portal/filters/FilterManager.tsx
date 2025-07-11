"use client"

/**
 * FilterManager - Advanced Generic Filter System
 * Unified filtering solution for institutional financial platforms
 */

import React, { useMemo, useCallback, useEffect, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { z } from 'zod'
import { FeatureCard } from '@/components/shared/FeatureCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { DealStatusBadge, DealTypeBadge, getStatusBadgeClasses } from '@/lib/theme'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useFilters, useBuckinghamStore } from '@/lib/store'
import { 
  Filter, 
  Search, 
  X, 
  ChevronDown, 
  Calendar as CalendarIcon,
  SlidersHorizontal,
  RotateCcw,
  Save,
  Star,
  Settings,
  Download,
  Share,
  Bookmark
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

// Core filter interfaces
export interface FilterOption {
  value: any
  label: string
  description?: string
  count?: number
  color?: string
  icon?: React.ComponentType<{ className?: string }>
  disabled?: boolean
  category?: string
}

export interface FilterField {
  id: string
  name: string
  type: FilterFieldType
  label: string
  description?: string
  placeholder?: string
  options?: FilterOption[]
  validation?: z.ZodSchema
  required?: boolean
  hidden?: boolean
  defaultValue?: any
  props?: Record<string, any>
  dependencies?: FilterDependency[]
  order?: number
  category?: string
}

export interface FilterDependency {
  field: string
  condition: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'exists'
  value: any
  action: 'show' | 'hide' | 'enable' | 'disable'
}

export interface FilterPreset {
  id: string
  name: string
  description?: string
  filters: Record<string, any>
  isDefault?: boolean
  isShared?: boolean
  createdAt: Date
  updatedAt: Date
  createdBy?: string
  category?: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface FilterConfig {
  module: 'deals' | 'knowledge' | 'exchange' | 'analytics' | string
  fields: FilterField[]
  layout?: 'horizontal' | 'vertical' | 'sidebar' | 'modal'
  showSearch?: boolean
  showPresets?: boolean
  showClearAll?: boolean
  showSavePreset?: boolean
  showExport?: boolean
  showCount?: boolean
  urlSync?: boolean
  persistence?: boolean
  debounceMs?: number
  maxActiveFilters?: number
  validation?: z.ZodSchema
  onFilterChange?: (filters: Record<string, any>) => void
  onPresetLoad?: (preset: FilterPreset) => void
  onPresetSave?: (preset: Omit<FilterPreset, 'id' | 'createdAt' | 'updatedAt'>) => void
  onExport?: (filters: Record<string, any>) => void
  className?: string
}

export type FilterFieldType = 
  | 'search' | 'select' | 'multiselect' | 'radio' | 'checkbox'
  | 'date' | 'daterange' | 'number' | 'range' | 'currency'
  | 'rating' | 'boolean' | 'tags' | 'custom'

interface FilterManagerProps {
  config: FilterConfig
  data?: any[]
  totalCount?: number
  loading?: boolean
  className?: string
}

// Filter state management hook
function useFilterState(config: FilterConfig) {
  const { filters, actions: filterActions } = useFilters()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  const moduleFilters = filters[config.module as keyof typeof filters] || {}
  const [localFilters, setLocalFilters] = useState<Record<string, any>>({})
  const [activePreset, setActivePreset] = useState<FilterPreset | null>(null)
  
  // Initialize filters from URL if URL sync is enabled
  useEffect(() => {
    if (!config.urlSync) return
    
    const urlFilters: Record<string, any> = {}
    searchParams.forEach((value, key) => {
      try {
        urlFilters[key] = JSON.parse(value)
      } catch {
        urlFilters[key] = value
      }
    })
    
    if (Object.keys(urlFilters).length > 0) {
      setLocalFilters(urlFilters)
      updateGlobalFilters(urlFilters)
    }
  }, [])
  
  // Update global store
  const updateGlobalFilters = useCallback((newFilters: Record<string, any>) => {
    switch (config.module) {
      case 'deals':
        filterActions.setDealFilters(newFilters)
        break
      case 'knowledge':
        filterActions.setKnowledgeFilters(newFilters)
        break
      case 'exchange':
        filterActions.setExchangeFilters(newFilters)
        break
      default:
        console.warn(`Unknown module: ${config.module}`)
    }
  }, [config.module, filterActions])
  
  // Update URL if sync is enabled
  const updateUrl = useCallback((newFilters: Record<string, any>) => {
    if (!config.urlSync) return
    
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, JSON.stringify(value))
      }
    })
    
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.replace(newUrl, { scroll: false })
  }, [config.urlSync, pathname, router])
  
  // Set filter value
  const setFilter = useCallback((name: string, value: any) => {
    const newFilters = { ...localFilters, [name]: value }
    setLocalFilters(newFilters)
    updateGlobalFilters(newFilters)
    updateUrl(newFilters)
    config.onFilterChange?.(newFilters)
  }, [localFilters, updateGlobalFilters, updateUrl, config])
  
  // Clear specific filter
  const clearFilter = useCallback((name: string) => {
    const newFilters = { ...localFilters }
    delete newFilters[name]
    setLocalFilters(newFilters)
    updateGlobalFilters(newFilters)
    updateUrl(newFilters)
    config.onFilterChange?.(newFilters)
  }, [localFilters, updateGlobalFilters, updateUrl, config])
  
  // Clear all filters
  const clearAll = useCallback(() => {
    setLocalFilters({})
    updateGlobalFilters({})
    updateUrl({})
    setActivePreset(null)
    config.onFilterChange?.({})
  }, [updateGlobalFilters, updateUrl, config])
  
  // Load preset
  const loadPreset = useCallback((preset: FilterPreset) => {
    setLocalFilters(preset.filters)
    updateGlobalFilters(preset.filters)
    updateUrl(preset.filters)
    setActivePreset(preset)
    config.onPresetLoad?.(preset)
    config.onFilterChange?.(preset.filters)
  }, [updateGlobalFilters, updateUrl, config])
  
  // Get current filter values (merge global and local)
  const currentFilters = useMemo(() => ({
    ...moduleFilters,
    ...localFilters
  }), [moduleFilters, localFilters])
  
  // Get active filter count
  const activeCount = useMemo(() => {
    return Object.values(currentFilters).filter(value => {
      if (Array.isArray(value)) return value.length > 0
      return value !== undefined && value !== null && value !== ''
    }).length
  }, [currentFilters])
  
  return {
    filters: currentFilters,
    setFilter,
    clearFilter,
    clearAll,
    loadPreset,
    activePreset,
    activeCount,
    hasActiveFilters: activeCount > 0
  }
}

// Individual filter field renderer
function FilterFieldRenderer({ 
  field, 
  value, 
  onChange, 
  disabled 
}: { 
  field: FilterField
  value: any
  onChange: (value: any) => void
  disabled?: boolean
}) {
  const renderSearchField = () => (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
      <Input
        type="text"
        placeholder={field.placeholder || `Search ${field.label.toLowerCase()}...`}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="pl-10 bg-navy/50 border-gold/20 text-white placeholder:text-white/50 focus:border-gold"
      />
    </div>
  )
  
  const renderSelectField = () => (
    <Select value={value || ''} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="bg-navy/50 border-gold/20 text-white focus:border-gold">
        <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
      </SelectTrigger>
      <SelectContent className="bg-navy/95 border-gold/20">
        {field.options?.map((option) => (
          <SelectItem 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
            className="text-white hover:bg-gold/10 focus:bg-gold/10"
          >
            <div className="flex items-center gap-2">
              {option.icon && <option.icon className="w-4 h-4" />}
              <span>{option.label}</span>
              {option.count !== undefined && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {option.count}
                </Badge>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
  
  const renderMultiSelectField = () => {
    const selectedValues = Array.isArray(value) ? value : []
    
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border border-gold/20 rounded-md bg-navy/50">
          {selectedValues.length === 0 ? (
            <span className="text-white/50 text-sm self-center">
              {field.placeholder || `Select ${field.label}`}
            </span>
          ) : (
            selectedValues.map((val: any) => {
              const option = field.options?.find(opt => opt.value === val)
              return (
                <Badge
                  key={val}
                  variant="secondary"
                  className={cn(
                    "bg-gold/20 text-gold border-gold/30",
                    option?.color && getStatusBadgeClasses('deal', val, 'subtle', 'sm')
                  )}
                >
                  {option?.icon && <option.icon className="w-3 h-3 mr-1" />}
                  {option?.label || val}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1 hover:bg-white/20"
                    onClick={() => {
                      const newValues = selectedValues.filter((v: any) => v !== val)
                      onChange(newValues)
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )
            })
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
          {field.options?.map((option) => {
            const isSelected = selectedValues.includes(option.value)
            
            return (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${option.value}`}
                  checked={isSelected}
                  onCheckedChange={(checked) => {
                    const newValues = checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter((v: any) => v !== option.value)
                    onChange(newValues)
                  }}
                  disabled={disabled || option.disabled}
                  className="border-gold/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                />
                <Label 
                  htmlFor={`${field.id}-${option.value}`}
                  className="text-sm text-white cursor-pointer flex items-center gap-2 flex-1"
                >
                  {option.icon && <option.icon className="w-4 h-4" />}
                  <span>{option.label}</span>
                  {option.count !== undefined && (
                    <span className="text-xs text-white/60">({option.count})</span>
                  )}
                </Label>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  
  const renderDateRangeField = () => {
    const [startDate, endDate] = Array.isArray(value) ? value : [null, null]
    const [isOpen, setIsOpen] = useState(false)
    
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal bg-navy/50 border-gold/20 text-white hover:bg-navy/70 hover:border-gold/40",
              !startDate && "text-white/50"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate && endDate ? (
              `${format(startDate, 'MMM dd')} - ${format(endDate, 'MMM dd, yyyy')}`
            ) : (
              field.placeholder || "Select date range"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-navy/95 border-gold/20" align="start">
          <Calendar
            mode="range"
            selected={startDate && endDate ? { from: startDate, to: endDate } : undefined}
            onSelect={(range) => {
              onChange([range?.from || null, range?.to || null])
              if (range?.from && range?.to) {
                setIsOpen(false)
              }
            }}
            numberOfMonths={2}
            className="text-white"
          />
        </PopoverContent>
      </Popover>
    )
  }
  
  const renderRangeField = () => {
    const rangeValue = Array.isArray(value) ? value : [field.props?.min || 0, field.props?.max || 100]
    
    return (
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-white/70">{field.props?.formatLabel?.(rangeValue[0]) || rangeValue[0]}</span>
          <span className="text-white/70">{field.props?.formatLabel?.(rangeValue[1]) || rangeValue[1]}</span>
        </div>
        <Slider
          value={rangeValue}
          onValueChange={onChange}
          min={field.props?.min || 0}
          max={field.props?.max || 100}
          step={field.props?.step || 1}
          disabled={disabled}
          className="w-full"
        />
      </div>
    )
  }
  
  const renderRatingField = () => {
    const rating = value || 0
    const maxRating = field.props?.maxRating || 5
    
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: maxRating }, (_, index) => {
          const ratingValue = index + 1
          const isActive = rating >= ratingValue
          
          return (
            <button
              key={index}
              type="button"
              disabled={disabled}
              className="transition-colors hover:scale-110"
              onClick={() => onChange(rating === ratingValue ? 0 : ratingValue)}
            >
              <Star
                className={cn(
                  "w-5 h-5",
                  isActive ? "fill-gold text-gold" : "text-white/30 hover:text-gold/50"
                )}
              />
            </button>
          )
        })}
        {rating > 0 && (
          <span className="ml-2 text-sm text-white/70">
            {rating}+ stars
          </span>
        )}
      </div>
    )
  }
  
  switch (field.type) {
    case 'search':
      return renderSearchField()
    case 'select':
      return renderSelectField()
    case 'multiselect':
      return renderMultiSelectField()
    case 'daterange':
      return renderDateRangeField()
    case 'range':
    case 'currency':
      return renderRangeField()
    case 'rating':
      return renderRatingField()
    case 'boolean':
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={field.id}
            checked={value || false}
            onCheckedChange={onChange}
            disabled={disabled}
            className="border-gold/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
          />
          <Label htmlFor={field.id} className="text-white cursor-pointer">
            {field.label}
          </Label>
        </div>
      )
    default:
      return renderSearchField()
  }
}

// Filter configuration presets for each module
export const FILTER_PRESETS = {
  deals: {
    module: 'deals' as const,
    fields: [
      {
        id: 'search',
        name: 'search',
        type: 'search' as const,
        label: 'Search Deals',
        placeholder: 'Search by deal number, client name...',
        order: 1
      },
      {
        id: 'status',
        name: 'status',
        type: 'multiselect' as const,
        label: 'Status',
        options: [
          { value: 'pending', label: 'Pending', color: 'yellow', count: 12 },
          { value: 'active', label: 'Active', color: 'green', count: 25 },
          { value: 'completed', label: 'Completed', color: 'blue', count: 18 },
          { value: 'cancelled', label: 'Cancelled', color: 'red', count: 3 }
        ],
        order: 2
      },
      {
        id: 'type',
        name: 'type',
        type: 'multiselect' as const,
        label: 'Deal Type',
        options: [
          { value: 'acquisition', label: 'Acquisition', count: 15 },
          { value: 'divestiture', label: 'Divestiture', count: 22 },
          { value: 'merger', label: 'Merger', count: 8 },
          { value: 'ipo', label: 'IPO', count: 6 },
          { value: 'refinancing', label: 'Refinancing', count: 7 }
        ],
        order: 3
      },
      {
        id: 'valueRange',
        name: 'valueRange',
        type: 'range' as const,
        label: 'Deal Value Range',
        props: {
          min: 0,
          max: 1000000000,
          step: 1000000,
          formatLabel: (value: number) => `$${(value / 1000000).toFixed(0)}M`
        },
        category: 'advanced',
        order: 4
      },
      {
        id: 'dateRange',
        name: 'dateRange',
        type: 'daterange' as const,
        label: 'Date Range',
        placeholder: 'Select date range',
        category: 'advanced',
        order: 5
      },
      {
        id: 'forensicRating',
        name: 'forensicRating',
        type: 'rating' as const,
        label: 'Minimum Forensic Rating',
        props: { maxRating: 5 },
        category: 'advanced',
        order: 6
      }
    ],
    showSearch: true,
    showPresets: true,
    showClearAll: true,
    showCount: true,
    urlSync: true,
    persistence: true,
    debounceMs: 300
  },
  
  knowledge: {
    module: 'knowledge' as const,
    fields: [
      {
        id: 'search',
        name: 'search',
        type: 'search' as const,
        label: 'Search Knowledge Base',
        placeholder: 'Search articles, documents, insights...',
        order: 1
      },
      {
        id: 'category',
        name: 'category',
        type: 'multiselect' as const,
        label: 'Category',
        options: [
          { value: 'market-analysis', label: 'Market Analysis', color: 'blue', count: 45 },
          { value: 'regulatory', label: 'Regulatory', color: 'purple', count: 32 },
          { value: 'tax-strategy', label: 'Tax Strategy', color: 'green', count: 28 },
          { value: 'due-diligence', label: 'Due Diligence', color: 'orange', count: 38 },
          { value: 'valuation', label: 'Valuation', color: 'red', count: 22 }
        ],
        order: 2
      },
      {
        id: 'type',
        name: 'type',
        type: 'select' as const,
        label: 'Content Type',
        options: [
          { value: 'article', label: 'Articles', count: 85 },
          { value: 'report', label: 'Reports', count: 42 },
          { value: 'whitepaper', label: 'Whitepapers', count: 28 },
          { value: 'case-study', label: 'Case Studies', count: 35 },
          { value: 'template', label: 'Templates', count: 15 }
        ],
        order: 3
      },
      {
        id: 'featured',
        name: 'featured',
        type: 'boolean' as const,
        label: 'Featured Content Only',
        category: 'advanced',
        order: 4
      },
      {
        id: 'tags',
        name: 'tags',
        type: 'multiselect' as const,
        label: 'Tags',
        options: [
          { value: 'trending', label: 'Trending', count: 12 },
          { value: 'expert-insights', label: 'Expert Insights', count: 24 },
          { value: 'client-favorite', label: 'Client Favorite', count: 18 },
          { value: 'new', label: 'New', count: 8 }
        ],
        category: 'advanced',
        order: 5
      }
    ],
    showSearch: true,
    showPresets: true,
    showClearAll: true,
    showCount: true,
    urlSync: true,
    persistence: true,
    debounceMs: 300
  },
  
  exchange: {
    module: 'exchange' as const,
    fields: [
      {
        id: 'search',
        name: 'search',
        type: 'search' as const,
        label: 'Search Assets',
        placeholder: 'Search by symbol, name, address...',
        order: 1
      },
      {
        id: 'assetType',
        name: 'assetType',
        type: 'multiselect' as const,
        label: 'Asset Type',
        options: [
          { value: 'bitcoin', label: 'Bitcoin', color: 'orange', count: 1 },
          { value: 'ethereum', label: 'Ethereum', color: 'blue', count: 1 },
          { value: 'stablecoin', label: 'Stablecoins', color: 'green', count: 8 },
          { value: 'defi', label: 'DeFi Tokens', color: 'purple', count: 25 },
          { value: 'nft', label: 'NFT Collections', color: 'pink', count: 12 }
        ],
        order: 2
      },
      {
        id: 'forensicRating',
        name: 'forensicRating',
        type: 'rating' as const,
        label: 'Minimum Forensic Rating',
        props: { maxRating: 5 },
        order: 3
      },
      {
        id: 'priceRange',
        name: 'priceRange',
        type: 'range' as const,
        label: 'Price Range (USD)',
        props: {
          min: 0,
          max: 100000,
          step: 100,
          formatLabel: (value: number) => `$${value.toLocaleString()}`
        },
        category: 'advanced',
        order: 4
      },
      {
        id: 'region',
        name: 'region',
        type: 'multiselect' as const,
        label: 'Regulatory Region',
        options: [
          { value: 'us', label: 'United States', count: 35 },
          { value: 'eu', label: 'European Union', count: 22 },
          { value: 'uk', label: 'United Kingdom', count: 18 },
          { value: 'asia', label: 'Asia Pacific', count: 15 },
          { value: 'global', label: 'Global', count: 8 }
        ],
        category: 'advanced',
        order: 5
      }
    ],
    showSearch: true,
    showPresets: true,
    showClearAll: true,
    showCount: true,
    urlSync: true,
    persistence: true,
    debounceMs: 300
  }
}

// Main FilterManager component
export function FilterManager({ 
  config, 
  data = [], 
  totalCount, 
  loading = false,
  className 
}: FilterManagerProps) {
  const filterState = useFilterState(config)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [presets, setPresets] = useState<FilterPreset[]>([])
  
  // Get visible fields based on dependencies
  const visibleFields = useMemo(() => {
    return config.fields.filter(field => {
      if (field.hidden) return false
      
      if (field.dependencies?.length) {
        return field.dependencies.every(dep => {
          const depValue = (filterState.filters as any)[dep.field]
          let conditionMet = false
          
          switch (dep.condition) {
            case 'equals':
              conditionMet = depValue === dep.value
              break
            case 'not_equals':
              conditionMet = depValue !== dep.value
              break
            case 'contains':
              conditionMet = Array.isArray(depValue) && depValue.includes(dep.value)
              break
            case 'exists':
              conditionMet = depValue !== undefined && depValue !== null && depValue !== ''
              break
            default:
              conditionMet = true
          }
          
          return dep.action === 'show' ? conditionMet : !conditionMet
        })
      }
      
      return true
    }).sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [config.fields, filterState.filters])
  
  // Separate primary and advanced fields
  const primaryFields = visibleFields.filter(field => field.category !== 'advanced')
  const advancedFields = visibleFields.filter(field => field.category === 'advanced')
  
  return (
    <FeatureCard
      variant="glass"
      className={cn("border-gold/20", className)}
      contentClassName="p-6"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gold" />
              <h3 className="text-lg font-semibold text-white">Filters</h3>
            </div>
            
            {filterState.hasActiveFilters && (
              <Badge variant="secondary" className="bg-gold/20 text-gold border-gold/30">
                {filterState.activeCount} active
              </Badge>
            )}
            
            {totalCount !== undefined && config.showCount && (
              <Badge variant="outline" className="border-white/20 text-white/70">
                {totalCount.toLocaleString()} results
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {advancedFields.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Advanced
                <ChevronDown className={cn(
                  "w-4 h-4 ml-1 transition-transform",
                  showAdvanced && "rotate-180"
                )} />
              </Button>
            )}
            
            {config.showClearAll && filterState.hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={filterState.clearAll}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>
        
        {/* Primary Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {primaryFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label className="text-sm font-medium text-white">
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </Label>
              <FilterFieldRenderer
                field={field}
                value={(filterState.filters as any)[field.name]}
                onChange={(value) => filterState.setFilter(field.name, value)}
                disabled={loading}
              />
              {field.description && (
                <p className="text-xs text-white/60">{field.description}</p>
              )}
            </div>
          ))}
        </div>
        
        {/* Advanced Filters */}
        <AnimatePresence>
          {showAdvanced && advancedFields.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Separator className="bg-gold/20 my-4" />
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-white/80">Advanced Filters</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {advancedFields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label className="text-sm font-medium text-white">
                        {field.label}
                        {field.required && <span className="text-red-400 ml-1">*</span>}
                      </Label>
                      <FilterFieldRenderer
                        field={field}
                        value={(filterState.filters as any)[field.name]}
                        onChange={(value) => filterState.setFilter(field.name, value)}
                        disabled={loading}
                      />
                      {field.description && (
                        <p className="text-xs text-white/60">{field.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Active Filters Display */}
        {filterState.hasActiveFilters && (
          <div className="space-y-3">
            <Separator className="bg-gold/20" />
            <div className="space-y-2">
              <Label className="text-sm font-medium text-white/80">Active Filters</Label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filterState.filters).map(([key, value]) => {
                  if (!value || (Array.isArray(value) && value.length === 0)) return null
                  
                  const field = config.fields.find(f => f.name === key)
                  if (!field) return null
                  
                  const displayValue = Array.isArray(value) 
                    ? value.map(v => field.options?.find(opt => opt.value === v)?.label || v).join(', ')
                    : field.options?.find(opt => opt.value === value)?.label || String(value || '')
                  
                  return (
                    <Badge
                      key={key}
                      variant="secondary"
                      className={cn(
                        "bg-gold/20 text-gold border-gold/30 pr-1",
                        field.name === 'status' && getStatusBadgeClasses('deal', Array.isArray(value) ? value[0] : value, 'subtle', 'sm'),
                        field.name === 'type' && getStatusBadgeClasses('dealType', Array.isArray(value) ? value[0] : value, 'subtle', 'sm')
                      )}
                    >
                      <span className="font-medium">{field.label}:</span>
                      <span className="ml-1">{displayValue}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-2 hover:bg-gold/20"
                        onClick={() => filterState.clearFilter(key)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </FeatureCard>
  )
}