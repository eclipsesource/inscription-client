import { Page } from '@playwright/test';
import { PartTest } from './part-tester';
import { TableUtil } from '../../utils/table-util';
import { CodeEditorUtil } from '../../utils/code-editor-util';
import { CollapseUtil } from '../../utils/collapse-util';

export class ResultTester implements PartTest {
  constructor(private readonly hideParamDesc: boolean = false) {}

  partName() {
    return 'Result';
  }
  async fill(page: Page) {
    await CollapseUtil.open(page, 'Result parameters');
    await TableUtil.addRow(page);
    if (this.hideParamDesc) {
      await TableUtil.fillRow(page, 0, ['param', 'String']);
    } else {
      await TableUtil.fillRow(page, 0, ['param', 'String', 'desc']);
    }
    await TableUtil.fillExpression(page, 2, '"bla"');
    await CodeEditorUtil.fill(page, 'ivy.log.info("hi");');
  }
  async assertFill(page: Page) {
    await CollapseUtil.open(page, 'Result parameters');
    if (this.hideParamDesc) {
      await TableUtil.assertRow(page, 0, ['param', 'String']);
    } else {
      await TableUtil.assertRow(page, 0, ['param', 'String', 'desc']);
    }
    await TableUtil.assertRow(page, 2, ['"bla"']);
    await CodeEditorUtil.assertValue(page, 'ivy.log.info("hi");');
  }
  async clear(page: Page) {
    await CollapseUtil.open(page, 'Result parameters');
    await TableUtil.removeRow(page, 0);
    await TableUtil.fillExpression(page, 1, '');
    await CodeEditorUtil.focus(page);
    await CodeEditorUtil.clear(page);
  }
  async assertClear(page: Page) {
    await CollapseUtil.open(page, 'Result parameters');
    await TableUtil.assertEmpty(page, 0);
    await TableUtil.assertRowCount(page, 1, 1);
    await CodeEditorUtil.assertValue(page, '');
  }
}

export const ResultTest = new ResultTester();
