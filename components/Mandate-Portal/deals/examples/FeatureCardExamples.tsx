"use client"

/**
 * FeatureCard Usage Examples
 * Demonstrates various configurations and use cases for the unified FeatureCard component
 */

import { 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Shield, 
  Eye, 
  Download,
  Edit,
  Star,
  Calendar,
  User,
  Tag
} from 'lucide-react'
import { FeatureCard } from '@/components/shared/FeatureCard'
import { 
  cardPresets, 
  createBadge, 
  createAction, 
  createMetadata,
  createStarRating,
  formatters,
  commonCards,
  statusColors
} from '@/lib/feature-card-utils'

export function FeatureCardExamples() {
  // Example data
  const sampleDeal = {
    id: 'deal-001',
    dealNumber: 'BV-2024-001',
    type: 'buy',
    assetType: 'BTC',
    status: 'under_review',
    clientName: 'Apex Capital',
    totalValue: 2500000,
    submittedAt: new Date('2024-01-15'),
    forensicRating: 'AAA',
    commissionAmount: 25000,
    commissionRate: 1.0
  }

  const sampleResource = {
    id: 'resource-001',
    title: 'Digital Asset Compliance Framework',
    description: 'Comprehensive guide to regulatory compliance for digital asset trading',
    type: 'guide',
    category: 'compliance',
    difficulty: 'intermediate',
    authorName: 'Legal Team',
    rating: 4.8,
    downloadCount: 1247,
    tags: ['compliance', 'regulation', 'trading']
  }

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold text-white mb-6">FeatureCard Examples</h2>

      {/* Basic Cards */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Basic Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Simple Card */}
          <FeatureCard
            title="Simple Card"
            description="Basic card with minimal configuration"
            icon={FileText}
          />

          {/* Card with Badge */}
          <FeatureCard
            title="Card with Badge"
            description="Card featuring status badges"
            icon={Shield}
            badges={[createBadge('Verified', 'success')]}
          />

          {/* Interactive Card */}
          <FeatureCard
            title="Interactive Card"
            description="Click me to see interaction"
            icon={Users}
            onClick={() => alert('Card clicked!')}
            isInteractive
          />
        </div>
      </section>

      {/* Preset Variations */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Preset Variations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Deal Preset */}
          <FeatureCard
            {...cardPresets.deal()}
            title="Deal Card"
            description="Configured for financial deals"
            icon={TrendingUp}
            badges={[createBadge('Active', 'success')]}
          />

          {/* Resource Preset */}
          <FeatureCard
            {...cardPresets.resource()}
            title="Resource Card"
            description="Perfect for knowledge resources"
            icon={FileText}
            badges={[createBadge('Guide', 'info')]}
          />

          {/* Stat Preset */}
          <FeatureCard
            {...cardPresets.stat()}
            title="$2.5M"
            description="Total Volume"
            icon={DollarSign}
          />

          {/* Feature Preset */}
          <FeatureCard
            {...cardPresets.feature()}
            title="Premium Feature"
            description="Showcases key functionality"
            icon={Shield}
          />
        </div>
      </section>

      {/* Size Variations */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Size Variations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            size="sm"
            title="Small"
            description="Compact card"
            icon={FileText}
          />
          <FeatureCard
            size="md"
            title="Medium"
            description="Standard size card"
            icon={FileText}
          />
          <FeatureCard
            size="lg"
            title="Large"
            description="Spacious card layout"
            icon={FileText}
          />
          <FeatureCard
            size="xl"
            title="Extra Large"
            description="Maximum space for content"
            icon={FileText}
          />
        </div>
      </section>

      {/* Variant Styles */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Variant Styles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            variant="default"
            title="Default"
            description="Standard styling"
            icon={FileText}
          />
          <FeatureCard
            variant="glass"
            title="Glass"
            description="Glass morphism effect"
            icon={FileText}
          />
          <FeatureCard
            variant="premium"
            title="Premium"
            description="Luxury styling with animations"
            icon={FileText}
          />
          <FeatureCard
            variant="minimal"
            title="Minimal"
            description="Clean, subtle design"
            icon={FileText}
          />
        </div>
      </section>

      {/* Cards with Metadata */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Cards with Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            title="Deal Overview"
            description="Comprehensive deal information"
            icon={TrendingUp}
            badges={[createBadge('Under Review', 'under_review')]}
            metadata={[
              createMetadata('Client', 'Apex Capital', { icon: User }),
              createMetadata('Value', 2500000, { format: 'currency', icon: DollarSign }),
              createMetadata('Submitted', new Date(), { format: 'date', icon: Calendar })
            ]}
          />

          <FeatureCard
            title="Resource Details"
            description="Knowledge resource with rich metadata"
            icon={FileText}
            badges={[
              createBadge('Compliance', 'compliance'),
              createBadge('Intermediate', 'intermediate')
            ]}
            metadata={[
              createMetadata('Author', 'Legal Team', { icon: User }),
              createMetadata('Downloads', 1247, { format: 'number', icon: Download }),
              createMetadata('Rating', '4.8/5', { icon: Star })
            ]}
          />
        </div>
      </section>

      {/* Cards with Actions */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Cards with Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            title="Deal Actions"
            description="Card with primary and secondary actions"
            icon={TrendingUp}
            primaryAction={createAction('View Deal', () => alert('View deal'), {
              icon: Eye,
              variant: 'default'
            })}
            secondaryActions={[
              createAction('Edit', () => alert('Edit deal'), { icon: Edit }),
              createAction('Download', () => alert('Download'), { icon: Download })
            ]}
          />

          <FeatureCard
            title="Resource Actions"
            description="Interactive resource card"
            icon={FileText}
            primaryAction={createAction('Download', () => alert('Download resource'), {
              icon: Download
            })}
            secondaryActions={[
              createAction('Preview', () => alert('Preview'), { icon: Eye })
            ]}
          />
        </div>
      </section>

      {/* Cards with Hover Content */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Cards with Hover Content</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            title="Hover Reveal"
            description="Additional content appears on hover"
            icon={Shield}
            hoverContent={
              <div className="space-y-2">
                <p className="text-sm text-white/70">
                  This content is revealed when you hover over the card.
                </p>
                <div className="flex gap-2">
                  <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded">
                    Hidden Detail 1
                  </span>
                  <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded">
                    Hidden Detail 2
                  </span>
                </div>
              </div>
            }
          />

          <FeatureCard
            title="Commission Details"
            description="Financial details with hover commission info"
            icon={DollarSign}
            metadata={[
              createMetadata('Base Value', 2500000, { format: 'currency' })
            ]}
            hoverContent={
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Commission (1.0%)</span>
                  <span className="text-gold font-medium">$25,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Net Amount</span>
                  <span className="text-white font-medium">$2,475,000</span>
                </div>
              </div>
            }
          />
        </div>
      </section>

      {/* Horizontal Layout */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Horizontal Layout</h3>
        <div className="space-y-4">
          <FeatureCard
            orientation="horizontal"
            title="Horizontal Card"
            description="Card with horizontal layout for different content arrangements"
            icon={FileText}
            sidebar={
              <div className="space-y-2">
                <div className="w-full h-24 bg-gradient-to-br from-gold/20 to-gold/5 rounded-lg flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gold" />
                </div>
                <div className="text-xs text-white/60 text-center">
                  Sidebar Content
                </div>
              </div>
            }
            badges={[createBadge('Featured', 'success')]}
          />
        </div>
      </section>

      {/* Pre-configured Common Cards */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Pre-configured Common Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            {...commonCards.dealSummary(sampleDeal)}
          />

          <FeatureCard
            {...commonCards.resourceSummary(sampleResource)}
          />
        </div>
      </section>

      {/* Loading States */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Loading States</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            title="Loading Data"
            description="Card in loading state"
            icon={FileText}
            isLoading
          />

          <FeatureCard
            title="Selected Card"
            description="Card in selected state"
            icon={Shield}
            isSelected
          />

          <FeatureCard
            title="Disabled Actions"
            description="Card with disabled actions"
            icon={Users}
            primaryAction={createAction('Disabled Action', () => {}, {
              disabled: true
            })}
          />
        </div>
      </section>
    </div>
  )
}