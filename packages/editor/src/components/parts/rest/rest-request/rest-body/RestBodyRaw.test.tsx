import { RestRequestData } from '@axonivy/inscription-protocol';
import { DeepPartial, render, screen } from 'test-utils';
import { RestBodyRaw } from './RestBodyRaw';

describe('RestBodyRaw', () => {
  function renderPart(data?: DeepPartial<RestRequestData>) {
    render(<RestBodyRaw />, { wrapperProps: { data: data && { config: data } } });
  }

  test('empty', async () => {
    renderPart();
    expect(screen.getByTestId('code-editor')).toHaveValue('');
  });

  test('data', async () => {
    renderPart({ body: { raw: 'hi' } });
    expect(screen.getByTestId('code-editor')).toHaveValue('hi');
  });
});