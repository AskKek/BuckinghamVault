export const dynamic = 'force-dynamic'

import { AppShell, RouteGuard } from '@/components/Core'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RouteGuard 
      requiredRoles={['admin', 'client']}
      showUnauthorized={true}
    >
      <AppShell variant="client">
        {children}
      </AppShell>
    </RouteGuard>
  )
}