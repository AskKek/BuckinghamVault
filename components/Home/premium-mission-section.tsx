"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Star, Sparkles, Crown, Globe, Shield } from "lucide-react"
import { SectionWrapper } from "../shared/SectionWrapper"
import { 
  useDeviceDetection,
  prefersReducedMotion 
} from "@/lib/animation-utils"
import Image from "next/image"

interface MissionSectionProps {
  title: string
  statement: string
  description: string
  extended?: string
}

export function PremiumMissionSection({ title, statement, description, extended }: MissionSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { isMobile, isMobileOrTablet } = useDeviceDetection()
  const [hoveredElement, setHoveredElement] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [particles, setParticles] = useState<Array<{
    id: number;
    left: number;
    top: number;
    delay: number;
    duration: number;
    size: number;
    opacity: number;
  }>>([])
  const [geometricShapes, setGeometricShapes] = useState<Array<{
    id: number;
    left: number;
    top: number;
    delay: number;
    duration: number;
    scale: number;
  }>>([])

  useEffect(() => {
    setIsClient(true)
    // Enhanced constellation of particles with sophisticated movement
    setParticles(Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 8 + Math.random() * 4,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.6 + 0.2,
    })))

    // Enhanced floating geometric shapes
    setGeometricShapes(Array.from({ length: 6 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 12 + Math.random() * 8,
      scale: Math.random() * 0.5 + 0.5,
    })))
  }, [])

  return (
    <SectionWrapper
      id="mission-section"
      title={title}
      description="Our guiding principles and mission statement"
      backgroundType="gradient"
      showDecorative={!isMobileOrTablet}
      announceOnView={true}
      className="from-navy-dark via-navy to-navy-light relative overflow-hidden"
    >
      <div ref={ref} className="max-w-7xl mx-auto px-4 md:px-8 relative">
        {/* Enhanced constellation - desktop only */}
        {isClient && !prefersReducedMotion() && !isMobileOrTablet && (
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
                  opacity: [particle.opacity * 0.3, particle.opacity, particle.opacity * 0.3],
                  scale: [0.5, 1, 0.5],
                  y: [0, -20, 0],
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
                  className="text-gold/40" 
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

        {/* Enhanced Floating Geometric Shapes - Desktop only */}
        {isClient && !prefersReducedMotion() && !isMobileOrTablet && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {geometricShapes.map((shape) => (
              <motion.div
                key={shape.id}
                className="absolute opacity-10"
                style={{
                  left: `${shape.left}%`,
                  top: `${shape.top}%`,
                }}
                animate={{
                  y: [0, -40, 0],
                  x: [0, 20, 0],
                  rotate: [0, 180, 360],
                  scale: [shape.scale, shape.scale * 1.2, shape.scale],
                }}
                transition={{
                  duration: shape.duration,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: shape.delay,
                  ease: "easeInOut",
                }}
              >
                <div className="w-8 h-8 md:w-12 md:h-12 border border-gold/20 rounded-full" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Premium Mission Image Integration */}
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
        >
          {/* Enhanced background overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/95 via-navy-dark/85 to-navy-dark/95 z-10" />
          
          {/* Mission image with sophisticated parallax effect */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={isInView ? {
              y: [0, -10, 0],
              scale: [1, 1.02, 1],
            } : {}}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <div className="relative w-full h-full max-w-4xl mx-auto">
              <Image
                src="/images/our-mission.png"
                alt="Hands ceremoniously passing a golden sovereign key over elegant historical documents, symbolizing the transfer of trust and wealth preservation across generations"
                fill
                className="object-contain opacity-25 md:opacity-30 filter sepia-[0.2] saturate-110 brightness-110"
                style={{
                  objectPosition: 'center center',
                  filter: 'sepia(0.1) saturate(1.2) brightness(1.1) contrast(1.05)',
                }}
                priority={false}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
              />
              
              {/* Enhanced golden overlay for brand consistency */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/8 mix-blend-overlay" />
              
              {/* Premium vignette effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-navy-dark/20 to-navy-dark/60" />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative z-10 space-y-16 md:space-y-24"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: { 
                duration: 1,
                staggerChildren: 0.2,
                delayChildren: 0.3
              }
            }
          }}
        >
          {/* Enhanced Premium Section Header */}
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
                  scale: 1.3,
                  color: '#F4B942'
                }}
                transition={{ duration: 0.6 }}
              >
                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-gold" />
              </motion.div>
              <motion.div 
                className="h-[2px] w-20 md:w-28 bg-gradient-to-l from-transparent via-gold to-gold/60"
                whileHover={{ width: !isMobileOrTablet ? '140px' : 'auto' }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            {/* Enhanced Royal Main Title with sovereign presence */}
            <motion.h2
              className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold bg-gradient-to-br from-white via-gold/30 to-white bg-clip-text text-transparent"
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
              onHoverStart={() => setHoveredElement('title')}
              onHoverEnd={() => setHoveredElement(null)}
            >
              {title}
            </motion.h2>

            {/* Enhanced sovereign subtitle with perfect spacing */}
            <motion.p
              className="text-xl md:text-3xl lg:text-4xl xl:text-5xl text-white/85 font-sans font-light max-w-6xl mx-auto leading-[1.4] px-6 md:px-8"
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
              {description}
            </motion.p>
          </motion.div>

          {/* Enhanced Mission Statement Card with Image Interaction */}
          <motion.div
            className="relative group"
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1 }
            }}
            onHoverStart={() => setHoveredElement('mission')}
            onHoverEnd={() => setHoveredElement(null)}
            whileHover={
              !isMobileOrTablet ? {
                y: -8,
                scale: 1.015,
                transition: { 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  mass: 0.8,
                  velocity: 2
                }
              } : {}
            }
          >
            {/* Enhanced background glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-gold/15 via-gold/8 to-gold/15 rounded-3xl md:rounded-4xl blur-2xl opacity-0"
              animate={{
                opacity: hoveredElement === 'mission' ? 1 : 0,
                scale: hoveredElement === 'mission' ? 1.05 : 1,
              }}
              transition={{ 
                duration: 0.8, 
                ease: [0.23, 1, 0.320, 1] // Custom cubic-bezier for smooth easing
              }}
            />
            
            {/* Enhanced outer glow */}
            <motion.div
              className="absolute -inset-2 bg-gradient-to-r from-gold/10 via-gold/5 to-gold/10 rounded-3xl md:rounded-4xl blur-xl opacity-0"
              animate={{
                opacity: hoveredElement === 'mission' ? 1 : 0,
                scale: hoveredElement === 'mission' ? 1.08 : 1,
              }}
              transition={{ 
                duration: 0.6, 
                ease: [0.25, 0.46, 0.45, 0.94], // Smooth ease-out
                delay: 0.1
              }}
            />

            {/* Premium image reveal on hover - Desktop only */}
            <motion.div
              className="absolute inset-0 rounded-2xl md:rounded-3xl overflow-hidden"
              animate={{
                opacity: hoveredElement === 'mission' && !isMobileOrTablet ? 1 : 0,
                scale: hoveredElement === 'mission' && !isMobileOrTablet ? 1 : 0.95,
              }}
              transition={{ 
                duration: 0.7, 
                ease: [0.23, 1, 0.320, 1] // Custom smooth easing
              }}
            >
              <div className="relative w-full h-full">
                <Image
                  src="/images/our-mission.png"
                  alt="Ceremonial golden key symbolizing sovereign trust"
                  fill
                  className="object-cover opacity-20 filter sepia-[0.3] saturate-125 brightness-115"
                  style={{
                    filter: 'sepia(0.2) saturate(1.3) brightness(1.15) contrast(1.1)',
                  }}
                />
                {/* Enhanced overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-navy-dark/90 via-navy-dark/85 to-navy-dark/90" />
                <div className="absolute inset-0 bg-gradient-to-t from-gold/10 via-transparent to-gold/5 mix-blend-overlay" />
              </div>
            </motion.div>

            <motion.div 
              className="relative glass-morphism rounded-2xl md:rounded-3xl p-10 md:p-14 lg:p-16 luxury-border backdrop-blur-xl"
              role="article"
              aria-labelledby="mission-statement"
              animate={{
                borderColor: hoveredElement === 'mission' ? 'rgba(215, 147, 9, 0.4)' : 'rgba(255, 255, 255, 0.1)',
              }}
              transition={{ 
                duration: 0.5, 
                ease: [0.4, 0.0, 0.2, 1] // Smooth transition for border
              }}
            >
              {/* Enhanced premium background pattern */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/5 rounded-2xl md:rounded-3xl"
                animate={{
                  opacity: hoveredElement === 'mission' ? 1 : 0,
                }}
                transition={{ 
                  duration: 0.6, 
                  ease: [0.4, 0.0, 0.2, 1] 
                }}
              />
              
              <div className="relative space-y-10 md:space-y-14 lg:space-y-16">
                {/* Enhanced sovereign mission statement */}
                <motion.h3
                  id="mission-statement"
                  className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-white leading-[1.1] px-2"
                  style={{
                    letterSpacing: '-0.02em',
                    lineHeight: '1.1',
                    textShadow: '0 3px 20px rgba(0,0,0,0.5), 0 6px 40px rgba(215,147,9,0.1)'
                  }}
                  whileHover={
                    !prefersReducedMotion() && !isMobileOrTablet ? { 
                      scale: 1.008,
                      textShadow: "0 3px 25px rgba(0,0,0,0.6), 0 6px 50px rgba(215,147,9,0.15), 0 0 40px rgba(255, 255, 255, 0.1)"
                    } : undefined
                  }
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <span className="bg-gradient-to-r from-white via-white to-gold/20 bg-clip-text text-transparent">
                    {statement}
                  </span>
                </motion.h3>

                {/* Enhanced sparkle icon with animation */}
                <motion.div 
                  className="absolute top-6 md:top-10 right-6 md:right-10"
                  animate={{
                    scale: hoveredElement === 'mission' && !isMobileOrTablet ? 1.3 : 1,
                    rotate: hoveredElement === 'mission' && !isMobileOrTablet ? 180 : 0
                  }}
                  transition={{ 
                    duration: 0.6, 
                    ease: [0.25, 0.46, 0.45, 0.94],
                    type: "spring",
                    stiffness: 200,
                    damping: 25
                  }}
                >
                  <motion.div
                    animate={{
                      color: hoveredElement === 'mission' ? 'rgba(215, 147, 9, 1)' : 'rgba(215, 147, 9, 0.6)'
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <Sparkles 
                      className="w-6 h-6 md:w-8 md:h-8" 
                      aria-hidden="true"
                    />
                  </motion.div>
                </motion.div>

                {/* Enhanced premium trust indicators */}
                <motion.div
                  className="flex items-center justify-center space-x-8 pt-6"
                  animate={{
                    opacity: hoveredElement === 'mission' && !isMobileOrTablet ? 1 : 0,
                    y: hoveredElement === 'mission' && !isMobileOrTablet ? 0 : 15,
                  }}
                  transition={{ 
                    duration: 0.5, 
                    ease: [0.23, 1, 0.320, 1],
                    delay: hoveredElement === 'mission' ? 0.3 : 0 // Stagger in/out
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gold/70" />
                    <span className="text-sm text-white/60">Global Excellence</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-gold/70" />
                    <span className="text-sm text-white/60">Sovereign Trust</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Crown className="w-4 h-4 text-gold/70" />
                    <span className="text-sm text-white/60">Royal Standard</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Royal Extended Description */}
          {extended && (
            <motion.div
              className="text-center max-w-6xl mx-auto space-y-10 md:space-y-12 px-6 md:px-8"
              variants={{
                hidden: { opacity: 0, y: 35 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <motion.p
                className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white/75 font-sans font-light leading-[1.6]"
                style={{ 
                  lineHeight: '1.6',
                  letterSpacing: '0.002em',
                  textShadow: '0 2px 12px rgba(0,0,0,0.4)'
                }}
                whileHover={
                  !isMobileOrTablet ? {
                    color: "rgba(255, 255, 255, 0.9)",
                    scale: 1.003,
                    textShadow: "0 2px 18px rgba(0,0,0,0.5), 0 0 25px rgba(255,255,255,0.08)"
                  } : {}
                }
              >
                {extended}
              </motion.p>

              {/* Enhanced sovereign commitment statement */}
              <motion.div
                className="pt-12 md:pt-16 lg:pt-20"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 }
                }}
              >
                <motion.p 
                  className="text-lg md:text-xl lg:text-2xl text-gold/80 font-serif font-light italic leading-[1.7] max-w-4xl mx-auto"
                  style={{
                    fontVariant: 'small-caps',
                    letterSpacing: '0.01em',
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                  }}
                  whileHover={
                    !isMobileOrTablet ? {
                      color: "rgba(215, 147, 9, 0.95)",
                      scale: 1.005,
                      textShadow: "0 2px 15px rgba(0,0,0,0.4), 0 0 20px rgba(215,147,9,0.2)"
                    } : {}
                  }
                >
                  "Committed to setting the highest standards of fiduciary responsibility and innovation in sovereign wealth preservation"
                </motion.p>
                
                {/* Enhanced royal decorative elements - positioned higher */}
                <div className="flex items-center justify-center space-x-6 md:space-x-8 pt-4 md:pt-6">
                  <motion.div 
                    className="w-4 h-4 bg-gradient-to-br from-gold to-gold-light rounded-full shadow-lg"
                    whileHover={{ 
                      scale: 1.8, 
                      boxShadow: "0 0 20px rgba(215, 147, 9, 0.4)",
                      background: "linear-gradient(135deg, #F4B942, #D79309)"
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  />
                  <motion.div 
                    className="w-2.5 h-2.5 bg-gradient-to-br from-gold/70 to-gold-light/70 rounded-full shadow-md"
                    whileHover={{ 
                      scale: 1.5, 
                      boxShadow: "0 0 15px rgba(215, 147, 9, 0.3)",
                      background: "linear-gradient(135deg, #F4B942, #D79309)"
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  />
                  <motion.div 
                    className="w-4 h-4 bg-gradient-to-br from-gold to-gold-light rounded-full shadow-lg"
                    whileHover={{ 
                      scale: 1.8, 
                      boxShadow: "0 0 20px rgba(215, 147, 9, 0.4)",
                      background: "linear-gradient(135deg, #F4B942, #D79309)"
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </SectionWrapper>
  )
}
