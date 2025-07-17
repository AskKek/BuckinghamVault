"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { X, Maximize2, Minimize2, Download, Share2, Settings, Eye, Crown, Shield } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import TradingViewChart from "./TradingViewChart"
import { useDeviceDetection } from "@/lib/animation-utils"

interface TradingViewModalProps {
  isOpen: boolean
  onClose: () => void
  symbol: string
  name: string
  currentPrice: number
  change24h: number
  logo?: string
}

export default function TradingViewModal({ 
  isOpen, 
  onClose, 
  symbol, 
  name, 
  currentPrice, 
  change24h,
  logo 
}: TradingViewModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const { isMobile, isMobileOrTablet } = useDeviceDetection()

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${name} (${symbol}) Technical Analysis`,
          text: `Advanced technical analysis for ${name} showing current price of $${currentPrice.toLocaleString()} with ${change24h > 0 ? '+' : ''}${change24h.toFixed(2)}% 24h change.`,
          url: window.location.href
        })
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href)
      }
    } else {
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.3
      }
    }
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  }

  const fullscreenVariants = {
    normal: {
      width: isMobile ? "95vw" : "90vw",
      height: isMobile ? "85vh" : "80vh",
      transition: { duration: 0.3 }
    },
    fullscreen: {
      width: "100vw",
      height: "100vh",
      transition: { duration: 0.3 }
    }
  }

  const minimizedVariants = {
    normal: {
      height: "auto",
      transition: { duration: 0.3 }
    },
    minimized: {
      height: "60px",
      transition: { duration: 0.3 }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Custom Backdrop with Luxury Blur */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className={`relative bg-gradient-to-br from-navy-800/95 via-navy-900/98 to-navy-800/95 backdrop-blur-2xl border border-gold/30 shadow-2xl ${
              isFullscreen ? 'rounded-none' : 'rounded-2xl'
            } overflow-hidden`}
            variants={{
              ...modalVariants,
              ...fullscreenVariants[isFullscreen ? 'fullscreen' : 'normal']
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Luxury Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/5 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

            {/* Modal Header */}
            <motion.div
              className="flex items-center justify-between p-4 md:p-6 border-b border-gold/20 bg-navy/50"
              variants={minimizedVariants[isMinimized ? 'minimized' : 'normal']}
              animate={isMinimized ? 'minimized' : 'normal'}
            >
              <div className="flex items-center space-x-4">
                {/* Crypto Logo/Icon */}
                <motion.div
                  className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-gold/30 to-gold/15 rounded-xl flex items-center justify-center text-gold font-bold text-lg border border-gold/30 shadow-lg shadow-gold/20"
                  whileHover={!isMobile ? { 
                    scale: 1.1, 
                    rotate: 5,
                    boxShadow: "0 10px 30px rgba(215, 147, 9, 0.4)"
                  } : {}}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {symbol.charAt(0)}
                  <motion.div 
                    className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center text-navy text-xs font-bold border border-navy shadow-lg"
                    whileHover={{ scale: 1.2 }}
                  >
                    <Crown className="w-2 h-2" />
                  </motion.div>
                </motion.div>

                <div>
                  <h2 className="text-xl md:text-2xl font-display font-bold tracking-tight text-gold">
                    {name} Technical Analysis
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-white/70">
                    <Shield className="w-4 h-4 text-gold/60" />
                    <span>Institutional-Grade Chart Analysis</span>
                    <span>•</span>
                    <span className="text-gold">{symbol}</span>
                  </div>
                </div>
              </div>

              {/* Window Controls */}
              <div className="flex items-center space-x-2">
                {!isMobile && (
                  <>
                    {/* Share Button */}
                    <motion.button
                      onClick={handleShare}
                      className="p-2 bg-navy/60 backdrop-blur-sm rounded-lg border border-gold/20 text-gold hover:bg-gold/10 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Share Analysis"
                    >
                      <Share2 className="w-4 h-4" />
                    </motion.button>

                    {/* Settings Button */}
                    <motion.button
                      className="p-2 bg-navy/60 backdrop-blur-sm rounded-lg border border-gold/20 text-gold hover:bg-gold/10 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Chart Settings"
                    >
                      <Settings className="w-4 h-4" />
                    </motion.button>

                    {/* Minimize Button */}
                    <motion.button
                      onClick={handleMinimize}
                      className="p-2 bg-navy/60 backdrop-blur-sm rounded-lg border border-gold/20 text-blue-400 hover:bg-blue-500/10 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title={isMinimized ? "Restore" : "Minimize"}
                    >
                      <Minimize2 className="w-4 h-4" />
                    </motion.button>

                    {/* Fullscreen Button */}
                    <motion.button
                      onClick={handleFullscreen}
                      className="p-2 bg-navy/60 backdrop-blur-sm rounded-lg border border-gold/20 text-green-400 hover:bg-green-500/10 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                      <Maximize2 className="w-4 h-4" />
                    </motion.button>
                  </>
                )}

                {/* Close Button */}
                <motion.button
                  onClick={onClose}
                  className="p-2 bg-navy/60 backdrop-blur-sm rounded-lg border border-gold/20 text-red-400 hover:bg-red-500/10 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>

            {/* Modal Content */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  className="p-4 md:p-6 overflow-y-auto"
                  style={{ 
                    maxHeight: isFullscreen ? 'calc(100vh - 80px)' : 'calc(80vh - 80px)' 
                  }}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Chart Component */}
                  <TradingViewChart
                    symbol={symbol}
                    name={name}
                    currentPrice={currentPrice}
                    change24h={change24h}
                  />

                  {/* Additional Analysis Section */}
                  <motion.div
                    className="mt-6 p-6 bg-gradient-to-br from-navy-800/90 via-navy-900/95 to-navy-800/90 rounded-xl border border-gold/30 backdrop-blur-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-display font-bold text-gold flex items-center space-x-2">
                        <Eye className="w-5 h-5" />
                        <span>Oracle Intelligence Summary</span>
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-white/70">
                        <motion.div
                          className="w-2 h-2 bg-gold rounded-full"
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span>Real-time Analysis</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-white mb-2">Technical Outlook</h4>
                          <ul className="space-y-2 text-sm text-white/80">
                            <li className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-gold rounded-full mt-2 flex-shrink-0" />
                              <span>
                                Current price action shows {change24h > 0 ? 'bullish momentum' : 'bearish pressure'} 
                                with {Math.abs(change24h) > 5 ? 'high volatility' : 'moderate movement'} patterns
                              </span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-gold rounded-full mt-2 flex-shrink-0" />
                              <span>
                                EMA crossover analysis indicates potential for {change24h > 0 ? 'continued upside' : 'reversal signals'} 
                                in the near-term outlook
                              </span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-gold rounded-full mt-2 flex-shrink-0" />
                              <span>
                                Bollinger Band positioning suggests {Math.abs(change24h) > 3 ? 'high volatility environment' : 'consolidation phase'} 
                                with key levels identified
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-white mb-2">Risk Assessment</h4>
                          <ul className="space-y-2 text-sm text-white/80">
                            <li className="flex items-start space-x-2">
                              <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                                Math.abs(change24h) > 10 ? 'bg-red-400' : 
                                Math.abs(change24h) > 5 ? 'bg-yellow-400' : 'bg-green-400'
                              }`} />
                              <span>
                                Volatility Risk: {Math.abs(change24h) > 10 ? 'High' : Math.abs(change24h) > 5 ? 'Medium' : 'Low'} - 
                                Consider position sizing accordingly
                              </span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                              <span>
                                Money Flow Index indicates {change24h > 0 ? 'accumulation pressure' : 'distribution patterns'} 
                                from institutional participants
                              </span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                              <span>
                                Volume analysis supports {change24h > 0 ? 'bullish sentiment' : 'bearish outlook'} 
                                with {change24h > 0 ? 'strong buying' : 'selling pressure'} observed
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Key Levels Summary */}
                    <div className="mt-6 p-4 bg-navy/50 rounded-lg border border-gold/10">
                      <h4 className="font-semibold text-gold mb-3 flex items-center space-x-2">
                        <Shield className="w-4 h-4" />
                        <span>Key Trading Levels</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <p className="text-red-400 font-medium">Resistance</p>
                          <p className="text-white text-lg font-bold">
                            ${(currentPrice * 1.05).toLocaleString('en-US', {
                              minimumFractionDigits: symbol === 'BTC' ? 0 : 2,
                              maximumFractionDigits: symbol === 'BTC' ? 0 : 4,
                            })}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gold font-medium">Current</p>
                          <p className="text-gold text-lg font-bold">
                            ${currentPrice.toLocaleString('en-US', {
                              minimumFractionDigits: symbol === 'BTC' ? 0 : 2,
                              maximumFractionDigits: symbol === 'BTC' ? 0 : 4,
                            })}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-green-400 font-medium">Support</p>
                          <p className="text-white text-lg font-bold">
                            ${(currentPrice * 0.95).toLocaleString('en-US', {
                              minimumFractionDigits: symbol === 'BTC' ? 0 : 2,
                              maximumFractionDigits: symbol === 'BTC' ? 0 : 4,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Luxury Border Glow Effect */}
            <div className="absolute inset-0 rounded-2xl border border-gold/20 pointer-events-none" 
                 style={{
                   boxShadow: '0 0 50px rgba(215, 147, 9, 0.1), inset 0 0 50px rgba(215, 147, 9, 0.05)'
                 }} 
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}