import { NextRequest, NextResponse } from 'next/server'
import { generateRealisticOHLCVData, OHLCVData } from '@/components/Analytics/utils/technical-indicators'

// Cryptocurrency metadata for realistic data generation
const CRYPTO_METADATA = {
  'BTC': { name: 'Bitcoin', basePrice: 117755, precision: 0 },
  'ETH': { name: 'Ethereum', basePrice: 2980.25, precision: 2 },
  'XRP': { name: 'XRP', basePrice: 2.91, precision: 4 },
  'USDT': { name: 'Tether', basePrice: 1.0, precision: 4 },
  'BNB': { name: 'BNB', basePrice: 691.59, precision: 2 },
  'SOL': { name: 'Solana', basePrice: 165.21, precision: 2 },
  'USDC': { name: 'USD Coin', basePrice: 0.9999, precision: 4 },
  'DOGE': { name: 'Dogecoin', basePrice: 0.2043, precision: 4 },
  'TRX': { name: 'TRON', basePrice: 0.2988, precision: 4 },
  'ADA': { name: 'Cardano', basePrice: 0.7687, precision: 4 },
  'STETH': { name: 'Lido Staked Ether', basePrice: 2980.45, precision: 2 },
  'HYPE': { name: 'Hyperliquid', basePrice: 45.65, precision: 2 },
  'WBTC': { name: 'Wrapped Bitcoin', basePrice: 117588, precision: 0 },
  'WSTETH': { name: 'Wrapped stETH', basePrice: 3597.85, precision: 2 },
  'SUI': { name: 'Sui', basePrice: 3.54, precision: 4 },
  'XLM': { name: 'Stellar', basePrice: 0.3873, precision: 4 },
}

interface OHLCVResponse {
  success: boolean
  data: {
    symbol: string
    name: string
    chartData: OHLCVData[]
    summary: {
      currentPrice: number
      change24h: number
      volume24h: number
      high24h: number
      low24h: number
      marketCap?: number
    }
    metadata: {
      period: string
      dataPoints: number
      source: string
      precision: number
      lastUpdated: string
    }
  }
  meta: {
    timestamp: string
    version: string
    cached: boolean
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const symbol = params.symbol.toUpperCase()
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '1d' // 1d, 1w, 1M
    const days = searchParams.get('days') ? parseInt(searchParams.get('days')!) : 365
    
    // Validate symbol
    if (!CRYPTO_METADATA[symbol as keyof typeof CRYPTO_METADATA]) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_SYMBOL',
          message: `Cryptocurrency symbol '${symbol}' is not supported`,
          supportedSymbols: Object.keys(CRYPTO_METADATA)
        }
      }, { status: 400 })
    }
    
    const metadata = CRYPTO_METADATA[symbol as keyof typeof CRYPTO_METADATA]
    
    // Generate realistic OHLCV data
    const chartData = generateRealisticOHLCVData(symbol, metadata.basePrice, days)
    
    if (chartData.length === 0) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'NO_DATA_AVAILABLE',
          message: `No OHLCV data available for ${symbol}`,
        }
      }, { status: 404 })
    }
    
    // Calculate 24h statistics
    const latest = chartData[chartData.length - 1]
    const previous = chartData[chartData.length - 2]
    
    const change24h = previous ? ((latest.close - previous.close) / previous.close) * 100 : 0
    const high24h = Math.max(...chartData.slice(-24).map(d => d.high))
    const low24h = Math.min(...chartData.slice(-24).map(d => d.low))
    const volume24h = chartData.slice(-24).reduce((sum, d) => sum + d.volume, 0)
    
    // Calculate market cap (simplified)
    const circulatingSupplies = {
      'BTC': 19881200,
      'ETH': 120710000,
      'XRP': 59000000000,
      'USDT': 159104014540,
      'BNB': 145893000,
      'SOL': 536330000,
      'USDC': 62867392984,
      'DOGE': 149500000000,
      'TRX': 94730000000,
      'ADA': 36050000000,
      'STETH': 9125000,
      'HYPE': 333200000,
      'WBTC': 129000,
      'WSTETH': 3456000,
      'SUI': 3460000000,
      'XLM': 31040000000,
    }
    
    const circulatingSupply = circulatingSupplies[symbol as keyof typeof circulatingSupplies] || 0
    const marketCap = latest.close * circulatingSupply
    
    const response: OHLCVResponse = {
      success: true,
      data: {
        symbol,
        name: metadata.name,
        chartData,
        summary: {
          currentPrice: latest.close,
          change24h,
          volume24h,
          high24h,
          low24h,
          marketCap
        },
        metadata: {
          period,
          dataPoints: chartData.length,
          source: 'Buckingham Vault Oracle Intelligence',
          precision: metadata.precision,
          lastUpdated: new Date().toISOString()
        }
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0',
        cached: false
      }
    }
    
    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
    
  } catch (error) {
    console.error(`OHLCV API error for ${params.symbol}:`, error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'OHLCV_DATA_ERROR',
        message: 'Failed to generate OHLCV data',
        symbol: params.symbol,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}