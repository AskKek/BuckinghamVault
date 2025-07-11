// Comprehensive TypeScript interfaces for Buckingham Vault financial platform

export type UserRole = 'admin' | 'mandate_member' | 'client' | 'viewer' | 'ai_analyst'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  mandateId?: string
  permissions: Permission[]
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Permission {
  id: string
  action: string
  resource: string
  conditions?: Record<string, any>
}

// Deal Tracking System Types
export type DealStatus = 'submitted' | 'under_review' | 'matched' | 'negotiating' | 'due_diligence' | 'completed' | 'cancelled'
export type DealType = 'buy' | 'sell'
export type AssetType = 'BTC' | 'ETH' | 'USDT' | 'USDC' | 'other'
export type GeographicRegion = 'north_america' | 'europe' | 'asia_pacific' | 'middle_east' | 'latin_america' | 'africa'

export interface Deal {
  id: string
  dealNumber: string
  type: DealType
  status: DealStatus
  
  // Asset Details
  assetType: AssetType
  amount: number
  pricePerUnit?: number
  totalValue: number
  currency: string
  
  // Parties
  clientId: string
  clientName: string
  counterpartyId?: string
  counterpartyName?: string
  
  // Deal Specifics
  forensicRating?: ForensicRating
  region: GeographicRegion
  settlementMethod: SettlementMethod
  escrowRequired: boolean
  
  // Mandate & Commission
  mandateId: string
  introducerId?: string
  commissionRate: number
  commissionAmount?: number
  
  // Timeline
  submittedAt: Date
  expectedClosingDate?: Date
  actualClosingDate?: Date
  
  // Documentation
  documents: DealDocument[]
  notes: DealNote[]
  
  // Compliance
  kycStatus: 'pending' | 'approved' | 'rejected'
  amlChecked: boolean
  riskScore: number
  
  // Metadata
  createdBy: string
  updatedBy: string
  createdAt: Date
  updatedAt: Date
}

export interface DealDocument {
  id: string
  dealId: string
  name: string
  type: DocumentType
  url: string
  uploadedBy: string
  uploadedAt: Date
  verified: boolean
}

export type DocumentType = 'contract' | 'kyc' | 'bank_statement' | 'proof_of_funds' | 'compliance_cert' | 'other'

export interface DealNote {
  id: string
  dealId: string
  content: string
  authorId: string
  authorName: string
  isPrivate: boolean
  createdAt: Date
}

export interface DealMatch {
  id: string
  buyDealId: string
  sellDealId: string
  matchScore: number
  matchedAmount: number
  priceSpread: number
  status: 'potential' | 'confirmed' | 'rejected'
  matchedAt: Date
  expiresAt: Date
  matchedBy: string
}

// Forensic Rating System
export type ForensicRating = 'AAA' | 'AA' | 'A' | 'BBB' | 'unrated'

export interface ForensicRatingInfo {
  rating: ForensicRating
  description: string
  premium: number // percentage above base price
  criteria: string[]
  riskLevel: 'very_low' | 'low' | 'medium' | 'high'
}

// Settlement & Payment
export type SettlementMethod = 'binance_vip' | 'bitgo_custody' | 'escrow_to_escrow' | 'wire_transfer' | 'swift'

export interface SettlementDetails {
  method: SettlementMethod
  bankDetails?: BankDetails
  walletAddress?: string
  escrowProvider?: string
  estimatedSettlementTime: number // hours
  fees: SettlementFee[]
}

export interface BankDetails {
  bankName: string
  accountNumber: string
  routingNumber: string
  swiftCode?: string
  iban?: string
  beneficiaryName: string
  address: Address
}

export interface SettlementFee {
  type: 'network' | 'exchange' | 'escrow' | 'bank'
  amount: number
  currency: string
  description: string
}

// Brightpool Exchange Types
export interface TradingBlock {
  id: string
  blockNumber: number
  startTime: Date
  endTime: Date
  status: 'upcoming' | 'active' | 'completed' | 'cancelled'
  totalVolume: number
  averagePrice: number
  tradesExecuted: number
}

export interface OrderBook {
  blockId: string
  forensicRating: ForensicRating
  bids: Order[]
  asks: Order[]
  lastTradePrice?: number
  volume24h: number
  priceChange24h: number
}

export interface Order {
  id: string
  blockId: string
  userId: string
  type: 'buy' | 'sell'
  amount: number
  price: number
  forensicRating: ForensicRating
  status: 'pending' | 'partial' | 'filled' | 'cancelled'
  filledAmount: number
  remainingAmount: number
  submittedAt: Date
  expiresAt: Date
}

export interface Trade {
  id: string
  blockId: string
  buyOrderId: string
  sellOrderId: string
  amount: number
  price: number
  forensicRating: ForensicRating
  buyerFee: number
  sellerFee: number
  executedAt: Date
}

// AI Jeeves Types
export interface DocumentAnalysis {
  id: string
  documentId: string
  status: 'processing' | 'completed' | 'failed'
  confidence: number
  extractedData: ExtractedDealData
  suggestedActions: string[]
  reviewRequired: boolean
  processedAt: Date
  reviewedBy?: string
  reviewedAt?: Date
}

export interface ExtractedDealData {
  dealType?: DealType
  assetType?: AssetType
  amount?: number
  price?: number
  parties?: {
    buyer?: string
    seller?: string
    introducer?: string
  }
  settlementDetails?: Partial<SettlementDetails>
  timeframe?: {
    proposedClosing?: Date
    validUntil?: Date
  }
  additionalTerms?: string[]
}

export interface JeevesChat {
  id: string
  userId: string
  messages: ChatMessage[]
  context?: {
    dealId?: string
    documentId?: string
    topic?: string
  }
  startedAt: Date
  lastMessageAt: Date
}

export interface ChatMessage {
  id: string
  role: 'user' | 'jeeves'
  content: string
  timestamp: Date
  metadata?: {
    confidence?: number
    suggestedActions?: string[]
    relatedDocuments?: string[]
  }
}

// Knowledge Center Types
export interface KnowledgeResource {
  id: string
  title: string
  description: string
  category: ResourceCategory
  subcategory?: string
  type: ResourceType
  content?: string
  fileUrl?: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedReadTime?: number
  authorId: string
  authorName: string
  isPublic: boolean
  downloadCount: number
  rating: number
  reviewCount: number
  createdAt: Date
  updatedAt: Date
}

export type ResourceCategory = 'legal' | 'compliance' | 'technical' | 'market_analysis' | 'training' | 'templates'
export type ResourceType = 'document' | 'video' | 'template' | 'checklist' | 'guide' | 'regulation'

export interface ResourceAccess {
  userId: string
  resourceId: string
  accessedAt: Date
  completed: boolean
  bookmarked: boolean
  progress?: number // percentage for videos/courses
}

export interface Discussion {
  id: string
  title: string
  category: string
  authorId: string
  authorName: string
  content: string
  isPrivate: boolean
  participantIds: string[]
  replies: DiscussionReply[]
  views: number
  createdAt: Date
  updatedAt: Date
}

export interface DiscussionReply {
  id: string
  discussionId: string
  authorId: string
  authorName: string
  content: string
  parentReplyId?: string
  createdAt: Date
  updatedAt: Date
}

// Shared Types
export interface Address {
  street: string
  city: string
  state?: string
  postalCode: string
  country: string
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  createdAt: Date
}

export type NotificationType = 'deal_match' | 'deal_update' | 'document_required' | 'compliance_alert' | 'system' | 'jeeves_insight'

// API Response Types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  errors?: string[]
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Filter and Query Types
export interface DealFilters {
  status?: DealStatus[]
  type?: DealType[]
  assetType?: AssetType[]
  forensicRating?: ForensicRating[]
  region?: GeographicRegion[]
  amountRange?: [number, number]
  dateRange?: [Date, Date]
  mandateId?: string
  search?: string
}

export interface OrderFilters {
  forensicRating?: ForensicRating[]
  type?: ('buy' | 'sell')[]
  priceRange?: [number, number]
  amountRange?: [number, number]
  status?: ('pending' | 'filled' | 'cancelled')[]
}

// Webhook and Real-time Types
export interface WebSocketMessage {
  type: 'deal_update' | 'new_match' | 'order_update' | 'block_update' | 'notification'
  data: any
  timestamp: Date
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down'
  services: {
    database: ServiceStatus
    dealMatching: ServiceStatus
    priceFeeds: ServiceStatus
    aiAnalysis: ServiceStatus
  }
  lastChecked: Date
}

export interface ServiceStatus {
  status: 'up' | 'down'
  responseTime?: number
  lastError?: string
}