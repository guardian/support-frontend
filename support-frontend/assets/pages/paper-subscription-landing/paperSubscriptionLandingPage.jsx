// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import Page from 'components/page/page';
import Header from 'components/headers/header/header';
import Footer from 'components/footer/footer';
import Content from 'components/content/content';
import Text, { LargeParagraph } from 'components/text/text';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import 'stylesheets/skeleton/skeleton.scss';

import { CampaignHeader } from './components/hero/hero';
import Tabs from './components/tabs';
import TabsContent from './components/content/content';
import reducer from './paperSubscriptionLandingPageReducer';

import './paperSubscriptionLandingPage.scss';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { Collection, HomeDelivery } from 'helpers/productPrice/fulfilmentOptions';
import { paperHasDeliveryEnabled } from 'helpers/subscriptions';
import ConsentBanner from 'components/consentBanner/consentBanner';

// ----- Collection or delivery ----- //

const fulfilment: PaperFulfilmentOptions = window.location.pathname.includes('delivery') ? HomeDelivery : Collection;

const reactElementId = 'paper-subscription-landing-page';

// ----- Redux Store ----- //

const store = pageInit(() => reducer(fulfilment), true);


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<Header />}
      footer={<Footer />}
    >
      <CampaignHeader />
      {paperHasDeliveryEnabled() &&
        <Content needsHigherZindex>
          <Text>
            <LargeParagraph>
              We offer two different subscription types: voucher booklets and home delivery.
            </LargeParagraph>
          </Text>
          <Tabs />
        </Content>
      }
      <TabsContent />
      <ConsentBanner />
    </Page>
  </Provider>
);

renderPage(content, reactElementId);

export { content };
