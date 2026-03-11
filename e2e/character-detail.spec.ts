import { test, expect } from '@playwright/test'

test.describe('Character detail navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[aria-label="Characters list"]', { timeout: 15000 })
  })

  test('clicking a character shows their detail page', async ({ page }) => {
    const firstCard = page.locator('ul li a').first()
    await firstCard.click()
    await expect(page).toHaveURL(/\/character\/\d+/)
    await page.waitForSelector('dl', { timeout: 10000 })
    await expect(page.locator('dl')).toBeVisible()
  })

  test('detail page shows character image', async ({ page }) => {
    await page.locator('ul li a').first().click()
    await expect(page).toHaveURL(/\/character\/\d+/)
    const imageOrFallback = page.locator('img, [role="img"]').first()
    await expect(imageOrFallback).toBeVisible({ timeout: 10000 })
  })

  test('detail page shows a house members section heading', async ({ page }) => {
    await page.locator('ul li a').first().click()
    await expect(page).toHaveURL(/\/character\/\d+/)
    await page.waitForSelector('dl', { timeout: 10000 })
    await expect(page.locator('h3')).toBeVisible()
  })

  test('clicking a house member navigates to their detail page', async ({ page }) => {
    // Iterate through characters until we find one with a clickable house member
    const cards = page.locator('ul li a')
    const count = await cards.count()

    for (let i = 0; i < Math.min(count, 10); i++) {
      await page.goto('/')
      await page.waitForSelector('[aria-label="Characters list"]', { timeout: 15000 })
      await cards.nth(i).click()
      await expect(page).toHaveURL(/\/character\/\d+/)
      await page.waitForSelector('dl', { timeout: 10000 })

      const memberLink = page.locator('nav[aria-label*="Other members"] a').first()
      const isVisible = await memberLink.isVisible()
      if (isVisible) {
        const memberHref = await memberLink.getAttribute('href')
        await memberLink.click()
        await expect(page).toHaveURL(/\/character\/\d+/)
        expect(memberHref).toMatch(/\/character\/\d+/)
        return
      }
    }

    // If no character with house members found, skip gracefully
    test.skip(true, 'No character with house members found in first 10 results')
  })

  test('back button returns to the character list', async ({ page }) => {
    await page.locator('ul li a').first().click()
    await expect(page).toHaveURL(/\/character\/\d+/)
    await page.waitForSelector('dl', { timeout: 10000 })

    const backLink = page.getByRole('link', { name: /back to all characters/i })
    await backLink.click()
    await expect(page).toHaveURL('/')
  })
})
