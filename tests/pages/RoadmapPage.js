import { BasePage } from './BasePage';

export class RoadmapPage extends BasePage {
  constructor(page) {
    super(page);
    this.addPhaseBtn = page.locator('button:has-text("+ Add Phase")');
    this.phaseDirectory = page.locator('.stat-card-title:has-text("PHASE DIRECTORY") + div');
    this.phaseCards = page.locator('[id^="phase-card-"]');
  }

  async openRoadmap() {
    await this.navigateTo('roadmap');
  }

  async createPhase(title, weeksRange = 'Weeks 21 - 24') {
    await this.addPhaseBtn.click();
    await this.page.fill('input[placeholder*="CI/CD"]', title);
    await this.page.fill('input[placeholder*="Weeks"]', weeksRange);
    await this.page.click('button:has-text("Create Phase")');
  }

  async toggleFirstTask() {
    const firstCheckbox = this.page.locator('[data-testid="complete-task"]').first();
    await firstCheckbox.click();
  }

  async clickDirectoryItem(phaseNumber) {
    const item = this.page.locator(`.stat-card-title:has-text("PHASE DIRECTORY") + div > div:has-text("${phaseNumber}.")`);
    await item.click();
  }
}
