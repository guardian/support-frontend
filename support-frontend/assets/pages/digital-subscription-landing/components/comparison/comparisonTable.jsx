// @flow

import React, { type Node } from 'react';
import { css } from '@emotion/core';
import { from } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';
import { background, border } from '@guardian/src-foundations/palette';
import { body } from '@guardian/src-foundations/typography';

import BlockLabel from 'components/blockLabel/blockLabel';
import { titleRow, tableContent, finalRow } from './tableContents';
import { type Option } from 'helpers/types/option';

export type TableRow = {
  icon: Option<Node>,
  description: string | Node,
  free: Option<Node>,
  paid: Option<Node>,
  cssOverrides?: Option<string>,
}

const borderStyle = `${border.secondary} 1px solid`;

const container = css`
  padding-top: ${space[4]}px;

  ${from.desktop} {
    padding: 0;
  }
`;

const tableContainer = css`
  box-sizing: border-box;
  width: 100%;
  background-color: ${background.primary};
  padding-left: ${space[2]}px;

  ${from.mobileLandscape} {
    padding-left: ${space[3]}px;
  }

  ${from.desktop} {
    border-left: ${borderStyle};
    border-right: ${borderStyle};
  }
`;

const label = css`
  position: absolute;
  left: 0;
  top: -27px;

  ${from.tablet} {
    top: -31px;
  }

  ${from.desktop} {
    top: -35px;
  }
`;

const rowText = css`
  display: inline-flex;
  vertical-align: middle;
  padding: ${space[3]}px 0;
  max-width: 70%;

  ${from.phablet} {
    max-width: 80%;
  }
`;

const rowStyle = css`
  position: relative;
  z-index: 1;
  height: 60px;
  border-bottom: ${borderStyle};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const descriptionStyle = css`
  ${body.small()};
  line-height: 135%;
  align-self: center;

  ${from.mobileLandscape} {
    ${body.medium()};
  }
`;

const indicators = css`
  max-width: 40%;
`;

const ComparisonTableRow = ({
  icon, description, free, paid, cssOverrides,
}: TableRow) => (
  <li css={[rowStyle, cssOverrides]}>
    <div css={rowText}>
      {icon}<span css={descriptionStyle}>{description}</span>
    </div>
    <span css={indicators}>
      {free}
      {paid}
    </span>
  </li>
);


const ComparisonTable = () => (
  <section css={container}>
    <BlockLabel tag="h2" cssOverrides={label}>Your subscription at a glance</BlockLabel>
    {titleRow.map(row => (
      <ComparisonTableRow
        cssOverrides={row.cssOverrides}
        icon={row.icon}
        description={row.description}
        free={row.free}
        paid={row.paid}
      />
      ))}
    <div css={tableContainer}>
      <ul>
        {tableContent.map(row => (
          <ComparisonTableRow
            cssOverrides={row.cssOverrides}
            icon={row.icon}
            description={row.description}
            free={row.free}
            paid={row.paid}
          />))}
      </ul>

    </div>
    {finalRow.map(row => (
      <ComparisonTableRow
        cssOverrides={row.cssOverrides}
        icon={row.icon}
        description={row.description}
        free={row.free}
        paid={row.paid}
      />
      ))}
  </section>
);

ComparisonTableRow.defaultProps = {
  cssOverrides: null,
};


export default ComparisonTable;
