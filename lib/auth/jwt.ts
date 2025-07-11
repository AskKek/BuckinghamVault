import { SignJWT, jwtVerify } from 'jose'
import { nanoid } from 'nanoid'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'buckingham-vault-secret-key-change-in-production'
)

export interface TokenPayload {
  userId: string
  email: string
  role: string
  mandateId?: string
  sessionId: string
  iat: number
  exp: number
}

export async function signToken(payload: Omit<TokenPayload, 'iat' | 'exp' | 'sessionId'>): Promise<string> {
  const sessionId = nanoid()
  const now = Math.floor(Date.now() / 1000)
  
  return await new SignJWT({
    ...payload,
    sessionId,
    iat: now,
    exp: now + (60 * 60 * 24), // 24 hours
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    
    // Type guard to ensure payload has required properties
    if (
      typeof payload === 'object' &&
      payload !== null &&
      'userId' in payload &&
      'email' in payload &&
      'role' in payload &&
      'sessionId' in payload &&
      typeof payload.userId === 'string' &&
      typeof payload.email === 'string' &&
      typeof payload.role === 'string' &&
      typeof payload.sessionId === 'string'
    ) {
      return payload as unknown as TokenPayload
    }
    
    console.error('JWT payload missing required properties')
    return null
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

export async function signRefreshToken(userId: string, sessionId: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  
  return await new SignJWT({
    userId,
    sessionId,
    type: 'refresh',
    iat: now,
    exp: now + (60 * 60 * 24 * 7), // 7 days
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifyRefreshToken(token: string): Promise<{ userId: string; sessionId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    
    if (payload.type !== 'refresh') {
      return null
    }
    
    return {
      userId: payload.userId as string,
      sessionId: payload.sessionId as string
    }
  } catch (error) {
    console.error('Refresh token verification failed:', error)
    return null
  }
}