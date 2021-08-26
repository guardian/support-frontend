// @flow
import React from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { background, brandAltBackground } from '@guardian/src-foundations/palette';
import { SvgCheckmark } from '@guardian/src-icons';

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

const Padlock = () => (
  <div aria-label="Not included" css={[indicators, greyBackground]}>
    <SvgPadlock />
  </div>
);

const Checkmark = () => (
  <div aria-label="Included" css={[indicators, checkmark, yellowBackground]}>
    <SvgCheckmark />
  </div>);

export const rows = [
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

export const headers = [
  {
    content: 'Benefits',
    isHidden: true,
  },
  {
    content: 'Paid',
    isIcon: true,
  },
  {
    content: 'Free',
    isIcon: true,
  },
  {
    content: 'Actions',
    isHidden: true,
  },
  {
    content: 'More Details',
    isHidden: true,
    isStyleless: true,
  },
];

export const footer = (
  <>
    <div css={descriptionIcon}><SvgFreeTrial /></div>
    <span>Plus a 14 day free trial</span>
  </>
);
