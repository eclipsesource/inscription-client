import { useEffect, useState } from 'react';
import { Collapsible, Input, ScriptArea, useFieldset } from '../../../components/widgets';
import { PartProps, usePartDirty, usePartState } from '../../props';
import MappingTree from '../common/mapping-tree/MappingTree';
import { useStartData } from './useStartData';
import { VariableInfo, StartData } from '@axonivy/inscription-protocol';
import { PathContext, useClient, useEditorContext, usePartValidation } from '../../../context';
import ParameterTable from '../common/parameter/ParameterTable';
import { useStartNameSyncher } from './useStartNameSyncher';
import { PathFieldset } from '../common/path/PathFieldset';

type StartPartProps = { hideParamDesc?: boolean; synchParams?: boolean };

export const useStartPartValidation = () => {
  const signarture = usePartValidation('signature');
  const input = usePartValidation('input');
  return [...signarture, ...input];
};

export function useStartPart(props?: StartPartProps): PartProps {
  const { config, defaultConfig, initConfig, resetData } = useStartData();
  const validations = useStartPartValidation();
  const compareData = (data: StartData) => [data.signature, data.input];
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return {
    name: 'Start',
    state,
    reset: { dirty, action: () => resetData() },
    content: <StartPart {...props} />
  };
}

const StartPart = ({ hideParamDesc, synchParams }: StartPartProps) => {
  const { config, updateSignature, update } = useStartData();
  const [variableInfo, setVariableInfo] = useState<VariableInfo>({ variables: [], types: {} });

  const editorContext = useEditorContext();
  const client = useClient();
  useEffect(() => {
    client.outScripting(editorContext.pid, 'input').then(mapping => setVariableInfo(mapping));
  }, [client, editorContext.pid]);

  useStartNameSyncher(config, synchParams);

  const signatureFieldset = useFieldset();
  const codeFieldset = useFieldset();
  return (
    <>
      <PathFieldset label='Signature' {...signatureFieldset.labelProps} path='signature'>
        <Input value={config.signature} onChange={change => updateSignature(change)} {...signatureFieldset.inputProps} />
      </PathFieldset>
      <PathContext path='input'>
        <Collapsible label='Input parameters'>
          <ParameterTable data={config.input.params} onChange={change => update('params', change)} hideDesc={hideParamDesc} />
        </Collapsible>
        <MappingTree data={config.input.map} variableInfo={variableInfo} onChange={change => update('map', change)} />
        <PathFieldset label='Code' {...codeFieldset.labelProps} path='code'>
          <ScriptArea value={config.input.code} onChange={change => update('code', change)} {...codeFieldset.inputProps} />
        </PathFieldset>
      </PathContext>
    </>
  );
};
