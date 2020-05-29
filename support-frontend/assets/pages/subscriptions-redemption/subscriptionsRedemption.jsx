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
import CheckoutStage from './components/stage';

import ConsentBanner from '../../components/consentBanner/consentBanner';
import reducer from './subscriptionsRedemptionReducer';
import RedemptionForm from 'pages/subscriptions-redemption/components/redemptionForm';
import Header from 'components/headers/header/header';

// ----- Redux Store ----- //
const store = pageInit(reducer, true);

const state = store.getState();
const { countryGroupId } = state.common.internationalisation;

// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<Header display="guardianLogo" countryGroupId="GBPCountries" />}
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
        checkoutForm={<RedemptionForm />}
        thankYouContentPending={null}
        thankYouContent={null}
      />
      <ConsentBanner />
    </Page>
  </Provider>
);

renderPage(content, 'subscriptions-redemption-page');
