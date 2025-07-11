"use client"

/**
 * Document Analysis Panel Component
 * AI-powered document analysis interface for deal form auto-population
 */

import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Eye,
  RefreshCw,
  Download,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Zap,
  Target,
  TrendingUp,
  Shield,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FeatureCard } from '@/components/shared/FeatureCard'
import { FileUpload, type FileItem } from '@/components/ui/file-upload'
import { 
  type DocumentAnalysisResult, 
  type ExtractedDealData,
  type ValidationResult,
  type AnalysisFlag,
  type FieldMapping,
  DocumentAnalysisUtils,
  createJeevesAI
} from '@/lib/ai/jeeves'
import { cn } from '@/lib/utils'
import { getStatusColor, THEME_ANIMATIONS } from '@/lib/theme'

interface DocumentAnalysisPanelProps {
  onDataExtracted?: (data: ExtractedDealData) => void
  onAnalysisComplete?: (result: DocumentAnalysisResult) => void
  dealId?: string
  clientId?: string
  className?: string
}

interface AnalysisSession {
  id: string
  files: FileItem[]
  results: Record<string, DocumentAnalysisResult>
  isProcessing: boolean
  startedAt: Date
  completedAt?: Date
}

export function DocumentAnalysisPanel({
  onDataExtracted,
  onAnalysisComplete,
  dealId,
  clientId,
  className
}: DocumentAnalysisPanelProps) {
  const [session, setSession] = useState<AnalysisSession | null>(null)
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('upload')
  const [userFeedback, setUserFeedback] = useState<Record<string, string>>({})

  // Initialize new analysis session
  const initializeSession = useCallback(() => {
    const newSession: AnalysisSession = {
      id: Math.random().toString(36).substr(2, 9),
      files: [],
      results: {},
      isProcessing: false,
      startedAt: new Date()
    }
    setSession(newSession)
    setActiveTab('upload')
  }, [])

  // Handle file upload and analysis
  const handleFileUpload = useCallback(async (files: FileItem[]) => {
    if (!session) return

    setSession(prev => prev ? {
      ...prev,
      files: [...prev.files, ...files],
      isProcessing: true
    } : null)

    setActiveTab('analysis')

    // Process each file
    for (const file of files) {
      try {
        const jeevesAI = createJeevesAI()
      const analysisResult = await jeevesAI.analyzeDocument({
          fileId: file.id,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          analysisType: 'deal_intake',
          priority: 'high',
          clientId,
          dealId
        })

        setSession(prev => prev ? {
          ...prev,
          results: {
            ...prev.results,
            [file.id]: analysisResult
          }
        } : null)

        onAnalysisComplete?.(analysisResult)

        // Auto-select first completed analysis
        if (!selectedFileId) {
          setSelectedFileId(file.id)
        }

      } catch (error) {
        console.error('Analysis failed for file:', file.name, error)
        // Handle error state
      }
    }

    setSession(prev => prev ? {
      ...prev,
      isProcessing: false,
      completedAt: new Date()
    } : null)
  }, [session, selectedFileId, clientId, dealId, onAnalysisComplete])

  // Handle data extraction acceptance
  const handleAcceptData = useCallback((result: DocumentAnalysisResult) => {
    onDataExtracted?.(result.extractedData)
  }, [onDataExtracted])

  // Handle user feedback submission
  const handleSubmitFeedback = useCallback(async (resultId: string) => {
    const feedback = userFeedback[resultId]
    if (!feedback) return

    try {
              const jeevesAI = createJeevesAI()
        await jeevesAI.updateAnalysis(resultId, {
        userReview: feedback
      })
      
      setUserFeedback(prev => ({ ...prev, [resultId]: '' }))
    } catch (error) {
      console.error('Failed to submit feedback:', error)
    }
  }, [userFeedback])

  // Get selected analysis result
  const selectedResult = selectedFileId && session?.results[selectedFileId]

  // Calculate session statistics
  const sessionStats = session ? {
    totalFiles: session.files.length,
    completedAnalyses: Object.keys(session.results).length,
    successfulExtractions: Object.values(session.results).filter(r => r.confidence >= 80).length,
    averageConfidence: Object.values(session.results).length > 0 
      ? Object.values(session.results).reduce((sum, r) => sum + r.confidence, 0) / Object.values(session.results).length
      : 0
  } : null

  // Initialize session on mount
  useEffect(() => {
    if (!session) {
      initializeSession()
    }
  }, [session, initializeSession])

  return (
    <div className={cn('space-y-6', className)}>
      {/* Session Header */}
      {session && (
        <FeatureCard variant="glass" className="border-gold/20">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-gold" />
                  <h3 className="text-lg font-semibold text-white">Jeeves Document Analysis</h3>
                </div>
                
                {session.isProcessing && (
                  <Badge variant="secondary" className="bg-gold/20 text-gold border-gold/30">
                    <Clock className="w-3 h-3 mr-1" />
                    Processing
                  </Badge>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={initializeSession}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                New Session
              </Button>
            </div>

            {/* Session Statistics */}
            {sessionStats && sessionStats.totalFiles > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">{sessionStats.totalFiles}</div>
                  <div className="text-xs text-white/60">Files Uploaded</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">{sessionStats.completedAnalyses}</div>
                  <div className="text-xs text-white/60">Analyses Complete</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-400">{sessionStats.successfulExtractions}</div>
                  <div className="text-xs text-white/60">High Confidence</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gold">{sessionStats.averageConfidence.toFixed(0)}%</div>
                  <div className="text-xs text-white/60">Avg Confidence</div>
                </div>
              </div>
            )}
          </div>
        </FeatureCard>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-navy-800/60">
          <TabsTrigger value="upload" className="data-[state=active]:bg-gold data-[state=active]:text-navy-900">
            Upload Documents
          </TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-gold data-[state=active]:text-navy-900">
            Analysis Results
          </TabsTrigger>
          <TabsTrigger value="review" className="data-[state=active]:bg-gold data-[state=active]:text-navy-900">
            Review & Feedback
          </TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-6">
          <FeatureCard variant="glass" className="border-gold/20">
            <div className="p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Upload Deal Documents</h4>
              <p className="text-white/60 mb-6">
                Upload term sheets, LOIs, financial statements, or other deal documents for AI analysis and data extraction.
              </p>

              <FileUpload
                accept={['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt']}
                maxSize={50 * 1024 * 1024} // 50MB
                maxFiles={10}
                multiple
                enableVirusscan
                showMetadata
                label="Document Upload"
                description="PDF, Word, Excel, or text files up to 50MB each"
                onUpload={handleFileUpload}
                variant="card"
                size="lg"
              />

              {session && session.files.length > 0 && (
                <div className="mt-6">
                  <h5 className="text-md font-medium text-white mb-3">Uploaded Files</h5>
                  <div className="space-y-2">
                    {session.files.map((file) => {
                      const result = session.results[file.id]
                      const isProcessing = session.isProcessing && !result
                      
                      return (
                        <div
                          key={file.id}
                          className={cn(
                            'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                            result ? 'border-green-500/30 bg-green-500/10' : 
                            isProcessing ? 'border-gold/30 bg-gold/10' :
                            'border-white/10 bg-navy-800/40',
                            selectedFileId === file.id && 'ring-2 ring-gold/50'
                          )}
                          onClick={() => setSelectedFileId(file.id)}
                        >
                          <FileText className="w-5 h-5 text-white/60" />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-white">{file.name}</div>
                            <div className="text-xs text-white/60">
                              {(file.size / 1024 / 1024).toFixed(1)} MB
                            </div>
                          </div>
                          
                          {isProcessing && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gold" />
                          )}
                          
                          {result && (
                            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {result.confidence}%
                            </Badge>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </FeatureCard>
        </TabsContent>

        {/* Analysis Results Tab */}
        <TabsContent value="analysis" className="space-y-6">
          {selectedResult ? (
            <AnalysisResultView 
              result={selectedResult}
              onAcceptData={() => handleAcceptData(selectedResult)}
            />
          ) : (
            <FeatureCard variant="glass" className="border-gold/20">
              <div className="p-8 text-center">
                <Brain className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-white mb-2">No Analysis Selected</h4>
                <p className="text-white/60">
                  Upload documents or select an analyzed file to view results
                </p>
              </div>
            </FeatureCard>
          )}
        </TabsContent>

        {/* Review & Feedback Tab */}
        <TabsContent value="review" className="space-y-6">
          {selectedResult ? (
            <FeedbackPanel
              result={selectedResult}
              feedback={userFeedback[selectedResult.analysisId] || ''}
              onFeedbackChange={(feedback) => 
                setUserFeedback(prev => ({ ...prev, [selectedResult.analysisId]: feedback }))
              }
              onSubmitFeedback={() => handleSubmitFeedback(selectedResult.analysisId)}
            />
          ) : (
            <FeatureCard variant="glass" className="border-gold/20">
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-white mb-2">No Analysis to Review</h4>
                <p className="text-white/60">
                  Complete an analysis to provide feedback and improve accuracy
                </p>
              </div>
            </FeatureCard>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Analysis Result View Component
function AnalysisResultView({ 
  result, 
  onAcceptData 
}: { 
  result: DocumentAnalysisResult
  onAcceptData: () => void 
}) {
  const overallConfidence = DocumentAnalysisUtils.calculateOverallConfidence(result)
  const criticalFlags = DocumentAnalysisUtils.getCriticalFlags(result)
  const requiresReview = DocumentAnalysisUtils.requiresReview(result)

  return (
    <div className="space-y-6">
      {/* Analysis Overview */}
      <FeatureCard variant="glass" className="border-gold/20">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">Analysis Results</h4>
            <div className="flex gap-2">
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs",
                  overallConfidence >= 90 ? "bg-green-500/20 text-green-400 border-green-500/30" :
                  overallConfidence >= 70 ? "bg-gold/20 text-gold border-gold/30" :
                  "bg-red-500/20 text-red-400 border-red-500/30"
                )}
              >
                {overallConfidence.toFixed(0)}% Confidence
              </Badge>
              
              {requiresReview && (
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                  <Eye className="w-3 h-3 mr-1" />
                  Requires Review
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <div className="text-2xl font-bold text-white">{result.confidence}%</div>
              <div className="text-xs text-white/60">AI Confidence</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{result.qualityScore}%</div>
              <div className="text-xs text-white/60">Data Quality</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{(result.processingTime / 1000).toFixed(1)}s</div>
              <div className="text-xs text-white/60">Processing Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{result.validation.length}</div>
              <div className="text-xs text-white/60">Fields Validated</div>
            </div>
          </div>

          {criticalFlags.length > 0 && (
            <Alert className="border-red-500/30 bg-red-500/10 mb-4">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400">
                {criticalFlags.length} critical issue{criticalFlags.length !== 1 ? 's' : ''} found. Review required before proceeding.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button
              onClick={onAcceptData}
              disabled={requiresReview}
              className="bg-gold hover:bg-gold/80 text-navy-900 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 mr-2" />
              Auto-Populate Form
            </Button>
            
            <Button variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </FeatureCard>

      {/* Extracted Data */}
      <ExtractedDataView data={result.extractedData} />

      {/* Validation Results */}
      {result.validation.length > 0 && (
        <ValidationResultsView validations={result.validation} />
      )}

      {/* Analysis Flags */}
      {result.flags.length > 0 && (
        <AnalysisFlagsView flags={result.flags} />
      )}
    </div>
  )
}

// Extracted Data View Component
function ExtractedDataView({ data }: { data: ExtractedDealData }) {
  const dataEntries = Object.entries(data).filter(([_, value]) => value !== undefined && value !== null)

  return (
    <FeatureCard variant="glass" className="border-gold/20">
      <div className="p-6">
        <h5 className="text-md font-semibold text-white mb-4">Extracted Deal Data</h5>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dataEntries.map(([key, value]) => (
            <div key={key} className="space-y-1">
              <label className="text-xs font-medium text-white/70 uppercase tracking-wide">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <div className="text-sm text-white font-medium">
                {value instanceof Date ? value.toLocaleDateString() :
                 typeof value === 'number' ? value.toLocaleString() :
                 typeof value === 'object' ? JSON.stringify(value, null, 2) :
                 String(value)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </FeatureCard>
  )
}

// Validation Results View Component
function ValidationResultsView({ validations }: { validations: ValidationResult[] }) {
  return (
    <FeatureCard variant="glass" className="border-gold/20">
      <div className="p-6">
        <h5 className="text-md font-semibold text-white mb-4">Field Validation</h5>
        
        <div className="space-y-3">
          {validations.map((validation, index) => {
            const statusColors = getStatusColor('risk', validation.status === 'valid' ? 'low' : 'high')
            
            return (
              <div key={index} className={cn(
                'flex items-center justify-between p-3 rounded-lg border',
                statusColors.border,
                statusColors.bg
              )}>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{validation.field}</div>
                  <div className="text-xs text-white/60">{validation.message}</div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs bg-white/10 text-white/70">
                    {validation.confidence}%
                  </Badge>
                  
                  {validation.status === 'valid' ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </FeatureCard>
  )
}

// Analysis Flags View Component
function AnalysisFlagsView({ flags }: { flags: AnalysisFlag[] }) {
  return (
    <FeatureCard variant="glass" className="border-gold/20">
      <div className="p-6">
        <h5 className="text-md font-semibold text-white mb-4">Analysis Flags</h5>
        
        <div className="space-y-3">
          {flags.map((flag, index) => {
            const severityColors = {
              info: 'border-blue-500/30 bg-blue-500/10',
              warning: 'border-yellow-500/30 bg-yellow-500/10',
              error: 'border-red-500/30 bg-red-500/10',
              critical: 'border-red-600/50 bg-red-600/20'
            }
            
            return (
              <div key={index} className={cn(
                'p-3 rounded-lg border',
                severityColors[flag.severity]
              )}>
                <div className="flex items-start gap-3">
                  <AlertCircle className={cn(
                    'w-4 h-4 mt-0.5',
                    flag.severity === 'critical' || flag.severity === 'error' ? 'text-red-400' :
                    flag.severity === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                  )} />
                  
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{flag.message}</div>
                    {flag.suggestion && (
                      <div className="text-xs text-white/60 mt-1">{flag.suggestion}</div>
                    )}
                  </div>
                  
                  <Badge variant="secondary" className="text-xs">
                    {flag.severity}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </FeatureCard>
  )
}

// Feedback Panel Component
function FeedbackPanel({
  result,
  feedback,
  onFeedbackChange,
  onSubmitFeedback
}: {
  result: DocumentAnalysisResult
  feedback: string
  onFeedbackChange: (feedback: string) => void
  onSubmitFeedback: () => void
}) {
  return (
    <FeatureCard variant="glass" className="border-gold/20">
      <div className="p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Analysis Feedback</h4>
        <p className="text-white/60 mb-6">
          Help improve Jeeves AI by providing feedback on the analysis accuracy and suggestions for improvement.
        </p>

        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-green-500/30 text-green-400 hover:bg-green-500/10"
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Accurate Analysis
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <ThumbsDown className="w-4 h-4 mr-2" />
              Needs Improvement
            </Button>
          </div>

          <Separator className="bg-gold/20" />

          {/* Detailed Feedback */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white">Detailed Feedback</label>
            <Textarea
              value={feedback}
              onChange={(e) => onFeedbackChange(e.target.value)}
              placeholder="Describe any inaccuracies, missing data, or suggestions for improvement..."
              className="min-h-[100px] bg-navy-800/60 border-gold/20 text-white placeholder:text-white/50 focus:border-gold"
            />
          </div>

          <Button
            onClick={onSubmitFeedback}
            disabled={!feedback.trim()}
            className="bg-gold hover:bg-gold/80 text-navy-900 disabled:opacity-50"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Submit Feedback
          </Button>
        </div>
      </div>
    </FeatureCard>
  )
}