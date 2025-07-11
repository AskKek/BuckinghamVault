"use client"

import { motion } from 'framer-motion'
import { 
  Plus, 
  Calendar, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface SuggestedAction {
  id: string
  title: string
  description: string
  type: 'create_deal' | 'schedule_review' | 'verify_compliance' | 'prepare_docs' | 'contact_client'
  priority: 'high' | 'medium' | 'low'
  estimated_time: string
  confidence: number
}

interface SuggestedActionsProps {
  actions: SuggestedAction[]
  onActionClick: (action: SuggestedAction) => void
}

const mockActions: SuggestedAction[] = [
  {
    id: 'action_1',
    title: 'Create Deal Entry',
    description: 'Generate a new deal tracker entry with extracted contract information',
    type: 'create_deal',
    priority: 'high',
    estimated_time: '2 min',
    confidence: 0.94
  },
  {
    id: 'action_2',
    title: 'Schedule Compliance Review',
    description: 'Book enhanced KYC verification with compliance team',
    type: 'schedule_review',
    priority: 'high',
    estimated_time: '5 min',
    confidence: 0.87
  },
  {
    id: 'action_3',
    title: 'Prepare Settlement Documentation',
    description: 'Draft escrow agreements and wire transfer instructions',
    type: 'prepare_docs',
    priority: 'medium',
    estimated_time: '15 min',
    confidence: 0.92
  },
  {
    id: 'action_4',
    title: 'Verify Counterparty Credentials',
    description: 'Run AML checks and validate institutional status',
    type: 'verify_compliance',
    priority: 'medium',
    estimated_time: '30 min',
    confidence: 0.89
  }
]

export function SuggestedActions({ 
  actions = mockActions, 
  onActionClick 
}: SuggestedActionsProps) {
  
  const getActionIcon = (type: SuggestedAction['type']) => {
    switch (type) {
      case 'create_deal':
        return <Plus className="w-4 h-4" />
      case 'schedule_review':
        return <Calendar className="w-4 h-4" />
      case 'prepare_docs':
        return <FileText className="w-4 h-4" />
      case 'verify_compliance':
        return <CheckCircle className="w-4 h-4" />
      case 'contact_client':
        return <ArrowRight className="w-4 h-4" />
      default:
        return <Sparkles className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: SuggestedAction['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'low':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-400'
    if (confidence >= 0.7) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <Card className="glass-morphism border-gold/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold" />
          Suggested Actions
        </CardTitle>
        <p className="text-white/70 text-sm">
          AI-recommended next steps based on document analysis
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-navy/30 border-gold/10 hover:border-gold/30 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 glass-morphism rounded-lg flex items-center justify-center text-gold">
                      {getActionIcon(action.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{action.title}</h4>
                      <p className="text-sm text-white/60 mt-1">{action.description}</p>
                    </div>
                  </div>

                  <Badge className={`text-xs ${getPriorityColor(action.priority)} capitalize`}>
                    {action.priority}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-white/50">
                    <span>{action.estimated_time}</span>
                    <span className={getConfidenceColor(action.confidence)}>
                      {Math.round(action.confidence * 100)}% confidence
                    </span>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => onActionClick(action)}
                    className="bg-gradient-to-r from-gold/20 to-gold/10 hover:from-gold/30 hover:to-gold/20 text-gold border border-gold/30"
                  >
                    Execute
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {actions.length === 0 && (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-white/30 mx-auto mb-3" />
            <p className="text-white/60">No suggested actions available</p>
            <p className="text-white/40 text-sm">Upload a document to get AI recommendations</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}