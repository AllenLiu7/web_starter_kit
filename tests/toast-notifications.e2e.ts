import { test, expect } from '@playwright/test'

test.describe('Toast Notifications', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display toast when Success button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: 'Success Toast' }).click()

    // Wait for toast to appear
    const toast = page.getByText('Success! Operation completed.')
    await expect(toast).toBeVisible()
  })

  test('should display error toast when Error button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: 'Error Toast' }).click()

    const toast = page.getByText('Error! Something went wrong.')
    await expect(toast).toBeVisible()
  })

  test('should display info toast when Info button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: 'Info Toast' }).click()

    const toast = page.getByText('Info: This is an informational message.')
    await expect(toast).toBeVisible()
  })

  test('should display warning toast when Warning button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: 'Warning Toast' }).click()

    const toast = page.getByText('Warning: Please be careful!')
    await expect(toast).toBeVisible()
  })

  test('should display loading then success toast for Promise button', async ({ page }) => {
    await page.getByRole('button', { name: 'Promise Toast' }).click()

    // Check for loading state
    const loadingToast = page.getByText('Loading...')
    await expect(loadingToast).toBeVisible()

    // Wait for success state
    const successToast = page.getByText('Data loaded successfully!')
    await expect(successToast).toBeVisible({ timeout: 5000 })
  })

  test('toast should disappear after timeout', async ({ page }) => {
    await page.getByRole('button', { name: 'Success Toast' }).click()

    const toast = page.getByText('Success! Operation completed.')
    await expect(toast).toBeVisible()

    // Wait for toast to disappear (default timeout is 4 seconds)
    await expect(toast).toBeHidden({ timeout: 6000 })
  })
})
