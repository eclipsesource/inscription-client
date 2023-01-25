import React from 'react';
import { MappingInfo } from '@axonivy/inscription-protocol';
import { Mapping } from '@axonivy/inscription-protocol';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MappingTree from './MappingTree';
import { DEFAULT_EDITOR_CONTEXT, EditorContextInstance } from '../../../context';

describe('MappingTree', () => {
  const COL_ATTRIBUTES = /▶️ Attribute/;
  const EXP_ATTRIBUTES = /🔽 Attribute/;
  const COL_PARAMS = /▶️ param.procurementRequest/;
  const EXP_PARAMS = /🔽 param.procurementRequest/;
  const NODE_BOOLEAN = /🔵 accepted Boolean/;
  const NODE_NUMBER = /🔵 amount Number/;
  const COL_USER = /▶️ requester workflow.humantask.User/;
  const EXP_USER = /🔽 requester workflow.humantask.User/;
  const NODE_STRING = /🔵 email String/;

  const mappingInfo: MappingInfo = {
    variables: [
      {
        attribute: 'param.procurementRequest',
        type: 'workflow.humantask.ProcurementRequest',
        simpleType: 'ProcurementRequest'
      }
    ],
    types: {
      'workflow.humantask.ProcurementRequest': [
        {
          attribute: 'accepted',
          type: 'Boolean',
          simpleType: 'Boolean'
        },
        {
          attribute: 'amount',
          type: 'Number',
          simpleType: 'Number'
        },
        {
          attribute: 'requester',
          type: 'workflow.humantask.User',
          simpleType: 'User'
        }
      ],
      'workflow.humantask.User': [
        {
          attribute: 'email',
          type: 'String',
          simpleType: 'String'
        }
      ]
    }
  };

  function renderTree(initData?: Mapping[]): {
    data: () => Mapping[];
  } {
    userEvent.setup();
    let data: Mapping[] = initData ?? [{ key: 'param.procurementRequest', value: 'in' }];
    render(<MappingTree data={data} mappingInfo={mappingInfo} onChange={(change: Mapping[]) => (data = change)} />);
    return {
      data: () => data
    };
  }

  function assertTableHeaders(expectedHeaders: string[]) {
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(expectedHeaders.length);
    headers.forEach((header, index) => {
      expect(header).toHaveTextContent(expectedHeaders[index]);
    });
  }

  function assertTableRows(expectedRows: (RegExp | string)[]) {
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(expectedRows.length);
    rows.forEach((row, index) => {
      expect(row).toHaveAccessibleName(expectedRows[index]);
    });
  }

  test('tree will render', () => {
    renderTree();
    assertTableHeaders(['🔽 Attribute', 'Type', 'Expression']);
    assertTableRows([EXP_ATTRIBUTES, EXP_PARAMS, NODE_BOOLEAN, NODE_NUMBER, COL_USER]);
  });

  test('tree will render unknown values', () => {
    renderTree([{ key: 'bla', value: 'unknown value' }]);
    assertTableRows([EXP_ATTRIBUTES, EXP_PARAMS, NODE_BOOLEAN, NODE_NUMBER, COL_USER, /⛔ bla unknown value/]);
  });

  test('tree can expand / collapse', async () => {
    renderTree();
    const treeExpander = screen.getByRole('button', { name: 'Collapse tree' });
    await userEvent.click(treeExpander);
    assertTableRows([COL_ATTRIBUTES, COL_PARAMS]);

    await userEvent.click(treeExpander);
    assertTableRows([EXP_ATTRIBUTES, EXP_PARAMS, NODE_BOOLEAN, NODE_NUMBER, COL_USER]);
  });

  test('tree row can expand / collapse', async () => {
    renderTree();
    const rowExpander = screen.getByRole('button', { name: 'Expand row' });
    await userEvent.click(rowExpander);
    assertTableRows([EXP_ATTRIBUTES, EXP_PARAMS, NODE_BOOLEAN, NODE_NUMBER, EXP_USER, NODE_STRING]);
    await userEvent.click(rowExpander);
    assertTableRows([COL_ATTRIBUTES, EXP_PARAMS, NODE_BOOLEAN, NODE_NUMBER, COL_USER]);
  });

  test('tree can edit expression', async () => {
    const view = renderTree();
    const rowExpander = screen.getByRole('button', { name: 'Expand row' });
    await userEvent.click(rowExpander);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(5);

    await userEvent.type(inputs[2], '123');
    await userEvent.tab();
    expect(inputs[0]).toHaveValue('in');
    expect(inputs[2]).toHaveValue('123');
    assertDataMapping(view.data()[0], { key: 'param.procurementRequest', value: 'in' });
    assertDataMapping(view.data()[1], { key: 'param.procurementRequest.amount', value: '123' });
  });

  test('tree support readonly mode', async () => {
    render(
      <EditorContextInstance.Provider value={{ ...DEFAULT_EDITOR_CONTEXT, readonly: true }}>
        <MappingTree data={[]} mappingInfo={mappingInfo} onChange={() => {}} />
      </EditorContextInstance.Provider>
    );
    expect(screen.getAllByRole('textbox')[0]).toBeDisabled();
  });

  function assertDataMapping(mapping: Mapping, expectedMapping: Mapping) {
    expect(mapping.key).toEqual(expectedMapping.key);
    expect(mapping.value).toEqual(expectedMapping.value);
  }
});
