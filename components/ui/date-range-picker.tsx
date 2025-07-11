"use client"

/**
 * Enterprise Date Range Picker
 * Sophisticated date range selection for financial reporting and analytics
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  RotateCcw,
  Check,
  X,
  TrendingUp,
  BarChart3
} from 'lucide-react'
import { format, addDays, addWeeks, addMonths, addYears, startOfDay, endOfDay, isValid, differenceInDays } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { getThemeClasses, THEME_ANIMATIONS } from '@/lib/theme'

export interface DateRange {
  from: Date | null
  to: Date | null
}

export interface DateRangePreset {
  id: string
  label: string
  description?: string
  range: () => DateRange
  category?: 'relative' | 'fixed' | 'fiscal' | 'custom'
  icon?: React.ComponentType<{ className?: string }>
}

export interface DateRangePickerProps {
  // Core functionality
  value?: DateRange
  defaultValue?: DateRange
  onChange?: (range: DateRange) => void
  onRangeSelect?: (range: DateRange, preset?: DateRangePreset) => void
  
  // Behavior
  mode?: 'single' | 'range' | 'multiple'
  allowSingleDay?: boolean
  allowFuture?: boolean
  allowPast?: boolean
  minDate?: Date
  maxDate?: Date
  
  // Presets
  presets?: DateRangePreset[]
  showPresets?: boolean
  customPresets?: DateRangePreset[]
  presetCategories?: string[]
  
  // UI customization
  variant?: 'default' | 'compact' | 'inline' | 'minimal'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  placeholder?: string
  displayFormat?: string
  
  // Features
  showComparison?: boolean
  comparisonRange?: DateRange
  showQuickSelect?: boolean
  showStatistics?: boolean
  showRelativeTime?: boolean
  
  // Calendar customization
  numberOfMonths?: 1 | 2 | 3
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  locale?: string
  
  // Styling
  className?: string
  popoverClassName?: string
  calendarClassName?: string
  
  // Accessibility
  'aria-label'?: string
  'aria-describedby'?: string
  id?: string
}

// Default preset configurations
const DEFAULT_PRESETS: DateRangePreset[] = [
  {
    id: 'today',
    label: 'Today',
    category: 'relative',
    range: () => {
      const today = new Date()
      return { from: startOfDay(today), to: endOfDay(today) }
    }
  },
  {
    id: 'yesterday',
    label: 'Yesterday', 
    category: 'relative',
    range: () => {
      const yesterday = addDays(new Date(), -1)
      return { from: startOfDay(yesterday), to: endOfDay(yesterday) }
    }
  },
  {
    id: 'last7days',
    label: 'Last 7 Days',
    category: 'relative',
    range: () => ({
      from: addDays(new Date(), -6),
      to: new Date()
    })
  },
  {
    id: 'last30days',
    label: 'Last 30 Days',
    category: 'relative', 
    range: () => ({
      from: addDays(new Date(), -29),
      to: new Date()
    })
  },
  {
    id: 'thisMonth',
    label: 'This Month',
    category: 'relative',
    range: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      return { from: start, to: now }
    }
  },
  {
    id: 'lastMonth',
    label: 'Last Month',
    category: 'relative',
    range: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const end = new Date(now.getFullYear(), now.getMonth(), 0)
      return { from: start, to: end }
    }
  },
  {
    id: 'thisQuarter',
    label: 'This Quarter',
    category: 'fiscal',
    range: () => {
      const now = new Date()
      const quarter = Math.floor(now.getMonth() / 3)
      const start = new Date(now.getFullYear(), quarter * 3, 1)
      return { from: start, to: now }
    }
  },
  {
    id: 'lastQuarter',
    label: 'Last Quarter',
    category: 'fiscal',
    range: () => {
      const now = new Date()
      const quarter = Math.floor(now.getMonth() / 3)
      const prevQuarter = quarter === 0 ? 3 : quarter - 1
      const year = quarter === 0 ? now.getFullYear() - 1 : now.getFullYear()
      const start = new Date(year, prevQuarter * 3, 1)
      const end = new Date(year, prevQuarter * 3 + 3, 0)
      return { from: start, to: end }
    }
  },
  {
    id: 'thisYear',
    label: 'This Year',
    category: 'fiscal',
    range: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), 0, 1)
      return { from: start, to: now }
    }
  },
  {
    id: 'lastYear',
    label: 'Last Year',
    category: 'fiscal',
    range: () => {
      const now = new Date()
      const start = new Date(now.getFullYear() - 1, 0, 1)
      const end = new Date(now.getFullYear() - 1, 11, 31)
      return { from: start, to: end }
    }
  }
]

// Format date range for display
const formatDateRange = (range: DateRange, displayFormat = 'MMM dd, yyyy'): string => {
  if (!range.from) return 'Select date range'
  if (!range.to) return format(range.from, displayFormat)
  
  if (range.from.getTime() === range.to.getTime()) {
    return format(range.from, displayFormat)
  }
  
  return `${format(range.from, displayFormat)} - ${format(range.to, displayFormat)}`
}

// Calculate range statistics
const getRangeStatistics = (range: DateRange) => {
  if (!range.from || !range.to) return null
  
  const days = differenceInDays(range.to, range.from) + 1
  const weeks = Math.ceil(days / 7)
  const months = Math.ceil(days / 30)
  
  return {
    days,
    weeks,
    months,
    businessDays: Math.floor(days * 5/7), // Rough estimate
    weekends: Math.floor(days * 2/7)
  }
}

function PresetButton({ 
  preset, 
  isSelected, 
  onClick 
}: { 
  preset: DateRangePreset
  isSelected: boolean
  onClick: () => void 
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        'w-full justify-start text-left font-normal',
        isSelected 
          ? 'bg-gold/20 text-gold border border-gold/30' 
          : 'text-white/70 hover:text-white hover:bg-white/10'
      )}
    >
      {preset.icon && <preset.icon className="w-4 h-4 mr-2" />}
      <div className="flex-1">
        <div className="text-sm">{preset.label}</div>
        {preset.description && (
          <div className="text-xs text-white/50">{preset.description}</div>
        )}
      </div>
    </Button>
  )
}

function DateRangeStatistics({ range }: { range: DateRange }) {
  const stats = getRangeStatistics(range)
  
  if (!stats) return null
  
  return (
    <div className="p-3 bg-navy-900/60 rounded-lg border border-gold/10">
      <div className="flex items-center gap-2 mb-2">
        <BarChart3 className="w-4 h-4 text-gold" />
        <span className="text-sm font-medium text-white">Range Statistics</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="text-white/60">Total Days:</div>
        <div className="text-white font-medium">{stats.days}</div>
        
        <div className="text-white/60">Business Days:</div>
        <div className="text-white font-medium">{stats.businessDays}</div>
        
        <div className="text-white/60">Weeks:</div>
        <div className="text-white font-medium">{stats.weeks}</div>
        
        <div className="text-white/60">Months:</div>
        <div className="text-white font-medium">{stats.months}</div>
      </div>
    </div>
  )
}

export function DateRangePicker({
  value: controlledValue,
  defaultValue,
  onChange,
  onRangeSelect,
  
  // Behavior
  mode = 'range',
  allowSingleDay = true,
  allowFuture = true,
  allowPast = true,
  minDate,
  maxDate,
  
  // Presets
  presets = DEFAULT_PRESETS,
  showPresets = true,
  customPresets = [],
  presetCategories = ['relative', 'fiscal'],
  
  // UI
  variant = 'default',
  size = 'md',
  disabled = false,
  placeholder = 'Select date range',
  displayFormat = 'MMM dd, yyyy',
  
  // Features
  showComparison = false,
  comparisonRange,
  showQuickSelect = true,
  showStatistics = false,
  showRelativeTime = false,
  
  // Calendar
  numberOfMonths = 2,
  weekStartsOn = 1,
  locale = 'en-US',
  
  // Styling
  className,
  popoverClassName,
  calendarClassName,
  
  // Accessibility
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  id
}: DateRangePickerProps) {
  const [internalValue, setInternalValue] = useState<DateRange>(defaultValue || { from: null, to: null })
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  
  // Use controlled or uncontrolled value
  const value = controlledValue !== undefined ? controlledValue : internalValue
  
  // Combine default and custom presets
  const allPresets = useMemo(() => {
    const filtered = presets.filter(preset => 
      !presetCategories.length || presetCategories.includes(preset.category || 'relative')
    )
    return [...filtered, ...customPresets]
  }, [presets, customPresets, presetCategories])
  
  // Group presets by category
  const groupedPresets = useMemo(() => {
    const groups: Record<string, DateRangePreset[]> = {}
    
    allPresets.forEach(preset => {
      const category = preset.category || 'custom'
      if (!groups[category]) groups[category] = []
      groups[category].push(preset)
    })
    
    return groups
  }, [allPresets])
  
  // Handle date range changes
  const handleRangeChange = useCallback((newRange: DateRange) => {
    if (controlledValue === undefined) {
      setInternalValue(newRange)
    }
    
    onChange?.(newRange)
    onRangeSelect?.(newRange)
    setSelectedPreset(null)
  }, [controlledValue, onChange, onRangeSelect])
  
  // Handle preset selection
  const handlePresetSelect = useCallback((preset: DateRangePreset) => {
    const range = preset.range()
    setSelectedPreset(preset.id)
    handleRangeChange(range)
    onRangeSelect?.(range, preset)
  }, [handleRangeChange, onRangeSelect])
  
  // Handle calendar selection
  const handleCalendarSelect = useCallback((range: any) => {
    if (!range) return
    
    const newRange: DateRange = {
      from: range.from || null,
      to: range.to || range.from || null
    }
    
    // Auto-close when range is complete
    if (newRange.from && newRange.to && mode === 'range') {
      setIsOpen(false)
    }
    
    handleRangeChange(newRange)
  }, [handleRangeChange, mode])
  
  // Reset selection
  const handleReset = useCallback(() => {
    const emptyRange = { from: null, to: null }
    handleRangeChange(emptyRange)
    setSelectedPreset(null)
  }, [handleRangeChange])
  
  // Size variants
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-3 text-base',
    lg: 'h-12 px-4 text-lg'
  }
  
  // Variant classes
  const variantClasses = {
    default: 'bg-navy-800/60 border border-gold/20 text-white hover:bg-navy-800/80',
    compact: 'bg-navy-900/60 border border-gold/20 text-white hover:bg-navy-900/80',
    inline: 'bg-transparent border-none text-white hover:bg-navy-800/30',
    minimal: 'bg-transparent border border-white/10 text-white hover:bg-navy-800/20'
  }
  
  const displayText = formatDateRange(value, displayFormat)
  const hasValue = value.from || value.to
  
  if (variant === 'inline') {
    return (
      <div className={cn('space-y-4', className)}>
        {/* Presets */}
        {showPresets && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white">Quick Select</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {Object.entries(groupedPresets).map(([category, categoryPresets]) => (
                categoryPresets.map(preset => (
                  <PresetButton
                    key={preset.id}
                    preset={preset}
                    isSelected={selectedPreset === preset.id}
                    onClick={() => handlePresetSelect(preset)}
                  />
                ))
              ))}
            </div>
          </div>
        )}
        
        {/* Calendar */}
        <div className="flex justify-center">
          <Calendar
            mode="range"
            selected={value.from && value.to ? { from: value.from, to: value.to } : undefined}
            onSelect={handleCalendarSelect}
            numberOfMonths={numberOfMonths}
            disabled={disabled}
            weekStartsOn={weekStartsOn}
            className={cn('text-white', calendarClassName)}
          />
        </div>
        
        {/* Statistics */}
        {showStatistics && hasValue && (
          <DateRangeStatistics range={value} />
        )}
      </div>
    )
  }
  
  return (
    <div className={cn('relative', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-normal',
              sizeClasses[size],
              variantClasses[variant],
              !hasValue && 'text-white/50'
            )}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
            id={id}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayText}
            {showRelativeTime && hasValue && value.from && (
              <Badge variant="secondary" className="ml-2 text-xs bg-gold/20 text-gold border-gold/30">
                <Clock className="w-3 h-3 mr-1" />
                {differenceInDays(new Date(), value.from)} days ago
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          className={cn(
            'w-auto p-0 bg-navy-900/95 border-gold/20 backdrop-blur-lg',
            popoverClassName
          )} 
          align="start"
        >
          <div className="flex">
            {/* Presets Sidebar */}
            {showPresets && (
              <div className="w-48 p-3 border-r border-gold/20 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-white">Presets</h4>
                  {hasValue && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      className="w-6 h-6 p-0 text-white/60 hover:text-white"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  {Object.entries(groupedPresets).map(([category, categoryPresets]) => (
                    <div key={category} className="space-y-1">
                      <div className="text-xs font-medium text-white/60 uppercase tracking-wide">
                        {category.replace('_', ' ')}
                      </div>
                      {categoryPresets.map(preset => (
                        <PresetButton
                          key={preset.id}
                          preset={preset}
                          isSelected={selectedPreset === preset.id}
                          onClick={() => handlePresetSelect(preset)}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Calendar */}
            <div className="p-3">
              <Calendar
                mode="range"
                selected={value.from && value.to ? { from: value.from, to: value.to } : undefined}
                onSelect={handleCalendarSelect}
                numberOfMonths={numberOfMonths}
                disabled={disabled}
                weekStartsOn={weekStartsOn}
                className={cn('text-white', calendarClassName)}
              />
              
              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gold/20 mt-3">
                <div className="text-xs text-white/60">
                  {hasValue ? displayText : 'No date selected'}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    disabled={!hasValue}
                    className="text-white/60 hover:text-white"
                  >
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    disabled={!hasValue}
                    className="bg-gold hover:bg-gold/80 text-navy-900"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Statistics Panel */}
          {showStatistics && hasValue && (
            <div className="border-t border-gold/20 p-3">
              <DateRangeStatistics range={value} />
            </div>
          )}
          
          {/* Comparison Panel */}
          {showComparison && comparisonRange && (
            <div className="border-t border-gold/20 p-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-white">Comparison</span>
              </div>
              <div className="text-xs text-white/60">
                Previous: {formatDateRange(comparisonRange, displayFormat)}
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}

// Preset configurations for financial use cases
export const FinancialDateRangePresets = {
  Trading: [
    ...DEFAULT_PRESETS,
    {
      id: 'tradingWeek',
      label: 'Trading Week',
      category: 'fiscal',
      range: () => {
        const now = new Date()
        const day = now.getDay()
        const mondayOffset = day === 0 ? -6 : 1 - day
        const monday = addDays(now, mondayOffset)
        return { from: monday, to: now }
      }
    },
    {
      id: 'monthToDate',
      label: 'Month to Date',
      category: 'fiscal',
      range: () => {
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth(), 1)
        return { from: start, to: now }
      }
    }
  ] as DateRangePreset[],
  
  Reporting: [
    ...DEFAULT_PRESETS.filter(p => p.category === 'fiscal'),
    {
      id: 'fyq1',
      label: 'FY Q1',
      category: 'fiscal',
      range: () => {
        const now = new Date()
        const fy = now.getMonth() >= 9 ? now.getFullYear() + 1 : now.getFullYear()
        return {
          from: new Date(fy - 1, 9, 1), // Oct 1
          to: new Date(fy - 1, 11, 31)  // Dec 31
        }
      }
    }
  ] as DateRangePreset[]
}