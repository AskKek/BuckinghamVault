'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Building2, 
  FileText, 
  Shield, 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft,
  Upload,
  AlertCircle,
  Globe,
  Coins,
  TrendingUp,
  Lock,
  Eye,
  EyeOff
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

// Comprehensive KYC Schema
const kycSchema = z.object({
  // Step 1: Personal Information
  personalInfo: z.object({
    entityType: z.enum(['individual', 'corporation', 'trust', 'foundation', 'partnership']),
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    middleName: z.string().optional(),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    nationality: z.string().min(1, 'Nationality is required'),
    countryOfResidence: z.string().min(1, 'Country of residence is required'),
    phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'),
    email: z.string().email('Please enter a valid email address'),
    taxId: z.string().min(1, 'Tax identification number is required'),
    occupation: z.string().min(1, 'Occupation is required'),
    estimatedNetWorth: z.enum(['1m-5m', '5m-25m', '25m-100m', '100m-500m', '500m+']),
    sourceOfWealth: z.array(z.string()).min(1, 'Please select at least one source of wealth'),
  }),

  // Step 2: Corporate Information (conditional)
  corporateInfo: z.object({
    companyName: z.string().optional(),
    registrationNumber: z.string().optional(),
    incorporationCountry: z.string().optional(),
    businessType: z.string().optional(),
    principalBusinessActivity: z.string().optional(),
    annualRevenue: z.string().optional(),
    publiclyTraded: z.boolean().optional(),
    stockExchange: z.string().optional(),
    ultimateBeneficialOwners: z.array(z.object({
      name: z.string(),
      ownershipPercentage: z.number(),
      nationality: z.string(),
    })).optional(),
  }).optional(),

  // Step 3: Financial Information
  financialInfo: z.object({
    primaryBankName: z.string().min(1, 'Primary bank name is required'),
    bankAccountCountry: z.string().min(1, 'Bank account country is required'),
    anticipatedTransactionVolume: z.enum(['1m-10m', '10m-50m', '50m-100m', '100m-500m', '500m+']),
    anticipatedTransactionFrequency: z.enum(['weekly', 'monthly', 'quarterly', 'annually']),
    cryptoExperience: z.enum(['beginner', 'intermediate', 'advanced', 'institutional']),
    currentCryptoHoldings: z.enum(['none', 'small', 'moderate', 'large', 'institutional']),
    investmentObjectives: z.array(z.string()).min(1, 'Please select investment objectives'),
    riskTolerance: z.enum(['conservative', 'moderate', 'aggressive', 'speculative']),
  }),

  // Step 4: Compliance & Regulatory
  complianceInfo: z.object({
    pep: z.boolean(),
    pepDetails: z.string().optional(),
    sanctions: z.boolean(),
    sanctionsDetails: z.string().optional(),
    criminalHistory: z.boolean(),
    criminalDetails: z.string().optional(),
    bankruptcyHistory: z.boolean(),
    bankruptcyDetails: z.string().optional(),
    regulatoryInquiries: z.boolean(),
    regulatoryDetails: z.string().optional(),
    jurisdictionalRestrictions: z.array(z.string()),
    complianceFramework: z.array(z.string()),
  }),

  // Step 5: Exchange Preferences
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

  // Step 6: Documentation
  documentation: z.object({
    identityDocument: z.boolean(),
    addressProof: z.boolean(),
    wealthProof: z.boolean(),
    bankStatement: z.boolean(),
    corporateDocuments: z.boolean().optional(),
    complianceCertifications: z.boolean().optional(),
  }),

  // Step 7: Terms & Agreements
  agreements: z.object({
    termsOfService: z.boolean().refine(val => val === true, 'You must accept the terms of service'),
    privacyPolicy: z.boolean().refine(val => val === true, 'You must accept the privacy policy'),
    kycPolicy: z.boolean().refine(val => val === true, 'You must accept the KYC policy'),
    amlPolicy: z.boolean().refine(val => val === true, 'You must accept the AML policy'),
    riskDisclosure: z.boolean().refine(val => val === true, 'You must acknowledge the risk disclosure'),
    tradingAgreement: z.boolean().refine(val => val === true, 'You must accept the trading agreement'),
  }),
})

type KYCFormData = z.infer<typeof kycSchema>

const steps = [
  { id: 1, title: 'Personal Information', icon: User, description: 'Basic personal details and identification' },
  { id: 2, title: 'Entity Information', icon: Building2, description: 'Corporate or institutional details' },
  { id: 3, title: 'Financial Profile', icon: TrendingUp, description: 'Investment profile and experience' },
  { id: 4, title: 'Compliance Check', icon: Shield, description: 'Regulatory and compliance verification' },
  { id: 5, title: 'Exchange Preferences', icon: Coins, description: 'Trading preferences and requirements' },
  { id: 6, title: 'Documentation', icon: FileText, description: 'Required document upload' },
  { id: 7, title: 'Agreements', icon: CheckCircle, description: 'Terms and legal agreements' },
]

export function ClientOnboardingForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<KYCFormData>({
    resolver: zodResolver(kycSchema),
    mode: 'onBlur',
  })

  const entityType = watch('personalInfo.entityType')
  const progress = (currentStep / steps.length) * 100

  const onSubmit = async (data: KYCFormData) => {
    setIsSubmitting(true)
    try {
      // Submit to API
      const response = await fetch('/api/client-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Submission failed')
      
      // Handle success
      console.log('KYC application submitted successfully')
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
        return <PersonalInformationStep register={register} errors={errors} watch={watch} setValue={setValue} />
      case 2:
        return <EntityInformationStep register={register} errors={errors} watch={watch} setValue={setValue} entityType={entityType} />
      case 3:
        return <FinancialProfileStep register={register} errors={errors} watch={watch} setValue={setValue} />
      case 4:
        return <ComplianceStep register={register} errors={errors} watch={watch} setValue={setValue} />
      case 5:
        return <ExchangePreferencesStep register={register} errors={errors} watch={watch} setValue={setValue} />
      case 6:
        return <DocumentationStep register={register} errors={errors} watch={watch} setValue={setValue} />
      case 7:
        return <AgreementsStep register={register} errors={errors} watch={watch} setValue={setValue} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-dark to-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            Client Onboarding & KYC
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Complete our comprehensive Know Your Customer process to access Buckingham Vault's 
            institutional-grade cryptocurrency exchange services with bright pools and forensic rating system.
          </p>
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
        <div className="grid grid-cols-7 gap-2 mb-8">
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
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
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
function PersonalInformationStep({ register, errors, watch, setValue }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="entityType" className="text-white">Entity Type *</Label>
          <Select onValueChange={(value) => setValue('personalInfo.entityType', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select entity type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="corporation">Corporation</SelectItem>
              <SelectItem value="trust">Trust</SelectItem>
              <SelectItem value="foundation">Foundation</SelectItem>
              <SelectItem value="partnership">Partnership</SelectItem>
            </SelectContent>
          </Select>
          {errors?.personalInfo?.entityType && (
            <p className="text-red-400 text-sm mt-1">{errors.personalInfo.entityType.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="estimatedNetWorth" className="text-white">Estimated Net Worth *</Label>
          <Select onValueChange={(value) => setValue('personalInfo.estimatedNetWorth', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select net worth range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m-5m">$1M - $5M</SelectItem>
              <SelectItem value="5m-25m">$5M - $25M</SelectItem>
              <SelectItem value="25m-100m">$25M - $100M</SelectItem>
              <SelectItem value="100m-500m">$100M - $500M</SelectItem>
              <SelectItem value="500m+">$500M+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="firstName" className="text-white">First Name *</Label>
          <Input
            {...register('personalInfo.firstName')}
            className="mt-2"
            placeholder="Enter first name"
          />
          {errors?.personalInfo?.firstName && (
            <p className="text-red-400 text-sm mt-1">{errors.personalInfo.firstName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="middleName" className="text-white">Middle Name</Label>
          <Input
            {...register('personalInfo.middleName')}
            className="mt-2"
            placeholder="Enter middle name"
          />
        </div>

        <div>
          <Label htmlFor="lastName" className="text-white">Last Name *</Label>
          <Input
            {...register('personalInfo.lastName')}
            className="mt-2"
            placeholder="Enter last name"
          />
          {errors?.personalInfo?.lastName && (
            <p className="text-red-400 text-sm mt-1">{errors.personalInfo.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="dateOfBirth" className="text-white">Date of Birth *</Label>
          <Input
            {...register('personalInfo.dateOfBirth')}
            type="date"
            className="mt-2"
          />
          {errors?.personalInfo?.dateOfBirth && (
            <p className="text-red-400 text-sm mt-1">{errors.personalInfo.dateOfBirth.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="nationality" className="text-white">Nationality *</Label>
          <Input
            {...register('personalInfo.nationality')}
            className="mt-2"
            placeholder="Enter nationality"
          />
          {errors?.personalInfo?.nationality && (
            <p className="text-red-400 text-sm mt-1">{errors.personalInfo.nationality.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="email" className="text-white">Email Address *</Label>
          <Input
            {...register('personalInfo.email')}
            type="email"
            className="mt-2"
            placeholder="Enter email address"
          />
          {errors?.personalInfo?.email && (
            <p className="text-red-400 text-sm mt-1">{errors.personalInfo.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phoneNumber" className="text-white">Phone Number *</Label>
          <Input
            {...register('personalInfo.phoneNumber')}
            className="mt-2"
            placeholder="+1 (555) 123-4567"
          />
          {errors?.personalInfo?.phoneNumber && (
            <p className="text-red-400 text-sm mt-1">{errors.personalInfo.phoneNumber.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="taxId" className="text-white">Tax ID / SSN *</Label>
          <Input
            {...register('personalInfo.taxId')}
            className="mt-2"
            placeholder="Enter tax identification number"
          />
          {errors?.personalInfo?.taxId && (
            <p className="text-red-400 text-sm mt-1">{errors.personalInfo.taxId.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="occupation" className="text-white">Occupation *</Label>
          <Input
            {...register('personalInfo.occupation')}
            className="mt-2"
            placeholder="Enter occupation"
          />
          {errors?.personalInfo?.occupation && (
            <p className="text-red-400 text-sm mt-1">{errors.personalInfo.occupation.message}</p>
          )}
        </div>
      </div>
    </div>
  )
}

// Additional step components would go here...
// For brevity, I'll implement the key ones and indicate where others would go

function ExchangePreferencesStep({ register, errors, watch, setValue }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gold/10 to-amber-500/10 border border-gold/20 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Coins className="w-5 h-5 text-gold" />
          Bitcoin Forensic Rating System
        </h3>
        <p className="text-gray-300 mb-4">
          Our proprietary forensic rating system evaluates Bitcoin based on transaction history, 
          mining source, and compliance with industry standards for digital asset cleanliness.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { rating: 'AAA', desc: 'Freshly mined, zero transaction history', premium: '+15%' },
            { rating: 'AA', desc: 'Single transaction from mining', premium: '+10%' },
            { rating: 'A', desc: 'Clean transaction history', premium: '+5%' },
            { rating: 'BBB', desc: 'Standard compliance grade', premium: '0%' },
          ].map((grade) => (
            <div key={grade.rating} className="bg-black/30 rounded-lg p-3 border border-gray-600">
              <div className="text-gold font-bold text-lg">{grade.rating}</div>
              <div className="text-xs text-gray-400 mb-2">{grade.desc}</div>
              <Badge variant="outline" className="text-xs">{grade.premium}</Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-white">Preferred Bitcoin Rating *</Label>
          <Select onValueChange={(value) => setValue('exchangePreferences.bitcoinRatingPreference', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select minimum rating" />
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

        <div>
          <Label className="text-white">Premium Tolerance *</Label>
          <Select onValueChange={(value) => setValue('exchangePreferences.premiumTolerance', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select premium tolerance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Premium (0%)</SelectItem>
              <SelectItem value="low">Low Premium (up to 5%)</SelectItem>
              <SelectItem value="medium">Medium Premium (up to 10%)</SelectItem>
              <SelectItem value="high">High Premium (up to 20%)</SelectItem>
              <SelectItem value="unlimited">Unlimited Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-white">Minimum Transaction Size</Label>
          <Input
            {...register('exchangePreferences.minimumTransactionSize')}
            className="mt-2"
            placeholder="e.g., 1 BTC"
          />
        </div>

        <div>
          <Label className="text-white">Maximum Transaction Size</Label>
          <Input
            {...register('exchangePreferences.maximumTransactionSize')}
            className="mt-2"
            placeholder="e.g., 100 BTC"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-white">Settlement Timeframe *</Label>
          <Select onValueChange={(value) => setValue('exchangePreferences.preferredSettlementTimeframe', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select settlement timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instant">Instant Settlement</SelectItem>
              <SelectItem value="1-hour">1 Hour Settlement</SelectItem>
              <SelectItem value="4-hours">4 Hours Settlement</SelectItem>
              <SelectItem value="24-hours">24 Hours Settlement</SelectItem>
              <SelectItem value="48-hours">48 Hours Settlement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white">Commission Structure *</Label>
          <Select onValueChange={(value) => setValue('exchangePreferences.commissionStructure', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select commission structure" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed-rate">Fixed Rate (0.25%)</SelectItem>
              <SelectItem value="tiered">Tiered Rates (0.15% - 0.35%)</SelectItem>
              <SelectItem value="volume-based">Volume Based (0.10% - 0.30%)</SelectItem>
              <SelectItem value="custom">Custom Negotiation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

function AgreementsStep({ register, errors, watch, setValue }: any) {
  const agreements = [
    { key: 'termsOfService', title: 'Terms of Service', desc: 'General terms and conditions for using Buckingham Vault services' },
    { key: 'privacyPolicy', title: 'Privacy Policy', desc: 'How we collect, use, and protect your personal information' },
    { key: 'kycPolicy', title: 'KYC Policy', desc: 'Know Your Customer requirements and procedures' },
    { key: 'amlPolicy', title: 'Anti-Money Laundering Policy', desc: 'Compliance with AML regulations and reporting requirements' },
    { key: 'riskDisclosure', title: 'Risk Disclosure', desc: 'Important information about cryptocurrency trading risks' },
    { key: 'tradingAgreement', title: 'Trading Agreement', desc: 'Specific terms for bright pool trading and settlement' },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-400" />
          <h3 className="text-xl font-semibold text-white">Important Legal Agreements</h3>
        </div>
        <p className="text-gray-300">
          Please carefully review and accept all required agreements to complete your onboarding. 
          These documents govern your relationship with Buckingham Vault and outline important 
          terms, risks, and compliance requirements.
        </p>
      </div>

      <div className="space-y-4">
        {agreements.map((agreement) => (
          <div key={agreement.key} className="border border-gray-600 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id={agreement.key}
                onCheckedChange={(checked) => setValue(`agreements.${agreement.key}`, checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <Label htmlFor={agreement.key} className="text-white font-medium cursor-pointer">
                  {agreement.title} *
                </Label>
                <p className="text-gray-400 text-sm mt-1">{agreement.desc}</p>
                <Button variant="link" className="text-gold p-0 h-auto mt-2">
                  View Document <Eye className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
            {errors?.agreements?.[agreement.key] && (
              <p className="text-red-400 text-sm mt-2">{errors.agreements[agreement.key].message}</p>
            )}
          </div>
        ))}
      </div>

      <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-6 h-6 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Application Complete</h3>
        </div>
        <p className="text-gray-300">
          Once you submit this application, our compliance team will review your information 
          within 48-72 hours. You will receive an email confirmation and status updates 
          throughout the review process.
        </p>
      </div>
    </div>
  )
}

// Placeholder components for other steps
function EntityInformationStep({ register, errors, watch, setValue, entityType }: any) {
  if (entityType === 'individual') {
    return (
      <div className="text-center py-8">
        <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl text-white mb-2">Individual Entity</h3>
        <p className="text-gray-400">No additional entity information required for individual accounts.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-400">Corporate entity information would be collected here...</p>
      {/* Corporate entity fields would go here */}
    </div>
  )
}

function FinancialProfileStep({ register, errors, watch, setValue }: any) {
  return (
    <div className="space-y-6">
      <p className="text-gray-400">Financial profile and investment details would be collected here...</p>
      {/* Financial profile fields would go here */}
    </div>
  )
}

function ComplianceStep({ register, errors, watch, setValue }: any) {
  return (
    <div className="space-y-6">
      <p className="text-gray-400">Compliance and regulatory information would be collected here...</p>
      {/* Compliance fields would go here */}
    </div>
  )
}

function DocumentationStep({ register, errors, watch, setValue }: any) {
  return (
    <div className="space-y-6">
      <p className="text-gray-400">Document upload interface would be implemented here...</p>
      {/* Document upload fields would go here */}
    </div>
  )
}