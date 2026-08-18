import { test, expect } from '@playwright/test';
import { RoadmapPage } from '../pages/RoadmapPage';

test.describe('SDET Command Center — Roadmap E2E Tests', () => {
  let roadmapPage;

  test.beforeEach(async ({ page }) => {
    roadmapPage = new RoadmapPage(page);
    await page.goto('/');
    await roadmapPage.openRoadmap();
  });

  test('should display Roadmap Management header and Phase Directory', async () => {
    await expect(roadmapPage.page.locator('h1:has-text("Roadmap Management")')).toBeVisible();
    await expect(roadmapPage.phaseDirectory).toBeVisible();
  });

  test('should successfully create a new Phase', async () => {
    const uniquePhaseName = `API Automation & Frameworks ${Date.now()}`;
    await roadmapPage.createPhase(uniquePhaseName, 'Weeks 17 - 20');
    
    // Assert new phase is rendered
    await expect(roadmapPage.page.locator(`text=${uniquePhaseName}`)).toBeVisible();
  });

  test('should toggle task completion and update phase progress', async () => {
    // Expand first week if hidden
    const hideToggle = roadmapPage.page.locator('button:has-text("Tasks ▾")').first();
    if (await hideToggle.isVisible()) {
      await hideToggle.click();
    }

    const firstTask = roadmapPage.page.locator('[data-testid="task-item"]').first();
    await expect(firstTask).toBeVisible();

    // Toggle task
    const checkbox = firstTask.locator('[data-testid="complete-task"]');
    await checkbox.click();

    // Verify task is marked completed
    await expect(checkbox).toHaveText('✓');
  });
});
