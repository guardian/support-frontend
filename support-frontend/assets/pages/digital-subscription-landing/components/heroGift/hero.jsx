// @flow

// ----- Imports ----- //

import React from 'react';
import { ThemeProvider } from 'emotion-theming';

import { Button, buttonBrand } from '@guardian/src-button';
import { SvgArrowDownStraight } from '@guardian/src-icons';
import { type CountryGroupId, AUDCountries } from 'helpers/internationalisation/countryGroup';
import { promotionHTML, type PromotionCopy } from 'helpers/productPrice/promotions';
import GridImage from 'components/gridImage/gridImage';
import GiftHeadingAnimation from 'components/animations/giftHeadingAnimation';
import {
  wrapper,
  pageTitle,
  featureContainer,
  textSection,
  paragraph,
  heavyText,
  mobileLineBreak,
  packShot,
} from './heroStyles';

type PropTypes = {
  countryGroupId: CountryGroupId,
  promotionCopy: PromotionCopy,
}

const GiftCopy = () => (
  <span>
    <p css={paragraph}>
      <span css={heavyText}>Share what matters most,<br css={mobileLineBreak} /> even when apart</span><br />
      Show that you care with the gift of a digital gift subscription. Your loved ones will get the
      richest, ad-free experience of our independent journalism and your gift will help fund our work.
    </p>
  </span>);


function CampaignHeaderGift({ countryGroupId, promotionCopy }: PropTypes) {
  const copy = promotionHTML(promotionCopy.description) || <GiftCopy />;

  return (
    <div css={wrapper}>
      <h1 css={pageTitle}>Give the digital subscription</h1>
      <div css={featureContainer}>
        <div css={textSection}>
          <GiftHeadingAnimation />
          {copy}
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
        <div css={packShot}>
          <GridImage
            gridId={countryGroupId === AUDCountries ? 'editionsPackshotAus' : 'editionsPackshot'}
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
