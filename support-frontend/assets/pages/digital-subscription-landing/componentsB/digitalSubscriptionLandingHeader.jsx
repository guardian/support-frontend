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

type GridImages = {
  breakpoints: {
    mobile: GridImg,
    tablet: GridImg,
    desktop: GridImg,
  },
  fallback: GridId,
};

type GridSlots = {
  mobile: GridSlot,
  tablet: GridSlot,
  desktop: GridSlot,
};


// ----- Setup ----- //

const defaultImages: GridImages = {
  breakpoints: {
    mobile: {
      gridId: 'digitalSubscriptionHeaderMobile',
      srcSizes: [342, 684, 1200],
      sizes: '1200px',
      imgType: 'png',
      altText: '',
    },
    tablet: {
      gridId: 'digitalSubscriptionHeaderTablet',
      srcSizes: [500, 1000, 2000],
      sizes: '2000px',
      imgType: 'png',
      altText: '',
    },
    desktop: {
      gridId: 'digitalSubscriptionHeaderDesktop',
      srcSizes: [500, 1000, 2000, 4045],
      sizes: '2000px',
      imgType: 'png',
      altText: '',
    },
  },
  fallback: 'digitalSubscriptionHeaderDesktop',
};

const gridImagesByCountry: {
  [CountryGroupId]: GridImages,
} = {
  GBPCountries: defaultImages,
  UnitedStates: defaultImages,
  International: defaultImages,
  EURCountries: defaultImages,
  NZDCountries: defaultImages,
  Canada: defaultImages,
  AUDCountries: {
    breakpoints: {
      mobile: {
        gridId: 'digitalSubscriptionHeaderMobileAU',
        srcSizes: [310, 620, 1088],
        imgType: 'png',
        sizes: '2000px',
        altText: '',
      },
      tablet: {
        gridId: 'digitalSubscriptionHeaderTabletAU',
        srcSizes: [500, 1000, 2000],
        imgType: 'png',
        sizes: '2000px',
        altText: '',
      },
      desktop: {
        gridId: 'digitalSubscriptionHeaderDesktopAU',
        srcSizes: [500, 1000, 2000, 4045],
        imgType: 'png',
        sizes: '2000px',
        altText: '',
      },
    },
    fallback: 'digitalSubscriptionHeaderDesktopAU',
  },
};

const gridSlots: GridSlots = {
  mobile: {
    sizes: '240px',
    media: '(max-width: 739px)',
  },
  tablet: {
    sizes: '407px',
    media: '(min-width: 740px) and (max-width: 1139px)',
  },
  desktop: {
    sizes: '809px',
    media: '(min-width: 1140px)',
  },
};


// ----- Functions ----- //

function gridPicture(cgId: CountryGroupId): GridPictureProps {

  const gridImages: GridImages = gridImagesByCountry[cgId];
  const sources: GridSource[] = [
    { ...gridSlots.mobile, ...gridImages.breakpoints.mobile },
    { ...gridSlots.tablet, ...gridImages.breakpoints.tablet },
    { ...gridSlots.desktop, ...gridImages.breakpoints.desktop },
  ];

  return {
    sources,
    fallback: gridImages.fallback,
    fallbackSize: 500,
    altText: 'digital subscription',
    fallbackImgType: 'png',
  };

}

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
              <h2><strong>Two innovative apps and ad-free reading</strong> on theguardian.com. The complete digital experience from The Guardian.</h2>
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
