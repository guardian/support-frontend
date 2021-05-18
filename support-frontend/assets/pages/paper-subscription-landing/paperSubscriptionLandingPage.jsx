// @flow

// ----- Imports ----- //

// $FlowIgnore
import React, { useState, useEffect } from 'react';

import Page from 'components/page/page';
import Header from 'components/headers/header/header';
import Footer from 'components/footerCompliant/Footer';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import CentredContainer from 'components/containers/centredContainer';
import Block from 'components/page/block';

import { renderPage } from 'helpers/render';
import { tabsTabletSpacing } from './paperSubscriptionLandingStyles';
import 'stylesheets/skeleton/skeleton.scss';
import './paperSubscriptionLanding.scss';
import { getPromotionCopy } from 'helpers/productPrice/promotions';

import PaperHero from './components/hero/hero';
import Tabs from './components/tabs';
import Prices from './components/paperPrices';

import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { paperSubsUrl } from 'helpers/routes';

import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { Collection, HomeDelivery } from 'helpers/productPrice/fulfilmentOptions';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';

import { productPrices, promotionCopy } from './paperSubscriptionLandingState';

// ----- Collection or delivery ----- //

const fulfilment: PaperFulfilmentOptions = window.location.pathname.includes('delivery') ? HomeDelivery : Collection;

const reactElementId = 'paper-subscription-landing-page';

// ----- Redux Store ----- //

const sanitisedPromoCopy = getPromotionCopy(promotionCopy);

const paperSubsFooter = (
  <Footer
    faqsLink="https://www.theguardian.com/subscriber-direct/subscription-frequently-asked-questions"
    termsConditionsLink="https://www.theguardian.com/subscriber-direct/subscription-terms-and-conditions"
  />);

// ----- Render ----- //

// ID for Selenium tests
const pageQaId = 'qa-paper-subscriptions';

const PaperLandingPage = () => {
  const [selectedTab, setSelectedTab] = useState<PaperFulfilmentOptions>(fulfilment);

  if (!productPrices) {
    return null;
  }

  useEffect(() => {
    sendTrackingEventsOnClick({
      id: `Paper_${selectedTab}-tab`, // eg. Paper_Collection-tab or Paper_HomeDelivery-tab
      product: 'Paper',
      componentType: 'ACQUISITIONS_BUTTON',
    })();
    window.history.replaceState({}, null, paperSubsUrl(selectedTab === HomeDelivery));
  }, [selectedTab]);

  return (
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
              <Tabs selectedTab={selectedTab} setTabAction={setSelectedTab} />
            </div>
          </Block>
        </CentredContainer>
      </FullWidthContainer>
      <FullWidthContainer theme="dark" hasOverlap>
        <CentredContainer>
          <Prices productPrices={productPrices} tab={selectedTab} setTabAction={setSelectedTab} />
        </CentredContainer>
      </FullWidthContainer>
    </Page>
  );
};

renderPage(<PaperLandingPage />, reactElementId);

export { PaperLandingPage as content };
