import { IvyIcons } from '@axonivy/editor-icons';
import { GatewayEditorType } from '@axonivy/inscription-protocol';
import { memo } from 'react';
import { TabState } from '../../../components/props';
import { useCaseTab, useEndPageTab, useNameTab, useOutputTab, useTasksTab } from '../../../components/tabs';
import InscriptionEditor from '../InscriptionEditor';
import NameEditor from '../NameEditor';

const AlternativeEditor = memo(() => {
  const nameTab = useNameTab();
  const conditionTab = { name: 'Condition', content: <h1>Condition</h1>, state: TabState.EMPTY };
  return <InscriptionEditor icon={IvyIcons.Alternative} tabs={[nameTab, conditionTab]} />;
});

const TaskSwitchGatewayEditor = memo(() => {
  const nameTab = useNameTab();
  const outputTab = useOutputTab();
  const tasksTab = useTasksTab();
  const caseTab = useCaseTab();
  const endPageTab = useEndPageTab();
  return <InscriptionEditor icon={IvyIcons.Tasks} tabs={[nameTab, outputTab, tasksTab, caseTab, endPageTab]} />;
});

export const gatewayEditors = new Map<GatewayEditorType, JSX.Element>([
  ['Alternative', <AlternativeEditor />],
  ['Join', <NameEditor icon={IvyIcons.Join} />],
  ['Split', <NameEditor icon={IvyIcons.Split} />],
  ['TaskSwitchGateway', <TaskSwitchGatewayEditor />]
]);
