"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Banknote, TrendingUp, TrendingDown, ArrowUpDown, Building2, Crown, Star, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import { useDeviceDetection, prefersReducedMotion } from "@/lib/animation-utils"

interface ExchangeData {
  name: string
  balance: number
  change24h: number
  change7d: number
  change30d: number
  inflow24h: number
  outflow24h: number
  color: string
  logo: string
  tier: "Tier 1" | "Tier 2" | "Tier 3"
  rank: number
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

// Complete 2025 Bitcoin exchange balance data
const exchangeData: ExchangeData[] = [
  {
    name: "Coinbase Pro",
    balance: 605725.94,
    change24h: -833.10,
    change7d: -9223.94,
    change30d: -39995.62,
    inflow24h: 8430,
    outflow24h: 9263,
    color: "bg-blue-500",
    logo: "coinbase",
    tier: "Tier 1",
    rank: 1,
  },
  {
    name: "Binance",
    balance: 534280.33,
    change24h: 2103.82,
    change7d: 3245.39,
    change30d: -15544.95,
    inflow24h: 14250,
    outflow24h: 12146,
    color: "bg-yellow-400",
    logo: "binance",
    tier: "Tier 1",
    rank: 2,
  },
  {
    name: "Bitfinex",
    balance: 383703.16,
    change24h: 47.00,
    change7d: -755.14,
    change30d: 7357.43,
    inflow24h: 3500,
    outflow24h: 3453,
    color: "bg-green-500",
    logo: "bitfinex",
    tier: "Tier 1",
    rank: 3,
  },
  {
    name: "Gemini",
    balance: 124986.28,
    change24h: 62.55,
    change7d: -625.66,
    change30d: -2310.39,
    inflow24h: 1920,
    outflow24h: 1857,
    color: "bg-indigo-500",
    logo: "gemini",
    tier: "Tier 1",
    rank: 4,
  },
  {
    name: "OKX",
    balance: 113300.85,
    change24h: 858.29,
    change7d: 1308.58,
    change30d: -1014.62,
    inflow24h: 2800,
    outflow24h: 1942,
    color: "bg-purple-500",
    logo: "okx",
    tier: "Tier 1",
    rank: 5,
  },
  {
    name: "Kraken",
    balance: 111142.74,
    change24h: -1356.61,
    change7d: -1383.44,
    change30d: -8687.69,
    inflow24h: 950,
    outflow24h: 2307,
    color: "bg-cyan-500",
    logo: "kraken",
    tier: "Tier 1",
    rank: 6,
  },
  {
    name: "bitFlyer",
    balance: 55348.75,
    change24h: -66.36,
    change7d: -405.19,
    change30d: -792.61,
    inflow24h: 1180,
    outflow24h: 1246,
    color: "bg-orange-400",
    logo: "bitflyer",
    tier: "Tier 2",
    rank: 7,
  },
  {
    name: "Bybit",
    balance: 52704.73,
    change24h: 575.70,
    change7d: 864.96,
    change30d: -600.66,
    inflow24h: 2150,
    outflow24h: 1574,
    color: "bg-orange-500",
    logo: "bybit",
    tier: "Tier 2",
    rank: 8,
  },
  {
    name: "BitMEX",
    balance: 49212.26,
    change24h: 15.65,
    change7d: 52.91,
    change30d: -547.64,
    inflow24h: 920,
    outflow24h: 904,
    color: "bg-gray-500",
    logo: "bitmex",
    tier: "Tier 2",
    rank: 9,
  },
  {
    name: "Bithumb",
    balance: 27487.63,
    change24h: 633.47,
    change7d: 779.13,
    change30d: 1923.09,
    inflow24h: 1280,
    outflow24h: 647,
    color: "bg-red-500",
    logo: "bithumb",
    tier: "Tier 2",
    rank: 10,
  },
  {
    name: "Gate.io",
    balance: 19439.86,
    change24h: -106.84,
    change7d: -277.66,
    change30d: 3671.81,
    inflow24h: 520,
    outflow24h: 627,
    color: "bg-violet-500",
    logo: "gate",
    tier: "Tier 2",
    rank: 11,
  },
  {
    name: "Bitstamp",
    balance: 19426.40,
    change24h: -595.21,
    change7d: -594.01,
    change30d: -589.73,
    inflow24h: 380,
    outflow24h: 975,
    color: "bg-emerald-500",
    logo: "bitstamp",
    tier: "Tier 1",
    rank: 12,
  },
  {
    name: "KuCoin",
    balance: 9948.97,
    change24h: -238.96,
    change7d: -155.17,
    change30d: 6.72,
    inflow24h: 290,
    outflow24h: 529,
    color: "bg-teal-500",
    logo: "kucoin",
    tier: "Tier 2",
    rank: 13,
  },
  {
    name: "Korbit",
    balance: 6050.67,
    change24h: -13.61,
    change7d: -33.76,
    change30d: -193.80,
    inflow24h: 180,
    outflow24h: 194,
    color: "bg-slate-500",
    logo: "korbit",
    tier: "Tier 3",
    rank: 14,
  },
  {
    name: "Poloniex",
    balance: 5683.73,
    change24h: -20.03,
    change7d: -18.43,
    change30d: -87.18,
    inflow24h: 150,
    outflow24h: 170,
    color: "bg-zinc-500",
    logo: "poloniex",
    tier: "Tier 3",
    rank: 15,
  },
  {
    name: "Coinone",
    balance: 3969.42,
    change24h: -59.63,
    change7d: -89.04,
    change30d: -130.11,
    inflow24h: 120,
    outflow24h: 180,
    color: "bg-stone-500",
    logo: "coinone",
    tier: "Tier 3",
    rank: 16,
  },
]

// Real 2025 totals
const totalBalance = 2123571.23
const totalInflow = exchangeData.reduce((acc, ex) => acc + ex.inflow24h, 0)
const totalOutflow = exchangeData.reduce((acc, ex) => acc + ex.outflow24h, 0)
const netFlow = totalInflow - totalOutflow

export default function AdvancedExchangeTracker() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h")
  const [viewMode, setViewMode] = useState<"balance" | "flow">("balance")
  const [hoveredExchange, setHoveredExchange] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [floatingOrbs, setFloatingOrbs] = useState<FloatingOrb[]>([])
  const { isMobile, isMobileOrTablet } = useDeviceDetection()

  useEffect(() => {
    setIsClient(true)
    
    // Enhanced constellation of floating particles - Desktop only
    if (!isMobileOrTablet && !prefersReducedMotion()) {
      setParticles(Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 8 + Math.random() * 6,
        size: Math.random() * 1.5 + 0.8,
        opacity: Math.random() * 0.4 + 0.2,
      })))

      // Premium floating golden orbs
      setFloatingOrbs(Array.from({ length: 3 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 15 + Math.random() * 10,
        scale: Math.random() * 0.5 + 0.5,
      })))
    }
  }, [isMobileOrTablet])

  // Format numbers with luxury styling
  const formatNumber = (num: number): string => {
    if (Math.abs(num) >= 1e6) {
      return (num / 1e6).toFixed(2) + "M"
    } else if (Math.abs(num) >= 1e3) {
      return (num / 1e3).toFixed(1) + "K"
    }
    return num.toFixed(2)
  }

  const formatBTC = (num: number): string => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-400"
    if (change < 0) return "text-red-400"
    return "text-white/60"
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />
    if (change < 0) return <TrendingDown className="w-4 h-4" />
    return <ArrowUpDown className="w-4 h-4" />
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
                  y: [0, -30, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: particle.delay,
                  ease: "easeInOut",
                }}
              >
                <Star 
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
                className="absolute w-32 h-32 bg-gradient-to-r from-gold/10 to-transparent rounded-full blur-3xl"
                style={{
                  left: `${orb.left}%`,
                  top: `${orb.top}%`,
                }}
                animate={{
                  x: [0, 100, 0],
                  y: [0, -50, 0],
                  scale: [orb.scale, orb.scale * 1.2, orb.scale],
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
                <Crown className="w-6 h-6 md:w-8 md:h-8 text-gold" />
              </motion.div>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-gradient tracking-tight">
                Bitcoin Exchange Intelligence
              </h3>
            </div>
            <p className="text-white/70 font-sans font-light leading-relaxed">
              Real-time balance tracking across {exchangeData.length} major exchanges • 2025 Analytics
            </p>
            
            {/* Premium Statistics Bar */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-gold/60" />
                <span className="text-white/60">Total: <span className="text-gold font-medium">{formatBTC(totalBalance)} BTC</span></span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${netFlow > 0 ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-white/60">Net Flow: <span className={getChangeColor(netFlow)}>{netFlow > 0 ? '+' : ''}{formatNumber(netFlow)} BTC</span></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Enhanced View Mode Toggle */}
            <div className="flex bg-navy/60 backdrop-blur-sm rounded-xl p-1 border border-gold/20 luxury-border">
              {["balance", "flow"].map((mode) => (
                <motion.button
                  key={mode}
                  onClick={() => setViewMode(mode as "balance" | "flow")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    viewMode === mode
                      ? "bg-gradient-to-r from-gold to-gold-light text-navy shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                  whileHover={!isMobile ? { scale: 1.02 } : {}}
                  whileTap={{ scale: 0.98 }}
                >
                  {mode === "balance" ? "Balances" : "Flow Analysis"}
                </motion.button>
              ))}
            </div>

            {/* Enhanced Timeframe Selector */}
            <div className="flex bg-navy/60 backdrop-blur-sm rounded-xl p-1 border border-gold/20 luxury-border">
              {["24h", "7d", "30d"].map((timeframe) => (
                <motion.button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedTimeframe === timeframe
                      ? "bg-gradient-to-r from-gold to-gold-light text-navy shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                  whileHover={!isMobile ? { scale: 1.02 } : {}}
                  whileTap={{ scale: 0.98 }}
                >
                  {timeframe}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Enhanced Exchange Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={viewMode}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {exchangeData.map((exchange, index) => {
              const changeValue = selectedTimeframe === "24h" ? exchange.change24h : 
                                 selectedTimeframe === "7d" ? exchange.change7d : exchange.change30d
              
              return (
                <motion.div
                  key={exchange.name}
                  className="glass-morphism rounded-xl p-5 border border-gold/20 luxury-border relative group overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={!isMobile ? { 
                    scale: 1.02, 
                    y: -4,
                    boxShadow: "0 20px 60px rgba(215, 147, 9, 0.3)"
                  } : {}}
                  onHoverStart={() => setHoveredExchange(exchange.name)}
                  onHoverEnd={() => setHoveredExchange(null)}
                >
                  {/* Premium Tier Indicator */}
                  {exchange.tier === "Tier 1" && (
                    <motion.div 
                      className="absolute top-3 right-3"
                      whileHover={!isMobile ? { scale: 1.1, rotate: 10 } : {}}
                    >
                      <Crown className="w-4 h-4 text-gold/80" />
                    </motion.div>
                  )}

                  {/* Enhanced Exchange Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${exchange.color} shadow-lg`} />
                      <div>
                        <h4 className="font-display font-semibold text-white text-lg tracking-tight">
                          {exchange.name}
                        </h4>
                        <p className="text-xs text-white/50 uppercase tracking-wider">
                          {exchange.tier} • Rank #{exchange.rank}
                        </p>
                      </div>
                    </div>
                  </div>

                  {viewMode === "balance" ? (
                    <div className="space-y-4">
                      {/* Enhanced Balance Display */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/60 font-medium">Balance</span>
                          <span className="text-xl font-display font-bold text-white">
                            {formatBTC(exchange.balance)} <span className="text-sm text-white/70">BTC</span>
                          </span>
                        </div>
                        
                        {/* Premium Change Indicator */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/60">{selectedTimeframe} Change</span>
                          <div className={`flex items-center space-x-1 ${getChangeColor(changeValue)}`}>
                            {getChangeIcon(changeValue)}
                            <span className="font-medium">
                              {changeValue > 0 ? '+' : ''}{formatBTC(changeValue)} BTC
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-white/50">Market Share</span>
                          <span className="text-xs text-gold font-medium">
                            {((exchange.balance / totalBalance) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-navy/50 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full shadow-lg"
                            initial={{ width: 0 }}
                            animate={{ width: `${(exchange.balance / totalBalance) * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Enhanced Flow Analysis */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3 text-green-400" />
                            <span className="text-xs text-white/60">Inflow</span>
                          </div>
                          <p className="text-sm font-bold text-green-400">
                            +{formatNumber(exchange.inflow24h)} BTC
                          </p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1">
                            <TrendingDown className="w-3 h-3 text-red-400" />
                            <span className="text-xs text-white/60">Outflow</span>
                          </div>
                          <p className="text-sm font-bold text-red-400">
                            -{formatNumber(exchange.outflow24h)} BTC
                          </p>
                        </div>
                      </div>

                      {/* Enhanced Net Flow Indicator */}
                      <div className="pt-2 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/60">Net Flow (24h)</span>
                          <div className={`flex items-center space-x-1 ${getChangeColor(exchange.inflow24h - exchange.outflow24h)}`}>
                            {getChangeIcon(exchange.inflow24h - exchange.outflow24h)}
                            <span className="font-bold">
                              {exchange.inflow24h - exchange.outflow24h > 0 ? '+' : ''}
                              {formatNumber(exchange.inflow24h - exchange.outflow24h)} BTC
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Enhanced hover glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold/10 to-transparent opacity-0 pointer-events-none"
                    animate={{
                      opacity: hoveredExchange === exchange.name ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Summary Statistics */}
        <motion.div 
          className="glass-morphism rounded-xl p-6 border border-gold/20 luxury-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <Building2 className="w-6 h-6 text-gold" />
            <h4 className="text-xl font-display font-bold text-gradient">
              Market Intelligence Summary
            </h4>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <p className="text-2xl font-display font-bold text-white">
                {formatBTC(totalBalance)}
              </p>
              <p className="text-sm text-white/60">Total BTC</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-2xl font-display font-bold text-green-400">
                +{formatNumber(totalInflow)}
              </p>
              <p className="text-sm text-white/60">24h Inflow</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-2xl font-display font-bold text-red-400">
                -{formatNumber(totalOutflow)}
              </p>
              <p className="text-sm text-white/60">24h Outflow</p>
            </div>
            <div className="text-center space-y-2">
              <p className={`text-2xl font-display font-bold ${getChangeColor(netFlow)}`}>
                {netFlow > 0 ? '+' : ''}{formatNumber(netFlow)}
              </p>
              <p className="text-sm text-white/60">Net Flow</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
