import { test, expect } from '@playwright/test';
import { inscriptionView } from '../../utils/engine-util';
import { NameTest, OutputTest, fillReloadAndAssert } from '../parts';

test.describe('Boundary Events', () => {
  test('Error Boundary', async ({ page }) => {
    await page.goto(inscriptionView('169A4921D0EF0B91-f16'));
    await expect(page.getByText('Error Boundary').first()).toBeVisible();
    await fillReloadAndAssert(page, [NameTest, OutputTest]);
  });

  test('Signal Boundary', async ({ page }) => {
    await page.goto(inscriptionView('169A4921D0EF0B91-f17'));
    await expect(page.getByText('Signal Boundary').first()).toBeVisible();
    await fillReloadAndAssert(page, [NameTest, OutputTest]);
  });
});