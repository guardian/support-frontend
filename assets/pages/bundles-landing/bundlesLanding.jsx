// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';

import { defaultAmountsUK } from 'helpers/abTests/amountsTest';
import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';

import Introduction from './components/Introduction';
import Bundles from './components/Bundles';
import ContributionsBundle from './components/ContributionsBundle';
import BundlesGBStructureTest from './components/bundlesGBStructureTest';
import WhySupport from './components/WhySupport';
import WaysOfSupport from './components/WaysOfSupport';
import reducer from './bundlesLandingReducers';

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

const structureTestVariant = store.getState().common.abParticipations.gbStructureTest;

const url: URL = new URL(window.location.href);
const bundle: ?string = url.searchParams.get('bundle');

let bundlesSelected;
let showContributeOrSubscribe = false;

if (bundle === 'contribute') {
  bundlesSelected = <ContributionsBundle />;
} else if (bundle === 'subscribe') {
  bundlesSelected = <Bundles products={['PAPER_SUBSCRIPTION', 'DIGITAL_SUBSCRIPTION']} />;
} else if (bundle === 'contribute-and-digipack') {
  bundlesSelected = <Bundles products={['CONTRIBUTE', 'DIGITAL_SUBSCRIPTION']} />;
  showContributeOrSubscribe = true;
} else {
  bundlesSelected = structureTestVariant === 'contributeOnTop'
    ? <BundlesGBStructureTest />
    : <Bundles products={['CONTRIBUTE', 'PAPER_SUBSCRIPTION', 'DIGITAL_SUBSCRIPTION']} />;

  showContributeOrSubscribe = true;
}

const content = (
  <Provider store={store}>
    <div>
      <SimpleHeader />
      <Introduction showContributeOrSubscribe={showContributeOrSubscribe} />
      {bundlesSelected}
      <WhySupport />
      <WaysOfSupport />
      <Footer privacyPolicy disclaimer />
    </div>
  </Provider>
);

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
