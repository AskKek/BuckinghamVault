"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Scale, Globe, AlertCircle, TrendingUp, TrendingDown, Clock, Shield, Crown, Sparkles, FileText, Gavel, MapPin, Eye, Zap } from "lucide-react"
import { useDeviceDetection, prefersReducedMotion } from "@/lib/animation-utils"

interface RegulatoryUpdate {
  id: string
  jurisdiction: string
  title: string
  description: string
  impact: "High" | "Medium" | "Low"
  category: "Taxation" | "AML/KYC" | "Licensing" | "Consumer Protection" | "Sanctions" | "CBDC"
  date: string
  effectiveDate: string
  status: "Active" | "Proposed" | "Under Review"
  riskScore: number
  affectedEntities: string[]
  priceImpact?: number
}

interface JurisdictionRisk {
  country: string
  flag: string
  riskLevel: "Low" | "Medium" | "High" | "Critical"
  overallScore: number
  categories: {
    regulatory: number
    taxation: number
    sanctions: number
    operational: number
  }
  recentChanges: number
  nextReview: string
}

export default function RegulatoryIntelligenceCenter() {
  return (
    <div className="relative overflow-hidden">
      <div className="relative glass-morphism rounded-2xl p-6 md:p-8 space-y-6 md:space-y-8 luxury-border">
        <div className="flex items-center space-x-3">
          <Scale className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
          <h3 className="text-2xl md:text-3xl font-display font-bold text-gradient tracking-tight">
            Regulatory Intelligence Center
          </h3>
        </div>
        <p className="text-white/70 font-sans font-light leading-relaxed">
          Real-time global regulatory monitoring and compliance risk assessment for sovereign wealth funds
        </p>
        
        <div className="bg-navy/40 rounded-lg p-6 border border-purple-400/20">
          <h4 className="text-lg font-display font-bold text-gradient mb-4">
            Global Regulatory Monitoring
          </h4>
          <p className="text-white/70">
            Comprehensive regulatory intelligence system tracking changes across 50+ jurisdictions.
            Features include real-time policy updates, risk scoring, and compliance recommendations.
          </p>
        </div>
      </div>
    </div>
  )
}
