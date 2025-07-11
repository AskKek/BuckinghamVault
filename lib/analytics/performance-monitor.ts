// Simplified Performance Monitor - No singleton pattern, no session storage
export class PerformanceMonitor {
  private metrics: Map<string, any> = new Map()
  
  constructor() {
    // Only initialize if in browser environment
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.initializeObservers()
    }
  }
  
  private initializeObservers() {
    // Observe long tasks with error handling
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('long-task', {
            duration: entry.duration,
            startTime: entry.startTime,
            name: entry.name,
          })
        }
      })
      longTaskObserver.observe({ entryTypes: ['longtask'] })
    } catch (e) {
      // Silent fail - don't break the app
    }
  }
  
  trackPageLoad() {
    if (typeof window === 'undefined') return
    
    // Use simpler timing without complex navigation timing
    const loadTime = Date.now()
    this.recordMetric('page-load', { timestamp: loadTime })
  }
  
  trackResourceLoading() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return
    
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resource = entry as PerformanceResourceTiming
          
          if (resource.initiatorType === 'img' || 
              resource.initiatorType === 'script' || 
              resource.initiatorType === 'css') {
            this.recordMetric('resource', {
              name: resource.name,
              type: resource.initiatorType,
              duration: resource.duration,
            })
          }
        }
      })
      
      resourceObserver.observe({ entryTypes: ['resource'] })
    } catch (e) {
      // Silent fail - don't break the app
    }
  }
  
  trackCustomMetric(key: string, value: any) {
    this.recordMetric(key, value)
  }
  
  private recordMetric(key: string, value: any) {
    this.metrics.set(key, value)
    
    // Optional: Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${key}:`, value)
    }
  }
  
  // Simple, non-persistent session tracking
  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  getMetrics() {
    return Object.fromEntries(this.metrics)
  }
}

// Export factory function - no singleton pattern
export function createPerformanceMonitor(): PerformanceMonitor | null {
  if (typeof window === 'undefined') return null
  return new PerformanceMonitor()
}

// Simple helper function for component usage
export function usePerformanceMonitor(): PerformanceMonitor | null {
  if (typeof window === 'undefined') return null
  return new PerformanceMonitor()
}

// Legacy export for backward compatibility - now creates new instance
export const performanceMonitor = typeof window !== 'undefined' ? new PerformanceMonitor() : null