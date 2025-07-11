"use client"

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSecureAuthSafe } from '@/hooks/use-secure-auth'
import { UnifiedAuthPortal } from '@/components/Authentication/unified-auth-portal'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function LoginPage() {
  const { user, isLoading } = useSecureAuthSafe()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/vault'
  const [showAuthPortal] = useState(true)

  useEffect(() => {
    if (!isLoading && user) {
      router.push(redirect)
    }
  }, [user, isLoading, router, redirect])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <>
      <UnifiedAuthPortal 
        isOpen={showAuthPortal}
        onClose={() => {
          // Redirect to home page when closed without login
          router.push('/')
        }}
      />
    </>
  )
}