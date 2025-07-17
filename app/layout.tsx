import type React from "react"
import type { Metadata } from "next"
import { Poppins, Lato, Playfair_Display } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { organizationSchema, websiteSchema } from "@/lib/structured-data"
import { ProviderStack } from "@/components/Core"
import { CriticalResourcePreloader } from "@/components/Core/ImagePreloader"

// Font configuration - Premium typography for institutional clients
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"], // Bold for headlines
  variable: "--font-poppins",
  display: "swap",
})

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400"], // Light and Regular for body text
  variable: "--font-lato",
  display: "swap",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"], // Elegant serif for luxury touch
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL('https://buckinghamvault.com'),
  title: {
    template: '%s | The Buckingham Vault',
    default: 'The Buckingham Vault | Private Digital Asset Wealth Management'
  },
  description: "The world's first private digital asset vault combining institutional-grade security with Swiss private banking excellence. Serving family offices, institutions, and sovereign wealth funds.",
  keywords: [
    'private wealth management',
    'digital assets',
    'institutional banking',
    'family office services',
    'sovereign wealth',
    'cryptocurrency custody',
    'digital asset security',
    'private banking',
    'wealth preservation',
    'asset management'
  ],
  authors: [{ name: 'The Buckingham Vault' }],
  creator: 'The Buckingham Vault',
  publisher: 'The Buckingham Vault',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://buckinghamvault.com',
    title: 'The Buckingham Vault | Private Digital Asset Wealth Management',
    description: 'Where Digital Sovereignty Meets Private Wealth Excellence',
    siteName: 'The Buckingham Vault',
    images: [{
      url: '/images/home-page-vault.png',
      width: 1200,
      height: 630,
      alt: 'The Buckingham Vault - Luxury Digital Asset Management',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Buckingham Vault',
    description: 'Private Digital Asset Wealth Management',
    creator: '@buckinghamvault',
    images: ['/images/home-page-vault.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  generator: 'Next.js'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={cn(
        "min-h-screen antialiased bg-gradient-to-br from-navy via-navy-light to-navy",
        poppins.variable, 
        lato.variable, 
        playfairDisplay.variable
      )}>
        <CriticalResourcePreloader />
        <ProviderStack variant="root" enableAnalytics={false} enableStore={false}>
          {children}
        </ProviderStack>
      </body>
    </html>
  )
}