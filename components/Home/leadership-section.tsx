"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Building2, Scale, Shield, Crown, Star, Globe, Award } from "lucide-react"
import { SectionWrapper } from "../shared/SectionWrapper"
import { SectionHeader } from "../shared/SectionHeader"
import { AnimatedCard } from "../shared/AnimatedCard"
import { 
  useDeviceDetection,
  staggerChildVariants 
} from "@/lib/animation-utils"
import { 
  announceToScreenReader 
} from "@/lib/accessibility-utils"

interface LeadershipPartner {
  name: string
  description: string
  icon: string
}

interface LeadershipSectionProps {
  partners: LeadershipPartner[]
}

const partnerIcons = {
  Building2,
  Scale,
  Shield,
}

export function LeadershipSection({ partners }: LeadershipSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { isMobile, isMobileOrTablet } = useDeviceDetection()
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
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
    // Announce leadership section load for screen readers
    if (isInView) {
      announceToScreenReader(`Leadership section loaded showcasing ${partners.length} distinguished partners`, 'polite')
    }
  }, [isInView, partners.length])

  useEffect(() => {
    setIsClient(true)
    // Enhanced floating particles for premium atmosphere
    setBackgroundParticles(Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 6 + Math.random() * 4,
      size: Math.random() * 2 + 1,
    })))
  }, [])

  return (
    <SectionWrapper
      id="leadership-section"
      title="Our Leadership"
      description="Distinguished partners providing unparalleled expertise and governance"
      backgroundType="gradient"
      showDecorative={!isMobileOrTablet}
      announceOnView={true}
      className="from-navy/90 to-navy-dark relative overflow-hidden"
    >
      <div ref={ref} className="max-w-6xl mx-auto px-4 md:px-8 relative">
        {/* Enhanced floating particles - desktop only */}
        {isClient && !isMobileOrTablet && (
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
                  opacity: [0.2, 0.7, 0.2],
                  scale: [0.5, 1, 0.5],
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
                <Star 
                  className="text-gold/30" 
                  style={{ 
                    width: `${particle.size * 6}px`, 
                    height: `${particle.size * 6}px` 
                  }} 
                />
              </motion.div>
            ))}
          </div>
        )}

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
                staggerChildren: 0.2,
                delayChildren: 0.3
              }
            }
          }}
        >
          <div className="space-y-16 md:space-y-20">
            {/* Enhanced Section Header */}
            <motion.div
              className="text-center space-y-8 md:space-y-12"
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 }
              }}
            >

              {/* Enhanced decorative divider */}
              <motion.div
                className="flex items-center justify-center space-x-6 md:space-x-8"
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 }
                }}
              >
                <motion.div 
                  className="h-[2px] w-20 md:w-28 bg-gradient-to-r from-transparent via-gold to-gold/60"
                  whileHover={{ width: !isMobileOrTablet ? '140px' : 'auto' }}
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
                  <Crown className="w-6 h-6 md:w-8 md:h-8 text-gold" />
                </motion.div>
                <motion.div 
                  className="h-[2px] w-20 md:w-28 bg-gradient-to-l from-transparent via-gold to-gold/60"
                  whileHover={{ width: !isMobileOrTablet ? '140px' : 'auto' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>

              {/* Enhanced Royal Main Title */}
              <motion.h2
                className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold bg-gradient-to-br from-white via-gold/25 to-white bg-clip-text text-transparent mb-10 md:mb-12"
                style={{
                  letterSpacing: '-0.025em',
                  lineHeight: '0.95',
                  textShadow: '0 4px 25px rgba(0,0,0,0.6), 0 8px 50px rgba(215,147,9,0.15)'
                }}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={
                  !isMobileOrTablet ? {
                    scale: 1.015,
                    textShadow: "0 4px 35px rgba(0,0,0,0.7), 0 8px 70px rgba(215,147,9,0.25)"
                  } : {}
                }
              >
                Our Leadership
              </motion.h2>

              {/* Enhanced sovereign subtitle */}
              <motion.p
                className="text-xl md:text-3xl lg:text-4xl xl:text-5xl text-white/85 font-light max-w-6xl mx-auto leading-[1.4] px-6 md:px-8"
                style={{ 
                  letterSpacing: '-0.005em',
                  lineHeight: '1.4',
                  textShadow: '0 2px 15px rgba(0,0,0,0.4)'
                }}
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={
                  !isMobileOrTablet ? {
                    color: "rgba(255, 255, 255, 0.95)",
                    scale: 1.005,
                    textShadow: "0 2px 20px rgba(0,0,0,0.5), 0 0 30px rgba(255,255,255,0.1)"
                  } : {}
                }
              >
                Distinguished partners providing unparalleled expertise and governance
              </motion.p>

              {/* Enhanced premium subtitle */}
              <motion.p
                className="text-lg md:text-xl lg:text-2xl text-gold/75 font-serif font-light max-w-4xl mx-auto leading-[1.7] italic px-6 md:px-8"
                style={{
                  fontVariant: 'small-caps',
                  letterSpacing: '0.01em',
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 }
                }}
                whileHover={
                  !isMobileOrTablet ? {
                    color: "rgba(215, 147, 9, 0.9)",
                    scale: 1.005,
                    textShadow: "0 2px 15px rgba(0,0,0,0.4), 0 0 20px rgba(215,147,9,0.2)"
                  } : {}
                }
              >
                Leading sovereign wealth management with decades of institutional excellence
              </motion.p>
            </motion.div>

            {/* Enhanced Partners Grid */}
            <div className={`grid grid-cols-1 gap-8 md:gap-10 place-items-center ${
              partners.length === 2 
                ? 'lg:grid-cols-2 max-w-4xl mx-auto' 
                : 'lg:grid-cols-3'
            }`}>
              {partners.map((partner, index) => {
                const Icon = partnerIcons[partner.icon as keyof typeof partnerIcons]
                const partnerId = `partner-${index}`
                const isHovered = hoveredCard === index
                
                return (
                  <motion.div
                    key={index}
                    variants={staggerChildVariants}
                    custom={index}
                    id={partnerId}
                    className="h-full group w-full max-w-md"
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    whileHover={
                      !isMobileOrTablet ? {
                        y: -10,
                        transition: { type: "spring", stiffness: 300, damping: 25 }
                      } : {}
                    }
                  >
                    <div className="relative h-full cursor-pointer overflow-hidden touch-manipulation">
                      {/* Enhanced glass morphism background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-navy/60 via-navy/80 to-navy-dark/90 backdrop-blur-xl rounded-2xl" />
                      
                      {/* Premium border with enhanced animation */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          background: isHovered
                            ? "linear-gradient(135deg, rgba(215, 147, 9, 0.4), rgba(215, 147, 9, 0.2), rgba(215, 147, 9, 0.4))"
                            : "linear-gradient(135deg, rgba(215, 147, 9, 0.15), rgba(215, 147, 9, 0.08), rgba(215, 147, 9, 0.15))",
                          padding: "2px",
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-navy/70 via-navy/85 to-navy-dark/90 rounded-2xl backdrop-blur-md" />
                      </motion.div>

                      {/* Enhanced hover glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-gold/8 via-transparent to-gold/8 opacity-0 group-hover:opacity-100 rounded-2xl"
                        transition={{ duration: 0.5 }}
                      />

                      {/* Enhanced outer glow on hover */}
                      <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.5 }}
                      />

                      <div className="relative z-10 p-8 md:p-10 lg:p-12 h-full flex flex-col">
                        <div className="space-y-8 md:space-y-10 flex-1">
                          {/* Premium Icon with enhanced effects */}
                          <motion.div
                            className="relative"
                            whileHover={{ 
                              scale: !isMobileOrTablet ? 1.1 : 1,
                              transition: { type: "spring", stiffness: 300 }
                            }}
                          >
                            <div className="w-20 h-20 md:w-24 md:h-24 glass-morphism rounded-2xl flex items-center justify-center group-hover:premium-glow transition-all duration-500 border border-gold/20 group-hover:border-gold/40">
                              <Icon className="w-10 h-10 md:w-12 md:h-12 text-gold group-hover:text-gold-light transition-colors duration-300" />
                            </div>

                            {/* Enhanced floating particles */}
                            {isHovered && !isMobileOrTablet && (
                              <>
                                {[...Array(6)].map((_, i) => (
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
                                      delay: i * 0.2,
                                      ease: "easeOut",
                                    }}
                                  />
                                ))}
                              </>
                            )}
                          </motion.div>

                          {/* Enhanced Partner Name */}
                          <motion.h3
                            className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white group-hover:text-gradient transition-all duration-300"
                            style={{ 
                              letterSpacing: '-0.01em',
                              lineHeight: '1.2'
                            }}
                            whileHover={{ 
                              x: !isMobileOrTablet ? 5 : 0,
                              transition: { type: "spring", stiffness: 400 }
                            }}
                            aria-labelledby={`${partnerId}-title`}
                          >
                            {partner.name}
                          </motion.h3>

                          {/* Enhanced Description */}
                          <p className="text-base md:text-lg lg:text-xl text-white/75 font-sans leading-relaxed group-hover:text-white/95 transition-colors duration-300 font-light flex-1">
                            {partner.description}
                          </p>
                        </div>

                        {/* Enhanced card footer decoration */}
                        <motion.div
                          className="pt-8 mt-8 border-t border-gold/20 group-hover:border-gold/40 transition-colors duration-300"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                          transition={{ 
                            duration: 0.5, 
                            delay: 0.6 + index * 0.2 
                          }}
                        >
                          <div className="flex items-center justify-between">
                            {/* Decorative dots */}
                            <div className="flex items-center space-x-3">
                              <motion.div 
                                className="w-2.5 h-2.5 bg-gold/60 rounded-full group-hover:bg-gold transition-colors duration-300"
                                whileHover={{ scale: 1.5 }}
                              />
                              <motion.div 
                                className="w-2 h-2 bg-gold/40 rounded-full group-hover:bg-gold/70 transition-colors duration-300"
                                whileHover={{ scale: 1.3 }}
                              />
                              <motion.div 
                                className="w-2.5 h-2.5 bg-gold/60 rounded-full group-hover:bg-gold transition-colors duration-300"
                                whileHover={{ scale: 1.5 }}
                              />
                            </div>

                            {/* Excellence indicator */}
                            <div className="flex items-center space-x-2">
                              <Globe className="w-4 h-4 text-gold/60 group-hover:text-gold transition-colors duration-300" />
                              <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors duration-300 font-sans">
                                Global Excellence
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Enhanced sovereign leadership statement */}
            <motion.div
              className="text-center pt-12 md:pt-16 lg:pt-20"
              initial={{ opacity: 0, y: 35 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
              transition={{ duration: 0.8, delay: 1.8 }}
            >
              <div className="max-w-6xl mx-auto space-y-10 md:space-y-12 px-6 md:px-8">
                <motion.p 
                  className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white/80 font-light leading-[1.6]"
                  style={{ 
                    lineHeight: '1.6',
                    letterSpacing: '0.002em',
                    textShadow: '0 2px 12px rgba(0,0,0,0.4)'
                  }}
                  role="note"
                  aria-label="Leadership philosophy statement"
                  whileHover={
                    !isMobileOrTablet ? {
                      color: "rgba(255, 255, 255, 0.92)",
                      scale: 1.003,
                      textShadow: "0 2px 18px rgba(0,0,0,0.5), 0 0 25px rgba(255,255,255,0.08)"
                    } : {}
                  }
                >
                  Our leadership team combines decades of expertise in sovereign wealth management, 
                  institutional finance, and regulatory excellence to guide The Buckingham Vault's mission.
                </motion.p>
                
                <motion.p 
                  className="text-lg md:text-xl lg:text-2xl text-gold/75 font-serif font-light italic leading-[1.7] max-w-4xl mx-auto"
                  style={{
                    fontVariant: 'small-caps',
                    letterSpacing: '0.01em',
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                  }}
                  role="note"
                  aria-label="Leadership commitment statement"
                  whileHover={
                    !isMobileOrTablet ? {
                      color: "rgba(215, 147, 9, 0.9)",
                      scale: 1.005,
                      textShadow: "0 2px 15px rgba(0,0,0,0.4), 0 0 20px rgba(215,147,9,0.2)"
                    } : {}
                  }
                >
                  "Committed to setting the highest standards of fiduciary responsibility and innovation in wealth preservation"
                </motion.p>


                {/* Enhanced royal decorative dots */}
                <motion.div 
                  className="flex items-center justify-center space-x-5 md:space-x-6 pt-8 md:pt-10"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.8, delay: 2.2 }}
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
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
