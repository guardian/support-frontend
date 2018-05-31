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
      <CountrySwitcherHeader /> { /* https://trello.com/c/IrhfApmz/1456-digital-pack-product-page-aus */ }
      { /* <DigipackHeaderBlock /> (https://trello.com/c/LDgBVJWi/1601-digital-pack-header-block) */ }
      { /* <DigipackProductBlock /> (https://trello.com/c/8UBqJMTP/1532-digital-pack-product-block) */ }
      { /* <DigipackJournalismBlock /> (https://trello.com/c/owe2K3bS/1533-independent-journalism-block) */ }
      <Footer />
    </div>
  </Provider>
);

renderPage(content, reactElementId[countryGroupId]);
