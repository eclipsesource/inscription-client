import { useTriggerCallPart } from './TriggerCallPart';
import { render, screen, TableUtil, renderHook } from 'test-utils';
import { CallData, ProcessCallData } from '@axonivy/inscription-protocol';
import { PartState } from '../../../props';

const Part = () => {
  const part = useTriggerCallPart();
  return <>{part.content}</>;
};

describe('TriggerCallPart', () => {
  function renderPart(data?: CallData & ProcessCallData) {
    render(<Part />, { wrapperProps: { data: data && { config: data } } });
  }

  async function assertMainPart(dialog: string, map: RegExp[], code: string) {
    expect(await screen.findByRole('combobox', { name: 'Process start' })).toHaveValue(dialog);
    TableUtil.assertRows(map);
    expect(await screen.findByTestId('code-editor')).toHaveValue(code);
  }

  test('empty data', async () => {
    renderPart();
    await assertMainPart('', [], '');
  });

  test('full data', async () => {
    renderPart({ processCall: 'trigger', call: { code: 'code', map: { key: 'value' } } });
    await assertMainPart('trigger', [/key value/], 'code');
  });

  function assertState(expectedState: PartState, data?: Partial<CallData & ProcessCallData>) {
    const { result } = renderHook(() => useTriggerCallPart(), { wrapperProps: { data: data && { config: data } } });
    expect(result.current.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState('empty');
    assertState('configured', { processCall: 'trigger' });
    assertState('configured', { call: { code: 'code', map: {} } });
    assertState('configured', { call: { code: '', map: { key: 'value' } } });
  });
});