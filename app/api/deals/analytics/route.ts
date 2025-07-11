import { NextRequest, NextResponse } from 'next/server'
import { withSecurity } from '@/lib/security/middleware'
import { mockDeals } from '@/lib/mock-data'
import { DealStatus, DealType } from '@/types/financial'

async function getDealAnalyticsHandler(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    
    // Parse query parameters for filtering
    const status = searchParams.getAll('status') as DealStatus[]
    const type = searchParams.getAll('type') as DealType[]
    
    // Filter deals based on criteria
    let filteredDeals = mockDeals
    
    if (status.length > 0) {
      filteredDeals = filteredDeals.filter(deal => status.includes(deal.status))
    }
    
    if (type.length > 0) {
      filteredDeals = filteredDeals.filter(deal => type.includes(deal.type))
    }
    
    // Calculate analytics
    const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.totalValue, 0)
    const dealCount = filteredDeals.length
    const avgDealSize = dealCount > 0 ? totalValue / dealCount : 0
    
    // Status distribution
    const statusDistribution: Record<DealStatus, number> = {
      submitted: 0,
      under_review: 0,
      matched: 0,
      negotiating: 0,
      due_diligence: 0,
      completed: 0,
      cancelled: 0,
    }
    
    filteredDeals.forEach(deal => {
      statusDistribution[deal.status]++
    })
    
    // Type distribution
    const typeDistribution: Record<DealType, number> = {
      buy: 0,
      sell: 0,
    }
    
    filteredDeals.forEach(deal => {
      typeDistribution[deal.type]++
    })
    
    // Monthly trend (mock data for last 6 months)
    const monthlyTrend = [
      { month: '2024-07', value: 45000000, count: 12 },
      { month: '2024-08', value: 52000000, count: 15 },
      { month: '2024-09', value: 38000000, count: 8 },
      { month: '2024-10', value: 61000000, count: 18 },
      { month: '2024-11', value: 47000000, count: 13 },
      { month: '2024-12', value: totalValue, count: dealCount },
    ]
    
    return NextResponse.json({
      totalValue,
      dealCount,
      avgDealSize,
      statusDistribution,
      typeDistribution,
      monthlyTrend,
    })
  } catch (error) {
    console.error('Get deal analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deal analytics' },
      { status: 500 }
    )
  }
}

export const GET = withSecurity(getDealAnalyticsHandler, {
  requireAuth: true,
  requireCSRF: false,
  rateLimit: {
    identifier: 'deals-analytics',
    maxRequests: 30,
    windowMs: 60000
  }
})