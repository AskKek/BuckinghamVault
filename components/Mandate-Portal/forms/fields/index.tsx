"use client"

/**
 * Financial Field Components
 * Specialized form fields for institutional financial platforms
 */

import React from 'react'
import { UseFormReturn, FieldPath, FieldValues } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { 
  CalendarIcon, 
  Upload, 
  X, 
  Check, 
  ChevronDown,
  DollarSign,
  Percent,
  Bitcoin,
  Building2,
  CreditCard,
  Star,
  Search
} from 'lucide-react'

// Base field props
interface BaseFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>
  name: FieldPath<T>
  label: string
  description?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

// Currency field for precise financial amounts
interface CurrencyFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  currency?: string
  showSymbol?: boolean
  precision?: number
  min?: number
  max?: number
  locale?: string
}

export function CurrencyField<T extends FieldValues>({
  form,
  name,
  label,
  description,
  placeholder,
  required,
  disabled,
  className,
  currency = 'USD',
  showSymbol = true,
  precision = 2,
  min,
  max,
  locale = 'en-US'
}: CurrencyFieldProps<T>) {
  const formatCurrency = (value: number) => {
    if (isNaN(value)) return ''
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: precision,
      maximumFractionDigits: precision
    }).format(value)
  }

  const parseCurrency = (value: string) => {
    // Remove currency symbols and formatting
    const cleanValue = value.replace(/[^0-9.-]/g, '')
    const parsed = parseFloat(cleanValue)
    return isNaN(parsed) ? 0 : parsed
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="text-white font-medium">
            {label} {required && <span className="text-red-400">*</span>}
          </FormLabel>
          <FormControl>
            <div className="relative">
              {showSymbol && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-gold" />
                  <span className="text-sm text-white/70 font-medium">{currency}</span>
                </div>
              )}
              <Input
                {...field}
                type="text"
                placeholder={placeholder || formatCurrency(0)}
                disabled={disabled}
                className={cn(
                  "bg-navy/50 border-gold/20 text-white placeholder:text-white/50 focus:border-gold text-right",
                  showSymbol && "pl-16"
                )}
                value={field.value ? formatCurrency(field.value) : ''}
                onChange={(e) => {
                  const parsed = parseCurrency(e.target.value)
                  if (min !== undefined && parsed < min) return
                  if (max !== undefined && parsed > max) return
                  field.onChange(parsed)
                }}
                onBlur={(e) => {
                  const parsed = parseCurrency(e.target.value)
                  field.onChange(parsed)
                }}
              />
            </div>
          </FormControl>
          {description && (
            <FormDescription className="text-white/60">{description}</FormDescription>
          )}
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  )
}

// Percentage field with precise decimal handling
interface PercentageFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  precision?: number
  min?: number
  max?: number
  showSymbol?: boolean
}

export function PercentageField<T extends FieldValues>({
  form,
  name,
  label,
  description,
  placeholder,
  required,
  disabled,
  className,
  precision = 2,
  min = 0,
  max = 100,
  showSymbol = true
}: PercentageFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="text-white font-medium">
            {label} {required && <span className="text-red-400">*</span>}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                type="number"
                step={1 / Math.pow(10, precision)}
                min={min}
                max={max}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(
                  "bg-navy/50 border-gold/20 text-white placeholder:text-white/50 focus:border-gold text-right",
                  showSymbol && "pr-12"
                )}
                onChange={(e) => {
                  const value = parseFloat(e.target.value)
                  field.onChange(isNaN(value) ? 0 : value)
                }}
              />
              {showSymbol && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Percent className="w-4 h-4 text-gold" />
                </div>
              )}
            </div>
          </FormControl>
          {description && (
            <FormDescription className="text-white/60">{description}</FormDescription>
          )}
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  )
}

// Crypto address field with validation
interface CryptoFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  cryptoType?: 'BTC' | 'ETH' | 'USDT' | 'USDC' | 'generic'
  showQRCode?: boolean
}

export function CryptoField<T extends FieldValues>({
  form,
  name,
  label,
  description,
  placeholder,
  required,
  disabled,
  className,
  cryptoType = 'generic'
}: CryptoFieldProps<T>) {
  const validateCryptoAddress = (address: string) => {
    if (!address) return true
    
    // Basic validation patterns
    const patterns = {
      BTC: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
      ETH: /^0x[a-fA-F0-9]{40}$/,
      USDT: /^0x[a-fA-F0-9]{40}$/, // ERC-20
      USDC: /^0x[a-fA-F0-9]{40}$/, // ERC-20
      generic: /^[a-zA-Z0-9]{26,62}$/
    }
    
    return patterns[cryptoType]?.test(address) || cryptoType === 'generic'
  }

  const getCryptoIcon = () => {
    switch (cryptoType) {
      case 'BTC':
        return <Bitcoin className="w-4 h-4 text-orange-400" />
      case 'ETH':
        return <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full" />
      default:
        return <CreditCard className="w-4 h-4 text-gold" />
    }
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="text-white font-medium">
            {label} {required && <span className="text-red-400">*</span>}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                {getCryptoIcon()}
              </div>
              <Input
                {...field}
                type="text"
                placeholder={placeholder || `Enter ${cryptoType} address`}
                disabled={disabled}
                className={cn(
                  "bg-navy/50 border-gold/20 text-white placeholder:text-white/50 focus:border-gold pl-10 font-mono text-sm",
                  !validateCryptoAddress(field.value) && field.value && "border-red-400"
                )}
              />
              {field.value && validateCryptoAddress(field.value) && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Check className="w-4 h-4 text-green-400" />
                </div>
              )}
            </div>
          </FormControl>
          {description && (
            <FormDescription className="text-white/60">{description}</FormDescription>
          )}
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  )
}

// IBAN field with validation
interface IBANFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  country?: string
}

export function IBANField<T extends FieldValues>({
  form,
  name,
  label,
  description,
  placeholder,
  required,
  disabled,
  className,
  country
}: IBANFieldProps<T>) {
  const validateIBAN = (iban: string) => {
    if (!iban) return true
    
    // Remove spaces and convert to uppercase
    const cleanIBAN = iban.replace(/\s/g, '').toUpperCase()
    
    // Basic IBAN pattern (2 letters + 2 digits + up to 30 alphanumeric)
    const ibanPattern = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/
    
    return ibanPattern.test(cleanIBAN)
  }

  const formatIBAN = (value: string) => {
    // Remove spaces and format in groups of 4
    const clean = value.replace(/\s/g, '').toUpperCase()
    return clean.replace(/(.{4})/g, '$1 ').trim()
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="text-white font-medium">
            {label} {required && <span className="text-red-400">*</span>}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Building2 className="w-4 h-4 text-gold" />
              </div>
              <Input
                {...field}
                type="text"
                placeholder={placeholder || "GB29 NWBK 6016 1331 9268 19"}
                disabled={disabled}
                className={cn(
                  "bg-navy/50 border-gold/20 text-white placeholder:text-white/50 focus:border-gold pl-10 font-mono text-sm",
                  !validateIBAN(field.value) && field.value && "border-red-400"
                )}
                value={field.value ? formatIBAN(field.value) : ''}
                onChange={(e) => {
                  const formatted = formatIBAN(e.target.value)
                  field.onChange(formatted)
                }}
                maxLength={34} // Max IBAN length with spaces
              />
              {field.value && validateIBAN(field.value) && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Check className="w-4 h-4 text-green-400" />
                </div>
              )}
            </div>
          </FormControl>
          {description && (
            <FormDescription className="text-white/60">{description}</FormDescription>
          )}
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  )
}

// Enhanced multi-select with search
interface MultiSelectFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  options: Array<{ value: any; label: string; description?: string }>
  searchable?: boolean
  maxSelections?: number
}

export function MultiSelectField<T extends FieldValues>({
  form,
  name,
  label,
  description,
  placeholder,
  required,
  disabled,
  className,
  options,
  searchable = true,
  maxSelections
}: MultiSelectFieldProps<T>) {
  const [search, setSearch] = React.useState('')
  const [isOpen, setIsOpen] = React.useState(false)

  const filteredOptions = React.useMemo(() => {
    if (!search) return options
    return options.filter(option =>
      option.label.toLowerCase().includes(search.toLowerCase()) ||
      option.description?.toLowerCase().includes(search.toLowerCase())
    )
  }, [options, search])

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const selectedValues = field.value || []
        
        return (
          <FormItem className={className}>
            <FormLabel className="text-white font-medium">
              {label} {required && <span className="text-red-400">*</span>}
            </FormLabel>
            <FormControl>
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isOpen}
                    disabled={disabled}
                    className="w-full justify-between bg-navy/50 border-gold/20 text-white hover:bg-navy/70 hover:border-gold/40"
                  >
                    <div className="flex flex-wrap gap-1 max-w-[80%]">
                      {(selectedValues as any[]).length === 0 ? (
                        <span className="text-white/50">{placeholder || "Select options..."}</span>
                      ) : (
                        (selectedValues as any[]).map((value: any) => {
                          const option = options.find(opt => opt.value === value)
                          return (
                            <Badge
                              key={value}
                              variant="secondary"
                              className="bg-gold/20 text-gold border-gold/30 text-xs"
                            >
                              {option?.label || value}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 ml-1 hover:bg-gold/20"
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation()
                                  const newValues = (selectedValues as any[]).filter((v: any) => v !== value)
                                  field.onChange(newValues)
                                }}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </Badge>
                          )
                        })
                      )}
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-navy/95 border-gold/20" align="start">
                  {searchable && (
                    <div className="flex items-center border-b border-gold/20 px-3">
                      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-white/50" />
                      <input
                        placeholder="Search options..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-white/50 text-white"
                      />
                    </div>
                  )}
                  <div className="max-h-60 overflow-auto">
                    {filteredOptions.map((option) => {
                      const isSelected = (selectedValues as any[]).includes(option.value)
                      const canSelect = !maxSelections || (selectedValues as any[]).length < maxSelections || isSelected
                      
                      return (
                        <div
                          key={option.value}
                          className={cn(
                            "relative flex cursor-pointer select-none items-center py-2 px-3 text-sm text-white hover:bg-gold/10",
                            !canSelect && "opacity-50 cursor-not-allowed"
                          )}
                          onClick={() => {
                            if (!canSelect) return
                            
                            const newValues = isSelected
                              ? (selectedValues as any[]).filter((v: any) => v !== option.value)
                              : [...(selectedValues as any[]), option.value]
                            field.onChange(newValues)
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <Checkbox checked={isSelected} />
                            <div>
                              <div className="font-medium">{option.label}</div>
                              {option.description && (
                                <div className="text-xs text-white/60">{option.description}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            </FormControl>
            {description && (
              <FormDescription className="text-white/60">{description}</FormDescription>
            )}
            {maxSelections && (
              <FormDescription className="text-white/60">
                Maximum {maxSelections} selections ({(selectedValues as any[]).length} selected)
              </FormDescription>
            )}
            <FormMessage className="text-red-400" />
          </FormItem>
        )
      }}
    />
  )
}

// Rating field with stars
interface RatingFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  maxRating?: number
  allowHalf?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function RatingField<T extends FieldValues>({
  form,
  name,
  label,
  description,
  required,
  disabled,
  className,
  maxRating = 5,
  allowHalf = false,
  size = 'md'
}: RatingFieldProps<T>) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="text-white font-medium">
            {label} {required && <span className="text-red-400">*</span>}
          </FormLabel>
          <FormControl>
            <div className="flex items-center gap-1">
              {Array.from({ length: maxRating }, (_, index) => {
                const ratingValue = index + 1
                const isActive = field.value >= ratingValue
                const isHalfActive = allowHalf && field.value >= ratingValue - 0.5 && field.value < ratingValue
                
                return (
                  <button
                    key={index}
                    type="button"
                    disabled={disabled}
                    className={cn(
                      "transition-colors hover:scale-110",
                      disabled && "cursor-not-allowed opacity-50"
                    )}
                    onClick={() => {
                      if (allowHalf) {
                        // Toggle between 0, 0.5, and 1 for this star
                        if (field.value === ratingValue) {
                          field.onChange(ratingValue - 0.5)
                        } else if (field.value === ratingValue - 0.5) {
                          field.onChange(0)
                        } else {
                          field.onChange(ratingValue)
                        }
                      } else {
                        field.onChange(field.value === ratingValue ? 0 : ratingValue)
                      }
                    }}
                  >
                    <Star
                      className={cn(
                        sizeClasses[size],
                        isActive ? "fill-gold text-gold" : 
                        isHalfActive ? "fill-gold/50 text-gold" : 
                        "text-white/30 hover:text-gold/50"
                      )}
                    />
                  </button>
                )
              })}
              {field.value > 0 && (
                <span className="ml-2 text-sm text-white/70">
                  {field.value}/{maxRating}
                </span>
              )}
            </div>
          </FormControl>
          {description && (
            <FormDescription className="text-white/60">{description}</FormDescription>
          )}
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  )
}

// Date range picker
interface DateRangeFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  minDate?: Date
  maxDate?: Date
  presets?: Array<{ label: string; value: [Date, Date] }>
}

export function DateRangeField<T extends FieldValues>({
  form,
  name,
  label,
  description,
  placeholder,
  required,
  disabled,
  className,
  minDate,
  maxDate,
  presets
}: DateRangeFieldProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const [startDate, endDate] = field.value || [null, null]
        
        return (
          <FormItem className={className}>
            <FormLabel className="text-white font-medium">
              {label} {required && <span className="text-red-400">*</span>}
            </FormLabel>
            <FormControl>
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
                      `${format(startDate, 'MMM dd, yyyy')} - ${format(endDate, 'MMM dd, yyyy')}`
                    ) : (
                      placeholder || "Select date range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-navy/95 border-gold/20" align="start">
                  <div className="p-4 space-y-4">
                    {presets && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-white">Quick Select</div>
                        <div className="grid grid-cols-2 gap-2">
                          {presets.map((preset, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs border-gold/20 text-white hover:bg-gold/10"
                              onClick={() => {
                                field.onChange(preset.value)
                                setIsOpen(false)
                              }}
                            >
                              {preset.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    <Calendar
                      mode="range"
                      selected={startDate && endDate ? { from: startDate, to: endDate } : undefined}
                      onSelect={(range) => {
                        field.onChange([range?.from || null, range?.to || null])
                      }}
                      disabled={(date) => {
                        if (minDate && date < minDate) return true
                        if (maxDate && date > maxDate) return true
                        return false
                      }}
                      numberOfMonths={2}
                      className="text-white"
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </FormControl>
            {description && (
              <FormDescription className="text-white/60">{description}</FormDescription>
            )}
            <FormMessage className="text-red-400" />
          </FormItem>
        )
      }}
    />
  )
}

// Export all field components
export {
  type BaseFieldProps,
  type CurrencyFieldProps,
  type PercentageFieldProps,
  type CryptoFieldProps,
  type IBANFieldProps,
  type MultiSelectFieldProps,
  type RatingFieldProps,
  type DateRangeFieldProps
}