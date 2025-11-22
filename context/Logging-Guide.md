# Logging Guide

Comprehensive guide to structured logging with pino in the Next.js 15 Starter Kit.

## Table of Contents

- [Why Structured Logging?](#why-structured-logging)
- [Quick Start](#quick-start)
- [Log Levels](#log-levels)
- [Logging Patterns](#logging-patterns)
- [Environment Configuration](#environment-configuration)
- [Best Practices](#best-practices)
- [Production Deployment](#production-deployment)

---

## Why Structured Logging?

### Problems with console.log

```typescript
// WRONG - console.log in production code
console.log('User logged in:', userId)
console.log('Error:', error.message)
```

**Issues:**

- No timestamps or context
- Not searchable in production logs
- Can't filter by severity
- Loses information (error stack traces)
- Not production-ready

### Structured Logging Solution

```typescript
// CORRECT - Structured logging with pino
import { logger } from '@/lib/logger'

logger.info({ userId }, 'User logged in')
logger.error({ error, userId }, 'Login failed')
```

**Benefits:**

- **Searchable**: `grep '"userId":"123"' logs.json` finds all operations for that user
- **Structured data**: See actual values, not just strings
- **Production-ready**: Works in development AND production
- **Automatic timestamps**: Every log has a timestamp
- **Context preservation**: Error stack traces, request IDs, etc.

---

## Quick Start

### 1. Import the Logger

```typescript
import { logger } from '@/lib/logger'
```

### 2. Basic Usage

```typescript
// Simple message
logger.info('Application started')

// With context (PREFERRED)
logger.info({ userId: '123', email: 'user@example.com' }, 'User logged in')

// Error logging
try {
  await riskyOperation()
} catch (error) {
  logger.error({ error }, 'Operation failed')
  throw error
}
```

### 3. Output Examples

**Development (Pretty Print):**

```
[10:23:45] INFO: User logged in
  userId: "123"
  email: "user@example.com"
```

**Production (JSON):**

```json
{
  "level": "info",
  "time": 1640000000000,
  "userId": "123",
  "email": "user@example.com",
  "msg": "User logged in"
}
```

---

## Log Levels

### Available Levels (Ordered by Severity)

| Level   | When to Use                                                    | Shown in Production? |
| ------- | -------------------------------------------------------------- | -------------------- |
| `trace` | Very detailed debugging (e.g., function entry/exit)            | No                   |
| `debug` | Debugging information (e.g., variable values, execution paths) | No                   |
| `info`  | General informational messages (e.g., "User logged in")        | Yes                  |
| `warn`  | Warning messages (e.g., deprecated API usage)                  | Yes                  |
| `error` | Error messages (e.g., caught exceptions)                       | Yes                  |
| `fatal` | Critical errors that cause application termination             | Yes                  |

### Usage Examples

```typescript
// TRACE - Very detailed (hidden in production)
logger.trace({ functionName: 'getUserById', userId }, 'Function entry')

// DEBUG - Execution paths (hidden in production)
logger.debug({ userId, role }, 'Checking user permissions')

// INFO - Important events (shown in production)
logger.info({ userId }, 'User login successful')

// WARN - Recoverable issues (shown in production)
logger.warn({ userId, attempt: 3 }, 'User failed login attempt')

// ERROR - Caught exceptions (shown in production)
logger.error({ error, userId }, 'Database query failed')

// FATAL - Critical failure (shown in production)
logger.fatal({ error }, 'Database connection lost, shutting down')
```

---

## Logging Patterns

### Pattern 1: Database Operations

```typescript
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'

async function getUserById(id: string) {
  logger.debug({ userId: id }, 'Fetching user from database')

  const user = await prisma.user.findUnique({ where: { id } })

  if (!user) {
    logger.warn({ userId: id }, 'User not found')
    return null
  }

  logger.info({ userId: id, email: user.email }, 'User fetched successfully')
  return user
}
```

**Why this pattern?**

- `debug` for entry point (hidden in production)
- `warn` for expected errors (404s)
- `info` for success (shown in production)
- Includes context (userId, email) for debugging

### Pattern 2: API Route Handlers

```typescript
import { logger } from '@/lib/logger'

export async function POST(request: Request) {
  const body = await request.json()
  logger.info({ endpoint: '/api/users', method: 'POST' }, 'Received user creation request')

  try {
    const user = await createUser(body)
    logger.info({ userId: user.id }, 'User created successfully')
    return Response.json(user)
  } catch (error) {
    logger.error({ error, body }, 'Failed to create user')
    return Response.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
```

**Why this pattern?**

- Log request entry with endpoint context
- Log success with user ID for tracing
- Log errors with full error object and request body
- All logs are correlated by timestamp

### Pattern 3: Server Actions

```typescript
'use server'

import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'

export async function deleteUser(userId: string) {
  logger.info({ userId }, 'Starting user deletion')

  try {
    await prisma.user.delete({ where: { id: userId } })
    logger.info({ userId }, 'User deleted successfully')
    return { success: true }
  } catch (error) {
    logger.error({ error, userId }, 'Failed to delete user')
    return { success: false, error: 'Deletion failed' }
  }
}
```

### Pattern 4: Batch Operations

```typescript
import { logger } from '@/lib/logger'

async function processBatchUsers(userIds: string[]) {
  logger.info({ count: userIds.length }, 'Starting batch user processing')

  const results = { success: 0, failed: 0 }

  for (const id of userIds) {
    logger.debug({ userId: id }, 'Processing user')

    try {
      await updateUser(id)
      results.success++
      logger.info({ userId: id }, 'User processed successfully')
    } catch (error) {
      results.failed++
      logger.error({ error, userId: id }, 'Failed to process user')
      // Continue processing other users
    }
  }

  logger.info(
    { total: userIds.length, success: results.success, failed: results.failed },
    'Batch processing completed'
  )

  return results
}
```

**Why this pattern?**

- Log batch start with count
- Log each iteration at debug level
- Log errors but continue processing
- Log summary with success/failure counts

### Pattern 5: Module-Specific Loggers

For larger features, create child loggers with module context:

```typescript
// In src/lib/auth/session.ts
import { createLogger } from '@/lib/logger'

const logger = createLogger({ module: 'auth' })

export async function createSession(userId: string) {
  logger.info({ userId }, 'Creating session')
  // All logs automatically include { module: 'auth' }

  const session = await generateSession(userId)
  logger.info({ userId, sessionId: session.id }, 'Session created')

  return session
}
```

**Output (automatically includes module):**

```json
{"level":"info","module":"auth","userId":"123","msg":"Creating session"}
{"level":"info","module":"auth","userId":"123","sessionId":"abc","msg":"Session created"}
```

---

## Environment Configuration

### Development Environment

```bash
# .env.local (default settings)
NODE_ENV=development
LOG_LEVEL=debug
```

**Behavior:**

- Pretty-printed, colorized output
- Shows all log levels (trace, debug, info, warn, error, fatal)
- Easier to read during development

### Production Environment

```bash
# Production environment variables (Vercel, Railway, etc.)
NODE_ENV=production
LOG_LEVEL=info
```

**Behavior:**

- JSON-formatted output (one line per log)
- Hides trace and debug logs (only info, warn, error, fatal)
- Optimized for log aggregation services

### Custom Log Levels

You can override the log level for specific debugging:

```bash
# Show all logs including trace
LOG_LEVEL=trace

# Only show warnings and errors
LOG_LEVEL=warn

# Only show errors
LOG_LEVEL=error
```

---

## Best Practices

### 1. Always Include Context

```typescript
// BAD - No context
logger.info('User updated')

// GOOD - Include relevant IDs and data
logger.info({ userId, email, updatedFields: ['name', 'email'] }, 'User updated')
```

### 2. Log Errors with Full Context

```typescript
// BAD - Loses stack trace
logger.error(`Error: ${error.message}`)

// GOOD - Include error object and context
logger.error({ error, userId, operation: 'update' }, 'Failed to update user')
```

### 3. Use Appropriate Log Levels

```typescript
// BAD - Everything at info level
logger.info('Checking permissions...')
logger.info('User has admin role')
logger.info('Permission check passed')

// GOOD - Use debug for execution paths
logger.debug({ userId, role }, 'Checking permissions')
logger.debug({ userId, role: 'admin' }, 'User has admin role')
logger.info({ userId }, 'Permission check passed')
```

### 4. Don't Log Sensitive Data

```typescript
// BAD - Logs password
logger.info({ email, password }, 'User login')

// GOOD - Exclude sensitive fields
logger.info({ email }, 'User login')
```

### 5. Log Before and After Important Operations

```typescript
async function chargePayment(userId: string, amount: number) {
  logger.info({ userId, amount }, 'Starting payment charge')

  try {
    const result = await stripe.charges.create({ amount, currency: 'usd' })
    logger.info({ userId, amount, chargeId: result.id }, 'Payment charged successfully')
    return result
  } catch (error) {
    logger.error({ error, userId, amount }, 'Payment charge failed')
    throw error
  }
}
```

### 6. Use Structured Data, Not String Templates

```typescript
// BAD - String concatenation
logger.info(`User ${userId} updated email to ${email}`)

// GOOD - Structured data
logger.info({ userId, email }, 'User updated email')
```

**Why?** The structured version is searchable:

```bash
# Find all operations for user 123
grep '"userId":"123"' logs.json

# Find all email updates
grep '"msg":"User updated email"' logs.json
```

---

## Production Deployment

### Log Aggregation Services

For production, integrate with log aggregation services:

**Popular Options:**

- **Datadog** - Full observability platform
- **Logtail (Better Stack)** - Simple, affordable log management
- **Axiom** - Serverless log analytics
- **CloudWatch** (AWS) - If deployed to AWS

### Example: Logtail Integration

1. Sign up for Logtail (free tier available)
2. Get your source token
3. Install Logtail transport:

```bash
npm install @logtail/pino
```

4. Update logger configuration:

```typescript
// src/lib/logger.ts
import pino from 'pino'
import { createWriteStream } from '@logtail/pino'

const stream = createWriteStream(process.env.LOGTAIL_SOURCE_TOKEN!)

export const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
  },
  stream
)
```

5. Add environment variable:

```bash
LOGTAIL_SOURCE_TOKEN=your-token-here
```

### Searching Production Logs

With structured JSON logs, you can search by any field:

```bash
# Find all errors for a specific user
grep '"userId":"123"' logs.json | grep '"level":"error"'

# Find all database errors
grep '"msg":"Database query failed"' logs.json

# Count errors per user
grep '"level":"error"' logs.json | jq -r '.userId' | sort | uniq -c
```

---

## Common Mistakes to Avoid

### Mistake 1: Using console.log Instead of Logger

```typescript
// WRONG
console.log('User logged in')

// CORRECT
logger.info({ userId }, 'User logged in')
```

### Mistake 2: Logging Too Much at Info Level

```typescript
// WRONG - Floods production logs
logger.info('Entering function')
logger.info('Validating input')
logger.info('Input validated')
logger.info('Calling database')

// CORRECT - Use debug for execution paths
logger.debug('Validating user input')
logger.info({ userId }, 'User login successful')
```

### Mistake 3: Not Logging Errors

```typescript
// WRONG - Silent failure
try {
  await saveUser(user)
} catch (error) {
  // Error is lost!
}

// CORRECT - Log and handle
try {
  await saveUser(user)
} catch (error) {
  logger.error({ error, userId: user.id }, 'Failed to save user')
  throw error // Re-throw if needed
}
```

### Mistake 4: Logging Objects as Strings

```typescript
// WRONG - Loses structure
logger.info(`User: ${JSON.stringify(user)}`)

// CORRECT - Log as structured data
logger.info({ user }, 'User data')
```

---

## Summary

**Key Takeaways:**

1. Always use `logger` instead of `console.log`
2. Include context (user IDs, request data) in all logs
3. Use appropriate log levels (debug for paths, info for events, error for exceptions)
4. Log before and after important operations
5. Never log sensitive data (passwords, tokens)
6. Use structured data, not string templates
7. Set `LOG_LEVEL=info` in production to hide debug logs

**Next Steps:**

- Review the [.claude file](../.claude) for AI coding patterns
- See [Code Quality Guide](./Code-Quality.md) for ESLint rules
- Check [Testing Guide](./Testing-Guide.md) for testing best practices
