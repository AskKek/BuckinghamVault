/**
 * Deals API Service
 * Handles all deal-related API operations with TanStack Query integration
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, createQueryFn, createMutationFn, handleApiError } from './client'
import { queryKeys, invalidateQueries } from '@/lib/query-client'
import { Deal, DealStatus, DealType } from '@/types/financial'

// Request/Response types
export interface CreateDealRequest {
  type: DealType
  assetType: string
  amount: number
  pricePerUnit?: number
  clientName: string
  counterpartyName?: string
  forensicRating: string
  settlementMethod: string
  [key: string]: any
}

export interface UpdateDealRequest extends Partial<CreateDealRequest> {}

// Types
export interface DealsResponse {
  deals: Deal[]
  total: number
  page: number
  limit: number
}

export interface DealFilters {
  status?: DealStatus[]
  type?: DealType[]
  search?: string
  dateFrom?: string
  dateTo?: string
  minValue?: number
  maxValue?: number
  counterparty?: string
  page?: number
  limit?: number
}

export interface DealAnalytics {
  totalValue: number
  dealCount: number
  avgDealSize: number
  statusDistribution: Record<DealStatus, number>
  typeDistribution: Record<DealType, number>
  monthlyTrend: Array<{
    month: string
    value: number
    count: number
  }>
}

// API Functions
export const dealsApi = {
  // Get deals list with filtering and pagination
  getDeals: (filters?: DealFilters) => 
    api.get<DealsResponse>('/api/deals', {
      ...(filters && {
        body: JSON.stringify({ params: filters })
      })
    }),

  // Get single deal by ID
  getDeal: (id: string) => 
    api.get<Deal>(`/api/deals/${id}`),

  // Create new deal
  createDeal: (data: CreateDealRequest) => 
    api.post<Deal>('/api/deals', data),

  // Update existing deal
  updateDeal: (id: string, data: UpdateDealRequest) => 
    api.put<Deal>(`/api/deals/${id}`, data),

  // Delete deal
  deleteDeal: (id: string) => 
    api.delete<void>(`/api/deals/${id}`),

  // Get deal analytics
  getDealAnalytics: (filters?: Omit<DealFilters, 'page' | 'limit'>) =>
    api.get<DealAnalytics>('/api/deals/analytics', {
      ...(filters && {
        body: JSON.stringify({ params: filters })
      })
    }),

  // Bulk operations
  bulkUpdateStatus: (dealIds: string[], status: DealStatus) =>
    api.patch<void>('/api/deals/bulk-status', { dealIds, status }),

  // Export deals
  exportDeals: (filters?: DealFilters) =>
    api.get<Blob>('/api/deals/export', {
      ...(filters && {
        body: JSON.stringify({ params: filters })
      })
    }),
}

// React Query Hooks

/**
 * Hook to fetch deals with filtering and pagination
 */
export function useDeals(filters?: DealFilters) {
  return useQuery({
    queryKey: queryKeys.deals.list(filters),
    queryFn: () => dealsApi.getDeals(filters),
    enabled: true,
  })
}

/**
 * Hook to fetch a single deal by ID
 */
export function useDeal(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.deals.detail(id),
    queryFn: () => dealsApi.getDeal(id),
    enabled: enabled && !!id,
  })
}

/**
 * Hook to fetch deal analytics
 */
export function useDealAnalytics(filters?: Omit<DealFilters, 'page' | 'limit'>) {
  return useQuery({
    queryKey: queryKeys.deals.analytics(),
    queryFn: () => dealsApi.getDealAnalytics(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes for analytics
  })
}

/**
 * Hook to create a new deal
 */
export function useCreateDeal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: dealsApi.createDeal,
    onSuccess: (newDeal) => {
      // Invalidate and refetch deals list
      invalidateQueries.deals()
      
      // Add new deal to cache
      queryClient.setQueryData(
        queryKeys.deals.detail(newDeal.id),
        newDeal
      )
    },
  })
}

/**
 * Hook to update an existing deal
 */
export function useUpdateDeal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDealRequest }) =>
      dealsApi.updateDeal(id, data),
    onSuccess: (updatedDeal) => {
      // Update deal in cache
      queryClient.setQueryData(
        queryKeys.deals.detail(updatedDeal.id),
        updatedDeal
      )
      
      // Invalidate deals list to reflect changes
      invalidateQueries.deals()
    },
  })
}

/**
 * Hook to delete a deal
 */
export function useDeleteDeal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: dealsApi.deleteDeal,
    onSuccess: (_, deletedId) => {
      // Remove deal from cache
      queryClient.removeQueries({
        queryKey: queryKeys.deals.detail(deletedId)
      })
      
      // Invalidate deals list
      invalidateQueries.deals()
    },
  })
}

/**
 * Hook for bulk status updates
 */
export function useBulkUpdateDealStatus() {
  return useMutation({
    mutationFn: ({ dealIds, status }: { dealIds: string[]; status: DealStatus }) =>
      dealsApi.bulkUpdateStatus(dealIds, status),
    onSuccess: () => {
      // Invalidate all deal-related queries
      invalidateQueries.deals()
    },
  })
}

/**
 * Hook to export deals
 */
export function useExportDeals() {
  return useMutation({
    mutationFn: dealsApi.exportDeals,
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `deals-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    },
  })
}