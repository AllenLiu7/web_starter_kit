import pino from 'pino'

/**
 * Structured logger configuration for the application
 *
 * Features:
 * - Environment-based log levels (development vs production)
 * - Pretty printing in development for readability
 * - JSON format in production for log aggregation
 * - Automatic timestamp and context tracking
 *
 * Usage:
 * ```typescript
 * import { logger } from '@/lib/logger'
 *
 * logger.info({ userId: '123' }, 'User logged in')
 * logger.error({ error: err, userId: '123' }, 'Failed to save user')
 * ```
 */

const isDevelopment = process.env.NODE_ENV === 'development'
const logLevel = process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info')

export const logger = pino({
  level: logLevel,
  // Pretty print in development, JSON in production
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
  // Add base fields to all logs
  base: {
    env: process.env.NODE_ENV,
  },
})

/**
 * Create a child logger with additional context
 *
 * Useful for adding module/feature-specific context to all logs:
 * ```typescript
 * const authLogger = createLogger({ module: 'auth' })
 * authLogger.info({ userId }, 'Login attempt')
 * // Output: { module: 'auth', userId: '123', msg: 'Login attempt' }
 * ```
 */
export function createLogger(bindings: Record<string, unknown>) {
  return logger.child(bindings)
}

/**
 * Log levels:
 * - trace: Very detailed debugging (e.g., function entry/exit)
 * - debug: Debugging information (e.g., variable values, execution paths)
 * - info: General informational messages (e.g., "User logged in")
 * - warn: Warning messages (e.g., deprecated API usage)
 * - error: Error messages (e.g., caught exceptions)
 * - fatal: Critical errors that cause application termination
 */
