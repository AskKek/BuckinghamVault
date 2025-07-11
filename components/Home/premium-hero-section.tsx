"use client"

import { Suspense } from "react";
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Gem } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { ElegantSidebar } from "../Navigation/elegant-sidebar"
import { BuckinghamVaultIcon } from "../Custom-UI/buckingham-vault-icon"
import { InquireModal } from "./inquire-modal"
import { UnifiedLoginButton } from "../Authentication/unified-login-button"
import { UnifiedAuthPortal } from "../Authentication/unified-auth-portal"
import { InteractiveLiquidGoldShader } from "../Custom-UI/InteractiveLiquidGoldShader"
import { PlatformAccessModal } from "../Navigation/platform-access-modal"

interface HeroSectionProps {
  headline: string
  subheadline: string
  description: string
}

export function PremiumHeroSection({ headline, subheadline, description }: HeroSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [inquireModalOpen, setInquireModalOpen] = useState(false)
  const [authPortalOpen, setAuthPortalOpen] = useState(false)
  const [platformAccessOpen, setPlatformAccessOpen] = useState(false)
  const [titleHovered, setTitleHovered] = useState(false)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <>
      {/* Premium Navigation Header - Outside motion section for proper fixed positioning */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between p-6 lg:p-8 bg-gradient-to-b from-black/20 to-transparent backdrop-blur-sm">
            {/* Logo and Brand */}
            <motion.div 
              className="flex items-center space-x-3 group cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              onClick={() => setSidebarOpen(true)}
            >
              <div className="relative">
                <BuckinghamVaultIcon className="h-12 w-12 text-gold group-hover:text-gold-light transition-all duration-300" />
                <div className="absolute inset-0 bg-gold/20 rounded-full scale-0 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="hidden lg:block">
                <h1 className="text-xl font-display font-bold text-white group-hover:text-white/90 transition-colors duration-300">
                  The Buckingham Vault
                </h1>
                <p className="text-xs text-white font-light tracking-wider uppercase">
                  Private Digital Asset Wealth Management
                </p>
              </div>
            </motion.div>

            {/* Premium Action Buttons */}
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInquireModalOpen(true)}
                className="border-gold/30 text-gold hover:bg-gold/10 hover:border-gold transition-all duration-300 backdrop-blur-sm"
              >
                <Gem className="w-4 h-4 mr-2" />
                Inquire
              </Button>
              <UnifiedLoginButton 
                onOpenPortal={() => setPlatformAccessOpen(true)}
                variant="header"
                className="shadow-lg hover:shadow-gold/20"
              />
            </motion.div>
          </div>
      </div>

      <motion.section
        ref={ref}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ y, opacity }}
      >
        {/* Interactive Liquid Gold Shader Background */}
        <Suspense fallback={
          <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy-dark">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-gold/5 animate-pulse" />
          </div>
        }>
          <InteractiveLiquidGoldShader quality="high" enabled={true} />
        </Suspense>

        {/* Hero Content */}
        <div className="relative z-30 max-w-6xl mx-auto px-6 lg:px-8 text-center">
          {/* The Buckingham Vault Title */}
          <motion.h2
            className="text-6xl md:text-8xl lg:text-9xl font-display font-black text-navy mb-6 tracking-tight leading-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            style={{ 
              fontFamily: 'Playfair Display, serif',
              textShadow: '2px 2px 4px rgba(244, 185, 66, 0.3), -1px -1px 2px rgba(255, 255, 255, 0.5)'
            }}
          >
            The Buckingham Vault
          </motion.h2>

          {/* Royal Buckingham Vault Icon */}
          <motion.div
            className="flex justify-center mb-12"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            <div className="relative">
              <BuckinghamVaultIcon className="h-20 w-20 text-navy drop-shadow-lg" />
              <motion.div
                className="absolute inset-0 rounded-full bg-navy/10"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            onMouseEnter={() => setTitleHovered(true)}
            onMouseLeave={() => setTitleHovered(false)}
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-navy mb-6 leading-relaxed">
              <span className="font-light">Digital Asset Vault for</span>
              <br className="hidden md:block" />
              <span className="font-bold text-navy/90">
                Institutions, Family Offices, Entrepreneurs & Sovereign Partners
              </span>
            </h1>
            
            <motion.div
              className="w-48 h-1 bg-gradient-to-r from-transparent via-navy/50 to-transparent mx-auto"
              animate={{
                scaleX: titleHovered ? 1.3 : 1,
                opacity: titleHovered ? 1 : 0.6
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* Subheadline */}
          <motion.p
            className="text-lg md:text-xl lg:text-2xl font-normal text-navy/85 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            style={{ textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)' }}
          >
            {subheadline}
          </motion.p>

          {/* Description */}
          <motion.p
            className="text-lg md:text-xl lg:text-2xl text-white mb-12 max-w-3xl mx-auto leading-relaxed font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 0, 0, 0.3)' }}
          >
            {description}
          </motion.p>

          {/* Premium Call-to-Action */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
          >
            <motion.button
              onClick={() => setInquireModalOpen(true)}
              className="relative px-10 py-5 text-lg font-bold overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, rgba(16, 27, 62, 0.9) 0%, rgba(16, 27, 62, 0.95) 100%)',
                border: '2px solid transparent',
                borderRadius: '12px',
                position: 'relative'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Animated border gradient */}
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(135deg, #f4b942, #d79309, #f4b942)',
                  padding: '2px',
                  borderRadius: '12px',
                  backgroundSize: '200% 200%',
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <div className="absolute inset-[2px] rounded-[10px] bg-navy" />
              </motion.div>
              
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(circle at center, rgba(244, 185, 66, 0.4) 0%, transparent 70%)',
                }}
              />
              
              {/* Button content */}
              <span className="relative flex items-center justify-center text-gold group-hover:text-gold-light transition-colors duration-300">
                <Shield className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-500" />
                Secure Your Wealth
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
              
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(244, 185, 66, 0.2) 50%, transparent 60%)',
                  borderRadius: '12px',
                }}
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                  ease: "easeInOut"
                }}
              />
            </motion.button>
            
            <motion.button
              onClick={() => setPlatformAccessOpen(true)}
              className="relative px-10 py-5 text-lg font-bold overflow-hidden group"
              style={{
                borderRadius: '12px',
                position: 'relative',
                isolation: 'isolate'
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Multi-layer animated gradient background */}
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #f4b942 0%, #d79309 50%, #f4b942 100%)',
                  backgroundSize: '200% 200%',
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: "easeInOut"
                }}
              />
              
              {/* Luxury metallic overlay */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-50" />
              
              {/* Premium animated border */}
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: 'conic-gradient(from 0deg at 50% 50%, #fff 0deg, transparent 60deg, transparent 300deg, #fff 360deg)',
                  padding: '2px',
                  opacity: 0,
                  mixBlendMode: 'overlay'
                }}
                animate={{
                  opacity: [0, 0.8, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <div className="absolute inset-[2px] rounded-[10px] bg-gradient-to-r from-gold to-gold-light" />
              </motion.div>
              
              {/* Prismatic light effect */}
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
                style={{
                  background: 'radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.4) 0%, transparent 25%), radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.3) 0%, transparent 25%)',
                  filter: 'blur(10px)',
                }}
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Enhanced outer glow with multiple layers */}
              <motion.div
                className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background: 'radial-gradient(circle at center, rgba(244, 185, 66, 0.6) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                }}
              />
              <motion.div
                className="absolute -inset-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                style={{
                  background: 'radial-gradient(circle at center, rgba(215, 147, 9, 0.4) 0%, transparent 70%)',
                  filter: 'blur(30px)',
                }}
              />
              
              {/* Button content with luxury styling */}
              <span className="relative flex items-center justify-center">
                <motion.span
                  className="text-navy font-extrabold tracking-wide"
                  style={{
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                  }}
                  animate={{
                    textShadow: [
                      '1px 1px 2px rgba(0, 0, 0, 0.2)',
                      '2px 2px 8px rgba(255, 255, 255, 0.5), 1px 1px 2px rgba(0, 0, 0, 0.2)',
                      '1px 1px 2px rgba(0, 0, 0, 0.2)'
                    ],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Vault Access
                </motion.span>
              </span>
              
              {/* Premium sparkle particles */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      left: `${20 + i * 12}%`,
                      top: `${30 + (i % 2) * 40}%`,
                    }}
                    animate={{
                      scale: [0, 1.5, 0],
                      opacity: [0, 1, 0],
                      y: [-10, -30],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
              
              {/* Luxury wave effect on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
                  borderRadius: '12px',
                }}
                initial={{ x: '-100%' }}
                animate={{
                  x: ['100%', '-100%'],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 0.5
                }}
              />
            </motion.button>
          </motion.div>

          {/* Institutional Trust Indicators */}
          <motion.div
            className="mt-16 pt-12 border-t border-gold/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
          >
            <p className="text-navy/70 text-sm uppercase tracking-widest font-semibold">
              Trusted by Global Institutions
            </p>
          </motion.div>
        </div>

        {/* Elegant Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-6 h-10 border-2 border-navy/40 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-navy rounded-full mt-2"
              animate={{
                scaleY: [1, 0.3, 1],
                opacity: [1, 0.3, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Modals and Overlays */}
      <ElegantSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <InquireModal isOpen={inquireModalOpen} onClose={() => setInquireModalOpen(false)} />
      <UnifiedAuthPortal isOpen={authPortalOpen} onClose={() => setAuthPortalOpen(false)} />
      <PlatformAccessModal isOpen={platformAccessOpen} onClose={() => setPlatformAccessOpen(false)} />
    </>
  )
}