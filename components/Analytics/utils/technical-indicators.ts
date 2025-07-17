/**
 * Technical Indicators Calculation Utilities
 * Institutional-grade calculations for EMA, Bollinger Bands, and Money Flow Index
 */

export interface OHLCVData {
  time: string | number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface EMAData {
  time: string | number
  value: number
}

export interface BollingerBandsData {
  time: string | number
  upper: number
  middle: number
  lower: number
}

export interface MoneyFlowIndexData {
  time: string | number
  value: number
}

/**
 * Calculate Exponential Moving Average (EMA)
 * @param data OHLCV data array
 * @param period EMA period (e.g., 50, 200)
 * @returns Array of EMA values
 */
export function calculateEMA(data: OHLCVData[], period: number): EMAData[] {
  if (data.length < period) return []

  const emaData: EMAData[] = []
  const multiplier = 2 / (period + 1)

  // Calculate initial SMA for the first EMA value
  let sum = 0
  for (let i = 0; i < period; i++) {
    sum += data[i].close
  }
  const initialEMA = sum / period

  emaData.push({
    time: data[period - 1].time,
    value: initialEMA
  })

  // Calculate subsequent EMA values
  for (let i = period; i < data.length; i++) {
    const prevEMA = emaData[emaData.length - 1].value
    const currentEMA = (data[i].close - prevEMA) * multiplier + prevEMA
    
    emaData.push({
      time: data[i].time,
      value: currentEMA
    })
  }

  return emaData
}

/**
 * Calculate Simple Moving Average (SMA)
 * @param data OHLCV data array
 * @param period SMA period
 * @returns Array of SMA values
 */
export function calculateSMA(data: OHLCVData[], period: number): EMAData[] {
  if (data.length < period) return []

  const smaData: EMAData[] = []

  for (let i = period - 1; i < data.length; i++) {
    let sum = 0
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close
    }
    
    smaData.push({
      time: data[i].time,
      value: sum / period
    })
  }

  return smaData
}

/**
 * Calculate Bollinger Bands
 * @param data OHLCV data array
 * @param period Period for calculation (typically 20)
 * @param multiplier Standard deviation multiplier (typically 2)
 * @returns Array of Bollinger Bands data
 */
export function calculateBollingerBands(
  data: OHLCVData[], 
  period: number = 20, 
  multiplier: number = 2
): BollingerBandsData[] {
  if (data.length < period) return []

  const bollingerData: BollingerBandsData[] = []

  for (let i = period - 1; i < data.length; i++) {
    // Calculate SMA (middle band)
    let sum = 0
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close
    }
    const sma = sum / period

    // Calculate standard deviation
    let squaredDifferencesSum = 0
    for (let j = 0; j < period; j++) {
      const difference = data[i - j].close - sma
      squaredDifferencesSum += difference * difference
    }
    const standardDeviation = Math.sqrt(squaredDifferencesSum / period)

    bollingerData.push({
      time: data[i].time,
      upper: sma + (multiplier * standardDeviation),
      middle: sma,
      lower: sma - (multiplier * standardDeviation)
    })
  }

  return bollingerData
}

/**
 * Calculate Money Flow Index (MFI)
 * @param data OHLCV data array
 * @param period Period for calculation (typically 14)
 * @returns Array of MFI values
 */
export function calculateMoneyFlowIndex(data: OHLCVData[], period: number = 14): MoneyFlowIndexData[] {
  if (data.length < period + 1) return []

  const mfiData: MoneyFlowIndexData[] = []

  for (let i = period; i < data.length; i++) {
    let positiveMoneyFlow = 0
    let negativeMoneyFlow = 0

    for (let j = 1; j <= period; j++) {
      const current = data[i - period + j]
      const previous = data[i - period + j - 1]

      // Calculate typical price
      const currentTypicalPrice = (current.high + current.low + current.close) / 3
      const previousTypicalPrice = (previous.high + previous.low + previous.close) / 3

      // Calculate raw money flow
      const rawMoneyFlow = currentTypicalPrice * current.volume

      // Classify as positive or negative money flow
      if (currentTypicalPrice > previousTypicalPrice) {
        positiveMoneyFlow += rawMoneyFlow
      } else if (currentTypicalPrice < previousTypicalPrice) {
        negativeMoneyFlow += rawMoneyFlow
      }
    }

    // Calculate Money Flow Index
    let mfi = 0
    if (negativeMoneyFlow !== 0) {
      const moneyFlowRatio = positiveMoneyFlow / negativeMoneyFlow
      mfi = 100 - (100 / (1 + moneyFlowRatio))
    } else if (positiveMoneyFlow > 0) {
      mfi = 100
    }

    mfiData.push({
      time: data[i].time,
      value: mfi
    })
  }

  return mfiData
}

/**
 * Calculate Relative Strength Index (RSI)
 * @param data OHLCV data array
 * @param period Period for calculation (typically 14)
 * @returns Array of RSI values
 */
export function calculateRSI(data: OHLCVData[], period: number = 14): MoneyFlowIndexData[] {
  if (data.length < period + 1) return []

  const rsiData: MoneyFlowIndexData[] = []
  const gains: number[] = []
  const losses: number[] = []

  // Calculate initial gains and losses
  for (let i = 1; i <= period; i++) {
    const change = data[i].close - data[i - 1].close
    gains.push(change > 0 ? change : 0)
    losses.push(change < 0 ? Math.abs(change) : 0)
  }

  // Calculate initial average gain and loss
  let avgGain = gains.reduce((sum, gain) => sum + gain, 0) / period
  let avgLoss = losses.reduce((sum, loss) => sum + loss, 0) / period

  // Calculate first RSI
  const rs = avgGain / avgLoss
  const rsi = 100 - (100 / (1 + rs))

  rsiData.push({
    time: data[period].time,
    value: rsi
  })

  // Calculate subsequent RSI values using smoothed averages
  for (let i = period + 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close
    const gain = change > 0 ? change : 0
    const loss = change < 0 ? Math.abs(change) : 0

    // Smooth the averages
    avgGain = (avgGain * (period - 1) + gain) / period
    avgLoss = (avgLoss * (period - 1) + loss) / period

    const newRs = avgGain / avgLoss
    const newRsi = 100 - (100 / (1 + newRs))

    rsiData.push({
      time: data[i].time,
      value: newRsi
    })
  }

  return rsiData
}

/**
 * Calculate Volume Weighted Average Price (VWAP)
 * @param data OHLCV data array
 * @returns Array of VWAP values
 */
export function calculateVWAP(data: OHLCVData[]): EMAData[] {
  const vwapData: EMAData[] = []
  let cumulativePriceVolume = 0
  let cumulativeVolume = 0

  for (let i = 0; i < data.length; i++) {
    const typicalPrice = (data[i].high + data[i].low + data[i].close) / 3
    const priceVolume = typicalPrice * data[i].volume

    cumulativePriceVolume += priceVolume
    cumulativeVolume += data[i].volume

    const vwap = cumulativeVolume > 0 ? cumulativePriceVolume / cumulativeVolume : typicalPrice

    vwapData.push({
      time: data[i].time,
      value: vwap
    })
  }

  return vwapData
}

/**
 * Generate realistic OHLCV data for a cryptocurrency
 * @param symbol Cryptocurrency symbol
 * @param startPrice Starting price
 * @param days Number of days to generate
 * @returns Array of OHLCV data
 */
export function generateRealisticOHLCVData(
  symbol: string, 
  startPrice: number, 
  days: number = 365
): OHLCVData[] {
  const data: OHLCVData[] = []
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  let currentPrice = startPrice

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)

    // Generate realistic price movement (random walk with trend)
    const dailyChange = (Math.random() - 0.48) * 0.08 // Slight upward bias
    const volatility = 0.02 + (Math.random() * 0.04) // 2-6% daily volatility

    const priceChange = currentPrice * dailyChange * volatility
    currentPrice = Math.max(currentPrice + priceChange, startPrice * 0.1) // Prevent negative prices

    // Generate OHLC based on current price
    const open = currentPrice * (0.995 + Math.random() * 0.01)
    const close = currentPrice * (0.995 + Math.random() * 0.01)
    const high = Math.max(open, close) * (1 + Math.random() * 0.03)
    const low = Math.min(open, close) * (1 - Math.random() * 0.03)

    // Generate realistic volume (inverse correlation with price typically)
    const baseVolume = startPrice > 1000 ? 50000000 : startPrice > 100 ? 500000000 : 5000000000
    const volume = baseVolume * (0.5 + Math.random() * 1.5) * (1 + Math.abs(dailyChange) * 2)

    data.push({
      time: Math.floor(date.getTime() / 1000), // Unix timestamp in seconds
      open: parseFloat(open.toFixed(symbol === 'BTC' ? 0 : symbol === 'ETH' ? 2 : 4)),
      high: parseFloat(high.toFixed(symbol === 'BTC' ? 0 : symbol === 'ETH' ? 2 : 4)),
      low: parseFloat(low.toFixed(symbol === 'BTC' ? 0 : symbol === 'ETH' ? 2 : 4)),
      close: parseFloat(close.toFixed(symbol === 'BTC' ? 0 : symbol === 'ETH' ? 2 : 4)),
      volume: Math.floor(volume)
    })

    currentPrice = close
  }

  return data
}

/**
 * Calculate support and resistance levels
 * @param data OHLCV data array
 * @param lookback Number of periods to look back
 * @returns Object with support and resistance levels
 */
export function calculateSupportResistance(data: OHLCVData[], lookback: number = 20) {
  if (data.length < lookback * 2) return { support: [], resistance: [] }

  const support: Array<{ time: string | number; level: number }> = []
  const resistance: Array<{ time: string | number; level: number }> = []

  for (let i = lookback; i < data.length - lookback; i++) {
    const current = data[i]
    let isSupport = true
    let isResistance = true

    // Check if current low is a support level
    for (let j = i - lookback; j <= i + lookback; j++) {
      if (j !== i && data[j].low < current.low) {
        isSupport = false
        break
      }
    }

    // Check if current high is a resistance level
    for (let j = i - lookback; j <= i + lookback; j++) {
      if (j !== i && data[j].high > current.high) {
        isResistance = false
        break
      }
    }

    if (isSupport) {
      support.push({ time: current.time, level: current.low })
    }

    if (isResistance) {
      resistance.push({ time: current.time, level: current.high })
    }
  }

  return { support, resistance }
}