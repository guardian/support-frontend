
// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import { renderPage } from 'helpers/render';
import { init as pageInit } from 'helpers/page/page';

import Page from 'components/page/page';
import Header from 'components/headers/header/header';
import Footer from 'components/footer/footer';
import CustomerService from 'components/customerService/customerService';
import SubscriptionTermsPrivacy from 'components/legal/subscriptionTermsPrivacy/subscriptionTermsPrivacy';
import SubscriptionFaq from 'components/subscriptionFaq/subscriptionFaq';
import 'stylesheets/skeleton/skeleton.scss';

import ReturnSection from 'components/subscriptionCheckouts/thankYou/returnSection';
import ThankYouContent from './components/thankYou/thankYouContent';

import './digitalSubscriptionCheckout.scss';

// ----- Redux Store ----- //

const store = pageInit();

const { countryGroupId } = store.getState().common.internationalisation;

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
      <ThankYouContent countryGroupId={countryGroupId} />
      <ReturnSection subscriptionProduct="DigitalPack" />
    </Page>
  </Provider>
);

renderPage(content, 'digital-subscription-checkout-page');
