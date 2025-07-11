"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { 
  MoreHorizontal, 
  Edit, 
  Eye, 
  FileText, 
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Shield
} from 'lucide-react'
import { Deal } from '@/types/financial'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DealCardProps {
  deal: Deal
  canEdit: boolean
  statusColor: string
}

export function DealCard({ deal, canEdit, statusColor }: DealCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: deal.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getForensicRatingColor = (rating?: string) => {
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

  const TypeIcon = deal.type === 'buy' ? TrendingUp : TrendingDown
  const typeColor = deal.type === 'buy' ? 'text-green-400' : 'text-red-400'

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <Card className="glass-morphism border-gold/20 hover:border-gold/40 transition-all duration-300 h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white">{deal.dealNumber}</h3>
                <Badge className={`text-xs ${statusColor}`}>
                  {deal.status.replace('_', ' ')}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <TypeIcon className={`w-4 h-4 ${typeColor}`} />
                <span className={`text-sm font-medium ${typeColor} capitalize`}>
                  {deal.type}
                </span>
                <span className="text-white/50">•</span>
                <span className="text-sm font-medium text-gold">
                  {deal.assetType}
                </span>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-white/50 hover:text-white hover:bg-white/10"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-navy/95 backdrop-blur-sm border-gold/20" align="end">
                <DropdownMenuItem className="text-white/90 hover:bg-white/5 cursor-pointer">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                {canEdit && (
                  <DropdownMenuItem className="text-white/90 hover:bg-white/5 cursor-pointer">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Deal
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Client Info */}
          <div>
            <p className="text-sm text-white/70 mb-1">Client</p>
            <p className="font-medium text-white">{deal.clientName}</p>
          </div>

          {/* Deal Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-white/70 mb-1">Amount</p>
              <p className="font-semibold text-white">
                {deal.amount.toLocaleString()} {deal.assetType}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/70 mb-1">Total Value</p>
              <p className="font-semibold text-white">
                {formatCurrency(deal.totalValue)}
              </p>
            </div>
          </div>

          {/* Price per unit if available */}
          {deal.pricePerUnit && (
            <div>
              <p className="text-sm text-white/70 mb-1">Price per Unit</p>
              <p className="font-medium text-white">
                {formatCurrency(deal.pricePerUnit)}
              </p>
            </div>
          )}

          {/* Forensic Rating */}
          {deal.forensicRating && (
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-white/50" />
              <span className="text-sm text-white/70">Forensic Rating:</span>
              <Badge className={`text-xs ${getForensicRatingColor(deal.forensicRating)}`}>
                {deal.forensicRating}
              </Badge>
            </div>
          )}

          {/* Footer Info */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Calendar className="w-3 h-3" />
              <span>
                {formatDistanceToNow(new Date(deal.submittedAt), { addSuffix: true })}
              </span>
            </div>

            {deal.documents.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-white/50">
                <FileText className="w-3 h-3" />
                <span>{deal.documents.length} docs</span>
              </div>
            )}
          </div>

          {/* Commission Info for mandate members */}
          {deal.commissionAmount && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: isHovered ? 1 : 0, 
                height: isHovered ? 'auto' : 0 
              }}
              className="overflow-hidden"
            >
              <div className="pt-2 border-t border-gold/20">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70">Commission ({deal.commissionRate}%)</span>
                  <span className="text-gold font-medium">
                    {formatCurrency(deal.commissionAmount)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}