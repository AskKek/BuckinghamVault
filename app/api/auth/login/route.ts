import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { authenticateUser } from '@/lib/auth/users'
import { createSession, setSessionCookies } from '@/lib/auth/session'
import { withSecurity } from '@/lib/security/middleware'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().optional() // Password no longer required for demo
})

async function loginHandler(request: NextRequest): Promise<NextResponse> {
  const body = await request.json()
  
  // Validate request body
  const validation = loginSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      { 
        error: 'Invalid input',
        details: validation.error.errors
      },
      { status: 400 }
    )
  }

  const { email, password = '' } = validation.data

  // Authenticate user
  const user = await authenticateUser({ email, password })
  if (!user) {
    return NextResponse.json(
      { 
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      },
      { status: 401 }
    )
  }

  // Create session
  const { accessToken, refreshToken } = await createSession(user)

  // Create response
  const response = NextResponse.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      mandateId: user.mandateId,
      permissions: user.permissions,
      lastLogin: user.lastLogin
    }
  })

  // Set secure HTTP-only cookies
  await setSessionCookies(response, accessToken, refreshToken)

  return response
}

// Apply security middleware with rate limiting for login attempts
export const POST = withSecurity(loginHandler, {
  requireAuth: false,
  requireCSRF: true,
  rateLimit: {
    identifier: 'login',
    maxRequests: 5,
    windowMs: 60000 // 1 minute
  }
})