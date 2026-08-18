import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.overallProgress = page.locator('.grid-top-4 .card:nth-child(1) .stat-card-val');
    this.currentPhase = page.locator('.grid-top-4 .card:nth-child(2) .stat-card-val');
    this.statusBadge = page.locator('.grid-top-4 .card:nth-child(3) .badge-working');
    this.timeline = page.locator('.grid-top-4 .card:nth-child(4) .stat-card-val');

    this.nextActionCard = page.locator('.page-2col-grid > div:first-child > .card:first-child');
    this.startSessionBtn = page.locator('button:has-text("Start Session")');
    this.viewDetailsBtn = page.locator('button:has-text("View Details")');

    this.generateReportBtn = page.locator('.btn-report');
    this.reportModal = page.locator('.modal');
  }

  async openDashboard() {
    await this.navigateTo('dashboard');
  }

  async startFocusSession() {
    await this.startSessionBtn.click();
    await this.page.waitForSelector('[data-testid="focus"]');
  }

  async openReportModal() {
    await this.generateReportBtn.click();
    await this.reportModal.waitFor({ state: 'visible' });
  }
}
