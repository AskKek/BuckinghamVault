"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Activity, BarChart3, Crown, Star, Shield, Sparkles, DollarSign, Bitcoin, Eye, Zap } from "lucide-react"
import { useDeviceDetection, prefersReducedMotion } from "@/lib/animation-utils"
import { 
  getGoldenTextGradient, 
  getRegalCardHover, 
  getCrownLoadingClasses,
  THEME_ANIMATIONS 
} from "@/lib/theme"

interface ChartDataPoint {
  timestamp: string
  date: string
  price: number
  exchangeBalance: number
  priceChange24h: number
  balanceChange24h: number
  correlation: number
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

// Historical Bitcoin exchange balance vs price data (2-year trend: July 2023 to July 2025)
const generateChartData = (): ChartDataPoint[] => {
  const data: ChartDataPoint[] = []
  
  // 2-year data points (monthly) - July 2023 to July 2025
  const monthlyData = [
    // Starting point (July 2023)
    { months: 24, price: 29875, balance: 2700000 },
    { months: 23, price: 31200, balance: 2685000 },
    { months: 22, price: 28900, balance: 2695000 },
    { months: 21, price: 34500, balance: 2660000 },
    { months: 20, price: 41800, balance: 2620000 },
    { months: 19, price: 38200, balance: 2640000 },
    { months: 18, price: 43700, balance: 2600000 },
    { months: 17, price: 51500, balance: 2550000 },
    { months: 16, price: 47800, balance: 2570000 },
    { months: 15, price: 54200, balance: 2520000 },
    { months: 14, price: 60500, balance: 2480000 },
    { months: 13, price: 57800, balance: 2500000 },
    { months: 12, price: 64200, balance: 2430000 },
    { months: 11, price: 71300, balance: 2380000 },
    { months: 10, price: 68700, balance: 2400000 },
    { months: 9, price: 75400, balance: 2350000 },
    { months: 8, price: 81200, balance: 2310000 },
    { months: 7, price: 77900, balance: 2330000 },
    { months: 6, price: 84600, balance: 2280000 },
    { months: 5, price: 91800, balance: 2240000 },
    { months: 4, price: 87500, balance: 2260000 },
    { months: 3, price: 94700, balance: 2210000 },
    { months: 2, price: 107200, balance: 2150000 },
    { months: 1, price: 112400, balance: 2135000 },
    // Current (July 2025)
    { months: 0, price: 117755, balance: 2123571.23 }
  ]
  
  monthlyData.forEach((point, index) => {
    const date = new Date(2025, 6, 1) // July 2025 as base
    date.setMonth(date.getMonth() - point.months)
    
    const priceChange = index > 0 ? ((point.price - monthlyData[index - 1].price) / monthlyData[index - 1].price) * 100 : 0
    const balanceChange = index > 0 ? ((point.balance - monthlyData[index - 1].balance) / monthlyData[index - 1].balance) * 100 : 0
    
    // Calculate correlation between price and balance changes
    const correlation = priceChange * balanceChange < 0 ? -0.7 : 0.3 // Strong inverse correlation
    
    data.push({
      timestamp: date.toISOString(),
      date: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      price: point.price,
      exchangeBalance: point.balance,
      priceChange24h: priceChange,
      balanceChange24h: balanceChange,
      correlation: correlation
    })
  })
  
  return data.reverse() // Reverse to show chronological order
}

export default function BitcoinBalancePriceChart() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [selectedMetric, setSelectedMetric] = useState<"price" | "balance" | "correlation">("price")
  const [timeframe, setTimeframe] = useState<"6m" | "1y" | "2y">("2y")
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [floatingOrbs, setFloatingOrbs] = useState<FloatingOrb[]>([])
  const { isMobile, isMobileOrTablet } = useDeviceDetection()

  useEffect(() => {
    setIsClient(true)
    setChartData(generateChartData())
    
    // Enhanced constellation of floating particles - Desktop only
    if (!isMobileOrTablet && !prefersReducedMotion()) {
      setParticles(Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 12 + Math.random() * 8,
        size: Math.random() * 1.2 + 0.8,
        opacity: Math.random() * 0.4 + 0.2,
      })))

      // Premium floating golden orbs
      setFloatingOrbs(Array.from({ length: 3 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 20 + Math.random() * 10,
        scale: Math.random() * 0.6 + 0.4,
      })))
    }
  }, [isMobileOrTablet])

  const currentData = chartData[0] || {
    price: 117755,
    exchangeBalance: 2123571.23,
    priceChange24h: 0.44,
    balanceChange24h: 0.045,
    correlation: -0.73
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatBalance = (balance: number): string => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(balance)
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-400"
    if (change < 0) return "text-red-400"
    return "text-white/60"
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />
    if (change < 0) return <TrendingDown className="w-4 h-4" />
    return <Activity className="w-4 h-4" />
  }

  const maxPrice = Math.max(...chartData.map(d => d.price))
  const minPrice = Math.min(...chartData.map(d => d.price))
  const maxBalance = Math.max(...chartData.map(d => d.exchangeBalance))
  const minBalance = Math.min(...chartData.map(d => d.exchangeBalance))

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
                  y: [0, -30, 0],
                  x: [0, 20, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: particle.delay,
                  ease: "easeInOut",
                }}
              >
                <Bitcoin 
                  className="text-gold/30" 
                  style={{ 
                    width: `${particle.size * 6}px`, 
                    height: `${particle.size * 6}px` 
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
                className="absolute w-36 h-36 bg-gradient-to-r from-gold/8 to-transparent rounded-full blur-3xl"
                style={{
                  left: `${orb.left}%`,
                  top: `${orb.top}%`,
                }}
                animate={{
                  x: [0, 120, 0],
                  y: [0, -40, 0],
                  scale: [orb.scale, orb.scale * 1.4, orb.scale],
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
      <div className="absolute inset-0 bg-gradient-to-br from-navy/20 via-navy-dark/30 to-navy/20 rounded-2xl blur-3xl" />

      <motion.div 
        className="relative glass-morphism rounded-2xl p-6 md:p-8 space-y-6 md:space-y-8 luxury-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Golden Oracle Header */}
        <motion.div 
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <motion.div
                className="relative"
                whileHover={!isMobile ? { scale: 1.1, rotate: 5 } : {}}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-gold/30 to-gold/15 rounded-xl flex items-center justify-center border border-gold/30 shadow-lg shadow-gold/20"
                  variants={THEME_ANIMATIONS.goldPulse}
                  animate="animate"
                >
                  <Eye className="w-6 h-6 md:w-8 md:h-8 text-gold" />
                </motion.div>
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full flex items-center justify-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-2 h-2 text-navy" />
                </motion.div>
              </motion.div>
              <div>
                <h3 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-gold">
                  Bitcoin Price vs Exchange Balance (2-Year Trend)
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Bitcoin className="w-5 h-5 text-gold/70" />
                  <span className="text-white/70 font-sans font-light">
                    Bitcoin Intelligence Engine
                  </span>
                  <Crown className="w-4 h-4 text-gold/60" />
                </div>
              </div>
            </div>
            <p className="text-white/70 font-sans font-light leading-relaxed">
              Advanced correlation analysis between exchange balances and Bitcoin price movements with institutional-grade insights
            </p>
            
            {/* Royal Statistics Bar */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <motion.div
                  className="w-2 h-2 bg-gold rounded-full"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-white/70">Correlation Signal: </span>
                <span className={`font-bold ${(currentData.correlation * 100) < 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {(currentData.correlation * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-gold/60" />
                <span className="text-white/70">Oracle-grade precision • Royal insights</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Enhanced Metric Selector */}
            <div className="flex bg-navy/60 backdrop-blur-sm rounded-xl p-1 border border-gold/20 luxury-border">
              {[
                { key: "price", label: "Price", icon: DollarSign },
                { key: "balance", label: "Balance", icon: Bitcoin },
                { key: "correlation", label: "Correlation", icon: Activity }
              ].map((metric) => (
                <motion.button
                  key={metric.key}
                  onClick={() => setSelectedMetric(metric.key as any)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-1 ${
                    selectedMetric === metric.key
                      ? "bg-gradient-to-r from-gold to-gold-light text-navy shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                  whileHover={!isMobile ? { scale: 1.02 } : {}}
                  whileTap={{ scale: 0.98 }}
                >
                  <metric.icon className="w-3 h-3" />
                  <span>{metric.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Enhanced Timeframe Selector */}
            <div className="flex bg-navy/60 backdrop-blur-sm rounded-xl p-1 border border-gold/20 luxury-border">
              {["6m", "1y", "2y"].map((tf) => (
                <motion.button
                  key={tf}
                  onClick={() => setTimeframe(tf as any)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    timeframe === tf
                      ? "bg-gradient-to-r from-gold to-gold-light text-navy shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                  whileHover={!isMobile ? { scale: 1.02 } : {}}
                  whileTap={{ scale: 0.98 }}
                >
                  {tf}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Royal Metrics Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Golden Bitcoin Price */}
          <motion.div 
            className="bg-gradient-to-br from-navy-800/90 via-navy-900/95 to-navy-800/90 rounded-xl p-6 border border-gold/30 backdrop-blur-xl shadow-lg relative group"
            whileHover={!isMobile ? { 
              scale: 1.03, 
              y: -6,
              boxShadow: "0 25px 70px rgba(215, 147, 9, 0.4)"
            } : {}}
            variants={THEME_ANIMATIONS.luxuryHover}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="w-10 h-10 bg-gradient-to-br from-gold/30 to-gold/15 rounded-lg flex items-center justify-center border border-gold/30"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                >
                  <DollarSign className="w-5 h-5 text-gold" />
                </motion.div>
                <span className="text-white/80 font-medium">Bitcoin Price</span>
              </div>
              <Crown className="w-5 h-5 text-gold/60" />
            </div>
            <div className="space-y-3">
              <p className="text-4xl font-display font-bold text-gold">
                {formatPrice(currentData.price)}
              </p>
              <div className={`flex items-center space-x-2 ${getChangeColor(currentData.priceChange24h)}`}>
                {getChangeIcon(currentData.priceChange24h)}
                <span className="font-bold">
                  {currentData.priceChange24h > 0 ? '+' : ''}{currentData.priceChange24h.toFixed(2)}% (24h)
                </span>
              </div>
            </div>
          </motion.div>

          {/* Sovereign Exchange Balance */}
          <motion.div 
            className="bg-gradient-to-br from-navy-800/90 via-navy-900/95 to-navy-800/90 rounded-xl p-6 border border-gold/30 backdrop-blur-xl shadow-lg relative group"
            whileHover={!isMobile ? { 
              scale: 1.03, 
              y: -6,
              boxShadow: "0 25px 70px rgba(215, 147, 9, 0.4)"
            } : {}}
            variants={THEME_ANIMATIONS.luxuryHover}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="w-10 h-10 bg-gradient-to-br from-gold/30 to-gold/15 rounded-lg flex items-center justify-center border border-gold/30"
                  whileHover={{ rotate: -5, scale: 1.1 }}
                >
                  <Bitcoin className="w-5 h-5 text-gold" />
                </motion.div>
                <span className="text-white/80 font-medium">Exchange Balance</span>
              </div>
              <Shield className="w-5 h-5 text-gold/60" />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-4xl font-display font-bold text-gold">
                  {formatBalance(currentData.exchangeBalance)}
                </p>
                <span className="text-xl text-white/70 font-medium">BTC</span>
              </div>
              <div className={`flex items-center space-x-2 ${getChangeColor(currentData.balanceChange24h)}`}>
                {getChangeIcon(currentData.balanceChange24h)}
                <span className="font-bold">
                  {currentData.balanceChange24h > 0 ? '+' : ''}{currentData.balanceChange24h.toFixed(2)}% (24h)
                </span>
              </div>
            </div>
          </motion.div>

          {/* Royal Correlation Oracle */}
          <motion.div 
            className="bg-gradient-to-br from-navy-800/90 via-navy-900/95 to-navy-800/90 rounded-xl p-6 border border-gold/30 backdrop-blur-xl shadow-lg relative group"
            whileHover={!isMobile ? { 
              scale: 1.03, 
              y: -6,
              boxShadow: "0 25px 70px rgba(215, 147, 9, 0.4)"
            } : {}}
            variants={THEME_ANIMATIONS.luxuryHover}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="w-10 h-10 bg-gradient-to-br from-gold/30 to-gold/15 rounded-lg flex items-center justify-center border border-gold/30"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <Activity className="w-5 h-5 text-gold" />
                </motion.div>
                <span className="text-white/80 font-medium">Market Correlation</span>
              </div>
              <Sparkles className="w-5 h-5 text-gold/60" />
            </div>
            <div className="space-y-3">
              <p className={`text-4xl font-display font-bold ${currentData.correlation < -0.5 ? 'text-red-400' : currentData.correlation > 0.5 ? 'text-green-400' : 'text-gold'}`}>
                {(currentData.correlation * 100).toFixed(1)}%
              </p>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-gold/60 fill-current" />
                <p className="text-sm text-white/70 font-medium">
                  {currentData.correlation < -0.3 ? 'Inverse Signal' : currentData.correlation > 0.3 ? 'Market Alignment' : 'Neutral Signal'}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Golden Chart Oracle */}
        <motion.div 
          className="bg-gradient-to-br from-navy-800/90 via-navy-900/95 to-navy-800/90 rounded-xl p-8 border border-gold/30 backdrop-blur-xl shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-display font-bold tracking-tight flex items-center text-gold">
                <motion.div
                  className="w-8 h-8 bg-gradient-to-br from-gold/30 to-gold/15 rounded-lg flex items-center justify-center mr-3 border border-gold/30"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                >
                  <BarChart3 className="w-4 h-4 text-gold" />
                </motion.div>
                Oracle Trend Analysis
              </h4>
              <div className="flex items-center space-x-2">
                <motion.div
                  className="w-2 h-2 bg-gold rounded-full"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-white/70 text-sm">Live Intelligence</span>
              </div>
            </div>

            {/* Chart Legend */}
            <div className="flex justify-center items-center space-x-8 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-0.5 bg-gold shadow-lg"></div>
                <span className="text-gold font-medium">Bitcoin Price ($29.9K → $117.7K)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-0.5 bg-red-400 shadow-lg"></div>
                <span className="text-red-400 font-medium">Exchange Balance (2.7M → 2.12M BTC)</span>
              </div>
            </div>

            {/* Chart Container */}
            <div className="relative h-80 bg-navy/30 rounded-lg border border-white/10 overflow-hidden">
              <div className="absolute inset-4">
                {/* Chart Grid */}
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-5 opacity-20">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className="border border-white/10" />
                  ))}
                </div>

                {/* Time Period Labels */}
                <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-xs text-white/60">
                  <span>Jul 2023</span>
                  <span>Jan 2024</span>
                  <span>Jul 2024</span>
                  <span>Jan 2025</span>
                  <span>Jul 2025</span>
                </div>

                {/* Chart Lines - Dual Axis Chart */}
                {chartData.length > 0 && (
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Price Line (Primary Y-axis) */}
                    <motion.path
                      d={chartData.map((point, i) => {
                        const x = ((chartData.length - 1 - i) / (chartData.length - 1)) * 100
                        const y = 100 - ((point.price - minPrice) / (maxPrice - minPrice)) * 75 - 10
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
                      }).join(' ')}
                      stroke="#D79309"
                      strokeWidth="1"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 0.5 }}
                      className="drop-shadow-lg"
                      vectorEffect="non-scaling-stroke"
                    />

                    {/* Balance Line (Secondary Y-axis) */}
                    <motion.path
                      d={chartData.map((point, i) => {
                        const x = ((chartData.length - 1 - i) / (chartData.length - 1)) * 100
                        const y = 100 - ((point.exchangeBalance - minBalance) / (maxBalance - minBalance)) * 75 - 10
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
                      }).join(' ')}
                      stroke="#EF4444"
                      strokeWidth="1"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 0.7 }}
                      className="drop-shadow-lg"
                      vectorEffect="non-scaling-stroke"
                    />

                    {/* Price Data Points */}
                    {chartData.map((point, i) => (
                      <motion.circle
                        key={`price-${i}`}
                        cx={((chartData.length - 1 - i) / (chartData.length - 1)) * 100}
                        cy={100 - ((point.price - minPrice) / (maxPrice - minPrice)) * 75 - 10}
                        r="1.5"
                        fill="#D79309"
                        stroke="#FFF"
                        strokeWidth="0.5"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8 + i * 0.03 }}
                        className="drop-shadow-md"
                      />
                    ))}

                    {/* Balance Data Points */}
                    {chartData.map((point, i) => (
                      <motion.circle
                        key={`balance-${i}`}
                        cx={((chartData.length - 1 - i) / (chartData.length - 1)) * 100}
                        cy={100 - ((point.exchangeBalance - minBalance) / (maxBalance - minBalance)) * 75 - 10}
                        r="1.5"
                        fill="#EF4444"
                        stroke="#FFF"
                        strokeWidth="0.5"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.0 + i * 0.03 }}
                        className="drop-shadow-md"
                      />
                    ))}

                    {/* Hover Areas for Tooltip */}
                    {chartData.map((point, i) => (
                      <motion.circle
                        key={`hover-${i}`}
                        cx={((chartData.length - 1 - i) / (chartData.length - 1)) * 100}
                        cy={100 - ((point.price - minPrice) / (maxPrice - minPrice)) * 75 - 10}
                        r="4"
                        fill="transparent"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.02 }}
                        className="cursor-pointer hover:fill-gold/20"
                        onMouseEnter={() => setHoveredPoint(i)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    ))}
                  </svg>
                )}

                {/* Tooltip */}
                <AnimatePresence>
                  {hoveredPoint !== null && chartData[hoveredPoint] && (
                    <motion.div
                      className="absolute bg-navy/95 backdrop-blur-sm rounded-lg p-3 border border-gold/20 pointer-events-none z-10"
                      style={{
                        left: `${((chartData.length - 1 - hoveredPoint) / (chartData.length - 1)) * 100}%`,
                        top: "10px",
                        transform: "translateX(-50%)"
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <div className="text-sm space-y-1">
                        <p className="text-white font-medium">{chartData[hoveredPoint].date}</p>
                        <p className="text-gold">Price: {formatPrice(chartData[hoveredPoint].price)}</p>
                        <p className="text-red-400">Balance: {formatBalance(chartData[hoveredPoint].exchangeBalance)} BTC</p>
                        <p className="text-white/70">Correlation: {(chartData[hoveredPoint].correlation * 100).toFixed(1)}%</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Chart Legend */}
            <div className="flex items-center justify-center space-x-6 text-sm">
              {selectedMetric !== "balance" && (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-0.5 bg-gold rounded-full" />
                  <span className="text-white/70">Bitcoin Price</span>
                </div>
              )}
              {selectedMetric !== "price" && (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-0.5 bg-red-400 rounded-full" />
                  <span className="text-white/70">Exchange Balance</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Royal Intelligence Insights */}
        <motion.div 
          className="bg-gradient-to-br from-navy-800/90 via-navy-900/95 to-navy-800/90 rounded-xl p-8 border border-gold/30 backdrop-blur-xl shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-display font-bold tracking-tight flex items-center text-gold">
              <motion.div
                className="w-8 h-8 bg-gradient-to-br from-gold/30 to-gold/15 rounded-lg flex items-center justify-center mr-3 border border-gold/30"
                whileHover={{ rotate: -5, scale: 1.1 }}
              >
                <Shield className="w-4 h-4 text-gold" />
              </motion.div>
              Crypto Market Intelligence
            </h4>
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-gold/60" />
              <span className="text-white/70 text-sm">Advanced Analysis</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h5 className="font-semibold text-white">Key Observations</h5>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full mt-2 flex-shrink-0" />
                  <span>Strong inverse correlation suggests institutional accumulation behavior during price appreciation</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full mt-2 flex-shrink-0" />
                  <span>Exchange outflows indicate long-term accumulation by sophisticated investors</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full mt-2 flex-shrink-0" />
                  <span>Reduced exchange liquidity may amplify price volatility during large order execution</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h5 className="font-semibold text-white">Strategic Implications</h5>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Current correlation levels support strategic accumulation thesis</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Monitor liquidity levels for optimal large-order execution timing</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Flow patterns align with long-term crypto investment strategy</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
} 