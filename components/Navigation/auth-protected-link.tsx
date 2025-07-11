"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { useSecureAuthSafe } from '@/hooks/use-secure-auth'

interface AuthProtectedLinkProps {
  href: string
  requireAuth?: boolean
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent) => void
}

export function AuthProtectedLink({ 
  href, 
  requireAuth = true, 
  children, 
  className,
  onClick 
}: AuthProtectedLinkProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useSecureAuthSafe()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    
    // Call the original onClick if provided
    if (onClick) {
      onClick(e)
    }

    // If authentication is required and user is not authenticated, redirect to login
    if (requireAuth && !isAuthenticated && !isLoading) {
      router.push(`/login?redirect=${encodeURIComponent(href)}`)
    } else {
      // Otherwise, navigate to the intended destination
      router.push(href)
    }
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}