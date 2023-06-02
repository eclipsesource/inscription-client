import { IvyIcons } from '@axonivy/editor-icons';
import { ElementType } from '@axonivy/inscription-protocol';
import { memo, ReactNode } from 'react';
import InscriptionEditor from '../InscriptionEditor';
import NameEditor from '../NameEditor';
import { useNamePart, useOutputPart, useResultPart, useStartPart } from '../../../components/parts';

const HtmlDialogStartEditor = memo(() => {
  const name = useNamePart();
  const start = useStartPart();
  const result = useResultPart();
  return <InscriptionEditor icon={IvyIcons.InitStart} parts={[name, start, result]} />;
});

const HtmlDialogMethodStartEditor = memo(() => {
  const name = useNamePart();
  const start = useStartPart({ hideParamDesc: true });
  const result = useResultPart({ hideParamDesc: true });
  return <InscriptionEditor icon={IvyIcons.MethodStart} parts={[name, start, result]} />;
});

const HtmlDialogEventStartEditor = memo(() => {
  const name = useNamePart();
  const output = useOutputPart();
  return <InscriptionEditor icon={IvyIcons.EventStart} parts={[name, output]} />;
});

export const htmlDialogEventEditors = new Map<ElementType, ReactNode>([
  ['HtmlDialogStart', <HtmlDialogStartEditor />],
  ['HtmlDialogMethodStart', <HtmlDialogMethodStartEditor />],
  ['HtmlDialogEventStart', <HtmlDialogEventStartEditor />],
  ['HtmlDialogExit', <NameEditor icon={IvyIcons.ExitEnd} />],
  ['HtmlDialogEnd', <NameEditor icon={IvyIcons.End} />]
]);
