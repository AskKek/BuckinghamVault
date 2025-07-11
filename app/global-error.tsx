'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-6">
          <div className="max-w-md w-full space-y-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-red-500/10 p-4 rounded-full">
                <AlertTriangle className="w-16 h-16 text-red-500" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-white">
                Critical Application Error
              </h1>
              <p className="text-gray-400">
                A critical error occurred. Please refresh the page or try again later.
              </p>
            </div>

            <Button
              onClick={reset}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reload Application
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}