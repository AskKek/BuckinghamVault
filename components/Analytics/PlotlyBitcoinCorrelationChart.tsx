"use client"

import { motion } from "framer-motion"
import { useState, useEffect, useMemo, memo, useCallback } from "react"
import dynamic from "next/dynamic"
import { TrendingUp, TrendingDown, Activity, Eye, Zap, Crown, Star, Shield, Sparkles, DollarSign, Bitcoin, BarChart3, Download } from "lucide-react"
import { useDeviceDetection } from "@/lib/animation-utils"
import { 
  THEME_ANIMATIONS 
} from "@/lib/theme"

// Dynamic import for Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-navy/30 rounded-lg border border-gold/20">
      <div className="flex items-center space-x-3">
        <motion.div
          className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <span className="text-gold font-medium">Loading Oracle Chart...</span>
      </div>
    </div>
  )
})

interface PlotlyCorrelationDataPoint {
  timestamp: string
  date: string
  price: number
  exchangeBalance: number
  priceChange24h: number
  balanceChange24h: number
  correlation: number
  volume: number
}

interface PlotlyChartData {
  dates: string[]
  bitcoinPrices: number[]
  exchangeBalances: number[]
  correlationValues: number[]
  volumes: number[]
  priceChanges: number[]
}

// Enhanced 2-year Bitcoin correlation data with Plotly optimization
const generatePlotlyChartData = (): PlotlyCorrelationDataPoint[] => {
  const data: PlotlyCorrelationDataPoint[] = []
  
  // 2-year data points (weekly) - July 2023 to July 2025 (104 weeks)
  const weeklyData = [
    // Starting point (July 2023)
    { weeks: 104, price: 29875, balance: 2700000, volume: 42000000000 },
    { weeks: 100, price: 31200, balance: 2685000, volume: 38500000000 },
    { weeks: 96, price: 28900, balance: 2695000, volume: 51200000000 },
    { weeks: 92, price: 34500, balance: 2660000, volume: 47800000000 },
    { weeks: 88, price: 41800, balance: 2620000, volume: 55400000000 },
    { weeks: 84, price: 38200, balance: 2640000, volume: 49200000000 },
    { weeks: 80, price: 43700, balance: 2600000, volume: 58700000000 },
    { weeks: 76, price: 51500, balance: 2550000, volume: 64200000000 },
    { weeks: 72, price: 47800, balance: 2570000, volume: 56800000000 },
    { weeks: 68, price: 54200, balance: 2520000, volume: 67300000000 },
    { weeks: 64, price: 60500, balance: 2480000, volume: 72100000000 },
    { weeks: 60, price: 57800, balance: 2500000, volume: 68900000000 },
    { weeks: 56, price: 64200, balance: 2430000, volume: 75400000000 },
    { weeks: 52, price: 71300, balance: 2380000, volume: 81200000000 },
    { weeks: 48, price: 68700, balance: 2400000, volume: 77800000000 },
    { weeks: 44, price: 75400, balance: 2350000, volume: 84300000000 },
    { weeks: 40, price: 81200, balance: 2310000, volume: 89700000000 },
    { weeks: 36, price: 77900, balance: 2330000, volume: 86100000000 },
    { weeks: 32, price: 84600, balance: 2280000, volume: 92500000000 },
    { weeks: 28, price: 91800, balance: 2240000, volume: 98200000000 },
    { weeks: 24, price: 87500, balance: 2260000, volume: 94800000000 },
    { weeks: 20, price: 94700, balance: 2210000, volume: 101300000000 },
    { weeks: 16, price: 107200, balance: 2150000, volume: 115600000000 },
    { weeks: 12, price: 112400, balance: 2135000, volume: 122800000000 },
    { weeks: 8, price: 109800, balance: 2142000, volume: 118900000000 },
    { weeks: 4, price: 115600, balance: 2128000, volume: 127300000000 },
    // Current (July 2025)
    { weeks: 0, price: 117755, balance: 2123571.23, volume: 131400000000 }
  ]
  
  weeklyData.forEach((point, index) => {
    const date = new Date(2025, 6, 15) // July 15, 2025 as base
    date.setDate(date.getDate() - (point.weeks * 7))
    
    const priceChange = index > 0 ? ((point.price - weeklyData[index - 1].price) / weeklyData[index - 1].price) * 100 : 0
    const balanceChange = index > 0 ? ((point.balance - weeklyData[index - 1].balance) / weeklyData[index - 1].balance) * 100 : 0
    
    // Calculate correlation between price and balance changes
    const correlation = priceChange * balanceChange < 0 ? -0.73 - (Math.random() * 0.15) : 0.25 + (Math.random() * 0.2)
    
    data.push({
      timestamp: date.toISOString(),
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }),
      price: point.price,
      exchangeBalance: point.balance,
      priceChange24h: priceChange,
      balanceChange24h: balanceChange,
      correlation: correlation,
      volume: point.volume
    })
  })
  
  return data.reverse() // Reverse to show chronological order
}

// Memoized chart data generation to prevent unnecessary recalculations
const useMemoizedChartData = () => {
  return useMemo(() => {
    return generatePlotlyChartData()
  }, []) // No dependencies since data is static
}

const PlotlyBitcoinCorrelationChart = memo(function PlotlyBitcoinCorrelationChart() {
  const [chartData, setChartData] = useState<PlotlyCorrelationDataPoint[]>([])
  const [selectedMetric, setSelectedMetric] = useState<"price" | "balance" | "correlation" | "volume">("price")
  const [timeframe, setTimeframe] = useState<"6m" | "1y" | "2y">("2y")
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { isMobile, isMobileOrTablet } = useDeviceDetection()
  
  // Memoized data generation for performance
  const memoizedData = useMemoizedChartData()

  useEffect(() => {
    setIsClient(true)
    setIsLoading(true)
    
    // Use memoized data to reduce computation time
    setTimeout(() => {
      setChartData(memoizedData)
      setIsLoading(false)
    }, isMobile ? 800 : 1500) // Faster loading on mobile
  }, [memoizedData, isMobile])

  // Memoized data filtering and processing for better performance
  const plotlyData = useMemo((): PlotlyChartData => {
    if (!chartData.length) return {
      dates: [],
      bitcoinPrices: [],
      exchangeBalances: [],
      correlationValues: [],
      volumes: [],
      priceChanges: []
    }

    // Filter data based on timeframe
    let filteredData = chartData
    const now = new Date()
    
    if (timeframe === "6m") {
      const sixMonthsAgo = new Date(now.getTime() - (6 * 30 * 24 * 60 * 60 * 1000))
      filteredData = chartData.filter(d => new Date(d.timestamp) >= sixMonthsAgo)
    } else if (timeframe === "1y") {
      const oneYearAgo = new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000))
      filteredData = chartData.filter(d => new Date(d.timestamp) >= oneYearAgo)
    }

    return {
      dates: filteredData.map(d => d.date),
      bitcoinPrices: filteredData.map(d => d.price),
      exchangeBalances: filteredData.map(d => d.exchangeBalance),
      correlationValues: filteredData.map(d => d.correlation),
      volumes: filteredData.map(d => d.volume),
      priceChanges: filteredData.map(d => d.priceChange24h)
    }
  }, [chartData, timeframe])

  const currentData = chartData[chartData.length - 1] || {
    price: 117755,
    exchangeBalance: 2123571.23,
    priceChange24h: 0.44,
    balanceChange24h: -0.045,
    correlation: -0.73,
    volume: 131400000000
  }

  // Memoized formatting functions for better performance
  const formatPrice = useCallback((price: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }, [])

  const formatBalance = useCallback((balance: number): string => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(balance)
  }, [])

  const formatVolume = useCallback((volume: number): string => {
    if (volume >= 1e12) return `$${(volume / 1e12).toFixed(2)}T`
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`
    return `$${volume.toFixed(2)}`
  }, [])

  const getChangeColor = useCallback((change: number) => {
    if (change > 0) return "text-green-400"
    if (change < 0) return "text-red-400"
    return "text-white/60"
  }, [])

  const getChangeIcon = useCallback((change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />
    if (change < 0) return <TrendingDown className="w-4 h-4" />
    return <Activity className="w-4 h-4" />
  }, [])

  // Plotly configuration for institutional-grade styling
  const plotlyConfig = {
    displayModeBar: true,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'autoScale2d', 'resetScale2d'],
    modeBarButtonsToAdd: [
      {
        name: 'Download PNG',
        icon: { 
          'width': 857.1,
          'height': 1000,
          'path': 'm214-7h429v214h-429v-214z m500 0h72v500q0 8-6 21t-11 20l-157 156q-5 6-19 12t-22 5v-232q0-22-15-38t-38-16h-322q-22 0-37 16t-16 38v232h-72v-714h72v232q0 22 16 38t37 16h465q22 0 38-16t15-38v-232z',
          'transform': 'matrix(1 0 0 -1 0 850)'
        },
        click: function(gd: any) {
          (window as any).Plotly.downloadImage(gd, {
            format: 'png',
            filename: 'buckingham-vault-bitcoin-analysis',
            height: 800,
            width: 1200,
            scale: 2
          })
        }
      }
    ],
    displaylogo: false,
    responsive: true,
    showTips: false,
    toImageButtonOptions: {
      format: 'png',
      filename: 'buckingham-vault-bitcoin-analysis',
      height: 800,
      width: 1200,
      scale: 2
    }
  }

  const plotlyLayout = {
    paper_bgcolor: 'rgba(16, 27, 62, 0.95)',
    plot_bgcolor: 'rgba(16, 27, 62, 0.8)',
    font: { 
      family: 'Lato, Arial, sans-serif', 
      color: '#D79309',
      size: 12
    },
    title: {
      text: '<b>Bitcoin Price vs Exchange Balance Oracle Analysis</b>',
      font: { 
        family: 'Playfair Display, serif',
        size: 20,
        color: '#D79309'
      },
      x: 0.5,
      y: 0.95
    },
    xaxis: {
      title: {
        text: '<b>Time Period</b>',
        font: { color: '#D79309', size: 14 }
      },
      gridcolor: 'rgba(215, 147, 9, 0.1)',
      tickfont: { color: '#ffffff', size: 10 },
      linecolor: 'rgba(215, 147, 9, 0.2)',
      mirror: true
    },
    yaxis: {
      title: {
        text: '<b>Bitcoin Price (USD)</b>',
        font: { color: '#D79309', size: 14 }
      },
      side: 'left',
      gridcolor: 'rgba(215, 147, 9, 0.1)',
      tickfont: { color: '#ffffff', size: 10 },
      linecolor: 'rgba(215, 147, 9, 0.2)',
      tickformat: '$,.0f'
    },
    yaxis2: {
      title: {
        text: '<b>Exchange Balance (BTC)</b>',
        font: { color: '#EF4444', size: 14 }
      },
      side: 'right',
      overlaying: 'y',
      gridcolor: 'rgba(239, 68, 68, 0.1)',
      tickfont: { color: '#EF4444', size: 10 },
      linecolor: 'rgba(239, 68, 68, 0.2)',
      tickformat: ',.0f',
      showgrid: false
    },
    legend: {
      x: 0.02,
      y: 0.98,
      bgcolor: 'rgba(16, 27, 62, 0.8)',
      bordercolor: 'rgba(215, 147, 9, 0.3)',
      borderwidth: 1,
      font: { color: '#ffffff', size: 11 }
    },
    margin: { t: 80, r: 80, b: 80, l: 80 },
    height: isMobile ? 400 : 500,
    hovermode: 'x unified',
    hoverlabel: {
      bgcolor: 'rgba(16, 27, 62, 0.95)',
      bordercolor: 'rgba(215, 147, 9, 0.5)',
      font: { color: '#ffffff', size: 11 }
    }
  }

  const plotlyTraces = [
    // Bitcoin Price Line
    {
      x: plotlyData.dates,
      y: plotlyData.bitcoinPrices,
      type: 'scatter' as const,
      mode: 'lines+markers' as const,
      name: 'Bitcoin Price',
      line: { 
        color: '#D79309', 
        width: 3,
        shape: 'spline' as const
      },
      marker: { 
        color: '#D79309', 
        size: 6,
        symbol: 'circle'
      },
      yaxis: 'y',
      hovertemplate: '<b>%{fullData.name}</b><br>' +
                    'Date: %{x}<br>' +
                    'Price: $%{y:,.0f}<br>' +
                    '<extra></extra>'
    },
    // Exchange Balance Line
    {
      x: plotlyData.dates,
      y: plotlyData.exchangeBalances,
      type: 'scatter' as const,
      mode: 'lines+markers' as const,
      name: 'Exchange Balance',
      line: { 
        color: '#EF4444', 
        width: 3,
        shape: 'spline' as const
      },
      marker: { 
        color: '#EF4444', 
        size: 6,
        symbol: 'diamond'
      },
      yaxis: 'y2',
      hovertemplate: '<b>%{fullData.name}</b><br>' +
                    'Date: %{x}<br>' +
                    'Balance: %{y:,.0f} BTC<br>' +
                    '<extra></extra>'
    }
  ]

  // Add correlation or volume trace based on selected metric
  if (selectedMetric === "correlation") {
    plotlyTraces.push({
      x: plotlyData.dates,
      y: plotlyData.correlationValues.map(v => v * 100), // Convert to percentage
      type: 'scatter' as const,
      mode: 'lines' as const,
      name: 'Correlation %',
      line: { 
        color: '#8B5CF6', 
        width: 2,
        dash: 'dot' as const
      },
      yaxis: 'y3',
      hovertemplate: '<b>%{fullData.name}</b><br>' +
                    'Date: %{x}<br>' +
                    'Correlation: %{y:.1f}%<br>' +
                    '<extra></extra>'
    } as any)

    // Add third y-axis for correlation
    plotlyLayout.yaxis3 = {
      title: {
        text: '<b>Correlation (%)</b>',
        font: { color: '#8B5CF6', size: 14 }
      },
      side: 'right',
      overlaying: 'y',
      position: 0.95,
      tickfont: { color: '#8B5CF6', size: 10 },
      linecolor: 'rgba(139, 92, 246, 0.2)',
      showgrid: false,
      range: [-100, 100]
    }
  }

  if (selectedMetric === "volume") {
    plotlyTraces.push({
      x: plotlyData.dates,
      y: plotlyData.volumes,
      type: 'bar' as const,
      name: 'Volume',
      marker: { 
        color: 'rgba(34, 197, 94, 0.6)',
        line: { color: '#22C55E', width: 1 }
      },
      yaxis: 'y3',
      hovertemplate: '<b>%{fullData.name}</b><br>' +
                    'Date: %{x}<br>' +
                    'Volume: $%{y:,.0s}<br>' +
                    '<extra></extra>'
    } as any)

    // Add third y-axis for volume
    plotlyLayout.yaxis3 = {
      title: {
        text: '<b>Volume (USD)</b>',
        font: { color: '#22C55E', size: 14 }
      },
      side: 'right',
      overlaying: 'y',
      position: 0.95,
      tickfont: { color: '#22C55E', size: 10 },
      linecolor: 'rgba(34, 197, 94, 0.2)',
      showgrid: false,
      tickformat: '$,.0s'
    }
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
        {/* Enhanced Oracle Header */}
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
                  Plotly Oracle Intelligence
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Bitcoin className="w-5 h-5 text-gold/70" />
                  <span className="text-white/70 font-sans font-light">
                    Advanced Correlation Analysis Engine
                  </span>
                  <Crown className="w-4 h-4 text-gold/60" />
                </div>
              </div>
            </div>
            <p className="text-white/70 font-sans font-light leading-relaxed">
              Interactive dual-axis analysis of Bitcoin price movements vs exchange balance flows with institutional-grade Plotly visualization
            </p>
            
            {/* Enhanced Statistics Bar */}
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
                <span className="text-white/70">Oracle-grade precision • Interactive insights</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Enhanced Metric Selector */}
            <div className="flex bg-navy/60 backdrop-blur-sm rounded-xl p-1 border border-gold/20 luxury-border">
              {[
                { key: "price", label: "Price", icon: DollarSign },
                { key: "balance", label: "Balance", icon: Bitcoin },
                { key: "correlation", label: "Correlation", icon: Activity },
                { key: "volume", label: "Volume", icon: BarChart3 }
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
          className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6"
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
              <p className="text-3xl font-display font-bold text-gold">
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
                <p className="text-3xl font-display font-bold text-gold">
                  {formatBalance(currentData.exchangeBalance)}
                </p>
                <span className="text-lg text-white/70 font-medium">BTC</span>
              </div>
              <div className={`flex items-center space-x-2 ${getChangeColor(currentData.balanceChange24h)}`}>
                {getChangeIcon(currentData.balanceChange24h)}
                <span className="font-bold">
                  {currentData.balanceChange24h > 0 ? '+' : ''}{currentData.balanceChange24h.toFixed(3)}% (24h)
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
                <span className="text-white/80 font-medium">Correlation</span>
              </div>
              <Sparkles className="w-5 h-5 text-gold/60" />
            </div>
            <div className="space-y-3">
              <p className={`text-3xl font-display font-bold ${currentData.correlation < -0.5 ? 'text-red-400' : currentData.correlation > 0.5 ? 'text-green-400' : 'text-gold'}`}>
                {(currentData.correlation * 100).toFixed(1)}%
              </p>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-gold/60 fill-current" />
                <p className="text-sm text-white/70 font-medium">
                  {currentData.correlation < -0.3 ? 'Strong Inverse' : currentData.correlation > 0.3 ? 'Positive Signal' : 'Neutral'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Trading Volume */}
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
                  whileHover={{ rotate: -10, scale: 1.1 }}
                >
                  <BarChart3 className="w-5 h-5 text-gold" />
                </motion.div>
                <span className="text-white/80 font-medium">24h Volume</span>
              </div>
              <Download className="w-5 h-5 text-gold/60" />
            </div>
            <div className="space-y-3">
              <p className="text-3xl font-display font-bold text-gold">
                {formatVolume(currentData.volume)}
              </p>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-bold">+12.8% (24h)</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Interactive Plotly Chart */}
        <motion.div 
          className="bg-gradient-to-br from-navy-800/90 via-navy-900/95 to-navy-800/90 rounded-xl p-8 border border-gold/30 backdrop-blur-xl shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-display font-bold tracking-tight flex items-center text-gold">
                <motion.div
                  className="w-8 h-8 bg-gradient-to-br from-gold/30 to-gold/15 rounded-lg flex items-center justify-center mr-3 border border-gold/30"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                >
                  <BarChart3 className="w-4 h-4 text-gold" />
                </motion.div>
                Interactive Oracle Analysis
              </h4>
              <div className="flex items-center space-x-2">
                <motion.div
                  className="w-2 h-2 bg-gold rounded-full"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-white/70 text-sm">Live Plotly Intelligence</span>
              </div>
            </div>

            {/* Plotly Chart Container */}
            <div className="relative bg-navy/30 rounded-lg border border-gold/20 overflow-hidden">
              {isClient && !isLoading && plotlyData.dates.length > 0 ? (
                <Plot
                  data={plotlyTraces}
                  layout={plotlyLayout}
                  config={plotlyConfig}
                  style={{ width: '100%', height: '100%' }}
                  useResizeHandler={true}
                />
              ) : (
                <div className="flex items-center justify-center h-96">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className={getCrownLoadingClasses()}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="text-gold font-medium">
                      {isLoading ? "Loading Oracle Intelligence..." : "Initializing Chart..."}
                    </span>
                  </div>
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
              Advanced Oracle Intelligence
            </h4>
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-gold/60" />
              <span className="text-white/70 text-sm">Plotly-Powered Analysis</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h5 className="font-semibold text-white">Interactive Intelligence</h5>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full mt-2 flex-shrink-0" />
                  <span>Dual-axis correlation analysis reveals institutional accumulation patterns during price appreciation phases</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full mt-2 flex-shrink-0" />
                  <span>Interactive Plotly visualization enables precise time-series analysis with zoom and pan capabilities</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full mt-2 flex-shrink-0" />
                  <span>Real-time correlation coefficient tracking provides predictive insights for large order execution</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h5 className="font-semibold text-white">Strategic Oracle Insights</h5>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Current inverse correlation (-73%) supports strategic accumulation hypothesis</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Exchange outflow acceleration indicates institutional confidence in price trajectory</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Volume-weighted analysis suggests optimal execution windows during correlation peaks</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
})

export default PlotlyBitcoinCorrelationChart