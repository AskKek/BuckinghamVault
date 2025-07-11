import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import React from 'react'

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy-key-for-build')

// KYC Application Schema
const kycApplicationSchema = z.object({
  personalInfo: z.object({
    entityType: z.enum(['individual', 'corporation', 'trust', 'foundation', 'partnership']),
    firstName: z.string(),
    lastName: z.string(),
    middleName: z.string().optional(),
    dateOfBirth: z.string(),
    nationality: z.string(),
    countryOfResidence: z.string(),
    phoneNumber: z.string(),
    email: z.string().email(),
    taxId: z.string(),
    occupation: z.string(),
    estimatedNetWorth: z.enum(['1m-5m', '5m-25m', '25m-100m', '100m-500m', '500m+']),
    sourceOfWealth: z.array(z.string()),
  }),
  exchangePreferences: z.object({
    bitcoinRatingPreference: z.enum(['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'C', 'any']),
    premiumTolerance: z.enum(['none', 'low', 'medium', 'high', 'unlimited']),
    minimumTransactionSize: z.string(),
    maximumTransactionSize: z.string(),
    preferredSettlementTimeframe: z.enum(['instant', '1-hour', '4-hours', '24-hours', '48-hours']),
    custodyPreference: z.enum(['self-custody', 'buckingham-custody', 'third-party']),
    commissionStructure: z.enum(['fixed-rate', 'tiered', 'volume-based', 'custom']),
    tradingHours: z.enum(['24-7', 'business-hours', 'custom']),
  }),
  agreements: z.object({
    termsOfService: z.boolean(),
    privacyPolicy: z.boolean(),
    kycPolicy: z.boolean(),
    amlPolicy: z.boolean(),
    riskDisclosure: z.boolean(),
    tradingAgreement: z.boolean(),
  }),
})

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 60 * 1000 // 1 hour
  const maxRequests = 2 // Max 2 KYC applications per hour
  
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

// Email template for KYC application
function KYCApplicationEmailTemplate(data: any) {
  const { personalInfo, exchangePreferences } = data
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #FFFFFF; color: #1F2937;">
      <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #D7930C;">
        <h1 style="color: #D7930C; font-size: 28px; margin: 0 0 10px 0; font-weight: bold;">
          The Buckingham Vault
        </h1>
        <p style="color: #6B7280; margin: 0; font-size: 16px;">
          New KYC Application Received
        </p>
      </div>

      <div style="background: #FEF3CD; border: 1px solid #F59E0B; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
        <h2 style="color: #92400E; margin: 0 0 5px 0; font-size: 16px; font-weight: bold;">
          🔔 High Priority KYC Application
        </h2>
        <p style="color: #78350F; margin: 0; font-size: 14px;">
          This application requires immediate review from our compliance team.
        </p>
      </div>

      <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h2 style="color: #1F2937; margin: 0 0 20px 0; font-size: 20px; font-weight: bold;">
          Applicant Information
        </h2>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <strong style="color: #374151;">Name:</strong>
            <div style="color: #1F2937; font-size: 16px; font-weight: bold;">
              ${personalInfo.firstName} ${personalInfo.middleName || ''} ${personalInfo.lastName}
            </div>
          </div>

          <div>
            <strong style="color: #374151;">Email:</strong>
            <div style="color: #1F2937;">
              <a href="mailto:${personalInfo.email}" style="color: #D7930C; text-decoration: none;">
                ${personalInfo.email}
              </a>
            </div>
          </div>

          <div>
            <strong style="color: #374151;">Entity Type:</strong>
            <div style="color: #1F2937; text-transform: capitalize;">${personalInfo.entityType}</div>
          </div>

          <div>
            <strong style="color: #374151;">Phone:</strong>
            <div style="color: #1F2937;">
              <a href="tel:${personalInfo.phoneNumber}" style="color: #D7930C; text-decoration: none;">
                ${personalInfo.phoneNumber}
              </a>
            </div>
          </div>

          <div>
            <strong style="color: #374151;">Nationality:</strong>
            <div style="color: #1F2937;">${personalInfo.nationality}</div>
          </div>

          <div>
            <strong style="color: #374151;">Net Worth:</strong>
            <div style="color: #1F2937; font-weight: bold;">$${personalInfo.estimatedNetWorth}</div>
          </div>
        </div>
      </div>

      <div style="background: #F0F9FF; border: 1px solid #0EA5E9; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h2 style="color: #0C4A6E; margin: 0 0 20px 0; font-size: 20px; font-weight: bold;">
          Exchange Preferences
        </h2>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <strong style="color: #075985;">Bitcoin Rating Preference:</strong>
            <div style="color: #0C4A6E; background: #FFFFFF; padding: 8px 12px; border-radius: 6px; border: 1px solid #BAE6FD; font-weight: bold;">
              ${exchangePreferences.bitcoinRatingPreference}
            </div>
          </div>

          <div>
            <strong style="color: #075985;">Premium Tolerance:</strong>
            <div style="color: #0C4A6E; background: #FFFFFF; padding: 8px 12px; border-radius: 6px; border: 1px solid #BAE6FD;">
              ${exchangePreferences.premiumTolerance}
            </div>
          </div>

          <div>
            <strong style="color: #075985;">Settlement Timeframe:</strong>
            <div style="color: #0C4A6E; background: #FFFFFF; padding: 8px 12px; border-radius: 6px; border: 1px solid #BAE6FD;">
              ${exchangePreferences.preferredSettlementTimeframe}
            </div>
          </div>

          <div>
            <strong style="color: #075985;">Commission Structure:</strong>
            <div style="color: #0C4A6E; background: #FFFFFF; padding: 8px 12px; border-radius: 6px; border: 1px solid #BAE6FD;">
              ${exchangePreferences.commissionStructure}
            </div>
          </div>
        </div>
      </div>

      <div style="background: #ECFDF5; border: 1px solid #10B981; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
        <h3 style="color: #065F46; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">
          Next Steps for Compliance Review
        </h3>
        
        <ol style="color: #047857; padding-left: 20px; line-height: 1.6;">
          <li>Verify applicant identity and documentation</li>
          <li>Conduct enhanced due diligence (EDD) screening</li>
          <li>Review exchange preferences and risk profile</li>
          <li>Approve or request additional information within 48-72 hours</li>
          <li>Setup bright pool access and commission structure</li>
        </ol>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 12px;">
        <p style="margin: 0;">
          This email contains confidential client information. Handle with appropriate security measures.
        </p>
        <p style="margin: 10px 0 0 0;">
          © ${new Date().getFullYear()} The Buckingham Vault. All rights reserved.
        </p>
      </div>
    </div>
  `
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many KYC applications. Please try again in 1 hour.' },
        { status: 429 }
      )
    }
    
    // Parse and validate request body
    const body = await request.json()
    const validatedData = kycApplicationSchema.parse(body)
    
    // Generate application ID
    const applicationId = `KYC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    // Send email to compliance team
    const complianceEmailResult = await resend.emails.send({
      from: 'Buckingham Vault KYC <noreply@buckinghamvault.com>',
      to: [process.env.COMPLIANCE_EMAIL || 'compliance@buckinghamvault.com'],
      subject: `New KYC Application - ${validatedData.personalInfo.firstName} ${validatedData.personalInfo.lastName} (${applicationId})`,
      html: KYCApplicationEmailTemplate(validatedData),
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
      },
    })

    if (complianceEmailResult.error) {
      console.error('Failed to send compliance email:', complianceEmailResult.error)
      throw new Error('Failed to send application to compliance team')
    }

    // Send confirmation email to applicant
    const confirmationEmailResult = await resend.emails.send({
      from: 'The Buckingham Vault <noreply@buckinghamvault.com>',
      to: [validatedData.personalInfo.email],
      subject: `KYC Application Received - ${applicationId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0F1419; color: #FFFFFF;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #D7930C; font-size: 24px; margin: 0;">The Buckingham Vault</h1>
            <p style="color: #9CA3AF; margin: 5px 0;">Institutional Cryptocurrency Exchange</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #1F2937 0%, #111827 100%); padding: 30px; border-radius: 10px; border: 1px solid #D7930C20;">
            <h2 style="color: #D7930C; margin-top: 0;">KYC Application Received</h2>
            
            <p style="color: #E5E7EB; line-height: 1.6;">
              Dear ${validatedData.personalInfo.firstName} ${validatedData.personalInfo.lastName},
            </p>
            
            <p style="color: #E5E7EB; line-height: 1.6;">
              Thank you for your interest in Buckingham Vault's institutional cryptocurrency exchange services. 
              We have received your KYC application and our compliance team will begin the review process immediately.
            </p>
            
            <div style="background: #0F141920; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D7930C;">
              <h3 style="color: #D7930C; margin-top: 0; font-size: 16px;">Application Details:</h3>
              <ul style="color: #9CA3AF; padding-left: 20px;">
                <li><strong>Application ID:</strong> ${applicationId}</li>
                <li><strong>Entity Type:</strong> ${validatedData.personalInfo.entityType}</li>
                <li><strong>Bitcoin Rating Preference:</strong> ${validatedData.exchangePreferences.bitcoinRatingPreference}</li>
                <li><strong>Estimated Review Time:</strong> 48-72 hours</li>
              </ul>
            </div>
            
            <div style="background: #0F141920; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981;">
              <h3 style="color: #10B981; margin-top: 0; font-size: 16px;">What happens next:</h3>
              <ul style="color: #9CA3AF; padding-left: 20px;">
                <li>Enhanced due diligence review and verification</li>
                <li>Documentation validation and compliance screening</li>
                <li>Exchange access setup and commission structure configuration</li>
                <li>Bright pool trading privileges activation</li>
              </ul>
            </div>
            
            <p style="color: #6B7280; font-size: 14px; line-height: 1.5; margin-top: 30px;">
              This communication is confidential and may contain privileged information. 
              Please keep your application ID (${applicationId}) for reference.
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

    // Log successful submission
    console.log(`KYC application submitted: ${applicationId} from ${validatedData.personalInfo.email} at ${new Date().toISOString()}`)

    return NextResponse.json({
      success: true,
      message: 'KYC application submitted successfully. You will receive a confirmation email shortly.',
      applicationId,
      estimatedReviewTime: '48-72 hours',
    })

  } catch (error) {
    console.error('KYC application error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid application data', 
          details: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to submit KYC application. Please try again or contact support.' },
      { status: 500 }
    )
  }
}