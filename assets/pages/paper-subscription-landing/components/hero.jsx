// @flow

// ----- Imports ----- //

import React from 'react';
import GridPicture from 'components/gridPicture/gridPicture';
import ProductPageHero from 'components/productPage/productPageHero/productPageHero';
import AnchorButton from 'components/button/anchorButton';
import SvgChevron from 'components/svgs/chevron';
import GridImage from 'components/gridImage/gridImage';

import { sendTrackingEventsOnClick } from 'helpers/subscriptions';

import { flashSaleIsActive, getSaleCopy } from 'helpers/flashSale';

import './heroJoyOfPrint.scss';

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
    cta={<AnchorButton aria-label={null} onClick={sendTrackingEventsOnClick('options_cta_click', 'Paper', null)} icon={<SvgChevron />} href="#subscribe">See Subscription options</AnchorButton>}
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
  <ProductPageHero
    overheading="The Guardian newspaper subscriptions"
    heading={getHeading()}
    type="custom"
    modifierClasses={['paper-sale']}
    cta={<AnchorButton aria-label={null} onClick={sendTrackingEventsOnClick('options_cta_click', 'Paper', null)} icon={<SvgChevron />} href="#subscribe">See Subscription options</AnchorButton>}
  >
    <div className="component-product-page-hero__sale">

      <div className="component-product-page-hero__sale-copy">
        <h2>Works with different browsers</h2>
        <p>Get your hands on journalism that’s really worth keeping.</p>
      </div>

      <div className="component-product-page-hero__sale-graphic-outer">
        <div className="component-product-page-hero__sale-graphic-inner">
          <div className="component-product-page-hero__sale-badge">
            <span>Save up to</span>
            <span>52%</span>
            <span>For 3 months</span>
          </div>
          <div className="component-product-page-hero__sale-graphic">
            <GridImage
              gridId="paperLandingSale"
              srcSizes={[800, 466]}
              sizes="(max-width: 740px) 100vw, 800px"
              imgType="png"
              altText="A couple sit together sharing one newspaper"
            />
          </div>
        </div>

      </div>
    </div>
  </ProductPageHero>
);


export { DefaultHeader, SaleHeader };
