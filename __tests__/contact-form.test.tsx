import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from '@/components/Home/contact-form'

// Mock the Sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock fetch
global.fetch = jest.fn()

describe('ContactForm', () => {
  beforeEach(() => {
    ;(global.fetch as jest.Mock).mockClear()
  })

  it('renders all required form fields', () => {
    render(<ContactForm />)
    
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit confidential inquiry/i })).toBeInTheDocument()
  })

  it('shows validation errors for required fields', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const submitButton = screen.getByRole('button', { name: /submit confidential inquiry/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/privacy consent is required/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const emailInput = screen.getByLabelText(/email address/i)
    await user.type(emailInput, 'invalid-email')
    
    const submitButton = screen.getByRole('button', { name: /submit confidential inquiry/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    })
  })

  it('validates phone number format', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const phoneInput = screen.getByLabelText(/phone number/i)
    await user.type(phoneInput, 'invalid-phone')
    
    const submitButton = screen.getByRole('button', { name: /submit confidential inquiry/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid phone number/i)).toBeInTheDocument()
    })
  })

  it('requires privacy consent checkbox', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    // Fill in required fields but don't check privacy consent
    await user.type(screen.getByLabelText(/full name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.type(screen.getByLabelText(/message/i), 'This is a test message that is long enough.')

    const submitButton = screen.getByRole('button', { name: /submit confidential inquiry/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/privacy consent is required/i)).toBeInTheDocument()
    })
  })

  it('submits form successfully with valid data', async () => {
    const user = userEvent.setup()
    const mockResponse = { success: true, message: 'Thank you!', id: '123' }
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    render(<ContactForm />)

    // Fill in all required fields
    await user.type(screen.getByLabelText(/full name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.type(screen.getByLabelText(/message/i), 'This is a test message that is long enough to pass validation.')
    
    // Check privacy consent
    const privacyCheckbox = screen.getByRole('checkbox', { name: /privacy policy/i })
    await user.click(privacyCheckbox)

    const submitButton = screen.getByRole('button', { name: /submit confidential inquiry/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'This is a test message that is long enough to pass validation.',
          privacyConsent: true,
          marketingConsent: false,
        }),
      })
    })
  })

  it('handles form submission errors', async () => {
    const user = userEvent.setup()
    const mockError = { error: 'Server error' }
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => mockError,
    })

    render(<ContactForm />)

    // Fill in required fields
    await user.type(screen.getByLabelText(/full name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.type(screen.getByLabelText(/message/i), 'This is a test message that is long enough.')
    
    const privacyCheckbox = screen.getByRole('checkbox', { name: /privacy policy/i })
    await user.click(privacyCheckbox)

    const submitButton = screen.getByRole('button', { name: /submit confidential inquiry/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })
  })

  it('shows success message after successful submission', async () => {
    const user = userEvent.setup()
    const mockResponse = { success: true, message: 'Thank you!', id: '123' }
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    render(<ContactForm />)

    // Fill and submit form
    await user.type(screen.getByLabelText(/full name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.type(screen.getByLabelText(/message/i), 'This is a test message that is long enough.')
    
    const privacyCheckbox = screen.getByRole('checkbox', { name: /privacy policy/i })
    await user.click(privacyCheckbox)

    const submitButton = screen.getByRole('button', { name: /submit confidential inquiry/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/thank you!/i)).toBeInTheDocument()
      expect(screen.getByText(/your inquiry has been received/i)).toBeInTheDocument()
    })
  })

  it('has accessible form labels and structure', () => {
    render(<ContactForm />)
    
    // Check for proper labeling
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    
    // Check for form structure
    expect(screen.getByRole('form')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit confidential inquiry/i })).toBeInTheDocument()
  })

  it('shows character count for message field', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const messageField = screen.getByLabelText(/message/i)
    await user.type(messageField, 'Test message')

    expect(screen.getByText(/12\/2000 characters/i)).toBeInTheDocument()
  })
})