"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { 
  Building2, 
  TrendingUp, 
  Shield, 
  Sparkles, 
  ChevronRight, 
  Crown,
  Zap,
  Star,
  Globe,
  Vault,
  Scale,
  Sprout,
  Search
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { useDeviceDetection, prefersReducedMotion, generateDeterministicParticles } from "@/lib/animation-utils"

interface Service {
  icon: string
  title: string
  description: string
  features: string[]
}

interface ServicesSectionProps {
  services: Service[]
}

const serviceIcons = {
  Building2,
  TrendingUp,
  Shield,
  Crown,
  Zap,
  Safe: Vault,
  Scale,
  Sprout,
  Search,
}

export function LuxuryServicesSection({ services }: ServicesSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const { isMobileOrTablet } = useDeviceDetection()
  const [isClient, setIsClient] = useState(false)
  const [backgroundParticles, setBackgroundParticles] = useState<Array<{
    id: number;
    left: number;
    top: number;
    delay: number;
    duration: number;
    size: number;
  }>>([])

  useEffect(() => {
    setIsClient(true)
    // Enhanced floating particles for premium atmosphere - using deterministic values
    setBackgroundParticles(generateDeterministicParticles(12, 401)) // Using seed 401 for luxury services section
  }, [])

  return (
    <section 
      ref={ref} 
      className="py-20 md:py-32 bg-gradient-to-b from-navy via-navy-dark to-navy relative overflow-hidden"
      role="region"
      aria-labelledby="services-heading"
    >
      {/* Enhanced Premium Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-navy-light" />

        {/* Enhanced floating orbs with sophisticated movement */}
        <motion.div
          className="absolute top-1/6 left-1/6 w-96 md:w-[500px] h-96 md:h-[500px] bg-gradient-to-r from-gold/20 via-gold/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.6, 0.2],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute bottom-1/6 right-1/6 w-80 md:w-[400px] h-80 md:h-[400px] bg-gradient-to-l from-gold/15 via-gold/8 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.45, 0.15],
            x: [0, -40, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 3,
          }}
        />

        {/* Enhanced Core Services Hero Image Integration */}
        <div className="absolute inset-0 opacity-15 md:opacity-22">
          {/* Primary Legacy Finance Image - Elegantly Blended */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-[60%] lg:w-[50%] h-[80%] md:h-[60%] lg:h-[50%]">
            <Image
              src="/images/core-services-legacy-finance.png"
              alt="Sophisticated legacy finance integration with modern digital asset management"
              fill
              className="object-contain filter brightness-120 contrast-110 sepia-[0.08] saturate-105"
              style={{
                filter: 'brightness(1.2) contrast(1.1) sepia(0.08) saturate(1.05) drop-shadow(0 15px 30px rgba(215, 147, 9, 0.1))'
              }}
              priority
              sizes="(max-width: 768px) 80vw, (max-width: 1200px) 60vw, 50vw"
            />
          </div>
          
          {/* Refined overlay for seamless integration */}
          <div className="absolute inset-0 bg-gradient-to-br from-navy/70 via-transparent to-navy/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-gold/3 via-transparent to-gold/5 mix-blend-overlay" />
        </div>

        {/* Premium floating particles - desktop only */}
        {isClient && !prefersReducedMotion() && !isMobileOrTablet && (
          <div className="absolute inset-0 pointer-events-none">
            {backgroundParticles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute"
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                }}
                animate={{
                  opacity: [0.1, 0.6, 0.1],
                  scale: [0.5, 1, 0.5],
                  y: [0, -30, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: particle.delay,
                  ease: "easeInOut",
                }}
              >
                <Star 
                  className="text-gold/40" 
                  style={{ 
                    width: `${particle.size}px`, 
                    height: `${particle.size}px` 
                  }} 
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="relative z-20 max-w-8xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-20 md:space-y-24"
        >
          {/* Enhanced Premium Section Header */}
          <div className="text-center space-y-8 md:space-y-12">
            {/* Premium decorative element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center space-x-6 md:space-x-8 mb-8"
            >
              <motion.div 
                className="h-[2px] w-24 md:w-32 bg-gradient-to-r from-transparent via-gold to-gold/60"
                whileHover={{ width: !isMobileOrTablet ? '160px' : 'auto' }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                whileHover={{ 
                  rotate: 180,
                  scale: 1.2,
                  color: '#F4B942'
                }}
                transition={{ duration: 0.6 }}
              >
                <Crown className="w-8 h-8 md:w-10 md:h-10 text-gold" />
              </motion.div>
              <motion.div 
                className="h-[2px] w-24 md:w-32 bg-gradient-to-l from-transparent via-gold to-gold/60"
                whileHover={{ width: !isMobileOrTablet ? '160px' : 'auto' }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            {/* Enhanced Royal Main Title */}
            <motion.h2
              id="services-heading"
              className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold bg-gradient-to-br from-white via-gold/25 to-white bg-clip-text text-transparent mb-10 md:mb-12"
              style={{
                letterSpacing: '-0.025em',
                lineHeight: '0.95',
                textShadow: '0 4px 25px rgba(0,0,0,0.6), 0 8px 50px rgba(215,147,9,0.15)'
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={
                !isMobileOrTablet ? {
                  scale: 1.015,
                  textShadow: "0 4px 35px rgba(0,0,0,0.7), 0 8px 70px rgba(215,147,9,0.25)"
                } : {}
              }
            >
              Our Core Services
            </motion.h2>

            {/* Enhanced sovereign description */}
            <motion.p
              className="text-xl md:text-3xl lg:text-4xl xl:text-5xl text-white/85 font-light max-w-6xl mx-auto leading-[1.4] px-6 md:px-8"
              style={{ 
                letterSpacing: '-0.005em',
                lineHeight: '1.4',
                textShadow: '0 2px 15px rgba(0,0,0,0.4)'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={
                !isMobileOrTablet ? {
                  color: "rgba(255, 255, 255, 0.95)",
                  scale: 1.005,
                  textShadow: "0 2px 20px rgba(0,0,0,0.5), 0 0 30px rgba(255,255,255,0.1)"
                } : {}
              }
            >
              Six pillars of excellence serving the world's most discerning wealth creators
            </motion.p>

            {/* Enhanced premium subtitle */}
            <motion.p
              className="text-lg md:text-xl lg:text-2xl text-gold/75 font-serif font-light max-w-4xl mx-auto leading-[1.7] italic px-6 md:px-8"
              style={{
                fontVariant: 'small-caps',
                letterSpacing: '0.01em',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              whileHover={
                !isMobileOrTablet ? {
                  color: "rgba(215, 147, 9, 0.9)",
                  scale: 1.005,
                  textShadow: "0 2px 15px rgba(0,0,0,0.4), 0 0 20px rgba(215,147,9,0.2)"
                } : {}
              }
            >
              Crafted for sovereign wealth funds, governments, and institutional investors
            </motion.p>
          </div>

          {/* Enhanced Premium Services Grid */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10 max-w-7xl w-full">
              {services.map((service, index) => {
                const Icon = serviceIcons[service.icon as keyof typeof serviceIcons] || Shield
                const isHovered = hoveredCard === index

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 60 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
                    transition={{
                      duration: 0.8,
                      delay: 1.0 + index * 0.15,
                      ease: "easeOut",
                    }}
                    className={`${index === 4 ? "md:col-span-2 xl:col-span-1 xl:col-start-2" : ""} group`}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    whileHover={
                      !isMobileOrTablet ? {
                        y: -8,
                        transition: { type: "spring", stiffness: 300, damping: 25 }
                      } : {}
                    }
                  >
                    <Card className="relative h-full cursor-pointer overflow-hidden touch-manipulation transition-all duration-500">
                      {/* Enhanced glass morphism background - more transparent to show legacy finance image */}
                      <div className="absolute inset-0 bg-gradient-to-br from-navy/40 via-navy/55 to-navy-dark/65 backdrop-blur-lg" />
                      
                      {/* Premium border with enhanced animation */}
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: isHovered
                            ? "linear-gradient(135deg, rgba(215, 147, 9, 0.3), rgba(215, 147, 9, 0.15), rgba(215, 147, 9, 0.3))"
                            : "linear-gradient(135deg, rgba(215, 147, 9, 0.1), rgba(215, 147, 9, 0.05), rgba(215, 147, 9, 0.1))",
                          padding: "2px",
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-navy/45 via-navy/60 to-navy-dark/70 rounded-xl backdrop-blur-md" />
                      </motion.div>

                      {/* Enhanced hover glow effect - adjusted for transparency */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-gold/6 via-transparent to-gold/6 opacity-0 group-hover:opacity-100 rounded-xl"
                        transition={{ duration: 0.5 }}
                      />

                      {/* Enhanced outer glow on hover */}
                      <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.5 }}
                      />

                      <CardContent className="relative z-10 p-8 md:p-10 lg:p-12">
                        <div className="space-y-8 md:space-y-10">
                          {/* Premium Icon with enhanced effects */}
                          <motion.div
                            className="relative"
                            whileHover={{ 
                              scale: !isMobileOrTablet ? 1.1 : 1,
                              transition: { type: "spring", stiffness: 300 }
                            }}
                          >
                            <div className="w-18 h-18 md:w-22 md:h-22 lg:w-24 lg:h-24 glass-morphism rounded-2xl flex items-center justify-center group-hover:premium-glow transition-all duration-500 border border-gold/20 group-hover:border-gold/40">
                              <Icon className="w-9 h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 text-gold group-hover:text-gold-light transition-colors duration-300" />
                            </div>

                            {/* Enhanced floating particles */}
                            {isHovered && !isMobileOrTablet && (
                              <>
                                {[...Array(8)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute w-1.5 h-1.5 bg-gold/70 rounded-full"
                                    style={{
                                      left: `${Math.random() * 100}%`,
                                      top: `${Math.random() * 100}%`,
                                    }}
                                    animate={{
                                      y: [-30, -60],
                                      opacity: [0, 1, 0],
                                      scale: [0, 1.2, 0],
                                    }}
                                    transition={{
                                      duration: 2.5,
                                      repeat: Number.POSITIVE_INFINITY,
                                      delay: i * 0.15,
                                      ease: "easeOut",
                                    }}
                                  />
                                ))}
                              </>
                            )}
                          </motion.div>

                          {/* Enhanced Premium Title */}
                          <motion.h3
                            className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-white group-hover:text-gradient transition-all duration-300"
                            style={{ 
                              letterSpacing: '-0.01em',
                              lineHeight: '1.2'
                            }}
                            whileHover={{ 
                              x: !isMobileOrTablet ? 5 : 0,
                              transition: { type: "spring", stiffness: 400 }
                            }}
                          >
                            {service.title}
                          </motion.h3>

                          {/* Enhanced Description */}
                          <p className="text-base md:text-lg lg:text-xl text-white/75 font-sans leading-relaxed group-hover:text-white/95 transition-colors duration-300 font-light">
                            {service.description}
                          </p>

                          {/* Enhanced Premium Features List */}
                          <ul className="space-y-4 md:space-y-5">
                            {service.features.map((feature, featureIndex) => (
                              <motion.li
                                key={featureIndex}
                                className="flex items-start space-x-4 group/item"
                                initial={{ opacity: 0, x: -20 }}
                                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                transition={{
                                  duration: 0.6,
                                  delay: 1.4 + index * 0.1 + featureIndex * 0.08,
                                }}
                                whileHover={
                                  !isMobileOrTablet ? {
                                    x: 5,
                                    transition: { type: "spring", stiffness: 400 }
                                  } : {}
                                }
                              >
                                <motion.div
                                  className="flex-shrink-0 mt-1.5"
                                  whileHover={{ 
                                    scale: !isMobileOrTablet ? 1.3 : 1,
                                    rotate: !isMobileOrTablet ? 90 : 0,
                                    transition: { type: "spring", stiffness: 400 }
                                  }}
                                >
                                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gold group-hover/item:text-gold-light transition-colors duration-200" />
                                </motion.div>
                                <span className="text-white/80 font-sans leading-relaxed group-hover/item:text-white transition-colors duration-200 text-sm md:text-base">
                                  {feature}
                                </span>
                              </motion.li>
                            ))}
                          </ul>

                          {/* Enhanced card footer decoration */}
                          <motion.div
                            className="pt-6 mt-8 border-t border-gold/20 group-hover:border-gold/40 transition-colors duration-300"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                            transition={{ 
                              duration: 0.5, 
                              delay: 1.6 + index * 0.1 
                            }}
                          >
                            <div className="flex items-center justify-center space-x-3">
                              <motion.div 
                                className="w-2 h-2 bg-gold/60 rounded-full group-hover:bg-gold transition-colors duration-300"
                                whileHover={{ scale: 1.5 }}
                              />
                              <motion.div 
                                className="w-1.5 h-1.5 bg-gold/40 rounded-full group-hover:bg-gold/70 transition-colors duration-300"
                                whileHover={{ scale: 1.3 }}
                              />
                              <motion.div 
                                className="w-2 h-2 bg-gold/60 rounded-full group-hover:bg-gold transition-colors duration-300"
                                whileHover={{ scale: 1.5 }}
                              />
                            </div>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Enhanced Trust Statement */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 2.0 }}
            className="text-center pt-12 md:pt-16"
          >
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-lg md:text-xl text-white/90 font-sans font-light italic leading-relaxed">
                "Each service is meticulously crafted to meet the exacting standards of institutional investors and sovereign entities"
              </p>
              
              {/* Service excellence indicators */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 pt-6">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gold/70" />
                  <span className="text-sm text-white/70">Global Infrastructure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-gold/70" />
                  <span className="text-sm text-white/70">Institutional Security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Crown className="w-4 h-4 text-gold/70" />
                  <span className="text-sm text-white/70">Sovereign Grade Service</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
