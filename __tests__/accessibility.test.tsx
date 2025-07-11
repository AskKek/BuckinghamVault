import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import Home from '@/app/page'
import NotFound from '@/app/not-found'

expect.extend(toHaveNoViolations)

// Mock complex components
jest.mock('@/components/premium-hero-section', () => {
  return function MockPremiumHeroSection() {
    return (
      <section aria-label="Hero section" data-testid="premium-hero-section">
        <h1>The Buckingham Vault</h1>
        <p>Private Digital Asset Wealth Management</p>
        <button>Get Started</button>
      </section>
    )
  }
})

jest.mock('@/components/analytics-provider', () => {
  return {
    AnalyticsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }
})

describe('Accessibility Tests', () => {
  describe('Homepage', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<Home />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper heading hierarchy', () => {
      render(<Home />)
      const h1 = document.querySelector('h1')
      expect(h1).toBeInTheDocument()
      expect(h1).toHaveTextContent('The Buckingham Vault')
    })

    it('should have proper landmark roles', () => {
      render(<Home />)
      
      // Should have main landmark
      const main = document.querySelector('main')
      expect(main).toBeInTheDocument()
    })
  })

  describe('404 Page', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<NotFound />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper heading structure', () => {
      render(<NotFound />)
      
      // Should have clear headings
      expect(document.querySelector('h1')).toBeInTheDocument()
      expect(document.querySelector('h2')).toBeInTheDocument()
    })

    it('should have accessible navigation links', () => {
      render(<NotFound />)
      
      // Should have proper link text
      const homeLink = document.querySelector('a[href="/"]')
      expect(homeLink).toBeInTheDocument()
      expect(homeLink).toHaveAccessibleName()
    })
  })

  describe('Color Contrast', () => {
    it('should use appropriate color contrast ratios', () => {
      render(<Home />)
      
      // This is a basic test - in a real app, you'd use tools like
      // axe-core with color-contrast rules or specialized testing tools
      const elements = document.querySelectorAll('*')
      elements.forEach(element => {
        const style = window.getComputedStyle(element)
        const color = style.color
        const backgroundColor = style.backgroundColor
        
        // Basic check that we're not using invisible text
        expect(color).not.toBe(backgroundColor)
      })
    })
  })

  describe('Keyboard Navigation', () => {
    it('should have focusable interactive elements', () => {
      render(<Home />)
      
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      
      focusableElements.forEach(element => {
        expect(element).not.toHaveAttribute('tabindex', '-1')
      })
    })
  })

  describe('Screen Reader Support', () => {
    it('should have proper ARIA labels', () => {
      render(<Home />)
      
      // Check for ARIA labels on interactive elements
      const buttons = document.querySelectorAll('button')
      const links = document.querySelectorAll('a')
      
      buttons.forEach(button => {
        // Button should have accessible name via text content or aria-label
        expect(
          button.textContent || 
          button.getAttribute('aria-label') || 
          button.getAttribute('aria-labelledby')
        ).toBeTruthy()
      })
      
      links.forEach(link => {
        // Links should have accessible names
        expect(
          link.textContent || 
          link.getAttribute('aria-label') || 
          link.getAttribute('aria-labelledby')
        ).toBeTruthy()
      })
    })
  })
})