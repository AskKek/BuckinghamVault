import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import React from 'react'

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy-key-for-build')

// Mandate Application Schema
const mandateApplicationSchema = z.object({
  mandateDetails: z.object({
    mandateType: z.enum(['buy', 'sell', 'swap', 'arbitrage', 'portfolio-rebalancing']),
    transactionValue: z.string(),
    cryptocurrency: z.string(),
    quantity: z.string(),
    urgency: z.enum(['immediate', '24-hours', '1-week', '1-month', 'flexible']),
    executionStrategy: z.enum(['market', 'limit', 'twap', 'vwap', 'iceberg', 'custom']),
    targetPrice: z.string().optional(),
  }),
  counterpartyPreferences: z.object({
    preferredCounterparties: z.array(z.string()),
    excludedCounterparties: z.array(z.string()),
    geographicRestrictions: z.array(z.string()),
    regulatoryRequirements: z.array(z.string()),
    minimumCounterpartyRating: z.enum(['AAA', 'AA', 'A', 'BBB', 'BB', 'any']),
    bitcoinRatingRequirement: z.enum(['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'C', 'any']),
    complianceFramework: z.array(z.string()),
  }),
  commissionSettlement: z.object({
    commissionStructure: z.enum(['fixed-fee', 'percentage', 'tiered', 'success-fee', 'custom']),
    commissionRate: z.string().optional(),
    commissionRecipients: z.array(z.object({
      walletAddress: z.string(),
      percentage: z.number(),
      description: z.string(),
    })),
    settlementCurrency: z.enum(['USD', 'EUR', 'GBP', 'BTC', 'ETH', 'USDC', 'USDT']),
    settlementMethod: z.enum(['wire', 'crypto', 'escrow', 'dvp']),
    settlementTimeframe: z.enum(['instant', '1-hour', '4-hours', '24-hours', '48-hours']),
  }),
  riskManagement: z.object({
    maximumSlippage: z.string(),
    stopLossLevel: z.string().optional(),
    takeProfitLevel: z.string().optional(),
    positionSizing: z.enum(['fixed', 'percentage', 'risk-based', 'kelly']),
    hedgingRequired: z.boolean(),
    hedgingInstruments: z.array(z.string()).optional(),
    riskLimits: z.object({
      daily: z.string().optional(),
      weekly: z.string().optional(),
      monthly: z.string().optional(),
    }),
  }),
  authorization: z.object({
    tradingAuthority: z.enum(['full-discretion', 'limited-discretion', 'approval-required']),
    authorizedPersons: z.array(z.object({
      name: z.string(),
      title: z.string(),
      email: z.string(),
      signatureRequired: z.boolean(),
    })),
    executionWindow: z.object({
      startDate: z.string(),
      endDate: z.string(),
      tradingHours: z.string(),
    }),
    reportingRequirements: z.array(z.string()),
    confidentialityLevel: z.enum(['standard', 'enhanced', 'maximum']),
  }),
})

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 30 * 60 * 1000 // 30 minutes
  const maxRequests = 5 // Max 5 mandate applications per 30 minutes
  
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

// Email template for mandate application
function MandateApplicationEmailTemplate(data: any, mandateId: string) {
  const { mandateDetails, counterpartyPreferences, commissionSettlement, riskManagement, authorization } = data
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; background: #FFFFFF; color: #1F2937;">
      <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #D7930C;">
        <h1 style="color: #D7930C; font-size: 28px; margin: 0 0 10px 0; font-weight: bold;">
          The Buckingham Vault
        </h1>
        <p style="color: #6B7280; margin: 0; font-size: 16px;">
          New Mandate Application Received
        </p>
      </div>

      <div style="background: #FEF3CD; border: 1px solid #F59E0B; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
        <h2 style="color: #92400E; margin: 0 0 5px 0; font-size: 16px; font-weight: bold;">
          🔔 High Priority OTC Mandate
        </h2>
        <p style="color: #78350F; margin: 0; font-size: 14px;">
          This mandate requires immediate review from our trading desk and counterparty matching engine.
        </p>
      </div>

      <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h2 style="color: #1F2937; margin: 0 0 20px 0; font-size: 20px; font-weight: bold;">
          Mandate Details
        </h2>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
          <div>
            <strong style="color: #374151;">Mandate ID:</strong>
            <div style="color: #1F2937; font-size: 16px; font-weight: bold; font-family: monospace;">
              ${mandateId}
            </div>
          </div>

          <div>
            <strong style="color: #374151;">Mandate Type:</strong>
            <div style="color: #1F2937; font-weight: bold; text-transform: uppercase;">
              ${mandateDetails.mandateType}
            </div>
          </div>

          <div>
            <strong style="color: #374151;">Cryptocurrency:</strong>
            <div style="color: #1F2937; font-weight: bold;">${mandateDetails.cryptocurrency}</div>
          </div>

          <div>
            <strong style="color: #374151;">Quantity:</strong>
            <div style="color: #1F2937; font-weight: bold;">${mandateDetails.quantity}</div>
          </div>

          <div>
            <strong style="color: #374151;">Transaction Value:</strong>
            <div style="color: #1F2937; font-weight: bold; font-size: 18px;">${mandateDetails.transactionValue}</div>
          </div>

          <div>
            <strong style="color: #374151;">Urgency:</strong>
            <div style="color: #1F2937; font-weight: bold;">${mandateDetails.urgency}</div>
          </div>

          <div>
            <strong style="color: #374151;">Execution Strategy:</strong>
            <div style="color: #1F2937;">${mandateDetails.executionStrategy}</div>
          </div>

          ${mandateDetails.targetPrice ? `
          <div>
            <strong style="color: #374151;">Target Price:</strong>
            <div style="color: #1F2937; font-weight: bold;">${mandateDetails.targetPrice}</div>
          </div>` : ''}
        </div>
      </div>

      <div style="background: #F0F9FF; border: 1px solid #0EA5E9; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h2 style="color: #0C4A6E; margin: 0 0 20px 0; font-size: 20px; font-weight: bold;">
          Counterparty & Rating Requirements
        </h2>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <strong style="color: #075985;">Min Counterparty Rating:</strong>
            <div style="color: #0C4A6E; background: #FFFFFF; padding: 8px 12px; border-radius: 6px; border: 1px solid #BAE6FD; font-weight: bold;">
              ${counterpartyPreferences.minimumCounterpartyRating}
            </div>
          </div>

          <div>
            <strong style="color: #075985;">Bitcoin Rating Requirement:</strong>
            <div style="color: #0C4A6E; background: #FFFFFF; padding: 8px 12px; border-radius: 6px; border: 1px solid #BAE6FD; font-weight: bold;">
              ${counterpartyPreferences.bitcoinRatingRequirement}
            </div>
          </div>

          ${counterpartyPreferences.geographicRestrictions.length > 0 ? `
          <div style="grid-column: 1 / -1;">
            <strong style="color: #075985;">Geographic Restrictions:</strong>
            <div style="color: #0C4A6E; background: #FFFFFF; padding: 8px 12px; border-radius: 6px; border: 1px solid #BAE6FD;">
              ${counterpartyPreferences.geographicRestrictions.join(', ')}
            </div>
          </div>` : ''}

          ${counterpartyPreferences.complianceFramework.length > 0 ? `
          <div style="grid-column: 1 / -1;">
            <strong style="color: #075985;">Compliance Requirements:</strong>
            <div style="color: #0C4A6E; background: #FFFFFF; padding: 8px 12px; border-radius: 6px; border: 1px solid #BAE6FD;">
              ${counterpartyPreferences.complianceFramework.join(', ')}
            </div>
          </div>` : ''}
        </div>
      </div>

      <div style="background: #ECFDF5; border: 1px solid #10B981; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h2 style="color: #065F46; margin: 0 0 20px 0; font-size: 20px; font-weight: bold;">
          Commission & Settlement
        </h2>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <strong style="color: #047857;">Commission Structure:</strong>
            <div style="color: #065F46; background: #FFFFFF; padding: 8px 12px; border-radius: 6px; border: 1px solid #A7F3D0;">
              ${commissionSettlement.commissionStructure}
            </div>
          </div>

          ${commissionSettlement.commissionRate ? `
          <div>
            <strong style="color: #047857;">Commission Rate:</strong>
            <div style="color: #065F46; background: #FFFFFF; padding: 8px 12px; border-radius: 6px; border: 1px solid #A7F3D0; font-weight: bold;">
              ${commissionSettlement.commissionRate}
            </div>
          </div>` : ''}

          <div>
            <strong style="color: #047857;">Settlement Currency:</strong>
            <div style="color: #065F46; background: #FFFFFF; padding: 8px 12px; border-radius: 6px; border: 1px solid #A7F3D0;">
              ${commissionSettlement.settlementCurrency}
            </div>
          </div>

          <div>
            <strong style="color: #047857;">Settlement Timeframe:</strong>
            <div style="color: #065F46; background: #FFFFFF; padding: 8px 12px; border-radius: 6px; border: 1px solid #A7F3D0;">
              ${commissionSettlement.settlementTimeframe}
            </div>
          </div>
        </div>

        ${commissionSettlement.commissionRecipients.length > 0 ? `
        <div style="margin-top: 20px;">
          <strong style="color: #047857;">Commission Recipients:</strong>
          <div style="margin-top: 10px;">
            ${commissionSettlement.commissionRecipients.map((recipient: any) => `
              <div style="background: #FFFFFF; padding: 12px; border-radius: 6px; border: 1px solid #A7F3D0; margin-bottom: 8px;">
                <div style="color: #065F46; font-weight: bold;">${recipient.description} (${recipient.percentage}%)</div>
                <div style="color: #047857; font-family: monospace; font-size: 12px;">${recipient.walletAddress}</div>
              </div>
            `).join('')}
          </div>
        </div>` : ''}
      </div>

      <div style="background: #FEF2F2; border: 1px solid #F87171; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h2 style="color: #991B1B; margin: 0 0 20px 0; font-size: 20px; font-weight: bold;">
          Risk Management
        </h2>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <strong style="color: #B91C1C;">Maximum Slippage:</strong>
            <div style="color: #991B1B; background: #FFFFFF; padding: 8px 12px; border-radius: 6px; border: 1px solid #FECACA; font-weight: bold;">
              ${riskManagement.maximumSlippage}
            </div>
          </div>

          <div>
            <strong style="color: #B91C1C;">Position Sizing:</strong>
            <div style="color: #991B1B; background: #FFFFFF; padding: 8px 12px; border-radius: 6px; border: 1px solid #FECACA;">
              ${riskManagement.positionSizing}
            </div>
          </div>

          ${riskManagement.stopLossLevel ? `
          <div>
            <strong style="color: #B91C1C;">Stop Loss:</strong>
            <div style="color: #991B1B; background: #FFFFFF; padding: 8px 12px; border-radius: 6px; border: 1px solid #FECACA;">
              ${riskManagement.stopLossLevel}
            </div>
          </div>` : ''}

          ${riskManagement.takeProfitLevel ? `
          <div>
            <strong style="color: #B91C1C;">Take Profit:</strong>
            <div style="color: #991B1B; background: #FFFFFF; padding: 8px 12px; border-radius: 6px; border: 1px solid #FECACA;">
              ${riskManagement.takeProfitLevel}
            </div>
          </div>` : ''}

          <div>
            <strong style="color: #B91C1C;">Hedging Required:</strong>
            <div style="color: #991B1B; background: #FFFFFF; padding: 8px 12px; border-radius: 6px; border: 1px solid #FECACA;">
              ${riskManagement.hedgingRequired ? 'Yes' : 'No'}
            </div>
          </div>
        </div>
      </div>

      <div style="background: #FFFBEB; border: 1px solid #F59E0B; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h2 style="color: #92400E; margin: 0 0 20px 0; font-size: 20px; font-weight: bold;">
          Authorization & Execution
        </h2>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <strong style="color: #B45309;">Trading Authority:</strong>
            <div style="color: #92400E; background: #FFFFFF; padding: 8px 12px; border-radius: 6px; border: 1px solid #FDE68A;">
              ${authorization.tradingAuthority}
            </div>
          </div>

          <div>
            <strong style="color: #B45309;">Confidentiality Level:</strong>
            <div style="color: #92400E; background: #FFFFFF; padding: 8px 12px; border-radius: 6px; border: 1px solid #FDE68A;">
              ${authorization.confidentialityLevel}
            </div>
          </div>

          <div>
            <strong style="color: #B45309;">Execution Start:</strong>
            <div style="color: #92400E; background: #FFFFFF; padding: 8px 12px; border-radius: 6px; border: 1px solid #FDE68A;">
              ${authorization.executionWindow.startDate}
            </div>
          </div>

          <div>
            <strong style="color: #B45309;">Execution End:</strong>
            <div style="color: #92400E; background: #FFFFFF; padding: 8px 12px; border-radius: 6px; border: 1px solid #FDE68A;">
              ${authorization.executionWindow.endDate}
            </div>
          </div>
        </div>

        ${authorization.authorizedPersons.length > 0 ? `
        <div style="margin-top: 20px;">
          <strong style="color: #B45309;">Authorized Persons:</strong>
          <div style="margin-top: 10px;">
            ${authorization.authorizedPersons.map((person: any) => `
              <div style="background: #FFFFFF; padding: 12px; border-radius: 6px; border: 1px solid #FDE68A; margin-bottom: 8px;">
                <div style="color: #92400E; font-weight: bold;">${person.name} - ${person.title}</div>
                <div style="color: #B45309; font-size: 14px;">${person.email}</div>
                ${person.signatureRequired ? '<div style="color: #D97706; font-size: 12px;">Signature Required</div>' : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}
      </div>

      <div style="background: #ECFDF5; border: 1px solid #10B981; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
        <h3 style="color: #065F46; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">
          Next Steps for Trading Desk
        </h3>
        
        <ol style="color: #047857; padding-left: 20px; line-height: 1.6;">
          <li>Review mandate parameters and risk limits</li>
          <li>Run counterparty matching algorithm based on preferences</li>
          <li>Validate Bitcoin rating requirements and availability</li>
          <li>Setup commission distribution and settlement instructions</li>
          <li>Begin execution within specified timeframe and parameters</li>
          <li>Provide real-time execution updates and confirmations</li>
        </ol>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 12px;">
        <p style="margin: 0;">
          This mandate contains confidential trading information. Handle with maximum security protocols.
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
        { error: 'Too many mandate applications. Please try again in 30 minutes.' },
        { status: 429 }
      )
    }
    
    // Parse and validate request body
    const body = await request.json()
    const validatedData = mandateApplicationSchema.parse(body)
    
    // Generate mandate ID
    const mandateId = `MDT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    // Send email to trading desk
    const tradingDeskEmailResult = await resend.emails.send({
      from: 'Buckingham Vault Trading <noreply@buckinghamvault.com>',
      to: [process.env.TRADING_DESK_EMAIL || 'trading@buckinghamvault.com'],
      subject: `New OTC Mandate - ${validatedData.mandateDetails.mandateType.toUpperCase()} ${validatedData.mandateDetails.cryptocurrency} ${validatedData.mandateDetails.quantity} (${mandateId})`,
      html: MandateApplicationEmailTemplate(validatedData, mandateId),
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
      },
    })

    if (tradingDeskEmailResult.error) {
      console.error('Failed to send trading desk email:', tradingDeskEmailResult.error)
      throw new Error('Failed to send mandate to trading desk')
    }

    // Get primary contact email from authorized persons
    const primaryContact = validatedData.authorization.authorizedPersons[0]?.email || 'noreply@example.com'

    // Send confirmation email to client
    const confirmationEmailResult = await resend.emails.send({
      from: 'The Buckingham Vault <noreply@buckinghamvault.com>',
      to: [primaryContact],
      subject: `Mandate Application Received - ${mandateId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0F1419; color: #FFFFFF;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #D7930C; font-size: 24px; margin: 0;">The Buckingham Vault</h1>
            <p style="color: #9CA3AF; margin: 5px 0;">Institutional Cryptocurrency Exchange</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #1F2937 0%, #111827 100%); padding: 30px; border-radius: 10px; border: 1px solid #D7930C20;">
            <h2 style="color: #D7930C; margin-top: 0;">Mandate Application Received</h2>
            
            <p style="color: #E5E7EB; line-height: 1.6;">
              Your OTC cryptocurrency mandate has been successfully submitted to our trading desk 
              and counterparty matching engine.
            </p>
            
            <div style="background: #0F141920; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D7930C;">
              <h3 style="color: #D7930C; margin-top: 0; font-size: 16px;">Mandate Details:</h3>
              <ul style="color: #9CA3AF; padding-left: 20px;">
                <li><strong>Mandate ID:</strong> ${mandateId}</li>
                <li><strong>Type:</strong> ${validatedData.mandateDetails.mandateType.toUpperCase()}</li>
                <li><strong>Asset:</strong> ${validatedData.mandateDetails.cryptocurrency}</li>
                <li><strong>Quantity:</strong> ${validatedData.mandateDetails.quantity}</li>
                <li><strong>Value:</strong> ${validatedData.mandateDetails.transactionValue}</li>
                <li><strong>Urgency:</strong> ${validatedData.mandateDetails.urgency}</li>
              </ul>
            </div>
            
            <div style="background: #0F141920; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981;">
              <h3 style="color: #10B981; margin-top: 0; font-size: 16px;">What happens next:</h3>
              <ul style="color: #9CA3AF; padding-left: 20px;">
                <li>Counterparty matching based on your preferences</li>
                <li>Bitcoin forensic rating verification</li>
                <li>Risk management review and approval</li>
                <li>Commission structure setup and testing</li>
                <li>Execution within your specified timeframe</li>
                <li>Real-time updates and settlement confirmation</li>
              </ul>
            </div>
            
            <div style="background: #0F141920; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F59E0B;">
              <h3 style="color: #F59E0B; margin-top: 0; font-size: 16px;">Bright Pool Execution:</h3>
              <p style="color: #9CA3AF; margin: 0; line-height: 1.6;">
                Your mandate will be executed through our bright pool infrastructure with 
                zero slippage at hourly indexed prices. Our forensic rating system ensures 
                Bitcoin quality meets your compliance requirements.
              </p>
            </div>
            
            <p style="color: #6B7280; font-size: 14px; line-height: 1.5; margin-top: 30px;">
              This communication is confidential and may contain privileged information. 
              Please keep your mandate ID (${mandateId}) for reference and tracking.
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
    console.log(`Mandate application submitted: ${mandateId} for ${validatedData.mandateDetails.mandateType} ${validatedData.mandateDetails.quantity} ${validatedData.mandateDetails.cryptocurrency} at ${new Date().toISOString()}`)

    return NextResponse.json({
      success: true,
      message: 'Mandate application submitted successfully. Our trading desk will begin counterparty matching immediately.',
      mandateId,
      estimatedExecutionTime: validatedData.mandateDetails.urgency,
      nextUpdate: 'within 1 hour',
    })

  } catch (error) {
    console.error('Mandate application error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid mandate data', 
          details: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to submit mandate application. Please try again or contact our trading desk.' },
      { status: 500 }
    )
  }
}