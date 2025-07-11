export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  name: 'The Buckingham Vault',
  url: 'https://buckinghamvault.com',
  logo: 'https://buckinghamvault.com/logo.png',
  description: 'Private digital asset wealth management for institutions, family offices, and sovereign wealth funds',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'CH',
    addressLocality: 'Zurich',
  },
  areaServed: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: 47.3769,
      longitude: 8.5417,
    },
    geoRadius: '50000',
  },
  priceRange: '$$$$',
  telephone: '+41-XX-XXX-XXXX',
  email: 'contact@buckinghamvault.com',
  sameAs: [
    'https://twitter.com/buckinghamvault',
    'https://linkedin.com/company/buckinghamvault',
    'https://www.facebook.com/buckinghamvault',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Digital Asset Management Services',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Private Digital Asset Custody',
        description: 'Institutional-grade custody solutions for digital assets',
      },
      {
        '@type': 'Offer',
        name: 'Wealth Management Services',
        description: 'Comprehensive wealth management for high-net-worth individuals',
      },
      {
        '@type': 'Offer',
        name: 'Family Office Solutions',
        description: 'Tailored solutions for family offices and foundations',
      },
    ],
  },
}

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'The Buckingham Vault',
  url: 'https://buckinghamvault.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://buckinghamvault.com/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
})