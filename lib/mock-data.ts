// Mock data for Buckingham Vault financial platform
import { 
  User, Deal, DealMatch, ForensicRatingInfo, TradingBlock, OrderBook, Order, 
  KnowledgeResource, JeevesChat, DocumentAnalysis, Notification 
} from '@/types/financial'

// Forensic Rating Definitions
export const forensicRatings: Record<string, ForensicRatingInfo> = {
  AAA: {
    rating: 'AAA',
    description: 'Freshly mined Bitcoin with complete transaction history transparency',
    premium: 5.0,
    criteria: [
      'Directly from mining operations',
      'Zero previous transactions',
      'Verified mining pool source',
      'Complete chain of custody documentation'
    ],
    riskLevel: 'very_low'
  },
  AA: {
    rating: 'AA',
    description: 'Institutional-grade Bitcoin with verified clean history',
    premium: 3.0,
    criteria: [
      'Maximum 2 previous transactions',
      'KYC-verified transaction history',
      'Institutional counterparties only',
      'Compliance-verified transfers'
    ],
    riskLevel: 'low'
  },
  A: {
    rating: 'A',
    description: 'Standard institutional Bitcoin with documented provenance',
    premium: 1.5,
    criteria: [
      'Up to 5 previous transactions',
      'Documented transaction history',
      'AML-compliant transfers',
      'No high-risk jurisdictions'
    ],
    riskLevel: 'low'
  },
  BBB: {
    rating: 'BBB',
    description: 'Standard market Bitcoin with basic compliance verification',
    premium: 0.0,
    criteria: [
      'Standard market transactions',
      'Basic AML screening passed',
      'No sanctions list matches',
      'Market rate pricing'
    ],
    riskLevel: 'medium'
  }
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user_001',
    email: 'charles.pemberton@pembertonfamily.office',
    name: 'Charles Pemberton III',
    role: 'mandate_member',
    mandateId: 'mandate_pemberton',
    permissions: [
      { id: 'perm_001', action: 'create', resource: 'deals' },
      { id: 'perm_002', action: 'read', resource: 'all_deals' },
      { id: 'perm_003', action: 'update', resource: 'own_deals' }
    ],
    isActive: true,
    lastLogin: new Date('2025-01-01T14:30:00Z'),
    createdAt: new Date('2024-06-15T10:00:00Z'),
    updatedAt: new Date('2025-01-01T14:30:00Z')
  },
  {
    id: 'user_002',
    email: 'alexandra.rothschild@sovereign.wealth',
    name: 'Alexandra Rothschild',
    role: 'mandate_member',
    mandateId: 'mandate_sovereign',
    permissions: [
      { id: 'perm_004', action: 'create', resource: 'deals' },
      { id: 'perm_005', action: 'read', resource: 'all_deals' },
      { id: 'perm_006', action: 'approve', resource: 'large_deals' }
    ],
    isActive: true,
    lastLogin: new Date('2025-01-01T09:15:00Z'),
    createdAt: new Date('2024-08-22T11:00:00Z'),
    updatedAt: new Date('2025-01-01T09:15:00Z')
  },
  {
    id: 'user_003',
    email: 'admin@bv.com',
    name: 'Victoria Sterling',
    role: 'admin',
    permissions: [
      { id: 'perm_007', action: '*', resource: '*' }
    ],
    isActive: true,
    lastLogin: new Date('2025-01-02T08:00:00Z'),
    createdAt: new Date('2024-01-15T12:00:00Z'),
    updatedAt: new Date('2025-01-02T08:00:00Z')
  },
  {
    id: 'client_admin',
    email: 'admin@bv.com',
    name: 'Admin Client',
    role: 'client',
    permissions: [
      { id: 'perm_008', action: 'create', resource: 'deals' },
      { id: 'perm_009', action: 'read', resource: 'own_deals' },
      { id: 'perm_010', action: 'update', resource: 'own_deals' }
    ],
    isActive: true,
    lastLogin: new Date('2025-01-02T08:00:00Z'),
    createdAt: new Date('2024-01-15T12:00:00Z'),
    updatedAt: new Date('2025-01-02T08:00:00Z')
  }
]

// Mock Deals
export const mockDeals: Deal[] = [
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
    settlementMethod: 'escrow_to_escrow',
    escrowRequired: true,
    mandateId: 'mandate_pemberton',
    introducerId: 'user_001',
    commissionRate: 0.75,
    commissionAmount: 36937.50,
    submittedAt: new Date('2024-12-28T10:00:00Z'),
    expectedClosingDate: new Date('2025-01-10T17:00:00Z'),
    documents: [
      {
        id: 'doc_001',
        dealId: 'deal_001',
        name: 'Purchase Agreement - BTC 50 Units',
        type: 'contract',
        url: '/documents/deal_001_purchase_agreement.pdf',
        uploadedBy: 'user_001',
        uploadedAt: new Date('2024-12-28T11:30:00Z'),
        verified: true
      },
      {
        id: 'doc_002',
        dealId: 'deal_001',
        name: 'Proof of Funds - Pemberton Family Office',
        type: 'proof_of_funds',
        url: '/documents/deal_001_proof_of_funds.pdf',
        uploadedBy: 'user_001',
        uploadedAt: new Date('2024-12-28T12:00:00Z'),
        verified: true
      }
    ],
    notes: [
      {
        id: 'note_001',
        dealId: 'deal_001',
        content: 'Premium AAA rating confirmed - direct from mining pool. Escrow arrangement with BitGo approved.',
        authorId: 'user_003',
        authorName: 'Victoria Sterling',
        isPrivate: false,
        createdAt: new Date('2024-12-29T14:20:00Z')
      }
    ],
    kycStatus: 'approved',
    amlChecked: true,
    riskScore: 2,
    createdBy: 'user_001',
    updatedBy: 'user_003',
    createdAt: new Date('2024-12-28T10:00:00Z'),
    updatedAt: new Date('2024-12-29T14:20:00Z')
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
    settlementMethod: 'binance_vip',
    escrowRequired: false,
    mandateId: 'mandate_dynasty',
    commissionRate: 0.5,
    submittedAt: new Date('2025-01-01T16:30:00Z'),
    expectedClosingDate: new Date('2025-01-15T17:00:00Z'),
    documents: [],
    notes: [
      {
        id: 'note_002',
        dealId: 'deal_002',
        content: 'Client requesting expedited processing. Compliance review in progress.',
        authorId: 'user_003',
        authorName: 'Victoria Sterling',
        isPrivate: true,
        createdAt: new Date('2025-01-02T09:15:00Z')
      }
    ],
    kycStatus: 'pending',
    amlChecked: false,
    riskScore: 5,
    createdBy: 'user_002',
    updatedBy: 'user_003',
    createdAt: new Date('2025-01-01T16:30:00Z'),
    updatedAt: new Date('2025-01-02T09:15:00Z')
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
    settlementMethod: 'swift',
    escrowRequired: true,
    mandateId: 'mandate_meridian',
    commissionRate: 0.25,
    commissionAmount: 25012.50,
    submittedAt: new Date('2025-01-02T11:45:00Z'),
    documents: [],
    notes: [],
    kycStatus: 'pending',
    amlChecked: false,
    riskScore: 3,
    createdBy: 'user_002',
    updatedBy: 'user_002',
    createdAt: new Date('2025-01-02T11:45:00Z'),
    updatedAt: new Date('2025-01-02T11:45:00Z')
  }
]

// Mock Deal Matches
export const mockDealMatches: DealMatch[] = [
  {
    id: 'match_001',
    buyDealId: 'deal_001',
    sellDealId: 'deal_002',
    matchScore: 95,
    matchedAmount: 25,
    priceSpread: 700,
    status: 'potential',
    matchedAt: new Date('2025-01-02T10:30:00Z'),
    expiresAt: new Date('2025-01-04T10:30:00Z'),
    matchedBy: 'system_ai'
  }
]

// Mock Trading Blocks
export const mockTradingBlocks: TradingBlock[] = [
  {
    id: 'block_001',
    blockNumber: 2025001,
    startTime: new Date('2025-01-02T15:00:00Z'),
    endTime: new Date('2025-01-02T16:00:00Z'),
    status: 'completed',
    totalVolume: 125.5,
    averagePrice: 98750,
    tradesExecuted: 23
  },
  {
    id: 'block_002',
    blockNumber: 2025002,
    startTime: new Date('2025-01-02T16:00:00Z'),
    endTime: new Date('2025-01-02T17:00:00Z'),
    status: 'active',
    totalVolume: 89.2,
    averagePrice: 99100,
    tradesExecuted: 18
  },
  {
    id: 'block_003',
    blockNumber: 2025003,
    startTime: new Date('2025-01-02T17:00:00Z'),
    endTime: new Date('2025-01-02T18:00:00Z'),
    status: 'upcoming',
    totalVolume: 0,
    averagePrice: 0,
    tradesExecuted: 0
  }
]

// Mock Order Book
export const mockOrderBook: OrderBook = {
  blockId: 'block_002',
  forensicRating: 'AAA',
  bids: [
    {
      id: 'order_001',
      blockId: 'block_002',
      userId: 'user_001',
      type: 'buy',
      amount: 10,
      price: 103425,
      forensicRating: 'AAA',
      status: 'pending',
      filledAmount: 0,
      remainingAmount: 10,
      submittedAt: new Date('2025-01-02T15:45:00Z'),
      expiresAt: new Date('2025-01-02T17:00:00Z')
    },
    {
      id: 'order_002',
      blockId: 'block_002',
      userId: 'user_002',
      type: 'buy',
      amount: 5,
      price: 103400,
      forensicRating: 'AAA',
      status: 'pending',
      filledAmount: 0,
      remainingAmount: 5,
      submittedAt: new Date('2025-01-02T15:50:00Z'),
      expiresAt: new Date('2025-01-02T17:00:00Z')
    }
  ],
  asks: [
    {
      id: 'order_003',
      blockId: 'block_002',
      userId: 'user_003',
      type: 'sell',
      amount: 8,
      price: 103500,
      forensicRating: 'AAA',
      status: 'pending',
      filledAmount: 0,
      remainingAmount: 8,
      submittedAt: new Date('2025-01-02T15:55:00Z'),
      expiresAt: new Date('2025-01-02T17:00:00Z')
    }
  ],
  lastTradePrice: 103450,
  volume24h: 347.8,
  priceChange24h: 2.1
}

// Mock Knowledge Resources
export const mockKnowledgeResources: KnowledgeResource[] = [
  {
    id: 'resource_001',
    title: 'Digital Asset OTC Transaction Best Practices',
    description: 'Comprehensive guide to structuring large-scale digital asset transactions with proper risk management and compliance.',
    category: 'legal',
    subcategory: 'transaction_structuring',
    type: 'guide',
    content: 'This comprehensive guide covers the essential elements of digital asset OTC transactions...',
    tags: ['otc', 'compliance', 'best-practices', 'risk-management'],
    difficulty: 'intermediate',
    estimatedReadTime: 15,
    authorId: 'user_003',
    authorName: 'Victoria Sterling',
    isPublic: false,
    downloadCount: 247,
    rating: 4.8,
    reviewCount: 31,
    createdAt: new Date('2024-09-15T14:00:00Z'),
    updatedAt: new Date('2024-12-01T16:30:00Z')
  },
  {
    id: 'resource_002',
    title: 'KYC/AML Compliance Checklist for High-Value Transactions',
    description: 'Essential compliance checklist ensuring all regulatory requirements are met for transactions exceeding $1M.',
    category: 'compliance',
    type: 'checklist',
    fileUrl: '/resources/kyc_aml_checklist_2025.pdf',
    tags: ['kyc', 'aml', 'compliance', 'checklist', 'regulations'],
    difficulty: 'beginner',
    estimatedReadTime: 8,
    authorId: 'user_003',
    authorName: 'Victoria Sterling',
    isPublic: false,
    downloadCount: 189,
    rating: 4.9,
    reviewCount: 23,
    createdAt: new Date('2024-11-20T11:00:00Z'),
    updatedAt: new Date('2024-12-15T09:30:00Z')
  },
  {
    id: 'resource_003',
    title: 'Forensic Rating System: Understanding Bitcoin Provenance',
    description: 'Technical deep-dive into the forensic rating methodology and its impact on pricing premiums.',
    category: 'technical',
    subcategory: 'forensics',
    type: 'document',
    content: 'The forensic rating system employed by Buckingham Vault represents a sophisticated approach...',
    tags: ['forensics', 'bitcoin', 'rating-system', 'provenance', 'pricing'],
    difficulty: 'advanced',
    estimatedReadTime: 22,
    authorId: 'user_003',
    authorName: 'Victoria Sterling',
    isPublic: false,
    downloadCount: 156,
    rating: 4.7,
    reviewCount: 18,
    createdAt: new Date('2024-10-05T13:30:00Z'),
    updatedAt: new Date('2024-11-30T15:45:00Z')
  }
]

// Mock Jeeves Chat
export const mockJeevesChat: JeevesChat = {
  id: 'chat_001',
  userId: 'user_001',
  messages: [
    {
      id: 'msg_001',
      role: 'user',
      content: 'Jeeves, can you analyze this purchase agreement document I just uploaded?',
      timestamp: new Date('2025-01-02T14:30:00Z')
    },
    {
      id: 'msg_002',
      role: 'jeeves',
      content: 'Certainly, Mr. Pemberton. I have thoroughly analyzed the purchase agreement document. The contract appears to be for the acquisition of 50 Bitcoin units with AAA forensic rating at $98,500 per unit. I\'ve identified the following key terms: total value of $4,925,000, settlement via escrow arrangement, and a 14-day completion timeframe. Shall I populate the deal tracker with these details?',
      timestamp: new Date('2025-01-02T14:31:30Z'),
      metadata: {
        confidence: 0.94,
        suggestedActions: [
          'Create new deal entry',
          'Schedule compliance review',
          'Verify counterparty credentials'
        ],
        relatedDocuments: ['doc_001', 'doc_002']
      }
    },
    {
      id: 'msg_003',
      role: 'user',
      content: 'Yes, please create the deal entry and flag it for expedited compliance review.',
      timestamp: new Date('2025-01-02T14:32:00Z')
    },
    {
      id: 'msg_004',
      role: 'jeeves',
      content: 'Very good, sir. I have created deal entry BV-2025-001 with all relevant details from the contract. The matter has been flagged for expedited compliance review and assigned to our senior compliance team. You should expect the initial review to be completed within 2 business hours. Is there anything else you require assistance with regarding this transaction?',
      timestamp: new Date('2025-01-02T14:32:45Z'),
      metadata: {
        confidence: 0.98,
        suggestedActions: [
          'Upload additional supporting documents',
          'Schedule client meeting',
          'Prepare settlement instructions'
        ]
      }
    }
  ],
  context: {
    dealId: 'deal_001',
    documentId: 'doc_001',
    topic: 'document_analysis'
  },
  startedAt: new Date('2025-01-02T14:30:00Z'),
  lastMessageAt: new Date('2025-01-02T14:32:45Z')
}

// Mock Document Analysis
export const mockDocumentAnalysis: DocumentAnalysis = {
  id: 'analysis_001',
  documentId: 'doc_001',
  status: 'completed',
  confidence: 0.94,
  extractedData: {
    dealType: 'buy',
    assetType: 'BTC',
    amount: 50,
    price: 98500,
    parties: {
      buyer: 'Pemberton Family Office',
      seller: 'Sovereign Digital Assets',
      introducer: 'Charles Pemberton III'
    },
    settlementDetails: {
      method: 'escrow_to_escrow',
      estimatedSettlementTime: 72,
      fees: [
        {
          type: 'escrow',
          amount: 14775,
          currency: 'USD',
          description: 'BitGo escrow service fee (0.3%)'
        }
      ]
    },
    timeframe: {
      proposedClosing: new Date('2025-01-10T17:00:00Z'),
      validUntil: new Date('2025-01-20T17:00:00Z')
    },
    additionalTerms: [
      'AAA forensic rating required',
      'BitGo institutional custody',
      'Wire transfer for fiat settlement',
      'Force majeure clauses included'
    ]
  },
  suggestedActions: [
    'Verify counterparty credentials',
    'Confirm escrow arrangements',
    'Schedule compliance review',
    'Prepare settlement documentation'
  ],
  reviewRequired: false,
  processedAt: new Date('2025-01-02T14:31:30Z'),
  reviewedBy: 'user_003',
  reviewedAt: new Date('2025-01-02T15:15:00Z')
}

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif_001',
    userId: 'user_001',
    type: 'deal_match',
    title: 'New Deal Match Found',
    message: 'A potential match has been identified for your BTC purchase order (BV-2025-001)',
    data: {
      dealId: 'deal_001',
      matchId: 'match_001',
      matchScore: 95
    },
    read: false,
    createdAt: new Date('2025-01-02T10:30:00Z')
  },
  {
    id: 'notif_002',
    userId: 'user_001',
    type: 'jeeves_insight',
    title: 'Document Analysis Complete',
    message: 'Jeeves has completed analysis of your purchase agreement with 94% confidence',
    data: {
      documentId: 'doc_001',
      analysisId: 'analysis_001',
      confidence: 0.94
    },
    read: true,
    createdAt: new Date('2025-01-02T14:31:30Z')
  },
  {
    id: 'notif_003',
    userId: 'user_002',
    type: 'compliance_alert',
    title: 'Compliance Review Required',
    message: 'Deal BV-2025-002 requires additional KYC documentation before processing',
    data: {
      dealId: 'deal_002',
      requiredDocuments: ['enhanced_kyc', 'source_of_funds']
    },
    read: false,
    createdAt: new Date('2025-01-02T16:45:00Z')
  }
]

// Utility functions for generating additional mock data
export function generateMockOrder(blockId: string, userId: string, type: 'buy' | 'sell'): Order {
  const basePrice = 99000 + Math.random() * 5000
  const premium = Math.random() * 0.05 // up to 5% premium/discount
  
  return {
    id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    blockId,
    userId,
    type,
    amount: Math.round((Math.random() * 50 + 1) * 100) / 100,
    price: Math.round(basePrice * (1 + (type === 'buy' ? -premium : premium))),
    forensicRating: ['AAA', 'AA', 'A', 'BBB'][Math.floor(Math.random() * 4)] as any,
    status: 'pending',
    filledAmount: 0,
    remainingAmount: 0,
    submittedAt: new Date(),
    expiresAt: new Date(Date.now() + 3600000) // 1 hour from now
  }
}

export function generateMockDeal(userId: string, type: 'buy' | 'sell'): Partial<Deal> {
  const assetTypes: Array<'BTC' | 'ETH' | 'USDT' | 'USDC'> = ['BTC', 'ETH', 'USDT', 'USDC']
  const assetType = assetTypes[Math.floor(Math.random() * assetTypes.length)]
  const amount = Math.round((Math.random() * 100 + 1) * 100) / 100
  const basePrice = assetType === 'BTC' ? 99000 : assetType === 'ETH' ? 3500 : 1.0
  const price = basePrice + (Math.random() - 0.5) * basePrice * 0.05
  
  return {
    dealNumber: `BV-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    type,
    status: ['submitted', 'under_review', 'matched'][Math.floor(Math.random() * 3)] as any,
    assetType,
    amount,
    pricePerUnit: Math.round(price * 100) / 100,
    totalValue: Math.round(amount * price * 100) / 100,
    currency: 'USD',
    submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    expectedClosingDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)
  }
}