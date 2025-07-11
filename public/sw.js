// Service Worker for Buckingham Vault
const CACHE_NAME = 'buckingham-vault-v1'
const STATIC_CACHE_NAME = 'buckingham-vault-static-v1'
const DYNAMIC_CACHE_NAME = 'buckingham-vault-dynamic-v1'

// Cache strategies
const CACHE_FIRST = 'cache-first'
const NETWORK_FIRST = 'network-first'
const STALE_WHILE_REVALIDATE = 'stale-while-revalidate'

// Assets to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/analytics',
  '/contact',
  '/_next/static/css/',
  '/_next/static/js/',
  '/images/buckingham-vault-icon.png',
]

// Cache patterns with strategies
const CACHE_PATTERNS = [
  {
    pattern: /^https:\/\/fonts\.googleapis\.com/,
    strategy: STALE_WHILE_REVALIDATE,
    cacheName: 'google-fonts-stylesheets',
  },
  {
    pattern: /^https:\/\/fonts\.gstatic\.com/,
    strategy: CACHE_FIRST,
    cacheName: 'google-fonts-webfonts',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  {
    pattern: /\/_next\/static\//,
    strategy: CACHE_FIRST,
    cacheName: 'nextjs-static',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  {
    pattern: /\/images\//,
    strategy: CACHE_FIRST,
    cacheName: 'images',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  {
    pattern: /\/api\//,
    strategy: NETWORK_FIRST,
    cacheName: 'api-cache',
    maxAge: 5 * 60, // 5 minutes
  }
]

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('[SW] Precaching static assets')
        return cache.addAll(PRECACHE_ASSETS)
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully')
        return self.skipWaiting()
      })
      .catch(err => {
        console.error('[SW] Error precaching static assets:', err)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...')
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== DYNAMIC_CACHE_NAME &&
              cacheName.startsWith('buckingham-vault-')
            ) {
              console.log('[SW] Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('[SW] Service worker activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') return
  
  // Skip cross-origin requests (except fonts and CDN)
  if (url.origin !== location.origin && !isCacheableExternal(url)) return
  
  // Find matching cache pattern
  const pattern = CACHE_PATTERNS.find(p => p.pattern.test(request.url))
  
  if (pattern) {
    event.respondWith(handleRequest(request, pattern))
  } else {
    // Default strategy for other requests
    event.respondWith(handleDefault(request))
  }
})

// Handle requests based on strategy
async function handleRequest(request, pattern) {
  const { strategy, cacheName, maxAge } = pattern
  
  switch (strategy) {
    case CACHE_FIRST:
      return cacheFirst(request, cacheName, maxAge)
    case NETWORK_FIRST:
      return networkFirst(request, cacheName, maxAge)
    case STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(request, cacheName, maxAge)
    default:
      return fetch(request)
  }
}

// Cache first strategy
async function cacheFirst(request, cacheName, maxAge) {
  try {
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
      return cachedResponse
    }
    
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.error('[SW] Cache first error:', error)
    const cache = await caches.open(cacheName)
    return cache.match(request) || new Response('Network error', { status: 503 })
  }
}

// Network first strategy
async function networkFirst(request, cacheName, maxAge) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.error('[SW] Network first fallback to cache:', error)
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
      return cachedResponse
    }
    
    return new Response('Offline', { status: 503 })
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)
  
  // Fetch fresh version in background
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  }).catch(err => {
    console.error('[SW] Stale while revalidate fetch error:', err)
  })
  
  // Return cached version immediately if available
  if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
    return cachedResponse
  }
  
  // Otherwise wait for network
  return fetchPromise
}

// Default handling for uncategorized requests
async function handleDefault(request) {
  try {
    const networkResponse = await fetch(request)
    
    // Cache successful page responses
    if (networkResponse.ok && request.destination === 'document') {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    // Try to serve from cache
    const cache = await caches.open(DYNAMIC_CACHE_NAME)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Serve offline page for navigation requests
    if (request.destination === 'document') {
      return caches.match('/offline') || new Response('Offline', { 
        status: 503,
        headers: { 'Content-Type': 'text/html' }
      })
    }
    
    return new Response('Network error', { status: 503 })
  }
}

// Check if external URL is cacheable
function isCacheableExternal(url) {
  const cacheableHosts = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'cdn.jsdelivr.net',
    'unpkg.com'
  ]
  
  return cacheableHosts.some(host => url.hostname.includes(host))
}

// Check if cached response has expired
function isExpired(response, maxAge) {
  if (!maxAge) return false
  
  const dateHeader = response.headers.get('date')
  if (!dateHeader) return false
  
  const responseTime = new Date(dateHeader).getTime()
  const now = Date.now()
  const age = (now - responseTime) / 1000 // in seconds
  
  return age > maxAge
}

// Handle background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForms())
  }
})

// Sync offline form submissions
async function syncContactForms() {
  try {
    const db = await openDB()
    const forms = await getOfflineForms(db)
    
    for (const form of forms) {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form.data)
        })
        
        if (response.ok) {
          await deleteOfflineForm(db, form.id)
          console.log('[SW] Synced offline form submission')
        }
      } catch (err) {
        console.error('[SW] Failed to sync form:', err)
      }
    }
  } catch (err) {
    console.error('[SW] Background sync error:', err)
  }
}

// Simple IndexedDB helpers for offline forms
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('BuckinghamVaultDB', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains('offlineForms')) {
        db.createObjectStore('offlineForms', { keyPath: 'id', autoIncrement: true })
      }
    }
  })
}

function getOfflineForms(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['offlineForms'], 'readonly')
    const store = transaction.objectStore('offlineForms')
    const request = store.getAll()
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

function deleteOfflineForm(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['offlineForms'], 'readwrite')
    const store = transaction.objectStore('offlineForms')
    const request = store.delete(id)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

// Performance monitoring
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'PERFORMANCE_MARK') {
    const { name, startTime } = event.data
    console.log(`[SW] Performance mark: ${name} at ${startTime}ms`)
  }
})

console.log('[SW] Service worker script loaded')