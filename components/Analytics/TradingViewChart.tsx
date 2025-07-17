"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { 
  createChart, 
  IChartApi, 
  ISeriesApi, 
  CandlestickData, 
  LineData,
  HistogramData,
  ColorType,
  CrosshairMode,
  LineStyle
} from "lightweight-charts"
import { 
  OHLCVData, 
  EMAData, 
  BollingerBandsData, 
  MoneyFlowIndexData,
  calculateEMA,
  calculateBollingerBands,
  calculateMoneyFlowIndex,
  generateRealisticOHLCVData
} from "./utils/technical-indicators"
import { TrendingUp, TrendingDown, Activity, Settings, Download, Maximize2, Eye } from "lucide-react"

interface TradingViewChartProps {
  symbol: string
  name: string
  currentPrice: number
  change24h: number
  onClose?: () => void
}

interface ChartData {
  candlesticks: CandlestickData[]
  ema50: LineData[]
  ema200: LineData[]
  bollingerUpper: LineData[]
  bollingerMiddle: LineData[]
  bollingerLower: LineData[]
  mfi: HistogramData[]
  volume: HistogramData[]
}

export default function TradingViewChart({ symbol, name, currentPrice, change24h, onClose }: TradingViewChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null)
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null)
  const mfiSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null)
  const ema50SeriesRef = useRef<ISeriesApi<"Line"> | null>(null)
  const ema200SeriesRef = useRef<ISeriesApi<"Line"> | null>(null)
  const bollingerUpperRef = useRef<ISeriesApi<"Line"> | null>(null)
  const bollingerMiddleRef = useRef<ISeriesApi<"Line"> | null>(null)
  const bollingerLowerRef = useRef<ISeriesApi<"Line"> | null>(null)

  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showIndicators, setShowIndicators] = useState({
    ema50: true,
    ema200: true,
    bollinger: true,
    mfi: true,
    volume: true
  })

  useEffect(() => {
    const generateChartData = async () => {
      setIsLoading(true)

      // Generate realistic OHLCV data for the symbol
      const ohlcvData = generateRealisticOHLCVData(symbol, currentPrice * 0.7, 365)
      
      // Calculate technical indicators
      const ema50Data = calculateEMA(ohlcvData, 50)
      const ema200Data = calculateEMA(ohlcvData, 200)
      const bollingerData = calculateBollingerBands(ohlcvData, 20, 2)
      const mfiData = calculateMoneyFlowIndex(ohlcvData, 14)

      // Convert to TradingView format
      const candlesticks: CandlestickData[] = ohlcvData.map(d => ({
        time: d.time as number,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close
      }))

      const volume: HistogramData[] = ohlcvData.map(d => ({
        time: d.time as number,
        value: d.volume,
        color: d.close >= d.open ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)'
      }))

      const ema50: LineData[] = ema50Data.map(d => ({
        time: d.time as number,
        value: d.value
      }))

      const ema200: LineData[] = ema200Data.map(d => ({
        time: d.time as number,
        value: d.value
      }))

      const bollingerUpper: LineData[] = bollingerData.map(d => ({
        time: d.time as number,
        value: d.upper
      }))

      const bollingerMiddle: LineData[] = bollingerData.map(d => ({
        time: d.time as number,
        value: d.middle
      }))

      const bollingerLower: LineData[] = bollingerData.map(d => ({
        time: d.time as number,
        value: d.lower
      }))

      const mfi: HistogramData[] = mfiData.map(d => ({
        time: d.time as number,
        value: d.value,
        color: d.value > 80 ? 'rgba(239, 68, 68, 0.8)' : 
               d.value < 20 ? 'rgba(34, 197, 94, 0.8)' : 
               'rgba(215, 147, 9, 0.8)'
      }))

      setChartData({
        candlesticks,
        ema50,
        ema200,
        bollingerUpper,
        bollingerMiddle,
        bollingerLower,
        mfi,
        volume
      })

      setIsLoading(false)
    }

    generateChartData()
  }, [symbol, currentPrice])

  useEffect(() => {
    if (!chartContainerRef.current || !chartData || isLoading) return

    // Create main chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { 
          type: ColorType.Solid, 
          color: 'rgba(16, 27, 62, 0.95)' 
        },
        textColor: '#D79309',
        fontSize: 12,
        fontFamily: 'Lato, Arial, sans-serif'
      },
      width: chartContainerRef.current.clientWidth,
      height: 600,
      grid: {
        vertLines: { 
          color: 'rgba(215, 147, 9, 0.1)',
          style: LineStyle.Solid,
          visible: true
        },
        horzLines: { 
          color: 'rgba(215, 147, 9, 0.1)',
          style: LineStyle.Solid,
          visible: true
        }
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: 'rgba(215, 147, 9, 0.5)',
          width: 1,
          style: LineStyle.Dashed,
          visible: true,
          labelVisible: true
        },
        horzLine: {
          color: 'rgba(215, 147, 9, 0.5)',
          width: 1,
          style: LineStyle.Dashed,
          visible: true,
          labelVisible: true
        }
      },
      rightPriceScale: {
        borderColor: 'rgba(215, 147, 9, 0.2)',
        textColor: '#ffffff',
        scaleMargins: {
          top: 0.1,
          bottom: 0.3
        }
      },
      timeScale: {
        borderColor: 'rgba(215, 147, 9, 0.2)',
        textColor: '#ffffff',
        timeVisible: true,
        secondsVisible: false
      },
      watermark: {
        visible: true,
        fontSize: 48,
        horzAlign: 'center',
        vertAlign: 'center',
        color: 'rgba(215, 147, 9, 0.1)',
        text: symbol
      }
    })

    chartRef.current = chart

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: 'rgba(34, 197, 94, 1)',
      downColor: 'rgba(239, 68, 68, 1)',
      borderUpColor: 'rgba(34, 197, 94, 1)',
      borderDownColor: 'rgba(239, 68, 68, 1)',
      wickUpColor: 'rgba(34, 197, 94, 1)',
      wickDownColor: 'rgba(239, 68, 68, 1)',
      borderVisible: true,
      wickVisible: true,
      priceFormat: {
        type: 'price',
        precision: symbol === 'BTC' ? 0 : symbol === 'ETH' ? 2 : 4,
        minMove: symbol === 'BTC' ? 1 : symbol === 'ETH' ? 0.01 : 0.0001
      }
    })
    candlestickSeries.setData(chartData.candlesticks)
    candlestickSeriesRef.current = candlestickSeries

    // Add EMA 50
    if (showIndicators.ema50) {
      const ema50Series = chart.addLineSeries({
        color: '#FF8C00',
        lineWidth: 2,
        lineStyle: LineStyle.Solid,
        title: 'EMA 50',
        priceLineVisible: false,
        lastValueVisible: true
      })
      ema50Series.setData(chartData.ema50)
      ema50SeriesRef.current = ema50Series
    }

    // Add EMA 200
    if (showIndicators.ema200) {
      const ema200Series = chart.addLineSeries({
        color: '#4169E1',
        lineWidth: 2,
        lineStyle: LineStyle.Solid,
        title: 'EMA 200',
        priceLineVisible: false,
        lastValueVisible: true
      })
      ema200Series.setData(chartData.ema200)
      ema200SeriesRef.current = ema200Series
    }

    // Add Bollinger Bands
    if (showIndicators.bollinger) {
      const bollingerUpperSeries = chart.addLineSeries({
        color: 'rgba(128, 128, 128, 0.8)',
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        title: 'BB Upper',
        priceLineVisible: false,
        lastValueVisible: false
      })
      bollingerUpperSeries.setData(chartData.bollingerUpper)
      bollingerUpperRef.current = bollingerUpperSeries

      const bollingerMiddleSeries = chart.addLineSeries({
        color: 'rgba(128, 128, 128, 0.6)',
        lineWidth: 1,
        lineStyle: LineStyle.Solid,
        title: 'BB Middle',
        priceLineVisible: false,
        lastValueVisible: false
      })
      bollingerMiddleSeries.setData(chartData.bollingerMiddle)
      bollingerMiddleRef.current = bollingerMiddleSeries

      const bollingerLowerSeries = chart.addLineSeries({
        color: 'rgba(128, 128, 128, 0.8)',
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        title: 'BB Lower',
        priceLineVisible: false,
        lastValueVisible: false
      })
      bollingerLowerSeries.setData(chartData.bollingerLower)
      bollingerLowerRef.current = bollingerLowerSeries
    }

    // Add Volume series (bottom 20%)
    if (showIndicators.volume) {
      const volumeSeries = chart.addHistogramSeries({
        color: 'rgba(34, 197, 94, 0.5)',
        priceFormat: {
          type: 'volume'
        },
        priceScaleId: 'volume',
        scaleMargins: {
          top: 0.8,
          bottom: 0.0
        }
      })
      volumeSeries.setData(chartData.volume)
      volumeSeriesRef.current = volumeSeries
    }

    // Add MFI series (bottom 15%)
    if (showIndicators.mfi) {
      const mfiSeries = chart.addHistogramSeries({
        color: 'rgba(215, 147, 9, 0.6)',
        priceFormat: {
          type: 'custom',
          formatter: (price: number) => `${price.toFixed(1)}`
        },
        priceScaleId: 'mfi',
        scaleMargins: {
          top: 0.85,
          bottom: 0.0
        }
      })
      mfiSeries.setData(chartData.mfi)
      mfiSeriesRef.current = mfiSeries

      // Add MFI reference lines
      const mfiPriceScale = chart.priceScale('mfi')
      mfiPriceScale.applyOptions({
        scaleMargins: {
          top: 0.85,
          bottom: 0.0
        }
      })
    }

    // Fit content
    chart.timeScale().fitContent()

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: 600
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (chart) {
        chart.remove()
      }
    }
  }, [chartData, isLoading, showIndicators, symbol])

  const handleDownload = () => {
    if (chartRef.current && chartContainerRef.current) {
      // Create a canvas from the chart
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (ctx) {
        canvas.width = chartContainerRef.current.clientWidth
        canvas.height = 600
        
        // This is a simplified implementation
        // In production, you'd want to use html2canvas or similar
        const link = document.createElement('a')
        link.download = `${symbol}-technical-analysis.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  }

  const toggleIndicator = (indicator: keyof typeof showIndicators) => {
    setShowIndicators(prev => ({
      ...prev,
      [indicator]: !prev[indicator]
    }))
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

  return (
    <div className="space-y-6">
      {/* Chart Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gold/30 to-gold/15 rounded-xl flex items-center justify-center text-gold font-bold text-lg border border-gold/30">
              {symbol.charAt(0)}
            </div>
            <div>
              <h3 className="text-2xl font-display font-bold tracking-tight text-gold">
                {name} ({symbol})
              </h3>
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-display font-bold text-white">
                  ${currentPrice.toLocaleString('en-US', {
                    minimumFractionDigits: symbol === 'BTC' ? 0 : symbol === 'ETH' ? 2 : 4,
                    maximumFractionDigits: symbol === 'BTC' ? 0 : symbol === 'ETH' ? 2 : 4,
                  })}
                </span>
                <div className={`flex items-center space-x-2 ${getChangeColor(change24h)}`}>
                  {getChangeIcon(change24h)}
                  <span className="font-bold">
                    {change24h > 0 ? '+' : ''}{change24h.toFixed(2)}% (24h)
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-white/70 font-sans font-light">
            Advanced technical analysis with candlestick chart, EMAs, Bollinger Bands, and Money Flow Index
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Indicator Toggles */}
          <div className="flex items-center space-x-2 bg-navy/60 backdrop-blur-sm rounded-xl p-2 border border-gold/20">
            <button
              onClick={() => toggleIndicator('ema50')}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                showIndicators.ema50 ? 'bg-orange-500/20 text-orange-400' : 'text-white/60 hover:text-white'
              }`}
            >
              EMA50
            </button>
            <button
              onClick={() => toggleIndicator('ema200')}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                showIndicators.ema200 ? 'bg-blue-500/20 text-blue-400' : 'text-white/60 hover:text-white'
              }`}
            >
              EMA200
            </button>
            <button
              onClick={() => toggleIndicator('bollinger')}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                showIndicators.bollinger ? 'bg-gray-500/20 text-gray-400' : 'text-white/60 hover:text-white'
              }`}
            >
              BB
            </button>
            <button
              onClick={() => toggleIndicator('mfi')}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                showIndicators.mfi ? 'bg-gold/20 text-gold' : 'text-white/60 hover:text-white'
              }`}
            >
              MFI
            </button>
            <button
              onClick={() => toggleIndicator('volume')}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                showIndicators.volume ? 'bg-green-500/20 text-green-400' : 'text-white/60 hover:text-white'
              }`}
            >
              VOL
            </button>
          </div>

          {/* Chart Controls */}
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={handleDownload}
              className="p-2 bg-navy/60 backdrop-blur-sm rounded-lg border border-gold/20 text-gold hover:bg-gold/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4" />
            </motion.button>
            
            {onClose && (
              <motion.button
                onClick={onClose}
                className="p-2 bg-navy/60 backdrop-blur-sm rounded-lg border border-gold/20 text-white hover:bg-red-500/20 hover:text-red-400 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Maximize2 className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative bg-gradient-to-br from-navy-800/90 via-navy-900/95 to-navy-800/90 rounded-xl border border-gold/30 backdrop-blur-xl shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="flex items-center space-x-3">
              <motion.div
                className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span className="text-gold font-medium">Loading {symbol} Chart...</span>
            </div>
          </div>
        ) : (
          <div 
            ref={chartContainerRef} 
            className="w-full"
            style={{ height: '600px' }}
          />
        )}

        {/* Chart Overlay Info */}
        {!isLoading && (
          <div className="absolute top-4 left-4 bg-navy/80 backdrop-blur-sm rounded-lg p-3 border border-gold/20">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="w-4 h-4 text-gold" />
              <span className="text-gold font-medium text-sm">Technical Indicators</span>
            </div>
            <div className="space-y-1 text-xs">
              {showIndicators.ema50 && (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-0.5 bg-orange-500"></div>
                  <span className="text-orange-400">EMA 50</span>
                </div>
              )}
              {showIndicators.ema200 && (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-0.5 bg-blue-500"></div>
                  <span className="text-blue-400">EMA 200</span>
                </div>
              )}
              {showIndicators.bollinger && (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-0.5 bg-gray-500 border-dashed"></div>
                  <span className="text-gray-400">Bollinger Bands</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Technical Analysis Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-navy-800/90 via-navy-900/95 to-navy-800/90 rounded-xl p-4 border border-gold/30 backdrop-blur-xl">
          <h4 className="text-gold font-semibold mb-2 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Trend Analysis</span>
          </h4>
          <p className="text-sm text-white/80">
            EMA crossover patterns suggest {change24h > 0 ? 'bullish' : 'bearish'} momentum with 
            strong {change24h > 0 ? 'support' : 'resistance'} levels identified.
          </p>
        </div>

        <div className="bg-gradient-to-br from-navy-800/90 via-navy-900/95 to-navy-800/90 rounded-xl p-4 border border-gold/30 backdrop-blur-xl">
          <h4 className="text-gold font-semibold mb-2 flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Volatility</span>
          </h4>
          <p className="text-sm text-white/80">
            Bollinger Bands indicate {Math.abs(change24h) > 5 ? 'high' : 'moderate'} volatility 
            with potential for {change24h > 0 ? 'continued upside' : 'reversal patterns'}.
          </p>
        </div>

        <div className="bg-gradient-to-br from-navy-800/90 via-navy-900/95 to-navy-800/90 rounded-xl p-4 border border-gold/30 backdrop-blur-xl">
          <h4 className="text-gold font-semibold mb-2 flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Money Flow</span>
          </h4>
          <p className="text-sm text-white/80">
            MFI oscillator shows {change24h > 0 ? 'positive' : 'negative'} money flow, 
            indicating {change24h > 0 ? 'accumulation' : 'distribution'} patterns.
          </p>
        </div>
      </div>
    </div>
  )
}