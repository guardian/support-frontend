// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import Page from 'components/page/page';
import Header from 'components/headers/header/header';
import Footer from 'components/footerCompliant/Footer';
import Content from 'components/content/content';
import Text, { LargeParagraph } from 'components/text/text';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import 'stylesheets/skeleton/skeleton.scss';

import CampaignHeader from 'pages/paper-subscription-landing/components/hero/campaignHeader';
import Tabs from './components/tabs';
import TabsContent from './components/content/content';
import reducer from './paperSubscriptionLandingPageReducer';

import './paperSubscriptionLandingPage.scss';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { Collection, HomeDelivery } from 'helpers/productPrice/fulfilmentOptions';
import { paperHasDeliveryEnabled } from 'helpers/subscriptions';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';

// ----- Collection or delivery ----- //

const fulfilment: PaperFulfilmentOptions = window.location.pathname.includes('delivery') ? HomeDelivery : Collection;

const reactElementId = 'paper-subscription-landing-page';

// ----- Redux Store ----- //

const store = pageInit(() => reducer(fulfilment), true);
const state = store.getState();
const { useDigitalVoucher } = state.common.settings;

const paperSubsFooter = (
  <Footer
    faqsLink="https://www.theguardian.com/subscriber-direct/subscription-frequently-asked-questions"
    termsConditionsLink="https://www.theguardian.com/subscriber-direct/subscription-terms-and-conditions"
  />);

// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<Header countryGroupId={GBPCountries} />}
      footer={paperSubsFooter}
    >
      <CampaignHeader />
      {paperHasDeliveryEnabled() &&
        <Content needsHigherZindex innerBackground="grey">
          <Text>
            <LargeParagraph>
              {!useDigitalVoucher
              ? 'We offer two different subscription types: voucher booklets and home delivery'
              : 'We offer two different subscription types: subscription cards and home delivery. Pick the most convenient option available in your area.'}
            </LargeParagraph>
          </Text>
          <Tabs />
        </Content>
      }
      <TabsContent />
    </Page>
  </Provider>
);

renderPage(content, reactElementId);

export { content };
