import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth/session'
import { getUserById } from '@/lib/auth/users'
import { withSecurity } from '@/lib/security/middleware'

async function meHandler(request: NextRequest): Promise<NextResponse> {
  const session = await getSessionFromRequest(request)
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Get fresh user data
  const user = await getUserById(session.userId)
  if (!user || !user.isActive) {
    return NextResponse.json(
      { error: 'User not found or inactive' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      mandateId: user.mandateId,
      permissions: user.permissions,
      lastLogin: user.lastLogin,
      isActive: user.isActive
    }
  })
}

// Apply security middleware - require authentication but no CSRF for GET requests
export const GET = withSecurity(meHandler, {
  requireAuth: true,
  requireCSRF: false, // GET requests don't need CSRF protection
  rateLimit: {
    identifier: 'auth-me',
    maxRequests: 30,
    windowMs: 60000 // 1 minute
  }
})