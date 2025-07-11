"use client"

/**
 * FieldRenderer - Dynamic Form Field Renderer
 * Maps field types to appropriate components with enhanced validation
 */

import React from 'react'
import { FieldValues, UseFormReturn } from 'react-hook-form'
import { FormField as FormFieldType, useFormComposer } from './FormComposer'
import { 
  CurrencyField,
  PercentageField,
  CryptoField,
  IBANField,
  MultiSelectField,
  RatingField,
  DateRangeField
} from './fields'
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
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { 
  CalendarIcon, 
  Upload, 
  X, 
  Check, 
  Search,
  Tag,
  FileText,
  Image as ImageIcon,
  PenTool,
  Eye,
  EyeOff
} from 'lucide-react'

interface FieldRendererProps {
  field: FormFieldType
  className?: string
}

// Standard text input
function TextFieldRenderer({ field, form }: { field: FormFieldType; form: UseFormReturn<any> }) {
  const [showPassword, setShowPassword] = React.useState(false)
  const isPassword = field.type === 'password'

  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel className="text-white font-medium">
            {field.label} {field.required && <span className="text-red-400">*</span>}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                {...formField}
                type={isPassword ? (showPassword ? 'text' : 'password') : field.type}
                placeholder={field.placeholder}
                disabled={field.disabled}
                className="bg-navy/50 border-gold/20 text-white placeholder:text-white/50 focus:border-gold"
                {...field.props}
              />
              {isPassword && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-white/50" />
                  ) : (
                    <Eye className="h-4 w-4 text-white/50" />
                  )}
                </Button>
              )}
            </div>
          </FormControl>
          {field.description && (
            <FormDescription className="text-white/60">{field.description}</FormDescription>
          )}
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  )
}

// Textarea field
function TextareaFieldRenderer({ field, form }: { field: FormFieldType; form: UseFormReturn<any> }) {
  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel className="text-white font-medium">
            {field.label} {field.required && <span className="text-red-400">*</span>}
          </FormLabel>
          <FormControl>
            <Textarea
              {...formField}
              placeholder={field.placeholder}
              disabled={field.disabled}
              className="bg-navy/50 border-gold/20 text-white placeholder:text-white/50 focus:border-gold resize-vertical min-h-[100px]"
              {...field.props}
            />
          </FormControl>
          {field.description && (
            <FormDescription className="text-white/60">{field.description}</FormDescription>
          )}
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  )
}

// Select field
function SelectFieldRenderer({ field, form }: { field: FormFieldType; form: UseFormReturn<any> }) {
  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel className="text-white font-medium">
            {field.label} {field.required && <span className="text-red-400">*</span>}
          </FormLabel>
          <Select onValueChange={formField.onChange} defaultValue={formField.value} disabled={field.disabled}>
            <FormControl>
              <SelectTrigger className="bg-navy/50 border-gold/20 text-white focus:border-gold">
                <SelectValue placeholder={field.placeholder || "Select an option"} />
              </SelectTrigger>
            </FormControl>
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
                    <div>
                      <div>{option.label}</div>
                      {option.description && (
                        <div className="text-xs text-white/60">{option.description}</div>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {field.description && (
            <FormDescription className="text-white/60">{field.description}</FormDescription>
          )}
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  )
}

// Radio group field
function RadioFieldRenderer({ field, form }: { field: FormFieldType; form: UseFormReturn<any> }) {
  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className="space-y-3">
          <FormLabel className="text-white font-medium">
            {field.label} {field.required && <span className="text-red-400">*</span>}
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={formField.onChange}
              defaultValue={formField.value}
              disabled={field.disabled}
              className="flex flex-col space-y-2"
            >
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={option.value} 
                    id={`${field.name}-${option.value}`}
                    disabled={option.disabled}
                    className="border-gold/30 text-gold"
                  />
                  <Label 
                    htmlFor={`${field.name}-${option.value}`}
                    className="text-white cursor-pointer flex items-center gap-2 flex-1"
                  >
                    {option.icon && <option.icon className="w-4 h-4" />}
                    <div>
                      <div>{option.label}</div>
                      {option.description && (
                        <div className="text-xs text-white/60">{option.description}</div>
                      )}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          {field.description && (
            <FormDescription className="text-white/60">{field.description}</FormDescription>
          )}
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  )
}

// Checkbox field
function CheckboxFieldRenderer({ field, form }: { field: FormFieldType; form: UseFormReturn<any> }) {
  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={formField.value}
              onCheckedChange={formField.onChange}
              disabled={field.disabled}
              className="border-gold/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="text-white font-medium cursor-pointer">
              {field.label} {field.required && <span className="text-red-400">*</span>}
            </FormLabel>
            {field.description && (
              <FormDescription className="text-white/60">{field.description}</FormDescription>
            )}
          </div>
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  )
}

// Toggle/Switch field
function ToggleFieldRenderer({ field, form }: { field: FormFieldType; form: UseFormReturn<any> }) {
  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gold/20 p-4 glass-morphism">
          <div className="space-y-0.5">
            <FormLabel className="text-white font-medium">
              {field.label} {field.required && <span className="text-red-400">*</span>}
            </FormLabel>
            {field.description && (
              <FormDescription className="text-white/60">{field.description}</FormDescription>
            )}
          </div>
          <FormControl>
            <Switch
              checked={formField.value}
              onCheckedChange={formField.onChange}
              disabled={field.disabled}
              className="data-[state=checked]:bg-gold"
            />
          </FormControl>
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  )
}

// Date field
function DateFieldRenderer({ field, form }: { field: FormFieldType; form: UseFormReturn<any> }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel className="text-white font-medium">
            {field.label} {field.required && <span className="text-red-400">*</span>}
          </FormLabel>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  disabled={field.disabled}
                  className={cn(
                    "w-full pl-3 text-left font-normal bg-navy/50 border-gold/20 text-white hover:bg-navy/70 hover:border-gold/40",
                    !formField.value && "text-white/50"
                  )}
                >
                  {formField.value ? (
                    format(formField.value, 'PPP')
                  ) : (
                    <span>{field.placeholder || "Pick a date"}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-navy/95 border-gold/20" align="start">
              <Calendar
                mode="single"
                selected={formField.value}
                onSelect={(date) => {
                  formField.onChange(date)
                  setIsOpen(false)
                }}
                disabled={(date) => field.props?.minDate && date < field.props.minDate}
                initialFocus
                className="text-white"
              />
            </PopoverContent>
          </Popover>
          {field.description && (
            <FormDescription className="text-white/60">{field.description}</FormDescription>
          )}
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  )
}

// Slider field
function SliderFieldRenderer({ field, form }: { field: FormFieldType; form: UseFormReturn<any> }) {
  const min = field.props?.min || 0
  const max = field.props?.max || 100
  const step = field.props?.step || 1

  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel className="text-white font-medium flex items-center justify-between">
            <span>
              {field.label} {field.required && <span className="text-red-400">*</span>}
            </span>
            <span className="text-sm text-gold font-medium">
              {formField.value || min}
            </span>
          </FormLabel>
          <FormControl>
            <Slider
              min={min}
              max={max}
              step={step}
              value={[formField.value || min]}
              onValueChange={(value) => formField.onChange(value[0])}
              disabled={field.disabled}
              className="w-full"
            />
          </FormControl>
          <div className="flex justify-between text-xs text-white/50">
            <span>{min}</span>
            <span>{max}</span>
          </div>
          {field.description && (
            <FormDescription className="text-white/60">{field.description}</FormDescription>
          )}
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  )
}

// Tags field
function TagsFieldRenderer({ field, form }: { field: FormFieldType; form: UseFormReturn<any> }) {
  const [inputValue, setInputValue] = React.useState('')

  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => {
        const tags = formField.value || []
        
        const addTag = (tag: string) => {
          const trimmedTag = tag.trim()
          if (trimmedTag && !tags.includes(trimmedTag)) {
            formField.onChange([...tags, trimmedTag])
            setInputValue('')
          }
        }

        const removeTag = (tagToRemove: string) => {
          formField.onChange(tags.filter((tag: string) => tag !== tagToRemove))
        }

        return (
          <FormItem>
            <FormLabel className="text-white font-medium">
              {field.label} {field.required && <span className="text-red-400">*</span>}
            </FormLabel>
            <FormControl>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTag(inputValue)
                        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
                          removeTag(tags[tags.length - 1])
                        }
                      }}
                      placeholder={field.placeholder || "Type and press Enter to add tags"}
                      disabled={field.disabled}
                      className="bg-navy/50 border-gold/20 text-white placeholder:text-white/50 focus:border-gold pl-10"
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addTag(inputValue)}
                    disabled={!inputValue.trim() || field.disabled}
                    className="border-gold/30 text-white hover:bg-gold/10"
                  >
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gold/20 text-gold border-gold/30 pr-1"
                      >
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1 hover:bg-gold/20"
                          onClick={() => removeTag(tag)}
                          disabled={field.disabled}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </FormControl>
            {field.description && (
              <FormDescription className="text-white/60">{field.description}</FormDescription>
            )}
            <FormMessage className="text-red-400" />
          </FormItem>
        )
      }}
    />
  )
}

// File upload field
function FileFieldRenderer({ field, form }: { field: FormFieldType; form: UseFormReturn<any> }) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const accept = field.type === 'image' ? 'image/*' : field.props?.accept || '*/*'
  const multiple = field.props?.multiple || false

  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => {
        const files = formField.value || []
        
        const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
          const selectedFiles = Array.from(event.target.files || [])
          if (multiple) {
            formField.onChange([...files, ...selectedFiles])
          } else {
            formField.onChange(selectedFiles[0] || null)
          }
        }

        const removeFile = (index: number) => {
          if (multiple) {
            const newFiles = files.filter((_: any, i: number) => i !== index)
            formField.onChange(newFiles)
          } else {
            formField.onChange(null)
          }
        }

        return (
          <FormItem>
            <FormLabel className="text-white font-medium">
              {field.label} {field.required && <span className="text-red-400">*</span>}
            </FormLabel>
            <FormControl>
              <div className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={field.disabled}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 border-2 border-dashed border-gold/30 bg-navy/20 hover:bg-navy/40 hover:border-gold/50 flex flex-col items-center justify-center gap-2"
                >
                  {field.type === 'image' ? (
                    <ImageIcon className="w-8 h-8 text-gold" />
                  ) : (
                    <Upload className="w-8 h-8 text-gold" />
                  )}
                  <div className="text-center">
                    <div className="text-white">
                      {field.placeholder || `Upload ${field.type === 'image' ? 'images' : 'files'}`}
                    </div>
                    <div className="text-xs text-white/60">
                      {multiple ? 'Select multiple files' : 'Select a file'}
                    </div>
                  </div>
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept={accept}
                  multiple={multiple}
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {(multiple ? files.length > 0 : files) && (
                  <div className="space-y-2">
                    {(multiple ? files : [files]).map((file: File, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-navy/50 border border-gold/20 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {field.type === 'image' ? (
                            <ImageIcon className="w-5 h-5 text-gold" />
                          ) : (
                            <FileText className="w-5 h-5 text-gold" />
                          )}
                          <div>
                            <div className="text-sm text-white font-medium">{file.name}</div>
                            <div className="text-xs text-white/60">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          disabled={field.disabled}
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FormControl>
            {field.description && (
              <FormDescription className="text-white/60">{field.description}</FormDescription>
            )}
            <FormMessage className="text-red-400" />
          </FormItem>
        )
      }}
    />
  )
}

// Main field renderer component
export function FieldRenderer({ field, className }: FieldRendererProps) {
  const { form, fieldStates } = useFormComposer()
  const fieldState = fieldStates[field.name]

  // Don't render if field is hidden
  if (!fieldState?.visible) {
    return null
  }

  // Apply field state
  const enhancedField = {
    ...field,
    disabled: field.disabled || !fieldState?.enabled,
    required: field.required || fieldState?.required
  }

  // Field type mapping
  const renderField = () => {
    switch (field.type) {
      case 'currency':
        return <CurrencyField 
          form={form} 
          name={field.name} 
          label={enhancedField.label}
          description={enhancedField.description}
          placeholder={enhancedField.placeholder}
          required={enhancedField.required}
          disabled={enhancedField.disabled}
          {...field.props} 
        />
      
      case 'percentage':
        return <PercentageField 
          form={form} 
          name={field.name}
          label={enhancedField.label}
          description={enhancedField.description}
          placeholder={enhancedField.placeholder}
          required={enhancedField.required}
          disabled={enhancedField.disabled}
          {...field.props} 
        />
      
      case 'crypto':
        return <CryptoField 
          form={form} 
          name={field.name}
          label={enhancedField.label}
          description={enhancedField.description}
          placeholder={enhancedField.placeholder}
          required={enhancedField.required}
          disabled={enhancedField.disabled}
          {...field.props} 
        />
      
      case 'iban':
        return <IBANField 
          form={form} 
          name={field.name}
          label={enhancedField.label}
          description={enhancedField.description}
          placeholder={enhancedField.placeholder}
          required={enhancedField.required}
          disabled={enhancedField.disabled}
          {...field.props} 
        />
      
      case 'multiselect':
        return <MultiSelectField 
          form={form} 
          name={field.name}
          label={enhancedField.label}
          description={enhancedField.description}
          placeholder={enhancedField.placeholder}
          required={enhancedField.required}
          disabled={enhancedField.disabled}
          options={field.options || []} 
          {...field.props} 
        />
      
      case 'rating':
        return <RatingField 
          form={form} 
          name={field.name}
          label={enhancedField.label}
          description={enhancedField.description}
          required={enhancedField.required}
          disabled={enhancedField.disabled}
          {...field.props} 
        />
      
      case 'daterange':
        return <DateRangeField 
          form={form} 
          name={field.name}
          label={enhancedField.label}
          description={enhancedField.description}
          placeholder={enhancedField.placeholder}
          required={enhancedField.required}
          disabled={enhancedField.disabled}
          {...field.props} 
        />
      
      case 'textarea':
        return <TextareaFieldRenderer field={enhancedField} form={form} />
      
      case 'select':
        return <SelectFieldRenderer field={enhancedField} form={form} />
      
      case 'radio':
        return <RadioFieldRenderer field={enhancedField} form={form} />
      
      case 'checkbox':
        return <CheckboxFieldRenderer field={enhancedField} form={form} />
      
      case 'toggle':
        return <ToggleFieldRenderer field={enhancedField} form={form} />
      
      case 'date':
      case 'datetime':
        return <DateFieldRenderer field={enhancedField} form={form} />
      
      case 'slider':
        return <SliderFieldRenderer field={enhancedField} form={form} />
      
      case 'tags':
        return <TagsFieldRenderer field={enhancedField} form={form} />
      
      case 'file':
      case 'image':
        return <FileFieldRenderer field={enhancedField} form={form} />
      
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'tel':
      case 'url':
      default:
        return <TextFieldRenderer field={enhancedField} form={form} />
    }
  }

  // Apply layout classes
  const getLayoutClasses = () => {
    const layout = field.layout
    if (!layout) return 'col-span-1'

    const widthClasses = {
      full: 'col-span-full',
      half: 'col-span-2',
      third: 'col-span-1',
      quarter: 'col-span-1'
    }

    return widthClasses[layout.width || 'full']
  }

  return (
    <div className={cn(getLayoutClasses(), className)}>
      {renderField()}
    </div>
  )
}