/* eslint-disable react/jsx-key */
import { IvyIcons } from '@axonivy/editor-icons';
import type { ElementType } from '@axonivy/inscription-protocol';
import type { ReactNode } from 'react';
import { memo } from 'react';
import InscriptionEditor from '../InscriptionEditor';
import NameEditor from '../NameEditor';
import { useScriptPart, useEndPagePart, useGeneralPart, useErrorThrowPart } from '../../../components/parts';

const TaskEndPageEditor = memo(() => {
  const name = useGeneralPart();
  const endPage = useEndPagePart();
  return <InscriptionEditor icon={IvyIcons.EndPage} parts={[name, endPage]} />;
});

const ErrorEndEditor = memo(() => {
  const name = useGeneralPart();
  const error = useErrorThrowPart();
  const code = useScriptPart();
  return <InscriptionEditor icon={IvyIcons.ErrorEvent} parts={[name, error, code]} />;
});

export const endEventEditors = new Map<ElementType, ReactNode>([
  ['TaskEnd', <NameEditor icon={IvyIcons.End} />],
  ['TaskEndPage', <TaskEndPageEditor />],
  ['ErrorEnd', <ErrorEndEditor />]
]);
