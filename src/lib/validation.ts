/**
 * Input Validation Helpers
 *
 * AI-friendly validation utilities for early input checking.
 * Following the principle: "Validate inputs and preconditions early,
 * and return or throw errors at the earliest point of failure."
 *
 * Usage:
 * ```typescript
 * import { validateRequired, validateEmail } from '@/lib/validation'
 *
 * const email = validateRequired(req.body.email, 'email')
 * const validEmail = validateEmail(email)
 * ```
 */

import { ValidationError } from './errors'
import { isNotNull, isString } from './guards'

/**
 * Validates that a value is not null or undefined
 * Throws ValidationError if value is missing
 *
 * @example
 * const userId = validateRequired(req.body.userId, 'userId')
 * // userId is guaranteed to be non-null here
 */
export function validateRequired<T>(value: T | null | undefined, fieldName: string): T {
  if (!isNotNull(value)) {
    throw new ValidationError(`${fieldName} is required`)
  }
  return value
}

/**
 * Validates email format using standard regex
 * Throws ValidationError if format is invalid
 *
 * @example
 * const email = validateEmail(req.body.email)
 * // email is guaranteed to be valid format here
 */
export function validateEmail(email: string): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!isString(email)) {
    throw new ValidationError('Email must be a string')
  }

  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format')
  }

  return email.toLowerCase().trim()
}

/**
 * Validates URL format
 * Throws ValidationError if format is invalid
 *
 * @example
 * const websiteUrl = validateUrl(req.body.website)
 * // websiteUrl is guaranteed to be valid URL here
 */
export function validateUrl(url: string): string {
  if (!isString(url)) {
    throw new ValidationError('URL must be a string')
  }

  try {
    new URL(url)
    return url
  } catch {
    throw new ValidationError('Invalid URL format')
  }
}

/**
 * Validates string length constraints
 * Throws ValidationError if constraints are violated
 *
 * @example
 * const password = validateStringLength(
 *   req.body.password,
 *   'password',
 *   { min: 8, max: 100 }
 * )
 */
export function validateStringLength(
  value: string,
  fieldName: string,
  constraints: { min?: number; max?: number }
): string {
  if (!isString(value)) {
    throw new ValidationError(`${fieldName} must be a string`)
  }

  if (constraints.min !== undefined && value.length < constraints.min) {
    throw new ValidationError(`${fieldName} must be at least ${constraints.min} characters`)
  }

  if (constraints.max !== undefined && value.length > constraints.max) {
    throw new ValidationError(`${fieldName} must be at most ${constraints.max} characters`)
  }

  return value
}

/**
 * Validates number range constraints
 * Throws ValidationError if constraints are violated
 *
 * @example
 * const age = validateNumberRange(
 *   req.body.age,
 *   'age',
 *   { min: 0, max: 120 }
 * )
 */
export function validateNumberRange(
  value: number,
  fieldName: string,
  constraints: { min?: number; max?: number }
): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new ValidationError(`${fieldName} must be a number`)
  }

  if (constraints.min !== undefined && value < constraints.min) {
    throw new ValidationError(`${fieldName} must be at least ${constraints.min}`)
  }

  if (constraints.max !== undefined && value > constraints.max) {
    throw new ValidationError(`${fieldName} must be at most ${constraints.max}`)
  }

  return value
}

/**
 * Validates that value is one of allowed options
 * Throws ValidationError if value is not in allowed list
 *
 * @example
 * const role = validateEnum(
 *   req.body.role,
 *   'role',
 *   ['admin', 'user', 'guest']
 * )
 */
export function validateEnum<T extends string>(
  value: string,
  fieldName: string,
  allowedValues: readonly T[]
): T {
  if (!isString(value)) {
    throw new ValidationError(`${fieldName} must be a string`)
  }

  if (!allowedValues.includes(value as T)) {
    throw new ValidationError(`${fieldName} must be one of: ${allowedValues.join(', ')}`)
  }

  return value as T
}

/**
 * Validates array constraints
 * Throws ValidationError if constraints are violated
 *
 * @example
 * const tags = validateArray(
 *   req.body.tags,
 *   'tags',
 *   { minLength: 1, maxLength: 10 }
 * )
 */
export function validateArray<T>(
  value: unknown,
  fieldName: string,
  constraints?: { minLength?: number; maxLength?: number }
): T[] {
  if (!Array.isArray(value)) {
    throw new ValidationError(`${fieldName} must be an array`)
  }

  if (constraints?.minLength !== undefined && value.length < constraints.minLength) {
    throw new ValidationError(`${fieldName} must contain at least ${constraints.minLength} items`)
  }

  if (constraints?.maxLength !== undefined && value.length > constraints.maxLength) {
    throw new ValidationError(`${fieldName} must contain at most ${constraints.maxLength} items`)
  }

  return value as T[]
}
