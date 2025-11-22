# Testing Guide

## Overview

This starter kit includes a comprehensive testing infrastructure with Vitest for unit/component tests and Playwright for end-to-end tests.

---

## Testing Stack

- **Unit/Component Testing**: Vitest + React Testing Library
- **E2E Testing**: Playwright
- **Coverage**: Vitest Coverage (v8 provider)
- **Environment**: jsdom for DOM simulation

---

## Project Structure

This project uses a **two-folder convention** for organizing tests:

```
web_starter_kit/
├── __tests__/          # Unit & Component Tests (Vitest)
│   ├── components/
│   │   └── ui/
│   │       └── button.test.tsx
│   └── lib/
│       ├── seo.test.ts
│       └── utils.test.ts
├── tests/              # E2E Tests (Playwright)
│   ├── homepage.e2e.ts
│   ├── middleware-auth.e2e.ts
│   └── toast-notifications.e2e.ts
```

### Why Two Folders?

**`__tests__/` - Unit & Component Tests**

- Industry-standard convention (Jest/Vitest default)
- Fast execution in jsdom environment
- Tests individual functions and components in isolation
- Configured in `vitest.config.mts`

**`tests/` - E2E Tests**

- Playwright's default convention
- Runs in real browsers (Chromium, Firefox, WebKit)
- Tests the entire application from a user's perspective
- Configured in `playwright.config.ts`

### Benefits of This Structure

1. **Clear separation** - Immediately identify test type by folder
2. **Tool compatibility** - Each tool finds its tests without extra config
3. **Different execution speeds** - Run fast unit tests separately from slower E2E tests
4. **CI/CD flexibility** - Run unit tests on every commit, E2E tests only on PRs

### Test File Naming Conventions

Both testing frameworks support multiple naming patterns:

**Vitest (Unit Tests)**

- `*.test.ts` or `*.test.tsx` ✅ (preferred in this project)
- `*.spec.ts` or `*.spec.tsx` (also supported)
- Must contain `.test.` or `.spec.` in filename

**Playwright (E2E Tests)**

- `*.e2e.ts` ✅ (used in this project for clarity)
- `*.spec.ts` (Playwright's default)
- Configured via `testMatch: '**/*.e2e.ts'` in `playwright.config.ts`

---

## Quick Start

### Run All Tests

```bash
npm test              # Run unit tests in watch mode
npm run test:all      # Run unit + E2E tests (CI mode)
```

### Unit Tests (Vitest)

```bash
npm test              # Watch mode (interactive)
npm run test:watch    # Same as above
npm run test:coverage # Generate coverage report
npm run test:ui       # Open Vitest UI
```

### E2E Tests (Playwright)

```bash
npm run test:e2e         # Run all E2E tests
npm run test:e2e:ui      # Open Playwright UI
npm run test:e2e:headed  # Run with browser visible
npm run test:e2e:debug   # Debug mode
```

### Running Single Test Files

**Vitest - Run specific test file**

```bash
npm test __tests__/lib/utils.test.ts              # Run single file
npm test button                                    # Run files matching pattern
npm run test:coverage __tests__/lib/seo.test.ts   # Coverage for single file
```

**Playwright - Run specific test file**

```bash
npx playwright test tests/homepage.e2e.ts         # Run single file
npx playwright test tests/homepage.e2e.ts:15      # Run test at line 15
npx playwright test --grep "toast"                # Run tests matching pattern
npx playwright test --project=chromium            # Run in single browser
```

**Running Single Test Case**

Add `.only` to run a single test:

```typescript
// Vitest
test.only('this test will run', () => {
  expect(true).toBe(true)
})

// Playwright
test.only('this E2E test will run', async ({ page }) => {
  await page.goto('/')
})
```

⚠️ **Remember to remove `.only` before committing!**

---

## Writing Unit Tests

### Component Test Example

**File**: `__tests__/components/ui/button.test.tsx`

```typescript
import { expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

test('Button renders with correct text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
})

test('Button handles click events', async () => {
  const user = userEvent.setup()
  const handleClick = vi.fn()

  render(<Button onClick={handleClick}>Click me</Button>)
  await user.click(screen.getByRole('button'))

  expect(handleClick).toHaveBeenCalledOnce()
})
```

### Utility Function Test Example

**File**: `__tests__/lib/utils.test.ts`

```typescript
import { expect, test, describe } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn utility function', () => {
  test('merges class names correctly', () => {
    const result = cn('text-red-500', 'bg-blue-500')
    expect(result).toBe('text-red-500 bg-blue-500')
  })

  test('handles conditional class names', () => {
    const isActive = true
    const result = cn('base-class', isActive && 'active-class')
    expect(result).toBe('base-class active-class')
  })
})
```

### Testing with Mocks

```typescript
import { expect, test, vi } from 'vitest'

// Mock a module
vi.mock('@/lib/api', () => ({
  fetchUser: vi.fn(() => Promise.resolve({ id: 1, name: 'John' })),
}))

// Mock a function
const mockFn = vi.fn()
mockFn.mockReturnValue('mocked value')
expect(mockFn()).toBe('mocked value')
```

---

## Writing E2E Tests

### Page Navigation Test

**File**: `tests/homepage.e2e.ts`

```typescript
import { test, expect } from '@playwright/test'

test('should load the homepage successfully', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Next.js 15 Starter Kit/)
})

test('should display heading', async ({ page }) => {
  await page.goto('/')
  const heading = page.getByRole('heading', { name: 'System Status Check', level: 1 })
  await expect(heading).toBeVisible()
})
```

### User Interaction Test

**File**: `tests/toast-notifications.e2e.ts`

```typescript
import { test, expect } from '@playwright/test'

test('should display toast when button is clicked', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Success Toast' }).click()

  const toast = page.getByText('Success! Operation completed.')
  await expect(toast).toBeVisible()
})
```

### Form Submission Test

```typescript
test('user can submit form', async ({ page }) => {
  await page.goto('/contact')

  await page.fill('input[name="email"]', 'user@example.com')
  await page.fill('textarea[name="message"]', 'Hello!')
  await page.click('button[type="submit"]')

  await expect(page.getByText('Message sent!')).toBeVisible()
})
```

---

## Testing Best Practices

### 1. Test Structure (AAA Pattern)

```typescript
test('descriptive test name', () => {
  // Arrange - Set up test data and conditions
  const user = { name: 'John', age: 30 }

  // Act - Perform the action being tested
  const result = formatUser(user)

  // Assert - Verify the outcome
  expect(result).toBe('John (30)')
})
```

### 2. Use Descriptive Test Names

```typescript
// ✅ Good
test('Button should show loading state when submitting form')
test('SEO helper generates correct Open Graph metadata')

// ❌ Bad
test('button test')
test('it works')
```

### 3. Test User Behavior, Not Implementation

```typescript
// ✅ Good - Test what user sees/does
test('user can log in with email and password', async () => {
  render(<LoginForm />)
  await userEvent.type(screen.getByLabelText('Email'), 'user@example.com')
  await userEvent.type(screen.getByLabelText('Password'), 'password123')
  await userEvent.click(screen.getByRole('button', { name: 'Log in' }))
  expect(screen.getByText('Welcome')).toBeInTheDocument()
})

// ❌ Bad - Test internal state
test('login form updates state on input change', () => {
  // Testing implementation details
})
```

### 4. Keep Tests Independent

```typescript
// Each test should be able to run in isolation
test('test 1', () => {
  // Don't rely on test 2 running first
})

test('test 2', () => {
  // Don't rely on test 1 running first
})
```

### 5. Use beforeEach for Common Setup

**Vitest (Unit Tests)**

```typescript
import { describe, test, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UserProfile } from '@/components/UserProfile'

describe('UserProfile Component', () => {
  beforeEach(() => {
    // Reset mocks or set up common data before each test
    vi.clearAllMocks()
  })

  test('should display user name', () => {
    render(<UserProfile name="John" />)
    expect(screen.getByText('John')).toBeInTheDocument()
  })

  test('should allow editing', () => {
    render(<UserProfile name="John" editable />)
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
  })
})
```

**Playwright (E2E Tests)**

```typescript
import { test, expect } from '@playwright/test'

test.describe('User Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to profile page before each test
    await page.goto('/profile')
  })

  test('should display user name', async ({ page }) => {
    await expect(page.getByRole('heading')).toContainText('John Doe')
  })

  test('should allow editing', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit' }).click()
    await expect(page.getByRole('textbox')).toBeVisible()
  })
})
```

---

## What to Test

### ✅ DO Test

1. **User Interactions** - Clicks, form submissions, navigation
2. **Visual Elements** - Components render correctly
3. **Business Logic** - Utility functions, calculations
4. **Error States** - Error messages, validation
5. **Accessibility** - Screen reader labels, keyboard navigation
6. **Integration** - Components working together

### ❌ DON'T Test

1. **Third-Party Libraries** - Trust they're already tested
2. **Implementation Details** - Internal state, private functions
3. **Styling** - Visual regression is separate (use Storybook if needed)
4. **Next.js Framework Code** - Trust the framework

---

## Coverage Guidelines

### Generate Coverage Report

```bash
npm run test:coverage
```

Coverage report will be generated in `coverage/` directory.

### Coverage Targets (Recommended)

- **Overall**: 80%+ coverage
- **Critical Paths**: 90%+ coverage (auth, payments, data mutations)
- **Utilities**: 100% coverage (pure functions)
- **UI Components**: 70%+ coverage (focus on behavior)

### What Coverage Doesn't Mean

- 100% coverage ≠ bug-free code
- Coverage measures lines executed, not quality of tests
- Focus on meaningful tests, not just hitting coverage targets

---

## Testing Server Components

### Important Limitation

**Async Server Components cannot be directly tested with Vitest/Jest.**

### Solution 1: Extract Logic

```typescript
// ✅ Good - Extract testable logic
// lib/data-fetcher.ts
export async function getUserData(id: string) {
  const res = await fetch(`/api/users/${id}`)
  return res.json()
}

// __tests__/lib/data-fetcher.test.ts
test('getUserData fetches user correctly', async () => {
  // Test the extracted function
})
```

### Solution 2: Use E2E Tests

```typescript
// tests/user-profile.e2e.ts
test('user profile page displays data', async ({ page }) => {
  await page.goto('/users/123')
  await expect(page.getByRole('heading')).toContainText('John Doe')
})
```

---

## Continuous Integration (CI)

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:coverage

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/coverage-final.json
```

---

## Common Testing Patterns

### Testing Async Operations

```typescript
test('fetches data successfully', async () => {
  const promise = fetchData()
  await expect(promise).resolves.toEqual({ id: 1, name: 'John' })
})

test('handles errors', async () => {
  const promise = fetchData('invalid')
  await expect(promise).rejects.toThrow('Not found')
})
```

### Testing with React Query

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'

test('useUser hook fetches user data', async () => {
  const queryClient = new QueryClient()
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )

  const { result } = renderHook(() => useUser('123'), { wrapper })

  await waitFor(() => expect(result.current.isSuccess).toBe(true))
  expect(result.current.data).toEqual({ id: '123', name: 'John' })
})
```

### Testing Forms

```typescript
test('form validation works', async () => {
  render(<ContactForm />)
  const user = userEvent.setup()

  // Submit without filling
  await user.click(screen.getByRole('button', { name: 'Submit' }))
  expect(screen.getByText('Email is required')).toBeInTheDocument()

  // Fill with invalid email
  await user.type(screen.getByLabelText('Email'), 'invalid')
  await user.click(screen.getByRole('button', { name: 'Submit' }))
  expect(screen.getByText('Invalid email')).toBeInTheDocument()

  // Fill correctly
  await user.clear(screen.getByLabelText('Email'))
  await user.type(screen.getByLabelText('Email'), 'user@example.com')
  await user.click(screen.getByRole('button', { name: 'Submit' }))
  expect(screen.getByText('Message sent!')).toBeInTheDocument()
})
```

---

## Debugging Tests

### Vitest Debugging

```typescript
// Add console.log
test('debug test', () => {
  console.log('Debug info:', someValue)
  expect(someValue).toBe(expected)
})

// Use debug() from testing-library
import { render, screen } from '@testing-library/react'

test('debug component', () => {
  render(<MyComponent />)
  screen.debug() // Prints the DOM to console
})
```

### Playwright Debugging

```bash
# Run with debug mode
npm run test:e2e:debug

# Run with headed browser (watch the browser)
npm run test:e2e:headed

# Use Playwright Inspector
npx playwright test --debug
```

### Use Playwright UI Mode

```bash
npm run test:e2e:ui
```

This opens an interactive UI where you can:

- See all tests
- Run individual tests
- Watch tests in real-time
- View traces and screenshots

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Next.js Testing Guide](https://nextjs.org/docs/app/guides/testing)
