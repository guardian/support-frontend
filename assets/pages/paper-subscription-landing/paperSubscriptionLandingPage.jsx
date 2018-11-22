// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import Page from 'components/page/page';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';

import ProductPagehero from 'components/productPage/productPageHero/productPageHero';
import ProductPageContentBlock from 'components/productPage/productPageContentBlock/productPageContentBlock';
import ProductPageTextBlock, { largeParagraphClassName } from 'components/productPage/productPageTextBlock/productPageTextBlock';

import Tabs from './components/tabs';
import Content from './components/content';
import reducer from './paperSubscriptionLandingPageReducer';

import './paperSubscriptionLandingPage.scss';


// ----- Collection or delivery ----- //

type Method = 'collection' | 'delivery';

const method: Method = window.location.pathname.includes('collection') ? 'collection' : 'delivery';

const reactElementId: {
  [Method]: string,
} = {
  collection: 'paper-subscription-landing-page-collection',
  delivery: 'paper-subscription-landing-page-delivery',
};


// ----- Redux Store ----- //

const store = pageInit(reducer(), true);


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<SimpleHeader />}
      footer={<Footer />}
    >
      <ProductPagehero
        overheading="The Guardian paper subscriptions"
        heading="Save up to 31% on the Guardian and the Observer’s newspaper retail price all year round"
        type="feature"
        modifierClasses={['paper']}
      />
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

