/**
 * Base Page Object representing common components (Sidebar, Top Header, Theme)
 */
export class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.sidebar = page.locator('[data-testid="sidebar"]');
    this.header = page.locator('[data-testid="app-header"]');
    this.mainContent = page.locator('#main-content');
  }

  async navigateTo(pageId) {
    const navBtn = this.page.locator(`[data-testid="nav-${pageId}"]`);
    await navBtn.click();
    await this.page.waitForSelector(`[data-testid="${pageId}"]`);
  }

  async toggleTheme() {
    const themeBtn = this.page.locator('button[title*="mode"], button[title*="theme"]');
    await themeBtn.click();
  }

  async clickNextAction() {
    const nextActionBtn = this.page.locator('.header-cta-btn');
    await nextActionBtn.click();
  }
}
