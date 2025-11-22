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

  test('removes falsy values', () => {
    const result = cn('text-red-500', false, null, undefined, 'bg-blue-500')
    expect(result).toBe('text-red-500 bg-blue-500')
  })

  test('merges Tailwind classes correctly (tw-merge)', () => {
    const result = cn('px-4 py-2', 'px-6')
    expect(result).toBe('py-2 px-6') // px-6 should override px-4
  })

  test('handles empty input', () => {
    const result = cn()
    expect(result).toBe('')
  })

  test('handles array of class names', () => {
    const result = cn(['text-red-500', 'bg-blue-500'])
    expect(result).toBe('text-red-500 bg-blue-500')
  })
})
