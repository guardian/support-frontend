// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import { renderPage } from 'helpers/render';
import { init as pageInit } from 'helpers/page/page';
import { getQueryParameter } from 'helpers/url';

import Page from 'components/page/page';
import Header from 'components/headers/header/header';
import Footer from 'components/footer/footer';
import CustomerService from 'components/customerService/customerService';
import SubscriptionTermsPrivacy from 'components/legal/subscriptionTermsPrivacy/subscriptionTermsPrivacy';
import SubscriptionFaq from 'components/subscriptionFaq/subscriptionFaq';
import 'stylesheets/skeleton/skeleton.scss';

import { initReducer } from './paperSubscriptionCheckoutReducer';
import CheckoutStage from './stage';
import { type PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import './_legacyImports.scss';
import ConsentBanner from '../../components/consentBanner/consentBanner';


// ----- Redux Store ----- //

const fulfilmentOption = getQueryParameter('fulfilment');
const productOption = getQueryParameter('product');

const store = pageInit(
  commonState => initReducer(commonState.internationalisation.countryId, productOption, fulfilmentOption),
  true,
);

const { countryGroupId } = store.getState().common.internationalisation;

const paperFulfilmentOption: PaperFulfilmentOptions = fulfilmentOption === 'HomeDelivery' ? 'HomeDelivery' : 'Collection';

// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<Header display="checkout" />}
      footer={
        <Footer>
          <SubscriptionTermsPrivacy subscriptionProduct="Paper" />
          <CustomerService
            selectedCountryGroup={countryGroupId}
            subscriptionProduct="Paper"
            paperFulfilmentOptions={paperFulfilmentOption}
          />
          <SubscriptionFaq subscriptionProduct="Paper" />
        </Footer>
      }
    >
      <CheckoutStage />
      <ConsentBanner />
    </Page>
  </Provider>
);

renderPage(content, 'paper-subscription-checkout-page');
