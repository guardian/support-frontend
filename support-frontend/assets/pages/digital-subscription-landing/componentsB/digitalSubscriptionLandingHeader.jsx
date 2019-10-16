// @flow

// ----- Imports ----- //

import React from 'react';

import { FlashSaleCountdownInHero } from 'components/flashSaleCountdown/flashSaleCountdown';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';

import SvgChevron from 'components/svgs/chevron';
import AnchorButton from 'components/button/anchorButton';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { sendTrackingEventsOnClick, type SubscriptionProduct } from 'helpers/subscriptions';
import { flashSaleIsActive, getSaleCopy } from 'helpers/flashSale';
import PaymentSelection from 'pages/digital-subscription-landing/components/paymentSelection/paymentSelection';

import ProductPagehero from 'components/productPage/productPageHero/productPageHero';

import { showUpgradeMessage } from '../helpers/upgradePromotion';
import { showCountdownTimer } from '../../../helpers/flashSale';
import { CampaignHeader } from '../components/digitalSubscriptionLandingHeader';

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
      <PaymentSelection dailyEditionsVariant={dailyEditionsVariant} />
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
          <CampaignHeader />
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

export { CampaignHeaderB };
