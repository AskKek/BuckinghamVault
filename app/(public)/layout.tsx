import { AppShell } from '@/components/Core'
import { ProviderStack } from '@/components/Core'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProviderStack variant="public" enableAnalytics={true} enableStore={false}>
      <AppShell variant="public">
        {children}
      </AppShell>
    </ProviderStack>
  )
}