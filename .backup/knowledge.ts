/**
 * Knowledge Center API Service
 * Handles all knowledge base and resource operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, handleApiError } from './client'
import { queryKeys, invalidateQueries } from '@/lib/query-client'
import { KnowledgeResource, ResourceCategory, ResourceType } from '@/types/financial'

// Types
export interface KnowledgeFilters {
  category?: ResourceCategory
  type?: ResourceType
  search?: string
  tags?: string[]
  dateFrom?: string
  dateTo?: string
  isFeatured?: boolean
  page?: number
  limit?: number
}

export interface KnowledgeResponse {
  resources: KnowledgeResource[]
  total: number
  page: number
  limit: number
  categories: ResourceCategory[]
}

export interface CreateResourceRequest {
  title: string
  description: string
  content?: string
  category: ResourceCategory
  type: ResourceType
  tags: string[]
  isFeatured?: boolean
  isPublic?: boolean
  fileUrl?: string
  metadata?: any
}

export interface UpdateResourceRequest extends Partial<CreateResourceRequest> {
  id: string
}

export interface ResourceStats {
  totalResources: number
  categoryDistribution: Record<ResourceCategory, number>
  typeDistribution: Record<ResourceType, number>
  popularResources: Array<{
    id: string
    title: string
    views: number
    downloads: number
  }>
  recentActivity: Array<{
    id: string
    action: 'view' | 'download' | 'create' | 'update'
    resourceId: string
    resourceTitle: string
    timestamp: Date
  }>
}

// API Functions
export const knowledgeApi = {
  // Get resources with filtering
  getResources: (filters?: KnowledgeFilters) =>
    api.get<KnowledgeResponse>('/api/knowledge', {
      ...(filters && {
        body: JSON.stringify({ params: filters })
      })
    }),

  // Get single resource
  getResource: (id: string) =>
    api.get<KnowledgeResource>(`/api/knowledge/${id}`),

  // Create new resource
  createResource: (data: CreateResourceRequest) =>
    api.post<KnowledgeResource>('/api/knowledge', data),

  // Update existing resource
  updateResource: (id: string, data: Partial<CreateResourceRequest>) =>
    api.put<KnowledgeResource>(`/api/knowledge/${id}`, data),

  // Delete resource
  deleteResource: (id: string) =>
    api.delete<void>(`/api/knowledge/${id}`),

  // Get categories
  getCategories: () =>
    api.get<ResourceCategory[]>('/api/knowledge/categories'),

  // Track resource view
  trackView: (id: string) =>
    api.post<void>(`/api/knowledge/${id}/view`),

  // Track resource download
  trackDownload: (id: string) =>
    api.post<void>(`/api/knowledge/${id}/download`),

  // Get resource stats
  getStats: () =>
    api.get<ResourceStats>('/api/knowledge/stats'),

  // Search resources
  searchResources: (query: string, filters?: Omit<KnowledgeFilters, 'search'>) =>
    api.get<KnowledgeResponse>('/api/knowledge/search', {
      body: JSON.stringify({ query, ...filters })
    }),

  // Upload resource file
  uploadFile: (file: File, resourceId?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    if (resourceId) {
      formData.append('resourceId', resourceId)
    }
    return api.upload<{ fileUrl: string; fileName: string }>('/api/knowledge/upload', formData)
  },
}

// React Query Hooks

/**
 * Hook to fetch knowledge resources
 */
export function useKnowledgeResources(filters?: KnowledgeFilters) {
  return useQuery({
    queryKey: queryKeys.knowledge.list(filters?.category, filters),
    queryFn: () => knowledgeApi.getResources(filters),
  })
}

/**
 * Hook to fetch a single knowledge resource
 */
export function useKnowledgeResource(id: string, trackView = true) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: queryKeys.knowledge.detail(id),
    queryFn: async () => {
      const resource = await knowledgeApi.getResource(id)
      
      // Track view if enabled
      if (trackView) {
        try {
          await knowledgeApi.trackView(id)
          
          // Update view count in cache
          queryClient.setQueryData(
            queryKeys.knowledge.detail(id),
            (oldData: KnowledgeResource | undefined) => {
              if (!oldData) return oldData
              return {
                ...oldData,
                downloadCount: oldData.downloadCount || 0,
                updatedAt: new Date(),
              }
            }
          )
        } catch (error) {
          // Don't fail the query if view tracking fails
          console.warn('Failed to track view:', error)
        }
      }
      
      return resource
    },
    enabled: !!id,
  })
}

/**
 * Hook to fetch resource categories
 */
export function useKnowledgeCategories() {
  return useQuery({
    queryKey: queryKeys.knowledge.categories(),
    queryFn: knowledgeApi.getCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

/**
 * Hook to create a new resource
 */
export function useCreateKnowledgeResource() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: knowledgeApi.createResource,
    onSuccess: (newResource) => {
      // Invalidate resources list
      invalidateQueries.knowledge()
      
      // Add new resource to cache
      queryClient.setQueryData(
        queryKeys.knowledge.detail(newResource.id),
        newResource
      )
    },
  })
}

/**
 * Hook to update an existing resource
 */
export function useUpdateKnowledgeResource() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateResourceRequest> }) =>
      knowledgeApi.updateResource(id, data),
    onSuccess: (updatedResource) => {
      // Update resource in cache
      queryClient.setQueryData(
        queryKeys.knowledge.detail(updatedResource.id),
        updatedResource
      )
      
      // Invalidate resources list
      invalidateQueries.knowledge()
    },
  })
}

/**
 * Hook to delete a resource
 */
export function useDeleteKnowledgeResource() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: knowledgeApi.deleteResource,
    onSuccess: (_, deletedId) => {
      // Remove resource from cache
      queryClient.removeQueries({
        queryKey: queryKeys.knowledge.detail(deletedId)
      })
      
      // Invalidate resources list
      invalidateQueries.knowledge()
    },
  })
}

/**
 * Hook to track resource downloads
 */
export function useTrackDownload() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: knowledgeApi.trackDownload,
    onSuccess: (_, resourceId) => {
      // Update download count in cache
      queryClient.setQueryData(
        queryKeys.knowledge.detail(resourceId),
        (oldData: KnowledgeResource | undefined) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            downloadCount: (oldData.downloadCount || 0) + 1,
          }
        }
      )
    },
  })
}

/**
 * Hook to get knowledge center stats
 */
export function useKnowledgeStats() {
  return useQuery({
    queryKey: ['knowledge', 'stats'],
    queryFn: knowledgeApi.getStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to search resources
 */
export function useSearchKnowledge(query: string, filters?: Omit<KnowledgeFilters, 'search'>) {
  return useQuery({
    queryKey: ['knowledge', 'search', query, filters],
    queryFn: () => knowledgeApi.searchResources(query, filters),
    enabled: query.length > 2, // Only search with 3+ characters
  })
}

/**
 * Hook to upload resource files
 */
export function useUploadResourceFile() {
  return useMutation({
    mutationFn: ({ file, resourceId }: { file: File; resourceId?: string }) =>
      knowledgeApi.uploadFile(file, resourceId),
  })
}