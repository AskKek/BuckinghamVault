"use client"

import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { 
  Clock, 
  Activity, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  BarChart3,
  Zap
} from 'lucide-react'
import { TradingBlock } from '@/types/financial'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface TradingBlocksProps {
  blocks: TradingBlock[]
}

export function TradingBlocks({ blocks }: TradingBlocksProps) {
  const getStatusIcon = (status: TradingBlock['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'active':
        return <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
      case 'upcoming':
        return <Clock className="w-4 h-4 text-yellow-400" />
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-400" />
    }
  }

  const getStatusColor = (status: TradingBlock['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'active':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'upcoming':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'cancelled':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getBlockProgress = (block: TradingBlock) => {
    if (block.status === 'completed') return 100
    if (block.status === 'upcoming') return 0
    if (block.status === 'cancelled') return 0
    
    // For active blocks, calculate progress based on time
    const now = new Date()
    const start = new Date(block.startTime)
    const end = new Date(block.endTime)
    const total = end.getTime() - start.getTime()
    const elapsed = now.getTime() - start.getTime()
    
    return Math.max(0, Math.min(100, (elapsed / total) * 100))
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-morphism border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Completed Blocks</p>
                <p className="text-xl font-bold text-white">
                  {blocks.filter(b => b.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Total Volume</p>
                <p className="text-xl font-bold text-white">
                  {blocks.reduce((sum, b) => sum + b.totalVolume, 0).toFixed(1)} BTC
                </p>
              </div>
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-gold/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Avg Price</p>
                <p className="text-xl font-bold text-white">
                  {formatCurrency(
                    blocks.filter(b => b.averagePrice > 0).reduce((sum, b) => sum + b.averagePrice, 0) /
                    blocks.filter(b => b.averagePrice > 0).length || 0
                  )}
                </p>
              </div>
              <TrendingUp className="w-6 h-6 text-gold" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trading Blocks List */}
      <Card className="glass-morphism border-gold/20">
        <CardHeader>
          <CardTitle className="text-white">Trading Blocks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {blocks.map((block, index) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-navy/30 rounded-lg border border-gold/10 hover:border-gold/20 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(block.status)}
                    <div>
                      <h3 className="font-semibold text-white">
                        Block #{block.blockNumber}
                      </h3>
                      <p className="text-sm text-white/70">
                        {new Date(block.startTime).toLocaleString()} - {new Date(block.endTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <Badge className={`${getStatusColor(block.status)} capitalize`}>
                    {block.status}
                  </Badge>
                </div>

                {/* Progress Bar for Active Blocks */}
                {block.status === 'active' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70">Progress</span>
                      <span className="text-white/70">{getBlockProgress(block).toFixed(0)}%</span>
                    </div>
                    <Progress 
                      value={getBlockProgress(block)} 
                      className="h-2 bg-navy/50"
                    />
                  </div>
                )}

                {/* Block Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-white/60 mb-1">Volume</p>
                    <p className="font-semibold text-white">
                      {block.totalVolume.toFixed(2)} BTC
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-white/60 mb-1">Avg Price</p>
                    <p className="font-semibold text-white">
                      {block.averagePrice > 0 ? formatCurrency(block.averagePrice) : 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-white/60 mb-1">Trades</p>
                    <p className="font-semibold text-white">
                      {block.tradesExecuted}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-white/60 mb-1">Duration</p>
                    <p className="font-semibold text-white">
                      {block.status === 'upcoming' 
                        ? formatDistanceToNow(new Date(block.startTime), { addSuffix: true })
                        : '1 hour'
                      }
                    </p>
                  </div>
                </div>

                {/* Additional Info for Active/Upcoming Blocks */}
                {(block.status === 'active' || block.status === 'upcoming') && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="w-3 h-3 text-gold" />
                      <span className="text-white/70">
                        {block.status === 'active' 
                          ? 'Trading in progress - orders being matched'
                          : 'Pre-trading phase - submit orders now'
                        }
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}