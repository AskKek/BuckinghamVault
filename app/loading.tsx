import { BuckinghamVaultIcon } from '@/components/Custom-UI/buckingham-vault-icon'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-dark to-black flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        {/* Animated Logo */}
        <div className="relative">
          <div className="animate-pulse">
            <BuckinghamVaultIcon size={80} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-gold-500/20 to-gold-600/20 rounded-full animate-ping" />
        </div>
        
        {/* Loading Text */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-white">Loading</h2>
          <p className="text-gray-400 text-sm">Preparing your experience...</p>
        </div>
        
        {/* Loading Animation */}
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}
