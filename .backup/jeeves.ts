/**
 * Jeeves AI API Service
 * Handles all AI assistant and document analysis operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, handleApiError } from './client'
import { queryKeys } from '@/lib/query-client'
import { ChatMessage, DocumentAnalysis } from '@/types/financial'

// Additional types for Jeeves API
export interface JeevesInsight {
  id: string
  type: 'market_trend' | 'recommendation' | 'alert'
  title: string
  content: string
  confidence: number
  priority: 'high' | 'medium' | 'low'
  createdAt: Date
  expiresAt?: Date
  metadata?: any
}

// Types
export interface ChatSession {
  id: string
  messages: ChatMessage[]
  context?: any
  createdAt: Date
  updatedAt: Date
}

export interface SendMessageRequest {
  content: string
  sessionId?: string
  attachments?: string[] // File IDs
  context?: any
}

export interface AnalyzeDocumentRequest {
  fileId: string
  analysisType?: 'contract' | 'financial' | 'compliance' | 'general'
  extractData?: boolean
}

export interface JeevesInsights {
  marketTrends: JeevesInsight[]
  recommendations: JeevesInsight[]
  alerts: JeevesInsight[]
  lastUpdated: Date
}

// API Functions
export const jeevesApi = {
  // Chat operations
  getChatSession: (sessionId: string) =>
    api.get<ChatSession>(`/api/jeeves/chat/${sessionId}`),

  sendMessage: (data: SendMessageRequest) =>
    api.post<ChatMessage>('/api/jeeves/chat/send', data),

  createChatSession: () =>
    api.post<ChatSession>('/api/jeeves/chat/new'),

  // Document analysis
  analyzeDocument: (data: AnalyzeDocumentRequest) =>
    api.post<DocumentAnalysis>('/api/jeeves/analyze', data),

  getAnalysis: (analysisId: string) =>
    api.get<DocumentAnalysis>(`/api/jeeves/analysis/${analysisId}`),

  // File upload for analysis
  uploadDocument: (file: File, metadata?: any) => {
    const formData = new FormData()
    formData.append('file', file)
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata))
    }
    return api.upload<{ fileId: string; fileName: string }>('/api/jeeves/upload', formData)
  },

  // Market insights
  getInsights: () =>
    api.get<JeevesInsights>('/api/jeeves/insights'),

  // Auto-populate deal from analysis
  generateDealFromAnalysis: (analysisId: string) =>
    api.post<any>(`/api/jeeves/analysis/${analysisId}/generate-deal`),
}

// React Query Hooks

/**
 * Hook to get chat session
 */
export function useChatSession(sessionId: string) {
  return useQuery({
    queryKey: queryKeys.jeeves.chat(sessionId),
    queryFn: () => jeevesApi.getChatSession(sessionId),
    enabled: !!sessionId,
  })
}

/**
 * Hook to send a message
 */
export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: jeevesApi.sendMessage,
    onSuccess: (newMessage, variables) => {
      const sessionId = variables.sessionId || 'default'
      
      // Update chat session cache with new message
      queryClient.setQueryData(
        queryKeys.jeeves.chat(sessionId),
        (oldData: ChatSession | undefined) => {
          if (!oldData) return oldData
          
          return {
            ...oldData,
            messages: [...oldData.messages, newMessage],
            updatedAt: new Date(),
          }
        }
      )
    },
  })
}

/**
 * Hook to create new chat session
 */
export function useCreateChatSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: jeevesApi.createChatSession,
    onSuccess: (newSession) => {
      // Cache the new session
      queryClient.setQueryData(
        queryKeys.jeeves.chat(newSession.id),
        newSession
      )
    },
  })
}

/**
 * Hook to upload and analyze document
 */
export function useUploadDocument() {
  return useMutation({
    mutationFn: ({ file, metadata }: { file: File; metadata?: any }) =>
      jeevesApi.uploadDocument(file, metadata),
  })
}

/**
 * Hook to analyze document
 */
export function useAnalyzeDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: jeevesApi.analyzeDocument,
    onSuccess: (analysis) => {
      // Cache the analysis result
      queryClient.setQueryData(
        queryKeys.jeeves.analysis(analysis.id),
        analysis
      )
    },
  })
}

/**
 * Hook to get document analysis
 */
export function useDocumentAnalysis(analysisId: string) {
  return useQuery({
    queryKey: queryKeys.jeeves.analysis(analysisId),
    queryFn: () => jeevesApi.getAnalysis(analysisId),
    enabled: !!analysisId,
  })
}

/**
 * Hook to get Jeeves insights
 */
export function useJeevesInsights() {
  return useQuery({
    queryKey: queryKeys.jeeves.insights(),
    queryFn: jeevesApi.getInsights,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  })
}

/**
 * Hook to generate deal from analysis
 */
export function useGenerateDealFromAnalysis() {
  return useMutation({
    mutationFn: jeevesApi.generateDealFromAnalysis,
    onSuccess: (dealData) => {
      // Could redirect to deal creation form with pre-filled data
      console.log('Generated deal data:', dealData)
    },
  })
}

/**
 * Combined hook for document upload and analysis workflow
 */
export function useDocumentWorkflow() {
  const uploadMutation = useUploadDocument()
  const analyzeMutation = useAnalyzeDocument()

  const processDocument = async (
    file: File, 
    analysisType?: AnalyzeDocumentRequest['analysisType'],
    metadata?: any
  ) => {
    try {
      // Step 1: Upload document
      const uploadResult = await uploadMutation.mutateAsync({ file, metadata })
      
      // Step 2: Analyze document
      const analysisResult = await analyzeMutation.mutateAsync({
        fileId: uploadResult.fileId,
        analysisType,
        extractData: true,
      })
      
      return {
        upload: uploadResult,
        analysis: analysisResult,
      }
    } catch (error) {
      handleApiError(error)
      throw error
    }
  }

  return {
    processDocument,
    isUploading: uploadMutation.isPending,
    isAnalyzing: analyzeMutation.isPending,
    isProcessing: uploadMutation.isPending || analyzeMutation.isPending,
    error: uploadMutation.error || analyzeMutation.error,
  }
}