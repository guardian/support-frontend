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
import { getQueryParameter } from 'helpers/url';
import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { type PaperDeliveryMethod } from 'helpers/subscriptions';
import { flashSaleIsActive, getSaleCopy } from 'helpers/flashSale';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';
import 'stylesheets/skeleton/skeleton.scss';

import { SaleHeader } from './components/hero/hero';
import Tabs from './components/tabs';
import TabsContent from './components/content/content';
import reducer from './paperSubscriptionLandingPageReducer';

import './paperSubscriptionLandingPage.scss';

// ----- Collection or delivery ----- //

const method: PaperDeliveryMethod = window.location.pathname.includes('delivery') ? 'delivery' : 'collection';

const reactElementId: {
  [PaperDeliveryMethod]: string,
} = {
  collection: 'paper-subscription-landing-page-collection',
  delivery: 'paper-subscription-landing-page-delivery',
};

// ----- Internationalisation ----- //

const countryGroupId: CountryGroupId = detect();
const { supportInternationalisationId } = countryGroups[countryGroupId];
const subsCountry = (['us', 'au'].includes(supportInternationalisationId) ? supportInternationalisationId : 'gb').toUpperCase();

// ----- Initial selection? ----- //

const promoInUrl = getQueryParameter('promo');

// ----- Redux Store ----- //

const store = pageInit(() => reducer(method, promoInUrl), true);


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
      <SaleHeader />

      <Content needsHigherZindex>
        <Text>
          <LargeParagraph>
            {getStandfirst()}
          </LargeParagraph>
        </Text>
        <Tabs />
      </Content>
      <TabsContent />
      {flashSaleIsActive('Paper', GBPCountries) &&
        <Content>
          <Text title="Promotion terms and conditions">
            <p>Offer subject to availability. Guardian News and Media Limited (&ldquo;GNM&rdquo;) reserves the right to withdraw this promotion at any time. For full promotion terms and conditions, see <a target="_blank" rel="noopener noreferrer" href={`https://subscribe.theguardian.com/p/GCB80X/terms?country=${subsCountry}`}>here</a>.
            </p>
          </Text>
        </Content>
      }
    </Page>
  </Provider>
);

renderPage(content, reactElementId[method]);

