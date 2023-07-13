import { Locator, Page } from '@playwright/test';
import { Part } from './Part';
import { Tab } from './Tab';

export class Accordion extends Part {
  private readonly toggleButtonLocator: Locator;

  constructor(page: Page, label: string) {
    super(page, Accordion.locator(page, label));
    this.toggleButtonLocator = Accordion.toggleButtonLocator(page, label);
  }

  async toggle() {
    await this.toggleButtonLocator.click();
  }

  private static locator(page: Page, label: string) {
    return page.locator(`.accordion-item`, { has: Accordion.toggleButtonLocator(page, label) });
  }

  private static toggleButtonLocator(page: Page, label: string) {
    return page.locator(`.accordion-trigger:has-text("${label}")`);
  }

  tab(label: string) {
    return new Tab(this.page, this.locator, label);
  }
}