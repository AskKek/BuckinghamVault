"use client"

/**
 * Enterprise Numeric Input Component
 * High-precision numeric input for institutional financial data
 */

import React, { useState, useEffect, useMemo, forwardRef, useImperativeHandle, useRef } from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus, TrendingUp, TrendingDown, Calculator, DollarSign } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getThemeClasses } from '@/lib/theme'

export interface NumericInputProps {
  value?: number | null
  defaultValue?: number
  onChange?: (value: number | null) => void
  onValueChange?: (value: number | null, formatted: string) => void
  
  // Validation
  min?: number
  max?: number
  step?: number
  precision?: number
  required?: boolean
  
  // Formatting
  format?: 'number' | 'currency' | 'percentage' | 'basis-points' | 'custom'
  currency?: string
  locale?: string
  prefix?: string
  suffix?: string
  thousandsSeparator?: string
  decimalSeparator?: string
  customFormatter?: (value: number) => string
  customParser?: (text: string) => number | null
  
  // Behavior
  allowNegative?: boolean
  allowZero?: boolean
  selectOnFocus?: boolean
  incrementOnScroll?: boolean
  
  // UI
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outlined' | 'filled' | 'minimal'
  showControls?: boolean
  showIndicators?: boolean
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  
  // Financial features
  showComparison?: boolean
  comparisonValue?: number
  comparisonLabel?: string
  showTrend?: boolean
  trendDirection?: 'up' | 'down' | 'neutral'
  
  // Styling
  className?: string
  inputClassName?: string
  
  // Accessibility
  'aria-label'?: string
  'aria-describedby'?: string
  id?: string
  name?: string
}

export interface NumericInputRef {
  focus: () => void
  blur: () => void
  select: () => void
  getValue: () => number | null
  setValue: (value: number | null) => void
  getFormattedValue: () => string
}

export const NumericInput = forwardRef<NumericInputRef, NumericInputProps>(({
  value: controlledValue,
  defaultValue,
  onChange,
  onValueChange,
  
  // Validation
  min,
  max,
  step = 1,
  precision = 2,
  required = false,
  
  // Formatting
  format = 'number',
  currency = 'USD',
  locale = 'en-US',
  prefix,
  suffix,
  thousandsSeparator = ',',
  decimalSeparator = '.',
  customFormatter,
  customParser,
  
  // Behavior
  allowNegative = true,
  allowZero = true,
  selectOnFocus = true,
  incrementOnScroll = false,
  
  // UI
  size = 'md',
  variant = 'default',
  showControls = false,
  showIndicators = false,
  placeholder,
  disabled = false,
  readOnly = false,
  
  // Financial features
  showComparison = false,
  comparisonValue,
  comparisonLabel = 'vs previous',
  showTrend = false,
  trendDirection = 'neutral',
  
  // Styling
  className,
  inputClassName,
  
  // Accessibility
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  id,
  name
}, ref) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [internalValue, setInternalValue] = useState<number | null>(defaultValue ?? null)
  const [displayValue, setDisplayValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Use controlled or uncontrolled value
  const value = controlledValue !== undefined ? controlledValue : internalValue

  // Formatting functions
  const formatNumber = useMemo(() => {
    return (num: number | null): string => {
      if (num === null || num === undefined) return ''
      
      if (customFormatter) {
        return customFormatter(num)
      }
      
      switch (format) {
        case 'currency':
          return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
            minimumFractionDigits: precision,
            maximumFractionDigits: precision
          }).format(num)
          
        case 'percentage':
          return new Intl.NumberFormat(locale, {
            style: 'percent',
            minimumFractionDigits: precision,
            maximumFractionDigits: precision
          }).format(num / 100)
          
        case 'basis-points':
          return `${num.toFixed(precision)} bps`
          
        case 'custom':
          const formatted = num.toLocaleString(locale, {
            minimumFractionDigits: precision,
            maximumFractionDigits: precision
          })
          return `${prefix || ''}${formatted}${suffix || ''}`
          
        default:
          return num.toLocaleString(locale, {
            minimumFractionDigits: precision,
            maximumFractionDigits: precision
          })
      }
    }
  }, [format, currency, locale, precision, prefix, suffix, customFormatter])

  const parseNumber = useMemo(() => {
    return (text: string): number | null => {
      if (!text || text.trim() === '') return null
      
      if (customParser) {
        return customParser(text)
      }
      
      // Remove formatting characters but preserve decimal separator
      let cleanText = text
        .replace(new RegExp(`\\${thousandsSeparator}`, 'g'), '')
        .replace(/[^\d\-+.]/g, '')
      
      // Handle different decimal separators
      if (decimalSeparator !== '.') {
        cleanText = cleanText.replace(decimalSeparator, '.')
      }
      
      const parsed = parseFloat(cleanText)
      return isNaN(parsed) ? null : parsed
    }
  }, [thousandsSeparator, decimalSeparator, customParser])

  // Validation
  const validateValue = useMemo(() => {
    return (val: number | null): boolean => {
      if (val === null) return !required
      if (!allowNegative && val < 0) return false
      if (!allowZero && val === 0) return false
      if (min !== undefined && val < min) return false
      if (max !== undefined && val > max) return false
      return true
    }
  }, [required, allowNegative, allowZero, min, max])

  // Update display value when value changes
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatNumber(value))
    }
  }, [value, formatNumber, isFocused])

  // Handle value changes
  const handleValueChange = (newValue: number | null) => {
    const isValid = validateValue(newValue)
    setHasError(!isValid)
    
    if (controlledValue === undefined) {
      setInternalValue(newValue)
    }
    
    onChange?.(newValue)
    onValueChange?.(newValue, formatNumber(newValue))
  }

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setDisplayValue(inputValue)
    
    const parsedValue = parseNumber(inputValue)
    handleValueChange(parsedValue)
  }

  // Handle increment/decrement
  const handleIncrement = () => {
    const currentValue = value || 0
    const newValue = currentValue + step
    handleValueChange(newValue)
  }

  const handleDecrement = () => {
    const currentValue = value || 0
    const newValue = currentValue - step
    handleValueChange(newValue)
  }

  // Handle focus/blur
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    if (selectOnFocus) {
      e.target.select()
    }
    // Show raw number for editing
    setDisplayValue(value?.toString() || '')
  }

  const handleBlur = () => {
    setIsFocused(false)
    // Format the display value
    setDisplayValue(formatNumber(value))
  }

  // Handle scroll increment
  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    if (!incrementOnScroll || disabled || readOnly) return
    
    e.preventDefault()
    if (e.deltaY < 0) {
      handleIncrement()
    } else {
      handleDecrement()
    }
  }

  // Imperative API
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
    select: () => inputRef.current?.select(),
    getValue: () => value,
    setValue: handleValueChange,
    getFormattedValue: () => formatNumber(value)
  }))

  // Calculate comparison
  const comparisonDiff = useMemo(() => {
    if (!showComparison || !comparisonValue || value === null) return null
    
    const diff = value - comparisonValue
    const percentage = (diff / comparisonValue) * 100
    
    return {
      absolute: diff,
      percentage,
      isPositive: diff > 0,
      isNegative: diff < 0,
      isNeutral: diff === 0
    }
  }, [value, comparisonValue, showComparison])

  // Size variants
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-3 text-base',
    lg: 'h-12 px-4 text-lg'
  }

  // Variant classes
  const variantClasses = {
    default: 'bg-navy-800/60 border border-gold/20 text-white placeholder:text-white/50 focus:border-gold',
    outlined: 'bg-transparent border-2 border-gold/30 text-white placeholder:text-white/50 focus:border-gold',
    filled: 'bg-navy-700 border border-transparent text-white placeholder:text-white/50 focus:bg-navy-600',
    minimal: 'bg-transparent border-none text-white placeholder:text-white/50 focus:bg-navy-800/30'
  }

  return (
    <div className={cn('relative', className)}>
      <div className="flex items-center gap-2">
        {/* Decrement Button */}
        {showControls && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDecrement}
            disabled={disabled || readOnly || (min !== undefined && (value || 0) <= min)}
            className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
          >
            <Minus className="w-4 h-4" />
          </Button>
        )}

        {/* Input Field */}
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            value={displayValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onWheel={handleWheel}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
            id={id}
            name={name}
            className={cn(
              sizeClasses[size],
              variantClasses[variant],
              hasError && 'border-red-500 focus:border-red-500',
              showControls && 'text-center',
              inputClassName
            )}
          />

          {/* Format Indicator */}
          {showIndicators && format !== 'number' && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Badge variant="secondary" className="text-xs bg-gold/20 text-gold border-gold/30">
                {format === 'currency' && <DollarSign className="w-3 h-3" />}
                {format === 'percentage' && '%'}
                {format === 'basis-points' && 'bps'}
                {format === 'custom' && <Calculator className="w-3 h-3" />}
              </Badge>
            </div>
          )}

          {/* Trend Indicator */}
          {showTrend && (
            <div className="absolute left-2 top-1/2 -translate-y-1/2">
              {trendDirection === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
              {trendDirection === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
            </div>
          )}
        </div>

        {/* Increment Button */}
        {showControls && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleIncrement}
            disabled={disabled || readOnly || (max !== undefined && (value || 0) >= max)}
            className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
          >
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Comparison Display */}
      {showComparison && comparisonDiff && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 flex items-center gap-2 text-xs"
        >
          <span className="text-white/60">{comparisonLabel}:</span>
          <Badge
            variant="secondary"
            className={cn(
              "text-xs",
              comparisonDiff.isPositive && "bg-green-500/20 text-green-400 border-green-500/30",
              comparisonDiff.isNegative && "bg-red-500/20 text-red-400 border-red-500/30",
              comparisonDiff.isNeutral && "bg-gray-500/20 text-gray-400 border-gray-500/30"
            )}
          >
            {comparisonDiff.isPositive && '+'}
            {formatNumber(comparisonDiff.absolute)} ({comparisonDiff.percentage.toFixed(2)}%)
          </Badge>
        </motion.div>
      )}

      {/* Error Message */}
      {hasError && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-xs text-red-400"
        >
          {!allowNegative && (value || 0) < 0 && "Negative values not allowed"}
          {!allowZero && value === 0 && "Zero value not allowed"}
          {min !== undefined && (value || 0) < min && `Minimum value is ${formatNumber(min)}`}
          {max !== undefined && (value || 0) > max && `Maximum value is ${formatNumber(max)}`}
          {required && value === null && "This field is required"}
        </motion.div>
      )}
    </div>
  )
})

NumericInput.displayName = 'NumericInput'

// Preset configurations for common financial use cases
export const FinancialNumericInput = {
  Currency: (props: Partial<NumericInputProps>) => (
    <NumericInput
      format="currency"
      precision={2}
      showIndicators
      showControls
      min={0}
      {...props}
    />
  ),
  
  Percentage: (props: Partial<NumericInputProps>) => (
    <NumericInput
      format="percentage" 
      precision={2}
      showIndicators
      min={0}
      max={100}
      suffix="%"
      {...props}
    />
  ),
  
  BasisPoints: (props: Partial<NumericInputProps>) => (
    <NumericInput
      format="basis-points"
      precision={0}
      showIndicators
      step={1}
      {...props}
    />
  ),
  
  Price: (props: Partial<NumericInputProps>) => (
    <NumericInput
      format="currency"
      precision={2}
      showIndicators
      showTrend
      showComparison
      min={0}
      {...props}
    />
  ),
  
  Quantity: (props: Partial<NumericInputProps>) => (
    <NumericInput
      format="number"
      precision={0}
      showControls
      min={0}
      step={1}
      {...props}
    />
  )
}