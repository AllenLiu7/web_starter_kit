import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

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

test('Button renders with different variants', () => {
  const { rerender } = render(<Button variant="destructive">Delete</Button>)
  expect(screen.getByRole('button')).toHaveClass('bg-destructive')

  rerender(<Button variant="outline">Outline</Button>)
  expect(screen.getByRole('button')).toHaveClass('border')

  rerender(<Button variant="ghost">Ghost</Button>)
  expect(screen.getByRole('button')).toHaveClass('hover:bg-accent')
})

test('Button can be disabled', () => {
  render(<Button disabled>Disabled</Button>)
  expect(screen.getByRole('button')).toBeDisabled()
})

test('Button renders with different sizes', () => {
  const { rerender } = render(<Button size="sm">Small</Button>)
  expect(screen.getByRole('button')).toHaveClass('h-8')

  rerender(<Button size="lg">Large</Button>)
  expect(screen.getByRole('button')).toHaveClass('h-10')
})
