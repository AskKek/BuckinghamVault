"use client"

import React from "react"
import { motion } from "framer-motion"
import { Zap, Eye, Clock, TrendingUp, Shield, Users, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BrightpoolSection() {
  const brightpoolFeatures = [
    {
      icon: Eye,
      title: "Transparent Pricing",
      description: "Hourly index pricing with full visibility into price discovery mechanisms",
      benefit: "No hidden spreads or surprise costs"
    },
    {
      icon: Clock,
      title: "Hourly Execution",
      description: "Large block orders executed at transparent hourly index prices",
      benefit: "Predictable timing and execution"
    },
    {
      icon: TrendingUp,
      title: "Zero Slippage",
      description: "Guaranteed execution at index price regardless of order size",
      benefit: "Perfect for $10M+ transactions"
    },
    {
      icon: Shield,
      title: "Institutional Security",
      description: "Bank-grade security with complete audit trails and compliance",
      benefit: "Meet regulatory requirements"
    }
  ]

  const traditionalVsBrightpool = [
    {
      aspect: "Price Discovery",
      traditional: "Hidden spreads and opaque pricing",
      brightpool: "Transparent hourly index pricing",
      advantage: "Full visibility into pricing mechanisms"
    },
    {
      aspect: "Large Block Impact",
      traditional: "Significant slippage on $10M+ orders",
      brightpool: "Zero slippage guarantee",
      advantage: "Execute any size without market impact"
    },
    {
      aspect: "Liquidity Visibility",
      traditional: "Unknown liquidity depth",
      brightpool: "Real-time liquidity transparency",
      advantage: "Know exactly what's available"
    },
    {
      aspect: "Settlement Speed",
      traditional: "T+2 or T+3 settlement",
      brightpool: "Same-day settlement capability",
      advantage: "Faster capital deployment"
    }
  ]

  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-b from-navy-light via-navy-dark to-navy">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(215,147,9,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(215,147,9,0.15)_0%,transparent_50%)]" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center bg-gold/10 border border-gold/20 rounded-full px-6 py-2 mb-6">
            <Zap className="w-4 h-4 text-gold mr-2" />
            <span className="text-gold text-sm font-semibold tracking-wide">REVOLUTIONARY INNOVATION</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-2">
            Brightpool <span className="text-gold">Exchange</span>
          </h2>
          <p className="text-2xl text-gold/90 font-display font-light mb-6">(Coming Soon)</p>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            The world's first transparent dark pool, combining the privacy of traditional dark pools 
            with complete price transparency and zero slippage execution for institutional clients.
          </p>
        </motion.div>

        {/* Core Innovation Explanation */}
        <motion.div
          className="glass-morphism p-10 rounded-3xl border border-gold/30 mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">
                What Makes Brightpool Different?
              </h3>
              <div className="space-y-4 text-white/80">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Transparent Dark Pool:</span> Unlike traditional dark pools that hide pricing, Brightpool provides full transparency while maintaining order privacy.
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Hourly Index Pricing:</span> Orders execute at transparent hourly index prices, eliminating hidden spreads and surprise costs.
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Zero Slippage Guarantee:</span> Execute any size order without market impact, perfect for $10M+ institutional transactions.
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Institutional Integration:</span> Direct integration with major custody providers and banking systems for seamless settlement.
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="glass-morphism p-8 rounded-2xl border border-gold/20">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-gold/20 to-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-10 h-10 text-gold" />
                  </div>
                  <h4 className="text-2xl font-bold text-gold mb-2">Brightpool Advantage</h4>
                  <p className="text-white/60">Revolutionary trading experience</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Price Transparency</span>
                    <span className="text-gold font-semibold">100%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Slippage Protection</span>
                    <span className="text-gold font-semibold">Guaranteed</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Settlement Speed</span>
                    <span className="text-gold font-semibold">Same Day</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Minimum Order</span>
                    <span className="text-gold font-semibold">$10M</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Brightpool Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {brightpoolFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="glass-morphism p-6 rounded-2xl border border-gold/20 hover:border-gold/40 transition-all duration-500 h-full">
                <div className="w-12 h-12 bg-gradient-to-br from-gold/20 to-gold/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-gold" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-white/70 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="inline-flex items-center bg-gold/10 border border-gold/20 rounded-full px-4 py-2">
                  <span className="text-gold text-sm font-semibold">{feature.benefit}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Traditional vs Brightpool Comparison */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-4xl font-bold text-white text-center mb-12">
            Traditional Dark Pools vs <span className="text-gold">Brightpool</span>
          </h3>
          
          <div className="glass-morphism rounded-3xl border border-gold/30 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
              {/* Header */}
              <div className="bg-gold/10 p-4 border-b border-gold/20">
                <span className="text-gold font-semibold">Comparison</span>
              </div>
              <div className="bg-red-500/10 p-4 border-b border-red-500/20">
                <span className="text-red-400 font-semibold">Traditional Dark Pools</span>
              </div>
              <div className="bg-gold/10 p-4 border-b border-gold/20">
                <span className="text-gold font-semibold">Brightpool Exchange</span>
              </div>
              <div className="bg-green-500/10 p-4 border-b border-green-500/20">
                <span className="text-green-400 font-semibold">Brightpool Advantage</span>
              </div>
              
              {/* Comparison Rows */}
              {traditionalVsBrightpool.map((comparison, index) => (
                <React.Fragment key={comparison.aspect}>
                  <div className="p-4 border-b border-gold/10">
                    <span className="text-white font-medium">{comparison.aspect}</span>
                  </div>
                  <div className="p-4 border-b border-gold/10">
                    <span className="text-white/70">{comparison.traditional}</span>
                  </div>
                  <div className="p-4 border-b border-gold/10">
                    <span className="text-white/70">{comparison.brightpool}</span>
                  </div>
                  <div className="p-4 border-b border-gold/10">
                    <span className="text-green-400 text-sm">{comparison.advantage}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="glass-morphism p-10 rounded-3xl border border-gold/30">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Experience Brightpool?
            </h3>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Join the revolution in institutional trading. Experience transparent dark pool trading 
              with zero slippage and guaranteed execution for your large-block transactions.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-gold to-gold-light text-navy font-bold px-8 py-4 text-lg hover:shadow-2xl hover:shadow-gold/30 transition-all duration-500 group"
              >
                Access Brightpool Exchange
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-gold/40 text-gold hover:bg-gold/10 hover:border-gold px-8 py-4 text-lg backdrop-blur-sm transition-all duration-300"
              >
                Learn More About Our Technology
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}