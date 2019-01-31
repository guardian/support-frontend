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

import './joyOfPrint.scss';

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
    appearance="feature"
    modifierClasses={['paper']}
    content={<AnchorButton aria-label={null} onClick={sendTrackingEventsOnClick('options_cta_click', 'Paper', null)} icon={<SvgChevron />} href="#subscribe">See Subscription options</AnchorButton>}
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
    appearance="custom"
    modifierClasses={['paper-sale']}
    content={<AnchorButton aria-label={null} onClick={sendTrackingEventsOnClick('options_cta_click', 'Paper', null)} icon={<SvgChevron />} href="#subscribe">See Subscription options</AnchorButton>}
  >
    <div className="sale-joy-of-print">

      <div className="sale-joy-of-print-copy">
        <h2>Works with different browsers</h2>
        <p>Get your hands on journalism that’s really worth keeping.</p>
      </div>

      <div className="sale-joy-of-print-graphic-outer">
        <div className="sale-joy-of-print-graphic-inner">
          <div className="sale-joy-of-print-badge">
            <span>Save up to</span>
            <span>52%</span>
            <span>for a year</span>
          </div>
          <div className="sale-joy-of-print-graphic">
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
