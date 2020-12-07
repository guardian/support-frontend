// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import Page from 'components/page/page';
import Header from 'components/headers/header/header';
import Footer from 'components/footerCompliant/Footer';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import CentredContainer from 'components/containers/centredContainer';
import Block from 'components/page/block';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import 'stylesheets/skeleton/skeleton.scss';
import './paperSubscriptionLanding.scss';

// import CampaignHeader from 'pages/paper-subscription-landing/components/hero/campaignHeader';
import PaperHero from './components/hero/hero';
import Tabs from './components/tabs';
import Prices from './components/content/form';
// import TabsContent from './components/content/content';
import reducer from './paperSubscriptionLandingPageReducer';

import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { Collection, HomeDelivery } from 'helpers/productPrice/fulfilmentOptions';
// import { paperHasDeliveryEnabled } from 'helpers/subscriptions';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';

import { pricesSection } from '../weekly-subscription-landing/weeklySubscriptionLandingStyles';

// ----- Collection or delivery ----- //

const fulfilment: PaperFulfilmentOptions = window.location.pathname.includes('delivery') ? HomeDelivery : Collection;

const reactElementId = 'paper-subscription-landing-page';

// ----- Redux Store ----- //

const store = pageInit(() => reducer(fulfilment), true);

const { productPrices } = store.getState().page;

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
      <PaperHero productPrices={productPrices} />
      <FullWidthContainer>
        <CentredContainer>
          <Block>
            <Tabs />
            {/* <TabsContent /> */}
          </Block>
        </CentredContainer>
      </FullWidthContainer>
      <FullWidthContainer cssOverrides={pricesSection}>
        <CentredContainer>
          <Prices />
        </CentredContainer>
      </FullWidthContainer>
    </Page>
  </Provider>
);

renderPage(content, reactElementId);

export { content };
