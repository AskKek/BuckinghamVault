import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import Home from '@/app/page'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock components that use complex dependencies
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

describe('Homepage', () => {
  it('renders without crashing', () => {
    render(<Home />)
    expect(screen.getByTestId('premium-hero-section')).toBeInTheDocument()
  })

  it('should have no accessibility violations', async () => {
    const { container } = render(<Home />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('renders the main content areas', () => {
    render(<Home />)
    
    // Check for main hero section
    expect(screen.getByTestId('premium-hero-section')).toBeInTheDocument()
  })

  it('has proper semantic structure', () => {
    render(<Home />)
    
    // Should have main landmark
    const main = document.querySelector('main')
    expect(main).toBeInTheDocument()
  })
})