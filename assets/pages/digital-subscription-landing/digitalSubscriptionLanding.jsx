// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import { renderPage } from 'helpers/render';
import { detect, type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import countrySwitcherHeaderContainer from 'components/headers/countrySwitcherHeader/countrySwitcherHeaderContainer';
import Footer from 'components/footer/footer';

import { init as pageInit } from 'helpers/page/page';


// ----- Redux Store ----- //

const store = pageInit();


// ----- Internationalisation ----- //

const countryGroupId: CountryGroupId = detect();

const reactElementId: {
  [CountryGroupId]: string,
} = {
  GBPCountries: 'digital-subscription-landing-page-uk',
  UnitedStates: 'digital-subscription-landing-page-us',
  AUDCountries: 'digital-subscription-landing-page-au',
  International: 'digital-subscription-landing-page-int',
};

const CountrySwitcherHeader = countrySwitcherHeaderContainer(
  '/subscribe/digital',
  ['GBPCountries', 'UnitedStates', 'AUDCountries', 'International'],
);


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div>
      <CountrySwitcherHeader />
      <Footer />
    </div>
  </Provider>
);

renderPage(content, reactElementId[countryGroupId]);
