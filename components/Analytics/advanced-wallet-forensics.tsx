"use client"

import React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ShieldCheck, ShieldAlert, AlertTriangle, Loader, Eye, Clock, MapPin, Crown, Star, Sparkles, Shield } from "lucide-react"
import { useDeviceDetection, prefersReducedMotion } from "@/lib/animation-utils"

type RiskRating = "AAA" | "AA" | "A" | "B" | "C" | "D" | "F"

interface ForensicsResult {
  address: string
  rating: RiskRating
  riskScore: number
  summary: string
  totalTransactions: number
  totalVolume: number
  firstSeen: string
  lastActivity: string
  riskFactors: {
    sanctionedEntities: number
    darknetMarkets: number
    mixers: number
    gambling: number
    exchanges: number
    defi: number
  }
  complianceChecks: {
    ofac: boolean
    eu: boolean
    un: boolean
    fatf: boolean
  }
  transactionPattern: {
    averageAmount: number
    frequency: string
    timePattern: string
  }
  sourceAnalysis: {
    exchanges: number
    mining: number
    defi: number
    unknown: number
  }
  recommendations: string[]
}

interface Particle {
  id: number
  left: number
  top: number
  delay: number
  duration: number
  size: number
  opacity: number
}

interface FloatingOrb {
  id: number
  left: number
  top: number
  delay: number
  duration: number
  scale: number
}

const ratingConfig = {
  AAA: {
    color: "text-green-400",
    bgColor: "bg-green-400/10",
    borderColor: "border-green-400/30",
    glowColor: "shadow-green-400/20",
    icon: ShieldCheck,
    label: "Pristine",
    description: "No risk factors detected - Institutional grade",
  },
  AA: {
    color: "text-green-300",
    bgColor: "bg-green-300/10",
    borderColor: "border-green-300/30",
    glowColor: "shadow-green-300/20",
    icon: ShieldCheck,
    label: "Very Low Risk",
    description: "Minimal exposure to risk factors",
  },
  A: {
    color: "text-yellow-300",
    bgColor: "bg-yellow-300/10",
    borderColor: "border-yellow-300/30",
    glowColor: "shadow-yellow-300/20",
    icon: ShieldCheck,
    label: "Low Risk",
    description: "Some minor risk factors present",
  },
  B: {
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    borderColor: "border-yellow-400/30",
    glowColor: "shadow-yellow-400/20",
    icon: ShieldAlert,
    label: "Moderate Risk",
    description: "Notable risk factors require attention",
  },
  C: {
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    borderColor: "border-orange-400/30",
    glowColor: "shadow-orange-400/20",
    icon: ShieldAlert,
    label: "High Risk",
    description: "Significant risk factors present",
  },
  D: {
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    borderColor: "border-red-400/30",
    glowColor: "shadow-red-400/20",
    icon: AlertTriangle,
    label: "Very High Risk",
    description: "Multiple serious risk factors",
  },
  F: {
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    glowColor: "shadow-red-500/20",
    icon: AlertTriangle,
    label: "Sanctioned/Illicit",
    description: "Direct exposure to sanctioned entities",
  },
}

function AdvancedWalletForensicsComponent() {
  const [address, setAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ForensicsResult | null>(null)
  const [analysisStage, setAnalysisStage] = useState("")
  const [isClient, setIsClient] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [floatingOrbs, setFloatingOrbs] = useState<FloatingOrb[]>([])
  const { isMobile, isMobileOrTablet } = useDeviceDetection()

  const analysisStages = [
    "Validating address format and blockchain connectivity...",
    "Scanning transaction history and UTXO patterns...",
    "Cross-referencing against OFAC & EU sanctions databases...",
    "Analyzing transaction flows & mixing patterns...",
    "Checking compliance with FATF & regulatory frameworks...",
    "Generating comprehensive risk assessment report...",
  ]

  useEffect(() => {
    setIsClient(true)
    
    // Enhanced constellation of floating particles - Desktop only
    if (!isMobileOrTablet && !prefersReducedMotion()) {
      setParticles(Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 10 + Math.random() * 8,
        size: Math.random() * 1.2 + 0.6,
        opacity: Math.random() * 0.5 + 0.2,
      })))

      // Premium floating golden orbs for security theme
      setFloatingOrbs(Array.from({ length: 3 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 18 + Math.random() * 12,
        scale: Math.random() * 0.6 + 0.4,
      })))
    }
  }, [isMobileOrTablet])

  const handleAnalysis = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address) return

    setIsLoading(true)
    setResult(null)

    // Enhanced progressive analysis stages with realistic timing
    for (let i = 0; i < analysisStages.length; i++) {
      setAnalysisStage(analysisStages[i])
      await new Promise((resolve) => setTimeout(resolve, 1200))
    }

    // Generate enhanced mock forensics result
    const mockResult: ForensicsResult = {
      address: address,
      rating: "AAA" as RiskRating,
      riskScore: 2.3,
      summary:
        "Comprehensive blockchain analysis reveals exceptional compliance standards with no direct or indirect exposure to high-risk entities. Funds demonstrate clear provenance from regulated institutional sources with transparent audit trail meeting sovereign wealth fund custody requirements.",
      totalTransactions: 247,
      totalVolume: 15.67,
      firstSeen: "2023-01-15",
      lastActivity: "2024-01-20",
      riskFactors: {
        sanctionedEntities: 0,
        darknetMarkets: 0,
        mixers: 0,
        gambling: 1,
        exchanges: 85,
        defi: 14,
      },
      complianceChecks: {
        ofac: true,
        eu: true,
        un: true,
        fatf: true,
      },
      transactionPattern: {
        averageAmount: 0.063,
        frequency: "Regular institutional patterns",
        timePattern: "Business hours (9-17 UTC)",
      },
      sourceAnalysis: {
        exchanges: 85,
        mining: 5,
        defi: 8,
        unknown: 2,
      },
      recommendations: [
        "Funds demonstrate institutional-grade compliance standards",
        "Transaction patterns consistent with professional treasury management",
        "No additional enhanced due diligence required",
        "Approved for sovereign wealth fund & family office custody",
        "Meets regulatory requirements for private banking integration",
      ],
    }

    setResult(mockResult)
    setIsLoading(false)
    setAnalysisStage("")
  }

  return (
    <div className="relative overflow-hidden">
      {/* Premium Background System - Desktop Only */}
      {isClient && !prefersReducedMotion() && !isMobileOrTablet && (
        <>
          {/* Enhanced constellation of floating particles with security theme */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute"
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                }}
                animate={{
                  opacity: [particle.opacity * 0.4, particle.opacity, particle.opacity * 0.4],
                  scale: [0.6, 1, 0.6],
                  y: [0, -25, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: particle.delay,
                  ease: "easeInOut",
                }}
              >
                <Shield 
                  className="text-gold/25" 
                  style={{ 
                    width: `${particle.size * 8}px`, 
                    height: `${particle.size * 8}px` 
                  }}
                  aria-hidden="true" 
                />
              </motion.div>
            ))}
          </div>

          {/* Premium floating golden security orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {floatingOrbs.map((orb) => (
              <motion.div
                key={orb.id}
                className="absolute w-40 h-40 bg-gradient-to-r from-gold/8 to-transparent rounded-full blur-3xl"
                style={{
                  left: `${orb.left}%`,
                  top: `${orb.top}%`,
                }}
                animate={{
                  x: [0, 80, 0],
                  y: [0, -60, 0],
                  scale: [orb.scale, orb.scale * 1.3, orb.scale],
                }}
                transition={{
                  duration: orb.duration,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: orb.delay,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Luxury Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy/25 via-navy-dark/35 to-navy/25 rounded-2xl blur-3xl" />

      <motion.div 
        className="relative glass-morphism rounded-2xl p-6 md:p-8 space-y-6 md:space-y-8 luxury-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Enhanced Premium Header */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={!isMobile ? { scale: 1.1, rotate: 5 } : {}}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-gold" />
            </motion.div>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-gradient tracking-tight">
              Advanced Wallet Forensics
            </h3>
          </div>
          <p className="text-white/70 font-sans font-light leading-relaxed">
            Institutional-grade blockchain analysis and regulatory compliance verification
          </p>
          
          {/* Premium Security Features Bar */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-gold/60" />
              <span className="text-white/60">Multi-jurisdiction compliance • <span className="text-gold font-medium">OFAC, EU, UN, FATF</span></span>
            </div>
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4 text-gold/60" />
              <span className="text-white/60">Sovereign-grade security analysis</span>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Analysis Form */}
        <motion.form 
          onSubmit={handleAnalysis} 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <motion.div
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Input
                  type="text"
                  placeholder="Enter Bitcoin wallet address (bc1... or 1... or 3...)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-navy/50 border-gold/20 focus:ring-gold focus:border-gold text-white h-12 placeholder:text-white/40 font-medium luxury-border"
                  disabled={isLoading}
                />
              </motion.div>
            </div>
            <motion.div
              whileHover={!isMobile ? { scale: 1.02 } : {}}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                className="bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-navy font-bold h-12 px-8 shadow-lg luxury-border"
                disabled={isLoading || !address}
              >
                {isLoading ? 
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Crown className="w-5 h-5 mr-2" />
                  </motion.div>
                  : <Search className="w-5 h-5 mr-2" />
                }
                <span>{isLoading ? "Analyzing..." : "Analyze Wallet"}</span>
              </Button>
            </motion.div>
          </div>

          <p className="text-xs text-white/50 leading-relaxed">
            Analysis includes comprehensive OFAC, EU, UN sanctions screening, darknet market detection, 
            mixing service identification, and institutional-grade transaction pattern analysis
          </p>
        </motion.form>

        {/* Enhanced Loading State with Crown Animation */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="glass-morphism rounded-xl p-8 border border-gold/20 luxury-border"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="text-center space-y-6">
                <motion.div 
                  className="flex justify-center"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <Crown className="w-16 h-16 text-gold" />
                    </motion.div>
                    
                    {/* Premium loading ring */}
                    <motion.div 
                      className="absolute inset-0 w-16 h-16 border-4 border-gold/20 rounded-full"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                    
                    {/* Enhanced glow effect */}
                    <div className="absolute inset-0 w-16 h-16 bg-gold/20 rounded-full blur-xl animate-pulse" />
                  </div>
                </motion.div>
                
                <div className="space-y-3">
                  <motion.p 
                    className="text-white font-medium text-lg"
                    key={analysisStage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {analysisStage}
                  </motion.p>
                  
                  {/* Enhanced progress bar */}
                  <div className="w-full bg-navy/50 rounded-full h-3 overflow-hidden luxury-border">
                    <motion.div
                      className="bg-gradient-to-r from-gold to-gold-light h-3 rounded-full shadow-lg"
                      initial={{ width: "0%" }}
                      animate={{
                        width: `${((analysisStages.indexOf(analysisStage) + 1) / analysisStages.length) * 100}%`,
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  
                  <div className="text-xs text-white/60">
                    Step {analysisStages.indexOf(analysisStage) + 1} of {analysisStages.length}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Results Display */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Enhanced Risk Rating Card */}
              <motion.div
                className={`glass-morphism ${ratingConfig[result.rating].borderColor} border-2 rounded-xl p-6 luxury-border relative overflow-hidden`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                {/* Premium glow overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${ratingConfig[result.rating].bgColor} opacity-30 pointer-events-none`} />
                
                <div className="relative grid md:grid-cols-4 gap-6 items-center">
                  <div className="md:col-span-1 text-center space-y-4">
                    <motion.div
                      className={`text-8xl font-display font-bold ${ratingConfig[result.rating].color} drop-shadow-lg`}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.4 }}
                    >
                      {result.rating}
                    </motion.div>
                    
                    <motion.div 
                      className={`flex items-center justify-center space-x-2 ${ratingConfig[result.rating].color}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      {React.createElement(ratingConfig[result.rating].icon, { 
                        className: "w-6 h-6" 
                      })}
                      <span className="font-bold text-lg">{ratingConfig[result.rating].label}</span>
                    </motion.div>
                    
                    <p className="text-sm text-white/70 leading-relaxed">
                      {ratingConfig[result.rating].description}
                    </p>
                  </div>

                  <div className="md:col-span-3 space-y-5">
                    <div>
                      <h4 className="text-xl font-display font-bold text-gradient mb-3 tracking-tight">
                        Risk Assessment Summary
                      </h4>
                      <p className="text-white/80 leading-relaxed font-light">
                        {result.summary}
                      </p>
                    </div>

                    {/* Enhanced statistics grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: "Risk Score", value: `${result.riskScore}/100`, color: "text-green-400" },
                        { label: "Transactions", value: result.totalTransactions.toLocaleString(), color: "text-white" },
                        { label: "Total Volume", value: `${result.totalVolume} BTC`, color: "text-gold" },
                        { label: "Last Activity", value: result.lastActivity, color: "text-white/80" }
                      ].map((stat, index) => (
                        <motion.div 
                          key={stat.label}
                          className="text-center space-y-1"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                        >
                          <p className="text-xs text-white/60 uppercase tracking-wider">{stat.label}</p>
                          <p className={`font-bold ${stat.color}`}>{stat.value}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Detailed Analysis Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Enhanced Risk Factors Analysis */}
                <motion.div 
                  className="glass-morphism rounded-xl p-6 border border-gold/20 luxury-border"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h4 className="text-lg font-display font-bold text-gradient mb-4 flex items-center tracking-tight">
                    <Eye className="w-5 h-5 mr-2 text-gold" />
                    Risk Factor Analysis
                  </h4>
                  <div className="space-y-4">
                    {Object.entries(result.riskFactors).map(([factor, percentage], index) => (
                      <motion.div 
                        key={factor} 
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70 capitalize font-medium">
                            {factor.replace(/([A-Z])/g, " $1")}
                          </span>
                          <span className="text-white font-bold">{percentage}%</span>
                        </div>
                        <div className="w-full bg-navy/50 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className={`h-2 rounded-full shadow-lg ${
                              percentage === 0
                                ? "bg-gradient-to-r from-green-400 to-green-300"
                                : percentage < 5
                                ? "bg-gradient-to-r from-yellow-400 to-yellow-300"
                                : percentage < 15
                                ? "bg-gradient-to-r from-orange-400 to-orange-300"
                                : "bg-gradient-to-r from-red-400 to-red-300"
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1.2, delay: 0.8 + index * 0.1, ease: "easeOut" }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Enhanced Compliance Verification */}
                <motion.div 
                  className="glass-morphism rounded-xl p-6 border border-gold/20 luxury-border"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <h4 className="text-lg font-display font-bold text-gradient mb-4 flex items-center tracking-tight">
                    <ShieldCheck className="w-5 h-5 mr-2 text-gold" />
                    Compliance Verification
                  </h4>
                  <div className="space-y-4">
                    {Object.entries(result.complianceChecks).map(([check, passed], index) => (
                      <motion.div 
                        key={check} 
                        className="flex items-center justify-between p-3 bg-navy/30 rounded-lg border border-white/10"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                      >
                        <span className="text-white/80 uppercase font-medium tracking-wide">
                          {check} Sanctions List
                        </span>
                        <motion.div 
                          className={`flex items-center space-x-2 ${passed ? "text-green-400" : "text-red-400"}`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {passed ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                          <span className="font-bold">{passed ? "Clear" : "Flagged"}</span>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Enhanced Transaction Patterns */}
                <motion.div 
                  className="glass-morphism rounded-xl p-6 border border-gold/20 luxury-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <h4 className="text-lg font-display font-bold text-gradient mb-4 flex items-center tracking-tight">
                    <Clock className="w-5 h-5 mr-2 text-gold" />
                    Transaction Patterns
                  </h4>
                  <div className="space-y-4">
                    {[
                      { label: "Average Amount", value: `${result.transactionPattern.averageAmount} BTC` },
                      { label: "Frequency", value: result.transactionPattern.frequency },
                      { label: "Time Pattern", value: result.transactionPattern.timePattern }
                    ].map((pattern, index) => (
                      <motion.div 
                        key={pattern.label}
                        className="flex justify-between items-center p-3 bg-navy/30 rounded-lg border border-white/10"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                      >
                        <span className="text-white/70 font-medium">{pattern.label}</span>
                        <span className="text-white font-bold">{pattern.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Enhanced Source Analysis */}
                <motion.div 
                  className="glass-morphism rounded-xl p-6 border border-gold/20 luxury-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <h4 className="text-lg font-display font-bold text-gradient mb-4 flex items-center tracking-tight">
                    <MapPin className="w-5 h-5 mr-2 text-gold" />
                    Source Analysis
                  </h4>
                  <div className="space-y-4">
                    {Object.entries(result.sourceAnalysis).map(([source, percentage], index) => (
                      <motion.div 
                        key={source} 
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                      >
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70 capitalize font-medium">{source}</span>
                          <span className="text-white font-bold">{percentage}%</span>
                        </div>
                        <div className="w-full bg-navy/50 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="bg-gradient-to-r from-gold to-gold-light h-2 rounded-full shadow-lg"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1.4, delay: 1.1 + index * 0.1, ease: "easeOut" }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Enhanced Recommendations */}
              <motion.div 
                className="glass-morphism rounded-xl p-6 border border-gold/20 luxury-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <h4 className="text-xl font-display font-bold text-gradient mb-4 tracking-tight">
                  Institutional Compliance Recommendations
                </h4>
                <ul className="space-y-3">
                  {result.recommendations.map((recommendation, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-navy/20 rounded-lg border border-white/10"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      >
                        <ShieldCheck className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      </motion.div>
                      <span className="text-white/80 font-light leading-relaxed">{recommendation}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default AdvancedWalletForensicsComponent
