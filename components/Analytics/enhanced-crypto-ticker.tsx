"use client"

import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, TrendingDown, Crown, Star, Shield, Sparkles, BarChart3, Eye, Zap } from "lucide-react"
import { useState, useEffect } from "react"
import { 
  getGoldenTextGradient, 
  getRegalCardHover, 
  getGoldenShimmerClasses,
  THEME_ANIMATIONS 
} from "@/lib/theme"
import TradingViewModal from "./TradingViewModal"

interface CryptoData {
  name: string
  symbol: string
  price: number
  change1h: number
  change24h: number
  change7d: number
  volume24h: number
  marketCap: number
  circulatingSupply: number
  logo: string
  sparkline: number[]
  rank: number
}

// Institutional 2025 cryptocurrency data - Top 16 OTC Market Assets
const cryptoAssets: CryptoData[] = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    price: 117755,
    change1h: 0.1,
    change24h: 0.4,
    change7d: 2.1,
    volume24h: 89124873625,
    marketCap: 2342427584650,
    circulatingSupply: 19881200,
    logo: "btc",
    sparkline: [115500, 116200, 116800, 117200, 117500, 117755],
    rank: 1,
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    price: 2980.25,
    change1h: 0.6,
    change24h: 7.8,
    change7d: 18.4,
    volume24h: 51931156737,
    marketCap: 359800230781,
    circulatingSupply: 120710000,
    logo: "eth",
    sparkline: [2520, 2680, 2820, 2900, 2960, 2980],
    rank: 2,
  },
  {
    name: "XRP",
    symbol: "XRP",
    price: 2.91,
    change1h: 4.5,
    change24h: 18.4,
    change7d: 31.1,
    volume24h: 11927616778,
    marketCap: 169962731559,
    circulatingSupply: 59000000000,
    logo: "xrp",
    sparkline: [2.22, 2.45, 2.68, 2.78, 2.85, 2.91],
    rank: 3,
  },
  {
    name: "Tether",
    symbol: "USDT",
    price: 1.0,
    change1h: 0.0,
    change24h: 0.0,
    change7d: 0.0,
    volume24h: 176523501571,
    marketCap: 159104014540,
    circulatingSupply: 159104014540,
    logo: "usdt",
    sparkline: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
    rank: 4,
  },
  {
    name: "BNB",
    symbol: "BNB",
    price: 691.59,
    change1h: 0.1,
    change24h: 3.5,
    change7d: 5.5,
    volume24h: 2052573829,
    marketCap: 100872378897,
    circulatingSupply: 145893000,
    logo: "bnb",
    sparkline: [655, 668, 682, 685, 689, 691],
    rank: 5,
  },
  {
    name: "Solana",
    symbol: "SOL",
    price: 165.21,
    change1h: 1.0,
    change24h: 5.3,
    change7d: 11.5,
    volume24h: 16356518921,
    marketCap: 88599888684,
    circulatingSupply: 536330000,
    logo: "sol",
    sparkline: [148, 155, 160, 162, 164, 165],
    rank: 6,
  },
  {
    name: "USDC",
    symbol: "USDC",
    price: 0.9999,
    change1h: 0.0,
    change24h: 0.0,
    change7d: 0.0,
    volume24h: 8331676222,
    marketCap: 62867392984,
    circulatingSupply: 62867392984,
    logo: "usdc",
    sparkline: [0.9999, 0.9999, 1.0, 0.9999, 1.0, 0.9999],
    rank: 7,
  },
  {
    name: "Dogecoin",
    symbol: "DOGE",
    price: 0.2043,
    change1h: 0.2,
    change24h: 15.2,
    change7d: 24.2,
    volume24h: 9650737361,
    marketCap: 30546026762,
    circulatingSupply: 149500000000,
    logo: "doge",
    sparkline: [0.164, 0.175, 0.189, 0.195, 0.201, 0.2043],
    rank: 8,
  },
  {
    name: "TRON",
    symbol: "TRX",
    price: 0.2988,
    change1h: 0.4,
    change24h: 2.9,
    change7d: 5.2,
    volume24h: 1876222445,
    marketCap: 28309112462,
    circulatingSupply: 94730000000,
    logo: "trx",
    sparkline: [0.284, 0.288, 0.292, 0.295, 0.297, 0.2988],
    rank: 9,
  },
  {
    name: "Cardano",
    symbol: "ADA",
    price: 0.7687,
    change1h: 2.8,
    change24h: 21.5,
    change7d: 34.2,
    volume24h: 2408312242,
    marketCap: 27711883836,
    circulatingSupply: 36050000000,
    logo: "ada",
    sparkline: [0.573, 0.622, 0.688, 0.721, 0.749, 0.7687],
    rank: 10,
  },
  {
    name: "Lido Staked Ether",
    symbol: "STETH",
    price: 2980.45,
    change1h: 0.5,
    change24h: 7.8,
    change7d: 18.4,
    volume24h: 121760733,
    marketCap: 27193947436,
    circulatingSupply: 9125000,
    logo: "steth",
    sparkline: [2520, 2680, 2820, 2900, 2960, 2980],
    rank: 11,
  },
  {
    name: "Hyperliquid",
    symbol: "HYPE",
    price: 45.65,
    change1h: 1.3,
    change24h: 9.5,
    change7d: 19.2,
    volume24h: 611000987,
    marketCap: 15206874627,
    circulatingSupply: 333200000,
    logo: "hype",
    sparkline: [38.3, 40.8, 42.5, 43.9, 44.8, 45.65],
    rank: 12,
  },
  {
    name: "Wrapped Bitcoin",
    symbol: "WBTC",
    price: 117588,
    change1h: 0.0,
    change24h: 5.7,
    change7d: 9.1,
    volume24h: 447882048,
    marketCap: 15152636972,
    circulatingSupply: 129000,
    logo: "wbtc",
    sparkline: [107800, 111900, 114800, 116300, 117000, 117588],
    rank: 13,
  },
  {
    name: "Wrapped stETH",
    symbol: "WSTETH",
    price: 3597.85,
    change1h: 0.6,
    change24h: 7.0,
    change7d: 18.5,
    volume24h: 32313239,
    marketCap: 12433667844,
    circulatingSupply: 3456000,
    logo: "wsteth",
    sparkline: [3036, 3220, 3385, 3480, 3560, 3597],
    rank: 14,
  },
  {
    name: "Sui",
    symbol: "SUI",
    price: 3.54,
    change1h: 0.5,
    change24h: 9.6,
    change7d: 22.4,
    volume24h: 2046544800,
    marketCap: 12244642017,
    circulatingSupply: 3460000000,
    logo: "sui",
    sparkline: [2.89, 3.08, 3.24, 3.38, 3.47, 3.54],
    rank: 15,
  },
  {
    name: "Stellar",
    symbol: "XLM",
    price: 0.3873,
    change1h: 13.3,
    change24h: 29.2,
    change7d: 62.9,
    volume24h: 1194345245,
    marketCap: 12022084937,
    circulatingSupply: 31040000000,
    logo: "xlm",
    sparkline: [0.238, 0.278, 0.325, 0.352, 0.371, 0.3873],
    rank: 16,
  },
]

function formatNumber(num: number): string {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
  return `$${num.toFixed(2)}`
}

function formatSupply(num: number, symbol: string): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B ${symbol}`
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M ${symbol}`
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K ${symbol}`
  return `${num.toFixed(2)} ${symbol}`
}

function LuxurySparkline({ data, isPositive }: { data: number[]; isPositive: boolean }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 80
      const y = 30 - ((value - min) / range) * 30
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className="relative">
      <svg width="80" height="30" className="overflow-visible">
        {/* Gradient Definition */}
        <defs>
          <linearGradient id={`gradient-${isPositive ? "up" : "down"}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.8" />
            <stop offset="100%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Area Fill */}
        <motion.path
          d={`M0,30 L${points} L80,30 Z`}
          fill={`url(#gradient-${isPositive ? "up" : "down"})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* Line */}
        <motion.polyline
          fill="none"
          stroke={isPositive ? "#10b981" : "#ef4444"}
          strokeWidth="2"
          points={points}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          filter="drop-shadow(0 0 4px rgba(215, 147, 9, 0.3))"
        />
      </svg>
    </div>
  )
}

export default function EnhancedCryptoTicker() {
  const [currentTime, setCurrentTime] = useState(() => new Date())
  const [animatedPrices, setAnimatedPrices] = useState(cryptoAssets)
  const [isMobile, setIsMobile] = useState(false)
  const [displayCount, setDisplayCount] = useState(8)
  const [isClient, setIsClient] = useState(false)
  const [selectedChart, setSelectedChart] = useState<CryptoData | null>(null)
  const [isChartModalOpen, setIsChartModalOpen] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      // Show fewer coins on mobile for better performance
      setDisplayCount(window.innerWidth < 768 ? 6 : window.innerWidth < 1024 ? 8 : 12)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    const timer = setInterval(() => {
      setCurrentTime(new Date())

      // Simulate subtle real-time price updates with deterministic seed
      setAnimatedPrices((prev) => {
        const seed = Date.now() % 10000
        return prev.map((asset, index) => ({
          ...asset,
          price: asset.price + (((seed + index * 1000) % 1000 - 500) / 1000000) * asset.price * 0.0003,
        }))
      })
    }, 8000) // Less frequent updates for better mobile performance

    return () => {
      clearInterval(timer)
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Chart modal functions
  const openChart = (crypto: CryptoData) => {
    setSelectedChart(crypto)
    setIsChartModalOpen(true)
  }

  const closeChart = () => {
    setSelectedChart(null)
    setIsChartModalOpen(false)
  }

  // Real 2025 crypto market data
  const totalMarketCap = 3763000000000
  const totalVolume = 272837000000
  const btcDominance = 62.2
  const ethDominance = 9.56

  return (
    <div className="relative">
      {/* Luxury Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy/20 via-navy-dark/30 to-navy/20 rounded-2xl blur-3xl" />

      <div className="relative glass-morphism rounded-2xl p-6 md:p-8 space-y-6 md:space-y-8 luxury-border">
        {/* Regal Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <motion.div
                variants={THEME_ANIMATIONS.crownRotation}
                animate="animate"
                className="relative"
              >
                <Crown className="w-8 h-8 md:w-10 md:h-10 text-gold" />
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full"
                  variants={THEME_ANIMATIONS.goldPulse}
                  animate="animate"
                />
              </motion.div>
              <div>
                <h3 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-white">
                  Crypto Market Pulse
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Shield className="w-4 h-4 text-gold/80" />
                  <span className="text-white/90 font-sans font-medium">
                    Sovereign Digital Asset Intelligence Engine
                  </span>
                  <Sparkles className="w-4 h-4 text-gold/80" />
                </div>
              </div>
            </div>
            <p className="text-white/80 font-sans font-light leading-relaxed">
              Real-time crypto market intelligence for {cryptoAssets.length} premium digital assets • Advanced trading intelligence
            </p>
          </div>

          <div className="text-right space-y-2">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-gold">
                <motion.div
                  className="w-3 h-3 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full shadow-lg shadow-gold/30"
                  animate={{ 
                    opacity: [1, 0.4, 1],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
                <span className="font-display font-bold text-base md:text-lg text-white">CRYPTO DATA</span>
              </div>
              <Crown className="w-5 h-5 text-gold/80" />
            </div>
            <div className="space-y-1">
              <p className="text-sm md:text-base font-sans text-gold font-medium">
                {isClient ? `${currentTime.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false })} UTC` : "Loading..."}
              </p>
              <p className="text-white/80 text-xs font-sans">
                Sovereign Digital Asset Intelligence • 2025
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Market Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence mode="wait">
            {animatedPrices.slice(0, displayCount).map((crypto, index) => (
              <motion.div
                key={crypto.symbol}
                className="group relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                whileHover={!isMobile ? { scale: 1.02, y: -4 } : {}}
              >
                {/* Regal Card Background with Royal Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-navy-800/80 via-navy-900/90 to-navy-800/80 rounded-xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-gold/8 via-gold/5 to-gold/8 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-gold/3 via-transparent to-gold/3 rounded-xl"
                  whileHover={{
                    background: "linear-gradient(135deg, rgba(215, 147, 9, 0.15), transparent, rgba(215, 147, 9, 0.15))"
                  }}
                  transition={{ duration: 0.5 }}
                />

                <div className={`relative p-4 md:p-6 border border-gold/20 group-hover:border-gold/50 rounded-xl backdrop-blur-xl ${getRegalCardHover()}`}>
                  <div className="space-y-4">
                    {/* Asset Header with Enhanced Styling */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-gold/30 to-gold/15 rounded-xl flex items-center justify-center text-gold font-bold text-base md:text-lg border border-gold/30 relative shadow-lg shadow-gold/10"
                          whileHover={!isMobile ? { 
                            scale: 1.1, 
                            rotate: 5,
                            boxShadow: "0 10px 30px rgba(215, 147, 9, 0.3)"
                          } : {}}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          {crypto.symbol.charAt(0)}
                          <motion.div 
                            className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center text-navy text-xs font-bold border-2 border-navy shadow-lg"
                            whileHover={{ scale: 1.2 }}
                          >
                            {crypto.rank <= 3 ? (
                              <Crown className="w-3 h-3" />
                            ) : (
                              <span>{crypto.rank}</span>
                            )}
                          </motion.div>
                          {crypto.rank <= 5 && (
                            <motion.div
                              className="absolute -bottom-1 -left-1"
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 3, repeat: Infinity }}
                            >
                              <Star className="w-3 h-3 text-gold-400 fill-current" />
                            </motion.div>
                          )}
                        </motion.div>
                        <div>
                          <p className="font-bold text-white text-sm md:text-base">{crypto.symbol}</p>
                          <p className="text-xs text-white/60 font-light">{crypto.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <LuxurySparkline data={crypto.sparkline} isPositive={crypto.change24h >= 0} />
                        {/* Chart Button */}
                        <motion.button
                          onClick={() => openChart(crypto)}
                          className="p-2 bg-gradient-to-br from-gold/20 to-gold/10 rounded-lg border border-gold/30 text-gold hover:bg-gold/20 hover:border-gold/50 transition-all group/chart"
                          whileHover={!isMobile ? { 
                            scale: 1.05,
                            boxShadow: "0 10px 25px rgba(215, 147, 9, 0.2)"
                          } : {}}
                          whileTap={{ scale: 0.95 }}
                          title={`Open ${crypto.symbol} Technical Chart`}
                        >
                          <BarChart3 className="w-4 h-4 group-hover/chart:scale-110 transition-transform" />
                          <motion.div
                            className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full opacity-0 group-hover/chart:opacity-100"
                            animate={{ 
                              scale: [0.8, 1.2, 0.8],
                              opacity: [0.5, 1, 0.5]
                            }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        </motion.button>
                      </div>
                    </div>

                    {/* Royal Price Display with Golden Shimmer */}
                    <motion.div
                      key={crypto.price}
                      initial={{ 
                        scale: 1.08, 
                        color: crypto.change24h >= 0 ? "#10b981" : "#ef4444",
                        textShadow: "0 0 20px rgba(215, 147, 9, 0.5)"
                      }}
                      animate={{ 
                        scale: 1, 
                        color: "#ffffff",
                        textShadow: "0 0 0 rgba(215, 147, 9, 0)"
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className={`text-2xl md:text-3xl font-display font-bold relative ${getGoldenShimmerClasses()}`}
                    >
                      <span className="relative z-10">
                        $
                        {isClient ? crypto.price.toLocaleString('en-US', {
                          minimumFractionDigits: crypto.price < 1 ? 4 : 2,
                          maximumFractionDigits: crypto.price < 1 ? 4 : 2,
                        }) : crypto.price.toFixed(crypto.price < 1 ? 4 : 2)}
                      </span>
                      {crypto.rank <= 3 && (
                        <motion.div
                          className="absolute -top-1 -right-6"
                          animate={{ 
                            opacity: [0.5, 1, 0.5],
                            scale: [0.8, 1.2, 0.8]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Sparkles className="w-4 h-4 text-gold-400" />
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Multi-timeframe Changes */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <p className="text-white/50 mb-1">1h</p>
                        <div
                          className={`flex items-center justify-center ${crypto.change1h >= 0 ? "text-green-400" : "text-red-400"}`}
                        >
                          {crypto.change1h >= 0 ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          <span className="font-medium">
                            {crypto.change1h >= 0 ? "+" : ""}
                            {crypto.change1h.toFixed(2)}%
                          </span>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-white/50 mb-1">24h</p>
                        <div
                          className={`flex items-center justify-center ${crypto.change24h >= 0 ? "text-green-400" : "text-red-400"}`}
                        >
                          {crypto.change24h >= 0 ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          <span className="font-medium">
                            {crypto.change24h >= 0 ? "+" : ""}
                            {crypto.change24h.toFixed(2)}%
                          </span>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-white/50 mb-1">7d</p>
                        <div
                          className={`flex items-center justify-center ${crypto.change7d >= 0 ? "text-green-400" : "text-red-400"}`}
                        >
                          {crypto.change7d >= 0 ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          <span className="font-medium">
                            {crypto.change7d >= 0 ? "+" : ""}
                            {crypto.change7d.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Additional Data */}
                    <div className="space-y-2 text-xs text-white/60 pt-2 border-t border-gold/10">
                      <div className="flex justify-between">
                        <span>Volume 24h:</span>
                        <span className="text-white/80 font-medium">{formatNumber(crypto.volume24h)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Market Cap:</span>
                        <span className="text-white/80 font-medium">{formatNumber(crypto.marketCap)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Supply:</span>
                        <span className="text-white/80 font-medium">
                          {formatSupply(crypto.circulatingSupply, crypto.symbol)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Show More/Less Button for Mobile */}
        {cryptoAssets.length > displayCount && (
          <div className="text-center">
            <motion.button
              onClick={() =>
                setDisplayCount(displayCount === cryptoAssets.length ? (isMobile ? 6 : 8) : cryptoAssets.length)
              }
              className="px-6 py-2 bg-gradient-to-r from-gold/20 to-gold/10 border border-gold/30 rounded-lg text-gold font-medium hover:from-gold/30 hover:to-gold/20 transition-all duration-300"
              whileHover={!isMobile ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.95 }}
            >
              {displayCount === cryptoAssets.length ? "Show Less" : `Show All ${cryptoAssets.length} Assets`}
            </motion.button>
          </div>
        )}

        {/* Royal Market Summary with Platinum Accents */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 pt-8 border-t border-gold/30">
          <motion.div
            className="text-center space-y-3 p-6 bg-gradient-to-br from-navy-800/90 via-navy-900/95 to-navy-800/90 rounded-xl border border-gold/20 backdrop-blur-xl shadow-lg"
            whileHover={!isMobile ? { 
              scale: 1.03,
              y: -2,
              boxShadow: "0 20px 40px rgba(215, 147, 9, 0.15)"
            } : {}}
            variants={THEME_ANIMATIONS.luxuryHover}
          >
            <div className="flex items-center justify-center space-x-2">
              <Crown className="w-4 h-4 text-gold/60" />
              <p className="text-white/70 text-sm font-medium">Total Market Cap</p>
            </div>
            <p className="text-2xl md:text-3xl font-display font-bold text-gold shadow-lg">
              {formatNumber(totalMarketCap)}
            </p>
            <p className="text-green-400 text-sm font-bold flex items-center justify-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>+2.7%</span>
            </p>
          </motion.div>

          <motion.div
            className="text-center space-y-3 p-6 bg-gradient-to-br from-navy-800/90 via-navy-900/95 to-navy-800/90 rounded-xl border border-gold/20 backdrop-blur-xl shadow-lg"
            whileHover={!isMobile ? { 
              scale: 1.03,
              y: -2,
              boxShadow: "0 20px 40px rgba(215, 147, 9, 0.15)"
            } : {}}
            variants={THEME_ANIMATIONS.luxuryHover}
          >
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-4 h-4 text-gold/60" />
              <p className="text-white/70 text-sm font-medium">24h Volume</p>
            </div>
            <p className="text-2xl md:text-3xl font-display font-bold text-gold shadow-lg">
              {formatNumber(totalVolume)}
            </p>
            <p className="text-red-400 text-sm font-bold flex items-center justify-center space-x-1">
              <TrendingDown className="w-3 h-3" />
              <span>-8.2%</span>
            </p>
          </motion.div>

          <motion.div
            className="text-center space-y-3 p-6 bg-gradient-to-br from-navy-800/90 via-navy-900/95 to-navy-800/90 rounded-xl border border-gold/20 backdrop-blur-xl shadow-lg"
            whileHover={!isMobile ? { 
              scale: 1.03,
              y: -2,
              boxShadow: "0 20px 40px rgba(215, 147, 9, 0.15)"
            } : {}}
            variants={THEME_ANIMATIONS.luxuryHover}
          >
            <div className="flex items-center justify-center space-x-2">
              <Shield className="w-4 h-4 text-gold/60" />
              <p className="text-white/70 text-sm font-medium">BTC Dominance</p>
            </div>
            <p className="text-2xl md:text-3xl font-display font-bold text-gold shadow-lg">
              {btcDominance}%
            </p>
            <p className="text-green-400 text-sm font-bold flex items-center justify-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>+1.8%</span>
            </p>
          </motion.div>

          <motion.div
            className="text-center space-y-3 p-6 bg-gradient-to-br from-navy-800/90 via-navy-900/95 to-navy-800/90 rounded-xl border border-gold/20 backdrop-blur-xl shadow-lg"
            whileHover={!isMobile ? { 
              scale: 1.03,
              y: -2,
              boxShadow: "0 20px 40px rgba(215, 147, 9, 0.15)"
            } : {}}
            variants={THEME_ANIMATIONS.luxuryHover}
          >
            <div className="flex items-center justify-center space-x-2">
              <Star className="w-4 h-4 text-gold/60 fill-current" />
              <p className="text-white/70 text-sm font-medium">ETH Dominance</p>
            </div>
            <p className="text-2xl md:text-3xl font-display font-bold text-gold shadow-lg">
              {ethDominance}%
            </p>
            <p className="text-blue-400 text-sm font-bold flex items-center justify-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>+0.8%</span>
            </p>
          </motion.div>

          <motion.div
            className="text-center space-y-3 p-6 bg-gradient-to-br from-navy-800/90 via-navy-900/95 to-navy-800/90 rounded-xl border border-gold/20 backdrop-blur-xl shadow-lg"
            whileHover={!isMobile ? { 
              scale: 1.03,
              y: -2,
              boxShadow: "0 20px 40px rgba(215, 147, 9, 0.15)"
            } : {}}
            variants={THEME_ANIMATIONS.luxuryHover}
          >
            <div className="flex items-center justify-center space-x-2">
              <Star className="w-4 h-4 text-gold/60 fill-current" />
              <p className="text-white/70 text-sm font-medium">Fear & Greed</p>
            </div>
            <p className="text-2xl md:text-3xl font-display font-bold text-gold shadow-lg">82</p>
            <p className="text-gold text-sm font-bold">Market Confidence</p>
          </motion.div>
        </div>
      </div>

      {/* TradingView Chart Modal */}
      {selectedChart && (
        <TradingViewModal
          isOpen={isChartModalOpen}
          onClose={closeChart}
          symbol={selectedChart.symbol}
          name={selectedChart.name}
          currentPrice={selectedChart.price}
          change24h={selectedChart.change24h}
        />
      )}
    </div>
  )
}
