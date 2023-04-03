import './ResponsibleSelect.css';
import { useEffect, useMemo, useState } from 'react';
import { Responsible, ResponsibleType, RESPONSIBLE_TYPE } from '@axonivy/inscription-protocol';
import { Select, SelectItem } from '../../../../components/widgets';
import { useClient, useEditorContext } from '../../../../context';
import { Consumer } from '../../../../types/lambda';

const DEFAULT_ROLE: SelectItem = { label: 'Everybody', value: 'Everybody' } as const;

export interface ResponsibleUpdater {
  updateType: Consumer<ResponsibleType>;
  updateActivator: Consumer<string>;
}

const RoleSelect = (props: { responsible?: Responsible; updateResponsible: ResponsibleUpdater }) => {
  const [roleItems, setRoleItems] = useState<SelectItem[]>([]);
  const editorContext = useEditorContext();
  const client = useClient();
  useEffect(() => {
    client.roles(editorContext.pid).then(roles =>
      setRoleItems(
        roles.map(role => {
          return { label: role.id, value: role.id };
        })
      )
    );
  }, [client, editorContext.pid]);
  const selectedRole = useMemo<SelectItem>(
    () => roleItems.find(e => e.value === props.responsible?.activator) ?? DEFAULT_ROLE,
    [props.responsible?.activator, roleItems]
  );

  return (
    <Select label='Role' items={roleItems} value={selectedRole} onChange={item => props.updateResponsible.updateActivator(item.value)} />
  );
};

const ResponsibleActivator = (props: {
  responsible?: Responsible;
  updateResponsible: ResponsibleUpdater;
  selectedType?: ResponsibleType;
}) => {
  switch (props.selectedType) {
    case 'ROLE':
      return <RoleSelect {...props} />;
    case 'ROLE_FROM_ATTRIBUTE':
    case 'USER_FROM_ATTRIBUTE':
      return (
        <input
          className='input'
          aria-label='activator'
          value={props.responsible?.activator ?? ''}
          onChange={e => props.updateResponsible.updateActivator(e.target.value)}
        />
      );
    case 'DELETE_TASK':
    default:
      return <></>;
  }
};

const DEFAULT_RESPONSIBLE_TYPE: SelectItem & { value: ResponsibleType } = { label: 'Role', value: 'ROLE' };

const ResponsibleSelect = (props: {
  responsible?: Responsible;
  updateResponsible: ResponsibleUpdater;
  optionFilter?: ResponsibleType[];
}) => {
  const typeItems = useMemo<SelectItem[]>(
    () =>
      Object.entries(RESPONSIBLE_TYPE)
        .filter(([value]) => !(props.optionFilter && props.optionFilter.includes(value as ResponsibleType)))
        .map(([value, label]) => ({ label, value })),
    [props.optionFilter]
  );
  const selectedType = useMemo<SelectItem>(
    () => typeItems.find(e => e.value === props.responsible?.type) ?? DEFAULT_RESPONSIBLE_TYPE,
    [props.responsible?.type, typeItems]
  );

  return (
    <div className='responsible-select'>
      <Select
        label='Responsible'
        items={typeItems}
        value={selectedType}
        onChange={item => props.updateResponsible.updateType(item.value as ResponsibleType)}
      >
        <ResponsibleActivator {...props} selectedType={selectedType?.value as ResponsibleType} />
      </Select>
    </div>
  );
};

export default ResponsibleSelect;