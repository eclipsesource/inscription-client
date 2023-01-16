import { InscriptionData, InscriptionSaveData } from './data/inscription-data';
import { DialogStart, ExpiryError, Role, Variable } from './meta/inscription-meta';
import { InscriptionValidation } from './validation/inscription-validation';

export declare module InscriptionProtocol {
  export type InitializeArgs = void;
  export type InitializeRes = boolean;

  export type InscriptionDataArgs = { pid: string };
  export type InscriptionDataRes = InscriptionData;

  export type InscriptionSaveDataArgs = InscriptionSaveData;
  export type InscriptionSaveDataRes = InscriptionValidation[];

  export type DialogStartsArgs = {};
  export type DialogStartsRes = DialogStart[];

  export type RolesArgs = { pid: string };
  export type RolesRes = Role[];

  export type ExpiryErrorsArgs = { pid: string };
  export type ExpiryErrorsRes = ExpiryError[];

  export type OutMappingArgs = {};
  export type OutMappingRes = Variable[];
}

export interface InscriptionRequestTypes {
  initialize: [InscriptionProtocol.InitializeArgs, InscriptionProtocol.InitializeRes];
  data: [InscriptionProtocol.InscriptionDataArgs, InscriptionProtocol.InscriptionDataRes];
  saveData: [InscriptionProtocol.InscriptionSaveDataArgs, InscriptionProtocol.InscriptionSaveDataRes];

  'meta/dialog/starts': [InscriptionProtocol.DialogStartsArgs, InscriptionProtocol.DialogStartsRes];
  'meta/workflow/roles': [InscriptionProtocol.RolesArgs, InscriptionProtocol.RolesRes];
  'meta/workflow/expiryErrors': [InscriptionProtocol.ExpiryErrorsArgs, InscriptionProtocol.ExpiryErrorsRes];
  'meta/out/map': [InscriptionProtocol.OutMappingArgs, InscriptionProtocol.OutMappingRes];
}

export interface InscriptionNotificationTypes {
  dataChanged: InscriptionData;
  validation: InscriptionValidation[];
}