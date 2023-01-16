import './PrioritySelect.css';
import { useMemo } from 'react';
import { useTaskData } from '../../../../context';
import { TaskDataAccess } from '@axonivy/inscription-protocol';
import { Select, SelectItem } from '../../../../components/widgets';
import { Message } from '../../../../components/props';

const items: SelectItem[] = [
  { label: 'Low', value: 'LOW' },
  { label: 'Normal', value: 'NORMAL' },
  { label: 'High', value: 'HIGH' },
  { label: 'Exception', value: 'EXCEPTION' },
  { label: 'Script', value: 'SCRIPT' }
];

const PrioritySelect = (props: { dataPath: keyof TaskDataAccess; message?: Message }) => {
  const [, priority, setPriority] = useTaskData(props.dataPath);
  const selectedItem = useMemo(() => items.find(e => e.value === priority), [priority]);

  return (
    <div className='priority-select'>
      <Select label='Priority' value={selectedItem} onChange={item => setPriority(item.value)} items={items} message={props.message}>
        <>{selectedItem?.value === 'SCRIPT' && <input className='input' />}</>
      </Select>
    </div>
  );
};

export default PrioritySelect;
