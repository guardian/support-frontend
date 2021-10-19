import type { Node } from "react";
import React from "react";
import { css } from "@emotion/core";
import { from, until } from "@guardian/src-foundations/mq";
import { body } from "@guardian/src-foundations/typography";
import { background } from "@guardian/src-foundations/palette";
import { visuallyHidden as _visuallyHidden } from "@guardian/src-foundations/accessibility";
import type { RowData, CellData } from "./interactiveTableRow";
import { InteractiveTableRow, InteractiveTableHeaderRow, InteractiveTableFooterRow } from "./interactiveTableRow";
const visuallyHidden = css`
  ${_visuallyHidden}
`;
const table = css`
  position: relative;
  width: 100%;
  ${body.small()}

  ${until.mobileMedium} {
    font-size: 14px;
  }

  ${from.desktop} {
    ${body.medium()}
  }
`;
const stickyHeader = css`
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: ${background.ctaPrimary};
`;
type InteractiveTablePropTypes = {
  caption: Node;
  headers: CellData[];
  rows: RowData[];
  footer: Node;
};

function InteractiveTable({
  caption,
  headers,
  rows,
  footer
}: InteractiveTablePropTypes) {
  return <table css={table}>
      <caption css={visuallyHidden}>{caption}</caption>
      <thead css={stickyHeader}>
        <InteractiveTableHeaderRow columns={headers} />
      </thead>
      <tbody>
        {rows.map(({
        rowId,
        columns,
        details,
        onClick
      }) => <InteractiveTableRow rowId={rowId} columns={columns} details={details} onClick={onClick} />)}
      </tbody>
      <tfoot>
        <InteractiveTableFooterRow>
          {footer}
        </InteractiveTableFooterRow>
      </tfoot>
    </table>;
}

export default InteractiveTable;