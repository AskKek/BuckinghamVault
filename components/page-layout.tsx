'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BuckinghamVaultIcon } from './Custom-UI/buckingham-vault-icon'
import { ElegantSidebar } from './Navigation/elegant-sidebar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface PageLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  showBackButton?: boolean
  backHref?: string
  className?: string
}

export function PageLayout({ 
  children, 
  title, 
  subtitle, 
  showBackButton = true, 
  backHref = "/",
  className = ""
}: PageLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  return (
    <div className={`min-h-screen bg-gradient-to-br from-navy via-navy-dark to-black ${className}`}>
      {/* Navigation Button - Fixed Position */}
      <motion.div
        className="fixed top-4 md:top-8 left-4 md:left-8 z-50"
        initial={{ opacity: 0, x: -100, scale: 0.5 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{
          duration: 1.5,
          delay: 0.5,
          type: "spring",
          stiffness: 120,
          damping: 15
        }}
      >
        <motion.button
          onClick={() => setSidebarOpen(true)}
          className="w-12 h-12 md:w-16 md:h-16 glass-morphism rounded-full flex items-center justify-center premium-glow group cursor-pointer touch-manipulation ring-2 ring-gold/20 hover:ring-gold/40 transition-all duration-300"
          whileHover={
            !isMobile
              ? {
                  scale: 1.08,
                  boxShadow: "0 0 30px rgba(215, 147, 9, 0.4), 0 0 60px rgba(215, 147, 9, 0.2)",
                }
              : {}
          }
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          aria-label="Open navigation menu"
        >
          <BuckinghamVaultIcon size={isMobile ? 24 : 32} />
        </motion.button>
      </motion.div>

      {/* Sidebar */}
      <ElegantSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header - if title provided */}
      {(title || showBackButton) && (
        <header className="sticky top-0 z-40 bg-navy/80 backdrop-blur-xl border-b border-gold/20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {title && (
                <div className="flex items-center space-x-3 ml-16 md:ml-20">
                  <div>
                    <h1 className="text-xl md:text-2xl font-display font-bold text-white">{title}</h1>
                    {subtitle && <p className="text-xs md:text-sm text-gold/70">{subtitle}</p>}
                  </div>
                </div>
              )}
              
              {showBackButton && (
                <Link 
                  href={backHref}
                  className="text-gold hover:text-gold-light transition-colors font-medium"
                >
                  ← Back to Home
                </Link>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="relative">
        {children}
      </main>
    </div>
  )
}