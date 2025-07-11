# CLAUDE.md

## Memory Bank Workflow (CRITICAL)
1. **ALWAYS START BY READING MEMORY BANK**: Read ALL files in `memory-bank/` directory before any task
2. **Reference Memory Bank Intelligence**: Use `.cursor/rules/memory-bank.mdc` for project patterns
3. **Follow Documented Patterns**: Apply learned success/failure patterns from memory bank
4. **Update Memory Bank**: Document significant changes and learnings

## Memory Bank Files (READ FIRST)
- `memory-bank/projectbrief.md` - Core mission and requirements
- `memory-bank/productContext.md` - Why this exists and how it should work
- `memory-bank/systemPatterns.md` - Architecture and technical decisions
- `memory-bank/techContext.md` - Technologies and development setup
- `memory-bank/activeContext.md` - Current work focus and recent changes
- `memory-bank/progress.md` - Current status and known issues

## Standard Workflow
1. **Memory Bank First**: Read ALL memory bank files to understand current state
2. **Apply Intelligence**: Use patterns from `.cursor/rules/memory-bank.mdc`
3. **Systematic Diagnosis**: For issues, methodically check each layer
4. **Incremental Changes**: Make small, testable changes
5. **Document Changes**: Update memory bank with significant modifications
6. **Test Each Step**: Verify functionality after each change
7. **Conservative Approach**: Avoid over-engineering or complex solutions

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Buckingham Vault is a high-end financial services website built with Next.js 15, React 19, and TypeScript. The project features a luxury design with custom WebGL shaders, extensive UI components, and a focus on performance and accessibility.

## Development Commands

```bash
# Install dependencies (preferred package manager: pnpm)
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run production server
pnpm start

# Lint code (TypeScript type checking and ESLint)
pnpm lint

# Clean build artifacts
pnpm clean
```

## Architecture Overview

### Directory Structure
- **`app/`** - Next.js 13+ app router pages and layouts
- **`components/`** - React components organized by feature
  - `ui/` - Reusable UI primitives (based on shadcn/ui)
  - `shared/` - Shared components across features
- **`hooks/`** - Custom React hooks
- **`lib/`** - Utility functions and configurations
  - `animations/` - Animation utilities
  - `performance/` - Performance optimization helpers
  - `cms/` - CMS data fetching utilities
- **`public/`** - Static assets (images, fonts)

### Key Technologies
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with custom brand colors (navy/gold theme)
- **UI Components**: Radix UI primitives with custom styling
- **Animation**: Framer Motion for interactions
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

### Special Features

#### WebGL Liquid Gold Shader
The hero section features a custom WebGL shader implementation with:
- Interactive mouse/touch tracking
- Performance optimizations (lazy loading, GPU efficiency)
- Mobile fallback for unsupported devices
- Accessibility support (keyboard navigation, reduced motion)

See `HERO_SHADER_README.md` for detailed implementation details.

### Code Style Guidelines
- Use TypeScript with strict type checking
- Follow component structure: logic → UI → exports
- Use Tailwind CSS classes with `cn()` utility for conditional styling
- Implement responsive design with mobile-first approach
- Ensure accessibility with proper ARIA labels and keyboard navigation

### Common Development Tasks

#### Adding a New Component
1. Create component in appropriate directory (`components/ui/` for primitives, `components/` for features)
2. Use TypeScript interfaces for props
3. Import and use existing UI primitives when possible
4. Apply consistent styling with Tailwind classes

#### Working with Forms
- Use React Hook Form for form state management
- Define schemas with Zod for validation
- Use existing form components from `components/ui/form.tsx`

#### Performance Considerations
- Use Next.js Image component for optimized images
- Implement lazy loading for heavy components
- Utilize performance helpers from `lib/performance/`
- Test with lighthouse for Core Web Vitals

### Testing
Currently, no test framework is configured. When implementing tests, consider adding Jest and React Testing Library for component testing.