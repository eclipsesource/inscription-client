import { render, screen, userEvent } from 'test-utils';
import Part from './Part';
import type { PartProps, PartStateFlag } from './usePart';
import { describe, test, expect } from 'vitest';

describe('Part', () => {
  const generalPart: PartProps = {
    name: 'General',
    state: { state: undefined, validations: [] },
    reset: { dirty: false, action: () => {} },
    content: <h1>General</h1>
  };
  const callPart: PartProps = {
    name: 'Call',
    state: { state: 'warning', validations: [] },
    content: <h1>Call</h1>,
    reset: { dirty: true, action: () => {} }
  };
  const resultPart: PartProps = {
    name: 'Result',
    state: { state: 'error', validations: [] },
    reset: { dirty: false, action: () => {} },
    content: <h1>Result</h1>
  };

  function renderAccordion(partProps: PartProps): {
    data: () => PartProps;
    rerender: () => void;
  } {
    const part = partProps;
    const view = render(<Part parts={[part]} />);
    return {
      data: () => part,
      rerender: () => view.rerender(<Part parts={[part]} />)
    };
  }

  test('render', () => {
    renderAccordion(generalPart);
    assertExpanded('General', false);
  });

  test('state', () => {
    renderAccordion(generalPart);
    assertPartState('General', undefined);
    renderAccordion(callPart);
    assertPartState('Call', 'warning');
    renderAccordion(resultPart);
    assertPartState('Result', 'error');
  });

  test('reset data', async () => {
    let dirty = true;
    const action = () => (dirty = false);
    renderAccordion({ ...callPart, reset: { dirty, action } });
    await userEvent.click(screen.getByRole('button', { name: 'Reset Call' }));
    expect(dirty).toBeFalsy();
  });

  test('open section', async () => {
    renderAccordion(generalPart);
    const trigger = screen.getByRole('button', { name: 'General' });
    assertExpanded('General', false);
    await userEvent.click(trigger);
    assertExpanded('General', true);
    await userEvent.click(trigger);
    assertExpanded('General', false);
  });

  test('open section by keyboard', async () => {
    renderAccordion(callPart);

    const trigger = screen.getByRole('button', { name: 'Call' });

    await userEvent.tab();
    expect(trigger).toHaveFocus();
    assertExpanded('Call', false);

    await userEvent.keyboard('[Enter]');
    assertExpanded('Call', true);

    await userEvent.keyboard('[Space]');
    assertExpanded('Call', false);
  });

  function assertExpanded(accordionName: string, expanded: boolean) {
    expect(screen.getByRole('button', { name: accordionName })).toHaveAttribute('aria-expanded', `${expanded}`);
  }

  function assertPartState(accordionName: string, state: PartStateFlag) {
    if (state) {
      expect(screen.getByRole('button', { name: accordionName }).querySelector('.ui-state-dot')).toHaveAttribute('data-state', state);
    } else {
      expect(screen.getByRole('button', { name: accordionName }).querySelector('.ui-state-dot')).toBeNull;
    }
  }
});
