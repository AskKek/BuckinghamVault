import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth/jwt'
import { csrfProtection, generateCSRFToken, setCSRFCookie } from './csrf'
import { rateLimit } from '@/lib/rate-limit'

interface SecurityHeaders {
  [key: string]: string
}

/**
 * Security headers for all responses
 */
const SECURITY_HEADERS: SecurityHeaders = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Enable XSS protection
  'X-XSS-Protection': '1; mode=block',
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Allow inline scripts for Next.js
    "style-src 'self' 'unsafe-inline'", // Allow inline styles
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  
  // Strict Transport Security (HTTPS only)
  ...(process.env.NODE_ENV === 'production' && {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
  }),
}

/**
 * Apply security headers to response
 */
function applySecurityHeaders(response: NextResponse): void {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
}

/**
 * Authentication middleware
 */
export async function authMiddleware(request: NextRequest): Promise<{
  isAuthenticated: boolean
  user?: any
  response?: NextResponse
}> {
  try {
    const sessionCookie = request.cookies.get('session')?.value
    
    if (!sessionCookie) {
      return { isAuthenticated: false }
    }
    
    const payload = await verifyToken(sessionCookie)
    
    if (!payload) {
      // Clear invalid session cookie
      const response = NextResponse.next()
      response.cookies.delete('session')
      response.cookies.delete('refresh-token')
      return { isAuthenticated: false, response }
    }
    
    return { 
      isAuthenticated: true, 
      user: payload 
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    return { isAuthenticated: false }
  }
}

/**
 * CSRF middleware
 */
export function csrfMiddleware(request: NextRequest): {
  isValid: boolean
  response?: NextResponse
} {
  const { isValid, token } = csrfProtection(request)
  
  // For GET requests, ensure CSRF token exists
  if (request.method === 'GET') {
    const response = NextResponse.next()
    
    if (!token) {
      const newToken = generateCSRFToken()
      setCSRFCookie(response, newToken)
    }
    
    return { isValid: true, response }
  }
  
  if (!isValid) {
    const response = NextResponse.json(
      { error: 'CSRF token missing or invalid' },
      { status: 403 }
    )
    return { isValid: false, response }
  }
  
  return { isValid: true }
}

/**
 * Rate limiting middleware
 */
export async function rateLimitMiddleware(
  request: NextRequest,
  identifier: string = 'global',
  maxRequests: number = 100,
  windowMs: number = 60000 // 1 minute
): Promise<{
  allowed: boolean
  response?: NextResponse
}> {
  const result = await rateLimit(request, identifier, maxRequests, windowMs / 1000)
  
  if (!result.success) {
    const response = NextResponse.json(
      { 
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.',
        retryAfter: result.retryAfter 
      },
      { 
        status: 429,
        headers: {
          'Retry-After': result.retryAfter?.toString() || '60'
        }
      }
    )
    
    return { allowed: false, response }
  }
  
  return { allowed: true }
}

/**
 * Combined security middleware
 */
export async function securityMiddleware(
  request: NextRequest,
  options: {
    requireAuth?: boolean
    requireCSRF?: boolean
    rateLimit?: {
      identifier?: string
      maxRequests?: number
      windowMs?: number
    }
  } = {}
): Promise<NextResponse | null> {
  const {
    requireAuth = false,
    requireCSRF = true,
    rateLimit: rateLimitOptions
  } = options
  
  let response = NextResponse.next()
  
  // Apply security headers
  applySecurityHeaders(response)
  
  // Rate limiting
  if (rateLimitOptions) {
    const rateLimitResult = await rateLimitMiddleware(
      request,
      rateLimitOptions.identifier,
      rateLimitOptions.maxRequests,
      rateLimitOptions.windowMs
    )
    
    if (!rateLimitResult.allowed && rateLimitResult.response) {
      applySecurityHeaders(rateLimitResult.response)
      return rateLimitResult.response
    }
  }
  
  // CSRF protection
  if (requireCSRF) {
    const csrfResult = csrfMiddleware(request)
    
    if (!csrfResult.isValid && csrfResult.response) {
      applySecurityHeaders(csrfResult.response)
      return csrfResult.response
    }
    
    if (csrfResult.response) {
      response = csrfResult.response
      applySecurityHeaders(response)
    }
  }
  
  // Authentication
  if (requireAuth) {
    const authResult = await authMiddleware(request)
    
    if (!authResult.isAuthenticated) {
      const unauthorizedResponse = NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
      applySecurityHeaders(unauthorizedResponse)
      return unauthorizedResponse
    }
    
    if (authResult.response) {
      response = authResult.response
      applySecurityHeaders(response)
    }
  }
  
  return response.headers.keys().next().done ? null : response
}

/**
 * API route wrapper with security middleware
 */
export function withSecurity(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>,
  options: Parameters<typeof securityMiddleware>[1] = {}
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    // Apply security middleware
    const securityResponse = await securityMiddleware(request, options)
    
    if (securityResponse && securityResponse.status !== 200) {
      return securityResponse
    }
    
    try {
      // Execute the original handler
      const response = await handler(request, context)
      
      // Apply security headers to the response
      applySecurityHeaders(response)
      
      return response
    } catch (error) {
      console.error('API handler error:', error)
      
      const errorResponse = NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
      
      applySecurityHeaders(errorResponse)
      return errorResponse
    }
  }
}