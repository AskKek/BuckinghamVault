"use client"

import { motion } from "framer-motion"
import { LogIn, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UnifiedLoginButtonProps {
  onOpenPortal: () => void
  variant?: "hero" | "sidebar" | "header"
  className?: string
}

export function UnifiedLoginButton({ onOpenPortal, variant = "header", className = "" }: UnifiedLoginButtonProps) {
  
  if (variant === "sidebar") {
    return (
      <motion.button
        onClick={onOpenPortal}
        className={`w-full p-4 glass-morphism rounded-xl border border-gold/20 hover:border-gold/40 transition-all duration-300 group ${className}`}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-gold/20 to-gold/10 rounded-lg flex items-center justify-center group-hover:from-gold/30 group-hover:to-gold/20 transition-all duration-300">
              <Crown className="w-5 h-5 text-gold" />
            </div>
            <div className="text-left">
              <p className="text-white font-medium group-hover:text-gold transition-colors duration-300">
                Private Access
              </p>
              <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors duration-300">
                Member & Client Portal
              </p>
            </div>
          </div>
          <LogIn className="w-4 h-4 text-gold/60 group-hover:text-gold group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </motion.button>
    )
  }

  if (variant === "hero") {
    return (
      <motion.div
        className={`fixed top-6 md:top-10 right-6 md:right-10 z-40 ${className}`}
        initial={{ opacity: 0, x: 100, scale: 0.5 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{
          duration: 1.8,
          delay: 0.5,
          type: "spring",
          stiffness: 100,
          damping: 20
        }}
      >
        <motion.button
          onClick={onOpenPortal}
          className="w-14 h-14 md:w-20 md:h-20 glass-morphism rounded-full flex items-center justify-center group cursor-pointer touch-manipulation bg-navy/80 border border-gold/40 hover:border-gold/70 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_48px_rgba(215,147,9,0.3)] transition-all duration-500 relative overflow-hidden"
          whileHover={{
            scale: 1.05,
            backgroundColor: "rgba(215, 147, 9, 0.15)",
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          aria-label="Access private portal"
        >
          {/* Subtle glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-gold/10 via-gold/20 to-gold/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Icon container */}
          <div className="relative z-10 flex items-center justify-center">
            <LogIn className="w-6 h-6 md:w-8 md:h-8 text-gold group-hover:text-gold-light transition-colors duration-300" />
          </div>

          {/* Hover indicator */}
          <motion.div
            className="absolute bottom-1 right-1 w-2 h-2 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.button>

        {/* Tooltip */}
        <motion.div
          className="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-navy/90 border border-gold/20 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          initial={{ y: -10 }}
          animate={{ y: 0 }}
        >
          Private Access Portal
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-navy/90" />
        </motion.div>
      </motion.div>
    )
  }

  // Header variant (default)
  return (
    <Button
      onClick={onOpenPortal}
      className={`bg-gold text-navy hover:bg-gold-light transition-all duration-300 shadow-lg hover:shadow-gold/20 ${className}`}
    >
      <LogIn className="w-4 h-4 mr-2" />
      Vault Access
    </Button>
  )
}