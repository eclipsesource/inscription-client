import { MappingInfo } from '@axonivy/inscription-protocol';
import { useEffect, useState } from 'react';
import { CodeEditor, Fieldset, MappingTree } from '../../widgets';
import { useClient, useEditorContext } from '../../../context';
import { PartProps, usePartState } from '../../props';
import { useOutputData } from './useOutputData';

export function useOutputPart(options?: { hideCode?: boolean }): PartProps {
  const { outputData, defaultData } = useOutputData();

  const state = usePartState(
    [defaultData.output.map, options?.hideCode ? '' : defaultData.output.code],
    [outputData.output.map, options?.hideCode ? '' : outputData.output.code],
    []
  );
  return { name: 'Output', state, content: <OutputPart showCode={!options?.hideCode} /> };
}

const OutputPart = (props: { showCode?: boolean }) => {
  const { outputData, updateMap, updateCode } = useOutputData();
  const [mappingInfo, setMappingInfo] = useState<MappingInfo>({ variables: [], types: {} });

  const editorContext = useEditorContext();
  const client = useClient();
  useEffect(() => {
    client.outMapping(editorContext.pid).then(mapping => setMappingInfo(mapping));
  }, [client, editorContext.pid]);

  return (
    <>
      <MappingTree data={outputData.output.map} mappingInfo={mappingInfo} onChange={updateMap} location='output.code' />
      {props.showCode && (
        <Fieldset label='Code' htmlFor='code'>
          <CodeEditor code={outputData.output.code} onChange={updateCode} location='output.code' />
        </Fieldset>
      )}
    </>
  );
};