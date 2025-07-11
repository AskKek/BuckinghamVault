'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Send, Loader2, CheckCircle, AlertCircle, Crown, Shield } from 'lucide-react'
import { toast } from 'sonner'

// Form validation schema
const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters'),
  
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
  
  privacyConsent: z.boolean()
    .refine(val => val === true, 'Privacy consent is required'),
  
  marketingConsent: z.boolean().optional(),
})

type ContactFormData = z.infer<typeof contactFormSchema>

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      privacyConsent: false,
      marketingConsent: false,
    },
  })

  const watchedValues = watch()

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form')
      }

      setIsSubmitted(true)
      toast.success('Thank you! We will contact you within 24 hours.')
      reset()
      
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to submit form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="glass-morphism rounded-2xl p-8 luxury-border text-center space-y-6">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-white">Thank You!</h3>
          <p className="text-gray-300">
            Your inquiry has been received. One of our senior advisors will contact you within 24 hours.
          </p>
        </div>

        <div className="bg-gold/10 border border-gold/20 rounded-lg p-4">
          <p className="text-gold text-sm">
            <Shield className="w-4 h-4 inline mr-2" />
            Your information is protected under Swiss banking confidentiality standards.
          </p>
        </div>

        <Button
          onClick={() => setIsSubmitted(false)}
          variant="outline"
          className="border-gold/30 text-gold hover:bg-gold/10"
        >
          Submit Another Inquiry
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass-morphism rounded-2xl p-8 luxury-border space-y-6">
      <div className="text-center space-y-2 mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Crown className="w-6 h-6 text-gold" />
          <h2 className="text-2xl font-bold text-white">Private Consultation</h2>
        </div>
        <p className="text-gray-400">All information is kept strictly confidential</p>
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-gold/20 pb-2">
          Personal Information
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">
              Full Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="name"
              {...register('name')}
              className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-gold/50"
              placeholder="Your full name"
            />
            {errors.name && (
              <p className="text-red-400 text-sm flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.name.message}</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email Address <span className="text-red-400">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-gold/50"
              placeholder="your.email@company.com"
            />
            {errors.email && (
              <p className="text-red-400 text-sm flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.email.message}</span>
              </p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company" className="text-gray-300">Company/Organization</Label>
            <Input
              id="company"
              {...register('company')}
              className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-gold/50"
              placeholder="Your company name"
            />
            {errors.company && (
              <p className="text-red-400 text-sm flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.company.message}</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-300">Title/Position</Label>
            <Input
              id="title"
              {...register('title')}
              className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-gold/50"
              placeholder="Your title"
            />
            {errors.title && (
              <p className="text-red-400 text-sm flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.title.message}</span>
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-gold/50"
            placeholder="+1 (555) 123-4567"
          />
          {errors.phone && (
            <p className="text-red-400 text-sm flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.phone.message}</span>
            </p>
          )}
        </div>
      </div>

      {/* Service Requirements */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-gold/20 pb-2">
          Service Requirements
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Investment Range</Label>
            <Select onValueChange={(value) => setValue('investmentRange', value as any)}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent className="bg-navy border-gold/20">
                <SelectItem value="under-1m">Under $1M</SelectItem>
                <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                <SelectItem value="5m-25m">$5M - $25M</SelectItem>
                <SelectItem value="25m-100m">$25M - $100M</SelectItem>
                <SelectItem value="over-100m">Over $100M</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Service Interest</Label>
            <Select onValueChange={(value) => setValue('serviceInterest', value as any)}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent className="bg-navy border-gold/20">
                <SelectItem value="digital-asset-custody">Digital Asset Custody</SelectItem>
                <SelectItem value="portfolio-management">Portfolio Management</SelectItem>
                <SelectItem value="family-office-services">Family Office Services</SelectItem>
                <SelectItem value="institutional-solutions">Institutional Solutions</SelectItem>
                <SelectItem value="other">Other Services</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message" className="text-gray-300">
          Message <span className="text-red-400">*</span>
        </Label>
        <Textarea
          id="message"
          {...register('message')}
          rows={5}
          className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-gold/50 resize-none"
          placeholder="Please describe your specific requirements, investment goals, or any questions you may have..."
        />
        {errors.message && (
          <p className="text-red-400 text-sm flex items-center space-x-1">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.message.message}</span>
          </p>
        )}
        <p className="text-xs text-gray-500">{watchedValues.message?.length || 0}/2000 characters</p>
      </div>

      {/* Preferred Contact Method */}
      <div className="space-y-3">
        <Label className="text-gray-300">Preferred Contact Method</Label>
        <RadioGroup 
          onValueChange={(value) => setValue('preferredContact', value as any)}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="email" id="email-contact" className="border-gold/50 text-gold" />
            <Label htmlFor="email-contact" className="text-gray-300">Email</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="phone" id="phone-contact" className="border-gold/50 text-gold" />
            <Label htmlFor="phone-contact" className="text-gray-300">Phone</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="meeting" id="meeting-contact" className="border-gold/50 text-gold" />
            <Label htmlFor="meeting-contact" className="text-gray-300">In-person meeting</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Consent */}
      <div className="space-y-4 border-t border-white/10 pt-6">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="privacy-consent"
            checked={watchedValues.privacyConsent}
            onCheckedChange={(checked) => setValue('privacyConsent', !!checked)}
            className="border-gold/50 data-[state=checked]:bg-gold data-[state=checked]:border-gold mt-1"
          />
          <div className="space-y-1">
            <Label htmlFor="privacy-consent" className="text-gray-300 text-sm leading-relaxed">
              I agree to the <a href="/privacy" className="text-gold hover:underline">Privacy Policy</a> and 
              consent to the processing of my personal data for the purpose of this inquiry. <span className="text-red-400">*</span>
            </Label>
          </div>
        </div>
        {errors.privacyConsent && (
          <p className="text-red-400 text-sm flex items-center space-x-1">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.privacyConsent.message}</span>
          </p>
        )}

        <div className="flex items-start space-x-3">
          <Checkbox
            id="marketing-consent"
            checked={watchedValues.marketingConsent}
            onCheckedChange={(checked) => setValue('marketingConsent', !!checked)}
            className="border-gold/50 data-[state=checked]:bg-gold data-[state=checked]:border-gold mt-1"
          />
          <Label htmlFor="marketing-consent" className="text-gray-300 text-sm leading-relaxed">
            I would like to receive updates about services and market insights (optional)
          </Label>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-navy font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-gold/25"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Submitting Secure Inquiry...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Submit Confidential Inquiry
          </>
        )}
      </Button>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          <Shield className="w-3 h-3 inline mr-1" />
          All communications are encrypted and protected under Swiss banking confidentiality standards.
        </p>
      </div>
    </form>
  )
}