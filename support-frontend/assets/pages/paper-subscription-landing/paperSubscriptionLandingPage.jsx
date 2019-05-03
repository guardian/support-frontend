// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import Page from 'components/page/page';
import Header from 'components/headers/header/header';
import Footer from 'components/footer/footer';
import Content from 'components/content/content';
import Text, { LargeParagraph } from 'components/text/text';


import { detect, countryGroups, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { flashSaleIsActive, getSaleCopy } from 'helpers/flashSale';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';
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

// ----- Internationalisation ----- //

const countryGroupId: CountryGroupId = detect();
const { supportInternationalisationId } = countryGroups[countryGroupId];
const subsCountry = (['us', 'au'].includes(supportInternationalisationId) ? supportInternationalisationId : 'gb').toUpperCase();


// ----- Redux Store ----- //

const store = pageInit(() => reducer(fulfilment), true);


// ----- Render ----- //

function getStandfirst(): string {
  const defaultWording = 'We offer two different subscription types: voucher booklets and home delivery.';
  if (flashSaleIsActive('Paper', GBPCountries)) {
    const saleCopy = getSaleCopy('Paper', GBPCountries);
    return saleCopy.landingPage.standfirst || defaultWording;
  }

  return defaultWording;
}

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
              {getStandfirst()}
            </LargeParagraph>
          </Text>
          <Tabs />
        </Content>
      }
      <TabsContent />
      {flashSaleIsActive('Paper', GBPCountries) &&
        <Content>
          <Text title="Promotion terms and conditions">
            <p>Offer subject to availability. Guardian News and Media Limited (&ldquo;GNM&rdquo;) reserves the right to withdraw this promotion at any time. For full promotion terms and conditions, see <a target="_blank" rel="noopener noreferrer" href={`https://subscribe.theguardian.com/p/GCB80X/terms?country=${subsCountry}`}>here</a>.
            </p>
          </Text>
        </Content>
      }
      <ConsentBanner />
    </Page>
  </Provider>
);

renderPage(content, reactElementId);

export { content };
