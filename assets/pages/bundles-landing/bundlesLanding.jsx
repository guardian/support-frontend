// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import LinksFooter from 'components/footers/linksFooter/linksFooter';

import { defaultAmountsUK } from 'helpers/amountsTest';
import { getQueryParameter } from 'helpers/url';
import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';

import Introduction from './components/Introduction';
import Bundles from './components/Bundles';
import WhySupport from './components/WhySupport';
import WaysOfSupport from './components/WaysOfSupport';
import reducer from './bundlesLandingReducers';

// New Design Test
import supportLanding from './support-landing-ab-test/supportLanding';

// Amounts test
import { changeContribAmountMonthly } from './bundlesLandingActions';


// ----- Redux Store ----- //

/* eslint-disable no-underscore-dangle */
const store = pageInit(
  reducer,
  null,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
/* eslint-enable */

// ----- Render ----- //

let content = null;

// New Design Test: Replace with check for variant when test goes live.
if (getQueryParameter('newDesigns', 'false') === 'true') {
  content = supportLanding(store);
} else {
  content = (
    <Provider store={store}>
      <div>
        <SimpleHeader />
        <Introduction abTests={store.getState().common.abParticipations} />
        <Bundles />
        <WhySupport />
        <WaysOfSupport />
        <LinksFooter />
      </div>
    </Provider>
  );
}

(function initialiseAmountsTest() {
  try {
    const defaultSelectedAmount =
      defaultAmountsUK[store.getState().common.abParticipations.ukRecurringAmountsTest]
      || defaultAmountsUK.control;
    return store.dispatch(changeContribAmountMonthly({
      value: defaultSelectedAmount, userDefined: false,
    }));
  } catch (e) { return null; }
}());


renderPage(content, 'bundles-landing-page');
