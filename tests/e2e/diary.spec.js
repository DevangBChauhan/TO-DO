import { test, expect } from '@playwright/test';
import { DiaryPage } from '../pages/DiaryPage';

test.describe('SDET Command Center — Study Diary E2E Tests', () => {
  let diaryPage;

  test.beforeEach(async ({ page }) => {
    diaryPage = new DiaryPage(page);
    await page.goto('/');
    await diaryPage.openDiary();
  });

  test('should display all 6 deliberate practice reflection fields', async () => {
    await expect(diaryPage.plannedInput).toBeVisible();
    await expect(diaryPage.completedInput).toBeVisible();
    await expect(diaryPage.learnedInput).toBeVisible();
    await expect(diaryPage.confusionInput).toBeVisible();
    await expect(diaryPage.mistakeInput).toBeVisible();
    await expect(diaryPage.tomorrowInput).toBeVisible();
  });

  test('should fill reflection prompts and save entry with success feedback', async () => {
    await diaryPage.fillDiary({
      planned: 'Write Playwright Page Objects for SDET Command Center',
      completed: 'Completed 6 Page Object classes and test suites',
      learned: 'Learned locator strategies and parallel worker execution',
      confusion: 'None',
      mistake: 'Avoided hardcoded selectors by using data-testid',
      tomorrow: 'Configure GitHub Actions CI pipeline',
    });

    await expect(diaryPage.savedSuccess).toBeVisible();
  });
});
