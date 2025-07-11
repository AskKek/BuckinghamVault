// Simplified Service Worker Registration and Management

export class ServiceWorkerManager {
  private isRegistered = false
  private registration: ServiceWorkerRegistration | null = null

  async registerServiceWorker(): Promise<void> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    if (this.isRegistered) {
      return
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      })

      this.registration = registration
      this.isRegistered = true

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.notifyUpdate()
            }
          })
        }
      })

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', this.handleMessage)

      // Check for waiting service worker
      if (registration.waiting) {
        this.notifyUpdate()
      }

    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }

  async unregisterServiceWorker(): Promise<void> {
    if (!this.registration) return

    try {
      const success = await this.registration.unregister()
      if (success) {
        this.isRegistered = false
        this.registration = null
      }
    } catch (error) {
      console.error('Service Worker unregistration failed:', error)
    }
  }

  private notifyUpdate() {
    // Simple notification without complex UI
    if (process.env.NODE_ENV === 'development') {
      console.log('Service Worker update available')
    }
  }

  private handleMessage = (event: MessageEvent) => {
    // Handle service worker messages
    console.log('Service Worker message:', event.data)
  }

  skipWaiting() {
    if (this.registration?.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
  }

  async checkForUpdates(): Promise<void> {
    if (this.registration) {
      try {
        await this.registration.update()
      } catch (error) {
        console.error('Service Worker update check failed:', error)
      }
    }
  }

  getRegistration(): ServiceWorkerRegistration | null {
    return this.registration
  }

  isServiceWorkerRegistered(): boolean {
    return this.isRegistered
  }
}

// Export factory function instead of singleton
export function createServiceWorkerManager(): ServiceWorkerManager | null {
  if (typeof window === 'undefined') return null
  return new ServiceWorkerManager()
}

// Simple helper for common use cases
export async function registerServiceWorker(): Promise<ServiceWorkerManager | null> {
  const manager = createServiceWorkerManager()
  if (manager) {
    await manager.registerServiceWorker()
  }
  return manager
}

// Legacy export for backward compatibility - simplified
export const serviceWorkerManager = typeof window !== 'undefined' ? createServiceWorkerManager() : null