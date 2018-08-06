// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import { renderPage } from 'helpers/render';
import { detect, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { init as pageInit } from 'helpers/page/page';

import reducer from './digitalSubscriptionCheckoutReducer';
import CheckoutStage from './components/checkoutStage';


// ----- Redux Store ----- //

const store = pageInit(reducer);


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


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <CheckoutStage />
  </Provider>
);

renderPage(content, reactElementId[countryGroupId]);
