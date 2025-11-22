import { test, expect } from '@playwright/test'

test.describe('Middleware Authentication', () => {
  test('homepage (public route) should be accessible without authentication', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/')
    await expect(page.getByRole('heading', { name: 'System Status Check' })).toBeVisible()
  })

  test('should redirect to /login when accessing /dashboard without authentication', async ({
    page,
  }) => {
    // Attempt to access protected route
    await page.goto('/dashboard')

    // Should redirect to /login (middleware intercepts)
    // Note: /login doesn't exist yet, so we'll get a 404, but the URL should change
    await expect(page).toHaveURL('/login')
  })

  test('middleware status should show as connected on homepage', async ({ page }) => {
    await page.goto('/')

    // Find the middleware auth row in the status table
    const middlewareRow = page.locator('tr:has-text("Middleware Auth")')
    await expect(middlewareRow).toBeVisible()

    // Check that it shows as connected
    await expect(middlewareRow.getByText('✓ Connected')).toBeVisible()
  })

  test('middleware demo section should explain protection behavior', async ({ page }) => {
    await page.goto('/')

    // Find the middleware demo section heading
    await expect(
      page.getByRole('heading', { name: 'Middleware Authentication Protection' })
    ).toBeVisible()

    // Check for explanation of protected routes in the configuration list
    await expect(page.getByText('Protected routes: /dashboard/*')).toBeVisible()
  })

  test('clicking dashboard link should trigger middleware redirect', async ({ page }) => {
    await page.goto('/')

    // Find and click the "Try Accessing /dashboard" button
    await page.getByRole('link', { name: 'Try Accessing /dashboard' }).click()

    // Should be redirected to /login
    await expect(page).toHaveURL('/login')
  })
})
