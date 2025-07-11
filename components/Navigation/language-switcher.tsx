'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe, Check } from 'lucide-react'
import { getAvailableLocales, type Locale } from '@/lib/i18n'
import { i18nConfig } from '@/i18n.config'

interface LanguageSwitcherProps {
  currentLocale: Locale
  className?: string
}

export function LanguageSwitcher({ currentLocale, className = '' }: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  
  const availableLocales = getAvailableLocales()
  const currentLocaleConfig = i18nConfig.localeConfigs[currentLocale]

  const switchLanguage = (newLocale: Locale) => {
    if (newLocale === currentLocale) return

    // Remove current locale from pathname and add new locale
    const segments = pathname.split('/')
    if (i18nConfig.locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale
    } else {
      segments.splice(1, 0, newLocale)
    }
    
    const newPath = segments.join('/')
    
    // Set locale cookie
    document.cookie = `${i18nConfig.detection.cookieName}=${newLocale}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`
    
    router.push(newPath)
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`border-gold/30 text-gold hover:bg-gold/10 ${className}`}
          aria-label={`Current language: ${currentLocaleConfig.name}. Click to change language.`}
        >
          <Globe className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline mr-2">{currentLocaleConfig.name}</span>
          <span className="sm:hidden mr-2">{currentLocaleConfig.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-navy border-gold/20"
        sideOffset={5}
      >
        {availableLocales.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => switchLanguage(locale.code)}
            className="flex items-center justify-between px-3 py-2 text-white hover:bg-gold/10 cursor-pointer"
            disabled={locale.code === currentLocale}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{locale.flag}</span>
              <span className="font-medium">{locale.name}</span>
            </div>
            
            {locale.code === currentLocale && (
              <Check className="w-4 h-4 text-gold" />
            )}
          </DropdownMenuItem>
        ))}
        
        {/* Language detection info */}
        <div className="border-t border-gold/20 mt-2 pt-2 px-3">
          <p className="text-xs text-gray-400">
            Language will be remembered for future visits
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Hook to get current locale from URL
export function useCurrentLocale(): Locale {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const localeFromPath = segments[1]
  
  if (i18nConfig.locales.includes(localeFromPath as Locale)) {
    return localeFromPath as Locale
  }
  
  return i18nConfig.defaultLocale
}

// RTL support component
export function DirectionProvider({ 
  locale, 
  children 
}: { 
  locale: Locale
  children: React.ReactNode 
}) {
  const direction = i18nConfig.localeConfigs[locale].direction
  
  return (
    <div dir={direction} className={direction === 'rtl' ? 'rtl' : 'ltr'}>
      {children}
    </div>
  )
}

// Locale-aware link component
export function LocaleLink({
  href,
  locale,
  children,
  ...props
}: {
  href: string
  locale?: Locale
  children: React.ReactNode
  [key: string]: any
}) {
  const currentLocale = useCurrentLocale()
  const targetLocale = locale || currentLocale
  
  // Construct locale-prefixed URL
  const localizedHref = href.startsWith('/') 
    ? `/${targetLocale}${href}`
    : href
  
  return (
    <a href={localizedHref} {...props}>
      {children}
    </a>
  )
}