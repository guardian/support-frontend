// @flow

// ----- Imports ----- //

import React from 'react';
import { ThemeProvider } from 'emotion-theming';

import { Button, buttonBrand } from '@guardian/src-button';
import { SvgArrowDownStraight } from '@guardian/src-icons';
import GridImage from 'components/gridImage/gridImage';
import {
  wrapper,
  pageTitle,
  featureContainer,
  textSection,
  heroHeading,
  yellowHeading,
  paragraph,
  heavyText,
  packShot,
  circle,
  circleTextTop,
  circleTextBottom,
} from './heroStyles';

function CampaignHeader() {

  return (
    <div css={wrapper}>
      <h1 css={pageTitle}>Digital subscription</h1>
      <div css={featureContainer}>
        <div css={textSection}>
          <h2 css={heroHeading}>Progressive journalism<br />
            <span css={yellowHeading}>powered by you</span>
          </h2>
          <p css={paragraph}>
            <span css={heavyText}>Two apps to discover at your own pace, uninterrupted by advertising.
            </span><br />The Guardian digital subscription gives you full access to The Guardian&apos;s Live
            and Daily app for you to enjoy whenever and wherever you like.
          </p>
          <ThemeProvider theme={buttonBrand}>
            <Button
              priority="tertiary"
              size="default"
              icon={<SvgArrowDownStraight />}
              iconSide="right"
              nudgeIcon
              onClick={() => window.scrollTo(0, 1500)}
            >
            See pricing options
            </Button>
          </ThemeProvider>
        </div>
        <div css={packShot}>
          <GridImage
            gridId="editionsPackshot"
            srcSizes={[1000, 750, 500, 140]}
            sizes="(max-width: 480px) 200px,
            (max-width: 740px) 100%,
            (max-width: 1067px) 150%,
            500px"
            altText="Digital subscriptions"
          />
        </div>
        <div css={circle}>
          <span css={circleTextTop}>14 day</span>
          <span css={circleTextBottom}>free trial</span>
        </div>
      </div>
    </div>
  );
}

export default CampaignHeader;
