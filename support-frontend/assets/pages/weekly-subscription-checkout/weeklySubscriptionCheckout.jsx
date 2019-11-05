// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import { renderPage } from 'helpers/render';
import { init as pageInit } from 'helpers/page/page';

import Page from 'components/page/page';
import Footer from 'components/footer/footer';
import CustomerService from 'components/customerService/customerService';
import SubscriptionTermsPrivacy
  from 'components/legal/subscriptionTermsPrivacy/subscriptionTermsPrivacy';
import SubscriptionFaq from 'components/subscriptionFaq/subscriptionFaq';
import 'stylesheets/skeleton/skeleton.scss';
import CheckoutStage from 'components/subscriptionCheckouts/stage';
import ThankYouContent from './components/thankYou';
import WeeklyCheckoutForm from './components/weeklyCheckoutForm';
import WeeklyCheckoutFormGifting from './components/weeklyCheckoutFormGifting';
import ConsentBanner from '../../components/consentBanner/consentBanner';
import type { CommonState } from 'helpers/page/commonReducer';
import { createWithDeliveryCheckoutReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { GuardianWeekly } from 'helpers/subscriptions';
import type { WeeklyBillingPeriod } from 'helpers/billingPeriods';
import { Quarterly } from 'helpers/billingPeriods';
import { getQueryParameter } from 'helpers/url';
import { getWeeklyDays } from 'pages/weekly-subscription-checkout/helpers/deliveryDays';
import { Domestic } from 'helpers/productPrice/fulfilmentOptions';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import { formatMachineDate } from 'helpers/dateConversions';
import HeaderWrapper from 'components/subscriptionCheckouts/headerWrapper';

// ----- Redux Store ----- //
const billingPeriodInUrl = getQueryParameter('period');
const initialBillingPeriod: WeeklyBillingPeriod = billingPeriodInUrl === 'SixWeekly' || billingPeriodInUrl === 'Quarterly' || billingPeriodInUrl === 'Annual'
  ? billingPeriodInUrl
  : Quarterly;

const startDate = formatMachineDate(getWeeklyDays()[0]);
const reducer = (commonState: CommonState) => createWithDeliveryCheckoutReducer(
  commonState.internationalisation.countryId,
  GuardianWeekly,
  initialBillingPeriod,
  startDate,
  NoProductOptions,
  Domestic, // TODO: we need to work this out from the country
);

const store = pageInit(
  reducer,
  true,
);

const { countryGroupId } = store.getState().common.internationalisation;
const { orderIsAGift } = store.getState().page.checkout;

// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<HeaderWrapper />}
      footer={
        <Footer>
          <SubscriptionTermsPrivacy subscriptionProduct="GuardianWeekly" />
          <CustomerService
            selectedCountryGroup={countryGroupId}
            subscriptionProduct="GuardianWeekly"
          />
          <SubscriptionFaq subscriptionProduct="GuardianWeekly" />
        </Footer>
      }
    >
      <CheckoutStage
        checkoutForm={orderIsAGift ? <WeeklyCheckoutFormGifting /> : <WeeklyCheckoutForm />}
        thankYouContentPending={<ThankYouContent isPending />}
        thankYouContent={<ThankYouContent isPending={false} />}
        subscriptionProduct="GuardianWeekly"
      />
      <ConsentBanner />
    </Page>
  </Provider>
);

renderPage(content, 'weekly-subscription-checkout-page');
