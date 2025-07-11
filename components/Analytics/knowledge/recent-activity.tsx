"use client"

import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { 
  Download, 
  Eye, 
  Star, 
  FileText, 
  MessageSquare, 
  Bookmark,
  TrendingUp,
  Clock,
  Activity
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface ActivityItem {
  id: string
  type: 'download' | 'view' | 'rating' | 'comment' | 'bookmark' | 'upload'
  user: string
  resourceTitle: string
  timestamp: Date
  metadata?: any
}

const mockActivity: ActivityItem[] = [
  {
    id: 'activity_1',
    type: 'download',
    user: 'Charles Pemberton III',
    resourceTitle: 'Digital Asset OTC Transaction Best Practices',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: 'activity_2',
    type: 'rating',
    user: 'Alexandra Rothschild',
    resourceTitle: 'KYC/AML Compliance Checklist for High-Value Transactions',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    metadata: { rating: 5 }
  },
  {
    id: 'activity_3',
    type: 'view',
    user: 'Victoria Sterling',
    resourceTitle: 'Forensic Rating System: Understanding Bitcoin Provenance',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
  },
  {
    id: 'activity_4',
    type: 'upload',
    user: 'Victoria Sterling',
    resourceTitle: 'Sovereign Wealth Fund Digital Asset Guidelines 2025',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
  },
  {
    id: 'activity_5',
    type: 'comment',
    user: 'Charles Pemberton III',
    resourceTitle: 'Digital Asset OTC Transaction Best Practices',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    metadata: { comment: 'Excellent resource for structuring large OTC deals...' }
  },
  {
    id: 'activity_6',
    type: 'bookmark',
    user: 'Alexandra Rothschild',
    resourceTitle: 'Forensic Rating System: Understanding Bitcoin Provenance',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  }
]

export function RecentActivity() {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'download':
        return <Download className="w-4 h-4 text-green-400" />
      case 'view':
        return <Eye className="w-4 h-4 text-blue-400" />
      case 'rating':
        return <Star className="w-4 h-4 text-gold" />
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-purple-400" />
      case 'bookmark':
        return <Bookmark className="w-4 h-4 text-yellow-400" />
      case 'upload':
        return <FileText className="w-4 h-4 text-indigo-400" />
      default:
        return <Activity className="w-4 h-4 text-white/50" />
    }
  }

  const getActivityText = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'download':
        return 'downloaded'
      case 'view':
        return 'viewed'
      case 'rating':
        return `rated (${activity.metadata?.rating || 'N/A'} stars)`
      case 'comment':
        return 'commented on'
      case 'bookmark':
        return 'bookmarked'
      case 'upload':
        return 'uploaded'
      default:
        return 'interacted with'
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Activity stats
  const stats = [
    {
      label: 'Downloads Today',
      value: mockActivity.filter(a => 
        a.type === 'download' && 
        new Date(a.timestamp).toDateString() === new Date().toDateString()
      ).length,
      icon: Download,
      color: 'text-green-400'
    },
    {
      label: 'Views This Week',
      value: mockActivity.filter(a => 
        a.type === 'view' && 
        Date.now() - a.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000
      ).length,
      icon: Eye,
      color: 'text-blue-400'
    },
    {
      label: 'New Resources',
      value: mockActivity.filter(a => 
        a.type === 'upload' && 
        Date.now() - a.timestamp.getTime() < 30 * 24 * 60 * 60 * 1000
      ).length,
      icon: FileText,
      color: 'text-indigo-400'
    },
    {
      label: 'Active Users',
      value: new Set(mockActivity.map(a => a.user)).size,
      icon: TrendingUp,
      color: 'text-gold'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Activity Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="glass-morphism border-gold/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/70">{stat.label}</p>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-morphism border-gold/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-gold" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {mockActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="flex items-start gap-4 p-3 bg-navy/30 rounded-lg border border-gold/10 hover:border-gold/20 transition-colors"
                >
                  <Avatar className="w-8 h-8 border border-gold/30 mt-1">
                    <AvatarFallback className="bg-gradient-to-br from-gold/20 to-gold/10 text-gold text-xs font-semibold">
                      {getInitials(activity.user)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getActivityIcon(activity.type)}
                      <span className="text-sm font-medium text-white">
                        {activity.user}
                      </span>
                      <span className="text-sm text-white/70">
                        {getActivityText(activity)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-white/80 font-medium mb-1">
                      {activity.resourceTitle}
                    </p>
                    
                    {activity.metadata?.comment && (
                      <p className="text-sm text-white/60 italic">
                        "{activity.metadata.comment}"
                      </p>
                    )}
                    
                    <p className="text-xs text-white/50 mt-2">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </p>
                  </div>

                  <Badge
                    variant="outline"
                    className="text-xs border-white/20 text-white/60 capitalize"
                  >
                    {activity.type}
                  </Badge>
                </motion.div>
              ))}
            </div>

            {mockActivity.length === 0 && (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/60">No recent activity</p>
                <p className="text-white/40 text-sm">Activity will appear here as users interact with resources</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}