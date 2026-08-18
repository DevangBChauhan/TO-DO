import { test, expect } from '@playwright/test';
import { TodayPage } from '../pages/TodayPage';

test.describe('SDET Command Center — Today Protocol E2E Tests', () => {
  let todayPage;

  test.beforeEach(async ({ page }) => {
    todayPage = new TodayPage(page);
    await page.goto('/');
    await todayPage.openToday();
  });

  test('should display Today Protocol metrics and schedule', async () => {
    await expect(todayPage.page.locator('h1:has-text("Today\'s Protocol")')).toBeVisible();
    await expect(todayPage.page.locator('text=Today\'s Schedule')).toBeVisible();
  });

  test('should add a new daily task with scheduled time slot', async () => {
    const taskTitle = `Playwright POM Test Suite ${Date.now()}`;
    await todayPage.addNewTask(taskTitle, 'Coding', 'high', '14:00');

    // Assert task appears in list
    await expect(todayPage.page.locator(`text=${taskTitle}`)).toBeVisible();
  });

  test('should filter tasks by Category', async () => {
    await todayPage.filterByCategory('Coding');
    // Ensure category selection takes effect
    await expect(todayPage.categorySelect).toHaveValue('coding');
  });
});
