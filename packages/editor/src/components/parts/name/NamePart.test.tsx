import { CollapsableUtil, render, renderHook, screen, TableUtil } from 'test-utils';
import { NameData } from '@axonivy/inscription-protocol';
import { useNamePart } from './NamePart';
import { PartState } from '../../props';

const Part = (props: { hideTags?: boolean }) => {
  const part = useNamePart({ hideTags: props.hideTags });
  return <>{part.content}</>;
};

describe('NamePart', () => {
  function renderPart(data?: NameData, hideTags?: boolean) {
    render(<Part hideTags={hideTags} />, { wrapperProps: { data } });
  }

  async function assertMainPart(name: string, description: string, docs: string[]) {
    expect(await screen.findByLabelText('Display name')).toHaveValue(name);
    expect(await screen.findByLabelText('Description')).toHaveValue(description);
    TableUtil.assertRows(docs);
  }

  test('empty data', async () => {
    renderPart();
    await assertMainPart('', '', []);
    await CollapsableUtil.assertClosed('Tags');
  });

  test('hide tags', async () => {
    renderPart(undefined, true);
    await assertMainPart('', '', []);
    expect(screen.queryByText('Tags')).not.toBeInTheDocument();
  });

  test('full data', async () => {
    renderPart({ name: 'name', description: 'description', docs: [{ name: 'doc', url: 'url' }], tags: ['tag1'] });
    await assertMainPart('name', 'description', ['doc url']);
    await CollapsableUtil.assertOpen('Tags');
  });

  function assertState(expectedState: PartState, data?: Partial<NameData>) {
    const { result } = renderHook(() => useNamePart(), { wrapperProps: { data } });
    expect(result.current.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState('empty');
    assertState('configured', { name: 'name' });
    assertState('configured', { description: 'des' });
    assertState('configured', { docs: [{ name: 'a', url: 'u' }] });
    assertState('configured', { tags: ['demo'] });
  });
});