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
  giftTag,
  toFromLines,
  toYou,
  fromMe,
  heroHeading,
  paragraph,
  heavyText,
  packShot,
} from './heroStyles';

type PropTypes = {
  countryGroupId: CountryGroupId,
}

const GiftCopy = () => (
  <span>
    <p css={paragraph}>
      <span css={heavyText}>A gift that matters</span><br />
      With two innovative apps and ad-free reading, a digital gift subscription not only funds The Guardian&apos;s
      independent reporting but also shares the richest experience of our journalism with the people you care about
      the most.
    </p>
  </span>);


function CampaignHeaderGift(props: PropTypes) {
  return (
    <div css={wrapper}>
      <h1 css={pageTitle}>Gift the digital subscription</h1>
      <div css={featureContainer}>
        <div css={textSection}>
          <div css={giftTag}>
            <div css={toFromLines}>
              <div css={heroHeading}>To:</div>
              <div css={toYou}>You</div>
            </div>
            <div css={toFromLines}>
              <div css={heroHeading}>From:</div>
              <div css={fromMe}>Me</div>
            </div>
          </div>
          <GiftCopy />
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
      </div>
    </div>
  );
}

export default CampaignHeaderGift;
