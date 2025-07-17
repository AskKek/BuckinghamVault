"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Building2, Crown, Globe, TrendingUp, Heart, Star, Sparkles, Shield } from "lucide-react"
import Image from "next/image"
import { SectionWrapper } from "../shared/SectionWrapper"
import { SectionHeader } from "../shared/SectionHeader"
import { AnimatedCard } from "../shared/AnimatedCard"
import { 
  useDeviceDetection,
  staggerChildVariants,
  prefersReducedMotion,
  generateDeterministicParticles
} from "@/lib/animation-utils"
import { 
  createImageAccessibilityProps,
  announceToScreenReader,
  generateAriaLabel 
} from "@/lib/accessibility-utils"

interface ClienteleSectionProps {
  clientele: string[]
}

const clienteleIcons = [Building2, Crown, Globe, TrendingUp, Heart]

export function ClienteleSection({ clientele }: ClienteleSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { isMobile, isMobileOrTablet } = useDeviceDetection()
  const [isClient, setIsClient] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
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
    // Announce clientele section load for screen readers
    if (isInView) {
      announceToScreenReader(`Clientele section loaded showcasing ${clientele.length} distinguished client categories`, 'polite')
    }
  }, [isInView, clientele.length])

  useEffect(() => {
    setIsClient(true)
    // Enhanced floating particles for premium atmosphere - using deterministic values
    setBackgroundParticles(generateDeterministicParticles(18, 123)) // Using seed 123 for consistency
  }, [])

  return (
    <section 
      ref={ref} 
      className="py-20 md:py-32 bg-gradient-to-b from-navy-dark via-navy to-navy-light relative overflow-hidden"
      role="region"
      aria-labelledby="clientele-heading"
    >
      {/* Enhanced Premium Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-navy-light" />

        {/* Enhanced floating orbs with sophisticated movement */}
        <motion.div
          className="absolute top-1/6 left-1/6 w-80 md:w-[500px] h-80 md:h-[500px] bg-gradient-to-r from-gold/20 via-gold/15 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.7, 0.3],
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
          className="absolute bottom-1/6 right-1/6 w-96 md:w-[600px] h-96 md:h-[600px] bg-gradient-to-l from-gold/15 via-gold/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2],
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

        {/* Enhanced Global Business Silhouettes */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-20 md:opacity-30"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={isInView ? { opacity: 0.3, scale: 1 } : { opacity: 0, scale: 1.1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
        >
          <div className="relative w-full h-full max-w-6xl">
            <Image 
              src="/images/who-we-serve.png" 
              {...createImageAccessibilityProps("Global business leaders and financial institutions", true)}
              fill 
              className="object-contain filter brightness-110 contrast-105 sepia-[0.1] saturate-110" 
              sizes="100vw"
              priority={false}
              loading="lazy"
            />
            
            {/* Enhanced golden overlay for brand consistency */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/8 mix-blend-overlay" />
          </div>
        </motion.div>

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
                  opacity: [particle.opacity * 0.3, particle.opacity, particle.opacity * 0.3],
                  scale: [0.5, 1, 0.5],
                  y: [0, -30, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: particle.delay,
                  ease: "easeInOut",
                }}
              >
                <Star 
                  className="text-gold/30" 
                  style={{ 
                    width: `${particle.size * 8}px`, 
                    height: `${particle.size * 8}px` 
                  }}
                  aria-hidden="true" 
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">

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
                staggerChildren: 0.1,
                delayChildren: 0.3
              }
            }
          }}
        >
          <div className="text-center space-y-16 md:space-y-24">
            {/* Enhanced Premium Section Header */}
            <motion.div
              className="relative"
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
                    <Crown className="w-8 h-8 text-gold group-hover:text-gold/90 transition-colors duration-300" />
                  </div>
                </div>
              </motion.div>

              <motion.h2 
                id="clientele-heading"
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
                  Who We{' '}
                </span>
                <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent font-semibold">
                  Serve
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
                Distinguished clientele across sovereign wealth and private capital
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

            {/* Enhanced Premium Clientele Grid - 2 Rows Layout */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <div className="max-w-7xl w-full space-y-12 md:space-y-16 lg:space-y-20">
                <h3 id="clientele-grid" className="sr-only">Distinguished Clientele Categories</h3>
                
                {/* Top Row - 3 Cards */}
                <div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10 xl:gap-12"
                  role="region"
                  aria-labelledby="clientele-grid"
                  aria-label="Top tier clientele categories"
                >
                  {clientele.slice(0, 3).map((client, index) => {
                    const Icon = clienteleIcons[index] || Shield
                    const cardId = `clientele-card-${index}`
                    const isHovered = hoveredCard === index
                    
                    return (
                      <motion.div
                        key={index}
                        className="group relative"
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
                        transition={{ 
                          duration: 0.8, 
                          delay: 0.8 + index * 0.1,
                          type: "spring",
                          bounce: 0.3
                        }}
                        onHoverStart={() => setHoveredCard(index)}
                        onHoverEnd={() => setHoveredCard(null)}
                        id={cardId}
                      >
                        {/* Enhanced background glow */}
                        <motion.div
                          className="absolute -inset-3 bg-gradient-to-r from-gold/15 via-gold/8 to-gold/15 rounded-3xl blur-2xl opacity-0"
                          animate={{
                            opacity: isHovered ? 1 : 0,
                            scale: isHovered ? 1.05 : 1,
                          }}
                          transition={{ duration: 0.5 }}
                        />

                        {/* Premium Card - Improved Size */}
                        <motion.div
                          className="relative min-h-[280px] md:min-h-[320px] lg:min-h-[360px] bg-gradient-to-br from-navy-light/40 to-navy-dark/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 lg:p-10 hover:border-gold/30 transition-all duration-500 overflow-hidden flex"
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
                          
                          {/* Premium content */}
                          <div className="relative z-10 flex flex-col items-center justify-center w-full text-center space-y-4 md:space-y-6 lg:space-y-8">
                            {/* Enhanced Icon - Optimized */}
                            <motion.div
                              className="relative flex-shrink-0"
                              animate={{
                                scale: isHovered ? 1.2 : 1,
                                rotate: isHovered ? 5 : 0,
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="absolute inset-0 bg-gold/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300" />
                              <div className="relative bg-gradient-to-br from-gold/20 to-gold/10 rounded-2xl p-3 md:p-4 lg:p-5 group-hover:from-gold/30 group-hover:to-gold/20 transition-all duration-300">
                                <Icon className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-gold group-hover:text-gold-light transition-colors duration-300" />
                              </div>
                            </motion.div>

                            {/* Enhanced Title - Better Text Wrapping */}
                            <h4 
                              className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium text-white md:group-hover:text-gold transition-colors duration-300 leading-snug px-2 flex-grow flex items-center justify-center"
                              style={{ letterSpacing: '-0.01em' }}
                            >
                              {client}
                            </h4>

                            {/* Enhanced decorative element */}
                            <motion.div
                              className="w-16 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100"
                              animate={{
                                scaleX: isHovered ? 1 : 0,
                                opacity: isHovered ? 1 : 0,
                              }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                            />

                            {/* Floating decorative dots */}
                            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                              {[...Array(3)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="w-1.5 h-1.5 bg-gold rounded-full"
                                  animate={{
                                    scale: isHovered ? [1, 1.5, 1] : 1,
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
                </div>

                {/* Bottom Row - 2 Cards Centered */}
                <div 
                  className="flex justify-center"
                  role="region"
                  aria-label="Additional clientele categories"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 xl:gap-12 max-w-5xl w-full">
                    {clientele.slice(3, 5).map((client, index) => {
                      const actualIndex = index + 3
                      const Icon = clienteleIcons[actualIndex] || Shield
                      const cardId = `clientele-card-${actualIndex}`
                      const isHovered = hoveredCard === actualIndex
                      
                      return (
                        <motion.div
                          key={actualIndex}
                          className="group relative"
                          initial={{ opacity: 0, y: 30, scale: 0.9 }}
                          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
                          transition={{ 
                            duration: 0.8, 
                            delay: 1.1 + index * 0.1,
                            type: "spring",
                            bounce: 0.3
                          }}
                          onHoverStart={() => setHoveredCard(actualIndex)}
                          onHoverEnd={() => setHoveredCard(null)}
                          id={cardId}
                        >
                          {/* Enhanced background glow */}
                          <motion.div
                            className="absolute -inset-3 bg-gradient-to-r from-gold/15 via-gold/8 to-gold/15 rounded-3xl blur-2xl opacity-0"
                            animate={{
                              opacity: isHovered ? 1 : 0,
                              scale: isHovered ? 1.05 : 1,
                            }}
                            transition={{ duration: 0.5 }}
                          />

                          {/* Premium Card - Improved Size */}
                          <motion.div
                            className="relative min-h-[280px] md:min-h-[320px] lg:min-h-[360px] bg-gradient-to-br from-navy-light/40 to-navy-dark/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 lg:p-10 hover:border-gold/30 transition-all duration-500 overflow-hidden flex"
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
                            
                            {/* Premium content */}
                            <div className="relative z-10 flex flex-col items-center justify-center w-full text-center space-y-4 md:space-y-6 lg:space-y-8">
                              {/* Enhanced Icon - Optimized */}
                              <motion.div
                                className="relative flex-shrink-0"
                                animate={{
                                  scale: isHovered ? 1.2 : 1,
                                  rotate: isHovered ? 5 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="absolute inset-0 bg-gold/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300" />
                                <div className="relative bg-gradient-to-br from-gold/20 to-gold/10 rounded-2xl p-3 md:p-4 lg:p-5 group-hover:from-gold/30 group-hover:to-gold/20 transition-all duration-300">
                                  <Icon className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-gold group-hover:text-gold-light transition-colors duration-300" />
                                </div>
                              </motion.div>

                              {/* Enhanced Title - Better Text Wrapping */}
                              <h4 
                                className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium text-white md:group-hover:text-gold transition-colors duration-300 leading-snug px-2 flex-grow flex items-center justify-center"
                                style={{ letterSpacing: '-0.01em' }}
                              >
                                {client}
                              </h4>

                              {/* Enhanced decorative element */}
                              <motion.div
                                className="w-16 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100"
                                animate={{
                                  scaleX: isHovered ? 1 : 0,
                                  opacity: isHovered ? 1 : 0,
                                }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                              />

                              {/* Floating decorative dots */}
                              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                                {[...Array(3)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="w-1.5 h-1.5 bg-gold rounded-full"
                                    animate={{
                                      scale: isHovered ? [1, 1.5, 1] : 1,
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
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced sovereign context with perfect spacing */}
            <motion.div
              className="text-center pt-8 md:pt-12 lg:pt-16"
              initial={{ opacity: 0, y: 35 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
              transition={{ duration: 0.8, delay: 1.5 }}
            >
              <motion.p 
                className="text-lg md:text-xl lg:text-2xl text-gold/75 font-serif font-light max-w-4xl mx-auto leading-[1.7] italic px-6 md:px-8"
                style={{
                  fontVariant: 'small-caps',
                  letterSpacing: '0.01em',
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                }}
                role="note"
                aria-label="Additional context about our distinguished clientele"
                whileHover={
                  !isMobileOrTablet ? {
                    color: "rgba(215, 147, 9, 0.9)",
                    scale: 1.005,
                    textShadow: "0 2px 15px rgba(0,0,0,0.4), 0 0 20px rgba(215,147,9,0.2)"
                  } : {}
                }
              >
                "Serving the world's most sophisticated wealth creators with unparalleled discretion and sovereign expertise"
              </motion.p>
              
              {/* Enhanced royal decorative dots */}
              <motion.div 
                className="flex items-center justify-center space-x-5 md:space-x-6 pt-8 md:pt-10"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8, delay: 1.8 }}
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
