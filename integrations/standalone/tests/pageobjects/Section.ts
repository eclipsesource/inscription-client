import { Locator, Page, expect } from '@playwright/test';
import { Composite } from './Composite';

export class Section extends Composite {
  private readonly toggleButtonLocator: Locator;

  constructor(page: Page, parentLocator: Locator, label: string) {
    super(page, Section.locator(page, parentLocator, label));
    this.toggleButtonLocator = parentLocator.locator(Section.toggleButtonLocatorInternal(page, label));
  }

  async toggle() {
    await this.toggleButtonLocator.click();
  }

  async isClosed() {
    await expect(this.toggleButtonLocator).toHaveAttribute('data-state', 'closed');
  }

  async isOpen() {
    await expect(this.toggleButtonLocator).toHaveAttribute('data-state', 'open');
  }

  private static locator(page: Page, parentLocator: Locator, label: string) {
    return parentLocator.locator(`.collapsible-root`, { has: Section.toggleButtonLocatorInternal(page, label) });
  }

  private static toggleButtonLocatorInternal(page: Page, label: string) {
    return page.getByRole('button', { name: label });
  }
}