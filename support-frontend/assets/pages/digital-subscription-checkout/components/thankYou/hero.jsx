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
      gridId: 'editionsPackshot',
      srcSizes: [242, 484, 568],
      imgType: 'png',
    },
    tablet: {
      gridId: 'editionsPackshot',
      srcSizes: [500, 1000, 1825],
      imgType: 'png',
    },
    desktop: {
      gridId: 'editionsPackshot',
      srcSizes: [500, 1000, 1825],
      imgType: 'png',
    },
  },
  fallback: 'digitalSubscriptionHeaderDesktop',
};

const australiaHeroes: GridImages = {
  breakpoints: {
    mobile: {
      gridId: 'editionsPackshotAus',
      srcSizes: [242, 484, 568],
      imgType: 'png',
    },
    tablet: {
      gridId: 'editionsPackshotAus',
      srcSizes: [500, 1000, 1825],
      imgType: 'png',
    },
    desktop: {
      gridId: 'editionsPackshotAus',
      srcSizes: [500, 1000, 1825],
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
  AUDCountries: australiaHeroes,
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
