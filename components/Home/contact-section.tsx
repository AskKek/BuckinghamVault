"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Lock, Star, Crown, Globe, UserCheck, Handshake, Building } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useDeviceDetection, prefersReducedMotion, generateDeterministicParticles } from "@/lib/animation-utils"

export function ContactSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { isMobileOrTablet } = useDeviceDetection()
  const [isClient, setIsClient] = useState(false)
  const [particles, setParticles] = useState<Array<{
    id: number;
    left: number;
    top: number;
    delay: number;
    duration: number;
  }>>([])

  useEffect(() => {
    setIsClient(true)
    // Enhanced floating particles for premium atmosphere - using deterministic values
    setParticles(generateDeterministicParticles(8, 301)) // Using seed 301 for contact section
  }, [])

  return (
    <section ref={ref} className="py-20 md:py-32 bg-gradient-to-b from-navy to-navy-dark relative overflow-hidden">
      {/* Enhanced Premium Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-navy-light" />

        {/* Premium floating orbs with enhanced glow */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-80 md:w-96 h-80 md:h-96 bg-gradient-to-r from-gold/15 via-gold/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.7, 0.3],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 md:w-80 h-64 md:h-80 bg-gradient-to-l from-gold/10 via-gold/5 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.5, 0.2],
            x: [0, -25, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Enhanced Contact Image with better opacity */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 md:opacity-30">
          <div className="relative w-full h-full max-w-4xl">
            <Image 
              src="/images/contact-inquiry.png" 
              alt="Private consultation environment" 
              fill 
              className="object-contain filter brightness-110 contrast-110" 
              priority={false}
              loading="lazy"
            />
          </div>
        </div>

        {/* Premium floating particles - desktop only */}
        {isClient && !prefersReducedMotion() && !isMobileOrTablet && (
          <div className="absolute inset-0 pointer-events-none">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute"
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                }}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0.5, 1, 0.5],
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: particle.delay,
                  ease: "easeInOut",
                }}
              >
                <Star className="w-1 h-1 md:w-2 md:h-2 text-gold/60" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="space-y-12 md:space-y-16"
        >
          {/* Enhanced Section Header */}
          <motion.div
            className="space-y-6 md:space-y-8"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Premium icon */}
            <motion.div
              className="flex justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 glass-morphism rounded-full flex items-center justify-center premium-glow">
                <Crown className="w-8 h-8 md:w-10 md:h-10 text-gold" />
              </div>
            </motion.div>

            {/* Enhanced Main Title */}
            <motion.h2
              className="text-3xl md:text-4xl lg:text-6xl font-display font-bold text-gold"
              style={{ 
                letterSpacing: '-0.02em',
                lineHeight: '1.1'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={
                !isMobileOrTablet ? {
                  scale: 1.02,
                  textShadow: "0 0 30px rgba(215, 147, 9, 0.4)"
                } : {}
              }
            >
              Inquire with The Vault
            </motion.h2>

            {/* Enhanced Subtitle */}
            <motion.h3
              className="text-xl md:text-2xl lg:text-3xl font-display font-medium text-white/90"
              style={{ letterSpacing: '-0.01em' }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Membership & Private Consultation Inquiries
            </motion.h3>

            <motion.p
              className="text-base md:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Connect with our sovereign wealth specialists for exclusive membership opportunities and bespoke financial solutions
            </motion.p>
          </motion.div>

          {/* Enhanced Confidentiality Notice */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-gold/5 to-gold/10 rounded-2xl md:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative glass-morphism rounded-2xl md:rounded-3xl p-8 md:p-10 luxury-border group-hover:border-gold/30 transition-all duration-500">
              <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-6">
                {/* Enhanced security icon */}
                <motion.div 
                  className="w-14 h-14 md:w-16 md:h-16 glass-morphism rounded-full flex items-center justify-center premium-glow"
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: "0 0 30px rgba(215, 147, 9, 0.3)" 
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Lock className="w-7 h-7 md:w-8 md:h-8 text-gold" />
                </motion.div>
                
                <div className="text-center md:text-left space-y-2">
                  <p className="text-white font-display font-bold text-lg md:text-xl">
                    Swiss-Level Confidentiality
                  </p>
                  <p className="text-white/70 font-sans text-base md:text-lg leading-relaxed">
                    All inquiries are protected under the highest standards of financial privacy and discretion
                  </p>
                  
                  {/* Trust indicators */}
                  <div className="flex items-center justify-center md:justify-start space-x-4 pt-2">
                    <div className="flex items-center space-x-1">
                      <Shield className="w-4 h-4 text-gold/70" />
                      <span className="text-sm text-white/60">Bank-Grade Security</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Globe className="w-4 h-4 text-gold/70" />
                      <span className="text-sm text-white/60">Global Compliance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Premium CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col lg:flex-row gap-6 md:gap-6 justify-center max-w-4xl mx-auto"
          >
            {/* Primary CTA */}
            <motion.div
              whileHover={
                !isMobileOrTablet ? {
                  scale: 1.05,
                  y: -2,
                } : {}
              }
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gold via-gold-light to-gold rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500" />
              <Button
                asChild
                size="lg"
                className="relative bg-gradient-to-r from-gold via-gold-light to-gold hover:from-gold-light hover:via-gold hover:to-gold-light text-navy font-display font-bold text-lg md:text-xl px-8 md:px-10 py-4 md:py-5 rounded-2xl transition-all duration-500 premium-glow shadow-2xl border-2 border-gold-light/30 hover:border-gold-light/60 touch-manipulation overflow-hidden group w-full sm:w-auto"
                aria-label="Access contact form for membership inquiries"
              >
                <Link href="/contact">
                <div className="absolute inset-0 bg-gradient-to-r from-gold/20 via-transparent to-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative flex items-center justify-center space-x-3">
                  <Crown className="w-5 h-5 md:w-6 md:h-6" />
                  <span>Contact Form</span>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                  </motion.div>
                </span>
                </Link>
              </Button>
            </motion.div>

            {/* Secondary CTA */}
            <motion.div
              whileHover={
                !isMobileOrTablet ? {
                  scale: 1.05,
                  y: -2,
                } : {}
              }
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="relative group"
            >
              <Button
                asChild
                size="lg"
                variant="outline"
                className="relative border-2 border-gold/60 text-gold hover:bg-gold/10 hover:border-gold font-display font-bold text-lg md:text-xl px-8 md:px-10 py-4 md:py-5 rounded-2xl transition-all duration-500 bg-transparent backdrop-blur-sm touch-manipulation w-full sm:w-auto group overflow-hidden hover:shadow-lg hover:shadow-gold/20"
                aria-label="Schedule private consultation with wealth management specialists"
              >
                <Link href="/contact">
                  <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-gold/10 to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative flex items-center justify-center space-x-3">
                    <Shield className="w-5 h-5 md:w-6 md:h-6" />
                    <span>Private Consultation</span>
                  </span>
                </Link>
              </Button>
            </motion.div>

            {/* Client Services Portal CTA */}
            <motion.div
              whileHover={
                !isMobileOrTablet ? {
                  scale: 1.05,
                  y: -2,
                } : {}
              }
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="relative group"
            >
              <Button
                asChild
                size="lg"
                variant="outline"
                className="relative border-2 border-gold/60 text-gold hover:bg-gold/10 hover:border-gold font-display font-bold text-lg md:text-xl px-8 md:px-10 py-4 md:py-5 rounded-2xl transition-all duration-500 bg-transparent backdrop-blur-sm touch-manipulation w-full sm:w-auto group overflow-hidden hover:shadow-lg hover:shadow-gold/20"
                aria-label="Access institutional client services portal"
              >
                <Link href="/client-services">
                  <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-gold/10 to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative flex items-center justify-center space-x-3">
                    <Building className="w-5 h-5 md:w-6 md:h-6" />
                    <span>Client Services</span>
                  </span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Exchange Services Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="pt-12 md:pt-16"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
                Exchange Services
              </h3>
              <p className="text-white/70 font-sans text-lg leading-relaxed max-w-3xl mx-auto">
                Access our institutional-grade cryptocurrency exchange with bright pools, 
                forensic rating system, and zero-slippage execution
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
              {/* Client Onboarding */}
              <motion.div
                whileHover={
                  !isMobileOrTablet ? {
                    scale: 1.02,
                    y: -4,
                  } : {}
                }
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-blue-400/5 to-blue-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative glass-morphism rounded-2xl p-6 md:p-8 luxury-border group-hover:border-blue-500/30 transition-all duration-500">
                  <div className="flex items-center space-x-4 mb-4">
                    <motion.div 
                      className="w-12 h-12 md:w-14 md:h-14 glass-morphism rounded-xl flex items-center justify-center"
                      whileHover={{ 
                        scale: 1.1,
                        boxShadow: "0 0 25px rgba(59, 130, 246, 0.3)" 
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <UserCheck className="w-6 h-6 md:w-7 md:h-7 text-blue-400" />
                    </motion.div>
                    <div>
                      <h4 className="text-lg md:text-xl font-display font-bold text-white">
                        Client Onboarding
                      </h4>
                      <p className="text-white/60 text-sm">KYC & Exchange Access</p>
                    </div>
                  </div>
                  
                  <p className="text-white/70 font-sans mb-6 leading-relaxed">
                    Complete our comprehensive KYC process to access institutional-grade 
                    trading with forensic-rated Bitcoin and bright pool infrastructure.
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      <span className="text-sm text-white/60">Bright Pool Access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      <span className="text-sm text-white/60">AAA-C Bitcoin Rating</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      <span className="text-sm text-white/60">Zero Slippage Trading</span>
                    </div>
                  </div>

                  <Button
                    asChild
                    className="w-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 hover:border-blue-500/60 text-blue-400 hover:text-blue-300 transition-all duration-300"
                  >
                    <Link href="/client-onboarding">
                      <span className="flex items-center justify-center space-x-2">
                        <span>Start Onboarding</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Link>
                  </Button>
                </div>
              </motion.div>

              {/* Mandate Application */}
              <motion.div
                whileHover={
                  !isMobileOrTablet ? {
                    scale: 1.02,
                    y: -4,
                  } : {}
                }
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-emerald-400/5 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative glass-morphism rounded-2xl p-6 md:p-8 luxury-border group-hover:border-emerald-500/30 transition-all duration-500">
                  <div className="flex items-center space-x-4 mb-4">
                    <motion.div 
                      className="w-12 h-12 md:w-14 md:h-14 glass-morphism rounded-xl flex items-center justify-center"
                      whileHover={{ 
                        scale: 1.1,
                        boxShadow: "0 0 25px rgba(16, 185, 129, 0.3)" 
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Handshake className="w-6 h-6 md:w-7 md:h-7 text-emerald-400" />
                    </motion.div>
                    <div>
                      <h4 className="text-lg md:text-xl font-display font-bold text-white">
                        Mandate Application
                      </h4>
                      <p className="text-white/60 text-sm">OTC Large Block Trading</p>
                    </div>
                  </div>
                  
                  <p className="text-white/70 font-sans mb-6 leading-relaxed">
                    Submit mandates for large over-the-counter transactions with 
                    automated counterparty matching and commission distribution.
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                      <span className="text-sm text-white/60">Counterparty Matching</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                      <span className="text-sm text-white/60">Auto Commission Split</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                      <span className="text-sm text-white/60">Hourly Index Pricing</span>
                    </div>
                  </div>

                  <Button
                    asChild
                    className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 hover:border-emerald-500/60 text-emerald-400 hover:text-emerald-300 transition-all duration-300"
                  >
                    <Link href="/mandate-application">
                      <span className="flex items-center justify-center space-x-2">
                        <span>Submit Mandate</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Trust Statement */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="pt-8 md:pt-12"
          >
            <div className="max-w-3xl mx-auto space-y-4">
              <p className="text-base md:text-lg text-white/90 font-sans font-light italic leading-relaxed">
                "Trusted by sovereign wealth funds, governments, and institutional investors worldwide"
              </p>
              
              {/* Enhanced trust metrics */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span className="text-sm text-white/70">24/7 Dedicated Support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span className="text-sm text-white/70">Global Regulatory Compliance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span className="text-sm text-white/70">Institutional Grade Security</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
