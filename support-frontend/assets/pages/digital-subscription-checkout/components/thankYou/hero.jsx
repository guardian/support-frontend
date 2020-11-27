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
      gridId: 'editionsPackshotShort',
      srcSizes: [500],
      imgType: 'png',
    },
    tablet: {
      gridId: 'editionsPackshotShort',
      srcSizes: [500, 1000, 1800],
      imgType: 'png',
    },
    desktop: {
      gridId: 'editionsPackshotShort',
      srcSizes: [500, 1000, 1800],
      imgType: 'png',
    },
  },
  fallback: 'digitalSubscriptionHeaderDesktop',
};

const australiaHeroes: GridImages = {
  breakpoints: {
    mobile: {
      gridId: 'editionsPackshotAusShort',
      srcSizes: [500],
      imgType: 'png',
    },
    tablet: {
      gridId: 'editionsPackshotAusShort',
      srcSizes: [500, 1000, 1800],
      imgType: 'png',
    },
    desktop: {
      gridId: 'editionsPackshotAusShort',
      srcSizes: [500, 1000, 1800],
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
