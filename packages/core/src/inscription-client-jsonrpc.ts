import {
  CallableStart,
  ExpiryError,
  InscriptionClient,
  InscriptionDataBeta,
  InscriptionNotificationTypes,
  InscriptionRequestTypes,
  InscriptionSaveData,
  InscriptionValidation,
  MappingInfo,
  Role
} from '@axonivy/inscription-protocol';
import { createMessageConnection, Emitter } from 'vscode-jsonrpc';
import { Disposable } from 'vscode-ws-jsonrpc';
import { ConnectionUtil } from './connection-util';
import { BaseRcpClient } from './rcp-client';

export class InscriptionClientJsonRpc extends BaseRcpClient implements InscriptionClient {
  protected onDataChangedEmitter = new Emitter<InscriptionDataBeta>();
  onDataChanged = this.onDataChangedEmitter.event;
  protected onValidationEmitter = new Emitter<InscriptionValidation[]>();
  onValidation = this.onValidationEmitter.event;

  protected override setupConnection(): void {
    super.setupConnection();
    this.toDispose.push(this.onDataChangedEmitter);
    this.onNotification('dataChanged', data => this.onDataChangedEmitter.fire(data));
    this.toDispose.push(this.onValidationEmitter);
    this.onNotification('validation', validations => this.onValidationEmitter.fire(validations));
  }

  initialize(): Promise<boolean> {
    return this.sendRequest('initialize', undefined);
  }

  data(pid: string): Promise<InscriptionDataBeta> {
    return this.sendRequest('data', { pid });
  }

  saveData(args: InscriptionSaveData): Promise<InscriptionValidation[]> {
    return this.sendRequest('saveData', { ...args });
  }

  dialogStarts(pid: string): Promise<CallableStart[]> {
    return this.sendRequest('meta/start/dialogs', { pid });
  }

  triggerStarts(pid: string): Promise<CallableStart[]> {
    return this.sendRequest('meta/start/triggers', { pid });
  }

  callSubStarts(pid: string): Promise<CallableStart[]> {
    return this.sendRequest('meta/start/calls', { pid });
  }

  roles(pid: string): Promise<Role[]> {
    return this.sendRequest('meta/workflow/roles', { pid });
  }

  expiryErrors(pid: string): Promise<ExpiryError[]> {
    return this.sendRequest('meta/workflow/expiryErrors', { pid });
  }

  outMapping(pid: string): Promise<MappingInfo> {
    return this.sendRequest('meta/out/map', { pid });
  }

  sendRequest<K extends keyof InscriptionRequestTypes>(
    command: K,
    args: InscriptionRequestTypes[K][0]
  ): Promise<InscriptionRequestTypes[K][1]> {
    return args === undefined ? this.connection.sendRequest(command) : this.connection.sendRequest(command, args);
  }

  onNotification<K extends keyof InscriptionNotificationTypes>(
    kind: K,
    listener: (args: InscriptionNotificationTypes[K]) => any
  ): Disposable {
    return this.connection.onNotification(kind, listener);
  }
}

export namespace InscriptionClientJsonRpc {
  export async function startWebSocketClient(url: string): Promise<InscriptionClient> {
    const connection = await ConnectionUtil.createWebSocketConnection(url);
    const messageConnection = createMessageConnection(connection.reader, connection.writer);
    const client = new InscriptionClientJsonRpc(messageConnection);
    client.start();
    connection.reader.onClose(() => client.stop());
    return client;
  }
}
