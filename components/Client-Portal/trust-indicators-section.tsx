"use client"

import { motion } from "framer-motion"
import { Shield, Lock, Eye, CheckCircle, Award, Globe, FileText, Zap } from "lucide-react"

export function TrustIndicatorsSection() {
  const securityFeatures = [
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "Multi-layered security architecture with end-to-end encryption",
      details: [
        "256-bit encryption at rest and in transit",
        "Multi-factor authentication required",
        "Hardware security modules (HSMs)",
        "Regular penetration testing"
      ]
    },
    {
      icon: Lock,
      title: "Institutional Custody",
      description: "Direct integration with leading custody providers",
      details: [
        "Segregated client assets",
        "Insurance coverage up to $500M",
        "Cold storage for digital assets",
        "Real-time audit trails"
      ]
    },
    {
      icon: Eye,
      title: "Regulatory Compliance",
      description: "Full compliance across multiple jurisdictions",
      details: [
        "KYC/AML automated workflows",
        "GDPR and data protection compliance",
        "Real-time regulatory reporting",
        "Regular compliance audits"
      ]
    },
    {
      icon: FileText,
      title: "Audit & Transparency",
      description: "Complete transparency and third-party auditing",
      details: [
        "Monthly security audits",
        "Financial statement transparency",
        "Client fund segregation",
        "Regular compliance reporting"
      ]
    }
  ]

  const certifications = [
    {
      name: "ISO 27001",
      description: "Information Security Management",
      status: "Certified",
      icon: Award
    },
    {
      name: "SOC 2 Type II",
      description: "Security & Availability Controls",
      status: "Compliant",
      icon: CheckCircle
    },
    {
      name: "PCI DSS Level 1",
      description: "Payment Card Industry Standards",
      status: "Certified",
      icon: Lock
    },
    {
      name: "GDPR Compliance",
      description: "Data Protection Regulation",
      status: "Compliant",
      icon: Shield
    }
  ]

  const trackRecord = [
    {
      metric: "99.99%",
      label: "Platform Uptime",
      description: "Institutional-grade reliability"
    },
    {
      metric: "Zero",
      label: "Security Incidents",
      description: "Perfect security record"
    },
    {
      metric: "24/7",
      label: "Monitoring",
      description: "Round-the-clock surveillance"
    },
    {
      metric: "$500M",
      label: "Insurance Coverage",
      description: "Client asset protection"
    }
  ]

  const regulatoryJurisdictions = [
    {
      jurisdiction: "United States",
      regulations: ["FinCEN", "CFTC", "SEC"],
      status: "Compliant"
    },
    {
      jurisdiction: "European Union",
      regulations: ["MiFID II", "GDPR", "5AMLD"],
      status: "Compliant"
    },
    {
      jurisdiction: "United Kingdom",
      regulations: ["FCA", "PRA", "MLR"],
      status: "Compliant"
    },
    {
      jurisdiction: "Singapore",
      regulations: ["MAS", "PS Act", "SFA"],
      status: "Compliant"
    }
  ]

  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-b from-navy-dark via-navy to-navy-light">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(215,147,9,0.2)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(215,147,9,0.2)_0%,transparent_50%)]" />
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
            <Shield className="w-4 h-4 text-gold mr-2" />
            <span className="text-gold text-sm font-semibold tracking-wide">SECURITY & COMPLIANCE</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
            Institutional <span className="text-gold">Trust</span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Built with bank-grade security, regulatory compliance, and institutional controls 
            to meet the highest standards of governments and sovereign wealth funds.
          </p>
        </motion.div>

        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="glass-morphism p-8 rounded-2xl border border-gold/20 hover:border-gold/40 transition-all duration-500 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-gold/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-gold" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gold transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-white/70 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="space-y-3">
                  {feature.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center text-white/80">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Track Record */}
        <motion.div
          className="glass-morphism p-10 rounded-3xl border border-gold/30 mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            Our <span className="text-gold">Track Record</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {trackRecord.map((record, index) => (
              <div key={record.label}>
                <div className="text-4xl font-bold text-gold mb-2">{record.metric}</div>
                <div className="text-lg font-semibold text-white mb-1">{record.label}</div>
                <div className="text-sm text-white/60">{record.description}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-4xl font-bold text-white text-center mb-12">
            Certifications & <span className="text-gold">Standards</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={cert.name} className="glass-morphism p-6 rounded-2xl border border-gold/20 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-gold/20 to-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <cert.icon className="w-6 h-6 text-gold" />
                </div>
                
                <h4 className="text-lg font-bold text-white mb-2">{cert.name}</h4>
                <p className="text-white/70 text-sm mb-3">{cert.description}</p>
                
                <div className="inline-flex items-center bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1">
                  <CheckCircle className="w-3 h-3 text-green-400 mr-1" />
                  <span className="text-green-400 text-xs font-semibold">{cert.status}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Regulatory Compliance */}
        <motion.div
          className="glass-morphism p-10 rounded-3xl border border-gold/30 mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            Global <span className="text-gold">Regulatory Compliance</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {regulatoryJurisdictions.map((jurisdiction, index) => (
              <div key={jurisdiction.jurisdiction} className="border border-gold/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-white">{jurisdiction.jurisdiction}</h4>
                  <div className="flex items-center bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1">
                    <CheckCircle className="w-3 h-3 text-green-400 mr-1" />
                    <span className="text-green-400 text-xs font-semibold">{jurisdiction.status}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {jurisdiction.regulations.map((reg, idx) => (
                    <div key={idx} className="flex items-center text-white/80">
                      <Globe className="w-4 h-4 text-gold mr-2 flex-shrink-0" />
                      <span className="text-sm">{reg}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security Promise */}
        <motion.div
          className="glass-morphism p-10 rounded-3xl border border-gold/30 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          viewport={{ once: true }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-gold/20 to-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-gold" />
          </div>
          
          <h3 className="text-3xl font-bold text-white mb-4">
            The Buckingham Vault <span className="text-gold">Security Promise</span>
          </h3>
          <p className="text-white/80 mb-6 max-w-3xl mx-auto leading-relaxed">
            We pledge to maintain the highest standards of security, compliance, and operational 
            excellence. Your assets and data are protected with institutional-grade controls 
            trusted by governments and sovereign wealth funds globally.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="flex items-center justify-center">
              <Lock className="w-6 h-6 text-gold mr-2" />
              <span className="text-white font-semibold">Asset Protection</span>
            </div>
            <div className="flex items-center justify-center">
              <Eye className="w-6 h-6 text-gold mr-2" />
              <span className="text-white font-semibold">Full Transparency</span>
            </div>
            <div className="flex items-center justify-center">
              <Zap className="w-6 h-6 text-gold mr-2" />
              <span className="text-white font-semibold">Continuous Monitoring</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}