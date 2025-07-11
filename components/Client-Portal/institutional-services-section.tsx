"use client"

import { motion } from "framer-motion"
import { TrendingUp, Users, Shield, Zap, Globe, Award, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function InstitutionalServicesSection() {
  const services = [
    {
      icon: TrendingUp,
      title: "Large Block OTC Trading",
      description: "Execute $10M+ transactions without market impact through our institutional network",
      features: [
        "Bitcoin, USDT, Fiat, Gold, Oil transactions",
        "Zero slippage execution guaranteed",
        "Direct institutional counterparty matching",
        "24-hour settlement standard"
      ],
      highlight: "Zero Slippage"
    },
    {
      icon: Users,
      title: "Mandate Member Network",
      description: "Licensed professionals facilitating deals with automated commission distribution",
      features: [
        "Vetted institutional deal facilitators",
        "AI-powered buyer/seller matching",
        "Automated commission calculations",
        "Global network of relationships"
      ],
      highlight: "AI-Powered"
    },
    {
      icon: Zap,
      title: "Brightpool Exchange",
      description: "Revolutionary transparent dark pool with hourly index pricing and instant execution",
      features: [
        "Hourly transparent index pricing",
        "Large block order optimization",
        "Real-time liquidity visibility",
        "Institutional custody integration"
      ],
      highlight: "Transparent"
    }
  ]

  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-b from-navy-dark via-navy to-navy-light">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(215,147,9,0.1)_0%,transparent_70%)]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
            Institutional <span className="text-gold">OTC Trading</span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            The world's most sophisticated platform for large-block institutional transactions, 
            serving governments, sovereign wealth funds, and global financial institutions.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative glass-morphism p-8 rounded-2xl border border-gold/20 hover:border-gold/40 transition-all duration-500 h-full">
                {/* Highlight Badge */}
                <div className="absolute -top-3 left-6">
                  <span className="bg-gradient-to-r from-gold to-gold-light text-navy text-sm font-bold px-4 py-1 rounded-full">
                    {service.highlight}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-gold/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-8 h-8 text-gold" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gold transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-white/70 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-white/80">
                      <div className="w-2 h-2 bg-gold rounded-full mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Value Proposition */}
        <motion.div
          className="glass-morphism p-10 rounded-3xl border border-gold/30 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h3 className="text-3xl font-bold text-white mb-4">
                Why Traditional Exchanges Can't Handle Large Blocks
              </h3>
              <div className="space-y-4 text-white/80">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3" />
                  <span>Market impact and slippage on $10M+ orders</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3" />
                  <span>Insufficient liquidity for institutional sizes</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3" />
                  <span>Price transparency issues in dark pools</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3" />
                  <span>No institutional-grade compliance</span>
                </div>
              </div>
            </div>
            <div className="text-left">
              <h3 className="text-3xl font-bold text-gold mb-4">
                How Buckingham Vault Solves This
              </h3>
              <div className="space-y-4 text-white/80">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3" />
                  <span>Zero slippage with hourly index pricing</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3" />
                  <span>Dedicated institutional liquidity pools</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3" />
                  <span>Transparent Brightpool with full visibility</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3" />
                  <span>Bank-grade security and compliance</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-gold to-gold-light text-navy font-bold px-8 py-4 text-lg hover:shadow-2xl hover:shadow-gold/30 transition-all duration-500 group"
          >
            Explore OTC Capabilities
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}