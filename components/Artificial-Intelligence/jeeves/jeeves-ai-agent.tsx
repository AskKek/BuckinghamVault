"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { 
  Bot, 
  Upload, 
  FileText, 
  Image, 
  File, 
  Send, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Eye, 
  Sparkles, 
  Brain, 
  MessageSquare, 
  Clock, 
  Star, 
  Zap, 
  FileCheck, 
  Search, 
  Settings, 
  MoreHorizontal, 
  ThumbsUp, 
  ThumbsDown, 
  RefreshCcw,
  Crown,
  Target,
  TrendingUp
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useSecureAuth } from '@/hooks/use-secure-auth'
import { cn } from '@/lib/utils'

// Enhanced type definitions
interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: Date
  status: 'uploading' | 'processing' | 'completed' | 'error'
  analysisId?: string
}

interface DocumentAnalysis {
  id: string
  documentId: string
  status: 'processing' | 'completed' | 'error'
  confidence: number
  extractedData: {
    dealType?: 'buy' | 'sell'
    assetType?: string
    amount?: number
    price?: number
    parties: {
      buyer?: string
      seller?: string
      introducer?: string
    }
    settlementDetails?: {
      method: string
      estimatedSettlementTime?: number
      fees?: Array<{
        type: string
        amount: number
        currency: string
        description: string
      }>
    }
    timeframe?: {
      proposedClosing?: Date
      validUntil?: Date
    }
    additionalTerms?: string[]
  }
  suggestedActions: string[]
  reviewRequired: boolean
  processedAt: Date
  reviewedBy?: string
  reviewedAt?: Date
  feedback?: {
    rating: number
    comment: string
    corrections?: Record<string, any>
  }
}

interface ChatMessage {
  id: string
  role: 'user' | 'jeeves'
  content: string
  timestamp: Date
  metadata?: {
    confidence?: number
    suggestedActions?: string[]
    relatedDocuments?: string[]
    extractedData?: any
  }
}

interface JeevesChat {
  id: string
  userId: string
  messages: ChatMessage[]
  context?: {
    dealId?: string
    documentId?: string
    topic: string
  }
  startedAt: Date
  lastMessageAt: Date
}

// Mock data for demonstration
const mockAnalyses: DocumentAnalysis[] = [
  {
    id: 'analysis_001',
    documentId: 'doc_001',
    status: 'completed',
    confidence: 0.94,
    extractedData: {
      dealType: 'buy',
      assetType: 'BTC',
      amount: 50,
      price: 98500,
      parties: {
        buyer: 'Pemberton Family Office',
        seller: 'Sovereign Digital Assets',
        introducer: 'Charles Pemberton III'
      },
      settlementDetails: {
        method: 'escrow_to_escrow',
        estimatedSettlementTime: 72,
        fees: [
          {
            type: 'escrow',
            amount: 14775,
            currency: 'USD',
            description: 'BitGo escrow service fee (0.3%)'
          }
        ]
      },
      timeframe: {
        proposedClosing: new Date('2025-01-10T17:00:00Z'),
        validUntil: new Date('2025-01-20T17:00:00Z')
      },
      additionalTerms: [
        'AAA forensic rating required',
        'BitGo institutional custody',
        'Wire transfer for fiat settlement',
        'Force majeure clauses included'
      ]
    },
    suggestedActions: [
      'Verify counterparty credentials',
      'Confirm escrow arrangements', 
      'Schedule compliance review',
      'Prepare settlement documentation'
    ],
    reviewRequired: false,
    processedAt: new Date('2025-01-02T14:31:30Z')
  }
]

// Jeeves personality responses
const jeevesResponses = {
  greeting: [
    "Good day, how may I assist you with your financial documentation today?",
    "At your service. Shall I review any documents for you today?",
    "I trust you're having a productive day. How might I be of assistance?",
    "Ready to analyze your documents with utmost precision, as always."
  ],
  processing: [
    "Allow me a moment to thoroughly examine this document...",
    "Analyzing the documentation with meticulous attention to detail...",
    "Processing the terms and conditions as we speak...", 
    "Conducting a comprehensive review of the submitted materials..."
  ],
  confidence: {
    high: "I'm quite confident in this analysis, sir/madam.",
    medium: "The analysis appears sound, though I recommend a second review.",
    low: "I must advise caution - this document requires human verification."
  },
  suggestions: [
    "Might I suggest reviewing the counterparty credentials?",
    "I would recommend confirming the settlement arrangements.",
    "Perhaps we should schedule a compliance review?",
    "Would you like me to prepare the standard documentation?"
  ]
}

// File type validation
const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'text/plain': ['.txt']
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// Chat input validation
const chatSchema = z.object({
  message: z.string().min(1, 'Please enter a message').max(500, 'Message too long')
})

type ChatFormData = z.infer<typeof chatSchema>

// Document Preview Component
function DocumentPreview({ file, analysis }: { file: UploadedFile, analysis?: DocumentAnalysis }) {
  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return FileText
    if (type.includes('image')) return Image
    if (type.includes('word') || type.includes('document')) return FileText
    if (type.includes('sheet') || type.includes('excel')) return FileText
    return File
  }

  const IconComponent = getFileIcon(file.type)

  return (
    <Card className="glass-morphism border-gold/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 glass-morphism rounded-lg flex items-center justify-center">
              <IconComponent className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h4 className="text-white font-medium truncate max-w-[200px]">{file.name}</h4>
              <p className="text-xs text-white/60">
                {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type.split('/')[1].toUpperCase()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost">
              <Eye className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/70">Status</span>
            <Badge className={cn(
              "text-xs",
              file.status === 'completed' ? 'bg-green-500/20 text-green-300' :
              file.status === 'processing' ? 'bg-blue-500/20 text-blue-300' :
              file.status === 'error' ? 'bg-red-500/20 text-red-300' :
              'bg-yellow-500/20 text-yellow-300'
            )}>
              {file.status}
            </Badge>
          </div>
          
          {analysis && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">Confidence</span>
                <div className="flex items-center space-x-2">
                  <Progress value={analysis.confidence * 100} className="w-16 h-2" />
                  <span className="text-xs text-white">{(analysis.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
              
              {analysis.extractedData.dealType && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-white">Extracted Data</h5>
                  <div className="text-xs space-y-1 text-white/70">
                    <div>Type: <span className="text-white">{analysis.extractedData.dealType?.toUpperCase()}</span></div>
                    <div>Asset: <span className="text-white">{analysis.extractedData.assetType}</span></div>
                    <div>Amount: <span className="text-white">{analysis.extractedData.amount}</span></div>
                    {analysis.extractedData.price && (
                      <div>Price: <span className="text-white">${analysis.extractedData.price?.toLocaleString()}</span></div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Chat Message Component  
function ChatMessageComponent({ message, onFeedback }: { 
  message: ChatMessage, 
  onFeedback?: (messageId: string, rating: number, comment?: string) => void 
}) {
  const [showFeedback, setShowFeedback] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-start space-x-3 mb-6",
        message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center",
        message.role === 'jeeves' 
          ? 'bg-gradient-to-r from-gold/20 to-gold/10 border border-gold/30'
          : 'bg-navy/60 border border-white/20'
      )}>
        {message.role === 'jeeves' ? (
          <Crown className="w-4 h-4 text-gold" />
        ) : (
          <div className="w-3 h-3 rounded-full bg-white/70" />
        )}
      </div>
      
      <div className={cn(
        "flex-1 max-w-[80%]",
        message.role === 'user' ? 'text-right' : ''
      )}>
        <div className={cn(
          "inline-block p-4 rounded-lg",
          message.role === 'jeeves'
            ? 'bg-navy/60 border border-gold/20 text-white'
            : 'bg-gold/20 border border-gold/30 text-navy-900'
        )}>
          <p className="text-sm leading-relaxed">{message.content}</p>
          
          {message.metadata && (
            <div className="mt-3 pt-3 border-t border-white/10">
              {message.metadata.confidence && (
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs text-white/70">Confidence:</span>
                  <Progress value={message.metadata.confidence * 100} className="w-16 h-1" />
                  <span className="text-xs text-white">{(message.metadata.confidence * 100).toFixed(0)}%</span>
                </div>
              )}
              
              {message.metadata.suggestedActions && (
                <div className="space-y-1">
                  <span className="text-xs text-white/70">Suggested Actions:</span>
                  {message.metadata.suggestedActions.map((action, index) => (
                    <div key={index} className="text-xs text-white/90">• {action}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 mt-2 text-xs text-white/50">
          <span>{message.timestamp.toLocaleTimeString()}</span>
          
          {message.role === 'jeeves' && onFeedback && (
            <div className="flex items-center space-x-1">
              <Button
                size="sm"
                variant="ghost" 
                className="h-6 w-6 p-0 hover:bg-white/10"
                onClick={() => onFeedback(message.id, 1)}
              >
                <ThumbsUp className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 hover:bg-white/10"
                onClick={() => onFeedback(message.id, -1)}
              >
                <ThumbsDown className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Main Component
export function JeevesAIAgent() {
  const { user } = useSecureAuth()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [analyses, setAnalyses] = useState<DocumentAnalysis[]>(mockAnalyses)
  const [currentChat, setCurrentChat] = useState<JeevesChat | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState('upload')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const chatForm = useForm<ChatFormData>({
    resolver: zodResolver(chatSchema),
    defaultValues: { message: '' }
  })

  // File upload handling
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const uploadedFile: UploadedFile = {
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        uploadedAt: new Date(),
        status: 'uploading'
      }

      setUploadedFiles(prev => [...prev, uploadedFile])

      // Simulate upload and processing
      setTimeout(() => {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === uploadedFile.id 
              ? { ...f, status: 'processing' }
              : f
          )
        )

        // Simulate AI analysis
        setTimeout(() => {
          const analysis: DocumentAnalysis = {
            id: `analysis_${Date.now()}`,
            documentId: uploadedFile.id,
            status: 'completed',
            confidence: 0.85 + Math.random() * 0.15,
            extractedData: {
              dealType: Math.random() > 0.5 ? 'buy' : 'sell',
              assetType: ['BTC', 'ETH', 'USDT'][Math.floor(Math.random() * 3)],
              amount: Math.floor(Math.random() * 100) + 1,
              price: Math.floor(Math.random() * 100000) + 50000,
              parties: {
                buyer: 'Sample Buyer Corp',
                seller: 'Sample Seller Inc'
              }
            },
            suggestedActions: [
              'Verify counterparty credentials',
              'Confirm settlement terms',
              'Schedule compliance review'
            ],
            reviewRequired: Math.random() > 0.7,
            processedAt: new Date()
          }

          setAnalyses(prev => [...prev, analysis])
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === uploadedFile.id 
                ? { ...f, status: 'completed', analysisId: analysis.id }
                : f
            )
          )

          // Auto-start chat with analysis results
          handleStartChat(analysis)
        }, 3000)
      }, 1000)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    maxFiles: 5
  })

  // Chat handling
  const handleStartChat = (analysis?: DocumentAnalysis) => {
    const greeting = jeevesResponses.greeting[Math.floor(Math.random() * jeevesResponses.greeting.length)]
    
    const chat: JeevesChat = {
      id: `chat_${Date.now()}`,
      userId: user?.id || 'anonymous',
      messages: [
        {
          id: `msg_${Date.now()}`,
          role: 'jeeves',
          content: analysis 
            ? `${greeting} I've completed the analysis of your document and found some interesting details. The document appears to be a ${analysis.extractedData.dealType} order for ${analysis.extractedData.amount} ${analysis.extractedData.assetType} with a confidence level of ${(analysis.confidence * 100).toFixed(0)}%. Shall I proceed with creating a deal entry based on these findings?`
            : greeting,
          timestamp: new Date(),
          metadata: analysis ? {
            confidence: analysis.confidence,
            suggestedActions: analysis.suggestedActions,
            extractedData: analysis.extractedData
          } : undefined
        }
      ],
      context: {
        documentId: analysis?.documentId,
        topic: analysis ? 'document_analysis' : 'general'
      },
      startedAt: new Date(),
      lastMessageAt: new Date()
    }

    setCurrentChat(chat)
    setActiveTab('chat')
  }

  const handleSendMessage = (data: ChatFormData) => {
    if (!currentChat) return

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: data.message,
      timestamp: new Date()
    }

    setCurrentChat(prev => prev ? {
      ...prev,
      messages: [...prev.messages, userMessage],
      lastMessageAt: new Date()
    } : null)

    chatForm.reset()
    setIsProcessing(true)

    // Simulate Jeeves response
    setTimeout(() => {
      const responses = [
        "Excellent question. Based on the documentation provided, I would recommend proceeding with enhanced due diligence on the counterparty.",
        "I've noted that detail, sir/madam. The terms appear quite favorable, though I would suggest reviewing the settlement timeline.",
        "Most astute observation. I shall prepare the necessary documentation accordingly.",
        "Indeed, that aligns with my analysis. Shall I proceed with the recommended actions?",
        "A prudent inquiry. I believe we should examine the regulatory implications more closely."
      ]

      const jeevesMessage: ChatMessage = {
        id: `msg_${Date.now()}_jeeves`,
        role: 'jeeves',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        metadata: {
          confidence: 0.8 + Math.random() * 0.2,
          suggestedActions: [
            'Review counterparty credentials',
            'Prepare settlement documentation'
          ]
        }
      }

      setCurrentChat(prev => prev ? {
        ...prev,
        messages: [...prev.messages, jeevesMessage],
        lastMessageAt: new Date()
      } : null)

      setIsProcessing(false)
    }, 1500)
  }

  const handleFeedback = (messageId: string, rating: number, comment?: string) => {
    // Handle user feedback for AI improvement
    console.log('Feedback received:', { messageId, rating, comment })
  }

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentChat?.messages])

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="w-20 h-20 mx-auto glass-morphism rounded-2xl flex items-center justify-center">
          <Crown className="w-10 h-10 text-gold" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Jeeves AI</h1>
          <p className="text-white/70 mt-2">
            Your sophisticated AI butler for document analysis and deal structuring
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-navy/60 border border-gold/20 grid w-full grid-cols-4">
            <TabsTrigger value="upload" className="data-[state=active]:bg-gold data-[state=active]:text-navy">
              Upload
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-gold data-[state=active]:text-navy">
              Chat
            </TabsTrigger>
            <TabsTrigger value="analyses" className="data-[state=active]:bg-gold data-[state=active]:text-navy">
              Analyses
            </TabsTrigger>
            <TabsTrigger value="workflow" className="data-[state=active]:bg-gold data-[state=active]:text-navy">
              Workflow
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            {/* Upload Zone */}
            <Card className="glass-morphism border-gold/20">
              <CardContent className="p-8">
                <div
                  {...getRootProps()}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                    isDragActive 
                      ? "border-gold bg-gold/10" 
                      : "border-white/20 hover:border-gold/50"
                  )}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 text-gold mx-auto mb-4" />
                  
                  {isDragActive ? (
                    <p className="text-white text-lg">Drop the files here...</p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-white text-lg">
                        Drag & drop your documents here, or click to browse
                      </p>
                      <p className="text-white/60 text-sm">
                        Supports PDF, Word, Excel, and image files up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-display font-semibold text-white">
                  Uploaded Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uploadedFiles.map((file) => {
                    const analysis = analyses.find(a => a.documentId === file.id)
                    return (
                      <DocumentPreview key={file.id} file={file} analysis={analysis} />
                    )
                  })}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            {currentChat ? (
              <Card className="glass-morphism border-gold/20 h-[600px] flex flex-col">
                <CardHeader className="border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Chat with Jeeves
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setCurrentChat(null)}
                    >
                      <RefreshCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    {currentChat.messages.map((message) => (
                      <ChatMessageComponent
                        key={message.id}
                        message={message}
                        onFeedback={handleFeedback}
                      />
                    ))}
                    
                    {isProcessing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gold/20 to-gold/10 border border-gold/30 flex items-center justify-center">
                          <Crown className="w-4 h-4 text-gold" />
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gold/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-gold/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-gold/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </motion.div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>
                
                <div className="border-t border-white/10 p-4">
                  <form onSubmit={chatForm.handleSubmit(handleSendMessage)} className="flex space-x-2">
                    <Input
                      {...chatForm.register('message')}
                      placeholder="Ask Jeeves about your documents..."
                      className="flex-1 bg-navy/50 border-gold/20 text-white"
                      disabled={isProcessing}
                    />
                    <Button
                      type="submit"
                      className="bg-gold hover:bg-gold-light text-navy"
                      disabled={isProcessing}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </Card>
            ) : (
              <Card className="glass-morphism border-gold/20">
                <CardContent className="p-12 text-center">
                  <Bot className="w-16 h-16 text-gold/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Start a Conversation</h3>
                  <p className="text-white/70 mb-6">
                    Upload a document or click below to begin chatting with Jeeves
                  </p>
                  <Button
                    onClick={() => handleStartChat()}
                    className="bg-gold hover:bg-gold-light text-navy"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analyses" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analyses.map((analysis) => {
                const file = uploadedFiles.find(f => f.id === analysis.documentId)
                return (
                  <motion.div
                    key={analysis.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="glass-morphism border-gold/20">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white text-lg">
                            {file?.name || 'Document Analysis'}
                          </CardTitle>
                          <Badge className={cn(
                            "text-xs",
                            analysis.confidence > 0.9 ? 'bg-green-500/20 text-green-300' :
                            analysis.confidence > 0.7 ? 'bg-blue-500/20 text-blue-300' :
                            'bg-yellow-500/20 text-yellow-300'
                          )}>
                            {(analysis.confidence * 100).toFixed(0)}% confident
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {analysis.extractedData.dealType && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-white">Extracted Information</h4>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <span className="text-white/70">Type:</span>
                                <span className="ml-2 text-white">{analysis.extractedData.dealType?.toUpperCase()}</span>
                              </div>
                              <div>
                                <span className="text-white/70">Asset:</span>
                                <span className="ml-2 text-white">{analysis.extractedData.assetType}</span>
                              </div>
                              <div>
                                <span className="text-white/70">Amount:</span>
                                <span className="ml-2 text-white">{analysis.extractedData.amount}</span>
                              </div>
                              <div>
                                <span className="text-white/70">Price:</span>
                                <span className="ml-2 text-white">${analysis.extractedData.price?.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-white">Suggested Actions</h4>
                          <div className="space-y-1">
                            {analysis.suggestedActions.map((action, index) => (
                              <div key={index} className="text-xs text-white/70 flex items-center">
                                <Target className="w-3 h-3 mr-2 text-gold" />
                                {action}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 pt-3">
                          <Button size="sm" className="bg-gold hover:bg-gold-light text-navy">
                            <FileCheck className="w-4 h-4 mr-1" />
                            Create Deal
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Discuss
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="workflow" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Document Upload',
                  description: 'Upload contracts, agreements, and supporting documents',
                  icon: Upload,
                  status: 'completed'
                },
                {
                  title: 'AI Analysis',
                  description: 'Jeeves extracts key terms and identifies deal structure',
                  icon: Brain,
                  status: 'active'
                },
                {
                  title: 'Deal Creation',
                  description: 'Auto-populate deal tracker with verified information',
                  icon: TrendingUp,
                  status: 'pending'
                }
              ].map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={cn(
                    "glass-morphism border-gold/20",
                    step.status === 'active' && 'border-gold/50 bg-gold/5'
                  )}>
                    <CardContent className="p-6 text-center">
                      <div className={cn(
                        "w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4",
                        step.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                        step.status === 'active' ? 'bg-gold/20 text-gold' :
                        'bg-white/10 text-white/50'
                      )}>
                        <step.icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                      <p className="text-sm text-white/70">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}