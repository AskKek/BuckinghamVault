"use client"

import React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ShieldCheck, ShieldAlert, Loader, Crown, Shield, Eye, Sparkles, Star, AlertTriangle, CheckCircle, XCircle, Target, Zap } from "lucide-react"
import { useDeviceDetection, prefersReducedMotion } from "@/lib/animation-utils"
import { 
  getGoldenTextGradient, 
  getRegalCardHover, 
  getCrownLoadingClasses,
  getPremiumButtonClasses,
  THEME_ANIMATIONS 
} from "@/lib/theme"

type AnalysisResult = {
  rating: "AAA" | "AA" | "A" | "B" | "C" | "F"
  summary: string
  details: string[]
}

const ratings = {
  AAA: { color: "text-green-400", icon: ShieldCheck, label: "Institutional Grade" },
  AA: { color: "text-green-300", icon: ShieldCheck, label: "Very Low Risk" },
  A: { color: "text-yellow-300", icon: ShieldCheck, label: "Low Risk" },
  B: { color: "text-yellow-400", icon: ShieldAlert, label: "Moderate Risk" },
  C: { color: "text-orange-400", icon: ShieldAlert, label: "High Risk" },
  F: { color: "text-red-500", icon: ShieldAlert, label: "Sanctioned/Illicit" },
}

export function WalletForensics() {
  const [address, setAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isClient, setIsClient] = useState(false)
  const { isMobile } = useDeviceDetection()

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Simulate API call for forensics analysis
  const handleAnalysis = (e: React.FormEvent) => {
    e.preventDefault()
    if (!address) return
    setIsLoading(true)
    setResult(null)

    setTimeout(() => {
      // In a real app, this would be a result from a forensics API
      const mockResult: AnalysisResult = {
        rating: "AAA",
        summary: "No direct or indirect exposure to high-risk entities found.",
        details: [
          "0% exposure to Sanctioned Entities",
          "0% exposure to Darknet Markets",
          "0% exposure to Mixers/Tumblers",
          "Source of funds traced to regulated exchanges.",
        ],
      }
      setResult(mockResult)
      setIsLoading(false)
    }, 2500)
  }

  return (
    <div className="relative overflow-hidden">
      {/* Luxury Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-gold/5 to-gold/10 rounded-2xl blur-3xl" />

      <motion.div 
        className="relative glass-morphism rounded-2xl p-6 md:p-8 space-y-6 md:space-y-8 luxury-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Institutional Header */}
        <motion.div 
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <motion.div
                className="relative"
                whileHover={!isMobile ? { scale: 1.1, rotate: 5 } : {}}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-gold/30 to-gold/15 rounded-xl flex items-center justify-center border border-gold/30 shadow-lg shadow-gold/20"
                  variants={THEME_ANIMATIONS.goldPulse}
                  animate="animate"
                >
                  <Shield className="w-6 h-6 md:w-8 md:h-8 text-gold" />
                </motion.div>
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full flex items-center justify-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Eye className="w-2 h-2 text-navy" />
                </motion.div>
              </motion.div>
              <div>
                <h3 className={`text-3xl md:text-4xl font-display font-bold tracking-tight ${getGoldenTextGradient('bold')}`}>
                  Institutional Investigation Suite
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Target className="w-5 h-5 text-gold/70" />
                  <span className="text-white/70 font-sans font-light">
                    Institutional-grade on-chain forensics
                  </span>
                  <Sparkles className="w-4 h-4 text-gold/60" />
                </div>
              </div>
            </div>
            <p className="text-white/70 font-sans font-light leading-relaxed">
              Advanced blockchain forensics and compliance analysis for institutional trading operations
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <motion.div
              className="w-3 h-3 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full shadow-lg shadow-gold/30"
              animate={{ 
                opacity: [1, 0.4, 1],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
            <span className="font-display font-bold text-base md:text-lg text-gold">COMPLIANCE GRADE</span>
          </div>
        </motion.div>

        {/* Enhanced Form */}
        <motion.form 
          onSubmit={handleAnalysis} 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter Bitcoin, Ethereum, or other wallet address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-gold/10 border-gold/30 focus:ring-gold/50 focus:border-gold text-white placeholder:text-white/50 h-12 text-lg backdrop-blur-xl"
              />
            </div>
            <motion.div
              whileHover={!isMobile ? { scale: 1.02 } : {}}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="submit" 
                className={`h-12 px-8 ${getPremiumButtonClasses('golden')} text-navy font-bold text-lg`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader className="w-5 h-5 mr-2" />
                  </motion.div>
                ) : (
                  <Search className="w-5 h-5 mr-2" />
                )}
                <span>Institutional Analysis</span>
              </Button>
            </motion.div>
          </div>

          {/* Quick Analysis Options */}
          <div className="flex flex-wrap gap-2">
            {[
              "Risk Assessment", 
              "Compliance Check", 
              "Source Tracing", 
              "Entity Analysis"
            ].map((option, index) => (
              <motion.button
                key={option}
                type="button"
                className="px-4 py-2 bg-gold/20 border border-gold/30 rounded-lg text-gold font-medium hover:bg-gold/30 transition-all duration-300 text-sm"
                whileHover={!isMobile ? { scale: 1.05 } : {}}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.form>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="bg-gradient-to-br from-gold/10 via-gold/5 to-gold/10 rounded-xl p-8 border border-gold/20 backdrop-blur-xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="text-center space-y-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Shield className="w-16 h-16 text-gold mx-auto" />
                </motion.div>
                <div className="space-y-2">
                  <p className="text-xl font-display font-bold text-gold">
                    Institutional Analysis in Progress
                  </p>
                  <p className="text-white/70">
                    Analyzing transaction history, compliance flags, and risk indicators...
                  </p>
                </div>
                <div className="flex justify-center space-x-6 text-sm text-white/60">
                  <div className="flex items-center space-x-2">
                    <motion.div
                      className="w-2 h-2 bg-gold rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <span>Blockchain Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.div
                      className="w-2 h-2 bg-gold rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.33 }}
                    />
                    <span>Compliance Check</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.div
                      className="w-2 h-2 bg-gold rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.66 }}
                    />
                    <span>Risk Assessment</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {result && (
            <motion.div
              className="bg-gradient-to-br from-gold/10 via-gold/5 to-gold/10 rounded-xl p-8 border border-gold/30 backdrop-blur-xl shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="grid lg:grid-cols-3 gap-8 items-center">
                {/* Rating Display */}
                <div className="lg:col-span-1 text-center space-y-4">
                  <motion.div
                    className={`text-8xl font-display font-bold ${ratings[result.rating].color} relative`}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                  >
                    {result.rating}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-gold/20 to-transparent rounded-lg"
                      animate={{ 
                        opacity: [0, 0.5, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  
                  <motion.div 
                    className={`flex items-center justify-center space-x-3 ${ratings[result.rating].color}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      {React.createElement(ratings[result.rating].icon, { className: "w-6 h-6" })}
                    </motion.div>
                    <span className="font-display font-bold text-lg">{ratings[result.rating].label}</span>
                  </motion.div>

                  <motion.div
                    className="px-4 py-2 bg-gold/20 border border-gold/30 rounded-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <p className="text-gold font-medium text-sm">Institutional Grade Assessment</p>
                  </motion.div>
                </div>
                
                {/* Analysis Details */}
                <div className="lg:col-span-2 space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h4 className={`text-xl font-display font-bold mb-3 ${getGoldenTextGradient('normal')}`}>
                      Executive Summary
                    </h4>
                    <p className="text-white font-medium text-lg leading-relaxed">{result.summary}</p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h4 className={`text-lg font-display font-bold mb-4 ${getGoldenTextGradient('normal')}`}>
                      Detailed Analysis
                    </h4>
                    <div className="grid gap-3">
                      {result.details.map((detail, i) => (
                        <motion.div
                          key={i}
                          className="flex items-start space-x-3 p-3 bg-gold/5 rounded-lg border border-gold/10"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + i * 0.1 }}
                        >
                          <motion.div
                            className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0"
                            animate={{ 
                              opacity: [0.5, 1, 0.5],
                              scale: [1, 1.2, 1]
                            }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity, 
                              delay: i * 0.2 
                            }}
                          />
                          <span className="text-white/90 font-medium">{detail}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Compliance Indicators */}
                  <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gold/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    {[
                      { label: "Sanctions", status: "Clear", icon: CheckCircle },
                      { label: "AML Risk", status: "Low", icon: ShieldCheck },
                      { label: "Source", status: "Verified", icon: Target },
                      { label: "Compliance", status: "Pass", icon: Star }
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        className="text-center space-y-2"
                        whileHover={!isMobile ? { scale: 1.05 } : {}}
                      >
                        <motion.div
                          className="w-8 h-8 bg-gold/20 rounded-lg flex items-center justify-center mx-auto"
                          whileHover={{ rotate: 10 }}
                        >
                          <item.icon className="w-4 h-4 text-gold" />
                        </motion.div>
                        <div>
                          <p className="text-xs text-white/60 font-medium">{item.label}</p>
                          <p className="text-sm text-green-400 font-bold">{item.status}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
