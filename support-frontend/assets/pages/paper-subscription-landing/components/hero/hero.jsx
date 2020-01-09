// @flow

// ----- Imports ----- //

import React from 'react';
import GridPicture from 'components/gridPicture/gridPicture';
import ProductPagehero, {
  HeroHanger,
  HeroHeading,
  HeroWrapper,
} from 'components/productPage/productPageHero/productPageHero';
import AnchorButton from 'components/button/anchorButton';
import SvgChevron from 'components/svgs/chevron';
import GridImage from 'components/gridImage/gridImage';
import { FlashSaleCountdownInHero } from 'components/flashSaleCountdown/flashSaleCountdown';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import HeadingBlock from 'components/headingBlock/headingBlock';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';
import {
  showCountdownTimer,
} from 'helpers/flashSale';
import { getDiscountCopy } from './discountCopy';
import './joyOfPrint.scss';

const discountCopy = getDiscountCopy();

const Discount = (props: { discountCopy: string[] }) => (
  <div>
    {props.discountCopy.map(copy => <span>{ copy }</span>)}
  </div>
);

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
    <AnchorButton onClick={sendTrackingEventsOnClick('options_cta_click', 'Paper', null)} icon={<SvgChevron />} href="#subscribe">See Subscription options</AnchorButton>
  </HeroHanger>
);

const Heading = () => (
  <HeroHeading hasCampaign={false}>
    <HeadingBlock overheading="The Guardian newspaper subscriptions">{discountCopy.heading}</HeadingBlock>
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

const CampaignHeader = () => (
  <ProductPagehero
    appearance="campaign"
    overheading="The Guardian newspaper subscriptions"
    heading={discountCopy.heading}
    modifierClasses={['paper-sale']}
    content={<AnchorButton onClick={sendTrackingEventsOnClick('options_cta_click', 'Paper', null)} icon={<SvgChevron />} href="#subscribe">See Subscription options</AnchorButton>}
    hasCampaign
  >
    <div className="sale-joy-of-print">
      <div className="sale-joy-of-print-copy">
        <h2><span>Not every pleasure</span><br /><span>is a guilty one</span></h2>
        <p>Become a Guardian and<br />Observer subscriber</p>
      </div>
    </div>
    <div className="sale-joy-of-print-graphic-outer">
      <div className="sale-joy-of-print-graphic-inner">
        <div className="sale-joy-of-print-badge">
          <Discount discountCopy={discountCopy.roundel} />
        </div>
        <div className="sale-joy-of-print-graphic">
          <GridImage
            gridId="printCampaign2020"
            srcSizes={[1000, 500]}
            sizes="(max-width: 740px) 100vw, 800px"
            imgType="png"
            altText="Newspapers"
          />
        </div>
      </div>
    </div>
  </ProductPagehero>
);

export { DefaultHeader, CampaignHeader, HeroPicture };
