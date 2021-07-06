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
  border: ${borderStyle};
  padding: ${space[3]}px;

  ${from.tablet} {
    padding: 0;
    padding-left: ${space[3]}px;
  }

`;

const indicators = css`
  padding: ${space[4]}px 0;
  height: 99%;

  svg {
    display: block;
    margin: 0 auto;
  }
`;

const checkmark = css`
  height: 100%;

  svg {
    max-width: 25px;
  }
`;

const padlock = css`
  height: 99%;
  border-left: ${borderStyle};
`;

const columnTitle = css`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 3px;
  height: ${titleRowHeight}px;
  ${textSans.xsmall({ fontWeight: 'bold' })}
  border-left: ${borderStyle};
  border-top: ${borderStyle};

  :last-of-type {
    border-right: ${borderStyle};
  }

  ${from.mobileLandscape} {
    ${textSans.small({ fontWeight: 'bold' })}
  }
`;

const paid = css`
  background: ${brandAltBackground.primary};
  height: 99.9%;
`;

const free = css`
  background: ${background.secondary};
  height: 99.9%;
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
    description: 'Access to The Guardian\'s quality, open journalism',
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

export const titleRow = {
  icon: null,
  description: null,
  free: <div css={[indicators, columnTitle, free]}>Free</div>,
  paid: <div css={[indicators, columnTitle, paid]}>Paid</div>,
  cssOverrides: [titleRowStyle, borderBottomNone],
};

export const finalRow = {
  icon: <div css={iconContainer}><SvgFreeTrial /></div>,
  description: <>Plus a <span css={bold}>14 day free trial</span></>,
  free: null,
  paid: null,
  cssOverrides: finalRowStyle,
};
