// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import Page from 'components/page/page';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import GridImage from 'components/gridImage/gridImage';
import SvgChevron from 'components/svgs/chevron';
import ProductPagehero from 'components/productPage/productPageHero/productPageHero';
import ProductPageContentBlock, { outsetClassName } from 'components/productPage/productPageContentBlock/productPageContentBlock';
import ProductPageTextBlock, { largeParagraphClassName } from 'components/productPage/productPageTextBlock/productPageTextBlock';
import ProductPageButton from 'components/productPage/productPageButton/productPageButton';
import ProductPageFeatures from 'components/productPage/productPageFeatures/productPageFeatures';

import Form from './components/form';
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

const store = pageInit(reducer, true);


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<SimpleHeader />}
      footer={<Footer />}
    >
      <ProductPagehero
        headline="Become a Guardian Paper subscriber"
        overheading="Guardian Paper subscriptions"
        heading="Get a clearer, global perspective on the issues that matter, in one newspaper."
        modifierClasses={['weekly']}
        cta={<ProductPageButton trackingOnClick={sendTrackingEventsOnClick('options_cta_click', 'Paper', null)} icon={<SvgChevron />} href="#subscribe">See Subscription options</ProductPageButton>}
      />
      <ProductPageContentBlock>
        <ProductPageTextBlock title="Open up your world view, Paper">
          <p className={largeParagraphClassName}>Inside the essential newspaper from
          The&nbsp;Guardian, you&#39;ll find expert opinion, insight and culture, curated to
          bring you a progressive, international perspective. You&#39;ll also discover
          challenging new puzzles every week. Subscribe today and get free delivery, worldwide.
          </p>
        </ProductPageTextBlock>
      </ProductPageContentBlock>
      <ProductPageContentBlock>
        <ProductPageTextBlock title="As a subscriber you’ll enjoy" />
        <div className={outsetClassName}>
          <ProductPageFeatures features={[
            { title: 'Up to 35% off the retail cover price' },
            { title: 'Free international shipping' },
            { title: 'A paper email newsletter from the editor' },
            { title: 'Access to every edition on any device, through PressReader' },
          ]}
          />
        </div>
      </ProductPageContentBlock>
      <ProductPageContentBlock type="feature" id="subscribe">
        <ProductPageTextBlock title="Subscribe to Guardian Paper today">
          <p>Choose how you’d like to pay</p>
        </ProductPageTextBlock>
        <Form />
      </ProductPageContentBlock>
      <ProductPageContentBlock>
        <ProductPageTextBlock title="Gift subscriptions">
          <p className={largeParagraphClassName}>A Guardian Paper subscription
          makes a great gift. To&nbsp;buy&nbsp;one, just get in touch with your local customer
          service team:
          </p>
        </ProductPageTextBlock>
        <div className={outsetClassName}>
          <ProductPageFeatures features={[
            { title: 'UK, Europe and Rest of World', copy: '+44 (0) 330 333 6767' },
            { title: 'Australia and New Zealand', copy: '+61 2 8076 8599' },
            { title: 'USA and Canada', copy: '+1 917-900-4663' },
          ]}
          />
        </div>
      </ProductPageContentBlock>
      <ProductPageContentBlock>
        <ProductPageTextBlock title="Promotion terms and conditions">
          <p>Subscriptions available to people aged 18 and over with a valid email address. For full details of Guardian Paper print subscription services and their terms and conditions - see <a target="_blank" rel="noopener noreferrer" href="https://www.theguardian.com/guardian-weekly-subscription-terms-conditions">theguardian.com/guardian-weekly-subscription-terms-conditions</a>
          </p>
        </ProductPageTextBlock>
      </ProductPageContentBlock>
    </Page>
  </Provider>
);

renderPage(content, reactElementId[method]);

