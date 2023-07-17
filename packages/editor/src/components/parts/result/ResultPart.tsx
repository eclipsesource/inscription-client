import { useEffect, useState } from 'react';
import { Collapsible, ScriptArea, useFieldset } from '../../widgets';
import { PartProps, usePartDirty, usePartState } from '../../props';
import MappingTree from '../common/mapping-tree/MappingTree';
import { useResultData } from './useResultData';
import { VariableInfo, ResultData, Variable } from '@axonivy/inscription-protocol';
import { PathContext, useClient, useEditorContext, usePartValidation } from '../../../context';
import ParameterTable from '../common/parameter/ParameterTable';
import { PathFieldset } from '../common/path/PathFieldset';

export function useResultPart(props?: { hideParamDesc?: boolean }): PartProps {
  const { config, defaultConfig, initConfig, resetData } = useResultData();
  const compareData = (data: ResultData) => [data.result];
  const validations = usePartValidation('result');
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return {
    name: 'Result',
    state,
    reset: { dirty, action: () => resetData() },
    content: <ResultPart {...props} />
  };
}

const ResultPart = ({ hideParamDesc }: { hideParamDesc?: boolean }) => {
  const { config, update } = useResultData();
  const [variableInfo, setVariableInfo] = useState<VariableInfo>({ variables: [], types: {} });

  const editorContext = useEditorContext();
  const client = useClient();
  useEffect(() => {
    client.outScripting(editorContext.pid, 'result').then(info => {
      const resultType = info.variables[0].type;
      if (info.types[resultType]?.length !== config.result.params.length) {
        info.types[resultType] = config.result.params.map<Variable>(param => {
          return { attribute: param.name, type: param.type, simpleType: param.type, description: param.desc };
        });
      }
      setVariableInfo(info);
    });
  }, [client, editorContext.pid, config.result.params]);

  const codeFieldset = useFieldset();

  return (
    <PathContext path='result'>
      <Collapsible label='Result parameters'>
        <ParameterTable data={config.result.params} onChange={change => update('params', change)} hideDesc={hideParamDesc} />
      </Collapsible>
      <MappingTree data={config.result.map} variableInfo={variableInfo} onChange={change => update('map', change)} />
      <PathFieldset label='Code' {...codeFieldset.labelProps} path='code'>
        <ScriptArea value={config.result.code} onChange={change => update('code', change)} {...codeFieldset.inputProps} />
      </PathFieldset>
    </PathContext>
  );
};
