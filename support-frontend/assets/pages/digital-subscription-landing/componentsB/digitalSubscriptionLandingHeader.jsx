// @flow

// ----- Imports ----- //

import React from 'react';

import { FlashSaleCountdownInHero } from 'components/flashSaleCountdown/flashSaleCountdown';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import GridPicture, {
  type GridSlot,
  type PropTypes as GridPictureProps,
  type Source as GridSource,
} from 'components/gridPicture/gridPicture';
import { type ImageId as GridId } from 'helpers/theGrid';
import HeadingBlock from 'components/headingBlock/headingBlock';

import SvgChevron from 'components/svgs/chevron';
import { CirclesLeft, CirclesRight } from 'components/svgs/digitalSubscriptionLandingHeaderCircles';
import AnchorButton from 'components/button/anchorButton';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { sendTrackingEventsOnClick, type SubscriptionProduct } from 'helpers/subscriptions';
import { flashSaleIsActive, getSaleCopy } from 'helpers/flashSale';
import { HeroHanger } from 'components/productPage/productPageHero/productPageHero';
import PaymentSelection from 'pages/digital-subscription-landing/components/paymentSelection/paymentSelection';

import ProductPagehero from 'components/productPage/productPageHero/productPageHero';

import { showUpgradeMessage } from '../helpers/upgradePromotion';
import { showCountdownTimer } from '../../../helpers/flashSale';

import './theMoment.scss';


// ----- Types ----- //

type PropTypes = {|
  countryGroupId: CountryGroupId,
  dailyEditionsVariant: boolean,
|};

function getCopy(product: SubscriptionProduct, country: CountryGroupId) {
  if (showUpgradeMessage()) {
    return {
      heading: 'Digital Pack',
      subHeading: 'Upgrade your subscription to Paper+Digital now',
    };
  }
  if (flashSaleIsActive(product, country)) {
    const saleCopy = getSaleCopy(product, country);
    return {
      heading: `${saleCopy.landingPage.heading}`,
      subHeading: `${saleCopy.landingPage.subHeading}`,
    };
  }
  return {
    heading: 'Digital Pack subscriptions',
    subHeading: 'The premium Guardian experience, ad-free on all your devices',
  };
}

const PaymentSelectionContainer = ({ dailyEditionsVariant }: { dailyEditionsVariant: boolean }) => (
  <div className="payment-selection-container">
    <LeftMarginSection>
      <PaymentSelection dailyEditionsVariant={dailyEditionsVariant} pageType="B" />
    </LeftMarginSection>
  </div>
);

const anchorButton = () => (
  <AnchorButton
    id="qa-subscription-options"
    aria-label="See Subscription options for Digital Pack"
    onClick={sendTrackingEventsOnClick('options_cta_click', 'DigitalPack', null)}
    icon={<SvgChevron />}
    href="#subscribe"
  >
    See Subscription options
  </AnchorButton>
);

function CampaignHeaderB(props: PropTypes) {
  const product: SubscriptionProduct = 'DigitalPack';
  const copy = getCopy(product, props.countryGroupId);
  return (
    <div>
      <ProductPagehero
        appearance="campaign"
        overheading={copy.heading}
        heading={copy.subHeading}
        modifierClasses={['digital-campaign']}
        content={anchorButton()}
        hasCampaign
        showProductPageHeroHeader={false}
      >
        <div className="the-moment-hero">
          <div className="hope-is-power-hero--wrapper">
            <div className="hope-is-power-hero__marketing-message hope-is-power--centered">
              <h1>The Digital Subscription</h1>
              <h2><strong>Two innovative apps and ad-free reading</strong> on theguardian.com.
              The complete digital experience from The Guardian.
              </h2>
              <div className="hope-is-power__circle">
                <span className="hope-is-power__circle-text--large">14 day</span>
                <span className="hope-is-power__circle-text">free trial</span>
              </div>
            </div>
          </div>
        </div>

        <div className="payment-selection__title-container">
          <h2 className="payment-selection__title">
          Choose one of our special offers and subscribe today
          </h2>
          <p className="payment-selection_cancel-text">After your 14-day free trial, your subscription will begin automatically and you can cancel any time</p>
        </div>

        {showCountdownTimer(product, props.countryGroupId) &&
        <FlashSaleCountdownInHero
          product={product}
          countryGroupId={props.countryGroupId}
        />
        }
      </ProductPagehero>
      <PaymentSelectionContainer dailyEditionsVariant={props.dailyEditionsVariant} />
    </div>
  );
}

// ----- Component ----- //

function DigitalSubscriptionLandingHeader(props: PropTypes) {
  const product: SubscriptionProduct = 'DigitalPack';
  const copy = getCopy(product, props.countryGroupId);
  return (
    <div className="digital-subscription-landing-header">
      <LeftMarginSection modifierClasses={['header-block', 'grey']}>
        <CirclesLeft />
        <CirclesRight />
        <div className="digital-subscription-landing-header__picture">
          <GridPicture {...gridPicture(props.countryGroupId)} />
        </div>
        <HeadingBlock overheading={copy.heading}>{copy.subHeading}</HeadingBlock>
        {showCountdownTimer(product, props.countryGroupId) &&
          <FlashSaleCountdownInHero
            product={product}
            countryGroupId={props.countryGroupId}
          />
        }
        <div className="digital-subscription-landing-header__cta" />
      </LeftMarginSection>
      <HeroHanger>
        <AnchorButton aria-label="See Subscription options for Digital Pack" onClick={sendTrackingEventsOnClick('options_cta_click', 'DigitalPack', null)} icon={<SvgChevron />} href="#subscribe">See Subscription options</AnchorButton>
      </HeroHanger>
    </div>
  );
}

export { CampaignHeaderB, DigitalSubscriptionLandingHeader };
