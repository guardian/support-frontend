// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

// React components
import Footer from 'components/footer/footer';
import CirclesIntroduction from 'components/circlesIntroduction/circlesIntroduction';
import WhySupport from 'components/whySupport/whySupport';
import ReadyToSupport from 'components/readyToSupport/readyToSupport';

// React components connected to redux store
import CountrySwitcherHeaderContainer from 'components/headers/countrySwitcherHeader/countrySwitcherHeaderContainer';
import ThreeSubscriptionsContainer from 'components/threeSubscriptions/threeSubscriptionsContainer';
import PatronsEventsContainer from 'components/patronsEvents/patronsEventsContainer';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';

import pageReducer from './subscriptionsLandingReducer';


// ----- Setup ----- //

const supporterSectionId = 'supporter-options';


// ----- Redux Store ----- //

/* eslint-disable no-underscore-dangle */
const store = pageInit(
  pageReducer,
  null,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
/* eslint-enable */


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div>
      <CountrySwitcherHeaderContainer />
      <CirclesIntroduction
        headings={['Help us deliver', 'the independent', 'journalism the', 'world needs']}
        highlights={['Support', 'The Guardian']}
      />
      <section id={supporterSectionId}>
        <ThreeSubscriptionsContainer />
      </section>
      <WhySupport />
      <ReadyToSupport ctaUrl={`#${supporterSectionId}`} />
      <PatronsEventsContainer />
      <Footer disclaimer privacyPolicy />
    </div>
  </Provider>
);

renderPage(content, 'subscriptions-landing-page');
