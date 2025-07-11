import { NextRequest, NextResponse } from 'next/server'
import { refreshSession, setSessionCookies } from '@/lib/auth/session'
import { withSecurity } from '@/lib/security/middleware'

async function refreshHandler(request: NextRequest): Promise<NextResponse> {
  const tokens = await refreshSession(request)
  
  if (!tokens) {
    return NextResponse.json(
      { 
        error: 'Invalid refresh token',
        message: 'Please log in again'
      },
      { status: 401 }
    )
  }

  const response = NextResponse.json({
    success: true,
    message: 'Session refreshed successfully'
  })

  // Set new session cookies
  await setSessionCookies(response, tokens.accessToken, tokens.refreshToken)

  return response
}

// Apply security middleware - no auth required (using refresh token) but require CSRF
export const POST = withSecurity(refreshHandler, {
  requireAuth: false, // Refresh tokens are used when access token is expired
  requireCSRF: true,
  rateLimit: {
    identifier: 'auth-refresh',
    maxRequests: 20,
    windowMs: 60000 // 1 minute
  }
})