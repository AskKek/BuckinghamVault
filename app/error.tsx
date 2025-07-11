'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BuckinghamVaultIcon } from '@/components/Custom-UI/buckingham-vault-icon'
import { AlertTriangle, Home, RotateCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
    
    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error)
    }
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-dark to-black flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <BuckinghamVaultIcon size={80} />
            <div className="absolute -bottom-2 -right-2 bg-red-500 rounded-full p-2">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
            Something went wrong
          </h1>
          <p className="text-gray-400 text-lg max-w-sm mx-auto">
            We apologize for the inconvenience. Our team has been notified and is working to resolve the issue.
          </p>
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400 font-mono">{error.message}</p>
              {error.digest && (
                <p className="text-xs text-red-400/70 mt-2">Error ID: {error.digest}</p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            onClick={reset}
            className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/25"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-gold-500/30 text-gold-500 hover:bg-gold-500/10 px-6 py-3"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Link>
          </Button>
        </div>

        {/* Support Link */}
        <p className="text-sm text-gray-500 mt-8">
          Need assistance?{' '}
          <Link href="/contact" className="text-gold-500 hover:text-gold-400 transition-colors">
            Contact our support team
          </Link>
        </p>
      </div>
    </div>
  )
}