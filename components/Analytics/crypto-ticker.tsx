"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"

// Mock data for demonstration. In a real application, this would be fetched from an API.
const cryptoData = [
  { name: "Bitcoin", symbol: "BTC", price: "68,450.78", change: 1.25, logo: "btc.svg" },
  { name: "Ethereum", symbol: "ETH", price: "3,560.12", change: -0.55, logo: "eth.svg" },
  { name: "Tether", symbol: "USDT", price: "1.00", change: 0.01, logo: "usdt.svg" },
  { name: "Solana", symbol: "SOL", price: "150.23", change: 3.78, logo: "sol.svg" },
]

export function CryptoTicker() {
  return (
    <div className="glass-morphism rounded-xl p-6 space-y-4">
      <h3 className="text-xl font-display text-gold">Market Pulse</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cryptoData.map((crypto, index) => (
          <motion.div
            key={crypto.symbol}
            className="bg-navy/50 rounded-lg p-4 space-y-2 border border-gold/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-center space-x-2">
              {/* In a real app, you'd have these SVG logos in /public/images/crypto/ */}
              {/* <Image src={`/images/crypto/${crypto.logo}`} width={24} height={24} alt={`${crypto.name} logo`} /> */}
              <div className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center text-gold font-bold text-xs">
                {crypto.symbol.charAt(0)}
              </div>
              <span className="font-bold text-white">{crypto.name}</span>
              <span className="text-sm text-white/60">{crypto.symbol}</span>
            </div>
            <div className="text-2xl font-sans font-bold text-white">${crypto.price}</div>
            <div className={`flex items-center text-sm ${crypto.change >= 0 ? "text-green-400" : "text-red-400"}`}>
              {crypto.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              <span>{crypto.change.toFixed(2)}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
