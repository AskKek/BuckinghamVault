"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Users, Building, ArrowRight, Shield, Crown, Zap, CheckCircle, Star, TrendingUp, FileText, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useSecureAuthSafe } from "@/hooks/use-secure-auth"

type PortalType = 'client' | 'brightpool' | 'mandate'

export function PlatformAccessSection() {
  const [selectedPortal, setSelectedPortal] = useState<PortalType>('client')
  const router = useRouter()
  const { isAuthenticated, isLoading } = useSecureAuthSafe()

  const handleProtectedNavigation = (href: string, requireAuth: boolean = false) => {
    if (requireAuth && !isAuthenticated && !isLoading) {
      router.push(`/login?redirect=${encodeURIComponent(href)}`)
    } else {
      window.location.href = href
    }
  }

  const portals: Record<PortalType, {
    title: string
    subtitle: string
    description: string
    icon: any
    color: string
    features: Array<{
      icon: any
      title: string
      description: string
    }>
    benefits: string[]
    requirements: string[]
    cta: string
    href: string
    requireAuth?: boolean
  }> = {
    client: {
      title: "Client Services Portal",
      subtitle: "Comprehensive Wealth Management Platform",
      description: "Full-service digital asset management platform for institutional clients, family offices, and sovereign wealth funds",
      icon: Briefcase,
      color: "from-navy to-navy-light",
      features: [
        {
          icon: Shield,
          title: "Secure Asset Custody",
          description: "Military-grade security with multi-signature cold storage and institutional insurance"
        },
        {
          icon: FileText,
          title: "Portfolio Management",
          description: "Real-time portfolio tracking, performance analytics, and custom reporting"
        },
        {
          icon: Crown,
          title: "White-Glove Service",
          description: "Dedicated relationship managers and 24/7 concierge support"
        },
        {
          icon: Star,
          title: "Exclusive Opportunities",
          description: "Access to pre-vetted investment opportunities and private deals"
        }
      ],
      benefits: [
        "Institutional-grade security infrastructure",
        "Comprehensive portfolio management tools",
        "Direct access to OTC trading desk",
        "Customized wealth preservation strategies"
      ],
      requirements: [
        "Institutional client verification",
        "$50M minimum portfolio value",
        "Comprehensive KYC/AML compliance",
        "Invitation or qualified referral"
      ],
      cta: "Access Client Services",
      href: "/client-services",
      requireAuth: false
    },
    brightpool: {
      title: "Brightpool Exchange",
      subtitle: "Revolutionary Transparent Dark Pool",
      description: "Next-generation OTC trading platform with zero slippage execution and transparent hourly index pricing",
      icon: TrendingUp,
      color: "from-gold to-gold-light",
      features: [
        {
          icon: Zap,
          title: "Zero Slippage Trading",
          description: "Guaranteed execution at transparent prices for any transaction size"
        },
        {
          icon: CheckCircle,
          title: "Hourly Index Pricing",
          description: "Fair market pricing updated hourly with full transparency"
        },
        {
          icon: Shield,
          title: "Real-time Settlement",
          description: "Direct integration with institutional custody for instant settlement"
        },
        {
          icon: Users,
          title: "Direct Matching",
          description: "Client-to-client matching without intermediary market makers"
        }
      ],
      benefits: [
        "No market impact on large trades",
        "Complete price transparency",
        "Institutional liquidity pool",
        "Automated trade execution"
      ],
      requirements: [
        "Qualified institutional trader",
        "$10M minimum transaction size",
        "Pre-funded trading accounts",
        "Exchange membership approval"
      ],
      cta: "Enter Brightpool Exchange",
      href: "/vault/exchange",
      requireAuth: true
    },
    mandate: {
      title: "Mandate Portal",
      subtitle: "Deal Facilitation Network",
      description: "Exclusive platform for licensed professionals facilitating large-block OTC transactions",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      features: [
        {
          icon: Star,
          title: "AI-Powered Matching",
          description: "Advanced algorithms match buyers and sellers within our network"
        },
        {
          icon: Shield,
          title: "Deal Management",
          description: "Complete transaction lifecycle from initial contact to settlement"
        },
        {
          icon: CheckCircle,
          title: "Commission Tracking",
          description: "Real-time commission calculation and automated distribution"
        },
        {
          icon: Users,
          title: "Network Access",
          description: "Connect with vetted institutional clients and partners"
        }
      ],
      benefits: [
        "Earn commission on $10M+ deals",
        "Access to exclusive client network",
        "Professional deal management tools",
        "Collaborative partner ecosystem"
      ],
      requirements: [
        "Licensed financial professional",
        "5+ years OTC experience",
        "Strong institutional relationships",
        "Background verification"
      ],
      cta: "Apply for Mandate Access",
      href: "/mandate-application",
      requireAuth: false
    }
  }

  const accessPath = [
    {
      step: "01",
      title: "Select Platform",
      description: "Choose the appropriate platform based on your role and requirements"
    },
    {
      step: "02",
      title: "Submit Application",
      description: "Complete verification process with required documentation"
    },
    {
      step: "03",
      title: "Platform Onboarding",
      description: "Receive dedicated training and platform orientation"
    },
    {
      step: "04",
      title: "Begin Operations",
      description: "Start executing transactions with full platform capabilities"
    }
  ]

  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-b from-navy-light via-navy-dark to-navy">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(215,147,9,0.2)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_60%,rgba(215,147,9,0.2)_0%,transparent_50%)]" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center bg-gold/10 border border-gold/20 rounded-full px-6 py-2 mb-6">
            <Crown className="w-4 h-4 text-gold mr-2" />
            <span className="text-gold text-sm font-semibold tracking-wide">VAULT ACCESS</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
            Choose Your <span className="text-gold">Platform</span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Three specialized platforms designed to serve different roles in the institutional digital asset ecosystem. 
            Select the portal that matches your professional needs and transaction requirements.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col md:flex-row items-center justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row bg-navy-dark rounded-2xl p-2 border border-gold/20">
            <button
              onClick={() => setSelectedPortal('client')}
              className={`flex items-center px-6 py-3 rounded-xl transition-all duration-300 ${
                selectedPortal === 'client' 
                  ? 'bg-gradient-to-r from-navy to-navy-light text-white' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Briefcase className="w-5 h-5 mr-2" />
              Client Services
            </button>
            <button
              onClick={() => setSelectedPortal('brightpool')}
              className={`flex items-center px-6 py-3 rounded-xl transition-all duration-300 ${
                selectedPortal === 'brightpool' 
                  ? 'bg-gradient-to-r from-gold to-gold-light text-navy' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Brightpool Exchange
            </button>
            <button
              onClick={() => setSelectedPortal('mandate')}
              className={`flex items-center px-6 py-3 rounded-xl transition-all duration-300 ${
                selectedPortal === 'mandate' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5 mr-2" />
              Mandate Portal
            </button>
          </div>
        </motion.div>

        <motion.div
          className="glass-morphism p-10 rounded-3xl border border-gold/30 mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          key={selectedPortal}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${
                  selectedPortal === 'client' 
                    ? 'from-gold to-gold-light' 
                    : portals[selectedPortal].color
                } rounded-xl flex items-center justify-center mr-4`}>
                  {React.createElement(portals[selectedPortal].icon, { 
                    className: `w-8 h-8 ${selectedPortal === 'client' ? 'text-navy' : 'text-white'}` 
                  })}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{portals[selectedPortal].title}</h3>
                  <p className="text-gold">{portals[selectedPortal].subtitle}</p>
                </div>
              </div>
              
              <p className="text-white/80 mb-8 leading-relaxed">
                {portals[selectedPortal].description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portals[selectedPortal].features.map((feature) => (
                  <div key={feature.title} className="flex items-start">
                    <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center mr-3 mt-1">
                      {React.createElement(feature.icon, { className: "w-4 h-4 text-gold" })}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                      <p className="text-white/60 text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="text-xl font-bold text-white mb-4">Key Benefits</h4>
                <div className="space-y-3">
                  {portals[selectedPortal].benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-white/80">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-xl font-bold text-white mb-4">Requirements</h4>
                <div className="space-y-3">
                  {portals[selectedPortal].requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center">
                      <Shield className="w-4 h-4 text-gold mr-3 flex-shrink-0" />
                      <span className="text-white/80">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button
                size="lg"
                className={`w-full font-bold hover:shadow-2xl transition-all duration-500 group ${
                  selectedPortal === 'client' 
                    ? 'bg-gradient-to-r from-gold to-gold-light text-navy hover:shadow-gold/30'
                    : selectedPortal === 'brightpool'
                    ? 'bg-white text-gold hover:shadow-white/30 hover:bg-white/90'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-blue-500/30'
                }`}
                onClick={() => handleProtectedNavigation(portals[selectedPortal].href, portals[selectedPortal].requireAuth || false)}
              >
                {portals[selectedPortal].cta}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-4xl font-bold text-white text-center mb-12">
            Platform Access <span className="text-gold">Process</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {accessPath.map((step, index) => (
              <div key={step.step} className="relative">
                <div className="glass-morphism p-6 rounded-2xl border border-gold/20 text-center h-full">
                  <div className="w-12 h-12 bg-gradient-to-r from-gold to-gold-light text-navy font-bold rounded-full flex items-center justify-center mx-auto mb-4 text-lg">
                    {step.step}
                  </div>
                  
                  <h4 className="text-lg font-bold text-white mb-3">{step.title}</h4>
                  <p className="text-white/70 text-sm leading-relaxed">{step.description}</p>
                </div>
                
                {index < accessPath.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-gold to-transparent transform -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="glass-morphism p-10 rounded-3xl border border-gold/30">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Access The Vault?
            </h3>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Join the elite network of institutional clients, traders, and deal facilitators. 
              The Buckingham Vault provides the sophisticated infrastructure you need for success in digital asset markets.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-gold to-gold-light text-navy font-bold px-8 py-4 text-lg hover:shadow-2xl hover:shadow-gold/30 transition-all duration-500 group"
                onClick={() => {
                  setSelectedPortal('client')
                  handleProtectedNavigation('/client-services', false)
                }}
              >
                <Briefcase className="w-5 h-5 mr-2" />
                Client Services
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              
              <Button
                size="lg"
                className="bg-white text-gold font-bold px-8 py-4 text-lg hover:shadow-2xl hover:shadow-white/30 hover:bg-white/90 transition-all duration-500 group"
                onClick={() => {
                  setSelectedPortal('brightpool')
                  handleProtectedNavigation('/vault/exchange', true)
                }}
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Brightpool Exchange
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold px-8 py-4 text-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 group"
                onClick={() => {
                  setSelectedPortal('mandate')
                  handleProtectedNavigation('/mandate-application', false)
                }}
              >
                <Users className="w-5 h-5 mr-2" />
                Mandate Portal
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}