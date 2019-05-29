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
import CheckoutStage from './stage';
import './_legacyImports.scss';
import ConsentBanner from '../../components/consentBanner/consentBanner';
import { getFulfilmentOption, getProductOption, getStartDate } from 'pages/paper-subscription-checkout/helpers/options';
import { createWithDeliveryCheckoutReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import type { CommonState } from 'helpers/page/commonReducer';
import { Monthly } from 'helpers/billingPeriods';
import { Paper } from 'helpers/subscriptions';

// ----- Redux Store ----- //

const fulfilmentOption = getFulfilmentOption();
const productOption = getProductOption();
const startDate = getStartDate(fulfilmentOption, productOption);
const reducer = (commonState: CommonState) => createWithDeliveryCheckoutReducer(
  commonState.internationalisation.countryId,
  Paper,
  Monthly,
  startDate,
  productOption,
  fulfilmentOption,
);


const store = pageInit(
  reducer,
  true,
);

const { countryGroupId } = store.getState().common.internationalisation;
const { stage } = store.getState().page.checkout;

// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<Header display={stage === 'checkout' ? 'checkout' : 'guardianLogo'} />}
      footer={
        <Footer>
          <SubscriptionTermsPrivacy subscriptionProduct="Paper" />
          <CustomerService
            selectedCountryGroup={countryGroupId}
            subscriptionProduct="Paper"
            paperFulfilmentOptions={fulfilmentOption}
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
