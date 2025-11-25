# AI Coding Guidelines

Quick reference guide for AI-assisted development in the Next.js 16 Starter Kit.

## Overview

This starter kit is optimized for AI-assisted development with:

- **Standardized error handling** - Consistent error classes and patterns
- **Type-safe utilities** - Runtime validation with TypeScript narrowing
- **Predictable patterns** - Easy for AI to learn and replicate
- **Comprehensive documentation** - Detailed guides for every feature

---

## Quick Reference

### Error Handling

```typescript
import { ValidationError, NotFoundError } from '@/lib/errors'

// Throw standardized errors
throw new ValidationError('Email is required')
throw new NotFoundError('User')
```

[Full Error Handling Guide →](./Error-Handling-Guide.md)

### Validation

```typescript
import { validateRequired, validateEmail } from '@/lib/validation'

// Validate early, fail fast
const email = validateEmail(validateRequired(data.email, 'email'))
```

[Full Error Handling Guide →](./Error-Handling-Guide.md)

### Type Guards

```typescript
import { isNotNull, isDefined } from '@/lib/guards'

if (isNotNull(user)) {
  // TypeScript knows user is not null here
  console.log(user.name)
}
```

[Full Error Handling Guide →](./Error-Handling-Guide.md)

### API Responses

```typescript
import { successResponse, errorResponse } from '@/types/api'

return Response.json(successResponse(user))
return Response.json(errorResponse('Not found', 'NOT_FOUND'), { status: 404 })
```

[Full Error Handling Guide →](./Error-Handling-Guide.md)

### Logging

```typescript
import { logger } from '@/lib/logger'

logger.info({ userId }, 'User logged in')
logger.error({ error, userId }, 'Operation failed')
```

[Full Logging Guide →](./Logging-Guide.md)

---

## Core Principles

### 1. Validate Early, Fail Fast

Always validate inputs at the beginning of functions:

```typescript
export async function createUser(data: unknown) {
  // Validate first - all at the top
  const email = validateEmail(validateRequired(data.email, 'email'))
  const name = validateRequired(data.name, 'name')

  // Then execute business logic
  return await prisma.user.create({ data: { email, name } })
}
```

### 2. Use Standardized Error Classes

Never throw generic `Error` - use specific error classes:

```typescript
// ❌ BAD
throw new Error('Not found')

// ✅ GOOD
throw new NotFoundError('User')
```

### 3. Return Consistent API Responses

All API endpoints should return `ApiResponse<T>`:

```typescript
import type { ApiResponse } from '@/types/api'

export async function GET(): Promise<Response> {
  const response: ApiResponse<User> = {
    success: true,
    data: user,
  }
  return Response.json(response)
}
```

### 4. Always Log with Context

Include relevant context in all logs:

```typescript
// ❌ BAD
logger.info('User created')

// ✅ GOOD
logger.info({ userId, email }, 'User created')
```

### 5. Use Type Guards for Runtime Safety

Use type guards instead of manual type checks:

```typescript
// ❌ BAD
if (user !== null && user !== undefined) {
  console.log(user.name)
}

// ✅ GOOD
if (isNotNull(user)) {
  console.log(user.name)
}
```

---

## File Structure

### Utilities (`src/lib/`)

- **errors.ts** - Standardized error classes
- **guards.ts** - Type guards and runtime checks
- **validation.ts** - Input validation helpers
- **logger.ts** - Structured logging

### Types (`src/types/`)

- **api.ts** - API response type definitions

### Documentation (`context/`)

- **Error-Handling-Guide.md** - Complete error handling patterns
- **Logging-Guide.md** - Structured logging guide
- **Code-Quality.md** - ESLint rules and quality standards
- **Testing-Guide.md** - Testing patterns and best practices

---

## Common Patterns

### API Route Handler

```typescript
import { isAppError } from '@/lib/errors'
import { validateRequired } from '@/lib/validation'
import { successResponse, errorResponse } from '@/types/api'
import { logger } from '@/lib/logger'

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json()

    // Validate early
    const email = validateRequired(body.email, 'email')

    // Business logic
    const user = await createUser(email)

    logger.info({ userId: user.id }, 'User created')
    return Response.json(successResponse(user), { status: 201 })
  } catch (error) {
    if (isAppError(error)) {
      return Response.json(errorResponse(error.message, error.code), { status: error.statusCode })
    }

    logger.error({ error }, 'Unexpected error')
    return Response.json(errorResponse('Internal server error'), { status: 500 })
  }
}
```

### Server Action

```typescript
'use server'

import { ValidationError, NotFoundError } from '@/lib/errors'
import { validateRequired } from '@/lib/validation'
import type { ApiResponse } from '@/types/api'
import { logger } from '@/lib/logger'

export async function updateUser(userId: string, data: unknown): Promise<ApiResponse<User>> {
  try {
    validateRequired(userId, 'userId')
    const name = validateRequired(data.name, 'name')

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name },
    })

    logger.info({ userId }, 'User updated')
    return { success: true, data: user }
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { success: false, error: error.message, code: error.code }
    }

    logger.error({ error, userId }, 'Failed to update user')
    return { success: false, error: 'Failed to update user' }
  }
}
```

### Database Query with Logging

```typescript
import { NotFoundError } from '@/lib/errors'
import { logger } from '@/lib/logger'

async function getUserById(id: string) {
  logger.debug({ userId: id }, 'Fetching user from database')

  const user = await prisma.user.findUnique({ where: { id } })

  if (!user) {
    logger.warn({ userId: id }, 'User not found')
    throw new NotFoundError('User')
  }

  logger.info({ userId: id }, 'User fetched successfully')
  return user
}
```

---

## Checklist for AI-Generated Code

Before submitting code, ensure:

- [ ] All inputs are validated early
- [ ] Specific error classes are used (not generic `Error`)
- [ ] All errors are logged with context
- [ ] API responses use `ApiResponse<T>` type
- [ ] Type guards are used for runtime checks
- [ ] No `console.log` statements (use `logger` instead)
- [ ] All promises are awaited or explicitly handled
- [ ] Error handlers catch both AppError and unexpected errors

---

## Documentation Quick Links

| Topic               | Guide                                             |
| ------------------- | ------------------------------------------------- |
| Error Handling      | [Error Handling Guide](./Error-Handling-Guide.md) |
| Structured Logging  | [Logging Guide](./Logging-Guide.md)               |
| Code Quality        | [Code Quality Guide](./Code-Quality.md)           |
| Testing             | [Testing Guide](./Testing-Guide.md)               |
| Initial Setup       | [Initial Setup Guide](./Initial-Setup.md)         |
| SEO Configuration   | [SEO Setup Guide](./SEO-Setup.md)                 |
| Toast Notifications | [Toast Notifications](./Toast-Notifications.md)   |

---

## Next Steps

1. Read [Error Handling Guide](./Error-Handling-Guide.md) for detailed error patterns
2. Review [Logging Guide](./Logging-Guide.md) for structured logging best practices
3. Check [Code Quality Guide](./Code-Quality.md) for ESLint rules
4. See [Testing Guide](./Testing-Guide.md) for testing patterns

---

**Remember**: This starter kit follows industry best practices for AI-assisted development. Consistent patterns and predictable structures make AI code generation more reliable and maintainable.
