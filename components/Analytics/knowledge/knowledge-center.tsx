"use client"

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  BookOpen, 
  FileText, 
  Video, 
  Download, 
  Bookmark, 
  Star, 
  Clock, 
  Users, 
  Tag, 
  ArrowRight, 
  Play, 
  CheckCircle, 
  Globe, 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  Award, 
  MessageSquare, 
  Eye, 
  ThumbsUp, 
  Share2, 
  ExternalLink,
  Archive,
  ChevronRight,
  Calendar,
  User,
  BarChart3,
  Zap,
  HelpCircle,
  Lightbulb,
  FileCheck,
  Scale,
  Target
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { useSecureAuth } from '@/hooks/use-secure-auth'
import { cn } from '@/lib/utils'

// Enhanced type definitions
type ResourceType = 'document' | 'guide' | 'video' | 'checklist' | 'template' | 'case_study' | 'regulation'
type ResourceCategory = 'legal' | 'compliance' | 'technical' | 'training' | 'market_analysis' | 'risk_management' | 'tax'
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

interface KnowledgeResource {
  id: string
  title: string
  description: string
  category: ResourceCategory
  subcategory?: string
  type: ResourceType
  content?: string
  fileUrl?: string
  videoUrl?: string
  thumbnailUrl?: string
  tags: string[]
  difficulty: DifficultyLevel
  estimatedReadTime: number
  authorId: string
  authorName: string
  isPublic: boolean
  downloadCount: number
  rating: number
  reviewCount: number
  bookmarked?: boolean
  lastUpdated: Date
  createdAt: Date
  version?: string
  prerequisites?: string[]
  relatedResources?: string[]
}

interface TrainingProgress {
  resourceId: string
  userId: string
  progress: number
  completed: boolean
  startedAt: Date
  completedAt?: Date
  timeSpent: number
  quiz_score?: number
}

interface Discussion {
  id: string
  resourceId: string
  userId: string
  userName: string
  content: string
  parentId?: string
  likes: number
  replies: Discussion[]
  createdAt: Date
}

// Mock data for the knowledge center
const mockResources: KnowledgeResource[] = [
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
    bookmarked: true,
    lastUpdated: new Date('2024-12-01T16:30:00Z'),
    createdAt: new Date('2024-09-15T14:00:00Z'),
    version: '2.1',
    prerequisites: ['Basic understanding of digital assets', 'Regulatory compliance fundamentals'],
    relatedResources: ['resource_002', 'resource_003']
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
    bookmarked: false,
    lastUpdated: new Date('2024-12-15T09:30:00Z'),
    createdAt: new Date('2024-11-20T11:00:00Z'),
    version: '3.0'
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
    bookmarked: true,
    lastUpdated: new Date('2024-11-30T15:45:00Z'),
    createdAt: new Date('2024-10-05T13:30:00Z'),
    version: '1.2'
  },
  {
    id: 'resource_004',
    title: 'Risk Management Framework for Digital Asset Trading',
    description: 'Comprehensive framework for identifying, assessing, and mitigating risks in digital asset transactions.',
    category: 'risk_management',
    type: 'guide',
    content: 'This framework provides a structured approach to risk management...',
    tags: ['risk-management', 'trading', 'framework', 'assessment'],
    difficulty: 'expert',
    estimatedReadTime: 35,
    authorId: 'user_003',
    authorName: 'Victoria Sterling',
    isPublic: false,
    downloadCount: 98,
    rating: 4.6,
    reviewCount: 15,
    bookmarked: false,
    lastUpdated: new Date('2024-12-10T12:00:00Z'),
    createdAt: new Date('2024-08-15T10:00:00Z'),
    version: '1.0'
  },
  {
    id: 'resource_005',
    title: 'Tax Implications of Digital Asset Transactions',
    description: 'Navigate the complex tax landscape for institutional digital asset transactions across jurisdictions.',
    category: 'tax',
    type: 'document',
    fileUrl: '/resources/tax_implications_2025.pdf',
    tags: ['tax', 'regulations', 'jurisdictions', 'institutional'],
    difficulty: 'intermediate',
    estimatedReadTime: 18,
    authorId: 'user_003',
    authorName: 'Victoria Sterling',
    isPublic: false,
    downloadCount: 134,
    rating: 4.5,
    reviewCount: 12,
    bookmarked: true,
    lastUpdated: new Date('2024-12-01T14:00:00Z'),
    createdAt: new Date('2024-10-20T16:00:00Z'),
    version: '2.0'
  },
  {
    id: 'resource_006',
    title: 'Introduction to Digital Asset Trading',
    description: 'Beginner-friendly video series covering the fundamentals of digital asset trading for institutions.',
    category: 'training',
    type: 'video',
    videoUrl: '/videos/intro_trading_series.mp4',
    thumbnailUrl: '/thumbnails/intro_trading.jpg',
    tags: ['training', 'beginner', 'video-series', 'fundamentals'],
    difficulty: 'beginner',
    estimatedReadTime: 45,
    authorId: 'user_003',
    authorName: 'Victoria Sterling',
    isPublic: false,
    downloadCount: 312,
    rating: 4.9,
    reviewCount: 45,
    bookmarked: false,
    lastUpdated: new Date('2024-11-15T10:30:00Z'),
    createdAt: new Date('2024-09-01T08:00:00Z'),
    version: '1.0'
  }
]

const mockTrainingProgress: TrainingProgress[] = [
  {
    resourceId: 'resource_001',
    userId: 'user_001',
    progress: 85,
    completed: false,
    startedAt: new Date('2024-12-20T10:00:00Z'),
    timeSpent: 720
  },
  {
    resourceId: 'resource_002',
    userId: 'user_001',
    progress: 100,
    completed: true,
    startedAt: new Date('2024-12-15T14:00:00Z'),
    completedAt: new Date('2024-12-15T14:30:00Z'),
    timeSpent: 480,
    quiz_score: 95
  }
]

// Utility functions
const getCategoryIcon = (category: ResourceCategory) => {
  const icons = {
    legal: Scale,
    compliance: Shield,
    technical: Zap,
    training: Award,
    market_analysis: BarChart3,
    risk_management: AlertTriangle,
    tax: FileCheck
  }
  return icons[category] || FileText
}

const getTypeIcon = (type: ResourceType) => {
  const icons = {
    document: FileText,
    guide: BookOpen,
    video: Video,
    checklist: CheckCircle,
    template: FileCheck,
    case_study: Target,
    regulation: Scale
  }
  return icons[type] || FileText
}

const getDifficultyColor = (difficulty: DifficultyLevel) => {
  const colors = {
    beginner: 'bg-green-500/20 text-green-300 border-green-500/30',
    intermediate: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    advanced: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    expert: 'bg-red-500/20 text-red-300 border-red-500/30'
  }
  return colors[difficulty] || 'bg-white/20 text-white border-white/30'
}

const formatReadTime = (minutes: number) => {
  if (minutes < 60) return `${minutes} min read`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}

// Resource Card Component
function ResourceCard({ 
  resource, 
  progress, 
  onView, 
  onBookmark 
}: { 
  resource: KnowledgeResource, 
  progress?: TrainingProgress,
  onView: (resource: KnowledgeResource) => void,
  onBookmark: (resourceId: string) => void 
}) {
  const CategoryIcon = getCategoryIcon(resource.category)
  const TypeIcon = getTypeIcon(resource.type)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="h-full"
    >
      <Card className="glass-morphism border-gold/20 hover:border-gold/40 transition-all duration-300 h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 glass-morphism rounded-lg flex items-center justify-center">
                <TypeIcon className="w-4 h-4 text-gold" />
              </div>
              <Badge className={cn("text-xs", getDifficultyColor(resource.difficulty))}>
                {resource.difficulty}
              </Badge>
            </div>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onBookmark(resource.id)}
              className={cn(
                "h-8 w-8 p-0",
                resource.bookmarked ? "text-gold" : "text-white/50"
              )}
            >
              <Bookmark className={cn("w-4 h-4", resource.bookmarked && "fill-current")} />
            </Button>
          </div>
          
          <CardTitle className="text-white text-lg leading-tight">
            {resource.title}
          </CardTitle>
          
          <p className="text-white/70 text-sm line-clamp-2">
            {resource.description}
          </p>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {resource.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} className="bg-navy/60 text-white/80 text-xs border-white/20">
                  {tag}
                </Badge>
              ))}
              {resource.tags.length > 3 && (
                <Badge className="bg-navy/60 text-white/80 text-xs border-white/20">
                  +{resource.tags.length - 3}
                </Badge>
              )}
            </div>
            
            {/* Progress bar for training materials */}
            {progress && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-white/70">Progress</span>
                  <span className="text-white">{progress.progress}%</span>
                </div>
                <Progress value={progress.progress} className="h-2" />
                {progress.completed && (
                  <div className="flex items-center text-xs text-green-400">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </div>
                )}
              </div>
            )}
            
            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-white/60">
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatReadTime(resource.estimatedReadTime)}
                </div>
                <div className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {resource.downloadCount}
                </div>
              </div>
              
              <div className="flex items-center">
                <Star className="w-3 h-3 mr-1 text-gold fill-current" />
                <span>{resource.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2 mt-4">
            <Button
              size="sm"
              onClick={() => onView(resource)}
              className="flex-1 bg-gold hover:bg-gold-light text-navy"
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            
            {resource.fileUrl && (
              <Button size="sm" variant="outline" className="border-gold/30">
                <Download className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Resource Detail Modal
function ResourceDetailModal({ 
  resource, 
  isOpen, 
  onClose 
}: { 
  resource: KnowledgeResource, 
  isOpen: boolean, 
  onClose: () => void 
}) {
  const TypeIcon = getTypeIcon(resource.type)
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-morphism border-gold/20">
        <DialogHeader className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 glass-morphism rounded-lg flex items-center justify-center">
              <TypeIcon className="w-5 h-5 text-gold" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-white text-xl">{resource.title}</DialogTitle>
              <div className="flex items-center space-x-3 mt-1">
                <Badge className={cn("text-xs", getDifficultyColor(resource.difficulty))}>
                  {resource.difficulty}
                </Badge>
                <span className="text-xs text-white/70">
                  by {resource.authorName}
                </span>
                <span className="text-xs text-white/70">
                  {formatReadTime(resource.estimatedReadTime)}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-white/80 leading-relaxed">{resource.description}</p>
          
          {resource.prerequisites && resource.prerequisites.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-white font-medium">Prerequisites</h4>
              <ul className="space-y-1">
                {resource.prerequisites.map((prereq, index) => (
                  <li key={index} className="text-white/70 text-sm flex items-center">
                    <ChevronRight className="w-3 h-3 mr-2 text-gold" />
                    {prereq}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {resource.content && (
            <div className="space-y-4">
              <h4 className="text-white font-medium">Content</h4>
              <div className="bg-navy/40 border border-white/10 rounded-lg p-4">
                <p className="text-white/80 leading-relaxed">{resource.content}</p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-white font-medium">Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Category:</span>
                  <span className="text-white">{resource.category.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Type:</span>
                  <span className="text-white">{resource.type.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Version:</span>
                  <span className="text-white">{resource.version || '1.0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Last Updated:</span>
                  <span className="text-white">{resource.lastUpdated.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-white font-medium">Statistics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Downloads:</span>
                  <span className="text-white">{resource.downloadCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Rating:</span>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 mr-1 text-gold fill-current" />
                    <span className="text-white">{resource.rating.toFixed(1)}</span>
                    <span className="text-white/70 ml-1">({resource.reviewCount})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {resource.tags.map((tag) => (
              <Badge key={tag} className="bg-navy/60 text-white/80 text-xs border-white/20">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex space-x-3 pt-4 border-t border-white/10">
            <Button className="bg-gold hover:bg-gold-light text-navy">
              <Play className="w-4 h-4 mr-2" />
              Start Learning
            </Button>
            
            {resource.fileUrl && (
              <Button variant="outline" className="border-gold/30">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
            
            <Button variant="outline" className="border-gold/30">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Main Component
export function KnowledgeCenter() {
  const { user } = useSecureAuth()
  const [resources, setResources] = useState<KnowledgeResource[]>(mockResources)
  const [filteredResources, setFilteredResources] = useState<KnowledgeResource[]>(mockResources)
  const [trainingProgress] = useState<TrainingProgress[]>(mockTrainingProgress)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<ResourceCategory | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<ResourceType | 'all'>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel | 'all'>('all')
  const [showBookmarked, setShowBookmarked] = useState(false)
  const [selectedResource, setSelectedResource] = useState<KnowledgeResource | null>(null)
  const [activeTab, setActiveTab] = useState('library')

  // Filter resources
  useEffect(() => {
    let filtered = resources

    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(resource => resource.category === categoryFilter)
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(resource => resource.type === typeFilter)
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(resource => resource.difficulty === difficultyFilter)
    }

    if (showBookmarked) {
      filtered = filtered.filter(resource => resource.bookmarked)
    }

    setFilteredResources(filtered)
  }, [resources, searchQuery, categoryFilter, typeFilter, difficultyFilter, showBookmarked])

  // Handle bookmarking
  const handleBookmark = (resourceId: string) => {
    setResources(prev => prev.map(resource =>
      resource.id === resourceId
        ? { ...resource, bookmarked: !resource.bookmarked }
        : resource
    ))
  }

  // Calculate stats
  const stats = useMemo(() => {
    const completedResources = trainingProgress.filter(p => p.completed).length
    const totalProgress = trainingProgress.reduce((sum, p) => sum + p.progress, 0)
    const avgProgress = trainingProgress.length > 0 ? totalProgress / trainingProgress.length : 0
    
    return {
      totalResources: resources.length,
      bookmarked: resources.filter(r => r.bookmarked).length,
      completed: completedResources,
      avgProgress
    }
  }, [resources, trainingProgress])

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="w-16 h-16 mx-auto glass-morphism rounded-2xl flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-gold" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Knowledge Center</h1>
          <p className="text-white/70 mt-2">
            Comprehensive resources for institutional digital asset professionals
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Resources', value: stats.totalResources, icon: FileText, color: 'text-blue-400' },
          { label: 'Bookmarked', value: stats.bookmarked, icon: Bookmark, color: 'text-gold' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-green-400' },
          { label: 'Avg Progress', value: `${stats.avgProgress.toFixed(0)}%`, icon: TrendingUp, color: 'text-purple-400' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <Card className="glass-morphism border-gold/20">
              <CardContent className="p-4 text-center">
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/70">{stat.label}</div>
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
          <TabsList className="bg-navy/60 border border-gold/20 grid w-full grid-cols-4">
            <TabsTrigger value="library" className="data-[state=active]:bg-gold data-[state=active]:text-navy">
              Library
            </TabsTrigger>
            <TabsTrigger value="training" className="data-[state=active]:bg-gold data-[state=active]:text-navy">
              Training
            </TabsTrigger>
            <TabsTrigger value="discussions" className="data-[state=active]:bg-gold data-[state=active]:text-navy">
              Discussions
            </TabsTrigger>
            <TabsTrigger value="my_content" className="data-[state=active]:bg-gold data-[state=active]:text-navy">
              My Content
            </TabsTrigger>
          </TabsList>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <Input
                  placeholder="Search resources, topics, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-navy/50 border-gold/20 text-white"
                />
              </div>
            </div>
            
            <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as ResourceCategory | 'all')}>
              <SelectTrigger className="w-[160px] bg-navy/50 border-gold/20 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="market_analysis">Market Analysis</SelectItem>
                <SelectItem value="risk_management">Risk Management</SelectItem>
                <SelectItem value="tax">Tax</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as ResourceType | 'all')}>
              <SelectTrigger className="w-[140px] bg-navy/50 border-gold/20 text-white">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="guide">Guide</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="checklist">Checklist</SelectItem>
                <SelectItem value="template">Template</SelectItem>
                <SelectItem value="case_study">Case Study</SelectItem>
              </SelectContent>
            </Select>

            <Select value={difficultyFilter} onValueChange={(value) => setDifficultyFilter(value as DifficultyLevel | 'all')}>
              <SelectTrigger className="w-[140px] bg-navy/50 border-gold/20 text-white">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={showBookmarked ? "default" : "outline"}
              onClick={() => setShowBookmarked(!showBookmarked)}
              className={cn(
                showBookmarked 
                  ? "bg-gold text-navy" 
                  : "border-gold/30 text-gold hover:bg-gold/10"
              )}
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Bookmarked
            </Button>
          </div>

          <TabsContent value="library" className="space-y-6">
            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => {
                  const progress = trainingProgress.find(p => p.resourceId === resource.id)
                  return (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      progress={progress}
                      onView={setSelectedResource}
                      onBookmark={handleBookmark}
                    />
                  )
                })}
              </div>
            ) : (
              <Card className="glass-morphism border-gold/20">
                <CardContent className="p-12 text-center">
                  <Search className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Resources Found</h3>
                  <p className="text-white/70">
                    Try adjusting your search criteria or browse all resources.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <Card className="glass-morphism border-gold/20">
              <CardHeader>
                <CardTitle className="text-white">Training Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trainingProgress.map((progress) => {
                  const resource = resources.find(r => r.id === progress.resourceId)
                  if (!resource) return null
                  
                  return (
                    <div key={progress.resourceId} className="p-4 bg-navy/40 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{resource.title}</h4>
                        <div className="flex items-center space-x-2">
                          {progress.completed && <CheckCircle className="w-4 h-4 text-green-400" />}
                          <span className="text-sm text-white">{progress.progress}%</span>
                        </div>
                      </div>
                      <Progress value={progress.progress} className="mb-2" />
                      <div className="text-xs text-white/70">
                        Time spent: {Math.floor(progress.timeSpent / 60)}h {progress.timeSpent % 60}m
                        {progress.quiz_score && ` • Quiz score: ${progress.quiz_score}%`}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discussions" className="space-y-6">
            <Card className="glass-morphism border-gold/20">
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Discussions Coming Soon</h3>
                <p className="text-white/70">
                  Member discussions and knowledge sharing will be available in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my_content" className="space-y-6">
            <Card className="glass-morphism border-gold/20">
              <CardContent className="p-12 text-center">
                <User className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">My Content</h3>
                <p className="text-white/70">
                  View and manage your bookmarks, notes, and personal content.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Resource Detail Modal */}
      {selectedResource && (
        <ResourceDetailModal
          resource={selectedResource}
          isOpen={!!selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}
    </div>
  )
}