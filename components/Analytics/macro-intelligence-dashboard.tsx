"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Globe, TrendingUp, TrendingDown, BarChart3, Crown, Shield, Sparkles, Building2, PieChart } from "lucide-react"
import { useDeviceDetection } from "@/lib/animation-utils"

export default function MacroIntelligenceDashboard() {
  const { isMobile } = useDeviceDetection()

  return (
    <div className="relative overflow-hidden">
      <div className="relative glass-morphism rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 md:space-y-8 luxury-border">
        <div className="flex items-center space-x-3">
          <Globe className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />
          <h3 className="text-2xl md:text-3xl font-display font-bold text-gradient tracking-tight">
            Macro Intelligence Dashboard
          </h3>
        </div>
        <p className="text-white/70 font-sans font-light leading-relaxed">
          Advanced macroeconomic analysis linking global financial trends to Bitcoin price movements
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-navy/40 rounded-lg p-6 border border-emerald-400/20">
            <h4 className="text-lg font-display font-bold text-gradient mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-emerald-400" />
              Key Macro Indicators
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Federal Funds Rate</span>
                <span className="text-white font-medium">5.50%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">US Core CPI (YoY)</span>
                <span className="text-white font-medium">3.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">DXY (Dollar Index)</span>
                <span className="text-white font-medium">104.25</span>
              </div>
            </div>
          </div>
          
          <div className="bg-navy/40 rounded-lg p-6 border border-emerald-400/20">
            <h4 className="text-lg font-display font-bold text-gradient mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-emerald-400" />
              Central Bank Calendar
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Fed FOMC Meeting</span>
                <span className="text-yellow-400 font-medium">Jan 29</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">ECB Policy Decision</span>
                <span className="text-yellow-400 font-medium">Jan 23</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">BoJ Rate Decision</span>
                <span className="text-yellow-400 font-medium">Jan 24</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-navy/40 rounded-lg p-6 border border-gold/20">
          <h4 className="text-lg font-display font-bold text-gradient mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-emerald-400" />
            Bitcoin Correlation Matrix
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-sm">
            <div className="text-center">
              <div className="text-white/60">S&P 500</div>
              <div className="text-green-400 font-bold">0.68</div>
            </div>
            <div className="text-center">
              <div className="text-white/60">NASDAQ</div>
              <div className="text-green-400 font-bold">0.74</div>
            </div>
            <div className="text-center">
              <div className="text-white/60">Gold</div>
              <div className="text-yellow-400 font-bold">0.31</div>
            </div>
            <div className="text-center">
              <div className="text-white/60">US Dollar</div>
              <div className="text-red-400 font-bold">-0.58</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
