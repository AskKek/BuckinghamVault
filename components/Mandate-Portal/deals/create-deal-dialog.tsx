"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { useSecureAuth } from '@/hooks/use-secure-auth'
import { DealType, AssetType, GeographicRegion, SettlementMethod } from '@/types/financial'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

const createDealSchema = z.object({
  type: z.enum(['buy', 'sell']),
  assetType: z.enum(['BTC', 'ETH', 'USDT', 'USDC', 'other']),
  amount: z.number().positive('Amount must be positive'),
  pricePerUnit: z.number().positive('Price must be positive').optional(),
  clientName: z.string().min(1, 'Client name is required'),
  region: z.enum(['north_america', 'europe', 'asia_pacific', 'middle_east', 'latin_america', 'africa']),
  settlementMethod: z.enum(['binance_vip', 'bitgo_custody', 'escrow_to_escrow', 'wire_transfer', 'swift']),
  escrowRequired: z.boolean(),
  expectedClosingDate: z.string().optional(),
  notes: z.string().optional(),
})

type CreateDealFormValues = z.infer<typeof createDealSchema>

interface CreateDealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateDealDialog({ open, onOpenChange }: CreateDealDialogProps) {
  const { user } = useSecureAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CreateDealFormValues>({
    resolver: zodResolver(createDealSchema),
    defaultValues: {
      type: 'buy',
      assetType: 'BTC',
      escrowRequired: true,
      region: 'north_america',
      settlementMethod: 'escrow_to_escrow',
    }
  })

  const onSubmit = async (values: CreateDealFormValues) => {
    if (!user) return

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Creating deal:', values)
      
      // Close dialog and reset form
      onOpenChange(false)
      form.reset()
      
      // In a real app, you'd refresh the deals list here
      
    } catch (error) {
      console.error('Failed to create deal:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const watchedType = form.watch('type')
  const watchedAssetType = form.watch('assetType')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-navy/95 backdrop-blur-sm border-gold/20 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-white">
            Create New Deal
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Deal Type and Asset */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white/90">Deal Type</Label>
              <Select 
                value={form.getValues('type')} 
                onValueChange={(value: DealType) => form.setValue('type', value)}
              >
                <SelectTrigger className="bg-navy/50 border-gold/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-navy/95 border-gold/20">
                  <SelectItem value="buy" className="text-white hover:bg-white/5">
                    Buy Order
                  </SelectItem>
                  <SelectItem value="sell" className="text-white hover:bg-white/5">
                    Sell Order
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white/90">Asset Type</Label>
              <Select 
                value={form.getValues('assetType')} 
                onValueChange={(value: AssetType) => form.setValue('assetType', value)}
              >
                <SelectTrigger className="bg-navy/50 border-gold/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-navy/95 border-gold/20">
                  <SelectItem value="BTC" className="text-white hover:bg-white/5">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ETH" className="text-white hover:bg-white/5">Ethereum (ETH)</SelectItem>
                  <SelectItem value="USDT" className="text-white hover:bg-white/5">Tether (USDT)</SelectItem>
                  <SelectItem value="USDC" className="text-white hover:bg-white/5">USD Coin (USDC)</SelectItem>
                  <SelectItem value="other" className="text-white hover:bg-white/5">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Amount and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white/90">Amount ({watchedAssetType})</Label>
              <Input
                type="number"
                step="any"
                placeholder="0.00"
                className="bg-navy/50 border-gold/20 text-white placeholder:text-white/50"
                {...form.register('amount', { valueAsNumber: true })}
              />
              {form.formState.errors.amount && (
                <p className="text-red-400 text-sm">{form.formState.errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-white/90">Price per Unit (USD) - Optional</Label>
              <Input
                type="number"
                step="any"
                placeholder="Market price"
                className="bg-navy/50 border-gold/20 text-white placeholder:text-white/50"
                {...form.register('pricePerUnit', { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Client Information */}
          <div className="space-y-2">
            <Label className="text-white/90">Client Name</Label>
            <Input
              placeholder="Enter client or counterparty name"
              className="bg-navy/50 border-gold/20 text-white placeholder:text-white/50"
              {...form.register('clientName')}
            />
            {form.formState.errors.clientName && (
              <p className="text-red-400 text-sm">{form.formState.errors.clientName.message}</p>
            )}
          </div>

          {/* Region and Settlement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white/90">Region</Label>
              <Select 
                value={form.getValues('region')} 
                onValueChange={(value: GeographicRegion) => form.setValue('region', value)}
              >
                <SelectTrigger className="bg-navy/50 border-gold/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-navy/95 border-gold/20">
                  <SelectItem value="north_america" className="text-white hover:bg-white/5">North America</SelectItem>
                  <SelectItem value="europe" className="text-white hover:bg-white/5">Europe</SelectItem>
                  <SelectItem value="asia_pacific" className="text-white hover:bg-white/5">Asia Pacific</SelectItem>
                  <SelectItem value="middle_east" className="text-white hover:bg-white/5">Middle East</SelectItem>
                  <SelectItem value="latin_america" className="text-white hover:bg-white/5">Latin America</SelectItem>
                  <SelectItem value="africa" className="text-white hover:bg-white/5">Africa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white/90">Settlement Method</Label>
              <Select 
                value={form.getValues('settlementMethod')} 
                onValueChange={(value: SettlementMethod) => form.setValue('settlementMethod', value)}
              >
                <SelectTrigger className="bg-navy/50 border-gold/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-navy/95 border-gold/20">
                  <SelectItem value="escrow_to_escrow" className="text-white hover:bg-white/5">Escrow to Escrow</SelectItem>
                  <SelectItem value="binance_vip" className="text-white hover:bg-white/5">Binance VIP</SelectItem>
                  <SelectItem value="bitgo_custody" className="text-white hover:bg-white/5">BitGo Custody</SelectItem>
                  <SelectItem value="wire_transfer" className="text-white hover:bg-white/5">Wire Transfer</SelectItem>
                  <SelectItem value="swift" className="text-white hover:bg-white/5">SWIFT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Escrow Required */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-white/90">Escrow Required</Label>
              <p className="text-sm text-white/70">Use third-party escrow for this transaction</p>
            </div>
            <Switch
              checked={form.getValues('escrowRequired')}
              onCheckedChange={(checked) => form.setValue('escrowRequired', checked)}
            />
          </div>

          {/* Expected Closing Date */}
          <div className="space-y-2">
            <Label className="text-white/90">Expected Closing Date (Optional)</Label>
            <Input
              type="date"
              className="bg-navy/50 border-gold/20 text-white"
              {...form.register('expectedClosingDate')}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-white/90">Notes (Optional)</Label>
            <Textarea
              placeholder="Additional details or special requirements..."
              className="bg-navy/50 border-gold/20 text-white placeholder:text-white/50 min-h-[100px]"
              {...form.register('notes')}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="border-white/20 text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-navy font-semibold"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Creating Deal...
                </div>
              ) : (
                'Create Deal'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}