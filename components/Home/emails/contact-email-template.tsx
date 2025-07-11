import * as React from 'react'

interface ContactEmailTemplateProps {
  name: string
  email: string
  company?: string
  title?: string
  phone?: string
  investmentRange?: string
  serviceInterest?: string
  message: string
  preferredContact?: string
  marketingConsent?: boolean
  submittedAt: string
}

export const ContactEmailTemplate: React.FC<ContactEmailTemplateProps> = ({
  name,
  email,
  company,
  title,
  phone,
  investmentRange,
  serviceInterest,
  message,
  preferredContact,
  marketingConsent,
  submittedAt,
}) => {
  const formatInvestmentRange = (range?: string) => {
    const ranges: Record<string, string> = {
      'under-1m': 'Under $1M',
      '1m-5m': '$1M - $5M',
      '5m-25m': '$5M - $25M',
      '25m-100m': '$25M - $100M',
      'over-100m': 'Over $100M',
      'prefer-not-to-say': 'Prefer not to say'
    }
    return ranges[range || ''] || 'Not specified'
  }

  const formatServiceInterest = (service?: string) => {
    const services: Record<string, string> = {
      'digital-asset-custody': 'Digital Asset Custody',
      'portfolio-management': 'Portfolio Management',
      'family-office-services': 'Family Office Services',
      'institutional-solutions': 'Institutional Solutions',
      'other': 'Other Services'
    }
    return services[service || ''] || 'Not specified'
  }

  const formatPreferredContact = (method?: string) => {
    const methods: Record<string, string> = {
      'email': 'Email',
      'phone': 'Phone',
      'meeting': 'In-person meeting'
    }
    return methods[method || ''] || 'Not specified'
  }

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: '#FFFFFF',
      color: '#1F2937'
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '3px solid #D7930C'
      }}>
        <h1 style={{ 
          color: '#D7930C', 
          fontSize: '28px', 
          margin: '0 0 10px 0',
          fontWeight: 'bold'
        }}>
          The Buckingham Vault
        </h1>
        <p style={{ 
          color: '#6B7280', 
          margin: '0',
          fontSize: '16px'
        }}>
          New Contact Inquiry
        </p>
      </div>

      {/* Urgency Indicator */}
      <div style={{
        backgroundColor: '#FEF3CD',
        border: '1px solid #F59E0B',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '25px'
      }}>
        <h2 style={{ 
          color: '#92400E', 
          margin: '0 0 5px 0',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          🔔 High Priority Inquiry
        </h2>
        <p style={{ 
          color: '#78350F', 
          margin: '0',
          fontSize: '14px'
        }}>
          This inquiry requires immediate attention from our senior advisory team.
        </p>
      </div>

      {/* Contact Information */}
      <div style={{ 
        backgroundColor: '#F9FAFB',
        border: '1px solid #E5E7EB',
        borderRadius: '10px',
        padding: '25px',
        marginBottom: '25px'
      }}>
        <h2 style={{ 
          color: '#1F2937', 
          margin: '0 0 20px 0',
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          Contact Information
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <strong style={{ color: '#374151' }}>Name:</strong>
            <div style={{ color: '#1F2937', fontSize: '16px', fontWeight: 'bold' }}>{name}</div>
          </div>

          <div>
            <strong style={{ color: '#374151' }}>Email:</strong>
            <div style={{ color: '#1F2937' }}>
              <a href={`mailto:${email}`} style={{ color: '#D7930C', textDecoration: 'none' }}>
                {email}
              </a>
            </div>
          </div>

          {company && (
            <div>
              <strong style={{ color: '#374151' }}>Company:</strong>
              <div style={{ color: '#1F2937' }}>{company}</div>
            </div>
          )}

          {title && (
            <div>
              <strong style={{ color: '#374151' }}>Title:</strong>
              <div style={{ color: '#1F2937' }}>{title}</div>
            </div>
          )}

          {phone && (
            <div>
              <strong style={{ color: '#374151' }}>Phone:</strong>
              <div style={{ color: '#1F2937' }}>
                <a href={`tel:${phone}`} style={{ color: '#D7930C', textDecoration: 'none' }}>
                  {phone}
                </a>
              </div>
            </div>
          )}

          <div>
            <strong style={{ color: '#374151' }}>Preferred Contact:</strong>
            <div style={{ color: '#1F2937' }}>{formatPreferredContact(preferredContact)}</div>
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div style={{ 
        backgroundColor: '#F0F9FF',
        border: '1px solid #0EA5E9',
        borderRadius: '10px',
        padding: '25px',
        marginBottom: '25px'
      }}>
        <h2 style={{ 
          color: '#0C4A6E', 
          margin: '0 0 20px 0',
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          Service Requirements
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <strong style={{ color: '#075985' }}>Investment Range:</strong>
            <div style={{ 
              color: '#0C4A6E', 
              fontSize: '16px', 
              fontWeight: 'bold',
              backgroundColor: '#FFFFFF',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #BAE6FD'
            }}>
              {formatInvestmentRange(investmentRange)}
            </div>
          </div>

          <div>
            <strong style={{ color: '#075985' }}>Service Interest:</strong>
            <div style={{ 
              color: '#0C4A6E',
              backgroundColor: '#FFFFFF',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #BAE6FD'
            }}>
              {formatServiceInterest(serviceInterest)}
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      <div style={{ 
        backgroundColor: '#FFFBEB',
        border: '1px solid #F59E0B',
        borderRadius: '10px',
        padding: '25px',
        marginBottom: '25px'
      }}>
        <h2 style={{ 
          color: '#92400E', 
          margin: '0 0 15px 0',
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          Inquiry Details
        </h2>
        <div style={{ 
          color: '#78350F',
          lineHeight: '1.6',
          backgroundColor: '#FFFFFF',
          padding: '15px',
          borderRadius: '6px',
          border: '1px solid #FDE68A',
          whiteSpace: 'pre-wrap'
        }}>
          {message}
        </div>
      </div>

      {/* Compliance Information */}
      <div style={{ 
        backgroundColor: '#F3F4F6',
        border: '1px solid #D1D5DB',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '25px'
      }}>
        <h3 style={{ 
          color: '#374151', 
          margin: '0 0 15px 0',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          Compliance & Consent
        </h3>
        
        <div style={{ fontSize: '14px', color: '#6B7280' }}>
          <div style={{ marginBottom: '8px' }}>
            ✅ Privacy Policy Consent: <strong style={{ color: '#059669' }}>Granted</strong>
          </div>
          <div style={{ marginBottom: '8px' }}>
            📧 Marketing Communications: 
            <strong style={{ color: marketingConsent ? '#059669' : '#DC2626' }}>
              {marketingConsent ? ' Opted In' : ' Opted Out'}
            </strong>
          </div>
          <div>
            📅 Submitted: <strong>{new Date(submittedAt).toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div style={{ 
        backgroundColor: '#ECFDF5',
        border: '1px solid #10B981',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '25px'
      }}>
        <h3 style={{ 
          color: '#065F46', 
          margin: '0 0 15px 0',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          Recommended Next Steps
        </h3>
        
        <ol style={{ color: '#047857', paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>Initial assessment and KYC review</li>
          <li>Schedule preliminary consultation within 24 hours</li>
          <li>Prepare customized solution proposal</li>
          <li>Arrange secure meeting for detailed discussion</li>
        </ol>
      </div>

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        paddingTop: '20px', 
        borderTop: '1px solid #E5E7EB',
        color: '#6B7280',
        fontSize: '12px'
      }}>
        <p style={{ margin: '0' }}>
          This email contains confidential information. Please handle with appropriate discretion.
        </p>
        <p style={{ margin: '10px 0 0 0' }}>
          © {new Date().getFullYear()} The Buckingham Vault. All rights reserved.
        </p>
      </div>
    </div>
  )
}