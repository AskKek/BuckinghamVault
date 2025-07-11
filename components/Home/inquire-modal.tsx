'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, UserCheck, Handshake, BarChart3, ArrowRight, Shield, Network } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

interface InquireModalProps {
  isOpen: boolean
  onClose: () => void
}

const inquiryOptions = [
  {
    id: 'client-services',
    title: 'Client Services Portal',
    description: 'Institutional services and wealth management solutions',
    icon: Shield,
    href: '/client-services',
    color: 'from-gold/20 to-gold-light/20 border-gold/30',
    iconColor: 'text-gold',
    hoverColor: 'hover:from-gold/30 hover:to-gold-light/30'
  },
  {
    id: 'contact',
    title: 'Contact',
    description: 'General inquiries and consultation scheduling',
    icon: Mail,
    href: '/contact',
    color: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    iconColor: 'text-blue-400',
    hoverColor: 'hover:from-blue-500/30 hover:to-blue-600/30'
  },
  {
    id: 'client-onboarding',
    title: 'Client Onboarding',
    description: 'KYC process and exchange access application',
    icon: UserCheck,
    href: '/client-onboarding',
    color: 'from-green-500/20 to-green-600/20 border-green-500/30',
    iconColor: 'text-green-400',
    hoverColor: 'hover:from-green-500/30 hover:to-green-600/30'
  },
  {
    id: 'mandate-application',
    title: 'Mandate Application',
    description: 'OTC trading and counterparty matching',
    icon: Handshake,
    href: '/mandate-application',
    color: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    iconColor: 'text-purple-400',
    hoverColor: 'hover:from-purple-500/30 hover:to-purple-600/30'
  },
  {
    id: 'analytics',
    title: 'BV Analytics',
    description: 'Market intelligence and data platform',
    icon: BarChart3,
    href: '/analytics',
    color: 'from-gold/20 to-yellow-600/20 border-gold/30',
    iconColor: 'text-gold',
    hoverColor: 'hover:from-gold/30 hover:to-yellow-600/30'
  },
  {
    id: 'village-collective',
    title: 'Vault Collective',
    description: 'Exclusive membership for elite investors',
    icon: Network,
    href: '/village-collective',
    color: 'from-indigo-500/20 to-indigo-600/20 border-indigo-500/30',
    iconColor: 'text-indigo-400',
    hoverColor: 'hover:from-indigo-500/30 hover:to-indigo-600/30'
  }
]

export function InquireModal({ isOpen, onClose }: InquireModalProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleOptionClick = (optionId: string) => {
    setSelectedOption(optionId)
    // Add a small delay for visual feedback before navigation
    setTimeout(() => {
      setSelectedOption(null)
      onClose()
    }, 150)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              duration: 0.4 
            }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-4xl mx-4"
          >
            <Card className="glass-morphism border-gold/20 shadow-2xl shadow-gold/10">
              <CardContent className="p-6 md:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-display font-bold text-white">
                        How can we assist you?
                      </h2>
                      <p className="text-sm text-gray-400">
                        Select your area of interest
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full w-10 h-10 p-0"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inquiryOptions.map((option, index) => (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={option.href} onClick={() => handleOptionClick(option.id)}>
                        <motion.div
                          className={`glass-morphism rounded-xl p-4 border transition-all duration-300 cursor-pointer group ${option.color} ${option.hoverColor}`}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          animate={selectedOption === option.id ? { scale: 0.98 } : {}}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <option.icon className={`w-6 h-6 ${option.iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white group-hover:text-white/90 transition-colors">
                                {option.title}
                              </h3>
                              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors mt-1">
                                {option.description}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-500 text-center">
                    All inquiries are handled with the utmost confidentiality and professionalism
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}