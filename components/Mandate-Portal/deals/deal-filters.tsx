"use client"

import { DealStatus, DealType } from '@/types/financial'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface DealFiltersProps {
  selectedStatuses: DealStatus[]
  selectedTypes: DealType[]
  onStatusChange: (statuses: DealStatus[]) => void
  onTypeChange: (types: DealType[]) => void
}

const statusOptions: DealStatus[] = [
  'submitted',
  'under_review',
  'matched',
  'negotiating',
  'due_diligence',
  'completed',
  'cancelled'
]

const typeOptions: DealType[] = ['buy', 'sell']

export function DealFilters({
  selectedStatuses,
  selectedTypes,
  onStatusChange,
  onTypeChange
}: DealFiltersProps) {
  
  const toggleStatus = (status: DealStatus) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter(s => s !== status))
    } else {
      onStatusChange([...selectedStatuses, status])
    }
  }

  const toggleType = (type: DealType) => {
    if (selectedTypes.includes(type)) {
      onTypeChange(selectedTypes.filter(t => t !== type))
    } else {
      onTypeChange([...selectedTypes, type])
    }
  }

  const clearAll = () => {
    onStatusChange([])
    onTypeChange([])
  }

  const getStatusColor = (status: DealStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30'
      case 'matched':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30'
      case 'under_review':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/30'
      case 'submitted':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30'
      case 'negotiating':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30 hover:bg-orange-500/30'
      case 'due_diligence':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/30'
      case 'cancelled':
        return 'bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30'
      default:
        return 'bg-white/20 text-white border-white/30 hover:bg-white/30'
    }
  }

  const getTypeColor = (type: DealType) => {
    return type === 'buy' 
      ? 'bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30'
      : 'bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30'
  }

  return (
    <Card className="glass-morphism border-gold/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white">Filters</CardTitle>
          {(selectedStatuses.length > 0 || selectedTypes.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-white/70 hover:text-white hover:bg-white/5"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Deal Status */}
        <div>
          <h4 className="text-sm font-medium text-white/90 mb-3">Status</h4>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <Badge
                key={status}
                variant="outline"
                className={`cursor-pointer transition-colors capitalize ${
                  selectedStatuses.includes(status)
                    ? getStatusColor(status)
                    : 'border-white/30 text-white/70 hover:border-white/50 hover:text-white'
                }`}
                onClick={() => toggleStatus(status)}
              >
                {status.replace('_', ' ')}
              </Badge>
            ))}
          </div>
        </div>

        {/* Deal Type */}
        <div>
          <h4 className="text-sm font-medium text-white/90 mb-3">Type</h4>
          <div className="flex gap-2">
            {typeOptions.map((type) => (
              <Badge
                key={type}
                variant="outline"
                className={`cursor-pointer transition-colors capitalize ${
                  selectedTypes.includes(type)
                    ? getTypeColor(type)
                    : 'border-white/30 text-white/70 hover:border-white/50 hover:text-white'
                }`}
                onClick={() => toggleType(type)}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}