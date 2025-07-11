import { render, screen } from '@testing-library/react'

// Simple test to verify Jest setup
describe('Testing Framework', () => {
  it('should work correctly', () => {
    const TestComponent = () => <div>Hello, Tests!</div>
    
    render(<TestComponent />)
    
    expect(screen.getByText('Hello, Tests!')).toBeInTheDocument()
  })

  it('should support basic assertions', () => {
    expect(2 + 2).toBe(4)
    expect('test').toMatch(/test/)
    expect([1, 2, 3]).toHaveLength(3)
  })
})