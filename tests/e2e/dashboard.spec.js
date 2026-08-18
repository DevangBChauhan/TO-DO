import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('SDET Command Center — Dashboard E2E Tests', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await page.goto('/');
  });

  test('should display all 4 primary telemetry KPI cards', async () => {
    await expect(dashboardPage.overallProgress).toBeVisible();
    await expect(dashboardPage.currentPhase).toBeVisible();
    await expect(dashboardPage.statusBadge).toBeVisible();
    await expect(dashboardPage.timeline).toBeVisible();
  });

  test('should navigate to Focus Timer when clicking Start Session', async ({ page }) => {
    await dashboardPage.startFocusSession();
    await expect(page).toHaveURL(/.*focus|.*/);
    await expect(page.locator('.timer-big-digits')).toBeVisible();
  });

  test('should open and close the Generate Report modal', async () => {
    await dashboardPage.openReportModal();
    await expect(dashboardPage.reportModal).toBeVisible();
    
    // Close modal
    await dashboardPage.page.click('button:has-text("Cancel")');
    await expect(dashboardPage.reportModal).toBeHidden();
  });
});
