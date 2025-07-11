import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, signToken, TokenPayload } from './jwt'
import { User } from '@/types/financial'

export interface SessionData {
  user: User
  sessionId: string
  expiresAt: Date
}

const SESSION_COOKIE_NAME = 'buckingham-session'
const REFRESH_COOKIE_NAME = 'buckingham-refresh'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
}

export async function createSession(user: User): Promise<{ accessToken: string; refreshToken: string; sessionId: string }> {
  const { signToken: createAccessToken, signRefreshToken } = await import('./jwt')
  
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const accessToken = await createAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    mandateId: user.mandateId,
  })
  
  const refreshToken = await signRefreshToken(user.id, sessionId)
  
  return { accessToken, refreshToken, sessionId }
}

export async function setSessionCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
): Promise<void> {
  response.cookies.set(SESSION_COOKIE_NAME, accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24, // 24 hours
  })
  
  response.cookies.set(REFRESH_COOKIE_NAME, refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function getSessionFromCookies(): Promise<TokenPayload | null> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value
  
  if (!sessionToken) {
    return null
  }
  
  return await verifyToken(sessionToken)
}

export async function getSessionFromRequest(request: NextRequest): Promise<TokenPayload | null> {
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value
  
  if (!sessionToken) {
    return null
  }
  
  return await verifyToken(sessionToken)
}

export async function clearSessionCookies(response: NextResponse): Promise<void> {
  response.cookies.delete(SESSION_COOKIE_NAME)
  response.cookies.delete(REFRESH_COOKIE_NAME)
}

export async function refreshSession(request: NextRequest): Promise<{
  accessToken: string;
  refreshToken: string;
} | null> {
  const { verifyRefreshToken, signRefreshToken } = await import('./jwt')
  const { getUserById } = await import('./users')
  
  const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value
  
  if (!refreshToken) {
    return null
  }
  
  const refreshPayload = await verifyRefreshToken(refreshToken)
  if (!refreshPayload) {
    return null
  }
  
  const user = await getUserById(refreshPayload.userId)
  if (!user || !user.isActive) {
    return null
  }
  
  const newAccessToken = await signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    mandateId: user.mandateId,
  })
  
  const newRefreshToken = await signRefreshToken(user.id, refreshPayload.sessionId)
  
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  }
}

export function requireAuth(handler: (request: NextRequest, session: TokenPayload) => Promise<Response>) {
  return async (request: NextRequest): Promise<Response> => {
    const session = await getSessionFromRequest(request)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    return handler(request, session)
  }
}

export function requireRole(roles: string[], handler: (request: NextRequest, session: TokenPayload) => Promise<Response>) {
  return requireAuth(async (request: NextRequest, session: TokenPayload) => {
    if (!roles.includes(session.role)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }
    
    return handler(request, session)
  })
}