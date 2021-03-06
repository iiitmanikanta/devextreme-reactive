import React from 'react';
import PropTypes from 'prop-types';
import {
  Getter, Template, PluginContainer,
  TemplateConnector, TemplateRenderer,
} from '@devexpress/dx-react-core';
import {
  getRowChange,
  tableRowsWithEditing,
  isAddedTableRow,
  isEditTableCell,
} from '@devexpress/dx-grid-core';

const getEditTableCellTemplateArgs = (
  params,
  getters,
  { changeRow, changeAddedRow },
) => {
  const { getCellData, createRowChange } = getters;
  const isNew = isAddedTableRow(params.tableRow);
  const { rowId, row } = params.tableRow;
  const { column } = params.tableColumn;
  const changedRow = isNew
    ? row
    : { ...row, ...getRowChange(getters.changedRows, rowId) };
  return {
    ...params,
    row,
    column,
    value: getCellData(changedRow, column.name),
    onValueChange: (newValue) => {
      const changeArgs = {
        rowId,
        change: createRowChange(changedRow, column.name, newValue),
      };
      if (isNew) {
        changeAddedRow(changeArgs);
      } else {
        changeRow(changeArgs);
      }
    },
  };
};

const pluginDependencies = [
  { pluginName: 'EditingState' },
  { pluginName: 'TableView' },
];

export class TableEditRow extends React.PureComponent {
  render() {
    const { editCellTemplate, rowHeight } = this.props;

    const tableBodyRowsComputed = ({ tableBodyRows, editingRows, addedRows }) =>
      tableRowsWithEditing(tableBodyRows, editingRows, addedRows, rowHeight);

    return (
      <PluginContainer
        pluginName="TableEditRow"
        dependencies={pluginDependencies}
      >
        <Getter name="tableBodyRows" computed={tableBodyRowsComputed} />
        <Template
          name="tableViewCell"
          predicate={({ tableRow, tableColumn }) => isEditTableCell(tableRow, tableColumn)}
        >
          {params => (
            <TemplateConnector>
              {(getters, actions) => (
                <TemplateRenderer
                  template={editCellTemplate}
                  params={getEditTableCellTemplateArgs(
                    params,
                    getters,
                    actions,
                  )}
                />
              )}
            </TemplateConnector>
          )}
        </Template>
      </PluginContainer>
    );
  }
}
TableEditRow.propTypes = {
  rowHeight: PropTypes.any,
  editCellTemplate: PropTypes.func.isRequired,
};
TableEditRow.defaultProps = {
  rowHeight: undefined,
};
