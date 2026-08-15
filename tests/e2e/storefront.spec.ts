import { expect, test } from '@playwright/test'
test.setTimeout(120_000)

async function dismissConsent(page: import('@playwright/test').Page) {
  const essential = page.getByRole('button', { name: /use essential only/i })
  await essential
    .waitFor({ state: 'visible', timeout: 1_500 })
    .catch(() => undefined)
  if (await essential.isVisible().catch(() => false)) await essential.click()
}

test('browse, add to basket, and reach validated demo checkout', async ({
  page,
}) => {
  await page.goto('/')
  await dismissConsent(page)
  await expect(
    page.getByRole('heading', { name: /workspace essentials/i }),
  ).toBeVisible()
  await page.getByRole('link', { name: /shop all products/i }).click()
  await page
    .getByRole('link', { name: /arc task lamp/i })
    .first()
    .click()
  await page
    .getByRole('button', { name: /add to basket/i })
    .first()
    .click()
  await page.getByRole('link', { name: /basket with 1/i }).click()
  await expect(
    page
      .locator('.basket-lines')
      .getByRole('heading', { name: 'Arc task lamp' }),
  ).toBeVisible()
  await page.getByRole('button', { name: /secure checkout/i }).click()
  await expect(
    page.getByRole('heading', { name: /demo mode stops/i }),
  ).toBeVisible()
})
test('natural language search and mobile guide', async ({ page }) => {
  await page.goto('/search')
  await dismissConsent(page)
  await page
    .getByPlaceholder(/portable desk setup/i)
    .fill('portable desk setup under £50')
  await expect(page.getByText(/current matches/i)).toBeVisible()
  await page.goto('/')
  await dismissConsent(page)
  await page
    .getByRole('button', { name: /(open product guide|product help)/i })
    .first()
    .click()
  await expect(
    page.getByRole('dialog', { name: /product guide/i }),
  ).toBeVisible()
})
test('analytics and Studio setup are reachable', async ({ page }) => {
  await page.goto('/admin/analytics')
  await expect(
    page.getByRole('heading', { name: 'Store performance' }),
  ).toBeVisible()
  await page.goto('/studio', { waitUntil: 'domcontentloaded' })
  await expect(
    page.getByRole('heading', { name: /connect sanity studio/i }),
  ).toBeVisible()
})
