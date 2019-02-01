// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import { renderPage } from 'helpers/render';
import { detect as detectCountry, type IsoCountry } from 'helpers/internationalisation/country';
import { detect as detectCountryGroup, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { init as pageInit } from 'helpers/page/page';

import Page from 'components/page/page';
import Header from 'components/headers/header/header';
import Footer from 'components/footer/footer';
import CustomerService from 'components/customerService/customerService';
import SubscriptionTermsPrivacy from 'components/legal/subscriptionTermsPrivacy/subscriptionTermsPrivacy';
import SubscriptionFaq from 'components/subscriptionFaq/subscriptionFaq';

import { initReducer } from './digitalSubscriptionCheckoutReducer';
import CheckoutStage from './components/checkoutStage';
import './digitalSubscriptionCheckout.scss';

// ----- Internationalisation ----- //

const countryGroupId: CountryGroupId = detectCountryGroup();
const country: IsoCountry = detectCountry(countryGroupId);

const reactElementId: {
  [CountryGroupId]: string,
} = {
  GBPCountries: 'digital-subscription-checkout-page-uk',
  UnitedStates: 'digital-subscription-checkout-page-us',
  AUDCountries: 'digital-subscription-checkout-page-au',
  International: 'digital-subscription-checkout-page-int',
};

// ----- Redux Store ----- //

const store = pageInit(initReducer(country, countryGroupId), true);

// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<Header />}
      footer={
        <Footer>
          <SubscriptionTermsPrivacy subscriptionProduct="DigitalPack" />
          <CustomerService selectedCountryGroup={countryGroupId} />
          <SubscriptionFaq subscriptionProduct="DigitalPack" />
        </Footer>}
    >
      <CheckoutStage />
    </Page>
  </Provider>
);

renderPage(content, reactElementId[countryGroupId]);
