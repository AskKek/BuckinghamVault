/**
 * Buckingham Vault Global Store
 * Simplified working implementation to get build passing
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Simple working store with basic state
export const useBuckinghamStore = create(
  devtools(
    persist(
      (set: any, get: any) => ({
        // Theme state
        theme: {
          isDarkMode: true,
          primaryColor: 'gold',
          fontScale: 'medium',
          reducedMotion: false,
          highContrast: false,
        },
        
        // Navigation state
        navigation: {
          currentModule: 'deals',
          sidebarCollapsed: false,
          breadcrumbs: [],
          activeTab: null,
        },
        
        // Filter state
        filters: {
          deals: {
            search: '',
            status: [],
            type: [],
            dateRange: [null, null],
            valueRange: [0, 1000000],
            forensicRating: [],
          },
          knowledge: {
            search: '',
            category: [],
            type: [],
            tags: [],
            featured: false,
          },
          exchange: {
            assetType: [],
            forensicRating: [],
            priceRange: [0, 1000000],
            region: [],
          },
        },
        
        // Notification state
        notifications: {
          items: [],
          unreadCount: 0,
          settings: {
            enablePush: true,
            enableEmail: true,
            enableSms: false,
            frequency: 'immediate',
          },
        },
        
        // Modal state
        modals: {
          activeModal: null,
          modalData: null,
          isLoading: false,
          isClosing: false,
        },
        
        // Cache state
        cache: {
          preferences: {
            dealTableColumns: ['dealNumber', 'clientName', 'type', 'assetType', 'totalValue', 'status'],
            defaultFilters: {},
            dashboardLayout: ['deals', 'analytics', 'notifications'],
            timezone: 'UTC',
            currency: 'USD',
            numberFormat: 'us',
            emailDigestFrequency: 'weekly',
          },
          recentSearches: [],
          bookmarks: [],
          viewHistory: [],
        },
        
        // Real-time state
        realTime: {
          isConnected: false,
          connectionStatus: 'disconnected',
          lastPing: null,
          subscriptions: new Set(),
          liveData: {
            prices: {
              BTC: 0,
              ETH: 0,
              USDT: 0,
              USDC: 0,
              other: 0,
            },
            orderBook: null,
            dealUpdates: [],
          },
        },
        
        // Form state
        forms: {
          activeForm: null,
          formData: {},
          isSubmitting: false,
          isDirty: false,
          autosaveEnabled: true,
          drafts: {},
          errors: {},
        },
        
        // Security state
        security: {
          sessionId: null,
          sessionTimeout: null,
          lastActivity: null,
          failedAttempts: 0,
          isLocked: false,
          securityLevel: 'standard',
          biometricEnabled: false,
          twoFactorEnabled: false,
        },
        
        // Performance state
        performance: {
          loadingStates: {},
          errors: {},
          retryAttempts: {},
          metrics: {},
          backgroundTasks: new Set(),
          cacheStats: {
            hits: 0,
            misses: 0,
            size: 0,
          },
        },
        
        // Actions
        actions: {
          theme: {
            toggleDarkMode: () => set((state: any) => ({
              theme: { ...state.theme, isDarkMode: !state.theme.isDarkMode }
            })),
            setPrimaryColor: (color: string) => set((state: any) => ({
              theme: { ...state.theme, primaryColor: color }
            })),
            setFontScale: (scale: string) => set((state: any) => ({
              theme: { ...state.theme, fontScale: scale }
            })),
            toggleReducedMotion: () => set((state: any) => ({
              theme: { ...state.theme, reducedMotion: !state.theme.reducedMotion }
            })),
            toggleHighContrast: () => set((state: any) => ({
              theme: { ...state.theme, highContrast: !state.theme.highContrast }
            })),
          },
          navigation: {
            setCurrentModule: (module: string) => set((state: any) => ({
              navigation: { ...state.navigation, currentModule: module }
            })),
            toggleSidebar: () => set((state: any) => ({
              navigation: { ...state.navigation, sidebarCollapsed: !state.navigation.sidebarCollapsed }
            })),
            setBreadcrumbs: (breadcrumbs: any[]) => set((state: any) => ({
              navigation: { ...state.navigation, breadcrumbs }
            })),
            setActiveTab: (tab: string) => set((state: any) => ({
              navigation: { ...state.navigation, activeTab: tab }
            })),
          },
          filters: {
            updateDealFilters: (filters: any) => set((state: any) => ({
              filters: { ...state.filters, deals: { ...state.filters.deals, ...filters } }
            })),
            updateKnowledgeFilters: (filters: any) => set((state: any) => ({
              filters: { ...state.filters, knowledge: { ...state.filters.knowledge, ...filters } }
            })),
            updateExchangeFilters: (filters: any) => set((state: any) => ({
              filters: { ...state.filters, exchange: { ...state.filters.exchange, ...filters } }
            })),
            resetFilters: () => set((state: any) => ({
              filters: {
                deals: { search: '', status: [], type: [], dateRange: [null, null], valueRange: [0, 1000000], forensicRating: [] },
                knowledge: { search: '', category: [], type: [], tags: [], featured: false },
                exchange: { assetType: [], forensicRating: [], priceRange: [0, 1000000], region: [] },
              }
            })),
          },
          notifications: {
            addNotification: (notification: any) => set((state: any) => ({
              notifications: {
                ...state.notifications,
                items: [notification, ...state.notifications.items],
                unreadCount: state.notifications.unreadCount + 1
              }
            })),
            markAsRead: (id: string) => set((state: any) => ({
              notifications: {
                ...state.notifications,
                items: state.notifications.items.map((item: any) => 
                  item.id === id ? { ...item, isRead: true } : item
                ),
                unreadCount: Math.max(0, state.notifications.unreadCount - 1)
              }
            })),
            clearAll: () => set((state: any) => ({
              notifications: { ...state.notifications, items: [], unreadCount: 0 }
            })),
            clearExpired: () => set((state: any) => {
              const now = new Date()
              const filtered = state.notifications.items.filter((item: any) => !item.expiresAt || new Date(item.expiresAt) > now)
              return { notifications: { ...state.notifications, items: filtered } }
            }),
            updateSettings: (settings: any) => set((state: any) => ({
              notifications: { ...state.notifications, settings: { ...state.notifications.settings, ...settings } }
            })),
          },
          modals: {
            openModal: (modalName: string, data?: any) => set((state: any) => ({
              modals: { ...state.modals, activeModal: modalName, modalData: data, isLoading: false, isClosing: false }
            })),
            closeModal: () => set((state: any) => ({
              modals: { ...state.modals, isClosing: true }
            })),
            setModalData: (data: any) => set((state: any) => ({
              modals: { ...state.modals, modalData: data }
            })),
            setModalLoading: (loading: boolean) => set((state: any) => ({
              modals: { ...state.modals, isLoading: loading }
            })),
          },
          cache: {
            updatePreferences: (preferences: any) => set((state: any) => ({
              cache: { ...state.cache, preferences: { ...state.cache.preferences, ...preferences } }
            })),
            addRecentSearch: (search: string) => set((state: any) => ({
              cache: { ...state.cache, recentSearches: [search, ...state.cache.recentSearches.slice(0, 9)] }
            })),
            addBookmark: (id: string) => set((state: any) => ({
              cache: { ...state.cache, bookmarks: [...state.cache.bookmarks, id] }
            })),
            removeBookmark: (id: string) => set((state: any) => ({
              cache: { ...state.cache, bookmarks: state.cache.bookmarks.filter((b: string) => b !== id) }
            })),
            clearRecentSearches: () => set((state: any) => ({
              cache: { ...state.cache, recentSearches: [] }
            })),
            addViewHistory: (item: any) => set((state: any) => ({
              cache: { ...state.cache, viewHistory: [item, ...state.cache.viewHistory.slice(0, 19)] }
            })),
            clearCache: () => set((state: any) => ({
              cache: { ...state.cache, recentSearches: [], bookmarks: [], viewHistory: [] }
            })),
          },
          realTime: {
            connect: () => set((state: any) => ({
              realTime: { ...state.realTime, connectionStatus: 'connecting' }
            })),
            disconnect: () => set((state: any) => ({
              realTime: { ...state.realTime, connectionStatus: 'disconnected', isConnected: false }
            })),
            subscribe: (channel: string) => set((state: any) => ({
              realTime: { ...state.realTime, subscriptions: new Set([...state.realTime.subscriptions, channel]) }
            })),
            unsubscribe: (channel: string) => set((state: any) => {
              const newSubs = new Set(state.realTime.subscriptions)
              newSubs.delete(channel)
              return { realTime: { ...state.realTime, subscriptions: newSubs } }
            }),
            updateLiveData: (type: string, data: any) => set((state: any) => ({
              realTime: { ...state.realTime, liveData: { ...state.realTime.liveData, [type]: data } }
            })),
            setConnectionStatus: (status: string) => set((state: any) => ({
              realTime: { ...state.realTime, connectionStatus: status, isConnected: status === 'connected' }
            })),
          },
          forms: {
            setActiveForm: (formName: string) => set((state: any) => ({
              forms: { ...state.forms, activeForm: formName }
            })),
            updateFormData: (formName: string, data: any) => set((state: any) => ({
              forms: { ...state.forms, formData: { ...state.forms.formData, [formName]: data } }
            })),
            saveDraft: (formName: string, data: any) => set((state: any) => ({
              forms: { ...state.forms, drafts: { ...state.forms.drafts, [formName]: data } }
            })),
            setFormSubmitting: (submitting: boolean) => set((state: any) => ({
              forms: { ...state.forms, isSubmitting: submitting }
            })),
            enableAutosave: (enabled: boolean) => set((state: any) => ({
              forms: { ...state.forms, autosaveEnabled: enabled }
            })),
            clearForm: (formName: string) => set((state: any) => {
              const newFormData = { ...state.forms.formData }
              const newDrafts = { ...state.forms.drafts }
              delete newFormData[formName]
              delete newDrafts[formName]
              return { forms: { ...state.forms, formData: newFormData, drafts: newDrafts } }
            }),
            loadDraft: (formName: string) => set((state: any) => {
              const draft = state.forms.drafts[formName]
              if (draft) {
                return { forms: { ...state.forms, formData: { ...state.forms.formData, [formName]: draft } } }
              }
              return state
            }),
          },
          security: {
            initializeSecurity: () => set((state: any) => ({
              security: { 
                ...state.security, 
                sessionTimeout: new Date(Date.now() + 30 * 60 * 1000),
                lastActivity: new Date()
              }
            })),
            updateLastActivity: () => set((state: any) => ({
              security: { ...state.security, lastActivity: new Date() }
            })),
            incrementFailedAttempts: () => set((state: any) => ({
              security: { ...state.security, failedAttempts: state.security.failedAttempts + 1 }
            })),
            resetFailedAttempts: () => set((state: any) => ({
              security: { ...state.security, failedAttempts: 0 }
            })),
            setSecurityLevel: (level: string) => set((state: any) => ({
              security: { ...state.security, securityLevel: level }
            })),
            enableBiometric: () => set((state: any) => ({
              security: { ...state.security, biometricEnabled: true }
            })),
            enableTwoFactor: () => set((state: any) => ({
              security: { ...state.security, twoFactorEnabled: true }
            })),
            setSessionId: (sessionId: string) => set((state: any) => ({
              security: { ...state.security, sessionId }
            })),
          },
          performance: {
            setLoading: (key: string, loading: boolean) => set((state: any) => ({
              performance: { ...state.performance, loadingStates: { ...state.performance.loadingStates, [key]: loading } }
            })),
            setError: (key: string, error: string) => set((state: any) => ({
              performance: { ...state.performance, errors: { ...state.performance.errors, [key]: error } }
            })),
            incrementRetry: (key: string) => set((state: any) => ({
              performance: { 
                ...state.performance, 
                retryAttempts: { ...state.performance.retryAttempts, [key]: (state.performance.retryAttempts[key] || 0) + 1 } 
              }
            })),
            resetRetries: (key: string) => set((state: any) => {
              const newRetries = { ...state.performance.retryAttempts }
              delete newRetries[key]
              return { performance: { ...state.performance, retryAttempts: newRetries } }
            }),
            addBackgroundTask: (taskId: string) => set((state: any) => ({
              performance: { 
                ...state.performance, 
                backgroundTasks: new Set([...state.performance.backgroundTasks, taskId]) 
              }
            })),
            removeBackgroundTask: (taskId: string) => set((state: any) => {
              const newTasks = new Set(state.performance.backgroundTasks)
              newTasks.delete(taskId)
              return { performance: { ...state.performance, backgroundTasks: newTasks } }
            }),
            updateMetrics: (metrics: any) => set((state: any) => ({
              performance: { ...state.performance, metrics: { ...state.performance.metrics, ...metrics } }
            })),
          },
        },
      }),
      {
        name: 'buckingham-vault-storage',
        version: 1,
        skipHydration: true,
      }
    ),
    { name: 'buckingham-vault-store' }
  )
)

// Export convenience hooks
export const useTheme = () => useBuckinghamStore((state: any) => ({ ...state.theme, actions: state.actions.theme }))
export const useNavigation = () => useBuckinghamStore((state: any) => ({ ...state.navigation, actions: state.actions.navigation }))
export const useFilters = () => useBuckinghamStore((state: any) => ({ filters: state.filters, actions: state.actions.filters }))
export const useNotifications = () => useBuckinghamStore((state: any) => ({ ...state.notifications, actions: state.actions.notifications }))
export const useModals = () => useBuckinghamStore((state: any) => ({ ...state.modals, actions: state.actions.modals }))
export const useCache = () => useBuckinghamStore((state: any) => ({ ...state.cache, actions: state.actions.cache }))
export const useRealTime = () => useBuckinghamStore((state: any) => ({ ...state.realTime, actions: state.actions.realTime }))
export const useForms = () => useBuckinghamStore((state: any) => ({ ...state.forms, actions: state.actions.forms }))
export const useSecurity = () => useBuckinghamStore((state: any) => ({ ...state.security, actions: state.actions.security }))
export const usePerformance = () => useBuckinghamStore((state: any) => ({ ...state.performance, actions: state.actions.performance }))

// Initialize store function for providers
export const initializeStore = () => {
  return useBuckinghamStore
}

// Export types
export type { BuckinghamVaultState } from './types'