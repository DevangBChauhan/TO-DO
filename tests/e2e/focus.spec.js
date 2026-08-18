import { test, expect } from '@playwright/test';
import { FocusPage } from '../pages/FocusPage';

test.describe('SDET Command Center — Focus Timer E2E Tests', () => {
  let focusPage;

  test.beforeEach(async ({ page }) => {
    focusPage = new FocusPage(page);
    await page.goto('/');
    await focusPage.openFocus();
  });

  test('should display centered countdown timer digits', async () => {
    await expect(focusPage.timerDigits).toBeVisible();
    await expect(focusPage.timerDigits).toHaveText(/\d{2}:\d{2}/);
  });

  test('should switch between Timer, Stopwatch, and Break modes', async () => {
    await focusPage.switchMode('stopwatch');
    await expect(focusPage.timerDigits).toHaveText('00:00');

    await focusPage.switchMode('break');
    await expect(focusPage.timerDigits).toHaveText(/05:00|15:00/);

    await focusPage.switchMode('timer');
    await expect(focusPage.timerDigits).toHaveText('25:00');
  });

  test('should adjust duration using quick preset pills', async () => {
    await focusPage.selectQuickPreset(45);
    await expect(focusPage.timerDigits).toHaveText('45:00');

    await focusPage.selectQuickPreset(15);
    await expect(focusPage.timerDigits).toHaveText('15:00');
  });
});
