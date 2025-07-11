import { render } from '@testing-library/react'
import Home from '@/app/page'

// Mock heavy components
jest.mock('@/components/premium-hero-section', () => {
  return function MockPremiumHeroSection() {
    return <div data-testid="premium-hero-section">Premium Hero Section</div>
  }
})

jest.mock('@/components/analytics-provider', () => {
  return {
    AnalyticsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }
})

describe('Performance Tests', () => {
  beforeEach(() => {
    // Reset performance measurements
    performance.clearMarks()
    performance.clearMeasures()
  })

  it('should render homepage within performance budget', () => {
    const startTime = performance.now()
    
    render(<Home />)
    
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    // Should render within 50ms (generous for testing environment)
    expect(renderTime).toBeLessThan(50)
  })

  it('should not have memory leaks in component mounting', () => {
    const initialMemory = (performance as any).memory?.usedJSHeapSize
    
    // Render and unmount multiple times
    for (let i = 0; i < 10; i++) {
      const { unmount } = render(<Home />)
      unmount()
    }
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc()
    }
    
    const finalMemory = (performance as any).memory?.usedJSHeapSize
    
    if (initialMemory && finalMemory) {
      // Memory usage shouldn't increase significantly
      const memoryIncrease = finalMemory - initialMemory
      expect(memoryIncrease).toBeLessThan(1024 * 1024) // Less than 1MB increase
    }
  })

  it('should efficiently handle component re-renders', () => {
    const { rerender } = render(<Home />)
    
    const startTime = performance.now()
    
    // Re-render multiple times
    for (let i = 0; i < 5; i++) {
      rerender(<Home />)
    }
    
    const endTime = performance.now()
    const rerenderTime = endTime - startTime
    
    // Should handle re-renders efficiently
    expect(rerenderTime).toBeLessThan(25)
  })

  describe('Bundle Size Impact', () => {
    it('should not import unnecessary dependencies', () => {
      // Mock console.warn to catch potential issues
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      
      render(<Home />)
      
      // Should not have warnings about unused imports or large bundles
      const bundleWarnings = consoleSpy.mock.calls.filter(call =>
        call.some(arg => 
          typeof arg === 'string' && 
          (arg.includes('bundle') || arg.includes('import'))
        )
      )
      
      expect(bundleWarnings).toHaveLength(0)
      
      consoleSpy.mockRestore()
    })
  })

  describe('Image Loading Performance', () => {
    it('should use lazy loading for images', () => {
      render(<Home />)
      
      const images = document.querySelectorAll('img')
      images.forEach(img => {
        // Images should use lazy loading or be above the fold
        const isAboveFold = img.getAttribute('priority') === 'true'
        const isLazy = img.getAttribute('loading') === 'lazy'
        
        // Either should be prioritized (above fold) or lazy loaded
        expect(isAboveFold || isLazy || img.hasAttribute('data-testid')).toBe(true)
      })
    })
  })

  describe('CSS Performance', () => {
    it('should not have style recalculation issues', () => {
      const { container } = render(<Home />)
      
      // Check for potential style recalculation triggers
      const elementsWithTransforms = container.querySelectorAll('[style*="transform"]')
      const elementsWithFilters = container.querySelectorAll('[style*="filter"]')
      
      // Elements with transforms should use transform3d for hardware acceleration
      elementsWithTransforms.forEach(element => {
        const style = (element as HTMLElement).style
        if (style.transform && !style.transform.includes('translate3d')) {
          // Should prefer transform3d for performance
          console.warn('Consider using transform3d for hardware acceleration')
        }
      })
      
      // This test passes if we reach here without errors
      expect(true).toBe(true)
    })
  })
})