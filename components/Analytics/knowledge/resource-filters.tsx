"use client"

import { ResourceCategory, ResourceType } from '@/types/financial'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface ResourceFiltersProps {
  selectedCategory: ResourceCategory | 'all'
  selectedType: ResourceType | 'all'
  onCategoryChange: (category: ResourceCategory | 'all') => void
  onTypeChange: (type: ResourceType | 'all') => void
}

const categoryOptions: (ResourceCategory | 'all')[] = [
  'all',
  'legal',
  'compliance',
  'technical',
  'market_analysis',
  'training',
  'templates'
]

const typeOptions: (ResourceType | 'all')[] = [
  'all',
  'document',
  'video',
  'template',
  'checklist',
  'guide',
  'regulation'
]

export function ResourceFilters({
  selectedCategory,
  selectedType,
  onCategoryChange,
  onTypeChange
}: ResourceFiltersProps) {
  
  const clearAll = () => {
    onCategoryChange('all')
    onTypeChange('all')
  }

  const getCategoryColor = (category: ResourceCategory | 'all') => {
    if (category === 'all') return 'bg-white/20 text-white border-white/30 hover:bg-white/30'
    
    switch (category) {
      case 'legal':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30'
      case 'compliance':
        return 'bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30'
      case 'technical':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30'
      case 'market_analysis':
        return 'bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30'
      case 'training':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/30'
      case 'templates':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/30'
      default:
        return 'bg-white/20 text-white border-white/30 hover:bg-white/30'
    }
  }

  const getTypeColor = (type: ResourceType | 'all') => {
    return selectedType === type
      ? 'bg-gold/20 text-gold border-gold/30 hover:bg-gold/30'
      : 'border-white/30 text-white/70 hover:border-white/50 hover:text-white'
  }

  return (
    <Card className="glass-morphism border-gold/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white">Filters</CardTitle>
          {(selectedCategory !== 'all' || selectedType !== 'all') && (
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
        {/* Categories */}
        <div>
          <h4 className="text-sm font-medium text-white/90 mb-3">Category</h4>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((category) => (
              <Badge
                key={category}
                variant="outline"
                className={`cursor-pointer transition-colors capitalize ${
                  selectedCategory === category
                    ? getCategoryColor(category)
                    : 'border-white/30 text-white/70 hover:border-white/50 hover:text-white'
                }`}
                onClick={() => onCategoryChange(category)}
              >
                {category === 'all' ? 'All Categories' : category.replace('_', ' ')}
              </Badge>
            ))}
          </div>
        </div>

        {/* Resource Types */}
        <div>
          <h4 className="text-sm font-medium text-white/90 mb-3">Type</h4>
          <div className="flex flex-wrap gap-2">
            {typeOptions.map((type) => (
              <Badge
                key={type}
                variant="outline"
                className={`cursor-pointer transition-colors capitalize ${getTypeColor(type)}`}
                onClick={() => onTypeChange(type)}
              >
                {type === 'all' ? 'All Types' : type}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}