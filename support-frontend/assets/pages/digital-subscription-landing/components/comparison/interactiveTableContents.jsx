// @flow
import React, { type Node } from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { from, until, breakpoints } from '@guardian/src-foundations/mq';
import { background, brandAltBackground, brand } from '@guardian/src-foundations/palette';
import { SvgCheckmark } from '@guardian/src-icons';
import { headline } from '@guardian/src-foundations/typography';

import { SvgNews } from 'components/icons/news';
import { SvgAdFree } from 'components/icons/adFree';
import { SvgEditionsIcon, SvgLiveAppIcon } from 'components/icons/appsIcon';
import { SvgOffline } from 'components/icons/offlineReading';
import { SvgCrosswords } from 'components/icons/crosswords';
import { SvgFreeTrial } from 'components/icons/freeTrial';
import { SvgPadlock } from 'components/icons/padlock';

import journalismPic from './temp/journalism.png';
import adFreePic from './temp/adFree.png';
import editionsPic from './temp/editions.png';
import guardianAppPic from './temp/guApp.png';
import offlineReadingEdPic from './temp/offlineReadingEditions.png';
import offlineReadingGuPic from './temp/offlineReadingGu.png';
import crosswordsPic from './temp/crosswords.png';
import crosswordsDesktopPic from './temp/crosswordsDesktop.png';

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
    height: 27px;
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

const detailsCellImageFirst = css`
  display: flex;
  align-items: flex-start;
  flex-direction: column-reverse;

  p {
    margin-top: ${space[3]}px;
  }

  ${from.tablet} {
    flex-direction: row;
    justify-content: space-between;

    > * {
      max-width: 500px;
      flex-basis: 50%;
      margin: 0;
    }
  }
`;

const detailsCellImageFirstContainer = css`
  display: flex;
  align-items: flex-end;
  margin: 0 -${space[3]}px;

  img {
    width: 100%;
  }

  ${from.tablet} {
    margin: 0 0 -${space[4]}px;
  }
`;

const detailsCellImageSecond = css`
  display: flex;
  align-items: flex-start;
  flex-direction: column;

  p {
    margin-bottom: ${space[3]}px;
  }


  ${from.tablet} {
    flex-direction: row-reverse;
    justify-content: space-between;

    > * {
      max-width: 500px;
      flex-basis: 50%;
    }
  }
`;

const detailsCellImageSecondContainer = css`
  display: flex;
  align-items: flex-end;
  margin: 0 -${space[3]}px -${space[4]}px;

  img {
    width: 100%;
  }
`;

const detailsCellOfflineReading = css`
  display: flex;
  flex-direction: column;

  ${from.tablet} {
    flex-direction: row-reverse;
    justify-content: center;
  }
`;

const appFeatureImageContainer = css`
  display: flex;

  ${until.tablet} {
    :not(:last-of-type) {
      margin-bottom: ${space[3]}px;
    }
  }
`;

const detailsColumnCrosswords = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  ${from.tablet} {
    flex-direction: row-reverse;
    justify-content: space-around;
  }

  & > * {
    flex-basis: 50%;
  }
`;

const detailsCellImageCrosswords = css`
  display: flex;
  margin: 0 -${space[3]}px -${space[4]}px;

  img {
    width: 100%;
  }

  picture {
    display: flex;
  }
`;

const appFeatureHeadline = css`
  ${headline.xxxsmall({ fontWeight: 'bold' })}
  color: ${brand[400]};
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

type AppName = 'Guardian' | 'Editions'

type AppFeatureWithIconPropTypes = {|
  appName: AppName;
  children: Node;
  // eslint-disable-next-line react/require-default-props
  heading?: string;
|}

const AppFeatureWithIcon = ({ appName, heading = `The ${appName} App`, children }: AppFeatureWithIconPropTypes) => {
  const icon = appName === 'Editions' ? <SvgEditionsIcon /> : <SvgLiveAppIcon />;
  return (
    <section>
      {icon}
      <h4 css={appFeatureHeadline}>{heading}</h4>
      {children}
    </section>
  );
};

export const rows = [
  {
    rowId: 'journalism',
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
    details: (
      <div css={detailsCellImageFirst}>
        <p>
          Independent, honest reporting should be accessible to all without a paywall. With a subscription,
          you’ll not only unlock exclusive features - you’ll help us ensure people around the world have
          access to trusted, reliable information.
        </p>
        <div css={detailsCellImageFirstContainer}>
          <img src={journalismPic} alt="" />
        </div>
      </div>),
  },
  {
    rowId: 'adFree',
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
    details: (
      <div css={detailsCellImageSecond}>
        <p>
          Enjoy an ad-free experience across all of your devices when you&apos;re signed in on your apps
          and theguardian.com
        </p>
        <div css={detailsCellImageSecondContainer}>
          <img src={adFreePic} alt="" />
        </div>
      </div>),
  },

  {
    rowId: 'editionsApp',
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
    details: (
      <div css={detailsCellImageFirst}>
        <p>
          Your <strong>digital newspaper, delivered once a day.</strong> Slow down to enjoy handpicked stories
          and photography, supplements and big-issue deep dives.
        </p>
        <div css={detailsCellImageFirstContainer}>
          <img src={editionsPic} alt="" />
        </div>
      </div>),
  },
  {
    rowId: 'premiumApp',
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
    details: (
      <div css={detailsCellImageSecond}>
        <p>
          <strong>Explore interactive features</strong> that help you stay on top of <strong>breaking news</strong>,
          or keep curious by following topics that matter to you.
        </p>
        <div css={detailsCellImageSecondContainer}>
          <img src={guardianAppPic} alt="" />
        </div>
      </div>),
  },
  {
    rowId: 'offlineReading',
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
    details: (
      <div css={detailsCellOfflineReading}>
        <div css={appFeatureImageContainer}>
          <img src={offlineReadingEdPic} alt="" />
          <AppFeatureWithIcon appName="Editions">
            <p>Download any edition from the last 30 days to read anytime, anywhere you are.</p>
          </AppFeatureWithIcon>
        </div>
        <div css={appFeatureImageContainer}>
          <AppFeatureWithIcon appName="Guardian">
            <p><strong>Enhanced offline reading.</strong> Download the news whenever it suits you</p>
          </AppFeatureWithIcon>
          <img src={offlineReadingGuPic} alt="" />
        </div>
      </div>
    ),
  },
  {
    rowId: 'crosswords',
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
    details: (
      <div css={detailsColumnCrosswords}>
        <div>
          <AppFeatureWithIcon appName="Guardian" heading="Daily crosswords">
            <p>Play daily crosswords wherever you are in <strong>the Guardian app.</strong></p>
          </AppFeatureWithIcon>
        </div>
        <div css={detailsCellImageCrosswords}>
          <picture>
            <source media={`(max-width: ${breakpoints.tablet - 1}px)`} srcSet={crosswordsPic} />
            <source media={`(min-width: ${breakpoints.tablet}px)`} srcSet={crosswordsDesktopPic} />
            <img
              src={crosswordsPic}
              alt=""
            />
          </picture>
        </div>
      </div>
    ),

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
