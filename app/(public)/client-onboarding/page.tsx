import type { Metadata } from 'next'
import { ClientOnboardingForm } from '@/components/Home/client-onboarding-form'
import { PageLayout } from '@/components/page-layout'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Client Onboarding & KYC | The Buckingham Vault',
  description: 'Complete our comprehensive Know Your Customer process to access institutional-grade cryptocurrency exchange services with bright pools and forensic rating system.',
  keywords: [
    'KYC onboarding',
    'cryptocurrency exchange',
    'institutional trading',
    'Bitcoin forensic rating',
    'bright pools',
    'digital asset custody',
    'OTC trading',
    'compliance verification'
  ],
  openGraph: {
    title: 'Client Onboarding & KYC | The Buckingham Vault',
    description: 'Join our exclusive institutional cryptocurrency exchange. Complete KYC to access zero-slippage trading, forensic-rated Bitcoin, and bright pool infrastructure.',
    type: 'website',
    images: [{
      url: '/images/client-onboarding-og.jpg',
      width: 1200,
      height: 630,
      alt: 'Buckingham Vault Client Onboarding'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Client Onboarding & KYC | The Buckingham Vault',
    description: 'Join our exclusive institutional cryptocurrency exchange. Complete KYC to access zero-slippage trading and forensic-rated Bitcoin.',
  }
}

export default function ClientOnboardingPage() {
  return (
    <PageLayout 
      title="Client Onboarding" 
      subtitle="KYC & Exchange Access"
      className="overflow-hidden"
    >
      <ClientOnboardingForm />
    </PageLayout>
  )
}