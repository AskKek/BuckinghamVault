export const dynamic = 'force-dynamic'

import { ProviderStack } from '@/components/Core'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProviderStack variant="auth" enableAnalytics={true} enableStore={true}>
      {children}
    </ProviderStack>
  )
}