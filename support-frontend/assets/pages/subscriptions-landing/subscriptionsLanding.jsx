// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import Page from 'components/page/page';
import FooterContainer from 'components/footer/footerContainer';
import Header from 'components/headers/header/header';
import SubscriptionsByCountryGroup from 'components/subscriptionsByCountryGroup/subscriptionsByCountryGroup';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import FeaturedProductAb from './components/featuredProductAb';

// ----- Redux Store ----- //

const store = pageInit();


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<Header />}
      footer={<FooterContainer disclaimer privacyPolicy />}
    >
      <FeaturedProductAb
        headingSize={3}
      />
      <SubscriptionsByCountryGroup headingSize={3} appMedium="subscribe_landing_page" />
    </Page>
  </Provider>
);

renderPage(content, 'subscriptions-landing-page');
