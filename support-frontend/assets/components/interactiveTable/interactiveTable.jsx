// @flow
// $FlowIgnore
import React, { useState, type Node } from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { from, until } from '@guardian/src-foundations/mq';
import { border, background, brandAltBackground } from '@guardian/src-foundations/palette';
import { body, textSans } from '@guardian/src-foundations/typography';
import { SvgChevronDownSingle, SvgCheckmark } from '@guardian/src-icons';
import { Button } from '@guardian/src-button';
import { neutral, sport } from '@guardian/src-foundations/palette';
import { visuallyHidden as _visuallyHidden } from '@guardian/src-foundations/accessibility';

import { SvgNews } from 'components/icons/news';
import { SvgAdFree } from 'components/icons/adFree';
import { SvgEditionsIcon, SvgLiveAppIcon } from 'components/icons/appsIcon';
import { SvgTicket } from 'components/icons/ticket';
import { SvgOffline } from 'components/icons/offlineReading';
import { SvgCrosswords } from 'components/icons/crosswords';
import { SvgFreeTrial } from 'components/icons/freeTrial';
import { SvgPadlock } from 'components/icons/padlock';

const iconSizeMobile = 28;
const iconSizeDesktop = 34;
const titleRowHeight = 30;
const borderStyle = `${border.secondary} 1px solid`;

const visuallyHidden = css`
  ${_visuallyHidden}
`;

const table = css`
  width: 100%;
  background-color: ${neutral[86]};
  ${body.small()}

  ${until.mobileMedium} {
    font-size: 14px;
  }
`;

const tableRow = css`
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 40px 40px 42px;
  grid-template-rows: repeat(2, 1fr);
  text-align: left;
  background-color: ${neutral[100]};
  max-height: 72px;
  transition: all 0.2s ease-in-out;

  :not(:first-of-type) {
    margin-top: ${space[2]}px;
  }
`;

const tableHeaderRow = css`
  grid-template-rows: 1fr;
`;

const tableRowOpen = css`
  max-height: 300px;
`;

const tableCell = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 72px;
  padding: ${space[4]}px 0;
  padding-right: ${space[3]}px;
`;

const headingCell = css`
  align-self: end;
  ${textSans.small({ fontWeight: 'bold' })}
  padding-bottom: 0;
  height: unset;
`;

const primaryTableCell = css`
  justify-content: flex-start;
  padding-left: ${space[3]}px;
`;

const descriptionIcon = css`
  display: inline-flex;
  align-self: center;
  height: ${iconSizeMobile}px;
  width: ${iconSizeMobile}px;
  margin-right: ${space[2]}px;
  svg {
    height: ${iconSizeMobile}px;
    width: ${iconSizeMobile}px;
  }

  ${from.phablet} {
    height: ${iconSizeDesktop}px;
    width: ${iconSizeDesktop}px;

    svg {
      height: ${iconSizeDesktop}px;
      width: ${iconSizeDesktop}px;
    }
  }
`;

const iconCell = css`
  max-width: 48px;
`;

const expandableButtonCell = css`
  display: flex;
  align-items: center;
  border-left: ${borderStyle};
  padding: 0;
  background-color: ${sport[800]};
`;

const detailsCell = css`
  grid-column: 1 / span 4;
  justify-content: flex-start;
  background-color: ${sport[800]};
  border-top: ${borderStyle};
  padding-left: ${space[3]}px;
`;

const detailsHidden = css`
  display: none;
`;

const detailsVisible = css`
  display: block;
`;

const toggleButton = css`
  /* position: absolute;
  left: ${space[4]}px;
  right: ${space[4]}px;
  width: calc(100% - 32px); */
  /* Allows space for the 5px focus box shadow */
  height: 62px;
  /* justify-content: flex-end; */
  align-items: center;

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

const finalRow = css`
  display: block;
  margin-top: ${space[2]}px;
`;

const indicators = css`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 27px;
  height: 27px;

  svg {
    display: block;
    margin: 0 auto;
  }
`;

const checkmark = css`
  svg {
    max-width: 25px;
  }
`;

const yellowBackground = css`
  background: ${brandAltBackground.primary};
`;

const greyBackground = css`
  background: ${background.secondary};
`;

const hideOnVerySmall = css`
  display: none;

  ${from.mobileMedium} {
    display: inline-block;
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

const Padlock = () => (
  <div aria-label="Not included" css={[indicators, greyBackground]}>
    <SvgPadlock />
  </div>
);

const Checkmark = () => (
  <div aria-label="Included" css={[indicators, checkmark, yellowBackground]}>
    <SvgCheckmark />
  </div>);

function InteractiveTableRow({
  rowId, columns, details,
}: RowData) {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  return (
    <tr role="row" css={[tableRow, showDetails ? tableRowOpen : '']}>
      {columns.map((column) => {
        if (column.isPrimary) {
          return (
            <th scope="row" role="rowHeader" css={[tableCell, primaryTableCell]}>
              {column.content}
            </th>
          );
        }
        return <td role="cell" css={[tableCell, iconCell]}>{column.content}</td>;
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
          {`${showDetails ? 'Hide' : 'Show'} more details`}
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
        content: (
          <>
            <div css={descriptionIcon}><SvgNews /></div>
            <span>Access to the Guardian&apos;s quality, open journalism</span>
          </>),
        isPrimary: true,
      },
      {
        content: <Checkmark />,
      },
      {
        content: <Checkmark />,
      },
    ],
    details: 'It\'s really very very good journalism',
  },
  {
    rowId: 'row2',
    columns: [
      {
        content: <><div css={descriptionIcon}><SvgAdFree /></div>
          <span>Ad-free reading on all your devices</span></>,
        isPrimary: true,
      },
      {
        content: <Checkmark />,
      },
      {
        content: <Padlock />,
      },
    ],
    details: 'You will need your own stable',
  },

  {
    rowId: 'row3',
    columns: [
      {
        content: <><div css={descriptionIcon}><SvgEditionsIcon /></div>
          <span><strong>The Editions app:</strong> <span css={hideOnVerySmall}>unique</span>{' '}digital supplements</span></>,
        isPrimary: true,
      },
      {
        content: <Checkmark />,
      },
      {
        content: <Padlock />,
      },
    ],
    details: 'You will need your own stable',
  },
  {
    rowId: 'row4',
    columns: [
      {
        content: <><div css={descriptionIcon}><SvgLiveAppIcon /></div>
          <span><strong>The Guardian app</strong> with premium features</span></>,
        isPrimary: true,
      },
      {
        content: <Checkmark />,
      },
      {
        content: <Padlock />,
      },
    ],
    details: 'You will need your own stable',
  },
  {
    rowId: 'row5',
    columns: [
      {
        content: <><div css={descriptionIcon}><SvgTicket /></div>
          <span>Unlimited tickets to Guardian digital events</span></>,
        isPrimary: true,
      },
      {
        content: <Checkmark />,
      },
      {
        content: <Padlock />,
      },
    ],
    details: 'You will need your own stable',
  },
  {
    rowId: 'row6',
    columns: [
      {
        content: <><div css={descriptionIcon}><SvgOffline /></div>
          <span>Offline reading in both your apps</span></>,
        isPrimary: true,
      },
      {
        content: <Checkmark />,
      },
      {
        content: <Padlock />,
      },
    ],
    details: 'You will need your own stable',
  },
  {
    rowId: 'row7',
    columns: [
      {
        content: <><div css={descriptionIcon}><SvgCrosswords /></div>
          <span>Play interactive crosswords</span></>,
        isPrimary: true,
      },
      {
        content: <Checkmark />,
      },
      {
        content: <Padlock />,
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
        <tr role="row" css={[tableRow, tableHeaderRow]}>
          <th scope="col" role="columnHeader" css={[tableCell, headingCell]}><span css={visuallyHidden}>Benefits</span></th>
          <th scope="col" role="columnHeader" css={[tableCell, headingCell, iconCell]}>Paid</th>
          <th scope="col" role="columnHeader" css={[tableCell, headingCell, iconCell]}>Free</th>
          <th scope="col" role="columnHeader" css={[tableCell, headingCell]}><span css={visuallyHidden}>Actions</span></th>
          <th scope="col" role="columnHeader"><span css={visuallyHidden}>More details</span></th>
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
        <tr role="row" css={finalRow}>
          <td role="cell" colSpan="5" aria-colspan="5" css={[tableCell, primaryTableCell, yellowBackground]}>
            <div css={descriptionIcon}><SvgFreeTrial /></div>
            <span>Plus 14 day free trial</span>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

export default InteractiveTable;
