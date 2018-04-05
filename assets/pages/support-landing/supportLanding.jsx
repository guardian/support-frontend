// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import CirclesIntroduction from 'components/circlesIntroduction/circlesIntroduction';
import Contribute from 'components/contribute/contribute';
import WhySupport from 'components/whySupport/whySupport';
import ReadyToSupport from 'components/readyToSupport/readyToSupport';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';

import pageReducer from './supportLandingReducer';
import ContributionSelectionContainer from './components/contributionSelectionContainer';
import ContributionPaymentCtasContainer from './components/contributionPaymentCtasContainer';
import PayPalContributionButtonContainer from './components/payPalContributionButtonContainer';
import ThreeSubscriptionsContainer from './components/threeSubscriptionsContainer';
import PatronsEventsContainer from './components/patronsEventsContainer';


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
      <SimpleHeader />
      <CirclesIntroduction
        headings={['Help us deliver', 'the independent', 'journalism the', 'world needs']}
        highlights={['Support', 'The Guardian']}
      />
      <section id={supporterSectionId}>
        <Contribute
          copy="Your contribution funds and supports The Guardian's journalism."
        >
          <ContributionSelectionContainer />
          <ContributionPaymentCtasContainer
            PayPalButton={PayPalContributionButtonContainer}
          />
        </Contribute>
        <ThreeSubscriptionsContainer />
      </section>
      <WhySupport />
      <ReadyToSupport ctaUrl={`#${supporterSectionId}`} />
      <PatronsEventsContainer />
      <Footer disclaimer privacyPolicy />
    </div>
  </Provider>
);

renderPage(content, 'support-landing-page');
