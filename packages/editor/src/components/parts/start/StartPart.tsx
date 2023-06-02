import { useEffect, useState } from 'react';
import { CodeEditor, Fieldset, Input, useFieldset } from '../../../components/widgets';
import { PartProps, usePartDirty, usePartState } from '../../props';
import MappingTree from '../common/mapping-tree/MappingTree';
import { useStartData } from './useStartData';
import { MappingInfo } from '@axonivy/inscription-protocol';
import { useClient, useEditorContext } from '../../../context';
import ParameterTable from '../common/parameter/ParameterTable';

export function useStartPart(options?: { hideParamDesc?: boolean }): PartProps {
  const { data, defaultData, initData, resetData } = useStartData();
  const currentData = [data.signature, data.input];
  const state = usePartState([defaultData.signature, defaultData.input], currentData, []);
  const dirty = usePartDirty([initData.signature, initData.input], currentData);
  return {
    name: 'Start',
    state,
    reset: { dirty, action: () => resetData() },
    content: <StartPart hideParamDesc={options?.hideParamDesc} />
  };
}

const StartPart = ({ hideParamDesc }: { hideParamDesc?: boolean }) => {
  const { data, updateSignature, updateParams, updateMap, updateCode } = useStartData();
  const [mappingInfo, setMappingInfo] = useState<MappingInfo>({ variables: [], types: {} });

  const editorContext = useEditorContext();
  const client = useClient();
  useEffect(() => {
    client.outMapping(editorContext.pid).then(mapping => setMappingInfo(mapping));
  }, [client, editorContext.pid]);

  const signatureFieldset = useFieldset();
  return (
    <>
      <Fieldset label='Signature' {...signatureFieldset.labelProps}>
        <Input value={data.signature} onChange={change => updateSignature(change)} {...signatureFieldset.inputProps} />
      </Fieldset>
      <Fieldset label='Input parameters'>
        <ParameterTable data={data.input.params} onChange={change => updateParams(change)} hideDesc={hideParamDesc} />
      </Fieldset>
      <MappingTree data={data.input.map} mappingInfo={mappingInfo} onChange={updateMap} location='input.code' />
      <Fieldset label='Code'>
        <CodeEditor code={data.input.code} onChange={updateCode} location='input.code' />
      </Fieldset>
    </>
  );
};