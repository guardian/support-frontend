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

import pageReducer from './supportLandingReducer';
import ContributionSelectionContainer from './components/contributionSelectionContainer';
import ContributionPaymentCtasContainer from './components/contributionPaymentCtasContainer';
import PayPalContributionButtonContainer from './components/payPalContributionButtonContainer';
import PatronsEventsContainer from './components/patronsEventsContainer';


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
      <Contribute>
        <ContributionSelectionContainer />
        <ContributionPaymentCtasContainer
          PayPalButton={PayPalContributionButtonContainer}
        />
      </Contribute>
      <ThreeSubscriptions />
      <WhySupport />
      <ReadyToSupport ctaUrl="#" />
      <PatronsEventsContainer />
      <Footer disclaimer privacyPolicy />
    </div>
  </Provider>
);

renderPage(content, 'support-landing-page');
