"use client"

/**
 * FilterManager Integration Example
 * Demonstrates how to integrate FilterManager with existing module pages
 */

import React, { useState, useMemo } from 'react'
import { FilterManager, FILTER_PRESETS, FilterConfig } from '../FilterManager'
import { Button } from '@/components/ui/button'
import { FeatureCard } from '@/components/shared/FeatureCard'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Mock data for demonstration
const mockDeals = [
  {
    id: '1',
    dealNumber: 'BV-2024-001',
    clientName: 'Alpha Capital',
    type: 'acquisition',
    status: 'active',
    totalValue: 250000000,
    forensicRating: 4,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2', 
    dealNumber: 'BV-2024-002',
    clientName: 'Beta Holdings',
    type: 'divestiture',
    status: 'pending',
    totalValue: 180000000,
    forensicRating: 5,
    createdAt: new Date('2024-02-01')
  },
  {
    id: '3',
    dealNumber: 'BV-2024-003', 
    clientName: 'Gamma Enterprises',
    type: 'merger',
    status: 'completed',
    totalValue: 500000000,
    forensicRating: 3,
    createdAt: new Date('2024-01-20')
  }
]

interface FilterManagerExampleProps {
  module: 'deals' | 'knowledge' | 'exchange'
  data?: any[]
  className?: string
}

export function FilterManagerExample({ 
  module = 'deals', 
  data = mockDeals,
  className 
}: FilterManagerExampleProps) {
  const [filteredData, setFilteredData] = useState(data)
  const [loading, setLoading] = useState(false)
  
  // Get the filter configuration for the specified module
  const filterConfig: FilterConfig = useMemo(() => ({
    ...FILTER_PRESETS[module],
    onFilterChange: (filters) => {
      console.log('Filters changed:', filters)
      setLoading(true)
      
      // Simulate API call with filter application
      setTimeout(() => {
        let filtered = [...data]
        
        // Apply search filter
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase()
          filtered = filtered.filter(item => 
            JSON.stringify(item).toLowerCase().includes(searchTerm)
          )
        }
        
        // Apply status filter for deals
        if (filters.status?.length > 0 && module === 'deals') {
          filtered = filtered.filter(item => 
            filters.status.includes(item.status)
          )
        }
        
        // Apply type filter
        if (filters.type?.length > 0) {
          filtered = filtered.filter(item => 
            filters.type.includes(item.type)
          )
        }
        
        // Apply rating filter
        if (filters.forensicRating && module !== 'knowledge') {
          filtered = filtered.filter(item => 
            item.forensicRating >= filters.forensicRating
          )
        }
        
        // Apply value range filter for deals
        if (filters.valueRange?.length === 2 && module === 'deals') {
          const [min, max] = filters.valueRange
          filtered = filtered.filter(item => 
            item.totalValue >= min && item.totalValue <= max
          )
        }
        
        setFilteredData(filtered)
        setLoading(false)
      }, 500)
    },
    onExport: (filters) => {
      console.log('Exporting data with filters:', filters)
      // Simulate export functionality
      const exportData = {
        module,
        filters,
        data: filteredData,
        exportedAt: new Date(),
        totalRecords: filteredData.length
      }
      
      // In real implementation, this would trigger a download
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${module}-filtered-data.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    },
    showExport: true
  }), [module, data, filteredData])
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Filter Manager */}
      <FilterManager 
        config={filterConfig}
        data={filteredData}
        totalCount={filteredData.length}
        loading={loading}
      />
      
      {/* Results Display */}
      <FeatureCard variant="glass" className="border-gold/20">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {module.charAt(0).toUpperCase() + module.slice(1)} Results
            </h3>
            <Badge variant="outline" className="border-white/20 text-white/70">
              {filteredData.length} of {data.length} items
            </Badge>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
              <span className="ml-3 text-white/70">Filtering results...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredData.length === 0 ? (
                <div className="text-center py-8 text-white/60">
                  No results match your current filters.
                </div>
              ) : (
                filteredData.map((item, index) => (
                  <div 
                    key={item.id || index}
                    className="flex items-center justify-between p-4 bg-navy/30 rounded-lg border border-gold/10 hover:border-gold/30 transition-colors"
                  >
                    <div className="flex-1">
                      {module === 'deals' && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-white">
                              {item.dealNumber}
                            </span>
                            <Badge 
                              variant="secondary"
                              className={cn(
                                "text-xs",
                                item.status === 'active' && "bg-green-500/20 text-green-400 border-green-500/30",
                                item.status === 'pending' && "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                                item.status === 'completed' && "bg-blue-500/20 text-blue-400 border-blue-500/30",
                                item.status === 'cancelled' && "bg-red-500/20 text-red-400 border-red-500/30"
                              )}
                            >
                              {item.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                              {item.type}
                            </Badge>
                          </div>
                          <div className="text-sm text-white/70">
                            {item.clientName} • ${(item.totalValue / 1000000).toFixed(0)}M
                          </div>
                        </div>
                      )}
                      
                      {module === 'knowledge' && (
                        <div className="space-y-1">
                          <span className="font-medium text-white">
                            {item.title || `Knowledge Item ${index + 1}`}
                          </span>
                          <div className="text-sm text-white/70">
                            {item.category || 'General'} • {item.type || 'Article'}
                          </div>
                        </div>
                      )}
                      
                      {module === 'exchange' && (
                        <div className="space-y-1">
                          <span className="font-medium text-white">
                            {item.symbol || `Asset ${index + 1}`}
                          </span>
                          <div className="text-sm text-white/70">
                            {item.name || 'Digital Asset'} • Rating: {item.forensicRating}/5
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-gold hover:text-gold/80 hover:bg-gold/10"
                    >
                      View Details
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </FeatureCard>
      
      {/* Integration Instructions */}
      <FeatureCard variant="minimal" className="border-white/10">
        <div className="p-6">
          <h4 className="text-md font-semibold text-white mb-3">
            Integration Guide
          </h4>
          <div className="space-y-2 text-sm text-white/70">
            <p>
              • Import FilterManager and FILTER_PRESETS from '@/components/filters/FilterManager'
            </p>
            <p>
              • Use the preset configuration for your module: FILTER_PRESETS.{module}
            </p>
            <p>
              • Implement onFilterChange callback to handle filter updates
            </p>
            <p>
              • Enable URL sync for shareable filter states
            </p>
            <p>
              • Add persistence for user filter preferences
            </p>
          </div>
        </div>
      </FeatureCard>
    </div>
  )
}

// Usage examples for each module
export const DealsFilterExample = () => (
  <FilterManagerExample module="deals" />
)

export const KnowledgeFilterExample = () => (
  <FilterManagerExample module="knowledge" />
)

export const ExchangeFilterExample = () => (
  <FilterManagerExample module="exchange" />
)