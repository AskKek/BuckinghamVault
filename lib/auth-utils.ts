import { User, UserRole } from '@/types/financial'

export function hasRole(user: User | null, role: UserRole): boolean {
  return user?.role === role
}

export function hasAnyRole(user: User | null, roles: UserRole[]): boolean {
  return roles.includes(user?.role as UserRole)
}

export function canAccessResource(user: User | null, resource: string, action: string = 'read'): boolean {
  if (!user || !user.isActive) return false
  
  // Admin can access everything
  if (user.role === 'admin') return true
  
  // Check specific permissions
  return user.permissions.some(permission => {
    const actionMatch = permission.action === '*' || permission.action === action
    const resourceMatch = permission.resource === '*' || permission.resource === resource
    
    // Check conditions if they exist
    if (permission.conditions && actionMatch && resourceMatch) {
      // For now, simple condition checking
      if (permission.conditions.mandateId && user.mandateId !== permission.conditions.mandateId) {
        return false
      }
    }
    
    return actionMatch && resourceMatch
  })
}

export function getMandateAccess(user: User | null): string[] {
  if (!user) return []
  
  // Admin can access all mandates
  if (user.role === 'admin') return ['*']
  
  // Return user's mandate
  return user.mandateId ? [user.mandateId] : []
}

export function canEditDeal(user: User | null, dealMandateId: string): boolean {
  if (!user) return false
  
  // Admin can edit all deals
  if (user.role === 'admin') return true
  
  // User can edit deals from their mandate
  return user.mandateId === dealMandateId && canAccessResource(user, 'deals', 'update')
}

export function canViewDeal(user: User | null, dealMandateId: string): boolean {
  if (!user) return false
  
  // Admin can view all deals
  if (user.role === 'admin') return true
  
  // Check if user can view all deals or just their mandate's deals
  if (canAccessResource(user, 'all_deals', 'read')) return true
  
  // User can view deals from their mandate
  return user.mandateId === dealMandateId && canAccessResource(user, 'deals', 'read')
}

export function getDisplayName(user: User | null): string {
  if (!user) return 'Guest'
  return user.name
}

export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case 'admin':
      return 'Administrator'
    case 'mandate_member':
      return 'Mandate Member'
    case 'viewer':
      return 'Viewer'
    case 'ai_analyst':
      return 'AI Analyst'
    default:
      return 'Unknown'
  }
}