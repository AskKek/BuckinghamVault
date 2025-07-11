/**
 * Financial Validation Schemas
 * Comprehensive validation for institutional financial forms with regulatory compliance
 */

import { z } from 'zod'

// Base validation utilities
export const createMinMaxValidation = (min?: number, max?: number, field = 'value') => {
  let schema = z.number()
  
  if (min !== undefined) {
    schema = schema.min(min, `${field} must be at least ${min}`)
  }
  
  if (max !== undefined) {
    schema = schema.max(max, `${field} must not exceed ${max}`)
  }
  
  return schema
}

// Currency validation with precision handling
export const currencyValidation = (options: {
  min?: number
  max?: number
  precision?: number
  currency?: string
  required?: boolean
} = {}) => {
  const { min = 0, max, precision = 2, currency = 'USD', required = true } = options
  
  let baseSchema = z.number().min(min, `Amount must be at least ${min}`)
  
  if (max !== undefined) {
    baseSchema = baseSchema.max(max, `Amount cannot exceed ${max}`)
  }

  // Add currency-specific validations
  if (currency === 'USD' && max === undefined) {
    baseSchema = baseSchema.max(999999999999.99, 'Amount exceeds maximum USD limit')
  }

  const schema = baseSchema.refine(
    (value) => {
      // Check decimal precision
      const decimals = (value.toString().split('.')[1] || '').length
      return decimals <= precision
    },
    `Amount cannot have more than ${precision} decimal places`
  )

  return required ? schema : schema.optional()
}

// Percentage validation
export const percentageValidation = (options: {
  min?: number
  max?: number
  precision?: number
  required?: boolean
} = {}) => {
  const { min = 0, max = 100, precision = 4, required = true } = options
  
  let schema = z.number()
    .min(min, `Percentage must be at least ${min}%`)
    .max(max, `Percentage cannot exceed ${max}%`)
    .refine(
      (value) => {
        const decimals = (value.toString().split('.')[1] || '').length
        return decimals <= precision
      },
      `Percentage cannot have more than ${precision} decimal places`
    )

  return required ? schema : schema.optional()
}

// Crypto address validation
export const cryptoAddressValidation = (cryptoType: 'BTC' | 'ETH' | 'USDT' | 'USDC' | 'generic' = 'generic') => {
  const patterns = {
    BTC: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
    ETH: /^0x[a-fA-F0-9]{40}$/,
    USDT: /^0x[a-fA-F0-9]{40}$/, // ERC-20
    USDC: /^0x[a-fA-F0-9]{40}$/, // ERC-20
    generic: /^[a-zA-Z0-9]{26,62}$/
  }

  return z.string()
    .min(1, 'Crypto address is required')
    .refine(
      (address) => patterns[cryptoType].test(address),
      `Invalid ${cryptoType} address format`
    )
}

// IBAN validation with checksum
export const ibanValidation = () => {
  return z.string()
    .min(1, 'IBAN is required')
    .transform((iban) => iban.replace(/\s/g, '').toUpperCase())
    .refine(
      (iban) => /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/.test(iban),
      'Invalid IBAN format'
    )
    .refine(
      (iban) => {
        // IBAN checksum validation (simplified)
        const rearranged = iban.slice(4) + iban.slice(0, 4)
        const numericString = rearranged.replace(/[A-Z]/g, (char) => 
          (char.charCodeAt(0) - 55).toString()
        )
        
        // Mod 97 check
        let remainder = 0
        for (let i = 0; i < numericString.length; i++) {
          remainder = (remainder * 10 + parseInt(numericString[i])) % 97
        }
        
        return remainder === 1
      },
      'Invalid IBAN checksum'
    )
}

// SWIFT code validation
export const swiftValidation = () => {
  return z.string()
    .min(1, 'SWIFT code is required')
    .regex(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, 'Invalid SWIFT code format')
    .length(8, 'SWIFT code must be 8 or 11 characters')
    .or(z.string().length(11, 'SWIFT code must be 8 or 11 characters'))
}

// Phone number validation with international support
export const phoneValidation = (options: { 
  international?: boolean
  required?: boolean 
} = {}) => {
  const { international = true, required = true } = options
  
  let schema = z.string()
  
  if (international) {
    schema = schema.regex(
      /^[\+]?[1-9][\d]{0,15}$/,
      'Please enter a valid international phone number'
    )
  } else {
    schema = schema.regex(
      /^[\(]?[\d]{3}[\)]?[-\s]?[\d]{3}[-\s]?[\d]{4}$/,
      'Please enter a valid phone number'
    )
  }

  return required ? schema : schema.optional()
}

// Email validation with domain restrictions
export const emailValidation = (options: {
  allowedDomains?: string[]
  blockedDomains?: string[]
  required?: boolean
} = {}) => {
  const { allowedDomains, blockedDomains, required = true } = options
  
  let baseSchema = z.string().email('Please enter a valid email address')

  // Apply refinements based on conditions
  let schema: any = baseSchema
  
  if (allowedDomains?.length) {
    schema = schema.refine(
      (email: string) => allowedDomains.some(domain => email.endsWith(`@${domain}`)),
      `Email must be from one of these domains: ${allowedDomains.join(', ')}`
    )
  }

  if (blockedDomains?.length) {
    schema = schema.refine(
      (email: string) => !blockedDomains.some(domain => email.endsWith(`@${domain}`)),
      `Email from this domain is not allowed`
    )
  }

  return required ? schema : schema.optional()
}

// Password validation with complexity requirements
export const passwordValidation = (options: {
  minLength?: number
  requireUppercase?: boolean
  requireLowercase?: boolean
  requireNumbers?: boolean
  requireSymbols?: boolean
  required?: boolean
} = {}) => {
  const {
    minLength = 12,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSymbols = true,
    required = true
  } = options

  let baseSchema = z.string().min(minLength, `Password must be at least ${minLength} characters`)
  let schema: any = baseSchema

  if (requireUppercase) {
    schema = schema.refine(
      (password: string) => /[A-Z]/.test(password),
      'Password must contain at least one uppercase letter'
    )
  }

  if (requireLowercase) {
    schema = schema.refine(
      (password: string) => /[a-z]/.test(password),
      'Password must contain at least one lowercase letter'
    )
  }

  if (requireNumbers) {
    schema = schema.refine(
      (password: string) => /\d/.test(password),
      'Password must contain at least one number'
    )
  }

  if (requireSymbols) {
    schema = schema.refine(
      (password: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      'Password must contain at least one special character'
    )
  }

  return required ? schema : schema.optional()
}

// Date validation with business rules
export const dateValidation = (options: {
  min?: Date
  max?: Date
  businessDaysOnly?: boolean
  excludeHolidays?: boolean
  required?: boolean
} = {}) => {
  const { min, max, businessDaysOnly = false, required = true } = options

  let baseSchema = z.date()

  if (min) {
    baseSchema = baseSchema.min(min, `Date must be after ${min.toLocaleDateString()}`)
  }

  if (max) {
    baseSchema = baseSchema.max(max, `Date must be before ${max.toLocaleDateString()}`)
  }

  let schema: any = baseSchema

  if (businessDaysOnly) {
    schema = schema.refine(
      (date: Date) => {
        const day = date.getDay()
        return day !== 0 && day !== 6 // Not Sunday (0) or Saturday (6)
      },
      'Date must be a business day (Monday-Friday)'
    )
  }

  return required ? schema : schema.optional()
}

// File validation
export const fileValidation = (options: {
  maxSize?: number // in bytes
  allowedTypes?: string[]
  maxFiles?: number
  required?: boolean
} = {}) => {
  const { 
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = [],
    maxFiles = 1,
    required = true 
  } = options

  let schema: any = z.instanceof(File)
    .refine(
      (file: any) => file.size <= maxSize,
      `File size must be less than ${(maxSize / 1024 / 1024).toFixed(1)}MB`
    )

  if (allowedTypes.length > 0) {
    schema = schema.refine(
      (file: any) => allowedTypes.includes(file.type),
      `File type must be one of: ${allowedTypes.join(', ')}`
    )
  }

  if (maxFiles > 1) {
    let arraySchema = z.array(schema).max(maxFiles, `Maximum ${maxFiles} files allowed`)
    return required ? arraySchema : arraySchema.optional()
  }

  return required ? schema : schema.optional()
}

// Deal-specific validations
export const dealValidations = {
  dealNumber: z.string()
    .min(1, 'Deal number is required')
    .regex(/^BV-\d{4}-\d{3,6}$/, 'Deal number must follow format: BV-YYYY-XXX'),
    
  amount: currencyValidation({ min: 1000, max: 1000000000, precision: 2 }),
  
  commission: percentageValidation({ min: 0, max: 10, precision: 4 }),
  
  forensicRating: z.enum(['AAA', 'AA', 'A', 'BBB', 'unrated'], {
    errorMap: () => ({ message: 'Please select a valid forensic rating' })
  }),
  
  settlementDate: dateValidation({ 
    min: new Date(), 
    businessDaysOnly: true 
  }),
  
  clientName: z.string()
    .min(2, 'Client name must be at least 2 characters')
    .max(100, 'Client name cannot exceed 100 characters')
    .regex(/^[a-zA-Z\s\-\.]+$/, 'Client name contains invalid characters'),
}

// KYC validations
export const kycValidations = {
  passportNumber: z.string()
    .min(6, 'Passport number must be at least 6 characters')
    .max(12, 'Passport number cannot exceed 12 characters')
    .regex(/^[A-Z0-9]+$/, 'Passport number must contain only letters and numbers'),
    
  taxId: z.string()
    .min(9, 'Tax ID must be at least 9 characters')
    .regex(/^[\d\-]+$/, 'Tax ID must contain only numbers and hyphens'),
    
  proofOfAddress: fileValidation({
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxSize: 5 * 1024 * 1024 // 5MB
  }),
  
  sourceOfFunds: z.string()
    .min(10, 'Please provide detailed information about source of funds')
    .max(1000, 'Description cannot exceed 1000 characters'),
}

// Compliance validations
export const complianceValidations = {
  sanctionsCheck: z.boolean()
    .refine(val => val === true, 'Sanctions screening must be completed'),
    
  pepStatus: z.enum(['yes', 'no', 'family'], {
    errorMap: () => ({ message: 'PEP status must be declared' })
  }),
    
  riskTolerance: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Risk tolerance must be specified' })
  }),
  
  investmentExperience: z.number()
    .min(0, 'Investment experience cannot be negative')
    .max(50, 'Investment experience seems unrealistic'),
}

// Multi-step form validation
export const createMultiStepValidation = (steps: Record<string, z.ZodSchema>) => {
  return {
    validateStep: (stepKey: string, data: any) => {
      const stepSchema = steps[stepKey]
      if (!stepSchema) {
        throw new Error(`No validation schema found for step: ${stepKey}`)
      }
      return stepSchema.safeParse(data)
    },
    
    validateAll: (data: any) => {
      const fullSchema = z.object(steps)
      return fullSchema.safeParse(data)
    },
    
    getFieldErrors: (stepKey: string, data: any) => {
      const result = steps[stepKey]?.safeParse(data)
      if (result?.success === false) {
        return result.error.flatten().fieldErrors
      }
      return {}
    }
  }
}

// Real-time validation utilities
export const createRealTimeValidator = (schema: z.ZodSchema) => {
  return {
    validateField: (fieldName: string, value: any) => {
      try {
        // Extract field schema
        const fieldSchema = (schema as any).shape[fieldName]
        if (!fieldSchema) return { isValid: true, error: null }
        
        const result = fieldSchema.safeParse(value)
        return {
          isValid: result.success,
          error: result.success ? null : result.error.issues[0]?.message
        }
      } catch (error) {
        return { isValid: false, error: 'Validation error' }
      }
    },
    
    validatePartial: (data: any) => {
      try {
        const result = (schema as any).partial ? (schema as any).partial().safeParse(data) : schema.safeParse(data)
        return {
          isValid: result.success,
          errors: result.success ? {} : result.error.flatten().fieldErrors
        }
      } catch (error) {
        return { isValid: false, errors: { _general: ['Validation error'] } }
      }
    }
  }
}

// Export validation presets
export const validationPresets = {
  dealForm: z.object({
    dealNumber: dealValidations.dealNumber,
    clientName: dealValidations.clientName,
    amount: dealValidations.amount,
    commission: dealValidations.commission,
    forensicRating: dealValidations.forensicRating,
    settlementDate: dealValidations.settlementDate,
  }),
  
  kycForm: z.object({
    passportNumber: kycValidations.passportNumber,
    taxId: kycValidations.taxId,
    proofOfAddress: kycValidations.proofOfAddress,
    sourceOfFunds: kycValidations.sourceOfFunds,
  }),
  
  complianceForm: z.object({
    sanctionsCheck: complianceValidations.sanctionsCheck,
    pepStatus: complianceValidations.pepStatus,
    riskTolerance: complianceValidations.riskTolerance,
    investmentExperience: complianceValidations.investmentExperience,
  }),
  
  contactForm: z.object({
    email: emailValidation(),
    phone: phoneValidation(),
    password: passwordValidation(),
  })
}