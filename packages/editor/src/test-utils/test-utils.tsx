import {
  ElementData,
  ConfigData,
  DEFAULT_DATA,
  CallableStart,
  ErrorMeta,
  InscriptionValidation,
  VariableInfo,
  RoleMeta,
  ConnectorRef,
  EventCodeMeta
} from '@axonivy/inscription-protocol';
import { queries, Queries, render, renderHook, RenderHookOptions, RenderOptions } from '@testing-library/react';
import { deepmerge } from 'deepmerge-ts';
import { ReactElement, ReactNode, useRef } from 'react';
import { DeepPartial } from './type-utils';
import {
  ClientContext,
  ClientContextInstance,
  DataContext,
  DataContextInstance,
  DEFAULT_EDITOR_CONTEXT,
  EditorContextInstance
} from '../context';
import { PID } from '../utils/pid';

type ContextHelperProps = {
  data?: DeepPartial<ElementData>;
  setData?: (data: ElementData) => void;
  defaultData?: DeepPartial<ConfigData>;
  initData?: DeepPartial<ElementData>;
  validation?: InscriptionValidation[];
  meta?: {
    roles?: RoleMeta[];
    expiryErrors?: ErrorMeta[];
    dialogStarts?: CallableStart[];
    triggerStarts?: CallableStart[];
    callSubStarts?: CallableStart[];
    eventCodes?: EventCodeMeta[];
    outScripting?: VariableInfo;
    inScripting?: VariableInfo;
    connectorOf?: Record<string, DeepPartial<ConnectorRef>>;
  };
  editor?: { title?: string; readonly?: boolean };
};

const ContextHelper = (
  props: ContextHelperProps & {
    children: ReactNode;
  }
) => {
  const d = props.data ? deepmerge(DEFAULT_DATA, props.data) : DEFAULT_DATA;
  const data: DataContext = {
    // @ts-ignore
    data: props.data ? deepmerge(DEFAULT_DATA, props.data) : DEFAULT_DATA,
    //@ts-ignore
    setData: props.setData ? getData => props.setData(getData(d)) : () => {},
    // @ts-ignore
    defaultData: props.defaultData ? deepmerge(DEFAULT_DATA.config, props.defaultData) : DEFAULT_DATA.config,
    // @ts-ignore
    initData: props.initData ? deepmerge(DEFAULT_DATA, props.initData) : DEFAULT_DATA,
    validation: props.validation ?? []
  };
  const client: ClientContext = {
    // @ts-ignore
    client: {
      roles() {
        return Promise.resolve(props.meta?.roles ?? []);
      },
      expiryErrors() {
        return Promise.resolve(props.meta?.expiryErrors ?? []);
      },
      dialogStarts() {
        return Promise.resolve(props.meta?.dialogStarts ?? []);
      },
      triggerStarts() {
        return Promise.resolve(props.meta?.triggerStarts ?? []);
      },
      callSubStarts() {
        return Promise.resolve(props.meta?.callSubStarts ?? []);
      },
      errorCodes() {
        return Promise.resolve(props.meta?.eventCodes ?? []);
      },
      signalCodes() {
        return Promise.resolve(props.meta?.eventCodes ?? []);
      },
      outScripting(pid: string, location: string) {
        if (props.meta?.outScripting) {
          return Promise.resolve(props.meta.outScripting);
        }
        const emptyScripting =
          location === 'result'
            ? { types: {}, variables: [{ attribute: 'result', description: '', type: '<>', simpleType: '<>' }] }
            : { types: {}, variables: [] };
        return Promise.resolve(emptyScripting);
      },
      inScripting() {
        return Promise.resolve(props.meta?.inScripting ?? { types: {}, variables: [] });
      },
      // @ts-ignore
      connectorOf(pid: string) {
        const connectorPid = PID.fieldId(pid);
        return Promise.resolve(props.meta?.connectorOf ? props.meta.connectorOf[connectorPid] : undefined);
      }
    }
  };
  const editorContext = DEFAULT_EDITOR_CONTEXT;
  if (props.editor?.title) {
    editorContext.type.shortLabel = props.editor.title;
  }
  if (props.editor?.readonly) {
    editorContext.readonly = props.editor.readonly;
  }
  const editorRef = useRef(null);
  editorContext.editorRef = editorRef;
  return (
    <div ref={editorRef}>
      <EditorContextInstance.Provider value={editorContext}>
        <ClientContextInstance.Provider value={client}>
          <DataContextInstance.Provider value={data}>{props.children}</DataContextInstance.Provider>
        </ClientContextInstance.Provider>
      </EditorContextInstance.Provider>
    </div>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'> & { wrapperProps: ContextHelperProps }) =>
  render(ui, { wrapper: props => <ContextHelper {...props} {...options?.wrapperProps} />, ...options });

const customRenderHook = <
  Result,
  Props,
  Q extends Queries = typeof queries,
  Container extends Element | DocumentFragment = HTMLElement,
  BaseElement extends Element | DocumentFragment = Container
>(
  render: (initialProps: Props) => Result,
  options?: RenderHookOptions<Props, Q, Container, BaseElement> & { wrapperProps: ContextHelperProps }
) => renderHook(render, { wrapper: props => <ContextHelper {...props} {...options?.wrapperProps} />, ...options });

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { customRender as render };
export { customRenderHook as renderHook };
export * from './table-utils';
export * from './select-utils';
export * from './combobox-utils';
export * from './collapsible-utils';
export * from './object-utils';
export * from './type-utils';
