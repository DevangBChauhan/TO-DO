import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('SDET Command Center — Evidence Report E2E Tests', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await page.goto('/');
  });

  test('should generate and display report preview with aggregated metrics', async ({ page }) => {
    await dashboardPage.openReportModal();

    // Click Generate in Config modal
    await page.click('button:has-text("Generate Report"):visible');

    // Verify Report Preview modal appears
    await expect(page.locator('text=Report Preview')).toBeVisible();
    await expect(page.locator('text=EXECUTIVE SUMMARY')).toBeVisible();

    // Verify Download HTML and Print buttons exist
    await expect(page.locator('button:has-text("Download HTML")')).toBeVisible();
    await expect(page.locator('button:has-text("Print")')).toBeVisible();

    // Close preview
    await page.click('button:has-text("Close")');
    await expect(page.locator('text=Report Preview')).toBeHidden();
  });
});
