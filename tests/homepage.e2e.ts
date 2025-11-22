import { test, expect } from '@playwright/test'

test.describe('Homepage - System Status Page', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Next.js 15 Starter Kit/)
  })

  test('should display the system status heading', async ({ page }) => {
    await page.goto('/')
    const heading = page.getByRole('heading', { name: 'System Status Check', level: 1 })
    await expect(heading).toBeVisible()
  })

  test('should display all status components in the table', async ({ page }) => {
    await page.goto('/')

    // Check that key components are listed in the table
    await expect(page.getByRole('cell', { name: 'Next.js 15' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'TypeScript' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Tailwind CSS 3.4' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'shadcn/ui' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Middleware Auth' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'SEO & Metadata' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Toast Notifications (Sonner)' })).toBeVisible()
  })

  test('should show connected status for configured components', async ({ page }) => {
    await page.goto('/')

    // Check for "Connected" status indicators
    const connectedStatuses = page.getByText('✓ Connected')
    await expect(connectedStatuses.first()).toBeVisible()
  })

  test('should display setup summary with component count', async ({ page }) => {
    await page.goto('/')

    const summary = page.getByText(/Connected:.*\/.*components/)
    await expect(summary).toBeVisible()
  })

  test('should display interactive demos section', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Interactive Demos' })).toBeVisible()
  })
})
