"use client"

import { motion } from 'framer-motion'
import { useSecureAuth } from '@/hooks/use-secure-auth'
import { getDisplayName } from '@/lib/auth-utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle
} from 'lucide-react'

export const dynamic = 'force-dynamic'

const stats = [
  {
    name: 'Active Deals',
    value: '12',
    change: '+2.3%',
    changeType: 'positive' as const,
    icon: FileText,
  },
  {
    name: 'Total Volume',
    value: '$47.2M',
    change: '+12.5%',
    changeType: 'positive' as const,
    icon: DollarSign,
  },
  {
    name: 'Success Rate',
    value: '94.2%',
    change: '+1.2%',
    changeType: 'positive' as const,
    icon: TrendingUp,
  },
  {
    name: 'Active Users',
    value: '24',
    change: '-2.1%',
    changeType: 'negative' as const,
    icon: Users,
  },
]

const recentDeals = [
  {
    id: 'BV-2025-001',
    type: 'Buy',
    asset: 'BTC',
    amount: '50.00',
    value: '$4,925,000',
    status: 'Matched',
    client: 'Pemberton Family Office',
    forensicRating: 'AAA',
  },
  {
    id: 'BV-2025-002',
    type: 'Sell',
    asset: 'BTC',
    amount: '25.00',
    value: '$2,445,000',
    status: 'Under Review',
    client: 'Dynasty Capital Partners',
    forensicRating: 'AA',
  },
  {
    id: 'BV-2025-003',
    type: 'Buy',
    asset: 'USDT',
    amount: '10,000,000',
    value: '$10,005,000',
    status: 'Submitted',
    client: 'Meridian Sovereign Fund',
    forensicRating: 'A',
  },
]

export default function VaultDashboard() {
  const { user } = useSecureAuth()

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'matched':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'under review':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'submitted':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      default:
        return 'bg-white/20 text-white border-white/30'
    }
  }

  const getRatingColor = (rating: string) => {
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

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-display font-bold text-white">
          Welcome back, {getDisplayName(user)}
        </h1>
        <p className="text-white/70">
          Here's what's happening with your portfolio today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
          >
            <Card className="glass-morphism border-gold/20 hover:border-gold/40 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/70">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className="w-12 h-12 glass-morphism rounded-xl flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-gold" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-400" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-400" />
                  )}
                  <span
                    className={`ml-1 text-sm font-medium ${
                      stat.changeType === 'positive'
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="ml-1 text-sm text-white/50">
                    from last month
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Deals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass-morphism border-gold/20">
          <CardHeader>
            <CardTitle className="text-xl font-display text-white">
              Recent Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDeals.map((deal, index) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-navy/50 rounded-lg border border-gold/10 hover:border-gold/20 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 glass-morphism rounded-lg flex items-center justify-center">
                      <span className="text-gold font-semibold text-sm">
                        {deal.asset}
                      </span>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-white">{deal.id}</span>
                        <Badge className={`text-xs ${getStatusColor(deal.status)}`}>
                          {deal.status}
                        </Badge>
                        <Badge className={`text-xs ${getRatingColor(deal.forensicRating)}`}>
                          {deal.forensicRating}
                        </Badge>
                      </div>
                      <p className="text-sm text-white/70">{deal.client}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${
                        deal.type === 'Buy' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {deal.type}
                      </span>
                      <span className="text-white/70">•</span>
                      <span className="text-sm text-white/70">{deal.amount}</span>
                    </div>
                    <p className="font-semibold text-white">{deal.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
              </motion.div>
      </div>
  )
}