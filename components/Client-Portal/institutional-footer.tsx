"use client"

import { motion } from "framer-motion"
import { Crown, Mail, Phone, Shield, Globe, Users, Building, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function InstitutionalFooter() {
  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "Mandate Member Portal", href: "#mandate" },
        { name: "Client Portal", href: "#client" },
        { name: "Brightpool Exchange", href: "#brightpool" },
        { name: "OTC Capabilities", href: "#otc" }
      ]
    },
    {
      title: "Services",
      links: [
        { name: "Large Block Trading", href: "#trading" },
        { name: "Asset Classes", href: "#assets" },
        { name: "Institutional Custody", href: "#custody" },
        { name: "Regulatory Compliance", href: "#compliance" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Market Intelligence", href: "#intelligence" },
        { name: "Documentation", href: "#docs" },
        { name: "API Reference", href: "#api" },
        { name: "Support Center", href: "#support" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#about" },
        { name: "Leadership", href: "#leadership" },
        { name: "Careers", href: "#careers" },
        { name: "Press", href: "#press" }
      ]
    }
  ]

  const contactInfo = [
    {
      icon: Mail,
      title: "Institutional Inquiries",
      details: "institutions@buckinghamvault.com",
      subtitle: "Governments & sovereign funds"
    },
    {
      icon: Users,
      title: "Mandate Member Support",
      details: "mandates@buckinghamvault.com",
      subtitle: "Deal facilitators & professionals"
    },
    {
      icon: Phone,
      title: "24/7 Support Hotline",
      details: "+1 (555) 123-VAULT",
      subtitle: "Emergency trading support"
    },
  ]

  const legalLinks = [
    "Privacy Policy",
    "Terms of Service",
    "Risk Disclosure",
    "Regulatory Compliance",
    "Data Protection",
    "Cookie Policy"
  ]

  return (
    <footer className="relative bg-gradient-to-b from-navy-dark to-black border-t border-gold/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(215,147,9,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(215,147,9,0.15)_0%,transparent_50%)]" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Company Info & Contact */}
            <div>
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold via-gold-light to-gold rounded-full flex items-center justify-center">
                    <Crown className="h-8 w-8 text-navy" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-white">
                      The Buckingham Vault
                    </h3>
                    <p className="text-gold font-light tracking-wider">
                      Institutional OTC Trading Platform
                    </p>
                  </div>
                </div>
                
                <p className="text-white/70 leading-relaxed mb-6">
                  The world's most sophisticated platform for large-block institutional OTC transactions, 
                  serving governments, sovereign wealth funds, and global financial institutions with 
                  unparalleled discretion and white-glove service.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center bg-gold/10 border border-gold/20 rounded-full px-4 py-2">
                    <Shield className="w-4 h-4 text-gold mr-2" />
                    <span className="text-gold text-sm font-semibold">Bank-Grade Security</span>
                  </div>
                  <div className="flex items-center bg-gold/10 border border-gold/20 rounded-full px-4 py-2">
                    <Globe className="w-4 h-4 text-gold mr-2" />
                    <span className="text-gold text-sm font-semibold">Global Compliance</span>
                  </div>
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h4 className="text-xl font-bold text-white mb-6">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {contactInfo.map((contact, index) => (
                    <div key={contact.title} className="flex items-start">
                      <div className="w-10 h-10 bg-gradient-to-br from-gold/20 to-gold/10 rounded-lg flex items-center justify-center mr-4 mt-1">
                        <contact.icon className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-white mb-1">{contact.title}</h5>
                        <p className="text-gold text-sm mb-1">{contact.details}</p>
                        <p className="text-white/60 text-xs">{contact.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Footer Navigation */}
            <div>
              <motion.div
                className="grid grid-cols-2 gap-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                {footerSections.map((section, index) => (
                  <div key={section.title}>
                    <h4 className="text-lg font-bold text-white mb-6">{section.title}</h4>
                    <ul className="space-y-3">
                      {section.links.map((link, linkIndex) => (
                        <li key={link.name}>
                          <a 
                            href={link.href} 
                            className="text-white/70 hover:text-gold transition-colors duration-300 text-sm"
                          >
                            {link.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </motion.div>

              {/* Newsletter/Updates */}
              <motion.div
                className="mt-12 p-6 glass-morphism rounded-2xl border border-gold/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <h4 className="text-lg font-bold text-white mb-3">Stay Informed</h4>
                <p className="text-white/70 text-sm mb-4">
                  Receive exclusive market intelligence and platform updates for institutional clients.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="institutional@email.com"
                    className="flex-1 bg-navy/50 border border-gold/30 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-gold"
                  />
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-gold to-gold-light text-navy font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="py-8 border-t border-gold/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8 mb-4 md:mb-0">
              <p className="text-white/60 text-sm">
                © 2025 The Buckingham Vault. All rights reserved.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              {legalLinks.map((link, index) => (
                <a
                  key={link}
                  href="#"
                  className="text-white/60 hover:text-gold transition-colors duration-300 text-xs"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Regulatory Disclaimer */}
        <motion.div
          className="py-6 border-t border-gold/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <p className="text-white/40 text-xs leading-relaxed max-w-4xl mx-auto">
              <strong>Regulatory Disclaimer:</strong> The Buckingham Vault is a professional trading platform 
              exclusively for institutional clients. Services are provided in compliance with applicable 
              financial regulations. Past performance does not guarantee future results. Large-block OTC 
              trading involves significant risks and is suitable only for sophisticated institutional investors. 
              Platform access is subject to verification and approval. All transactions are recorded and 
              reported in accordance with applicable regulations.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}