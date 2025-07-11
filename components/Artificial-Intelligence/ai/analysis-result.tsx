"use client"

import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  DollarSign, 
  Calendar,
  Users,
  Shield,
  Sparkles
} from 'lucide-react'
import { DocumentAnalysis } from '@/types/financial'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface AnalysisResultProps {
  analysis: DocumentAnalysis
}

export function AnalysisResult({ analysis }: AnalysisResultProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-500/20 text-green-300 border-green-500/30'
    if (confidence >= 0.7) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
    return 'bg-red-500/20 text-red-300 border-red-500/30'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Analysis Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 glass-morphism rounded-lg flex items-center justify-center">
            {analysis.status === 'completed' ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-400" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white">Analysis Complete</h3>
            <p className="text-xs text-white/60">
              {formatDistanceToNow(new Date(analysis.processedAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        <Badge className={`${getConfidenceColor(analysis.confidence)}`}>
          <Sparkles className="w-3 h-3 mr-1" />
          {Math.round(analysis.confidence * 100)}% confidence
        </Badge>
      </div>

      {/* Extracted Deal Data */}
      {analysis.extractedData && (
        <Card className="bg-navy/50 border-gold/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white">Extracted Deal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Deal Type and Asset */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-white/70">Deal Type</p>
                <Badge className={`${
                  analysis.extractedData.dealType === 'buy' 
                    ? 'bg-green-500/20 text-green-300' 
                    : 'bg-red-500/20 text-red-300'
                } capitalize`}>
                  {analysis.extractedData.dealType}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-white/70">Asset</p>
                <Badge className="bg-gold/20 text-gold">
                  {analysis.extractedData.assetType}
                </Badge>
              </div>
            </div>

            {/* Amount and Price */}
            <div className="grid grid-cols-2 gap-4">
              {analysis.extractedData.amount && (
                <div className="space-y-1">
                  <p className="text-sm text-white/70">Amount</p>
                  <p className="font-semibold text-white">
                    {analysis.extractedData.amount.toLocaleString()} {analysis.extractedData.assetType}
                  </p>
                </div>
              )}
              {analysis.extractedData.price && (
                <div className="space-y-1">
                  <p className="text-sm text-white/70">Price per Unit</p>
                  <p className="font-semibold text-white">
                    {formatCurrency(analysis.extractedData.price)}
                  </p>
                </div>
              )}
            </div>

            {/* Parties */}
            {analysis.extractedData.parties && (
              <div className="space-y-2">
                <p className="text-sm text-white/70 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Parties Involved
                </p>
                <div className="space-y-1 text-sm">
                  {analysis.extractedData.parties.buyer && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Buyer:</span>
                      <span className="text-white">{analysis.extractedData.parties.buyer}</span>
                    </div>
                  )}
                  {analysis.extractedData.parties.seller && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Seller:</span>
                      <span className="text-white">{analysis.extractedData.parties.seller}</span>
                    </div>
                  )}
                  {analysis.extractedData.parties.introducer && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Introducer:</span>
                      <span className="text-white">{analysis.extractedData.parties.introducer}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timeframe */}
            {analysis.extractedData.timeframe && (
              <div className="space-y-2">
                <p className="text-sm text-white/70 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Timeline
                </p>
                <div className="space-y-1 text-sm">
                  {analysis.extractedData.timeframe.proposedClosing && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Proposed Closing:</span>
                      <span className="text-white">
                        {new Date(analysis.extractedData.timeframe.proposedClosing).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {analysis.extractedData.timeframe.validUntil && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Valid Until:</span>
                      <span className="text-white">
                        {new Date(analysis.extractedData.timeframe.validUntil).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional Terms */}
            {analysis.extractedData.additionalTerms && analysis.extractedData.additionalTerms.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-white/70 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Key Terms
                </p>
                <div className="space-y-1">
                  {analysis.extractedData.additionalTerms.map((term, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-1 h-1 bg-gold rounded-full" />
                      <span className="text-white/80">{term}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Suggested Actions */}
      {analysis.suggestedActions && analysis.suggestedActions.length > 0 && (
        <Card className="bg-navy/50 border-gold/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white">Recommended Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.suggestedActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-gold/30 text-white/90 hover:bg-gold/10"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {action}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Required Notice */}
      {analysis.reviewRequired && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-300 font-medium">Manual Review Required</span>
          </div>
          <p className="text-yellow-200/80 text-sm mt-1">
            This document contains complex terms that require human verification before proceeding.
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}