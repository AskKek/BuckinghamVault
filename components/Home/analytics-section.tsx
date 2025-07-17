"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChartBig, ShieldCheck, Activity, Star, Sparkles, Crown, Zap } from "lucide-react"
import Link from "next/link"
import { DecorativeImage } from "@/components/ui/responsive-image"
import { useDeviceDetection, prefersReducedMotion, generateDeterministicParticles } from "@/lib/animation-utils"

export function AnalyticsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { isMobileOrTablet } = useDeviceDetection()
  const [isClient, setIsClient] = useState(false)
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
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
    setBackgroundParticles(generateDeterministicParticles(25, 201)) // Using seed 201 for analytics section
  }, [])

  const features = [
    {
      icon: Activity,
      title: "Real-Time Crypto Pulse",
      description: "Monitor major digital assets with our advanced ticker intelligence.",
    },
    {
      icon: BarChartBig,
      title: "Exchange Flow Analytics",
      description: "Track Bitcoin balances across major exchanges for deep liquidity insights.",
    },
    {
      icon: ShieldCheck,
      title: "Blockchain Forensics & Compliance",
      description: "Verify asset integrity with our advanced on-chain analysis engine.",
    },
  ]

  return (
    <section 
      ref={ref} 
      className="py-24 md:py-36 bg-gradient-to-br from-gold via-gold-light to-gold relative overflow-hidden"
      role="region"
      aria-labelledby="analytics-heading"
    >
      {/* Revolutionary Gold Background */}
      <div className="absolute inset-0">
        {/* Enhanced floating orbs with sophisticated movement */}
        <motion.div
          className="absolute top-1/6 right-1/6 w-[700px] md:w-[900px] h-[700px] md:h-[900px] bg-gradient-to-r from-navy/25 via-navy/15 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
            x: [0, -120, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 26,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute bottom-1/6 left-1/6 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-gradient-to-l from-navy/20 via-navy/12 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.25, 0.7, 0.25],
            x: [0, 100, 0],
            y: [0, -80, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 7,
          }}
        />

        {/* Enhanced Majestic Vault Door Background */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-15 md:opacity-25"
          initial={{ opacity: 0, scale: 1.2 }}
          animate={isInView ? { opacity: 0.25, scale: 1 } : { opacity: 0, scale: 1.2 }}
          transition={{ duration: 2.5, delay: 0.5, ease: "easeOut" }}
        >
          <div className="relative w-full h-full max-w-5xl">
            <DecorativeImage 
              src="/images/home-page-vault.png" 
              alt="Buckingham Vault Analytics Platform" 
              fill 
              className="object-contain filter brightness-125 contrast-110 sepia-[0.15] saturate-120"
              sizes="(max-width: 1024px) 80vw, 1200px"
            />
            
            {/* Enhanced golden overlay for brand consistency */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/8 via-transparent to-gold/12 mix-blend-overlay" />
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
                  scale: [0.4, 1.6, 0.4],
                  y: [0, -70, 0],
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
                  className="text-gold/15" 
                  style={{ 
                    width: `${particle.size * 16}px`, 
                    height: `${particle.size * 16}px` 
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
          className="space-y-20 md:space-y-28"
        >
          {/* Enhanced Premium Section Header */}
          <motion.div
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            {/* Analytics Icon with Enhanced Styling */}
            <motion.div
              className="flex justify-center mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
              transition={{ duration: 1.2, delay: 0.4, type: "spring", bounce: 0.3 }}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gold/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative bg-gradient-to-br from-navy-light/90 to-navy-dark/90 backdrop-blur-xl border border-gold/20 rounded-2xl p-4 group-hover:border-gold/40 transition-all duration-500">
                  <BarChartBig className="w-8 h-8 text-gold group-hover:text-gold/90 transition-colors duration-300" />
                </div>
              </div>
            </motion.div>

            <h2 
              id="analytics-heading"
              className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-8 tracking-tight leading-tight drop-shadow-lg"
              style={{ letterSpacing: '-0.02em', lineHeight: '0.9' }}
            >
              BV{' '}
              <span className="text-navy font-medium drop-shadow-sm">
                Analytics
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-navy/80 font-medium max-w-4xl mx-auto leading-relaxed">
              Digital Asset Intelligence & Blockchain Forensics for Sovereign Crypto Management
            </p>

            {/* Decorative line */}
            <motion.div
              className="flex justify-center mt-8"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-navy/50 to-transparent" />
            </motion.div>
          </motion.div>

          {/* Enhanced Premium Features Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              const isHovered = hoveredFeature === index
              
              return (
                <motion.div
                  key={index}
                  className="group relative"
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
                  transition={{ 
                    duration: 1, 
                    delay: 1.2 + index * 0.2,
                    type: "spring",
                    bounce: 0.3
                  }}
                  onHoverStart={() => setHoveredFeature(index)}
                  onHoverEnd={() => setHoveredFeature(null)}
                >
                  {/* Enhanced background glow */}
                  <motion.div
                    className="absolute -inset-3 bg-gradient-to-r from-gold/15 via-gold/8 to-gold/15 rounded-3xl blur-2xl opacity-0"
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      scale: isHovered ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.6 }}
                  />

                  {/* Royal Navy Feature Card on Gold */}
                  <motion.div
                    className="relative h-80 md:h-96 bg-gradient-to-br from-navy/95 to-navy-dark/98 backdrop-blur-xl border-2 border-gold/30 rounded-2xl p-8 md:p-10 hover:border-gold/60 transition-all duration-500 overflow-hidden text-center space-y-6 shadow-2xl"
                    animate={{
                      y: isHovered ? -12 : 0,
                      scale: isHovered ? 1.03 : 1,
                    }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                  >
                    {/* Enhanced gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-gold/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Enhanced Premium Icon */}
                    <motion.div
                      className="relative mx-auto"
                      animate={{
                        scale: isHovered ? 1.2 : 1,
                        rotate: isHovered ? 10 : 0,
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      {/* Premium icon background glow */}
                      <motion.div
                        className="absolute inset-0 bg-gold/30 rounded-3xl blur-xl"
                        animate={{
                          scale: isHovered ? 1.4 : 1,
                          opacity: isHovered ? 0.9 : 0.6,
                        }}
                        transition={{ duration: 0.4 }}
                      />
                      
                      <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-gold/20 to-gold/10 rounded-3xl flex items-center justify-center group-hover:from-gold/30 group-hover:to-gold/20 transition-all duration-300 mx-auto">
                        <Icon className="relative z-10 w-10 h-10 md:w-12 md:h-12 text-gold group-hover:text-gold-light transition-colors duration-300" />
                      </div>
                    </motion.div>

                    {/* Enhanced Premium Content */}
                    <motion.div
                      className="relative z-10 space-y-4"
                      animate={{
                        y: isHovered ? -5 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <h3 
                        className="text-xl md:text-2xl font-light text-white md:group-hover:text-gold transition-colors duration-500 leading-tight"
                        style={{ letterSpacing: '-0.01em' }}
                      >
                        {feature.title}
                      </h3>
                      
                      <p 
                        className="text-lg text-white/80 font-light leading-relaxed group-hover:text-white/95 transition-colors duration-500"
                        style={{ letterSpacing: '-0.005em' }}
                      >
                        {feature.description}
                      </p>

                      {/* Enhanced decorative element */}
                      <motion.div
                        className="mx-auto w-16 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100"
                        animate={{
                          scaleX: isHovered ? 1 : 0,
                          opacity: isHovered ? 1 : 0,
                        }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      />
                    </motion.div>

                    {/* Premium trust indicators */}
                    <motion.div
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-20 group-hover:opacity-60 transition-opacity duration-500"
                      initial={{ opacity: 0, y: 10 }}
                      animate={isHovered ? { opacity: 0.6, y: 0 } : { opacity: 0.2, y: 10 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 bg-gold rounded-full"
                          animate={{
                            scale: isHovered ? [1, 1.4, 1] : 1,
                            opacity: isHovered ? [0.6, 1, 0.6] : 0.6,
                          }}
                          transition={{
                            duration: 1.5,
                            delay: i * 0.1,
                            repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
                          }}
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Enhanced Premium CTA */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 1, delay: 2, type: "spring", bounce: 0.2 }}
          >
            <div className="relative group inline-block">
              {/* Enhanced button glow */}
              <div className="absolute -inset-3 bg-gradient-to-r from-gold/30 via-gold/20 to-gold/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              
              <Link href="/analytics" passHref>
                <Button
                  size="lg"
                  className="relative bg-gradient-to-r from-gold via-gold-light to-gold hover:from-gold-light hover:via-gold hover:to-gold-light text-navy font-semibold text-lg md:text-xl px-12 py-6 md:px-16 md:py-8 rounded-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gold/30 border-2 border-gold/20 hover:border-gold/40"
                  style={{ letterSpacing: '-0.01em' }}
                >
                  <BarChartBig className="mr-3 w-6 h-6 md:w-7 md:h-7" />
                  Launch Analytics Platform
                  <ArrowRight className="ml-3 w-6 h-6 md:w-7 md:h-7 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {/* Enhanced trust indicators */}
            <motion.div
              className="flex justify-center items-center space-x-8 mt-10 opacity-60"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 0.6, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 1, delay: 2.3 }}
            >
              <div className="flex items-center space-x-2 text-navy/80">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">Real-Time Intelligence</span>
              </div>
              <div className="w-px h-4 bg-navy/30" />
              <div className="flex items-center space-x-2 text-navy/80">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-sm font-medium">Advanced Grade</span>
              </div>
              <div className="w-px h-4 bg-navy/30" />
              <div className="flex items-center space-x-2 text-navy/80">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Advanced Forensics</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
