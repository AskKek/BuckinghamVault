"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Home, ChevronRight, UserCheck, Handshake, Network, Sparkles, Vault, FileText, Bot, BookOpen, TrendingUp, Settings, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BuckinghamVaultIcon } from "../Custom-UI/buckingham-vault-icon"
import { UnifiedLoginButton } from "../Authentication/unified-login-button"
import { UnifiedAuthPortal } from "../Authentication/unified-auth-portal"
import { useIsMobile } from "@/hooks/use-mobile"
import { useRouter } from "next/navigation"
import { useSecureAuthSafe } from "@/hooks/use-secure-auth"
import { 
  MissionIcon, 
  ClienteleIcon, 
  ServicesIcon, 
  LeadershipIcon, 
  MembershipIcon, 
  ContactIcon, 
  AnalyticsIcon 
} from "../Custom-UI/custom-section-icons"

interface ElegantSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigationItems = [
  { icon: Home, label: "Home", href: "/", isHome: true },
  { icon: MissionIcon, label: "Our Mission", href: "#mission" },
  { icon: ClienteleIcon, label: "Who We Serve", href: "#clientele" },
  { icon: ServicesIcon, label: "Core Services", href: "#services" },
  { icon: LeadershipIcon, label: "Leadership", href: "#leadership" },
  { icon: MembershipIcon, label: "Membership", href: "#membership" },
  { icon: ContactIcon, label: "Contact", href: "#contact" },
  { icon: AnalyticsIcon, label: "BV Analytics", href: "/analytics", isExternal: true },
]

const platformItems = [
  { icon: Vault, label: "Vault Dashboard", href: "/vault", isExternal: true, isPremium: true },
  { icon: FileText, label: "Deal Tracker", href: "/vault/deals", isExternal: true, isPremium: true },
  { icon: TrendingUp, label: "Brightpool Exchange", href: "/vault/exchange", isExternal: true, isPremium: true },
  { icon: Bot, label: "Jeeves AI", href: "/vault/jeeves", isExternal: true, isPremium: true },
  { icon: BookOpen, label: "Knowledge Center", href: "/vault/knowledge", isExternal: true, isPremium: true },
]

const onboardingItems = [
  { icon: Shield, label: "Client Services Portal", href: "/client-services", isExternal: true },
  { icon: UserCheck, label: "Client Onboarding", href: "/client-onboarding", isExternal: true },
  { icon: Handshake, label: "Mandate Application", href: "/mandate-application", isExternal: true },
  { icon: Network, label: "Vault Collective", href: "/village-collective", isExternal: true },
]

export function ElegantSidebar({ isOpen, onClose }: ElegantSidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const [authPortalOpen, setAuthPortalOpen] = useState(false)
  const isMobile = useIsMobile()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useSecureAuthSafe()

  const handleProtectedNavigation = (href: string, requireAuth: boolean = false) => {
    if (requireAuth && !isAuthenticated && !isLoading) {
      router.push(`/login?redirect=${encodeURIComponent(href)}`)
    } else {
      window.location.href = href
    }
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div key="elegant-sidebar-wrapper">
          {/* Backdrop */}
          <motion.div
            key="elegant-sidebar-backdrop"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            key="elegant-sidebar-main"
            className="fixed top-0 left-0 h-full w-full xs:w-80 md:w-96 z-50 overflow-hidden"
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Glass Background */}
            <div className="absolute inset-0 glass-morphism" />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-navy/90 via-navy-dark/95 to-navy/90" />

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute top-1/4 -left-20 w-40 h-40 bg-gradient-to-r from-gold/10 to-transparent rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-1/4 -right-20 w-40 h-40 bg-gradient-to-l from-gold/10 to-transparent rounded-full blur-3xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 2,
                }}
              />
            </div>

            <div className="relative z-10 h-full flex flex-col">
              {/* Header with Custom Icon */}
              <div className="p-4 sm:p-6 md:p-8 border-b border-gold/20">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 glass-morphism rounded-full flex items-center justify-center">
                      <BuckinghamVaultIcon size={isMobile ? 20 : 24} />
                    </div>
                    <div>
                      <motion.h2
                        className="text-lg md:text-xl font-display font-bold text-gold"
                        whileHover={{
                          scale: 1.02,
                          textShadow: "0 0 10px rgba(215, 147, 9, 0.5)",
                        }}
                      >
                        The Buckingham Vault
                      </motion.h2>
                      <p className="text-xs md:text-sm text-white font-sans">Private Wealth Network</p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-gold hover:text-gold-light hover:bg-gold/10 rounded-full w-11 h-11 min-w-[44px] min-h-[44px] p-0 touch-manipulation"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                  <Sparkles className="w-4 h-4 text-gold/60" />
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/30 to-transparent" />
                </div>
              </div>

              {/* Navigation with Refined Hover Effects */}
              <div className="flex-1 overflow-y-auto -webkit-overflow-scrolling-touch overscroll-behavior-contain p-4 sm:p-6 md:p-8 space-y-6 scrollbar-thin scrollbar-track-navy/20 scrollbar-thumb-gold/30 hover:scrollbar-thumb-gold/50">
                {/* Website Navigation */}
                <nav className="space-y-2">
                  <h3 className="text-xs font-semibold text-gold/80 uppercase tracking-wide mb-3">Website</h3>
                  {navigationItems.map((item, index) => {
                    const Icon = item.icon
                    const isHovered = hoveredItem === index

                    return (
                      <motion.a
                        key={`nav-${index}`}
                        href={item.href}
                        className="block relative group touch-manipulation"
                        onMouseEnter={() => setHoveredItem(index)}
                        onMouseLeave={() => setHoveredItem(null)}
                        onClick={(e) => {
                          if (item.isHome) {
                            e.preventDefault()
                            // Check if we're already on the homepage
                            if (typeof window !== 'undefined' && window.location.pathname === '/') {
                              window.scrollTo({ top: 0, behavior: "smooth" })
                            } else if (typeof window !== 'undefined') {
                              window.location.href = '/'
                            }
                            onClose()
                            return
                          } else if (item.isExternal) {
                            e.preventDefault()
                            if (typeof window !== 'undefined') {
                              window.location.href = item.href
                            }
                            onClose()
                            return
                          } else if (item.href.startsWith('#')) {
                            e.preventDefault()
                            // Handle hash navigation
                            if (typeof window !== 'undefined') {
                              const currentPath = window.location.pathname
                              if (currentPath === '/') {
                                // We're on homepage, scroll to section
                                const sectionId = item.href.substring(1)
                                const element = document.getElementById(sectionId)
                                if (element) {
                                  const yOffset = -80; // Offset for fixed header
                                  const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                                  window.scrollTo({top: y, behavior: 'smooth'});
                                }
                              } else {
                                // Navigate to homepage with hash
                                window.location.href = '/' + item.href
                              }
                            }
                            onClose()
                            return
                          }
                          onClose()
                        }}
                        whileHover={{
                          x: 6,
                          transition: { type: "spring", stiffness: 400, damping: 25 },
                        }}
                      >
                        <div className="relative p-3 rounded-xl overflow-hidden min-h-[44px] flex items-center">
                          {/* Hover Background */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-gold/10 to-gold/5 rounded-xl"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                              opacity: isHovered ? 1 : 0,
                              scale: isHovered ? 1 : 0.8,
                            }}
                            transition={{ duration: 0.2 }}
                          />

                          <div className="relative z-10 flex items-center space-x-4">
                            <motion.div
                              className="w-11 h-11 min-w-[44px] min-h-[44px] glass-morphism rounded-lg md:rounded-xl flex items-center justify-center group-hover:premium-glow transition-all duration-300"
                              whileHover={{
                                scale: 1.05,
                                boxShadow: "0 0 15px rgba(215, 147, 9, 0.3)",
                              }}
                            >
                              <Icon className="w-4 h-4 md:w-5 md:h-5 text-gold group-hover:text-gold-light transition-colors duration-300" />
                            </motion.div>

                            <div className="flex-1">
                              <motion.span
                                className="text-white group-hover:text-gold font-sans font-medium transition-colors duration-300"
                                whileHover={{
                                  textShadow: "0 0 8px rgba(215, 147, 9, 0.4)",
                                }}
                              >
                                {item.label}
                              </motion.span>
                            </div>

                            <motion.div
                              animate={{ x: isHovered ? 0 : -10, opacity: isHovered ? 1 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronRight className="w-4 h-4 text-gold/60" />
                            </motion.div>
                          </div>
                        </div>
                      </motion.a>
                    )
                  })}
                </nav>

                {/* Platform Navigation */}
                <nav className="space-y-2">
                  <div className="flex items-center space-x-2 mb-3">
                    <h3 className="text-xs font-semibold text-gold/80 uppercase tracking-wide">Vault Platform</h3>
                    <Sparkles className="w-3 h-3 text-gold animate-pulse" />
                  </div>
                  {platformItems.map((item, index) => {
                    const Icon = item.icon
                    const actualIndex = navigationItems.length + index
                    const isHovered = hoveredItem === actualIndex

                    return (
                      <motion.a
                        key={`platform-${index}`}
                        href={item.href}
                        className="block relative group touch-manipulation"
                        onMouseEnter={() => setHoveredItem(actualIndex)}
                        onMouseLeave={() => setHoveredItem(null)}
                        onClick={(e) => {
                          e.preventDefault()
                          handleProtectedNavigation(item.href, item.isPremium)
                        }}
                        whileHover={{
                          x: 6,
                          transition: { type: "spring", stiffness: 400, damping: 25 },
                        }}
                      >
                        <div className="relative p-3 rounded-xl overflow-hidden min-h-[44px] flex items-center">
                          {/* Premium Hover Background */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-gold/20 to-gold/10 rounded-xl"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                              opacity: isHovered ? 1 : 0,
                              scale: isHovered ? 1 : 0.8,
                            }}
                            transition={{ duration: 0.2 }}
                          />

                          <div className="relative z-10 flex items-center space-x-4">
                            <motion.div
                              className="w-8 h-8 md:w-10 md:h-10 glass-morphism rounded-lg md:rounded-xl flex items-center justify-center group-hover:premium-glow transition-all duration-300 border border-gold/30"
                              whileHover={{
                                scale: 1.05,
                                boxShadow: "0 0 20px rgba(215, 147, 9, 0.5)",
                              }}
                            >
                              <Icon className="w-4 h-4 md:w-5 md:h-5 text-gold group-hover:text-gold-light transition-colors duration-300" />
                            </motion.div>

                            <div className="flex-1">
                              <motion.span
                                className="text-white group-hover:text-gold font-sans font-medium transition-colors duration-300"
                                whileHover={{
                                  textShadow: "0 0 8px rgba(215, 147, 9, 0.4)",
                                }}
                              >
                                {item.label}
                              </motion.span>
                            </div>

                            <motion.div
                              animate={{ x: isHovered ? 0 : -10, opacity: isHovered ? 1 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronRight className="w-4 h-4 text-gold/60" />
                            </motion.div>
                          </div>
                        </div>
                      </motion.a>
                    )
                  })}
                </nav>

                {/* Onboarding Navigation */}
                <nav className="space-y-2">
                  <h3 className="text-xs font-semibold text-gold/80 uppercase tracking-wide mb-3">Get Started</h3>
                  {onboardingItems.map((item, index) => {
                    const Icon = item.icon
                    const actualIndex = navigationItems.length + platformItems.length + index
                    const isHovered = hoveredItem === actualIndex

                    return (
                      <motion.a
                        key={`onboarding-${index}`}
                        href={item.href}
                        className="block relative group touch-manipulation"
                        onMouseEnter={() => setHoveredItem(actualIndex)}
                        onMouseLeave={() => setHoveredItem(null)}
                        onClick={(e) => {
                          e.preventDefault()
                          if (typeof window !== 'undefined') {
                            window.location.href = item.href
                          }
                          onClose()
                        }}
                        whileHover={{
                          x: 6,
                          transition: { type: "spring", stiffness: 400, damping: 25 },
                        }}
                      >
                        <div className="relative p-3 rounded-xl overflow-hidden min-h-[44px] flex items-center">
                          {/* Hover Background */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-gold/10 to-gold/5 rounded-xl"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                              opacity: isHovered ? 1 : 0,
                              scale: isHovered ? 1 : 0.8,
                            }}
                            transition={{ duration: 0.2 }}
                          />

                          <div className="relative z-10 flex items-center space-x-4">
                            <motion.div
                              className="w-11 h-11 min-w-[44px] min-h-[44px] glass-morphism rounded-lg md:rounded-xl flex items-center justify-center group-hover:premium-glow transition-all duration-300"
                              whileHover={{
                                scale: 1.05,
                                boxShadow: "0 0 15px rgba(215, 147, 9, 0.3)",
                              }}
                            >
                              <Icon className="w-4 h-4 md:w-5 md:h-5 text-gold group-hover:text-gold-light transition-colors duration-300" />
                            </motion.div>

                            <div className="flex-1">
                              <motion.span
                                className="text-white group-hover:text-gold font-sans font-medium transition-colors duration-300"
                                whileHover={{
                                  textShadow: "0 0 8px rgba(215, 147, 9, 0.4)",
                                }}
                              >
                                {item.label}
                              </motion.span>
                            </div>

                            <motion.div
                              animate={{ x: isHovered ? 0 : -10, opacity: isHovered ? 1 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronRight className="w-4 h-4 text-gold/60" />
                            </motion.div>
                          </div>
                        </div>
                      </motion.a>
                    )
                  })}
                </nav>

                {/* Login Button */}
                <div className="mt-6 pt-6 border-t border-gold/20">
                  <UnifiedLoginButton 
                    onOpenPortal={() => setAuthPortalOpen(true)} 
                    variant="sidebar" 
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-6 md:p-8 border-t border-gold/20">
                <div className="text-center space-y-4">
                  <motion.p
                    className="text-sm text-white/60 font-sans"
                    whileHover={{
                      scale: 1.02,
                      color: "rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    Restoring Balance to Wealth in the Digital Age
                  </motion.p>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-gold/60 rounded-full animate-pulse-gold" />
                    <div
                      className="w-2 h-2 bg-gold/40 rounded-full animate-pulse-gold"
                      style={{ animationDelay: "0.5s" }}
                    />
                    <div
                      className="w-2 h-2 bg-gold/60 rounded-full animate-pulse-gold"
                      style={{ animationDelay: "1s" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Login Portal */}
      <UnifiedAuthPortal isOpen={authPortalOpen} onClose={() => setAuthPortalOpen(false)} />
    </AnimatePresence>
  )
}
