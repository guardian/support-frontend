// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import Page from 'components/page/page';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import GridPicture from 'components/gridPicture/gridPicture';
import ProductPageContentBlock from 'components/productPage/productPageContentBlock/productPageContentBlock';
import ProductPageTextBlock, { largeParagraphClassName } from 'components/productPage/productPageTextBlock/productPageTextBlock';
import ProductPagehero from 'components/productPage/productPageHero/productPageHero';

import { getQueryParameter } from 'helpers/url';
import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { type PaperDeliveryMethod } from 'helpers/subscriptions';


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


// ----- Initial selection? ----- //

const promoInUrl = getQueryParameter('promo');

// ----- Redux Store ----- //

const store = pageInit(reducer(method, promoInUrl), true);


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<SimpleHeader />}
      footer={<Footer />}
    >
      <ProductPagehero
        overheading="The Guardian newspaper subscriptions"
        heading="Save up to 31% on The Guardian and The Observer - all year round"
        type="feature"
        modifierClasses={['paper']}
      >
        <GridPicture
          sources={[
            {
              gridId: 'paperLandingHeroMobile',
              srcSizes: [500, 922],
              imgType: 'png',
              sizes: '100vw',
              media: '(max-width: 739px)',
            },
            {
              gridId: 'paperLandingHero',
              srcSizes: [1000, 2000],
              imgType: 'png',
              sizes: '(min-width: 1000px) 2000px, 1000px',
              media: '(min-width: 740px)',
            },
          ]}
          fallback="paperLandingHero"
          fallbackSize={1000}
          altText=""
          fallbackImgType="png"
        />
      </ProductPagehero>
      <ProductPageContentBlock needsHigherZindex>
        <ProductPageTextBlock>
          <p className={largeParagraphClassName}>
          We offer two different subscription types: voucher booklets and home delivery.
          </p>
        </ProductPageTextBlock>
        <Tabs />
      </ProductPageContentBlock>
      <Content />
    </Page>
  </Provider>
);

renderPage(content, reactElementId[method]);

