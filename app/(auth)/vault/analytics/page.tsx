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
      className="text-white"
    >
      {/* Custom Header for Analytics */}
      <div className="sticky top-0 z-40 bg-navy/80 backdrop-blur-xl border-b border-gold/20">
        <div className="max-w-8xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center ml-16 md:ml-20">
            <div className="flex items-center space-x-4">
              <BuckinghamVaultIcon size={40} />
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-gradient">BV Analytics</h1>
                <p className="text-sm text-white/60">Institutional Market Intelligence Platform</p>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live Data</span>
              </div>
              <div className="flex items-center space-x-2 text-gold">
                <Shield className="w-4 h-4" />
                <span>Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-navy/50 border-b border-gold/10">
        <div className="max-w-8xl mx-auto px-6">
          <nav className="flex flex-wrap gap-x-8 gap-y-2 py-4">
            <a href="#market-pulse" className="flex items-center space-x-2 text-gold border-b-2 border-gold pb-2">
              <Activity className="w-4 h-4" />
              <span className="font-medium">Market Pulse</span>
            </a>
            <a
              href="#bitcoin-analysis"
              className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
            >
              <Bitcoin className="w-4 h-4" />
              <span className="font-medium">Bitcoin Analysis</span>
            </a>
            <a
              href="#liquidity-engine"
              className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
            >
              <Droplets className="w-4 h-4" />
              <span className="font-medium">Liquidity Engine</span>
            </a>
            <a
              href="#exchange-intelligence"
              className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
            >
              <BarChartBig className="w-4 h-4" />
              <span className="font-medium">Exchange Intelligence</span>
            </a>
            <a
              href="#regulatory-center"
              className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
            >
              <Scale className="w-4 h-4" />
              <span className="font-medium">Regulatory Center</span>
            </a>
            <a
              href="#macro-intelligence"
              className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="font-medium">Macro Intelligence</span>
            </a>
            <a
              href="#wallet-forensics"
              className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span className="font-medium">Wallet Forensics</span>
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-6 py-8 space-y-12">
        {/* Market Pulse Section */}
        <section id="market-pulse">
          <EnhancedCryptoTicker />
        </section>

        {/* Bitcoin Analysis Section */}
        <section id="bitcoin-analysis">
          <BitcoinBalancePriceChart />
        </section>

        {/* Liquidity Engine Section */}
        <section id="liquidity-engine">
          <LiquidityAnalysisEngine />
        </section>

        {/* Exchange Intelligence Section */}
        <section id="exchange-intelligence">
          <AdvancedExchangeTracker />
        </section>

        {/* Regulatory Intelligence Section */}
        <section id="regulatory-center">
          <RegulatoryIntelligenceCenter />
        </section>

        {/* Macro Intelligence Section */}
        <section id="macro-intelligence">
          <MacroIntelligenceDashboard />
        </section>

        {/* Wallet Forensics Section */}
        <section id="wallet-forensics">
          <AdvancedWalletForensics />
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-navy/50 border-t border-gold/10 mt-16">
        <div className="max-w-8xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <BuckinghamVaultIcon size={24} />
              <div>
                <p className="text-white font-display font-bold">The Buckingham Vault</p>
                <p className="text-xs text-white/60">Confidential & Proprietary Intelligence</p>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-white/60">
              <span>© 2025 The Buckingham Vault</span>
              <span>•</span>
              <span>All Rights Reserved</span>
              <span>•</span>
              <span>Private Wealth Network</span>
            </div>
          </div>
        </div>
      </footer>
    </PageLayout>
  )
}
