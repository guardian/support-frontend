// @flow

// ----- Imports ----- //

import React from 'react';
import GridPicture from 'components/gridPicture/gridPicture';
import { HeroHanger, HeroWrapper, HeroHeading } from 'components/productPage/productPageHero/productPageHero';
import AnchorButton from 'components/button/anchorButton';
import SvgChevron from 'components/svgs/chevron';
import GridImage from 'components/gridImage/gridImage';
import { FlashSaleCountdownInHero } from 'components/flashSaleCountdown/flashSaleCountdown';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import HeadingBlock from 'components/headingBlock/headingBlock';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';
import { flashSaleIsActive, getSaleCopy, showCountdownTimer } from 'helpers/flashSale';

import './joyOfPrint.scss';

function getHeading(): string {
  if (flashSaleIsActive('Paper', GBPCountries)) {
    const saleCopy = getSaleCopy('Paper', GBPCountries);
    return saleCopy.landingPage.subHeading;
  }

  return 'Save up to 37% on The Guardian and The Observer - all year round';
}

const TimerIfActive = () => (showCountdownTimer('Paper', GBPCountries) ? (
  <FlashSaleCountdownInHero
    product="Paper"
    countryGroupId="GBPCountries"
  />) : null);

const HeroPicture = () => (
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
);


const Footer = () => (
  <HeroHanger>
    <AnchorButton aria-label={null} onClick={sendTrackingEventsOnClick('options_cta_click', 'Paper', null)} icon={<SvgChevron />} href="#subscribe">See Subscription options</AnchorButton>
  </HeroHanger>
);

const Heading = () =>  (
  <HeroHeading> 
    <HeadingBlock overheading="The Guardian newspaper subscriptions">{getHeading()}</HeadingBlock>
  </HeroHeading>
);

const DefaultHeader = () => (
  <header>
    <HeroWrapper
      appearance="feature"
      modifierClasses={['paper']}
    >
      <HeroPicture />
      <TimerIfActive />
    </HeroWrapper>
    <Heading />
    <Footer />
  </header>
);

const SaleHeader = () => (
  <header>
    <HeroWrapper
      appearance="custom"
      modifierClasses={['paper-sale']}
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
              <span>37%</span>
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
      <Heading />
      <TimerIfActive />
    </HeroWrapper>
    <Footer />
  </header>
);


export { DefaultHeader, SaleHeader, HeroPicture };
