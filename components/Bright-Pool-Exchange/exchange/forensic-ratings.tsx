"use client"

import { motion } from 'framer-motion'
import { Shield, TrendingUp, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { ForensicRating, ForensicRatingInfo } from '@/types/financial'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface ForensicRatingsProps {
  ratings: Record<string, ForensicRatingInfo>
  selectedRating: ForensicRating
  onRatingChange: (rating: ForensicRating) => void
}

export function ForensicRatings({ ratings, selectedRating, onRatingChange }: ForensicRatingsProps) {
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

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'very_low':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'medium':
        return <Info className="w-4 h-4 text-yellow-400" />
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      default:
        return <Info className="w-4 h-4 text-white/50" />
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'very_low':
        return 'text-emerald-400'
      case 'low':
        return 'text-green-400'
      case 'medium':
        return 'text-yellow-400'
      case 'high':
        return 'text-red-400'
      default:
        return 'text-white/50'
    }
  }

  const maxPremium = Math.max(...Object.values(ratings).map(r => r.premium))

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="glass-morphism border-gold/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-gold" />
            Forensic Rating System
          </CardTitle>
          <p className="text-white/70">
            Our proprietary system analyzes Bitcoin transaction history and provenance to assign 
            ratings that reflect the legitimacy and risk profile of digital assets.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-3">How It Works</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-gold rounded-full mt-2 flex-shrink-0" />
                  <span>Blockchain transaction analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-gold rounded-full mt-2 flex-shrink-0" />
                  <span>Source verification and chain of custody</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-gold rounded-full mt-2 flex-shrink-0" />
                  <span>AML/sanctions screening</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-gold rounded-full mt-2 flex-shrink-0" />
                  <span>Mining pool and exchange verification</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3">Benefits</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 text-green-400 mt-1 flex-shrink-0" />
                  <span>Transparent risk assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 text-green-400 mt-1 flex-shrink-0" />
                  <span>Premium pricing for clean assets</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 text-green-400 mt-1 flex-shrink-0" />
                  <span>Regulatory compliance assurance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 text-green-400 mt-1 flex-shrink-0" />
                  <span>Institutional-grade due diligence</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(ratings).map(([rating, info], index) => (
          <motion.div
            key={rating}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`glass-morphism border-2 transition-all duration-300 cursor-pointer ${
                selectedRating === rating 
                  ? 'border-gold/50 bg-gold/5' 
                  : 'border-gold/20 hover:border-gold/40'
              }`}
              onClick={() => onRatingChange(rating as ForensicRating)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={`text-lg px-3 py-1 ${getRatingColor(rating as ForensicRating)}`}>
                      {rating}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {getRiskIcon(info.riskLevel)}
                      <span className={`text-sm capitalize ${getRiskColor(info.riskLevel)}`}>
                        {info.riskLevel.replace('_', ' ')} Risk
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-gold" />
                      <span className="text-gold font-semibold">+{info.premium}%</span>
                    </div>
                    <span className="text-xs text-white/60">Premium</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-white/80">{info.description}</p>

                {/* Premium Visualization */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/70">Market Premium</span>
                    <span className="text-gold font-medium">{info.premium}% above base</span>
                  </div>
                  <Progress 
                    value={(info.premium / maxPremium) * 100} 
                    className="h-2 bg-navy/50"
                  />
                </div>

                {/* Criteria */}
                <div>
                  <h5 className="font-medium text-white mb-2">Rating Criteria</h5>
                  <ul className="space-y-1">
                    {info.criteria.map((criterion, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-white/70">
                        <CheckCircle className="w-3 h-3 text-green-400 mt-1 flex-shrink-0" />
                        <span>{criterion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedRating === rating && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-3 border-t border-gold/20"
                  >
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-gold/20 to-gold/10 hover:from-gold/30 hover:to-gold/20 text-gold border border-gold/30"
                    >
                      View {rating} Order Book
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Market Impact */}
      <Card className="glass-morphism border-gold/20">
        <CardHeader>
          <CardTitle className="text-white">Market Impact Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-8 h-8 text-emerald-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">Institutional Preference</h4>
              <p className="text-sm text-white/70">
                85% of institutional clients prefer AAA-rated assets for regulatory compliance
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-8 h-8 text-gold" />
              </div>
              <h4 className="font-semibold text-white mb-2">Premium Value</h4>
              <p className="text-sm text-white/70">
                Clean Bitcoin commands significant premiums in institutional markets
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-blue-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">Compliance Ready</h4>
              <p className="text-sm text-white/70">
                All ratings meet or exceed global regulatory requirements
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}