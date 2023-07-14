import { Fieldset, FieldsetControl, Input, useFieldset } from '../../widgets';
import { PartProps, usePartDirty, usePartState } from '../../props';
import { useEndPageData } from './useEndPageData';
import { EndPageData } from '@axonivy/inscription-protocol';
import { useAction } from '../../../context';
import { IvyIcons } from '@axonivy/editor-icons';

export function useEndPagePart(): PartProps {
  const { config, initConfig, defaultConfig, update } = useEndPageData();
  const compareData = (data: EndPageData) => [data.page];
  const state = usePartState(compareData(defaultConfig), compareData(config), []);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return { name: 'End Page', state, reset: { dirty, action: () => update('page', initConfig.page) }, content: <EndPagePart /> };
}

const EndPagePart = () => {
  const { config, update } = useEndPageData();

  const action = useAction('openPage');
  const openFile: FieldsetControl = { label: 'Open file', icon: IvyIcons.GoToSource, action: () => action(config.page) };
  const pageFieldset = useFieldset();
  return (
    <>
      <Fieldset label='Display the following page' {...pageFieldset.labelProps} controls={[openFile]}>
        <Input value={config.page} onChange={change => update('page', change)} {...pageFieldset.inputProps} />
      </Fieldset>
    </>
  );
};
