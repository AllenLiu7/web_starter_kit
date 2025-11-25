# Error Handling Guide

Comprehensive guide to standardized error handling in the Next.js 16 Starter Kit.

## Table of Contents

- [Why Standardized Error Handling?](#why-standardized-error-handling)
- [Error Classes](#error-classes)
- [Validation Utilities](#validation-utilities)
- [Type Guards](#type-guards)
- [API Response Patterns](#api-response-patterns)
- [Best Practices](#best-practices)

---

## Why Standardized Error Handling?

### Problems with Inconsistent Errors

```typescript
// WRONG - Generic errors, no structure
throw new Error('Something went wrong')
throw new Error('Not found')
```

**Issues:**

- No HTTP status codes
- No error codes for client handling
- Inconsistent error messages
- Hard to debug in production
- Not AI-friendly

### Standardized Error Solution

```typescript
// CORRECT - Structured errors with AppError classes
import { ValidationError, NotFoundError } from '@/lib/errors'

throw new ValidationError('Email is required')
throw new NotFoundError('User')
```

**Benefits:**

- **Consistent structure**: All errors have status codes and error codes
- **Type-safe**: TypeScript knows the error types
- **Easy to handle**: Centralized error handling
- **AI-friendly**: Predictable patterns AI can follow
- **Production-ready**: Includes stack traces and proper logging

---

## Error Classes

### Available Error Classes

| Class               | Status | Code             | When to Use                   |
| ------------------- | ------ | ---------------- | ----------------------------- |
| `ValidationError`   | 400    | VALIDATION_ERROR | Input validation failures     |
| `UnauthorizedError` | 401    | UNAUTHORIZED     | Authentication required       |
| `ForbiddenError`    | 403    | FORBIDDEN        | User lacks permissions        |
| `NotFoundError`     | 404    | NOT_FOUND        | Resource doesn't exist        |
| `ConflictError`     | 409    | CONFLICT         | Duplicate or conflicting data |
| `AppError`          | 500    | Custom           | Base class for custom errors  |

### Usage Examples

#### ValidationError (400)

```typescript
import { ValidationError } from '@/lib/errors'

if (!email) {
  throw new ValidationError('Email is required')
}

if (!password || password.length < 8) {
  throw new ValidationError('Password must be at least 8 characters')
}
```

#### NotFoundError (404)

```typescript
import { NotFoundError } from '@/lib/errors'

const user = await prisma.user.findUnique({ where: { id } })
if (!user) {
  throw new NotFoundError('User')
}
```

#### UnauthorizedError (401)

```typescript
import { UnauthorizedError } from '@/lib/errors'

const session = await getSession()
if (!session) {
  throw new UnauthorizedError()
}
```

#### ForbiddenError (403)

```typescript
import { ForbiddenError } from '@/lib/errors'

if (user.role !== 'admin') {
  throw new ForbiddenError('Admin access required')
}
```

#### ConflictError (409)

```typescript
import { ConflictError } from '@/lib/errors'

const existingUser = await prisma.user.findUnique({ where: { email } })
if (existingUser) {
  throw new ConflictError('Email already registered')
}
```

---

## Validation Utilities

### Early Validation Pattern

**Always validate inputs early** - fail fast at the beginning of functions:

```typescript
import { validateRequired, validateEmail, validateStringLength } from '@/lib/validation'

export async function createUser(data: unknown) {
  // Validate early - all validations at the top
  const email = validateEmail(validateRequired(data.email, 'email'))
  const password = validateStringLength(validateRequired(data.password, 'password'), 'password', {
    min: 8,
    max: 100,
  })
  const name = validateStringLength(validateRequired(data.name, 'name'), 'name', {
    min: 1,
    max: 100,
  })

  // Now proceed with business logic - inputs are guaranteed valid
  const user = await prisma.user.create({
    data: { email, password: await hash(password), name },
  })

  return user
}
```

### Available Validation Functions

#### validateRequired

```typescript
const userId = validateRequired(req.body.userId, 'userId')
// Throws ValidationError if null/undefined
```

#### validateEmail

```typescript
const email = validateEmail(req.body.email)
// Throws ValidationError if invalid format
// Returns lowercase, trimmed email
```

#### validateUrl

```typescript
const website = validateUrl(req.body.website)
// Throws ValidationError if invalid URL
```

#### validateStringLength

```typescript
const password = validateStringLength(req.body.password, 'password', { min: 8, max: 100 })
```

#### validateNumberRange

```typescript
const age = validateNumberRange(req.body.age, 'age', { min: 0, max: 120 })
```

#### validateEnum

```typescript
const role = validateEnum(req.body.role, 'role', ['admin', 'user', 'guest'])
```

#### validateArray

```typescript
const tags = validateArray(req.body.tags, 'tags', { minLength: 1, maxLength: 10 })
```

---

## Type Guards

### Runtime Type Checking

Type guards provide runtime type safety with TypeScript type narrowing:

```typescript
import { isNotNull, isDefined, isString, isError } from '@/lib/guards'

// Check for null/undefined
const user: User | null = await getUser()
if (isNotNull(user)) {
  // TypeScript knows user is User here (not null)
  logger.info({ userId: user.id }, 'User found')
}

// Check for undefined
const email: string | undefined = user?.email
if (isDefined(email)) {
  // TypeScript knows email is string here
  await sendEmail(email)
}

// Error handling in catch blocks
try {
  await riskyOperation()
} catch (error) {
  if (isError(error)) {
    // TypeScript knows error is Error here
    logger.error({ error }, error.message)
  }
}
```

### Exhaustiveness Checking

```typescript
import { assertNever } from '@/lib/guards'

type Status = 'pending' | 'active' | 'completed'

function getStatusColor(status: Status): string {
  switch (status) {
    case 'pending':
      return 'yellow'
    case 'active':
      return 'green'
    case 'completed':
      return 'blue'
    default:
      // TypeScript error if any case is missing
      return assertNever(status)
  }
}
```

---

## API Response Patterns

### Standard Response Structure

```typescript
import type { ApiResponse } from '@/types/api'
import { successResponse, errorResponse } from '@/types/api'

// Success response
export async function GET(): Promise<Response> {
  const user = await getUser()
  return Response.json(successResponse(user))
}

// Error response
export async function GET(): Promise<Response> {
  return Response.json(errorResponse('User not found', 'NOT_FOUND'), { status: 404 })
}
```

### API Route Handler Pattern

```typescript
import { NotFoundError, ValidationError, isAppError } from '@/lib/errors'
import { validateRequired } from '@/lib/validation'
import { successResponse, errorResponse } from '@/types/api'
import { logger } from '@/lib/logger'

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json()

    // Validate early
    const email = validateRequired(body.email, 'email')
    const name = validateRequired(body.name, 'name')

    // Business logic
    const user = await createUser({ email, name })

    logger.info({ userId: user.id }, 'User created')
    return Response.json(successResponse(user), { status: 201 })
  } catch (error) {
    // Handle AppError instances
    if (isAppError(error)) {
      logger.warn({ error, code: error.code }, error.message)
      return Response.json(errorResponse(error.message, error.code), { status: error.statusCode })
    }

    // Handle unexpected errors
    logger.error({ error }, 'Unexpected error in POST /api/users')
    return Response.json(errorResponse('Internal server error'), { status: 500 })
  }
}
```

### Server Action Pattern

```typescript
'use server'

import { NotFoundError, ValidationError } from '@/lib/errors'
import { validateRequired } from '@/lib/validation'
import type { ApiResponse } from '@/types/api'
import { logger } from '@/lib/logger'

export async function deleteUser(userId: string): Promise<ApiResponse<void>> {
  try {
    validateRequired(userId, 'userId')

    await prisma.user.delete({ where: { id: userId } })

    logger.info({ userId }, 'User deleted')
    return { success: true, data: undefined }
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { success: false, error: error.message, code: error.code }
    }

    logger.error({ error, userId }, 'Failed to delete user')
    return { success: false, error: 'Failed to delete user' }
  }
}
```

---

## Best Practices

### 1. Validate Early, Fail Fast

```typescript
// GOOD - Validate all inputs at the beginning
export async function updateProfile(data: unknown) {
  const userId = validateRequired(data.userId, 'userId')
  const name = validateStringLength(data.name, 'name', { min: 1, max: 100 })
  const email = validateEmail(data.email)

  // All validation done, now execute business logic
  return await updateUser(userId, { name, email })
}
```

### 2. Use Specific Error Classes

```typescript
// BAD - Generic error
if (!user) {
  throw new Error('Not found')
}

// GOOD - Specific error class
if (!user) {
  throw new NotFoundError('User')
}
```

### 3. Always Log Errors with Context

```typescript
import { logger } from '@/lib/logger'

try {
  await deleteUser(userId)
} catch (error) {
  // Include context in logs
  logger.error({ error, userId }, 'Failed to delete user')
  throw error
}
```

### 4. Handle Errors at API Boundaries

```typescript
// API routes should catch all errors
export async function GET(request: Request): Promise<Response> {
  try {
    // ... business logic
  } catch (error) {
    if (isAppError(error)) {
      return Response.json(errorResponse(error.message, error.code), { status: error.statusCode })
    }
    return Response.json(errorResponse('Internal server error'), { status: 500 })
  }
}
```

### 5. Use Type Guards in Catch Blocks

```typescript
try {
  await riskyOperation()
} catch (error) {
  // Type guard for Error instance
  if (isError(error)) {
    logger.error({ error }, error.message)
  }

  // Type guard for AppError instance
  if (isAppError(error)) {
    return errorResponse(error.message, error.code)
  }

  // Unknown error type
  logger.error({ error }, 'Unknown error type')
}
```

---

## Common Patterns

### Pattern 1: Form Validation

```typescript
import { validateRequired, validateEmail, validateStringLength } from '@/lib/validation'

export async function handleFormSubmit(formData: FormData) {
  const email = validateEmail(validateRequired(formData.get('email'), 'email'))
  const password = validateStringLength(
    validateRequired(formData.get('password'), 'password'),
    'password',
    { min: 8 }
  )

  return await signIn(email, password)
}
```

### Pattern 2: Authorization Check

```typescript
import { UnauthorizedError, ForbiddenError } from '@/lib/errors'
import { isNotNull } from '@/lib/guards'

export async function requireAuth(userId: string) {
  const session = await getSession()

  if (!isNotNull(session)) {
    throw new UnauthorizedError()
  }

  if (session.userId !== userId) {
    throw new ForbiddenError('Access denied')
  }

  return session
}
```

### Pattern 3: Resource Creation with Conflict Check

```typescript
import { ConflictError } from '@/lib/errors'

export async function createUser(email: string) {
  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing) {
    throw new ConflictError('Email already registered')
  }

  return await prisma.user.create({ data: { email } })
}
```

---

## Summary

**Key Takeaways:**

1. Always use standardized error classes from `@/lib/errors`
2. Validate inputs early using helpers from `@/lib/validation`
3. Use type guards from `@/lib/guards` for runtime type safety
4. Return consistent API responses using types from `@/types/api`
5. Log all errors with context using `@/lib/logger`
6. Handle errors at API boundaries (routes, server actions)

**Next Steps:**

- Review [AI Coding Guidelines](./AI-Coding-Guidelines.md) for overall patterns
- See [Logging Guide](./Logging-Guide.md) for error logging
- Check [Code Quality Guide](./Code-Quality.md) for ESLint rules
