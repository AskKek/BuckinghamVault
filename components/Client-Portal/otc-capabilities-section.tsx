"use client"

import { motion } from "framer-motion"
import { Bitcoin, DollarSign, Coins, Award, Gem, BarChart3 } from "lucide-react"

export function OTCCapabilitiesSection() {
  const assets = [
    {
      icon: Bitcoin,
      name: "Bitcoin (BTC)",
      description: "Large block Bitcoin transactions",
      features: ["Institutional custody integration", "Real-time settlement", "Global liquidity access"]
    },
    {
      icon: Coins,
      name: "Stablecoins",
      description: "USDT, USDC cross-border flows",
      features: ["Multi-chain support", "Banking integration", "Compliance automation"]
    },
    {
      icon: DollarSign,
      name: "Fiat Currencies",
      description: "Major currency transactions",
      features: ["Direct banking rails", "Same-day settlement", "Multi-jurisdiction"]
    },
    {
      icon: Award,
      name: "Physical Gold",
      description: "Precious metals trading",
      features: ["Vault-to-vault transfer", "Authentication certificates", "Global delivery"]
    },
    {
      icon: Gem,
      name: "Oil & Energy",
      description: "Commodity transactions",
      features: ["Future contracts", "Physical delivery", "Sovereign counterparties"]
    }
  ]

  const tradingFlow = [
    {
      step: "01",
      title: "Client Inquiry",
      description: "Institution submits large block trading requirement through mandate member or direct portal"
    },
    {
      step: "02",
      title: "Network Matching",
      description: "AI-powered system matches with institutional counterparties in our exclusive network"
    },
    {
      step: "03",
      title: "Price Discovery",
      description: "Transparent pricing through hourly index or direct negotiation with zero slippage guarantee"
    },
    {
      step: "04",
      title: "Execution & Settlement",
      description: "Secure execution with institutional custody integration and automated commission distribution"
    }
  ]

  return (
    <section id="otc-capabilities" className="relative py-24 lg:py-32 bg-gradient-to-b from-navy-light via-navy to-navy-dark">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(215,147,9,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(215,147,9,0.1)_0%,transparent_50%)]" />
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
          <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
            OTC <span className="text-gold">Asset Classes</span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Comprehensive large-block trading capabilities across digital assets, fiat currencies, 
            precious metals, and commodities for institutional portfolios.
          </p>
        </motion.div>

        {/* Asset Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {assets.map((asset, index) => (
            <motion.div
              key={asset.name}
              className="group relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="glass-morphism p-6 rounded-2xl border border-gold/20 hover:border-gold/40 transition-all duration-500 h-full">
                {/* Asset Icon & Info */}
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold/20 to-gold/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <asset.icon className="w-6 h-6 text-gold" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors duration-300">
                  {asset.name}
                </h3>
                <p className="text-white/70 text-sm mb-4">{asset.description}</p>


                {/* Features */}
                <ul className="space-y-2">
                  {asset.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-white/80 text-sm">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trading Flow */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-4xl font-bold text-white text-center mb-12">
            Institutional Trading <span className="text-gold">Process</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tradingFlow.map((flow, index) => (
              <div key={flow.step} className="relative">
                <div className="glass-morphism p-6 rounded-2xl border border-gold/20 text-center h-full">
                  {/* Step Number */}
                  <div className="w-12 h-12 bg-gradient-to-r from-gold to-gold-light text-navy font-bold rounded-full flex items-center justify-center mx-auto mb-4 text-lg">
                    {flow.step}
                  </div>
                  
                  <h4 className="text-lg font-bold text-white mb-3">{flow.title}</h4>
                  <p className="text-white/70 text-sm leading-relaxed">{flow.description}</p>
                </div>
                
                {/* Connector Line (except last item) */}
                {index < tradingFlow.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-gold to-transparent transform -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}