/**
 * Exchange API Service
 * Handles all trading and exchange operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, handleApiError } from './client'
import { queryKeys } from '@/lib/query-client'
import { ForensicRating, AssetType } from '@/types/financial'

// Types
export interface TradingBlock {
  id: string
  type: 'buy' | 'sell'
  assetType: AssetType
  amount: number
  pricePerUnit: number
  totalValue: number
  forensicRating: ForensicRating
  settlementMethod: string
  region: string
  createdAt: Date
  expiresAt?: Date
  isActive: boolean
}

export interface OrderBookEntry {
  price: number
  amount: number
  total: number
  count: number
}

export interface ExchangeFilters {
  assetType?: AssetType
  forensicRating?: ForensicRating
  minAmount?: number
  maxAmount?: number
  priceRange?: [number, number]
  region?: string
  settlementMethod?: string
  page?: number
  limit?: number
}

export interface OrderBookData {
  pair: string
  bids: OrderBookEntry[]
  asks: OrderBookEntry[]
  lastPrice: number
  volume24h: number
  change24h: number
  timestamp: Date
}

export interface CreateOrderRequest {
  type: 'buy' | 'sell'
  assetType: AssetType
  amount: number
  price?: number // For limit orders
  forensicRating: ForensicRating
  settlementMethod: string
  region?: string
  expiresAt?: Date
}

export interface TradingStats {
  volume24h: number
  trades24h: number
  avgTradeSize: number
  topAssets: Array<{
    asset: AssetType
    volume: number
    change: number
  }>
  priceMovements: Array<{
    asset: AssetType
    price: number
    change: number
    timestamp: Date
  }>
}

export interface UserOrder {
  id: string
  type: 'buy' | 'sell'
  status: 'pending' | 'partial' | 'filled' | 'cancelled'
  assetType: AssetType
  amount: number
  filledAmount: number
  price?: number
  forensicRating: ForensicRating
  createdAt: Date
  updatedAt: Date
}

// API Functions
export const exchangeApi = {
  // Get trading blocks
  getTradingBlocks: (filters?: ExchangeFilters) =>
    api.get<{ blocks: TradingBlock[]; total: number }>('/api/exchange/blocks', {
      ...(filters && {
        body: JSON.stringify({ params: filters })
      })
    }),

  // Get order book for specific pair
  getOrderBook: (pair: string) =>
    api.get<OrderBookData>(`/api/exchange/orderbook/${pair}`),

  // Get current prices
  getPrices: () =>
    api.get<Record<AssetType, number>>('/api/exchange/prices'),

  // Create new order
  createOrder: (data: CreateOrderRequest) =>
    api.post<UserOrder>('/api/exchange/orders', data),

  // Cancel order
  cancelOrder: (orderId: string) =>
    api.delete<void>(`/api/exchange/orders/${orderId}`),

  // Get user orders
  getUserOrders: (status?: UserOrder['status']) =>
    api.get<UserOrder[]>('/api/exchange/orders/my', {
      ...(status && {
        body: JSON.stringify({ status })
      })
    }),

  // Get trading statistics
  getTradingStats: () =>
    api.get<TradingStats>('/api/exchange/stats'),

  // Execute trade (for market orders)
  executeTrade: (data: {
    blockId: string
    amount: number
    settlementDetails: any
  }) =>
    api.post<{ tradeId: string; status: string }>('/api/exchange/trade', data),

  // Get trade history
  getTradeHistory: (filters?: {
    assetType?: AssetType
    dateFrom?: string
    dateTo?: string
    page?: number
    limit?: number
  }) =>
    api.get<{
      trades: Array<{
        id: string
        assetType: AssetType
        amount: number
        price: number
        side: 'buy' | 'sell'
        timestamp: Date
      }>
      total: number
    }>('/api/exchange/trades/history', {
      ...(filters && {
        body: JSON.stringify({ params: filters })
      })
    }),
}

// React Query Hooks

/**
 * Hook to fetch trading blocks
 */
export function useTradingBlocks(filters?: ExchangeFilters) {
  return useQuery({
    queryKey: queryKeys.exchange.tradingBlocks(filters),
    queryFn: () => exchangeApi.getTradingBlocks(filters),
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

/**
 * Hook to fetch order book data
 */
export function useOrderBook(pair: string) {
  return useQuery({
    queryKey: queryKeys.exchange.orderBook(pair),
    queryFn: () => exchangeApi.getOrderBook(pair),
    enabled: !!pair,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  })
}

/**
 * Hook to fetch current prices
 */
export function usePrices() {
  return useQuery({
    queryKey: queryKeys.exchange.prices(),
    queryFn: exchangeApi.getPrices,
    refetchInterval: 10000, // Refetch every 10 seconds
    staleTime: 5000, // Consider stale after 5 seconds
  })
}

/**
 * Hook to fetch user orders
 */
export function useUserOrders(userId: string, status?: UserOrder['status']) {
  return useQuery({
    queryKey: queryKeys.exchange.userOrders(userId),
    queryFn: () => exchangeApi.getUserOrders(status),
    enabled: !!userId,
  })
}

/**
 * Hook to fetch trading statistics
 */
export function useTradingStats() {
  return useQuery({
    queryKey: ['exchange', 'stats'],
    queryFn: exchangeApi.getTradingStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}

/**
 * Hook to create new order
 */
export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: exchangeApi.createOrder,
    onSuccess: (newOrder) => {
      // Invalidate user orders to show new order
      queryClient.invalidateQueries({
        queryKey: ['exchange', 'userOrders']
      })
      
      // Invalidate trading blocks to reflect updated availability
      queryClient.invalidateQueries({
        queryKey: ['exchange', 'tradingBlocks']
      })
    },
  })
}

/**
 * Hook to cancel order
 */
export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: exchangeApi.cancelOrder,
    onSuccess: () => {
      // Invalidate user orders
      queryClient.invalidateQueries({
        queryKey: ['exchange', 'userOrders']
      })
      
      // Invalidate trading blocks
      queryClient.invalidateQueries({
        queryKey: ['exchange', 'tradingBlocks']
      })
    },
  })
}

/**
 * Hook to execute trade
 */
export function useExecuteTrade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: exchangeApi.executeTrade,
    onSuccess: () => {
      // Invalidate all exchange-related data
      queryClient.invalidateQueries({
        queryKey: ['exchange']
      })
    },
  })
}

/**
 * Hook to fetch trade history
 */
export function useTradeHistory(filters?: Parameters<typeof exchangeApi.getTradeHistory>[0]) {
  return useQuery({
    queryKey: ['exchange', 'tradeHistory', filters],
    queryFn: () => exchangeApi.getTradeHistory(filters),
  })
}

/**
 * Real-time price updates hook with WebSocket fallback
 */
export function useRealTimePrices() {
  const { data: prices, ...query } = usePrices()
  
  // In a real implementation, this would establish WebSocket connections
  // For now, we'll use polling with the existing hook
  
  return {
    ...query,
    prices,
    // Additional real-time specific methods could be added here
    subscribe: (callback: (prices: Record<AssetType, number>) => void) => {
      // WebSocket subscription logic would go here
      console.log('Subscribing to real-time prices')
    },
    unsubscribe: () => {
      // WebSocket cleanup logic would go here
      console.log('Unsubscribing from real-time prices')
    },
  }
}