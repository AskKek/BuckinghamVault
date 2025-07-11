"use client"

import { motion } from "framer-motion"
import { Crown, Building, Globe, Award, TrendingUp, Users, Star, Shield } from "lucide-react"

export function InstitutionalClienteleSection() {
  const clientCategories = [
    {
      icon: Crown,
      title: "Governments",
      description: "Sovereign wealth management for governments globally",
      stats: "12+ Government Clients",
      features: [
        "Private wealth management",
        "Inheritance planning",
        "Cross-border asset transfers",
        "Discretionary portfolio management"
      ],
      highlight: "White-Glove Service"
    },
    {
      icon: Building,
      title: "Sovereign Wealth Funds",
      description: "National investment funds managing state assets",
      stats: "8+ Sovereign Funds",
      features: [
        "Large-scale asset allocation",
        "Strategic reserve management",
        "International diversification",
        "Regulatory compliance support"
      ],
      highlight: "Institutional Scale"
    },
    {
      icon: Globe,
      title: "Global Financial Institutions",
      description: "Major banks and investment firms worldwide",
      stats: "45+ Institutions",
      features: [
        "Proprietary trading desks",
        "Client execution services",
        "Risk management solutions",
        "Regulatory reporting"
      ],
      highlight: "Enterprise Solutions"
    },
    {
      icon: Award,
      title: "Ultra-High Net Worth Families",
      description: "Private family offices and wealth managers",
      stats: "180+ Family Offices",
      features: [
        "Multi-generational planning",
        "Tax optimization strategies",
        "Alternative investments",
        "Legacy preservation"
      ],
      highlight: "Personalized Service"
    }
  ]

  const testimonials = [
    {
      quote: "The Buckingham Vault platform has revolutionized how we execute large-block transactions. The zero slippage guarantee and transparent pricing have saved us millions.",
      author: "Chief Investment Officer",
      organization: "European Sovereign Wealth Fund",
      amount: "$2.3B+ Transacted"
    },
    {
      quote: "Finally, a platform that understands the complexity of government wealth management. The discretion and sophistication are unmatched.",
      author: "Private Wealth Manager",
      organization: "Government Wealth Office",
      amount: "$1.8B+ Assets Under Management"
    },
    {
      quote: "Brightpool Exchange has become our primary venue for institutional Bitcoin transactions. The transparent pricing and immediate settlement are game-changing.",
      author: "Head of Digital Assets",
      organization: "Global Investment Bank",
      amount: "$950M+ Digital Asset Trades"
    }
  ]

  const globalPresence = [
    { region: "North America", clients: "85+", volume: "$1.2B+" },
    { region: "Europe", clients: "120+", volume: "$2.1B+" },
    { region: "Middle East", clients: "45+", volume: "$1.8B+" },
    { region: "Asia Pacific", clients: "95+", volume: "$950M+" }
  ]

  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-b from-navy via-navy-dark to-navy-light">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(215,147,9,0.2)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(215,147,9,0.2)_0%,transparent_50%)]" />
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
            <Crown className="w-4 h-4 text-gold mr-2" />
            <span className="text-gold text-sm font-semibold tracking-wide">EXCLUSIVE CLIENTELE</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
            Trusted by Global <span className="text-gold">Elite</span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Serving the world's most sophisticated institutional clients with unparalleled 
            discretion, security, and white-glove service for their large-scale OTC transactions.
          </p>
        </motion.div>

        {/* Client Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {clientCategories.map((category, index) => (
            <motion.div
              key={category.title}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="glass-morphism p-8 rounded-2xl border border-gold/20 hover:border-gold/40 transition-all duration-500 h-full">
                {/* Highlight Badge */}
                <div className="absolute -top-3 left-6">
                  <span className="bg-gradient-to-r from-gold to-gold-light text-navy text-sm font-bold px-4 py-1 rounded-full">
                    {category.highlight}
                  </span>
                </div>

                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-gold/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <category.icon className="w-8 h-8 text-gold" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gold">{category.stats}</div>
                    <div className="text-sm text-white/60">Active Clients</div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gold transition-colors duration-300">
                  {category.title}
                </h3>
                <p className="text-white/70 mb-6 leading-relaxed">
                  {category.description}
                </p>

                <div className="space-y-3">
                  {category.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-white/80">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Presence */}
        <motion.div
          className="glass-morphism p-10 rounded-3xl border border-gold/30 mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            Global <span className="text-gold">Presence</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {globalPresence.map((region, index) => (
              <div key={region.region} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-gold/20 to-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-gold" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{region.region}</h4>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gold">{region.clients}</div>
                  <div className="text-sm text-white/60">Active Clients</div>
                  <div className="text-lg font-semibold text-gold">{region.volume}</div>
                  <div className="text-sm text-white/60">Transaction Volume</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Client Testimonials */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-4xl font-bold text-white text-center mb-12">
            What Our <span className="text-gold">Clients Say</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass-morphism p-6 rounded-2xl border border-gold/20">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gold fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-white/80 italic mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="border-t border-gold/20 pt-4">
                  <div className="font-semibold text-white">{testimonial.author}</div>
                  <div className="text-sm text-white/60 mb-2">{testimonial.organization}</div>
                  <div className="text-sm text-gold font-semibold">{testimonial.amount}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Exclusivity and Standards */}
        <motion.div
          className="glass-morphism p-10 rounded-3xl border border-gold/30 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white mb-6">
            Exclusivity & <span className="text-gold">Standards</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-gold/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-gold" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Rigorous Vetting</h4>
              <p className="text-white/70">All clients undergo comprehensive background checks and financial verification</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-gold/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-gold" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Minimum Standards</h4>
              <p className="text-white/70">$10M minimum transaction size ensures institutional-level seriousness</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-gold/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gold" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Invitation Only</h4>
              <p className="text-white/70">Platform access is by invitation or referral from existing clients and mandate members</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}