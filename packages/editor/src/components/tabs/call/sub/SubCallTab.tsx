import { useEffect, useMemo, useState } from 'react';
import { useClient, useEditorContext } from '../../../../context';
import { TabProps, useTabState } from '../../../props';
import { MappingInfo } from '@axonivy/inscription-protocol';
import CallMapping from '../CallMapping';
import { useCallData, useProcessCallData } from '../useCallData';
import CallSelect, { CallableStartItem } from '../CallSelect';
import { IvyIcons } from '@axonivy/editor-icons';

export function useSubCallTab(): TabProps {
  const { callData, defaultData } = useCallData();
  const { processCallData, defaultProcessData } = useProcessCallData();
  const tabState = useTabState([defaultData.call, defaultProcessData.processCall], [callData.call, processCallData.processCall], []);
  return { name: 'Process Call', state: tabState, content: <SubCallTab /> };
}

const SubCallTab = () => {
  const { processCallData, updateProcessCall } = useProcessCallData();
  const [startItems, setStartItems] = useState<CallableStartItem[]>([]);

  const editorContext = useEditorContext();
  const client = useClient();
  useEffect(() => {
    client.callSubStarts(editorContext.pid).then(starts => setStartItems(CallableStartItem.map(starts)));
  }, [client, editorContext.pid]);

  const mappingInfo = useMemo<MappingInfo>(
    () => startItems.find(ds => ds.id === processCallData.processCall)?.callParameter ?? { variables: [], types: {} },
    [processCallData.processCall, startItems]
  );

  return (
    <>
      <CallSelect
        start={processCallData.processCall}
        onChange={updateProcessCall}
        starts={startItems}
        label='Process start'
        startIcon={IvyIcons.SubStart}
        processIcon={IvyIcons.Sub}
      />
      <CallMapping mappingInfo={mappingInfo} />
    </>
  );
};
