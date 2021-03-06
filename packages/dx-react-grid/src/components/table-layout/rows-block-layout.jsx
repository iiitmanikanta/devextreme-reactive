import React from 'react';
import PropTypes from 'prop-types';

import {
  TemplateRenderer,
} from '@devexpress/dx-react-core';

import {
  findTableCellTarget,
} from '@devexpress/dx-grid-core';

import { RowLayout } from './row-layout';

export class RowsBlockLayout extends React.PureComponent {
  render() {
    const {
      rows,
      columns,
      blockTemplate,
      rowTemplate,
      cellTemplate,
      onClick,
    } = this.props;

    return (
      <TemplateRenderer
        template={blockTemplate}
        params={{
          onClick: (e) => {
            const { rowIndex, columnIndex } = findTableCellTarget(e);
            if (rowIndex === -1 || columnIndex === -1) return;
            onClick({ e, tableRow: rows[rowIndex], tableColumn: columns[columnIndex] });
          },
        }}
      >
        {
          rows
            .map(row => (
              <RowLayout
                key={row.key}
                row={row}
                columns={columns}
                rowTemplate={rowTemplate}
                cellTemplate={cellTemplate}
              />
            ))
        }
      </TemplateRenderer>
    );
  }
}

RowsBlockLayout.propTypes = {
  rows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  blockTemplate: PropTypes.func.isRequired,
  rowTemplate: PropTypes.func.isRequired,
  cellTemplate: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};
