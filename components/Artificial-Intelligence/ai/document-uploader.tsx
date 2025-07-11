"use client"

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  File, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  X,
  Download,
  Eye
} from 'lucide-react'
import { DocumentAnalysis } from '@/types/financial'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'

interface UploadedFile {
  file: File
  id: string
  status: 'uploading' | 'processing' | 'completed' | 'error'
  progress: number
  analysis?: DocumentAnalysis
}

interface DocumentUploaderProps {
  onAnalysisComplete: (analysis: DocumentAnalysis) => void
}

export function DocumentUploader({ onAnalysisComplete }: DocumentUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(file => {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
      return validTypes.includes(file.type) || file.name.endsWith('.pdf') || file.name.endsWith('.doc') || file.name.endsWith('.docx') || file.name.endsWith('.txt')
    })

    if (validFiles.length === 0) return

    const newFiles: UploadedFile[] = validFiles.slice(0, 5).map(file => ({
      file,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'uploading',
      progress: 0
    }))

    setUploadedFiles(prev => [...prev, ...newFiles])

    // Simulate upload and processing
    newFiles.forEach(uploadedFile => {
      simulateProcessing(uploadedFile.id)
    })
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFiles(files)
    }
  }, [handleFiles])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
  }, [handleFiles])

  const simulateProcessing = async (fileId: string) => {
    // Upload phase
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, progress: i } : f
      ))
    }

    // Processing phase
    setUploadedFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: 'processing', progress: 0 } : f
    ))

    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300))
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, progress: i } : f
      ))
    }

    // Completion
    const mockAnalysis: DocumentAnalysis = {
      id: `analysis_${fileId}`,
      documentId: fileId,
      status: 'completed',
      confidence: 0.85 + Math.random() * 0.1,
      extractedData: {
        dealType: Math.random() > 0.5 ? 'buy' : 'sell',
        assetType: 'BTC',
        amount: Math.round((Math.random() * 100 + 10) * 100) / 100,
        price: Math.round((95000 + Math.random() * 10000) * 100) / 100,
        parties: {
          buyer: 'Institutional Client',
          seller: 'Digital Asset Provider',
          introducer: 'Buckingham Vault'
        },
        timeframe: {
          proposedClosing: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        additionalTerms: [
          'AAA forensic rating required',
          'Escrow settlement mandatory',
          'Enhanced KYC verification'
        ]
      },
      suggestedActions: [
        'Create deal entry',
        'Schedule compliance review',
        'Prepare settlement documentation'
      ],
      reviewRequired: false,
      processedAt: new Date(),
    }

    setUploadedFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, status: 'completed', progress: 100, analysis: mockAnalysis }
        : f
    ))

    onAnalysisComplete(mockAnalysis)
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />
    }
  }

  const getStatusColor = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'error':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
    }
  }

  return (
    <Card className="glass-morphism border-gold/20 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-gold" />
          Document Analysis
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Drop Zone */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-gold/50 bg-gold/5' 
              : 'border-gold/20 hover:border-gold/40 hover:bg-gold/5'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Upload className="w-12 h-12 text-gold mx-auto mb-4" />
          
          {isDragActive ? (
            <p className="text-white/90">Drop documents here...</p>
          ) : (
            <div className="space-y-2">
              <p className="text-white/90 font-medium">
                Upload documents for analysis
              </p>
              <p className="text-white/60 text-sm">
                Drag & drop files here, or click to select
              </p>
              <p className="text-white/50 text-xs">
                Supports PDF, DOC, DOCX, TXT (max 5 files)
              </p>
            </div>
          )}
        </motion.div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="flex-1">
            <h4 className="text-sm font-medium text-white/90 mb-3">
              Processing Queue ({uploadedFiles.length})
            </h4>
            
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                <AnimatePresence>
                  {uploadedFiles.map((uploadedFile) => (
                    <motion.div
                      key={uploadedFile.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-navy/50 border border-gold/10 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <File className="w-4 h-4 text-white/50 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-white truncate">
                              {uploadedFile.file.name}
                            </p>
                            <p className="text-xs text-white/50">
                              {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${getStatusColor(uploadedFile.status)}`}>
                            {getStatusIcon(uploadedFile.status)}
                            <span className="ml-1 capitalize">{uploadedFile.status}</span>
                          </Badge>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(uploadedFile.id)}
                            className="h-6 w-6 p-0 text-white/50 hover:text-white hover:bg-white/10"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {(uploadedFile.status === 'uploading' || uploadedFile.status === 'processing') && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-white/60">
                              {uploadedFile.status === 'uploading' ? 'Uploading...' : 'Analyzing...'}
                            </span>
                            <span className="text-white/60">{uploadedFile.progress}%</span>
                          </div>
                          <Progress 
                            value={uploadedFile.progress} 
                            className="h-1 bg-navy/70"
                          />
                        </div>
                      )}

                      {/* Analysis Results */}
                      {uploadedFile.status === 'completed' && uploadedFile.analysis && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 pt-3 border-t border-gold/20 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white/70">Confidence</span>
                            <Badge className="bg-green-500/20 text-green-300 text-xs">
                              {Math.round(uploadedFile.analysis.confidence * 100)}%
                            </Badge>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs border-gold/30 text-white/80 hover:bg-gold/10 h-7"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View Analysis
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs border-gold/30 text-white/80 hover:bg-gold/10 h-7"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Export
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  )
}