# The Buckingham Vault - System Patterns

## Overall Architecture Overview

The Buckingham Vault is built on a modern, scalable architecture that leverages Next.js 15's App Router for a seamless, high-performance user experience. The system follows a layered architecture pattern that separates concerns while maintaining flexibility and maintainability.

### Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│         (React Components, UI/UX, Interactions)         │
├─────────────────────────────────────────────────────────┤
│                    Application Layer                     │
│          (Business Logic, State Management)             │
├─────────────────────────────────────────────────────────┤
│                     Service Layer                        │
│           (API Routes, External Services)               │
├─────────────────────────────────────────────────────────┤
│                      Data Layer                          │
│        (Database, Cache, External Data Sources)         │
└─────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

1. **Next.js App Router**: Leverages React Server Components for optimal performance
2. **Component-Based Architecture**: Modular, reusable components with clear boundaries
3. **State Management**: Zustand for global state, React hooks for local state
4. **API Design**: RESTful API routes with clear naming conventions
5. **Security-First**: Authentication and authorization at every layer
6. **Performance-Optimized**: Lazy loading, code splitting, and caching strategies

## Component Architecture Patterns

### Component Organization Structure

```
components/
├── Core/                    # Core system components
│   ├── AppShell.tsx        # Main application wrapper
│   ├── ProviderStack.tsx   # Provider composition
│   ├── RouteGuard.tsx      # Route protection
│   └── DataProvider.tsx    # Data management
├── ui/                      # Base UI primitives
│   ├── button.tsx          # Atomic components
│   ├── card.tsx
│   └── [30+ components]
├── [Feature]/              # Feature-specific components
│   ├── Analytics/          # Analytics features
│   ├── Authentication/     # Auth components
│   ├── Home/              # Landing page components
│   └── Mandate-Portal/    # Internal tools
└── shared/                 # Shared utilities
    ├── AnimatedCard.tsx
    ├── FeatureCard.tsx
    └── SectionWrapper.tsx
```

### Component Design Patterns

#### 1. Compound Component Pattern
Used for complex components with multiple parts that work together:

```typescript
// Example: Card component with compound parts
export function Card({ children, className }: CardProps) {
  return <div className={cn("card-base", className)}>{children}</div>
}

Card.Header = function CardHeader({ children }: CardHeaderProps) {
  return <div className="card-header">{children}</div>
}

Card.Content = function CardContent({ children }: CardContentProps) {
  return <div className="card-content">{children}</div>
}

// Usage:
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Content>Content</Card.Content>
</Card>
```

#### 2. Provider Pattern
Centralized context providers for cross-cutting concerns:

```typescript
// ProviderStack.tsx implementation
export function ProviderStack({ children, variant }: ProviderStackProps) {
  // Compose providers based on route requirements
  if (variant === 'auth') {
    return (
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            <StoreProvider>
              {children}
            </StoreProvider>
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    )
  }
  // Minimal providers for public routes
  return (
    <ThemeProvider>
      <DataProvider>
        {children}
      </DataProvider>
    </ThemeProvider>
  )
}
```

#### 3. Render Props Pattern
For flexible component composition:

```typescript
// Example: DataTable with custom renderers
<DataTable
  data={deals}
  columns={[
    {
      header: 'Status',
      cell: ({ row }) => <DealStatusBadge status={row.status} />
    }
  ]}
/>
```

### Component Best Practices

1. **Single Responsibility**: Each component has one clear purpose
2. **Props Interface**: Always define TypeScript interfaces for props
3. **Default Props**: Use defaultProps or default parameters
4. **Memoization**: Use React.memo for expensive components
5. **Error Boundaries**: Wrap features in error boundaries
6. **Accessibility**: ARIA labels and keyboard navigation

## Data Flow Patterns

### Unidirectional Data Flow

The application follows a strict unidirectional data flow pattern:

```
User Action → State Update → UI Re-render → Side Effects
     ↑                                           ↓
     └───────────── API Response ←───────────────┘
```

### State Management Hierarchy

1. **Component State**: Local state for UI-only concerns
   ```typescript
   const [isOpen, setIsOpen] = useState(false)
   ```

2. **Global State**: Zustand for app-wide state
   ```typescript
   const { user, filters, theme } = useStore()
   ```

3. **Server State**: TanStack Query for API data
   ```typescript
   const { data, isLoading } = useQuery({
     queryKey: ['deals'],
     queryFn: fetchDeals
   })
   ```

4. **URL State**: Query parameters for shareable state
   ```typescript
   const searchParams = useSearchParams()
   const filters = parseFiltersFromURL(searchParams)
   ```

### Data Flow Examples

#### OTC Trade Flow
```typescript
// 1. User initiates trade
const inititateTrade = async (tradeParams: TradeParams) => {
  // 2. Update optimistic UI state
  setTradeStatus('pending')
  
  // 3. Call API
  const result = await api.trades.create(tradeParams)
  
  // 4. Update global state
  store.addTrade(result)
  
  // 5. Trigger side effects
  analytics.track('trade_created', result)
  notifications.success('Trade initiated successfully')
}
```

## State Management Strategy

### Zustand Store Architecture

The application uses a modular Zustand store with slices for different domains:

```typescript
// Store structure
store/
├── index.ts              # Main store composition
├── types.ts             # TypeScript types
└── slices/
    ├── auth-slice.ts    # Authentication state
    ├── deals-slice.ts   # Deals management
    ├── filters-slice.ts # Filter state
    └── ui-slice.ts      # UI preferences
```

### Store Patterns

#### 1. Slice Pattern
Each slice manages a specific domain:

```typescript
// Example: Auth slice
export const createAuthSlice = (set, get) => ({
  user: null,
  isAuthenticated: false,
  
  login: async (credentials) => {
    const user = await api.auth.login(credentials)
    set({ user, isAuthenticated: true })
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false })
    api.auth.logout()
  }
})
```

#### 2. Computed Values
Derive values from state:

```typescript
// Selectors for computed values
export const useFilteredDeals = () => {
  const deals = useStore(state => state.deals)
  const filters = useStore(state => state.filters)
  
  return useMemo(() => {
    return applyFilters(deals, filters)
  }, [deals, filters])
}
```

#### 3. Persistence
Selective state persistence:

```typescript
// Persist user preferences
export const persistConfig = {
  name: 'buckingham-vault-store',
  partialize: (state) => ({
    theme: state.theme,
    preferences: state.preferences
  })
}
```

## Routing and Navigation Patterns

### App Router Structure

```
app/
├── (public)/           # Public routes group
│   ├── layout.tsx     # Minimal layout
│   ├── page.tsx       # Landing page
│   └── contact/
├── (auth)/            # Authenticated routes
│   ├── layout.tsx     # Auth wrapper
│   ├── vault/         # Internal dashboard
│   └── client/        # Client portal
└── api/               # API routes
    ├── auth/
    ├── deals/
    └── analytics/
```

### Route Protection Patterns

#### 1. Layout-Based Protection
```typescript
// app/(auth)/layout.tsx
export default function AuthLayout({ children }) {
  return (
    <ProviderStack variant="auth">
      <RouteGuard>
        <AppShell variant="authenticated">
          {children}
        </AppShell>
      </RouteGuard>
    </ProviderStack>
  )
}
```

#### 2. Middleware Protection
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')
  
  if (!token && request.nextUrl.pathname.startsWith('/vault')) {
    return NextResponse.redirect('/login')
  }
}
```

### Navigation Patterns

1. **Programmatic Navigation**
   ```typescript
   const router = useRouter()
   router.push('/vault/deals')
   ```

2. **Conditional Routing**
   ```typescript
   const handleAccess = () => {
     if (user.role === 'mandate') {
       router.push('/vault')
     } else {
       router.push('/client')
     }
   }
   ```

## Authentication and Security Patterns

### Authentication Architecture

The platform implements a dual-portal authentication system:

1. **Mandate Members**: Internal team access to full platform
2. **Client Services**: Limited access to client-specific features

### Security Implementation Patterns

#### 1. Token Management
```typescript
// Secure token handling
const tokenManager = {
  setTokens: (access: string, refresh: string) => {
    // HttpOnly cookies for security
    document.cookie = `access-token=${access}; Secure; SameSite=Strict`
    document.cookie = `refresh-token=${refresh}; Secure; SameSite=Strict`
  },
  
  clearTokens: () => {
    document.cookie = 'access-token=; Max-Age=0'
    document.cookie = 'refresh-token=; Max-Age=0'
  }
}
```

#### 2. CSRF Protection
```typescript
// CSRF token validation
export async function validateCSRF(request: Request) {
  const token = request.headers.get('X-CSRF-Token')
  const sessionToken = await getSessionCSRF(request)
  
  if (token !== sessionToken) {
    throw new Error('Invalid CSRF token')
  }
}
```

#### 3. Role-Based Access Control (RBAC)
```typescript
// Component-level access control
export function RequireRole({ role, children }: RequireRoleProps) {
  const user = useAuth()
  
  if (!user || !user.roles.includes(role)) {
    return <AccessDenied />
  }
  
  return children
}
```

## UI/UX Design Patterns

### Visual Design System

The platform implements a luxury aesthetic with consistent patterns:

#### 1. Glass Morphism
```typescript
// Consistent glass morphism classes
export const glassStyles = {
  light: "bg-white/10 backdrop-blur-md border border-white/20",
  dark: "bg-navy/30 backdrop-blur-lg border border-gold/20",
  gold: "bg-gradient-to-br from-gold/20 to-gold/10 backdrop-blur-xl"
}
```

#### 2. Animation Patterns
```typescript
// Framer Motion variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}
```

#### 3. Responsive Patterns
```typescript
// Mobile-first responsive design
export const responsiveGrid = {
  base: "grid grid-cols-1 gap-4",
  md: "md:grid-cols-2 md:gap-6",
  lg: "lg:grid-cols-3 lg:gap-8",
  xl: "xl:grid-cols-4"
}
```

### Interaction Patterns

1. **Optimistic Updates**
   ```typescript
   const updateDeal = async (dealId: string, updates: DealUpdate) => {
     // Optimistic update
     store.updateDeal(dealId, updates)
     
     try {
       await api.deals.update(dealId, updates)
     } catch (error) {
       // Rollback on failure
       store.rollbackDeal(dealId)
       toast.error('Update failed')
     }
   }
   ```

2. **Loading States**
   ```typescript
   // Skeleton loading pattern
   if (isLoading) {
     return <DealListSkeleton />
   }
   ```

3. **Error States**
   ```typescript
   // Consistent error handling
   if (error) {
     return <ErrorState 
       message="Failed to load deals"
       retry={() => refetch()}
     />
   }
   ```

## Performance Optimization Patterns

### Code Splitting Strategies

1. **Route-Based Splitting**
   ```typescript
   // Automatic with App Router
   app/vault/analytics/page.tsx // Separate bundle
   ```

2. **Component Lazy Loading**
   ```typescript
   const HeavyChart = dynamic(() => import('./HeavyChart'), {
     loading: () => <ChartSkeleton />,
     ssr: false
   })
   ```

### Caching Patterns

1. **Static Generation**
   ```typescript
   // Pre-render marketing pages
   export const revalidate = 3600 // 1 hour
   ```

2. **Data Caching**
   ```typescript
   // React Query caching
   queryClient.setDefaultOptions({
     queries: {
       staleTime: 5 * 60 * 1000, // 5 minutes
       cacheTime: 10 * 60 * 1000, // 10 minutes
     }
   })
   ```

### Performance Monitoring

```typescript
// Web Vitals tracking
export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (metric.label === 'web-vital') {
    analytics.track('web_vital', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating
    })
  }
}
```

## Error Handling Strategies

### Error Boundary Pattern

```typescript
// Global error boundary
export class AppErrorBoundary extends Component<Props, State> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error tracking service
    errorTracker.captureException(error, {
      extra: errorInfo
    })
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={this.resetError} />
    }
    
    return this.props.children
  }
}
```

### API Error Handling

```typescript
// Centralized API error handler
export class APIError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message)
  }
}

export const handleAPIError = (error: APIError) => {
  switch (error.status) {
    case 401:
      store.logout()
      router.push('/login')
      break
    case 403:
      toast.error('Insufficient permissions')
      break
    case 429:
      toast.error('Too many requests, please slow down')
      break
    default:
      toast.error(error.message)
  }
}
```

## Testing Patterns

### Component Testing Strategy

```typescript
// Component test pattern
describe('DealCard', () => {
  it('renders deal information correctly', () => {
    const deal = mockDeal()
    const { getByText } = render(<DealCard deal={deal} />)
    
    expect(getByText(deal.id)).toBeInTheDocument()
    expect(getByText(deal.status)).toBeInTheDocument()
  })
  
  it('handles click events', async () => {
    const handleClick = jest.fn()
    const { getByRole } = render(
      <DealCard deal={mockDeal()} onClick={handleClick} />
    )
    
    await userEvent.click(getByRole('button'))
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
```

### Integration Testing

```typescript
// API route testing
describe('/api/deals', () => {
  it('returns filtered deals', async () => {
    const response = await request(app)
      .get('/api/deals')
      .query({ status: 'active' })
      .set('Authorization', `Bearer ${token}`)
    
    expect(response.status).toBe(200)
    expect(response.body.deals).toHaveLength(5)
  })
})
```

## Dependency Management

### Package Organization

```json
{
  "dependencies": {
    // Core framework
    "next": "15.2.4",
    "react": "^19",
    
    // UI components
    "@radix-ui/react-*": "latest",
    "framer-motion": "latest",
    
    // State management
    "zustand": "^5.0.6",
    "immer": "^10.1.1",
    
    // Utilities
    "clsx": "^2.1.1",
    "date-fns": "4.1.0"
  },
  "devDependencies": {
    // Type safety
    "typescript": "^5",
    "@types/react": "^19",
    
    // Testing
    "jest": "^30.0.0",
    "@testing-library/react": "^16.3.0"
  }
}
```

### Dependency Patterns

1. **Minimize Dependencies**: Only add what's truly needed
2. **Version Pinning**: Pin critical dependencies
3. **Regular Updates**: Monthly dependency review
4. **Security Scanning**: Automated vulnerability checks

## Code Organization Principles

### File Naming Conventions

```
components/
├── PascalCase.tsx       # Components
├── use-kebab-case.ts    # Hooks
├── kebab-case.ts        # Utilities
└── CONSTANTS.ts         # Constants
```

### Import Organization

```typescript
// 1. External imports
import React from 'react'
import { useRouter } from 'next/navigation'

// 2. Internal absolute imports
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

// 3. Relative imports
import { localHelper } from './helpers'
import type { LocalType } from './types'

// 4. Style imports
import styles from './component.module.css'
```

### Code Style Guidelines

1. **Functional Components**: Prefer function declarations
2. **TypeScript**: Strict mode, explicit types
3. **Hooks**: Custom hooks prefixed with 'use'
4. **Comments**: JSDoc for public APIs
5. **No Magic Numbers**: Use named constants

## Conclusion

These system patterns form the foundation of The Buckingham Vault's technical architecture. By following these established patterns, the codebase maintains consistency, scalability, and maintainability. Each pattern has been carefully chosen to support the platform's goals of providing institutional-grade digital asset management with a luxury user experience.

The patterns documented here should be treated as living guidelines that evolve with the platform's needs while maintaining backward compatibility and system integrity.