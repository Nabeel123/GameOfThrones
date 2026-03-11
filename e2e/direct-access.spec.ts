import { test, expect } from '@playwright/test'

test.describe('Direct URL access', () => {
  test('navigating directly to / shows the character list', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /game of thrones/i })).toBeVisible()
  })

  test('navigating directly to /character/1 shows that character detail', async ({ page }) => {
    await page.goto('/character/1')
    await page.waitForSelector('dl', { timeout: 15000 })
    await expect(page.locator('dl')).toBeVisible()
  })

  test('navigating directly to /character/99999 shows not-found page', async ({ page }) => {
    await page.goto('/character/99999')
    await expect(page.getByText(/character not found/i)).toBeVisible({ timeout: 15000 })
  })

  test('navigating to an unknown path shows not-found page', async ({ page }) => {
    await page.goto('/unknown-path-xyz')
    await expect(page.getByText(/character not found/i)).toBeVisible({ timeout: 10000 })
  })
})
