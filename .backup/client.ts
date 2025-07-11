/**
 * API Client for Buckingham Vault
 * Integrates with secure authentication and CSRF protection
 */

import { queryClient } from '@/lib/query-client'

export interface ApiError extends Error {
  status?: number
  code?: string
  details?: any
}

export class BuckinghamApiError extends Error implements ApiError {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'BuckinghamApiError'
  }
}

/**
 * Get CSRF token from cookies
 */
function getCSRFToken(): string | null {
  if (typeof document === 'undefined') return null
  
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === 'csrf-token') {
      return decodeURIComponent(value)
    }
  }
  return null
}

/**
 * Enhanced fetch with authentication and error handling
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const { method = 'GET', headers = {}, ...restOptions } = options

  // Prepare headers
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  }

  // Add CSRF token for state-changing requests
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const csrfToken = getCSRFToken()
    if (csrfToken) {
      (requestHeaders as Record<string, string>)['x-csrf-token'] = csrfToken
    }
  }

  const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      credentials: 'include', // Include HTTP-only cookies
      ...restOptions,
    })

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')

    if (!response.ok) {
      let errorData: any = {}
      
      if (isJson) {
        try {
          errorData = await response.json()
        } catch {
          // Ignore JSON parsing errors for error responses
        }
      }

      throw new BuckinghamApiError(
        response.status,
        errorData.code || 'API_ERROR',
        errorData.message || errorData.error || `HTTP ${response.status}`,
        errorData.details
      )
    }

    // Handle empty responses
    if (response.status === 204 || !isJson) {
      return null as T
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    // Handle network errors
    if (error instanceof BuckinghamApiError) {
      throw error
    }

    throw new BuckinghamApiError(
      0,
      'NETWORK_ERROR',
      'Network error occurred. Please check your connection.',
      { originalError: error }
    )
  }
}

/**
 * API client methods
 */
export const api = {
  // GET request
  get: <T = any>(endpoint: string, options?: Omit<RequestInit, 'method'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  // POST request
  post: <T = any>(endpoint: string, data?: any, options?: Omit<RequestInit, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  // PUT request
  put: <T = any>(endpoint: string, data?: any, options?: Omit<RequestInit, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  // PATCH request
  patch: <T = any>(endpoint: string, data?: any, options?: Omit<RequestInit, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  // DELETE request
  delete: <T = any>(endpoint: string, options?: Omit<RequestInit, 'method'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),

  // Upload files
  upload: <T = any>(endpoint: string, formData: FormData, options?: Omit<RequestInit, 'method' | 'body'>) => {
    // Remove Content-Type header to let browser set it with boundary
    const { headers, ...restOptions } = options || {}
    const uploadHeaders = { ...headers }
    delete (uploadHeaders as any)['Content-Type']

    // Add CSRF token for uploads
    const csrfToken = getCSRFToken()
    if (csrfToken) {
      formData.append('_csrf', csrfToken)
    }

    return apiRequest<T>(endpoint, {
      ...restOptions,
      method: 'POST',
      headers: uploadHeaders,
      body: formData,
    })
  },
}

/**
 * Query function factory for TanStack Query
 */
export function createQueryFn<T = any>(endpoint: string) {
  return async (): Promise<T> => {
    return api.get<T>(endpoint)
  }
}

/**
 * Mutation function factory for TanStack Query
 */
export function createMutationFn<TData = any, TVariables = any>(
  endpoint: string | ((variables: TVariables) => string),
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST'
) {
  return async (variables: TVariables): Promise<TData> => {
    const url = typeof endpoint === 'function' ? endpoint(variables) : endpoint
    
    switch (method) {
      case 'POST':
        return api.post<TData>(url, variables)
      case 'PUT':
        return api.put<TData>(url, variables)
      case 'PATCH':
        return api.patch<TData>(url, variables)
      case 'DELETE':
        return api.delete<TData>(url)
      default:
        throw new Error(`Unsupported method: ${method}`)
    }
  }
}

/**
 * Global error handler for API errors
 */
export function handleApiError(error: unknown) {
  if (error instanceof BuckinghamApiError) {
    switch (error.status) {
      case 401:
        // Handle unauthorized - redirect to login or refresh token
        console.warn('Authentication required')
        // Could trigger a global auth refresh here
        break
      
      case 403:
        // Handle forbidden - show access denied message
        console.warn('Access denied:', error.message)
        break
      
      case 404:
        // Handle not found
        console.warn('Resource not found:', error.message)
        break
      
      case 429:
        // Handle rate limiting
        console.warn('Rate limit exceeded:', error.message)
        break
      
      case 500:
        // Handle server errors
        console.error('Server error:', error.message)
        break
      
      default:
        console.error('API error:', error.message)
    }
  } else {
    console.error('Unexpected error:', error)
  }
}