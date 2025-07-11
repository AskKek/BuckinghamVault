'use client'

import { BuckinghamVaultIcon } from '@/components/Custom-UI/buckingham-vault-icon'
import { Button } from '@/components/ui/button'
import { WifiOff, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-dark to-black flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <BuckinghamVaultIcon size={80} />
            <div className="absolute -bottom-2 -right-2 bg-orange-500 rounded-full p-2">
              <WifiOff className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Offline Message */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
            You're Offline
          </h1>
          <p className="text-gray-400 text-lg max-w-sm mx-auto">
            It looks like you've lost your internet connection. Some features may be limited 
            while you're offline.
          </p>
        </div>

        {/* Status */}
        <div className="glass-morphism rounded-xl p-6 luxury-border space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-orange-400 font-medium">Connection Status: Offline</span>
          </div>
          
          <div className="text-sm text-gray-500 space-y-2">
            <p>• Cached pages will continue to work</p>
            <p>• Form submissions will be saved for later</p>
            <p>• Real-time data may be unavailable</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/25"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-gold-500/30 text-gold-500 hover:bg-gold-500/10 px-6 py-3"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
        </div>

        {/* Cached Content Notice */}
        <div className="text-xs text-gray-600 space-y-2">
          <p>
            Previously visited pages may still be available from your browser's cache.
          </p>
          <p>
            Your connection will be restored automatically when internet access returns.
          </p>
        </div>

        {/* Real-time connection status */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Monitor connection status
              function updateConnectionStatus() {
                const isOnline = navigator.onLine;
                if (isOnline) {
                  // Redirect to homepage when back online
                  window.location.href = '/';
                }
              }
              
              window.addEventListener('online', updateConnectionStatus);
              window.addEventListener('offline', updateConnectionStatus);
              
              // Check every 5 seconds
              setInterval(updateConnectionStatus, 5000);
            `,
          }}
        />
      </div>
    </div>
  )
}