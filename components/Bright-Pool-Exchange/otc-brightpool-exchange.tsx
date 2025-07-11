"use client"

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Zap, 
  Target, 
  Shield, 
  Eye, 
  Plus, 
  Minus, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3, 
  Calendar, 
  DollarSign, 
  Bitcoin, 
  Activity, 
  Timer, 
  ArrowUpDown, 
  Layers, 
  Lock, 
  Unlock, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Info, 
  Star, 
  Crown, 
  Gauge,
  Wallet,
  History,
  Users,
  Volume2,
  PieChart,
  LineChart,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useSecureAuth } from '@/hooks/use-secure-auth'
import { cn } from '@/lib/utils'

// Enhanced type definitions for institutional trading
type ForensicRating = 'AAA' | 'AA' | 'A' | 'BBB' | 'unrated'
type OrderSide = 'buy' | 'sell'
type OrderStatus = 'pending' | 'partial' | 'filled' | 'cancelled' | 'expired'
type BlockStatus = 'upcoming' | 'active' | 'matching' | 'completed' | 'failed'

interface TradingBlock {
  id: string
  blockNumber: number
  startTime: Date
  endTime: Date
  status: BlockStatus
  totalVolume: number
  averagePrice: number
  tradesExecuted: number
  participants: number
  forensicBreakdown: Record<ForensicRating, number>
  priceRange: {
    high: number
    low: number
    open: number
    close?: number
  }
}

interface Order {
  id: string
  blockId: string
  userId: string
  side: OrderSide
  amount: number
  price: number
  forensicRating: ForensicRating
  status: OrderStatus
  filledAmount: number
  remainingAmount: number
  submittedAt: Date
  expiresAt: Date
  averageFillPrice?: number
  fees: {
    commission: number
    network: number
    total: number
  }
  priority: 'standard' | 'priority' | 'institutional'
}

interface OrderBook {
  blockId: string
  forensicRating: ForensicRating
  bids: Order[]
  asks: Order[]
  lastTradePrice: number
  volume24h: number
  priceChange24h: number
  spread: number
  marketDepth: {
    bidDepth: number
    askDepth: number
  }
}

interface Portfolio {
  userId: string
  balances: {
    BTC: {
      available: number
      reserved: number
      forensicBreakdown: Record<ForensicRating, number>
    }
    USD: {
      available: number
      reserved: number
    }
  }
  openOrders: Order[]
  tradingHistory: Order[]
  performance: {
    totalTrades: number
    winRate: number
    avgHoldTime: number
    pnl: number
    fees: number
  }
}

interface MarketData {
  currentPrice: number
  priceChange24h: number
  volume24h: number
  high24h: number
  low24h: number
  marketCap: number
  forensicPremiums: Record<ForensicRating, number>
  liquidityDepth: Record<ForensicRating, number>
}

// Order form validation schema
const orderSchema = z.object({
  side: z.enum(['buy', 'sell']),
  amount: z.number().min(0.001, 'Minimum order size is 0.001 BTC'),
  price: z.number().min(1, 'Price must be greater than 0'),
  forensicRating: z.enum(['AAA', 'AA', 'A', 'BBB', 'unrated']),
  orderType: z.enum(['limit', 'market']),
  timeInForce: z.enum(['GTC', 'IOC', 'FOK']),
  priority: z.enum(['standard', 'priority', 'institutional'])
})

type OrderFormData = z.infer<typeof orderSchema>

// Mock data for sophisticated exchange simulation
const mockTradingBlocks: TradingBlock[] = [
  {
    id: 'block_001',
    blockNumber: 2025001,
    startTime: new Date('2025-01-02T15:00:00Z'),
    endTime: new Date('2025-01-02T16:00:00Z'),
    status: 'completed',
    totalVolume: 125.5,
    averagePrice: 98750,
    tradesExecuted: 23,
    participants: 18,
    forensicBreakdown: { AAA: 45.2, AA: 38.1, A: 32.7, BBB: 9.5, unrated: 0 },
    priceRange: { high: 99200, low: 98300, open: 98800, close: 98750 }
  },
  {
    id: 'block_002',
    blockNumber: 2025002,
    startTime: new Date('2025-01-02T16:00:00Z'),
    endTime: new Date('2025-01-02T17:00:00Z'),
    status: 'active',
    totalVolume: 89.2,
    averagePrice: 99100,
    tradesExecuted: 18,
    participants: 14,
    forensicBreakdown: { AAA: 31.8, AA: 28.4, A: 21.3, BBB: 7.7, unrated: 0 },
    priceRange: { high: 99450, low: 98950, open: 99000 }
  },
  {
    id: 'block_003',
    blockNumber: 2025003,
    startTime: new Date('2025-01-02T17:00:00Z'),
    endTime: new Date('2025-01-02T18:00:00Z'),
    status: 'upcoming',
    totalVolume: 0,
    averagePrice: 0,
    tradesExecuted: 0,
    participants: 0,
    forensicBreakdown: { AAA: 0, AA: 0, A: 0, BBB: 0, unrated: 0 },
    priceRange: { high: 0, low: 0, open: 0 }
  }
]

const mockOrderBooks: Record<ForensicRating, OrderBook> = {
  AAA: {
    blockId: 'block_002',
    forensicRating: 'AAA',
    bids: [
      {
        id: 'order_001',
        blockId: 'block_002',
        userId: 'user_001',
        side: 'buy',
        amount: 10,
        price: 103425,
        forensicRating: 'AAA',
        status: 'pending',
        filledAmount: 0,
        remainingAmount: 10,
        submittedAt: new Date('2025-01-02T15:45:00Z'),
        expiresAt: new Date('2025-01-02T17:00:00Z'),
        fees: { commission: 77.5, network: 15.5, total: 93 },
        priority: 'institutional'
      },
      {
        id: 'order_002',
        blockId: 'block_002',
        userId: 'user_002',
        side: 'buy',
        amount: 5,
        price: 103400,
        forensicRating: 'AAA',
        status: 'pending',
        filledAmount: 0,
        remainingAmount: 5,
        submittedAt: new Date('2025-01-02T15:50:00Z'),
        expiresAt: new Date('2025-01-02T17:00:00Z'),
        fees: { commission: 38.8, network: 7.8, total: 46.6 },
        priority: 'priority'
      }
    ],
    asks: [
      {
        id: 'order_003',
        blockId: 'block_002',
        userId: 'user_003',
        side: 'sell',
        amount: 8,
        price: 103500,
        forensicRating: 'AAA',
        status: 'pending',
        filledAmount: 0,
        remainingAmount: 8,
        submittedAt: new Date('2025-01-02T15:55:00Z'),
        expiresAt: new Date('2025-01-02T17:00:00Z'),
        fees: { commission: 62, network: 12.4, total: 74.4 },
        priority: 'institutional'
      }
    ],
    lastTradePrice: 103450,
    volume24h: 347.8,
    priceChange24h: 2.1,
    spread: 75,
    marketDepth: { bidDepth: 15, askDepth: 8 }
  },
  AA: {
    blockId: 'block_002',
    forensicRating: 'AA',
    bids: [],
    asks: [],
    lastTradePrice: 99200,
    volume24h: 289.4,
    priceChange24h: 1.8,
    spread: 50,
    marketDepth: { bidDepth: 12, askDepth: 7 }
  },
  A: {
    blockId: 'block_002',
    forensicRating: 'A',
    bids: [],
    asks: [],
    lastTradePrice: 98800,
    volume24h: 421.7,
    priceChange24h: 1.2,
    spread: 30,
    marketDepth: { bidDepth: 18, askDepth: 14 }
  },
  BBB: {
    blockId: 'block_002',
    forensicRating: 'BBB',
    bids: [],
    asks: [],
    lastTradePrice: 98500,
    volume24h: 156.3,
    priceChange24h: 0.8,
    spread: 25,
    marketDepth: { bidDepth: 8, askDepth: 6 }
  },
  unrated: {
    blockId: 'block_002',
    forensicRating: 'unrated',
    bids: [],
    asks: [],
    lastTradePrice: 0,
    volume24h: 0,
    priceChange24h: 0,
    spread: 0,
    marketDepth: { bidDepth: 0, askDepth: 0 }
  }
}

const mockMarketData: MarketData = {
  currentPrice: 99100,
  priceChange24h: 2.1,
  volume24h: 1215.2,
  high24h: 99800,
  low24h: 97200,
  marketCap: 1960000000000,
  forensicPremiums: { AAA: 5.2, AA: 3.1, A: 1.8, BBB: 0, unrated: -2.5 },
  liquidityDepth: { AAA: 847.3, AA: 1234.7, A: 2156.8, BBB: 987.4, unrated: 0 }
}

const mockPortfolio: Portfolio = {
  userId: 'user_001',
  balances: {
    BTC: {
      available: 12.5,
      reserved: 2.3,
      forensicBreakdown: { AAA: 5.2, AA: 4.8, A: 2.5, BBB: 0, unrated: 0 }
    },
    USD: {
      available: 500000,
      reserved: 125000
    }
  },
  openOrders: [],
  tradingHistory: [],
  performance: {
    totalTrades: 47,
    winRate: 73.4,
    avgHoldTime: 72,
    pnl: 125400,
    fees: 12480
  }
}

// Utility functions
const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'BTC' ? 4 : 2,
    maximumFractionDigits: currency === 'BTC' ? 8 : 2
  }).format(amount)
}

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  }).format(date)
}

const getForensicRatingColor = (rating: ForensicRating) => {
  const colors = {
    AAA: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    AA: 'bg-green-500/20 text-green-300 border-green-500/30',
    A: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    BBB: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    unrated: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
  }
  return colors[rating] || 'bg-white/20 text-white border-white/30'
}

const getBlockStatusColor = (status: BlockStatus) => {
  const colors = {
    upcoming: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    active: 'bg-green-500/20 text-green-300 border-green-500/30',
    matching: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    completed: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    failed: 'bg-red-500/20 text-red-300 border-red-500/30'
  }
  return colors[status] || 'bg-white/20 text-white border-white/30'
}

// Block Timer Component
function BlockTimer({ block }: { block: TradingBlock }) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0)

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime()
      const targetTime = block.status === 'upcoming' ? block.startTime.getTime() : block.endTime.getTime()
      const remaining = Math.max(0, targetTime - now)
      setTimeRemaining(remaining)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [block])

  const formatTimeRemaining = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const progress = block.status === 'active' 
    ? ((new Date().getTime() - block.startTime.getTime()) / (block.endTime.getTime() - block.startTime.getTime())) * 100
    : block.status === 'upcoming' ? 0 : 100

  return (
    <Card className="glass-morphism border-gold/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Clock className="w-5 h-5 mr-2 text-gold" />
            Block #{block.blockNumber}
          </CardTitle>
          <Badge className={cn("text-xs", getBlockStatusColor(block.status))}>
            {block.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-mono font-bold text-white mb-2">
            {formatTimeRemaining(timeRemaining)}
          </div>
          <div className="text-sm text-white/70">
            {block.status === 'upcoming' ? 'Until block opens' : 
             block.status === 'active' ? 'Until block closes' : 'Block completed'}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Progress</span>
            <span className="text-white">{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-white/70">Volume</div>
            <div className="text-white font-mono">{block.totalVolume.toFixed(2)} BTC</div>
          </div>
          <div>
            <div className="text-white/70">Trades</div>
            <div className="text-white font-mono">{block.tradesExecuted}</div>
          </div>
        </div>
        
        <div className="pt-3 border-t border-white/10">
          <div className="text-xs text-white/70 mb-2">Time Window</div>
          <div className="text-xs text-white">
            {formatTime(block.startTime)} - {formatTime(block.endTime)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Order Book Component
function OrderBookView({ orderBook }: { orderBook: OrderBook }) {
  const maxVolume = Math.max(
    ...orderBook.bids.map(order => order.amount),
    ...orderBook.asks.map(order => order.amount)
  )

  const renderOrderRow = (order: Order, isAsk: boolean = false) => {
    const volumePercentage = maxVolume > 0 ? (order.amount / maxVolume) * 100 : 0
    
    return (
      <motion.div
        key={order.id}
        initial={{ opacity: 0, x: isAsk ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative overflow-hidden"
      >
        <div
          className={cn(
            "absolute inset-0 opacity-20",
            isAsk ? "bg-red-500" : "bg-green-500"
          )}
          style={{ width: `${volumePercentage}%` }}
        />
        <div className="relative grid grid-cols-3 gap-2 p-2 text-sm font-mono">
          <div className={cn("text-right", isAsk ? "text-red-400" : "text-green-400")}>
            ${order.price.toLocaleString()}
          </div>
          <div className="text-white text-center">{order.amount.toFixed(4)}</div>
          <div className="text-white/70 text-left">
            ${(order.price * order.amount).toLocaleString()}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <Card className="glass-morphism border-gold/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-gold" />
            Order Book
          </CardTitle>
          <Badge className={cn("text-xs", getForensicRatingColor(orderBook.forensicRating))}>
            {orderBook.forensicRating} Rating
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="grid grid-cols-3 gap-2 p-3 text-xs font-semibold text-white/70 border-b border-white/10">
          <div className="text-right">Price (USD)</div>
          <div className="text-center">Size (BTC)</div>
          <div className="text-left">Total (USD)</div>
        </div>
        
        {/* Asks (Sell Orders) */}
        <div className="max-h-48 overflow-y-auto">
          {orderBook.asks.slice(0, 10).reverse().map(order => renderOrderRow(order, true))}
        </div>
        
        {/* Spread Indicator */}
        <div className="p-3 bg-navy/40 border-y border-white/10">
          <div className="flex items-center justify-between text-sm">
            <div className="text-white/70">Spread</div>
            <div className="text-white font-mono">${orderBook.spread.toLocaleString()}</div>
            <div className="text-white/70">
              {orderBook.lastTradePrice > 0 ? ((orderBook.spread / orderBook.lastTradePrice) * 100).toFixed(3) : '0.000'}%
            </div>
          </div>
        </div>
        
        {/* Bids (Buy Orders) */}
        <div className="max-h-48 overflow-y-auto">
          {orderBook.bids.slice(0, 10).map(order => renderOrderRow(order, false))}
        </div>
        
        {/* Market Depth Summary */}
        <div className="p-3 border-t border-white/10 grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="text-white/70">Bid Depth</div>
            <div className="text-green-400 font-mono">{orderBook.marketDepth.bidDepth.toFixed(2)} BTC</div>
          </div>
          <div>
            <div className="text-white/70">Ask Depth</div>
            <div className="text-red-400 font-mono">{orderBook.marketDepth.askDepth.toFixed(2)} BTC</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Order Form Component
function OrderForm({ 
  selectedRating, 
  onSubmit 
}: { 
  selectedRating: ForensicRating, 
  onSubmit: (order: OrderFormData) => void 
}) {
  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      side: 'buy',
      amount: 0,
      price: 0,
      forensicRating: selectedRating,
      orderType: 'limit',
      timeInForce: 'GTC',
      priority: 'standard'
    }
  })

  const watchedValues = form.watch()
  const orderTotal = watchedValues.amount * watchedValues.price
  const estimatedFees = orderTotal * 0.001 // 0.1% fee

  const handleSubmit = (data: OrderFormData) => {
    onSubmit(data)
    form.reset()
  }

  return (
    <Card className="glass-morphism border-gold/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Plus className="w-5 h-5 mr-2 text-gold" />
          Place Order
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="side"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Side</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-navy/50 border-gold/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="buy">Buy</SelectItem>
                        <SelectItem value="sell">Sell</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="orderType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-navy/50 border-gold/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="limit">Limit</SelectItem>
                        <SelectItem value="market">Market</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Amount (BTC)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.001"
                      placeholder="0.000"
                      className="bg-navy/50 border-gold/20 text-white"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Price (USD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="bg-navy/50 border-gold/20 text-white"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="timeInForce"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Time in Force</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-navy/50 border-gold/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="GTC">Good Till Cancelled</SelectItem>
                        <SelectItem value="IOC">Immediate or Cancel</SelectItem>
                        <SelectItem value="FOK">Fill or Kill</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-navy/50 border-gold/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="priority">Priority (+0.1%)</SelectItem>
                        <SelectItem value="institutional">Institutional (+0.2%)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Order Summary */}
            <div className="p-4 bg-navy/40 rounded-lg border border-white/10 space-y-2">
              <h4 className="text-white font-medium">Order Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-white/70">Total Value:</div>
                <div className="text-white font-mono">{formatCurrency(orderTotal)}</div>
                <div className="text-white/70">Est. Fees:</div>
                <div className="text-white font-mono">{formatCurrency(estimatedFees)}</div>
                <div className="text-white/70">Forensic Rating:</div>
                <Badge className={cn("text-xs w-fit", getForensicRatingColor(selectedRating))}>
                  {selectedRating}
                </Badge>
              </div>
            </div>

            <Button
              type="submit"
              className={cn(
                "w-full",
                watchedValues.side === 'buy' 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "bg-red-600 hover:bg-red-700 text-white"
              )}
            >
              {watchedValues.side === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

// Portfolio Component
function PortfolioView({ portfolio }: { portfolio: Portfolio }) {
  const totalBTC = portfolio.balances.BTC.available + portfolio.balances.BTC.reserved
  const totalUSD = portfolio.balances.USD.available + portfolio.balances.USD.reserved
  const portfolioValue = totalBTC * mockMarketData.currentPrice + totalUSD

  return (
    <Card className="glass-morphism border-gold/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Wallet className="w-5 h-5 mr-2 text-gold" />
          Portfolio
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Portfolio Value */}
        <div className="text-center p-4 bg-navy/40 rounded-lg">
          <div className="text-2xl font-bold text-white">{formatCurrency(portfolioValue)}</div>
          <div className="text-sm text-white/70">Total Portfolio Value</div>
        </div>

        {/* Balances */}
        <div className="space-y-4">
          <div>
            <h4 className="text-white font-medium mb-3">Bitcoin Holdings</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/70">Available:</span>
                <span className="text-white font-mono">{portfolio.balances.BTC.available.toFixed(8)} BTC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Reserved:</span>
                <span className="text-white font-mono">{portfolio.balances.BTC.reserved.toFixed(8)} BTC</span>
              </div>
              
              {/* Forensic Breakdown */}
              <div className="pt-2 border-t border-white/10">
                <div className="text-xs text-white/70 mb-2">Forensic Rating Breakdown</div>
                <div className="space-y-2">
                  {Object.entries(portfolio.balances.BTC.forensicBreakdown).map(([rating, amount]) => (
                    <div key={rating} className="flex items-center justify-between">
                      <Badge className={cn("text-xs", getForensicRatingColor(rating as ForensicRating))}>
                        {rating}
                      </Badge>
                      <span className="text-white font-mono text-xs">{amount.toFixed(4)} BTC</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">USD Balance</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/70">Available:</span>
                <span className="text-white font-mono">{formatCurrency(portfolio.balances.USD.available)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Reserved:</span>
                <span className="text-white font-mono">{formatCurrency(portfolio.balances.USD.reserved)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="pt-4 border-t border-white/10">
          <h4 className="text-white font-medium mb-3">Performance</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-white/70">Total Trades</div>
              <div className="text-white">{portfolio.performance.totalTrades}</div>
            </div>
            <div>
              <div className="text-white/70">Win Rate</div>
              <div className="text-white">{portfolio.performance.winRate.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-white/70">P&L</div>
              <div className={cn(
                portfolio.performance.pnl >= 0 ? "text-green-400" : "text-red-400"
              )}>
                {formatCurrency(portfolio.performance.pnl)}
              </div>
            </div>
            <div>
              <div className="text-white/70">Total Fees</div>
              <div className="text-white">{formatCurrency(portfolio.performance.fees)}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Main Component
export function OTCBrightpoolExchange() {
  const { user } = useSecureAuth()
  const [tradingBlocks] = useState<TradingBlock[]>(mockTradingBlocks)
  const [orderBooks] = useState<Record<ForensicRating, OrderBook>>(mockOrderBooks)
  const [portfolio] = useState<Portfolio>(mockPortfolio)
  const [marketData] = useState<MarketData>(mockMarketData)
  const [selectedRating, setSelectedRating] = useState<ForensicRating>('AAA')
  const [activeTab, setActiveTab] = useState('trading')

  const currentBlock = useMemo(() => {
    return tradingBlocks.find(block => block.status === 'active') || tradingBlocks[0]
  }, [tradingBlocks])

  const upcomingBlock = useMemo(() => {
    return tradingBlocks.find(block => block.status === 'upcoming')
  }, [tradingBlocks])

  const selectedOrderBook = orderBooks[selectedRating]

  const handleOrderSubmit = useCallback((orderData: OrderFormData) => {
    console.log('Order submitted:', orderData)
    // In real implementation, this would submit to the trading engine
  }, [])

  // Permission check - ensure user has trading access
  const hasAccess = user?.role === 'mandate_member' || user?.role === 'admin'

  if (!hasAccess) {
    return (
      <div className="text-center py-12">
        <Lock className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Trading Access Required</h3>
        <p className="text-white/70">
          Brightpool OTC Exchange is available only to approved mandate members and authorized traders.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="w-20 h-20 mx-auto glass-morphism rounded-2xl flex items-center justify-center">
          <Zap className="w-10 h-10 text-gold" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Brightpool OTC Exchange</h1>
          <p className="text-white/70 mt-2">
            Institutional Bitcoin trading with forensic-rated blocks and zero slippage
          </p>
        </div>
      </motion.div>

      {/* Market Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { 
            label: 'Bitcoin Price', 
            value: formatCurrency(marketData.currentPrice), 
            change: marketData.priceChange24h,
            icon: Bitcoin, 
            color: 'text-orange-400' 
          },
          { 
            label: '24h Volume', 
            value: `${marketData.volume24h.toFixed(1)} BTC`, 
            change: 12.3,
            icon: Volume2, 
            color: 'text-blue-400' 
          },
          { 
            label: 'Active Block', 
            value: `#${currentBlock.blockNumber}`, 
            change: null,
            icon: Activity, 
            color: 'text-green-400' 
          },
          { 
            label: 'Participants', 
            value: currentBlock.participants.toString(), 
            change: null,
            icon: Users, 
            color: 'text-purple-400' 
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <Card className="glass-morphism border-gold/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  {stat.change !== null && (
                    <div className={cn(
                      "flex items-center text-xs",
                      stat.change >= 0 ? "text-green-400" : "text-red-400"
                    )}>
                      {stat.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {Math.abs(stat.change).toFixed(1)}%
                    </div>
                  )}
                </div>
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/70">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Trading Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-navy/60 border border-gold/20 grid w-full grid-cols-4">
            <TabsTrigger value="trading" className="data-[state=active]:bg-gold data-[state=active]:text-navy">
              Trading
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-gold data-[state=active]:text-navy">
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-gold data-[state=active]:text-navy">
              History
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gold data-[state=active]:text-navy">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trading" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Block Timer & Forensic Ratings */}
              <div className="space-y-6">
                <BlockTimer block={currentBlock} />
                
                {/* Forensic Rating Selector */}
                <Card className="glass-morphism border-gold/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white">Forensic Ratings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {(['AAA', 'AA', 'A', 'BBB'] as ForensicRating[]).map((rating) => {
                      const premium = marketData.forensicPremiums[rating]
                      const liquidity = marketData.liquidityDepth[rating]
                      
                      return (
                        <motion.button
                          key={rating}
                          onClick={() => setSelectedRating(rating)}
                          className={cn(
                            "w-full p-3 rounded-lg border transition-all",
                            selectedRating === rating
                              ? "border-gold bg-gold/10"
                              : "border-white/20 hover:border-gold/50"
                          )}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Badge className={cn("text-xs", getForensicRatingColor(rating))}>
                                {rating}
                              </Badge>
                              <div className="text-left">
                                <div className="text-white text-sm font-medium">
                                  +{premium.toFixed(1)}% Premium
                                </div>
                                <div className="text-white/70 text-xs">
                                  {liquidity.toFixed(1)} BTC Depth
                                </div>
                              </div>
                            </div>
                            {selectedRating === rating && (
                              <CheckCircle className="w-4 h-4 text-gold" />
                            )}
                          </div>
                        </motion.button>
                      )
                    })}
                  </CardContent>
                </Card>
              </div>

              {/* Center Column - Order Book */}
              <div>
                <OrderBookView orderBook={selectedOrderBook} />
              </div>

              {/* Right Column - Order Form */}
              <div>
                <OrderForm
                  selectedRating={selectedRating}
                  onSubmit={handleOrderSubmit}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PortfolioView portfolio={portfolio} />
              
              <Card className="glass-morphism border-gold/20">
                <CardHeader>
                  <CardTitle className="text-white">Risk Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-navy/40 rounded-lg border border-yellow-500/30">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">Position Limits</span>
                    </div>
                    <div className="text-sm text-white/70">
                      Maximum position size: 100 BTC per block
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/70">Daily Trading Limit:</span>
                      <span className="text-white">500 BTC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Used Today:</span>
                      <span className="text-white">47.3 BTC (9.5%)</span>
                    </div>
                    <Progress value={9.5} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="glass-morphism border-gold/20">
              <CardHeader>
                <CardTitle className="text-white">Trading History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <History className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Trading History</h3>
                  <p className="text-white/70">
                    Your completed trades and order history will appear here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-morphism border-gold/20">
                <CardHeader>
                  <CardTitle className="text-white">Market Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <LineChart className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Advanced Analytics</h3>
                    <p className="text-white/70">
                      Detailed market analysis and trading insights coming soon.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-gold/20">
                <CardHeader>
                  <CardTitle className="text-white">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <PieChart className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Portfolio Analytics</h3>
                    <p className="text-white/70">
                      Performance tracking and risk metrics will be displayed here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}