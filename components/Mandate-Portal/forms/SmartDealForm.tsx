"use client"

/**
 * Smart Deal Form Component
 * AI-enhanced deal form with auto-population from document analysis
 */

import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Brain,
  FileText,
  Sparkles,
  Check,
  AlertTriangle,
  RefreshCw,
  Save,
  Send,
  Eye,
  EyeOff,
  Wand2,
  Target,
  Clock
} from 'lucide-react'
import { FormComposer, type FormComposerConfig } from './FormComposer'
import { DocumentAnalysisPanel } from '@/components/Artificial-Intelligence/ai/DocumentAnalysisPanel'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FeatureCard } from '@/components/shared/FeatureCard'
import { 
  type ExtractedDealData, 
  type DocumentAnalysisResult,
  DocumentAnalysisUtils 
} from '@/lib/ai/jeeves'
import { cn } from '@/lib/utils'
import { getThemeClasses, THEME_ANIMATIONS } from '@/lib/theme'

// Enhanced deal form schema with AI integration
const SmartDealFormSchema = z.object({
  // Core deal information
  dealType: z.enum(['acquisition', 'divestiture', 'merger', 'ipo', 'refinancing']),
  dealNumber: z.string().min(1, 'Deal number is required'),
  clientName: z.string().min(1, 'Client name is required'),
  targetCompany: z.string().min(1, 'Target company is required'),
  acquirerCompany: z.string().optional(),
  
  // Financial details
  dealValue: z.number().positive('Deal value must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters'),
  purchasePrice: z.number().positive().optional(),
  enterpriseValue: z.number().positive().optional(),
  equityValue: z.number().positive().optional(),
  
  // Deal structure
  paymentStructure: z.enum(['cash', 'stock', 'mixed']),
  cashPercentage: z.number().min(0).max(100).optional(),
  stockPercentage: z.number().min(0).max(100).optional(),
  earnoutAmount: z.number().positive().optional(),
  escrowAmount: z.number().positive().optional(),
  
  // Timeline
  announcedDate: z.date().optional(),
  expectedClosingDate: z.date(),
  signedDate: z.date().optional(),
  effectiveDate: z.date().optional(),
  
  // Parties
  sellerName: z.string().optional(),
  sellerType: z.enum(['individual', 'corporation', 'partnership', 'fund', 'government']).optional(),
  buyerName: z.string().optional(),
  buyerType: z.enum(['individual', 'corporation', 'partnership', 'fund', 'government']).optional(),
  
  // Financial metrics
  revenue: z.number().positive().optional(),
  ebitda: z.number().optional(),
  netIncome: z.number().optional(),
  totalAssets: z.number().positive().optional(),
  totalLiabilities: z.number().positive().optional(),
  
  // Valuation multiples
  evRevenue: z.number().positive().optional(),
  evEbitda: z.number().positive().optional(),
  peRatio: z.number().positive().optional(),
  
  // Industry classification
  industry: z.string().optional(),
  sector: z.string().optional(),
  naicsCode: z.string().optional(),
  sicCode: z.string().optional(),
  
  // Regulatory
  regulatoryApprovals: z.array(z.string()).optional(),
  antitrust: z.boolean().optional(),
  foreignInvestment: z.boolean().optional(),
  
  // Risk assessment
  riskFactors: z.array(z.string()).optional(),
  materialAdverseChange: z.boolean().optional(),
  financingContingency: z.boolean().optional(),
  
  // Buckingham Vault specifics
  mandateId: z.string().min(1, 'Mandate ID is required'),
  introducerId: z.string().optional(),
  commissionRate: z.number().min(0).max(10),
  estimatedFee: z.number().positive().optional(),
  
  // AI integration fields
  aiExtracted: z.boolean().default(false),
  aiConfidence: z.number().min(0).max(100).optional(),
  aiAnalysisId: z.string().optional(),
  aiReviewStatus: z.enum(['pending', 'reviewed', 'approved', 'rejected']).default('pending'),
  
  // Additional notes
  internalNotes: z.string().optional(),
  clientInstructions: z.string().optional(),
  specialConsiderations: z.string().optional()
})

type SmartDealFormData = z.infer<typeof SmartDealFormSchema>

interface SmartDealFormProps {
  initialData?: Partial<SmartDealFormData>
  dealId?: string
  clientId?: string
  onSubmit?: (data: SmartDealFormData) => Promise<void>
  onSaveDraft?: (data: Partial<SmartDealFormData>) => Promise<void>
  className?: string
}

interface AIEnhancement {
  field: string
  originalValue: any
  suggestedValue: any
  confidence: number
  reason: string
  applied: boolean
}

export function SmartDealForm({
  initialData,
  dealId,
  clientId,
  onSubmit,
  onSaveDraft,
  className
}: SmartDealFormProps) {
  const [activeTab, setActiveTab] = useState('form')
  const [aiEnhancements, setAiEnhancements] = useState<AIEnhancement[]>([])
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [extractedData, setExtractedData] = useState<ExtractedDealData | null>(null)
  const [lastAnalysisResult, setLastAnalysisResult] = useState<DocumentAnalysisResult | null>(null)
  const [isPopulating, setIsPopulating] = useState(false)

  const form = useForm<SmartDealFormData>({
    resolver: zodResolver(SmartDealFormSchema),
    defaultValues: {
      dealType: 'acquisition',
      currency: 'USD',
      paymentStructure: 'cash',
      commissionRate: 1.5,
      aiExtracted: false,
      aiReviewStatus: 'pending',
      ...initialData
    }
  })

  // Handle form submission
  const handleSubmit = useCallback(async (data: SmartDealFormData) => {
    // Add AI metadata if applicable
    if (extractedData && lastAnalysisResult) {
      data.aiExtracted = true
      data.aiConfidence = lastAnalysisResult.confidence
      data.aiAnalysisId = lastAnalysisResult.analysisId
    }

    await onSubmit?.(data)
  }, [extractedData, lastAnalysisResult, onSubmit])

  // Form configuration with AI-enhanced fields
  const formConfig: FormComposerConfig<SmartDealFormData> = useMemo(() => ({
    id: 'smart-deal-form',
    title: 'Deal Information',
    description: 'Create a new deal with AI-powered document analysis',
    schema: SmartDealFormSchema,
    fields: [
      // Core Information Section
      {
        id: 'dealType',
        name: 'dealType',
        type: 'select',
        label: 'Deal Type',
        options: [
          { value: 'acquisition', label: 'Acquisition' },
          { value: 'divestiture', label: 'Divestiture' },
          { value: 'merger', label: 'Merger' },
          { value: 'ipo', label: 'IPO' },
          { value: 'refinancing', label: 'Refinancing' }
        ],
        required: true,
        section: 'core',
        order: 1
      },
      {
        id: 'dealNumber',
        name: 'dealNumber',
        type: 'text',
        label: 'Deal Number',
        placeholder: 'BV-2024-XXX',
        required: true,
        section: 'core',
        order: 2
      },
      {
        id: 'clientName',
        name: 'clientName',
        type: 'text',
        label: 'Client Name',
        placeholder: 'Enter client company name',
        required: true,
        section: 'core',
        order: 3
      },
      {
        id: 'targetCompany',
        name: 'targetCompany',
        type: 'text',
        label: 'Target Company',
        placeholder: 'Enter target company name',
        required: true,
        section: 'core',
        order: 4
      },
      {
        id: 'acquirerCompany',
        name: 'acquirerCompany',
        type: 'text',
        label: 'Acquirer Company',
        placeholder: 'Enter acquirer company name',
        section: 'core',
        order: 5
      },

      // Financial Details Section
      {
        id: 'dealValue',
        name: 'dealValue',
        type: 'currency',
        label: 'Deal Value',
        placeholder: '0',
        required: true,
        section: 'financial',
        order: 10,
        props: { min: 0, step: 1000000 }
      },
      {
        id: 'currency',
        name: 'currency',
        type: 'select',
        label: 'Currency',
        options: [
          { value: 'USD', label: 'US Dollar (USD)' },
          { value: 'EUR', label: 'Euro (EUR)' },
          { value: 'GBP', label: 'British Pound (GBP)' },
          { value: 'JPY', label: 'Japanese Yen (JPY)' }
        ],
        required: true,
        section: 'financial',
        order: 11
      },
      {
        id: 'purchasePrice',
        name: 'purchasePrice',
        type: 'currency',
        label: 'Purchase Price',
        section: 'financial',
        order: 12
      },
      {
        id: 'enterpriseValue',
        name: 'enterpriseValue',
        type: 'currency',
        label: 'Enterprise Value',
        section: 'financial',
        order: 13
      },
      {
        id: 'equityValue',
        name: 'equityValue',
        type: 'currency',
        label: 'Equity Value',
        section: 'financial',
        order: 14
      },

      // Deal Structure Section
      {
        id: 'paymentStructure',
        name: 'paymentStructure',
        type: 'select',
        label: 'Payment Structure',
        options: [
          { value: 'cash', label: 'Cash' },
          { value: 'stock', label: 'Stock' },
          { value: 'mixed', label: 'Mixed (Cash + Stock)' }
        ],
        required: true,
        section: 'structure',
        order: 20
      },
      {
        id: 'cashPercentage',
        name: 'cashPercentage',
        type: 'percentage',
        label: 'Cash Percentage',
        section: 'structure',
        order: 21,
        dependencies: [
          { field: 'paymentStructure', condition: 'equals', value: 'mixed', action: 'show' }
        ]
      },
      {
        id: 'stockPercentage',
        name: 'stockPercentage',
        type: 'percentage',
        label: 'Stock Percentage',
        section: 'structure',
        order: 22,
        dependencies: [
          { field: 'paymentStructure', condition: 'equals', value: 'mixed', action: 'show' }
        ]
      },

      // Timeline Section
      {
        id: 'announcedDate',
        name: 'announcedDate',
        type: 'date',
        label: 'Announced Date',
        section: 'timeline',
        order: 30
      },
      {
        id: 'expectedClosingDate',
        name: 'expectedClosingDate',
        type: 'date',
        label: 'Expected Closing Date',
        required: true,
        section: 'timeline',
        order: 31
      },
      {
        id: 'signedDate',
        name: 'signedDate',
        type: 'date',
        label: 'Signed Date',
        section: 'timeline',
        order: 32
      },

      // Buckingham Vault Section
      {
        id: 'mandateId',
        name: 'mandateId',
        type: 'text',
        label: 'Mandate ID',
        placeholder: 'MND-2024-XXX',
        required: true,
        section: 'mandate',
        order: 40
      },
      {
        id: 'commissionRate',
        name: 'commissionRate',
        type: 'percentage',
        label: 'Commission Rate',
        required: true,
        section: 'mandate',
        order: 41,
        props: { min: 0, max: 10, step: 0.1 }
      },
      {
        id: 'estimatedFee',
        name: 'estimatedFee',
        type: 'currency',
        label: 'Estimated Fee',
        section: 'mandate',
        order: 42
      }
    ],
    sections: [
      { id: 'core', title: 'Core Information', order: 1 },
      { id: 'financial', title: 'Financial Details', order: 2 },
      { id: 'structure', title: 'Deal Structure', order: 3 },
      { id: 'timeline', title: 'Timeline', order: 4 },
      { id: 'mandate', title: 'Mandate Details', order: 5 }
    ],
    autosave: {
      enabled: true,
      interval: 30000,
      key: 'smart-deal-form-draft',
      onSave: onSaveDraft
    },
    submitBehavior: 'both',
    onSubmit: handleSubmit
  }), [onSaveDraft, handleSubmit])

  // Handle AI data extraction
  const handleDataExtracted = useCallback(async (data: ExtractedDealData) => {
    setIsPopulating(true)
    setExtractedData(data)

    try {
      // Convert extracted data to form format
      const formData = DocumentAnalysisUtils.formatForFormPopulation(data)
      
      // Create AI enhancements
      const enhancements: AIEnhancement[] = []
      
      Object.entries(formData).forEach(([field, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          const currentValue = form.getValues(field as keyof SmartDealFormData)
          
          if (currentValue !== value) {
            enhancements.push({
              field,
              originalValue: currentValue,
              suggestedValue: value,
              confidence: lastAnalysisResult?.confidence || 80,
              reason: 'Extracted from uploaded document',
              applied: false
            })
          }
        }
      })

      setAiEnhancements(enhancements)
      setActiveTab('ai-review')

    } catch (error) {
      console.error('Failed to process extracted data:', error)
    } finally {
      setIsPopulating(false)
    }
  }, [form, lastAnalysisResult])

  // Handle analysis completion
  const handleAnalysisComplete = useCallback((result: DocumentAnalysisResult) => {
    setLastAnalysisResult(result)
  }, [])

  // Apply AI enhancement
  const applyEnhancement = useCallback((enhancement: AIEnhancement) => {
    form.setValue(enhancement.field as keyof SmartDealFormData, enhancement.suggestedValue)
    
    setAiEnhancements(prev => 
      prev.map(e => 
        e.field === enhancement.field 
          ? { ...e, applied: true }
          : e
      )
    )
  }, [form])

  // Apply all AI enhancements
  const applyAllEnhancements = useCallback(() => {
    aiEnhancements.forEach(enhancement => {
      if (!enhancement.applied) {
        applyEnhancement(enhancement)
      }
    })
  }, [aiEnhancements, applyEnhancement])

  // Clear AI enhancements
  const clearEnhancements = useCallback(() => {
    setAiEnhancements([])
    setExtractedData(null)
  }, [])

  const pendingEnhancements = aiEnhancements.filter(e => !e.applied)
  const appliedEnhancements = aiEnhancements.filter(e => e.applied)

  return (
    <div className={cn('space-y-6', className)}>
      {/* AI Enhancement Header */}
      {(extractedData || aiEnhancements.length > 0) && (
        <FeatureCard variant="glass" className="border-gold/20">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold" />
                  <h3 className="text-lg font-semibold text-white">AI Enhancements</h3>
                </div>
                
                {lastAnalysisResult && (
                  <Badge variant="secondary" className="bg-gold/20 text-gold border-gold/30">
                    {lastAnalysisResult.confidence}% Confidence
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                {pendingEnhancements.length > 0 && (
                  <Button
                    onClick={applyAllEnhancements}
                    size="sm"
                    className="bg-gold hover:bg-gold/80 text-navy-900"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Apply All ({pendingEnhancements.length})
                  </Button>
                )}
                
                <Button
                  onClick={clearEnhancements}
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>

            {/* Enhancement Summary */}
            {aiEnhancements.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">{aiEnhancements.length}</div>
                  <div className="text-xs text-white/60">Total Enhancements</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-400">{appliedEnhancements.length}</div>
                  <div className="text-xs text-white/60">Applied</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gold">{pendingEnhancements.length}</div>
                  <div className="text-xs text-white/60">Pending</div>
                </div>
              </div>
            )}
          </div>
        </FeatureCard>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-navy-800/60">
          <TabsTrigger value="form" className="data-[state=active]:bg-gold data-[state=active]:text-navy-900">
            Deal Form
          </TabsTrigger>
          <TabsTrigger value="ai-analysis" className="data-[state=active]:bg-gold data-[state=active]:text-navy-900">
            <Brain className="w-4 h-4 mr-2" />
            AI Analysis
          </TabsTrigger>
          <TabsTrigger value="ai-review" className="data-[state=active]:bg-gold data-[state=active]:text-navy-900">
            <Target className="w-4 h-4 mr-2" />
            AI Review
            {pendingEnhancements.length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-gold/20 text-gold border-gold/30">
                {pendingEnhancements.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Deal Form Tab */}
        <TabsContent value="form">
          <FormComposer
            config={formConfig}
            className="space-y-6"
          />
        </TabsContent>

        {/* AI Analysis Tab */}
        <TabsContent value="ai-analysis">
          <DocumentAnalysisPanel
            onDataExtracted={handleDataExtracted}
            onAnalysisComplete={handleAnalysisComplete}
            dealId={dealId}
            clientId={clientId}
          />
        </TabsContent>

        {/* AI Review Tab */}
        <TabsContent value="ai-review">
          {aiEnhancements.length > 0 ? (
            <div className="space-y-4">
              {aiEnhancements.map((enhancement, index) => (
                <motion.div
                  key={index}
                  {...THEME_ANIMATIONS.slideUp}
                  className={cn(
                    'p-4 rounded-lg border backdrop-blur-sm',
                    enhancement.applied 
                      ? 'border-green-500/30 bg-green-500/10'
                      : 'border-gold/30 bg-gold/10'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-white">
                          {enhancement.field.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {enhancement.confidence}% confidence
                        </Badge>
                        {enhancement.applied && (
                          <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                            <Check className="w-3 h-3 mr-1" />
                            Applied
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-white/60">Current Value:</div>
                          <div className="text-white font-medium">
                            {enhancement.originalValue || 'Empty'}
                          </div>
                        </div>
                        <div>
                          <div className="text-white/60">Suggested Value:</div>
                          <div className="text-gold font-medium">
                            {enhancement.suggestedValue}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-xs text-white/60">
                        {enhancement.reason}
                      </div>
                    </div>

                    {!enhancement.applied && (
                      <Button
                        onClick={() => applyEnhancement(enhancement)}
                        size="sm"
                        className="bg-gold hover:bg-gold/80 text-navy-900"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Apply
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <FeatureCard variant="glass" className="border-gold/20">
              <div className="p-8 text-center">
                <Target className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-white mb-2">No AI Enhancements</h4>
                <p className="text-white/60">
                  Upload and analyze documents to see AI-suggested form improvements
                </p>
              </div>
            </FeatureCard>
          )}
        </TabsContent>
      </Tabs>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isPopulating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="bg-navy-900/95 border border-gold/20 rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4" />
              <h4 className="text-lg font-medium text-white mb-2">Processing AI Data</h4>
              <p className="text-white/60">Analyzing and mapping extracted data to form fields...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}