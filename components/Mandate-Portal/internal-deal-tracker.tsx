"use client"

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Handshake, 
  TrendingUp, 
  Users, 
  Target, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  ArrowRight,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Globe,
  Calendar,
  FileText,
  Eye,
  Edit,
  Trash2,
  Bell,
  Download,
  BarChart3,
  Zap
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { useSecureAuth } from '@/hooks/use-secure-auth'
import { cn } from '@/lib/utils'

// Enhanced type definitions
type DealStatus = 'submitted' | 'under_review' | 'matched' | 'negotiating' | 'due_diligence' | 'completed' | 'cancelled'
type AssetType = 'BTC' | 'ETH' | 'USDT' | 'USDC' | 'other'
type ForensicRating = 'AAA' | 'AA' | 'A' | 'BBB' | 'unrated'
type GeographicRegion = 'north_america' | 'europe' | 'asia_pacific' | 'middle_east' | 'latin_america' | 'africa'
type DealType = 'buy' | 'sell'

interface Deal {
  id: string
  dealNumber: string
  type: DealType
  status: DealStatus
  assetType: AssetType
  amount: number
  pricePerUnit?: number
  totalValue: number
  currency: string
  clientId: string
  clientName: string
  counterpartyId?: string
  counterpartyName?: string
  forensicRating: ForensicRating
  region: GeographicRegion
  mandateId: string
  introducerId: string
  commissionRate: number
  commissionAmount?: number
  submittedAt: Date
  expectedClosingDate?: Date
  notes: string
  documents: string[]
  priority: 'low' | 'medium' | 'high' | 'critical'
  riskScore: number
  lastActivity: Date
}

interface DealMatch {
  id: string
  buyDealId: string
  sellDealId: string
  matchScore: number
  matchedAmount: number
  priceSpread: number
  status: 'potential' | 'proposed' | 'accepted' | 'rejected'
  matchedAt: Date
  expiresAt: Date
}

// Validation schema for deal creation/editing
const dealSchema = z.object({
  type: z.enum(['buy', 'sell']),
  assetType: z.enum(['BTC', 'ETH', 'USDT', 'USDC', 'other']),
  amount: z.number().min(0.001, 'Amount must be greater than 0'),
  pricePerUnit: z.number().min(0, 'Price must be positive').optional(),
  currency: z.string().min(1, 'Currency is required'),
  clientName: z.string().min(1, 'Client name is required'),
  counterpartyName: z.string().optional(),
  forensicRating: z.enum(['AAA', 'AA', 'A', 'BBB', 'unrated']),
  region: z.enum(['north_america', 'europe', 'asia_pacific', 'middle_east', 'latin_america', 'africa']),
  commissionRate: z.number().min(0).max(10, 'Commission rate cannot exceed 10%'),
  expectedClosingDate: z.date().optional(),
  notes: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical'])
})

type DealFormData = z.infer<typeof dealSchema>

// Mock data for demonstration
const mockDeals: Deal[] = [
  {
    id: 'deal_001',
    dealNumber: 'BV-2025-001',
    type: 'buy',
    status: 'matched',
    assetType: 'BTC',
    amount: 50,
    pricePerUnit: 98500,
    totalValue: 4925000,
    currency: 'USD',
    clientId: 'client_001',
    clientName: 'Pemberton Family Office',
    counterpartyId: 'client_002',
    counterpartyName: 'Sovereign Digital Assets',
    forensicRating: 'AAA',
    region: 'europe',
    mandateId: 'mandate_pemberton',
    introducerId: 'user_001',
    commissionRate: 0.75,
    commissionAmount: 36937.50,
    submittedAt: new Date('2024-12-28T10:00:00Z'),
    expectedClosingDate: new Date('2025-01-10T17:00:00Z'),
    notes: 'Premium AAA rating confirmed - direct from mining pool. Escrow arrangement approved.',
    documents: ['purchase_agreement.pdf', 'proof_of_funds.pdf'],
    priority: 'high',
    riskScore: 2,
    lastActivity: new Date('2025-01-02T14:20:00Z')
  },
  {
    id: 'deal_002',
    dealNumber: 'BV-2025-002', 
    type: 'sell',
    status: 'under_review',
    assetType: 'BTC',
    amount: 25,
    pricePerUnit: 97800,
    totalValue: 2445000,
    currency: 'USD',
    clientId: 'client_003',
    clientName: 'Dynasty Capital Partners',
    forensicRating: 'AA',
    region: 'north_america',
    mandateId: 'mandate_dynasty',
    introducerId: 'user_002',
    commissionRate: 0.5,
    submittedAt: new Date('2025-01-01T16:30:00Z'),
    expectedClosingDate: new Date('2025-01-15T17:00:00Z'),
    notes: 'Client requesting expedited processing. Compliance review in progress.',
    documents: [],
    priority: 'critical',
    riskScore: 5,
    lastActivity: new Date('2025-01-02T09:15:00Z')
  },
  {
    id: 'deal_003',
    dealNumber: 'BV-2025-003',
    type: 'buy',
    status: 'submitted',
    assetType: 'USDT',
    amount: 10000000,
    pricePerUnit: 1.0005,
    totalValue: 10005000,
    currency: 'USD',
    clientId: 'client_004',
    clientName: 'Meridian Sovereign Fund',
    forensicRating: 'A',
    region: 'asia_pacific',
    mandateId: 'mandate_meridian',
    introducerId: 'user_002',
    commissionRate: 0.25,
    commissionAmount: 25012.50,
    submittedAt: new Date('2025-01-02T11:45:00Z'),
    notes: '',
    documents: [],
    priority: 'medium',
    riskScore: 3,
    lastActivity: new Date('2025-01-02T11:45:00Z')
  }
]

const mockMatches: DealMatch[] = [
  {
    id: 'match_001',
    buyDealId: 'deal_001',
    sellDealId: 'deal_002', 
    matchScore: 95,
    matchedAmount: 25,
    priceSpread: 700,
    status: 'potential',
    matchedAt: new Date('2025-01-02T10:30:00Z'),
    expiresAt: new Date('2025-01-04T10:30:00Z')
  }
]

// Utility functions
const getStatusColor = (status: DealStatus) => {
  const colors = {
    submitted: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    under_review: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    matched: 'bg-green-500/20 text-green-300 border-green-500/30',
    negotiating: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    due_diligence: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    completed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    cancelled: 'bg-red-500/20 text-red-300 border-red-500/30'
  }
  return colors[status] || 'bg-white/20 text-white border-white/30'
}

const getForensicRatingColor = (rating: ForensicRating) => {
  const colors = {
    AAA: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    AA: 'bg-green-500/20 text-green-300 border-green-500/30',
    A: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    BBB: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    unrated: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
  }
  return colors[rating] || 'bg-white/20 text-white border-white/30'
}

const getPriorityColor = (priority: Deal['priority']) => {
  const colors = {
    low: 'bg-gray-500/20 text-gray-300',
    medium: 'bg-blue-500/20 text-blue-300',
    high: 'bg-orange-500/20 text-orange-300',
    critical: 'bg-red-500/20 text-red-300'
  }
  return colors[priority] || 'bg-white/20 text-white'
}

const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

// Deal Pipeline Component
function DealPipeline({ deals, onStatusChange }: { 
  deals: Deal[], 
  onStatusChange: (dealId: string, newStatus: DealStatus) => void 
}) {
  const statuses: DealStatus[] = ['submitted', 'under_review', 'matched', 'negotiating', 'due_diligence', 'completed']
  
  const dealsByStatus = useMemo(() => {
    return statuses.reduce((acc, status) => {
      acc[status] = deals.filter(deal => deal.status === status)
      return acc
    }, {} as Record<DealStatus, Deal[]>)
  }, [deals])

  const getStageIcon = (status: DealStatus) => {
    const icons = {
      submitted: FileText,
      under_review: Eye,
      matched: Target,
      negotiating: Handshake,
      due_diligence: Search,
      completed: CheckCircle,
      cancelled: AlertCircle
    }
    return icons[status] || FileText
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-display font-semibold text-white">Deal Pipeline</h3>
        <div className="text-sm text-white/70">
          {deals.length} total deals
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        {statuses.map((status, index) => {
          const StatusIcon = getStageIcon(status)
          const stageDeals = dealsByStatus[status] || []
          
          return (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between p-3 glass-morphism rounded-lg border border-gold/20">
                <div className="flex items-center space-x-2">
                  <StatusIcon className="w-4 h-4 text-gold" />
                  <span className="text-sm font-medium text-white capitalize">
                    {status.replace('_', ' ')}
                  </span>
                </div>
                <Badge className="bg-gold/20 text-gold border-gold/30">
                  {stageDeals.length}
                </Badge>
              </div>
              
              <div className="space-y-2 min-h-[200px]">
                <AnimatePresence>
                  {stageDeals.map((deal) => (
                    <motion.div
                      key={deal.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <div
                        className="p-3 bg-navy/60 border border-white/10 rounded-lg hover:border-gold/30 transition-colors cursor-move"
                        draggable
                        onDragStart={(e: React.DragEvent) => {
                          e.dataTransfer.setData('text/plain', JSON.stringify({ 
                            dealId: deal.id, 
                            currentStatus: status 
                          }))
                        }}
                      >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-white/90">{deal.dealNumber}</span>
                          <Badge className={cn("text-xs", getPriorityColor(deal.priority))}>
                            {deal.priority}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-white font-medium">
                          {deal.clientName}
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-white/70">
                          <span>{deal.assetType} {deal.amount}</span>
                          <span>{formatCurrency(deal.totalValue)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Badge className={cn("text-xs", getForensicRatingColor(deal.forensicRating))}>
                            {deal.forensicRating}
                          </Badge>
                          <Badge className={cn(
                            "text-xs",
                            deal.type === 'buy' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                          )}>
                            {deal.type.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// Deal Form Component
function DealForm({ 
  deal, 
  onSubmit, 
  onCancel 
}: { 
  deal?: Deal, 
  onSubmit: (data: DealFormData) => void, 
  onCancel: () => void 
}) {
  const form = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: deal ? {
      type: deal.type,
      assetType: deal.assetType,
      amount: deal.amount,
      pricePerUnit: deal.pricePerUnit,
      currency: deal.currency,
      clientName: deal.clientName,
      counterpartyName: deal.counterpartyName,
      forensicRating: deal.forensicRating,
      region: deal.region,
      commissionRate: deal.commissionRate,
      expectedClosingDate: deal.expectedClosingDate,
      notes: deal.notes,
      priority: deal.priority
    } : {
      type: 'buy',
      assetType: 'BTC',
      amount: 0,
      currency: 'USD',
      clientName: '',
      forensicRating: 'A',
      region: 'north_america',
      commissionRate: 0.5,
      priority: 'medium'
    }
  })

  const handleSubmit = (data: DealFormData) => {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Deal Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-navy/50 border-gold/20 text-white">
                      <SelectValue placeholder="Select deal type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assetType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Asset Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-navy/50 border-gold/20 text-white">
                      <SelectValue placeholder="Select asset" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                    <SelectItem value="USDT">Tether (USDT)</SelectItem>
                    <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.001"
                    placeholder="0.000"
                    className="bg-navy/50 border-gold/20 text-white"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pricePerUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Price per Unit (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="bg-navy/50 border-gold/20 text-white"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Client Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter client name"
                    className="bg-navy/50 border-gold/20 text-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="counterpartyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Counterparty (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter counterparty name"
                    className="bg-navy/50 border-gold/20 text-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="forensicRating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Forensic Rating</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-navy/50 border-gold/20 text-white">
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="AAA">AAA - Freshly Mined</SelectItem>
                    <SelectItem value="AA">AA - Institutional Grade</SelectItem>
                    <SelectItem value="A">A - Standard Institutional</SelectItem>
                    <SelectItem value="BBB">BBB - Standard Market</SelectItem>
                    <SelectItem value="unrated">Unrated</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Geographic Region</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-navy/50 border-gold/20 text-white">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="north_america">North America</SelectItem>
                    <SelectItem value="europe">Europe</SelectItem>
                    <SelectItem value="asia_pacific">Asia Pacific</SelectItem>
                    <SelectItem value="middle_east">Middle East</SelectItem>
                    <SelectItem value="latin_america">Latin America</SelectItem>
                    <SelectItem value="africa">Africa</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="commissionRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Commission Rate (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    placeholder="0.50"
                    className="bg-navy/50 border-gold/20 text-white"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-navy/50 border-gold/20 text-white">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any relevant notes or special instructions..."
                  className="bg-navy/50 border-gold/20 text-white min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-gold hover:bg-gold-light text-navy">
            {deal ? 'Update Deal' : 'Create Deal'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

// Main Component
export function InternalDealTracker() {
  const { user } = useSecureAuth()
  const [deals, setDeals] = useState<Deal[]>(mockDeals)
  const [matches, setMatches] = useState<DealMatch[]>(mockMatches)
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>(deals)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<DealStatus | 'all'>('all')
  const [assetFilter, setAssetFilter] = useState<AssetType | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<Deal['priority'] | 'all'>('all')
  const [activeTab, setActiveTab] = useState('pipeline')

  // Permission check - only mandate members and admins
  const hasAccess = user?.role === 'mandate_member' || user?.role === 'admin'

  // Filter deals based on search and filters
  useEffect(() => {
    let filtered = deals

    if (searchQuery) {
      filtered = filtered.filter(deal => 
        deal.dealNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (deal.counterpartyName && deal.counterpartyName.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(deal => deal.status === statusFilter)
    }

    if (assetFilter !== 'all') {
      filtered = filtered.filter(deal => deal.assetType === assetFilter)
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(deal => deal.priority === priorityFilter)
    }

    setFilteredDeals(filtered)
  }, [deals, searchQuery, statusFilter, assetFilter, priorityFilter])

  // Handle deal creation
  const handleCreateDeal = useCallback((data: DealFormData) => {
    const newDeal: Deal = {
      id: `deal_${Date.now()}`,
      dealNumber: `BV-2025-${String(deals.length + 1).padStart(3, '0')}`,
      status: 'submitted',
      clientId: `client_${Date.now()}`,
      counterpartyId: data.counterpartyName ? `client_${Date.now()}_cp` : undefined,
      mandateId: user?.mandateId || 'default_mandate',
      introducerId: user?.id || 'unknown',
      totalValue: data.amount * (data.pricePerUnit || 1),
      commissionAmount: data.amount * (data.pricePerUnit || 1) * (data.commissionRate / 100),
      submittedAt: new Date(),
      documents: [],
      riskScore: Math.floor(Math.random() * 10) + 1,
      lastActivity: new Date(),
      ...data,
      counterpartyName: data.counterpartyName || undefined,
      notes: data.notes || ''
    }

    setDeals(prev => [...prev, newDeal])
    setIsCreateDialogOpen(false)
  }, [deals.length, user])

  // Handle deal editing
  const handleEditDeal = useCallback((data: DealFormData) => {
    if (!selectedDeal) return

    const updatedDeal: Deal = {
      ...selectedDeal,
      ...data,
      totalValue: data.amount * (data.pricePerUnit || selectedDeal.pricePerUnit || 1),
      commissionAmount: data.amount * (data.pricePerUnit || selectedDeal.pricePerUnit || 1) * (data.commissionRate / 100),
      lastActivity: new Date(),
      counterpartyName: data.counterpartyName || undefined,
      notes: data.notes || ''
    }

    setDeals(prev => prev.map(deal => deal.id === selectedDeal.id ? updatedDeal : deal))
    setIsEditDialogOpen(false)
    setSelectedDeal(null)
  }, [selectedDeal])

  // Handle status change from pipeline
  const handleStatusChange = useCallback((dealId: string, newStatus: DealStatus) => {
    setDeals(prev => prev.map(deal => 
      deal.id === dealId 
        ? { ...deal, status: newStatus, lastActivity: new Date() }
        : deal
    ))
  }, [])

  // Calculate analytics
  const analytics = useMemo(() => {
    const totalValue = deals.reduce((sum, deal) => sum + deal.totalValue, 0)
    const totalCommission = deals.reduce((sum, deal) => sum + (deal.commissionAmount || 0), 0)
    const completedDeals = deals.filter(deal => deal.status === 'completed')
    const successRate = deals.length > 0 ? (completedDeals.length / deals.length) * 100 : 0
    const avgDealSize = deals.length > 0 ? totalValue / deals.length : 0

    return {
      totalDeals: deals.length,
      totalValue,
      totalCommission,
      successRate,
      avgDealSize,
      completedDeals: completedDeals.length,
      activeDeals: deals.filter(deal => !['completed', 'cancelled'].includes(deal.status)).length
    }
  }, [deals])

  if (!hasAccess) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Access Restricted</h3>
        <p className="text-white/70">
          This feature is only available to approved mandate members and administrators.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Deal Tracker</h1>
          <p className="text-white/70 mt-2">
            Manage and track institutional deals with real-time matching
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            className="border-gold/30 text-gold hover:bg-gold/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gold hover:bg-gold-light text-navy">
                <Plus className="w-4 h-4 mr-2" />
                New Deal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-morphism border-gold/20">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Deal</DialogTitle>
              </DialogHeader>
              <DealForm 
                onSubmit={handleCreateDeal}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Analytics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { 
            label: 'Total Deals', 
            value: analytics.totalDeals, 
            icon: FileText, 
            color: 'text-blue-400',
            suffix: ''
          },
          { 
            label: 'Total Value', 
            value: formatCurrency(analytics.totalValue), 
            icon: DollarSign, 
            color: 'text-green-400',
            suffix: ''
          },
          { 
            label: 'Commission Earned', 
            value: formatCurrency(analytics.totalCommission), 
            icon: TrendingUp, 
            color: 'text-gold',
            suffix: ''
          },
          { 
            label: 'Success Rate', 
            value: analytics.successRate.toFixed(1), 
            icon: Target, 
            color: 'text-emerald-400',
            suffix: '%'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
          >
            <Card className="glass-morphism border-gold/20 hover:border-gold/40 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/70">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">
                      {stat.value}{stat.suffix}
                    </p>
                  </div>
                  <div className="w-12 h-12 glass-morphism rounded-xl flex items-center justify-center">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-navy/60 border border-gold/20">
            <TabsTrigger value="pipeline" className="data-[state=active]:bg-gold data-[state=active]:text-navy">
              Pipeline View
            </TabsTrigger>
            <TabsTrigger value="table" className="data-[state=active]:bg-gold data-[state=active]:text-navy">
              Table View
            </TabsTrigger>
            <TabsTrigger value="matches" className="data-[state=active]:bg-gold data-[state=active]:text-navy">
              Matches
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gold data-[state=active]:text-navy">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <Input
                  placeholder="Search deals by number, client, or counterparty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-navy/50 border-gold/20 text-white"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as DealStatus | 'all')}>
              <SelectTrigger className="w-[180px] bg-navy/50 border-gold/20 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="matched">Matched</SelectItem>
                <SelectItem value="negotiating">Negotiating</SelectItem>
                <SelectItem value="due_diligence">Due Diligence</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={assetFilter} onValueChange={(value) => setAssetFilter(value as AssetType | 'all')}>
              <SelectTrigger className="w-[140px] bg-navy/50 border-gold/20 text-white">
                <SelectValue placeholder="Asset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assets</SelectItem>
                <SelectItem value="BTC">Bitcoin</SelectItem>
                <SelectItem value="ETH">Ethereum</SelectItem>
                <SelectItem value="USDT">Tether</SelectItem>
                <SelectItem value="USDC">USD Coin</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as Deal['priority'] | 'all')}>
              <SelectTrigger className="w-[140px] bg-navy/50 border-gold/20 text-white">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="pipeline" className="space-y-6">
            <DealPipeline deals={filteredDeals} onStatusChange={handleStatusChange} />
          </TabsContent>

          <TabsContent value="table" className="space-y-6">
            <Card className="glass-morphism border-gold/20">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-4 text-white font-medium">Deal</th>
                        <th className="text-left p-4 text-white font-medium">Client</th>
                        <th className="text-left p-4 text-white font-medium">Asset</th>
                        <th className="text-left p-4 text-white font-medium">Value</th>
                        <th className="text-left p-4 text-white font-medium">Status</th>
                        <th className="text-left p-4 text-white font-medium">Rating</th>
                        <th className="text-left p-4 text-white font-medium">Priority</th>
                        <th className="text-left p-4 text-white font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {filteredDeals.map((deal, index) => (
                          <motion.tr
                            key={deal.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                          >
                            <td className="p-4">
                              <div>
                                <div className="font-mono text-white text-sm">{deal.dealNumber}</div>
                                <div className="text-xs text-white/70">{formatDate(deal.submittedAt)}</div>
                              </div>
                            </td>
                            <td className="p-4 text-white">{deal.clientName}</td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <span className="text-white">{deal.assetType}</span>
                                <Badge className={cn(
                                  "text-xs",
                                  deal.type === 'buy' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                                )}>
                                  {deal.type.toUpperCase()}
                                </Badge>
                              </div>
                              <div className="text-xs text-white/70">{deal.amount} units</div>
                            </td>
                            <td className="p-4 text-white font-mono">
                              {formatCurrency(deal.totalValue)}
                            </td>
                            <td className="p-4">
                              <Badge className={cn("text-xs", getStatusColor(deal.status))}>
                                {deal.status.replace('_', ' ')}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Badge className={cn("text-xs", getForensicRatingColor(deal.forensicRating))}>
                                {deal.forensicRating}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Badge className={cn("text-xs", getPriorityColor(deal.priority))}>
                                {deal.priority}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setSelectedDeal(deal)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedDeal(deal)
                                    setIsEditDialogOpen(true)
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matches" className="space-y-6">
            <Card className="glass-morphism border-gold/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-gold" />
                  Real-time Deal Matching
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {matches.length > 0 ? (
                  matches.map((match) => {
                    const buyDeal = deals.find(d => d.id === match.buyDealId)
                    const sellDeal = deals.find(d => d.id === match.sellDealId)
                    
                    return (
                      <motion.div
                        key={match.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 bg-navy/60 border border-green-500/30 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Target className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 font-medium">
                              Match Found ({match.matchScore}% compatibility)
                            </span>
                          </div>
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                            {match.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="text-sm text-white/70">Buyer</div>
                            <div className="text-white font-medium">{buyDeal?.clientName}</div>
                            <div className="text-xs text-white/60">
                              {buyDeal?.dealNumber} • {buyDeal?.assetType} {buyDeal?.amount}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-sm text-white/70">Seller</div>
                            <div className="text-white font-medium">{sellDeal?.clientName}</div>
                            <div className="text-xs text-white/60">
                              {sellDeal?.dealNumber} • {sellDeal?.assetType} {sellDeal?.amount}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                          <div className="text-sm text-white/70">
                            Matched Amount: <span className="text-white">{match.matchedAmount}</span> • 
                            Price Spread: <span className="text-white">${match.priceSpread}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                              Accept Match
                            </Button>
                            <Button size="sm" variant="outline">
                              Negotiate
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No Matches Found</h3>
                    <p className="text-white/70">
                      Our matching engine will automatically find compatible deals as they become available.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-morphism border-gold/20">
                <CardHeader>
                  <CardTitle className="text-white">Deal Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Success Rate</span>
                      <span className="text-green-400">{analytics.successRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={analytics.successRate} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{analytics.completedDeals}</div>
                      <div className="text-xs text-white/70">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{analytics.activeDeals}</div>
                      <div className="text-xs text-white/70">Active</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-gold/20">
                <CardHeader>
                  <CardTitle className="text-white">Financial Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Average Deal Size</span>
                      <span className="text-white font-mono">{formatCurrency(analytics.avgDealSize)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Total Commission</span>
                      <span className="text-gold font-mono">{formatCurrency(analytics.totalCommission)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Commission Rate</span>
                      <span className="text-white">
                        {analytics.totalValue > 0 
                          ? ((analytics.totalCommission / analytics.totalValue) * 100).toFixed(2) 
                          : '0.00'
                        }%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-morphism border-gold/20">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Deal</DialogTitle>
          </DialogHeader>
          {selectedDeal && (
            <DealForm 
              deal={selectedDeal}
              onSubmit={handleEditDeal}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setSelectedDeal(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}