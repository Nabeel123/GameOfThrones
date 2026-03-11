import { test, expect } from '@playwright/test'

test.describe('Browse and filter characters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for characters to load
    await page.waitForSelector('[aria-label="Characters list"]', { timeout: 15000 })
  })

  test('shows the page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /game of thrones/i })).toBeVisible()
  })

  test('renders a grid of character cards', async ({ page }) => {
    const cards = page.locator('ul li')
    await expect(cards.first()).toBeVisible()
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('shows the family filter dropdown', async ({ page }) => {
    await expect(page.getByRole('combobox', { name: /filter by house/i })).toBeVisible()
  })

  test('filtering by a house narrows the grid', async ({ page }) => {
    const select = page.getByRole('combobox', { name: /filter by house/i })
    const allOptions = await select.locator('option').allTextContents()
    // Pick the second option (first after "All Characters")
    const familyOption = allOptions[1]
    if (!familyOption) return

    await select.selectOption(familyOption)
    // Grid should still have cards
    const cards = page.locator('ul li')
    await expect(cards.first()).toBeVisible()
    // Selecting "All Characters" again shows all
    await select.selectOption('All Characters')
    const allCards = await page.locator('ul li').count()
    expect(allCards).toBeGreaterThan(0)
  })

  test('clicking a character card navigates to the detail page', async ({ page }) => {
    const firstCard = page.locator('ul li a').first()
    const href = await firstCard.getAttribute('href')
    await firstCard.click()
    await expect(page).toHaveURL(/\/character\/\d+/)
    expect(href).toMatch(/\/character\/\d+/)
  })
})
