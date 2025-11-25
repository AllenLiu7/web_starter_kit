/**
 * Standardized Error Classes
 *
 * AI-friendly error handling with consistent patterns across the application.
 * All errors extend AppError for type-safe error handling and logging.
 *
 * Usage:
 * ```typescript
 * import { ValidationError, NotFoundError } from '@/lib/errors'
 *
 * throw new ValidationError('Email is required')
 * throw new NotFoundError('User')
 * ```
 */

/**
 * Base application error class
 * Extends Error with structured error codes and HTTP status codes
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'AppError'
    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Validation Error (400)
 * Use for input validation failures, missing required fields, invalid formats
 *
 * @example
 * if (!email) {
 *   throw new ValidationError('Email is required')
 * }
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'ValidationError'
  }
}

/**
 * Not Found Error (404)
 * Use when a requested resource doesn't exist
 *
 * @example
 * if (!user) {
 *   throw new NotFoundError('User')
 * }
 */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}

/**
 * Unauthorized Error (401)
 * Use when authentication is required but not provided
 *
 * @example
 * if (!session) {
 *   throw new UnauthorizedError()
 * }
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401)
    this.name = 'UnauthorizedError'
  }
}

/**
 * Forbidden Error (403)
 * Use when user is authenticated but lacks permissions
 *
 * @example
 * if (user.role !== 'admin') {
 *   throw new ForbiddenError('Admin access required')
 * }
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 'FORBIDDEN', 403)
    this.name = 'ForbiddenError'
  }
}

/**
 * Conflict Error (409)
 * Use when the request conflicts with current state (e.g., duplicate email)
 *
 * @example
 * if (existingUser) {
 *   throw new ConflictError('Email already registered')
 * }
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409)
    this.name = 'ConflictError'
  }
}

/**
 * Type guard to check if error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}
