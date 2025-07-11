"use client"

import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart3, 
  DollarSign,
  Globe,
  Clock,
  Zap
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function MarketData() {
  const marketStats = [
    {
      label: 'BTC/USD',
      value: '$103,450',
      change: '+2.1%',
      changeType: 'positive' as const,
      volume: '347.8 BTC'
    },
    {
      label: 'ETH/USD', 
      value: '$3,892',
      change: '+1.8%',
      changeType: 'positive' as const,
      volume: '1,247.3 ETH'
    },
    {
      label: 'USDT/USD',
      value: '$1.0005',
      change: '+0.05%',
      changeType: 'positive' as const,
      volume: '12.4M USDT'
    },
    {
      label: 'USDC/USD',
      value: '$0.9998',
      change: '-0.02%',
      changeType: 'negative' as const,
      volume: '8.7M USDC'
    }
  ]

  const forensicPremiums = [
    { rating: 'AAA', premium: 5.0, volume: 23.4, color: 'text-emerald-400' },
    { rating: 'AA', premium: 3.0, volume: 45.7, color: 'text-green-400' },
    { rating: 'A', premium: 1.5, volume: 89.2, color: 'text-blue-400' },
    { rating: 'BBB', premium: 0.0, volume: 156.8, color: 'text-orange-400' },
  ]

  const regionalData = [
    { region: 'North America', volume: 142.3, percentage: 35.2, color: 'bg-blue-500' },
    { region: 'Europe', volume: 128.7, percentage: 31.8, color: 'bg-green-500' },
    { region: 'Asia Pacific', volume: 97.4, percentage: 24.1, color: 'bg-purple-500' },
    { region: 'Other', volume: 36.1, percentage: 8.9, color: 'bg-yellow-500' }
  ]

  const recentTrades = [
    { id: 1, type: 'buy', amount: 5.234, price: 103425, rating: 'AAA', time: '14:32:15' },
    { id: 2, type: 'sell', amount: 2.891, price: 103380, rating: 'AA', time: '14:31:42' },
    { id: 3, type: 'buy', amount: 10.567, price: 103450, rating: 'A', time: '14:31:28' },
    { id: 4, type: 'sell', amount: 1.234, price: 103390, rating: 'AAA', time: '14:30:55' },
    { id: 5, type: 'buy', amount: 7.892, price: 103415, rating: 'AA', time: '14:30:33' }
  ]

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {marketStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="glass-morphism border-gold/20">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">{stat.label}</span>
                    {stat.changeType === 'positive' ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-white/60">{stat.volume}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Forensic Rating Premiums */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-morphism border-gold/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gold" />
                Forensic Rating Premiums
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {forensicPremiums.map((item, index) => (
                  <div key={item.rating} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-white/10 text-white border-white/20">
                          {item.rating}
                        </Badge>
                        <span className="text-sm text-white/70">
                          +{item.premium}% premium
                        </span>
                      </div>
                      <span className={`text-sm font-medium ${item.color}`}>
                        {item.volume} BTC
                      </span>
                    </div>
                    <div className="w-full bg-navy/50 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          item.rating === 'AAA' ? 'bg-emerald-500' :
                          item.rating === 'AA' ? 'bg-green-500' :
                          item.rating === 'A' ? 'bg-blue-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${(item.volume / 156.8) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Regional Volume */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-morphism border-gold/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-gold" />
                Trading Volume by Region
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionalData.map((region, index) => (
                  <div key={region.region} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/90">{region.region}</span>
                      <div className="text-right">
                        <div className="text-sm font-medium text-white">
                          {region.volume} BTC
                        </div>
                        <div className="text-xs text-white/60">
                          {region.percentage}%
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-navy/50 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${region.color}/70`}
                        style={{ width: `${region.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Trades & Market Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Trades */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-morphism border-gold/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-gold" />
                Recent Trades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentTrades.map((trade, index) => (
                  <motion.div
                    key={trade.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="flex items-center justify-between p-2 bg-navy/30 rounded border border-gold/10"
                  >
                    <div className="flex items-center gap-3">
                      {trade.type === 'buy' ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                      <div>
                        <div className="text-sm font-medium text-white">
                          {trade.amount.toFixed(3)} BTC
                        </div>
                        <div className="text-xs text-white/60">
                          @ ${trade.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className="text-xs bg-white/10 text-white border-white/20">
                        {trade.rating}
                      </Badge>
                      <span className="text-xs text-white/60">{trade.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Market Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-morphism border-gold/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gold" />
                Market Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-navy/30 rounded">
                    <div className="text-sm text-white/70 mb-1">24h High</div>
                    <div className="text-lg font-bold text-green-400">$104,250</div>
                  </div>
                  <div className="text-center p-3 bg-navy/30 rounded">
                    <div className="text-sm text-white/70 mb-1">24h Low</div>
                    <div className="text-lg font-bold text-red-400">$102,100</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-white/70">Total Volume (24h)</span>
                    <span className="text-sm font-medium text-white">2,347.8 BTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-white/70">Active Orders</span>
                    <span className="text-sm font-medium text-white">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-white/70">Avg Trade Size</span>
                    <span className="text-sm font-medium text-white">15.7 BTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-white/70">Market Cap</span>
                    <span className="text-sm font-medium text-white">$2.04T</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-gold" />
                    <span className="text-white/70">Market Status:</span>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      Active
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}