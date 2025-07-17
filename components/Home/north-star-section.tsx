"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Quote, Star, Sparkles, Crown } from "lucide-react"
import { useDeviceDetection, prefersReducedMotion, generateDeterministicParticles } from "@/lib/animation-utils"

interface NorthStarSectionProps {
  quote: string
}

export function NorthStarSection({ quote }: NorthStarSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { isMobileOrTablet } = useDeviceDetection()
  const [isClient, setIsClient] = useState(false)
  const [hoveredQuote, setHoveredQuote] = useState(false)
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
    setBackgroundParticles(generateDeterministicParticles(16, 501)) // Using seed 501 for north star section
  }, [])

  return (
    <section 
      ref={ref} 
      className="py-24 md:py-40 bg-gradient-to-b from-navy-light via-navy to-navy-dark relative overflow-hidden"
      role="region"
      aria-labelledby="north-star-heading"
    >
      {/* Enhanced Premium Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-light via-navy to-navy-dark" />

        {/* Enhanced central orb with sophisticated movement */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-gradient-radial from-gold/25 via-gold/8 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.8, 0.3],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Additional floating orbs */}
        <motion.div
          className="absolute top-1/6 left-1/6 w-80 md:w-96 h-80 md:h-96 bg-gradient-to-r from-gold/15 via-gold/8 to-transparent rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2],
            x: [0, 60, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 3,
          }}
        />

        <motion.div
          className="absolute bottom-1/6 right-1/6 w-64 md:w-80 h-64 md:h-80 bg-gradient-to-l from-gold/12 via-gold/6 to-transparent rounded-full blur-2xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.15, 0.4, 0.15],
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 22,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 8,
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
                  opacity: [particle.opacity * 0.5, particle.opacity, particle.opacity * 0.5],
                  scale: [0.5, 1.3, 0.5],
                  y: [0, -50, 0],
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
                  className="text-gold/20" 
                  style={{ 
                    width: `${particle.size * 12}px`, 
                    height: `${particle.size * 12}px` 
                  }}
                  aria-hidden="true" 
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="space-y-12 md:space-y-16"
        >
          {/* Enhanced Quote Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0, rotate: -180 }}
            transition={{ duration: 1.5, delay: 0.3, type: "spring", bounce: 0.4 }}
            className="flex justify-center"
          >
            <div className="relative group">
              {/* Enhanced background glow */}
              <div className="absolute inset-0 bg-gold/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700" />
              
              <motion.div 
                className="relative w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-navy-light/80 to-navy-dark/90 backdrop-blur-xl border border-gold/30 rounded-3xl flex items-center justify-center group-hover:border-gold/50 transition-all duration-500"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                {/* Enhanced gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/15 via-transparent to-gold/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <Quote className="relative z-10 w-10 h-10 md:w-14 md:h-14 text-gold group-hover:text-gold-light transition-colors duration-300" />
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Section Title */}
          <motion.h2
            id="north-star-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-light text-gold mb-8 tracking-tight"
            style={{ letterSpacing: '-0.02em', lineHeight: '0.9' }}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Our North{' '}
            <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent font-medium">
              Star
            </span>
          </motion.h2>

          {/* Enhanced Premium Quote Container */}
          <motion.div
            className="relative group"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 1.2, delay: 0.8, type: "spring", bounce: 0.2 }}
            onHoverStart={() => setHoveredQuote(true)}
            onHoverEnd={() => setHoveredQuote(false)}
          >
            {/* Enhanced background glow */}
            <motion.div
              className="absolute -inset-8 bg-gradient-to-r from-gold/10 via-gold/5 to-gold/10 rounded-4xl blur-3xl opacity-0"
              animate={{
                opacity: hoveredQuote ? 1 : 0,
                scale: hoveredQuote ? 1.05 : 1,
              }}
              transition={{ duration: 0.6 }}
            />

            {/* Premium Quote Card */}
            <motion.div
              className="relative bg-gradient-to-br from-navy-light/30 to-navy-dark/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 lg:p-16 hover:border-gold/30 transition-all duration-700 overflow-hidden"
              animate={{
                y: hoveredQuote ? -5 : 0,
                scale: hoveredQuote ? 1.02 : 1,
              }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
            >
              {/* Enhanced gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Floating decorative elements */}
              <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                <Crown className="w-6 h-6 text-gold" />
              </div>
              
              <div className="absolute bottom-4 left-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                <Sparkles className="w-5 h-5 text-gold" />
              </div>

              {/* Enhanced Quote */}
              <motion.blockquote
                className="relative z-10 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-white leading-tight italic max-w-5xl mx-auto md:group-hover:text-gold/90 transition-colors duration-700"
                style={{ letterSpacing: '-0.02em', lineHeight: '1.2' }}
                animate={{
                  scale: hoveredQuote ? 1.02 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                "{quote}"
              </motion.blockquote>

              {/* Enhanced decorative accent */}
              <motion.div
                className="flex justify-center mt-8"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 1.5, delay: 1.2 }}
              >
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
              </motion.div>

              {/* Premium trust indicators */}
              <motion.div
                className="flex justify-center items-center space-x-6 mt-8 opacity-0 group-hover:opacity-100 transition-all duration-700"
                initial={{ opacity: 0, y: 20 }}
                animate={hoveredQuote ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-gold rounded-full"
                      animate={{
                        scale: hoveredQuote ? [1, 1.5, 1] : 1,
                        opacity: hoveredQuote ? [0.5, 1, 0.5] : 0.5,
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.1,
                        repeat: hoveredQuote ? Number.POSITIVE_INFINITY : 0,
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm font-light text-gold/80">Sovereign Standard</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
