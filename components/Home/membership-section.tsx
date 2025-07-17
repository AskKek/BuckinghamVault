"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Crown, Users, Calendar, Sparkles, Star, Shield, Zap } from "lucide-react"
import { useDeviceDetection, prefersReducedMotion, generateDeterministicParticles } from "@/lib/animation-utils"
import Link from "next/link"

interface MembershipSectionProps {
  benefits: string[]
}

const benefitIcons = [Users, Calendar, Sparkles, Crown, Shield, Zap]

export function MembershipSection({ benefits }: MembershipSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { isMobileOrTablet } = useDeviceDetection()
  const [isClient, setIsClient] = useState(false)
  const [hoveredBenefit, setHoveredBenefit] = useState<number | null>(null)
  const [backgroundParticles, setBackgroundParticles] = useState<Array<{
    id: number;
    left: number;
    top: number;
    delay: number;
    duration: number;
    size: number;
    opacity: number;
  }>>([])

  useEffect(() => {
    setIsClient(true)
    // Enhanced floating particles for premium atmosphere - using deterministic values
    setBackgroundParticles(generateDeterministicParticles(22, 601)) // Using seed 601 for membership section
  }, [])

  return (
    <section 
      ref={ref} 
      className="py-24 md:py-32 bg-gradient-to-b from-navy-dark via-navy to-navy-light relative overflow-hidden"
      role="region"
      aria-labelledby="membership-heading"
    >
      {/* Enhanced Premium Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-navy-light" />

        {/* Enhanced floating orbs with sophisticated movement */}
        <motion.div
          className="absolute top-1/6 left-1/6 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-gradient-to-r from-gold/20 via-gold/12 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.25, 0.7, 0.25],
            x: [0, 100, 0],
            y: [0, -80, 0],
          }}
          transition={{
            duration: 22,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute bottom-1/6 right-1/6 w-[500px] md:w-[700px] h-[500px] md:h-[700px] bg-gradient-to-l from-gold/18 via-gold/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.6, 0.2],
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 5,
          }}
        />

        {/* Premium floating particles - desktop only */}
        {isClient && !prefersReducedMotion() && !isMobileOrTablet && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {backgroundParticles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute"
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                }}
                animate={{
                  opacity: [particle.opacity * 0.4, particle.opacity, particle.opacity * 0.4],
                  scale: [0.6, 1.4, 0.6],
                  y: [0, -60, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: particle.delay,
                  ease: "easeInOut",
                }}
              >
                <Sparkles 
                  className="text-gold/20" 
                  style={{ 
                    width: `${particle.size * 14}px`, 
                    height: `${particle.size * 14}px` 
                  }}
                  aria-hidden="true" 
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="space-y-20 md:space-y-24"
        >
          {/* Enhanced Premium Section Header */}
          <motion.div
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            {/* Crown Icon with Enhanced Styling */}
            <motion.div
              className="flex justify-center mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
              transition={{ duration: 1.2, delay: 0.4, type: "spring", bounce: 0.3 }}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gold/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative bg-gradient-to-br from-navy-light/90 to-navy-dark/90 backdrop-blur-xl border border-gold/20 rounded-2xl p-4 group-hover:border-gold/40 transition-all duration-500">
                  <Crown className="w-8 h-8 text-gold group-hover:text-gold/90 transition-colors duration-300" />
                </div>
              </div>
            </motion.div>

            <h2 
              id="membership-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-8 tracking-tight leading-tight max-w-6xl mx-auto"
              style={{ letterSpacing: '-0.02em', lineHeight: '0.95' }}
            >
              Private Membership in The{' '}
              <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent font-medium">
                Buckingham Vault Collective
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-white/70 font-light max-w-5xl mx-auto leading-relaxed">
              Becoming a member unlocks more than access to deals — it opens doors to a new sovereign class of 
              leadership, wellness, and wealth community
            </p>

            {/* Decorative line */}
            <motion.div
              className="flex justify-center mt-8"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
            </motion.div>
          </motion.div>

          {/* Enhanced Premium Benefits Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {benefits.map((benefit, index) => {
              const Icon = benefitIcons[index] || Shield
              const isHovered = hoveredBenefit === index
              
              return (
                <motion.div
                  key={index}
                  className="group relative"
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 1 + index * 0.15,
                    type: "spring",
                    bounce: 0.2
                  }}
                  onHoverStart={() => setHoveredBenefit(index)}
                  onHoverEnd={() => setHoveredBenefit(null)}
                >
                  {/* Enhanced background glow */}
                  <motion.div
                    className="absolute -inset-2 bg-gradient-to-r from-gold/12 via-gold/6 to-gold/12 rounded-3xl blur-2xl opacity-0"
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      scale: isHovered ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.5 }}
                  />

                  {/* Premium Benefit Card */}
                  <motion.div
                    className="relative flex items-start space-x-6 p-8 md:p-10 bg-gradient-to-br from-navy-light/40 to-navy-dark/60 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-gold/30 transition-all duration-500 overflow-hidden"
                    animate={{
                      y: isHovered ? -8 : 0,
                      scale: isHovered ? 1.02 : 1,
                    }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                  >
                    {/* Enhanced gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Enhanced Premium Icon */}
                    <motion.div
                      className="flex-shrink-0 relative"
                      animate={{
                        scale: isHovered ? 1.15 : 1,
                        rotate: isHovered ? 10 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Premium icon background glow */}
                      <motion.div
                        className="absolute inset-0 bg-gold/25 rounded-2xl blur-lg"
                        animate={{
                          scale: isHovered ? 1.3 : 1,
                          opacity: isHovered ? 0.8 : 0.5,
                        }}
                        transition={{ duration: 0.4 }}
                      />
                      
                      <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-gold/20 to-gold/10 rounded-2xl flex items-center justify-center group-hover:from-gold/30 group-hover:to-gold/20 transition-all duration-300">
                        <Icon className="relative z-10 w-8 h-8 md:w-10 md:h-10 text-gold group-hover:text-gold-light transition-colors duration-300" />
                      </div>
                    </motion.div>

                    {/* Enhanced Premium Content */}
                    <motion.div
                      className="flex-1 relative z-10"
                      animate={{
                        x: isHovered ? 5 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <p 
                        className="text-lg md:text-xl text-white/80 font-light leading-relaxed group-hover:text-white/95 transition-colors duration-500"
                        style={{ letterSpacing: '-0.01em' }}
                      >
                        {benefit}
                      </p>

                      {/* Enhanced decorative element */}
                      <motion.div
                        className="mt-4 w-16 h-px bg-gradient-to-r from-gold/40 to-transparent opacity-0 group-hover:opacity-100"
                        animate={{
                          scaleX: isHovered ? 1 : 0,
                          opacity: isHovered ? 1 : 0,
                        }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      />
                    </motion.div>

                    {/* Floating decorative dots */}
                    <div className="absolute bottom-4 right-4 opacity-20 group-hover:opacity-60 transition-opacity duration-500">
                      <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1 h-1 bg-gold rounded-full"
                            animate={{
                              scale: isHovered ? [1, 1.3, 1] : 1,
                              opacity: isHovered ? [0.5, 1, 0.5] : 0.5,
                            }}
                            transition={{
                              duration: 1.5,
                              delay: i * 0.1,
                              repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Enhanced Premium CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 1, delay: 1.5, type: "spring", bounce: 0.2 }}
            className="text-center"
          >
            <div className="relative group inline-block">
              {/* Enhanced button glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-gold/30 via-gold/20 to-gold/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              
              <Button
                asChild
                size="lg"
                className="relative bg-gradient-to-r from-gold via-gold-light to-gold hover:from-gold-light hover:via-gold hover:to-gold-light text-navy font-semibold text-lg md:text-xl px-10 py-6 md:px-12 md:py-7 rounded-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gold/30 border-2 border-gold/20 hover:border-gold/40"
                style={{ letterSpacing: '-0.01em' }}
              >
                <Link href="/village-collective">
                  <Shield className="mr-3 w-5 h-5 md:w-6 md:h-6" />
                  Apply for Membership
                  <ArrowRight className="ml-3 w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <motion.div
              className="flex justify-center items-center space-x-8 mt-8 opacity-60"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 0.6, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 1, delay: 1.8 }}
            >
              <div className="flex items-center space-x-2 text-gold/70">
                <Crown className="w-4 h-4" />
                <span className="text-sm font-light">Sovereign Access</span>
              </div>
              <div className="w-px h-4 bg-gold/30" />
              <div className="flex items-center space-x-2 text-gold/70">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-light">Elite Community</span>
              </div>
              <div className="w-px h-4 bg-gold/30" />
              <div className="flex items-center space-x-2 text-gold/70">
                <Star className="w-4 h-4" />
                <span className="text-sm font-light">Exclusive Benefits</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
