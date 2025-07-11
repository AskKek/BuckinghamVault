"use client"

import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Clock, 
  Zap,
  Activity
} from 'lucide-react'
import { OrderBook as OrderBookType, ForensicRating } from '@/types/financial'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface OrderBookProps {
  orderBook: OrderBookType
  selectedRating: ForensicRating
  expanded?: boolean
}

export function OrderBook({ orderBook, selectedRating, expanded = false }: OrderBookProps) {
  const { bids, asks, lastTradePrice, volume24h, priceChange24h } = orderBook

  // Filter orders by selected forensic rating
  const filteredBids = bids.filter(order => order.forensicRating === selectedRating)
  const filteredAsks = asks.filter(order => order.forensicRating === selectedRating)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatAmount = (amount: number) => {
    return amount.toFixed(8)
  }

  const getRatingColor = (rating: ForensicRating) => {
    switch (rating) {
      case 'AAA':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      case 'AA':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'A':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'BBB':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30'
      default:
        return 'bg-white/20 text-white border-white/30'
    }
  }

  const getDepthPercentage = (amount: number, maxAmount: number) => {
    return (amount / maxAmount) * 100
  }

  const maxBidAmount = Math.max(...filteredBids.map(order => order.amount), 1)
  const maxAskAmount = Math.max(...filteredAsks.map(order => order.amount), 1)

  const spread = filteredAsks.length > 0 && filteredBids.length > 0 
    ? filteredAsks[0].price - filteredBids[0].price 
    : 0

  return (
    <Card className="glass-morphism border-gold/20 h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-gold" />
            Order Book
          </CardTitle>
          <Badge className={`${getRatingColor(selectedRating)}`}>
            <Shield className="w-3 h-3 mr-1" />
            {selectedRating}
          </Badge>
        </div>
        
        {/* Market Summary */}
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="text-center">
            <p className="text-white/60">Last Price</p>
            <p className="font-semibold text-white">{formatPrice(lastTradePrice || 0)}</p>
          </div>
          <div className="text-center">
            <p className="text-white/60">24h Volume</p>
            <p className="font-semibold text-white">{volume24h.toFixed(1)} BTC</p>
          </div>
          <div className="text-center">
            <p className="text-white/60">24h Change</p>
            <p className={`font-semibold ${priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {priceChange24h >= 0 ? '+' : ''}{priceChange24h.toFixed(1)}%
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Spread Info */}
        {spread > 0 && (
          <div className="text-center p-2 bg-navy/30 rounded-lg border border-gold/10">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-white/70">Spread:</span>
              <span className="text-sm font-semibold text-white">{formatPrice(spread)}</span>
              <span className="text-xs text-white/50">
                ({((spread / (lastTradePrice || 1)) * 100).toFixed(3)}%)
              </span>
            </div>
          </div>
        )}

        {/* Order Book Tables */}
        <div className="space-y-4">
          {/* Asks (Sell Orders) */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-white">
                Asks ({filteredAsks.length})
              </span>
            </div>
            
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {filteredAsks.length === 0 ? (
                <div className="text-center py-4 text-white/50 text-sm">
                  No {selectedRating} sell orders
                </div>
              ) : (
                filteredAsks.slice(0, expanded ? 10 : 5).map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-red-500/10 rounded"
                         style={{ 
                           width: `${getDepthPercentage(order.amount, maxAskAmount)}%` 
                         }} 
                    />
                    <div className="relative flex justify-between items-center p-2 text-sm hover:bg-white/5 rounded transition-colors">
                      <span className="text-red-400 font-mono">
                        {formatPrice(order.price)}
                      </span>
                      <span className="text-white/80 font-mono">
                        {formatAmount(order.amount)}
                      </span>
                      <span className="text-white/60 text-xs">
                        {formatDistanceToNow(new Date(order.submittedAt), { addSuffix: true })}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Current Price Indicator */}
          <div className="text-center py-2 border-y border-gold/20">
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-gold" />
              <span className="text-lg font-bold text-gold">
                {formatPrice(lastTradePrice || 0)}
              </span>
              <Badge className={`text-xs ${priceChange24h >= 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                {priceChange24h >= 0 ? '+' : ''}{priceChange24h.toFixed(1)}%
              </Badge>
            </div>
          </div>

          {/* Bids (Buy Orders) */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-white">
                Bids ({filteredBids.length})
              </span>
            </div>
            
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {filteredBids.length === 0 ? (
                <div className="text-center py-4 text-white/50 text-sm">
                  No {selectedRating} buy orders
                </div>
              ) : (
                filteredBids.slice(0, expanded ? 10 : 5).map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-green-500/10 rounded"
                         style={{ 
                           width: `${getDepthPercentage(order.amount, maxBidAmount)}%` 
                         }} 
                    />
                    <div className="relative flex justify-between items-center p-2 text-sm hover:bg-white/5 rounded transition-colors">
                      <span className="text-green-400 font-mono">
                        {formatPrice(order.price)}
                      </span>
                      <span className="text-white/80 font-mono">
                        {formatAmount(order.amount)}
                      </span>
                      <span className="text-white/60 text-xs">
                        {formatDistanceToNow(new Date(order.submittedAt), { addSuffix: true })}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Order Book Stats */}
        {expanded && (
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-white/60 mb-1">Total Bid Volume</p>
                <p className="font-semibold text-green-400">
                  {filteredBids.reduce((sum, order) => sum + order.amount, 0).toFixed(4)} BTC
                </p>
              </div>
              <div>
                <p className="text-white/60 mb-1">Total Ask Volume</p>
                <p className="font-semibold text-red-400">
                  {filteredAsks.reduce((sum, order) => sum + order.amount, 0).toFixed(4)} BTC
                </p>
              </div>
            </div>
            
            <div>
              <p className="text-white/60 mb-2 text-sm">Market Depth</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-green-400">Bids</span>
                  <span className="text-red-400">Asks</span>
                </div>
                <div className="flex h-2 rounded overflow-hidden">
                  <div 
                    className="bg-green-500/30" 
                    style={{ 
                      width: `${(filteredBids.length / (filteredBids.length + filteredAsks.length || 1)) * 100}%` 
                    }} 
                  />
                  <div 
                    className="bg-red-500/30" 
                    style={{ 
                      width: `${(filteredAsks.length / (filteredBids.length + filteredAsks.length || 1)) * 100}%` 
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}