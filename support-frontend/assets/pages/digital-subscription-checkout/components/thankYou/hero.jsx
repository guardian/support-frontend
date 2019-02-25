// @flow

// ----- Imports ----- //

import React from 'react';


import ProductHero, {
  type GridImages,
  type ImagesByCountry,
} from 'components/productHero/productHero';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

// ----- Setup ----- //

const defaultHeroes: GridImages = {
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

const heroesByCountry: ImagesByCountry = {
  GBPCountries: defaultHeroes,
  UnitedStates: defaultHeroes,
  International: defaultHeroes,
  EURCountries: defaultHeroes,
  NZDCountries: defaultHeroes,
  Canada: defaultHeroes,
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

const ThankYouHero = ({ countryGroupId }: {countryGroupId: CountryGroupId}) => (
  <ProductHero
    countryGroupId={countryGroupId}
    imagesByCountry={heroesByCountry}
    altText="digital subscription"
    fallbackImgType="png"
  />
);


// ----- Export ----- //

export default ThankYouHero;
