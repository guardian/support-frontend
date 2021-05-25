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
import { renderPage } from 'helpers/rendering/render';
import { tabsTabletSpacing } from './paperSubscriptionLandingStyles';
import 'stylesheets/skeleton/skeleton.scss';
import './paperSubscriptionLanding.scss';
import { getPromotionCopy } from 'helpers/productPrice/promotions';

import PaperHero from './components/hero/hero';
import Tabs from './components/tabs';
import Prices from './components/paperPrices';
import reducer from './paperSubscriptionLandingPageReducer';

import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { Collection, HomeDelivery } from 'helpers/productPrice/fulfilmentOptions';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';

// ----- Collection or delivery ----- //

const fulfilment: PaperFulfilmentOptions = window.location.pathname.includes('delivery') ? HomeDelivery : Collection;

const reactElementId = 'paper-subscription-landing-page';

// ----- Redux Store ----- //

const store = pageInit(() => reducer(fulfilment), true);

const { productPrices, promotionCopy } = store.getState().page;
const sanitisedPromoCopy = getPromotionCopy(promotionCopy);

const paperSubsFooter = (
  <Footer
    faqsLink="https://www.theguardian.com/subscriber-direct/subscription-frequently-asked-questions"
    termsConditionsLink="https://www.theguardian.com/subscriber-direct/subscription-terms-and-conditions"
  />);

// ----- Render ----- //

// ID for Selenium tests
const pageQaId = 'qa-paper-subscriptions';

const content = (
  <Provider store={store}>
    <Page
      id={pageQaId}
      header={<Header countryGroupId={GBPCountries} />}
      footer={paperSubsFooter}
    >
      <PaperHero productPrices={productPrices} promotionCopy={sanitisedPromoCopy} />
      <FullWidthContainer>
        <CentredContainer>
          <Block>
            <div css={tabsTabletSpacing}>
              <Tabs />
            </div>
          </Block>
        </CentredContainer>
      </FullWidthContainer>
      <FullWidthContainer theme="dark" hasOverlap>
        <CentredContainer>
          <Prices />
        </CentredContainer>
      </FullWidthContainer>
    </Page>
  </Provider>
);

renderPage(content, reactElementId);

export { content };
