"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Zap, 
  AlertCircle,
  CheckCircle,
  Calculator
} from 'lucide-react'
import { ForensicRating } from '@/types/financial'
import { forensicRatings } from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TradingInterfaceProps {
  selectedRating: ForensicRating
  onRatingChange: (rating: ForensicRating) => void
}

export function TradingInterface({ selectedRating, onRatingChange }: TradingInterfaceProps) {
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  const [orderStyle, setOrderStyle] = useState<'market' | 'limit'>('limit')

  const basePrice = 103450 // Current market price
  const ratingInfo = forensicRatings[selectedRating]
  const premiumPrice = basePrice * (1 + (ratingInfo?.premium || 0) / 100)
  
  const calculateTotal = () => {
    const amt = parseFloat(amount) || 0
    const prc = orderStyle === 'market' ? premiumPrice : (parseFloat(price) || 0)
    return amt * prc
  }

  const handleSubmitOrder = () => {
    console.log('Submitting order:', {
      type: orderType,
      amount: parseFloat(amount),
      price: orderStyle === 'market' ? premiumPrice : parseFloat(price),
      forensicRating: selectedRating,
      style: orderStyle
    })
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

  return (
    <Card className="glass-morphism border-gold/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-gold" />
          Trading Interface
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Market Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="bg-navy/30 border-gold/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Market Price</p>
                  <p className="text-lg font-bold text-white">
                    ${basePrice.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-navy/30 border-gold/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">24h Change</p>
                  <p className="text-lg font-bold text-green-400">+2.1%</p>
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Type Tabs */}
        <Tabs value={orderType} onValueChange={(value) => setOrderType(value as 'buy' | 'sell')}>
          <TabsList className="grid w-full grid-cols-2 bg-navy/50">
            <TabsTrigger value="buy" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300">
              <TrendingUp className="w-4 h-4 mr-2" />
              Buy
            </TabsTrigger>
            <TabsTrigger value="sell" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-300">
              <TrendingDown className="w-4 h-4 mr-2" />
              Sell
            </TabsTrigger>
          </TabsList>

          <TabsContent value={orderType} className="space-y-4">
            {/* Forensic Rating Selection */}
            <div className="space-y-2">
              <Label className="text-white/90 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Forensic Rating
              </Label>
              <Select value={selectedRating} onValueChange={(value: ForensicRating) => onRatingChange(value)}>
                <SelectTrigger className="bg-navy/50 border-gold/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-navy/95 border-gold/20">
                  {Object.entries(forensicRatings).map(([rating, info]) => (
                    <SelectItem 
                      key={rating} 
                      value={rating}
                      className="text-white hover:bg-white/5"
                    >
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getRatingColor(rating as ForensicRating)}`}>
                          {rating}
                        </Badge>
                        <span>+{info.premium}% premium</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {ratingInfo && (
                <div className="p-3 bg-navy/30 rounded-lg border border-gold/10">
                  <p className="text-sm text-white/80">{ratingInfo.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={`text-xs ${getRatingColor(selectedRating)}`}>
                      {selectedRating}
                    </Badge>
                    <span className="text-xs text-white/60">
                      Risk Level: {ratingInfo.riskLevel.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Order Style */}
            <div className="space-y-2">
              <Label className="text-white/90">Order Type</Label>
              <Select value={orderStyle} onValueChange={(value: 'market' | 'limit') => setOrderStyle(value)}>
                <SelectTrigger className="bg-navy/50 border-gold/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-navy/95 border-gold/20">
                  <SelectItem value="limit" className="text-white hover:bg-white/5">
                    Limit Order
                  </SelectItem>
                  <SelectItem value="market" className="text-white hover:bg-white/5">
                    Market Order
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label className="text-white/90">Amount (BTC)</Label>
              <Input
                type="number"
                step="0.00000001"
                placeholder="0.00000000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-navy/50 border-gold/20 text-white placeholder:text-white/50"
              />
            </div>

            {/* Price Input (for limit orders) */}
            {orderStyle === 'limit' && (
              <div className="space-y-2">
                <Label className="text-white/90">Price (USD)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder={premiumPrice.toFixed(2)}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="bg-navy/50 border-gold/20 text-white placeholder:text-white/50"
                />
              </div>
            )}

            {/* Order Summary */}
            <div className="p-4 bg-navy/30 rounded-lg border border-gold/10 space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="w-4 h-4 text-gold" />
                <span className="font-medium text-white">Order Summary</span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Order Type:</span>
                  <span className="text-white capitalize">{orderStyle} {orderType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Amount:</span>
                  <span className="text-white">{amount || '0'} BTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Price:</span>
                  <span className="text-white">
                    ${orderStyle === 'market' 
                      ? premiumPrice.toFixed(2) 
                      : (price || premiumPrice.toFixed(2))
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Premium:</span>
                  <span className="text-gold">+{ratingInfo?.premium || 0}%</span>
                </div>
                <div className="border-t border-white/10 pt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-white/90">Total:</span>
                    <span className="text-white">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmitOrder}
              disabled={!amount || (orderStyle === 'limit' && !price)}
              className={`w-full font-semibold ${
                orderType === 'buy'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
              }`}
            >
              {orderType === 'buy' ? (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Place Buy Order
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Place Sell Order
                </>
              )}
            </Button>

            {/* Risk Disclaimer */}
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-yellow-200">
                  <p className="font-medium mb-1">Risk Disclosure</p>
                  <p>
                    Trading digital assets involves substantial risk. Forensic ratings do not guarantee 
                    the legitimacy of assets. Only trade what you can afford to lose.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}