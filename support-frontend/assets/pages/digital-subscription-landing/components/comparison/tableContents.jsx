// @flow

import React from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { border, background, brandAltBackground } from '@guardian/src-foundations/palette';
import { textSans } from '@guardian/src-foundations/typography';
import { SvgCheckmark } from '@guardian/src-icons';
import { from } from '@guardian/src-foundations/mq';

import { type TableRow } from './comparisonTable';
import { SvgNews } from 'components/icons/news';
import { SvgAdFree } from 'components/icons/adFree';
import { SvgEditionsIcon, SvgLiveAppIcon } from 'components/icons/appsIcon';
import { SvgTicket } from 'components/icons/ticket';
import { SvgOffline } from 'components/icons/offlineReading';
import { SvgCrosswords } from 'components/icons/crosswords';
import { SvgFreeTrial } from 'components/icons/freeTrial';
import { SvgPadlock } from 'components/icons/padlock';

const iconContainer = css`
  display: inline-block;
  height: 28px;
  width: 28px;
  margin-right: ${space[2]}px;
  svg {
    width: 100%;
  }

  ${from.phablet} {
    height: 34px;
    width: 34px;
  }
`;

const bold = css`
  font-weight: bold;
`;

const borderBottomNone = css`
  border-bottom: none;
`;

const finalRowStyle = css`
  background-color: #FFFACC;
  padding: ${space[3]}px;
  padding-left: ${space[1]}px;
  border-top: ${border.secondary} 1px solid;
  border-bottom: ${border.secondary} 1px solid;

  ${from.mobileLandscape} {
    padding: ${space[3]}px;
    border: ${border.secondary} 1px solid;
  }
`;

const indicators = css`
  display: inline-flex;
  width: 40px;
  align-items: center;
  justify-content: center;
  svg {
    display: block;
  }

  ${from.mobileLandscape} {
    width: 60px;
  }
`;

const checkmark = css`
  height: 59px;
  svg {
    max-width: 25px;
  }
`;

const padlock = css`
  height: 59px;
  border-left: ${border.secondary} 1px solid;
`;

const columnTitle = css`
  align-items: flex-start;
  justify-content: flex-start;
  padding: ${space[1]}px;
  height: 30px;
  ${textSans.xsmall({ fontWeight: 'bold' })}
  border-left: ${border.secondary} 1px solid;
  border-top: ${border.secondary} 1px solid;

  ${from.mobileLandscape} {
    ${textSans.small({ fontWeight: 'bold' })}
  }
`;

const paid = css`
  background-color: ${brandAltBackground.primary};
  border-bottom: ${border.secondary} 1px solid;
`;

const free = css`
  background-color: ${background.secondary};
  border-bottom: ${border.secondary} 1px solid;
`;

const titleRowStyle = css`
  height: 30px;
`;

const Padlock = () => (
  <div css={[indicators, padlock, free]}><SvgPadlock /></div>
);

const Checkmark = () => (
  <div css={[indicators, checkmark, paid]}><SvgCheckmark /></div>
);


export const tableContent: Array<TableRow> = [
  {
    icon: <div css={iconContainer}><SvgNews /></div>,
    description: 'Guardian journalism; keeping it open to all',
    free: <Checkmark />,
    paid: <Checkmark />,
  },
  {
    icon: <div css={iconContainer}><SvgAdFree /></div>,
    description: 'Ad-free reading on all your devices',
    free: <Padlock />,
    paid: <Checkmark />,
  },
  {
    icon: <div css={iconContainer}><SvgEditionsIcon /></div>,
    description: 'The Editions app with digital supplements',
    free: <Padlock />,
    paid: <Checkmark />,
  },
  {
    icon: <div css={iconContainer}><SvgLiveAppIcon /></div>,
    description: 'The Guardian app with premium features',
    free: <Padlock />,
    paid: <Checkmark />,
  },
  {
    icon: <div css={iconContainer}><SvgTicket /></div>,
    description: 'Six free tickets to Guardian events',
    free: <Padlock />,
    paid: <Checkmark />,
  },
  {
    icon: <div css={iconContainer}><SvgOffline /></div>,
    description: 'Offline reading in both your apps',
    free: <Padlock />,
    paid: <Checkmark />,
  },
  {
    icon: <div css={iconContainer}><SvgCrosswords /></div>,
    description: 'Play interactive crosswords',
    free: <Padlock />,
    paid: <Checkmark />,
    cssOverrides: borderBottomNone,
  },
];

export const titleRow = [
  {
    icon: null,
    description: null,
    free: <div css={[indicators, columnTitle, free]}>Free</div>,
    paid: <div css={[indicators, columnTitle, paid]}>Paid</div>,
    cssOverrides: titleRowStyle,
  },
];

export const finalRow = [
  {
    icon: <div css={iconContainer}><SvgFreeTrial /></div>,
    description: <>Plus a <span css={bold}>14 day free trial</span></>,
    free: null,
    paid: null,
    cssOverrides: finalRowStyle,
  },
];
