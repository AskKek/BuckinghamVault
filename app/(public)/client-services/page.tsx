import { InstitutionalHeroSection } from '@/components/Client-Portal/institutional-hero-section'
import { TrustIndicatorsSection } from '@/components/Client-Portal/trust-indicators-section'
import { InstitutionalClienteleSection } from '@/components/Client-Portal/institutional-clientele-section'
import { OTCCapabilitiesSection } from '@/components/Client-Portal/otc-capabilities-section'
import { InstitutionalServicesSection } from '@/components/Client-Portal/institutional-services-section'
import { InstitutionalFooter } from '@/components/Client-Portal/institutional-footer'
import { ClientLayoutWrapper } from '@/components/Client-Portal/client-layout-wrapper'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Client Services | The Buckingham Vault',
  description: 'Institutional-grade digital asset management services for family offices, sovereign wealth funds, and private wealth managers. Experience the convergence of traditional banking excellence with digital innovation.',
  keywords: [
    'institutional services',
    'digital asset management',
    'private wealth',
    'OTC trading',
    'family office services',
    'sovereign wealth management',
    'cryptocurrency custody',
    'institutional banking'
  ],
  openGraph: {
    title: 'Client Services - The Buckingham Vault',
    description: 'Where Digital Sovereignty Meets Private Wealth Excellence',
    type: 'website',
    images: [{
      url: '/images/client-services-og.png',
      width: 1200,
      height: 630,
      alt: 'The Buckingham Vault Client Services'
    }]
  }
}

export default function ClientServicesPage() {
  return (
    <ClientLayoutWrapper>
      <main className="relative">
        {/* Institutional Hero Section with Interactive Liquid Gold Background */}
        <InstitutionalHeroSection />
        
        {/* Trust Indicators - Security and Compliance - HIDDEN FOR REIMPLEMNTATION */}
        {/* <TrustIndicatorsSection /> */}
        
        {/* Target Clientele - HIDDEN FOR REIMPLEMNTATION */}
        {/* <InstitutionalClienteleSection /> */}
        
        {/* OTC Trading Capabilities */}
        <OTCCapabilitiesSection />
        
        {/* Comprehensive Service Offerings */}
        <InstitutionalServicesSection />
        
        {/* Institutional Footer */}
        <InstitutionalFooter />
      </main>
    </ClientLayoutWrapper>
  )
}