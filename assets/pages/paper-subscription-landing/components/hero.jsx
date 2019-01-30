// @flow

// ----- Imports ----- //

import React from 'react';
import GridPicture from 'components/gridPicture/gridPicture';
import ProductPageHero from 'components/productPage/productPageHero/productPageHero';
import ProductPageHeroSale from 'components/productPage/productPageHero/productPageHeroSale';
import AnchorButton from 'components/button/anchorButton';
import SvgChevron from 'components/svgs/chevron';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';

import { flashSaleIsActive, getSaleCopy } from 'helpers/flashSale';

function getHeading(): string {
  if (flashSaleIsActive('Paper', 'GBPCountries')) {
    const saleCopy = getSaleCopy('Paper', 'GBPCountries');
    return saleCopy.landingPage.subHeading;
  }

  return 'Save up to 31% on The Guardian and The Observer - all year round';
}


const DefaultHeader = () => (
  <ProductPageHero
    overheading="The Guardian newspaper subscriptions"
    heading={getHeading()}
    type="feature"
    modifierClasses={['paper']}
    cta={<AnchorButton aria-label={null} onClick={sendTrackingEventsOnClick('options_cta_click', 'GuardianWeekly', null)} icon={<SvgChevron />} href="#subscribe">See Subscription options</AnchorButton>}
  >
    <GridPicture
      sources={[
    {
      gridId: 'paperLandingHeroMobile',
      srcSizes: [500, 922],
      imgType: 'png',
      sizes: '100vw',
      media: '(max-width: 739px)',
    },
    {
      gridId: 'paperLandingHero',
      srcSizes: [1000, 2000],
      imgType: 'png',
      sizes: '(min-width: 1000px) 2000px, 1000px',
      media: '(min-width: 740px)',
    },
  ]}
      fallback="paperLandingHero"
      fallbackSize={1000}
      altText=""
      fallbackImgType="png"
    />
  </ProductPageHero>
);

const SaleHeader = () => (
  <ProductPageHeroSale
    overheading="The Guardian newspaper subscriptions"
    heading={getHeading()}
    type="sale"
    modifierClasses={['paper-sale']}
    cta={<AnchorButton aria-label={null} onClick={sendTrackingEventsOnClick('options_cta_click', 'GuardianWeekly', null)} icon={<SvgChevron />} href="#subscribe">See Subscription options</AnchorButton>}
  />
);


export { DefaultHeader, SaleHeader };
