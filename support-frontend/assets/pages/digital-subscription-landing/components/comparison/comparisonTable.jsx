// @flow

import React, { type Node } from 'react';
import { css } from '@emotion/core';
import { from } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';
import { border } from '@guardian/src-foundations/palette';
import { body } from '@guardian/src-foundations/typography';

import BlockLabel from 'components/blockLabel/blockLabel';
import { titleRow, tableContent, finalRow } from './tableContents';
import { type Option } from 'helpers/types/option';

export type TableRow = {
  icon: Option<Node>,
  description: string | Node,
  ariaLabel: string,
  free: Option<Node>,
  paid: Option<Node>,
  cssOverrides?: Option<string> | Array<string>,
}

const borderStyle = `${border.primary} 1px solid`;

const container = css`
  padding-top: ${space[4]}px;

  ${from.desktop} {
    padding: 0;
  }
`;

const fullwidth = css`
  width: 100%;
`;

const tableContainer = css`
  *, *:before, *:after {
    box-sizing: border-box;
  }
  padding-left: ${space[3]}px;
  border: ${borderStyle};
  border-bottom: none;
`;

const tableRows = css`
  display: grid;
  grid-template-rows: repeat(7, 60px);
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

const rowStyle = css`
  display: grid;
  grid-template-columns: 1fr 40px 40px;
  border-bottom: ${borderStyle};

  ${from.mobileLandscape} {
    grid-template-columns: 1fr minmax(40px, 60px) minmax(40px, 60px);
  }
`;

const rowIconAndText = css`
  display: inline-flex;
  align-items: center;
  text-align: left;

  ${from.mobileMedium} {
    padding-right: ${space[3]}px;
  }

  ${from.tablet} {
    padding: ${space[3]}px 0;
  }
`;

const descriptionStyle = css`
  display: inline-block;
  ${body.small()};
  line-height: 135%;

  ${from.phablet} {
    ${body.medium()};
  }
`;

const visuallyHidden = css`
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const ComparisonTableRow = ({
  icon, description, ariaLabel, free, paid, cssOverrides,
}: TableRow) => (
  <tr css={[rowStyle, cssOverrides]}>
    <th aria-label={ariaLabel} scope="row" css={rowIconAndText}>
      {icon}<div aria-hidden="true" css={descriptionStyle}>{description}</div>
    </th>
    <td>{free}</td>
    <td>{paid}</td>
  </tr>
);


const ComparisonTable = () => (
  <section css={container}>
    <BlockLabel tag="h2" cssOverrides={label}>Your subscription at a glance</BlockLabel>
    <table role="presentation" css={fullwidth}>
      <caption css={visuallyHidden}>What&apos;s included in a paid digital subscription</caption>
      <thead>
        <tr css={[rowStyle, titleRow.cssOverrides]}>
          <th scope="col" css={rowIconAndText} />
          <th scope="col">{titleRow.free}</th>
          <th scope="col">{titleRow.paid}</th>
        </tr>
      </thead>
      <tbody>
        <div css={tableContainer}>
          <div css={tableRows}>
            {tableContent.map(row => (
              <ComparisonTableRow
                cssOverrides={row.cssOverrides}
                icon={row.icon}
                description={row.description}
                ariaLabel={row.ariaLabel}
                free={row.free}
                paid={row.paid}
              />))}
          </div>
        </div>
      </tbody>
      <div css={[rowStyle, finalRow.cssOverrides]}>
        <div css={[rowIconAndText]}>
          {finalRow.icon}<div aria-label={finalRow.ariaLabel} css={descriptionStyle}>{finalRow.description}</div>
        </div>
      </div>
    </table>
  </section>
);

ComparisonTableRow.defaultProps = {
  cssOverrides: null,
};


export default ComparisonTable;
