import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication - you might need to adjust this based on your auth setup
    await page.goto('/dashboard');
  });

  test('should show dashboard layout', async ({ page }) => {
    // Should have sidebar
    await expect(page.getByRole('navigation')).toBeVisible();

    // Should have main content area
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('should show desktop creation form', async ({ page }) => {
    // Click on create desktop button (adjust selector based on your UI)
    await page.getByRole('button', { name: /create desktop/i }).click();

    // Should show form
    await expect(page.getByLabel(/desktop name/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /create/i })).toBeVisible();
  });

  test('should show goals section', async ({ page }) => {
    // Navigate to goals
    await page.getByRole('link', { name: /goals/i }).click();

    // Should show goals content
    await expect(page.getByRole('heading', { name: /goals/i })).toBeVisible();
  });
});
