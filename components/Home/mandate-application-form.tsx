'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Handshake, 
  DollarSign, 
  Clock, 
  Shield, 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft,
  TrendingUp,
  Building2,
  Users,
  FileSignature,
  Calendar,
  Target,
  AlertTriangle,
  Star,
  Coins,
  Network
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Mandate Application Schema
const mandateSchema = z.object({
  // Step 1: Mandate Details
  mandateDetails: z.object({
    mandateType: z.enum(['buy', 'sell', 'swap', 'arbitrage', 'portfolio-rebalancing']),
    transactionValue: z.string().min(1, 'Transaction value is required'),
    cryptocurrency: z.string().min(1, 'Cryptocurrency is required'),
    quantity: z.string().min(1, 'Quantity is required'),
    urgency: z.enum(['immediate', '24-hours', '1-week', '1-month', 'flexible']),
    executionStrategy: z.enum(['market', 'limit', 'twap', 'vwap', 'iceberg', 'custom']),
    targetPrice: z.string().optional(),
    priceRange: z.object({
      minimum: z.string().optional(),
      maximum: z.string().optional(),
    }).optional(),
  }),

  // Step 2: Counterparty Preferences
  counterpartyPreferences: z.object({
    preferredCounterparties: z.array(z.string()),
    excludedCounterparties: z.array(z.string()),
    geographicRestrictions: z.array(z.string()),
    regulatoryRequirements: z.array(z.string()),
    minimumCounterpartyRating: z.enum(['AAA', 'AA', 'A', 'BBB', 'BB', 'any']),
    bitcoinRatingRequirement: z.enum(['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'C', 'any']),
    complianceFramework: z.array(z.string()),
  }),

  // Step 3: Commission & Settlement
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

  // Step 4: Risk Management
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

  // Step 5: Authorization & Execution
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

type MandateFormData = z.infer<typeof mandateSchema>

const steps = [
  { id: 1, title: 'Mandate Details', icon: FileSignature, description: 'Transaction specifications and requirements' },
  { id: 2, title: 'Counterparty Prefs', icon: Network, description: 'Counterparty selection and restrictions' },
  { id: 3, title: 'Commission Setup', icon: DollarSign, description: 'Commission structure and settlement' },
  { id: 4, title: 'Risk Management', icon: Shield, description: 'Risk parameters and hedging' },
  { id: 5, title: 'Authorization', icon: Handshake, description: 'Execution authority and reporting' },
]

export function MandateApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MandateFormData>({
    resolver: zodResolver(mandateSchema),
    mode: 'onBlur',
  })

  const progress = (currentStep / steps.length) * 100

  const onSubmit = async (data: MandateFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/mandate-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Submission failed')
      
      console.log('Mandate application submitted successfully')
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <MandateDetailsStep register={register} errors={errors} watch={watch} setValue={setValue} />
      case 2:
        return <CounterpartyPreferencesStep register={register} errors={errors} watch={watch} setValue={setValue} />
      case 3:
        return <CommissionSettlementStep register={register} errors={errors} watch={watch} setValue={setValue} />
      case 4:
        return <RiskManagementStep register={register} errors={errors} watch={watch} setValue={setValue} />
      case 5:
        return <AuthorizationStep register={register} errors={errors} watch={watch} setValue={setValue} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-dark to-black py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Handshake className="w-12 h-12 text-gold" />
            <h1 className="text-4xl font-display font-bold text-white">
              Mandate Application
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Submit a mandate for large over-the-counter cryptocurrency transactions. Our matching engine 
            will identify suitable counterparties and facilitate execution with zero slippage through 
            our bright pool infrastructure.
          </p>
        </div>

        {/* Key Features Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-gold/10 to-amber-500/10 border border-gold/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Coins className="w-6 h-6 text-gold" />
              <h3 className="text-white font-semibold">Zero Slippage</h3>
            </div>
            <p className="text-gray-300 text-sm">Large block transactions with guaranteed execution at agreed prices</p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Network className="w-6 h-6 text-blue-400" />
              <h3 className="text-white font-semibold">Bright Pools</h3>
            </div>
            <p className="text-gray-300 text-sm">Hourly indexed pricing with institutional counterparty matching</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-6 h-6 text-green-400" />
              <h3 className="text-white font-semibold">Forensic Rating</h3>
            </div>
            <p className="text-gray-300 text-sm">AAA to C rated Bitcoin based on transaction history and compliance</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-400">Step {currentStep} of {steps.length}</span>
            <span className="text-sm text-gray-400">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="grid grid-cols-5 gap-2 mb-8">
          {steps.map((step) => {
            const Icon = step.icon
            const isCompleted = currentStep > step.id
            const isCurrent = currentStep === step.id
            
            return (
              <motion.div
                key={step.id}
                className={cn(
                  "flex flex-col items-center p-3 rounded-lg border transition-all",
                  isCompleted && "border-gold bg-gold/10 text-gold",
                  isCurrent && "border-blue-500 bg-blue-500/10 text-blue-400",
                  !isCompleted && !isCurrent && "border-gray-600 text-gray-400"
                )}
                whileHover={{ scale: 1.02 }}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium text-center">{step.title}</span>
              </motion.div>
            )
          })}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="glass-morphism border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                {React.createElement(steps[currentStep - 1].icon, { className: "w-6 h-6 text-gold" })}
                {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {steps[currentStep - 1].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep === steps.length ? (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gold hover:bg-gold/90 text-black font-medium flex items-center gap-2"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Mandate'}
                <CheckCircle className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={nextStep}
                className="bg-gold hover:bg-gold/90 text-black font-medium flex items-center gap-2"
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

// Step Components
function MandateDetailsStep({ register, errors, watch, setValue }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-white">Mandate Type *</Label>
          <Select onValueChange={(value) => setValue('mandateDetails.mandateType', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select mandate type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buy">Buy Order</SelectItem>
              <SelectItem value="sell">Sell Order</SelectItem>
              <SelectItem value="swap">Cross-Currency Swap</SelectItem>
              <SelectItem value="arbitrage">Arbitrage Opportunity</SelectItem>
              <SelectItem value="portfolio-rebalancing">Portfolio Rebalancing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white">Urgency Level *</Label>
          <Select onValueChange={(value) => setValue('mandateDetails.urgency', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediate (within 1 hour)</SelectItem>
              <SelectItem value="24-hours">Within 24 hours</SelectItem>
              <SelectItem value="1-week">Within 1 week</SelectItem>
              <SelectItem value="1-month">Within 1 month</SelectItem>
              <SelectItem value="flexible">Flexible timing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label className="text-white">Cryptocurrency *</Label>
          <Select onValueChange={(value) => setValue('mandateDetails.cryptocurrency', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select cryptocurrency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
              <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
              <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
              <SelectItem value="USDT">Tether (USDT)</SelectItem>
              <SelectItem value="other">Other (specify in notes)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white">Quantity *</Label>
          <Input
            {...register('mandateDetails.quantity')}
            className="mt-2"
            placeholder="e.g., 100 BTC"
          />
        </div>

        <div>
          <Label className="text-white">Transaction Value (USD) *</Label>
          <Input
            {...register('mandateDetails.transactionValue')}
            className="mt-2"
            placeholder="e.g., $5,000,000"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-white">Execution Strategy *</Label>
          <Select onValueChange={(value) => setValue('mandateDetails.executionStrategy', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select execution strategy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="market">Market Order</SelectItem>
              <SelectItem value="limit">Limit Order</SelectItem>
              <SelectItem value="twap">Time-Weighted Average Price (TWAP)</SelectItem>
              <SelectItem value="vwap">Volume-Weighted Average Price (VWAP)</SelectItem>
              <SelectItem value="iceberg">Iceberg Order</SelectItem>
              <SelectItem value="custom">Custom Strategy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white">Target Price (Optional)</Label>
          <Input
            {...register('mandateDetails.targetPrice')}
            className="mt-2"
            placeholder="e.g., $50,000 per BTC"
          />
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Bright Pool Execution
        </h3>
        <p className="text-gray-300 mb-4">
          Your mandate will be matched against institutional counterparties in our bright pools. 
          Execution occurs at hourly indexed prices with zero slippage for large block transactions.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/30 rounded-lg p-3">
            <div className="text-blue-400 font-semibold">Next Index Window</div>
            <div className="text-white text-lg">14:00 UTC</div>
            <div className="text-gray-400 text-sm">in 23 minutes</div>
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <div className="text-blue-400 font-semibold">Current BTC Index</div>
            <div className="text-white text-lg">$49,850.25</div>
            <div className="text-green-400 text-sm">+2.3% (24h)</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CounterpartyPreferencesStep({ register, errors, watch, setValue }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/30 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Network className="w-5 h-5 text-purple-400" />
          Counterparty Matching & Bitcoin Forensic Rating
        </h3>
        <p className="text-gray-300 mb-4">
          Specify your counterparty preferences and Bitcoin quality requirements. Our forensic 
          rating system ensures compliance with your regulatory and risk management standards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-white">Minimum Counterparty Rating *</Label>
          <Select onValueChange={(value) => setValue('counterpartyPreferences.minimumCounterpartyRating', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select minimum rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AAA">AAA - Tier 1 Institutions</SelectItem>
              <SelectItem value="AA">AA - Major Financial Entities</SelectItem>
              <SelectItem value="A">A - Established Firms</SelectItem>
              <SelectItem value="BBB">BBB - Qualified Entities</SelectItem>
              <SelectItem value="BB">BB - Approved Counterparties</SelectItem>
              <SelectItem value="any">Any Approved Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white">Bitcoin Rating Requirement *</Label>
          <Select onValueChange={(value) => setValue('counterpartyPreferences.bitcoinRatingRequirement', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select Bitcoin rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AAA">AAA - Freshly Mined (Premium +15%)</SelectItem>
              <SelectItem value="AA">AA - Single Transaction (Premium +10%)</SelectItem>
              <SelectItem value="A">A - Clean History (Premium +5%)</SelectItem>
              <SelectItem value="BBB">BBB - Standard Grade (No Premium)</SelectItem>
              <SelectItem value="BB">BB - Minor Flags (Discount -5%)</SelectItem>
              <SelectItem value="B">B - Multiple Flags (Discount -10%)</SelectItem>
              <SelectItem value="C">C - High Risk (Discount -15%)</SelectItem>
              <SelectItem value="any">Any Rating (Best Price)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-white">Geographic Restrictions</Label>
        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-3">
          {['US', 'EU', 'UK', 'Canada', 'Australia', 'Japan', 'Singapore', 'Switzerland'].map((country) => (
            <label key={country} className="flex items-center space-x-2 text-white">
              <Checkbox 
                id={country}
                onCheckedChange={(checked) => {
                  const current = watch('counterpartyPreferences.geographicRestrictions') || []
                  if (checked) {
                    setValue('counterpartyPreferences.geographicRestrictions', [...current, country])
                  } else {
                    setValue('counterpartyPreferences.geographicRestrictions', current.filter((c: string) => c !== country))
                  }
                }}
              />
              <span className="text-sm">{country}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-white">Compliance Framework Requirements</Label>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'SOX Compliance',
            'GDPR Compliant',
            'ISO 27001 Certified',
            'SOC 2 Type II',
            'FINTRAC Registered',
            'MiCA Compliant',
            'CFTC Registered',
            'SEC Registered'
          ].map((framework) => (
            <label key={framework} className="flex items-center space-x-2 text-white">
              <Checkbox 
                id={framework}
                onCheckedChange={(checked) => {
                  const current = watch('counterpartyPreferences.complianceFramework') || []
                  if (checked) {
                    setValue('counterpartyPreferences.complianceFramework', [...current, framework])
                  } else {
                    setValue('counterpartyPreferences.complianceFramework', current.filter((f: string) => f !== framework))
                  }
                }}
              />
              <span className="text-sm">{framework}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

function CommissionSettlementStep({ register, errors, watch, setValue }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-400" />
          Automated Commission Distribution
        </h3>
        <p className="text-gray-300">
          Configure automatic commission distribution to multiple wallet addresses. 
          Commissions are calculated and distributed immediately upon trade execution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-white">Commission Structure *</Label>
          <Select onValueChange={(value) => setValue('commissionSettlement.commissionStructure', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select commission structure" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed-fee">Fixed Fee</SelectItem>
              <SelectItem value="percentage">Percentage of Transaction</SelectItem>
              <SelectItem value="tiered">Tiered Based on Volume</SelectItem>
              <SelectItem value="success-fee">Success Fee Only</SelectItem>
              <SelectItem value="custom">Custom Arrangement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white">Commission Rate</Label>
          <Input
            {...register('commissionSettlement.commissionRate')}
            className="mt-2"
            placeholder="e.g., 0.25% or $50,000"
          />
        </div>
      </div>

      <div>
        <Label className="text-white">Commission Recipients</Label>
        <div className="mt-2 space-y-4">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-gray-300 text-sm">Wallet Address</Label>
                <Input 
                  placeholder="bc1q..." 
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-300 text-sm">Percentage</Label>
                <Input 
                  placeholder="50%" 
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-300 text-sm">Description</Label>
                <Input 
                  placeholder="Primary recipient" 
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          <Button type="button" variant="outline" className="w-full">
            Add Another Recipient
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label className="text-white">Settlement Currency *</Label>
          <Select onValueChange={(value) => setValue('commissionSettlement.settlementCurrency', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
              <SelectItem value="BTC">BTC</SelectItem>
              <SelectItem value="ETH">ETH</SelectItem>
              <SelectItem value="USDC">USDC</SelectItem>
              <SelectItem value="USDT">USDT</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white">Settlement Method *</Label>
          <Select onValueChange={(value) => setValue('commissionSettlement.settlementMethod', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wire">Wire Transfer</SelectItem>
              <SelectItem value="crypto">Cryptocurrency</SelectItem>
              <SelectItem value="escrow">Escrow Service</SelectItem>
              <SelectItem value="dvp">Delivery vs Payment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white">Settlement Timeframe *</Label>
          <Select onValueChange={(value) => setValue('commissionSettlement.settlementTimeframe', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instant">Instant</SelectItem>
              <SelectItem value="1-hour">1 Hour</SelectItem>
              <SelectItem value="4-hours">4 Hours</SelectItem>
              <SelectItem value="24-hours">24 Hours</SelectItem>
              <SelectItem value="48-hours">48 Hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

function RiskManagementStep({ register, errors, watch, setValue }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-400" />
          Risk Management Parameters
        </h3>
        <p className="text-gray-300">
          Define risk limits and hedging requirements to protect your mandate execution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-white">Maximum Slippage *</Label>
          <Input
            {...register('riskManagement.maximumSlippage')}
            className="mt-2"
            placeholder="e.g., 0.5%"
          />
        </div>

        <div>
          <Label className="text-white">Position Sizing Strategy *</Label>
          <Select onValueChange={(value) => setValue('riskManagement.positionSizing', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select strategy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">Fixed Size</SelectItem>
              <SelectItem value="percentage">Percentage of Portfolio</SelectItem>
              <SelectItem value="risk-based">Risk-Based Sizing</SelectItem>
              <SelectItem value="kelly">Kelly Criterion</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-white">Stop Loss Level</Label>
          <Input
            {...register('riskManagement.stopLossLevel')}
            className="mt-2"
            placeholder="e.g., -5%"
          />
        </div>

        <div>
          <Label className="text-white">Take Profit Level</Label>
          <Input
            {...register('riskManagement.takeProfitLevel')}
            className="mt-2"
            placeholder="e.g., +10%"
          />
        </div>
      </div>

      <div>
        <Label className="text-white mb-3 block">Hedging Requirements</Label>
        <div className="space-y-3">
          <label className="flex items-center space-x-2 text-white">
            <Checkbox 
              onCheckedChange={(checked) => setValue('riskManagement.hedgingRequired', checked)}
            />
            <span>Require hedging for this mandate</span>
          </label>
        </div>
      </div>

      <div>
        <Label className="text-white">Risk Limits</Label>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-gray-300 text-sm">Daily Limit</Label>
            <Input 
              {...register('riskManagement.riskLimits.daily')}
              placeholder="e.g., $1M" 
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-gray-300 text-sm">Weekly Limit</Label>
            <Input 
              {...register('riskManagement.riskLimits.weekly')}
              placeholder="e.g., $5M" 
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-gray-300 text-sm">Monthly Limit</Label>
            <Input 
              {...register('riskManagement.riskLimits.monthly')}
              placeholder="e.g., $20M" 
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function AuthorizationStep({ register, errors, watch, setValue }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gold/10 to-amber-500/10 border border-gold/20 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Handshake className="w-5 h-5 text-gold" />
          Execution Authorization & Reporting
        </h3>
        <p className="text-gray-300">
          Define execution authority, authorized persons, and reporting requirements for your mandate.
        </p>
      </div>

      <div>
        <Label className="text-white">Trading Authority *</Label>
        <Select onValueChange={(value) => setValue('authorization.tradingAuthority', value)}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select trading authority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full-discretion">Full Discretion</SelectItem>
            <SelectItem value="limited-discretion">Limited Discretion</SelectItem>
            <SelectItem value="approval-required">Approval Required</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-white">Authorized Persons</Label>
        <div className="mt-2 space-y-4">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-gray-300 text-sm">Name</Label>
                <Input placeholder="John Doe" className="mt-1" />
              </div>
              <div>
                <Label className="text-gray-300 text-sm">Title</Label>
                <Input placeholder="Chief Investment Officer" className="mt-1" />
              </div>
              <div>
                <Label className="text-gray-300 text-sm">Email</Label>
                <Input placeholder="john.doe@example.com" className="mt-1" />
              </div>
              <div className="flex items-end">
                <label className="flex items-center space-x-2 text-white">
                  <Checkbox />
                  <span className="text-sm">Signature Required</span>
                </label>
              </div>
            </div>
          </div>
          <Button type="button" variant="outline" className="w-full">
            Add Another Person
          </Button>
        </div>
      </div>

      <div>
        <Label className="text-white">Execution Window</Label>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-gray-300 text-sm">Start Date</Label>
            <Input 
              type="date" 
              className="mt-1"
              {...register('authorization.executionWindow.startDate')}
            />
          </div>
          <div>
            <Label className="text-gray-300 text-sm">End Date</Label>
            <Input 
              type="date" 
              className="mt-1"
              {...register('authorization.executionWindow.endDate')}
            />
          </div>
          <div>
            <Label className="text-gray-300 text-sm">Trading Hours</Label>
            <Select onValueChange={(value) => setValue('authorization.executionWindow.tradingHours', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select hours" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24-7">24/7</SelectItem>
                <SelectItem value="business-hours">Business Hours Only</SelectItem>
                <SelectItem value="custom">Custom Hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-white">Confidentiality Level *</Label>
        <Select onValueChange={(value) => setValue('authorization.confidentialityLevel', value)}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select confidentiality level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="enhanced">Enhanced</SelectItem>
            <SelectItem value="maximum">Maximum</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-6 h-6 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Mandate Ready for Submission</h3>
        </div>
        <p className="text-gray-300">
          Your mandate will be submitted to our matching engine and reviewed by our trading desk. 
          You will receive real-time updates on counterparty matches and execution status.
        </p>
      </div>
    </div>
  )
}