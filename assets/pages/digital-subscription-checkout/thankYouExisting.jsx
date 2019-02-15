
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

import HeadingBlock from 'components/headingBlock/headingBlock';
import { HeroWrapper } from 'components/productPage/productPageHero/productPageHero';

import ReturnSection from './components/returnSection';
import ThankYouExistingContent from './components/thankYouExistingContent';
import ThankYouContent from './components/thankYou/hero';

import './digitalSubscriptionCheckout.scss';

// ----- Redux Store ----- //

const store = pageInit();

const { countryGroupId } = store.getState().common.internationalisation;

// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<Header displayNavigation={false} />}
      footer={
        <Footer>
          <SubscriptionTermsPrivacy subscriptionProduct="DigitalPack" />
          <CustomerService selectedCountryGroup={countryGroupId} />
          <SubscriptionFaq subscriptionProduct="DigitalPack" />
        </Footer>}
    >
      <div className="thank-you-stage">
        <HeroWrapper appearance="custom">
          <ThankYouContent countryGroupId={countryGroupId} />
          <HeadingBlock>
            Your Digital Pack subscription is already live
          </HeadingBlock>
        </HeroWrapper>
        <ThankYouExistingContent countryGroupId={countryGroupId} />
        <ReturnSection />
      </div>
    </Page>
  </Provider>
);

renderPage(content, 'digital-subscription-checkout-page');
