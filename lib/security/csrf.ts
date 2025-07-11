import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'

const CSRF_TOKEN_NAME = 'csrf-token'
const CSRF_HEADER_NAME = 'x-csrf-token'
const CSRF_COOKIE_OPTIONS = {
  httpOnly: false, // CSRF tokens need to be accessible to JavaScript
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 60 * 60 * 24, // 24 hours
}

/**
 * Generate a new CSRF token
 */
export function generateCSRFToken(): string {
  return nanoid(32)
}

/**
 * Set CSRF token in cookies
 */
export function setCSRFCookie(response: NextResponse, token: string): void {
  response.cookies.set(CSRF_TOKEN_NAME, token, CSRF_COOKIE_OPTIONS)
}

/**
 * Get CSRF token from cookies
 */
export function getCSRFToken(request: NextRequest): string | undefined {
  return request.cookies.get(CSRF_TOKEN_NAME)?.value
}

/**
 * Get CSRF token from headers
 */
export function getCSRFHeader(request: NextRequest): string | undefined {
  return request.headers.get(CSRF_HEADER_NAME) || undefined
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(request: NextRequest): boolean {
  const cookieToken = getCSRFToken(request)
  const headerToken = getCSRFHeader(request)
  
  if (!cookieToken || !headerToken) {
    return false
  }
  
  return cookieToken === headerToken
}

/**
 * CSRF protection middleware
 */
export function csrfProtection(request: NextRequest): { isValid: boolean; token?: string } {
  const method = request.method
  
  // Skip CSRF protection for safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return { isValid: true }
  }
  
  // For state-changing methods, validate CSRF token
  const isValid = validateCSRFToken(request)
  
  if (!isValid) {
    console.warn('CSRF validation failed:', {
      method,
      url: request.url,
      cookieToken: getCSRFToken(request),
      headerToken: getCSRFHeader(request),
    })
  }
  
  return { 
    isValid,
    token: getCSRFToken(request)
  }
}

/**
 * Generate CSRF token for client-side use
 */
export async function getCSRFTokenForClient(): Promise<string> {
  const cookieStore = await cookies()
  let token = cookieStore.get(CSRF_TOKEN_NAME)?.value
  
  if (!token) {
    token = generateCSRFToken()
  }
  
  return token
}