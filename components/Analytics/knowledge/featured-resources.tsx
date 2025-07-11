"use client"

import { motion } from 'framer-motion'
import { Star, TrendingUp, Award, Crown } from 'lucide-react'
import { KnowledgeResource } from '@/types/financial'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ResourceCard } from './resource-card'

interface FeaturedResourcesProps {
  resources: KnowledgeResource[]
}

export function FeaturedResources({ resources }: FeaturedResourcesProps) {
  // Sort resources by rating and download count for featured display
  const featuredResources = resources
    .sort((a, b) => (b.rating * b.downloadCount) - (a.rating * a.downloadCount))
    .slice(0, 6)

  const topResource = featuredResources[0]
  const otherResources = featuredResources.slice(1)

  return (
    <div className="space-y-6">
      {/* Hero Featured Resource */}
      {topResource && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-morphism border-gold/40 bg-gradient-to-r from-gold/5 via-transparent to-gold/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-6 h-6 text-gold" />
                  <CardTitle className="text-xl text-white">Featured Resource</CardTitle>
                </div>
                <Badge className="bg-gold/20 text-gold border-gold/30">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Top Rated
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{topResource.title}</h3>
                <p className="text-white/80 text-lg">{topResource.description}</p>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-gold fill-current" />
                  <span className="text-white/90">{topResource.rating} rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-white/90">{topResource.downloadCount} downloads</span>
                </div>
                <Badge className="bg-purple-500/20 text-purple-300 capitalize">
                  {topResource.category.replace('_', ' ')}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2">
                {topResource.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs border-gold/30 text-gold/80"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Category Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="glass-morphism border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              Most Popular
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resources
                .sort((a, b) => b.downloadCount - a.downloadCount)
                .slice(0, 3)
                .map((resource, index) => (
                  <div key={resource.id} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {resource.title}
                      </p>
                      <p className="text-xs text-white/60">
                        {resource.downloadCount} downloads
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-green-500/30">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-green-400" />
              Highest Rated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resources
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 3)
                .map((resource, index) => (
                  <div key={resource.id} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-300 text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {resource.title}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-gold fill-current" />
                        <span className="text-xs text-white/60">{resource.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Recently Updated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resources
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .slice(0, 3)
                .map((resource, index) => (
                  <div key={resource.id} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {resource.title}
                      </p>
                      <p className="text-xs text-white/60">
                        {new Date(resource.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Other Featured Resources */}
      {otherResources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4">More Featured Resources</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {otherResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <ResourceCard resource={resource} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}