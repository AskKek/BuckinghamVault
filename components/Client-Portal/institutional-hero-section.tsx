"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Crown, Gem, TrendingUp, Users, Globe } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { InteractiveLiquidGoldShader } from "../Custom-UI/InteractiveLiquidGoldShader"
import { UnifiedAuthPortal } from "../Authentication/unified-auth-portal"
import { ElegantSidebar } from "../Navigation/elegant-sidebar"
import { BuckinghamVaultIcon } from "../Custom-UI/buckingham-vault-icon"
import { InquireModal } from "../Home/inquire-modal"
import { UnifiedLoginButton } from "../Authentication/unified-login-button"
import { PlatformAccessModal } from "../Navigation/platform-access-modal"

export function InstitutionalHeroSection() {
  const ref = useRef<HTMLElement>(null)
  const [authPortalOpen, setAuthPortalOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [inquireModalOpen, setInquireModalOpen] = useState(false)
  const [platformAccessOpen, setPlatformAccessOpen] = useState(false)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <>
      <motion.section
        ref={ref}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ y, opacity }}
      >
        {/* Interactive Liquid Gold Shader Background */}
        <InteractiveLiquidGoldShader quality="high" enabled={true} />

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
                  Institutional OTC Trading Platform
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

        {/* Hero Content */}
        <div className="relative z-30 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          {/* Buckingham Vault Icon with Animation */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="relative">
              <BuckinghamVaultIcon className="h-20 w-20 text-gold" />
              <motion.div
                className="absolute inset-0 rounded-full bg-gold/20"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>

          {/* Main Value Proposition */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-gold-light to-white bg-clip-text text-transparent">
                Institutional OTC Trading
              </span>
              <br />
              <span className="text-gold text-4xl md:text-5xl lg:text-6xl">
                For Governments & Sovereign Wealth
              </span>
            </h1>
            
            <motion.div
              className="w-48 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            />

            <p className="text-2xl md:text-3xl text-white/90 mb-6 max-w-5xl mx-auto leading-relaxed font-light">
              Facilitate <span className="text-gold font-semibold">large-block OTC transactions</span> with zero slippage through our revolutionary 
              <span className="text-gold font-semibold"> Brightpool Exchange</span>
            </p>

            <p className="text-lg md:text-xl text-white/70 max-w-4xl mx-auto leading-relaxed">
              Bitcoin • Stablecoins • Fiat • Gold • Oil | $10M+ Block Transactions | Institutional-Grade Security
            </p>
          </motion.div>

          {/* Core Value Propositions */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="glass-morphism p-6 rounded-2xl border border-gold/20 hover:border-gold/40 transition-all duration-300">
              <TrendingUp className="h-12 w-12 text-gold mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-white mb-2">Zero Slippage Trading</h3>
              <p className="text-white/70">Transparent hourly index pricing with guaranteed execution for large-block transactions</p>
            </div>
            <div className="glass-morphism p-6 rounded-2xl border border-gold/20 hover:border-gold/40 transition-all duration-300">
              <Users className="h-12 w-12 text-gold mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-white mb-2">Mandate Network</h3>
              <p className="text-white/70">Exclusive network of institutional deal facilitators with automated commission distribution</p>
            </div>
            <div className="glass-morphism p-6 rounded-2xl border border-gold/20 hover:border-gold/40 transition-all duration-300">
              <Globe className="h-12 w-12 text-gold mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-white mb-2">Global Liquidity</h3>
              <p className="text-white/70">Access international institutional counterparties for seamless cross-border transactions</p>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <Button
              size="lg"
              onClick={() => setAuthPortalOpen(true)}
              className="bg-gradient-to-r from-gold via-gold-light to-gold text-navy font-bold px-12 py-6 text-xl hover:shadow-2xl hover:shadow-gold/40 transition-all duration-500 group"
            >
              <Shield className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
              Access Platform
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => document.getElementById('otc-capabilities')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-gold/40 text-gold hover:bg-gold/10 hover:border-gold px-12 py-6 text-xl backdrop-blur-sm transition-all duration-300"
            >
              Learn About OTC Trading
            </Button>
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
          <div className="w-6 h-10 border-2 border-gold/50 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-gold rounded-full mt-2"
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