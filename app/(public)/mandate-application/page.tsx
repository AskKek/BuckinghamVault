import type { Metadata } from 'next'
import { MandateApplicationForm } from '@/components/Home/mandate-application-form'
import { PageLayout } from '@/components/page-layout'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Mandate Application | The Buckingham Vault',
  description: 'Submit a mandate for large over-the-counter cryptocurrency transactions. Access our matching engine, bright pools, and zero-slippage execution with forensic-rated Bitcoin.',
  keywords: [
    'OTC cryptocurrency trading',
    'mandate application', 
    'bright pools',
    'zero slippage execution',
    'Bitcoin forensic rating',
    'institutional trading',
    'counterparty matching',
    'commission distribution',
    'large block transactions'
  ],
  openGraph: {
    title: 'Mandate Application | The Buckingham Vault',
    description: 'Submit mandates for institutional cryptocurrency transactions. Our matching engine provides zero-slippage execution through bright pools with hourly indexed pricing.',
    type: 'website',
    images: [{
      url: '/images/mandate-application-og.jpg',
      width: 1200,
      height: 630,
      alt: 'Buckingham Vault Mandate Application'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mandate Application | The Buckingham Vault', 
    description: 'Submit mandates for institutional cryptocurrency transactions with zero-slippage execution and forensic-rated Bitcoin.',
  }
}

export default function MandateApplicationPage() {
  return (
    <PageLayout 
      title="Mandate Application" 
      subtitle="OTC Trading & Counterparty Matching"
      className="overflow-hidden"
    >
      <MandateApplicationForm />
    </PageLayout>
  )
}