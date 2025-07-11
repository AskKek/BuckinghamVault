"use client"

/**
 * Theme System Integration Example
 * Demonstrates the centralized theme utilities in action
 */

import React from 'react'
import { FeatureCard } from '@/components/shared/FeatureCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  DealStatusBadge,
  DealTypeBadge,
  ForensicRatingBadge,
  AssetTypeBadge,
  KycStatusBadge,
  RiskLevelIndicator,
  CurrencyDisplay,
  ProgressRing,
  StatusIcon,
  getStatusColor,
  getStatusBadgeClasses,
  getInteractionClasses,
  THEME_ANIMATIONS,
  type DealStatus,
  type DealType,
  type ForensicRating
} from '@/lib/theme'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Sample data for demonstration
const sampleDeals = [
  {
    id: '1',
    dealNumber: 'BV-2024-001',
    clientName: 'Alpha Capital',
    status: 'completed' as DealStatus,
    type: 'acquisition' as DealType,
    amount: 250000000,
    forensicRating: 'AAA' as ForensicRating,
    progress: 100,
    risk: 'low' as const
  },
  {
    id: '2',
    dealNumber: 'BV-2024-002', 
    clientName: 'Beta Holdings',
    status: 'negotiating' as DealStatus,
    type: 'divestiture' as DealType,
    amount: 180000000,
    forensicRating: 'AA' as ForensicRating,
    progress: 65,
    risk: 'medium' as const
  },
  {
    id: '3',
    dealNumber: 'BV-2024-003',
    clientName: 'Gamma Enterprises', 
    status: 'due_diligence' as DealStatus,
    type: 'merger' as DealType,
    amount: 500000000,
    forensicRating: 'A' as ForensicRating,
    progress: 45,
    risk: 'high' as const
  }
]

export function ThemeSystemExample() {
  return (
    <div className="space-y-6">
      {/* Status Badges Showcase */}
      <FeatureCard variant="glass" className="border-gold/20">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Status Badge System</h3>
          
          <div className="space-y-4">
            {/* Deal Status Examples */}
            <div>
              <h4 className="text-sm font-medium text-white/80 mb-2">Deal Statuses</h4>
              <div className="flex flex-wrap gap-2">
                <DealStatusBadge status="submitted" />
                <DealStatusBadge status="under_review" />
                <DealStatusBadge status="matched" />
                <DealStatusBadge status="negotiating" />
                <DealStatusBadge status="due_diligence" />
                <DealStatusBadge status="completed" />
                <DealStatusBadge status="cancelled" />
              </div>
            </div>
            
            {/* Deal Type Examples */}
            <div>
              <h4 className="text-sm font-medium text-white/80 mb-2">Deal Types</h4>
              <div className="flex flex-wrap gap-2">
                <DealTypeBadge type="buy" variant="outline" />
                <DealTypeBadge type="sell" variant="outline" />
                <DealTypeBadge type="acquisition" variant="outline" />
                <DealTypeBadge type="divestiture" variant="outline" />
                <DealTypeBadge type="merger" variant="outline" />
                <DealTypeBadge type="ipo" variant="outline" />
              </div>
            </div>
            
            {/* Forensic Ratings */}
            <div>
              <h4 className="text-sm font-medium text-white/80 mb-2">Forensic Ratings</h4>
              <div className="flex flex-wrap gap-2">
                <ForensicRatingBadge rating="AAA" showStars />
                <ForensicRatingBadge rating="AA" showStars />
                <ForensicRatingBadge rating="A" showStars />
                <ForensicRatingBadge rating="BBB" showStars />
                <ForensicRatingBadge rating="unrated" showStars />
              </div>
            </div>
          </div>
        </div>
      </FeatureCard>
      
      {/* Risk Indicators */}
      <FeatureCard variant="glass" className="border-gold/20">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Risk Level Indicators</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-white/80">Badge Style</h4>
              <RiskLevelIndicator level="very_low" variant="badge" />
              <RiskLevelIndicator level="low" variant="badge" />
              <RiskLevelIndicator level="medium" variant="badge" />
              <RiskLevelIndicator level="high" variant="badge" />
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-white/80">Progress Bar Style</h4>
              <RiskLevelIndicator level="very_low" variant="bar" />
              <RiskLevelIndicator level="low" variant="bar" />
              <RiskLevelIndicator level="medium" variant="bar" />
              <RiskLevelIndicator level="high" variant="bar" />
            </div>
          </div>
        </div>
      </FeatureCard>
      
      {/* Deal Cards with Theme Integration */}
      <FeatureCard variant="glass" className="border-gold/20">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Themed Deal Cards</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sampleDeals.map((deal) => {
              const statusColors = getStatusColor('deal', deal.status)
              const interactionClasses = getInteractionClasses('deal', deal.status, 'card')
              
              return (
                <motion.div
                  key={deal.id}
                  {...THEME_ANIMATIONS.slideUp}
                  className={cn(
                    'p-4 rounded-lg border backdrop-blur-sm',
                    statusColors.bg,
                    statusColors.border,
                    interactionClasses
                  )}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">{deal.dealNumber}</span>
                      <ProgressRing 
                        percentage={deal.progress} 
                        size={40} 
                        strokeWidth={4}
                        type={
                          deal.progress >= 80 ? 'success' : 
                          deal.progress >= 50 ? 'warning' : 'error'
                        }
                      />
                    </div>
                    
                    {/* Client */}
                    <div className="text-sm text-white/70">{deal.clientName}</div>
                    
                    {/* Amount */}
                    <CurrencyDisplay 
                      amount={deal.amount}
                      size="lg"
                      threshold={{ positive: 200000000 }}
                      className="text-lg font-bold"
                    />
                    
                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2">
                      <DealStatusBadge status={deal.status} size="sm" />
                      <DealTypeBadge type={deal.type} size="sm" variant="outline" />
                      <ForensicRatingBadge rating={deal.forensicRating} size="sm" />
                    </div>
                    
                    {/* Risk Indicator */}
                    <RiskLevelIndicator level={deal.risk} variant="bar" />
                    
                    {/* Action Button */}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={cn(
                        'w-full mt-3',
                        getInteractionClasses('deal', deal.status, 'button')
                      )}
                    >
                      View Details
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </FeatureCard>
      
      {/* Currency Display Variants */}
      <FeatureCard variant="glass" className="border-gold/20">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Currency Display System</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-navy-800/40 rounded-lg">
              <div className="text-sm text-white/60 mb-2">Large Amount</div>
              <CurrencyDisplay amount={250000000} size="lg" />
            </div>
            
            <div className="text-center p-4 bg-navy-800/40 rounded-lg">
              <div className="text-sm text-white/60 mb-2">Above Threshold</div>
              <CurrencyDisplay 
                amount={180000000} 
                threshold={{ positive: 150000000 }}
                size="lg"
              />
            </div>
            
            <div className="text-center p-4 bg-navy-800/40 rounded-lg">
              <div className="text-sm text-white/60 mb-2">Negative Amount</div>
              <CurrencyDisplay amount={-50000} size="lg" />
            </div>
            
            <div className="text-center p-4 bg-navy-800/40 rounded-lg">
              <div className="text-sm text-white/60 mb-2">Zero Amount</div>
              <CurrencyDisplay amount={0} size="lg" />
            </div>
          </div>
        </div>
      </FeatureCard>
      
      {/* Dynamic Badge Examples */}
      <FeatureCard variant="glass" className="border-gold/20">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Dynamic Status Mapping</h3>
          
          <div className="space-y-4">
            {/* KYC Status Examples */}
            <div>
              <h4 className="text-sm font-medium text-white/80 mb-2">KYC Status</h4>
              <div className="flex gap-2">
                <KycStatusBadge status="pending" />
                <KycStatusBadge status="approved" />
                <KycStatusBadge status="rejected" />
              </div>
            </div>
            
            {/* Asset Type Examples */}
            <div>
              <h4 className="text-sm font-medium text-white/80 mb-2">Asset Types</h4>
              <div className="flex gap-2">
                <AssetTypeBadge assetType="BTC" />
                <AssetTypeBadge assetType="ETH" />
                <AssetTypeBadge assetType="USDT" />
                <AssetTypeBadge assetType="USDC" />
                <AssetTypeBadge assetType="other" />
              </div>
            </div>
            
            {/* Custom Status with Icons */}
            <div>
              <h4 className="text-sm font-medium text-white/80 mb-2">Status with Icons</h4>
              <div className="flex gap-2">
                <div className="flex items-center gap-1">
                  <StatusIcon category="deal" value="completed" />
                  <span className="text-sm text-white">Completed</span>
                </div>
                <div className="flex items-center gap-1">
                  <StatusIcon category="deal" value="pending" />
                  <span className="text-sm text-white">Pending</span>
                </div>
                <div className="flex items-center gap-1">
                  <StatusIcon category="deal" value="cancelled" />
                  <span className="text-sm text-white">Cancelled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FeatureCard>
      
      {/* Integration Guide */}
      <FeatureCard variant="minimal" className="border-white/10">
        <div className="p-6">
          <h4 className="text-md font-semibold text-white mb-3">Theme System Usage</h4>
          <div className="space-y-2 text-sm text-white/70">
            <p>• Import theme components: <code className="text-gold-400">import &#123; DealStatusBadge &#125; from '@/lib/theme'</code></p>
            <p>• Use utility functions: <code className="text-gold-400">getStatusColor('deal', 'completed')</code></p>
            <p>• Apply consistent styling: <code className="text-gold-400">getStatusBadgeClasses('deal', status)</code></p>
            <p>• Access theme presets: <code className="text-gold-400">THEME_PRESETS.glass</code></p>
            <p>• Use interaction classes: <code className="text-gold-400">getInteractionClasses('deal', status, 'button')</code></p>
          </div>
        </div>
      </FeatureCard>
    </div>
  )
}