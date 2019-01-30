// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import Page from 'components/page/page';
import Header from 'components/headers/header/header';
import Footer from 'components/footer/footer';
import ProductPageContentBlock from 'components/productPage/productPageContentBlock/productPageContentBlock';
import ProductPageTextBlock, { LargeParagraph } from 'components/productPage/productPageTextBlock/productPageTextBlock';


import { detect, countryGroups, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { getQueryParameter } from 'helpers/url';
import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { type PaperDeliveryMethod } from 'helpers/subscriptions';
import { flashSaleIsActive, getSaleCopy } from 'helpers/flashSale';

import { SaleHeader } from './components/hero';
import Tabs from './components/tabs';
import Content from './components/content';
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

const store = pageInit(reducer(method, promoInUrl), true);


// ----- Render ----- //

function getStandfirst(): string {
  const defaultWording = 'We offer two different subscription types: voucher booklets and home delivery.';
  if (flashSaleIsActive('Paper', 'GBPCountries')) {
    const saleCopy = getSaleCopy('Paper', 'GBPCountries');
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

      <ProductPageContentBlock needsHigherZindex>
        <ProductPageTextBlock>
          <LargeParagraph>
            {getStandfirst()}
          </LargeParagraph>
        </ProductPageTextBlock>
        <Tabs />
      </ProductPageContentBlock>
      <Content />
      {/* TODO the below needs to be conditonal based on sale */}
      <ProductPageContentBlock>
        <ProductPageTextBlock title="Promotion terms and conditions">
          <p>Offer subject to availability. Guardian News and Media Limited (&ldquo;GNM&rdquo;) reserves the right to withdraw this promotion at any time. For full 6 for 6 promotion terms and conditions, see <a target="_blank" rel="noopener noreferrer" href={`https://subscribe.theguardian.com/p/WWM99X/terms?country=${subsCountry}`}>here</a>.
          </p>
        </ProductPageTextBlock>
      </ProductPageContentBlock>
    </Page>
  </Provider>
);

renderPage(content, reactElementId[method]);

