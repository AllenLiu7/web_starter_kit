# Next.js 15 Starter Kit

A production-ready Next.js 15 starter kit optimized for AI-assisted development, rapid prototyping, and low startup costs.

## Features

- **Next.js 15** with App Router and React 19
- **TypeScript** strict mode for maximum type safety
- **Tailwind CSS 3.4** with shadcn/ui components
- **Supabase** for authentication, database, and storage
- **Prisma ORM** with connection pooling
- **Zustand** for lightweight state management
- **TanStack Query** for advanced data fetching
- **React Hook Form + Zod** for form validation
- **Testing Infrastructure** with Vitest and Playwright
- **Code Quality Tools** with ESLint rules optimized for AI-generated code
- **AI-Friendly Utilities** with standardized error handling, validation, and type guards
- **Structured Logging** with pino for debugging AI-generated code
- **SEO Optimization** with next-seo and metadata helpers
- **Toast Notifications** with Sonner
- Full type safety across the stack
- Production-ready architecture

## Tech Stack

### Core Framework

- **Next.js 16** - Latest features, async APIs, Server Components, proxy.ts support
- **React 19** - Latest React features
- **TypeScript** - Strict mode configuration

### Styling & UI

- **Tailwind CSS 3.4** - Utility-first CSS framework (stable version)
- **shadcn/ui** - High-quality, accessible React components
- **Lucide React** - Icon library (tree-shakeable)

### Backend & Database

- **Supabase** - PostgreSQL database, authentication, file storage, real-time subscriptions
- **Prisma** - Type-safe ORM with migrations and connection pooling

### State Management & Data Fetching

- **Zustand** - Minimal state management with persist middleware
- **TanStack Query** - Data fetching, caching, and synchronization

### Forms & Validation

- **React Hook Form** - Performant form handling
- **Zod** - TypeScript-first schema validation
- **@hookform/resolvers** - Integration layer

### Utilities

- **date-fns** - Date manipulation (tree-shakeable)
- **clsx + tailwind-merge** - Conditional Tailwind classes
- **pino** - Structured logging for production debugging

### AI-Friendly Development

- **Standardized Error Handling** - Consistent error classes (ValidationError, NotFoundError, etc.)
- **Input Validation Helpers** - Early validation utilities (validateRequired, validateEmail, etc.)
- **Type Guards** - Runtime type checking with TypeScript narrowing (isNotNull, isDefined, etc.)
- **API Response Types** - Consistent response structures (ApiResponse, PaginatedResponse)

### Testing

- **Vitest** - Fast unit test framework with React Testing Library
- **Playwright** - E2E testing across Chromium, Firefox, and WebKit
- **Coverage** - v8 coverage reporting for code quality metrics

### Code Quality

- **Prettier** - Automatic code formatting with Tailwind CSS class sorting
- **ESLint** - JavaScript/TypeScript linting optimized for AI-generated code
  - Async/Promise safety rules (catches missing `await`)
  - Logic error prevention (catches bugs TypeScript misses)
  - React Hooks exhaustive deps enforcement
- **Husky** - Git hooks automation
- **lint-staged** - Run linters on staged files only (pre-commit)

### SEO & UX

- **next-seo** - SEO metadata management
- **Sonner** - Toast notification system

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed
- **npm** or **pnpm** package manager
- **Supabase account** (free tier available at https://supabase.com)
- **Git** for version control

## Getting Started

### 1. Clone the Repository

```bash
git clone git@github.com:AllenLiu7/web_starter_kit.git
cd web_starter_kit
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

This project uses TWO separate environment files:

#### Create `.env` (for Prisma database connection)

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and add your Supabase database credentials:

```env
DATABASE_URL="postgresql://postgres.[project]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[project]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
```

**Where to find these:**

1. Go to your Supabase project dashboard
2. Navigate to Settings > Database
3. Copy the "Connection Pooling" URL (port 6543) for DATABASE_URL
4. Copy the "Direct Connection" URL (port 5432) for DIRECT_URL

#### Create `.env.local` (for Next.js application variables)

```bash
touch .env.local
```

Add your Supabase API credentials to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Where to find these:**

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL, anon public key, and service_role key

**Important:**

- `.env` is ONLY for Prisma CLI (database connections)
- `.env.local` is for all other application secrets
- See [Environment Variables Guide](context/initial-setup.md#environment-variables-guide) for details

### 4. Initialize Database

Generate Prisma client:

```bash
npx prisma generate
```

Push the schema to your database:

```bash
npx prisma db push
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

### Development

```bash
npm run dev          # Start development server on localhost:3000
```

### Production

```bash
npm run build        # Build for production (includes Prisma client generation)
npm run start        # Start production server
```

### Code Quality

```bash
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix linting errors
npm run format           # Format all files with Prettier
npm run format:check     # Check formatting without changing files
```

**Pre-commit hooks** automatically run linting and formatting on staged files.

See the [Code Quality Guide](context/Code-Quality.md) for comprehensive documentation.

### Testing

```bash
# Unit & Component Tests (Vitest)
npm test                  # Run tests in watch mode
npm run test:watch        # Run tests in watch mode (same as above)
npm run test:coverage     # Generate coverage report
npm run test:ui           # Open Vitest UI

# E2E Tests (Playwright)
npm run test:e2e          # Run E2E tests
npm run test:e2e:ui       # Open Playwright UI
npm run test:e2e:headed   # Run tests with browser visible
npm run test:e2e:debug    # Run tests in debug mode

# Run All Tests
npm run test:all          # Run unit tests + E2E tests (CI mode)
```

See the [Testing Guide](context/Testing-Guide.md) for comprehensive testing documentation.

### Database (Prisma)

```bash
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes to database
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma migrate dev --name <name>  # Create a new migration
```

## Project Structure

```
web_starter_kit/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Auth routes (login, register)
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── features/          # Feature-specific components
│   │   └── providers/         # React context providers
│   ├── lib/
│   │   ├── supabase/          # Supabase client setup
│   │   ├── validations/       # Zod schemas
│   │   ├── prisma.ts          # Prisma client singleton
│   │   └── utils.ts           # Utility functions
│   ├── hooks/                 # Custom React hooks
│   ├── store/                 # Zustand stores
│   └── types/                 # TypeScript type definitions
├── __tests__/                 # Unit & component tests (Vitest)
│   ├── components/
│   └── lib/
├── tests/                     # E2E tests (Playwright)
├── prisma/
│   └── schema.prisma          # Database schema
├── context/                   # Documentation
│   └── initial-setup.md       # Detailed setup guide
├── .env                       # Prisma database variables (gitignored)
├── .env.local                 # Next.js app variables (gitignored)
├── .env.example               # Environment variables template
└── package.json
```

## Environment Variables

### Local Development

- **`.env`** - Prisma database connection strings (DATABASE_URL, DIRECT_URL)
- **`.env.local`** - All other environment variables (API keys, secrets, etc.)
- **`.env.example`** - Template file (committed to repository)

### Production Deployment

In production (Vercel, Railway, etc.):

1. Set ALL environment variables in your platform's dashboard
2. Include variables from both `.env` AND `.env.local`
3. Update `NEXT_PUBLIC_APP_URL` to your production domain

See the [Environment Variables Guide](context/initial-setup.md#environment-variables-guide) for comprehensive documentation.

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - DATABASE_URL
   - DIRECT_URL
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - NEXT_PUBLIC_APP_URL (set to your production URL)
4. Deploy

Vercel will automatically:

- Detect Next.js and configure build settings
- Run `prisma generate` during build (via build script)
- Deploy your application

### Other Platforms

This starter kit can be deployed to any platform that supports Next.js:

- Railway
- Render
- AWS Amplify
- Netlify

## Documentation

For detailed setup instructions and troubleshooting, see:

- [AI Coding Guidelines](context/AI-Coding-Guidelines.md) - **Start here** for AI-assisted development patterns
- [Initial Setup Guide](context/initial-setup.md) - Comprehensive step-by-step setup
- [Environment Variables Guide](context/initial-setup.md#environment-variables-guide) - Detailed environment configuration
- [Error Handling Guide](context/Error-Handling-Guide.md) - Standardized error handling and validation
- [Testing Guide](context/Testing-Guide.md) - Testing infrastructure and best practices
- [Code Quality Guide](context/Code-Quality.md) - Prettier, ESLint, Husky, and lint-staged setup
- [Logging Guide](context/Logging-Guide.md) - Structured logging for debugging AI-generated code
- [SEO Setup Guide](context/SEO-Setup.md) - SEO configuration and metadata management
- [Toast Notifications](context/Toast-Notifications.md) - Toast notification patterns

## Key Architectural Decisions

### Why Tailwind CSS v3.4?

We use the stable v3.4 release instead of v4 alpha for production reliability and proven shadcn/ui compatibility.

### Why Two Environment Files?

- **Prisma CLI only reads `.env`** - database connection strings must be here
- **Next.js reads both** - application secrets go in `.env.local`
- This separation prevents Prisma CLI errors during development

### Why Zustand with skipHydration?

To prevent SSR hydration mismatches when using persist middleware with Next.js. See `src/hooks/use-hydration.ts` for the rehydration pattern.

## Contributing

This is a starter kit template. Fork it and customize for your needs!

## License

MIT License - feel free to use this starter kit for your projects.

## Support

For issues and questions:

1. Check the [Initial Setup Guide](context/initial-setup.md)
2. Review the [Environment Variables Guide](context/initial-setup.md#environment-variables-guide)
3. Open an issue on GitHub

---

Built with Next.js 16, React 19, TypeScript, Tailwind CSS, Supabase, and Prisma.
