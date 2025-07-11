import { NextRequest } from 'next/server'

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
  retryAfter?: number
}

export async function rateLimit(
  request: NextRequest,
  action: string,
  maxAttempts: number,
  windowMs: number
): Promise<RateLimitResult> {
  // Get client identifier (IP address + action)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded ? forwarded.split(',')[0] : realIp || 'unknown'
  const key = `${ip}:${action}`
  
  const now = Date.now()
  const windowStart = now - windowMs * 1000
  
  // Get or create rate limit entry
  let entry = rateLimitMap.get(key)
  
  if (!entry || entry.resetTime < now) {
    // Create new or reset expired entry
    entry = {
      count: 0,
      resetTime: now + windowMs * 1000
    }
  }
  
  // Increment count
  entry.count++
  
  // Update map
  rateLimitMap.set(key, entry)
  
  // Clean up expired entries periodically
  if (Math.random() < 0.01) { // 1% chance
    cleanupExpiredEntries()
  }
  
  const remaining = Math.max(0, maxAttempts - entry.count)
  const success = entry.count <= maxAttempts
  const retryAfter = success ? undefined : Math.ceil((entry.resetTime - now) / 1000)
  
  return {
    success,
    remaining,
    resetTime: entry.resetTime,
    retryAfter
  }
}

function cleanupExpiredEntries() {
  const now = Date.now()
  
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.resetTime < now) {
      rateLimitMap.delete(key)
    }
  }
}

// Rate limit middleware for API routes
export function withRateLimit(
  action: string,
  maxAttempts: number,
  windowMs: number,
  handler: (request: NextRequest) => Promise<Response>
) {
  return async (request: NextRequest): Promise<Response> => {
    const rateLimitResult = await rateLimit(request, action, maxAttempts, windowMs)
    
    if (!rateLimitResult.success) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: `Too many ${action} attempts`,
          resetTime: rateLimitResult.resetTime
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': maxAttempts.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          }
        }
      )
    }
    
    const response = await handler(request)
    
    // Add rate limit headers to successful responses
    response.headers.set('X-RateLimit-Limit', maxAttempts.toString())
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
    response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString())
    
    return response
  }
}