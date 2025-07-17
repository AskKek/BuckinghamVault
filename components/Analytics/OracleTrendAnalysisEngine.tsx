"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Activity, Eye, Zap, Crown, Star, Shield, Sparkles, DollarSign, Bitcoin, BarChart3, Download, Settings, RefreshCw, Globe } from "lucide-react"
import { useDeviceDetection, prefersReducedMotion } from "@/lib/animation-utils"
import { 
  getGoldenTextGradient, 
  getRegalCardHover, 
  getCrownLoadingClasses,
  THEME_ANIMATIONS 
} from "@/lib/theme"
import PlotlyBitcoinCorrelationChart from "./PlotlyBitcoinCorrelationChart"
import EnhancedCryptoTicker from "./enhanced-crypto-ticker"

interface OracleInsight {
  id: string
  title: string
  description: string
  confidence: number
  type: 'bullish' | 'bearish' | 'neutral' | 'warning'
  timestamp: string
  source: string
}

interface MarketSentiment {
  overall: number // -100 to 100
  bitcoin: number
  altcoins: number
  institutions: number
  retail: number
  fearGreedIndex: number
  volatilityIndex: number
}

export default function OracleTrendAnalysisEngine() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"correlation" | "sentiment" | "insights" | "technical">("correlation")
  const [marketSentiment, setMarketSentiment] = useState<MarketSentiment | null>(null)
  const [oracleInsights, setOracleInsights] = useState<OracleInsight[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const { isMobile, isMobileOrTablet } = useDeviceDetection()

  useEffect(() => {
    // Simulate loading and data generation
    setIsLoading(true)
    
    setTimeout(() => {
      // Generate market sentiment data
      setMarketSentiment({
        overall: 72,
        bitcoin: 78,
        altcoins: 65,
        institutions: 85,
        retail: 58,
        fearGreedIndex: 82,
        volatilityIndex: 45
      })

      // Generate oracle insights
      setOracleInsights([
        {
          id: '1',
          title: 'Strong Institutional Accumulation Signal',
          description: 'Exchange outflows accelerating with 47,000 BTC moved to cold storage in the past 7 days, indicating strong institutional accumulation patterns.',
          confidence: 94,
          type: 'bullish',
          timestamp: new Date().toISOString(),
          source: 'Buckingham Oracle Intelligence'
        },
        {
          id: '2',
          title: 'Inverse Correlation Strength Increasing',
          description: 'Bitcoin price vs exchange balance correlation has strengthened to -0.73, suggesting continued outflow pressure during price appreciation.',
          confidence: 88,
          type: 'bullish',
          timestamp: new Date().toISOString(),
          source: 'Correlation Analysis Engine'
        },
        {
          id: '3',
          title: 'ETF Inflow Momentum Sustained',
          description: 'Bitcoin ETF net inflows maintaining $2.3B weekly average, with BlackRock IBIT leading institutional adoption metrics.',
          confidence: 91,
          type: 'bullish',
          timestamp: new Date().toISOString(),
          source: 'Institutional Flow Tracker'
        },
        {
          id: '4',
          title: 'Volatility Compression Pattern',
          description: 'Bollinger Band compression across major altcoins suggests potential breakout scenario within 5-7 trading days.',
          confidence: 76,
          type: 'neutral',
          timestamp: new Date().toISOString(),
          source: 'Technical Pattern Recognition'
        },
        {
          id: '5',
          title: 'Regulatory Clarity Improving',
          description: 'Multiple jurisdiction frameworks advancing favorably, reducing regulatory overhang concerns for institutional participants.',
          confidence: 82,
          type: 'bullish',
          timestamp: new Date().toISOString(),
          source: 'Regulatory Intelligence Center'
        }
      ])

      setLastUpdate(new Date())
      setIsLoading(false)
    }, 2000)
  }, [])

  const refreshData = () => {
    setIsLoading(true)
    // Simulate data refresh
    setTimeout(() => {
      setLastUpdate(new Date())
      setIsLoading(false)
    }, 1000)
  }

  const getInsightColor = (type: OracleInsight['type']) => {
    switch (type) {
      case 'bullish': return 'text-green-400'
      case 'bearish': return 'text-red-400'
      case 'warning': return 'text-yellow-400'
      default: return 'text-blue-400'
    }
  }

  const getInsightIcon = (type: OracleInsight['type']) => {
    switch (type) {
      case 'bullish': return <TrendingUp className="w-4 h-4" />
      case 'bearish': return <TrendingDown className="w-4 h-4" />
      case 'warning': return <Shield className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const getSentimentColor = (value: number) => {
    if (value >= 70) return 'text-green-400'
    if (value >= 30) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getSentimentLabel = (value: number) => {
    if (value >= 80) return 'Extremely Bullish'
    if (value >= 60) return 'Bullish'
    if (value >= 40) return 'Neutral'
    if (value >= 20) return 'Bearish'
    return 'Extremely Bearish'
  }

  return (
    <div className="relative overflow-hidden">
      {/* Luxury Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy/20 via-navy-dark/30 to-navy/20 rounded-2xl blur-3xl" />

      <motion.div 
        className="relative glass-morphism rounded-2xl p-6 md:p-8 space-y-6 md:space-y-8 luxury-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Oracle Engine Header */}
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
                  <Globe className="w-6 h-6 md:w-8 md:h-8 text-gold" />
                </motion.div>
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full flex items-center justify-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Eye className="w-2 h-2 text-navy" />
                </motion.div>
              </motion.div>
              <div>
                <h3 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-gold">
                  Oracle Trend Analysis Engine
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Crown className="w-5 h-5 text-gold/70" />
                  <span className="text-white/70 font-sans font-light">
                    Comprehensive Market Intelligence Platform
                  </span>
                  <Sparkles className="w-4 h-4 text-gold/60" />
                </div>
              </div>
            </div>
            <p className="text-white/70 font-sans font-light leading-relaxed">
              Advanced AI-powered analysis combining correlation intelligence, sentiment analysis, and technical pattern recognition for institutional-grade market insights
            </p>
            
            {/* Status Bar */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <motion.div
                  className="w-2 h-2 bg-green-400 rounded-full"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-white/70">Oracle Status: </span>
                <span className="font-bold text-green-400">Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-gold/60" />
                <span className="text-white/70">Last Update: {lastUpdate?.toLocaleTimeString() || 'Loading...'}</span>
              </div>
              <motion.button
                onClick={refreshData}
                className="flex items-center space-x-1 px-3 py-1 bg-gold/10 border border-gold/20 rounded-lg text-gold hover:bg-gold/20 transition-all"
                whileHover={!isMobile ? { scale: 1.05 } : {}}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="text-xs font-medium">Refresh</span>
              </motion.button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-navy/60 backdrop-blur-sm rounded-xl p-1 border border-gold/20 luxury-border">
            {[
              { key: "correlation", label: "Correlation", icon: BarChart3 },
              { key: "sentiment", label: "Sentiment", icon: Activity },
              { key: "insights", label: "Insights", icon: Eye },
              { key: "technical", label: "Technical", icon: Settings }
            ].map((tab) => (
              <motion.button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-1 ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-gold to-gold-light text-navy shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
                whileHover={!isMobile ? { scale: 1.02 } : {}}
                whileTap={{ scale: 0.98 }}
              >
                <tab.icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "correlation" && (
            <motion.div
              key="correlation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <PlotlyBitcoinCorrelationChart />
            </motion.div>
          )}

          {activeTab === "sentiment" && (
            <motion.div
              key="sentiment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Market Sentiment Dashboard */}
              <div className="bg-gradient-to-br from-navy-800/90 via-navy-900/95 to-navy-800/90 rounded-xl p-8 border border-gold/30 backdrop-blur-xl shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-display font-bold tracking-tight flex items-center text-gold">
                    <motion.div
                      className="w-8 h-8 bg-gradient-to-br from-gold/30 to-gold/15 rounded-lg flex items-center justify-center mr-3 border border-gold/30"
                      whileHover={{ rotate: 5, scale: 1.1 }}
                    >
                      <Activity className="w-4 h-4 text-gold" />
                    </motion.div>
                    Market Sentiment Analysis
                  </h4>
                  <div className="flex items-center space-x-2">
                    <motion.div
                      className="w-2 h-2 bg-gold rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-white/70 text-sm">Real-time Intelligence</span>
                  </div>
                </div>

                {marketSentiment && !isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center space-y-3 p-4 bg-navy/50 rounded-lg border border-gold/10">
                      <h5 className="text-gold font-semibold">Overall Market</h5>
                      <p className={`text-3xl font-display font-bold ${getSentimentColor(marketSentiment.overall)}`}>
                        {marketSentiment.overall}
                      </p>
                      <p className="text-sm text-white/70">{getSentimentLabel(marketSentiment.overall)}</p>
                    </div>

                    <div className="text-center space-y-3 p-4 bg-navy/50 rounded-lg border border-gold/10">
                      <h5 className="text-gold font-semibold">Bitcoin Sentiment</h5>
                      <p className={`text-3xl font-display font-bold ${getSentimentColor(marketSentiment.bitcoin)}`}>
                        {marketSentiment.bitcoin}
                      </p>
                      <p className="text-sm text-white/70">{getSentimentLabel(marketSentiment.bitcoin)}</p>
                    </div>

                    <div className="text-center space-y-3 p-4 bg-navy/50 rounded-lg border border-gold/10">
                      <h5 className="text-gold font-semibold">Institutional</h5>
                      <p className={`text-3xl font-display font-bold ${getSentimentColor(marketSentiment.institutions)}`}>
                        {marketSentiment.institutions}
                      </p>
                      <p className="text-sm text-white/70">{getSentimentLabel(marketSentiment.institutions)}</p>
                    </div>

                    <div className="text-center space-y-3 p-4 bg-navy/50 rounded-lg border border-gold/10">
                      <h5 className="text-gold font-semibold">Fear & Greed</h5>
                      <p className={`text-3xl font-display font-bold ${getSentimentColor(marketSentiment.fearGreedIndex)}`}>
                        {marketSentiment.fearGreedIndex}
                      </p>
                      <p className="text-sm text-white/70">
                        {marketSentiment.fearGreedIndex > 75 ? 'Extreme Greed' : 
                         marketSentiment.fearGreedIndex > 55 ? 'Greed' :
                         marketSentiment.fearGreedIndex > 45 ? 'Neutral' :
                         marketSentiment.fearGreedIndex > 25 ? 'Fear' : 'Extreme Fear'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40">
                    <div className="flex items-center space-x-3">
                      <motion.div
                        className={getCrownLoadingClasses()}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span className="text-gold font-medium">Loading Sentiment Data...</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "insights" && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Oracle Insights */}
              <div className="bg-gradient-to-br from-navy-800/90 via-navy-900/95 to-navy-800/90 rounded-xl p-8 border border-gold/30 backdrop-blur-xl shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-display font-bold tracking-tight flex items-center text-gold">
                    <motion.div
                      className="w-8 h-8 bg-gradient-to-br from-gold/30 to-gold/15 rounded-lg flex items-center justify-center mr-3 border border-gold/30"
                      whileHover={{ rotate: -5, scale: 1.1 }}
                    >
                      <Eye className="w-4 h-4 text-gold" />
                    </motion.div>
                    Oracle Intelligence Insights
                  </h4>
                  <div className="flex items-center space-x-2">
                    <Crown className="w-5 h-5 text-gold/60" />
                    <span className="text-white/70 text-sm">AI-Powered Analysis</span>
                  </div>
                </div>

                {!isLoading ? (
                  <div className="space-y-4">
                    {oracleInsights.map((insight, index) => (
                      <motion.div
                        key={insight.id}
                        className="p-6 bg-navy/50 rounded-lg border border-gold/10 hover:border-gold/20 transition-all"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={!isMobile ? { scale: 1.02, y: -2 } : {}}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`${getInsightColor(insight.type)}`}>
                              {getInsightIcon(insight.type)}
                            </div>
                            <h5 className="font-bold text-white">{insight.title}</h5>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-right">
                              <p className="text-xs text-white/60">Confidence</p>
                              <p className={`font-bold ${insight.confidence >= 90 ? 'text-green-400' : insight.confidence >= 75 ? 'text-yellow-400' : 'text-red-400'}`}>
                                {insight.confidence}%
                              </p>
                            </div>
                          </div>
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed mb-3">
                          {insight.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-white/60">
                          <span>{insight.source}</span>
                          <span>{new Date(insight.timestamp).toLocaleString()}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40">
                    <div className="flex items-center space-x-3">
                      <motion.div
                        className={getCrownLoadingClasses()}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span className="text-gold font-medium">Generating Oracle Insights...</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "technical" && (
            <motion.div
              key="technical"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <EnhancedCryptoTicker />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Oracle Analytics Summary */}
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
                whileHover={{ rotate: 5, scale: 1.1 }}
              >
                <Shield className="w-4 h-4 text-gold" />
              </motion.div>
              Oracle Engine Summary
            </h4>
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-gold/60" />
              <span className="text-white/70 text-sm">Institutional Intelligence</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h5 className="font-semibold text-white">Market Assessment</h5>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Strong institutional accumulation patterns confirmed across multiple data sources</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full mt-2 flex-shrink-0" />
                  <span>Correlation analysis indicates sustained inverse relationship between price and exchange balances</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Technical indicators align with fundamental analysis for positive outlook</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h5 className="font-semibold text-white">Risk Factors</h5>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Monitor regulatory developments in key jurisdictions for potential market impact</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Macroeconomic conditions may influence institutional allocation decisions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Concentration risk in large holder positions requires ongoing monitoring</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="font-semibold text-white">Oracle Recommendations</h5>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Favorable conditions for strategic accumulation strategies</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Consider scaling positions during correlation divergence periods</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Maintain diversification across asset classes and time horizons</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}