// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import { renderPage } from 'helpers/render';
import { detect, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { init as pageInit } from 'helpers/page/page';

import Page from 'components/page/page';
import countrySwitcherHeaderContainer from 'components/headers/countrySwitcherHeader/countrySwitcherHeaderContainer';
import CustomerService from 'components/customerService/customerService';
import Footer from 'components/footer/footer';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';


// ----- Redux Store ----- //

const store = pageInit();

// ----- Internationalisation ----- //

const countryGroupId: CountryGroupId = detect();

const reactElementId: {
  [CountryGroupId]: string,
} = {
  GBPCountries: 'digital-subscription-checkout-page-uk',
  UnitedStates: 'digital-subscription-checkout-page-us',
  AUDCountries: 'digital-subscription-checkout-page-au',
  International: 'digital-subscription-checkout-page-int',
};

const CountrySwitcherHeader = countrySwitcherHeaderContainer(
  '/subscribe/digital',
  [
    'GBPCountries',
    'UnitedStates',
    'AUDCountries',
    'International',
  ],
);

// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<CountrySwitcherHeader />}
      footer={<Footer><CustomerService selectedCountryGroup={countryGroupId} /></Footer>}
    >
      <LeftMarginSection modifierClasses={['grey']}>
        <p>Placeholder</p>
      </LeftMarginSection>
    </Page>
  </Provider>
);

renderPage(content, reactElementId[countryGroupId]);
