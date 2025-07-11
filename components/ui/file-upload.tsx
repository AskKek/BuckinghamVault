"use client"

/**
 * Enterprise File Upload Component
 * Secure, feature-rich file upload for institutional documents
 */

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  File, 
  Image, 
  FileText, 
  Video, 
  Music,
  Archive,
  X,
  Check,
  AlertTriangle,
  Eye,
  Download,
  Trash2,
  Lock,
  Shield,
  Scan,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { getThemeClasses, THEME_ANIMATIONS } from '@/lib/theme'

export interface FileItem {
  id: string
  file: File
  name: string
  size: number
  type: string
  status: 'pending' | 'uploading' | 'completed' | 'error' | 'scanning' | 'quarantined'
  progress?: number
  error?: string
  url?: string
  metadata?: {
    lastModified: number
    hash?: string
    scanResult?: 'clean' | 'suspicious' | 'malware'
    encrypted?: boolean
    compressed?: boolean
  }
}

export interface FileUploadProps {
  // Core functionality
  onUpload?: (files: FileItem[]) => Promise<void>
  onRemove?: (fileId: string) => void
  onChange?: (files: FileItem[]) => void
  
  // File restrictions
  accept?: string[]
  maxSize?: number // in bytes
  maxFiles?: number
  minFiles?: number
  
  // Security features
  enableVirusscan?: boolean
  enableEncryption?: boolean
  requireSignature?: boolean
  allowedMimeTypes?: string[]
  blockedExtensions?: string[]
  
  // UI customization
  variant?: 'default' | 'compact' | 'card' | 'minimal'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  multiple?: boolean
  showPreview?: boolean
  showProgress?: boolean
  showMetadata?: boolean
  
  // Labels and text
  label?: string
  description?: string
  dragText?: string
  browseText?: string
  uploadingText?: string
  completedText?: string
  errorText?: string
  
  // Initial files
  defaultFiles?: FileItem[]
  
  // Styling
  className?: string
  dropzoneClassName?: string
  fileListClassName?: string
  
  // Callbacks
  onFileSelect?: (files: File[]) => void
  onUploadStart?: (fileId: string) => void
  onUploadProgress?: (fileId: string, progress: number) => void
  onUploadComplete?: (fileId: string, url?: string) => void
  onUploadError?: (fileId: string, error: string) => void
  onScanComplete?: (fileId: string, result: 'clean' | 'suspicious' | 'malware') => void
}

// File type icons
const getFileIcon = (type: string, size: 'sm' | 'md' | 'lg' = 'md') => {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5', 
    lg: 'w-6 h-6'
  }
  
  const iconClass = cn('text-white/60', iconSizes[size])
  
  if (type.startsWith('image/')) return <Image className={iconClass} />
  if (type.startsWith('video/')) return <Video className={iconClass} />
  if (type.startsWith('audio/')) return <Music className={iconClass} />
  if (type.includes('pdf') || type.includes('document')) return <FileText className={iconClass} />
  if (type.includes('zip') || type.includes('rar') || type.includes('archive')) return <Archive className={iconClass} />
  return <File className={iconClass} />
}

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// File item component
function FileListItem({ 
  file, 
  onRemove, 
  onPreview,
  showMetadata = false,
  className 
}: {
  file: FileItem
  onRemove?: (id: string) => void
  onPreview?: (file: FileItem) => void
  showMetadata?: boolean
  className?: string
}) {
  const getStatusIcon = () => {
    switch (file.status) {
      case 'uploading':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gold" />
      case 'completed':
        return <Check className="w-4 h-4 text-green-400" />
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      case 'scanning':
        return <Scan className="w-4 h-4 text-blue-400 animate-pulse" />
      case 'quarantined':
        return <Shield className="w-4 h-4 text-red-400" />
      default:
        return <Clock className="w-4 h-4 text-white/40" />
    }
  }

  const getStatusColor = () => {
    switch (file.status) {
      case 'uploading':
        return 'border-gold/30 bg-gold/10'
      case 'completed':
        return 'border-green-500/30 bg-green-500/10'
      case 'error':
      case 'quarantined':
        return 'border-red-500/30 bg-red-500/10'
      case 'scanning':
        return 'border-blue-500/30 bg-blue-500/10'
      default:
        return 'border-white/10 bg-navy-800/40'
    }
  }

  return (
    <motion.div
      {...THEME_ANIMATIONS.slideUp}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border backdrop-blur-sm',
        getStatusColor(),
        className
      )}
    >
      {/* File Icon */}
      <div className="flex-shrink-0">
        {getFileIcon(file.type)}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white truncate">
            {file.name}
          </span>
          
          {/* Security badges */}
          {file.metadata?.encrypted && (
            <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
              <Lock className="w-3 h-3 mr-1" />
              Encrypted
            </Badge>
          )}
          
          {file.metadata?.scanResult === 'clean' && (
            <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
              <Shield className="w-3 h-3 mr-1" />
              Scanned
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-white/60">
          <span>{formatFileSize(file.size)}</span>
          {showMetadata && file.metadata?.lastModified && (
            <>
              <span>•</span>
              <span>{new Date(file.metadata.lastModified).toLocaleDateString()}</span>
            </>
          )}
        </div>

        {/* Progress bar */}
        {file.status === 'uploading' && file.progress !== undefined && (
          <div className="mt-2">
            <Progress value={file.progress} className="h-1" />
          </div>
        )}

        {/* Error message */}
        {file.status === 'error' && file.error && (
          <div className="mt-1 text-xs text-red-400">
            {file.error}
          </div>
        )}
      </div>

      {/* Status */}
      <div className="flex-shrink-0">
        {getStatusIcon()}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {file.status === 'completed' && file.url && (
          <>
            {onPreview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPreview(file)}
                className="w-8 h-8 p-0 text-white/60 hover:text-white hover:bg-white/10"
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(file.url, '_blank')}
              className="w-8 h-8 p-0 text-white/60 hover:text-white hover:bg-white/10"
            >
              <Download className="w-4 h-4" />
            </Button>
          </>
        )}
        
        {onRemove && file.status !== 'uploading' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(file.id)}
            className="w-8 h-8 p-0 text-white/60 hover:text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </motion.div>
  )
}

export function FileUpload({
  onUpload,
  onRemove,
  onChange,
  
  // File restrictions
  accept = [],
  maxSize = 50 * 1024 * 1024, // 50MB
  maxFiles = 10,
  minFiles = 0,
  
  // Security
  enableVirusscan = true,
  enableEncryption = false,
  requireSignature = false,
  allowedMimeTypes = [],
  blockedExtensions = ['.exe', '.bat', '.cmd', '.scr'],
  
  // UI
  variant = 'default',
  size = 'md',
  disabled = false,
  multiple = true,
  showPreview = true,
  showProgress = true,
  showMetadata = false,
  
  // Labels
  label = 'Upload Files',
  description = 'Drag and drop files here or click to browse',
  dragText = 'Drop files here',
  browseText = 'Browse Files',
  uploadingText = 'Uploading...',
  completedText = 'Upload completed',
  errorText = 'Upload failed',
  
  // Initial files
  defaultFiles = [],
  
  // Styling
  className,
  dropzoneClassName,
  fileListClassName,
  
  // Callbacks
  onFileSelect,
  onUploadStart,
  onUploadProgress,
  onUploadComplete,
  onUploadError,
  onScanComplete
}: FileUploadProps) {
  const [files, setFiles] = useState<FileItem[]>(defaultFiles)
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Validate file
  const validateFile = useCallback((file: File): string | null => {
    // Size check
    if (file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)}`
    }

    // Extension check
    const extension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (blockedExtensions.includes(extension)) {
      return `File type ${extension} is not allowed`
    }

    // MIME type check
    if (allowedMimeTypes.length > 0 && !allowedMimeTypes.includes(file.type)) {
      return `File type ${file.type} is not allowed`
    }

    // Accept check
    if (accept.length > 0) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      const isAccepted = accept.some(acceptType => {
        if (acceptType.startsWith('.')) {
          return acceptType.slice(1) === fileExtension
        }
        if (acceptType.includes('/*')) {
          const baseType = acceptType.split('/')[0]
          return file.type.startsWith(baseType)
        }
        return acceptType === file.type
      })
      
      if (!isAccepted) {
        return `File type not accepted. Allowed: ${accept.join(', ')}`
      }
    }

    return null
  }, [maxSize, blockedExtensions, allowedMimeTypes, accept])

  // Process files
  const processFiles = useCallback(async (fileList: File[]) => {
    setError(null)

    // Check file count
    if (files.length + fileList.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`)
      return
    }

    const validFiles: FileItem[] = []
    const errors: string[] = []

    for (const file of fileList) {
      const validationError = validateFile(file)
      
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`)
        continue
      }

      const fileItem: FileItem = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'pending',
        metadata: {
          lastModified: file.lastModified
        }
      }

      validFiles.push(fileItem)
    }

    if (errors.length > 0) {
      setError(errors.join('; '))
    }

    if (validFiles.length > 0) {
      const newFiles = [...files, ...validFiles]
      setFiles(newFiles)
      onChange?.(newFiles)
      onFileSelect?.(validFiles.map(f => f.file))

      // Start upload process
      if (onUpload) {
        await startUploadProcess(validFiles)
      }
    }
  }, [files, maxFiles, validateFile, onChange, onFileSelect, onUpload])

  // Upload process simulation
  const startUploadProcess = useCallback(async (filesToUpload: FileItem[]) => {
    for (const fileItem of filesToUpload) {
      try {
        // Update status to uploading
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id 
            ? { ...f, status: 'uploading' as const, progress: 0 }
            : f
        ))
        
        onUploadStart?.(fileItem.id)

        // Simulate virus scanning if enabled
        if (enableVirusscan) {
          setFiles(prev => prev.map(f => 
            f.id === fileItem.id 
              ? { ...f, status: 'scanning' as const }
              : f
          ))

          // Simulate scan delay
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const scanResult = Math.random() > 0.1 ? 'clean' : (Math.random() > 0.5 ? 'suspicious' : 'malware') // Randomize scan results
          onScanComplete?.(fileItem.id, scanResult)

          if (scanResult === 'malware') {
            setFiles(prev => prev.map(f => 
              f.id === fileItem.id 
                ? { ...f, status: 'quarantined' as const, error: 'Malware detected' }
                : f
            ))
            onUploadError?.(fileItem.id, 'Malware detected')
            continue
          }

          setFiles(prev => prev.map(f => 
            f.id === fileItem.id 
              ? { 
                  ...f, 
                  status: 'uploading' as const, 
                  metadata: { 
                    lastModified: f.metadata?.lastModified || Date.now(),
                    ...f.metadata, 
                    scanResult 
                  }
                }
              : f
          ))
        }

        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100))
          
          setFiles(prev => prev.map(f => 
            f.id === fileItem.id 
              ? { ...f, progress }
              : f
          ))
          
          onUploadProgress?.(fileItem.id, progress)
        }

        // Complete upload
        const mockUrl = URL.createObjectURL(fileItem.file)
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id 
            ? { 
                ...f, 
                status: 'completed' as const, 
                progress: 100,
                url: mockUrl,
                metadata: {
                  lastModified: f.metadata?.lastModified || fileItem.file.lastModified,
                  ...f.metadata,
                  hash: 'sha256:' + Math.random().toString(36).substr(2, 16),
                  encrypted: enableEncryption
                }
              }
            : f
        ))
        
        onUploadComplete?.(fileItem.id, mockUrl)

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed'
        
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id 
            ? { ...f, status: 'error' as const, error: errorMessage }
            : f
        ))
        
        onUploadError?.(fileItem.id, errorMessage)
      }
    }

    // Call onUpload callback
    if (onUpload) {
      try {
        await onUpload(filesToUpload)
      } catch (error) {
        console.error('Upload callback error:', error)
      }
    }
  }, [enableVirusscan, enableEncryption, onUploadStart, onUploadProgress, onUploadComplete, onUploadError, onScanComplete, onUpload])

  // Handle file removal
  const handleRemoveFile = useCallback((fileId: string) => {
    const newFiles = files.filter(f => f.id !== fileId)
    setFiles(newFiles)
    onChange?.(newFiles)
    onRemove?.(fileId)
  }, [files, onChange, onRemove])

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragOver(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    if (disabled) return

    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }, [disabled, processFiles])

  // File input handler
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    processFiles(selectedFiles)
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [processFiles])

  // Size variants
  const sizeClasses = {
    sm: 'p-4 min-h-[120px]',
    md: 'p-6 min-h-[160px]',
    lg: 'p-8 min-h-[200px]'
  }

  // Variant classes
  const variantClasses = {
    default: 'border-2 border-dashed border-gold/30 bg-navy-800/40 rounded-lg',
    compact: 'border border-gold/20 bg-navy-800/60 rounded-md',
    card: 'border border-gold/20 bg-gradient-to-br from-navy-800 to-navy-900 rounded-lg shadow-xl',
    minimal: 'border border-white/10 bg-navy-900/60 rounded-md'
  }

  const hasFiles = files.length > 0
  const isUploading = files.some(f => f.status === 'uploading' || f.status === 'scanning')

  return (
    <div className={cn('space-y-4', className)}>
      {/* Label */}
      {label && (
        <div>
          <h3 className="text-sm font-medium text-white mb-1">{label}</h3>
          {description && (
            <p className="text-xs text-white/60">{description}</p>
          )}
        </div>
      )}

      {/* Upload Area */}
      <div
        className={cn(
          'relative transition-all duration-200 cursor-pointer',
          variantClasses[variant],
          sizeClasses[size],
          isDragOver && 'border-gold bg-gold/10',
          disabled && 'opacity-50 cursor-not-allowed',
          dropzoneClassName
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept.join(',')}
          onChange={handleFileInputChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <Upload className={cn(
            'mb-3 text-gold',
            size === 'sm' && 'w-8 h-8',
            size === 'md' && 'w-10 h-10',
            size === 'lg' && 'w-12 h-12'
          )} />
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-white">
              {isDragOver ? dragText : browseText}
            </p>
            <p className="text-xs text-white/60">
              {accept.length > 0 && `Accepted: ${accept.join(', ')}`}
              {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
              {maxFiles && ` • Max files: ${maxFiles}`}
            </p>
          </div>
        </div>

        {/* Security indicators */}
        {(enableVirusscan || enableEncryption || requireSignature) && (
          <div className="absolute bottom-2 right-2 flex gap-1">
            {enableVirusscan && (
              <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                <Shield className="w-3 h-3 mr-1" />
                Scanned
              </Badge>
            )}
            {enableEncryption && (
              <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                <Lock className="w-3 h-3 mr-1" />
                Encrypted
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-500/30 bg-red-500/10">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-400">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* File List */}
      {hasFiles && (
        <div className={cn('space-y-2', fileListClassName)}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">
              Files ({files.length})
            </span>
            
            {isUploading && (
              <Badge variant="secondary" className="text-xs bg-gold/20 text-gold border-gold/30">
                {uploadingText}
              </Badge>
            )}
          </div>

          <AnimatePresence mode="popLayout">
            {files.map((file) => (
              <FileListItem
                key={file.id}
                file={file}
                onRemove={handleRemoveFile}
                showMetadata={showMetadata}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Validation Summary */}
      {files.length >= minFiles && files.every(f => f.status === 'completed') && (
        <Alert className="border-green-500/30 bg-green-500/10">
          <Check className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-400">
            {completedText} ({files.length} file{files.length !== 1 ? 's' : ''})
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}