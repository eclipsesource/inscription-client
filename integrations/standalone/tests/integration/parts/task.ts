import { Accordion } from '../../pageobjects/Accordion';
import { NewPartTest, PartObject, PartTest } from './part-tester';
import { Part } from '../../pageobjects/Part';
import { MacroEditor, ScriptArea, ScriptInput } from '../../pageobjects/CodeEditor';
import { Section } from '../../pageobjects/Section';
import { ResponsibleSelect } from '../../pageobjects/ResponsibleSelect';
import { Select } from '../../pageobjects/Select';
import { Table } from '../../pageobjects/Table';
import { Checkbox } from '../../pageobjects/Checkbox';

export class TasksTester implements PartTest {
  private tasks: { tab: string; test: PartTest }[];
  constructor(private readonly error: RegExp = /EventAndGateway/) {
    this.tasks = [
      { tab: 'TaskA', test: new TaskTester({ name: 'task1', error: this.error }) },
      { tab: 'TaskB', test: new TaskTester({ name: 'task2', error: this.error }) }
    ];
  }
  partName() {
    return 'Tasks';
  }
  async fill(part: Part) {
    for (const task of this.tasks) {
      const tab = (part as Accordion).tab(task.tab);
      await tab.switchTo();
      await task.test.fill(tab);
    }
  }
  async assertFill(part: Part) {
    for (const task of this.tasks) {
      const tab = (part as Accordion).tab(task.tab);
      tab.switchTo();
      await task.test.assertFill(tab);
    }
  }
  async clear(part: Part) {
    for (const task of this.tasks) {
      const tab = (part as Accordion).tab(task.tab);
      tab.switchTo();
      await task.test.clear(tab);
    }
  }
  async assertClear(part: Part) {
    for (const task of this.tasks) {
      const tab = (part as Accordion).tab(task.tab);
      tab.switchTo();
      await task.test.assertClear(tab);
    }
  }
}

class Task extends PartObject {
  name: MacroEditor;
  description: MacroEditor;
  category: MacroEditor;
  responsible: ResponsibleSelect;
  priority: Select;
  optionsSection: Section;
  skipTasklist: Checkbox;
  delay: ScriptInput;
  expirySection: Section;
  timeout: ScriptInput;
  error: Select;
  expiryResponsbile: ResponsibleSelect;
  expiryPriority: Select;
  customFieldsSection: Section;
  customFields: Table;
  codeSection: Section;
  code: ScriptArea;

  constructor(part: Part, private readonly nameValue: string, private readonly errorValue: RegExp) {
    super(part);
    this.name = part.macroInput('Name');
    this.description = part.macroArea('Description');
    this.category = part.macroInput('Category');
    this.responsible = part.responsibleSelect('Responsible');
    this.priority = part.select('Priority');
    this.optionsSection = part.section('Options');
    this.skipTasklist = this.optionsSection.checkbox('Skip Tasklist');
    this.delay = this.optionsSection.scriptInput('Delay');
    this.expirySection = part.section('Expiry');
    this.timeout = this.expirySection.scriptInput('Timeout');
    this.error = this.expirySection.select('Error');
    this.expiryResponsbile = this.expirySection.responsibleSelect('Responsible');
    this.expiryPriority = this.expirySection.select('Priority');
    this.customFieldsSection = part.section('Custom fields');
    this.customFields = this.customFieldsSection.table(['text', 'label', 'expression']);
    this.codeSection = part.section('Code');
    this.code = this.codeSection.scriptArea();
  }

  async fill() {
    await this.name.fill(this.nameValue);
    await this.description.fill('test desc');
    await this.category.fill('test cat');

    await this.responsible.chooseType('Role from Attr.');
    await this.responsible.fill('"Teamleader"');

    await this.priority.choose('High');

    await this.optionsSection.toggle();
    await this.skipTasklist.check();
    await this.delay.fill('delay');

    await this.expirySection.toggle();
    await this.timeout.fill('timeout');
    await this.error.choose(this.errorValue);
    await this.expiryResponsbile.chooseType('Nobody & delete');
    await this.expiryPriority.choose('Low');

    await this.customFieldsSection.toggle();
    const row = await this.customFields.addRow();
    await row.fill(['cf', 'value']);

    await this.codeSection.toggle();
    await this.code.fill('code');
  }

  async assertFill() {
    await this.name.expectValue(this.nameValue);
    await this.description.expectValue('test desc');
    await this.category.expectValue('test cat');

    await this.responsible.expectType('Role from Attr.');
    await this.responsible.expectValue('"Teamleader"');

    await this.priority.expectValue(/High/);

    await this.skipTasklist.expectChecked();
    await this.delay.expectValue('delay');

    await this.timeout.expectValue('timeout');
    await this.error.expectValue(this.errorValue);
    await this.expiryResponsbile.expectType('Nobody & delete');
    await this.expiryPriority.expectValue(/Low/);

    await this.customFields.expectRowCount(1);
    await this.customFields.cell(0, 0).expectValue('cf');
    await this.customFields.cell(0, 2).expectValue('value');

    await this.code.expectValue('code');
  }

  async clear() {
    await this.name.clear();
    await this.description.clear();
    await this.category.clear();

    await this.responsible.clear();

    await this.priority.choose('Normal');

    await this.skipTasklist.uncheck();
    await this.delay.clear();

    await this.timeout.clear();

    await this.customFields.clear();

    await this.code.clear();
  }

  async assertClear() {
    await this.name.expectEmpty();
    await this.description.expectEmpty();
    await this.category.expectEmpty();

    await this.responsible.expectType('Role');
    await this.responsible.expectValue('Everybody');

    await this.priority.expectValue('Normal');

    await this.optionsSection.expectIsClosed();
    await this.expirySection.expectIsClosed();
    await this.customFieldsSection.expectIsClosed();
    await this.codeSection.expectIsClosed();
  }
}

export class TaskTester extends NewPartTest {
  constructor(options?: { name?: string; error?: RegExp }) {
    super('Task', (part: Part) => new Task(part, options?.name ?? 'test name', options?.error ?? /f8/));
  }
}

export const TaskTest = new TaskTester();

export const TasksTest = new TasksTester();
