// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import CirclesIntroduction from 'components/circlesIntroduction/circlesIntroduction';
import Contribute from 'components/contribute/contribute';
import ThreeSubscriptions from 'components/threeSubscriptions/threeSubscriptions';
import WhySupport from 'components/whySupport/whySupport';
import ReadyToSupport from 'components/readyToSupport/readyToSupport';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';

import type { CommonState } from 'helpers/page/page';

import PatronsEvents from './components/connectedPatronsEvents';


// ----- Types ----- //

export type State = {
  common: CommonState,
  page: {||},
};


// ----- Redux Store ----- //

const store = pageInit({});


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div>
      <SimpleHeader />
      <CirclesIntroduction />
      <Contribute />
      <ThreeSubscriptions />
      <WhySupport />
      <ReadyToSupport ctaUrl="#" />
      <PatronsEvents />
      <Footer />
    </div>
  </Provider>
);

renderPage(content, 'support-landing-page');
