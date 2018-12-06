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

const method: PaperDeliveryMethod = window.location.pathname.includes('collection') ? 'collection' : 'delivery';

const reactElementId: {
  [PaperDeliveryMethod]: string,
} = {
  collection: 'paper-subscription-landing-page-collection',
  delivery: 'paper-subscription-landing-page-delivery',
};


// ----- Prices ----- //

const { dataset } = document.querySelector(`#${reactElementId[method]}`) || { dataset: {} };
const promoInUrl = getQueryParameter('promo');

// ----- Redux Store ----- //

const store = pageInit(reducer(method, dataset, promoInUrl), true);


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<SimpleHeader />}
      footer={<Footer />}
    >
      <ProductPagehero
        overheading="The Guardian paper subscriptions"
        heading="Save up to 31% on The Guardian and The Observer’s newspaper retail price all year round"
        type="feature"
        modifierClasses={['paper']}
      >
        <GridPicture
          sources={[
            {
              gridId: 'paperLandingHeroMobile',
              srcSizes: [500, 924],
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
      <ProductPageContentBlock>
        <ProductPageTextBlock>
          <p className={largeParagraphClassName}>Pick between voucher and home delivery.
          If you live within London some more info about the two options at a glance There’s
           one for each newspaper in the package you choose.
          </p>
        </ProductPageTextBlock>
        <Tabs />
      </ProductPageContentBlock>
      <Content />
    </Page>
  </Provider>
);

renderPage(content, reactElementId[method]);

