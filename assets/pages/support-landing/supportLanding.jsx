// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import CirclesIntroduction from 'components/circlesIntroduction/circlesIntroduction';
import ThreeSubscriptions from 'components/threeSubscriptions/threeSubscriptions';
import WhySupport from 'components/whySupport/whySupport';
import ReadyToSupport from 'components/readyToSupport/readyToSupport';
import PatronsEvents from 'components/patronsEvents/patronsEvents';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';


// ----- Redux Store ----- //

const store = pageInit({});


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div>
      <SimpleHeader />
      <CirclesIntroduction />
      <ThreeSubscriptions />
      <WhySupport />
      <ReadyToSupport ctaUrl="#" />
      <PatronsEvents />
      <Footer />
    </div>
  </Provider>
);

renderPage(content, 'support-landing-page');
