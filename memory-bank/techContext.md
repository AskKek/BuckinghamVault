# The Buckingham Vault - Technical Context

## Technology Stack Deep Dive

### Core Framework: Next.js 15

The Buckingham Vault is built on Next.js 15, leveraging its cutting-edge features for optimal performance and developer experience.

**Key Features Utilized:**
- **App Router**: File-based routing with React Server Components
- **Server Components**: Reduced JavaScript bundle size, improved SEO
- **Streaming**: Progressive page rendering for faster perceived performance
- **Parallel Routes**: Complex layouts with independent loading states
- **Route Groups**: Organized routing structure with layout inheritance

**Configuration Highlights:**
```javascript
// next.config.mjs
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  }
}
```

### Frontend Technologies

#### React 19
- **Concurrent Features**: Automatic batching, transitions, suspense
- **Server Components**: Hybrid rendering for optimal performance
- **Hooks Architecture**: Custom hooks for business logic encapsulation

#### TypeScript 5
- **Strict Mode**: Full type safety across the application
- **Path Aliases**: Clean imports with @/ prefix
- **Type Generation**: Automatic types for API responses

#### Tailwind CSS 3
- **Custom Theme**: Navy/gold color palette with semantic naming
- **Component Classes**: Reusable utility patterns
- **JIT Mode**: On-demand CSS generation
- **Custom Plugins**: tailwindcss-animate for smooth transitions

### UI Component Libraries

#### Radix UI
Complete suite of unstyled, accessible components:
- **Dialog/Modal**: Accessible overlay management
- **Dropdown**: Complex menu interactions
- **Form Controls**: Checkbox, radio, select with full a11y
- **Navigation**: Accessible nav menus with keyboard support

#### Shadcn/ui
Pre-styled component library built on Radix:
- **Consistent Theming**: Dark mode by default
- **Customizable**: Full control over styles
- **TypeScript**: Complete type definitions
- **Copy-Paste**: No dependency bloat

#### Framer Motion
Advanced animation library:
- **Layout Animations**: Smooth transitions between states
- **Gesture Support**: Drag, pan, hover interactions
- **Performance**: GPU-accelerated animations
- **Variants**: Reusable animation configurations

### State Management

#### Zustand 5
Lightweight state management solution:
```typescript
// Store architecture
const useStore = create<StoreState>((set, get) => ({
  // Auth state
  user: null,
  isAuthenticated: false,
  
  // Filter state with persistence
  filters: {
    deals: { status: [], type: [], dateRange: null },
    knowledge: { category: [], tags: [] },
    exchange: { assetType: [], forensicRating: [] }
  },
  
  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  updateFilters: (module, filters) => set(state => ({
    filters: { ...state.filters, [module]: filters }
  }))
}))
```

#### TanStack Query
Server state management:
- **Caching**: Intelligent cache invalidation
- **Background Refetch**: Keep data fresh
- **Optimistic Updates**: Instant UI feedback
- **Offline Support**: Queue mutations when offline

### Form Management

#### React Hook Form
Advanced form handling:
```typescript
// Example configuration
const form = useForm<DealFormData>({
  resolver: zodResolver(dealSchema),
  defaultValues: {
    dealType: 'buy',
    amount: 0,
    forensicRating: 'unrated'
  }
})
```

#### Zod Validation
Type-safe schema validation:
```typescript
const dealSchema = z.object({
  dealType: z.enum(['buy', 'sell']),
  amount: z.number().min(1000000),
  assetType: z.enum(['BTC', 'ETH', 'USDT']),
  forensicRating: z.enum(['AAA', 'AA', 'A', 'BBB', 'unrated'])
})
```

## Framework Choices and Rationale

### Why Next.js 15?

1. **Performance First**
   - Server-side rendering for SEO and initial load
   - Static generation for marketing pages
   - Incremental static regeneration for dynamic content

2. **Developer Experience**
   - File-based routing reduces boilerplate
   - Built-in optimizations (image, font, script)
   - Hot module replacement for rapid development

3. **Production Ready**
   - Built-in security headers
   - Automatic code splitting
   - Edge runtime support for global performance

### Why TypeScript?

1. **Type Safety**
   - Catch errors at compile time
   - Better IDE support and autocomplete
   - Self-documenting code

2. **Maintainability**
   - Easier refactoring with confidence
   - Clear contracts between components
   - Reduced runtime errors

3. **Team Collaboration**
   - Shared understanding of data structures
   - Less ambiguity in function signatures
   - Better onboarding for new developers

### Why Zustand over Redux?

1. **Simplicity**
   - Less boilerplate code
   - No action creators or reducers
   - Direct state mutations with Immer

2. **Performance**
   - Smaller bundle size (2.9kb vs 10kb)
   - No React context overhead
   - Selective subscriptions prevent unnecessary renders

3. **Developer Experience**
   - Intuitive API
   - TypeScript support out of the box
   - Easy async actions

## Development Environment Setup

### Prerequisites

```bash
# Required versions
Node.js: >=18.17.0
npm: >=9.0.0 (pnpm preferred)
Git: >=2.30.0
```

### Initial Setup

```bash
# Clone repository
git clone https://github.com/buckingham-vault/platform.git
cd platform

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
pnpm dev
```

### Environment Variables

```bash
# .env.local
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Authentication
JWT_SECRET=your-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret
SESSION_SECRET=your-session-secret

# External Services
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
RESEND_API_KEY=re_XXXXXXXXXX
CHAINALYSIS_API_KEY=ca_XXXXXXXXXX

# Database (Future)
DATABASE_URL=postgresql://user:pass@localhost:5432/buckingham

# Security
CSRF_SECRET=your-csrf-secret
ENCRYPTION_KEY=your-encryption-key
```

### VS Code Configuration

```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### Recommended Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Error Lens
- GitLens
- Thunder Client (API testing)

## Build and Deployment Pipeline

### Build Process

```bash
# Production build
pnpm build

# Build output
.next/
├── cache/          # Build cache
├── server/         # Server-side code
├── static/         # Static assets
└── BUILD_ID        # Unique build identifier
```

### Build Optimizations

1. **Tree Shaking**: Remove unused code
2. **Minification**: Compress JavaScript and CSS
3. **Code Splitting**: Separate bundles per route
4. **Image Optimization**: Next.js Image component
5. **Font Optimization**: Automatic font loading

### Deployment Strategy

#### Vercel (Recommended)
```bash
# Install Vercel CLI
pnpm i -g vercel

# Deploy
vercel --prod
```

**Benefits:**
- Zero-config deployment
- Automatic SSL
- Global CDN
- Preview deployments
- Analytics included

#### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
      
      - uses: vercel/action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Performance Monitoring Setup

### Core Web Vitals Tracking

```typescript
// lib/analytics/web-vitals.ts
export function reportWebVitals() {
  if (typeof window !== 'undefined') {
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      onCLS(sendToAnalytics)
      onFID(sendToAnalytics)
      onFCP(sendToAnalytics)
      onLCP(sendToAnalytics)
      onTTFB(sendToAnalytics)
    })
  }
}

function sendToAnalytics(metric: Metric) {
  // Send to Google Analytics
  gtag('event', metric.name, {
    value: Math.round(metric.value),
    metric_rating: metric.rating,
    metric_delta: metric.delta
  })
}
```

### Performance Budgets

```javascript
// performance.config.js
module.exports = {
  budgets: [
    {
      resourceSizes: [
        { resourceType: 'script', budget: 150 },
        { resourceType: 'style', budget: 50 },
        { resourceType: 'image', budget: 100 },
        { resourceType: 'total', budget: 300 }
      ],
      resourceCounts: [
        { resourceType: 'third-party', budget: 10 }
      ]
    }
  ]
}
```

### Monitoring Tools

1. **Vercel Analytics**: Real-user monitoring
2. **Google Analytics 4**: User behavior tracking
3. **Sentry**: Error tracking and performance
4. **Custom Dashboard**: Internal metrics visualization

## Security Implementation Details

### Content Security Policy

```typescript
// next.config.mjs - CSP Configuration
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https: blob:;
  font-src 'self' data:;
  connect-src 'self' https://api.buckinghamvault.com wss://api.buckinghamvault.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`
```

### Authentication Security

```typescript
// lib/auth/jwt.ts
export const signToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '15m',
    algorithm: 'HS256',
    issuer: 'buckingham-vault',
    audience: 'buckingham-vault-users'
  })
}

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!, {
    algorithms: ['HS256'],
    issuer: 'buckingham-vault',
    audience: 'buckingham-vault-users'
  }) as TokenPayload
}
```

### CSRF Protection

```typescript
// lib/security/csrf.ts
import { randomBytes } from 'crypto'

export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex')
}

export async function validateCSRFToken(
  token: string | null,
  sessionToken: string
): Promise<boolean> {
  if (!token || !sessionToken) return false
  return timingSafeEqual(
    Buffer.from(token),
    Buffer.from(sessionToken)
  )
}
```

### Input Sanitization

```typescript
// lib/security/sanitize.ts
import DOMPurify from 'isomorphic-dompurify'

export function sanitizeInput(input: string): string {
  // Remove any HTML tags
  const cleaned = DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [] 
  })
  
  // Additional validation
  return cleaned.trim().slice(0, 1000) // Max length
}
```

## Third-party Integrations

### Email Service - Resend

```typescript
// lib/email/client.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  react
}: EmailOptions) {
  return await resend.emails.send({
    from: 'The Buckingham Vault <noreply@buckinghamvault.com>',
    to,
    subject,
    react
  })
}
```

### Analytics - Google Analytics 4

```typescript
// lib/analytics/google-analytics.tsx
export function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  )
}
```

### Blockchain Analytics - Chainalysis

```typescript
// lib/forensics/chainalysis.ts
export class ChainalysisClient {
  private apiKey: string
  private baseURL = 'https://api.chainalysis.com/v1'
  
  constructor(apiKey: string) {
    this.apiKey = apiKey
  }
  
  async analyzeAddress(address: string, currency: string) {
    const response = await fetch(
      `${this.baseURL}/address/${address}/summary?currency=${currency}`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    return response.json()
  }
}
```

## API Design and Documentation

### RESTful API Structure

```
/api
├── auth/
│   ├── login/          POST   - User authentication
│   ├── logout/         POST   - Session termination
│   ├── refresh/        POST   - Token refresh
│   └── me/            GET    - Current user info
├── deals/
│   ├── /              GET    - List deals (paginated)
│   ├── /              POST   - Create new deal
│   ├── [id]/          GET    - Get deal details
│   ├── [id]/          PATCH  - Update deal
│   └── analytics/     GET    - Deal analytics
├── forensics/
│   ├── analyze/       POST   - Analyze address
│   └── report/[id]/   GET    - Get forensic report
└── exchange/
    ├── orderbook/     GET    - Get order book
    ├── quote/         POST   - Get price quote
    └── execute/       POST   - Execute trade
```

### API Authentication

```typescript
// middleware/auth.ts
export async function authenticateRequest(
  req: NextRequest
): Promise<AuthUser | null> {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return null
  }
  
  try {
    const payload = verifyToken(token)
    return await getUserById(payload.userId)
  } catch (error) {
    return null
  }
}
```

### API Response Format

```typescript
// Successful response
{
  "success": true,
  "data": {
    // Response data
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "1.0"
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request parameters are invalid",
    "details": {
      "field": "amount",
      "reason": "Must be greater than 1000000"
    }
  }
}
```

### Rate Limiting

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
})

export async function checkRateLimit(identifier: string) {
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier)
  
  return {
    allowed: success,
    limit,
    remaining,
    reset: new Date(reset)
  }
}
```

## Database Schema and Relationships

### Future Database Architecture

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Deals table
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  type VARCHAR(20) NOT NULL,
  status VARCHAR(50) NOT NULL,
  asset_type VARCHAR(10) NOT NULL,
  amount DECIMAL(20, 8) NOT NULL,
  price DECIMAL(20, 2),
  forensic_rating VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Audit log
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Data Access Patterns

```typescript
// lib/db/deals.ts
export class DealsRepository {
  async findByFilters(filters: DealFilters, pagination: Pagination) {
    const query = db
      .select()
      .from(deals)
      .where(
        and(
          filters.status ? inArray(deals.status, filters.status) : undefined,
          filters.type ? inArray(deals.type, filters.type) : undefined,
          filters.dateRange ? between(
            deals.createdAt,
            filters.dateRange[0],
            filters.dateRange[1]
          ) : undefined
        )
      )
      .limit(pagination.limit)
      .offset(pagination.offset)
      .orderBy(desc(deals.createdAt))
    
    return query
  }
}
```

## Infrastructure Requirements

### Hosting Requirements

1. **Compute**
   - Node.js 18+ runtime
   - 2 vCPU minimum
   - 4GB RAM minimum
   - Auto-scaling enabled

2. **Storage**
   - 100GB SSD for application
   - CDN for static assets
   - Object storage for documents

3. **Network**
   - Global CDN distribution
   - DDoS protection
   - SSL/TLS termination
   - WebSocket support

### Scaling Strategy

1. **Horizontal Scaling**
   - Stateless application design
   - Load balancer distribution
   - Session storage in Redis
   - Shared cache layer

2. **Vertical Scaling**
   - Database read replicas
   - Connection pooling
   - Query optimization
   - Caching strategy

### Backup and Disaster Recovery

1. **Backup Strategy**
   - Daily automated backups
   - 30-day retention policy
   - Geographic redundancy
   - Point-in-time recovery

2. **Disaster Recovery**
   - RTO: 4 hours
   - RPO: 1 hour
   - Automated failover
   - Regular DR testing

## Development Workflow

### Git Workflow

```bash
# Feature branch workflow
main
├── develop
│   ├── feature/add-kyc-system
│   ├── feature/forensics-integration
│   └── fix/login-redirect
└── release/v1.2.0
```

### Commit Conventions

```bash
# Format: <type>(<scope>): <subject>
feat(deals): add forensic verification step
fix(auth): resolve token refresh race condition
docs(api): update endpoint documentation
style(ui): adjust button padding
refactor(state): simplify filter management
test(deals): add integration tests
chore(deps): update dependencies
```

### Code Review Process

1. **PR Requirements**
   - Descriptive title and description
   - Linked issue or ticket
   - Tests for new features
   - Documentation updates

2. **Review Checklist**
   - Code quality and standards
   - Security considerations
   - Performance impact
   - Test coverage

## Code Quality Standards

### ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-console': 'warn'
  }
}
```

### Prettier Configuration

```javascript
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "always"
}
```

### Testing Standards

1. **Unit Tests**: 80% coverage minimum
2. **Integration Tests**: Critical paths covered
3. **E2E Tests**: User journeys validated
4. **Performance Tests**: Load testing for APIs

## Conclusion

The technical foundation of The Buckingham Vault represents a carefully orchestrated selection of modern technologies, each chosen for specific strengths that align with our platform goals. From Next.js 15's cutting-edge performance features to enterprise-grade security implementations, every technical decision supports our mission of providing institutional-grade digital asset management.

This technical context serves as both documentation and guidance, ensuring consistent implementation across the development team while providing clear rationale for architectural decisions. As the platform evolves, this document will be updated to reflect new technologies and patterns, maintaining its role as the technical north star for The Buckingham Vault.