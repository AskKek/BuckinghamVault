/**
 * Jeeves AI Document Analysis Service
 * Sophisticated document parsing and data extraction for institutional deal processing
 */

import { z } from 'zod'

// Core document analysis interfaces
export interface DocumentAnalysisRequest {
  fileId: string
  fileName: string
  fileType: string
  fileSize: number
  analysisType: 'deal_intake' | 'financial_statement' | 'legal_document' | 'kyc_document' | 'comprehensive'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  clientId?: string
  dealId?: string
  metadata?: Record<string, any>
}

export interface DocumentAnalysisResult {
  analysisId: string
  fileId: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'requires_review'
  confidence: number // 0-100
  processingTime: number // milliseconds
  extractedData: ExtractedDealData
  rawData: Record<string, any>
  validation: ValidationResult[]
  suggestedMappings: FieldMapping[]
  qualityScore: number // 0-100
  flags: AnalysisFlag[]
  createdAt: Date
  completedAt?: Date
  reviewedBy?: string
  reviewedAt?: Date
}

export interface ExtractedDealData {
  // Core deal information
  dealType?: 'acquisition' | 'divestiture' | 'merger' | 'ipo' | 'refinancing'
  dealValue?: number
  currency?: string
  acquirerCompany?: string
  
  // Financial details
  purchasePrice?: number
  enterpriseValue?: number
  equityValue?: number
  debtAmount?: number
  cashAmount?: number
  
  // Deal structure
  paymentStructure?: 'cash' | 'stock' | 'mixed'
  cashPercentage?: number
  stockPercentage?: number
  earnoutAmount?: number
  escrowAmount?: number
  
  // Timeline
  announcedDate?: Date
  expectedClosingDate?: Date
  signedDate?: Date
  effectiveDate?: Date
  
  // Parties and advisors
  seller?: PartyInfo
  buyer?: PartyInfo
  targetCompany?: CompanyInfo
  advisors?: AdvisorInfo[]
  
  // Financial metrics
  revenue?: number
  ebitda?: number
  netIncome?: number
  totalAssets?: number
  totalLiabilities?: number
  
  // Valuation multiples
  evRevenue?: number
  evEbitda?: number
  peRatio?: number
  
  // Industry and sector
  industry?: string
  sector?: string
  naicsCode?: string
  sicCode?: string
  
  // Regulatory and compliance
  regulatoryApprovals?: string[]
  antitrust?: boolean
  foreignInvestment?: boolean
  
  // Risk factors
  riskFactors?: string[]
  materialAdverseChange?: boolean
  financingContingency?: boolean
  
  // Additional extracted fields
  customFields?: Record<string, any>
}

export interface PartyInfo {
  name: string
  type: 'individual' | 'corporation' | 'partnership' | 'fund' | 'government'
  jurisdiction?: string
  address?: string
  contact?: ContactInfo
  ownership?: number // percentage
}

export interface CompanyInfo {
  name: string
  legalName?: string
  jurisdiction?: string
  businessDescription?: string
  employees?: number
  headquarters?: string
  website?: string
  ticker?: string
  exchange?: string
}

export interface AdvisorInfo {
  name: string
  role: 'investment_bank' | 'legal_counsel' | 'accountant' | 'consultant' | 'other'
  side: 'buy' | 'sell' | 'target' | 'neutral'
  fee?: number
}

export interface ContactInfo {
  name?: string
  title?: string
  email?: string
  phone?: string
}

export interface ValidationResult {
  field: string
  status: 'valid' | 'invalid' | 'warning' | 'requires_review'
  message: string
  confidence: number
  suggestedValue?: any
}

export interface FieldMapping {
  extractedField: string
  targetField: string
  confidence: number
  transformation?: string
  requiresReview: boolean
}

export interface AnalysisFlag {
  type: 'data_quality' | 'compliance' | 'security' | 'business_logic' | 'formatting'
  severity: 'info' | 'warning' | 'error' | 'critical'
  message: string
  field?: string
  suggestion?: string
}

// Validation schemas
export const DocumentAnalysisRequestSchema = z.object({
  fileId: z.string().min(1),
  fileName: z.string().min(1),
  fileType: z.string(),
  fileSize: z.number().positive(),
  analysisType: z.enum(['deal_intake', 'financial_statement', 'legal_document', 'kyc_document', 'comprehensive']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  clientId: z.string().optional(),
  dealId: z.string().optional(),
  metadata: z.record(z.any()).optional()
})

export const ExtractedDealDataSchema = z.object({
  dealType: z.enum(['acquisition', 'divestiture', 'merger', 'ipo', 'refinancing']).optional(),
  dealValue: z.number().positive().optional(),
  currency: z.string().length(3).optional(),
  targetCompany: z.string().optional(),
  acquirerCompany: z.string().optional(),
  purchasePrice: z.number().optional(),
  enterpriseValue: z.number().optional(),
  equityValue: z.number().optional(),
  announcedDate: z.date().optional(),
  expectedClosingDate: z.date().optional(),
  // ... additional validation rules
})

/**
 * Jeeves AI Service Client
 */
export class JeevesAI {
  private baseUrl: string
  private apiKey: string
  private timeout: number

  constructor(config: {
    baseUrl?: string
    apiKey?: string
    timeout?: number
  } = {}) {
    this.baseUrl = config.baseUrl || process.env.JEEVES_API_URL || 'https://api.jeeves.ai'
    this.apiKey = config.apiKey || process.env.JEEVES_API_KEY || ''
    this.timeout = config.timeout || 60000 // 60 seconds
  }

  /**
   * Submit document for analysis
   */
  async analyzeDocument(request: DocumentAnalysisRequest): Promise<DocumentAnalysisResult> {
    const validatedRequest = DocumentAnalysisRequestSchema.parse(request)

    try {
      const response = await fetch(`${this.baseUrl}/v1/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Client': 'buckingham-vault',
          'X-Version': '1.0.0'
        },
        body: JSON.stringify(validatedRequest),
        signal: AbortSignal.timeout(this.timeout)
      })

      if (!response.ok) {
        throw new Error(`Jeeves API error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      return this.processAnalysisResult(result)

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Document analysis failed: ${error.message}`)
      }
      throw new Error('Document analysis failed: Unknown error')
    }
  }

  /**
   * Get analysis status and results
   */
  async getAnalysisResult(analysisId: string): Promise<DocumentAnalysisResult> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/analysis/${analysisId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Client': 'buckingham-vault'
        },
        signal: AbortSignal.timeout(this.timeout)
      })

      if (!response.ok) {
        throw new Error(`Jeeves API error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      return this.processAnalysisResult(result)

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get analysis result: ${error.message}`)
      }
      throw new Error('Failed to get analysis result: Unknown error')
    }
  }

  /**
   * Update analysis with user feedback
   */
  async updateAnalysis(
    analysisId: string, 
    feedback: {
      corrections?: Record<string, any>
      approvedMappings?: string[]
      rejectedMappings?: string[]
      userReview?: string
    }
  ): Promise<DocumentAnalysisResult> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/analysis/${analysisId}/feedback`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Client': 'buckingham-vault'
        },
        body: JSON.stringify(feedback),
        signal: AbortSignal.timeout(this.timeout)
      })

      if (!response.ok) {
        throw new Error(`Jeeves API error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      return this.processAnalysisResult(result)

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update analysis: ${error.message}`)
      }
      throw new Error('Failed to update analysis: Unknown error')
    }
  }

  /**
   * Get analysis templates for different document types
   */
  async getAnalysisTemplates(): Promise<Record<string, any>> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/templates`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Client': 'buckingham-vault'
        }
      })

      if (!response.ok) {
        throw new Error(`Jeeves API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get templates: ${error.message}`)
      }
      throw new Error('Failed to get templates: Unknown error')
    }
  }

  /**
   * Process and validate analysis result
   */
  private processAnalysisResult(rawResult: any): DocumentAnalysisResult {
    // Add data transformation and validation logic
    const result: DocumentAnalysisResult = {
      analysisId: rawResult.analysisId,
      fileId: rawResult.fileId,
      status: rawResult.status,
      confidence: Math.min(100, Math.max(0, rawResult.confidence || 0)),
      processingTime: rawResult.processingTime || 0,
      extractedData: this.processExtractedData(rawResult.extractedData || {}),
      rawData: rawResult.rawData || {},
      validation: this.processValidationResults(rawResult.validation || []),
      suggestedMappings: rawResult.suggestedMappings || [],
      qualityScore: Math.min(100, Math.max(0, rawResult.qualityScore || 0)),
      flags: this.processAnalysisFlags(rawResult.flags || []),
      createdAt: new Date(rawResult.createdAt),
      completedAt: rawResult.completedAt ? new Date(rawResult.completedAt) : undefined,
      reviewedBy: rawResult.reviewedBy,
      reviewedAt: rawResult.reviewedAt ? new Date(rawResult.reviewedAt) : undefined
    }

    return result
  }

  private processExtractedData(data: any): ExtractedDealData {
    // Transform and validate extracted data
    const processed: ExtractedDealData = {}

    // Convert string dates to Date objects
    if (data.announcedDate) {
      processed.announcedDate = new Date(data.announcedDate)
    }
    if (data.expectedClosingDate) {
      processed.expectedClosingDate = new Date(data.expectedClosingDate)
    }
    if (data.signedDate) {
      processed.signedDate = new Date(data.signedDate)
    }
    if (data.effectiveDate) {
      processed.effectiveDate = new Date(data.effectiveDate)
    }

    // Convert numeric strings to numbers
    const numericFields = [
      'dealValue', 'purchasePrice', 'enterpriseValue', 'equityValue',
      'debtAmount', 'cashAmount', 'earnoutAmount', 'escrowAmount',
      'revenue', 'ebitda', 'netIncome', 'totalAssets', 'totalLiabilities',
      'evRevenue', 'evEbitda', 'peRatio', 'cashPercentage', 'stockPercentage'
    ]

    numericFields.forEach(field => {
      if (data[field] !== undefined && data[field] !== null) {
        const value = typeof data[field] === 'string' ? parseFloat(data[field]) : data[field]
        if (!isNaN(value)) {
          processed[field as keyof ExtractedDealData] = value as any
        }
      }
    })

    // Copy other fields directly
    const directFields = [
      'dealType', 'currency', 'targetCompany', 'acquirerCompany',
      'paymentStructure', 'industry', 'sector', 'naicsCode', 'sicCode',
      'regulatoryApprovals', 'riskFactors'
    ]

    directFields.forEach(field => {
      if (data[field] !== undefined) {
        processed[field as keyof ExtractedDealData] = data[field]
      }
    })

    // Process complex objects
    if (data.seller) processed.seller = data.seller
    if (data.buyer) processed.buyer = data.buyer
    if (data.advisors) processed.advisors = data.advisors
    if (data.customFields) processed.customFields = data.customFields

    return processed
  }

  private processValidationResults(validations: any[]): ValidationResult[] {
    return validations.map(v => ({
      field: v.field || '',
      status: v.status || 'requires_review',
      message: v.message || '',
      confidence: Math.min(100, Math.max(0, v.confidence || 0)),
      suggestedValue: v.suggestedValue
    }))
  }

  private processAnalysisFlags(flags: any[]): AnalysisFlag[] {
    return flags.map(f => ({
      type: f.type || 'data_quality',
      severity: f.severity || 'info',
      message: f.message || '',
      field: f.field,
      suggestion: f.suggestion
    }))
  }
}

// Factory function for creating JeevesAI instances
export function createJeevesAI(config?: {
  baseUrl?: string
  apiKey?: string
  timeout?: number
}): JeevesAI {
  return new JeevesAI(config)
}

// Utility functions for common operations
export const DocumentAnalysisUtils = {
  /**
   * Calculate overall confidence score
   */
  calculateOverallConfidence: (result: DocumentAnalysisResult): number => {
    const validConfidences = result.validation
      .filter(v => v.confidence > 0)
      .map(v => v.confidence)
    
    if (validConfidences.length === 0) return result.confidence
    
    const avgValidationConfidence = validConfidences.reduce((a, b) => a + b, 0) / validConfidences.length
    return (result.confidence + avgValidationConfidence) / 2
  },

  /**
   * Get critical flags
   */
  getCriticalFlags: (result: DocumentAnalysisResult): AnalysisFlag[] => {
    return result.flags.filter(f => f.severity === 'critical' || f.severity === 'error')
  },

  /**
   * Check if result requires human review
   */
  requiresReview: (result: DocumentAnalysisResult): boolean => {
    const lowConfidence = result.confidence < 80
    const hasErrors = result.flags.some(f => f.severity === 'error' || f.severity === 'critical')
    const hasInvalidations = result.validation.some(v => v.status === 'invalid')
    const hasMappingIssues = result.suggestedMappings.some(m => m.requiresReview)
    
    return lowConfidence || hasErrors || hasInvalidations || hasMappingIssues || result.status === 'requires_review'
  },

  /**
   * Format extracted data for form population
   */
  formatForFormPopulation: (extractedData: ExtractedDealData): Record<string, any> => {
    const formData: Record<string, any> = {}

    // Convert to form-friendly format
    Object.entries(extractedData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof Date) {
          formData[key] = value.toISOString().split('T')[0] // YYYY-MM-DD format
        } else if (typeof value === 'object' && !Array.isArray(value)) {
          // Flatten complex objects
          Object.entries(value).forEach(([subKey, subValue]) => {
            formData[`${key}_${subKey}`] = subValue
          })
        } else {
          formData[key] = value
        }
      }
    })

    return formData
  }
}