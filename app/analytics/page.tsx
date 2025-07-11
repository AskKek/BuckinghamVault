import type { Metadata } from "next"
import EnhancedCryptoTicker from "@/components/Analytics/enhanced-crypto-ticker"
import AdvancedExchangeTracker from "@/components/Analytics/advanced-exchange-tracker"
import AdvancedWalletForensics from "@/components/Analytics/advanced-wallet-forensics"
import BitcoinBalancePriceChart from "@/components/Analytics/bitcoin-balance-price-chart"
import LiquidityAnalysisEngine from "@/components/Analytics/liquidity-analysis-engine"
import RegulatoryIntelligenceCenter from "@/components/Analytics/regulatory-intelligence-center"
import MacroIntelligenceDashboard from "@/components/Analytics/macro-intelligence-dashboard"
import { PageLayout } from "@/components/page-layout"
import { Shield, Activity, BarChartBig, Bitcoin, Droplets, Scale, Globe } from "lucide-react"
import { BuckinghamVaultIcon } from "@/components/Custom-UI/buckingham-vault-icon"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Analytics Dashboard',
  description: 'Advanced institutional market intelligence platform for digital asset analysis, portfolio tracking, and regulatory compliance.',
  openGraph: {
    title: 'BV Analytics | Institutional Market Intelligence',
    description: 'Real-time digital asset analytics, wallet forensics, and regulatory intelligence for institutional investors.',
  },
}

export default function AnalyticsPage() {
  return (
    <PageLayout 
      title="" 
      subtitle=""
      showBackButton={false}
      className="min-h-screen bg-gradient-to-br from-gold via-gold-light to-gold"
    >
        {/* Revolutionary Gold Header */}
        <div className="sticky top-0 z-40 bg-gradient-to-r from-gold/95 via-gold-light/95 to-gold/95 backdrop-blur-xl border-b border-navy/20 shadow-lg">
          <div className="max-w-8xl mx-auto px-6 py-6">
            <div className="flex justify-between items-center ml-16 md:ml-20">
              <div className="flex items-center space-x-4">
                <BuckinghamVaultIcon size={40} />
                <div>
                  <h1 className="text-3xl md:text-4xl font-display font-light text-white drop-shadow-sm">
                    BV <span className="font-medium text-navy">Analytics</span>
                  </h1>
                  <p className="text-sm text-navy/80 font-light">Digital Asset Intelligence Platform</p>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse shadow-sm"></div>
                  <span className="font-medium">Live Data</span>
                </div>
                <div className="flex items-center space-x-2 text-navy">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Royal Navigation on Gold */}
        <div className="bg-gradient-to-r from-gold/30 via-gold-light/20 to-gold/30 border-b border-navy/10 shadow-sm">
          <div className="max-w-8xl mx-auto px-6">
            <div className="bg-navy/90 rounded-lg mx-4 my-3 shadow-xl border border-gold/30">
              <nav className="flex flex-wrap gap-x-8 gap-y-2 py-4 px-6">
                <a href="#market-pulse" className="flex items-center space-x-2 text-gold border-b-2 border-gold pb-2 font-medium">
                  <Activity className="w-4 h-4" />
                  <span>Crypto Market Pulse</span>
                </a>
                <a
                  href="#bitcoin-analysis"
                  className="flex items-center space-x-2 text-white/70 hover:text-gold transition-colors font-medium"
                >
                  <Bitcoin className="w-4 h-4" />
                  <span>Bitcoin Intelligence</span>
                </a>
                <a
                  href="#liquidity-engine"
                  className="flex items-center space-x-2 text-white/70 hover:text-gold transition-colors font-medium"
                >
                  <Droplets className="w-4 h-4" />
                  <span>Liquidity Analytics</span>
                </a>
                <a
                  href="#exchange-intelligence"
                  className="flex items-center space-x-2 text-white/70 hover:text-gold transition-colors font-medium"
                >
                  <BarChartBig className="w-4 h-4" />
                  <span>Exchange Flow</span>
                </a>
                <a
                  href="#regulatory-center"
                  className="flex items-center space-x-2 text-white/70 hover:text-gold transition-colors font-medium"
                >
                  <Scale className="w-4 h-4" />
                  <span>Compliance Hub</span>
                </a>
                <a
                  href="#macro-intelligence"
                  className="flex items-center space-x-2 text-white/70 hover:text-gold transition-colors font-medium"
                >
                  <Globe className="w-4 h-4" />
                  <span>Macro Analytics</span>
                </a>
                <a
                  href="#wallet-forensics"
                  className="flex items-center space-x-2 text-white/70 hover:text-gold transition-colors font-medium"
                >
                  <Shield className="w-4 h-4" />
                  <span>Blockchain Forensics</span>
                </a>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content - Navy Cards on Gold Background */}
        <div className="max-w-8xl mx-auto px-6 py-8 space-y-12">
          {/* Market Pulse Section */}
          <section id="market-pulse" className="bg-navy/95 rounded-xl p-6 shadow-2xl border-2 border-gold/30 backdrop-blur-sm">
            <EnhancedCryptoTicker />
          </section>

          {/* Bitcoin Analysis Section */}
          <section id="bitcoin-analysis" className="bg-navy/95 rounded-xl p-6 shadow-2xl border-2 border-gold/30 backdrop-blur-sm">
            <BitcoinBalancePriceChart />
          </section>

          {/* Liquidity Engine Section */}
          <section id="liquidity-engine" className="bg-navy/95 rounded-xl p-6 shadow-2xl border-2 border-gold/30 backdrop-blur-sm">
            <LiquidityAnalysisEngine />
          </section>

          {/* Exchange Intelligence Section */}
          <section id="exchange-intelligence" className="bg-navy/95 rounded-xl p-6 shadow-2xl border-2 border-gold/30 backdrop-blur-sm">
            <AdvancedExchangeTracker />
          </section>

          {/* Regulatory Intelligence Section */}
          <section id="regulatory-center" className="bg-navy/95 rounded-xl p-6 shadow-2xl border-2 border-gold/30 backdrop-blur-sm">
            <RegulatoryIntelligenceCenter />
          </section>

          {/* Macro Intelligence Section */}
          <section id="macro-intelligence" className="bg-navy/95 rounded-xl p-6 shadow-2xl border-2 border-gold/30 backdrop-blur-sm">
            <MacroIntelligenceDashboard />
          </section>

          {/* Wallet Forensics Section */}
          <section id="wallet-forensics" className="bg-navy/95 rounded-xl p-6 shadow-2xl border-2 border-gold/30 backdrop-blur-sm">
            <AdvancedWalletForensics />
          </section>
        </div>

        {/* Royal Footer on Gold */}
        <footer className="bg-gradient-to-r from-gold/20 via-gold-light/10 to-gold/20 border-t border-navy/20 mt-16">
          <div className="max-w-8xl mx-auto px-6 py-8">
            <div className="bg-navy/90 rounded-lg p-6 shadow-xl border border-gold/30">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-3">
                  <BuckinghamVaultIcon size={24} />
                  <div>
                    <p className="text-white font-display font-bold">The Buckingham Vault</p>
                    <p className="text-xs text-gold/80">Digital Asset Intelligence</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm text-white/80">
                  <span>© 2025 The Buckingham Vault</span>
                  <span className="text-gold">•</span>
                  <span>All Rights Reserved</span>
                  <span className="text-gold">•</span>
                  <span>Sovereign Crypto Analytics</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
    </PageLayout>
  )
}
