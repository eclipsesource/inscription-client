import './EditableCell.css';
import { CellContext, RowData } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useReadonly } from '../../../../context';
import { CodeEditor } from '../../code-editor';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    updateData: (rowId: string, columnId: string, value: unknown) => void;
  }
}

export function CodeEditorCell<TData>({
  cell,
  context
}: {
  cell: CellContext<TData, unknown>;
  context?: { type: string; location: string };
}) {
  const initialValue = cell.getValue();
  const [value, setValue] = useState(initialValue);
  const [isActive, setIsActive] = useState(false);
  const onBlur = () => {
    setIsActive(false);
    cell.table.options.meta?.updateData(cell.row.id, cell.column.id, value);
  };
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  const readonly = useReadonly();

  return (
    <>
      {isActive ? (
        <div onBlur={onBlur}>
          <CodeEditor
            code={value as string}
            onChange={setValue}
            location={context ? `${context.location}&type=${context.type}` : undefined}
            initFocus={true}
            singleLine={true}
          />
        </div>
      ) : (
        <input
          className='input'
          value={value as string}
          onChange={e => setValue(e.target.value)}
          onClick={() => setIsActive(true)}
          disabled={readonly}
        />
      )}
    </>
  );
}
