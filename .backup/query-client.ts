import { QueryClient } from '@tanstack/react-query'

// Query client configuration for Buckingham Vault
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes for most data
      staleTime: 5 * 60 * 1000,
      // Cache time: 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 3 times with exponential backoff
      retry: (failureCount, error: any) => {
        // Don't retry on authentication errors
        if (error?.status === 401 || error?.status === 403) {
          return false
        }
        // Retry up to 3 times for other errors
        return failureCount < 3
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Enable background refetch for active queries
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      // Global mutation error handling
      onError: (error: any) => {
        console.error('Mutation error:', error)
        // You can add global error handling here (e.g., toast notifications)
      },
    },
  },
})

// Query keys factory for consistent key management
export const queryKeys = {
  // Authentication
  auth: {
    me: ['auth', 'me'] as const,
    permissions: (userId: string) => ['auth', 'permissions', userId] as const,
  },
  
  // Deals
  deals: {
    all: ['deals'] as const,
    list: (filters?: any) => ['deals', 'list', filters] as const,
    detail: (id: string) => ['deals', 'detail', id] as const,
    analytics: () => ['deals', 'analytics'] as const,
    byUser: (userId: string) => ['deals', 'byUser', userId] as const,
  },
  
  // Jeeves AI
  jeeves: {
    chat: (sessionId: string) => ['jeeves', 'chat', sessionId] as const,
    analysis: (documentId: string) => ['jeeves', 'analysis', documentId] as const,
    insights: () => ['jeeves', 'insights'] as const,
  },
  
  // Knowledge Center
  knowledge: {
    all: ['knowledge'] as const,
    list: (category?: string, filters?: any) => ['knowledge', 'list', category, filters] as const,
    detail: (id: string) => ['knowledge', 'detail', id] as const,
    categories: () => ['knowledge', 'categories'] as const,
  },
  
  // Exchange
  exchange: {
    orderBook: (pair: string) => ['exchange', 'orderBook', pair] as const,
    tradingBlocks: (filters?: any) => ['exchange', 'tradingBlocks', filters] as const,
    prices: () => ['exchange', 'prices'] as const,
    userOrders: (userId: string) => ['exchange', 'userOrders', userId] as const,
  },
  
  // Analytics
  analytics: {
    dashboard: () => ['analytics', 'dashboard'] as const,
    performance: (period: string) => ['analytics', 'performance', period] as const,
    metrics: (type: string) => ['analytics', 'metrics', type] as const,
  },
} as const

// Cache invalidation helpers
export const invalidateQueries = {
  deals: () => queryClient.invalidateQueries({ queryKey: queryKeys.deals.all }),
  dealDetail: (id: string) => queryClient.invalidateQueries({ queryKey: queryKeys.deals.detail(id) }),
  knowledge: () => queryClient.invalidateQueries({ queryKey: queryKeys.knowledge.all }),
  exchange: () => queryClient.invalidateQueries({ queryKey: ['exchange'] }),
  analytics: () => queryClient.invalidateQueries({ queryKey: ['analytics'] }),
} as const

// Prefetch helpers for performance optimization
export const prefetchQueries = {
  deals: async (filters?: any) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.deals.list(filters),
      queryFn: async () => {
        // This will be implemented with actual API calls
        return []
      },
    })
  },
  
  analytics: async () => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.analytics.dashboard(),
      queryFn: async () => {
        // This will be implemented with actual API calls
        return {}
      },
    })
  },
} as const