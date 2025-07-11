"use client"

/**
 * FormComposer - Advanced Form Composition System
 * Enterprise-grade form builder with financial domain specialization
 */

import React, { useEffect, useCallback, useMemo, useRef } from 'react'
import { useForm, FieldValues, UseFormReturn, DefaultValues, UseFormProps } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { nanoid } from 'nanoid'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FeatureCard } from '@/components/shared/FeatureCard'
import { FieldRenderer } from './FieldRenderer'
import { useBuckinghamStore } from '@/lib/store'
import { useNotifications } from '@/lib/store'
import { cn } from '@/lib/utils'
import { 
  Save, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Eye,
  EyeOff 
} from 'lucide-react'

// Core form composition interfaces
export interface FormField {
  id: string
  name: string
  type: FormFieldType
  label: string
  description?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  hidden?: boolean
  validation?: z.ZodSchema
  defaultValue?: any
  options?: FormFieldOption[]
  props?: Record<string, any>
  dependencies?: FormFieldDependency[]
  layout?: FormFieldLayout
  section?: string
  permissions?: string[]
}

export interface FormFieldOption {
  value: any
  label: string
  description?: string
  disabled?: boolean
  icon?: React.ComponentType<{ className?: string }>
}

export interface FormFieldDependency {
  field: string
  condition: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'
  value: any
  action: 'show' | 'hide' | 'enable' | 'disable' | 'require'
}

export interface FormFieldLayout {
  width?: 'full' | 'half' | 'third' | 'quarter'
  order?: number
  breakpoints?: {
    sm?: 'full' | 'half' | 'third' | 'quarter'
    md?: 'full' | 'half' | 'third' | 'quarter'
    lg?: 'full' | 'half' | 'third' | 'quarter'
  }
}

export interface FormSection {
  id: string
  title: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  collapsible?: boolean
  defaultCollapsed?: boolean
  validation?: z.ZodSchema
  permissions?: string[]
}

export interface FormStep {
  id: string
  title: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  sections: string[]
  validation?: z.ZodSchema
  skippable?: boolean
  permissions?: string[]
  onEnter?: (data: FieldValues) => Promise<void> | void
  onExit?: (data: FieldValues) => Promise<boolean> | boolean
}

export interface FormAutosave {
  enabled: boolean
  interval?: number // milliseconds
  key: string
  version?: string
  onSave?: (data: FieldValues) => Promise<void> | void
  onRestore?: (data: FieldValues) => void
}

export interface FormComposerConfig<T extends FieldValues = FieldValues> {
  id: string
  title: string
  description?: string
  schema: z.ZodSchema
  fields: FormField[]
  sections?: FormSection[]
  steps?: FormStep[]
  defaultValues?: DefaultValues<T>
  autosave?: FormAutosave
  submitBehavior?: 'submit' | 'draft' | 'both'
  layout?: 'single' | 'stepped' | 'wizard'
  variant?: 'default' | 'compact' | 'luxury'
  permissions?: string[]
  onSubmit?: (data: T) => Promise<void> | void
  onDraft?: (data: T) => Promise<void> | void
  onValidationError?: (errors: any) => void
  className?: string
}

export type FormFieldType = 
  | 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  | 'textarea' | 'select' | 'multiselect' | 'radio' | 'checkbox'
  | 'date' | 'datetime' | 'time' | 'daterange'
  | 'currency' | 'percentage' | 'crypto' | 'iban' | 'swift'
  | 'file' | 'image' | 'signature' | 'search'
  | 'slider' | 'rating' | 'toggle' | 'tags'
  | 'custom'

interface FormComposerProps<T extends FieldValues = FieldValues> 
  extends Omit<UseFormProps<T>, 'resolver' | 'defaultValues'> {
  config: FormComposerConfig<T>
  className?: string
}

// Form context for advanced field communication
interface FormComposerContextValue {
  form: UseFormReturn<any>
  config: FormComposerConfig<any>
  currentStep?: number
  isSubmitting: boolean
  isDirty: boolean
  autosaveStatus: 'idle' | 'saving' | 'saved' | 'error'
  fieldStates: Record<string, FormFieldState>
  updateFieldState: (fieldName: string, state: Partial<FormFieldState>) => void
}

interface FormFieldState {
  visible: boolean
  enabled: boolean
  required: boolean
  touched: boolean
  dirty: boolean
}

const FormComposerContext = React.createContext<FormComposerContextValue | null>(null)

export const useFormComposer = () => {
  const context = React.useContext(FormComposerContext)
  if (!context) {
    throw new Error('useFormComposer must be used within FormComposer')
  }
  return context
}

export function FormComposer<T extends FieldValues = FieldValues>({
  config,
  className,
  ...formProps
}: FormComposerProps<T>) {
  const { actions: formActions } = useBuckinghamStore((state) => ({
    actions: state.actions.forms
  }))
  const { actions: notificationActions } = useNotifications()
  
  // Form setup with schema validation
  const form = useForm<T>({
    resolver: zodResolver(config.schema),
    defaultValues: config.defaultValues,
    mode: 'onChange',
    ...formProps
  })

  // Form state management
  const [currentStep, setCurrentStep] = React.useState(0)
  const [autosaveStatus, setAutosaveStatus] = React.useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [fieldStates, setFieldStates] = React.useState<Record<string, FormFieldState>>({})
  const autosaveTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const formId = useRef(config.id || nanoid())

  // Initialize field states
  useEffect(() => {
    const initialStates: Record<string, FormFieldState> = {}
    config.fields.forEach(field => {
      initialStates[field.name] = {
        visible: !field.hidden,
        enabled: !field.disabled,
        required: field.required || false,
        touched: false,
        dirty: false
      }
    })
    setFieldStates(initialStates)
  }, [config.fields])

  // Update field state helper
  const updateFieldState = useCallback((fieldName: string, state: Partial<FormFieldState>) => {
    setFieldStates(prev => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], ...state }
    }))
  }, [])

  // Autosave functionality
  const performAutosave = useCallback(async () => {
    if (!config.autosave?.enabled) return

    try {
      setAutosaveStatus('saving')
      const data = form.getValues()
      
      // Save to Zustand store
      formActions.updateFormData(formId.current, data)
      
      // Save to localStorage as backup
      if (config.autosave.key) {
        localStorage.setItem(
          `form-draft-${config.autosave.key}`,
          JSON.stringify({
            data,
            timestamp: new Date().toISOString(),
            version: config.autosave.version || '1.0'
          })
        )
      }

      // Custom save handler
      if (config.autosave.onSave) {
        await config.autosave.onSave(data)
      }

      setAutosaveStatus('saved')
      
      // Reset status after delay
      setTimeout(() => setAutosaveStatus('idle'), 2000)
      
    } catch (error) {
      console.error('Autosave failed:', error)
      setAutosaveStatus('error')
      
      notificationActions.addNotification({
        type: 'warning',
        title: 'Draft save failed',
        message: 'Your progress could not be saved automatically',
        isRead: false
      })
    }
  }, [config.autosave, form, formActions, notificationActions])

  // Watch form changes for autosave
  const watchedValues = form.watch()
  useEffect(() => {
    if (!config.autosave?.enabled) return

    // Clear existing timer
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current)
    }

    // Set new timer
    autosaveTimerRef.current = setTimeout(
      performAutosave,
      config.autosave.interval || 3000
    )

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current)
      }
    }
  }, [watchedValues, performAutosave, config.autosave])

  // Restore draft data on mount
  useEffect(() => {
    if (!config.autosave?.enabled || !config.autosave.key) return

    try {
      const saved = localStorage.getItem(`form-draft-${config.autosave.key}`)
      if (saved) {
        const { data, version } = JSON.parse(saved)
        
        // Check version compatibility
        if (!config.autosave.version || version === config.autosave.version) {
          form.reset(data)
          
          if (config.autosave.onRestore) {
            config.autosave.onRestore(data)
          }

          notificationActions.addNotification({
            type: 'info',
            title: 'Draft restored',
            message: 'Your previous progress has been restored',
            isRead: false
          })
        }
      }
    } catch (error) {
      console.error('Failed to restore draft:', error)
    }
  }, [])

  // Handle field dependencies
  useEffect(() => {
    config.fields.forEach(field => {
      if (!field.dependencies?.length) return

      field.dependencies.forEach(dep => {
        const depValue = form.watch(dep.field as any)
        const currentState = fieldStates[field.name]
        
        if (!currentState) return

        let shouldApplyAction = false
        
        switch (dep.condition) {
          case 'equals':
            shouldApplyAction = depValue === dep.value
            break
          case 'not_equals':
            shouldApplyAction = depValue !== dep.value
            break
          case 'contains':
            shouldApplyAction = Array.isArray(depValue) && depValue.includes(dep.value)
            break
          case 'greater_than':
            shouldApplyAction = Number(depValue) > Number(dep.value)
            break
          case 'less_than':
            shouldApplyAction = Number(depValue) < Number(dep.value)
            break
        }

        if (shouldApplyAction) {
          const newState: Partial<FormFieldState> = {}
          
          switch (dep.action) {
            case 'show':
              newState.visible = true
              break
            case 'hide':
              newState.visible = false
              break
            case 'enable':
              newState.enabled = true
              break
            case 'disable':
              newState.enabled = false
              break
            case 'require':
              newState.required = true
              break
          }
          
          updateFieldState(field.name, newState)
        }
      })
    })
  }, [watchedValues, fieldStates, config.fields, form.watch, updateFieldState])

  // Submit handlers
  const handleSubmit = async (data: T) => {
    try {
      formActions.setFormSubmitting(true)
      
      if (config.onSubmit) {
        await config.onSubmit(data)
      }

      // Clear draft data on successful submit
      if (config.autosave?.key) {
        localStorage.removeItem(`form-draft-${config.autosave.key}`)
      }

      notificationActions.addNotification({
        type: 'success',
        title: 'Form submitted successfully',
        message: 'Your information has been saved',
        isRead: false
      })

    } catch (error) {
      console.error('Form submission failed:', error)
      
      notificationActions.addNotification({
        type: 'error',
        title: 'Submission failed',
        message: error instanceof Error ? error.message : 'Please try again',
        isRead: false
      })
    } finally {
      formActions.setFormSubmitting(false)
    }
  }

  const handleDraft = async (data: T) => {
    try {
      if (config.onDraft) {
        await config.onDraft(data)
      }

      notificationActions.addNotification({
        type: 'info',
        title: 'Draft saved',
        message: 'Your progress has been saved',
        isRead: false
      })

    } catch (error) {
      console.error('Draft save failed:', error)
      
      notificationActions.addNotification({
        type: 'error',
        title: 'Draft save failed',
        message: 'Please try again',
        isRead: false
      })
    }
  }

  // Context value
  const contextValue: FormComposerContextValue = useMemo(() => ({
    form,
    config,
    currentStep,
    isSubmitting: form.formState.isSubmitting,
    isDirty: form.formState.isDirty,
    autosaveStatus,
    fieldStates,
    updateFieldState
  }), [form, config, currentStep, autosaveStatus, fieldStates, updateFieldState])

  // Render autosave status
  const renderAutosaveStatus = () => {
    if (!config.autosave?.enabled) return null

    const statusConfig = {
      idle: { icon: Clock, text: 'Auto-save enabled', className: 'text-white/50' },
      saving: { icon: Clock, text: 'Saving...', className: 'text-blue-400 animate-pulse' },
      saved: { icon: CheckCircle, text: 'Saved', className: 'text-green-400' },
      error: { icon: AlertTriangle, text: 'Save failed', className: 'text-red-400' }
    }

    const { icon: Icon, text, className } = statusConfig[autosaveStatus]

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 text-xs"
      >
        <Icon className={cn("w-3 h-3", className)} />
        <span className={className}>{text}</span>
      </motion.div>
    )
  }

  return (
    <FormComposerContext.Provider value={contextValue}>
      <div className={cn("space-y-6", className)}>
        {/* Form Header */}
        <FeatureCard
          variant="glass"
          size="md"
          title={config.title}
          description={config.description}
          className="border-gold/20"
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                {renderAutosaveStatus()}
                {form.formState.isDirty && (
                  <div className="flex items-center gap-1 text-xs text-amber-400">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Unsaved changes</span>
                  </div>
                )}
              </div>
              <div className="text-xs text-white/50">
                {config.steps ? `Step ${currentStep + 1} of ${config.steps.length}` : 'Single form'}
              </div>
            </div>
          }
        />

        {/* Form Content */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Dynamic Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {config.fields
                .filter(field => fieldStates[field.name]?.visible !== false)
                .sort((a, b) => (a.layout?.order || 0) - (b.layout?.order || 0))
                .map(field => (
                  <FieldRenderer
                    key={field.id}
                    field={field}
                    className="transition-all duration-300"
                  />
                ))}
            </div>

            {/* Form Actions */}
            <FeatureCard
              variant="glass"
              className="border-gold/20"
              contentClassName="p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  {config.submitBehavior !== 'submit' && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleDraft(form.getValues())}
                      disabled={form.formState.isSubmitting}
                      className="border-gold/30 text-white hover:bg-gold/10"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Draft
                    </Button>
                  )}
                  
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => form.reset()}
                    disabled={form.formState.isSubmitting || !form.formState.isDirty}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>

                {config.submitBehavior !== 'draft' && (
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting || !form.formState.isValid}
                    className="bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-navy font-semibold min-w-[120px]"
                  >
                    {form.formState.isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                        Submitting...
                      </div>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Submit
                      </>
                    )}
                  </Button>
                )}
              </div>
            </FeatureCard>
          </form>
        </Form>
      </div>
    </FormComposerContext.Provider>
  )
}