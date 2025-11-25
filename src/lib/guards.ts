/**
 * Type Guards and Runtime Checks
 *
 * AI-friendly runtime type checking that provides TypeScript type narrowing.
 * Use these to safely handle nullable values and ensure type safety at runtime.
 *
 * Usage:
 * ```typescript
 * import { isNotNull, isDefined, assertNever } from '@/lib/guards'
 *
 * if (isNotNull(user)) {
 *   // TypeScript knows user is not null here
 *   console.log(user.name)
 * }
 * ```
 */

/**
 * Type guard to check if a value is not null or undefined
 * Provides type narrowing for TypeScript
 *
 * @example
 * const user: User | null = getUser()
 * if (isNotNull(user)) {
 *   // user is User here (not null)
 *   logger.info({ userId: user.id }, 'User found')
 * }
 */
export function isNotNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

/**
 * Type guard to check if a value is defined (not undefined)
 * Useful for optional properties
 *
 * @example
 * const email: string | undefined = user.email
 * if (isDefined(email)) {
 *   // email is string here (not undefined)
 *   sendEmail(email)
 * }
 */
export function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined
}

/**
 * Type guard to check if a value is a string
 *
 * @example
 * if (isString(value)) {
 *   // value is string here
 *   console.log(value.toUpperCase())
 * }
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

/**
 * Type guard to check if a value is a number (and not NaN)
 *
 * @example
 * if (isNumber(value)) {
 *   // value is number here
 *   console.log(value.toFixed(2))
 * }
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value)
}

/**
 * Type guard to check if a value is a boolean
 *
 * @example
 * if (isBoolean(value)) {
 *   // value is boolean here
 *   return value ? 'Yes' : 'No'
 * }
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

/**
 * Type guard to check if a value is an object (and not null or array)
 *
 * @example
 * if (isObject(value)) {
 *   // value is object here
 *   console.log(Object.keys(value))
 * }
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Type guard to check if a value is an array
 *
 * @example
 * if (isArray(value)) {
 *   // value is array here
 *   console.log(value.length)
 * }
 */
export function isArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value)
}

/**
 * Exhaustiveness check for switch statements
 * Ensures all cases are handled in discriminated unions
 *
 * @example
 * type Status = 'pending' | 'active' | 'completed'
 *
 * function getColor(status: Status) {
 *   switch (status) {
 *     case 'pending':
 *       return 'yellow'
 *     case 'active':
 *       return 'green'
 *     case 'completed':
 *       return 'blue'
 *     default:
 *       return assertNever(status) // TypeScript error if case is missing
 *   }
 * }
 */
export function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(x)}`)
}

/**
 * Type guard to check if error is an Error instance
 * Useful in catch blocks where error type is unknown
 *
 * @example
 * try {
 *   await riskyOperation()
 * } catch (error) {
 *   if (isError(error)) {
 *     logger.error({ error }, error.message)
 *   }
 * }
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error
}
