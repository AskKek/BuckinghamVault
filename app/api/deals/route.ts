import { NextRequest, NextResponse } from 'next/server'
import { withSecurity } from '@/lib/security/middleware'
import { mockDeals } from '@/lib/mock-data'
import { DealStatus, DealType } from '@/types/financial'

async function getDealsHandler(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    
    // Parse all query parameters for advanced filtering
    const search = searchParams.get('search') || ''
    const status = searchParams.getAll('status') as DealStatus[]
    const type = searchParams.getAll('type') as DealType[]
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    
    // Advanced filter parameters
    const minValue = searchParams.get('minValue') ? parseInt(searchParams.get('minValue')!) : null
    const maxValue = searchParams.get('maxValue') ? parseInt(searchParams.get('maxValue')!) : null
    const minRating = searchParams.get('minRating') ? parseInt(searchParams.get('minRating')!) : null
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : null
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : null
    
    // Parse value range from FilterManager format
    const valueRange = searchParams.get('valueRange')
    let parsedValueRange: [number, number] | null = null
    if (valueRange) {
      try {
        parsedValueRange = JSON.parse(valueRange) as [number, number]
      } catch {
        // Ignore invalid format
      }
    }
    
    // Parse date range from FilterManager format
    const dateRange = searchParams.get('dateRange')
    let parsedDateRange: [Date | null, Date | null] | null = null
    if (dateRange) {
      try {
        const [start, end] = JSON.parse(dateRange)
        parsedDateRange = [start ? new Date(start) : null, end ? new Date(end) : null]
      } catch {
        // Ignore invalid format
      }
    }
    
    // Filter deals based on all criteria
    let filteredDeals = mockDeals
    
    // Text search (enhanced)
    if (search) {
      const searchTerm = search.toLowerCase()
      filteredDeals = filteredDeals.filter(deal =>
        deal.dealNumber.toLowerCase().includes(searchTerm) ||
        deal.clientName.toLowerCase().includes(searchTerm) ||
        deal.assetType.toLowerCase().includes(searchTerm) ||
        deal.counterpartyName?.toLowerCase().includes(searchTerm) ||
        deal.currency.toLowerCase().includes(searchTerm)
      )
    }
    
    // Status filter
    if (status.length > 0) {
      filteredDeals = filteredDeals.filter(deal => status.includes(deal.status))
    }
    
    // Type filter
    if (type.length > 0) {
      filteredDeals = filteredDeals.filter(deal => type.includes(deal.type))
    }
    
    // Value range filter (individual parameters)
    if (minValue !== null) {
      filteredDeals = filteredDeals.filter(deal => deal.totalValue >= minValue)
    }
    if (maxValue !== null) {
      filteredDeals = filteredDeals.filter(deal => deal.totalValue <= maxValue)
    }
    
    // Value range filter (FilterManager format)
    if (parsedValueRange) {
      const [min, max] = parsedValueRange
      filteredDeals = filteredDeals.filter(deal => 
        deal.totalValue >= min && deal.totalValue <= max
      )
    }
    
    // Forensic rating filter (convert rating to numeric for comparison)
    if (minRating !== null) {
      const ratingToNumber = (rating: string): number => {
        switch (rating) {
          case 'AAA': return 5
          case 'AA': return 4
          case 'A': return 3
          case 'BBB': return 2
          case 'unrated': return 1
          default: return 0
        }
      }
      
      filteredDeals = filteredDeals.filter(deal => 
        deal.forensicRating && ratingToNumber(deal.forensicRating) >= minRating
      )
    }
    
    // Date range filter (individual parameters)
    if (startDate) {
      filteredDeals = filteredDeals.filter(deal => 
        new Date(deal.createdAt) >= startDate
      )
    }
    if (endDate) {
      filteredDeals = filteredDeals.filter(deal => 
        new Date(deal.createdAt) <= endDate
      )
    }
    
    // Date range filter (FilterManager format)
    if (parsedDateRange) {
      const [start, end] = parsedDateRange
      filteredDeals = filteredDeals.filter(deal => {
        const dealDate = new Date(deal.createdAt)
        return (!start || dealDate >= start) && (!end || dealDate <= end)
      })
    }
    
    // Apply sorting
    filteredDeals.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a]
      let bValue: any = b[sortBy as keyof typeof b]
      
      // Handle date sorting
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }
      
      // Handle numeric sorting
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      // Handle string sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      
      return 0
    })
    
    // Calculate filter statistics for UI
    const filterStats = {
      totalBeforeFilter: mockDeals.length,
      totalAfterFilter: filteredDeals.length,
      statusBreakdown: status.length > 0 ? {} : mockDeals.reduce((acc, deal) => {
        acc[deal.status] = (acc[deal.status] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      typeBreakdown: type.length > 0 ? {} : mockDeals.reduce((acc, deal) => {
        acc[deal.type] = (acc[deal.type] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedDeals = filteredDeals.slice(startIndex, endIndex)
    
    return NextResponse.json({
      deals: paginatedDeals,
      total: filteredDeals.length,
      page,
      limit,
      totalPages: Math.ceil(filteredDeals.length / limit),
      sortBy,
      sortOrder,
      filters: {
        search,
        status,
        type,
        valueRange: parsedValueRange,
        dateRange: parsedDateRange,
        minRating
      },
      stats: filterStats,
      hasMore: endIndex < filteredDeals.length
    })
  } catch (error) {
    console.error('Get deals error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    )
  }
}

export const GET = withSecurity(getDealsHandler, {
  requireAuth: true,
  requireCSRF: false,
  rateLimit: {
    identifier: 'deals-list',
    maxRequests: 60,
    windowMs: 60000
  }
})