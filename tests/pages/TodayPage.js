import { BasePage } from './BasePage';

export class TodayPage extends BasePage {
  constructor(page) {
    super(page);
    this.addTaskBtn = page.locator('[data-testid="add-task"]').first();
    this.categorySelect = page.locator('.filter-select').first();
    this.prioritySelect = page.locator('.filter-select').nth(1);
    this.taskList = page.locator('.card:has(> .flex-col > [data-testid="task-item"])');
  }

  async openToday() {
    await this.navigateTo('today');
  }

  async addNewTask(title, category = 'Coding', priority = 'high', timeSlot = '11:00') {
    await this.addTaskBtn.click();
    await this.page.fill('input[placeholder*="Learn Java"]', title);
    await this.page.selectOption('.modal select:has(option[value="high"])', priority);
    await this.page.selectOption('.modal select:has(option[value="Coding"])', category);
    await this.page.fill('.modal input[type="time"]', timeSlot);
    await this.page.click('.modal button:has-text("Add Task")');
  }

  async filterByCategory(category) {
    await this.categorySelect.selectOption(category.toLowerCase());
  }

  async filterByPriority(priority) {
    await this.prioritySelect.selectOption(priority.toLowerCase());
  }
}
