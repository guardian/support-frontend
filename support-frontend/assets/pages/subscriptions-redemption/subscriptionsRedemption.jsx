// @flow

import React from 'react';
import { Provider } from 'react-redux';

import { renderPage } from 'helpers/render';
import { init as pageInit } from 'helpers/page/page';

import Page from 'components/page/page';
import Footer from 'components/footer/footer';
import CustomerService from 'components/customerService/customerService';
import SubscriptionTermsPrivacy from 'components/legal/subscriptionTermsPrivacy/subscriptionTermsPrivacy';
import SubscriptionFaq from 'components/subscriptionFaq/subscriptionFaq';
import 'stylesheets/skeleton/skeleton.scss';
import CheckoutStage from 'components/subscriptionCheckouts/stage';

import ConsentBanner from '../../components/consentBanner/consentBanner';
import HeaderWrapper from 'components/subscriptionCheckouts/headerWrapper';
import reducer from './subscriptionsRedemptionReducer';

// ----- Redux Store ----- //
const store = pageInit(() => reducer(), true);

const { countryGroupId } = store.getState().common.internationalisation;

// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<HeaderWrapper />}
      footer={
        <Footer>
          <SubscriptionTermsPrivacy subscriptionProduct="DigitalPack" />
          <CustomerService
            selectedCountryGroup={countryGroupId}
            subscriptionProduct="DigitalPack"
            paperFulfilmentOptions={null}
          />
          <SubscriptionFaq subscriptionProduct="DigitalPack" />
        </Footer>}
    >
      <CheckoutStage
        checkoutForm={null}
        thankYouContentPending={null}
        thankYouContent={null}
        subscriptionProduct="DigitalPack"
      />
      <ConsentBanner />
    </Page>
  </Provider>
);

renderPage(content, 'subscriptions-redemption-page');
