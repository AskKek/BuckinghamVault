"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Droplets, TrendingUp, TrendingDown, Target, AlertTriangle, Clock, Zap, Crown, Shield, Sparkles, Calculator, BarChart3, Activity } from "lucide-react"
import { useDeviceDetection, prefersReducedMotion } from "@/lib/animation-utils"

interface LiquidityData {
  exchange: string
  buyDepth: number
  sellDepth: number
  avgSlippage: number
  maxOrderSize: number
  optimalTime: string
  liquidityScore: number
  fees: number
  tier: "Tier 1" | "Tier 2" | "Tier 3"
  status: "Optimal" | "Caution" | "Limited"
}

interface SlippageResult {
  orderSize: number
  expectedSlippage: number
  priceImpact: number
  estimatedFill: number
  executionTime: string
  recommendation: "Execute" | "Split" | "Wait"
}

interface Particle {
  id: number
  left: number
  top: number
  delay: number
  duration: number
  size: number
  opacity: number
}

interface FloatingOrb {
  id: number
  left: number
  top: number
  delay: number
  duration: number
  scale: number
}

// Enhanced mock liquidity data
const generateLiquidityData = (): LiquidityData[] => {
  return [
    {
      exchange: "Coinbase Pro",
      buyDepth: 1847.3,
      sellDepth: 1923.7,
      avgSlippage: 0.12,
      maxOrderSize: 50000000,
      optimalTime: "14:00-16:00 UTC",
      liquidityScore: 95,
      fees: 0.003,
      tier: "Tier 1",
      status: "Optimal"
    },
    {
      exchange: "Binance",
      buyDepth: 2156.8,
      sellDepth: 2094.2,
      avgSlippage: 0.08,
      maxOrderSize: 75000000,
      optimalTime: "08:00-10:00 UTC",
      liquidityScore: 98,
      fees: 0.001,
      tier: "Tier 1",
      status: "Optimal"
    },
    {
      exchange: "Kraken",
      buyDepth: 1234.5,
      sellDepth: 1187.9,
      avgSlippage: 0.15,
      maxOrderSize: 25000000,
      optimalTime: "12:00-14:00 UTC",
      liquidityScore: 88,
      fees: 0.0025,
      tier: "Tier 1",
      status: "Optimal"
    },
    {
      exchange: "Bitstamp",
      buyDepth: 856.3,
      sellDepth: 924.1,
      avgSlippage: 0.22,
      maxOrderSize: 15000000,
      optimalTime: "09:00-11:00 UTC",
      liquidityScore: 78,
      fees: 0.005,
      tier: "Tier 2",
      status: "Caution"
    },
    {
      exchange: "Gemini",
      buyDepth: 687.2,
      sellDepth: 743.8,
      avgSlippage: 0.28,
      maxOrderSize: 10000000,
      optimalTime: "15:00-17:00 UTC",
      liquidityScore: 72,
      fees: 0.0035,
      tier: "Tier 2",
      status: "Caution"
    },
    {
      exchange: "OKX",
      buyDepth: 1456.7,
      sellDepth: 1389.3,
      avgSlippage: 0.18,
      maxOrderSize: 35000000,
      optimalTime: "06:00-08:00 UTC",
      liquidityScore: 85,
      fees: 0.001,
      tier: "Tier 1",
      status: "Optimal"
    }
  ]
}

const calculateSlippage = (orderSize: number): SlippageResult => {
  const baseSlippage = 0.1
  const sizeFactor = Math.log(orderSize / 1000000) * 0.05
  const marketConditions = Math.random() * 0.1 // Market volatility factor
  
  const expectedSlippage = Math.max(baseSlippage + sizeFactor + marketConditions, 0.05)
  const priceImpact = expectedSlippage * 1.2
  const estimatedFill = 117755 * (1 + expectedSlippage / 100)
  
  let recommendation: "Execute" | "Split" | "Wait" = "Execute"
  if (expectedSlippage > 0.5) recommendation = "Split"
  if (expectedSlippage > 1.0) recommendation = "Wait"
  
  return {
    orderSize,
    expectedSlippage,
    priceImpact,
    estimatedFill,
    executionTime: "2-5 minutes",
    recommendation
  }
}

export default function LiquidityAnalysisEngine() {
  const [liquidityData, setLiquidityData] = useState<LiquidityData[]>([])
  const [orderSize, setOrderSize] = useState<number>(10000000) // $10M default
  const [slippageResult, setSlippageResult] = useState<SlippageResult | null>(null)
  const [selectedExchange, setSelectedExchange] = useState<string>("")
  const [timeframe, setTimeframe] = useState<"current" | "24h" | "7d">("current")
  const [isClient, setIsClient] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [floatingOrbs, setFloatingOrbs] = useState<FloatingOrb[]>([])
  const { isMobile, isMobileOrTablet } = useDeviceDetection()

  useEffect(() => {
    setIsClient(true)
    setLiquidityData(generateLiquidityData())
    
    // Enhanced constellation of floating particles - Desktop only
    if (!isMobileOrTablet && !prefersReducedMotion()) {
      setParticles(Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 15 + Math.random() * 10,
        size: Math.random() * 1.3 + 0.7,
        opacity: Math.random() * 0.4 + 0.2,
      })))

      // Premium floating golden orbs
      setFloatingOrbs(Array.from({ length: 4 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 25 + Math.random() * 15,
        scale: Math.random() * 0.7 + 0.3,
      })))
    }
  }, [isMobileOrTablet])

  useEffect(() => {
    if (orderSize > 0) {
      setSlippageResult(calculateSlippage(orderSize))
    }
  }, [orderSize])

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatBTC = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Optimal": return "text-green-400"
      case "Caution": return "text-yellow-400"
      case "Limited": return "text-red-400"
      default: return "text-white/60"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Optimal": return <Target className="w-4 h-4" />
      case "Caution": return <AlertTriangle className="w-4 h-4" />
      case "Limited": return <TrendingDown className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Tier 1": return "text-gold"
      case "Tier 2": return "text-blue-400"
      case "Tier 3": return "text-purple-400"
      default: return "text-white/60"
    }
  }

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "Execute": return "text-green-400"
      case "Split": return "text-yellow-400"
      case "Wait": return "text-red-400"
      default: return "text-white/60"
    }
  }

  return (
    <div className="relative overflow-hidden">
      {/* Premium Background System - Desktop Only */}
      {isClient && !prefersReducedMotion() && !isMobileOrTablet && (
        <>
          {/* Enhanced constellation of floating particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute"
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                }}
                animate={{
                  opacity: [particle.opacity * 0.3, particle.opacity, particle.opacity * 0.3],
                  scale: [0.5, 1, 0.5],
                  y: [0, -40, 0],
                  x: [0, 30, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: particle.delay,
                  ease: "easeInOut",
                }}
              >
                <Droplets 
                  className="text-blue-400/30" 
                  style={{ 
                    width: `${particle.size * 8}px`, 
                    height: `${particle.size * 8}px` 
                  }}
                  aria-hidden="true" 
                />
              </motion.div>
            ))}
          </div>

          {/* Premium floating golden orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {floatingOrbs.map((orb) => (
              <motion.div
                key={orb.id}
                className="absolute w-40 h-40 bg-gradient-to-r from-blue-400/8 to-transparent rounded-full blur-3xl"
                style={{
                  left: `${orb.left}%`,
                  top: `${orb.top}%`,
                }}
                animate={{
                  x: [0, 140, 0],
                  y: [0, -50, 0],
                  scale: [orb.scale, orb.scale * 1.5, orb.scale],
                }}
                transition={{
                  duration: orb.duration,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: orb.delay,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Luxury Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-navy-dark/30 to-navy/20 rounded-2xl blur-3xl" />

      <motion.div 
        className="relative glass-morphism rounded-2xl p-6 md:p-8 space-y-6 md:space-y-8 luxury-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Enhanced Premium Header */}
        <motion.div 
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={!isMobile ? { scale: 1.1, rotate: 5 } : {}}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Droplets className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
              </motion.div>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-gradient tracking-tight">
                Liquidity Analysis Engine
              </h3>
            </div>
            <p className="text-white/70 font-sans font-light leading-relaxed">
              Advanced market depth analysis and optimal execution pathways for large-size crypto orders
            </p>
            
            {/* Premium Statistics Bar */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-400/60" />
                <span className="text-white/60">Real-time depth analysis • 12 exchanges monitored</span>
              </div>
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4 text-gold/60" />
                <span className="text-white/60">Advanced execution intelligence</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Enhanced Timeframe Selector */}
            <div className="flex bg-navy/60 backdrop-blur-sm rounded-xl p-1 border border-blue-400/20 luxury-border">
              {[
                { key: "current", label: "Live" },
                { key: "24h", label: "24h Avg" },
                { key: "7d", label: "7d Trend" }
              ].map((tf) => (
                <motion.button
                  key={tf.key}
                  onClick={() => setTimeframe(tf.key as any)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    timeframe === tf.key
                      ? "bg-gradient-to-r from-blue-400 to-blue-500 text-navy shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                  whileHover={!isMobile ? { scale: 1.02 } : {}}
                  whileTap={{ scale: 0.98 }}
                >
                  {tf.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Slippage Calculator */}
        <motion.div 
          className="glass-morphism rounded-xl p-6 border border-blue-400/20 luxury-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h4 className="text-lg font-display font-bold text-gradient mb-4 flex items-center tracking-tight">
            <Calculator className="w-5 h-5 mr-2 text-blue-400" />
            Advanced Slippage Calculator
          </h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Order Size (USD)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={orderSize}
                    onChange={(e) => setOrderSize(Number(e.target.value))}
                    className="w-full bg-navy/60 border border-blue-400/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                    placeholder="Enter order size..."
                    min={1000000}
                    max={100000000}
                    step={1000000}
                  />
                  <div className="absolute right-3 top-3 text-white/60 text-sm">USD</div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[1000000, 5000000, 10000000, 25000000, 50000000].map((size) => (
                    <motion.button
                      key={size}
                      onClick={() => setOrderSize(size)}
                      className="px-3 py-1 bg-blue-400/20 hover:bg-blue-400/30 rounded-lg text-xs text-white/80 transition-all"
                      whileHover={!isMobile ? { scale: 1.05 } : {}}
                      whileTap={{ scale: 0.95 }}
                    >
                      {formatCurrency(size)}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {slippageResult && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Expected Slippage:</span>
                    <span className="text-yellow-400 font-medium">{slippageResult.expectedSlippage.toFixed(3)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Price Impact:</span>
                    <span className="text-red-400 font-medium">{slippageResult.priceImpact.toFixed(3)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Estimated Fill:</span>
                    <span className="text-white font-medium">{formatCurrency(slippageResult.estimatedFill)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Execution Time:</span>
                    <span className="text-blue-400 font-medium">{slippageResult.executionTime}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <span className="text-white/70">Recommendation:</span>
                    <span className={`font-bold ${getRecommendationColor(slippageResult.recommendation)}`}>
                      {slippageResult.recommendation}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Exchange Liquidity Matrix */}
        <motion.div 
          className="glass-morphism rounded-xl p-6 border border-blue-400/20 luxury-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h4 className="text-lg font-display font-bold text-gradient mb-6 flex items-center tracking-tight">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
            Real-Time Exchange Liquidity Matrix
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Exchange</th>
                  <th className="text-right py-3 px-4 text-white/70 font-medium">Buy Depth (BTC)</th>
                  <th className="text-right py-3 px-4 text-white/70 font-medium">Sell Depth (BTC)</th>
                  <th className="text-right py-3 px-4 text-white/70 font-medium">Avg Slippage</th>
                  <th className="text-right py-3 px-4 text-white/70 font-medium">Max Order</th>
                  <th className="text-center py-3 px-4 text-white/70 font-medium">Score</th>
                  <th className="text-center py-3 px-4 text-white/70 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {liquidityData.map((exchange, index) => (
                  <motion.tr
                    key={exchange.exchange}
                    className="border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedExchange(selectedExchange === exchange.exchange ? "" : exchange.exchange)}
                    whileHover={!isMobile ? { scale: 1.01 } : {}}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${getTierColor(exchange.tier).replace('text-', 'bg-')}`} />
                        <div>
                          <p className="text-white font-medium">{exchange.exchange}</p>
                          <p className={`text-xs ${getTierColor(exchange.tier)}`}>{exchange.tier}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right text-green-400 font-mono">
                      {formatBTC(exchange.buyDepth)}
                    </td>
                    <td className="py-4 px-4 text-right text-red-400 font-mono">
                      {formatBTC(exchange.sellDepth)}
                    </td>
                    <td className="py-4 px-4 text-right text-yellow-400 font-mono">
                      {exchange.avgSlippage.toFixed(2)}%
                    </td>
                    <td className="py-4 px-4 text-right text-white/80 font-mono">
                      {formatCurrency(exchange.maxOrderSize)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className={`text-lg font-bold ${exchange.liquidityScore >= 90 ? 'text-green-400' : exchange.liquidityScore >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {exchange.liquidityScore}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className={`flex items-center justify-center space-x-1 ${getStatusColor(exchange.status)}`}>
                        {getStatusIcon(exchange.status)}
                        <span className="text-sm font-medium">{exchange.status}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Selected Exchange Details */}
        <AnimatePresence>
          {selectedExchange && (
            <motion.div 
              className="glass-morphism rounded-xl p-6 border border-gold/20 luxury-border"
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              {(() => {
                const exchange = liquidityData.find(e => e.exchange === selectedExchange)
                if (!exchange) return null
                
                return (
                  <div className="space-y-4">
                    <h4 className="text-lg font-display font-bold text-gradient flex items-center tracking-tight">
                      <Shield className="w-5 h-5 mr-2 text-gold" />
                      {exchange.exchange} - Detailed Analysis
                    </h4>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <h5 className="font-semibold text-white flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-blue-400" />
                          Optimal Execution Window
                        </h5>
                        <p className="text-blue-400 font-mono text-lg">{exchange.optimalTime}</p>
                        <p className="text-white/60 text-sm">Peak liquidity period with minimal spread impact</p>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-semibold text-white flex items-center">
                          <Target className="w-4 h-4 mr-2 text-green-400" />
                          Trading Metrics
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-white/70">Trading Fees:</span>
                            <span className="text-green-400">{(exchange.fees * 100).toFixed(3)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Liquidity Score:</span>
                            <span className="text-gold font-bold">{exchange.liquidityScore}/100</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-semibold text-white flex items-center">
                          <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                          Execution Strategy
                        </h5>
                        <div className="space-y-2 text-sm text-white/80">
                          <p>• Recommended for orders up to {formatCurrency(exchange.maxOrderSize)}</p>
                          <p>• Best suited for {exchange.tier.toLowerCase()} crypto clients</p>
                          <p>• {exchange.status === "Optimal" ? "Immediate execution recommended" : exchange.status === "Caution" ? "Consider order splitting" : "Wait for better conditions"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Market Intelligence Insights */}
        <motion.div 
          className="glass-morphism rounded-xl p-6 border border-gold/20 luxury-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h4 className="text-lg font-display font-bold text-gradient mb-4 flex items-center tracking-tight">
            <Shield className="w-5 h-5 mr-2 text-gold" />
            Strategic Liquidity Intelligence
          </h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h5 className="font-semibold text-white">Current Market Conditions</h5>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Tier 1 exchanges showing optimal liquidity levels for large crypto orders</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Asia-Pacific trading hours (06:00-10:00 UTC) offering deepest order books</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Cross-exchange arbitrage opportunities detected for large block trades</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h5 className="font-semibold text-white">Execution Recommendations</h5>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full mt-2 flex-shrink-0" />
                  <span>Orders above $25M should be split across multiple venues for optimal execution</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Consider TWAP strategies during low liquidity periods to minimize market impact</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Emergency exit protocols available for rapid liquidation scenarios</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
} 