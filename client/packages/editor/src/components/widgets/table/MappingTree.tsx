import React, { memo } from 'react';

import { Mapping } from '@axonivy/inscription-core';
import {
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table';
import { EditableCell, editableCellMeta } from './EditableCell';
import { ExpandableCell, ExpandableHeader } from './ExpandableCell';
import { Table, TableCell, TableHeader } from './Table';

const MappingTree = (props: { data: Mapping[]; onChange: (change: Mapping[]) => void }) => {
  const columns = React.useMemo<ColumnDef<Mapping>[]>(
    () => [
      {
        accessorKey: 'attribute',
        header: header => <ExpandableHeader header={header} name='Attribute' />,
        cell: cell => <ExpandableCell cell={cell} />,
        footer: props => props.column.id,
        enableSorting: false
      },
      {
        accessorFn: row => row.type,
        id: 'type',
        header: () => <span>Type</span>,
        cell: cell => <span>{cell.getValue() as string}</span>,
        footer: props => props.column.id,
        enableSorting: false
      },
      {
        accessorFn: row => row.expression,
        id: 'expression',
        header: () => <span>Expression</span>,
        cell: cell => <EditableCell cell={cell} />,
        footer: props => props.column.id
      }
    ],
    []
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [expanded, setExpanded] = React.useState<ExpandedState>({ 0: true });

  const table = useReactTable({
    data: props.data,
    columns,
    state: {
      sorting,
      expanded
    },
    onExpandedChange: setExpanded,
    getSubRows: row => row.children,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    meta: editableCellMeta(props.data, newData => props.onChange(newData))
  });

  return (
    <Table>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <TableHeader key={header.id} colSpan={header.colSpan}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHeader>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default memo(MappingTree);