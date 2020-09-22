// @flow

// ----- Imports ----- //

import React from 'react';
import { css } from '@emotion/core';
import { ThemeProvider } from 'emotion-theming';

import { headline, titlepiece } from '@guardian/src-foundations/typography';
import { brand, neutral, brandText, brandAlt, brandBackground } from '@guardian/src-foundations/palette';
import { from, until } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';
import { Button, buttonBrand } from '@guardian/src-button';
import { SvgArrowDownStraight } from '@guardian/src-icons';

const wrapper = css`
  position: relative;
  background: #ededed;

  :before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100px;
    background: ${brand[300]};
    content: '';
  }

  ${from.phablet} {
  :before {
    height: 110px;
    }
  }

  ${from.desktop} {
    :before {
      height:200px;
    }
  }

  ${from.tablet} {
    display: flex;
    flex-direction: column;
    padding-top: ${space[4]}px;
  }
`;

const pageTitle = css`
  ${titlepiece.large()}
  color: ${neutral[97]};
  z-index: 10;
  background-color: transparent;
  padding: 0 ${space[4]}px ${space[12]}px;
  width: 100%;

  ${from.phablet} {
    width: 100%;
    align-self: center;
  }

  ${from.tablet} {
    width: calc(100% - 40px);
  }

  ${from.desktop} {
    max-width: calc(100% - 110px);
    max-width: 1100px;
  }

  ${from.leftCol} {
    width: calc(100% - 80px);
    max-width: 80.625rem;
  }
`;

const marketingMessage = css`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  background-color: #00568D;
  color: ${neutral[97]};
  padding: ${space[4]}px;
  align-self: flex-start;
  width: 100%;

  ${from.mobileLandscape} {

  }

  ${from.phablet} {
    width: 100%;
    align-self: center;
  }

  ${from.tablet} {
    width: calc(100% - 40px);
  }

  ${from.desktop} {
    max-width: calc(100% - 110px);
    max-width: 1100px;
  }

  ${from.leftCol} {
    width: calc(100% - 80px);
    max-width: 80.625rem;
  }
`;

const textSection = css`
  width: 100%;

  ${from.tablet} {
    width: 60%;
  }
`;

const heroHeading = css`
  ${titlepiece.medium()};
  max-width: 90%;
  margin: 15px 0 25px 10px;

  ${from.mobileLandscape} {
      margin-left: 0;
      margin-top: 0;
  }

  ${from.phablet} {
      margin-top: 10px;
  }

  ${from.desktop} {
    margin-bottom: 80px;
  }

  ${from.wide} {
  }
`;

const yellowHeading = css`
  color: ${brandAlt[400]};
`;

const paragraph = css`
  font-size: 17px;
  font-weight: 400;
  line-height: 21px;
  max-width: 100%;
  margin-bottom: ${space[5]}px;

  ${from.mobileLandscape} {
    font-weight: 400;
  }

  ${from.phablet} {
    font-size: 20px;
    line-height: 24px;
  }


  ${from.desktop} {
    max-width: 70%;
    ${headline.xsmall()};
    line-height: 135%;
  }

  ${from.leftCol} {
    max-width: gu-span(9);
  }
`;

const heavyText = css`
  font-weight: 600;
`;

const circle = css`
  position: absolute;
  right: 20px;
  top: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100px;
  width: 100px;
  border-radius: 50%;
  background-color: ${brandAlt[400]};
  margin-top: 0px;
  margin-left: 5px;

  ${from.mobileLandscape} {
    right: 20px;
    top: 30px;
  }

  ${from.phablet} {
    height: 130px;
    width: 130px;
    right: 30px;
    top: 15px;
  }

  ${from.desktop} {
    right: 20px;
    top: -70px;
  }
`;

const circleText = css`
  ${titlepiece.small()};
  color: ${brand[300]};

  ${from.phablet} {
    ${titlepiece.medium()};
  }
`;

function CampaignHeader() {

  return (
    <div css={wrapper}>
      <h1 css={pageTitle}>Digital subscription</h1>
      <div css={marketingMessage}>
        <div css={textSection}>
          <h2 css={heroHeading}>Progressive journalism<br />
            <span css={yellowHeading}>powered by you</span>
          </h2>
          <p css={paragraph}>
            <span css={heavyText}>Two apps to discover at your own pace, unninterrupted by advertising.
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
        <div css={circle}>
          <span css={circleText}>Offer</span>
        </div>
      </div>
    </div>
  );
}

export default CampaignHeader;
