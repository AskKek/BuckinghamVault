import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BuckinghamVaultIcon } from '@/components/Custom-UI/buckingham-vault-icon'
import { Home, Search, FileQuestion } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for could not be found.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-dark to-black flex items-center justify-center px-6">
      <div className="max-w-lg w-full space-y-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <BuckinghamVaultIcon size={80} />
            <div className="absolute -bottom-2 -right-2 bg-navy-600 rounded-full p-2">
              <FileQuestion className="w-6 h-6 text-gold-500" />
            </div>
          </div>
        </div>

        {/* 404 Message */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-display font-bold text-gradient">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            Page Not Found
          </h2>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            asChild
            className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/25"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-gold-500/30 text-gold-500 hover:bg-gold-500/10 px-6 py-3"
          >
            <Link href="/analytics">
              <Search className="w-4 h-4 mr-2" />
              Analytics Dashboard
            </Link>
          </Button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-500 mb-4">Quick links:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link 
              href="/services" 
              className="text-gold-500 hover:text-gold-400 transition-colors"
            >
              Services
            </Link>
            <span className="text-gray-600">•</span>
            <Link 
              href="/about" 
              className="text-gold-500 hover:text-gold-400 transition-colors"
            >
              About Us
            </Link>
            <span className="text-gray-600">•</span>
            <Link 
              href="/contact" 
              className="text-gold-500 hover:text-gold-400 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}