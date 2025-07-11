"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useSecureAuth } from '@/hooks/use-secure-auth'
import { SecureLoginForm } from '@/components/Authentication/auth/secure-login-form'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ClientLayoutWrapper } from '@/components/Client-Portal/client-layout-wrapper'

function SecureLoginPageContent() {
  const { user, isLoading } = useSecureAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/vault')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-navy-light to-navy">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-light to-navy flex items-center justify-center p-4">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_gold/30_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_gold/30_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,_gold/30_0%,_transparent_50%)]" />
        
        {/* Floating particles */}
        <motion.div
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-gold/20 rounded-full"
        />
        <motion.div
          animate={{
            y: [20, -20, 20],
            x: [10, -10, 10],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-3/4 right-1/4 w-1 h-1 bg-gold/30 rounded-full"
        />
        <motion.div
          animate={{
            y: [-15, 15, -15],
            x: [5, -5, 5],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-gold/25 rounded-full"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <SecureLoginForm onSuccess={() => router.push('/vault')} />
      </motion.div>
    </div>
  )
}

export default function SecureLoginPage() {
  return (
    <ClientLayoutWrapper includeAuth={true}>
      <SecureLoginPageContent />
    </ClientLayoutWrapper>
  )
}