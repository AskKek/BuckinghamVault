"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { 
  FileText, 
  Video, 
  File, 
  CheckSquare, 
  BookOpen, 
  Scale,
  Download, 
  Eye, 
  Star, 
  Clock,
  User,
  Tag,
  ExternalLink
} from 'lucide-react'
import { KnowledgeResource } from '@/types/financial'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ResourceCardProps {
  resource: KnowledgeResource
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getTypeIcon = () => {
    switch (resource.type) {
      case 'document':
        return <FileText className="w-4 h-4" />
      case 'video':
        return <Video className="w-4 h-4" />
      case 'template':
        return <File className="w-4 h-4" />
      case 'checklist':
        return <CheckSquare className="w-4 h-4" />
      case 'guide':
        return <BookOpen className="w-4 h-4" />
      case 'regulation':
        return <Scale className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getCategoryColor = () => {
    switch (resource.category) {
      case 'legal':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      case 'compliance':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'technical':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'market_analysis':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'training':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'templates':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
      default:
        return 'bg-white/20 text-white border-white/30'
    }
  }

  const getDifficultyColor = () => {
    switch (resource.difficulty) {
      case 'beginner':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'advanced':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      default:
        return 'bg-white/20 text-white border-white/30'
    }
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-3 h-3 fill-gold text-gold" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-3 h-3 text-gold" />
      )
    }

    return stars
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <Card className="glass-morphism border-gold/20 hover:border-gold/40 transition-all duration-300 h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 glass-morphism rounded-lg flex items-center justify-center text-gold">
                {getTypeIcon()}
              </div>
              <Badge className={`text-xs ${getCategoryColor()} capitalize`}>
                {resource.category.replace('_', ' ')}
              </Badge>
            </div>
            
            <Badge className={`text-xs ${getDifficultyColor()} capitalize`}>
              {resource.difficulty}
            </Badge>
          </div>

          <h3 className="font-semibold text-white leading-tight line-clamp-2">
            {resource.title}
          </h3>
          
          <p className="text-sm text-white/70 line-clamp-3 mt-2">
            {resource.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {resource.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs border-white/20 text-white/60 px-2 py-0.5"
              >
                <Tag className="w-2 h-2 mr-1" />
                {tag}
              </Badge>
            ))}
            {resource.tags.length > 3 && (
              <Badge
                variant="outline"
                className="text-xs border-white/20 text-white/60 px-2 py-0.5"
              >
                +{resource.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Metadata */}
          <div className="space-y-2 text-xs text-white/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{resource.authorName}</span>
              </div>
              {resource.estimatedReadTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{resource.estimatedReadTime} min read</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {renderStars(resource.rating)}
                  <span className="ml-1">{resource.rating}</span>
                </div>
                <span>({resource.reviewCount})</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                <span>{resource.downloadCount}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <span className="text-xs text-white/50">
              {formatDistanceToNow(new Date(resource.updatedAt), { addSuffix: true })}
            </span>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white/50 hover:text-white hover:bg-white/10"
              >
                <Eye className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white/50 hover:text-white hover:bg-white/10"
              >
                {resource.fileUrl ? (
                  <Download className="w-4 h-4" />
                ) : (
                  <ExternalLink className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Hover Actions */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              height: isHovered ? 'auto' : 0 
            }}
            className="overflow-hidden"
          >
            <div className="pt-3 border-t border-gold/20 space-y-2">
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-gold/20 to-gold/10 hover:from-gold/30 hover:to-gold/20 text-gold border border-gold/30"
              >
                <Eye className="w-3 h-3 mr-2" />
                View Resource
              </Button>
              
              {resource.subcategory && (
                <div className="text-xs text-white/60 text-center">
                  {resource.subcategory.replace('_', ' ')}
                </div>
              )}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}