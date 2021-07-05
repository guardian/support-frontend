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
import { comparisonTableYellow } from 'stylesheets/emotion/colours';

const iconSizeMobile = 28;
const iconSizeDesktop = 34;
const titleRowHeight = 30;
const borderStyle = `${border.primary} 1px solid`;

const iconContainer = css`
  display: inline-flex;
  align-self: center;
  height: ${iconSizeMobile}px;
  width: ${iconSizeMobile}px;
  margin-right: ${space[3]}px;
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

const bold = css`
  font-weight: bold;
`;

const borderBottomNone = css`
  border-bottom: none;
`;

const finalRowStyle = css`
  background-color: ${comparisonTableYellow};
  padding: ${space[3]}px;
  padding-left: ${space[3]}px;
  border-top: ${borderStyle};
  border-bottom: ${borderStyle};

  ${from.mobileLandscape} {
    padding: ${space[3]}px;
    border: ${borderStyle};
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
  :last-of-type {
    height: 60px;
  }
`;

const padlock = css`
  height: 59px;
  border-left: ${borderStyle};
`;

const columnTitle = css`
  align-items: flex-start;
  justify-content: flex-start;
  padding: ${space[1]}px;
  height: ${titleRowHeight}px;
  ${textSans.xsmall({ fontWeight: 'bold' })}
  border-left: ${borderStyle};
  border-top: ${borderStyle};

  ${from.mobileLandscape} {
    ${textSans.small({ fontWeight: 'bold' })}
  }
`;

const paid = css`
  background-color: ${brandAltBackground.primary};
  border-bottom: ${borderStyle};
`;

const free = css`
  background-color: ${background.secondary};
  border-bottom: ${borderStyle};
`;

const titleRowStyle = css`
  height: ${titleRowHeight}px;
`;

const hideOnVerySmall = css`
  display: none;

  ${from.mobileLandscape} {
    display: inline-block;
  }
`;

const noWrap = css`
  white-space: nowrap;
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
    description: <>The Editions app with <span css={hideOnVerySmall}>unique</span>{' '}digital supplements</>,
    free: <Padlock />,
    paid: <Checkmark />,
  },
  {
    icon: <div css={iconContainer}><SvgLiveAppIcon /></div>,
    description: <>The Guardian app with premium features
      <span css={[hideOnVerySmall, noWrap]}>;&nbsp;</span>
      <span css={hideOnVerySmall}>Live and Discover</span></>,
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
