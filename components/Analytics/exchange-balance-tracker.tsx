"use client"

import { motion } from "framer-motion"
import { Banknote } from "lucide-react"

// Mock data for demonstration.
const exchangeData = [
  { name: "Binance", balance: 580345, color: "bg-yellow-400" },
  { name: "Coinbase", balance: 410876, color: "bg-blue-500" },
  { name: "Bitfinex", balance: 205123, color: "bg-green-500" },
  { name: "Kraken", balance: 150678, color: "bg-purple-500" },
  { name: "Other", balance: 850432, color: "bg-gray-500" },
]

const totalBalance = exchangeData.reduce((acc, ex) => acc + ex.balance, 0)

export function ExchangeBalanceTracker() {
  return (
    <div className="glass-morphism rounded-xl p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-display text-gold">Bitcoin Exchange Balances</h3>
        <div className="flex items-center space-x-2 text-white/80">
          <Banknote className="w-5 h-5 text-gold" />
          <span className="font-sans">
            Total: <span className="font-bold text-white">{totalBalance.toLocaleString()} BTC</span>
          </span>
        </div>
      </div>
      <div className="w-full bg-navy/50 rounded-full h-8 flex overflow-hidden border border-gold/20">
        {exchangeData.map((exchange, index) => (
          <motion.div
            key={exchange.name}
            className={`h-full ${exchange.color} group relative`}
            style={{ 
              width: `${(exchange.balance / totalBalance) * 100}%`,
              transformOrigin: "left"
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 + index * 0.1, ease: "circOut" }}
          >
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-navy rounded-md text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {exchange.name}: {exchange.balance.toLocaleString()} BTC
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {exchangeData.map((exchange) => (
          <div key={exchange.name} className="flex items-center space-x-2 text-sm">
            <div className={`w-3 h-3 rounded-full ${exchange.color}`} />
            <span className="text-white/80">{exchange.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
