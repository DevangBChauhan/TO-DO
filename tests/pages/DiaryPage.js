import { BasePage } from './BasePage';

export class DiaryPage extends BasePage {
  constructor(page) {
    super(page);
    this.plannedInput = page.locator('textarea[placeholder*="original objectives"]');
    this.completedInput = page.locator('textarea[placeholder*="actual achievements"]');
    this.learnedInput = page.locator('textarea[placeholder*="Technical insights"]');
    this.confusionInput = page.locator('textarea[placeholder*="Blockers"]');
    this.mistakeInput = page.locator('textarea[placeholder*="Errors and resolutions"]');
    this.tomorrowInput = page.locator('textarea[placeholder*="One clear directive"]');
    this.saveBtn = page.locator('button:has-text("Save Entry")');
    this.savedSuccess = page.locator('text=Entry saved successfully');
  }

  async openDiary() {
    await this.navigateTo('diary');
  }

  async fillDiary({ planned, completed, learned, confusion, mistake, tomorrow }) {
    if (planned) await this.plannedInput.fill(planned);
    if (completed) await this.completedInput.fill(completed);
    if (learned) await this.learnedInput.fill(learned);
    if (confusion) await this.confusionInput.fill(confusion);
    if (mistake) await this.mistakeInput.fill(mistake);
    if (tomorrow) await this.tomorrowInput.fill(tomorrow);
    await this.saveBtn.click();
    await this.savedSuccess.waitFor({ state: 'visible' });
  }
}
