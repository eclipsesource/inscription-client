import { render, screen, userEvent } from 'test-utils';
import Part from './Part';
import { PartProps, PartStateFlag } from './usePart';

describe('Part', () => {
  const namePart: PartProps = {
    name: 'Name',
    state: { state: 'empty', validations: [] },
    reset: { dirty: false, action: () => {} },
    content: <h1>Name</h1>
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
    content: <h1>Result</h1>,
    summary: <span>summary</span>
  };

  function renderAccordion(partProps: PartProps): {
    data: () => PartProps;
    rerender: () => void;
  } {
    const part = partProps;
    const view = render(<Part part={part} />);
    return {
      data: () => part,
      rerender: () => view.rerender(<Part part={part} />)
    };
  }

  test('render', () => {
    renderAccordion(namePart);
    assertExpanded('Name', false);
  });

  test('state', () => {
    renderAccordion(namePart);
    assertPartState('Name', 'empty', false);
    renderAccordion(callPart);
    assertPartState('Call', 'warning', true);
    renderAccordion(resultPart);
    assertPartState('Result', 'error', false);
  });

  test('reset data', async () => {
    let dirty = true;
    const action = () => (dirty = false);
    renderAccordion({ ...callPart, reset: { dirty, action } });
    assertDirtyState('Call', true);

    await userEvent.click(screen.getByRole('button', { name: 'Reset Call' }));
    expect(dirty).toBeFalsy();
  });

  test('open section', async () => {
    renderAccordion(namePart);
    const trigger = screen.getByRole('button', { name: 'Name' });
    assertExpanded('Name', false);
    await userEvent.click(trigger);
    assertExpanded('Name', true);
    await userEvent.click(trigger);
    assertExpanded('Name', false);
  });

  test('summary section', async () => {
    renderAccordion(resultPart);
    const summary = screen.getByRole('region');
    expect(summary).toHaveAttribute('data-state', 'open');
    expect(summary).toHaveTextContent('summary');

    await userEvent.click(screen.getByText('summary'));
    expect(summary).toHaveAttribute('data-state', 'closed');
    expect(summary).toBeEmptyDOMElement();
    const content = screen.getByRole('region');
    expect(content).toHaveAttribute('data-state', 'open');
    expect(content).toHaveTextContent('Result');
  });

  test('open section by keyboard', async () => {
    renderAccordion(callPart);

    const trigger = screen.getByRole('button', { name: 'Call' });
    const reset = screen.getByRole('button', { name: 'Reset Call' });

    await userEvent.tab();
    expect(trigger).toHaveFocus();
    assertExpanded('Call', false);

    await userEvent.keyboard('[Enter]');
    assertExpanded('Call', true);

    await userEvent.tab();
    expect(reset).toHaveFocus();

    await userEvent.tab({ shift: true });
    await userEvent.keyboard('[Space]');
    assertExpanded('Call', false);
  });

  function assertExpanded(accordionName: string, expanded: boolean) {
    expect(screen.getByRole('button', { name: accordionName })).toHaveAttribute('aria-expanded', `${expanded}`);
  }

  function assertPartState(accordionName: string, state: PartStateFlag, dirty: boolean) {
    expect(screen.getByRole('button', { name: accordionName }).children[0]).toHaveAttribute('data-state', state);
    assertDirtyState(accordionName, dirty);
  }

  function assertDirtyState(accordionName: string, dirty: boolean) {
    expect(screen.getByRole('button', { name: accordionName }).children[0]).toHaveAttribute('data-dirty', `${dirty}`);
  }
});