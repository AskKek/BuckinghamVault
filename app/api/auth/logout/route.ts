import { NextRequest, NextResponse } from 'next/server'
import { clearSessionCookies } from '@/lib/auth/session'
import { withSecurity } from '@/lib/security/middleware'

async function logoutHandler(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  })

  // Clear session cookies
  await clearSessionCookies(response)

  return response
}

// Apply security middleware - require authentication for logout
export const POST = withSecurity(logoutHandler, {
  requireAuth: true,
  requireCSRF: true,
  rateLimit: {
    identifier: 'logout',
    maxRequests: 10,
    windowMs: 60000 // 1 minute
  }
})