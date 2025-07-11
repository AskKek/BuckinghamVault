"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Crown, 
  Network, 
  Sparkles, 
  ArrowLeft, 
  Users, 
  Globe, 
  Shield, 
  TrendingUp,
  Star,
  User,
  Mail,
  Phone,
  Building2,
  DollarSign,
  FileText,
  Check
} from 'lucide-react'
import Link from 'next/link'
import { ElegantSidebar } from '@/components/Navigation/elegant-sidebar'
import { BuckinghamVaultIcon } from '@/components/Custom-UI/buckingham-vault-icon'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ClientLayoutWrapper } from '@/components/Client-Portal/client-layout-wrapper'

export const dynamic = 'force-dynamic'

export default function VillageCollectivePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false)
  const [formStep, setFormStep] = useState(1)
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      title: '',
      organization: ''
    },
    financialInfo: {
      netWorth: '',
      investmentExperience: '',
      assetClasses: [],
      geographicRegions: []
    },
    interests: {
      primaryInterests: [],
      commitmentLevel: '',
      referralSource: ''
    }
  })

  const totalSteps = 3

  return (
    <ClientLayoutWrapper includeAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-navy via-navy-dark to-black relative overflow-hidden">
        {/* Enhanced Premium Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-navy-light" />
          
          {/* Enhanced floating orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 md:w-[500px] h-96 md:h-[500px] bg-gradient-to-r from-gold/15 via-gold/8 to-transparent rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.6, 0.2],
              x: [0, 60, 0],
              y: [0, -40, 0],
            }}
            transition={{
              duration: 18,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 md:w-[400px] h-80 md:h-[400px] bg-gradient-to-l from-gold/12 via-gold/6 to-transparent rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.45, 0.15],
              x: [0, -50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 4,
            }}
          />
        </div>

        {/* Enhanced Buckingham Vault Logo in Top Left */}
        <motion.div
          className="fixed top-6 md:top-10 left-6 md:left-10 z-50"
          initial={{ opacity: 0, x: -100, scale: 0.5 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{
            duration: 1.8,
            delay: 0.3,
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
        >
          <motion.button
            onClick={() => setSidebarOpen(true)}
            className="w-14 h-14 md:w-20 md:h-20 glass-morphism rounded-full flex items-center justify-center group cursor-pointer touch-manipulation bg-black/20 border border-gold/30 hover:border-gold/60 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_48px_rgba(215,147,9,0.2)] transition-all duration-500"
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(215, 147, 9, 0.1)",
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            aria-label="Open navigation menu"
          >
            <BuckinghamVaultIcon size={28} />
          </motion.button>
        </motion.div>

        {/* Back to Home Button */}
        <motion.div
          className="fixed top-6 md:top-10 right-6 md:right-10 z-50"
          initial={{ opacity: 0, x: 100, scale: 0.5 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{
            duration: 1.8,
            delay: 0.5,
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
        >
          <Link href="/">
            <motion.button
              className="w-14 h-14 md:w-20 md:h-20 glass-morphism rounded-full flex items-center justify-center group cursor-pointer touch-manipulation bg-black/20 border border-gold/30 hover:border-gold/60 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_48px_rgba(215,147,9,0.2)] transition-all duration-500"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(215, 147, 9, 0.1)",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              aria-label="Return to Buckingham Vault homepage"
            >
              <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 text-gold" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6 pt-32 md:pt-40">
          <div className="max-w-4xl mx-auto w-full">
            
            {/* Header Section */}
            <motion.div
              className="text-center mb-12 md:mb-16"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <motion.div
                className="flex justify-center mb-8"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, delay: 0.4, type: "spring", bounce: 0.3 }}
              >
                <div className="w-20 h-20 md:w-24 md:h-24 glass-morphism rounded-full flex items-center justify-center premium-glow border border-gold/30">
                  <Crown className="w-10 h-10 md:w-12 md:h-12 text-gold" />
                </div>
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl font-display font-bold bg-gradient-to-br from-white via-gold/25 to-white bg-clip-text text-transparent mb-6"
                style={{
                  letterSpacing: '-0.025em',
                  lineHeight: '0.95',
                  textShadow: '0 4px 25px rgba(0,0,0,0.6), 0 8px 50px rgba(215,147,9,0.15)'
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Vault Collective
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl lg:text-3xl text-white/85 font-light max-w-4xl mx-auto leading-[1.4] px-6"
                style={{
                  letterSpacing: '0.002em',
                  textShadow: '0 2px 12px rgba(0,0,0,0.4)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Exclusive Membership Application
              </motion.p>

              <motion.p 
                className="text-base md:text-lg text-gold/75 font-serif font-light max-w-3xl mx-auto leading-[1.7] italic mt-6"
                style={{
                  fontVariant: 'small-caps',
                  letterSpacing: '0.01em',
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                Join an elite network of sovereign wealth creators
              </motion.p>
            </motion.div>

            {/* Application Form */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <Card className="glass-morphism border-gold/20 rounded-3xl overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  
                  {/* Progress Indicator */}
                  <div className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white/80 font-light">Application Progress</span>
                      <span className="text-gold font-medium">{formStep} of {totalSteps}</span>
                    </div>
                    <div className="w-full bg-navy/40 rounded-full h-2">
                      <motion.div 
                        className="bg-gradient-to-r from-gold to-gold-light h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(formStep / totalSteps) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Step 1: Personal Information */}
                  {formStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
                          Personal Information
                        </h2>
                        <p className="text-white/70 font-light">
                          Tell us about yourself and your organization
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-white/80 font-medium">First Name *</label>
                          <input 
                            type="text"
                            className="w-full bg-navy/40 border border-gold/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors"
                            placeholder="Enter your first name"
                            value={formData.personalInfo.firstName}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-white/80 font-medium">Last Name *</label>
                          <input 
                            type="text"
                            className="w-full bg-navy/40 border border-gold/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors"
                            placeholder="Enter your last name"
                            value={formData.personalInfo.lastName}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-white/80 font-medium">Email Address *</label>
                          <input 
                            type="email"
                            className="w-full bg-navy/40 border border-gold/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors"
                            placeholder="your.email@domain.com"
                            value={formData.personalInfo.email}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, email: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-white/80 font-medium">Phone Number</label>
                          <input 
                            type="tel"
                            className="w-full bg-navy/40 border border-gold/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors"
                            placeholder="+1 (555) 123-4567"
                            value={formData.personalInfo.phone}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, phone: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-white/80 font-medium">Professional Title</label>
                          <input 
                            type="text"
                            className="w-full bg-navy/40 border border-gold/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors"
                            placeholder="CEO, CIO, Managing Partner, etc."
                            value={formData.personalInfo.title}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, title: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-white/80 font-medium">Organization</label>
                          <input 
                            type="text"
                            className="w-full bg-navy/40 border border-gold/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors"
                            placeholder="Company, Fund, Institution"
                            value={formData.personalInfo.organization}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, organization: e.target.value }
                            }))}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Financial Profile */}
                  {formStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
                          Financial Profile
                        </h2>
                        <p className="text-white/70 font-light">
                          Help us understand your investment background
                        </p>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-white/80 font-medium">Net Worth Range *</label>
                          <select 
                            className="w-full bg-navy/40 border border-gold/20 rounded-xl px-4 py-3 text-white focus:border-gold focus:outline-none transition-colors"
                            value={formData.financialInfo.netWorth}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              financialInfo: { ...prev.financialInfo, netWorth: e.target.value }
                            }))}
                          >
                            <option value="">Select net worth range</option>
                            <option value="1-10M">$1M - $10M</option>
                            <option value="10-50M">$10M - $50M</option>
                            <option value="50-100M">$50M - $100M</option>
                            <option value="100M+">$100M+</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-white/80 font-medium">Investment Experience *</label>
                          <select 
                            className="w-full bg-navy/40 border border-gold/20 rounded-xl px-4 py-3 text-white focus:border-gold focus:outline-none transition-colors"
                            value={formData.financialInfo.investmentExperience}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              financialInfo: { ...prev.financialInfo, investmentExperience: e.target.value }
                            }))}
                          >
                            <option value="">Select experience level</option>
                            <option value="beginner">Beginner (0-2 years)</option>
                            <option value="intermediate">Intermediate (3-7 years)</option>
                            <option value="advanced">Advanced (8-15 years)</option>
                            <option value="expert">Expert (15+ years)</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Interests & Commitment */}
                  {formStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
                          Interests & Commitment
                        </h2>
                        <p className="text-white/70 font-light">
                          Tell us about your investment interests and goals
                        </p>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-white/80 font-medium">Primary Investment Interests</label>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              'Digital Assets', 'Private Equity', 'Real Estate', 'Impact Investing',
                              'Sovereign Bonds', 'Venture Capital', 'Commodities', 'Alternative Assets'
                            ].map((interest) => (
                              <label key={interest} className="flex items-center space-x-3 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="w-4 h-4 text-gold bg-navy/40 border-gold/20 rounded focus:ring-gold"
                                />
                                <span className="text-white/80">{interest}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-white/80 font-medium">How did you hear about us?</label>
                          <select 
                            className="w-full bg-navy/40 border border-gold/20 rounded-xl px-4 py-3 text-white focus:border-gold focus:outline-none transition-colors"
                            value={formData.interests.referralSource}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              interests: { ...prev.interests, referralSource: e.target.value }
                            }))}
                          >
                            <option value="">Select referral source</option>
                            <option value="referral">Personal Referral</option>
                            <option value="website">Website</option>
                            <option value="social">Social Media</option>
                            <option value="event">Industry Event</option>
                            <option value="partner">Partner Organization</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center mt-12 pt-8 border-t border-gold/20">
                    {formStep > 1 && (
                      <Button
                        onClick={() => setFormStep(prev => prev - 1)}
                        variant="outline"
                        className="bg-transparent border-gold/30 text-white hover:bg-gold/10 hover:border-gold"
                      >
                        Previous
                      </Button>
                    )}
                    
                    <div className="flex-1" />
                    
                    {formStep < totalSteps ? (
                      <Button
                        onClick={() => setFormStep(prev => prev + 1)}
                        className="bg-gradient-to-r from-gold to-gold-light text-navy font-bold hover:from-gold-light hover:to-gold"
                      >
                        Next Step
                      </Button>
                    ) : (
                      <Button
                        className="bg-gradient-to-r from-gold to-gold-light text-navy font-bold hover:from-gold-light hover:to-gold"
                      >
                        Submit Application
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Benefits Section */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.6 }}
            >
              {[
                { icon: Network, title: "Elite Network", desc: "Connect with sovereign wealth creators globally" },
                { icon: Globe, title: "Exclusive Access", desc: "Private investment opportunities and insights" },
                { icon: Crown, title: "VIP Treatment", desc: "White-glove service and concierge support" }
              ].map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <motion.div
                    key={index}
                    className="glass-morphism border-gold/20 rounded-2xl p-6 text-center"
                    whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
                  >
                    <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-gold" />
                    </div>
                    <h3 className="text-white font-bold mb-2">{benefit.title}</h3>
                    <p className="text-white/70 text-sm font-light">{benefit.desc}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </div>

      <ElegantSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </ClientLayoutWrapper>
  )
}