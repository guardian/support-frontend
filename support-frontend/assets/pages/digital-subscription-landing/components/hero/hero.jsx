// @flow

// ----- Imports ----- //

import React from 'react';
import { ThemeProvider } from 'emotion-theming';

import { Button, buttonBrand } from '@guardian/src-button';
import { SvgArrowDownStraight } from '@guardian/src-icons';
import { type CountryGroupId, AUDCountries } from 'helpers/internationalisation/countryGroup';
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
  spaceAfter,
} from './heroStyles';

type PropTypes = {
  countryGroupId: CountryGroupId,
}

const HeroCopy = () => (
  <>
    <p css={paragraph}>
      We’re free to give voice to the voiceless. The unheard. The powerless.
      Become a digital subscriber today and help to fund our vital work.
    </p>
  </>
);

const HeroCopyAus = () => (
  <span>
    <p css={paragraph}>
      With two innovative apps and ad-free reading, a digital subscription gives you the richest experience
      of Guardian Australia journalism. It also sustains the independent reporting you love.
    </p>
    <p css={paragraph}>
      You&apos;ll gain exclusive access to <span css={heavyText}>Australia Weekend</span>, the new digital
      edition, providing you with a curated view of the week&apos;s biggest stories, plus early access to
      essential weekend news.
    </p>
  </span>);

function CampaignHeader(props: PropTypes) {

  return (
    <div css={wrapper}>
      <h1 css={pageTitle}>Digital subscription</h1>
      <div css={featureContainer}>
        <div css={textSection}>
          <h2 css={heroHeading}>Subscribe for stories<br />
            <span css={yellowHeading}>that must be told</span>
          </h2>
          {props.countryGroupId === AUDCountries ? <HeroCopyAus /> : <HeroCopy />}
          <div css={props.countryGroupId !== AUDCountries ? spaceAfter : {}}>
            <ThemeProvider theme={buttonBrand}>
              <Button
                priority="tertiary"
                size="default"
                icon={<SvgArrowDownStraight />}
                iconSide="right"
                onClick={() => window.scrollTo(0, 1500)}
              >
            See pricing options
              </Button>
            </ThemeProvider>
          </div>
        </div>
        <div css={packShot}>
          <GridImage
            gridId={props.countryGroupId === AUDCountries ? 'editionsPackshotAus' : 'editionsPackshot'}
            srcSizes={[1000, 500, 140]}
            sizes="(max-width: 480px) 200px,
            (max-width: 740px) 100%,
            (max-width: 1067px) 150%,
            500px"
            altText="Digital subscriptions"
            imgType="png"
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
