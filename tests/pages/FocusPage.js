import { BasePage } from './BasePage';

export class FocusPage extends BasePage {
  constructor(page) {
    super(page);
    this.timerDigits = page.locator('.timer-big-digits');
    this.playBtn = page.locator('.timer-btn-play');
    this.pauseBtn = page.locator('.timer-btn-sq').first();
    this.resetBtn = page.locator('.timer-btn-sq').nth(1);

    this.timerTab = page.locator('.tab-btn:has-text("Countdown Timer")');
    this.stopwatchTab = page.locator('.tab-btn:has-text("Stopwatch")');
    this.breakTab = page.locator('.tab-btn:has-text("Rest & Break")');
  }

  async openFocus() {
    await this.navigateTo('focus');
  }

  async startTimer() {
    await this.playBtn.click();
  }

  async pauseTimer() {
    await this.pauseBtn.click();
  }

  async resetTimer() {
    await this.resetBtn.click();
  }

  async switchMode(mode) {
    if (mode === 'stopwatch') await this.stopwatchTab.click();
    else if (mode === 'break') await this.breakTab.click();
    else await this.timerTab.click();
  }

  async selectQuickPreset(mins) {
    await this.page.click(`button:has-text("${mins}m")`);
  }
}
