import type { Metadata } from 'next'
import { ContactForm } from '@/components/Home/contact-form'
import { PageLayout } from '@/components/page-layout'
import { Shield, Lock, Globe, Clock, Star, Crown } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Connect with our team of digital asset wealth management specialists. Confidential consultations for high-net-worth individuals, family offices, and institutions.',
  openGraph: {
    title: 'Contact The Buckingham Vault | Private Consultation',
    description: 'Schedule a confidential consultation with our digital asset wealth management specialists.',
  },
}

export default function ContactPage() {
  return (
    <PageLayout 
      title="Contact" 
      subtitle="Connect with Our Wealth Specialists"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Left Column - Information */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-2">
                <Crown className="w-4 h-4 text-gold" />
                <span className="text-gold text-sm font-medium">Confidential Consultation</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
                Connect with Our 
                <span className="text-gradient block">Wealth Specialists</span>
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed">
                Schedule a private consultation to discuss your digital asset wealth management needs. 
                Our team provides personalized solutions for high-net-worth individuals, family offices, 
                and institutional clients.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="glass-morphism rounded-xl p-6 luxury-border">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-semibold text-white">Bank-Grade Security</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  All communications are encrypted and protected under Swiss banking privacy standards.
                </p>
              </div>

              <div className="glass-morphism rounded-xl p-6 luxury-border">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-semibold text-white">24-Hour Response</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Our senior advisors will contact you within 24 hours to schedule your consultation.
                </p>
              </div>

              <div className="glass-morphism rounded-xl p-6 luxury-border">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-semibold text-white">Global Compliance</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Fully compliant with international financial regulations and privacy laws.
                </p>
              </div>

              <div className="glass-morphism rounded-xl p-6 luxury-border">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-semibold text-white">Premium Service</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Personalized service from our most experienced wealth management professionals.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="glass-morphism rounded-xl p-6 luxury-border">
              <h3 className="font-semibold text-white mb-4 flex items-center space-x-2">
                <Lock className="w-5 h-5 text-gold" />
                <span>Alternative Contact Methods</span>
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white">contact@buckinghamvault.com</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-gray-400">Phone (Secure Line):</span>
                  <span className="text-white">+41 XX XXX XXXX</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-400">Office Hours:</span>
                  <span className="text-white">24/7 by appointment</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gold/10 border border-gold/20 rounded-lg">
                <p className="text-xs text-gold/80">
                  For urgent matters requiring immediate attention, please indicate &quot;URGENT&quot; in your message subject.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:sticky lg:top-24">
            <ContactForm />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}