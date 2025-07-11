"use client"

import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { Bot, User, Sparkles, CheckCircle, Clock } from 'lucide-react'
import { ChatMessage as ChatMessageType } from '@/types/financial'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ChatMessageProps {
  message: ChatMessageType
  isLatest?: boolean
}

export function ChatMessage({ message, isLatest }: ChatMessageProps) {
  const isJeeves = message.role === 'jeeves'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isJeeves ? 'justify-start' : 'justify-end'}`}
    >
      {isJeeves && (
        <Avatar className="w-8 h-8 border-2 border-gold/30 mt-1">
          <AvatarFallback className="bg-gradient-to-br from-gold/20 to-gold/10">
            <Bot className="w-4 h-4 text-gold" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`max-w-[80%] space-y-2 ${isJeeves ? 'order-2' : 'order-1'}`}>
        {/* Message Header */}
        <div className={`flex items-center gap-2 ${isJeeves ? 'justify-start' : 'justify-end'}`}>
          <span className="text-sm font-medium text-white/90">
            {isJeeves ? 'Jeeves' : 'You'}
          </span>
          <span className="text-xs text-white/50">
            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
          </span>
        </div>

        {/* Message Content */}
        <Card 
          className={`p-4 ${
            isJeeves 
              ? 'glass-morphism border-gold/20 bg-navy/50' 
              : 'bg-gradient-to-r from-gold/20 to-gold/10 border-gold/30'
          }`}
        >
          <p className="text-white/90 leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>

          {/* Metadata for Jeeves messages */}
          {isJeeves && message.metadata && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.5 }}
              className="mt-4 pt-3 border-t border-gold/20 space-y-3"
            >
              {/* Confidence Score */}
              {message.metadata.confidence && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Confidence</span>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {Math.round(message.metadata.confidence * 100)}%
                  </Badge>
                </div>
              )}

              {/* Suggested Actions */}
              {message.metadata.suggestedActions && message.metadata.suggestedActions.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm text-white/70">Suggested Actions:</span>
                  <div className="flex flex-wrap gap-2">
                    {message.metadata.suggestedActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs border-gold/30 text-white/80 hover:bg-gold/10 h-7"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        {action}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Documents */}
              {message.metadata.relatedDocuments && message.metadata.relatedDocuments.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm text-white/70">Related Documents:</span>
                  <div className="text-xs text-white/60">
                    {message.metadata.relatedDocuments.length} document(s) processed
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </Card>

        {/* Processing indicator for latest Jeeves message */}
        {isJeeves && isLatest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-white/50 text-xs"
          >
            <Clock className="w-3 h-3" />
            <span>Processing complete</span>
          </motion.div>
        )}
      </div>

      {!isJeeves && (
        <Avatar className="w-8 h-8 border-2 border-blue-500/30 mt-1 order-3">
          <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-blue-500/10">
            <User className="w-4 h-4 text-blue-400" />
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  )
}