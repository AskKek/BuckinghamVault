import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import React from 'react'
import { ContactEmailTemplate } from '@/components/Home/emails/contact-email-template'

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy-key-for-build')

// Enhanced validation schema for luxury financial services
const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(254, 'Email must be less than 254 characters'),
  
  company: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters')
    .optional(),
  
  title: z.string()
    .max(100, 'Title must be less than 100 characters')
    .optional(),
  
  phone: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .optional(),
  
  investmentRange: z.enum([
    'under-1m',
    '1m-5m',
    '5m-25m',
    '25m-100m',
    'over-100m',
    'prefer-not-to-say'
  ]).optional(),
  
  serviceInterest: z.enum([
    'digital-asset-custody',
    'portfolio-management',
    'family-office-services',
    'institutional-solutions',
    'other'
  ]).optional(),
  
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters'),
  
  preferredContact: z.enum(['email', 'phone', 'meeting']).optional(),
  
  // Privacy and compliance
  privacyConsent: z.boolean()
    .refine(val => val === true, 'Privacy consent is required'),
  
  marketingConsent: z.boolean().optional(),
})

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 3 // Max 3 requests per 15 minutes
  
  const current = rateLimitStore.get(ip)
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (current.count >= maxRequests) {
    return false
  }
  
  current.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in 15 minutes.' },
        { status: 429 }
      )
    }
    
    // Parse and validate request body
    const body = await request.json()
    const validatedData = contactSchema.parse(body)
    
    // Send email to the business
    const businessEmailResult = await resend.emails.send({
      from: 'Buckingham Vault Contact <noreply@buckinghamvault.com>',
      to: [process.env.CONTACT_EMAIL || 'contact@buckinghamvault.com'],
      subject: `New Contact Inquiry from ${validatedData.name}`,
      react: React.createElement(ContactEmailTemplate, {
        name: validatedData.name,
        email: validatedData.email,
        company: validatedData.company,
        title: validatedData.title,
        phone: validatedData.phone,
        investmentRange: validatedData.investmentRange,
        serviceInterest: validatedData.serviceInterest,
        message: validatedData.message,
        preferredContact: validatedData.preferredContact,
        marketingConsent: validatedData.marketingConsent,
        submittedAt: new Date().toISOString(),
      }),
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
      },
    })

    if (businessEmailResult.error) {
      console.error('Failed to send business email:', businessEmailResult.error)
      throw new Error('Failed to send notification email')
    }

    // Send confirmation email to the user
    const confirmationEmailResult = await resend.emails.send({
      from: 'The Buckingham Vault <noreply@buckinghamvault.com>',
      to: [validatedData.email],
      subject: 'Thank you for your inquiry - The Buckingham Vault',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0F1419; color: #FFFFFF;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #D7930C; font-size: 24px; margin: 0;">The Buckingham Vault</h1>
            <p style="color: #9CA3AF; margin: 5px 0;">Private Digital Asset Wealth Management</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #1F2937 0%, #111827 100%); padding: 30px; border-radius: 10px; border: 1px solid #D7930C20;">
            <h2 style="color: #D7930C; margin-top: 0;">Thank you for your inquiry</h2>
            
            <p style="color: #E5E7EB; line-height: 1.6;">
              Dear ${validatedData.name},
            </p>
            
            <p style="color: #E5E7EB; line-height: 1.6;">
              Thank you for your interest in The Buckingham Vault. We have received your inquiry and our team of specialists will review your request within the next 24 hours.
            </p>
            
            <p style="color: #E5E7EB; line-height: 1.6;">
              Given the confidential nature of our services, one of our senior advisors will contact you directly using your preferred communication method to discuss how we can assist with your digital asset wealth management needs.
            </p>
            
            <div style="background: #0F141920; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D7930C;">
              <h3 style="color: #D7930C; margin-top: 0; font-size: 16px;">What happens next:</h3>
              <ul style="color: #9CA3AF; padding-left: 20px;">
                <li>Initial review and assessment (within 24 hours)</li>
                <li>Preliminary consultation scheduling</li>
                <li>Comprehensive needs analysis</li>
                <li>Customized solution presentation</li>
              </ul>
            </div>
            
            <p style="color: #6B7280; font-size: 14px; line-height: 1.5; margin-top: 30px;">
              This communication is confidential and may contain privileged information. If you have received this message in error, please notify us immediately.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #374151;">
            <p style="color: #6B7280; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} The Buckingham Vault. All rights reserved.
            </p>
          </div>
        </div>
      `,
    })

    if (confirmationEmailResult.error) {
      console.error('Failed to send confirmation email:', confirmationEmailResult.error)
      // Don't fail the request if confirmation email fails
    }

    // Log successful submission (in production, use proper logging service)
    console.log(`Contact form submission from ${validatedData.email} at ${new Date().toISOString()}`)

    return NextResponse.json({
      success: true,
      message: 'Thank you for your inquiry. We will contact you within 24 hours.',
      id: businessEmailResult.data?.id,
    })

  } catch (error) {
    console.error('Contact form error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid form data', 
          details: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to submit inquiry. Please try again or contact us directly.' },
      { status: 500 }
    )
  }
}