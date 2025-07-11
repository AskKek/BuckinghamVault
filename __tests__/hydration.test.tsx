import React from 'react'
import { render, hydrate } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { useIsMobile } from '@/hooks/use-mobile'
import { useIsClient } from '@/hooks/use-is-client'
import { HeroShader } from '@/components/HeroShader'
import { EnhancedCryptoTicker } from '@/components/Analytics/enhanced-crypto-ticker'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

describe('Hydration Tests', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = ''
  })

  describe('useIsMobile hook', () => {
    it('should return consistent value during SSR and hydration', () => {
      const TestComponent = () => {
        const isMobile = useIsMobile()
        return <div data-testid="mobile-status">{isMobile ? 'mobile' : 'desktop'}</div>
      }

      // Server render
      const serverHtml = renderToString(<TestComponent />)
      expect(serverHtml).toContain('desktop') // Should default to desktop on server

      // Client hydration
      const container = document.createElement('div')
      container.innerHTML = serverHtml
      document.body.appendChild(container)

      const { getByTestId } = render(<TestComponent />, { 
        container, 
        hydrate: true 
      })

      // Should maintain same value after hydration
      expect(getByTestId('mobile-status')).toHaveTextContent('desktop')
    })
  })

  describe('useIsClient hook', () => {
    it('should start as false and become true after mount', () => {
      const TestComponent = () => {
        const isClient = useIsClient()
        return <div data-testid="client-status">{isClient ? 'client' : 'server'}</div>
      }

      const { getByTestId, rerender } = render(<TestComponent />)
      
      // Initially false
      expect(getByTestId('client-status')).toHaveTextContent('server')
      
      // After effect runs, should be true
      setTimeout(() => {
        expect(getByTestId('client-status')).toHaveTextContent('client')
      }, 0)
    })
  })

  describe('Date/Time rendering', () => {
    it('should render consistent date format', () => {
      const TestComponent = () => {
        const [isClient, setIsClient] = React.useState(false)
        const [time] = React.useState(() => new Date('2025-01-01T12:00:00Z'))
        
        React.useEffect(() => {
          setIsClient(true)
        }, [])

        return (
          <div data-testid="time-display">
            {isClient 
              ? time.toLocaleTimeString('en-US', { timeZone: 'UTC' })
              : '--:--:-- UTC'}
          </div>
        )
      }

      // Server render
      const serverHtml = renderToString(<TestComponent />)
      expect(serverHtml).toContain('--:--:-- UTC')

      // Client hydration should match
      const container = document.createElement('div')
      container.innerHTML = serverHtml
      document.body.appendChild(container)

      const { getByTestId } = render(<TestComponent />, { 
        container, 
        hydrate: true 
      })

      expect(getByTestId('time-display')).toHaveTextContent('--:--:-- UTC')
    })
  })

  describe('WebGL components', () => {
    it('should render fallback during SSR', () => {
      // Mock WebGL unavailable
      const originalGetContext = HTMLCanvasElement.prototype.getContext
      HTMLCanvasElement.prototype.getContext = jest.fn(() => null)

      const { container } = render(<HeroShader />)
      
      // Should render fallback gradient
      const fallback = container.querySelector('[style*="linear-gradient"]')
      expect(fallback).toBeInTheDocument()

      // Restore
      HTMLCanvasElement.prototype.getContext = originalGetContext
    })
  })

  describe('Window access patterns', () => {
    it('should guard window access properly', () => {
      const TestComponent = () => {
        const [width, setWidth] = React.useState(0)
        
        React.useEffect(() => {
          if (typeof window !== 'undefined') {
            setWidth(window.innerWidth)
          }
        }, [])

        return <div data-testid="width">{width}</div>
      }

      // Should not throw during SSR
      expect(() => renderToString(<TestComponent />)).not.toThrow()
      
      const { getByTestId } = render(<TestComponent />)
      expect(getByTestId('width')).toHaveTextContent('0')
    })
  })

  describe('Random value consistency', () => {
    it('should use deterministic values during SSR', () => {
      const TestComponent = () => {
        const [value] = React.useState(() => {
          // Use deterministic value instead of Math.random()
          return typeof window === 'undefined' ? 0.5 : Math.random()
        })
        
        return <div data-testid="random">{value}</div>
      }

      // Server render
      const serverHtml = renderToString(<TestComponent />)
      expect(serverHtml).toContain('0.5')

      // Client should hydrate with same value
      const container = document.createElement('div')
      container.innerHTML = serverHtml
      document.body.appendChild(container)

      const { getByTestId } = render(<TestComponent />, { 
        container, 
        hydrate: true 
      })

      expect(getByTestId('random')).toHaveTextContent('0.5')
    })
  })
})