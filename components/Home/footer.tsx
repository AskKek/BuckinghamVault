"use client"

import { Sparkles, Star, Crown, Shield } from "lucide-react"
import { BuckinghamVaultIcon } from "../Custom-UI/buckingham-vault-icon"
import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { useDeviceDetection, prefersReducedMotion } from "@/lib/animation-utils"

export function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { isMobileOrTablet } = useDeviceDetection()
  const [isClient, setIsClient] = useState(false)
  const [hoveredLogo, setHoveredLogo] = useState(false)
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
    // Enhanced floating particles for premium atmosphere
    setBackgroundParticles(Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 12 + Math.random() * 8,
      size: Math.random() * 1.2 + 0.6,
      opacity: Math.random() * 0.3 + 0.1,
    })))
  }, [])

  return (
    <footer 
      ref={ref}
      className="bg-gradient-to-b from-navy-dark via-navy to-navy-light border-t border-gold/30 py-20 md:py-24 relative overflow-hidden"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Enhanced Premium Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-navy-light" />

        {/* Enhanced floating orbs with sophisticated movement */}
        <motion.div
          className="absolute top-1/6 left-1/6 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-gradient-to-r from-gold/18 via-gold/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.6, 0.2],
            x: [0, 60, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute bottom-1/6 right-1/6 w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-gradient-to-l from-gold/15 via-gold/8 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.15, 0.5, 0.15],
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 16,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 4,
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
                <Sparkles 
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

      <div className="relative z-10 max-w-7xl mx-auto px-8">
        <motion.div
          className="flex flex-col items-center space-y-12 md:space-y-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Enhanced Premium Logo with Custom Icon */}
          <motion.div
            className="group relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.2, delay: 0.3, type: "spring", bounce: 0.2 }}
            onHoverStart={() => setHoveredLogo(true)}
            onHoverEnd={() => setHoveredLogo(false)}
          >
            {/* Enhanced background glow */}
            <motion.div
              className="absolute -inset-6 bg-gradient-to-r from-gold/15 via-gold/8 to-gold/15 rounded-3xl blur-2xl opacity-0"
              animate={{
                opacity: hoveredLogo ? 1 : 0,
                scale: hoveredLogo ? 1.1 : 1,
              }}
              transition={{ duration: 0.6 }}
            />

            <motion.div
              className="relative flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 text-center md:text-left"
              animate={{
                y: hoveredLogo ? -5 : 0,
                scale: hoveredLogo ? 1.02 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Enhanced Premium Icon Container */}
              <motion.div
                className="relative"
                animate={{
                  scale: hoveredLogo ? 1.15 : 1,
                  rotate: hoveredLogo ? 5 : 0,
                }}
                transition={{ duration: 0.4 }}
              >
                {/* Premium icon background glow */}
                <motion.div
                  className="absolute inset-0 bg-gold/30 rounded-full blur-lg"
                  animate={{
                    scale: hoveredLogo ? 1.4 : 1,
                    opacity: hoveredLogo ? 0.8 : 0.5,
                  }}
                  transition={{ duration: 0.4 }}
                />
                
                <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-navy-light/60 to-navy-dark/80 backdrop-blur-xl border border-gold/30 rounded-full flex items-center justify-center group-hover:border-gold/50 transition-all duration-500">
                  <BuckinghamVaultIcon size={32} className="text-gold group-hover:text-gold-light transition-colors duration-300" />
                </div>
              </motion.div>

              <div className="space-y-2">
                <motion.span
                  className="text-3xl md:text-4xl font-light text-white tracking-tight leading-tight"
                  style={{ letterSpacing: '-0.02em' }}
                  animate={{
                    scale: hoveredLogo ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  The{' '}
                  <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent font-medium">
                    Buckingham Vault
                  </span>
                </motion.span>
                <p className="text-lg text-white/60 font-light">
                  Where Digital Sovereignty Meets Private Wealth Excellence
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Decorative Divider */}
          <motion.div
            className="flex items-center space-x-8 w-full max-w-2xl"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
            transition={{ duration: 1.5, delay: 0.6 }}
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-gold/20" />
            
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.2, rotate: 180 }}
              transition={{ duration: 0.4 }}
            >
              <div className="absolute inset-0 bg-gold/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
              <Crown className="relative w-6 h-6 text-gold group-hover:text-gold-light transition-colors duration-300" />
            </motion.div>
            
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/40 to-gold/20" />
          </motion.div>

          {/* Enhanced Premium Tagline */}
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <motion.p
              className="text-xl md:text-2xl text-white/80 font-light text-center leading-relaxed max-w-4xl mx-auto"
              style={{ letterSpacing: '-0.01em' }}
              whileHover={{
                scale: 1.01,
                color: "rgba(255, 255, 255, 0.95)",
              }}
              transition={{ duration: 0.3 }}
            >
              Restoring Balance to Wealth in the Digital Age
            </motion.p>

          </motion.div>

          {/* Enhanced Premium Copyright */}
          <motion.div
            className="pt-12 border-t border-gold/20 w-full text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <motion.p
              className="text-white/50 font-light text-sm md:text-base"
              whileHover={{
                scale: 1.01,
                color: "rgba(255, 255, 255, 0.7)",
              }}
              transition={{ duration: 0.3 }}
            >
              © 2025 The Buckingham Vault. All rights reserved.
            </motion.p>
            
            <motion.div
              className="flex justify-center items-center space-x-6 text-xs text-white/40"
              whileHover={{
                scale: 1.01,
                color: "rgba(255, 255, 255, 0.6)",
              }}
              transition={{ duration: 0.3 }}
            >
              <span>Private Wealth Network</span>
              <div className="w-px h-3 bg-gold/20" />
              <span>Institutional Excellence</span>
              <div className="w-px h-3 bg-gold/20" />
              <span>Swiss-Level Confidentiality</span>
            </motion.div>

            {/* Final decorative element */}
            <motion.div
              className="flex justify-center mt-6"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={isInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
              transition={{ duration: 1.5, delay: 1.5 }}
            >
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  )
}
