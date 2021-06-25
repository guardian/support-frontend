// @flow

import React from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { border } from '@guardian/src-foundations/palette';
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
  height: 34px;
  width: 34px;
  margin-right: ${space[2]}px;
  svg {
    width: 100%;
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
  border: ${border.secondary} 1px solid;
  border-top: none;

  ${from.mobileLandscape} {
    padding: ${space[3]}px;
  }
`;

const indicators = css`
  display: inline-flex;
  width: 40px;
  height: 59px;
  align-items: center;
  justify-content: center;
  svg {
    display: block;
  }

  ${from.phablet} {
    width: 60px;
  }
`;

const checkmark = css`
  background-color: #FFE500;
  svg {
    max-width: 25px;
  }
`;

const padlock = css`
  border-left: ${border.secondary} 1px solid;
`;

const Padlock = () => (
  <div css={[indicators, padlock]}><SvgPadlock /></div>
);

const Checkmark = () => (
  <div css={[indicators, checkmark]}><SvgCheckmark /></div>
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

export const finalRow = [
  {
    icon: <div css={iconContainer}><SvgFreeTrial /></div>,
    description: <>Plus a <span css={bold}>14 day free trial</span></>,
    free: null,
    paid: null,
    cssOverrides: finalRowStyle,
  },
];
