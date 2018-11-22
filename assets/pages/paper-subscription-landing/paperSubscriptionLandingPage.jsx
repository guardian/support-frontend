// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import Page from 'components/page/page';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';

import SvgInfo from 'components/svgs/information';
import ProductPagehero from 'components/productPage/productPageHero/productPageHero';
import ProductPageContentBlock from 'components/productPage/productPageContentBlock/productPageContentBlock';
import ProductPageTextBlock, { largeParagraphClassName, sansParagraphClassName } from 'components/productPage/productPageTextBlock/productPageTextBlock';
import ProductPageTextBlockList from 'components/productPage/productPageTextBlock/productPageTextBlockList';

import Form from './components/form';
import Tabs from './components/tabs';
import reducer, { type PaperPrices } from './paperSubscriptionLandingPageReducer';

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


// ----- Prices ----- //
const { dataset } = document.querySelector(`#${reactElementId[method]}`) || { dataset: {} };
const prices: PaperPrices = {
  collectionEveryday: dataset['collection-2c92a0fd56fe270b0157040dd79b35da'] ? parseFloat(dataset['collection-2c92a0fd56fe270b0157040dd79b35da']) : null,
  collectionSixday: dataset['collection-2c92a0fd56fe270b0157040e42e536ef'] ? parseFloat(dataset['collection-2c92a0fd56fe270b0157040e42e536ef']) : null,
  collectionWeekend: dataset['collection-2c92a0ff56fe33f00157040f9a537f4b'] ? parseFloat(dataset['collection-2c92a0ff56fe33f00157040f9a537f4b']) : null,
  collectionSunday: dataset['collection-2c92a0fe5af9a6b9015b0fe1ecc0116c'] ? parseFloat(dataset['collection-2c92a0fe5af9a6b9015b0fe1ecc0116c']) : null,

  deliveryEveryday: dataset['delivery-2c92a0fd560d13880156136b72e50f0c'] ? parseFloat(dataset['delivery-2c92a0fd560d13880156136b72e50f0c']) : null,
  deliverySixday: dataset['delivery-2c92a0fd5614305c01561dc88f3275be'] ? parseFloat(dataset['delivery-2c92a0fd5614305c01561dc88f3275be']) : null,
  deliveryWeekend: dataset['delivery-2c92a0ff5af9b657015b0fea5b653f81'] ? parseFloat(dataset['delivery-2c92a0ff5af9b657015b0fea5b653f81']) : null,
  deliverySunda: dataset['delivery-2c92a0ff560d311b0156136f2afe5315'] ? parseFloat(dataset['delivery-2c92a0ff560d311b0156136f2afe5315']) : null,
};
// ----- Redux Store ----- //

const store = pageInit(reducer(prices), true);


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
      <ProductPageContentBlock>
        <ProductPageTextBlock title="How do vouchers work?">
          <ProductPageTextBlockList items={[
            `When you take out a voucher subscription, we’ll send you a book of vouchers.
               There’s one for each newspaper in the package you choose. So if you choose a
               Sixday package, for example, you’ll receive six vouchers for each week,
               delivered every quarter.
            `,
            `You can exchange these vouchers for that day’s newspaper at retailers
              across the UK. That includes most independent newsagents, a range of petrol
              stations, and most supermarkets, including Tesco, Sainsbury’s and
              Waitrose & Partners.
            `,
            `Your newsagent won’t lose out; we’ll pay them the same amount that
              they receive if you pay cash for your paper.
            `,
            'You’ll receive your vouchers within 14 days of subscribing.',
            `You can pause your subscription for up to four weeks a year. So if
              you’re heading away, you won’t have to pay for the papers you’ll miss.
            `]}
          />
        </ProductPageTextBlock>
      </ProductPageContentBlock>
      <ProductPageContentBlock type="feature">
        <ProductPageTextBlock title="Subscribe to Guardian Paper today">
          <p>Now pick your perfect voucher subscription package</p>
        </ProductPageTextBlock>
        <Form />
      </ProductPageContentBlock>
      <ProductPageContentBlock type="feature" >
        <ProductPageTextBlock title="FAQ and help" icon={<SvgInfo />}>
          <p className={sansParagraphClassName}>Lorem <a href="#top">Ipsum</a>
          </p>
        </ProductPageTextBlock>
      </ProductPageContentBlock>
    </Page>
  </Provider>
);

renderPage(content, reactElementId[method]);

