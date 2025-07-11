"use client"

/**
 * Deal Form Example
 * Demonstrates the complete FormComposer system with a sophisticated deal creation form
 */

import React from 'react'
import { z } from 'zod'
import { FormComposer, FormComposerConfig } from '../FormComposer'
import { validationPresets, dealValidations, currencyValidation, percentageValidation } from '@/lib/validations/financial'
import { 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  Shield, 
  Calendar,
  DollarSign,
  Percent,
  FileText,
  User,
  Globe
} from 'lucide-react'

// Enhanced deal form schema
const dealFormSchema = z.object({
  // Basic deal information
  dealNumber: dealValidations.dealNumber,
  dealType: z.enum(['buy', 'sell'], {
    errorMap: () => ({ message: 'Please select deal type' })
  }),
  
  // Client information
  clientName: dealValidations.clientName,
  clientEmail: z.string().email('Please enter a valid email address'),
  clientPhone: z.string().min(10, 'Please enter a valid phone number'),
  
  // Asset details
  assetType: z.enum(['BTC', 'ETH', 'USDT', 'USDC', 'other'], {
    errorMap: () => ({ message: 'Please select asset type' })
  }),
  amount: currencyValidation({ min: 1000, max: 1000000000 }),
  pricePerUnit: currencyValidation({ min: 0.01, required: false }),
  totalValue: currencyValidation({ min: 1000, max: 1000000000 }),
  
  // Commission and fees
  commissionRate: percentageValidation({ min: 0, max: 10, precision: 4 }),
  commissionAmount: currencyValidation({ min: 0, required: false }),
  
  // Settlement details
  settlementMethod: z.enum(['binance_vip', 'bitgo_custody', 'escrow_to_escrow', 'wire_transfer'], {
    errorMap: () => ({ message: 'Please select settlement method' })
  }),
  settlementDate: z.date().min(new Date(), 'Settlement date must be in the future'),
  escrowRequired: z.boolean().default(false),
  
  // Risk and compliance
  forensicRating: dealValidations.forensicRating,
  region: z.enum(['north_america', 'europe', 'asia_pacific', 'middle_east'], {
    errorMap: () => ({ message: 'Please select region' })
  }),
  kycStatus: z.enum(['pending', 'approved', 'rejected']).default('pending'),
  riskScore: z.number().min(1).max(10).default(5),
  
  // Documentation
  documents: z.array(z.instanceof(File)).optional(),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
  
  // Advanced options
  tags: z.array(z.string()).default([]),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  isUrgent: z.boolean().default(false),
  
  // Crypto-specific fields
  walletAddress: z.string().optional(),
  
  // Banking details
  iban: z.string().optional(),
  swiftCode: z.string().optional(),
})

type DealFormData = z.infer<typeof dealFormSchema>

export function DealFormExample() {
  // Form configuration
  const dealFormConfig: FormComposerConfig<DealFormData> = {
    id: 'deal-creation-form',
    title: 'Create New Deal',
    description: 'Enter deal details for institutional transaction processing',
    schema: dealFormSchema,
    layout: 'single',
    variant: 'luxury',
    submitBehavior: 'both',
    
    // Auto-save configuration
    autosave: {
      enabled: true,
      interval: 2000, // 2 seconds
      key: 'deal-form-draft',
      version: '2.0'
    },
    
    // Default values
    defaultValues: {
      dealType: 'buy',
      kycStatus: 'pending',
      riskScore: 5,
      priority: 'medium',
      isUrgent: false,
      escrowRequired: false,
      commissionRate: 1.0,
      tags: []
    },
    
    // Field definitions
    fields: [
      // Deal Type and Number
      {
        id: 'deal-type',
        name: 'dealType',
        type: 'radio',
        label: 'Deal Type',
        description: 'Select whether this is a buy or sell order',
        required: true,
        layout: { width: 'half', order: 1 },
        options: [
          { value: 'buy', label: 'Buy Order', description: 'Purchase digital assets', icon: TrendingUp },
          { value: 'sell', label: 'Sell Order', description: 'Sell digital assets', icon: TrendingDown }
        ]
      },
      {
        id: 'deal-number',
        name: 'dealNumber',
        type: 'text',
        label: 'Deal Number',
        description: 'Auto-generated deal identifier',
        placeholder: 'BV-2024-001',
        required: true,
        layout: { width: 'half', order: 2 },
        props: { readOnly: true }
      },
      
      // Client Information
      {
        id: 'client-name',
        name: 'clientName',
        type: 'text',
        label: 'Client Name',
        placeholder: 'Enter client or entity name',
        required: true,
        layout: { width: 'third', order: 3 }
      },
      {
        id: 'client-email',
        name: 'clientEmail',
        type: 'email',
        label: 'Client Email',
        placeholder: 'client@institution.com',
        required: true,
        layout: { width: 'third', order: 4 }
      },
      {
        id: 'client-phone',
        name: 'clientPhone',
        type: 'tel',
        label: 'Client Phone',
        placeholder: '+1 (555) 123-4567',
        required: true,
        layout: { width: 'third', order: 5 }
      },
      
      // Asset Details
      {
        id: 'asset-type',
        name: 'assetType',
        type: 'select',
        label: 'Asset Type',
        description: 'Type of digital asset for this transaction',
        required: true,
        layout: { width: 'quarter', order: 6 },
        options: [
          { value: 'BTC', label: 'Bitcoin (BTC)', description: 'Primary cryptocurrency' },
          { value: 'ETH', label: 'Ethereum (ETH)', description: 'Smart contract platform' },
          { value: 'USDT', label: 'Tether (USDT)', description: 'USD-pegged stablecoin' },
          { value: 'USDC', label: 'USD Coin (USDC)', description: 'Regulated stablecoin' },
          { value: 'other', label: 'Other', description: 'Other digital assets' }
        ]
      },
      {
        id: 'amount',
        name: 'amount',
        type: 'currency',
        label: 'Asset Amount',
        description: 'Quantity of digital assets',
        required: true,
        layout: { width: 'quarter', order: 7 },
        props: { 
          currency: 'USD',
          precision: 8, // Higher precision for crypto
          showSymbol: false 
        }
      },
      {
        id: 'price-per-unit',
        name: 'pricePerUnit',
        type: 'currency',
        label: 'Price per Unit',
        description: 'Price per individual unit (optional)',
        layout: { width: 'quarter', order: 8 },
        props: { currency: 'USD', precision: 2 }
      },
      {
        id: 'total-value',
        name: 'totalValue',
        type: 'currency',
        label: 'Total Value',
        description: 'Total transaction value in USD',
        required: true,
        layout: { width: 'quarter', order: 9 },
        props: { currency: 'USD', precision: 2 }
      },
      
      // Commission and Fees
      {
        id: 'commission-rate',
        name: 'commissionRate',
        type: 'percentage',
        label: 'Commission Rate',
        description: 'Commission percentage for this transaction',
        required: true,
        layout: { width: 'half', order: 10 },
        props: { min: 0, max: 10, precision: 4 }
      },
      {
        id: 'commission-amount',
        name: 'commissionAmount',
        type: 'currency',
        label: 'Commission Amount',
        description: 'Calculated commission amount (auto-calculated)',
        layout: { width: 'half', order: 11 },
        props: { currency: 'USD', precision: 2, readOnly: true }
      },
      
      // Settlement Information
      {
        id: 'settlement-method',
        name: 'settlementMethod',
        type: 'select',
        label: 'Settlement Method',
        description: 'How the transaction will be settled',
        required: true,
        layout: { width: 'half', order: 12 },
        options: [
          { value: 'binance_vip', label: 'Binance VIP', description: 'High-volume institutional settlement' },
          { value: 'bitgo_custody', label: 'BitGo Custody', description: 'Institutional custody solution' },
          { value: 'escrow_to_escrow', label: 'Escrow to Escrow', description: 'Third-party escrow service' },
          { value: 'wire_transfer', label: 'Wire Transfer', description: 'Traditional banking wire' }
        ]
      },
      {
        id: 'settlement-date',
        name: 'settlementDate',
        type: 'date',
        label: 'Settlement Date',
        description: 'When the transaction should be settled',
        required: true,
        layout: { width: 'half', order: 13 },
        props: { minDate: new Date() }
      },
      
      // Risk and Compliance
      {
        id: 'forensic-rating',
        name: 'forensicRating',
        type: 'select',
        label: 'Forensic Rating',
        description: 'Risk assessment rating for this transaction',
        required: true,
        layout: { width: 'quarter', order: 14 },
        options: [
          { value: 'AAA', label: 'AAA - Excellent', description: 'Highest rating, minimal risk' },
          { value: 'AA', label: 'AA - Very Good', description: 'Very low risk profile' },
          { value: 'A', label: 'A - Good', description: 'Low risk, acceptable' },
          { value: 'BBB', label: 'BBB - Adequate', description: 'Moderate risk level' },
          { value: 'unrated', label: 'Unrated', description: 'Rating pending or unavailable' }
        ]
      },
      {
        id: 'region',
        name: 'region',
        type: 'select',
        label: 'Geographic Region',
        description: 'Primary geographic region for this transaction',
        required: true,
        layout: { width: 'quarter', order: 15 },
        options: [
          { value: 'north_america', label: 'North America', icon: Globe },
          { value: 'europe', label: 'Europe', icon: Globe },
          { value: 'asia_pacific', label: 'Asia Pacific', icon: Globe },
          { value: 'middle_east', label: 'Middle East', icon: Globe }
        ]
      },
      {
        id: 'risk-score',
        name: 'riskScore',
        type: 'slider',
        label: 'Risk Score',
        description: 'Overall risk assessment (1-10 scale)',
        layout: { width: 'quarter', order: 16 },
        props: { min: 1, max: 10, step: 1 }
      },
      {
        id: 'escrow-required',
        name: 'escrowRequired',
        type: 'toggle',
        label: 'Escrow Required',
        description: 'Enable if third-party escrow is required for this transaction',
        layout: { width: 'quarter', order: 17 }
      },
      
      // Crypto-specific fields (conditional)
      {
        id: 'wallet-address',
        name: 'walletAddress',
        type: 'crypto',
        label: 'Wallet Address',
        description: 'Destination wallet address for crypto assets',
        layout: { width: 'half', order: 18 },
        dependencies: [
          {
            field: 'assetType',
            condition: 'not_equals',
            value: 'other',
            action: 'show'
          }
        ],
        props: { cryptoType: 'generic' }
      },
      
      // Banking details (conditional)
      {
        id: 'iban',
        name: 'iban',
        type: 'iban',
        label: 'IBAN',
        description: 'International Bank Account Number for wire transfers',
        layout: { width: 'half', order: 19 },
        dependencies: [
          {
            field: 'settlementMethod',
            condition: 'equals',
            value: 'wire_transfer',
            action: 'show'
          }
        ]
      },
      
      // Advanced Options
      {
        id: 'priority',
        name: 'priority',
        type: 'radio',
        label: 'Priority Level',
        description: 'Processing priority for this transaction',
        layout: { width: 'third', order: 20 },
        options: [
          { value: 'low', label: 'Low Priority', description: 'Standard processing time' },
          { value: 'medium', label: 'Medium Priority', description: 'Expedited processing' },
          { value: 'high', label: 'High Priority', description: 'Urgent processing required' }
        ]
      },
      {
        id: 'is-urgent',
        name: 'isUrgent',
        type: 'checkbox',
        label: 'Mark as Urgent',
        description: 'Flag this deal for immediate attention',
        layout: { width: 'third', order: 21 }
      },
      {
        id: 'tags',
        name: 'tags',
        type: 'tags',
        label: 'Tags',
        description: 'Add tags for categorization and search',
        placeholder: 'institutional, large-volume, priority-client',
        layout: { width: 'third', order: 22 }
      },
      
      // Documentation
      {
        id: 'documents',
        name: 'documents',
        type: 'file',
        label: 'Supporting Documents',
        description: 'Upload contracts, agreements, and compliance documentation',
        layout: { width: 'half', order: 23 },
        props: {
          multiple: true,
          accept: '.pdf,.doc,.docx,.jpg,.png',
          maxSize: 10 * 1024 * 1024 // 10MB
        }
      },
      {
        id: 'notes',
        name: 'notes',
        type: 'textarea',
        label: 'Additional Notes',
        description: 'Any additional information or special instructions',
        placeholder: 'Enter any special instructions, compliance notes, or additional context...',
        layout: { width: 'half', order: 24 },
        props: { rows: 6 }
      }
    ],
    
    // Form handlers
    onSubmit: async (data) => {
      console.log('Submitting deal form:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would typically send data to your API
      // await submitDealForm(data)
    },
    
    onDraft: async (data) => {
      console.log('Saving draft:', data)
      
      // Save draft to backend
      // await saveDealDraft(data)
    },
    
    onValidationError: (errors) => {
      console.log('Validation errors:', errors)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Deal Creation Form Example</h1>
        <p className="text-white/70">
          Comprehensive form demonstrating advanced financial field types, validation, and auto-save functionality.
        </p>
      </div>
      
      <FormComposer config={dealFormConfig} />
    </div>
  )
}