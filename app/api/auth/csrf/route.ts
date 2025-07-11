import { NextRequest, NextResponse } from 'next/server'
import { generateCSRFToken, setCSRFCookie } from '@/lib/security/csrf'
import { withSecurity } from '@/lib/security/middleware'

/**
 * Get CSRF token endpoint
 * Generates and returns a CSRF token for client-side use
 */
async function handler(request: NextRequest): Promise<NextResponse> {
  const token = generateCSRFToken()
  const response = NextResponse.json({ 
    csrfToken: token,
    success: true 
  })
  
  setCSRFCookie(response, token)
  
  return response
}

// Apply security middleware without CSRF requirement (since we're generating the token)
export const GET = withSecurity(handler, {
  requireAuth: false,
  requireCSRF: false,
  rateLimit: {
    identifier: 'csrf-token',
    maxRequests: 10,
    windowMs: 60000 // 1 minute
  }
})