// Advanced Image Optimization Utilities

export interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
  className?: string
}

// Generate responsive image sizes based on breakpoints
export function generateImageSizes(breakpoints: { sm?: number; md?: number; lg?: number; xl?: number } = {}) {
  const defaultBreakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    ...breakpoints
  }

  return `(max-width: ${defaultBreakpoints.sm}px) 100vw, (max-width: ${defaultBreakpoints.md}px) 50vw, (max-width: ${defaultBreakpoints.lg}px) 33vw, 25vw`
}

// Create optimized srcSet for different device pixel ratios
export function createSrcSet(baseSrc: string, sizes: number[]): string {
  return sizes
    .map(size => `${baseSrc}?w=${size}&q=75 ${size}w`)
    .join(', ')
}

// Generate blur placeholder for images
export function generateBlurDataURL(width: number = 8, height: number = 8): string {
  const canvas = typeof window !== 'undefined' ? document.createElement('canvas') : null
  if (!canvas) {
    // Fallback for SSR
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo='
  }

  canvas.width = width
  canvas.height = height
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  // Create gradient blur effect
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#0F1419')
  gradient.addColorStop(0.5, '#1F2937')
  gradient.addColorStop(1, '#374151')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  return canvas.toDataURL()
}

// Lazy loading intersection observer
export class ImageLazyLoader {
  private observer: IntersectionObserver | null = null
  private loadedImages = new Set<string>()

  constructor(options: IntersectionObserverInit = {}) {
    if (typeof window === 'undefined') return

    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        rootMargin: '50px',
        threshold: 0.1,
        ...options,
      }
    )
  }

  private handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        this.loadImage(img)
        this.observer?.unobserve(img)
      }
    })
  }

  private loadImage(img: HTMLImageElement) {
    const src = img.dataset.src
    const srcset = img.dataset.srcset
    
    if (src && !this.loadedImages.has(src)) {
      // Create new image to preload
      const imageLoader = new Image()
      
      imageLoader.onload = () => {
        // Apply the loaded image
        img.src = src
        if (srcset) img.srcset = srcset
        
        img.classList.remove('lazy-loading')
        img.classList.add('lazy-loaded')
        
        this.loadedImages.add(src)
      }

      imageLoader.onerror = () => {
        img.classList.add('lazy-error')
      }

      imageLoader.src = src
      if (srcset) imageLoader.srcset = srcset
    }
  }

  observe(element: HTMLImageElement) {
    this.observer?.observe(element)
  }

  disconnect() {
    this.observer?.disconnect()
  }
}

// Image format detection and optimization
export function getSupportedImageFormat(): string {
  if (typeof window === 'undefined') return 'webp'

  // Check for AVIF support
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  
  try {
    const avifSupport = canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0
    if (avifSupport) return 'avif'
  } catch {
    // AVIF not supported
  }

  // Check for WebP support
  try {
    const webpSupport = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
    if (webpSupport) return 'webp'
  } catch {
    // WebP not supported
  }

  return 'jpg'
}

// Optimize image URL with format and quality
export function optimizeImageUrl(
  src: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: string
  } = {}
): string {
  const { width, height, quality = 75, format } = options
  
  // If it's an external URL, return as-is
  if (src.startsWith('http') && !src.includes(window?.location?.hostname || '')) {
    return src
  }

  const params = new URLSearchParams()
  
  if (width) params.set('w', width.toString())
  if (height) params.set('h', height.toString())
  if (quality !== 75) params.set('q', quality.toString())
  if (format) params.set('f', format)

  const queryString = params.toString()
  return queryString ? `${src}?${queryString}` : src
}

// Preload critical images
export function preloadCriticalImages(images: string[]) {
  if (typeof window === 'undefined') return

  images.forEach(src => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  })
}

// Advanced image component with all optimizations
export function createOptimizedImageProps(props: OptimizedImageProps): OptimizedImageProps {
  const {
    src,
    alt,
    width,
    height,
    priority = false,
    quality = 75,
    placeholder = 'blur',
    sizes,
    className = '',
  } = props

  // Generate optimized props
  const optimizedProps: OptimizedImageProps = {
    src: optimizeImageUrl(src, { width, height, quality, format: getSupportedImageFormat() }),
    alt,
    width,
    height,
    priority,
    quality,
    placeholder,
    sizes: sizes || (width && height ? undefined : generateImageSizes()),
    className: `${className} ${priority ? 'priority-image' : 'lazy-image'}`.trim(),
  }

  // Add blur placeholder if needed
  if (placeholder === 'blur' && !props.blurDataURL) {
    optimizedProps.blurDataURL = generateBlurDataURL(width || 10, height || 10)
  }

  return optimizedProps
}

// Performance monitoring for images
export function trackImagePerformance(src: string, startTime: number) {
  const endTime = performance.now()
  const loadTime = endTime - startTime

  // Log slow image loads
  if (loadTime > 2000) {
    console.warn(`Slow image load: ${src} took ${loadTime.toFixed(2)}ms`)
    
    // Send to analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'slow_image_load', {
        event_category: 'performance',
        event_label: src,
        value: Math.round(loadTime)
      })
    }
  }
}

// Factory function for creating image lazy loader instances
export function createImageLazyLoader(): ImageLazyLoader | null {
  if (typeof window === 'undefined') return null
  return new ImageLazyLoader()
}