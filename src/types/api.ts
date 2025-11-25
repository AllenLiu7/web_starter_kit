/**
 * Standardized API Response Types
 *
 * AI-friendly type definitions for consistent API responses.
 * Use these types for all API routes and server actions to maintain
 * predictable response structures across the application.
 *
 * Usage:
 * ```typescript
 * import type { ApiResponse, PaginatedResponse } from '@/types/api'
 *
 * export async function GET(): Promise<Response> {
 *   const response: ApiResponse<User> = {
 *     success: true,
 *     data: user
 *   }
 *   return Response.json(response)
 * }
 * ```
 */

/**
 * Standard API response type
 * All API endpoints should return this structure for consistency
 *
 * @example Success response
 * const response: ApiResponse<User> = {
 *   success: true,
 *   data: { id: '123', name: 'John' }
 * }
 *
 * @example Error response
 * const response: ApiResponse<User> = {
 *   success: false,
 *   error: 'User not found',
 *   code: 'NOT_FOUND'
 * }
 */
export type ApiResponse<T> =
  | {
      success: true
      data: T
    }
  | {
      success: false
      error: string
      code?: string
    }

/**
 * Paginated response type
 * Use for endpoints that return lists with pagination
 *
 * @example
 * const response: PaginatedResponse<User> = {
 *   success: true,
 *   data: {
 *     items: users,
 *     total: 100,
 *     page: 1,
 *     pageSize: 20,
 *     totalPages: 5
 *   }
 * }
 */
export type PaginatedResponse<T> = ApiResponse<{
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}>

/**
 * Pagination parameters
 * Use for query parameters in paginated endpoints
 *
 * @example
 * const params: PaginationParams = {
 *   page: 1,
 *   pageSize: 20
 * }
 */
export interface PaginationParams {
  page: number
  pageSize: number
}

/**
 * Sort parameters
 * Use for query parameters in sortable endpoints
 *
 * @example
 * const params: SortParams = {
 *   sortBy: 'createdAt',
 *   sortOrder: 'desc'
 * }
 */
export interface SortParams {
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

/**
 * Filter parameters
 * Base interface for filtering, extend as needed
 *
 * @example
 * interface UserFilters extends FilterParams {
 *   role?: 'admin' | 'user'
 *   status?: 'active' | 'inactive'
 * }
 */
export interface FilterParams {
  search?: string
}

/**
 * List query parameters
 * Combines pagination, sorting, and filtering
 *
 * @example
 * const params: ListQueryParams = {
 *   page: 1,
 *   pageSize: 20,
 *   sortBy: 'name',
 *   sortOrder: 'asc',
 *   search: 'john'
 * }
 */
export interface ListQueryParams extends PaginationParams, Partial<SortParams>, FilterParams {}

/**
 * Helper to create success response
 *
 * @example
 * return Response.json(successResponse(user))
 */
export function successResponse<T>(data: T): ApiResponse<T> {
  return { success: true, data }
}

/**
 * Helper to create error response
 *
 * @example
 * return Response.json(errorResponse('User not found', 'NOT_FOUND'), { status: 404 })
 */
export function errorResponse(error: string, code?: string): ApiResponse<never> {
  return { success: false, error, code }
}
