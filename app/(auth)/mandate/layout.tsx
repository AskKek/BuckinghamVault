export const dynamic = 'force-dynamic'

import { AppShell, RouteGuard } from '@/components/Core'

export default function MandateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RouteGuard 
      requiredRoles={['admin', 'mandate_member']}
      showUnauthorized={true}
    >
      <AppShell variant="mandate">
        {children}
      </AppShell>
    </RouteGuard>
  )
}