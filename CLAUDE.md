# CLAUDE.md

## Standard Workflow
1.    First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.
2.    The plan should have a list of todo items that you can check off as you complete them
3.    Before you begin working, check in with me and I will verify the plan.
4.    Then, begin working on the todo items, marking them as complete as you go.
5.    Please every step of the way just give me a high level explanation of what changes you made
6.    Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7.    Finally, add a review section to the todo.md file with a summary of the changes you made and any other relevant information.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
0
0Buckingham Vault is a high-end financial services website built with Next.js 15, React 19, and TypeScript. The project features a luxury design with custom WebGL shaders, extensive UI components, and a focus on performance and accessibility.

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