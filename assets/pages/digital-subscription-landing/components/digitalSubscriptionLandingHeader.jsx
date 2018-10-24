// @flow

// ----- Imports ----- //

import React from 'react';

import FlashSaleCountdown from 'components/flashSaleCountdown/flashSaleCountdown';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import GridPicture, {
  type GridImage,
  type GridSlot,
  type PropTypes as GridPictureProps,
  type Source as GridSource,
} from 'components/gridPicture/gridPicture';
import { type ImageId as GridId } from 'helpers/theGrid';
import { CirclesLeft, CirclesRight } from 'components/svgs/digitalSubscriptionLandingHeaderCircles';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { displayPrice } from 'helpers/subscriptions';
import { currencies, detect } from 'helpers/internationalisation/currency';
import { flashSaleIsActive, getDiscountedPrice } from 'helpers/flashSale';
import CtaSwitch from './ctaSwitch';
import { showUpgradeMessage } from '../helpers/upgradePromotion';

// ----- Types ----- //

type PropTypes = {|
  countryGroupId: CountryGroupId,
|};

type GridImages = {
  breakpoints: {
    mobile: GridImage,
    tablet: GridImage,
    desktop: GridImage,
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
      imgType: 'png',
    },
    tablet: {
      gridId: 'digitalSubscriptionHeaderTablet',
      srcSizes: [500, 1000, 2000],
      imgType: 'png',
    },
    desktop: {
      gridId: 'digitalSubscriptionHeaderDesktop',
      srcSizes: [500, 1000, 2000, 4045],
      imgType: 'png',
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
  AUDCountries: {
    breakpoints: {
      mobile: {
        gridId: 'digitalSubscriptionHeaderMobileAU',
        srcSizes: [310, 620, 1088],
        imgType: 'png',
      },
      tablet: {
        gridId: 'digitalSubscriptionHeaderTabletAU',
        srcSizes: [500, 1000, 2000],
        imgType: 'png',
      },
      desktop: {
        gridId: 'digitalSubscriptionHeaderDesktopAU',
        srcSizes: [500, 1000, 2000, 4045],
        imgType: 'png',
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

function getFlashSaleCopy(countryGroupId: CountryGroupId) {
  const currency = currencies[detect(countryGroupId)].glyph;
  return {
    heading: 'Digital Pack Sale',
    subHeading: `${currency}${getDiscountedPrice('DigitalPack', countryGroupId)} for three months, then ${displayPrice('DigitalPack', countryGroupId)}`,
  };
}

function getCopy(country: CountryGroupId) {
  if (showUpgradeMessage()) {
    return {
      heading: 'Digital Pack',
      subHeading: 'Upgrade your subscription to Paper+Digital now',
    };
  }
  if (flashSaleIsActive('DigitalPack')) {
    return getFlashSaleCopy(country);
  }
  return {
    heading: 'Digital Pack',
    subHeading: `14-day free trial and then ${displayPrice('DigitalPack', country)}`,
  };
}

// ----- Component ----- //

export default function DigitalSubscriptionLandingHeader(props: PropTypes) {
  const copy = getCopy(props.countryGroupId);
  return (
    <div className="digital-subscription-landing-header">
      <LeftMarginSection modifierClasses={['header-block', 'grey']}>
        <FlashSaleCountdown />
        <CirclesLeft />
        <CirclesRight />
        <div className="digital-subscription-landing-header__picture">
          <GridPicture {...gridPicture(props.countryGroupId)} />
        </div>
        <div className="digital-subscription-landing-header__wrapper">
          <h1 className="digital-subscription-landing-header__product">
            {copy.heading}
          </h1>
          <div className="digital-subscription-landing-header__title">
            <p className="digital-subscription-landing-header__title-copy">
              {copy.subHeading}
            </p>
          </div>
        </div>
        <CtaSwitch referringCta="support_digipack_page_header" />
      </LeftMarginSection>
    </div>
  );
}
