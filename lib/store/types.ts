/**
 * Global State Types for Buckingham Vault
 * Defines all client-side state interfaces and types
 */

import { User, Deal, AssetType, ForensicRating, DealStatus, DealType } from '@/types/financial'

// Application Theme State
export interface ThemeState {
  isDarkMode: boolean
  primaryColor: 'gold' | 'platinum' | 'navy'
  fontScale: 'small' | 'medium' | 'large'
  reducedMotion: boolean
  highContrast: boolean
}

// Navigation State
export interface NavigationState {
  currentModule: 'deals' | 'jeeves' | 'knowledge' | 'exchange' | 'analytics'
  sidebarCollapsed: boolean
  breadcrumbs: Array<{
    label: string
    href?: string
  }>
  activeTab?: string
}

// Filter State (shared across modules)
export interface FilterState {
  deals: {
    search: string
    status: DealStatus[]
    type: DealType[]
    dateRange: [Date | null, Date | null]
    valueRange: [number, number]
    forensicRating: ForensicRating[]
  }
  knowledge: {
    search: string
    category: string[]
    type: string[]
    tags: string[]
    featured: boolean
  }
  exchange: {
    assetType: AssetType[]
    forensicRating: ForensicRating[]
    priceRange: [number, number]
    region: string[]
  }
}

// Notification State
export interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  settings: {
    emailNotifications: boolean
    pushNotifications: boolean
    dealAlerts: boolean
    priceAlerts: boolean
    systemAlerts: boolean
  }
}

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error' | 'deal' | 'price' | 'system'
  title: string
  message: string
  isRead: boolean
  createdAt: Date
  expiresAt?: Date
  actionUrl?: string
  metadata?: any
}

// Modal/Dialog State
export interface ModalState {
  activeModal: string | null
  modalData: any
  isLoading: boolean
  isClosing: boolean
}

// Cache State (for non-server data)
export interface CacheState {
  preferences: UserPreferences
  recentSearches: string[]
  bookmarks: string[]
  viewHistory: Array<{
    type: 'deal' | 'knowledge' | 'analysis'
    id: string
    timestamp: Date
  }>
}

export interface UserPreferences {
  dealTableColumns: string[]
  defaultFilters: Partial<FilterState>
  dashboardLayout: string[]
  timezone: string
  currency: string
  numberFormat: 'us' | 'eu' | 'compact'
  emailDigestFrequency: 'daily' | 'weekly' | 'never'
}

// Real-time Data State (WebSocket updates)
export interface RealTimeState {
  isConnected: boolean
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error'
  lastPing: Date | null
  subscriptions: Set<string>
  liveData: {
    prices: Record<AssetType, number>
    orderBook: any
    dealUpdates: Deal[]
  }
}

// Form State Management
export interface FormState {
  activeForm: string | null
  formData: Record<string, any>
  isDirty: boolean
  errors: Record<string, string[]>
  isSubmitting: boolean
  autosaveEnabled: boolean
  lastSaved?: Date
}

// Security State
export interface SecurityState {
  sessionTimeout: Date | null
  lastActivity: Date
  failedAttempts: number
  securityLevel: 'standard' | 'enhanced' | 'maximum'
  biometricEnabled: boolean
  twoFactorEnabled: boolean
}

// Performance State
export interface PerformanceState {
  loadingStates: Record<string, boolean>
  errors: Record<string, Error | null>
  retryAttempts: Record<string, number>
  backgroundTasks: Set<string>
  cacheStats: {
    size: number
    hits: number
    misses: number
  }
}

// Combined Store State
export interface BuckinghamVaultState {
  // Core application state
  theme: ThemeState
  navigation: NavigationState
  filters: FilterState
  notifications: NotificationState
  modals: ModalState
  cache: CacheState
  realTime: RealTimeState
  forms: FormState
  security: SecurityState
  performance: PerformanceState

  // Actions (these will be defined in individual store slices)
  actions: {
    theme: ThemeActions
    navigation: NavigationActions
    filters: FilterActions
    notifications: NotificationActions
    modals: ModalActions
    cache: CacheActions
    realTime: RealTimeActions
    forms: FormActions
    security: SecurityActions
    performance: PerformanceActions
  }
}

// Action Interfaces
export interface ThemeActions {
  toggleDarkMode: () => void
  setPrimaryColor: (color: ThemeState['primaryColor']) => void
  setFontScale: (scale: ThemeState['fontScale']) => void
  toggleReducedMotion: () => void
  toggleHighContrast: () => void
  resetTheme: () => void
}

export interface NavigationActions {
  setCurrentModule: (module: NavigationState['currentModule']) => void
  toggleSidebar: () => void
  setBreadcrumbs: (breadcrumbs: NavigationState['breadcrumbs']) => void
  setActiveTab: (tab: string) => void
}

export interface FilterActions {
  setDealFilters: (filters: Partial<FilterState['deals']>) => void
  setKnowledgeFilters: (filters: Partial<FilterState['knowledge']>) => void
  setExchangeFilters: (filters: Partial<FilterState['exchange']>) => void
  resetFilters: (module?: keyof FilterState) => void
  saveFilterPreset: (name: string, module: keyof FilterState) => void
}

export interface NotificationActions {
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearExpired: () => void
  updateSettings: (settings: Partial<NotificationState['settings']>) => void
}

export interface ModalActions {
  openModal: (modalName: string, data?: any) => void
  closeModal: () => void
  setModalData: (data: any) => void
  setModalLoading: (loading: boolean) => void
}

export interface CacheActions {
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  addRecentSearch: (search: string) => void
  addBookmark: (id: string) => void
  removeBookmark: (id: string) => void
  addViewHistory: (item: CacheState['viewHistory'][0]) => void
  clearCache: (type?: keyof CacheState) => void
}

export interface RealTimeActions {
  connect: () => void
  disconnect: () => void
  subscribe: (channel: string) => void
  unsubscribe: (channel: string) => void
  updateLiveData: (type: keyof RealTimeState['liveData'], data: any) => void
  setConnectionStatus: (status: RealTimeState['connectionStatus']) => void
}

export interface FormActions {
  setActiveForm: (formName: string | null) => void
  updateFormData: (formName: string, data: any) => void
  setFormErrors: (formName: string, errors: string[]) => void
  setFormSubmitting: (submitting: boolean) => void
  enableAutosave: (enabled: boolean) => void
  markFormSaved: () => void
  resetForm: (formName: string) => void
}

export interface SecurityActions {
  updateLastActivity: () => void
  incrementFailedAttempts: () => void
  resetFailedAttempts: () => void
  setSecurityLevel: (level: SecurityState['securityLevel']) => void
  enableBiometric: () => void
  enableTwoFactor: () => void
  extendSession: () => void
}

export interface PerformanceActions {
  setLoading: (key: string, loading: boolean) => void
  setError: (key: string, error: Error | null) => void
  incrementRetry: (key: string) => void
  resetRetries: (key: string) => void
  addBackgroundTask: (taskId: string) => void
  removeBackgroundTask: (taskId: string) => void
  updateCacheStats: (stats: Partial<PerformanceState['cacheStats']>) => void
}