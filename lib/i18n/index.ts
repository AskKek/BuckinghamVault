import { i18nConfig, type Locale } from '@/i18n.config'

// Re-export Locale type for components
export type { Locale }

// Translation dictionary type
export type TranslationDictionary = Record<string, string | Record<string, string>>

// Translation key type with dot notation support
export type TranslationKey = string

// Namespaced translations
export interface NamespacedTranslations {
  [namespace: string]: TranslationDictionary
}

// Translation context
export interface TranslationContext {
  locale: Locale
  defaultLocale: Locale
  direction: 'ltr' | 'rtl'
  currency: string
  dateFormat: string
}

// Load translations for a specific locale and namespace
export async function loadTranslations(
  locale: Locale, 
  namespace: string = 'common'
): Promise<TranslationDictionary> {
  try {
    const translations = await import(`@/locales/${locale}/${namespace}.json`)
    return translations.default || {}
  } catch (error) {
    console.warn(`Failed to load translations for ${locale}/${namespace}:`, error)
    
    // Fallback to default locale
    if (locale !== i18nConfig.defaultLocale) {
      try {
        const fallbackTranslations = await import(`@/locales/${i18nConfig.defaultLocale}/${namespace}.json`)
        return fallbackTranslations.default || {}
      } catch (fallbackError) {
        console.error(`Failed to load fallback translations for ${i18nConfig.defaultLocale}/${namespace}:`, fallbackError)
      }
    }
    
    return {}
  }
}

// Get nested value from object using dot notation
function getNestedValue(obj: any, path: string): string | undefined {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

// Translation function
export function createTranslator(
  translations: NamespacedTranslations,
  context: TranslationContext
) {
  return function t(key: TranslationKey, params?: Record<string, string | number>): string {
    // Extract namespace and key
    const [namespace, ...keyParts] = key.includes(':') ? key.split(':') : ['common', key]
    const translationKey = keyParts.join(':')
    
    // Get translation from appropriate namespace
    const namespaceTranslations = translations[namespace] || {}
    let translation = getNestedValue(namespaceTranslations, translationKey)
    
    // Fallback to key if translation not found
    if (!translation) {
      console.warn(`Missing translation for key: ${key} (locale: ${context.locale})`)
      translation = translationKey
    }

    // Replace parameters
    if (params && typeof translation === 'string') {
      return Object.entries(params).reduce(
        (result, [param, value]) => result.replace(new RegExp(`{{${param}}}`, 'g'), String(value)),
        translation
      )
    }

    return typeof translation === 'string' ? translation : translationKey
  }
}

// Format number according to locale
export function formatNumber(
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions
): string {
  const localeConfig = i18nConfig.localeConfigs[locale]
  
  return new Intl.NumberFormat(locale, {
    currency: localeConfig.currency,
    ...options,
  }).format(value)
}

// Format currency according to locale
export function formatCurrency(
  value: number,
  locale: Locale,
  currency?: string
): string {
  const localeConfig = i18nConfig.localeConfigs[locale]
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency || localeConfig.currency,
  }).format(value)
}

// Format date according to locale
export function formatDate(
  date: Date | string | number,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    ...options,
  }).format(dateObj)
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(
  date: Date | string | number,
  locale: Locale
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
  
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2628000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ] as const
  
  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds)
    if (count !== 0) {
      return rtf.format(-count, interval.label)
    }
  }
  
  return rtf.format(0, 'second')
}

// Get locale direction
export function getLocaleDirection(locale: Locale): 'ltr' | 'rtl' {
  return i18nConfig.localeConfigs[locale].direction
}

// Get available locales with their display names
export function getAvailableLocales() {
  return i18nConfig.locales.map(locale => ({
    code: locale,
    name: i18nConfig.localeConfigs[locale].name,
    flag: i18nConfig.localeConfigs[locale].flag,
    direction: i18nConfig.localeConfigs[locale].direction,
  }))
}

// Validate locale
export function isValidLocale(locale: string): locale is Locale {
  return i18nConfig.locales.includes(locale as Locale)
}

// Get browser locale
export function getBrowserLocale(): Locale {
  if (typeof window === 'undefined') return i18nConfig.defaultLocale
  
  const browserLang = navigator.language.toLowerCase()
  
  // Try exact match first
  const exactMatch = i18nConfig.locales.find(locale => locale.toLowerCase() === browserLang)
  if (exactMatch) return exactMatch
  
  // Try language code match
  const langCode = browserLang.split('-')[0]
  const langMatch = i18nConfig.locales.find(locale => locale.toLowerCase() === langCode)
  if (langMatch) return langMatch
  
  return i18nConfig.defaultLocale
}