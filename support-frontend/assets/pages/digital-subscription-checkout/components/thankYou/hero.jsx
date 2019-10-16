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
      gridId: 'subscriptionDailyMobile',
      srcSizes: [242, 484, 568],
      imgType: 'png',
    },
    tablet: {
      gridId: 'subscriptionDailyPackshot',
      srcSizes: [500, 1000, 1584],
      imgType: 'png',
    },
    desktop: {
      gridId: 'subscriptionDailyPackshot',
      srcSizes: [500, 1000, 1584],
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
  AUDCountries: defaultHeroes, // Until we have an AU specific product
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
