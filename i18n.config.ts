export const i18nConfig = {
  defaultLocale: 'en',
  locales: ['en', 'de', 'fr', 'zh', 'ja', 'ar'] as const,
  
  // Locale-specific configurations
  localeConfigs: {
    en: {
      name: 'English',
      flag: '🇺🇸',
      direction: 'ltr',
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
    },
    de: {
      name: 'Deutsch',
      flag: '🇩🇪',
      direction: 'ltr',
      currency: 'EUR',
      dateFormat: 'DD.MM.YYYY',
    },
    fr: {
      name: 'Français',
      flag: '🇫🇷',
      direction: 'ltr',
      currency: 'EUR',
      dateFormat: 'DD/MM/YYYY',
    },
    zh: {
      name: '中文',
      flag: '🇨🇳',
      direction: 'ltr',
      currency: 'CNY',
      dateFormat: 'YYYY/MM/DD',
    },
    ja: {
      name: '日本語',
      flag: '🇯🇵',
      direction: 'ltr',
      currency: 'JPY',
      dateFormat: 'YYYY/MM/DD',
    },
    ar: {
      name: 'العربية',
      flag: '🇸🇦',
      direction: 'rtl',
      currency: 'SAR',
      dateFormat: 'DD/MM/YYYY',
    },
  },
  
  // Namespace configuration for different sections
  namespaces: ['common', 'navigation', 'hero', 'services', 'contact', 'analytics'],
  
  // Fallback strategy
  fallbackLng: 'en',
  
  // Detection settings
  detection: {
    order: ['path', 'cookie', 'header'],
    caches: ['cookie'],
    cookieName: 'buckingham-vault-locale',
    cookieOptions: {
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
} as const

export type Locale = typeof i18nConfig.locales[number]