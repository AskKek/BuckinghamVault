"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Shield, Target, Globe, Heart, Lock, Star, Sparkles, Crown } from "lucide-react"
import { SectionWrapper } from "../shared/SectionWrapper"
import { SectionHeader } from "../shared/SectionHeader"
import Image from "next/image"
import { 
  useDeviceDetection,
  staggerChildVariants,
  prefersReducedMotion,
  generateDeterministicParticles 
} from "@/lib/animation-utils"
import { 
  announceToScreenReader,
  generateAriaLabel,
  focusRingClasses 
} from "@/lib/accessibility-utils"

interface Differentiator {
  title: string
  description: string
}

interface DifferentiatorsSectionProps {
  differentiators: Differentiator[]
}

const differentiatorIcons = [Shield, Target, Globe, Heart, Lock]

export function DifferentiatorsSection({ differentiators }: DifferentiatorsSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { isMobile, isMobileOrTablet } = useDeviceDetection()
  const [isClient, setIsClient] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
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
    // Announce differentiators section load for screen readers
    if (isInView) {
      announceToScreenReader(`Differentiators section loaded showcasing ${differentiators.length} key advantages`, 'polite')
    }
  }, [isInView, differentiators.length])

  useEffect(() => {
    setIsClient(true)
    // Enhanced floating particles for premium atmosphere - using deterministic values
    setBackgroundParticles(generateDeterministicParticles(20, 1001)) // Using seed 1001 for differentiators section
  }, [])

  return (
    <section 
      ref={ref} 
      className="py-20 md:py-32 bg-gradient-to-b from-navy via-navy-dark to-navy-light relative overflow-hidden"
      role="region"
      aria-labelledby="differentiators-heading"
    >
      {/* Enhanced Premium Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-dark to-navy-light" />

        {/* Enhanced floating orbs with sophisticated movement */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 md:w-[600px] h-96 md:h-[600px] bg-gradient-to-r from-gold/15 via-gold/8 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.6, 0.2],
            x: [0, 80, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 md:w-[500px] h-80 md:h-[500px] bg-gradient-to-l from-gold/12 via-gold/6 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.45, 0.15],
            x: [0, -70, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 16,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 6,
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
                  scale: [0.6, 1.2, 0.6],
                  y: [0, -40, 0],
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
                  className="text-gold/25" 
                  style={{ 
                    width: `${particle.size * 10}px`, 
                    height: `${particle.size * 10}px` 
                  }}
                  aria-hidden="true" 
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Enhanced Digital Wallet Hero Image Integration */}
        <div className="absolute inset-0 opacity-25 md:opacity-35">
          {/* Primary Digital Wallet Image - Elegantly Positioned */}
          <div className="absolute top-1/2 right-1/6 transform -translate-y-1/2 w-[50%] md:w-[40%] lg:w-[35%] h-[60%] md:h-[50%] lg:h-[45%]">
            <Image
              src="/images/core-services-digital-wallet.png"
              alt="Advanced digital wallet and cryptocurrency management technology"
              fill
              className="object-contain filter brightness-120 contrast-115 saturate-110"
              style={{
                filter: 'brightness(1.2) contrast(1.15) saturate(1.1) hue-rotate(15deg) drop-shadow(0 15px 35px rgba(215, 147, 9, 0.2))'
              }}
              loading="lazy"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 40vw, 35vw"
            />
          </div>
          
          {/* Complementary visual enhancements */}
          <div className="absolute inset-0 bg-gradient-to-br from-navy/50 via-transparent to-navy/30" />
          <div className="absolute inset-0 bg-gradient-to-tl from-gold/8 via-transparent to-gold/12 mix-blend-overlay" />
        </div>
      </div>

      <div className="relative z-20 max-w-6xl mx-auto px-4 md:px-6">
        <motion.div
          className="relative z-10"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: { 
                duration: 0.8,
                staggerChildren: 0.15,
                delayChildren: 0.3
              }
            }
          }}
        >
          <div className="space-y-16">
            {/* Enhanced Premium Section Header */}
            <motion.div
              className="text-center space-y-8"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            >
              {/* Crown Icon with Enhanced Styling */}
              <motion.div
                className="flex justify-center mb-6"
                initial={{ scale: 0, rotate: -180 }}
                animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                transition={{ duration: 1.2, delay: 0.4, type: "spring", bounce: 0.3 }}
              >
                <div className="relative group">
                  <div className="absolute inset-0 bg-gold/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                  <div className="relative bg-gradient-to-br from-navy-light/90 to-navy-dark/90 backdrop-blur-xl border border-gold/20 rounded-2xl p-4 group-hover:border-gold/40 transition-all duration-500">
                    <Star className="w-8 h-8 text-gold group-hover:text-gold/90 transition-colors duration-300" />
                  </div>
                </div>
              </motion.div>

              <motion.h2 
                id="differentiators-heading"
                className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-light text-white mb-8 md:mb-12 tracking-tight leading-[0.88]"
                style={{ 
                  letterSpacing: '-0.025em', 
                  lineHeight: '0.88',
                  textShadow: '0 4px 25px rgba(0,0,0,0.6), 0 8px 50px rgba(215,147,9,0.12)'
                }}
                whileHover={
                  !isMobileOrTablet ? {
                    scale: 1.008,
                    textShadow: "0 4px 35px rgba(0,0,0,0.7), 0 8px 70px rgba(215,147,9,0.2)"
                  } : {}
                }
              >
                <span className="bg-gradient-to-br from-white via-white to-gold/20 bg-clip-text text-transparent">
                  Why The Buckingham Vault Is{' '}
                </span>
                <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent font-semibold">
                  Different
                </span>
              </motion.h2>
              
              <motion.p 
                className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white/80 font-light max-w-5xl mx-auto leading-[1.5] px-6 md:px-8"
                style={{
                  lineHeight: '1.5',
                  letterSpacing: '0.002em',
                  textShadow: '0 2px 12px rgba(0,0,0,0.4)'
                }}
                whileHover={
                  !isMobileOrTablet ? {
                    color: "rgba(255, 255, 255, 0.92)",
                    scale: 1.003,
                    textShadow: "0 2px 18px rgba(0,0,0,0.5), 0 0 25px rgba(255,255,255,0.08)"
                  } : {}
                }
              >
                Our distinctive advantages in sovereign wealth management
              </motion.p>

              {/* Enhanced royal decorative line */}
              <motion.div
                className="flex items-center justify-center space-x-6 md:space-x-8 mt-10 md:mt-12 lg:mt-16"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                <motion.div 
                  className="h-[2px] w-24 md:w-32 lg:w-40 bg-gradient-to-r from-transparent via-gold/60 to-gold/40"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 1.2, delay: 0.8 }}
                />
                <motion.div
                  className="relative"
                  whileHover={{ 
                    rotate: 180,
                    scale: 1.3,
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-gold drop-shadow-lg" />
                  <div className="absolute inset-0 w-6 h-6 md:w-8 md:h-8 bg-gold/20 blur-md rounded-full" />
                </motion.div>
                <motion.div 
                  className="h-[2px] w-24 md:w-32 lg:w-40 bg-gradient-to-l from-transparent via-gold/60 to-gold/40"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 1.2, delay: 0.8 }}
                />
              </motion.div>
            </motion.div>

            {/* Enhanced Premium Differentiators List */}
            <motion.div 
              className="space-y-16 md:space-y-20"
              role="list"
              aria-label="Key differentiators of The Buckingham Vault"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              {differentiators.map((diff, index) => {
                const Icon = differentiatorIcons[index] || Shield
                const isEven = index % 2 === 0
                const diffId = `differentiator-${index}`
                const isHovered = hoveredItem === index
                
                return (
                  <motion.div
                    key={index}
                    className={`group relative flex items-center gap-8 md:gap-16 ${!isEven ? "md:flex-row-reverse" : ""}`}
                    initial={{ opacity: 0, y: 40, x: isEven ? -40 : 40 }}
                    animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: 40, x: isEven ? -40 : 40 }}
                    transition={{ 
                      duration: 1, 
                      delay: 1.2 + index * 0.2,
                      type: "spring",
                      bounce: 0.3
                    }}
                    onHoverStart={() => setHoveredItem(index)}
                    onHoverEnd={() => setHoveredItem(null)}
                    role="listitem"
                    id={diffId}
                    aria-labelledby={`${diffId}-title`}
                  >
                    {/* Enhanced background glow */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-gold/8 via-gold/4 to-gold/8 rounded-3xl blur-2xl opacity-0"
                      animate={{
                        opacity: isHovered ? 1 : 0,
                        scale: isHovered ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.6 }}
                    />

                    {/* Enhanced Premium Icon Container */}
                    <motion.div
                      className="flex-shrink-0 relative"
                      animate={{
                        scale: isHovered ? 1.1 : 1,
                        rotate: isHovered ? (isEven ? 5 : -5) : 0,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {/* Premium icon background glow */}
                      <motion.div
                        className="absolute inset-0 bg-gold/20 rounded-3xl blur-xl"
                        animate={{
                          scale: isHovered ? 1.3 : 1,
                          opacity: isHovered ? 0.8 : 0.4,
                        }}
                        transition={{ duration: 0.4 }}
                      />
                      
                      <div 
                        className="relative w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-navy-light/60 to-navy-dark/80 backdrop-blur-xl border border-gold/20 rounded-3xl flex items-center justify-center group-hover:border-gold/40 transition-all duration-500 overflow-hidden"
                        tabIndex={0}
                        role="img"
                        aria-label={generateAriaLabel('icon', `${diff.title} icon`)}
                      >
                        {/* Enhanced gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-gold/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <Icon 
                          className="relative z-10 w-12 h-12 md:w-16 md:h-16 text-gold group-hover:text-gold-light transition-all duration-300" 
                          aria-hidden="true"
                        />
                      </div>
                    </motion.div>

                    {/* Enhanced Premium Content */}
                    <motion.div
                      className="flex-1 space-y-6"
                      animate={{
                        x: isHovered ? (isEven ? 8 : -8) : 0,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <motion.h3
                        id={`${diffId}-title`}
                        className="text-3xl md:text-4xl lg:text-5xl font-light text-white leading-tight md:group-hover:text-gold transition-colors duration-500"
                        style={{ letterSpacing: '-0.02em', lineHeight: '0.95' }}
                        animate={{
                          scale: isHovered ? 1.02 : 1,
                        }}
                        transition={{ type: "spring", stiffness: 300, duration: 0.3 }}
                      >
                        {diff.title}
                      </motion.h3>
                      
                      <motion.p
                        className="text-xl md:text-2xl text-white/70 font-light leading-relaxed group-hover:text-white/90 transition-colors duration-500"
                        style={{ letterSpacing: '-0.01em' }}
                        animate={{
                          scale: isHovered ? 1.01 : 1,
                        }}
                        transition={{ type: "spring", stiffness: 300, duration: 0.3 }}
                        role="definition"
                        aria-describedby={`${diffId}-title`}
                      >
                        {diff.description}
                      </motion.p>

                      {/* Enhanced decorative accent line */}
                      <motion.div
                        className="h-px bg-gradient-to-r from-gold/40 via-gold/80 to-gold/40 max-w-md"
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                        transition={{ 
                          duration: 1.2, 
                          delay: 1.6 + index * 0.2,
                          ease: "easeOut"
                        }}
                        style={{ originX: isEven ? 0 : 1 }}
                        aria-hidden="true"
                      />

                      {/* Premium trust indicators */}
                      <motion.div
                        className="flex items-center space-x-4 text-gold/60 opacity-0 group-hover:opacity-100 transition-all duration-500"
                        initial={{ opacity: 0, y: 10 }}
                        animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      >
                        <div className="flex space-x-1">
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-1.5 h-1.5 bg-gold rounded-full"
                              animate={{
                                scale: isHovered ? [1, 1.3, 1] : 1,
                                opacity: isHovered ? [0.6, 1, 0.6] : 0.6,
                              }}
                              transition={{
                                duration: 1.5,
                                delay: i * 0.1,
                                repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-light">Sovereign Excellence</span>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Enhanced sovereign conclusion */}
            <motion.div
              className="text-center pt-12 md:pt-16 lg:pt-20"
              initial={{ opacity: 0, y: 35 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
              transition={{ 
                duration: prefersReducedMotion() ? 0.1 : 0.8, 
                delay: prefersReducedMotion() ? 0 : 1.8 
              }}
            >
              <motion.p 
                className="text-lg md:text-xl lg:text-2xl text-gold/75 font-serif font-light max-w-4xl mx-auto leading-[1.7] italic px-6 md:px-8"
                style={{
                  fontVariant: 'small-caps',
                  letterSpacing: '0.01em',
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                }}
                role="note"
                aria-label="Summary statement about our sovereign differentiation"
                whileHover={
                  !isMobileOrTablet ? {
                    color: "rgba(215, 147, 9, 0.9)",
                    scale: 1.005,
                    textShadow: "0 2px 15px rgba(0,0,0,0.4), 0 0 20px rgba(215,147,9,0.2)"
                  } : {}
                }
              >
                "Setting the gold standard in sovereign wealth management through innovation, trust, and uncompromising excellence"
              </motion.p>

              {/* Enhanced royal decorative dots */}
              <motion.div 
                className="flex items-center justify-center space-x-5 md:space-x-6 pt-8 md:pt-10"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8, delay: 2.0 }}
              >
                <motion.div 
                  className="w-3 h-3 bg-gradient-to-br from-gold to-gold-light rounded-full shadow-lg"
                  whileHover={{ 
                    scale: 1.6, 
                    boxShadow: "0 0 20px rgba(215, 147, 9, 0.4)",
                    background: "linear-gradient(135deg, #F4B942, #D79309)"
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                />
                <motion.div 
                  className="w-2 h-2 bg-gradient-to-br from-gold/70 to-gold-light/70 rounded-full shadow-md"
                  whileHover={{ 
                    scale: 1.4, 
                    boxShadow: "0 0 15px rgba(215, 147, 9, 0.3)",
                    background: "linear-gradient(135deg, #F4B942, #D79309)"
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                />
                <motion.div 
                  className="w-3 h-3 bg-gradient-to-br from-gold to-gold-light rounded-full shadow-lg"
                  whileHover={{ 
                    scale: 1.6, 
                    boxShadow: "0 0 20px rgba(215, 147, 9, 0.4)",
                    background: "linear-gradient(135deg, #F4B942, #D79309)"
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
