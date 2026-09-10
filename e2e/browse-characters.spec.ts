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
    // The filter is a custom combobox + listbox, not a native <select>,
    // so drive it by clicking rather than selectOption().
    const select = page.getByRole('combobox', { name: /filter by house/i })
    // Scope to the grid so the open listbox's <li> options aren't counted as cards
    const cards = page.getByRole('region', { name: 'Characters list' }).getByRole('listitem')

    await expect(cards.first()).toBeVisible()
    const totalCount = await cards.count()

    // Pick the first house (index 0 is "All Characters")
    await select.click()
    const houseOption = page.getByRole('option').nth(1)
    const houseName = (await houseOption.locator('span').first().innerText()).trim()
    await houseOption.click()

    await expect(select).toHaveText(houseName)
    await expect(cards.first()).toBeVisible()
    await expect.poll(() => cards.count()).toBeLessThan(totalCount)

    // Selecting "All Characters" again restores the full list
    await select.click()
    await page.getByRole('option', { name: /^all characters/i }).click()
    await expect(cards).toHaveCount(totalCount)
  })

  test('clicking a character card navigates to the detail page', async ({ page }) => {
    const firstCard = page.locator('ul li a').first()
    const href = await firstCard.getAttribute('href')
    await firstCard.click()
    await expect(page).toHaveURL(/\/character\/\d+/)
    expect(href).toMatch(/\/character\/\d+/)
  })
})
