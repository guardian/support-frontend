// @flow

// ----- Imports ----- //

import React from 'react';
import { css } from '@emotion/core';
import { from } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';
import { textSans, headline } from '@guardian/src-foundations/typography';

import { ThemeProvider } from 'emotion-theming';
import { LinkButton, buttonReaderRevenueBrandAlt } from '@guardian/src-button';
import { SvgArrowRightStraight } from '@guardian/src-icons';
import GridImage from 'components/gridImage/gridImage';

import {
  getIosAppUrl,
  androidAppUrl,
  androidDailyUrl,
  getDailyEditionUrl,
} from 'helpers/externalLinks';


import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';

import Text from 'components/text/text';

// ----- Types ----- //

type PropTypes = {
  countryGroupId: CountryGroupId,
};

const ctas = css`
  /* display: flex; */
  /* flex-direction: column; */

`;

const smallFormatText = css`
  display: inline-block;
  ${from.desktop} {
    display: none;
  }
`;

const largerFormatText = css`
  display: none;
  ${from.desktop} {
    display: inline-block;
  }
`;

const marginForFirstButton = css`
  margin-bottom: ${space[3]}px;
`;

const mainHeading = css`
  ${headline.medium({ fontWeight: 'bold', lineHeight: 'loose' })};
`;

const subHeading = css`
  ${headline.xxsmall({ fontWeight: 'bold', lineHeight: 'loose' })};
  margin-top: ${space[9]}px;
`;

const sansText = css`
  ${textSans.medium({ lineHeight: 'loose' })}
`;

const maxWidth = css`
  ${from.desktop} {
    max-width: 70%;
  }

  ${from.leftCol} {
    max-width: 60%;
  }
`;

const imageContainer = css`
  margin: ${space[4]}px 0;
  display: block;
  max-width: 160px;
  img {
    width: 100%;
  }

  ${from.desktop} {
    display: inline-block;
    :first-of-type {
      margin-right: ${space[4]}px;
    }
  }
`;

const appStoreButtonContainer = css`
    display: flex;
    flex-direction: column;
    a {
        margin-bottom: ${space[2]}px;
    }
    ${from.leftCol} {
        flex-direction: row;
        a:not(:last-of-type) {
            margin-right: ${space[4]}px;
        }
    }
`;


const AppStoreImage = (props: {store: string}) => (
  <div css={imageContainer}>
    <GridImage
      classModifiers={['']}
      gridId={props.store}
      srcSizes={[140, 500]}
      sizes="(max-width: 480px) 100px,
                (max-width: 740px) 100%,
                (max-width: 1067px) 150%,
                800px"
      imgType="png"
    />
  </div>
);


// ----- Component ----- //

const AppsSection = ({ countryGroupId }: PropTypes) => (
  <>
    <h2 css={mainHeading}>Make the most of your digital subscription</h2>
    <div css={maxWidth}>
      <h3 css={subHeading}>Download The Guardian Editions App</h3>
      <p css={sansText}>
        Each day&apos;s edition in one simple, elegant app. Contains the UK Daily
        the Australian Weekend and other special editions.
      </p>
      <div>
        <AppStoreImage store="appleStore" />
        <AppStoreImage store="googlePlay" />
        <ThemeProvider theme={buttonReaderRevenueBrandAlt}>
          <LinkButton
            css={marginForFirstButton}
            priority="tertiary"
            size="default"
            icon={<SvgArrowRightStraight />}
            iconSide="right"
            nudgeIcon
            aria-label="Click to download the Guardian Daily app on the Apple App Store"
            href={getDailyEditionUrl(countryGroupId)}
            onClick={sendTrackingEventsOnClick({
              id: 'checkout_thankyou_daily_edition_apple',
              product: 'DigitalPack',
              componentType: 'ACQUISITIONS_BUTTON',
            })}
          >
            <span css={largerFormatText}>The Guardian Editions app for iOS</span>
            <span css={smallFormatText}>Editions app for iOS</span>
          </LinkButton>
          <LinkButton
            priority="tertiary"
            size="default"
            icon={<SvgArrowRightStraight />}
            iconSide="right"
            nudgeIcon
            aria-label="Click to download the Guardian Daily app on Google Play"
            href={androidDailyUrl}
            onClick={sendTrackingEventsOnClick({
              id: 'checkout_thankyou_daily_edition_android',
              product: 'DigitalPack',
              componentType: 'ACQUISITIONS_BUTTON',
            })}
          >
            <span css={largerFormatText}>The Guardian Editions app for Android</span>
            <span css={smallFormatText}>Editions app for Android</span>
          </LinkButton>
        </ThemeProvider>
      </div>
      <h3>Download The Guardian Live app</h3>
      <p>
        With premium access to The Guardian Live app, get breaking news, as it happens.
      </p>
      <div css={ctas}>
        <ThemeProvider theme={buttonReaderRevenueBrandAlt}>
          <LinkButton
            css={marginForFirstButton}
            priority="tertiary"
            size="default"
            icon={<SvgArrowRightStraight />}
            iconSide="right"
            nudgeIcon
            aria-label="Click to download the app on the Apple App Store"
            href={getIosAppUrl(countryGroupId)}
            onClick={sendTrackingEventsOnClick({
              id: 'checkout_thankyou_live_app_apple',
              product: 'DigitalPack',
              componentType: 'ACQUISITIONS_BUTTON',
            })}
          >
            <span css={largerFormatText}>The Guardian Live app for iOS</span>
            <span css={smallFormatText}>Live app for iOS</span>
          </LinkButton>
          <LinkButton
            priority="tertiary"
            size="default"
            icon={<SvgArrowRightStraight />}
            iconSide="right"
            nudgeIcon
            aria-label="Click to download the app on the Google Play store"
            href={androidAppUrl}
            onClick={sendTrackingEventsOnClick({
              id: 'checkout_thankyou_live_app_android',
              product: 'DigitalPack',
              componentType: 'ACQUISITIONS_BUTTON',
            })}
          >
            <span css={largerFormatText}>The Guardian Live app for Android</span>
            <span css={smallFormatText}>Live app for Android</span>
          </LinkButton>
        </ThemeProvider>
      </div>
      <Text title="Sign into theguardian.com">
        <p>
        Never be interrupted or distracted by ads again by signing in. Just use your subscriber email
        and password when you next visit.
        </p>
        <ThemeProvider theme={buttonReaderRevenueBrandAlt}>
          <LinkButton
            css={marginForFirstButton}
            priority="tertiary"
            size="default"
            icon={<SvgArrowRightStraight />}
            iconSide="right"
            nudgeIcon
            aria-label="Click to sign in to the website"
            href="https://www.theguardian.com/"
            onClick={sendTrackingEventsOnClick({
            id: 'checkout_thankyou_sign_in',
            product: 'DigitalPack',
            componentType: 'ACQUISITIONS_BUTTON',
          })}
          >
            <span css={largerFormatText}>Sign into the website</span>
            <span css={smallFormatText}>Sign in</span>
          </LinkButton>
        </ThemeProvider>
      </Text>
    </div>
  </>
);


// ----- Export ----- //

export default AppsSection;
