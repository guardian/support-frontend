// @flow
// $FlowIgnore
import React, { useState, type Node } from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { SvgChevronDownSingle } from '@guardian/src-icons';
import { Button } from '@guardian/src-button';
import { neutral, sport } from '@guardian/src-foundations/palette';
import { visuallyHidden as _visuallyHidden } from '@guardian/src-foundations/accessibility';

const visuallyHidden = css`
  ${_visuallyHidden}
`;

const table = css`
  width: 100%;
`;

const tableRow = css`
  position: relative;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  text-align: left;
  background-color: ${neutral[100]};
  max-height: 72px;
  transition: all 0.2s ease-in-out;

  :not(:first-of-type) {
    margin-top: ${space[2]}px;
  }

  td, th {
    display: block;
    flex: 1 1 25%;
    height: 72px;
  }
`;

const tableRowOpen = css`
  background-color: ${sport[800]};
  max-height: 300px;
`;

const tableCell = css`
  padding: ${space[4]}px;
`;

const expandableButtonCell = css`
  order: -1;
  padding: 0;
`;

const detailsCell = css`
  flex: 1 1 100%;
`;

const detailsHidden = css`
  display: none;
`;

const detailsVisible = css`
  display: block;
`;

const toggleButton = css`
  position: absolute;
  left: ${space[4]}px;
  right: ${space[4]}px;
  width: calc(100% - 32px);
  /* Allows space for the 5px focus box shadow */
  height: 62px;
  justify-content: flex-start;

  svg {
    fill: currentColor;
    height: ${space[4]}px;
    max-width: ${space[5]}px;
    transition: transform 0.2s ease-in-out;
  }
`;

const toggleButtonOpen = css`
  svg {
    transform: rotate(180deg);
  }
`;


type CellData = {|
  content: Node;
  isPrimary?: boolean;
|}

type RowData = {|
  rowId: string;
  columns: CellData[];
  details: Node;
|}

function InteractiveTableRow({
  rowId, columns, details,
}: RowData) {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  return (
    <tr role="row" css={[tableRow, showDetails ? tableRowOpen : '']}>
      {columns.map((column) => {
        if (column.isPrimary) {
          return (
            <th scope="row" role="rowHeader" css={tableCell}>
              {column.content}
            </th>
          );
        }
        return <td role="cell" css={tableCell}>{column.content}</td>;
      })}
      <td role="cell" css={expandableButtonCell}>
        <Button
          hideLabel
          priority="subdued"
          icon={<SvgChevronDownSingle />}
          css={[toggleButton, showDetails ? toggleButtonOpen : '']}
          aria-expanded={showDetails ? 'true' : 'false'}
          aria-controls={`${rowId}-details`}
          onClick={() => setShowDetails(!showDetails)}
        >
          Show more details
        </Button>
      </td>
      <td
        role="cell"
        hidden={!showDetails}
        id={`${rowId}-details`}
        css={[tableCell, detailsCell, showDetails ? detailsVisible : detailsHidden]}
      >
        {details}
      </td>
    </tr>
  );
}

const rows: RowData[] = [
  {
    rowId: 'row1',
    columns: [
      {
        content: 'Nice journalism',
        isPrimary: true,
      },
      {
        content: 'Yes',
      },
      {
        content: 'Yes',
      },
    ],
    details: 'It\'s really very very good journalism',
  },
  {
    rowId: 'row2',
    columns: [
      {
        content: 'A free pony',
        isPrimary: true,
      },
      {
        content: 'Yes',
      },
      {
        content: 'No',
      },
    ],
    details: 'You will need your own stable',
  },
];

function InteractiveTable() {
  return (
    <table css={table}>
      <caption css={visuallyHidden}>What&apos;s included in a paid digital subscription</caption>
      <thead>
        <tr role="row" css={tableRow}>
          <th scope="col" role="columnHeader"><span css={visuallyHidden}>Benefits</span></th>
          <th scope="col" role="columnHeader" css={tableCell}>Paid</th>
          <th scope="col" role="columnHeader" css={tableCell}>Free</th>
          <th scope="col" role="columnHeader"><span css={visuallyHidden}>Actions</span></th>
          <th scope="col" role="columnHeader"><span css={visuallyHidden}>Details</span></th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ rowId, columns, details }) =>
          (<InteractiveTableRow
            rowId={rowId}
            columns={columns}
            details={details}
          />))
        }
      </tbody>
      <tfoot>
        <tr role="row" css={tableRow}>
          <td role="cell" colSpan="5" css={tableCell}>
            <div><span>Plus 14 day free trial</span></div>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

export default InteractiveTable;
