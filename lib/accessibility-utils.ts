// ARIA label generators for better screen reader support
export const generateAriaLabel = (type: string, title: string, description?: string) => {
  switch (type) {
    case 'section':
      return `${title} section${description ? `. ${description}` : ''}`
    case 'card':
      return `${title} card${description ? `. ${description}` : ''}`
    case 'button':
      return `${title} button${description ? `. ${description}` : ''}`
    case 'icon':
      return `${title} icon${description ? `. ${description}` : ''}`
    default:
      return title
  }
}

// Focus management utilities
export const createFocusableProps = (isInteractive: boolean = true) => ({
  tabIndex: isInteractive ? 0 : -1,
  role: isInteractive ? 'button' : undefined,
  'aria-label': isInteractive ? 'Interactive element' : undefined,
  onKeyDown: isInteractive ? (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      ;(e.target as HTMLElement).click()
    }
  } : undefined
})

// Screen reader utilities
export const createScreenReaderText = (text: string) => ({
  className: 'sr-only',
  children: text
})

// Live region announcements for dynamic content
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  if (typeof window === 'undefined') return

  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

// Color contrast validation
export const validateContrast = (foreground: string, background: string): boolean => {
  // Simplified contrast check - in production, use a proper contrast checker
  const fgLuminance = getLuminance(foreground)
  const bgLuminance = getLuminance(background)
  
  const contrast = (Math.max(fgLuminance, bgLuminance) + 0.05) / 
                   (Math.min(fgLuminance, bgLuminance) + 0.05)
  
  return contrast >= 4.5 // WCAG AA standard
}

// Simple luminance calculation helper
const getLuminance = (color: string): number => {
  // This is a simplified version - in production use a proper color library
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16) / 255
  const g = parseInt(hex.substr(2, 2), 16) / 255
  const b = parseInt(hex.substr(4, 2), 16) / 255
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// Keyboard navigation helpers
export const createKeyboardNavigationProps = (
  onActivate?: () => void,
  onArrowUp?: () => void,
  onArrowDown?: () => void,
  onArrowLeft?: () => void,
  onArrowRight?: () => void
) => ({
  onKeyDown: (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        onActivate?.()
        break
      case 'ArrowUp':
        e.preventDefault()
        onArrowUp?.()
        break
      case 'ArrowDown':
        e.preventDefault()
        onArrowDown?.()
        break
      case 'ArrowLeft':
        e.preventDefault()
        onArrowLeft?.()
        break
      case 'ArrowRight':
        e.preventDefault()
        onArrowRight?.()
        break
    }
  }
})

// Skip link utilities for keyboard users
export const createSkipLink = (targetId: string, label: string = 'Skip to main content') => ({
  href: `#${targetId}`,
  className: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gold focus:text-navy focus:rounded-md',
  children: label
})

// High contrast mode detection
export const prefersHighContrast = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-contrast: high)').matches
  }
  return false
}

// Focus ring utilities for keyboard users
export const focusRingClasses = 'focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy'

// Loading state announcements
export const announceLoadingState = (isLoading: boolean, content: string) => {
  const message = isLoading ? `Loading ${content}` : `${content} loaded`
  announceToScreenReader(message, 'polite')
}

// Error state announcements
export const announceError = (error: string) => {
  announceToScreenReader(`Error: ${error}`, 'assertive')
}

// Success state announcements
export const announceSuccess = (message: string) => {
  announceToScreenReader(`Success: ${message}`, 'polite')
}

// Region landmarks for better navigation
export const createLandmarkProps = (type: 'main' | 'section' | 'navigation' | 'banner' | 'contentinfo' | 'complementary') => ({
  role: type === 'section' ? 'region' : type,
  'aria-labelledby': `${type}-heading`
})

// Image accessibility helpers
export const createImageAccessibilityProps = (alt: string, isDecorative: boolean = false) => ({
  alt: isDecorative ? '' : alt,
  role: isDecorative ? 'presentation' : undefined,
  'aria-hidden': isDecorative ? true : undefined
})

// Animation accessibility helpers
export const getAccessibleAnimationProps = (prefersReducedMotion: boolean) => ({
  initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
  animate: { opacity: 1, y: 0 },
  transition: { 
    duration: prefersReducedMotion ? 0.1 : 0.5,
    ease: 'easeOut'
  }
})

export default {
  generateAriaLabel,
  createFocusableProps,
  createScreenReaderText,
  announceToScreenReader,
  validateContrast,
  createKeyboardNavigationProps,
  createSkipLink,
  prefersHighContrast,
  focusRingClasses,
  announceLoadingState,
  announceError,
  announceSuccess,
  createLandmarkProps,
  createImageAccessibilityProps,
  getAccessibleAnimationProps
} 